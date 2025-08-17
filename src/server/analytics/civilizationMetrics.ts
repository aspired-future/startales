/**
 * Civilization Analytics & Metrics System
 * Task 45: Economic inequality visualization and social mobility tracking
 * 
 * Provides comprehensive analytics for civilization development including:
 * - Economic inequality measurement (Gini coefficient)
 * - Social mobility tracking
 * - Population demographics analysis
 * - Economic health scoring
 * - Historical trend analysis
 */

import { db } from '../storage/db.js';

export interface EconomicMetrics {
  giniCoefficient: number;
  economicHealth: number;
  povertyRate: number;
  middleClassRate: number;
  wealthRate: number;
  socialMobilityIndex: number;
  averageIncome: number;
  incomeDistribution: {
    poor: { percentage: number; averageIncome: number };
    median: { percentage: number; averageIncome: number };
    rich: { percentage: number; averageIncome: number };
  };
}

export interface SocialMobilityMetrics {
  upwardMobility: number;
  downwardMobility: number;
  mobilityEvents: {
    education: number;
    business: number;
    inheritance: number;
    disaster: number;
  };
  generationalMobility: number;
  educationImpact: number;
}

export interface PopulationDemographics {
  totalPopulation: number;
  ageDistribution: {
    young: number;
    adult: number;
    elderly: number;
  };
  educationLevels: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  employmentRate: number;
  urbanizationRate: number;
}

export interface CivilizationAnalytics {
  campaignId: number;
  timestamp: string;
  step: number;
  economic: EconomicMetrics;
  socialMobility: SocialMobilityMetrics;
  demographics: PopulationDemographics;
  trends: {
    economicGrowth: number[];
    inequalityTrend: number[];
    mobilityTrend: number[];
  };
  recommendations: string[];
}

export class CivilizationMetricsService {
  /**
   * Calculate comprehensive civilization analytics
   */
  async calculateCivilizationMetrics(campaignId: number): Promise<CivilizationAnalytics> {
    const economic = await this.calculateEconomicMetrics(campaignId);
    const socialMobility = await this.calculateSocialMobilityMetrics(campaignId);
    const demographics = await this.calculatePopulationDemographics(campaignId);
    const trends = await this.calculateTrends(campaignId);
    const recommendations = this.generateRecommendations(economic, socialMobility, demographics);

    return {
      campaignId,
      timestamp: new Date().toISOString(),
      step: await this.getCurrentStep(campaignId),
      economic,
      socialMobility,
      demographics,
      trends,
      recommendations
    };
  }

  /**
   * Calculate economic inequality and health metrics
   */
  private async calculateEconomicMetrics(campaignId: number): Promise<EconomicMetrics> {
    try {
      // Get household tier distribution
      const tierQuery = `
        SELECT tier, COUNT(*) as count, AVG(income) as avg_income
        FROM household_tiers 
        WHERE campaign_id = ? 
        GROUP BY tier
      `;
      const tierData = await db.all(tierQuery, [campaignId]);

      const totalHouseholds = tierData.reduce((sum, tier) => sum + tier.count, 0);
      
      // Calculate distribution percentages
      const distribution = {
        poor: tierData.find(t => t.tier === 'poor') || { count: 0, avg_income: 0 },
        median: tierData.find(t => t.tier === 'median') || { count: 0, avg_income: 0 },
        rich: tierData.find(t => t.tier === 'rich') || { count: 0, avg_income: 0 }
      };

      const povertyRate = (distribution.poor.count / totalHouseholds) * 100;
      const middleClassRate = (distribution.median.count / totalHouseholds) * 100;
      const wealthRate = (distribution.rich.count / totalHouseholds) * 100;

      // Calculate Gini coefficient (simplified)
      const giniCoefficient = this.calculateGiniCoefficient(tierData);
      
      // Economic health score (0-100)
      const economicHealth = this.calculateEconomicHealth(giniCoefficient, povertyRate, middleClassRate);
      
      // Social mobility index
      const socialMobilityIndex = await this.calculateSocialMobilityIndex(campaignId);
      
      // Average income
      const totalIncome = tierData.reduce((sum, tier) => sum + (tier.avg_income * tier.count), 0);
      const averageIncome = totalIncome / totalHouseholds;

      return {
        giniCoefficient,
        economicHealth,
        povertyRate,
        middleClassRate,
        wealthRate,
        socialMobilityIndex,
        averageIncome,
        incomeDistribution: {
          poor: {
            percentage: povertyRate,
            averageIncome: distribution.poor.avg_income
          },
          median: {
            percentage: middleClassRate,
            averageIncome: distribution.median.avg_income
          },
          rich: {
            percentage: wealthRate,
            averageIncome: distribution.rich.avg_income
          }
        }
      };
    } catch (error) {
      console.error('Error calculating economic metrics:', error);
      // Return default metrics
      return {
        giniCoefficient: 0.4,
        economicHealth: 50,
        povertyRate: 40,
        middleClassRate: 50,
        wealthRate: 10,
        socialMobilityIndex: 0.3,
        averageIncome: 50000,
        incomeDistribution: {
          poor: { percentage: 40, averageIncome: 25000 },
          median: { percentage: 50, averageIncome: 50000 },
          rich: { percentage: 10, averageIncome: 150000 }
        }
      };
    }
  }

  /**
   * Calculate social mobility metrics
   */
  private async calculateSocialMobilityMetrics(campaignId: number): Promise<SocialMobilityMetrics> {
    try {
      // Get mobility events
      const eventsQuery = `
        SELECT event_type, outcome, COUNT(*) as count
        FROM social_mobility_events 
        WHERE campaign_id = ? 
        GROUP BY event_type, outcome
      `;
      const events = await db.all(eventsQuery, [campaignId]);

      const mobilityEvents = {
        education: events.filter(e => e.event_type === 'education').reduce((sum, e) => sum + e.count, 0),
        business: events.filter(e => e.event_type === 'business_opportunity').reduce((sum, e) => sum + e.count, 0),
        inheritance: events.filter(e => e.event_type === 'inheritance').reduce((sum, e) => sum + e.count, 0),
        disaster: events.filter(e => e.event_type === 'economic_disaster').reduce((sum, e) => sum + e.count, 0)
      };

      // Calculate mobility rates
      const successfulEvents = events.filter(e => e.outcome === 'success').reduce((sum, e) => sum + e.count, 0);
      const totalEvents = events.reduce((sum, e) => sum + e.count, 0);
      
      const upwardMobility = totalEvents > 0 ? (successfulEvents / totalEvents) * 100 : 0;
      const downwardMobility = totalEvents > 0 ? ((totalEvents - successfulEvents) / totalEvents) * 100 : 0;

      // Education impact (percentage of successful education events)
      const educationEvents = events.filter(e => e.event_type === 'education');
      const successfulEducation = educationEvents.filter(e => e.outcome === 'success').reduce((sum, e) => sum + e.count, 0);
      const totalEducation = educationEvents.reduce((sum, e) => sum + e.count, 0);
      const educationImpact = totalEducation > 0 ? (successfulEducation / totalEducation) * 100 : 0;

      return {
        upwardMobility,
        downwardMobility,
        mobilityEvents,
        generationalMobility: upwardMobility * 0.8, // Simplified calculation
        educationImpact
      };
    } catch (error) {
      console.error('Error calculating social mobility metrics:', error);
      return {
        upwardMobility: 15,
        downwardMobility: 10,
        mobilityEvents: {
          education: 50,
          business: 30,
          inheritance: 10,
          disaster: 5
        },
        generationalMobility: 12,
        educationImpact: 65
      };
    }
  }

  /**
   * Calculate population demographics
   */
  private async calculatePopulationDemographics(campaignId: number): Promise<PopulationDemographics> {
    try {
      // Get total population from campaign state
      const campaignQuery = `
        SELECT total_population, urbanization_rate, employment_rate
        FROM campaigns 
        WHERE id = ?
      `;
      const campaign = await db.get(campaignQuery, [campaignId]);

      const totalPopulation = campaign?.total_population || 1000;

      // Simulated demographics (in real implementation, these would come from detailed population data)
      return {
        totalPopulation,
        ageDistribution: {
          young: Math.floor(totalPopulation * 0.25),
          adult: Math.floor(totalPopulation * 0.65),
          elderly: Math.floor(totalPopulation * 0.10)
        },
        educationLevels: {
          basic: Math.floor(totalPopulation * 0.50),
          intermediate: Math.floor(totalPopulation * 0.35),
          advanced: Math.floor(totalPopulation * 0.15)
        },
        employmentRate: campaign?.employment_rate || 85,
        urbanizationRate: campaign?.urbanization_rate || 60
      };
    } catch (error) {
      console.error('Error calculating demographics:', error);
      return {
        totalPopulation: 1000,
        ageDistribution: { young: 250, adult: 650, elderly: 100 },
        educationLevels: { basic: 500, intermediate: 350, advanced: 150 },
        employmentRate: 85,
        urbanizationRate: 60
      };
    }
  }

  /**
   * Calculate historical trends
   */
  private async calculateTrends(campaignId: number): Promise<{ economicGrowth: number[]; inequalityTrend: number[]; mobilityTrend: number[] }> {
    try {
      // Get historical data (last 10 steps)
      const historyQuery = `
        SELECT step, economic_health, gini_coefficient, social_mobility_index
        FROM civilization_analytics_history 
        WHERE campaign_id = ? 
        ORDER BY step DESC 
        LIMIT 10
      `;
      const history = await db.all(historyQuery, [campaignId]);

      return {
        economicGrowth: history.map(h => h.economic_health || 50).reverse(),
        inequalityTrend: history.map(h => h.gini_coefficient || 0.4).reverse(),
        mobilityTrend: history.map(h => h.social_mobility_index || 0.3).reverse()
      };
    } catch (error) {
      console.error('Error calculating trends:', error);
      return {
        economicGrowth: [45, 47, 50, 52, 50],
        inequalityTrend: [0.42, 0.41, 0.40, 0.39, 0.40],
        mobilityTrend: [0.28, 0.30, 0.32, 0.31, 0.30]
      };
    }
  }

  /**
   * Generate policy recommendations based on metrics
   */
  private generateRecommendations(
    economic: EconomicMetrics,
    socialMobility: SocialMobilityMetrics,
    demographics: PopulationDemographics
  ): string[] {
    const recommendations: string[] = [];

    // Economic inequality recommendations
    if (economic.giniCoefficient > 0.45) {
      recommendations.push("High inequality detected. Consider progressive taxation or wealth redistribution policies.");
    }

    if (economic.povertyRate > 30) {
      recommendations.push("High poverty rate. Implement social safety nets and job creation programs.");
    }

    // Social mobility recommendations
    if (socialMobility.upwardMobility < 20) {
      recommendations.push("Low social mobility. Invest in education and skills training programs.");
    }

    if (socialMobility.educationImpact < 50) {
      recommendations.push("Education system underperforming. Reform educational policies and increase funding.");
    }

    // Demographics recommendations
    if (demographics.employmentRate < 80) {
      recommendations.push("Low employment rate. Create job opportunities and economic stimulus programs.");
    }

    if (demographics.educationLevels.advanced / demographics.totalPopulation < 0.10) {
      recommendations.push("Low advanced education levels. Invest in higher education and research institutions.");
    }

    // Default recommendation if no issues
    if (recommendations.length === 0) {
      recommendations.push("Civilization metrics are healthy. Continue current policies and monitor trends.");
    }

    return recommendations;
  }

  /**
   * Calculate Gini coefficient for income inequality
   */
  private calculateGiniCoefficient(tierData: any[]): number {
    // Simplified Gini calculation based on tier distribution
    const poor = tierData.find(t => t.tier === 'poor')?.count || 0;
    const median = tierData.find(t => t.tier === 'median')?.count || 0;
    const rich = tierData.find(t => t.tier === 'rich')?.count || 0;
    const total = poor + median + rich;

    if (total === 0) return 0.4; // Default moderate inequality

    const poorPct = poor / total;
    const medianPct = median / total;
    const richPct = rich / total;

    // Simplified Gini approximation
    return 0.2 + (richPct * 0.4) + (poorPct * 0.2);
  }

  /**
   * Calculate economic health score (0-100)
   */
  private calculateEconomicHealth(giniCoefficient: number, povertyRate: number, middleClassRate: number): number {
    // Higher middle class = better health
    // Lower inequality = better health
    // Lower poverty = better health
    
    const inequalityScore = Math.max(0, 100 - (giniCoefficient * 200)); // 0.5 Gini = 0 score
    const povertyScore = Math.max(0, 100 - (povertyRate * 2)); // 50% poverty = 0 score
    const middleClassScore = middleClassRate * 2; // 50% middle class = 100 score

    return Math.min(100, (inequalityScore + povertyScore + middleClassScore) / 3);
  }

  /**
   * Calculate social mobility index
   */
  private async calculateSocialMobilityIndex(campaignId: number): Promise<number> {
    try {
      const query = `
        SELECT 
          COUNT(CASE WHEN outcome = 'success' THEN 1 END) as successes,
          COUNT(*) as total
        FROM social_mobility_events 
        WHERE campaign_id = ?
      `;
      const result = await db.get(query, [campaignId]);
      
      if (!result || result.total === 0) return 0.3; // Default moderate mobility
      
      return result.successes / result.total;
    } catch (error) {
      console.error('Error calculating social mobility index:', error);
      return 0.3;
    }
  }

  /**
   * Get current campaign step
   */
  private async getCurrentStep(campaignId: number): Promise<number> {
    try {
      const query = `SELECT step FROM campaigns WHERE id = ?`;
      const result = await db.get(query, [campaignId]);
      return result?.step || 1;
    } catch (error) {
      console.error('Error getting current step:', error);
      return 1;
    }
  }

  /**
   * Store analytics in history for trend analysis
   */
  async storeAnalyticsHistory(analytics: CivilizationAnalytics): Promise<void> {
    try {
      const query = `
        INSERT OR REPLACE INTO civilization_analytics_history 
        (campaign_id, step, timestamp, economic_health, gini_coefficient, social_mobility_index, analytics_data)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await db.run(query, [
        analytics.campaignId,
        analytics.step,
        analytics.timestamp,
        analytics.economic.economicHealth,
        analytics.economic.giniCoefficient,
        analytics.economic.socialMobilityIndex,
        JSON.stringify(analytics)
      ]);
    } catch (error) {
      console.error('Error storing analytics history:', error);
    }
  }
}

export const civilizationMetrics = new CivilizationMetricsService();
