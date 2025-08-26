/**
 * City Specialization & Geography Engine - Core Engine
 * 
 * Manages city development, economic specializations, infrastructure systems,
 * and geographic advantages for realistic urban simulation.
 */

import { 
  City, 
  CitySpecialization, 
  Infrastructure, 
  GeographicAdvantage, 
  NaturalResource,
  CityDevelopmentEvent,
  CityEngineConfig,
  DEFAULT_SPECIALIZATIONS,
  DEFAULT_GEOGRAPHIC_ADVANTAGES
} from './types.js';

export class CityEngine {
  private cities: Map<string, City> = new Map();
  private specializations: Map<string, CitySpecialization> = new Map();
  private geographicAdvantages: Map<string, GeographicAdvantage> = new Map();
  private developmentEvents: CityDevelopmentEvent[] = [];
  private config: CityEngineConfig;

  constructor(config?: Partial<CityEngineConfig>) {
    this.config = {
      basePopulationGrowthRate: 0.02, // 2% annual
      economicGrowthVolatility: 0.15,
      infrastructureDecayRate: 0.05,
      specializationDevelopmentRate: 0.1,
      geographicAdvantageStrength: 1.2,
      resourceDepletionRate: 0.01,
      climateImpactStrength: 1.1,
      tradeDistanceDecay: 0.1,
      competitionRadius: 100, // km
      cooperationIncentive: 1.15,
      infrastructureQoLWeight: 0.3,
      economicQoLWeight: 0.25,
      environmentalQoLWeight: 0.25,
      socialQoLWeight: 0.2,
      timeStep: 'month',
      simulationSpeed: 1.0,
      randomEventFrequency: 0.05,
      ...config
    };

    // Initialize default specializations and advantages
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    DEFAULT_SPECIALIZATIONS.forEach(spec => {
      this.specializations.set(spec.id, spec);
    });

    DEFAULT_GEOGRAPHIC_ADVANTAGES.forEach(advantage => {
      this.geographicAdvantages.set(advantage.id, advantage);
    });
  }

  /**
   * Create a new city with realistic initial parameters
   */
  createCity(params: {
    name: string;
    coordinates: { x: number; y: number };
    climate: City['climate'];
    terrain: City['terrain'];
    initialPopulation?: number;
    geographicAdvantages?: string[];
    naturalResources?: { [resourceId: string]: NaturalResource };
  }): City {
    const cityId = `city_${params.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    const city: City = {
      id: cityId,
      name: params.name,
      founded: new Date(),
      coordinates: params.coordinates,
      climate: params.climate,
      terrain: params.terrain,
      size: this.calculateInitialCitySize(params.initialPopulation || 25000),
      
      // Population & Economy
      population: params.initialPopulation || 25000,
      populationGrowthRate: this.config.basePopulationGrowthRate,
      economicOutput: (params.initialPopulation || 25000) * 35000, // $35k GDP per capita
      unemploymentRate: 0.06, // 6% initial unemployment
      averageIncome: 45000,
      costOfLiving: 100, // Base index of 100
      
      // Specialization & Development
      specializationProgress: 0,
      specializationHistory: [],
      
      // Infrastructure
      infrastructure: this.generateInitialInfrastructure(params.initialPopulation || 25000),
      infrastructureBudget: (params.initialPopulation || 25000) * 500, // $500 per capita
      
      // Geographic Advantages & Resources
      geographicAdvantages: params.geographicAdvantages || [],
      naturalResources: params.naturalResources || {},
      
      // Quality of Life
      qualityOfLife: 65, // Starting at moderate level
      attractiveness: 50, // Neutral attractiveness
      sustainability: 70, // Good initial sustainability
      
      // Inter-City Relationships
      tradePartners: [],
      
      // Government & Policy
      taxRate: 0.08, // 8% local tax rate
      governmentBudget: (params.initialPopulation || 25000) * 1200, // $1200 per capita
      governmentDebt: 0,
      policyModifiers: [],
      
      // Analytics & Tracking
      monthlyMetrics: [],
      
      // Metadata
      lastUpdated: new Date(),
      version: 1
    };

    // Apply geographic advantages
    this.applyGeographicAdvantages(city);
    
    // Calculate initial quality of life
    city.qualityOfLife = this.calculateQualityOfLife(city);
    
    this.cities.set(cityId, city);
    
    // Generate city image
    this.generateCityImage(city);
    
    // Log city creation event
    this.logDevelopmentEvent({
      cityId,
      type: 'population_milestone',
      description: `City of ${params.name} founded with ${city.population} residents`,
      impact: {
        populationImpact: city.population,
        economicImpact: city.economicOutput
      }
    });

    return city;
  }

  /**
   * Simulate city development for one time step
   */
  simulateTimeStep(cityId: string): City {
    const city = this.cities.get(cityId);
    if (!city) {
      throw new Error(`City ${cityId} not found`);
    }

    // Update population
    this.updatePopulation(city);
    
    // Update economy
    this.updateEconomy(city);
    
    // Update infrastructure
    this.updateInfrastructure(city);
    
    // Update specialization progress
    this.updateSpecializationProgress(city);
    
    // Update quality of life
    city.qualityOfLife = this.calculateQualityOfLife(city);
    
    // Update attractiveness
    city.attractiveness = this.calculateAttractiveness(city);
    
    // Process random events
    this.processRandomEvents(city);
    
    // Record monthly metrics
    this.recordMonthlyMetrics(city);
    
    city.lastUpdated = new Date();
    city.version += 1;
    
    return city;
  }

  /**
   * Attempt to develop a specialization for a city
   */
  developSpecialization(cityId: string, specializationId: string): boolean {
    const city = this.cities.get(cityId);
    const specialization = this.specializations.get(specializationId);
    
    if (!city || !specialization) {
      return false;
    }

    // Check if city meets requirements
    if (!this.canDevelopSpecialization(city, specialization)) {
      return false;
    }

    // End current specialization if exists
    if (city.currentSpecialization) {
      const currentHistory = city.specializationHistory.find(
        h => h.specializationId === city.currentSpecialization && !h.endDate
      );
      if (currentHistory) {
        currentHistory.endDate = new Date();
      }
    }

    // Start new specialization
    city.currentSpecialization = specializationId;
    city.specializationProgress = 0;
    city.specializationHistory.push({
      specializationId,
      startDate: new Date(),
      maxStageReached: 0
    });

    this.logDevelopmentEvent({
      cityId,
      type: 'specialization_change',
      description: `${city.name} began developing as a ${specialization.name}`,
      impact: {
        economicImpact: city.economicOutput * 0.1 // 10% economic boost from specialization start
      }
    });

    return true;
  }

  /**
   * Build or upgrade infrastructure in a city
   */
  buildInfrastructure(cityId: string, infrastructureId: string, targetLevel?: number): boolean {
    const city = this.cities.get(cityId);
    if (!city) {
      return false;
    }

    const currentInfra = city.infrastructure[infrastructureId];
    const newLevel = targetLevel || (currentInfra ? currentInfra.level + 1 : 1);
    
    if (newLevel > 10) {
      return false; // Maximum level is 10
    }

    const constructionCost = this.calculateConstructionCost(infrastructureId, newLevel);
    
    if (city.governmentBudget < constructionCost) {
      return false; // Insufficient budget
    }

    // Deduct cost and build infrastructure
    city.governmentBudget -= constructionCost;
    
    if (currentInfra) {
      currentInfra.level = newLevel;
      currentInfra.capacity = this.calculateInfrastructureCapacity(infrastructureId, newLevel);
    } else {
      city.infrastructure[infrastructureId] = this.createInfrastructure(infrastructureId, newLevel);
    }

    this.logDevelopmentEvent({
      cityId,
      type: 'infrastructure_built',
      description: `${city.name} ${currentInfra ? 'upgraded' : 'built'} ${infrastructureId} to level ${newLevel}`,
      impact: {
        infrastructureImpact: [{ id: infrastructureId, levelChange: newLevel - (currentInfra?.level || 0) }],
        economicImpact: constructionCost * 0.3 // Economic stimulus from construction
      }
    });

    return true;
  }

  /**
   * Get all cities
   */
  getAllCities(): City[] {
    return Array.from(this.cities.values());
  }

  /**
   * Get city by ID
   */
  getCity(cityId: string): City | undefined {
    return this.cities.get(cityId);
  }

  /**
   * Get available specializations for a city
   */
  getAvailableSpecializations(cityId: string): CitySpecialization[] {
    const city = this.cities.get(cityId);
    if (!city) {
      return [];
    }

    return Array.from(this.specializations.values()).filter(spec => 
      this.canDevelopSpecialization(city, spec)
    );
  }

  /**
   * Get development events for a city
   */
  getCityEvents(cityId: string, limit?: number): CityDevelopmentEvent[] {
    const events = this.developmentEvents
      .filter(event => event.cityId === cityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? events.slice(0, limit) : events;
  }

  // Private helper methods

  private calculateInitialCitySize(population: number): number {
    // Rough calculation: 1000 people per square km in urban areas
    return Math.max(25, population / 1000);
  }

  private generateInitialInfrastructure(population: number): { [id: string]: Infrastructure } {
    const infrastructure: { [id: string]: Infrastructure } = {};
    
    // Basic infrastructure based on population
    const baseInfrastructure = [
      { id: 'roads', level: Math.min(5, Math.floor(population / 10000) + 1) },
      { id: 'water_system', level: Math.min(4, Math.floor(population / 15000) + 1) },
      { id: 'power_grid', level: Math.min(4, Math.floor(population / 12000) + 1) },
      { id: 'waste_management', level: Math.min(3, Math.floor(population / 20000) + 1) },
      { id: 'public_transport', level: Math.min(3, Math.floor(population / 25000)) },
      { id: 'schools', level: Math.min(4, Math.floor(population / 8000) + 1) },
      { id: 'healthcare', level: Math.min(3, Math.floor(population / 15000) + 1) }
    ];

    baseInfrastructure.forEach(({ id, level }) => {
      if (level > 0) {
        infrastructure[id] = this.createInfrastructure(id, level);
      }
    });

    return infrastructure;
  }

  private createInfrastructure(id: string, level: number): Infrastructure {
    const capacity = this.calculateInfrastructureCapacity(id, level);
    const maintenanceCost = this.calculateMaintenanceCost(id, level);
    
    return {
      id,
      name: this.getInfrastructureName(id),
      type: this.getInfrastructureType(id),
      level,
      capacity,
      maintenanceCost,
      constructionCost: this.calculateConstructionCost(id, level),
      constructionTime: this.calculateConstructionTime(id, level),
      qualityOfLifeImpact: this.calculateQoLImpact(id, level),
      economicImpact: this.calculateEconomicImpact(id, level)
    };
  }

  private getInfrastructureName(id: string): string {
    const names: { [key: string]: string } = {
      'roads': 'Road Network',
      'water_system': 'Water System',
      'power_grid': 'Power Grid',
      'waste_management': 'Waste Management',
      'public_transport': 'Public Transportation',
      'schools': 'Educational Facilities',
      'healthcare': 'Healthcare System',
      'airport': 'Airport',
      'university': 'University',
      'business_district': 'Business District',
      'industrial_zone': 'Industrial Zone',
      'high_speed_internet': 'High-Speed Internet',
      'conference_center': 'Conference Center'
    };
    return names[id] || id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getInfrastructureType(id: string): Infrastructure['type'] {
    const types: { [key: string]: Infrastructure['type'] } = {
      'roads': 'transport',
      'public_transport': 'transport',
      'airport': 'transport',
      'water_system': 'utilities',
      'power_grid': 'utilities',
      'waste_management': 'utilities',
      'high_speed_internet': 'utilities',
      'schools': 'education',
      'university': 'education',
      'healthcare': 'healthcare',
      'business_district': 'commercial',
      'industrial_zone': 'commercial',
      'conference_center': 'recreation'
    };
    return types[id] || 'utilities';
  }

  private calculateInfrastructureCapacity(id: string, level: number): number {
    const baseCapacities: { [key: string]: number } = {
      'roads': 10000,
      'water_system': 8000,
      'power_grid': 12000,
      'waste_management': 6000,
      'public_transport': 15000,
      'schools': 2000,
      'healthcare': 5000,
      'airport': 50000,
      'university': 10000,
      'business_district': 20000,
      'industrial_zone': 15000
    };
    
    return (baseCapacities[id] || 5000) * level;
  }

  private calculateMaintenanceCost(id: string, level: number): number {
    const baseCosts: { [key: string]: number } = {
      'roads': 50000,
      'water_system': 75000,
      'power_grid': 100000,
      'waste_management': 40000,
      'public_transport': 80000,
      'schools': 60000,
      'healthcare': 120000,
      'airport': 500000,
      'university': 200000,
      'business_district': 150000,
      'industrial_zone': 100000
    };
    
    return (baseCosts[id] || 50000) * level * 0.8;
  }

  private calculateConstructionCost(id: string, level: number): number {
    return this.calculateMaintenanceCost(id, level) * 15; // 15x maintenance cost
  }

  private calculateConstructionTime(id: string, level: number): number {
    const baseTimes: { [key: string]: number } = {
      'roads': 6,
      'water_system': 8,
      'power_grid': 10,
      'waste_management': 4,
      'public_transport': 12,
      'schools': 8,
      'healthcare': 10,
      'airport': 36,
      'university': 24,
      'business_district': 18,
      'industrial_zone': 12
    };
    
    return (baseTimes[id] || 6) * level;
  }

  private calculateQoLImpact(id: string, level: number): number {
    const impacts: { [key: string]: number } = {
      'roads': 5,
      'water_system': 8,
      'power_grid': 6,
      'waste_management': 7,
      'public_transport': 6,
      'schools': 10,
      'healthcare': 12,
      'airport': 3,
      'university': 8,
      'business_district': 4,
      'industrial_zone': -2
    };
    
    return (impacts[id] || 3) * level;
  }

  private calculateEconomicImpact(id: string, level: number): number {
    const impacts: { [key: string]: number } = {
      'roads': 8,
      'water_system': 5,
      'power_grid': 10,
      'waste_management': 3,
      'public_transport': 7,
      'schools': 6,
      'healthcare': 4,
      'airport': 15,
      'university': 12,
      'business_district': 20,
      'industrial_zone': 18
    };
    
    return (impacts[id] || 5) * level;
  }

  private applyGeographicAdvantages(city: City): void {
    city.geographicAdvantages.forEach(advantageId => {
      const advantage = this.geographicAdvantages.get(advantageId);
      if (advantage) {
        // Apply economic bonuses
        city.economicOutput *= advantage.economicBonus;
        
        // Adjust attractiveness based on advantage
        city.attractiveness += advantage.economicBonus * 10;
        
        // Add to annual budget costs
        city.governmentBudget -= advantage.maintenanceCost;
      }
    });
  }

  private canDevelopSpecialization(city: City, specialization: CitySpecialization): boolean {
    // Check population requirement
    if (city.population < specialization.requiredPopulation) {
      return false;
    }

    // Check infrastructure requirements
    for (const requiredInfra of specialization.requiredInfrastructure) {
      const cityInfra = city.infrastructure[requiredInfra];
      if (!cityInfra || cityInfra.level < 3) { // Minimum level 3 required
        return false;
      }
    }

    return true;
  }

  private updatePopulation(city: City): void {
    // Base growth rate modified by attractiveness and quality of life
    const attractivenessModifier = (city.attractiveness - 50) / 100; // -0.5 to +0.5
    const qolModifier = (city.qualityOfLife - 50) / 200; // -0.25 to +0.25
    
    const effectiveGrowthRate = city.populationGrowthRate * 
      (1 + attractivenessModifier + qolModifier);
    
    const monthlyGrowthRate = effectiveGrowthRate / 12;
    const populationChange = Math.floor(city.population * monthlyGrowthRate);
    
    city.population += populationChange;
    
    // Update city size if population grows significantly
    const newSize = this.calculateInitialCitySize(city.population);
    if (newSize > city.size) {
      city.size = newSize;
    }
  }

  private updateEconomy(city: City): void {
    let economicMultiplier = 1.0;
    
    // Apply specialization bonuses
    if (city.currentSpecialization) {
      const specialization = this.specializations.get(city.currentSpecialization);
      if (specialization) {
        const currentStage = this.getCurrentSpecializationStage(city, specialization);
        if (currentStage) {
          economicMultiplier *= currentStage.benefits.economicMultiplier;
        }
      }
    }
    
    // Apply infrastructure bonuses
    const infrastructureBonus = this.calculateInfrastructureEconomicBonus(city);
    economicMultiplier *= (1 + infrastructureBonus);
    
    // Apply geographic advantage bonuses (already applied in creation, but recalculate for changes)
    city.geographicAdvantages.forEach(advantageId => {
      const advantage = this.geographicAdvantages.get(advantageId);
      if (advantage) {
        economicMultiplier *= advantage.economicBonus;
      }
    });
    
    // Add some volatility
    const volatility = (Math.random() - 0.5) * this.config.economicGrowthVolatility;
    economicMultiplier *= (1 + volatility);
    
    // Update economic output
    const baseGDPPerCapita = 35000;
    city.economicOutput = city.population * baseGDPPerCapita * economicMultiplier;
    
    // Update average income (correlated with economic output)
    city.averageIncome = (city.economicOutput / city.population) * 0.7; // 70% of GDP per capita
    
    // Update unemployment rate (inverse relationship with economic health)
    const targetUnemployment = Math.max(0.02, 0.08 - (economicMultiplier - 1) * 0.1);
    city.unemploymentRate = city.unemploymentRate * 0.9 + targetUnemployment * 0.1; // Smooth transition
  }

  private updateInfrastructure(city: City): void {
    // Apply decay to all infrastructure
    Object.values(city.infrastructure).forEach(infra => {
      const decayAmount = infra.level * this.config.infrastructureDecayRate / 12; // Monthly decay
      infra.level = Math.max(0, infra.level - decayAmount);
      
      // Deduct maintenance costs from budget
      city.governmentBudget -= infra.maintenanceCost / 12; // Monthly cost
    });
    
    // Auto-invest in infrastructure if budget allows and capacity is strained
    this.autoInvestInfrastructure(city);
  }

  private autoInvestInfrastructure(city: City): void {
    const availableBudget = city.infrastructureBudget;
    const criticalInfrastructure = ['roads', 'water_system', 'power_grid'];
    
    criticalInfrastructure.forEach(infraId => {
      const infra = city.infrastructure[infraId];
      if (infra && infra.capacity < city.population * 1.2) { // If at 80%+ capacity
        const upgradeCost = this.calculateConstructionCost(infraId, infra.level + 1);
        if (availableBudget >= upgradeCost) {
          this.buildInfrastructure(city.id, infraId, infra.level + 1);
        }
      }
    });
  }

  private updateSpecializationProgress(city: City): void {
    if (!city.currentSpecialization) {
      return;
    }

    const specialization = this.specializations.get(city.currentSpecialization);
    if (!specialization) {
      return;
    }

    // Increase specialization progress
    city.specializationProgress += this.config.specializationDevelopmentRate;
    city.specializationProgress = Math.min(100, city.specializationProgress);
    
    // Check for stage advancement
    const currentStage = this.getCurrentSpecializationStage(city, specialization);
    const nextStage = specialization.developmentStages.find(stage => 
      stage.stage > (currentStage?.stage || 0) && 
      this.meetsStageRequirements(city, stage, specialization)
    );
    
    if (nextStage) {
      const history = city.specializationHistory.find(
        h => h.specializationId === city.currentSpecialization && !h.endDate
      );
      if (history) {
        history.maxStageReached = nextStage.stage;
      }
      
      this.logDevelopmentEvent({
        cityId: city.id,
        type: 'specialization_change',
        description: `${city.name} advanced to ${nextStage.name} in ${specialization.name}`,
        impact: {
          economicImpact: city.economicOutput * 0.15,
          qualityOfLifeImpact: nextStage.benefits.qualityOfLifeBonus
        }
      });
    }
  }

  private getCurrentSpecializationStage(city: City, specialization: CitySpecialization) {
    const history = city.specializationHistory.find(
      h => h.specializationId === city.currentSpecialization && !h.endDate
    );
    
    if (!history) {
      return null;
    }
    
    return specialization.developmentStages
      .filter(stage => stage.stage <= history.maxStageReached)
      .sort((a, b) => b.stage - a.stage)[0] || null;
  }

  private meetsStageRequirements(city: City, stage: any, specialization: CitySpecialization): boolean {
    const requirements = stage.requirements;
    
    // Check population requirement
    if (requirements.population && city.population < requirements.population) {
      return false;
    }
    
    // Check infrastructure requirements
    if (requirements.infrastructure) {
      for (const infraReq of requirements.infrastructure) {
        const cityInfra = city.infrastructure[infraReq.id];
        if (!cityInfra || cityInfra.level < infraReq.minLevel) {
          return false;
        }
      }
    }
    
    // Check business count (would need integration with business system)
    if (requirements.businesses) {
      // TODO: Integrate with business system
      // For now, assume requirement is met if city is large enough
      const estimatedBusinesses = Math.floor(city.population / 500); // Rough estimate
      if (estimatedBusinesses < requirements.businesses) {
        return false;
      }
    }
    
    // Check time in specialization
    if (requirements.timeInSpecialization) {
      const history = city.specializationHistory.find(
        h => h.specializationId === city.currentSpecialization && !h.endDate
      );
      if (!history) {
        return false;
      }
      
      const monthsInSpecialization = (Date.now() - history.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsInSpecialization < requirements.timeInSpecialization) {
        return false;
      }
    }
    
    return true;
  }

  private calculateQualityOfLife(city: City): number {
    let qol = 0;
    
    // Infrastructure contribution
    const infrastructureScore = this.calculateInfrastructureQoLScore(city);
    qol += infrastructureScore * this.config.infrastructureQoLWeight;
    
    // Economic contribution
    const economicScore = Math.min(100, (city.averageIncome / 50000) * 100); // $50k = 100 score
    qol += economicScore * this.config.economicQoLWeight;
    
    // Environmental contribution
    qol += city.sustainability * this.config.environmentalQoLWeight;
    
    // Social contribution (based on specialization and city development)
    const socialScore = Math.min(100, city.attractiveness + city.specializationProgress / 2);
    qol += socialScore * this.config.socialQoLWeight;
    
    return Math.max(0, Math.min(100, qol));
  }

  private calculateInfrastructureQoLScore(city: City): number {
    const infrastructureValues = Object.values(city.infrastructure);
    if (infrastructureValues.length === 0) {
      return 0;
    }
    
    const totalQoLImpact = infrastructureValues.reduce((sum, infra) => sum + infra.qualityOfLifeImpact, 0);
    const averageLevel = infrastructureValues.reduce((sum, infra) => sum + infra.level, 0) / infrastructureValues.length;
    
    return Math.min(100, (totalQoLImpact / infrastructureValues.length) * (averageLevel / 5) * 10);
  }

  private calculateInfrastructureEconomicBonus(city: City): number {
    const infrastructureValues = Object.values(city.infrastructure);
    if (infrastructureValues.length === 0) {
      return 0;
    }
    
    const totalEconomicImpact = infrastructureValues.reduce((sum, infra) => sum + infra.economicImpact, 0);
    return totalEconomicImpact / 1000; // Convert to percentage bonus
  }

  private calculateAttractiveness(city: City): number {
    let attractiveness = 50; // Base attractiveness
    
    // Quality of life impact
    attractiveness += (city.qualityOfLife - 50) * 0.5;
    
    // Economic opportunity impact
    const unemploymentPenalty = (city.unemploymentRate - 0.05) * -200; // 5% is neutral
    attractiveness += unemploymentPenalty;
    
    // Specialization bonus
    if (city.currentSpecialization) {
      const specialization = this.specializations.get(city.currentSpecialization);
      if (specialization) {
        const currentStage = this.getCurrentSpecializationStage(city, specialization);
        if (currentStage) {
          attractiveness += currentStage.benefits.attractivenessBonus;
        }
      }
    }
    
    // Geographic advantages
    city.geographicAdvantages.forEach(advantageId => {
      const advantage = this.geographicAdvantages.get(advantageId);
      if (advantage) {
        attractiveness += (advantage.economicBonus - 1) * 20; // Convert bonus to attractiveness points
      }
    });
    
    return Math.max(0, Math.min(100, attractiveness));
  }

  private processRandomEvents(city: City): void {
    if (Math.random() < this.config.randomEventFrequency) {
      // Generate a random event
      const events = [
        {
          type: 'resource_discovered' as const,
          description: 'New natural resource discovered',
          impact: { economicImpact: city.economicOutput * 0.05 }
        },
        {
          type: 'disaster' as const,
          description: 'Natural disaster affects infrastructure',
          impact: { 
            economicImpact: -city.economicOutput * 0.02,
            infrastructureImpact: [{ id: 'roads', levelChange: -0.5 }]
          }
        },
        {
          type: 'policy_change' as const,
          description: 'New government policy implemented',
          impact: { qualityOfLifeImpact: (Math.random() - 0.5) * 10 }
        }
      ];
      
      const event = events[Math.floor(Math.random() * events.length)];
      
      this.logDevelopmentEvent({
        cityId: city.id,
        ...event
      });
      
      // Apply event impacts
      if (event.impact.economicImpact) {
        city.economicOutput += event.impact.economicImpact;
      }
      if (event.impact.qualityOfLifeImpact) {
        city.qualityOfLife += event.impact.qualityOfLifeImpact;
        city.qualityOfLife = Math.max(0, Math.min(100, city.qualityOfLife));
      }
      if (event.impact.infrastructureImpact) {
        event.impact.infrastructureImpact.forEach(infraImpact => {
          const infra = city.infrastructure[infraImpact.id];
          if (infra) {
            infra.level += infraImpact.levelChange;
            infra.level = Math.max(0, Math.min(10, infra.level));
          }
        });
      }
    }
  }

  private recordMonthlyMetrics(city: City): void {
    city.monthlyMetrics.push({
      date: new Date(),
      population: city.population,
      economicOutput: city.economicOutput,
      qualityOfLife: city.qualityOfLife,
      unemploymentRate: city.unemploymentRate,
      infrastructureSpending: city.infrastructureBudget,
      businessCount: Math.floor(city.population / 500) // Estimated business count
    });
    
    // Keep only last 24 months of data
    if (city.monthlyMetrics.length > 24) {
      city.monthlyMetrics = city.monthlyMetrics.slice(-24);
    }
  }

  private logDevelopmentEvent(event: Omit<CityDevelopmentEvent, 'id' | 'timestamp' | 'metadata'>): void {
    const developmentEvent: CityDevelopmentEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      metadata: {},
      ...event
    };
    
    this.developmentEvents.push(developmentEvent);
    
    // Keep only last 1000 events
    if (this.developmentEvents.length > 1000) {
      this.developmentEvents = this.developmentEvents.slice(-1000);
    }
  }

  /**
   * Generate image for a city
   */
  private async generateCityImage(city: City): Promise<void> {
    try {
      const { getCityVisualIntegration } = await import('../visual-systems/CityVisualIntegration.js');
      const cityVisual = getCityVisualIntegration();
      
      // Queue image generation (non-blocking)
      cityVisual.queueCityImageGeneration({
        id: city.id,
        name: city.name,
        population: city.population,
        climate: city.climate,
        terrain: city.terrain,
        coordinates: city.coordinates,
        infrastructure: city.infrastructure,
        founded: city.founded,
        economicOutput: city.economicOutput
      }, 'medium');
    } catch (error) {
      console.warn(`Failed to queue city image generation for ${city.name}:`, error);
    }
  }
}
