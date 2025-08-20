/**
 * AI Analysis Engine - Type Definitions
 * 
 * Defines comprehensive types for AI-powered analysis providing natural language
 * interpretation of economic, social, technological, and social media dynamics.
 */

// ===== CORE ANALYSIS TYPES =====

export interface AnalysisRequest {
  id: string;
  type: AnalysisType;
  scope: AnalysisScope;
  timeframe: TimeframeFilter;
  dataInputs: DataInputs;
  analysisOptions: AnalysisOptions;
  requestedBy: string;
  timestamp: Date;
}

export interface AnalysisResponse {
  id: string;
  requestId: string;
  type: AnalysisType;
  scope: AnalysisScope;
  executionTime: number;
  confidence: number;
  insights: AnalysisInsight[];
  summary: string;
  recommendations: Recommendation[];
  trends: TrendAnalysis[];
  predictions: Prediction[];
  metadata: AnalysisMetadata;
  timestamp: Date;
}

export type AnalysisType = 
  | 'comprehensive'
  | 'economic'
  | 'social'
  | 'technological'
  | 'political'
  | 'demographic'
  | 'psychological'
  | 'social_media'
  | 'cross_system'
  | 'predictive'
  | 'comparative'
  | 'crisis_assessment'
  | 'opportunity_analysis';

export type AnalysisScope = 
  | 'civilization'
  | 'city'
  | 'region'
  | 'population_segment'
  | 'individual'
  | 'cross_civilization'
  | 'global'
  | 'system_specific'
  | 'multi_system';

export interface TimeframeFilter {
  start?: Date;
  end?: Date;
  period: TimePeriod;
  includeHistorical: boolean;
  includePredictive: boolean;
  forecastHorizon?: number; // months
}

export type TimePeriod = 
  | 'real_time'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'custom';

// ===== DATA INPUT TYPES =====

export interface DataInputs {
  economic?: EconomicDataInput;
  social?: SocialDataInput;
  technological?: TechnologicalDataInput;
  political?: PoliticalDataInput;
  demographic?: DemographicDataInput;
  psychological?: PsychologicalDataInput;
  socialMedia?: SocialMediaDataInput;
  external?: ExternalDataInput[];
}

export interface EconomicDataInput {
  tradeData: any[];
  businessMetrics: any[];
  householdData: any[];
  marketIndicators: any[];
  resourceData: any[];
  financialMetrics: any[];
}

export interface SocialDataInput {
  populationProfiles: any[];
  migrationData: any[];
  culturalIndicators: any[];
  socialCohesionMetrics: any[];
  communityData: any[];
}

export interface TechnologicalDataInput {
  technologyAdoption: any[];
  innovationMetrics: any[];
  researchData: any[];
  cyberWarfareData: any[];
  techTreeProgress: any[];
}

export interface PoliticalDataInput {
  governanceData: any[];
  electionResults: any[];
  policyEffects: any[];
  legalSystemData: any[];
  securityMetrics: any[];
}

export interface DemographicDataInput {
  populationStats: any[];
  lifecycleData: any[];
  casualtyData: any[];
  migrationPatterns: any[];
  healthMetrics: any[];
}

export interface PsychologicalDataInput {
  personalityProfiles: any[];
  behavioralResponses: any[];
  socialDynamics: any[];
  policyResponses: any[];
  integrationAnalyses: any[];
}

export interface SocialMediaDataInput {
  wittPosts: any[];
  sentimentAnalysis: any[];
  engagementMetrics: any[];
  influenceAnalysis: any[];
  trendData: any[];
}

export interface ExternalDataInput {
  source: string;
  type: string;
  data: any;
  reliability: number;
  timestamp: Date;
}

// ===== ANALYSIS OUTPUT TYPES =====

export interface AnalysisInsight {
  id: string;
  category: InsightCategory;
  priority: InsightPriority;
  title: string;
  description: string;
  evidence: Evidence[];
  confidence: number;
  impact: ImpactAssessment;
  relatedSystems: string[];
  actionable: boolean;
}

export type InsightCategory = 
  | 'trend'
  | 'anomaly'
  | 'opportunity'
  | 'risk'
  | 'correlation'
  | 'causation'
  | 'pattern'
  | 'prediction'
  | 'recommendation';

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export interface Evidence {
  type: EvidenceType;
  source: string;
  data: any;
  strength: number;
  timestamp: Date;
}

export type EvidenceType = 
  | 'statistical'
  | 'observational'
  | 'comparative'
  | 'historical'
  | 'predictive'
  | 'expert_analysis'
  | 'ai_inference';

export interface ImpactAssessment {
  scope: string[];
  magnitude: number; // 0-100
  timeframe: string;
  certainty: number; // 0-100
  reversibility: number; // 0-100
  cascadeEffects: CascadeEffect[];
}

export interface CascadeEffect {
  system: string;
  effect: string;
  probability: number;
  magnitude: number;
  delay: number; // months
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: InsightPriority;
  title: string;
  description: string;
  rationale: string;
  expectedOutcome: string;
  implementation: ImplementationPlan;
  risks: Risk[];
  alternatives: Alternative[];
  confidence: number;
}

export type RecommendationType = 
  | 'policy'
  | 'investment'
  | 'research'
  | 'diplomatic'
  | 'military'
  | 'social'
  | 'technological'
  | 'economic'
  | 'preventive'
  | 'corrective';

export interface ImplementationPlan {
  steps: ImplementationStep[];
  timeline: string;
  resources: ResourceRequirement[];
  prerequisites: string[];
  successMetrics: string[];
}

export interface ImplementationStep {
  order: number;
  action: string;
  duration: string;
  responsible: string;
  dependencies: string[];
}

export interface ResourceRequirement {
  type: string;
  amount: number;
  unit: string;
  availability: number;
}

export interface Risk {
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface Alternative {
  description: string;
  pros: string[];
  cons: string[];
  feasibility: number;
}

export interface TrendAnalysis {
  id: string;
  name: string;
  category: string;
  direction: TrendDirection;
  strength: number;
  duration: string;
  confidence: number;
  description: string;
  drivers: TrendDriver[];
  implications: string[];
  relatedTrends: string[];
}

export type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'cyclical' | 'volatile';

export interface TrendDriver {
  factor: string;
  influence: number;
  description: string;
}

export interface Prediction {
  id: string;
  type: PredictionType;
  timeframe: string;
  confidence: number;
  description: string;
  scenario: PredictionScenario;
  assumptions: string[];
  indicators: PredictionIndicator[];
  alternatives: AlternativeScenario[];
}

export type PredictionType = 
  | 'economic_forecast'
  | 'social_trend'
  | 'technological_adoption'
  | 'political_outcome'
  | 'demographic_shift'
  | 'crisis_probability'
  | 'opportunity_emergence';

export interface PredictionScenario {
  name: string;
  probability: number;
  description: string;
  outcomes: PredictionOutcome[];
  timeline: PredictionTimeline[];
}

export interface PredictionOutcome {
  metric: string;
  value: number;
  range: [number, number];
  unit: string;
}

export interface PredictionTimeline {
  milestone: string;
  timeframe: string;
  probability: number;
}

export interface AlternativeScenario {
  name: string;
  probability: number;
  description: string;
  triggers: string[];
}

export interface PredictionIndicator {
  metric: string;
  currentValue: number;
  threshold: number;
  direction: 'above' | 'below';
  description: string;
}

export interface AnalysisMetadata {
  dataQuality: DataQualityMetrics;
  processingStats: ProcessingStats;
  systemsAnalyzed: string[];
  analysisVersion: string;
  modelVersions: Record<string, string>;
  limitations: string[];
  assumptions: string[];
}

export interface DataQualityMetrics {
  completeness: number;
  accuracy: number;
  timeliness: number;
  consistency: number;
  reliability: number;
}

export interface ProcessingStats {
  totalDataPoints: number;
  processingTime: number;
  memoryUsage: number;
  apiCalls: number;
  cacheHits: number;
}

// ===== AI ENGINE CONFIGURATION =====

export interface AIAnalysisEngineConfig {
  models: AIModelConfig;
  analysis: AnalysisConfig;
  output: OutputConfig;
  performance: PerformanceConfig;
  integration: IntegrationConfig;
}

export interface AIModelConfig {
  primaryModel: string;
  fallbackModel?: string;
  researchModel?: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  enableStreaming: boolean;
}

export interface AnalysisConfig {
  defaultDepth: AnalysisDepth;
  enablePredictions: boolean;
  enableRecommendations: boolean;
  enableComparisons: boolean;
  confidenceThreshold: number;
  maxInsights: number;
  maxRecommendations: number;
}

export type AnalysisDepth = 'surface' | 'standard' | 'deep' | 'comprehensive';

export interface OutputConfig {
  format: OutputFormat;
  includeEvidence: boolean;
  includeMetadata: boolean;
  includeVisualization: boolean;
  language: string;
  technicalLevel: TechnicalLevel;
}

export type OutputFormat = 'structured' | 'narrative' | 'executive_summary' | 'technical_report';
export type TechnicalLevel = 'executive' | 'manager' | 'analyst' | 'technical';

export interface PerformanceConfig {
  cacheEnabled: boolean;
  cacheTTL: number;
  parallelProcessing: boolean;
  maxConcurrentAnalyses: number;
  timeoutMs: number;
}

export interface IntegrationConfig {
  enabledSystems: string[];
  dataRefreshInterval: number;
  realTimeUpdates: boolean;
  webhookEndpoints: string[];
  notificationThresholds: NotificationThreshold[];
}

export interface NotificationThreshold {
  metric: string;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  recipients: string[];
}

// ===== SPECIALIZED ANALYSIS TYPES =====

export interface CrisisAssessment extends AnalysisResponse {
  crisisType: CrisisType;
  severity: CrisisSeverity;
  urgency: number;
  affectedSystems: string[];
  responseOptions: CrisisResponse[];
  escalationPotential: number;
}

export type CrisisType = 
  | 'economic_collapse'
  | 'social_unrest'
  | 'technological_failure'
  | 'political_instability'
  | 'demographic_crisis'
  | 'environmental_disaster'
  | 'cyber_attack'
  | 'information_warfare';

export type CrisisSeverity = 'minor' | 'moderate' | 'major' | 'critical' | 'catastrophic';

export interface CrisisResponse {
  type: string;
  description: string;
  effectiveness: number;
  cost: number;
  timeframe: string;
  sideEffects: string[];
}

export interface OpportunityAnalysis extends AnalysisResponse {
  opportunityType: OpportunityType;
  potential: number;
  feasibility: number;
  timeWindow: string;
  requirements: string[];
  competitiveAdvantage: number;
  riskFactors: string[];
}

export type OpportunityType = 
  | 'market_expansion'
  | 'technological_breakthrough'
  | 'diplomatic_opening'
  | 'resource_discovery'
  | 'social_innovation'
  | 'strategic_alliance'
  | 'competitive_weakness';

export interface ComparativeAnalysis extends AnalysisResponse {
  comparisonType: ComparisonType;
  subjects: ComparisonSubject[];
  metrics: ComparisonMetric[];
  rankings: Ranking[];
  gaps: Gap[];
  benchmarks: Benchmark[];
}

export type ComparisonType = 
  | 'civilization_comparison'
  | 'temporal_comparison'
  | 'scenario_comparison'
  | 'system_comparison'
  | 'performance_comparison';

export interface ComparisonSubject {
  id: string;
  name: string;
  type: string;
  data: any;
}

export interface ComparisonMetric {
  name: string;
  unit: string;
  values: Record<string, number>;
  importance: number;
}

export interface Ranking {
  metric: string;
  rankings: RankingEntry[];
}

export interface RankingEntry {
  subjectId: string;
  rank: number;
  value: number;
  percentile: number;
}

export interface Gap {
  metric: string;
  leader: string;
  laggard: string;
  gapSize: number;
  significance: number;
}

export interface Benchmark {
  metric: string;
  benchmarkValue: number;
  source: string;
  subjects: BenchmarkComparison[];
}

export interface BenchmarkComparison {
  subjectId: string;
  value: number;
  deviation: number;
  performance: 'above' | 'at' | 'below';
}

// ===== EVENT AND MONITORING TYPES =====

export interface AnalysisEvent {
  id: string;
  type: AnalysisEventType;
  severity: EventSeverity;
  title: string;
  description: string;
  affectedSystems: string[];
  data: any;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export type AnalysisEventType = 
  | 'threshold_breach'
  | 'anomaly_detected'
  | 'trend_reversal'
  | 'correlation_change'
  | 'prediction_update'
  | 'system_alert'
  | 'data_quality_issue';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface MonitoringRule {
  id: string;
  name: string;
  description: string;
  condition: MonitoringCondition;
  actions: MonitoringAction[];
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface MonitoringCondition {
  metric: string;
  operator: ComparisonOperator;
  threshold: number;
  timeWindow?: string;
  consecutiveOccurrences?: number;
}

export type ComparisonOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'change_gt' | 'change_lt';

export interface MonitoringAction {
  type: ActionType;
  parameters: Record<string, any>;
  delay?: number;
}

export type ActionType = 
  | 'notification'
  | 'analysis_trigger'
  | 'webhook'
  | 'email'
  | 'escalation'
  | 'auto_response';

// ===== UTILITY TYPES =====

export interface AnalysisCache {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number;
  hits: number;
}

export interface AnalysisJob {
  id: string;
  request: AnalysisRequest;
  status: JobStatus;
  progress: number;
  startTime: Date;
  endTime?: Date;
  result?: AnalysisResponse;
  error?: string;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AnalysisMetrics {
  totalAnalyses: number;
  averageExecutionTime: number;
  successRate: number;
  cacheHitRate: number;
  systemLoad: number;
  queueLength: number;
}
