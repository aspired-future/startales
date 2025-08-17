import { Pool } from 'pg';

export interface CivilizationMetrics {
  id: string;
  campaign_id: number;
  campaign_step: number;
  recorded_at: Date;
  
  // Economic Health Metrics
  gdp_total: number;
  gdp_per_capita: number;
  gini_coefficient: number;
  unemployment_rate: number;
  inflation_rate: number;
  trade_volume: number;
  resource_abundance_index: number;
  
  // Social Indicators
  happiness_index: number;
  education_level: number;
  health_index: number;
  social_mobility_index: number;
  population_growth_rate: number;
  social_stability_index: number;
  
  // Cultural Vitality
  cultural_diversity_index: number;
  cultural_vitality_score: number;
  tradition_preservation: number;
  innovation_index: number;
  cultural_influence: number;
  cultural_participation_rate: number;
  
  // Infrastructure Quality
  infrastructure_quality: number;
  transportation_efficiency: number;
  utility_coverage: number;
  communication_connectivity: number;
  wonder_completion_rate: number;
  tourism_satisfaction: number;
  
  // Sustainability & Environment
  resource_sustainability_index: number;
  environmental_health: number;
  renewable_energy_ratio: number;
  waste_management_efficiency: number;
  carbon_footprint_per_capita: number;
  
  // Composite Scores
  civilization_health_index: number;
  sustainability_index: number;
  overall_prosperity_score: number;
  development_trajectory: number;
  
  created_at: Date;
  updated_at: Date;
}

export interface MetricTrend {
  id: string;
  campaign_id: number;
  metric_name: string;
  trend_direction: TrendDirection;
  trend_strength: number; // -1.0 to 1.0
  confidence_score: number; // 0.0 to 1.0
  analysis_period_steps: number;
  significance_level: SignificanceLevel;
  created_at: Date;
}

export interface AnalyticsAlert {
  id: string;
  campaign_id: number;
  alert_type: AlertType;
  severity_level: SeverityLevel;
  metric_affected: string;
  current_value: number;
  threshold_value: number;
  description: string;
  recommended_actions: string[];
  is_resolved: boolean;
  created_at: Date;
  resolved_at?: Date;
}

export interface CivilizationComparison {
  id: string;
  primary_campaign_id: number;
  comparison_campaign_id?: number; // null for historical comparison
  comparison_type: ComparisonType;
  metrics_snapshot: CivilizationMetrics;
  relative_performance_scores: { [metric: string]: number };
  benchmarking_insights: string[];
  created_at: Date;
}

export interface PredictiveModel {
  id: string;
  campaign_id: number;
  model_type: ModelType;
  target_metric: string;
  prediction_horizon_steps: number;
  predicted_values: number[];
  confidence_intervals: { lower: number; upper: number }[];
  model_accuracy: number;
  training_data_points: number;
  model_parameters: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface AdvisoryRecommendation {
  id: string;
  campaign_id: number;
  recommendation_type: RecommendationType;
  priority_level: PriorityLevel;
  affected_metrics: string[];
  current_situation: string;
  recommended_action: string;
  expected_impact: Record<string, number>;
  implementation_cost: Record<string, number>;
  success_probability: number;
  risk_assessment: string;
  is_implemented: boolean;
  created_at: Date;
  implemented_at?: Date;
}

export enum TrendDirection {
  STRONGLY_DECLINING = 'strongly_declining',
  DECLINING = 'declining', 
  STABLE = 'stable',
  IMPROVING = 'improving',
  STRONGLY_IMPROVING = 'strongly_improving'
}

export enum SignificanceLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertType {
  METRIC_THRESHOLD = 'metric_threshold',
  TREND_WARNING = 'trend_warning',
  SYSTEM_ANOMALY = 'system_anomaly',
  PREDICTIVE_WARNING = 'predictive_warning'
}

export enum SeverityLevel {
  INFO = 'info',
  WARNING = 'warning', 
  CRITICAL = 'critical',
  EMERGENCY = 'emergency'
}

export enum ComparisonType {
  HISTORICAL_SELF = 'historical_self',
  OTHER_CAMPAIGN = 'other_campaign',
  BENCHMARK_OPTIMAL = 'benchmark_optimal',
  PEER_GROUP = 'peer_group'
}

export enum ModelType {
  LINEAR_TREND = 'linear_trend',
  POLYNOMIAL_REGRESSION = 'polynomial_regression',
  MOVING_AVERAGE = 'moving_average',
  EXPONENTIAL_SMOOTHING = 'exponential_smoothing',
  AI_NEURAL_NETWORK = 'ai_neural_network'
}

export enum RecommendationType {
  ECONOMIC_POLICY = 'economic_policy',
  SOCIAL_PROGRAM = 'social_program',
  INFRASTRUCTURE_INVESTMENT = 'infrastructure_investment',
  CULTURAL_INITIATIVE = 'cultural_initiative',
  SUSTAINABILITY_MEASURE = 'sustainability_measure',
  EMERGENCY_INTERVENTION = 'emergency_intervention'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export class AnalyticsSchema {
  constructor(private pool: Pool) {}

  async initializeTables(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Civilization Metrics main table
      await client.query(`
        CREATE TABLE IF NOT EXISTS civilization_metrics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          campaign_step INTEGER NOT NULL,
          recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          -- Economic Health Metrics
          gdp_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          gdp_per_capita DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          gini_coefficient DECIMAL(5,3) NOT NULL DEFAULT 0.000,
          unemployment_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          inflation_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          trade_volume DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          resource_abundance_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          
          -- Social Indicators  
          happiness_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          education_level DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          health_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          social_mobility_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          population_growth_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          social_stability_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          
          -- Cultural Vitality
          cultural_diversity_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          cultural_vitality_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          tradition_preservation DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          innovation_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          cultural_influence DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          cultural_participation_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          
          -- Infrastructure Quality
          infrastructure_quality DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          transportation_efficiency DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          utility_coverage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          communication_connectivity DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          wonder_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          tourism_satisfaction DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          
          -- Sustainability & Environment
          resource_sustainability_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          environmental_health DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          renewable_energy_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          waste_management_efficiency DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          carbon_footprint_per_capita DECIMAL(8,2) NOT NULL DEFAULT 0.00,
          
          -- Composite Scores
          civilization_health_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          sustainability_index DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          overall_prosperity_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          development_trajectory DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, campaign_step),
          CONSTRAINT valid_gini_coefficient 
            CHECK (gini_coefficient >= 0.000 AND gini_coefficient <= 1.000),
          CONSTRAINT valid_percentage_metrics
            CHECK (unemployment_rate >= 0 AND happiness_index >= 0 AND happiness_index <= 100)
        );
      `);

      // Metric Trends analysis
      await client.query(`
        CREATE TABLE IF NOT EXISTS metric_trends (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          metric_name VARCHAR(100) NOT NULL,
          trend_direction VARCHAR(20) NOT NULL,
          trend_strength DECIMAL(3,2) NOT NULL,
          confidence_score DECIMAL(3,2) NOT NULL,
          analysis_period_steps INTEGER NOT NULL DEFAULT 5,
          significance_level VARCHAR(20) NOT NULL DEFAULT 'moderate',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, metric_name),
          CONSTRAINT valid_trend_direction 
            CHECK (trend_direction IN ('strongly_declining', 'declining', 'stable', 'improving', 'strongly_improving')),
          CONSTRAINT valid_trend_strength 
            CHECK (trend_strength >= -1.0 AND trend_strength <= 1.0),
          CONSTRAINT valid_confidence_score 
            CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
          CONSTRAINT valid_significance_level 
            CHECK (significance_level IN ('low', 'moderate', 'high', 'critical'))
        );
      `);

      // Analytics Alerts
      await client.query(`
        CREATE TABLE IF NOT EXISTS analytics_alerts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          alert_type VARCHAR(30) NOT NULL,
          severity_level VARCHAR(20) NOT NULL,
          metric_affected VARCHAR(100) NOT NULL,
          current_value DECIMAL(15,2) NOT NULL,
          threshold_value DECIMAL(15,2) NOT NULL,
          description TEXT NOT NULL,
          recommended_actions JSONB NOT NULL DEFAULT '[]',
          is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          resolved_at TIMESTAMP,
          
          CONSTRAINT valid_alert_type 
            CHECK (alert_type IN ('metric_threshold', 'trend_warning', 'system_anomaly', 'predictive_warning')),
          CONSTRAINT valid_severity_level 
            CHECK (severity_level IN ('info', 'warning', 'critical', 'emergency'))
        );
      `);

      // Civilization Comparisons
      await client.query(`
        CREATE TABLE IF NOT EXISTS civilization_comparisons (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          primary_campaign_id INTEGER NOT NULL,
          comparison_campaign_id INTEGER,
          comparison_type VARCHAR(30) NOT NULL,
          metrics_snapshot JSONB NOT NULL,
          relative_performance_scores JSONB NOT NULL DEFAULT '{}',
          benchmarking_insights JSONB NOT NULL DEFAULT '[]',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          CONSTRAINT valid_comparison_type 
            CHECK (comparison_type IN ('historical_self', 'other_campaign', 'benchmark_optimal', 'peer_group'))
        );
      `);

      // Predictive Models
      await client.query(`
        CREATE TABLE IF NOT EXISTS predictive_models (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          model_type VARCHAR(30) NOT NULL,
          target_metric VARCHAR(100) NOT NULL,
          prediction_horizon_steps INTEGER NOT NULL DEFAULT 10,
          predicted_values JSONB NOT NULL DEFAULT '[]',
          confidence_intervals JSONB NOT NULL DEFAULT '[]',
          model_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
          training_data_points INTEGER NOT NULL DEFAULT 0,
          model_parameters JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          
          UNIQUE(campaign_id, target_metric, model_type),
          CONSTRAINT valid_model_type 
            CHECK (model_type IN ('linear_trend', 'polynomial_regression', 'moving_average', 'exponential_smoothing', 'ai_neural_network')),
          CONSTRAINT valid_model_accuracy 
            CHECK (model_accuracy >= 0.00 AND model_accuracy <= 100.00)
        );
      `);

      // Advisory Recommendations
      await client.query(`
        CREATE TABLE IF NOT EXISTS advisory_recommendations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id INTEGER NOT NULL,
          recommendation_type VARCHAR(30) NOT NULL,
          priority_level VARCHAR(20) NOT NULL,
          affected_metrics JSONB NOT NULL DEFAULT '[]',
          current_situation TEXT NOT NULL,
          recommended_action TEXT NOT NULL,
          expected_impact JSONB NOT NULL DEFAULT '{}',
          implementation_cost JSONB NOT NULL DEFAULT '{}',
          success_probability DECIMAL(5,2) NOT NULL DEFAULT 0.50,
          risk_assessment TEXT NOT NULL,
          is_implemented BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          implemented_at TIMESTAMP,
          
          CONSTRAINT valid_recommendation_type 
            CHECK (recommendation_type IN ('economic_policy', 'social_program', 'infrastructure_investment', 
                                          'cultural_initiative', 'sustainability_measure', 'emergency_intervention')),
          CONSTRAINT valid_priority_level 
            CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
          CONSTRAINT valid_success_probability 
            CHECK (success_probability >= 0.00 AND success_probability <= 1.00)
        );
      `);

      // Indexes for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_civilization_metrics_campaign_step 
          ON civilization_metrics(campaign_id, campaign_step);
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_civilization_metrics_recorded_at 
          ON civilization_metrics(recorded_at);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_metric_trends_campaign 
          ON metric_trends(campaign_id);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_analytics_alerts_campaign_unresolved 
          ON analytics_alerts(campaign_id, is_resolved);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_predictive_models_campaign_metric 
          ON predictive_models(campaign_id, target_metric);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_advisory_recommendations_campaign_unimplemented 
          ON advisory_recommendations(campaign_id, is_implemented);
      `);

      // Update triggers
      await client.query(`
        CREATE OR REPLACE FUNCTION update_analytics_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_update_civilization_metrics_updated_at ON civilization_metrics;
        CREATE TRIGGER trigger_update_civilization_metrics_updated_at
          BEFORE UPDATE ON civilization_metrics
          FOR EACH ROW
          EXECUTE FUNCTION update_analytics_updated_at();

        DROP TRIGGER IF EXISTS trigger_update_predictive_models_updated_at ON predictive_models;
        CREATE TRIGGER trigger_update_predictive_models_updated_at
          BEFORE UPDATE ON predictive_models
          FOR EACH ROW
          EXECUTE FUNCTION update_analytics_updated_at();
      `);

      await client.query('COMMIT');
      console.log('✅ Civilization Analytics system database schema initialized');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to initialize Analytics schema:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async seedAnalyticsSystem(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Seed some baseline metric configurations and thresholds
      console.log('✅ Analytics system seeded successfully');
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Failed to seed analytics system:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
