/**
 * Psychology Vector Memory Service
 * Maintains continuous psychological analysis context across simulation ticks
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { Pool } from 'pg';
import { getPool } from '../storage/db.js';
import { embeddingService } from '../memory/embeddingService.js';
import {
  PsychologyMemoryEntry,
  MemorySearchQuery,
  MemorySearchResult
} from './types.js';

export class PsychologyVectorMemory {
  private client: QdrantClient;
  private pool: Pool;
  private vectorSize: number = 1536; // Default for OpenAI text-embedding-3-small

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333'
    });
    this.pool = getPool();
  }

  // ===== PSYCHOLOGY MEMORY MANAGEMENT =====

  /**
   * Store psychology analysis with continuity context
   */
  async storePsychologyAnalysis(
    campaignId: number,
    entry: PsychologyMemoryEntry
  ): Promise<string> {
    try {
      const collectionName = await this.ensurePsychologyCollection(campaignId);
      
      // Create rich content for embedding that includes context
      const embeddingContent = this.createPsychologyEmbeddingContent(entry);
      const embedding = await embeddingService.embedSingle(embeddingContent);
      
      const pointId = `psychology_${campaignId}_${entry.metadata.tickId}_${Date.now()}`;
      
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
            psychologyMetrics: entry.psychologyMetrics,
            continuityFactors: entry.continuityFactors,
            metadata: entry.metadata,
            embeddingContent
          }
        }]
      });

      // Update database metadata
      await this.updatePsychologyMetadata(campaignId, collectionName);

      return pointId;

    } catch (error) {
      console.error('Psychology memory storage failed:', error);
      throw error;
    }
  }

  /**
   * Get previous psychology analysis for continuity
   */
  async getPreviousPsychologyAnalysis(
    campaignId: number,
    currentTickId: number,
    analysisType?: string,
    limit: number = 5
  ): Promise<PsychologyMemoryEntry[]> {
    try {
      const collectionName = this.getPsychologyCollectionName(campaignId);
      
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
        psychologyMetrics: point.payload?.psychologyMetrics as any,
        continuityFactors: point.payload?.continuityFactors as any,
        metadata: point.payload?.metadata as any
      }));

    } catch (error) {
      console.error('Previous psychology analysis retrieval failed:', error);
      return [];
    }
  }

  /**
   * Search psychology memory by semantic similarity
   */
  async searchPsychologyMemory(
    campaignId: number,
    query: string,
    options: {
      analysisType?: string;
      timeRange?: { start: Date; end: Date };
      limit?: number;
      minScore?: number;
    } = {}
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getPsychologyCollectionName(campaignId);
      const queryEmbedding = await embeddingService.embedSingle(query);

      const filter: any = {
        must: [{ key: 'campaignId', match: { value: campaignId } }]
      };

      if (options.analysisType) {
        filter.must.push({ key: 'analysisType', match: { value: options.analysisType } });
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
        limit: options.limit || 10,
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
          psychologyMetrics: result.payload?.psychologyMetrics as any
        }
      }));

    } catch (error) {
      console.error('Psychology memory search failed:', error);
      return [];
    }
  }

  /**
   * Analyze psychological trends across multiple ticks
   */
  async analyzePsychologyTrends(
    campaignId: number,
    tickRange: { start: number; end: number },
    analysisType?: string
  ): Promise<{
    trendDirection: 'improving' | 'stable' | 'declining';
    significantChanges: Array<{ tickId: number; change: string; impact: string }>;
    continuityScore: number;
    patternInsights: string[];
  }> {
    try {
      const analyses = await this.getPreviousPsychologyAnalysis(
        campaignId,
        tickRange.end + 1,
        analysisType,
        tickRange.end - tickRange.start + 1
      );

      if (analyses.length < 2) {
        return {
          trendDirection: 'stable',
          significantChanges: [],
          continuityScore: 1.0,
          patternInsights: ['Insufficient data for trend analysis']
        };
      }

      // Analyze sentiment trend
      const sentimentScores = analyses.map(a => a.psychologyMetrics.sentimentScore);
      const trendDirection = this.calculateTrendDirection(sentimentScores);

      // Identify significant changes
      const significantChanges = this.identifySignificantChanges(analyses);

      // Calculate continuity score
      const continuityScore = this.calculateContinuityScore(analyses);

      // Generate pattern insights
      const patternInsights = this.generatePatternInsights(analyses);

      return {
        trendDirection,
        significantChanges,
        continuityScore,
        patternInsights
      };

    } catch (error) {
      console.error('Psychology trend analysis failed:', error);
      return {
        trendDirection: 'stable',
        significantChanges: [],
        continuityScore: 0.5,
        patternInsights: ['Trend analysis failed']
      };
    }
  }

  // ===== PRIVATE METHODS =====

  private async ensurePsychologyCollection(campaignId: number): Promise<string> {
    const collectionName = this.getPsychologyCollectionName(campaignId);
    
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

      console.log(`Created psychology collection: ${collectionName}`);
    }

    return collectionName;
  }

  private getPsychologyCollectionName(campaignId: number): string {
    return `psychology_memory_campaign_${campaignId}`;
  }

  private createPsychologyEmbeddingContent(entry: PsychologyMemoryEntry): string {
    return `Psychology Analysis: ${entry.content}
Analysis Type: ${entry.analysisType}
Overall Mood: ${entry.psychologyMetrics.overallMood}
Sentiment Score: ${entry.psychologyMetrics.sentimentScore}
Trend Direction: ${entry.psychologyMetrics.trendDirection}
Behavioral Indicators: ${entry.psychologyMetrics.behavioralIndicators.join(', ')}
Significant Changes: ${entry.continuityFactors.significantChanges.join(', ')}
Contextual Factors: ${entry.continuityFactors.contextualFactors.join(', ')}`;
  }

  private async updatePsychologyMetadata(campaignId: number, collectionName: string): Promise<void> {
    try {
      const info = await this.client.getCollection(collectionName);
      const memoryCount = info.points_count || 0;

      await this.pool.query(`
        INSERT INTO psychology_memory_collections (campaign_id, collection_name, memory_count, last_updated)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (campaign_id) 
        DO UPDATE SET 
          collection_name = EXCLUDED.collection_name,
          memory_count = EXCLUDED.memory_count,
          last_updated = EXCLUDED.last_updated
      `, [campaignId, collectionName, memoryCount]);

    } catch (error) {
      console.error('Psychology metadata update failed:', error);
    }
  }

  private calculateTrendDirection(sentimentScores: number[]): 'improving' | 'stable' | 'declining' {
    if (sentimentScores.length < 2) return 'stable';

    const recent = sentimentScores.slice(0, Math.min(3, sentimentScores.length));
    const older = sentimentScores.slice(-Math.min(3, sentimentScores.length));

    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.1) return 'improving';
    if (difference < -0.1) return 'declining';
    return 'stable';
  }

  private identifySignificantChanges(analyses: PsychologyMemoryEntry[]): Array<{ tickId: number; change: string; impact: string }> {
    const changes: Array<{ tickId: number; change: string; impact: string }> = [];

    for (let i = 0; i < analyses.length - 1; i++) {
      const current = analyses[i];
      const previous = analyses[i + 1];

      // Check for mood changes
      if (current.psychologyMetrics.overallMood !== previous.psychologyMetrics.overallMood) {
        changes.push({
          tickId: current.metadata.tickId,
          change: `Mood shifted from ${previous.psychologyMetrics.overallMood} to ${current.psychologyMetrics.overallMood}`,
          impact: this.assessMoodChangeImpact(previous.psychologyMetrics.overallMood, current.psychologyMetrics.overallMood)
        });
      }

      // Check for significant sentiment changes
      const sentimentDiff = Math.abs(current.psychologyMetrics.sentimentScore - previous.psychologyMetrics.sentimentScore);
      if (sentimentDiff > 0.2) {
        changes.push({
          tickId: current.metadata.tickId,
          change: `Sentiment changed by ${(sentimentDiff * 100).toFixed(1)}%`,
          impact: sentimentDiff > 0.3 ? 'Major' : 'Moderate'
        });
      }
    }

    return changes;
  }

  private calculateContinuityScore(analyses: PsychologyMemoryEntry[]): number {
    if (analyses.length < 2) return 1.0;

    let continuitySum = 0;
    let comparisons = 0;

    for (let i = 0; i < analyses.length - 1; i++) {
      const current = analyses[i];
      const previous = analyses[i + 1];

      // Check trend continuation
      if (current.continuityFactors.trendContinuation) {
        continuitySum += 0.3;
      }

      // Check for contextual similarity
      const sharedFactors = current.continuityFactors.contextualFactors.filter(
        factor => previous.continuityFactors.contextualFactors.includes(factor)
      ).length;
      
      const maxFactors = Math.max(
        current.continuityFactors.contextualFactors.length,
        previous.continuityFactors.contextualFactors.length
      );

      if (maxFactors > 0) {
        continuitySum += (sharedFactors / maxFactors) * 0.7;
      }

      comparisons++;
    }

    return comparisons > 0 ? Math.min(1.0, continuitySum / comparisons) : 0.5;
  }

  private generatePatternInsights(analyses: PsychologyMemoryEntry[]): string[] {
    const insights: string[] = [];

    // Analyze recurring behavioral indicators
    const allIndicators = analyses.flatMap(a => a.psychologyMetrics.behavioralIndicators);
    const indicatorCounts = allIndicators.reduce((counts, indicator) => {
      counts[indicator] = (counts[indicator] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const recurringIndicators = Object.entries(indicatorCounts)
      .filter(([_, count]) => count >= Math.ceil(analyses.length * 0.5))
      .map(([indicator, _]) => indicator);

    if (recurringIndicators.length > 0) {
      insights.push(`Recurring behavioral patterns: ${recurringIndicators.join(', ')}`);
    }

    // Analyze trend stability
    const trendDirections = analyses.map(a => a.psychologyMetrics.trendDirection);
    const stableCount = trendDirections.filter(dir => dir === 'stable').length;
    const stabilityRatio = stableCount / trendDirections.length;

    if (stabilityRatio > 0.7) {
      insights.push('High psychological stability observed across analysis period');
    } else if (stabilityRatio < 0.3) {
      insights.push('High psychological volatility detected - requires attention');
    }

    // Analyze confidence trends
    const confidenceLevels = analyses.map(a => a.psychologyMetrics.confidenceLevel);
    const avgConfidence = confidenceLevels.reduce((sum, conf) => sum + conf, 0) / confidenceLevels.length;

    if (avgConfidence > 0.8) {
      insights.push('High confidence in psychological assessments');
    } else if (avgConfidence < 0.5) {
      insights.push('Low confidence in psychological assessments - data quality may be insufficient');
    }

    return insights.length > 0 ? insights : ['No significant patterns detected in current analysis period'];
  }

  private assessMoodChangeImpact(previousMood: string, currentMood: string): string {
    const moodHierarchy = ['rebellious', 'angry', 'concerned', 'content', 'happy', 'ecstatic'];
    const prevIndex = moodHierarchy.indexOf(previousMood);
    const currIndex = moodHierarchy.indexOf(currentMood);

    if (prevIndex === -1 || currIndex === -1) return 'Unknown';

    const difference = Math.abs(currIndex - prevIndex);
    
    if (difference >= 3) return 'Major';
    if (difference >= 2) return 'Moderate';
    return 'Minor';
  }

  /**
   * Get psychology memory statistics
   */
  async getPsychologyMemoryStats(campaignId: number): Promise<{
    totalAnalyses: number;
    analysisTypes: Record<string, number>;
    averageConfidence: number;
    trendStability: number;
    lastAnalysisTime: Date | null;
  }> {
    try {
      const collectionName = this.getPsychologyCollectionName(campaignId);
      const info = await this.client.getCollection(collectionName);

      // Get recent analyses for statistics
      const recentAnalyses = await this.getPreviousPsychologyAnalysis(campaignId, Number.MAX_SAFE_INTEGER, undefined, 50);

      const analysisTypes = recentAnalyses.reduce((types, analysis) => {
        types[analysis.analysisType] = (types[analysis.analysisType] || 0) + 1;
        return types;
      }, {} as Record<string, number>);

      const averageConfidence = recentAnalyses.length > 0
        ? recentAnalyses.reduce((sum, a) => sum + a.psychologyMetrics.confidenceLevel, 0) / recentAnalyses.length
        : 0;

      const stableCount = recentAnalyses.filter(a => a.psychologyMetrics.trendDirection === 'stable').length;
      const trendStability = recentAnalyses.length > 0 ? stableCount / recentAnalyses.length : 0;

      const lastAnalysisTime = recentAnalyses.length > 0 ? recentAnalyses[0].metadata.timestamp : null;

      return {
        totalAnalyses: info.points_count || 0,
        analysisTypes,
        averageConfidence,
        trendStability,
        lastAnalysisTime
      };

    } catch (error) {
      console.error('Psychology memory stats retrieval failed:', error);
      return {
        totalAnalyses: 0,
        analysisTypes: {},
        averageConfidence: 0,
        trendStability: 0,
        lastAnalysisTime: null
      };
    }
  }
}

// Export singleton instance
export const psychologyVectorMemory = new PsychologyVectorMemory();
