/**
 * Leader Communications & Natural Language Integration Types
 * 
 * Defines comprehensive types for leader briefings, speeches, decision support,
 * and natural language integration with simulation systems.
 */

// Leader Communication Types
export type CommunicationType = 
  | 'briefing' | 'speech' | 'announcement' | 'directive' | 'consultation'
  | 'crisis_response' | 'policy_statement' | 'diplomatic_message' | 'military_order';

export type BriefingType = 
  | 'daily' | 'weekly' | 'monthly' | 'situation' | 'crisis' | 'strategic'
  | 'economic' | 'military' | 'diplomatic' | 'intelligence' | 'custom';

export type SpeechType = 
  | 'state_of_civilization' | 'policy_announcement' | 'crisis_address' 
  | 'victory_speech' | 'memorial' | 'diplomatic_address' | 'rally'
  | 'economic_update' | 'military_briefing' | 'cultural_celebration';

export type DecisionCategory = 
  | 'economic' | 'military' | 'diplomatic' | 'social' | 'technological'
  | 'environmental' | 'legal' | 'security' | 'infrastructure' | 'cultural';

export type UrgencyLevel = 'routine' | 'important' | 'urgent' | 'critical' | 'emergency';

export type ConfidenceLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

// Leader Briefing Structure
export interface LeaderBriefing {
  id: string;
  type: BriefingType;
  title: string;
  summary: string;
  content: string;
  
  // Context and Sources
  campaignId: number;
  tickId: number;
  leaderCharacterId: string;
  
  // Briefing Sections
  sections: BriefingSection[];
  
  // Key Information
  keyPoints: string[];
  recommendations: Recommendation[];
  urgentMatters: UrgentMatter[];
  
  // Decision Support
  pendingDecisions: PendingDecision[];
  advisorInputs: AdvisorInput[];
  
  // Metrics and Analysis
  civilizationStatus: CivilizationStatus;
  threatAssessment: ThreatAssessment;
  opportunityAnalysis: OpportunityAnalysis;
  
  // Generation Context
  generationContext: {
    aiModel: string;
    prompt: string;
    temperature: number;
    confidence: number;
    generationTime: number;
    sources: string[];
  };
  
  // Metadata
  createdAt: Date;
  scheduledFor?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  acknowledged: boolean;
  priority: UrgencyLevel;
  classification: 'public' | 'restricted' | 'confidential' | 'secret' | 'top_secret';
}

// Briefing Section Structure
export interface BriefingSection {
  id: string;
  title: string;
  content: string;
  category: DecisionCategory;
  priority: UrgencyLevel;
  
  // Supporting Data
  metrics: Record<string, number>;
  charts?: ChartData[];
  attachments?: string[];
  
  // AI Analysis
  sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  confidence: ConfidenceLevel;
  keyInsights: string[];
  
  // Action Items
  actionRequired: boolean;
  suggestedActions: string[];
  deadline?: Date;
}

// Leader Speech Structure
export interface LeaderSpeech {
  id: string;
  type: SpeechType;
  title: string;
  content: string;
  summary: string;
  
  // Context
  campaignId: number;
  tickId: number;
  leaderCharacterId: string;
  
  // Delivery Information
  audience: SpeechAudience;
  venue: string;
  occasion: string;
  
  // Speech Characteristics
  tone: 'formal' | 'casual' | 'inspirational' | 'somber' | 'urgent' | 'celebratory';
  duration: number; // estimated minutes
  keyMessages: string[];
  
  // Impact and Effects
  expectedImpact: SpeechImpact;
  actualImpact?: SpeechImpact;
  simulationEffects: SimulationEffect[];
  
  // Public Reaction
  publicReaction?: {
    sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
    approval: number; // -1 to 1
    engagement: number; // 0 to 1
    mediaResponse: string[];
    socialMediaBuzz: number; // 0 to 1
  };
  
  // Generation Context
  generationContext: {
    aiModel: string;
    prompt: string;
    temperature: number;
    confidence: number;
    generationTime: number;
    styleGuide?: string;
  };
  
  // Metadata
  createdAt: Date;
  scheduledFor?: Date;
  deliveredAt?: Date;
  status: 'draft' | 'scheduled' | 'delivered' | 'cancelled';
  priority: UrgencyLevel;
}

// Speech Audience
export interface SpeechAudience {
  primary: 'general_public' | 'military' | 'government' | 'business_leaders' | 'diplomats' | 'scientists';
  demographics: string[];
  estimatedSize: number;
  broadcastChannels: string[];
  expectedReach: number; // percentage of population
}

// Speech Impact
export interface SpeechImpact {
  morale: number; // -1 to 1
  approval: number; // -1 to 1
  economicConfidence: number; // -1 to 1
  militaryReadiness: number; // -1 to 1
  diplomaticStanding: number; // -1 to 1
  socialCohesion: number; // -1 to 1
  
  // Specific Effects
  policySupport: Record<string, number>;
  behavioralChanges: string[];
  economicEffects: string[];
  politicalEffects: string[];
}

// Decision Support System
export interface PendingDecision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  urgency: UrgencyLevel;
  
  // Decision Context
  background: string;
  stakeholders: string[];
  constraints: string[];
  
  // Options Analysis
  options: DecisionOption[];
  recommendedOption?: string;
  
  // Impact Assessment
  riskAssessment: RiskAssessment;
  costBenefitAnalysis: CostBenefitAnalysis;
  
  // Timeline
  deadline: Date;
  escalationDate?: Date;
  
  // AI Analysis
  aiRecommendation?: {
    optionId: string;
    confidence: ConfidenceLevel;
    reasoning: string;
    alternativeConsiderations: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'under_review' | 'decided' | 'implemented' | 'cancelled';
  priority: number;
}

// Decision Option
export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  
  // Analysis
  pros: string[];
  cons: string[];
  risks: string[];
  opportunities: string[];
  
  // Impact Projections
  expectedOutcomes: ExpectedOutcome[];
  resourceRequirements: ResourceRequirement[];
  
  // Metrics
  successProbability: number; // 0 to 1
  riskLevel: number; // 0 to 1
  costEstimate: number;
  timeToImplement: number; // days
  
  // Stakeholder Analysis
  supportLevel: Record<string, number>; // stakeholder -> support (-1 to 1)
  opposition: string[];
  
  // AI Scoring
  aiScore?: number; // 0 to 1
  aiReasoning?: string;
}

// Recommendation System
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  priority: UrgencyLevel;
  
  // Recommendation Details
  rationale: string;
  expectedBenefits: string[];
  potentialRisks: string[];
  
  // Implementation
  actionSteps: ActionStep[];
  resourcesNeeded: string[];
  timeline: string;
  
  // Metrics
  confidence: ConfidenceLevel;
  impact: 'low' | 'medium' | 'high' | 'critical';
  feasibility: number; // 0 to 1
  
  // Sources
  basedOn: string[];
  supportingData: Record<string, any>;
  
  // Status
  status: 'new' | 'under_consideration' | 'approved' | 'rejected' | 'implemented';
  feedback?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: 'ai_analysis' | 'advisor' | 'intelligence' | 'simulation';
}

// Action Step
export interface ActionStep {
  id: string;
  description: string;
  responsible: string;
  deadline: Date;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  resources: string[];
}

// Advisor Input
export interface AdvisorInput {
  advisorId: string;
  advisorName: string;
  domain: string;
  
  // Input Content
  summary: string;
  recommendations: string[];
  concerns: string[];
  
  // Analysis
  confidence: ConfidenceLevel;
  urgency: UrgencyLevel;
  
  // Supporting Information
  data: Record<string, any>;
  sources: string[];
  
  // Metadata
  timestamp: Date;
  priority: number;
}

// Status Assessments
export interface CivilizationStatus {
  overall: 'thriving' | 'stable' | 'concerning' | 'critical' | 'crisis';
  
  // Key Metrics
  economicHealth: number; // 0 to 1
  militaryStrength: number; // 0 to 1
  diplomaticStanding: number; // 0 to 1
  socialCohesion: number; // 0 to 1
  technologicalAdvancement: number; // 0 to 1
  
  // Trends
  economicTrend: 'improving' | 'stable' | 'declining';
  militaryTrend: 'strengthening' | 'stable' | 'weakening';
  diplomaticTrend: 'improving' | 'stable' | 'deteriorating';
  socialTrend: 'cohesive' | 'stable' | 'fragmenting';
  techTrend: 'advancing' | 'stable' | 'stagnating';
  
  // Key Indicators
  keyStrengths: string[];
  keyWeaknesses: string[];
  emergingOpportunities: string[];
  immediateThreats: string[];
}

export interface ThreatAssessment {
  overallThreatLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'critical' | 'existential';
  
  threats: ThreatItem[];
  
  // Threat Categories
  military: ThreatCategory;
  economic: ThreatCategory;
  diplomatic: ThreatCategory;
  internal: ThreatCategory;
  technological: ThreatCategory;
  environmental: ThreatCategory;
}

export interface ThreatItem {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0 to 1
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  // Impact Assessment
  potentialImpact: string[];
  affectedSectors: string[];
  
  // Mitigation
  mitigationStrategies: string[];
  preparednessLevel: number; // 0 to 1
  
  // Monitoring
  indicators: string[];
  lastAssessed: Date;
  trendDirection: 'increasing' | 'stable' | 'decreasing';
}

export interface ThreatCategory {
  level: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
  primaryThreats: string[];
  trend: 'improving' | 'stable' | 'worsening';
  preparedness: number; // 0 to 1
}

export interface OpportunityAnalysis {
  overallOpportunityLevel: 'limited' | 'moderate' | 'significant' | 'exceptional';
  
  opportunities: OpportunityItem[];
  
  // Opportunity Categories
  economic: OpportunityCategory;
  diplomatic: OpportunityCategory;
  technological: OpportunityCategory;
  military: OpportunityCategory;
  social: OpportunityCategory;
}

export interface OpportunityItem {
  id: string;
  name: string;
  description: string;
  category: string;
  potential: 'low' | 'medium' | 'high' | 'transformative';
  
  // Opportunity Details
  benefits: string[];
  requirements: string[];
  timeline: string;
  
  // Feasibility
  feasibility: number; // 0 to 1
  resourcesRequired: string[];
  riskFactors: string[];
  
  // Strategic Value
  strategicImportance: number; // 0 to 1
  competitiveAdvantage: boolean;
  
  // Status
  status: 'identified' | 'under_evaluation' | 'approved' | 'in_progress' | 'completed' | 'missed';
  lastReviewed: Date;
}

export interface OpportunityCategory {
  level: 'limited' | 'moderate' | 'significant' | 'exceptional';
  keyOpportunities: string[];
  readiness: number; // 0 to 1
  recommendedActions: string[];
}

// Urgent Matters
export interface UrgentMatter {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  category: DecisionCategory;
  
  // Timeline
  deadline: Date;
  timeRemaining: string;
  
  // Impact
  consequences: string[];
  stakeholders: string[];
  
  // Recommended Actions
  immediateActions: string[];
  longerTermActions: string[];
  
  // Status
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'escalated';
  assignedTo?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  source: string;
}

// Risk and Cost-Benefit Analysis
export interface RiskAssessment {
  overallRisk: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  
  risks: RiskItem[];
  
  // Risk Categories
  implementation: number; // 0 to 1
  financial: number; // 0 to 1
  political: number; // 0 to 1
  operational: number; // 0 to 1
  strategic: number; // 0 to 1
  
  // Mitigation
  mitigationStrategies: string[];
  contingencyPlans: string[];
  
  // Monitoring
  riskIndicators: string[];
  reviewFrequency: string;
}

export interface RiskItem {
  id: string;
  description: string;
  category: string;
  probability: number; // 0 to 1
  impact: number; // 0 to 1
  riskScore: number; // probability * impact
  
  mitigation: string[];
  contingency: string[];
  
  status: 'identified' | 'mitigated' | 'accepted' | 'transferred' | 'avoided';
}

export interface CostBenefitAnalysis {
  netBenefit: number;
  roi: number; // return on investment
  paybackPeriod: number; // months
  
  costs: CostItem[];
  benefits: BenefitItem[];
  
  // Analysis
  breakEvenPoint: number; // months
  sensitivityAnalysis: Record<string, number>;
  assumptions: string[];
  
  // Confidence
  confidence: ConfidenceLevel;
  uncertaintyFactors: string[];
}

export interface CostItem {
  category: string;
  description: string;
  amount: number;
  timeframe: string;
  certainty: number; // 0 to 1
}

export interface BenefitItem {
  category: string;
  description: string;
  value: number;
  timeframe: string;
  certainty: number; // 0 to 1
  quantifiable: boolean;
}

// Expected Outcomes and Requirements
export interface ExpectedOutcome {
  description: string;
  probability: number; // 0 to 1
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  metrics: string[];
}

export interface ResourceRequirement {
  type: 'financial' | 'personnel' | 'technology' | 'infrastructure' | 'political';
  description: string;
  quantity: number;
  unit: string;
  availability: number; // 0 to 1
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

// Simulation Effects
export interface SimulationEffect {
  system: string;
  parameter: string;
  effect: 'increase' | 'decrease' | 'set' | 'multiply';
  value: number;
  duration?: number; // ticks, undefined for permanent
  
  // Effect Details
  description: string;
  magnitude: 'minor' | 'moderate' | 'major' | 'transformative';
  
  // Conditions
  conditions?: string[];
  probability?: number; // 0 to 1 for conditional effects
  
  // Metadata
  source: 'speech' | 'policy' | 'decision' | 'event';
  appliedAt?: Date;
  expiresAt?: Date;
}

// Chart and Visualization Data
export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  categories?: string[];
}

// API Request/Response Types
export interface BriefingRequest {
  campaignId: number;
  tickId: number;
  leaderCharacterId: string;
  type: BriefingType;
  
  // Customization
  includeSections?: string[];
  excludeSections?: string[];
  priority?: UrgencyLevel;
  
  // Context
  recentEvents?: any[];
  specificTopics?: string[];
  timeframe?: string;
  
  // AI Parameters
  detailLevel?: 'summary' | 'standard' | 'detailed' | 'comprehensive';
  includeRecommendations?: boolean;
  includeDecisionSupport?: boolean;
}

export interface SpeechRequest {
  campaignId: number;
  tickId: number;
  leaderCharacterId: string;
  type: SpeechType;
  
  // Speech Parameters
  audience: SpeechAudience;
  occasion: string;
  keyMessages?: string[];
  tone?: string;
  duration?: number;
  
  // Context
  recentEvents?: any[];
  policyFocus?: string[];
  currentChallenges?: string[];
  
  // AI Parameters
  styleGuide?: string;
  inspirationalLevel?: number; // 0 to 1
  formalityLevel?: number; // 0 to 1
}

export interface DecisionSupportRequest {
  campaignId: number;
  tickId: number;
  leaderCharacterId: string;
  
  // Decision Context
  decisionTitle: string;
  decisionDescription: string;
  category: DecisionCategory;
  urgency: UrgencyLevel;
  
  // Analysis Parameters
  includeRiskAssessment?: boolean;
  includeCostBenefit?: boolean;
  includeStakeholderAnalysis?: boolean;
  
  // Context
  constraints?: string[];
  objectives?: string[];
  availableResources?: Record<string, number>;
  
  // AI Parameters
  analysisDepth?: 'basic' | 'standard' | 'comprehensive' | 'exhaustive';
  includeAlternatives?: boolean;
  maxOptions?: number;
}

// API Response Types
export interface LeaderCommunicationResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  
  // Generation Metadata
  generationStats?: {
    totalTime: number;
    aiModel: string;
    confidence: number;
    tokensUsed?: number;
  };
  
  // Quality Metrics
  qualityMetrics?: {
    relevance: number; // 0 to 1
    actionability: number; // 0 to 1
    clarity: number; // 0 to 1
    completeness: number; // 0 to 1
  };
}

// Natural Language Integration
export interface NaturalLanguageEffect {
  id: string;
  source: 'briefing' | 'speech' | 'decision' | 'communication';
  sourceId: string;
  
  // Effect Description
  description: string;
  category: DecisionCategory;
  
  // Simulation Integration
  targetSystems: string[];
  effects: SimulationEffect[];
  
  // Natural Language Context
  narrativeContext: string;
  emotionalTone: string;
  rhetoricalDevices: string[];
  
  // Impact Tracking
  measuredImpact?: Record<string, number>;
  feedbackLoop?: string[];
  
  // Metadata
  appliedAt: Date;
  duration?: number; // ticks
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

// Export all types
export type {
  CommunicationType,
  BriefingType,
  SpeechType,
  DecisionCategory,
  UrgencyLevel,
  ConfidenceLevel,
  LeaderBriefing,
  BriefingSection,
  LeaderSpeech,
  SpeechAudience,
  SpeechImpact,
  PendingDecision,
  DecisionOption,
  Recommendation,
  ActionStep,
  AdvisorInput,
  CivilizationStatus,
  ThreatAssessment,
  ThreatItem,
  ThreatCategory,
  OpportunityAnalysis,
  OpportunityItem,
  OpportunityCategory,
  UrgentMatter,
  RiskAssessment,
  RiskItem,
  CostBenefitAnalysis,
  CostItem,
  BenefitItem,
  ExpectedOutcome,
  ResourceRequirement,
  SimulationEffect,
  ChartData,
  BriefingRequest,
  SpeechRequest,
  DecisionSupportRequest,
  LeaderCommunicationResponse,
  NaturalLanguageEffect
};

// Additional Natural Language Integration Types

export interface NaturalLanguageContext {
  campaignId: number;
  tickId: number;
  timestamp: Date;
  economicSituation: {
    gdpChange: number;
    unemploymentRate: number;
    inflationRate: number;
    tradeBalance: number;
    keyTrends: string[];
    significance: number;
  };
  socialDynamics: {
    populationMood: number;
    approvalRating: number;
    socialUnrest: number;
    culturalShifts: string[];
    keyEvents: string[];
    significance: number;
  };
  politicalClimate: {
    stabilityIndex: number;
    coalitionStrength: number;
    oppositionActivity: number;
    policyEffectiveness: number;
    upcomingEvents: string[];
    significance: number;
  };
  securityStatus: {
    threatLevel: number;
    militaryReadiness: number;
    internalSecurity: number;
    diplomaticTensions: number;
    activeConflicts: string[];
    significance: number;
  };
  recentContext: Array<{
    content: string;
    timestamp: Date;
    relevance: number;
  }>;
  overallSignificance: number;
}

export interface SimulationInfluence {
  id: string;
  source: 'speech' | 'decision' | 'briefing';
  sourceId: string;
  type: string;
  category: string;
  magnitude: number;
  duration: number; // in ticks
  target: string;
  description: string;
  confidence: number;
  timestamp: Date;
  tickId: number;
  campaignId: number;
}

export interface SystemIntegrationEvent {
  id: string;
  campaignId: number;
  tickId: number;
  timestamp: Date;
  briefingsGenerated: number;
  speechesProcessed: number;
  decisionsCreated: number;
  influencesApplied: number;
  context: NaturalLanguageContext | null;
  success: boolean;
  error?: string;
}
