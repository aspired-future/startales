/**
 * Hybrid Simulation Engine Types
 * Combines deterministic calculations with AI-powered natural language analysis
 * Operates on 120-second strategic tick intervals
 */

import { CampaignState } from '../sim/types.js';

// ===== CORE TICK TYPES =====

export interface StrategicTick {
  tickId: number;
  campaignId: number;
  timestamp: Date;
  interval: number; // milliseconds (120000 for 2 minutes)
  seed: string;
  playerActions: PlayerAction[];
  
  // Processing phases
  deterministicPhase: DeterministicResults;
  naturalLanguagePhase: NaturalLanguageResults;
  hybridIntegration: HybridResults;
  memoryUpdates: MemoryUpdate[];
  
  // Performance metrics
  processingTime: number;
  phaseTimings: {
    deterministic: number;
    naturalLanguage: number;
    hybridIntegration: number;
    memoryUpdates: number;
    persistence: number;
  };
}

export interface TickConfiguration {
  mode: 'strategic' | 'accelerated' | 'idle' | 'offline';
  tickRate: number; // Hz
  interval: number; // milliseconds
  description: string;
}

export const TICK_MODES: Record<string, TickConfiguration> = {
  strategic: {
    mode: 'strategic',
    tickRate: 0.0083,   // 120 second intervals (2 minutes)
    interval: 120000,
    description: 'Strategic civilization gameplay - standard pace'
  },
  accelerated: {
    mode: 'accelerated', 
    tickRate: 0.0167,   // 60 second intervals (1 minute)
    interval: 60000,
    description: 'Accelerated gameplay for testing or fast sessions'
  },
  idle: {
    mode: 'idle',
    tickRate: 0.0033,   // 300 second intervals (5 minutes)  
    interval: 300000,
    description: 'Background processing when players idle'
  },
  offline: {
    mode: 'offline',
    tickRate: 0.0,      // On-demand only
    interval: 0,
    description: 'Offline acceleration - process on player return'
  }
};

// ===== PLAYER ACTION TYPES =====

export interface PlayerAction {
  id: string;
  playerId: string;
  actionType: 'policy' | 'building' | 'research' | 'military' | 'diplomacy' | 'trade';
  actionData: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Execution context
  requiresImmediate: boolean; // Execute immediately vs wait for tick
  affectsSimulation: boolean; // Influences next tick calculations
}

// ===== DETERMINISTIC RESULTS =====

export interface DeterministicResults {
  // Existing simulation engine results
  campaignState: CampaignState;
  
  // Enhanced analytics
  economic: EconomicAnalytics;
  military: MilitaryAnalytics;
  research: ResearchAnalytics;
  population: PopulationAnalytics;
  diplomatic: DiplomaticAnalytics;
  
  // Performance metrics
  calculationTime: number;
  changesFromPreviousTick: StateChanges;
}

export interface EconomicAnalytics {
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  tradeBalance: number;
  resourceProduction: Record<string, number>;
  resourceConsumption: Record<string, number>;
  marketPrices: Record<string, number>;
  priceVolatility: Record<string, number>;
}

export interface MilitaryAnalytics {
  totalForces: number;
  readinessLevel: number;
  morale: number;
  defensiveCapability: number;
  offensiveCapability: number;
  logisticsEfficiency: number;
  threatLevel: number;
}

export interface ResearchAnalytics {
  totalProjects: number;
  completionRate: number;
  breakthroughProbability: number;
  researchEfficiency: number;
  technologyLevel: number;
  innovationIndex: number;
}

export interface PopulationAnalytics {
  totalPopulation: number;
  populationGrowth: number;
  happinessIndex: number;
  educationLevel: number;
  healthIndex: number;
  employmentRate: number;
  migrationRate: number;
}

export interface DiplomaticAnalytics {
  relationships: Record<string, number>; // civilization_id -> relationship_score
  activeNegotiations: number;
  tradeAgreements: number;
  conflicts: number;
  diplomaticInfluence: number;
}

export interface StateChanges {
  economic: string[];
  military: string[];
  research: string[];
  population: string[];
  diplomatic: string[];
  significant: boolean;
}

// ===== NATURAL LANGUAGE ANALYSIS =====

export interface NaturalLanguageResults {
  // Population sentiment analysis
  populationMood: PopulationMood;
  
  // Economic narrative
  economicStory: EconomicNarrative;
  
  // Military assessment
  militaryStatus: MilitaryAssessment;
  
  // Diplomatic context
  diplomaticSituation: DiplomaticNarrative;
  
  // Technology progress
  researchNarrative: ResearchNarrative;
  
  // Cross-cutting themes
  overallNarrative: string;
  keyEvents: NarrativeEvent[];
  predictions: Prediction[];
  
  // Analysis metadata
  analysisTime: number;
  confidenceScore: number;
  sourcesAnalyzed: AnalysisSource[];
}

export interface PopulationMood {
  overall: 'ecstatic' | 'happy' | 'content' | 'concerned' | 'angry' | 'rebellious';
  factors: string[];
  witterSentiment: SentimentAnalysis;
  demographicBreakdown: Record<string, string>; // age_group/profession -> mood
  trendDirection: 'improving' | 'stable' | 'declining';
}

export interface SentimentAnalysis {
  overallSentiment: number; // -1.0 to 1.0
  emotionalBreakdown: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
    trust: number;
  };
  topTopics: Array<{
    topic: string;
    sentiment: number;
    mentions: number;
  }>;
  influentialPosts: Array<{
    postId: string;
    author: string;
    content: string;
    sentiment: number;
    engagement: number;
  }>;
}

export interface EconomicNarrative {
  summary: string;
  trends: EconomicTrend[];
  predictions: string[];
  concerns: string[];
  opportunities: string[];
  marketStory: string;
}

export interface EconomicTrend {
  category: 'production' | 'trade' | 'employment' | 'prices' | 'growth';
  direction: 'up' | 'down' | 'stable' | 'volatile';
  magnitude: 'minor' | 'moderate' | 'significant' | 'major';
  description: string;
  causes: string[];
  implications: string[];
}

export interface MilitaryAssessment {
  readiness: string;
  morale: string;
  threats: ThreatAssessment[];
  opportunities: string[];
  strategicSituation: string;
  recommendations: string[];
}

export interface ThreatAssessment {
  source: string;
  type: 'military' | 'economic' | 'diplomatic' | 'internal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0.0 to 1.0
  description: string;
  timeframe: string;
  mitigationOptions: string[];
}

export interface DiplomaticNarrative {
  relationships: RelationshipAnalysis[];
  negotiations: string[];
  tensions: string[];
  opportunities: string[];
  overallStanding: string;
}

export interface RelationshipAnalysis {
  civilizationId: string;
  civilizationName: string;
  currentStatus: string;
  trend: 'improving' | 'stable' | 'deteriorating';
  keyIssues: string[];
  opportunities: string[];
  riskFactors: string[];
}

export interface ResearchNarrative {
  breakthroughs: string[];
  setbacks: string[];
  innovations: Innovation[];
  researchClimate: string;
  futureProspects: string[];
}

export interface Innovation {
  field: string;
  type: 'breakthrough' | 'incremental' | 'disruptive';
  description: string;
  implications: string[];
  timeToImplementation: string;
  requiredResources: string[];
}

export interface NarrativeEvent {
  type: 'economic' | 'military' | 'diplomatic' | 'research' | 'social' | 'environmental';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  title: string;
  description: string;
  implications: string[];
  playerActions: string[];
}

export interface Prediction {
  category: string;
  timeframe: 'short' | 'medium' | 'long'; // 1-3 ticks, 4-10 ticks, 10+ ticks
  probability: number; // 0.0 to 1.0
  description: string;
  indicators: string[];
  implications: string[];
}

export interface AnalysisSource {
  type: 'witter_posts' | 'economic_data' | 'military_reports' | 'diplomatic_cables' | 'research_reports';
  count: number;
  timeRange: string;
  quality: 'low' | 'medium' | 'high';
}

// ===== HYBRID INTEGRATION =====

export interface HybridResults {
  // Natural language affects deterministic calculations
  sentimentModifiers: SentimentModifiers;
  
  // Deterministic results inform natural language
  narrativeContext: NarrativeContext;
  
  // Cross-system effects
  emergentEvents: EmergentEvent[];
  policyRecommendations: PolicyRecommendation[];
  crisisAlerts: CrisisAlert[];
  
  // Final integrated state
  finalCampaignState: CampaignState;
  
  // Integration metadata
  integrationTime: number;
  modificationsApplied: string[];
  narrativeEnhancements: string[];
}

export interface SentimentModifiers {
  productionEfficiency: number; // -0.2 to +0.2
  researchSpeed: number;        // -0.3 to +0.3
  militaryMorale: number;       // -0.4 to +0.4
  taxCompliance: number;        // -0.5 to +0.5
  tradeEfficiency: number;      // -0.3 to +0.3
  diplomaticInfluence: number;  // -0.2 to +0.2
  
  // Modifier sources
  modifierSources: {
    populationMood: number;
    economicConfidence: number;
    militaryMorale: number;
    leadershipTrust: number;
  };
}

export interface NarrativeContext {
  economicTrends: string[];
  militaryEvents: string[];
  researchBreakthroughs: string[];
  populationEvents: string[];
  diplomaticDevelopments: string[];
  
  // Context enrichment
  historicalComparisons: string[];
  futureImplications: string[];
  strategicInsights: string[];
}

export interface EmergentEvent {
  id: string;
  type: 'crisis' | 'opportunity' | 'breakthrough' | 'disaster' | 'discovery';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  title: string;
  description: string;
  
  // Event mechanics
  triggers: string[];
  effects: EventEffect[];
  duration: number; // ticks
  playerChoices: PlayerChoice[];
  
  // Narrative elements
  storyContext: string;
  characterInvolvement: string[];
  publicReaction: string;
}

export interface EventEffect {
  target: 'economic' | 'military' | 'research' | 'population' | 'diplomatic';
  modifier: number;
  duration: number; // ticks
  description: string;
}

export interface PlayerChoice {
  id: string;
  title: string;
  description: string;
  consequences: EventEffect[];
  requirements: string[];
  cost: Record<string, number>; // resource costs
}

export interface PolicyRecommendation {
  id: string;
  category: 'economic' | 'military' | 'research' | 'social' | 'diplomatic';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  
  // Recommendation details
  rationale: string[];
  expectedEffects: string[];
  risks: string[];
  alternatives: string[];
  
  // Implementation
  implementationSteps: string[];
  resourceRequirements: Record<string, number>;
  timeframe: string;
}

export interface CrisisAlert {
  id: string;
  type: 'economic' | 'military' | 'social' | 'environmental' | 'diplomatic';
  severity: 'warning' | 'serious' | 'critical' | 'catastrophic';
  title: string;
  description: string;
  
  // Crisis details
  causes: string[];
  currentEffects: string[];
  projectedConsequences: string[];
  
  // Response options
  immediateActions: string[];
  strategicResponses: string[];
  preventiveMeasures: string[];
  
  // Timeline
  timeToImpact: number; // ticks
  windowForAction: number; // ticks
}

// ===== MEMORY INTEGRATION =====

export interface MemoryUpdate {
  type: 'character' | 'civilization' | 'psychology' | 'ai_analysis';
  targetId: string; // character_id, civilization_id, psychology_engine_id, or ai_analysis_engine_id
  
  // Update content
  memories: MemoryEntry[];
  
  // Update metadata
  updateTime: number;
  memoryCount: number;
  success: boolean;
  errors: string[];
}

export interface MemoryEntry {
  content: string;
  contentType: 'tick_summary' | 'event' | 'analysis' | 'decision' | 'outcome' | 'psychology_analysis' | 'ai_insight' | 'trend_analysis' | 'behavioral_pattern';
  metadata: {
    tickId: number;
    timestamp: Date;
    importance: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    relatedEntities: string[];
    analysisType?: 'psychology' | 'ai_analysis' | 'hybrid';
    continuityScore?: number; // 0-1 score indicating how this connects to previous analysis
  };
}

// ===== PSYCHOLOGY MEMORY =====

export interface PsychologyMemoryEntry {
  content: string;
  analysisType: 'population_sentiment' | 'behavioral_trend' | 'psychological_shift' | 'mood_analysis' | 'social_dynamics';
  psychologyMetrics: {
    overallMood: string;
    sentimentScore: number;
    behavioralIndicators: string[];
    trendDirection: 'improving' | 'stable' | 'declining';
    confidenceLevel: number;
  };
  continuityFactors: {
    previousTickReference: number;
    trendContinuation: boolean;
    significantChanges: string[];
    contextualFactors: string[];
  };
  metadata: {
    tickId: number;
    timestamp: Date;
    importance: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    relatedEntities: string[];
  };
}

// ===== AI ANALYSIS MEMORY =====

export interface AIAnalysisMemoryEntry {
  content: string;
  analysisType: 'economic_insight' | 'strategic_assessment' | 'predictive_analysis' | 'pattern_recognition' | 'cross_domain_correlation';
  analysisMetrics: {
    insightCategory: string;
    confidenceScore: number;
    predictionAccuracy?: number; // For tracking prediction success over time
    correlationStrength?: number;
    noveltyScore: number; // How new/different this insight is
  };
  continuityFactors: {
    buildOnPreviousAnalysis: boolean;
    referencedInsights: string[]; // IDs of previous insights this builds upon
    contradictsPrevious: boolean;
    evolutionFromTick: number;
  };
  metadata: {
    tickId: number;
    timestamp: Date;
    importance: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    relatedEntities: string[];
  };
}

// ===== CAMPAIGN MANAGEMENT =====

export interface CampaignTicker {
  campaignId: number;
  isActive: boolean;
  currentMode: TickConfiguration;
  
  // Tick scheduling
  nextTickTime: Date;
  lastTickTime: Date;
  tickCount: number;
  
  // Performance tracking
  averageTickTime: number;
  lastTickDuration: number;
  errorCount: number;
  
  // Player activity
  activePlayers: string[];
  lastPlayerAction: Date;
  queuedActions: PlayerAction[];
}

// ===== ENGINE CONFIGURATION =====

export interface HybridEngineConfig {
  // Tick configuration
  defaultTickMode: keyof typeof TICK_MODES;
  adaptiveTickRates: boolean;
  maxConcurrentTicks: number;
  
  // Processing configuration
  enableNaturalLanguageAnalysis: boolean;
  enableMemoryIntegration: boolean;
  enableEmergentEvents: boolean;
  
  // Performance limits
  maxTickProcessingTime: number; // milliseconds
  maxNaturalLanguageAnalysisTime: number; // milliseconds
  maxMemoryUpdateTime: number; // milliseconds
  
  // AI configuration
  aiProvider: string;
  aiModel: string;
  maxTokensPerAnalysis: number;
  analysisTemperature: number;
  
  // Memory configuration
  memoryBatchSize: number;
  memoryRetentionDays: number;
  enableMemoryCompression: boolean;
}

export const DEFAULT_HYBRID_ENGINE_CONFIG: HybridEngineConfig = {
  defaultTickMode: 'strategic',
  adaptiveTickRates: true,
  maxConcurrentTicks: 10,
  
  enableNaturalLanguageAnalysis: true,
  enableMemoryIntegration: true,
  enableEmergentEvents: true,
  
  maxTickProcessingTime: 30000, // 30 seconds
  maxNaturalLanguageAnalysisTime: 15000, // 15 seconds
  maxMemoryUpdateTime: 10000, // 10 seconds
  
  aiProvider: 'openai',
  aiModel: 'gpt-4',
  maxTokensPerAnalysis: 4000,
  analysisTemperature: 0.7,
  
  memoryBatchSize: 50,
  memoryRetentionDays: 90,
  enableMemoryCompression: true
};
