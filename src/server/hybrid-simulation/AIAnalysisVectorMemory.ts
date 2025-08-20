/**
 * AI Analysis Vector Memory Service
 * Maintains continuous AI analysis context and insights across simulation ticks
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { Pool } from 'pg';
import { getPool } from '../storage/db.js';
import { embeddingService } from '../memory/embeddingService.js';
import {
  AIAnalysisMemoryEntry,
  MemorySearchQuery,
  MemorySearchResult
} from './types.js';

export class AIAnalysisVectorMemory {
  private client: QdrantClient;
  private pool: Pool;
  private vectorSize: number = 1536; // Default for OpenAI text-embedding-3-small

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333'
    });
    this.pool = getPool();
  }

  // ===== AI ANALYSIS MEMORY MANAGEMENT =====

  /**
   * Store AI analysis with continuity and insight tracking
   */
  async storeAIAnalysis(
    campaignId: number,
    entry: AIAnalysisMemoryEntry
  ): Promise<string> {
    try {
      const collectionName = await this.ensureAIAnalysisCollection(campaignId);
      
      // Create rich content for embedding that includes analytical context
      const embeddingContent = this.createAIAnalysisEmbeddingContent(entry);
      const embedding = await embeddingService.embedSingle(embeddingContent);
      
      const pointId = `ai_analysis_${campaignId}_${entry.metadata.tickId}_${Date.now()}`;
      
      await this.client.upsert(collectionName, {
        wait: true,
        points: [{
          id: pointId,
          vector: embedding,
          payload: {
            campaignId,
            tickId: entry.metadata.tickId,
            timestamp: entry.metadata.timestamp.toISOString(),
            content: entry.content,
            analysisType: entry.analysisType,
            analysisMetrics: entry.analysisMetrics,
            continuityFactors: entry.continuityFactors,
            metadata: entry.metadata,
            embeddingContent
          }
        }]
      });

      // Update database metadata
      await this.updateAIAnalysisMetadata(campaignId, collectionName);

      return pointId;

    } catch (error) {
      console.error('AI analysis memory storage failed:', error);
      throw error;
    }
  }

  /**
   * Get previous AI analyses for building upon insights
   */
  async getPreviousAIAnalyses(
    campaignId: number,
    currentTickId: number,
    analysisType?: string,
    limit: number = 10
  ): Promise<AIAnalysisMemoryEntry[]> {
    try {
      const collectionName = this.getAIAnalysisCollectionName(campaignId);
      
      const filter: any = {
        must: [
          { key: 'campaignId', match: { value: campaignId } },
          { key: 'tickId', range: { lt: currentTickId } }
        ]
      };

      if (analysisType) {
        filter.must.push({ key: 'analysisType', match: { value: analysisType } });
      }

      const searchResult = await this.client.scroll(collectionName, {
        filter,
        limit,
        with_payload: true,
        order_by: { key: 'tickId', direction: 'desc' }
      });

      return searchResult.points.map(point => ({
        content: point.payload?.content as string,
        analysisType: point.payload?.analysisType as any,
        analysisMetrics: point.payload?.analysisMetrics as any,
        continuityFactors: point.payload?.continuityFactors as any,
        metadata: point.payload?.metadata as any
      }));

    } catch (error) {
      console.error('Previous AI analyses retrieval failed:', error);
      return [];
    }
  }

  /**
   * Search AI analysis memory by semantic similarity
   */
  async searchAIAnalysisMemory(
    campaignId: number,
    query: string,
    options: {
      analysisType?: string;
      insightCategory?: string;
      minConfidence?: number;
      timeRange?: { start: Date; end: Date };
      limit?: number;
      minScore?: number;
    } = {}
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getAIAnalysisCollectionName(campaignId);
      const queryEmbedding = await embeddingService.embedSingle(query);

      const filter: any = {
        must: [{ key: 'campaignId', match: { value: campaignId } }]
      };

      if (options.analysisType) {
        filter.must.push({ key: 'analysisType', match: { value: options.analysisType } });
      }

      if (options.insightCategory) {
        filter.must.push({ key: 'analysisMetrics.insightCategory', match: { value: options.insightCategory } });
      }

      if (options.minConfidence) {
        filter.must.push({ key: 'analysisMetrics.confidenceScore', range: { gte: options.minConfidence } });
      }

      if (options.timeRange) {
        filter.must.push({
          key: 'timestamp',
          range: {
            gte: options.timeRange.start.toISOString(),
            lte: options.timeRange.end.toISOString()
          }
        });
      }

      const searchResult = await this.client.search(collectionName, {
        vector: queryEmbedding,
        filter,
        limit: options.limit || 15,
        score_threshold: options.minScore || 0.7,
        with_payload: true
      });

      return searchResult.map(result => ({
        id: result.id as string,
        content: result.payload?.content as string,
        score: result.score || 0,
        metadata: {
          tickId: result.payload?.tickId as number,
          timestamp: new Date(result.payload?.timestamp as string),
          analysisType: result.payload?.analysisType as string,
          analysisMetrics: result.payload?.analysisMetrics as any,
          continuityFactors: result.payload?.continuityFactors as any
        }
      }));

    } catch (error) {
      console.error('AI analysis memory search failed:', error);
      return [];
    }
  }

  /**
   * Find related insights that build upon each other
   */
  async findRelatedInsights(
    campaignId: number,
    baseInsightId: string,
    maxDepth: number = 3
  ): Promise<{
    insightChain: AIAnalysisMemoryEntry[];
    relationshipMap: Record<string, string[]>;
    evolutionPath: Array<{ tickId: number; insight: string; confidence: number }>;
  }> {
    try {
      const collectionName = this.getAIAnalysisCollectionName(campaignId);
      
      // Get the base insight
      const baseResult = await this.client.retrieve(collectionName, {
        ids: [baseInsightId],
        with_payload: true
      });

      if (baseResult.length === 0) {
        return { insightChain: [], relationshipMap: {}, evolutionPath: [] };
      }

      const baseInsight = this.mapPointToEntry(baseResult[0]);
      const insightChain: AIAnalysisMemoryEntry[] = [baseInsight];
      const relationshipMap: Record<string, string[]> = {};
      const evolutionPath: Array<{ tickId: number; insight: string; confidence: number }> = [];

      // Find insights that reference this one
      const referencingFilter = {
        must: [
          { key: 'campaignId', match: { value: campaignId } },
          { key: 'continuityFactors.referencedInsights', match: { any: [baseInsightId] } }
        ]
      };

      const referencingResults = await this.client.scroll(collectionName, {
        filter: referencingFilter,
        limit: 20,
        with_payload: true,
        order_by: { key: 'tickId', direction: 'asc' }
      });

      // Build insight chain
      for (const point of referencingResults.points) {
        const insight = this.mapPointToEntry(point);
        insightChain.push(insight);
        
        relationshipMap[baseInsightId] = relationshipMap[baseInsightId] || [];
        relationshipMap[baseInsightId].push(point.id as string);

        evolutionPath.push({
          tickId: insight.metadata.tickId,
          insight: insight.content,
          confidence: insight.analysisMetrics.confidenceScore
        });
      }

      return { insightChain, relationshipMap, evolutionPath };

    } catch (error) {
      console.error('Related insights search failed:', error);
      return { insightChain: [], relationshipMap: {}, evolutionPath: [] };
    }
  }

  /**
   * Analyze prediction accuracy over time
   */
  async analyzePredictionAccuracy(
    campaignId: number,
    timeRange: { start: number; end: number }
  ): Promise<{
    overallAccuracy: number;
    accuracyByType: Record<string, number>;
    improvedPredictions: Array<{ tickId: number; prediction: string; actualOutcome: string }>;
    accuracyTrend: 'improving' | 'stable' | 'declining';
  }> {
    try {
      const analyses = await this.getPreviousAIAnalyses(
        campaignId,
        timeRange.end + 1,
        'predictive_analysis',
        50
      );

      const predictionsWithAccuracy = analyses.filter(a => 
        a.analysisMetrics.predictionAccuracy !== undefined
      );

      if (predictionsWithAccuracy.length === 0) {
        return {
          overallAccuracy: 0,
          accuracyByType: {},
          improvedPredictions: [],
          accuracyTrend: 'stable'
        };
      }

      // Calculate overall accuracy
      const totalAccuracy = predictionsWithAccuracy.reduce(
        (sum, a) => sum + (a.analysisMetrics.predictionAccuracy || 0), 0
      );
      const overallAccuracy = totalAccuracy / predictionsWithAccuracy.length;

      // Accuracy by insight category
      const accuracyByType: Record<string, number> = {};
      const typeGroups = predictionsWithAccuracy.reduce((groups, a) => {
        const category = a.analysisMetrics.insightCategory;
        groups[category] = groups[category] || [];
        groups[category].push(a.analysisMetrics.predictionAccuracy || 0);
        return groups;
      }, {} as Record<string, number[]>);

      Object.entries(typeGroups).forEach(([type, accuracies]) => {
        accuracyByType[type] = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
      });

      // Find improved predictions
      const improvedPredictions = predictionsWithAccuracy
        .filter(a => (a.analysisMetrics.predictionAccuracy || 0) > 0.8)
        .map(a => ({
          tickId: a.metadata.tickId,
          prediction: a.content,
          actualOutcome: 'Prediction validated by subsequent events'
        }));

      // Analyze accuracy trend
      const recentAccuracies = predictionsWithAccuracy.slice(0, 10).map(a => a.analysisMetrics.predictionAccuracy || 0);
      const olderAccuracies = predictionsWithAccuracy.slice(-10).map(a => a.analysisMetrics.predictionAccuracy || 0);
      
      const recentAvg = recentAccuracies.reduce((sum, acc) => sum + acc, 0) / recentAccuracies.length;
      const olderAvg = olderAccuracies.reduce((sum, acc) => sum + acc, 0) / olderAccuracies.length;
      
      const accuracyTrend = recentAvg > olderAvg + 0.1 ? 'improving' : 
                           recentAvg < olderAvg - 0.1 ? 'declining' : 'stable';

      return {
        overallAccuracy,
        accuracyByType,
        improvedPredictions,
        accuracyTrend
      };

    } catch (error) {
      console.error('Prediction accuracy analysis failed:', error);
      return {
        overallAccuracy: 0,
        accuracyByType: {},
        improvedPredictions: [],
        accuracyTrend: 'stable'
      };
    }
  }

  /**
   * Generate cross-domain correlations
   */
  async generateCrossDomainCorrelations(
    campaignId: number,
    domains: string[],
    timeRange: { start: number; end: number }
  ): Promise<{
    correlations: Array<{
      domain1: string;
      domain2: string;
      correlationStrength: number;
      insights: string[];
      supportingEvidence: string[];
    }>;
    emergentPatterns: string[];
    recommendedAnalyses: string[];
  }> {
    try {
      const correlations: Array<{
        domain1: string;
        domain2: string;
        correlationStrength: number;
        insights: string[];
        supportingEvidence: string[];
      }> = [];

      // Find analyses that mention cross-domain correlations
      for (let i = 0; i < domains.length; i++) {
        for (let j = i + 1; j < domains.length; j++) {
          const domain1 = domains[i];
          const domain2 = domains[j];

          const correlationQuery = `correlation between ${domain1} and ${domain2}`;
          const correlationResults = await this.searchAIAnalysisMemory(
            campaignId,
            correlationQuery,
            { analysisType: 'cross_domain_correlation', limit: 10 }
          );

          if (correlationResults.length > 0) {
            const avgCorrelation = correlationResults.reduce((sum, result) => {
              const strength = result.metadata.analysisMetrics?.correlationStrength || 0;
              return sum + strength;
            }, 0) / correlationResults.length;

            correlations.push({
              domain1,
              domain2,
              correlationStrength: avgCorrelation,
              insights: correlationResults.map(r => r.content),
              supportingEvidence: correlationResults.map(r => 
                `Tick ${r.metadata.tickId}: ${r.metadata.analysisMetrics?.insightCategory || 'General'}`
              )
            });
          }
        }
      }

      // Identify emergent patterns
      const patternResults = await this.searchAIAnalysisMemory(
        campaignId,
        'emergent pattern systemic behavior',
        { analysisType: 'pattern_recognition', limit: 15 }
      );

      const emergentPatterns = patternResults.map(r => r.content);

      // Generate recommended analyses
      const recommendedAnalyses = this.generateAnalysisRecommendations(correlations, emergentPatterns);

      return {
        correlations,
        emergentPatterns,
        recommendedAnalyses
      };

    } catch (error) {
      console.error('Cross-domain correlation analysis failed:', error);
      return {
        correlations: [],
        emergentPatterns: [],
        recommendedAnalyses: []
      };
    }
  }

  // ===== PRIVATE METHODS =====

  private async ensureAIAnalysisCollection(campaignId: number): Promise<string> {
    const collectionName = this.getAIAnalysisCollectionName(campaignId);
    
    try {
      await this.client.getCollection(collectionName);
    } catch (error) {
      // Collection doesn't exist, create it
      await this.client.createCollection(collectionName, {
        vectors: {
          size: this.vectorSize,
          distance: 'Cosine'
        },
        optimizers_config: {
          default_segment_number: 2
        },
        replication_factor: 1
      });

      // Create indexes for efficient filtering
      await this.client.createPayloadIndex(collectionName, {
        field_name: 'campaignId',
        field_schema: 'integer'
      });

      await this.client.createPayloadIndex(collectionName, {
        field_name: 'tickId',
        field_schema: 'integer'
      });

      await this.client.createPayloadIndex(collectionName, {
        field_name: 'analysisType',
        field_schema: 'keyword'
      });

      await this.client.createPayloadIndex(collectionName, {
        field_name: 'analysisMetrics.insightCategory',
        field_schema: 'keyword'
      });

      console.log(`Created AI analysis collection: ${collectionName}`);
    }

    return collectionName;
  }

  private getAIAnalysisCollectionName(campaignId: number): string {
    return `ai_analysis_memory_campaign_${campaignId}`;
  }

  private createAIAnalysisEmbeddingContent(entry: AIAnalysisMemoryEntry): string {
    return `AI Analysis: ${entry.content}
Analysis Type: ${entry.analysisType}
Insight Category: ${entry.analysisMetrics.insightCategory}
Confidence Score: ${entry.analysisMetrics.confidenceScore}
Novelty Score: ${entry.analysisMetrics.noveltyScore}
Builds on Previous: ${entry.continuityFactors.buildOnPreviousAnalysis}
Referenced Insights: ${entry.continuityFactors.referencedInsights.join(', ')}
Evolution from Tick: ${entry.continuityFactors.evolutionFromTick}`;
  }

  private async updateAIAnalysisMetadata(campaignId: number, collectionName: string): Promise<void> {
    try {
      const info = await this.client.getCollection(collectionName);
      const memoryCount = info.points_count || 0;

      await this.pool.query(`
        INSERT INTO ai_analysis_memory_collections (campaign_id, collection_name, memory_count, last_updated)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (campaign_id) 
        DO UPDATE SET 
          collection_name = EXCLUDED.collection_name,
          memory_count = EXCLUDED.memory_count,
          last_updated = EXCLUDED.last_updated
      `, [campaignId, collectionName, memoryCount]);

    } catch (error) {
      console.error('AI analysis metadata update failed:', error);
    }
  }

  private mapPointToEntry(point: any): AIAnalysisMemoryEntry {
    return {
      content: point.payload?.content as string,
      analysisType: point.payload?.analysisType as any,
      analysisMetrics: point.payload?.analysisMetrics as any,
      continuityFactors: point.payload?.continuityFactors as any,
      metadata: point.payload?.metadata as any
    };
  }

  private generateAnalysisRecommendations(
    correlations: Array<{ domain1: string; domain2: string; correlationStrength: number }>,
    emergentPatterns: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Recommend analysis for strong correlations
    const strongCorrelations = correlations.filter(c => c.correlationStrength > 0.7);
    strongCorrelations.forEach(correlation => {
      recommendations.push(
        `Deep dive analysis recommended: ${correlation.domain1}-${correlation.domain2} correlation (strength: ${correlation.correlationStrength.toFixed(2)})`
      );
    });

    // Recommend pattern investigation
    if (emergentPatterns.length > 3) {
      recommendations.push('Multiple emergent patterns detected - recommend systemic analysis');
    }

    // Recommend predictive modeling
    if (correlations.length > 5) {
      recommendations.push('Sufficient correlation data for predictive modeling development');
    }

    return recommendations.length > 0 ? recommendations : ['Continue monitoring for correlation opportunities'];
  }

  /**
   * Get AI analysis memory statistics
   */
  async getAIAnalysisMemoryStats(campaignId: number): Promise<{
    totalAnalyses: number;
    analysisTypes: Record<string, number>;
    averageConfidence: number;
    averageNovelty: number;
    predictionAccuracy: number;
    lastAnalysisTime: Date | null;
  }> {
    try {
      const collectionName = this.getAIAnalysisCollectionName(campaignId);
      const info = await this.client.getCollection(collectionName);

      // Get recent analyses for statistics
      const recentAnalyses = await this.getPreviousAIAnalyses(campaignId, Number.MAX_SAFE_INTEGER, undefined, 100);

      const analysisTypes = recentAnalyses.reduce((types, analysis) => {
        types[analysis.analysisType] = (types[analysis.analysisType] || 0) + 1;
        return types;
      }, {} as Record<string, number>);

      const averageConfidence = recentAnalyses.length > 0
        ? recentAnalyses.reduce((sum, a) => sum + a.analysisMetrics.confidenceScore, 0) / recentAnalyses.length
        : 0;

      const averageNovelty = recentAnalyses.length > 0
        ? recentAnalyses.reduce((sum, a) => sum + a.analysisMetrics.noveltyScore, 0) / recentAnalyses.length
        : 0;

      const predictionsWithAccuracy = recentAnalyses.filter(a => a.analysisMetrics.predictionAccuracy !== undefined);
      const predictionAccuracy = predictionsWithAccuracy.length > 0
        ? predictionsWithAccuracy.reduce((sum, a) => sum + (a.analysisMetrics.predictionAccuracy || 0), 0) / predictionsWithAccuracy.length
        : 0;

      const lastAnalysisTime = recentAnalyses.length > 0 ? recentAnalyses[0].metadata.timestamp : null;

      return {
        totalAnalyses: info.points_count || 0,
        analysisTypes,
        averageConfidence,
        averageNovelty,
        predictionAccuracy,
        lastAnalysisTime
      };

    } catch (error) {
      console.error('AI analysis memory stats retrieval failed:', error);
      return {
        totalAnalyses: 0,
        analysisTypes: {},
        averageConfidence: 0,
        averageNovelty: 0,
        predictionAccuracy: 0,
        lastAnalysisTime: null
      };
    }
  }
}

// Export singleton instance
export const aiAnalysisVectorMemory = new AIAnalysisVectorMemory();
