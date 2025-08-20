/**
 * Intelligence Reporting System Types
 * Defines comprehensive intelligence report structures for domestic and foreign intelligence
 */

// ===== CORE INTELLIGENCE TYPES =====

export interface IntelligenceReport {
  id: string;
  campaignId: number;
  reportType: IntelligenceReportType;
  classification: ClassificationLevel;
  
  // Report metadata
  generatedAt: Date;
  reportingPeriod: {
    startTick: number;
    endTick: number;
    startDate: Date;
    endDate: Date;
  };
  
  // Report content
  executiveSummary: string;
  keyFindings: string[];
  threatAssessment: ThreatLevel;
  recommendations: IntelligenceRecommendation[];
  
  // Source information
  sources: IntelligenceSource[];
  confidence: ConfidenceLevel;
  reliability: ReliabilityLevel;
  
  // Report sections
  sections: IntelligenceSection[];
  
  // Metadata
  generatedBy: string; // AI system identifier
  reviewedBy?: string; // Human reviewer if applicable
  distributionList: string[]; // Who should receive this report
  
  // Analytics
  analytics: ReportAnalytics;
}

export type IntelligenceReportType = 
  | 'domestic_intelligence'
  | 'foreign_intelligence' 
  | 'economic_intelligence'
  | 'military_intelligence'
  | 'technological_intelligence'
  | 'social_intelligence'
  | 'cyber_intelligence'
  | 'strategic_assessment'
  | 'threat_analysis'
  | 'opportunity_assessment';

export type ClassificationLevel = 
  | 'unclassified'
  | 'restricted'
  | 'confidential'
  | 'secret'
  | 'top_secret';

export type ThreatLevel = 
  | 'minimal'
  | 'low'
  | 'moderate'
  | 'high'
  | 'critical'
  | 'existential';

export type ConfidenceLevel = 
  | 'very_low'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very_high';

export type ReliabilityLevel = 
  | 'unreliable'
  | 'questionable'
  | 'fair'
  | 'good'
  | 'excellent';

// ===== INTELLIGENCE SECTIONS =====

export interface IntelligenceSection {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  
  // Section-specific data
  data?: Record<string, any>;
  charts?: ChartData[];
  maps?: MapData[];
  
  // Source tracking
  sources: string[]; // Reference to source IDs
  confidence: ConfidenceLevel;
  
  // Analysis
  keyPoints: string[];
  implications: string[];
  followUpActions?: string[];
}

export type SectionType = 
  | 'executive_summary'
  | 'situation_overview'
  | 'threat_analysis'
  | 'opportunity_assessment'
  | 'resource_analysis'
  | 'capability_assessment'
  | 'trend_analysis'
  | 'predictive_analysis'
  | 'recommendations'
  | 'appendix';

// ===== INTELLIGENCE SOURCES =====

export interface IntelligenceSource {
  id: string;
  type: SourceType;
  description: string;
  
  // Source metadata
  reliability: ReliabilityLevel;
  accessLevel: ClassificationLevel;
  lastUpdated: Date;
  
  // Source-specific data
  data: SourceData;
  
  // Quality metrics
  accuracy: number; // 0-1 scale
  timeliness: number; // 0-1 scale
  relevance: number; // 0-1 scale
}

export type SourceType = 
  | 'simulation_data'
  | 'ai_analysis'
  | 'psychology_memory'
  | 'civilization_memory'
  | 'economic_indicators'
  | 'social_media'
  | 'diplomatic_channels'
  | 'military_reports'
  | 'technology_assessments'
  | 'cyber_monitoring'
  | 'human_intelligence'
  | 'signals_intelligence'
  | 'open_source';

export interface SourceData {
  // Simulation-based sources
  simulationTick?: number;
  gameState?: Record<string, any>;
  
  // Memory-based sources
  memoryEntries?: string[]; // Memory entry IDs
  analysisResults?: Record<string, any>;
  
  // External sources (for future expansion)
  externalData?: Record<string, any>;
  
  // Raw data
  rawData?: any;
  processedData?: any;
}

// ===== RECOMMENDATIONS =====

export interface IntelligenceRecommendation {
  id: string;
  priority: Priority;
  category: RecommendationCategory;
  
  // Recommendation content
  title: string;
  description: string;
  rationale: string;
  
  // Implementation
  suggestedActions: string[];
  timeline: Timeline;
  resources: ResourceRequirement[];
  
  // Risk assessment
  risks: Risk[];
  benefits: Benefit[];
  
  // Tracking
  status: RecommendationStatus;
  assignedTo?: string;
  dueDate?: Date;
  
  // Dependencies
  dependencies: string[]; // Other recommendation IDs
  prerequisites: string[];
}

export type Priority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'
  | 'critical';

export type RecommendationCategory = 
  | 'policy'
  | 'military'
  | 'economic'
  | 'diplomatic'
  | 'technological'
  | 'social'
  | 'security'
  | 'intelligence'
  | 'infrastructure';

export type RecommendationStatus = 
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'deferred';

export interface Timeline {
  immediate: string[]; // Actions to take immediately
  shortTerm: string[]; // Actions within 1-3 ticks
  mediumTerm: string[]; // Actions within 4-10 ticks
  longTerm: string[]; // Actions beyond 10 ticks
}

export interface ResourceRequirement {
  type: ResourceType;
  amount: number;
  description: string;
  critical: boolean;
}

export type ResourceType = 
  | 'financial'
  | 'personnel'
  | 'technology'
  | 'time'
  | 'political_capital'
  | 'military_assets'
  | 'intelligence_assets';

export interface Risk {
  description: string;
  probability: number; // 0-1 scale
  impact: number; // 0-1 scale
  mitigation: string;
}

export interface Benefit {
  description: string;
  probability: number; // 0-1 scale
  value: number; // 0-1 scale
  timeframe: string;
}

// ===== ANALYTICS & VISUALIZATION =====

export interface ReportAnalytics {
  // Report metrics
  generationTime: number; // milliseconds
  sourceCount: number;
  sectionCount: number;
  wordCount: number;
  
  // Quality metrics
  overallConfidence: number; // 0-1 scale
  sourceReliability: number; // 0-1 scale
  dataFreshness: number; // 0-1 scale (1 = very recent)
  
  // Content analysis
  sentimentScore: number; // -1 to 1 scale
  urgencyScore: number; // 0-1 scale
  actionabilityScore: number; // 0-1 scale
  
  // Comparison metrics
  changeFromPrevious?: {
    threatLevel: number; // -1 to 1 (decrease to increase)
    confidence: number;
    sourceCount: number;
  };
  
  // Trends
  trends: TrendIndicator[];
}

export interface TrendIndicator {
  category: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number; // 0-1 scale
  confidence: number; // 0-1 scale
  description: string;
}

export interface ChartData {
  id: string;
  type: ChartType;
  title: string;
  data: any; // Chart-specific data structure
  config?: Record<string, any>; // Chart configuration
}

export type ChartType = 
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'heatmap'
  | 'timeline'
  | 'network'
  | 'treemap';

export interface MapData {
  id: string;
  type: MapType;
  title: string;
  layers: MapLayer[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export type MapType = 
  | 'political'
  | 'military'
  | 'economic'
  | 'demographic'
  | 'infrastructure'
  | 'threat';

export interface MapLayer {
  id: string;
  type: LayerType;
  data: any;
  style?: Record<string, any>;
  visible: boolean;
}

export type LayerType = 
  | 'markers'
  | 'polygons'
  | 'heatmap'
  | 'routes'
  | 'boundaries';

// ===== INTELLIGENCE SCHEDULING =====

export interface IntelligenceSchedule {
  id: string;
  campaignId: number;
  
  // Schedule configuration
  reportType: IntelligenceReportType;
  frequency: ScheduleFrequency;
  priority: Priority;
  
  // Timing
  nextGeneration: Date;
  lastGeneration?: Date;
  
  // Configuration
  config: ScheduleConfig;
  
  // Status
  enabled: boolean;
  status: ScheduleStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type ScheduleFrequency = 
  | 'every_tick'
  | 'every_2_ticks'
  | 'every_5_ticks'
  | 'every_10_ticks'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'on_demand'
  | 'event_triggered';

export type ScheduleStatus = 
  | 'active'
  | 'paused'
  | 'error'
  | 'completed';

export interface ScheduleConfig {
  // Report parameters
  classification: ClassificationLevel;
  distributionList: string[];
  
  // Content configuration
  includeSections: SectionType[];
  excludeSources?: SourceType[];
  minConfidence?: ConfidenceLevel;
  
  // Triggers
  triggers?: IntelligenceTrigger[];
  
  // Customization
  template?: string;
  customPrompts?: Record<string, string>;
}

export interface IntelligenceTrigger {
  id: string;
  type: TriggerType;
  condition: TriggerCondition;
  description: string;
}

export type TriggerType = 
  | 'threat_level_change'
  | 'significant_event'
  | 'data_threshold'
  | 'time_based'
  | 'manual';

export interface TriggerCondition {
  // Threshold-based triggers
  metric?: string;
  operator?: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value?: number;
  
  // Event-based triggers
  eventType?: string;
  eventSeverity?: string;
  
  // Time-based triggers
  timeCondition?: string;
  
  // Custom conditions
  customLogic?: string;
}

// ===== INTELLIGENCE ENGINE CONFIGURATION =====

export interface IntelligenceEngineConfig {
  // AI Configuration
  llmProvider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  
  // Analysis parameters
  analysisDepth: 'basic' | 'standard' | 'comprehensive' | 'deep';
  historicalContext: number; // Number of previous ticks to consider
  
  // Memory integration
  useMemoryContext: boolean;
  memorySearchLimit: number;
  memoryMinScore: number;
  
  // Quality thresholds
  minConfidence: number;
  minReliability: number;
  
  // Performance settings
  maxConcurrentReports: number;
  reportTimeout: number; // milliseconds
  
  // Security settings
  enableClassification: boolean;
  defaultClassification: ClassificationLevel;
  
  // Customization
  customPrompts: Record<string, string>;
  reportTemplates: Record<string, string>;
}

// ===== API INTERFACES =====

export interface GenerateReportRequest {
  campaignId: number;
  reportType: IntelligenceReportType;
  
  // Optional parameters
  classification?: ClassificationLevel;
  priority?: Priority;
  customConfig?: Partial<IntelligenceEngineConfig>;
  
  // Time range
  startTick?: number;
  endTick?: number;
  
  // Content customization
  includeSections?: SectionType[];
  excludeSources?: SourceType[];
  customPrompts?: Record<string, string>;
}

export interface GenerateReportResponse {
  success: boolean;
  report?: IntelligenceReport;
  error?: string;
  
  // Generation metadata
  generationTime: number;
  sourcesUsed: number;
  tokensUsed?: number;
}

export interface ListReportsRequest {
  campaignId: number;
  
  // Filtering
  reportType?: IntelligenceReportType;
  classification?: ClassificationLevel;
  startDate?: Date;
  endDate?: Date;
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Sorting
  sortBy?: 'date' | 'type' | 'classification' | 'threat_level';
  sortOrder?: 'asc' | 'desc';
}

export interface ListReportsResponse {
  success: boolean;
  reports: IntelligenceReport[];
  
  // Pagination
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  
  error?: string;
}

// ===== HEALTH & MONITORING =====

export interface IntelligenceSystemHealth {
  status: 'healthy' | 'degraded' | 'error';
  
  // Component health
  components: {
    engine: ComponentHealth;
    scheduler: ComponentHealth;
    memory: ComponentHealth;
    llm: ComponentHealth;
  };
  
  // Performance metrics
  metrics: {
    reportsGenerated: number;
    averageGenerationTime: number;
    successRate: number;
    errorRate: number;
  };
  
  // Current load
  currentLoad: {
    activeReports: number;
    queuedReports: number;
    scheduledReports: number;
  };
  
  lastCheck: Date;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'error';
  message?: string;
  lastCheck: Date;
  responseTime?: number;
}

// ===== ERROR HANDLING =====

export interface IntelligenceError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  reportId?: string;
  campaignId?: number;
}

export type IntelligenceErrorCode = 
  | 'GENERATION_FAILED'
  | 'INSUFFICIENT_DATA'
  | 'LLM_ERROR'
  | 'MEMORY_ERROR'
  | 'CLASSIFICATION_ERROR'
  | 'SCHEDULE_ERROR'
  | 'VALIDATION_ERROR'
  | 'TIMEOUT_ERROR';
