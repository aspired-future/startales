/**
 * Core Types and Interfaces for StarTales Orchestration System
 * Defines the fundamental data structures for API orchestration, game state management,
 * and AI prompt template execution.
 */

import { Pool } from 'pg';

// ============================================================================
// GAME STATE TYPES
// ============================================================================

export interface GameStateSnapshot {
  // Core Game Progression
  currentTick: number;
  currentTurn: number;
  gamePhase: 'early' | 'expansion' | 'mid_game' | 'late_game' | 'endgame';
  timestamp: Date;
  
  // Civilization Data
  civilizations: Map<string, CivilizationContext>;
  
  // Global Context
  galacticContext: GalacticContext;
  economicSituation: EconomicSituation;
  politicalSituation: PoliticalSituation;
  militarySituation: MilitarySituation;
  technologicalSituation: TechnologicalSituation;
  socialSituation: SocialSituation;
  
  // Active Events
  activeEvents: GameEvent[];
  activeCrises: CrisisEvent[];
  
  // Performance Metrics
  performanceMetrics: PerformanceMetrics;
}

export interface CivilizationContext {
  id: string;
  name: string;
  species: string;
  government_type: string;
  capital_planet: string;
  
  // Core Stats
  total_population: number;
  military_strength: number;
  economic_power: number;
  technology_level: number;
  diplomatic_standing: number;
  
  // Detailed Context
  populationData: PopulationData;
  economicData: EconomicData;
  militaryData: MilitaryData;
  technologyData: TechnologyData;
  cultureData: CultureData;
  
  // System States
  systemStates: Map<string, any>;
  knobSettings: Map<string, number>;
  
  // Recent History
  recentEvents: GameEvent[];
  recentDecisions: Decision[];
}

export interface GalacticContext {
  galaxySize: number;
  exploredSystems: number;
  totalSystems: number;
  activeExplorations: ExplorationMission[];
  cosmicEvents: CosmicEvent[];
  galacticMarkets: MarketData[];
  environmentalFactors: EnvironmentalFactor[];
}

// ============================================================================
// API EXECUTION TYPES
// ============================================================================

export interface APIExecutionContext {
  // Execution Metadata
  executionId: string;
  tickId: string;
  timestamp: Date;
  triggerType: 'scheduled' | 'player_action' | 'ai_triggered' | 'event_driven';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Game State Context
  gameState: GameStateSnapshot;
  civilizationContext?: CivilizationContext;
  playerContext?: PlayerContext;
  
  // System-Specific Data
  systemSpecificData: any;
  knobSettings: SystemKnobSettings;
  
  // Execution Configuration
  timeoutMs: number;
  retryAttempts: number;
  enableFallbacks: boolean;
  
  // Dependencies
  dependencyResults: Map<string, APIExecutionResult>;
}

export interface APIExecutionResult {
  // Execution Metadata
  executionId: string;
  systemId: string;
  success: boolean;
  executionTime: number;
  timestamp: Date;
  
  // Game State Updates
  gameStateUpdates: Partial<GameStateSnapshot>;
  civilizationUpdates: Map<string, Partial<CivilizationContext>>;
  
  // System Outputs
  systemOutputs: any;
  
  // AI Analysis Results
  aiInsights?: AIAnalysisResult[];
  recommendations?: SystemRecommendation[];
  
  // Events and Actions
  eventsGenerated: GameEvent[];
  scheduledActions: ScheduledAction[];
  
  // Performance Data
  executionMetrics: ExecutionMetrics;
  
  // Error Information
  error?: string;
  fallbackUsed?: string;
}

// ============================================================================
// APT (AI PROMPT TEMPLATE) TYPES
// ============================================================================

export interface APTTemplate {
  id: string;
  name: string;
  description: string;
  category: 'civilization' | 'inter-civ' | 'galactic';
  
  // Prompt Configuration
  promptTemplate: string;
  requiredVariables: string[];
  optionalVariables: string[];
  
  // AI Configuration
  preferredModel: string;
  temperature: number;
  maxTokens: number;
  
  // Output Configuration
  outputSchema: any; // JSON Schema
  outputFormat: 'json' | 'structured_text' | 'narrative';
  
  // Execution Configuration
  timeoutMs: number;
  retryAttempts: number;
  cacheable: boolean;
  cacheTTL: number;
  
  // Performance Hints
  estimatedExecutionTime: number;
  memoryUsage: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface APTExecutionRequest {
  aptId: string;
  variables: Record<string, any>;
  context: APIExecutionContext;
  priority: 'low' | 'medium' | 'high' | 'critical';
  overrides?: Partial<APTTemplate>;
}

export interface APTExecutionResult {
  // Execution Metadata
  executionId: string;
  aptId: string;
  success: boolean;
  executionTime: number;
  timestamp: Date;
  
  // AI Response
  rawResponse: string;
  parsedResult: any;
  confidence?: number;
  
  // Caching Information
  cacheHit: boolean;
  cacheKey?: string;
  
  // Quality Metrics
  qualityScore: number;
  fallbackUsed?: string;
  
  // Error Information
  error?: string;
  retryCount: number;
}

// ============================================================================
// SYSTEM DEFINITION TYPES
// ============================================================================

export interface SystemDefinition {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3; // Civilization, Inter-Civ, Galactic
  executionGroup: 'civilization' | 'inter-civ' | 'galactic';
  
  // Dependencies
  dependsOn: string[];
  maxDepth: number;
  
  // Execution Configuration
  executionMode: 'parallel' | 'sequential';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeoutMs: number;
  
  // Performance Characteristics
  estimatedExecutionTime: number;
  memoryUsage: number;
  aptCount: number;
  
  // Scheduling
  frequency: 'every_tick' | 'periodic' | 'event_driven' | 'on_demand';
  interval?: number; // For periodic systems
  
  // API Configuration
  apiEndpoint: string;
  requiredKnobs: string[];
  optionalKnobs: string[];
}

// ============================================================================
// ORCHESTRATION TYPES
// ============================================================================

export interface TickExecutionPlan {
  tickId: string;
  startTime: Date;
  estimatedDuration: number;
  
  // Execution Phases
  tier1Systems: ParallelExecutionGroup[];
  tier2Systems: SequentialExecutionGroup;
  tier3Systems: SequentialExecutionGroup;
  
  // Resource Allocation
  maxConcurrency: number;
  memoryBudget: number;
  timeoutMs: number;
}

export interface ParallelExecutionGroup {
  groupId: string;
  systems: SystemDefinition[];
  estimatedTime: number;
  maxConcurrency: number;
}

export interface SequentialExecutionGroup {
  groupId: string;
  systems: SystemDefinition[];
  estimatedTime: number;
}

export interface TickExecutionResult {
  tickId: string;
  success: boolean;
  totalExecutionTime: number;
  
  // System Results
  systemResults: Map<string, APIExecutionResult>;
  aptResults: Map<string, APTExecutionResult>;
  
  // Game State Changes
  gameStateBefore: GameStateSnapshot;
  gameStateAfter: GameStateSnapshot;
  
  // Performance Metrics
  performanceMetrics: TickPerformanceMetrics;
  
  // Events and Actions
  eventsGenerated: GameEvent[];
  scheduledActions: ScheduledAction[];
  
  // Error Information
  errors: ExecutionError[];
  warnings: ExecutionWarning[];
}

// ============================================================================
// PERFORMANCE AND MONITORING TYPES
// ============================================================================

export interface PerformanceMetrics {
  // Execution Times
  averageTickTime: number;
  maxTickTime: number;
  minTickTime: number;
  
  // System Performance
  systemExecutionTimes: Map<string, number>;
  aptExecutionTimes: Map<string, number>;
  
  // Resource Usage
  memoryUsage: number;
  cpuUsage: number;
  
  // Success Rates
  systemSuccessRates: Map<string, number>;
  aptSuccessRates: Map<string, number>;
  
  // Cache Performance
  cacheHitRates: Map<string, number>;
  cacheSize: number;
}

export interface ExecutionMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuTime: number;
  cacheHits: number;
  cacheMisses: number;
  retryCount: number;
  fallbacksUsed: number;
}

// ============================================================================
// CIRCUIT BREAKER AND FAULT TOLERANCE TYPES
// ============================================================================

export interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: Date;
  successCount: number;
  lastSuccessTime: Date;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeMs: number;
  successThreshold: number; // For HALF_OPEN -> CLOSED transition
  timeoutMs: number;
}

// ============================================================================
// EVENT AND SCHEDULING TYPES
// ============================================================================

export interface GameEvent {
  id: string;
  type: string;
  source: string;
  target?: string;
  data: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
}

export interface ScheduledAction {
  id: string;
  systemId: string;
  action: string;
  parameters: any;
  scheduledTime: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  retryCount: number;
  maxRetries: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExecutionError {
  systemId: string;
  error: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

export interface ExecutionWarning {
  systemId: string;
  warning: string;
  timestamp: Date;
  suggestion?: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface OrchestrationConfig {
  // Timing Configuration
  tickInterval: number;
  maxTickDuration: number;
  
  // Concurrency Configuration
  maxConcurrentSystems: number;
  maxConcurrentAPTs: number;
  maxConcurrentCivilizations: number;
  
  // Resource Limits
  maxMemoryUsage: number;
  maxCpuUsage: number;
  
  // Timeout Configuration
  systemTimeoutMs: number;
  aptTimeoutMs: number;
  tickTimeoutMs: number;
  
  // Retry Configuration
  maxRetryAttempts: number;
  retryDelayMs: number;
  
  // Circuit Breaker Configuration
  circuitBreakerConfig: CircuitBreakerConfig;
  
  // Cache Configuration
  cacheEnabled: boolean;
  cacheMaxSize: number;
  cacheDefaultTTL: number;
  
  // AI Configuration
  aiModels: {
    primary: string;
    fallback: string;
    research: string;
  };
  
  // Database Configuration
  databasePool: Pool;
}

// ============================================================================
// EXPORTED INTERFACES FOR EXTERNAL USE
// ============================================================================

export interface IGameStateManager {
  getCurrentState(): Promise<GameStateSnapshot>;
  updateState(updates: Partial<GameStateSnapshot>): Promise<void>;
  getCivilizationState(civilizationId: string): Promise<CivilizationContext>;
  updateCivilizationState(civilizationId: string, updates: Partial<CivilizationContext>): Promise<void>;
}

export interface IAPIRegistry {
  registerSystem(definition: SystemDefinition): void;
  getSystem(systemId: string): SystemDefinition | undefined;
  getAllSystems(): SystemDefinition[];
  getSystemsByTier(tier: 1 | 2 | 3): SystemDefinition[];
}

export interface IExecutionController {
  executeSystem(systemId: string, context: APIExecutionContext): Promise<APIExecutionResult>;
  executeWithTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T>;
  cancelExecution(executionId: string): void;
  cancelAllExecutions(): void;
}

export interface IAPTEngine {
  executeAPT(request: APTExecutionRequest): Promise<APTExecutionResult>;
  registerTemplate(template: APTTemplate): void;
  getTemplate(aptId: string): APTTemplate | undefined;
  getAllTemplates(): APTTemplate[];
}

export interface IOrchestrator {
  start(): Promise<void>;
  stop(): Promise<void>;
  executeTick(): Promise<TickExecutionResult>;
  getStatus(): OrchestrationStatus;
}

export interface OrchestrationStatus {
  running: boolean;
  currentTick: number;
  lastTickTime: Date;
  nextTickTime: Date;
  systemHealth: Map<string, SystemHealth>;
  performanceMetrics: PerformanceMetrics;
}

export interface SystemHealth {
  systemId: string;
  status: 'healthy' | 'degraded' | 'failed';
  lastExecution: Date;
  successRate: number;
  averageExecutionTime: number;
  circuitBreakerState: CircuitBreakerState;
}

// Additional supporting types that were referenced but not defined
export interface PopulationData {
  totalPopulation: number;
  demographics: any;
  growthRate: number;
  healthIndex: number;
  educationIndex: number;
}

export interface EconomicData {
  gdp: number;
  gdpGrowthRate: number;
  unemployment: number;
  inflation: number;
  tradeBalance: number;
}

export interface MilitaryData {
  totalForces: number;
  readiness: number;
  activeConflicts: any[];
  defenseBudget: number;
}

export interface TechnologyData {
  researchLevel: number;
  activeProjects: any[];
  innovations: any[];
  techTree: any;
}

export interface CultureData {
  culturalIndex: number;
  traditions: any[];
  languages: string[];
  socialCohesion: number;
}

export interface PlayerContext {
  playerId: string;
  civilizationId: string;
  permissions: string[];
  preferences: any;
}

export interface SystemKnobSettings {
  [knobName: string]: number;
}

export interface AIAnalysisResult {
  analysisId: string;
  confidence: number;
  insights: string[];
  recommendations: string[];
  data: any;
}

export interface SystemRecommendation {
  systemId: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: string;
}

export interface ExplorationMission {
  id: string;
  targetSystem: string;
  progress: number;
  estimatedCompletion: Date;
}

export interface CosmicEvent {
  id: string;
  type: string;
  location: string;
  impact: any;
  duration: number;
}

export interface MarketData {
  marketId: string;
  commodities: any[];
  prices: Map<string, number>;
  volume: number;
}

export interface EnvironmentalFactor {
  type: string;
  severity: number;
  affectedSystems: string[];
  duration: number;
}

export interface CrisisEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedCivilizations: string[];
  startTime: Date;
  estimatedDuration: number;
}

export interface Decision {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  outcome: any;
}

export interface EconomicSituation {
  globalGDP: number;
  tradeVolume: number;
  marketStability: number;
  inflation: number;
}

export interface PoliticalSituation {
  stability: number;
  activeWars: any[];
  activeTreaties: any[];
  diplomaticEvents: any[];
}

export interface MilitarySituation {
  globalTension: number;
  activeConflicts: any[];
  militaryBuildups: any[];
}

export interface TechnologicalSituation {
  globalTechLevel: number;
  breakthroughs: any[];
  researchCollaborations: any[];
}

export interface SocialSituation {
  globalCohesion: number;
  culturalExchanges: any[];
  socialMovements: any[];
}

export interface TickPerformanceMetrics {
  totalTime: number;
  tier1Time: number;
  tier2Time: number;
  tier3Time: number;
  systemTimes: Map<string, number>;
  aptTimes: Map<string, number>;
  memoryPeak: number;
  cacheHitRate: number;
}
