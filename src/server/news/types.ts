/**
 * Dynamic News Generation System Types
 * 
 * Defines comprehensive types for AI-powered news generation based on simulation results,
 * with multi-perspective outlets and civilization/galactic coverage.
 */

// News Categories and Types
export type NewsCategory = 
  | 'politics' | 'economy' | 'military' | 'diplomacy' | 'technology' 
  | 'social' | 'culture' | 'environment' | 'space' | 'trade'
  | 'crime' | 'disaster' | 'discovery' | 'entertainment' | 'sports';

export type NewsScope = 'local' | 'national' | 'civilization' | 'galactic' | 'universal';

export type NewsPriority = 'breaking' | 'urgent' | 'high' | 'medium' | 'low';

export type NewsOutletType = 
  | 'government' | 'independent' | 'corporate' | 'opposition' 
  | 'foreign' | 'underground' | 'academic' | 'entertainment';

// News Outlet Perspectives and Bias
export interface NewsOutlet {
  id: string;
  name: string;
  type: NewsOutletType;
  civilizationId: string;
  perspective: {
    politicalLean: 'far-left' | 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'far-right';
    governmentStance: 'supportive' | 'neutral' | 'critical' | 'opposition';
    economicView: 'socialist' | 'mixed' | 'capitalist' | 'corporate';
    reliability: number; // 0-1 score for factual accuracy
    sensationalism: number; // 0-1 score for dramatic reporting
  };
  targetAudience: string[];
  specializations: NewsCategory[];
  credibility: number; // 0-1 overall credibility score
  reach: number; // Population percentage that reads this outlet
  metadata: {
    founded: Date;
    headquarters: string;
    ownershipType: 'public' | 'private' | 'government' | 'cooperative';
    language: string;
    format: 'text' | 'video' | 'audio' | 'mixed';
  };
}

// News Article Structure
export interface NewsArticle {
  id: string;
  headline: string;
  subheadline?: string;
  content: string;
  summary: string;
  
  // Classification
  category: NewsCategory;
  scope: NewsScope;
  priority: NewsPriority;
  
  // Source and Perspective
  outletId: string;
  outletName: string;
  outletPerspective: NewsOutlet['perspective'];
  
  // Context and Sources
  sourceEvents: string[]; // IDs of simulation events that triggered this news
  relatedEntities: string[]; // Character IDs, civilization IDs, etc.
  factualAccuracy: number; // 0-1 score based on outlet reliability
  
  // Engagement and Impact
  estimatedReach: number;
  publicReaction: {
    sentiment: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
    engagement: number; // 0-1 score for how much attention it gets
    controversyLevel: number; // 0-1 score for how divisive it is
  };
  
  // Metadata
  publishedAt: Date;
  tickId: number;
  campaignId: number;
  tags: string[];
  
  // AI Generation Context
  generationContext: {
    aiModel: string;
    prompt: string;
    temperature: number;
    confidence: number;
    generationTime: number;
  };
}

// News Generation Request
export interface NewsGenerationRequest {
  campaignId: number;
  tickId: number;
  scope: NewsScope[];
  categories: NewsCategory[];
  maxArticles: number;
  
  // Context Sources
  simulationResults?: any;
  recentEvents?: any[];
  civilizationMemory?: any[];
  aiAnalysisMemory?: any[];
  
  // Generation Parameters
  includeBreaking: boolean;
  perspectiveDiversity: boolean; // Generate from multiple outlet perspectives
  factualVariation: boolean; // Allow different outlets to report differently
  
  // Filtering
  minPriority?: NewsPriority;
  targetOutlets?: string[]; // Specific outlet IDs to generate for
  excludeCategories?: NewsCategory[];
}

// News Generation Response
export interface NewsGenerationResponse {
  success: boolean;
  articlesGenerated: number;
  articles: NewsArticle[];
  
  // Generation Statistics
  generationStats: {
    totalTime: number;
    averageConfidence: number;
    perspectivesCovered: number;
    categoriesCovered: NewsCategory[];
    scopesCovered: NewsScope[];
  };
  
  // Quality Metrics
  qualityMetrics: {
    factualConsistency: number; // How consistent facts are across outlets
    perspectiveDiversity: number; // How different the perspectives are
    relevanceScore: number; // How relevant to current simulation state
    engagementPotential: number; // Predicted public interest
  };
  
  errors: string[];
  warnings: string[];
}

// News Feed and Distribution
export interface NewsFeed {
  id: string;
  name: string;
  description: string;
  
  // Feed Configuration
  sources: string[]; // Outlet IDs included in this feed
  categories: NewsCategory[];
  scopes: NewsScope[];
  maxArticlesPerTick: number;
  
  // Filtering and Ranking
  priorityWeights: Record<NewsPriority, number>;
  categoryWeights: Record<NewsCategory, number>;
  credibilityThreshold: number;
  
  // Target Audience
  targetDemographics: string[];
  civilizationId: string;
  accessLevel: 'public' | 'restricted' | 'classified';
  
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    subscriberCount: number;
    averageEngagement: number;
  };
}

// News Analytics and Metrics
export interface NewsAnalytics {
  tickId: number;
  campaignId: number;
  
  // Article Metrics
  totalArticles: number;
  articlesByCategory: Record<NewsCategory, number>;
  articlesByScope: Record<NewsScope, number>;
  articlesByPriority: Record<NewsPriority, number>;
  
  // Outlet Performance
  outletMetrics: {
    [outletId: string]: {
      articlesPublished: number;
      averageReach: number;
      averageEngagement: number;
      credibilityScore: number;
    };
  };
  
  // Public Impact
  overallSentiment: number; // -1 to 1
  controversyLevel: number; // 0-1
  informationSpread: number; // How widely information circulated
  
  // Quality Assessment
  factualAccuracy: number; // Overall accuracy across all articles
  perspectiveDiversity: number; // How diverse the coverage was
  relevanceScore: number; // How relevant news was to actual events
  
  // Trends
  trendingTopics: string[];
  emergingNarratives: string[];
  publicOpinionShifts: {
    topic: string;
    previousSentiment: number;
    currentSentiment: number;
    change: number;
  }[];
}

// News Event Triggers
export interface NewsEventTrigger {
  id: string;
  name: string;
  description: string;
  
  // Trigger Conditions
  eventTypes: string[]; // Types of simulation events that trigger this
  thresholds: Record<string, number>; // Minimum values to trigger news
  categories: NewsCategory[]; // What news categories this generates
  
  // Generation Parameters
  priority: NewsPriority;
  scope: NewsScope;
  urgency: number; // 0-1 how quickly news should be generated
  
  // Outlet Targeting
  preferredOutlets: NewsOutletType[];
  excludedOutlets: string[];
  
  // Content Guidelines
  contentTemplate?: string;
  requiredElements: string[];
  optionalElements: string[];
  
  metadata: {
    createdAt: Date;
    lastTriggered?: Date;
    triggerCount: number;
    averageImpact: number;
  };
}

// Database Models
export interface NewsOutletModel extends NewsOutlet {
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsArticleModel extends NewsArticle {
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsFeedModel extends NewsFeed {
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface NewsAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedNewsResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters?: {
    category?: NewsCategory;
    scope?: NewsScope;
    priority?: NewsPriority;
    outletId?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

// News Search and Filtering
export interface NewsSearchQuery {
  query?: string;
  categories?: NewsCategory[];
  scopes?: NewsScope[];
  priorities?: NewsPriority[];
  outletIds?: string[];
  
  // Date Range
  startDate?: Date;
  endDate?: Date;
  tickRange?: {
    start: number;
    end: number;
  };
  
  // Quality Filters
  minCredibility?: number;
  minReach?: number;
  maxSensationalism?: number;
  
  // Sorting
  sortBy?: 'date' | 'priority' | 'reach' | 'engagement' | 'credibility';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

// Export all types
export type {
  NewsCategory,
  NewsScope,
  NewsPriority,
  NewsOutletType,
  NewsOutlet,
  NewsArticle,
  NewsGenerationRequest,
  NewsGenerationResponse,
  NewsFeed,
  NewsAnalytics,
  NewsEventTrigger,
  NewsOutletModel,
  NewsArticleModel,
  NewsFeedModel,
  NewsAPIResponse,
  PaginatedNewsResponse,
  NewsSearchQuery
};
