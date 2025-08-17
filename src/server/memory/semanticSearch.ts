import { embeddingService } from './embeddingService.js';
import { qdrantClient, SearchOptions, SearchResult } from './qdrantClient.js';
import { conversationStorage, MessageQuery } from './conversationStorage.js';

export interface SemanticSearchQuery {
  // Core search
  query: string;
  
  // Filtering options
  campaignId?: number;
  conversationIds?: string[];
  
  // Time-based filtering
  timeframe?: {
    start: Date;
    end: Date;
  };
  
  // Content filtering
  entities?: {
    include?: string[];  // Must contain at least one of these
    exclude?: string[];  // Must not contain any of these
    require?: string[];  // Must contain all of these
  };
  
  actionTypes?: {
    include?: string[];
    exclude?: string[];
  };
  
  roles?: ('user' | 'assistant' | 'system')[];
  
  // Search behavior
  limit?: number;
  offset?: number;
  minScore?: number;
  maxScore?: number;
  
  // Advanced options
  boost?: {
    entities?: Record<string, number>;  // Boost specific entities
    actionTypes?: Record<string, number>;  // Boost specific action types
    recency?: number;  // Boost recent messages (0-1)
    roles?: Record<string, number>;  // Boost specific roles
  };
  
  // Query expansion
  expandQuery?: boolean;
  synonyms?: Record<string, string[]>;
  
  // Result grouping
  groupBy?: 'conversation' | 'entity' | 'actionType';
  groupLimit?: number;
}

export interface SearchResultWithMetadata extends SearchResult {
  conversationTitle?: string;
  messageIndex?: number;
  relatedMessages?: SearchResult[];
  relevanceFactors?: {
    semanticScore: number;
    entityBoost: number;
    actionTypeBoost: number;
    recencyBoost: number;
    roleBoost: number;
    finalScore: number;
  };
}

export interface SearchResponse {
  query: SemanticSearchQuery;
  results: SearchResultWithMetadata[];
  totalCount: number;
  searchTime: number;
  aggregations?: {
    byEntity?: Record<string, number>;
    byActionType?: Record<string, number>;
    byRole?: Record<string, number>;
    byTimeframe?: Record<string, number>;
  };
  suggestions?: string[];
}

/**
 * Advanced Semantic Search Service
 * Provides sophisticated search capabilities with complex filtering and scoring
 */
export class SemanticSearchService {
  
  /**
   * Execute advanced semantic search
   */
  async search(searchQuery: SemanticSearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    
    try {
      // Step 1: Expand query if requested
      const expandedQueries = await this.expandQuery(searchQuery);
      
      // Step 2: Generate embeddings for all query variants
      const queryEmbeddings = await Promise.all(
        expandedQueries.map(q => embeddingService.embedSingle(q))
      );
      
      // Step 3: Execute vector searches
      const vectorSearches = await Promise.all(
        queryEmbeddings.map(embedding => 
          this.executeVectorSearch(embedding, searchQuery)
        )
      );
      
      // Step 4: Merge and deduplicate results
      const mergedResults = this.mergeSearchResults(vectorSearches);
      
      // Step 5: Apply additional filtering
      const filteredResults = await this.applyAdditionalFiltering(mergedResults, searchQuery);
      
      // Step 6: Calculate advanced scoring
      const scoredResults = await this.calculateAdvancedScoring(filteredResults, searchQuery);
      
      // Step 7: Apply grouping if requested
      const groupedResults = await this.applyGrouping(scoredResults, searchQuery);
      
      // Step 8: Paginate results
      const paginatedResults = this.paginateResults(groupedResults, searchQuery);
      
      // Step 9: Enrich results with metadata
      const enrichedResults = await this.enrichResultsWithMetadata(paginatedResults);
      
      // Step 10: Generate aggregations
      const aggregations = this.generateAggregations(scoredResults);
      
      // Step 11: Generate search suggestions
      const suggestions = await this.generateSuggestions(searchQuery, scoredResults);
      
      const searchTime = Date.now() - startTime;
      
      return {
        query: searchQuery,
        results: enrichedResults,
        totalCount: scoredResults.length,
        searchTime,
        aggregations,
        suggestions
      };
      
    } catch (error) {
      console.error('❌ Advanced semantic search failed:', error);
      throw error;
    }
  }
  
  /**
   * Expand query with synonyms and related terms
   */
  private async expandQuery(searchQuery: SemanticSearchQuery): Promise<string[]> {
    const queries = [searchQuery.query];
    
    if (!searchQuery.expandQuery) {
      return queries;
    }
    
    // Apply custom synonyms
    if (searchQuery.synonyms) {
      const expandedQuery = this.applySynonyms(searchQuery.query, searchQuery.synonyms);
      if (expandedQuery !== searchQuery.query) {
        queries.push(expandedQuery);
      }
    }
    
    // Generate semantic variations (simple word substitutions)
    const semanticVariations = this.generateSemanticVariations(searchQuery.query);
    queries.push(...semanticVariations);
    
    return queries.slice(0, 3); // Limit to 3 variants to avoid over-expansion
  }
  
  /**
   * Apply synonym substitutions
   */
  private applySynonyms(query: string, synonyms: Record<string, string[]>): string {
    let expandedQuery = query;
    
    for (const [term, alternatives] of Object.entries(synonyms)) {
      const termRegex = new RegExp(`\\b${term}\\b`, 'gi');
      if (termRegex.test(expandedQuery)) {
        // Replace with first alternative
        expandedQuery = expandedQuery.replace(termRegex, alternatives[0]);
      }
    }
    
    return expandedQuery;
  }
  
  /**
   * Generate semantic variations of the query
   */
  private generateSemanticVariations(query: string): string[] {
    const variations = [];
    
    // Common gaming/space domain substitutions
    const domainSynonyms: Record<string, string[]> = {
      'trade': ['commerce', 'trading', 'business', 'exchange'],
      'mining': ['extraction', 'harvesting', 'collection'],
      'strategy': ['plan', 'approach', 'tactics'],
      'alliance': ['partnership', 'coalition', 'cooperation'],
      'profit': ['revenue', 'income', 'earnings', 'gains'],
      'system': ['sector', 'region', 'area'],
      'ship': ['vessel', 'craft', 'fleet'],
      'resource': ['material', 'commodity', 'goods']
    };
    
    const words = query.toLowerCase().split(/\s+/);
    
    for (const [original, alternatives] of Object.entries(domainSynonyms)) {
      if (words.includes(original)) {
        const variation = query.replace(
          new RegExp(`\\b${original}\\b`, 'gi'),
          alternatives[0]
        );
        if (variation !== query) {
          variations.push(variation);
        }
      }
    }
    
    return variations.slice(0, 2); // Limit variations
  }
  
  /**
   * Execute vector search with Qdrant
   */
  private async executeVectorSearch(
    embedding: number[], 
    searchQuery: SemanticSearchQuery
  ): Promise<SearchResult[]> {
    
    const searchOptions: SearchOptions = {
      campaignId: searchQuery.campaignId,
      limit: Math.min(searchQuery.limit || 50, 100), // Fetch more initially for filtering
      minScore: searchQuery.minScore || 0.3
    };
    
    // Add entity filtering if specified
    if (searchQuery.entities?.include || searchQuery.entities?.require) {
      const entityFilter = [
        ...(searchQuery.entities.include || []),
        ...(searchQuery.entities.require || [])
      ];
      searchOptions.entities = entityFilter;
    }
    
    // Add timeframe filtering
    if (searchQuery.timeframe) {
      searchOptions.timeframe = {
        start: searchQuery.timeframe.start.toISOString(),
        end: searchQuery.timeframe.end.toISOString()
      };
    }
    
    return await qdrantClient.searchSimilar(embedding, searchOptions);
  }
  
  /**
   * Merge and deduplicate results from multiple searches
   */
  private mergeSearchResults(searchResults: SearchResult[][]): SearchResult[] {
    const merged = new Map<string, SearchResult>();
    
    for (const results of searchResults) {
      for (const result of results) {
        const existing = merged.get(result.id);
        if (!existing || result.score > existing.score) {
          merged.set(result.id, result);
        }
      }
    }
    
    return Array.from(merged.values());
  }
  
  /**
   * Apply additional filtering that couldn't be done at vector level
   */
  private async applyAdditionalFiltering(
    results: SearchResult[], 
    searchQuery: SemanticSearchQuery
  ): Promise<SearchResult[]> {
    
    return results.filter(result => {
      // Role filtering
      if (searchQuery.roles && !searchQuery.roles.includes(result.payload.role)) {
        return false;
      }
      
      // Entity exclusion
      if (searchQuery.entities?.exclude) {
        const resultEntities = result.payload.entities || [];
        if (searchQuery.entities.exclude.some(e => resultEntities.includes(e))) {
          return false;
        }
      }
      
      // Entity requirement (must have ALL required entities)
      if (searchQuery.entities?.require) {
        const resultEntities = result.payload.entities || [];
        if (!searchQuery.entities.require.every(e => resultEntities.includes(e))) {
          return false;
        }
      }
      
      // Action type filtering
      if (searchQuery.actionTypes?.include) {
        if (!searchQuery.actionTypes.include.includes(result.payload.actionType || '')) {
          return false;
        }
      }
      
      if (searchQuery.actionTypes?.exclude) {
        if (searchQuery.actionTypes.exclude.includes(result.payload.actionType || '')) {
          return false;
        }
      }
      
      // Score range filtering
      if (searchQuery.maxScore && result.score > searchQuery.maxScore) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Calculate advanced scoring with boosts
   */
  private async calculateAdvancedScoring(
    results: SearchResult[], 
    searchQuery: SemanticSearchQuery
  ): Promise<SearchResultWithMetadata[]> {
    
    const now = Date.now();
    const boost = searchQuery.boost || {};
    
    return results.map(result => {
      const semanticScore = result.score;
      
      // Entity boost
      let entityBoost = 1.0;
      if (boost.entities && result.payload.entities) {
        for (const entity of result.payload.entities) {
          if (boost.entities[entity]) {
            entityBoost *= boost.entities[entity];
          }
        }
      }
      
      // Action type boost
      let actionTypeBoost = 1.0;
      if (boost.actionTypes && result.payload.actionType) {
        actionTypeBoost = boost.actionTypes[result.payload.actionType] || 1.0;
      }
      
      // Recency boost
      let recencyBoost = 1.0;
      if (boost.recency && result.payload.timestamp) {
        const messageTime = new Date(result.payload.timestamp).getTime();
        const ageInHours = (now - messageTime) / (1000 * 60 * 60);
        const maxAgeHours = 24 * 7; // 1 week
        const recencyFactor = Math.max(0, 1 - (ageInHours / maxAgeHours));
        recencyBoost = 1 + (boost.recency * recencyFactor);
      }
      
      // Role boost
      let roleBoost = 1.0;
      if (boost.roles && result.payload.role) {
        roleBoost = boost.roles[result.payload.role] || 1.0;
      }
      
      const finalScore = semanticScore * entityBoost * actionTypeBoost * recencyBoost * roleBoost;
      
      return {
        ...result,
        score: finalScore,
        relevanceFactors: {
          semanticScore,
          entityBoost,
          actionTypeBoost,
          recencyBoost,
          roleBoost,
          finalScore
        }
      } as SearchResultWithMetadata;
    }).sort((a, b) => b.score - a.score);
  }
  
  /**
   * Apply result grouping
   */
  private async applyGrouping(
    results: SearchResultWithMetadata[], 
    searchQuery: SemanticSearchQuery
  ): Promise<SearchResultWithMetadata[]> {
    
    if (!searchQuery.groupBy) {
      return results;
    }
    
    const grouped = new Map<string, SearchResultWithMetadata[]>();
    
    for (const result of results) {
      let groupKey: string;
      
      switch (searchQuery.groupBy) {
        case 'conversation':
          // Need to fetch conversation ID from message
          groupKey = 'conversation-' + result.payload.campaignId; // Simplified for now
          break;
        case 'entity':
          groupKey = result.payload.entities?.[0] || 'no-entity';
          break;
        case 'actionType':
          groupKey = result.payload.actionType || 'no-action';
          break;
        default:
          groupKey = 'default';
      }
      
      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, []);
      }
      
      const group = grouped.get(groupKey)!;
      if (group.length < (searchQuery.groupLimit || 3)) {
        group.push(result);
      }
    }
    
    // Flatten grouped results, maintaining order by score
    const flatResults: SearchResultWithMetadata[] = [];
    for (const group of grouped.values()) {
      flatResults.push(...group);
    }
    
    return flatResults.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Paginate results
   */
  private paginateResults(
    results: SearchResultWithMetadata[], 
    searchQuery: SemanticSearchQuery
  ): SearchResultWithMetadata[] {
    
    const offset = searchQuery.offset || 0;
    const limit = searchQuery.limit || 10;
    
    return results.slice(offset, offset + limit);
  }
  
  /**
   * Enrich results with conversation metadata
   */
  private async enrichResultsWithMetadata(
    results: SearchResultWithMetadata[]
  ): Promise<SearchResultWithMetadata[]> {
    
    // For now, return as-is. In a full implementation, we would:
    // 1. Fetch conversation titles from storage
    // 2. Get message indices within conversations  
    // 3. Find related messages in the same conversation
    
    return results;
  }
  
  /**
   * Generate aggregations for faceted search
   */
  private generateAggregations(results: SearchResultWithMetadata[]) {
    const aggregations = {
      byEntity: {} as Record<string, number>,
      byActionType: {} as Record<string, number>,
      byRole: {} as Record<string, number>,
      byTimeframe: {} as Record<string, number>
    };
    
    for (const result of results) {
      // Entity aggregations
      if (result.payload.entities) {
        for (const entity of result.payload.entities) {
          aggregations.byEntity[entity] = (aggregations.byEntity[entity] || 0) + 1;
        }
      }
      
      // Action type aggregations
      if (result.payload.actionType) {
        const actionType = result.payload.actionType;
        aggregations.byActionType[actionType] = (aggregations.byActionType[actionType] || 0) + 1;
      }
      
      // Role aggregations
      const role = result.payload.role;
      aggregations.byRole[role] = (aggregations.byRole[role] || 0) + 1;
      
      // Timeframe aggregations (by day)
      if (result.payload.timestamp) {
        const date = new Date(result.payload.timestamp).toISOString().split('T')[0];
        aggregations.byTimeframe[date] = (aggregations.byTimeframe[date] || 0) + 1;
      }
    }
    
    return aggregations;
  }
  
  /**
   * Generate search suggestions based on query and results
   */
  private async generateSuggestions(
    searchQuery: SemanticSearchQuery, 
    results: SearchResultWithMetadata[]
  ): Promise<string[]> {
    
    const suggestions: string[] = [];
    
    // Extract common entities from results for suggestions
    const entityCounts = new Map<string, number>();
    for (const result of results.slice(0, 10)) { // Top 10 results
      if (result.payload.entities) {
        for (const entity of result.payload.entities) {
          entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
        }
      }
    }
    
    // Generate entity-based suggestions
    const topEntities = Array.from(entityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([entity]) => entity);
    
    for (const entity of topEntities) {
      if (!searchQuery.query.toLowerCase().includes(entity.toLowerCase())) {
        suggestions.push(`${searchQuery.query} ${entity}`);
      }
    }
    
    // Generate action type suggestions
    if (results.length > 0 && !searchQuery.actionTypes) {
      const commonActions = Array.from(
        results.reduce((acc, result) => {
          if (result.payload.actionType) {
            acc.set(result.payload.actionType, (acc.get(result.payload.actionType) || 0) + 1);
          }
          return acc;
        }, new Map<string, number>()).entries()
      ).sort((a, b) => b[1] - a[1]).slice(0, 2);
      
      for (const [action] of commonActions) {
        suggestions.push(`${searchQuery.query} (${action.replace('_', ' ')})`);
      }
    }
    
    return suggestions.slice(0, 5);
  }
  
  /**
   * Quick search with minimal configuration
   */
  async quickSearch(
    query: string, 
    campaignId?: number, 
    limit = 10
  ): Promise<SearchResultWithMetadata[]> {
    
    const searchQuery: SemanticSearchQuery = {
      query,
      campaignId,
      limit,
      minScore: 0.5
    };
    
    const response = await this.search(searchQuery);
    return response.results;
  }
  
  /**
   * Search within a specific conversation
   */
  async searchConversation(
    query: string, 
    conversationIds: string[], 
    limit = 20
  ): Promise<SearchResultWithMetadata[]> {
    
    const searchQuery: SemanticSearchQuery = {
      query,
      conversationIds,
      limit,
      minScore: 0.3
    };
    
    const response = await this.search(searchQuery);
    return response.results;
  }
}

// Export singleton instance
export const semanticSearchService = new SemanticSearchService();
