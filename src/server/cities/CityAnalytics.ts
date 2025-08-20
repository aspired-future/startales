/**
 * City Analytics Engine
 * 
 * Provides comprehensive analysis and insights for city development,
 * economic performance, infrastructure health, and comparative metrics.
 */

import { City, CityAnalytics, CitySpecialization, Infrastructure } from './types.js';

export class CityAnalyticsEngine {
  /**
   * Generate comprehensive analytics for a city
   */
  generateCityAnalytics(city: City, allCities: City[] = [], specializations: Map<string, CitySpecialization> = new Map()): CityAnalytics {
    return {
      cityId: city.id,
      analysisDate: new Date(),
      economicHealth: this.analyzeEconomicHealth(city),
      infrastructureHealth: this.analyzeInfrastructureHealth(city),
      socialHealth: this.analyzeSocialHealth(city),
      regionalRanking: this.calculateRegionalRanking(city, allCities),
      fiveYearProjection: this.generateFiveYearProjection(city, specializations)
    };
  }

  /**
   * Analyze economic health and performance
   */
  private analyzeEconomicHealth(city: City) {
    const gdpPerCapita = city.economicOutput / city.population;
    
    // Calculate economic growth rate from historical data
    let economicGrowthRate = 0;
    if (city.monthlyMetrics.length >= 12) {
      const currentGDP = city.monthlyMetrics[city.monthlyMetrics.length - 1].economicOutput;
      const yearAgoGDP = city.monthlyMetrics[city.monthlyMetrics.length - 12].economicOutput;
      economicGrowthRate = ((currentGDP - yearAgoGDP) / yearAgoGDP) * 100;
    }

    // Calculate industrial diversification
    const industrialDiversification = this.calculateIndustrialDiversification(city);
    
    // Identify competitive advantages
    const competitiveAdvantages = this.identifyCompetitiveAdvantages(city);
    
    // Identify economic vulnerabilities
    const economicVulnerabilities = this.identifyEconomicVulnerabilities(city);

    return {
      gdpPerCapita,
      economicGrowthRate,
      industrialDiversification,
      competitiveAdvantages,
      economicVulnerabilities
    };
  }

  /**
   * Analyze infrastructure health and capacity
   */
  private analyzeInfrastructureHealth(city: City) {
    const infrastructureValues = Object.values(city.infrastructure);
    
    // Calculate overall infrastructure level
    const overallLevel = infrastructureValues.length > 0 
      ? (infrastructureValues.reduce((sum, infra) => sum + infra.level, 0) / infrastructureValues.length) * 10
      : 0;

    // Calculate maintenance backlog
    const maintenanceBacklog = infrastructureValues.reduce((sum, infra) => {
      const optimalLevel = 8; // Target level for good infrastructure
      const deficiency = Math.max(0, optimalLevel - infra.level);
      return sum + (deficiency * infra.constructionCost * 0.3); // 30% of construction cost to upgrade
    }, 0);

    // Calculate capacity utilization
    const totalCapacity = infrastructureValues.reduce((sum, infra) => sum + infra.capacity, 0);
    const capacityUtilization = totalCapacity > 0 ? (city.population / totalCapacity) * 100 : 0;

    // Identify priority upgrades
    const priorityUpgrades = infrastructureValues
      .map(infra => ({
        infrastructureId: infra.id,
        urgency: this.calculateUpgradeUrgency(infra, city.population)
      }))
      .filter(upgrade => upgrade.urgency > 50)
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, 5); // Top 5 priorities

    return {
      overallLevel,
      maintenanceBacklog,
      capacityUtilization,
      priorityUpgrades
    };
  }

  /**
   * Analyze social health and quality of life factors
   */
  private analyzeSocialHealth(city: City) {
    // Social mobility calculation (based on education, economy, and specialization)
    const educationInfra = city.infrastructure['schools'] || city.infrastructure['university'];
    const educationScore = educationInfra ? educationInfra.level * 10 : 30;
    const economicOpportunityScore = Math.max(0, (1 - city.unemploymentRate) * 100);
    const specializationBonus = city.currentSpecialization ? 20 : 0;
    const socialMobility = Math.min(100, (educationScore + economicOpportunityScore + specializationBonus) / 3);

    // Cultural vitality (based on city size, specialization, and infrastructure)
    const sizeBonus = Math.min(30, Math.log10(city.population) * 10);
    const culturalInfra = Object.values(city.infrastructure)
      .filter(infra => infra.type === 'recreation' || infra.type === 'education')
      .reduce((sum, infra) => sum + infra.level, 0);
    const culturalVitality = Math.min(100, sizeBonus + culturalInfra * 5 + specializationBonus);

    // Community engagement (based on city size and quality of life)
    const engagementBase = 70; // Base engagement level
    const qolModifier = (city.qualityOfLife - 50) * 0.3;
    const sizeModifier = city.population > 100000 ? -10 : (city.population < 25000 ? 10 : 0);
    const communityEngagement = Math.max(0, Math.min(100, engagementBase + qolModifier + sizeModifier));

    return {
      qualityOfLife: city.qualityOfLife,
      socialMobility,
      culturalVitality,
      communityEngagement
    };
  }

  /**
   * Calculate regional ranking compared to other cities
   */
  private calculateRegionalRanking(city: City, allCities: City[]) {
    if (allCities.length <= 1) {
      return {
        economicOutput: 1,
        qualityOfLife: 1,
        growth: 1,
        innovation: 1
      };
    }

    // Economic output ranking
    const economicRanking = this.calculateRanking(
      allCities,
      c => c.economicOutput,
      city.economicOutput
    );

    // Quality of life ranking
    const qolRanking = this.calculateRanking(
      allCities,
      c => c.qualityOfLife,
      city.qualityOfLife
    );

    // Growth ranking (based on recent population and economic growth)
    const growthScore = this.calculateGrowthScore(city);
    const growthRanking = this.calculateRanking(
      allCities,
      c => this.calculateGrowthScore(c),
      growthScore
    );

    // Innovation ranking (based on specialization and infrastructure)
    const innovationScore = this.calculateInnovationScore(city);
    const innovationRanking = this.calculateRanking(
      allCities,
      c => this.calculateInnovationScore(c),
      innovationScore
    );

    return {
      economicOutput: economicRanking,
      qualityOfLife: qolRanking,
      growth: growthRanking,
      innovation: innovationRanking
    };
  }

  /**
   * Generate five-year projection for city development
   */
  private generateFiveYearProjection(city: City, specializations: Map<string, CitySpecialization>) {
    // Project population growth
    const currentGrowthRate = city.populationGrowthRate;
    const attractivenessModifier = (city.attractiveness - 50) / 100;
    const projectedGrowthRate = currentGrowthRate * (1 + attractivenessModifier);
    const projectedPopulation = Math.floor(city.population * Math.pow(1 + projectedGrowthRate, 5));

    // Project GDP growth
    const economicGrowthRate = this.calculateEconomicGrowthRate(city);
    const specializationBonus = this.getSpecializationGrowthBonus(city, specializations);
    const projectedGDPGrowthRate = economicGrowthRate * (1 + specializationBonus);
    const projectedGDP = Math.floor(city.economicOutput * Math.pow(1 + projectedGDPGrowthRate, 5));

    // Project quality of life
    const infrastructureImprovement = this.projectInfrastructureImprovement(city);
    const projectedQualityOfLife = Math.min(100, city.qualityOfLife + infrastructureImprovement);

    // Identify key risks
    const keyRisks = this.identifyKeyRisks(city);

    // Identify key opportunities
    const keyOpportunities = this.identifyKeyOpportunities(city, specializations);

    return {
      projectedPopulation,
      projectedGDP,
      projectedQualityOfLife,
      keyRisks,
      keyOpportunities
    };
  }

  // Helper methods

  private calculateIndustrialDiversification(city: City): number {
    // For now, base diversification on specialization and city size
    // In a full implementation, this would analyze actual business distribution
    let diversification = 50; // Base diversification

    // Larger cities tend to be more diversified
    if (city.population > 200000) {
      diversification += 20;
    } else if (city.population > 100000) {
      diversification += 10;
    }

    // Specialization can reduce diversification but increase efficiency
    if (city.currentSpecialization) {
      diversification -= 15; // Specialized cities are less diversified
    }

    // Geographic advantages can add diversification
    diversification += city.geographicAdvantages.length * 5;

    return Math.max(0, Math.min(100, diversification));
  }

  private identifyCompetitiveAdvantages(city: City): string[] {
    const advantages: string[] = [];

    // Geographic advantages
    city.geographicAdvantages.forEach(advantageId => {
      advantages.push(`Geographic: ${advantageId.replace(/_/g, ' ')}`);
    });

    // Specialization advantages
    if (city.currentSpecialization) {
      advantages.push(`Specialization: ${city.currentSpecialization.replace(/_/g, ' ')}`);
    }

    // Infrastructure advantages
    const strongInfrastructure = Object.values(city.infrastructure)
      .filter(infra => infra.level >= 7)
      .map(infra => `Strong ${infra.name}`);
    advantages.push(...strongInfrastructure);

    // Economic advantages
    const gdpPerCapita = city.economicOutput / city.population;
    if (gdpPerCapita > 60000) {
      advantages.push('High GDP per capita');
    }

    if (city.unemploymentRate < 0.04) {
      advantages.push('Low unemployment');
    }

    return advantages;
  }

  private identifyEconomicVulnerabilities(city: City): string[] {
    const vulnerabilities: string[] = [];

    // High unemployment
    if (city.unemploymentRate > 0.08) {
      vulnerabilities.push('High unemployment rate');
    }

    // Over-specialization risk
    if (city.currentSpecialization && this.calculateIndustrialDiversification(city) < 40) {
      vulnerabilities.push('Over-dependence on single industry');
    }

    // Infrastructure deficiencies
    const criticalInfra = ['roads', 'water_system', 'power_grid'];
    criticalInfra.forEach(infraId => {
      const infra = city.infrastructure[infraId];
      if (!infra || infra.level < 3) {
        vulnerabilities.push(`Inadequate ${infraId.replace(/_/g, ' ')}`);
      }
    });

    // Budget constraints
    if (city.governmentDebt > city.governmentBudget * 2) {
      vulnerabilities.push('High government debt');
    }

    // Population decline
    if (city.populationGrowthRate < 0) {
      vulnerabilities.push('Population decline');
    }

    return vulnerabilities;
  }

  private calculateUpgradeUrgency(infrastructure: Infrastructure, cityPopulation: number): number {
    let urgency = 0;

    // Capacity strain
    const capacityUtilization = cityPopulation / infrastructure.capacity;
    if (capacityUtilization > 0.9) {
      urgency += 40;
    } else if (capacityUtilization > 0.8) {
      urgency += 25;
    }

    // Infrastructure age/condition (inverse of level)
    const conditionScore = (10 - infrastructure.level) * 5;
    urgency += conditionScore;

    // Critical infrastructure gets higher priority
    const criticalTypes = ['transport', 'utilities'];
    if (criticalTypes.includes(infrastructure.type)) {
      urgency += 15;
    }

    return Math.min(100, urgency);
  }

  private calculateRanking(cities: City[], valueExtractor: (city: City) => number, cityValue: number): number {
    const sortedValues = cities
      .map(valueExtractor)
      .sort((a, b) => b - a); // Descending order

    const rank = sortedValues.indexOf(cityValue) + 1;
    return rank;
  }

  private calculateGrowthScore(city: City): number {
    let growthScore = 0;

    // Population growth
    growthScore += city.populationGrowthRate * 1000; // Convert to points

    // Economic growth (from recent metrics)
    if (city.monthlyMetrics.length >= 6) {
      const recentGDP = city.monthlyMetrics.slice(-3).reduce((sum, m) => sum + m.economicOutput, 0) / 3;
      const olderGDP = city.monthlyMetrics.slice(-6, -3).reduce((sum, m) => sum + m.economicOutput, 0) / 3;
      const economicGrowth = ((recentGDP - olderGDP) / olderGDP) * 100;
      growthScore += economicGrowth;
    }

    // Attractiveness growth potential
    growthScore += (city.attractiveness - 50) / 2;

    return growthScore;
  }

  private calculateInnovationScore(city: City): number {
    let innovationScore = 0;

    // Technology specialization bonus
    if (city.currentSpecialization === 'tech_hub') {
      innovationScore += 40;
    }

    // Education infrastructure
    const university = city.infrastructure['university'];
    if (university) {
      innovationScore += university.level * 5;
    }

    const schools = city.infrastructure['schools'];
    if (schools) {
      innovationScore += schools.level * 2;
    }

    // High-tech infrastructure
    const internet = city.infrastructure['high_speed_internet'];
    if (internet) {
      innovationScore += internet.level * 3;
    }

    // City size bonus (larger cities tend to be more innovative)
    if (city.population > 100000) {
      innovationScore += 15;
    }

    return innovationScore;
  }

  private calculateEconomicGrowthRate(city: City): number {
    if (city.monthlyMetrics.length < 12) {
      return 0.03; // Default 3% growth
    }

    const currentGDP = city.monthlyMetrics[city.monthlyMetrics.length - 1].economicOutput;
    const yearAgoGDP = city.monthlyMetrics[city.monthlyMetrics.length - 12].economicOutput;
    return (currentGDP - yearAgoGDP) / yearAgoGDP;
  }

  private getSpecializationGrowthBonus(city: City, specializations: Map<string, CitySpecialization>): number {
    if (!city.currentSpecialization) {
      return 0;
    }

    const specialization = specializations.get(city.currentSpecialization);
    if (!specialization) {
      return 0;
    }

    // Technology and financial specializations tend to have higher growth potential
    const highGrowthSpecializations = ['tech_hub', 'financial_district'];
    if (highGrowthSpecializations.includes(city.currentSpecialization)) {
      return 0.02; // 2% additional growth
    }

    return 0.01; // 1% additional growth for other specializations
  }

  private projectInfrastructureImprovement(city: City): number {
    // Assume city will invest in infrastructure over 5 years
    const currentInfraLevel = Object.values(city.infrastructure)
      .reduce((sum, infra) => sum + infra.level, 0) / Object.keys(city.infrastructure).length;

    const targetLevel = Math.min(8, currentInfraLevel + 2); // Improve by 2 levels over 5 years
    const improvement = (targetLevel - currentInfraLevel) * 3; // Each level improves QoL by ~3 points

    return improvement;
  }

  private identifyKeyRisks(city: City): string[] {
    const risks: string[] = [];

    // Economic risks
    if (city.unemploymentRate > 0.07) {
      risks.push('Rising unemployment could lead to social unrest');
    }

    // Infrastructure risks
    const oldInfrastructure = Object.values(city.infrastructure)
      .filter(infra => infra.level < 4);
    if (oldInfrastructure.length > 3) {
      risks.push('Aging infrastructure may limit growth');
    }

    // Specialization risks
    if (city.currentSpecialization && this.calculateIndustrialDiversification(city) < 35) {
      risks.push('Over-dependence on single industry creates vulnerability');
    }

    // Budget risks
    if (city.governmentDebt > city.governmentBudget) {
      risks.push('High debt levels may constrain public investment');
    }

    // Demographic risks
    if (city.populationGrowthRate < 0.005) {
      risks.push('Slow population growth may reduce economic dynamism');
    }

    return risks.slice(0, 5); // Top 5 risks
  }

  private identifyKeyOpportunities(city: City, specializations: Map<string, CitySpecialization>): string[] {
    const opportunities: string[] = [];

    // Specialization opportunities
    if (!city.currentSpecialization) {
      const availableSpecs = Array.from(specializations.values())
        .filter(spec => city.population >= spec.requiredPopulation * 0.8); // 80% of requirement
      if (availableSpecs.length > 0) {
        opportunities.push(`Develop ${availableSpecs[0].name} specialization`);
      }
    }

    // Infrastructure opportunities
    const infrastructureGaps = this.identifyInfrastructureGaps(city);
    if (infrastructureGaps.length > 0) {
      opportunities.push(`Invest in ${infrastructureGaps[0]} infrastructure`);
    }

    // Geographic opportunities
    if (city.geographicAdvantages.length > 0) {
      opportunities.push('Leverage geographic advantages for economic growth');
    }

    // Population opportunities
    if (city.attractiveness > 70) {
      opportunities.push('High attractiveness could drive significant population growth');
    }

    // Economic opportunities
    const gdpPerCapita = city.economicOutput / city.population;
    if (gdpPerCapita < 40000) {
      opportunities.push('Significant potential for economic development');
    }

    return opportunities.slice(0, 5); // Top 5 opportunities
  }

  private identifyInfrastructureGaps(city: City): string[] {
    const gaps: string[] = [];
    
    const importantInfrastructure = [
      'roads', 'water_system', 'power_grid', 'schools', 'healthcare',
      'public_transport', 'university', 'airport'
    ];

    importantInfrastructure.forEach(infraId => {
      const infra = city.infrastructure[infraId];
      if (!infra) {
        gaps.push(infraId.replace(/_/g, ' '));
      } else if (infra.level < 5) {
        gaps.push(`${infraId.replace(/_/g, ' ')} (upgrade needed)`);
      }
    });

    return gaps;
  }

  /**
   * Compare two cities across multiple metrics
   */
  compareCities(cityA: City, cityB: City): {
    winner: string;
    comparison: {
      metric: string;
      cityAValue: number;
      cityBValue: number;
      winner: string;
    }[];
  } {
    const comparisons = [
      {
        metric: 'Population',
        cityAValue: cityA.population,
        cityBValue: cityB.population,
        winner: cityA.population > cityB.population ? cityA.name : cityB.name
      },
      {
        metric: 'GDP per Capita',
        cityAValue: cityA.economicOutput / cityA.population,
        cityBValue: cityB.economicOutput / cityB.population,
        winner: (cityA.economicOutput / cityA.population) > (cityB.economicOutput / cityB.population) ? cityA.name : cityB.name
      },
      {
        metric: 'Quality of Life',
        cityAValue: cityA.qualityOfLife,
        cityBValue: cityB.qualityOfLife,
        winner: cityA.qualityOfLife > cityB.qualityOfLife ? cityA.name : cityB.name
      },
      {
        metric: 'Unemployment Rate',
        cityAValue: cityA.unemploymentRate * 100,
        cityBValue: cityB.unemploymentRate * 100,
        winner: cityA.unemploymentRate < cityB.unemploymentRate ? cityA.name : cityB.name
      },
      {
        metric: 'Attractiveness',
        cityAValue: cityA.attractiveness,
        cityBValue: cityB.attractiveness,
        winner: cityA.attractiveness > cityB.attractiveness ? cityA.name : cityB.name
      }
    ];

    const cityAWins = comparisons.filter(c => c.winner === cityA.name).length;
    const cityBWins = comparisons.filter(c => c.winner === cityB.name).length;

    return {
      winner: cityAWins > cityBWins ? cityA.name : cityB.name,
      comparison: comparisons
    };
  }
}
