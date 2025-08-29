/**
 * Entertainment, Culture & Tourism Simulation Integration
 * Manages entertainment industry, cultural development, and tourism systems
 */

import { Pool } from 'pg';
import { EventEmitter } from 'events';
import { EntertainmentTourismKnobs, DEFAULT_ENTERTAINMENT_TOURISM_KNOBS } from './entertainmentTourismKnobs';

export interface EntertainmentTourismState {
  civilizationId: string;
  culturalHeritage: CulturalHeritageData;
  entertainmentIndustry: EntertainmentIndustryData;
  tourismSector: TourismSectorData;
  economicImpact: EconomicImpactData;
  socialMetrics: SocialMetricsData;
  lastUpdated: Date;
}

export interface CulturalHeritageData {
  heritageScore: number;              // 0-100: Overall cultural heritage strength
  traditionalArtsVitality: number;    // 0-100: Health of traditional arts
  modernArtsInnovation: number;       // 0-100: Contemporary arts development
  culturalDiversityIndex: number;     // 0-100: Measure of cultural diversity
  culturalEducationLevel: number;     // 0-100: Cultural literacy of population
  artisticFreedomIndex: number;       // 0-100: Freedom of artistic expression
  culturalSites: number;              // Number of recognized cultural sites
  culturalEvents: number;             // Annual cultural events and festivals
}

export interface EntertainmentIndustryData {
  industrySize: number;               // Economic size of entertainment sector
  venueCapacity: number;              // Total entertainment venue capacity
  employmentLevel: number;            // Jobs in entertainment industry
  contentDiversityScore: number;     // 0-100: Variety of entertainment content
  celebrityInfluenceIndex: number;    // 0-100: Impact of celebrity culture
  sportsIndustryStrength: number;     // 0-100: Professional sports development
  gamingIndustrySize: number;         // Size of gaming/digital entertainment
  livePerformanceVitality: number;    // 0-100: Health of live entertainment
  entertainmentExports: number;       // Revenue from entertainment exports
  innovationIndex: number;            // 0-100: Entertainment industry innovation
}

export interface TourismSectorData {
  touristArrivals: number;            // Annual tourist arrivals
  tourismRevenue: number;             // Annual tourism revenue
  infrastructureQuality: number;      // 0-100: Tourism infrastructure rating
  naturalAttractionScore: number;     // 0-100: Quality of natural attractions
  historicalSiteScore: number;        // 0-100: Quality of historical sites
  touristSatisfactionIndex: number;   // 0-100: Average tourist satisfaction
  sustainabilityRating: number;       // 0-100: Environmental sustainability
  safetyIndex: number;                // 0-100: Tourist safety rating
  accessibilityScore: number;         // 0-100: Ease of tourist access
  marketingEffectiveness: number;     // 0-100: Tourism marketing success
}

export interface EconomicImpactData {
  totalGdpContribution: number;       // Entertainment/tourism % of GDP
  employmentContribution: number;     // Jobs created by sector
  taxRevenue: number;                 // Tax revenue from sector
  foreignExchangeEarnings: number;    // Foreign currency from tourism/exports
  investmentAttraction: number;       // Foreign investment in sector
  economicMultiplier: number;         // Economic multiplier effect
  seasonalityIndex: number;           // 0-100: Seasonal variation in activity
  competitivenessRating: number;      // 0-100: International competitiveness
}

export interface SocialMetricsData {
  culturalParticipationRate: number;  // % of population participating in culture
  culturalIdentityStrength: number;   // 0-100: Strength of cultural identity
  interculturalExchangeLevel: number; // 0-100: Level of cultural exchange
  entertainmentAccessibility: number; // 0-100: Access to entertainment for all
  communityEngagement: number;        // 0-100: Community involvement in culture
  culturalAuthenticityIndex: number;  // 0-100: Preservation of authentic culture
  socialCohesionImpact: number;       // -100 to 100: Impact on social cohesion
  qualityOfLifeContribution: number;  // 0-100: Contribution to quality of life
}

export interface EntertainmentTourismEvent {
  id: string;
  type: 'cultural_festival' | 'tourism_boom' | 'entertainment_crisis' | 'heritage_discovery' | 'industry_innovation' | 'sustainability_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: {
    cultural: number;      // -100 to 100
    economic: number;      // -100 to 100
    social: number;        // -100 to 100
    environmental: number; // -100 to 100
  };
  duration: number;        // Duration in simulation ticks
  timestamp: Date;
}

export class EntertainmentTourismSimulationIntegration extends EventEmitter {
  private pool: Pool;
  private activeSimulations: Map<string, EntertainmentTourismState> = new Map();
  private knobStates: Map<string, EntertainmentTourismKnobs> = new Map();

  constructor(pool: Pool) {
    super();
    this.pool = pool;
  }

  /**
   * Register a civilization for entertainment/tourism simulation
   */
  async registerCivilization(campaignId: string, civilizationId: string): Promise<void> {
    const key = `${campaignId}-${civilizationId}`;
    
    // Initialize default state
    const initialState: EntertainmentTourismState = {
      civilizationId,
      culturalHeritage: {
        heritageScore: 50,
        traditionalArtsVitality: 45,
        modernArtsInnovation: 40,
        culturalDiversityIndex: 55,
        culturalEducationLevel: 50,
        artisticFreedomIndex: 60,
        culturalSites: 5,
        culturalEvents: 12
      },
      entertainmentIndustry: {
        industrySize: 1000000,
        venueCapacity: 50000,
        employmentLevel: 2500,
        contentDiversityScore: 50,
        celebrityInfluenceIndex: 45,
        sportsIndustryStrength: 40,
        gamingIndustrySize: 500000,
        livePerformanceVitality: 55,
        entertainmentExports: 100000,
        innovationIndex: 45
      },
      tourismSector: {
        touristArrivals: 100000,
        tourismRevenue: 50000000,
        infrastructureQuality: 60,
        naturalAttractionScore: 70,
        historicalSiteScore: 55,
        touristSatisfactionIndex: 65,
        sustainabilityRating: 50,
        safetyIndex: 75,
        accessibilityScore: 60,
        marketingEffectiveness: 45
      },
      economicImpact: {
        totalGdpContribution: 8.5,
        employmentContribution: 12.3,
        taxRevenue: 5000000,
        foreignExchangeEarnings: 25000000,
        investmentAttraction: 3000000,
        economicMultiplier: 2.1,
        seasonalityIndex: 35,
        competitivenessRating: 55
      },
      socialMetrics: {
        culturalParticipationRate: 45,
        culturalIdentityStrength: 60,
        interculturalExchangeLevel: 40,
        entertainmentAccessibility: 55,
        communityEngagement: 50,
        culturalAuthenticityIndex: 65,
        socialCohesionImpact: 15,
        qualityOfLifeContribution: 60
      },
      lastUpdated: new Date()
    };

    this.activeSimulations.set(key, initialState);
    this.knobStates.set(civilizationId, { ...DEFAULT_ENTERTAINMENT_TOURISM_KNOBS });

    console.log(`🎭 Registered entertainment/tourism simulation for civilization ${civilizationId}`);
    this.emit('civilizationRegistered', { campaignId, civilizationId });
  }

  /**
   * Run orchestrator simulation for entertainment/tourism
   */
  async runOrchestratorSimulation(data: {
    civilization_id: string;
    knobs: EntertainmentTourismKnobs;
  }): Promise<{
    cultural_development: any;
    entertainment_industry: any;
    tourism_performance: any;
    economic_impact: any;
    social_impact: any;
    sustainability_metrics: any;
    recommendations: string[];
  }> {
    const { civilization_id, knobs } = data;
    const state = this.getSimulationState(civilization_id);
    
    if (!state) {
      throw new Error(`No simulation state found for civilization ${civilization_id}`);
    }

    // Update knob states
    this.knobStates.set(civilization_id, knobs);

    // Run cultural development simulation
    const culturalDevelopment = this.simulateCulturalDevelopment(state, knobs);
    
    // Run entertainment industry simulation
    const entertainmentIndustry = this.simulateEntertainmentIndustry(state, knobs);
    
    // Run tourism performance simulation
    const tourismPerformance = this.simulateTourismPerformance(state, knobs);
    
    // Calculate economic impact
    const economicImpact = this.calculateEconomicImpact(state, knobs);
    
    // Calculate social impact
    const socialImpact = this.calculateSocialImpact(state, knobs);
    
    // Calculate sustainability metrics
    const sustainabilityMetrics = this.calculateSustainabilityMetrics(state, knobs);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(state, knobs);

    // Update state
    state.lastUpdated = new Date();
    this.activeSimulations.set(`campaign-${civilization_id}`, state);

    return {
      cultural_development: culturalDevelopment,
      entertainment_industry: entertainmentIndustry,
      tourism_performance: tourismPerformance,
      economic_impact: economicImpact,
      social_impact: socialImpact,
      sustainability_metrics: sustainabilityMetrics,
      recommendations
    };
  }

  /**
   * Simulate cultural development
   */
  private simulateCulturalDevelopment(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const cultural = state.culturalHeritage;
    
    // Heritage preservation impact
    const heritageImpact = (knobs.cultural_heritage_preservation / 100) * 0.3;
    cultural.heritageScore = Math.min(100, cultural.heritageScore + heritageImpact);
    
    // Artistic freedom impact
    const freedomImpact = (knobs.artistic_expression_freedom / 100) * 0.25;
    cultural.artisticFreedomIndex = Math.min(100, cultural.artisticFreedomIndex + freedomImpact);
    
    // Traditional vs modern arts balance
    const traditionalBoost = (knobs.traditional_arts_funding / 100) * 0.2;
    const modernBoost = (knobs.modern_arts_innovation / 100) * 0.2;
    
    cultural.traditionalArtsVitality = Math.min(100, cultural.traditionalArtsVitality + traditionalBoost);
    cultural.modernArtsInnovation = Math.min(100, cultural.modernArtsInnovation + modernBoost);
    
    // Cultural diversity
    const diversityBoost = (knobs.cultural_diversity_promotion / 100) * 0.15;
    cultural.culturalDiversityIndex = Math.min(100, cultural.culturalDiversityIndex + diversityBoost);
    
    // Cultural education
    const educationBoost = (knobs.cultural_education_emphasis / 100) * 0.2;
    cultural.culturalEducationLevel = Math.min(100, cultural.culturalEducationLevel + educationBoost);

    return {
      heritage_strength: cultural.heritageScore,
      artistic_freedom: cultural.artisticFreedomIndex,
      traditional_arts_vitality: cultural.traditionalArtsVitality,
      modern_arts_innovation: cultural.modernArtsInnovation,
      cultural_diversity: cultural.culturalDiversityIndex,
      cultural_education: cultural.culturalEducationLevel,
      cultural_sites_count: cultural.culturalSites,
      annual_cultural_events: cultural.culturalEvents
    };
  }

  /**
   * Simulate entertainment industry
   */
  private simulateEntertainmentIndustry(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const entertainment = state.entertainmentIndustry;
    
    // Venue development impact
    const venueBoost = (knobs.entertainment_venue_development / 100) * 0.1;
    entertainment.venueCapacity *= (1 + venueBoost);
    
    // Sports industry investment
    const sportsBoost = (knobs.sports_industry_investment / 100) * 0.15;
    entertainment.sportsIndustryStrength = Math.min(100, entertainment.sportsIndustryStrength + sportsBoost * 10);
    
    // Gaming industry support
    const gamingBoost = (knobs.gaming_industry_support / 100) * 0.12;
    entertainment.gamingIndustrySize *= (1 + gamingBoost);
    
    // Live performance promotion
    const liveBoost = (knobs.live_performance_promotion / 100) * 0.18;
    entertainment.livePerformanceVitality = Math.min(100, entertainment.livePerformanceVitality + liveBoost * 10);
    
    // Content regulation impact (inverse relationship with diversity)
    const regulationImpact = (100 - knobs.entertainment_content_regulation) / 100 * 0.1;
    entertainment.contentDiversityScore = Math.min(100, entertainment.contentDiversityScore + regulationImpact * 10);
    
    // Celebrity culture influence
    entertainment.celebrityInfluenceIndex = knobs.celebrity_culture_influence;
    
    // Calculate industry size growth
    const industryGrowth = (venueBoost + sportsBoost + gamingBoost + liveBoost) / 4;
    entertainment.industrySize *= (1 + industryGrowth);
    
    // Employment calculation
    entertainment.employmentLevel = Math.floor(entertainment.industrySize * 0.0025);
    
    // Innovation index
    const innovationFactors = [
      knobs.gaming_industry_support,
      knobs.digital_entertainment_platforms,
      knobs.entertainment_data_analytics
    ];
    entertainment.innovationIndex = innovationFactors.reduce((sum, factor) => sum + factor, 0) / innovationFactors.length;

    return {
      industry_size: entertainment.industrySize,
      venue_capacity: entertainment.venueCapacity,
      employment_level: entertainment.employmentLevel,
      content_diversity: entertainment.contentDiversityScore,
      sports_strength: entertainment.sportsIndustryStrength,
      gaming_sector_size: entertainment.gamingIndustrySize,
      live_performance_health: entertainment.livePerformanceVitality,
      innovation_level: entertainment.innovationIndex,
      export_revenue: entertainment.entertainmentExports
    };
  }

  /**
   * Simulate tourism performance
   */
  private simulateTourismPerformance(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const tourism = state.tourismSector;
    
    // Infrastructure investment impact
    const infraBoost = (knobs.tourism_infrastructure_investment / 100) * 0.2;
    tourism.infrastructureQuality = Math.min(100, tourism.infrastructureQuality + infraBoost * 10);
    
    // Natural attraction conservation
    const conservationBoost = (knobs.natural_attraction_conservation / 100) * 0.15;
    tourism.naturalAttractionScore = Math.min(100, tourism.naturalAttractionScore + conservationBoost * 5);
    
    // Historical site maintenance
    const historyBoost = (knobs.historical_site_maintenance / 100) * 0.15;
    tourism.historicalSiteScore = Math.min(100, tourism.historicalSiteScore + historyBoost * 5);
    
    // Safety measures
    const safetyBoost = (knobs.tourist_safety_measures / 100) * 0.1;
    tourism.safetyIndex = Math.min(100, tourism.safetyIndex + safetyBoost * 5);
    
    // Marketing effectiveness
    const marketingBoost = (knobs.tourism_marketing_budget / 100) * 0.25;
    tourism.marketingEffectiveness = Math.min(100, tourism.marketingEffectiveness + marketingBoost * 10);
    
    // Visa accessibility
    const visaBoost = (knobs.tourism_visa_accessibility / 100) * 0.2;
    tourism.accessibilityScore = Math.min(100, tourism.accessibilityScore + visaBoost * 10);
    
    // Sustainability practices
    const sustainabilityBoost = (knobs.sustainable_tourism_practices / 100) * 0.15;
    tourism.sustainabilityRating = Math.min(100, tourism.sustainabilityRating + sustainabilityBoost * 10);
    
    // Calculate tourist arrivals based on overall attractiveness
    const attractivenessScore = (
      tourism.infrastructureQuality +
      tourism.naturalAttractionScore +
      tourism.historicalSiteScore +
      tourism.safetyIndex +
      tourism.marketingEffectiveness +
      tourism.accessibilityScore
    ) / 6;
    
    const arrivalMultiplier = 1 + (attractivenessScore - 50) / 100;
    tourism.touristArrivals = Math.floor(tourism.touristArrivals * arrivalMultiplier);
    
    // Calculate tourism revenue
    const revenuePerTourist = 500 + (tourism.infrastructureQuality * 10);
    tourism.tourismRevenue = tourism.touristArrivals * revenuePerTourist;
    
    // Tourist satisfaction
    tourism.touristSatisfactionIndex = (
      tourism.infrastructureQuality * 0.3 +
      tourism.safetyIndex * 0.3 +
      tourism.naturalAttractionScore * 0.2 +
      tourism.historicalSiteScore * 0.2
    );

    return {
      tourist_arrivals: tourism.touristArrivals,
      tourism_revenue: tourism.tourismRevenue,
      infrastructure_quality: tourism.infrastructureQuality,
      attraction_scores: {
        natural: tourism.naturalAttractionScore,
        historical: tourism.historicalSiteScore
      },
      satisfaction_index: tourism.touristSatisfactionIndex,
      safety_rating: tourism.safetyIndex,
      accessibility: tourism.accessibilityScore,
      sustainability: tourism.sustainabilityRating,
      marketing_effectiveness: tourism.marketingEffectiveness
    };
  }

  /**
   * Calculate economic impact
   */
  private calculateEconomicImpact(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const economic = state.economicImpact;
    const entertainment = state.entertainmentIndustry;
    const tourism = state.tourismSector;
    
    // GDP contribution calculation
    const totalSectorValue = entertainment.industrySize + tourism.tourismRevenue;
    economic.totalGdpContribution = (totalSectorValue / 1000000000) * 100; // Assuming 1B GDP
    
    // Employment contribution
    const tourismJobs = Math.floor(tourism.touristArrivals * 0.01); // 1 job per 100 tourists
    economic.employmentContribution = entertainment.employmentLevel + tourismJobs;
    
    // Tax revenue (assuming 15% tax rate)
    economic.taxRevenue = totalSectorValue * 0.15;
    
    // Foreign exchange earnings
    economic.foreignExchangeEarnings = tourism.tourismRevenue + entertainment.entertainmentExports;
    
    // Investment attraction
    const investmentFactors = [
      knobs.entertainment_tax_incentives,
      knobs.tourism_infrastructure_investment,
      knobs.cultural_export_promotion
    ];
    const investmentMultiplier = investmentFactors.reduce((sum, factor) => sum + factor, 0) / (investmentFactors.length * 100);
    economic.investmentAttraction = totalSectorValue * investmentMultiplier * 0.1;
    
    // Economic multiplier effect
    economic.economicMultiplier = 1.8 + (economic.totalGdpContribution / 100);
    
    // Competitiveness rating
    economic.competitivenessRating = (
      tourism.touristSatisfactionIndex * 0.4 +
      entertainment.innovationIndex * 0.3 +
      tourism.infrastructureQuality * 0.3
    );

    return {
      gdp_contribution_percent: economic.totalGdpContribution,
      total_employment: economic.employmentContribution,
      tax_revenue: economic.taxRevenue,
      foreign_exchange: economic.foreignExchangeEarnings,
      investment_attraction: economic.investmentAttraction,
      economic_multiplier: economic.economicMultiplier,
      competitiveness: economic.competitivenessRating,
      sector_value: totalSectorValue
    };
  }

  /**
   * Calculate social impact
   */
  private calculateSocialImpact(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const social = state.socialMetrics;
    
    // Cultural participation
    const participationBoost = (knobs.community_cultural_participation / 100) * 0.2;
    social.culturalParticipationRate = Math.min(100, social.culturalParticipationRate + participationBoost * 10);
    
    // Cultural identity
    const identityBoost = (knobs.cultural_identity_strengthening / 100) * 0.15;
    social.culturalIdentityStrength = Math.min(100, social.culturalIdentityStrength + identityBoost * 10);
    
    // Intercultural exchange
    const exchangeBoost = (knobs.intercultural_exchange_programs / 100) * 0.18;
    social.interculturalExchangeLevel = Math.min(100, social.interculturalExchangeLevel + exchangeBoost * 10);
    
    // Entertainment accessibility
    const accessibilityBoost = (knobs.entertainment_accessibility / 100) * 0.2;
    social.entertainmentAccessibility = Math.min(100, social.entertainmentAccessibility + accessibilityBoost * 10);
    
    // Community engagement
    const engagementBoost = (knobs.community_cultural_participation / 100) * 0.15;
    social.communityEngagement = Math.min(100, social.communityEngagement + engagementBoost * 10);
    
    // Cultural authenticity
    const authenticityImpact = (knobs.cultural_tourism_authenticity / 100) * 0.1;
    social.culturalAuthenticityIndex = Math.min(100, social.culturalAuthenticityIndex + authenticityImpact * 5);
    
    // Social cohesion impact
    const cohesionFactors = [
      social.culturalParticipationRate,
      social.culturalIdentityStrength,
      social.entertainmentAccessibility
    ];
    social.socialCohesionImpact = (cohesionFactors.reduce((sum, factor) => sum + factor, 0) / cohesionFactors.length) - 50;
    
    // Quality of life contribution
    social.qualityOfLifeContribution = (
      social.culturalParticipationRate * 0.3 +
      social.entertainmentAccessibility * 0.3 +
      social.communityEngagement * 0.4
    );

    return {
      cultural_participation: social.culturalParticipationRate,
      cultural_identity: social.culturalIdentityStrength,
      intercultural_exchange: social.interculturalExchangeLevel,
      entertainment_access: social.entertainmentAccessibility,
      community_engagement: social.communityEngagement,
      cultural_authenticity: social.culturalAuthenticityIndex,
      social_cohesion_impact: social.socialCohesionImpact,
      quality_of_life_boost: social.qualityOfLifeContribution
    };
  }

  /**
   * Calculate sustainability metrics
   */
  private calculateSustainabilityMetrics(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): any {
    const tourism = state.tourismSector;
    
    // Environmental sustainability
    const envSustainability = (
      knobs.sustainable_tourism_practices * 0.4 +
      knobs.natural_attraction_conservation * 0.6
    );
    
    // Cultural sustainability
    const culturalSustainability = (
      knobs.cultural_tourism_authenticity * 0.5 +
      knobs.cultural_heritage_preservation * 0.5
    );
    
    // Economic sustainability
    const economicSustainability = (
      knobs.tourism_revenue_reinvestment * 0.6 +
      knobs.entertainment_employment_programs * 0.4
    );
    
    // Overall sustainability score
    const overallSustainability = (envSustainability + culturalSustainability + economicSustainability) / 3;
    
    // Carrying capacity utilization
    const carryingCapacityUtilization = Math.min(100, (tourism.touristArrivals / 200000) * 100);
    
    // Sustainability risk factors
    const riskFactors = {
      overtourism: carryingCapacityUtilization > 80 ? 'high' : carryingCapacityUtilization > 60 ? 'medium' : 'low',
      cultural_erosion: knobs.cultural_tourism_authenticity < 50 ? 'high' : 'low',
      environmental_impact: knobs.sustainable_tourism_practices < 40 ? 'high' : 'medium'
    };

    return {
      environmental_sustainability: envSustainability,
      cultural_sustainability: culturalSustainability,
      economic_sustainability: economicSustainability,
      overall_sustainability: overallSustainability,
      carrying_capacity_utilization: carryingCapacityUtilization,
      risk_factors: riskFactors,
      sustainability_rating: tourism.sustainabilityRating
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(state: EntertainmentTourismState, knobs: EntertainmentTourismKnobs): string[] {
    const recommendations: string[] = [];
    
    // Cultural development recommendations
    if (knobs.cultural_heritage_preservation < 60) {
      recommendations.push("Increase investment in cultural heritage preservation to maintain authentic attractions");
    }
    
    if (knobs.artistic_expression_freedom < 70 && state.culturalHeritage.modernArtsInnovation < 50) {
      recommendations.push("Consider increasing artistic freedom to boost cultural innovation and creativity");
    }
    
    // Entertainment industry recommendations
    if (state.entertainmentIndustry.contentDiversityScore < 60) {
      recommendations.push("Reduce content regulation to encourage more diverse entertainment offerings");
    }
    
    if (knobs.gaming_industry_support < 50 && state.entertainmentIndustry.innovationIndex < 60) {
      recommendations.push("Increase support for the gaming industry to boost digital entertainment innovation");
    }
    
    // Tourism recommendations
    if (state.tourismSector.touristSatisfactionIndex < 70) {
      recommendations.push("Improve tourism infrastructure and services to increase visitor satisfaction");
    }
    
    if (knobs.tourism_marketing_budget < 50 && state.tourismSector.touristArrivals < 150000) {
      recommendations.push("Increase tourism marketing budget to attract more international visitors");
    }
    
    // Sustainability recommendations
    if (knobs.sustainable_tourism_practices < 60) {
      recommendations.push("Implement more sustainable tourism practices to ensure long-term viability");
    }
    
    // Economic recommendations
    if (state.economicImpact.totalGdpContribution < 10) {
      recommendations.push("Focus on high-value tourism and entertainment exports to increase economic impact");
    }
    
    return recommendations;
  }

  /**
   * Get simulation state for a civilization
   */
  getSimulationState(civilizationId: string): EntertainmentTourismState | undefined {
    // Try different key formats
    const possibleKeys = [
      `campaign-${civilizationId}`,
      civilizationId,
      `${civilizationId}`
    ];
    
    for (const key of possibleKeys) {
      const state = this.activeSimulations.get(key);
      if (state) return state;
    }
    
    return undefined;
  }

  /**
   * Get knob states for a civilization
   */
  getKnobStates(civilizationId: string): EntertainmentTourismKnobs {
    return this.knobStates.get(civilizationId) || { ...DEFAULT_ENTERTAINMENT_TOURISM_KNOBS };
  }

  /**
   * Update knob states for a civilization
   */
  updateKnobStates(civilizationId: string, knobs: Partial<EntertainmentTourismKnobs>): void {
    const currentKnobs = this.getKnobStates(civilizationId);
    const updatedKnobs = { ...currentKnobs, ...knobs, lastUpdated: Date.now() };
    this.knobStates.set(civilizationId, updatedKnobs);
  }

  /**
   * Generate entertainment/tourism events
   */
  generateEvents(civilizationId: string): EntertainmentTourismEvent[] {
    const state = this.getSimulationState(civilizationId);
    const knobs = this.getKnobStates(civilizationId);
    const events: EntertainmentTourismEvent[] = [];
    
    if (!state) return events;
    
    // Cultural festival event
    if (Math.random() < 0.3 && state.culturalHeritage.culturalEvents > 10) {
      events.push({
        id: `cultural_festival_${Date.now()}`,
        type: 'cultural_festival',
        severity: 'medium',
        description: 'Major cultural festival attracts visitors and boosts cultural participation',
        impact: {
          cultural: 15,
          economic: 10,
          social: 20,
          environmental: -5
        },
        duration: 3,
        timestamp: new Date()
      });
    }
    
    // Tourism boom event
    if (Math.random() < 0.2 && state.tourismSector.touristSatisfactionIndex > 75) {
      events.push({
        id: `tourism_boom_${Date.now()}`,
        type: 'tourism_boom',
        severity: 'high',
        description: 'Viral social media content creates unexpected tourism surge',
        impact: {
          cultural: 5,
          economic: 25,
          social: 10,
          environmental: -15
        },
        duration: 5,
        timestamp: new Date()
      });
    }
    
    // Heritage discovery event
    if (Math.random() < 0.15 && knobs.cultural_heritage_preservation > 70) {
      events.push({
        id: `heritage_discovery_${Date.now()}`,
        type: 'heritage_discovery',
        severity: 'medium',
        description: 'Archaeological discovery reveals new cultural heritage site',
        impact: {
          cultural: 20,
          economic: 15,
          social: 10,
          environmental: 0
        },
        duration: 10,
        timestamp: new Date()
      });
    }
    
    return events;
  }
}

export default EntertainmentTourismSimulationIntegration;
