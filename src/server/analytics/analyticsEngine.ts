import { CampaignState } from '../../simulation/engine/engine';
import { TradeAnalytics } from '../trade/tradeEngine';
import { PolicyStorage } from '../policies/policyStorage';

export interface KPISnapshot {
  step: number;
  timestamp: Date;
  campaignId: number;
  
  // Core Empire KPIs
  population: number;
  gdp: number;
  gdpGrowthRate: number;
  credits: number;
  creditGrowthRate: number;
  
  // Resource KPIs
  totalResources: number;
  resourceDiversity: number; // Number of different resource types
  resourceEfficiency: number; // Resources per building
  
  // Infrastructure KPIs
  totalBuildings: number;
  infrastructureIndex: number; // Weighted building value
  developmentLevel: 'primitive' | 'developing' | 'advanced' | 'futuristic';
  
  // Economic KPIs
  tradeVolume: number;
  tradeBalance: number;
  marketIndices: {
    rawMaterials: number;
    manufactured: number;
    overall: number;
  };
  
  // Governance KPIs
  activePolicies: number;
  policyEffectiveness: number;
  stabilityIndex: number;
  
  // Research & Innovation KPIs
  researchPoints: number;
  researchRate: number;
  innovationIndex: number;
  
  // Military & Security KPIs
  militaryStrength: number;
  defenseIndex: number;
  securityLevel: number;
  
  // Social KPIs
  populationGrowth: number;
  satisfactionIndex: number;
  educationLevel: number;
  healthIndex: number;
}

export interface TrendAnalysis {
  period: number; // Number of steps analyzed
  startStep: number;
  endStep: number;
  
  trends: {
    [key: string]: {
      direction: 'rising' | 'falling' | 'stable' | 'volatile';
      magnitude: number; // Percentage change
      confidence: number; // 0-1, how reliable the trend is
      velocity: number; // Rate of change per step
      acceleration: number; // Change in velocity
    };
  };
  
  correlations: Array<{
    kpi1: string;
    kpi2: string;
    correlation: number; // -1 to 1
    significance: number; // 0-1
  }>;
  
  insights: Array<{
    type: 'growth' | 'decline' | 'correlation' | 'anomaly' | 'milestone';
    message: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    kpis: string[];
    confidence: number;
  }>;
}

export interface EmpireAnalytics {
  currentSnapshot: KPISnapshot;
  trendAnalysis: TrendAnalysis;
  comparisons: {
    previousStep: Partial<KPISnapshot>;
    stepChanges: Record<string, number>;
    percentChanges: Record<string, number>;
  };
  rankings: {
    topKPIs: Array<{ kpi: string; value: number; rank: 'excellent' | 'good' | 'average' | 'poor' }>;
    improvementAreas: Array<{ kpi: string; issue: string; suggestion: string }>;
  };
  projections: {
    shortTerm: Partial<KPISnapshot>; // Next 5 steps
    mediumTerm: Partial<KPISnapshot>; // Next 20 steps
  };
}

/**
 * Analytics engine for computing KPIs, trends, and empire analytics
 */
export class AnalyticsEngine {
  
  /**
   * Compute comprehensive KPI snapshot for a campaign state
   */
  static async computeKPISnapshot(
    campaignState: CampaignState,
    campaignId: number,
    tradeAnalytics?: TradeAnalytics
  ): Promise<KPISnapshot> {
    
    // Core Empire KPIs
    const population = this.calculatePopulation(campaignState);
    const gdp = this.calculateGDP(campaignState, tradeAnalytics);
    const credits = campaignState.resources.credits || 0;
    
    // Resource KPIs
    const totalResources = this.calculateTotalResources(campaignState);
    const resourceDiversity = Object.keys(campaignState.resources).length;
    const resourceEfficiency = totalResources / Math.max(1, this.calculateTotalBuildings(campaignState));
    
    // Infrastructure KPIs
    const totalBuildings = this.calculateTotalBuildings(campaignState);
    const infrastructureIndex = this.calculateInfrastructureIndex(campaignState);
    const developmentLevel = this.calculateDevelopmentLevel(campaignState);
    
    // Economic KPIs
    const tradeVolume = tradeAnalytics?.totalTradeVolume || 0;
    const tradeBalance = tradeAnalytics?.tradeBalance || 0;
    const marketIndices = tradeAnalytics?.priceIndices
      ? {
          rawMaterials: tradeAnalytics.priceIndices.rawMaterialsIndex,
          manufactured: tradeAnalytics.priceIndices.manufacturedIndex,
          overall: tradeAnalytics.priceIndices.overallIndex
        }
      : { rawMaterials: 0, manufactured: 0, overall: 0 };
    
    // Governance KPIs
    const activePolicies = tradeAnalytics ? await this.getActivePoliciesCount(campaignId) : 0;
    const policyEffectiveness = this.calculatePolicyEffectiveness(campaignState);
    const stabilityIndex = this.calculateStabilityIndex(campaignState);
    
    // Research & Innovation KPIs
    const researchPoints = campaignState.kpis?.research_points || 0;
    const researchRate = this.calculateResearchRate(campaignState);
    const innovationIndex = this.calculateInnovationIndex(campaignState);
    
    // Military & Security KPIs
    const militaryStrength = this.calculateMilitaryStrength(campaignState);
    const defenseIndex = this.calculateDefenseIndex(campaignState);
    const securityLevel = this.calculateSecurityLevel(campaignState);
    
    // Social KPIs
    const populationGrowth = this.calculatePopulationGrowth(campaignState);
    const satisfactionIndex = this.calculateSatisfactionIndex(campaignState);
    const educationLevel = this.calculateEducationLevel(campaignState);
    const healthIndex = this.calculateHealthIndex(campaignState);
    
    return {
      step: campaignState.step,
      timestamp: new Date(),
      campaignId,
      
      // Core Empire KPIs
      population,
      gdp,
      gdpGrowthRate: 0, // Will be calculated in trend analysis
      credits,
      creditGrowthRate: 0, // Will be calculated in trend analysis
      
      // Resource KPIs
      totalResources,
      resourceDiversity,
      resourceEfficiency,
      
      // Infrastructure KPIs
      totalBuildings,
      infrastructureIndex,
      developmentLevel,
      
      // Economic KPIs
      tradeVolume,
      tradeBalance,
      marketIndices,
      
      // Governance KPIs
      activePolicies,
      policyEffectiveness,
      stabilityIndex,
      
      // Research & Innovation KPIs
      researchPoints,
      researchRate,
      innovationIndex,
      
      // Military & Security KPIs
      militaryStrength,
      defenseIndex,
      securityLevel,
      
      // Social KPIs
      populationGrowth,
      satisfactionIndex,
      educationLevel,
      healthIndex
    };
  }
  
  /**
   * Analyze trends from historical KPI snapshots
   */
  static analyzeTrends(snapshots: KPISnapshot[]): TrendAnalysis {
    if (snapshots.length < 2) {
      return {
        period: 0,
        startStep: 0,
        endStep: 0,
        trends: {},
        correlations: [],
        insights: []
      };
    }
    
    const sortedSnapshots = snapshots.sort((a, b) => a.step - b.step);
    const startStep = sortedSnapshots[0].step;
    const endStep = sortedSnapshots[sortedSnapshots.length - 1].step;
    const period = endStep - startStep;
    
    // Calculate trends for each KPI
    const trends: TrendAnalysis['trends'] = {};
    const kpiKeys = Object.keys(sortedSnapshots[0]).filter(key => 
      typeof sortedSnapshots[0][key as keyof KPISnapshot] === 'number' && 
      key !== 'step' && key !== 'campaignId'
    );
    
    for (const kpi of kpiKeys) {
      const values = sortedSnapshots.map(s => s[kpi as keyof KPISnapshot] as number);
      trends[kpi] = this.calculateTrend(values);
    }
    
    // Calculate correlations
    const correlations = this.calculateCorrelations(sortedSnapshots, kpiKeys);
    
    // Generate insights
    const insights = this.generateInsights(trends, correlations, sortedSnapshots);
    
    return {
      period,
      startStep,
      endStep,
      trends,
      correlations,
      insights
    };
  }
  
  /**
   * Generate comprehensive empire analytics
   */
  static async generateEmpireAnalytics(
    currentSnapshot: KPISnapshot,
    historicalSnapshots: KPISnapshot[]
  ): Promise<EmpireAnalytics> {
    
    const trendAnalysis = this.analyzeTrends(historicalSnapshots);
    
    // Calculate comparisons
    const previousSnapshot = historicalSnapshots.length > 1 ? 
      historicalSnapshots[historicalSnapshots.length - 2] : null;
    
    const stepChanges: Record<string, number> = {};
    const percentChanges: Record<string, number> = {};
    
    if (previousSnapshot) {
      const kpiKeys = Object.keys(currentSnapshot).filter(key => 
        typeof currentSnapshot[key as keyof KPISnapshot] === 'number' && 
        key !== 'step' && key !== 'campaignId'
      );
      
      for (const kpi of kpiKeys) {
        const current = currentSnapshot[kpi as keyof KPISnapshot] as number;
        const previous = previousSnapshot[kpi as keyof KPISnapshot] as number;
        stepChanges[kpi] = current - previous;
        percentChanges[kpi] = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
      }
    }
    
    // Generate rankings
    const rankings = this.generateRankings(currentSnapshot, trendAnalysis);
    
    // Generate projections
    const projections = this.generateProjections(currentSnapshot, trendAnalysis);
    
    return {
      currentSnapshot,
      trendAnalysis,
      comparisons: {
        previousStep: previousSnapshot || {},
        stepChanges,
        percentChanges
      },
      rankings,
      projections
    };
  }
  
  // Private calculation methods
  
  private static calculatePopulation(state: CampaignState): number {
    // Base population + building-based population
    const basePopulation = 1000;
    const buildingPopulation = Object.values(state.buildings).reduce((sum, count) => sum + count * 150, 0);
    return basePopulation + buildingPopulation;
  }
  
  private static calculateGDP(state: CampaignState, tradeAnalytics?: TradeAnalytics): number {
    // GDP = Production + Trade + Services
    const production = Object.values(state.buildings).reduce((sum, count) => sum + count * 1000, 0);
    const trade = tradeAnalytics?.totalTradeVolume || 0;
    const services = this.calculatePopulation(state) * 2; // Service sector
    return production + trade + services;
  }
  
  private static calculateTotalResources(state: CampaignState): number {
    return Object.values(state.resources).reduce((sum, amount) => sum + amount, 0);
  }
  
  private static calculateTotalBuildings(state: CampaignState): number {
    return Object.values(state.buildings).reduce((sum, count) => sum + count, 0);
  }
  
  private static calculateInfrastructureIndex(state: CampaignState): number {
    // Weighted sum of buildings by importance
    const weights = {
      mine: 1.0,
      factory: 1.5,
      farm: 1.0,
      power_plant: 2.0,
      research_lab: 2.5,
      spaceport: 3.0,
      defense_station: 1.5
    };
    
    return Object.entries(state.buildings).reduce((sum, [type, count]) => {
      const weight = weights[type as keyof typeof weights] || 1.0;
      return sum + (count * weight * 100);
    }, 0);
  }
  
  private static calculateDevelopmentLevel(state: CampaignState): KPISnapshot['developmentLevel'] {
    const infraIndex = this.calculateInfrastructureIndex(state);
    
    if (infraIndex < 500) return 'primitive';
    if (infraIndex < 2000) return 'developing';
    if (infraIndex < 5000) return 'advanced';
    return 'futuristic';
  }
  
  private static async getActivePoliciesCount(campaignId: number): Promise<number> {
    try {
      const policies = await PolicyStorage.getPoliciesForCampaign(campaignId, 'active');
      return policies.length;
    } catch {
      return 0;
    }
  }
  
  private static calculatePolicyEffectiveness(state: CampaignState): number {
    // Simple effectiveness based on KPI performance
    const kpis = state.kpis || {};
    const avgKPI = Object.values(kpis).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) / 
                  Math.max(1, Object.keys(kpis).length);
    return Math.min(100, Math.max(0, avgKPI / 10));
  }
  
  private static calculateStabilityIndex(state: CampaignState): number {
    // Stability based on resource balance and building diversity
    const resourceBalance = Math.min(100, this.calculateTotalResources(state) / 100);
    const buildingDiversity = Object.keys(state.buildings).length * 10;
    return Math.min(100, (resourceBalance + buildingDiversity) / 2);
  }
  
  private static calculateResearchRate(state: CampaignState): number {
    const researchLabs = state.buildings.research_lab || 0;
    return researchLabs * 10; // 10 research points per lab per step
  }
  
  private static calculateInnovationIndex(state: CampaignState): number {
    const researchPoints = state.kpis?.research_points || 0;
    const techBuildings = (state.buildings.research_lab || 0) + (state.buildings.spaceport || 0);
    return Math.min(100, (researchPoints / 10) + (techBuildings * 5));
  }
  
  private static calculateMilitaryStrength(state: CampaignState): number {
    const defenseStations = state.buildings.defense_station || 0;
    const population = this.calculatePopulation(state);
    return (defenseStations * 500) + (population * 0.1); // Military strength from defense + population
  }
  
  private static calculateDefenseIndex(state: CampaignState): number {
    const defenseStations = state.buildings.defense_station || 0;
    const totalBuildings = this.calculateTotalBuildings(state);
    return Math.min(100, (defenseStations / Math.max(1, totalBuildings)) * 100);
  }
  
  private static calculateSecurityLevel(state: CampaignState): number {
    const defenseIndex = this.calculateDefenseIndex(state);
    const stabilityIndex = this.calculateStabilityIndex(state);
    return (defenseIndex + stabilityIndex) / 2;
  }
  
  private static calculatePopulationGrowth(state: CampaignState): number {
    // Growth rate based on infrastructure and resources
    const infraIndex = this.calculateInfrastructureIndex(state);
    const resourcesPerCapita = this.calculateTotalResources(state) / this.calculatePopulation(state);
    return Math.min(10, (infraIndex / 1000) + (resourcesPerCapita / 10));
  }
  
  private static calculateSatisfactionIndex(state: CampaignState): number {
    // Satisfaction based on resources, infrastructure, and stability
    const resourcesPerCapita = this.calculateTotalResources(state) / this.calculatePopulation(state);
    const infraLevel = this.calculateInfrastructureIndex(state) / 100;
    const stability = this.calculateStabilityIndex(state);
    return Math.min(100, (resourcesPerCapita * 2) + (infraLevel / 10) + (stability / 2));
  }
  
  private static calculateEducationLevel(state: CampaignState): number {
    const researchLabs = state.buildings.research_lab || 0;
    const population = this.calculatePopulation(state);
    return Math.min(100, (researchLabs / (population / 1000)) * 100);
  }
  
  private static calculateHealthIndex(state: CampaignState): number {
    // Health based on food, infrastructure, and population density
    const food = state.resources.food || 0;
    const population = this.calculatePopulation(state);
    const foodPerCapita = food / population;
    const infraLevel = this.calculateInfrastructureIndex(state) / 100;
    return Math.min(100, (foodPerCapita * 100) + (infraLevel / 50));
  }
  
  private static calculateTrend(values: number[]): TrendAnalysis['trends'][string] {
    if (values.length < 2) {
      return {
        direction: 'stable',
        magnitude: 0,
        confidence: 0,
        velocity: 0,
        acceleration: 0
      };
    }
    
    // Linear regression to find trend
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared for confidence
    const yMean = sumY / n;
    const ssRes = values.reduce((sum, yi, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
    
    // Determine direction and magnitude
    const magnitude = Math.abs((values[n - 1] - values[0]) / Math.max(1, values[0])) * 100;
    let direction: 'rising' | 'falling' | 'stable' | 'volatile' = 'stable';
    
    if (magnitude > 20) {
      direction = 'volatile';
    } else if (slope > 0.1) {
      direction = 'rising';
    } else if (slope < -0.1) {
      direction = 'falling';
    }
    
    // Calculate acceleration (change in slope)
    let acceleration = 0;
    if (values.length >= 3) {
      const midPoint = Math.floor(n / 2);
      const firstHalf = values.slice(0, midPoint);
      const secondHalf = values.slice(midPoint);
      
      const firstSlope = this.calculateSlope(firstHalf);
      const secondSlope = this.calculateSlope(secondHalf);
      acceleration = secondSlope - firstSlope;
    }
    
    return {
      direction,
      magnitude,
      confidence: Math.max(0, Math.min(1, rSquared)),
      velocity: slope,
      acceleration
    };
  }
  
  private static calculateSlope(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }
  
  private static calculateCorrelations(
    snapshots: KPISnapshot[], 
    kpiKeys: string[]
  ): TrendAnalysis['correlations'] {
    const correlations: TrendAnalysis['correlations'] = [];
    
    for (let i = 0; i < kpiKeys.length; i++) {
      for (let j = i + 1; j < kpiKeys.length; j++) {
        const kpi1 = kpiKeys[i];
        const kpi2 = kpiKeys[j];
        
        const values1 = snapshots.map(s => s[kpi1 as keyof KPISnapshot] as number);
        const values2 = snapshots.map(s => s[kpi2 as keyof KPISnapshot] as number);
        
        const correlation = this.pearsonCorrelation(values1, values2);
        const significance = Math.abs(correlation);
        
        if (significance > 0.3) { // Only include meaningful correlations
          correlations.push({
            kpi1,
            kpi2,
            correlation,
            significance
          });
        }
      }
    }
    
    return correlations.sort((a, b) => b.significance - a.significance).slice(0, 10);
  }
  
  private static pearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  private static generateInsights(
    trends: TrendAnalysis['trends'],
    correlations: TrendAnalysis['correlations'],
    snapshots: KPISnapshot[]
  ): TrendAnalysis['insights'] {
    const insights: TrendAnalysis['insights'] = [];
    
    // Growth insights
    Object.entries(trends).forEach(([kpi, trend]) => {
      if (trend.direction === 'rising' && trend.confidence > 0.7) {
        insights.push({
          type: 'growth',
          message: `${kpi} is showing strong upward growth with ${trend.magnitude.toFixed(1)}% increase`,
          importance: trend.magnitude > 50 ? 'high' : trend.magnitude > 20 ? 'medium' : 'low',
          kpis: [kpi],
          confidence: trend.confidence
        });
      } else if (trend.direction === 'falling' && trend.confidence > 0.7) {
        insights.push({
          type: 'decline',
          message: `${kpi} is declining by ${trend.magnitude.toFixed(1)}% - attention needed`,
          importance: trend.magnitude > 50 ? 'critical' : trend.magnitude > 20 ? 'high' : 'medium',
          kpis: [kpi],
          confidence: trend.confidence
        });
      }
    });
    
    // Correlation insights
    correlations.slice(0, 3).forEach(corr => {
      const relationship = corr.correlation > 0 ? 'positively correlated' : 'negatively correlated';
      insights.push({
        type: 'correlation',
        message: `${corr.kpi1} and ${corr.kpi2} are strongly ${relationship} (${(corr.correlation * 100).toFixed(0)}%)`,
        importance: corr.significance > 0.8 ? 'high' : 'medium',
        kpis: [corr.kpi1, corr.kpi2],
        confidence: corr.significance
      });
    });
    
    // Milestone insights
    const latest = snapshots[snapshots.length - 1];
    if (latest.gdp > 100000) {
      insights.push({
        type: 'milestone',
        message: `Empire has achieved significant economic scale with GDP over 100,000`,
        importance: 'high',
        kpis: ['gdp'],
        confidence: 1.0
      });
    }
    
    return insights.sort((a, b) => {
      const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    }).slice(0, 8);
  }
  
  private static generateRankings(
    snapshot: KPISnapshot,
    trends: TrendAnalysis
  ): EmpireAnalytics['rankings'] {
    const kpiValues = Object.entries(snapshot)
      .filter(([key, value]) => typeof value === 'number' && key !== 'step' && key !== 'campaignId')
      .map(([kpi, value]) => ({ kpi, value: value as number }));
    
    // Rank KPIs by relative performance (simplified)
    const topKPIs = kpiValues
      .map(({ kpi, value }) => {
        let rank: 'excellent' | 'good' | 'average' | 'poor' = 'average';
        
        // Simple ranking logic based on typical ranges
        if (kpi === 'gdp' && value > 50000) rank = 'excellent';
        else if (kpi === 'population' && value > 5000) rank = 'excellent';
        else if (kpi === 'stabilityIndex' && value > 80) rank = 'excellent';
        else if (kpi === 'satisfactionIndex' && value > 70) rank = 'good';
        
        return { kpi, value, rank };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    
    // Identify improvement areas
    const improvementAreas = kpiValues
      .filter(({ kpi, value }) => {
        const trend = trends.trends[kpi];
        return trend?.direction === 'falling' || value < 10;
      })
      .map(({ kpi, value }) => ({
        kpi,
        issue: value < 10 ? 'Very low value' : 'Declining trend',
        suggestion: this.getSuggestionForKPI(kpi)
      }))
      .slice(0, 4);
    
    return { topKPIs, improvementAreas };
  }
  
  private static getSuggestionForKPI(kpi: string): string {
    const suggestions: Record<string, string> = {
      gdp: 'Focus on building more production facilities and expanding trade',
      population: 'Improve infrastructure and resource availability',
      credits: 'Optimize trade routes and reduce unnecessary spending',
      stabilityIndex: 'Balance resource distribution and policy implementation',
      militaryStrength: 'Build more defense stations and train security forces',
      researchPoints: 'Construct additional research laboratories',
      satisfactionIndex: 'Improve resource per capita and infrastructure quality'
    };
    
    return suggestions[kpi] || 'Monitor trends and adjust strategy accordingly';
  }
  
  private static generateProjections(
    current: KPISnapshot,
    trends: TrendAnalysis
  ): EmpireAnalytics['projections'] {
    const shortTerm: Partial<KPISnapshot> = {};
    const mediumTerm: Partial<KPISnapshot> = {};
    
    Object.entries(trends.trends).forEach(([kpi, trend]) => {
      if (trend.confidence > 0.5) {
        const currentValue = current[kpi as keyof KPISnapshot] as number;
        
        // Short-term (5 steps)
        const shortTermChange = trend.velocity * 5;
        shortTerm[kpi as keyof KPISnapshot] = Math.max(0, currentValue + shortTermChange) as any;
        
        // Medium-term (20 steps) with acceleration
        const mediumTermChange = (trend.velocity * 20) + (trend.acceleration * 200);
        mediumTerm[kpi as keyof KPISnapshot] = Math.max(0, currentValue + mediumTermChange) as any;
      }
    });
    
    return { shortTerm, mediumTerm };
  }
}
