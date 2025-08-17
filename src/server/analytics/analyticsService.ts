import { Pool } from 'pg';
import { 
  CivilizationMetrics, 
  MetricTrend, 
  AnalyticsAlert, 
  CivilizationComparison,
  PredictiveModel,
  AdvisoryRecommendation,
  TrendDirection, 
  SignificanceLevel,
  AlertType,
  SeverityLevel,
  ComparisonType,
  ModelType,
  RecommendationType,
  PriorityLevel
} from '../storage/analyticsSchema.js';

// Import services from other systems
import { HouseholdService } from '../households/householdService.js';
import { WonderService } from '../wonders/wonderService.js';

export interface MetricsCalculationResult {
  metrics: CivilizationMetrics;
  trends: MetricTrend[];
  alerts: AnalyticsAlert[];
  recommendations: AdvisoryRecommendation[];
}

export interface SystemHealthReport {
  campaign_id: number;
  campaign_step: number;
  overall_score: number;
  category_scores: {
    economic: number;
    social: number;
    cultural: number;
    infrastructure: number;
    sustainability: number;
  };
  critical_issues: string[];
  improvement_opportunities: string[];
  development_trajectory: 'declining' | 'stable' | 'improving' | 'rapidly_improving';
}

export interface PredictionRequest {
  campaign_id: number;
  target_metric: string;
  horizon_steps: number;
  model_type?: ModelType;
}

export interface BenchmarkingReport {
  campaign_id: number;
  comparison_type: ComparisonType;
  relative_performance: { [metric: string]: number };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export class AnalyticsService {
  private householdService: HouseholdService;
  private wonderService: WonderService;

  constructor(
    private pool: Pool, 
    householdService?: HouseholdService,
    wonderService?: WonderService
  ) {
    this.householdService = householdService || new HouseholdService(pool);
    this.wonderService = wonderService || new WonderService(pool);
  }

  // Main method to calculate all civilization metrics for a campaign step
  async calculateCivilizationMetrics(campaignId: number, campaignStep: number): Promise<MetricsCalculationResult> {
    const client = await this.pool.connect();
    
    try {
      // Collect raw data from all systems
      const economicData = await this.collectEconomicData(campaignId);
      const socialData = await this.collectSocialData(campaignId);
      const culturalData = await this.collectCulturalData(campaignId);
      const infrastructureData = await this.collectInfrastructureData(campaignId);
      const sustainabilityData = await this.collectSustainabilityData(campaignId);

      // Calculate individual metrics
      const economicMetrics = this.calculateEconomicMetrics(economicData);
      const socialMetrics = this.calculateSocialMetrics(socialData);
      const culturalMetrics = this.calculateCulturalMetrics(culturalData);
      const infrastructureMetrics = this.calculateInfrastructureMetrics(infrastructureData);
      const sustainabilityMetrics = this.calculateSustainabilityMetrics(sustainabilityData);

      // Calculate composite scores
      const compositeScores = this.calculateCompositeScores(
        economicMetrics, socialMetrics, culturalMetrics, 
        infrastructureMetrics, sustainabilityMetrics
      );

      // Create complete metrics object
      const metrics: Partial<CivilizationMetrics> = {
        campaign_id: campaignId,
        campaign_step: campaignStep,
        recorded_at: new Date(),
        ...economicMetrics,
        ...socialMetrics,
        ...culturalMetrics,
        ...infrastructureMetrics,
        ...sustainabilityMetrics,
        ...compositeScores
      };

      // Store metrics in database
      const storedMetrics = await this.storeCivilizationMetrics(metrics as CivilizationMetrics);

      // Analyze trends
      const trends = await this.analyzeTrends(campaignId, storedMetrics);

      // Generate alerts
      const alerts = await this.generateAlerts(campaignId, storedMetrics, trends);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(campaignId, storedMetrics, trends, alerts);

      console.log(`✅ Calculated civilization metrics for campaign ${campaignId}, step ${campaignStep}`);
      
      return {
        metrics: storedMetrics,
        trends,
        alerts,
        recommendations
      };
    } finally {
      client.release();
    }
  }

  // Collect economic data from trade and household systems
  private async collectEconomicData(campaignId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Get household economic status
      const householdStatus = await this.householdService.getHouseholdEconomicStatus(campaignId);
      
      // Get trade volume data (mock - would integrate with actual trade system)
      const tradeResult = await client.query(`
        SELECT COALESCE(SUM(quantity * price), 0) as total_trade_volume
        FROM trade_transactions 
        WHERE campaign_id = $1 
        AND created_at >= NOW() - INTERVAL '30 days'
      `, [campaignId]);
      
      const tradeVolume = Number(tradeResult.rows[0]?.total_trade_volume) || 0;
      
      // Calculate GDP estimate
      const gdpTotal = householdStatus.tier_distribution.poor.total_income +
                      householdStatus.tier_distribution.median.total_income +
                      householdStatus.tier_distribution.rich.total_income +
                      tradeVolume * 0.1; // Trade contributes 10% to GDP
      
      return {
        householdStatus,
        tradeVolume,
        gdpTotal,
        totalPopulation: householdStatus.total_population
      };
    } finally {
      client.release();
    }
  }

  // Collect social indicator data
  private async collectSocialData(campaignId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Get education access data from household tiers
      const educationResult = await client.query(`
        SELECT 
          AVG(education_access) as avg_education_access,
          AVG(social_mobility_rate) as avg_mobility_rate
        FROM household_tiers 
        WHERE campaign_id = $1
      `, [campaignId]);
      
      // Mock health and happiness data (would integrate with actual systems)
      const socialMobilityEvents = await client.query(`
        SELECT 
          COUNT(*) as total_events,
          COUNT(*) FILTER (WHERE outcome = 'success') as successful_events
        FROM social_mobility_events 
        WHERE campaign_id = $1 
        AND created_at >= NOW() - INTERVAL '90 days'
      `, [campaignId]);
      
      return {
        educationLevel: Number(educationResult.rows[0]?.avg_education_access) || 50,
        socialMobilityRate: Number(educationResult.rows[0]?.avg_mobility_rate) || 0.01,
        mobilityEvents: socialMobilityEvents.rows[0] || { total_events: 0, successful_events: 0 }
      };
    } finally {
      client.release();
    }
  }

  // Collect cultural data
  private async collectCulturalData(campaignId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Mock cultural data (would integrate with Task 41 Cultural System)
      const culturalResult = await client.query(`
        SELECT 
          COUNT(*) as cultural_events,
          AVG(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as cultural_participation
        FROM cultural_events 
        WHERE campaign_id = $1
      `, [campaignId]);
      
      return {
        culturalDiversity: 75, // Mock value
        culturalVitality: 68,
        traditionPreservation: 82,
        innovationIndex: 55,
        culturalInfluence: 60,
        participationRate: Number(culturalResult.rows[0]?.cultural_participation) * 100 || 65
      };
    } catch (error) {
      // If cultural system isn't implemented yet, use mock data
      return {
        culturalDiversity: 75,
        culturalVitality: 68,
        traditionPreservation: 82,
        innovationIndex: 55,
        culturalInfluence: 60,
        participationRate: 65
      };
    } finally {
      client.release();
    }
  }

  // Collect infrastructure data from wonders and other systems
  private async collectInfrastructureData(campaignId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Get wonder completion data
      const wonderResult = await client.query(`
        SELECT 
          COUNT(*) as total_wonders,
          COUNT(*) FILTER (WHERE construction_status = 'completed') as completed_wonders,
          AVG(completion_percentage) as avg_completion_percentage,
          AVG(tourism_attraction_level) as avg_tourism_satisfaction
        FROM world_wonders 
        WHERE campaign_id = $1
      `, [campaignId]);
      
      const wonderStats = wonderResult.rows[0] || {};
      
      return {
        wonderCompletionRate: Number(wonderStats.avg_completion_percentage) || 0,
        tourismSatisfaction: Number(wonderStats.avg_tourism_satisfaction) || 0,
        totalWonders: Number(wonderStats.total_wonders) || 0,
        completedWonders: Number(wonderStats.completed_wonders) || 0,
        infrastructureQuality: 70, // Mock base infrastructure
        transportationEfficiency: 75,
        utilityCoverage: 85,
        communicationConnectivity: 80
      };
    } finally {
      client.release();
    }
  }

  // Collect sustainability data
  private async collectSustainabilityData(campaignId: number): Promise<any> {
    const client = await this.pool.connect();
    
    try {
      // Mock sustainability data (would integrate with resource management)
      const resourceResult = await client.query(`
        SELECT 
          COUNT(*) as total_resources,
          AVG(abundance_level) as avg_abundance
        FROM resource_deposits rd
        JOIN planetary_systems ps ON rd.planet_id = ps.id
        WHERE ps.campaign_id = $1
      `, [campaignId]);
      
      const resourceAbundance = Number(resourceResult.rows[0]?.avg_abundance) || 50;
      
      return {
        resourceAbundance,
        environmentalHealth: Math.max(0, 100 - (resourceAbundance * 0.5)), // Higher extraction = lower health
        renewableEnergyRatio: 35,
        wasteManagementEfficiency: 72,
        carbonFootprintPerCapita: 8.5
      };
    } finally {
      client.release();
    }
  }

  // Calculate economic metrics from collected data
  private calculateEconomicMetrics(economicData: any): any {
    const gdpPerCapita = economicData.totalPopulation > 0 ? economicData.gdpTotal / economicData.totalPopulation : 0;
    
    return {
      gdp_total: economicData.gdpTotal,
      gdp_per_capita: gdpPerCapita,
      gini_coefficient: economicData.householdStatus.gini_coefficient,
      unemployment_rate: Math.max(0, 15 - (economicData.householdStatus.economic_health_score * 0.15)),
      inflation_rate: Math.max(0, 5 - (economicData.householdStatus.economic_health_score * 0.05)),
      trade_volume: economicData.tradeVolume,
      resource_abundance_index: 75 // Mock value
    };
  }

  // Calculate social metrics
  private calculateSocialMetrics(socialData: any): any {
    const happinessFromEducation = socialData.educationLevel * 0.8;
    const happinessFromMobility = socialData.socialMobilityRate * 1000; // Scale mobility rate
    
    return {
      happiness_index: Math.min(100, happinessFromEducation + happinessFromMobility + 20),
      education_level: socialData.educationLevel,
      health_index: 78, // Mock value
      social_mobility_index: socialData.socialMobilityRate * 100,
      population_growth_rate: 1.2, // Mock value
      social_stability_index: Math.min(100, socialData.educationLevel + 20)
    };
  }

  // Calculate cultural metrics
  private calculateCulturalMetrics(culturalData: any): any {
    return {
      cultural_diversity_index: culturalData.culturalDiversity,
      cultural_vitality_score: culturalData.culturalVitality,
      tradition_preservation: culturalData.traditionPreservation,
      innovation_index: culturalData.innovationIndex,
      cultural_influence: culturalData.culturalInfluence,
      cultural_participation_rate: culturalData.participationRate
    };
  }

  // Calculate infrastructure metrics
  private calculateInfrastructureMetrics(infrastructureData: any): any {
    const wonderBonus = infrastructureData.completedWonders * 5; // Each wonder adds 5 points
    
    return {
      infrastructure_quality: Math.min(100, infrastructureData.infrastructureQuality + wonderBonus),
      transportation_efficiency: infrastructureData.transportationEfficiency,
      utility_coverage: infrastructureData.utilityCoverage,
      communication_connectivity: infrastructureData.communicationConnectivity,
      wonder_completion_rate: infrastructureData.wonderCompletionRate,
      tourism_satisfaction: infrastructureData.tourismSatisfaction
    };
  }

  // Calculate sustainability metrics
  private calculateSustainabilityMetrics(sustainabilityData: any): any {
    return {
      resource_sustainability_index: sustainabilityData.resourceAbundance,
      environmental_health: sustainabilityData.environmentalHealth,
      renewable_energy_ratio: sustainabilityData.renewableEnergyRatio,
      waste_management_efficiency: sustainabilityData.wasteManagementEfficiency,
      carbon_footprint_per_capita: sustainabilityData.carbonFootprintPerCapita
    };
  }

  // Calculate composite scores from individual metrics
  private calculateCompositeScores(economic: any, social: any, cultural: any, infrastructure: any, sustainability: any): any {
    // Weighted composite scoring
    const economicWeight = 0.3;
    const socialWeight = 0.25;
    const culturalWeight = 0.2;
    const infrastructureWeight = 0.15;
    const sustainabilityWeight = 0.1;

    const economicScore = (economic.gdp_per_capita / 1000 + (1 - economic.gini_coefficient) * 100 + (100 - economic.unemployment_rate)) / 3;
    const socialScore = (social.happiness_index + social.education_level + social.health_index + social.social_stability_index) / 4;
    const culturalScore = (cultural.cultural_diversity_index + cultural.cultural_vitality_score + cultural.innovation_index) / 3;
    const infrastructureScore = (infrastructure.infrastructure_quality + infrastructure.transportation_efficiency + infrastructure.utility_coverage) / 3;
    const sustainabilityScore = (sustainability.resource_sustainability_index + sustainability.environmental_health + sustainability.renewable_energy_ratio) / 3;

    const civilizationHealthIndex = 
      economicScore * economicWeight +
      socialScore * socialWeight +
      culturalScore * culturalWeight +
      infrastructureScore * infrastructureWeight +
      sustainabilityScore * sustainabilityWeight;

    const overallProsperityScore = (economicScore + socialScore + infrastructureScore) / 3;
    const developmentTrajectory = (civilizationHealthIndex + overallProsperityScore) / 2;

    return {
      civilization_health_index: Math.max(0, Math.min(100, civilizationHealthIndex)),
      sustainability_index: Math.max(0, Math.min(100, sustainabilityScore)),
      overall_prosperity_score: Math.max(0, Math.min(100, overallProsperityScore)),
      development_trajectory: Math.max(0, Math.min(100, developmentTrajectory))
    };
  }

  // Store civilization metrics in database
  private async storeCivilizationMetrics(metrics: CivilizationMetrics): Promise<CivilizationMetrics> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO civilization_metrics (
          campaign_id, campaign_step, recorded_at,
          gdp_total, gdp_per_capita, gini_coefficient, unemployment_rate, inflation_rate, trade_volume, resource_abundance_index,
          happiness_index, education_level, health_index, social_mobility_index, population_growth_rate, social_stability_index,
          cultural_diversity_index, cultural_vitality_score, tradition_preservation, innovation_index, cultural_influence, cultural_participation_rate,
          infrastructure_quality, transportation_efficiency, utility_coverage, communication_connectivity, wonder_completion_rate, tourism_satisfaction,
          resource_sustainability_index, environmental_health, renewable_energy_ratio, waste_management_efficiency, carbon_footprint_per_capita,
          civilization_health_index, sustainability_index, overall_prosperity_score, development_trajectory
        ) VALUES (
          $1, $2, $3,
          $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22,
          $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32, $33,
          $34, $35, $36, $37
        )
        ON CONFLICT (campaign_id, campaign_step) DO UPDATE SET
          recorded_at = EXCLUDED.recorded_at,
          gdp_total = EXCLUDED.gdp_total,
          gdp_per_capita = EXCLUDED.gdp_per_capita,
          gini_coefficient = EXCLUDED.gini_coefficient,
          unemployment_rate = EXCLUDED.unemployment_rate,
          inflation_rate = EXCLUDED.inflation_rate,
          trade_volume = EXCLUDED.trade_volume,
          resource_abundance_index = EXCLUDED.resource_abundance_index,
          happiness_index = EXCLUDED.happiness_index,
          education_level = EXCLUDED.education_level,
          health_index = EXCLUDED.health_index,
          social_mobility_index = EXCLUDED.social_mobility_index,
          population_growth_rate = EXCLUDED.population_growth_rate,
          social_stability_index = EXCLUDED.social_stability_index,
          cultural_diversity_index = EXCLUDED.cultural_diversity_index,
          cultural_vitality_score = EXCLUDED.cultural_vitality_score,
          tradition_preservation = EXCLUDED.tradition_preservation,
          innovation_index = EXCLUDED.innovation_index,
          cultural_influence = EXCLUDED.cultural_influence,
          cultural_participation_rate = EXCLUDED.cultural_participation_rate,
          infrastructure_quality = EXCLUDED.infrastructure_quality,
          transportation_efficiency = EXCLUDED.transportation_efficiency,
          utility_coverage = EXCLUDED.utility_coverage,
          communication_connectivity = EXCLUDED.communication_connectivity,
          wonder_completion_rate = EXCLUDED.wonder_completion_rate,
          tourism_satisfaction = EXCLUDED.tourism_satisfaction,
          resource_sustainability_index = EXCLUDED.resource_sustainability_index,
          environmental_health = EXCLUDED.environmental_health,
          renewable_energy_ratio = EXCLUDED.renewable_energy_ratio,
          waste_management_efficiency = EXCLUDED.waste_management_efficiency,
          carbon_footprint_per_capita = EXCLUDED.carbon_footprint_per_capita,
          civilization_health_index = EXCLUDED.civilization_health_index,
          sustainability_index = EXCLUDED.sustainability_index,
          overall_prosperity_score = EXCLUDED.overall_prosperity_score,
          development_trajectory = EXCLUDED.development_trajectory,
          updated_at = NOW()
        RETURNING *
      `, [
        metrics.campaign_id, metrics.campaign_step, metrics.recorded_at,
        metrics.gdp_total, metrics.gdp_per_capita, metrics.gini_coefficient, metrics.unemployment_rate, metrics.inflation_rate, metrics.trade_volume, metrics.resource_abundance_index,
        metrics.happiness_index, metrics.education_level, metrics.health_index, metrics.social_mobility_index, metrics.population_growth_rate, metrics.social_stability_index,
        metrics.cultural_diversity_index, metrics.cultural_vitality_score, metrics.tradition_preservation, metrics.innovation_index, metrics.cultural_influence, metrics.cultural_participation_rate,
        metrics.infrastructure_quality, metrics.transportation_efficiency, metrics.utility_coverage, metrics.communication_connectivity, metrics.wonder_completion_rate, metrics.tourism_satisfaction,
        metrics.resource_sustainability_index, metrics.environmental_health, metrics.renewable_energy_ratio, metrics.waste_management_efficiency, metrics.carbon_footprint_per_capita,
        metrics.civilization_health_index, metrics.sustainability_index, metrics.overall_prosperity_score, metrics.development_trajectory
      ]);

      return this.mapCivilizationMetricsFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // Analyze trends from historical data
  private async analyzeTrends(campaignId: number, currentMetrics: CivilizationMetrics): Promise<MetricTrend[]> {
    const client = await this.pool.connect();
    
    try {
      const trends: MetricTrend[] = [];
      
      // Get historical data for trend analysis
      const historicalResult = await client.query(`
        SELECT * FROM civilization_metrics
        WHERE campaign_id = $1
        AND campaign_step <= $2
        ORDER BY campaign_step DESC
        LIMIT 10
      `, [campaignId, currentMetrics.campaign_step]);

      if (historicalResult.rows.length < 3) {
        // Not enough data for trend analysis
        return trends;
      }

      const keyMetrics = [
        'civilization_health_index', 'gdp_per_capita', 'happiness_index', 
        'gini_coefficient', 'sustainability_index'
      ];

      for (const metricName of keyMetrics) {
        const values = historicalResult.rows.map(row => Number(row[metricName]));
        const trendAnalysis = this.calculateTrend(values);
        
        // Store or update trend
        await client.query(`
          INSERT INTO metric_trends (
            campaign_id, metric_name, trend_direction, trend_strength, 
            confidence_score, analysis_period_steps, significance_level
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (campaign_id, metric_name) DO UPDATE SET
            trend_direction = EXCLUDED.trend_direction,
            trend_strength = EXCLUDED.trend_strength,
            confidence_score = EXCLUDED.confidence_score,
            analysis_period_steps = EXCLUDED.analysis_period_steps,
            significance_level = EXCLUDED.significance_level
        `, [
          campaignId, metricName, trendAnalysis.direction, trendAnalysis.strength,
          trendAnalysis.confidence, values.length, trendAnalysis.significance
        ]);

        trends.push({
          id: '', // Will be set by database
          campaign_id: campaignId,
          metric_name: metricName,
          trend_direction: trendAnalysis.direction,
          trend_strength: trendAnalysis.strength,
          confidence_score: trendAnalysis.confidence,
          analysis_period_steps: values.length,
          significance_level: trendAnalysis.significance,
          created_at: new Date()
        });
      }

      return trends;
    } finally {
      client.release();
    }
  }

  // Calculate trend direction and strength
  private calculateTrend(values: number[]): {
    direction: TrendDirection;
    strength: number;
    confidence: number;
    significance: SignificanceLevel;
  } {
    if (values.length < 2) {
      return {
        direction: TrendDirection.STABLE,
        strength: 0,
        confidence: 0,
        significance: SignificanceLevel.LOW
      };
    }

    // Simple linear regression slope
    const n = values.length;
    const xValues = Array.from({length: n}, (_, i) => i);
    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = values.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (values[i] - yMean);
      denominator += (xValues[i] - xMean) ** 2;
    }
    
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const strength = Math.abs(slope) / Math.max(...values) * 100; // Normalize to percentage
    
    let direction: TrendDirection;
    if (slope > 0.5) direction = TrendDirection.STRONGLY_IMPROVING;
    else if (slope > 0.1) direction = TrendDirection.IMPROVING;
    else if (slope > -0.1) direction = TrendDirection.STABLE;
    else if (slope > -0.5) direction = TrendDirection.DECLINING;
    else direction = TrendDirection.STRONGLY_DECLINING;

    const confidence = Math.min(1, strength / 10); // Higher strength = higher confidence
    
    let significance: SignificanceLevel;
    if (strength > 2) significance = SignificanceLevel.CRITICAL;
    else if (strength > 1) significance = SignificanceLevel.HIGH;
    else if (strength > 0.5) significance = SignificanceLevel.MODERATE;
    else significance = SignificanceLevel.LOW;

    return { direction, strength: slope, confidence, significance };
  }

  // Generate alerts based on metrics and trends
  private async generateAlerts(campaignId: number, metrics: CivilizationMetrics, trends: MetricTrend[]): Promise<AnalyticsAlert[]> {
    const client = await this.pool.connect();
    const alerts: AnalyticsAlert[] = [];
    
    try {
      // Check for critical thresholds
      const criticalChecks = [
        { metric: 'happiness_index', value: metrics.happiness_index, threshold: 30, type: 'below', severity: SeverityLevel.CRITICAL },
        { metric: 'civilization_health_index', value: metrics.civilization_health_index, threshold: 40, type: 'below', severity: SeverityLevel.WARNING },
        { metric: 'gini_coefficient', value: metrics.gini_coefficient, threshold: 0.7, type: 'above', severity: SeverityLevel.WARNING },
        { metric: 'unemployment_rate', value: metrics.unemployment_rate, threshold: 15, type: 'above', severity: SeverityLevel.CRITICAL },
        { metric: 'environmental_health', value: metrics.environmental_health, threshold: 25, type: 'below', severity: SeverityLevel.WARNING }
      ];

      for (const check of criticalChecks) {
        const shouldAlert = check.type === 'below' ? check.value < check.threshold : check.value > check.threshold;
        
        if (shouldAlert) {
          const description = `${check.metric.replace('_', ' ')} is ${check.type === 'below' ? 'below' : 'above'} critical threshold`;
          const recommendedActions = this.getRecommendedActionsForMetric(check.metric, check.value, check.threshold);
          
          await client.query(`
            INSERT INTO analytics_alerts (
              campaign_id, alert_type, severity_level, metric_affected,
              current_value, threshold_value, description, recommended_actions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            campaignId, AlertType.METRIC_THRESHOLD, check.severity, check.metric,
            check.value, check.threshold, description, JSON.stringify(recommendedActions)
          ]);

          alerts.push({
            id: '', // Will be set by database
            campaign_id: campaignId,
            alert_type: AlertType.METRIC_THRESHOLD,
            severity_level: check.severity,
            metric_affected: check.metric,
            current_value: check.value,
            threshold_value: check.threshold,
            description,
            recommended_actions: recommendedActions,
            is_resolved: false,
            created_at: new Date()
          });
        }
      }

      // Check for concerning trends
      for (const trend of trends) {
        if (trend.trend_direction === TrendDirection.STRONGLY_DECLINING && trend.significance_level === SignificanceLevel.CRITICAL) {
          const description = `${trend.metric_name.replace('_', ' ')} shows strongly declining trend`;
          const recommendedActions = this.getRecommendedActionsForTrend(trend.metric_name, trend.trend_direction);
          
          await client.query(`
            INSERT INTO analytics_alerts (
              campaign_id, alert_type, severity_level, metric_affected,
              current_value, threshold_value, description, recommended_actions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            campaignId, AlertType.TREND_WARNING, SeverityLevel.WARNING, trend.metric_name,
            trend.trend_strength, 0, description, JSON.stringify(recommendedActions)
          ]);

          alerts.push({
            id: '',
            campaign_id: campaignId,
            alert_type: AlertType.TREND_WARNING,
            severity_level: SeverityLevel.WARNING,
            metric_affected: trend.metric_name,
            current_value: trend.trend_strength,
            threshold_value: 0,
            description,
            recommended_actions: recommendedActions,
            is_resolved: false,
            created_at: new Date()
          });
        }
      }

      return alerts;
    } finally {
      client.release();
    }
  }

  // Generate AI-powered recommendations
  private async generateRecommendations(
    campaignId: number, 
    metrics: CivilizationMetrics, 
    trends: MetricTrend[], 
    alerts: AnalyticsAlert[]
  ): Promise<AdvisoryRecommendation[]> {
    const client = await this.pool.connect();
    const recommendations: AdvisoryRecommendation[] = [];
    
    try {
      // Economic recommendations
      if (metrics.gini_coefficient > 0.6) {
        recommendations.push(await this.createRecommendation(
          campaignId,
          RecommendationType.ECONOMIC_POLICY,
          PriorityLevel.HIGH,
          ['gini_coefficient', 'happiness_index'],
          'High income inequality detected',
          'Implement progressive taxation and social welfare programs to reduce income inequality',
          { gini_coefficient: -0.1, happiness_index: 5 },
          { gold: 50000, political_capital: 20 }
        ));
      }

      // Social recommendations
      if (metrics.education_level < 60) {
        recommendations.push(await this.createRecommendation(
          campaignId,
          RecommendationType.SOCIAL_PROGRAM,
          PriorityLevel.MEDIUM,
          ['education_level', 'social_mobility_index'],
          'Education levels below optimal threshold',
          'Invest in educational infrastructure and teacher training programs',
          { education_level: 10, social_mobility_index: 5 },
          { gold: 30000, education_resources: 1000 }
        ));
      }

      // Infrastructure recommendations
      if (metrics.infrastructure_quality < 70) {
        recommendations.push(await this.createRecommendation(
          campaignId,
          RecommendationType.INFRASTRUCTURE_INVESTMENT,
          PriorityLevel.MEDIUM,
          ['infrastructure_quality', 'transportation_efficiency'],
          'Infrastructure quality needs improvement',
          'Launch comprehensive infrastructure modernization program',
          { infrastructure_quality: 15, transportation_efficiency: 10 },
          { gold: 100000, metal: 5000, energy: 2000 }
        ));
      }

      // Sustainability recommendations
      if (metrics.environmental_health < 50) {
        recommendations.push(await this.createRecommendation(
          campaignId,
          RecommendationType.SUSTAINABILITY_MEASURE,
          PriorityLevel.HIGH,
          ['environmental_health', 'renewable_energy_ratio'],
          'Environmental health declining due to resource exploitation',
          'Implement green energy transition and environmental protection policies',
          { environmental_health: 20, renewable_energy_ratio: 15 },
          { gold: 75000, technology: 3000 }
        ));
      }

      return recommendations;
    } finally {
      client.release();
    }
  }

  // Create and store a recommendation
  private async createRecommendation(
    campaignId: number,
    type: RecommendationType,
    priority: PriorityLevel,
    affectedMetrics: string[],
    situation: string,
    action: string,
    expectedImpact: Record<string, number>,
    implementationCost: Record<string, number>
  ): Promise<AdvisoryRecommendation> {
    const client = await this.pool.connect();
    
    try {
      const successProbability = 0.7; // Default success probability
      const riskAssessment = this.generateRiskAssessment(type, expectedImpact, implementationCost);
      
      const result = await client.query(`
        INSERT INTO advisory_recommendations (
          campaign_id, recommendation_type, priority_level, affected_metrics,
          current_situation, recommended_action, expected_impact, implementation_cost,
          success_probability, risk_assessment
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        campaignId, type, priority, JSON.stringify(affectedMetrics),
        situation, action, JSON.stringify(expectedImpact), JSON.stringify(implementationCost),
        successProbability, riskAssessment
      ]);

      return this.mapAdvisoryRecommendationFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  // Get system health report
  async getSystemHealthReport(campaignId: number): Promise<SystemHealthReport> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT * FROM civilization_metrics
        WHERE campaign_id = $1
        ORDER BY campaign_step DESC
        LIMIT 1
      `, [campaignId]);

      if (result.rows.length === 0) {
        throw new Error(`No metrics found for campaign ${campaignId}`);
      }

      const metrics = this.mapCivilizationMetricsFromDB(result.rows[0]);
      
      const categoryScores = {
        economic: (metrics.gdp_per_capita / 1000 + (1 - metrics.gini_coefficient) * 100 + (100 - metrics.unemployment_rate)) / 3,
        social: (metrics.happiness_index + metrics.education_level + metrics.health_index) / 3,
        cultural: (metrics.cultural_diversity_index + metrics.cultural_vitality_score + metrics.innovation_index) / 3,
        infrastructure: (metrics.infrastructure_quality + metrics.transportation_efficiency + metrics.utility_coverage) / 3,
        sustainability: (metrics.resource_sustainability_index + metrics.environmental_health + metrics.renewable_energy_ratio) / 3
      };

      const overallScore = metrics.civilization_health_index;
      
      const criticalIssues = [];
      const improvementOpportunities = [];

      // Identify critical issues
      if (metrics.happiness_index < 40) criticalIssues.push('Low population happiness');
      if (metrics.gini_coefficient > 0.6) criticalIssues.push('High income inequality');
      if (metrics.unemployment_rate > 10) criticalIssues.push('High unemployment');
      if (metrics.environmental_health < 40) criticalIssues.push('Environmental degradation');

      // Identify improvement opportunities
      if (metrics.education_level < 70) improvementOpportunities.push('Education system expansion');
      if (metrics.infrastructure_quality < 80) improvementOpportunities.push('Infrastructure modernization');
      if (metrics.innovation_index < 60) improvementOpportunities.push('Innovation and R&D investment');
      if (metrics.renewable_energy_ratio < 50) improvementOpportunities.push('Green energy transition');

      let trajectory: 'declining' | 'stable' | 'improving' | 'rapidly_improving' = 'stable';
      if (metrics.development_trajectory > 75) trajectory = 'rapidly_improving';
      else if (metrics.development_trajectory > 60) trajectory = 'improving';
      else if (metrics.development_trajectory < 40) trajectory = 'declining';

      return {
        campaign_id: campaignId,
        campaign_step: metrics.campaign_step,
        overall_score: overallScore,
        category_scores: categoryScores,
        critical_issues: criticalIssues,
        improvement_opportunities: improvementOpportunities,
        development_trajectory: trajectory
      };
    } finally {
      client.release();
    }
  }

  // Helper methods

  private getRecommendedActionsForMetric(metric: string, currentValue: number, threshold: number): string[] {
    const actions: { [key: string]: string[] } = {
      happiness_index: [
        'Implement social welfare programs',
        'Invest in public entertainment and cultural activities',
        'Address unemployment and economic inequality'
      ],
      gini_coefficient: [
        'Implement progressive taxation',
        'Increase minimum wage policies',
        'Expand social mobility programs'
      ],
      unemployment_rate: [
        'Create public works programs',
        'Invest in job training and education',
        'Incentivize business expansion and startups'
      ],
      environmental_health: [
        'Implement environmental protection policies',
        'Reduce industrial pollution',
        'Transition to renewable energy sources'
      ]
    };

    return actions[metric] || ['Consult with advisors for specific recommendations'];
  }

  private getRecommendedActionsForTrend(metric: string, direction: TrendDirection): string[] {
    return [
      `Address declining ${metric.replace('_', ' ')} through targeted interventions`,
      'Conduct detailed analysis of underlying causes',
      'Implement corrective policies immediately'
    ];
  }

  private generateRiskAssessment(type: RecommendationType, impact: Record<string, number>, cost: Record<string, number>): string {
    const costMagnitude = Object.values(cost).reduce((sum, val) => sum + val, 0);
    const impactMagnitude = Object.values(impact).reduce((sum, val) => sum + Math.abs(val), 0);
    
    if (costMagnitude > 100000) {
      return 'High cost implementation with potential for significant economic disruption';
    } else if (impactMagnitude > 20) {
      return 'High impact intervention with potential for substantial system-wide changes';
    } else {
      return 'Moderate risk intervention with manageable implementation costs';
    }
  }

  private mapCivilizationMetricsFromDB(row: any): CivilizationMetrics {
    return {
      ...row,
      gdp_total: Number(row.gdp_total),
      gdp_per_capita: Number(row.gdp_per_capita),
      gini_coefficient: Number(row.gini_coefficient),
      unemployment_rate: Number(row.unemployment_rate),
      inflation_rate: Number(row.inflation_rate),
      trade_volume: Number(row.trade_volume),
      resource_abundance_index: Number(row.resource_abundance_index),
      happiness_index: Number(row.happiness_index),
      education_level: Number(row.education_level),
      health_index: Number(row.health_index),
      social_mobility_index: Number(row.social_mobility_index),
      population_growth_rate: Number(row.population_growth_rate),
      social_stability_index: Number(row.social_stability_index),
      cultural_diversity_index: Number(row.cultural_diversity_index),
      cultural_vitality_score: Number(row.cultural_vitality_score),
      tradition_preservation: Number(row.tradition_preservation),
      innovation_index: Number(row.innovation_index),
      cultural_influence: Number(row.cultural_influence),
      cultural_participation_rate: Number(row.cultural_participation_rate),
      infrastructure_quality: Number(row.infrastructure_quality),
      transportation_efficiency: Number(row.transportation_efficiency),
      utility_coverage: Number(row.utility_coverage),
      communication_connectivity: Number(row.communication_connectivity),
      wonder_completion_rate: Number(row.wonder_completion_rate),
      tourism_satisfaction: Number(row.tourism_satisfaction),
      resource_sustainability_index: Number(row.resource_sustainability_index),
      environmental_health: Number(row.environmental_health),
      renewable_energy_ratio: Number(row.renewable_energy_ratio),
      waste_management_efficiency: Number(row.waste_management_efficiency),
      carbon_footprint_per_capita: Number(row.carbon_footprint_per_capita),
      civilization_health_index: Number(row.civilization_health_index),
      sustainability_index: Number(row.sustainability_index),
      overall_prosperity_score: Number(row.overall_prosperity_score),
      development_trajectory: Number(row.development_trajectory)
    };
  }

  private mapAdvisoryRecommendationFromDB(row: any): AdvisoryRecommendation {
    return {
      ...row,
      affected_metrics: typeof row.affected_metrics === 'string' ? JSON.parse(row.affected_metrics) : row.affected_metrics,
      expected_impact: typeof row.expected_impact === 'string' ? JSON.parse(row.expected_impact) : row.expected_impact,
      implementation_cost: typeof row.implementation_cost === 'string' ? JSON.parse(row.implementation_cost) : row.implementation_cost,
      success_probability: Number(row.success_probability)
    };
  }
}
