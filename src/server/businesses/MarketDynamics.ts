/**
 * Market Dynamics Engine - Competition and market analysis system
 * Sprint 7: Advanced market competition modeling and business ecosystem dynamics
 */

import { 
  Business, 
  BusinessIndustry, 
  MarketAnalysis, 
  CompetitionLevel,
  BusinessEvent,
  BusinessEventType,
  IndustryTrend,
  TrendImpact,
  TrendTimeframe,
  BarrierToEntry
} from './types';

export interface CompetitorAnalysis {
  businessId: string;
  competitorId: string;
  competitionIntensity: number; // 0-1
  marketOverlap: number; // 0-1
  competitiveAdvantages: string[];
  competitiveDisadvantages: string[];
  threatLevel: CompetitionLevel;
}

export interface MarketSegment {
  id: string;
  name: string;
  industry: BusinessIndustry;
  size: number;
  growthRate: number;
  profitability: number;
  competitionLevel: CompetitionLevel;
  barriers: BarrierToEntry[];
  keySuccessFactors: string[];
}

export interface CompetitiveResponse {
  businessId: string;
  responseType: ResponseType;
  targetCompetitor?: string;
  description: string;
  cost: number;
  expectedImpact: BusinessImpact;
  duration: number; // months
}

export interface BusinessImpact {
  revenueChange: number; // percentage
  marketShareChange: number; // percentage
  reputationChange: number; // percentage
  costChange: number; // percentage
}

export enum ResponseType {
  PRICE_CUT = 'price_cut',
  QUALITY_IMPROVEMENT = 'quality_improvement',
  MARKETING_CAMPAIGN = 'marketing_campaign',
  NEW_PRODUCT = 'new_product',
  SERVICE_ENHANCEMENT = 'service_enhancement',
  EXPANSION = 'expansion',
  COST_REDUCTION = 'cost_reduction',
  PARTNERSHIP = 'partnership',
  ACQUISITION = 'acquisition',
  INNOVATION = 'innovation'
}

export class MarketDynamics {
  private marketAnalyses: Map<string, MarketAnalysis> = new Map(); // industry-city -> analysis
  private competitorAnalyses: Map<string, CompetitorAnalysis[]> = new Map(); // businessId -> analyses
  private marketSegments: Map<string, MarketSegment> = new Map();
  private industryTrends: Map<BusinessIndustry, IndustryTrend[]> = new Map();
  private competitiveResponses: CompetitiveResponse[] = [];

  constructor() {
    this.initializeMarketSegments();
    this.initializeIndustryTrends();
  }

  /**
   * Initialize market segments for different industries
   */
  private initializeMarketSegments(): void {
    const segments: MarketSegment[] = [
      // Technology Segments
      {
        id: 'software_consulting',
        name: 'Software Consulting',
        industry: BusinessIndustry.TECHNOLOGY,
        size: 500000,
        growthRate: 0.15,
        profitability: 0.25,
        competitionLevel: CompetitionLevel.MODERATE,
        barriers: [BarrierToEntry.SPECIALIZED_KNOWLEDGE, BarrierToEntry.ESTABLISHED_COMPETITION],
        keySuccessFactors: ['Technical expertise', 'Client relationships', 'Project delivery']
      },
      {
        id: 'web_development',
        name: 'Web Development',
        industry: BusinessIndustry.TECHNOLOGY,
        size: 300000,
        growthRate: 0.20,
        profitability: 0.30,
        competitionLevel: CompetitionLevel.HIGH,
        barriers: [BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        keySuccessFactors: ['Modern frameworks', 'Portfolio quality', 'Speed of delivery']
      },

      // Food Service Segments
      {
        id: 'coffee_shops',
        name: 'Coffee Shops',
        industry: BusinessIndustry.FOOD_SERVICE,
        size: 200000,
        growthRate: 0.05,
        profitability: 0.15,
        competitionLevel: CompetitionLevel.INTENSE,
        barriers: [BarrierToEntry.LOCATION_ADVANTAGES, BarrierToEntry.BRAND_LOYALTY],
        keySuccessFactors: ['Location', 'Quality', 'Atmosphere', 'Customer service']
      },
      {
        id: 'fast_casual',
        name: 'Fast Casual Dining',
        industry: BusinessIndustry.FOOD_SERVICE,
        size: 400000,
        growthRate: 0.08,
        profitability: 0.12,
        competitionLevel: CompetitionLevel.HIGH,
        barriers: [BarrierToEntry.HIGH_CAPITAL_REQUIREMENTS, BarrierToEntry.REGULATORY_APPROVAL],
        keySuccessFactors: ['Food quality', 'Speed', 'Price point', 'Brand recognition']
      },

      // Professional Services Segments
      {
        id: 'accounting_services',
        name: 'Accounting Services',
        industry: BusinessIndustry.PROFESSIONAL_SERVICES,
        size: 300000,
        growthRate: 0.03,
        profitability: 0.35,
        competitionLevel: CompetitionLevel.MODERATE,
        barriers: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        keySuccessFactors: ['Certification', 'Accuracy', 'Client trust', 'Technology adoption']
      },
      {
        id: 'legal_services',
        name: 'Legal Services',
        industry: BusinessIndustry.PROFESSIONAL_SERVICES,
        size: 450000,
        growthRate: 0.02,
        profitability: 0.40,
        competitionLevel: CompetitionLevel.LOW,
        barriers: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        keySuccessFactors: ['Expertise', 'Reputation', 'Network', 'Success rate']
      },

      // Healthcare Segments
      {
        id: 'physical_therapy',
        name: 'Physical Therapy',
        industry: BusinessIndustry.HEALTHCARE,
        size: 250000,
        growthRate: 0.12,
        profitability: 0.28,
        competitionLevel: CompetitionLevel.LOW,
        barriers: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
        keySuccessFactors: ['Clinical outcomes', 'Patient satisfaction', 'Insurance relationships']
      },

      // Retail Segments
      {
        id: 'specialty_retail',
        name: 'Specialty Retail',
        industry: BusinessIndustry.RETAIL,
        size: 350000,
        growthRate: 0.01,
        profitability: 0.18,
        competitionLevel: CompetitionLevel.HIGH,
        barriers: [BarrierToEntry.LOCATION_ADVANTAGES, BarrierToEntry.ECONOMIES_OF_SCALE],
        keySuccessFactors: ['Product selection', 'Customer service', 'Location', 'Pricing']
      }
    ];

    segments.forEach(segment => {
      this.marketSegments.set(segment.id, segment);
    });
  }

  /**
   * Initialize industry trends that affect market dynamics
   */
  private initializeIndustryTrends(): void {
    const trends: Record<BusinessIndustry, IndustryTrend[]> = {
      [BusinessIndustry.TECHNOLOGY]: [
        {
          name: 'AI/ML Adoption',
          impact: TrendImpact.VERY_POSITIVE,
          timeframe: TrendTimeframe.MEDIUM_TERM,
          description: 'Increasing demand for AI and machine learning solutions'
        },
        {
          name: 'Remote Work Technology',
          impact: TrendImpact.POSITIVE,
          timeframe: TrendTimeframe.SHORT_TERM,
          description: 'Growing need for remote collaboration tools'
        },
        {
          name: 'Cybersecurity Concerns',
          impact: TrendImpact.POSITIVE,
          timeframe: TrendTimeframe.LONG_TERM,
          description: 'Increased focus on security solutions'
        }
      ],
      [BusinessIndustry.FOOD_SERVICE]: [
        {
          name: 'Health-Conscious Eating',
          impact: TrendImpact.POSITIVE,
          timeframe: TrendTimeframe.LONG_TERM,
          description: 'Consumer preference for healthy, organic options'
        },
        {
          name: 'Delivery Services',
          impact: TrendImpact.NEGATIVE,
          timeframe: TrendTimeframe.SHORT_TERM,
          description: 'Competition from delivery platforms'
        },
        {
          name: 'Labor Shortages',
          impact: TrendImpact.NEGATIVE,
          timeframe: TrendTimeframe.MEDIUM_TERM,
          description: 'Difficulty finding and retaining staff'
        }
      ],
      [BusinessIndustry.PROFESSIONAL_SERVICES]: [
        {
          name: 'Automation of Basic Tasks',
          impact: TrendImpact.NEGATIVE,
          timeframe: TrendTimeframe.MEDIUM_TERM,
          description: 'Software automating routine professional tasks'
        },
        {
          name: 'Regulatory Complexity',
          impact: TrendImpact.POSITIVE,
          timeframe: TrendTimeframe.LONG_TERM,
          description: 'Increasing need for professional guidance'
        }
      ],
      [BusinessIndustry.HEALTHCARE]: [
        {
          name: 'Aging Population',
          impact: TrendImpact.VERY_POSITIVE,
          timeframe: TrendTimeframe.LONG_TERM,
          description: 'Growing demand for healthcare services'
        },
        {
          name: 'Telehealth Adoption',
          impact: TrendImpact.NEGATIVE,
          timeframe: TrendTimeframe.SHORT_TERM,
          description: 'Competition from remote healthcare delivery'
        }
      ],
      [BusinessIndustry.RETAIL]: [
        {
          name: 'E-commerce Growth',
          impact: TrendImpact.VERY_NEGATIVE,
          timeframe: TrendTimeframe.LONG_TERM,
          description: 'Shift to online shopping'
        },
        {
          name: 'Experience Economy',
          impact: TrendImpact.POSITIVE,
          timeframe: TrendTimeframe.MEDIUM_TERM,
          description: 'Consumer preference for experiential retail'
        }
      ],
      // Initialize other industries with empty arrays for now
      [BusinessIndustry.MANUFACTURING]: [],
      [BusinessIndustry.CONSTRUCTION]: [],
      [BusinessIndustry.TRANSPORTATION]: [],
      [BusinessIndustry.REAL_ESTATE]: [],
      [BusinessIndustry.FINANCE]: [],
      [BusinessIndustry.EDUCATION]: [],
      [BusinessIndustry.ENTERTAINMENT]: [],
      [BusinessIndustry.AGRICULTURE]: [],
      [BusinessIndustry.ENERGY]: [],
      [BusinessIndustry.TELECOMMUNICATIONS]: []
    };

    Object.entries(trends).forEach(([industry, trendList]) => {
      this.industryTrends.set(industry as BusinessIndustry, trendList);
    });
  }

  /**
   * Analyze market conditions for a specific industry and city
   */
  analyzeMarket(industry: BusinessIndustry, cityId: string, businesses: Business[]): MarketAnalysis {
    const marketKey = `${industry}-${cityId}`;
    
    // Filter businesses in this market
    const marketBusinesses = businesses.filter(b => 
      b.industry === industry && b.cityId === cityId
    );

    // Calculate market metrics
    const totalRevenue = marketBusinesses.reduce((sum, b) => sum + b.monthlyRevenue * 12, 0);
    const numberOfCompetitors = marketBusinesses.length;
    const averageMarketShare = numberOfCompetitors > 0 ? 1 / numberOfCompetitors : 0;
    
    // Calculate market concentration (Herfindahl-Hirschman Index)
    const marketShares = marketBusinesses.map(b => b.marketShare);
    const hhi = marketShares.reduce((sum, share) => sum + (share * share), 0);
    const marketConcentration = Math.min(1, hhi);

    // Estimate market size based on businesses and population
    const estimatedMarketSize = this.estimateMarketSize(industry, cityId, marketBusinesses);
    
    // Calculate growth rate based on business performance
    const marketGrowthRate = this.calculateMarketGrowthRate(marketBusinesses);

    // Analyze customer demographics (simplified)
    const targetDemographics = this.analyzeCustomerDemographics(industry);

    // Get industry trends
    const trends = this.industryTrends.get(industry) || [];

    // Determine barriers to entry
    const barriers = this.getIndustryBarriers(industry);

    const analysis: MarketAnalysis = {
      industry,
      cityId,
      totalMarketSize: estimatedMarketSize,
      addressableMarket: estimatedMarketSize * 0.8, // 80% addressable
      marketGrowthRate,
      numberOfCompetitors,
      marketConcentration,
      averageMarketShare,
      targetDemographics,
      customerSpending: this.estimateCustomerSpending(industry),
      customerLoyalty: this.estimateCustomerLoyalty(industry),
      industryTrends: trends,
      seasonality: this.getSeasonalityPattern(industry),
      barrierToEntry: barriers,
      regulatoryRequirements: this.getRegulatoryRequirements(industry)
    };

    this.marketAnalyses.set(marketKey, analysis);
    return analysis;
  }

  /**
   * Analyze competition between businesses
   */
  analyzeCompetition(business: Business, competitors: Business[]): CompetitorAnalysis[] {
    const analyses: CompetitorAnalysis[] = [];

    for (const competitor of competitors) {
      if (competitor.id === business.id) continue;

      // Calculate market overlap
      const marketOverlap = this.calculateMarketOverlap(business, competitor);
      
      // Calculate competition intensity
      const competitionIntensity = this.calculateCompetitionIntensity(business, competitor);
      
      // Identify competitive advantages and disadvantages
      const advantages = this.identifyCompetitiveAdvantages(business, competitor);
      const disadvantages = this.identifyCompetitiveDisadvantages(business, competitor);
      
      // Determine threat level
      const threatLevel = this.assessThreatLevel(competitionIntensity, marketOverlap, competitor);

      const analysis: CompetitorAnalysis = {
        businessId: business.id,
        competitorId: competitor.id,
        competitionIntensity,
        marketOverlap,
        competitiveAdvantages: advantages,
        competitiveDisadvantages: disadvantages,
        threatLevel
      };

      analyses.push(analysis);
    }

    this.competitorAnalyses.set(business.id, analyses);
    return analyses;
  }

  /**
   * Simulate competitive responses and market dynamics
   */
  simulateMarketDynamics(businesses: Business[]): BusinessEvent[] {
    const events: BusinessEvent[] = [];

    // Group businesses by industry and city
    const markets = this.groupBusinessesByMarket(businesses);

    for (const [marketKey, marketBusinesses] of markets.entries()) {
      const marketEvents = this.simulateMarketCompetition(marketBusinesses);
      events.push(...marketEvents);
    }

    return events;
  }

  /**
   * Simulate competition within a specific market
   */
  private simulateMarketCompetition(businesses: Business[]): BusinessEvent[] {
    const events: BusinessEvent[] = [];

    // Sort businesses by market share (largest first)
    const sortedBusinesses = [...businesses].sort((a, b) => b.marketShare - a.marketShare);

    for (let i = 0; i < sortedBusinesses.length; i++) {
      const business = sortedBusinesses[i];
      const competitors = sortedBusinesses.filter(b => b.id !== business.id);

      // Check for competitive threats
      const threats = this.identifyCompetitiveThreats(business, competitors);
      
      for (const threat of threats) {
        // Determine if business should respond
        if (this.shouldRespondToThreat(business, threat)) {
          const response = this.generateCompetitiveResponse(business, threat);
          
          if (response) {
            this.competitiveResponses.push(response);
            
            // Create business event
            const event: BusinessEvent = {
              id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              businessId: business.id,
              eventType: BusinessEventType.COMPETITOR_ENTERED,
              description: `${business.name} responded to competitive threat with ${response.responseType}`,
              impact: {
                financial: response.expectedImpact.revenueChange / 100,
                operational: 0.1,
                reputation: response.expectedImpact.reputationChange / 100,
                strategic: 0.2
              },
              timestamp: new Date(),
              isOngoing: true,
              endDate: new Date(Date.now() + response.duration * 30 * 24 * 60 * 60 * 1000)
            };

            events.push(event);
          }
        }
      }

      // Random market events
      if (Math.random() < 0.05) { // 5% chance per business per month
        const marketEvent = this.generateRandomMarketEvent(business);
        if (marketEvent) {
          events.push(marketEvent);
        }
      }
    }

    return events;
  }

  /**
   * Calculate market overlap between two businesses
   */
  private calculateMarketOverlap(business1: Business, business2: Business): number {
    let overlap = 0;

    // Same industry increases overlap
    if (business1.industry === business2.industry) {
      overlap += 0.6;
    }

    // Same city increases overlap
    if (business1.cityId === business2.cityId) {
      overlap += 0.3;
    }

    // Similar business model increases overlap
    if (business1.businessModel === business2.businessModel) {
      overlap += 0.1;
    }

    return Math.min(1, overlap);
  }

  /**
   * Calculate competition intensity between two businesses
   */
  private calculateCompetitionIntensity(business1: Business, business2: Business): number {
    let intensity = 0;

    // Market share differential
    const shareRatio = Math.min(business1.marketShare, business2.marketShare) / 
                      Math.max(business1.marketShare, business2.marketShare);
    intensity += shareRatio * 0.4;

    // Reputation competition
    const reputationDiff = Math.abs(business1.reputation - business2.reputation);
    intensity += (1 - reputationDiff) * 0.3;

    // Price competition (for similar products/services)
    if (business1.products.length > 0 && business2.products.length > 0) {
      const avgPrice1 = business1.products.reduce((sum, p) => sum + p.price, 0) / business1.products.length;
      const avgPrice2 = business2.products.reduce((sum, p) => sum + p.price, 0) / business2.products.length;
      const priceDiff = Math.abs(avgPrice1 - avgPrice2) / Math.max(avgPrice1, avgPrice2);
      intensity += (1 - priceDiff) * 0.3;
    }

    return Math.min(1, intensity);
  }

  /**
   * Identify competitive advantages of business1 over business2
   */
  private identifyCompetitiveAdvantages(business1: Business, business2: Business): string[] {
    const advantages: string[] = [];

    if (business1.reputation > business2.reputation + 0.1) {
      advantages.push('Superior reputation');
    }

    if (business1.marketShare > business2.marketShare + 0.05) {
      advantages.push('Larger market share');
    }

    if (business1.profitMargin > business2.profitMargin + 0.1) {
      advantages.push('Better profitability');
    }

    if (business1.employeeCount > business2.employeeCount) {
      advantages.push('Larger team');
    }

    if (business1.currentCapital > business2.currentCapital * 1.5) {
      advantages.push('Better financial position');
    }

    const avgQuality1 = business1.products.reduce((sum, p) => sum + p.quality, 0) / business1.products.length || 0;
    const avgQuality2 = business2.products.reduce((sum, p) => sum + p.quality, 0) / business2.products.length || 0;
    if (avgQuality1 > avgQuality2 + 0.1) {
      advantages.push('Higher product quality');
    }

    return advantages;
  }

  /**
   * Identify competitive disadvantages of business1 compared to business2
   */
  private identifyCompetitiveDisadvantages(business1: Business, business2: Business): string[] {
    const disadvantages: string[] = [];

    if (business1.reputation < business2.reputation - 0.1) {
      disadvantages.push('Lower reputation');
    }

    if (business1.marketShare < business2.marketShare - 0.05) {
      disadvantages.push('Smaller market share');
    }

    if (business1.profitMargin < business2.profitMargin - 0.1) {
      disadvantages.push('Lower profitability');
    }

    if (business1.employeeCount < business2.employeeCount) {
      disadvantages.push('Smaller team');
    }

    if (business1.currentCapital < business2.currentCapital * 0.5) {
      disadvantages.push('Weaker financial position');
    }

    const avgPrice1 = business1.products.reduce((sum, p) => sum + p.price, 0) / business1.products.length || 0;
    const avgPrice2 = business2.products.reduce((sum, p) => sum + p.price, 0) / business2.products.length || 0;
    if (avgPrice1 > avgPrice2 * 1.2) {
      disadvantages.push('Higher pricing');
    }

    return disadvantages;
  }

  /**
   * Assess threat level from a competitor
   */
  private assessThreatLevel(intensity: number, overlap: number, competitor: Business): CompetitionLevel {
    const threatScore = (intensity * 0.6 + overlap * 0.4) * 
                       (competitor.reputation + competitor.marketShare);

    if (threatScore > 0.8) return CompetitionLevel.INTENSE;
    if (threatScore > 0.6) return CompetitionLevel.HIGH;
    if (threatScore > 0.4) return CompetitionLevel.MODERATE;
    if (threatScore > 0.2) return CompetitionLevel.LOW;
    return CompetitionLevel.NONE;
  }

  // Helper methods for market analysis
  private estimateMarketSize(industry: BusinessIndustry, cityId: string, businesses: Business[]): number {
    // Base market size on industry and number of businesses
    const baseSize = this.getIndustryBaseSize(industry);
    const businessMultiplier = Math.max(1, businesses.length * 0.1);
    return baseSize * businessMultiplier;
  }

  private getIndustryBaseSize(industry: BusinessIndustry): number {
    const baseSizes: Record<BusinessIndustry, number> = {
      [BusinessIndustry.TECHNOLOGY]: 500000,
      [BusinessIndustry.FOOD_SERVICE]: 300000,
      [BusinessIndustry.PROFESSIONAL_SERVICES]: 400000,
      [BusinessIndustry.HEALTHCARE]: 600000,
      [BusinessIndustry.RETAIL]: 450000,
      [BusinessIndustry.MANUFACTURING]: 350000,
      [BusinessIndustry.CONSTRUCTION]: 250000,
      [BusinessIndustry.TRANSPORTATION]: 200000,
      [BusinessIndustry.REAL_ESTATE]: 300000,
      [BusinessIndustry.FINANCE]: 400000,
      [BusinessIndustry.EDUCATION]: 200000,
      [BusinessIndustry.ENTERTAINMENT]: 150000,
      [BusinessIndustry.AGRICULTURE]: 100000,
      [BusinessIndustry.ENERGY]: 500000,
      [BusinessIndustry.TELECOMMUNICATIONS]: 400000
    };

    return baseSizes[industry] || 200000;
  }

  private calculateMarketGrowthRate(businesses: Business[]): number {
    if (businesses.length === 0) return 0.03; // Default 3% growth

    const avgGrowth = businesses.reduce((sum, b) => {
      const metrics = b.monthlyMetrics.slice(-12); // Last 12 months
      if (metrics.length < 2) return sum;
      
      const firstRevenue = metrics[0].revenue;
      const lastRevenue = metrics[metrics.length - 1].revenue;
      const growth = firstRevenue > 0 ? (lastRevenue - firstRevenue) / firstRevenue : 0;
      return sum + growth;
    }, 0) / businesses.length;

    return Math.max(-0.2, Math.min(0.5, avgGrowth)); // Cap between -20% and 50%
  }

  private analyzeCustomerDemographics(industry: BusinessIndustry): any {
    // Simplified demographic analysis based on industry
    const demographics: Record<BusinessIndustry, any> = {
      [BusinessIndustry.TECHNOLOGY]: {
        ageGroups: { '25-34': 0.4, '35-44': 0.3, '45-54': 0.2, '18-24': 0.1 },
        incomeGroups: { 'upper_middle': 0.5, 'high': 0.3, 'middle': 0.2 },
        educationLevels: { 'bachelors': 0.4, 'masters': 0.4, 'doctorate': 0.2 },
        occupations: { 'technology': 0.6, 'management': 0.2, 'professional': 0.2 }
      },
      [BusinessIndustry.FOOD_SERVICE]: {
        ageGroups: { '18-24': 0.2, '25-34': 0.3, '35-44': 0.25, '45-54': 0.15, '55+': 0.1 },
        incomeGroups: { 'middle': 0.5, 'upper_middle': 0.3, 'lower_middle': 0.2 },
        educationLevels: { 'high_school': 0.3, 'bachelors': 0.4, 'masters': 0.3 },
        occupations: { 'professional': 0.4, 'service': 0.3, 'management': 0.3 }
      },
      // Add other industries as needed
      [BusinessIndustry.PROFESSIONAL_SERVICES]: {
        ageGroups: { '35-44': 0.4, '45-54': 0.3, '25-34': 0.2, '55+': 0.1 },
        incomeGroups: { 'upper_middle': 0.4, 'high': 0.4, 'middle': 0.2 },
        educationLevels: { 'bachelors': 0.3, 'masters': 0.4, 'professional': 0.3 },
        occupations: { 'management': 0.5, 'professional': 0.3, 'business_owner': 0.2 }
      }
    };

    return demographics[industry] || {
      ageGroups: { '25-44': 0.5, '45-64': 0.3, '18-24': 0.1, '65+': 0.1 },
      incomeGroups: { 'middle': 0.6, 'upper_middle': 0.3, 'high': 0.1 },
      educationLevels: { 'high_school': 0.4, 'bachelors': 0.4, 'masters': 0.2 },
      occupations: { 'professional': 0.5, 'service': 0.3, 'other': 0.2 }
    };
  }

  private estimateCustomerSpending(industry: BusinessIndustry): number {
    const spendingLevels: Record<BusinessIndustry, number> = {
      [BusinessIndustry.TECHNOLOGY]: 5000,
      [BusinessIndustry.HEALTHCARE]: 2000,
      [BusinessIndustry.PROFESSIONAL_SERVICES]: 3000,
      [BusinessIndustry.FOOD_SERVICE]: 1200,
      [BusinessIndustry.RETAIL]: 800,
      [BusinessIndustry.MANUFACTURING]: 10000,
      [BusinessIndustry.CONSTRUCTION]: 15000,
      [BusinessIndustry.TRANSPORTATION]: 500,
      [BusinessIndustry.REAL_ESTATE]: 20000,
      [BusinessIndustry.FINANCE]: 2000,
      [BusinessIndustry.EDUCATION]: 1500,
      [BusinessIndustry.ENTERTAINMENT]: 600,
      [BusinessIndustry.AGRICULTURE]: 1000,
      [BusinessIndustry.ENERGY]: 3000,
      [BusinessIndustry.TELECOMMUNICATIONS]: 1200
    };

    return spendingLevels[industry] || 1000;
  }

  private estimateCustomerLoyalty(industry: BusinessIndustry): number {
    const loyaltyLevels: Record<BusinessIndustry, number> = {
      [BusinessIndustry.HEALTHCARE]: 0.8,
      [BusinessIndustry.PROFESSIONAL_SERVICES]: 0.7,
      [BusinessIndustry.FINANCE]: 0.6,
      [BusinessIndustry.TECHNOLOGY]: 0.5,
      [BusinessIndustry.FOOD_SERVICE]: 0.4,
      [BusinessIndustry.RETAIL]: 0.3,
      [BusinessIndustry.MANUFACTURING]: 0.6,
      [BusinessIndustry.CONSTRUCTION]: 0.5,
      [BusinessIndustry.TRANSPORTATION]: 0.4,
      [BusinessIndustry.REAL_ESTATE]: 0.3,
      [BusinessIndustry.EDUCATION]: 0.7,
      [BusinessIndustry.ENTERTAINMENT]: 0.2,
      [BusinessIndustry.AGRICULTURE]: 0.5,
      [BusinessIndustry.ENERGY]: 0.6,
      [BusinessIndustry.TELECOMMUNICATIONS]: 0.4
    };

    return loyaltyLevels[industry] || 0.5;
  }

  private getSeasonalityPattern(industry: BusinessIndustry): any {
    const patterns: Record<BusinessIndustry, any> = {
      [BusinessIndustry.RETAIL]: { q1Multiplier: 0.8, q2Multiplier: 1.0, q3Multiplier: 1.1, q4Multiplier: 1.4 },
      [BusinessIndustry.FOOD_SERVICE]: { q1Multiplier: 0.9, q2Multiplier: 1.1, q3Multiplier: 1.2, q4Multiplier: 1.0 },
      [BusinessIndustry.CONSTRUCTION]: { q1Multiplier: 0.7, q2Multiplier: 1.2, q3Multiplier: 1.3, q4Multiplier: 0.8 },
      [BusinessIndustry.ENTERTAINMENT]: { q1Multiplier: 0.8, q2Multiplier: 1.0, q3Multiplier: 1.3, q4Multiplier: 1.2 }
    };

    return patterns[industry] || { q1Multiplier: 1.0, q2Multiplier: 1.0, q3Multiplier: 1.0, q4Multiplier: 1.0 };
  }

  private getIndustryBarriers(industry: BusinessIndustry): BarrierToEntry[] {
    const barriers: Record<BusinessIndustry, BarrierToEntry[]> = {
      [BusinessIndustry.TECHNOLOGY]: [BarrierToEntry.SPECIALIZED_KNOWLEDGE],
      [BusinessIndustry.HEALTHCARE]: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
      [BusinessIndustry.PROFESSIONAL_SERVICES]: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.SPECIALIZED_KNOWLEDGE],
      [BusinessIndustry.FOOD_SERVICE]: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.LOCATION_ADVANTAGES],
      [BusinessIndustry.RETAIL]: [BarrierToEntry.LOCATION_ADVANTAGES, BarrierToEntry.ECONOMIES_OF_SCALE],
      [BusinessIndustry.MANUFACTURING]: [BarrierToEntry.HIGH_CAPITAL_REQUIREMENTS, BarrierToEntry.ECONOMIES_OF_SCALE],
      [BusinessIndustry.FINANCE]: [BarrierToEntry.REGULATORY_APPROVAL, BarrierToEntry.HIGH_CAPITAL_REQUIREMENTS]
    };

    return barriers[industry] || [BarrierToEntry.ESTABLISHED_COMPETITION];
  }

  private getRegulatoryRequirements(industry: BusinessIndustry): string[] {
    const requirements: Record<BusinessIndustry, string[]> = {
      [BusinessIndustry.HEALTHCARE]: ['Medical licensing', 'HIPAA compliance', 'Insurance certification'],
      [BusinessIndustry.PROFESSIONAL_SERVICES]: ['Professional licensing', 'Continuing education', 'Ethics compliance'],
      [BusinessIndustry.FOOD_SERVICE]: ['Food safety certification', 'Health department permits', 'Liquor license'],
      [BusinessIndustry.FINANCE]: ['Financial services licensing', 'SEC compliance', 'Anti-money laundering'],
      [BusinessIndustry.CONSTRUCTION]: ['Contractor licensing', 'Building permits', 'Safety certifications']
    };

    return requirements[industry] || ['Business license', 'Tax registration'];
  }

  private groupBusinessesByMarket(businesses: Business[]): Map<string, Business[]> {
    const markets = new Map<string, Business[]>();

    for (const business of businesses) {
      const marketKey = `${business.industry}-${business.cityId}`;
      if (!markets.has(marketKey)) {
        markets.set(marketKey, []);
      }
      markets.get(marketKey)!.push(business);
    }

    return markets;
  }

  private identifyCompetitiveThreats(business: Business, competitors: Business[]): Business[] {
    return competitors.filter(competitor => {
      const analysis = this.analyzeCompetition(business, [competitor])[0];
      return analysis && (
        analysis.threatLevel === CompetitionLevel.HIGH || 
        analysis.threatLevel === CompetitionLevel.INTENSE
      );
    });
  }

  private shouldRespondToThreat(business: Business, threat: Business): boolean {
    // Business should respond if it has resources and the threat is significant
    const hasResources = business.currentCapital > business.monthlyExpenses * 2;
    const significantThreat = threat.marketShare > business.marketShare * 0.5;
    const reputationThreat = threat.reputation > business.reputation + 0.2;

    return hasResources && (significantThreat || reputationThreat) && Math.random() < 0.3;
  }

  private generateCompetitiveResponse(business: Business, threat: Business): CompetitiveResponse | null {
    const responses: ResponseType[] = [
      ResponseType.MARKETING_CAMPAIGN,
      ResponseType.QUALITY_IMPROVEMENT,
      ResponseType.PRICE_CUT,
      ResponseType.SERVICE_ENHANCEMENT
    ];

    const responseType = responses[Math.floor(Math.random() * responses.length)];
    const cost = business.currentCapital * 0.1; // 10% of capital

    if (cost > business.currentCapital * 0.2) return null; // Too expensive

    return {
      businessId: business.id,
      responseType,
      targetCompetitor: threat.id,
      description: `Competitive response to ${threat.name}`,
      cost,
      expectedImpact: {
        revenueChange: 5 + Math.random() * 10, // 5-15% revenue increase
        marketShareChange: 2 + Math.random() * 5, // 2-7% market share increase
        reputationChange: 1 + Math.random() * 3, // 1-4% reputation increase
        costChange: 10 + Math.random() * 5 // 10-15% cost increase
      },
      duration: 3 + Math.floor(Math.random() * 6) // 3-8 months
    };
  }

  private generateRandomMarketEvent(business: Business): BusinessEvent | null {
    const eventTypes = [
      BusinessEventType.MAJOR_CONTRACT,
      BusinessEventType.LOST_CONTRACT,
      BusinessEventType.COMPETITOR_ENTERED,
      BusinessEventType.REGULATORY_CHANGE,
      BusinessEventType.TECHNOLOGY_DISRUPTION
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isPositive = [BusinessEventType.MAJOR_CONTRACT].includes(eventType);

    return {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      businessId: business.id,
      eventType,
      description: `Random market event: ${eventType}`,
      impact: {
        financial: isPositive ? 0.1 + Math.random() * 0.2 : -0.1 - Math.random() * 0.2,
        operational: isPositive ? 0.05 : -0.05,
        reputation: isPositive ? 0.05 : -0.05,
        strategic: isPositive ? 0.1 : -0.1
      },
      timestamp: new Date(),
      isOngoing: false
    };
  }

  // Getter methods
  getMarketAnalysis(industry: BusinessIndustry, cityId: string): MarketAnalysis | undefined {
    return this.marketAnalyses.get(`${industry}-${cityId}`);
  }

  getCompetitorAnalyses(businessId: string): CompetitorAnalysis[] {
    return this.competitorAnalyses.get(businessId) || [];
  }

  getMarketSegments(): MarketSegment[] {
    return Array.from(this.marketSegments.values());
  }

  getIndustryTrends(industry: BusinessIndustry): IndustryTrend[] {
    return this.industryTrends.get(industry) || [];
  }

  getCompetitiveResponses(businessId?: string): CompetitiveResponse[] {
    if (businessId) {
      return this.competitiveResponses.filter(r => r.businessId === businessId);
    }
    return this.competitiveResponses;
  }
}
