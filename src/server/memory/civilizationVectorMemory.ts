/**
 * Civilization Vector Memory System
 * Manages civilization-wide vector collections for shared events, intelligence, and galactic news
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { Pool } from 'pg';
import { getPool } from '../storage/db.js';
import { embeddingService } from './embeddingService.js';
import {
  CivilizationMemoryEntry,
  CivilizationMemoryCollection,
  MemorySearchQuery,
  MemorySearchResult
} from './types.js';

export class CivilizationVectorMemory {
  private client: QdrantClient;
  private pool: Pool;
  private vectorSize: number = 1536; // Default for OpenAI text-embedding-3-small

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333'
    });
    this.pool = getPool();
  }

  /**
   * Generate collection name for a civilization
   */
  private getCivilizationCollectionName(civilizationId: string): string {
    // Sanitize civilization ID for collection name (alphanumeric + underscore only)
    const sanitized = civilizationId.replace(/[^a-zA-Z0-9_]/g, '_');
    return `civilization_memory_${sanitized}`;
  }

  /**
   * Create or ensure civilization memory collection exists
   */
  async ensureCivilizationCollection(civilizationId: string, campaignId?: number): Promise<string> {
    const collectionName = this.getCivilizationCollectionName(civilizationId);

    try {
      // Check if collection exists in Qdrant
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === collectionName);

      if (!exists) {
        // Create collection in Qdrant
        await this.client.createCollection(collectionName, {
          vectors: {
            size: this.vectorSize,
            distance: 'Cosine'
          }
        });

        console.log(`✅ Created civilization collection: ${collectionName}`);
      }

      // Ensure metadata record exists in database
      await this.ensureCollectionMetadata(civilizationId, collectionName, campaignId);

      return collectionName;
    } catch (error) {
      console.error(`❌ Failed to ensure civilization collection for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Ensure collection metadata exists in database
   */
  private async ensureCollectionMetadata(
    civilizationId: string, 
    collectionName: string, 
    campaignId?: number
  ): Promise<void> {
    const query = `
      INSERT INTO civilization_memory_collections (
        civilization_id, collection_name, campaign_id
      ) VALUES ($1, $2, $3)
      ON CONFLICT (civilization_id) 
      DO UPDATE SET 
        collection_name = EXCLUDED.collection_name,
        last_updated = NOW()
    `;

    try {
      await this.pool.query(query, [civilizationId, collectionName, campaignId]);
    } catch (error) {
      console.error('❌ Failed to ensure civilization collection metadata:', error);
      throw error;
    }
  }

  /**
   * Store a memory entry for a civilization
   */
  async storeCivilizationMemory(
    civilizationId: string, 
    content: string, 
    contentType: 'leader_speech' | 'intelligence_report' | 'galactic_news' | 'major_event' | 'ai_analysis',
    classification?: 'PUBLIC' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET',
    metadata?: Record<string, any>,
    campaignId?: number,
    originalId?: string
  ): Promise<string> {
    try {
      // Ensure collection exists
      const collectionName = await this.ensureCivilizationCollection(civilizationId, campaignId);

      // Generate embedding
      const embedding = await embeddingService.embedSingle(content);

      // Create memory entry
      const memoryId = `${civilizationId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const memoryEntry: CivilizationMemoryEntry = {
        id: memoryId,
        vector: embedding,
        payload: {
          civilizationId,
          campaignId,
          timestamp: new Date().toISOString(),
          contentType,
          content,
          classification: classification || 'PUBLIC',
          metadata,
          originalId
        }
      };

      // Store in Qdrant
      await this.client.upsert(collectionName, {
        wait: true,
        points: [memoryEntry]
      });

      // Update memory count in metadata
      await this.updateMemoryCount(civilizationId, 1);

      console.log(`🏛️ Stored civilization memory: ${memoryId} for ${civilizationId} (${contentType})`);
      return memoryId;

    } catch (error) {
      console.error(`❌ Failed to store civilization memory for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Store multiple memories in batch
   */
  async storeCivilizationMemoriesBatch(
    civilizationId: string,
    memories: Array<{
      content: string;
      contentType: 'leader_speech' | 'intelligence_report' | 'galactic_news' | 'major_event' | 'ai_analysis';
      classification?: 'PUBLIC' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
      metadata?: Record<string, any>;
      originalId?: string;
    }>,
    campaignId?: number
  ): Promise<string[]> {
    if (memories.length === 0) return [];

    try {
      // Ensure collection exists
      const collectionName = await this.ensureCivilizationCollection(civilizationId, campaignId);

      // Generate embeddings in batch
      const contents = memories.map(m => m.content);
      const embeddings = await embeddingService.embedBatch(contents);

      // Create memory entries
      const memoryEntries: CivilizationMemoryEntry[] = memories.map((memory, index) => {
        const memoryId = `${civilizationId}_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: memoryId,
          vector: embeddings[index],
          payload: {
            civilizationId,
            campaignId,
            timestamp: new Date().toISOString(),
            contentType: memory.contentType,
            content: memory.content,
            classification: memory.classification || 'PUBLIC',
            metadata: memory.metadata,
            originalId: memory.originalId
          }
        };
      });

      // Store in Qdrant
      await this.client.upsert(collectionName, {
        wait: true,
        points: memoryEntries
      });

      // Update memory count
      await this.updateMemoryCount(civilizationId, memories.length);

      const memoryIds = memoryEntries.map(e => e.id);
      console.log(`🏛️ Stored ${memories.length} civilization memories for ${civilizationId}`);
      return memoryIds;

    } catch (error) {
      console.error(`❌ Failed to store civilization memories batch for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Search civilization memories
   */
  async searchCivilizationMemories(
    civilizationId: string,
    query: string,
    options: {
      contentType?: string[];
      classification?: string[];
      timeRange?: { start?: Date; end?: Date };
      limit?: number;
      threshold?: number;
    } = {}
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getCivilizationCollectionName(civilizationId);

      // Generate query embedding
      const queryEmbedding = await embeddingService.embedSingle(query);

      // Build filter conditions
      const filter: any = {
        must: [
          { key: 'civilizationId', match: { value: civilizationId } }
        ]
      };

      if (options.contentType && options.contentType.length > 0) {
        filter.must.push({
          key: 'contentType',
          match: { any: options.contentType }
        });
      }

      if (options.classification && options.classification.length > 0) {
        filter.must.push({
          key: 'classification',
          match: { any: options.classification }
        });
      }

      if (options.timeRange) {
        const range: any = {};
        if (options.timeRange.start) {
          range.gte = options.timeRange.start.toISOString();
        }
        if (options.timeRange.end) {
          range.lte = options.timeRange.end.toISOString();
        }
        if (Object.keys(range).length > 0) {
          filter.must.push({
            key: 'timestamp',
            range
          });
        }
      }

      // Search in Qdrant
      const searchResult = await this.client.search(collectionName, {
        vector: queryEmbedding,
        filter,
        limit: options.limit || 10,
        score_threshold: options.threshold || 0.7,
        with_payload: true
      });

      // Convert to MemorySearchResult format
      return searchResult.map(result => ({
        id: result.id as string,
        score: result.score,
        content: result.payload?.content as string,
        contentType: result.payload?.contentType as string,
        timestamp: new Date(result.payload?.timestamp as string),
        metadata: {
          ...result.payload?.metadata as Record<string, any>,
          classification: result.payload?.classification,
          civilizationId: result.payload?.civilizationId
        }
      }));

    } catch (error) {
      console.error(`❌ Failed to search civilization memories for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent memories for a civilization
   */
  async getRecentMemories(
    civilizationId: string,
    limit: number = 20,
    contentType?: string[],
    classification?: string[]
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getCivilizationCollectionName(civilizationId);

      // Build filter
      const filter: any = {
        must: [
          { key: 'civilizationId', match: { value: civilizationId } }
        ]
      };

      if (contentType && contentType.length > 0) {
        filter.must.push({
          key: 'contentType',
          match: { any: contentType }
        });
      }

      if (classification && classification.length > 0) {
        filter.must.push({
          key: 'classification',
          match: { any: classification }
        });
      }

      // Get points with filter
      const scrollResult = await this.client.scroll(collectionName, {
        filter,
        limit,
        with_payload: true
      });

      // Sort by timestamp (most recent first)
      const memories = scrollResult.points
        .map(point => ({
          id: point.id as string,
          score: 1.0, // No relevance score for recent query
          content: point.payload?.content as string,
          contentType: point.payload?.contentType as string,
          timestamp: new Date(point.payload?.timestamp as string),
          metadata: {
            ...point.payload?.metadata as Record<string, any>,
            classification: point.payload?.classification,
            civilizationId: point.payload?.civilizationId
          }
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return memories;

    } catch (error) {
      console.error(`❌ Failed to get recent civilization memories for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Get memories by classification level
   */
  async getMemoriesByClassification(
    civilizationId: string,
    classification: 'PUBLIC' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET',
    limit: number = 50
  ): Promise<MemorySearchResult[]> {
    return this.getRecentMemories(civilizationId, limit, undefined, [classification]);
  }

  /**
   * Get intelligence reports for briefings
   */
  async getIntelligenceReports(
    civilizationId: string,
    classification?: string[],
    timeRange?: { start?: Date; end?: Date },
    limit: number = 20
  ): Promise<MemorySearchResult[]> {
    return this.searchCivilizationMemories(civilizationId, '', {
      contentType: ['intelligence_report'],
      classification,
      timeRange,
      limit,
      threshold: 0.0 // Get all intelligence reports
    });
  }

  /**
   * Get leader speeches for context
   */
  async getLeaderSpeeches(
    civilizationId: string,
    timeRange?: { start?: Date; end?: Date },
    limit: number = 10
  ): Promise<MemorySearchResult[]> {
    return this.searchCivilizationMemories(civilizationId, '', {
      contentType: ['leader_speech'],
      timeRange,
      limit,
      threshold: 0.0 // Get all speeches
    });
  }

  /**
   * Get galactic news and events
   */
  async getGalacticNews(
    civilizationId: string,
    timeRange?: { start?: Date; end?: Date },
    limit: number = 30
  ): Promise<MemorySearchResult[]> {
    return this.searchCivilizationMemories(civilizationId, '', {
      contentType: ['galactic_news', 'major_event'],
      timeRange,
      limit,
      threshold: 0.0 // Get all news
    });
  }

  /**
   * Delete civilization memory
   */
  async deleteCivilizationMemory(civilizationId: string, memoryId: string): Promise<void> {
    try {
      const collectionName = this.getCivilizationCollectionName(civilizationId);

      await this.client.delete(collectionName, {
        points: [memoryId]
      });

      // Update memory count
      await this.updateMemoryCount(civilizationId, -1);

      console.log(`🗑️ Deleted civilization memory: ${memoryId} for ${civilizationId}`);

    } catch (error) {
      console.error(`❌ Failed to delete civilization memory ${memoryId}:`, error);
      throw error;
    }
  }

  /**
   * Clear all memories for a civilization
   */
  async clearCivilizationMemories(civilizationId: string): Promise<void> {
    try {
      const collectionName = this.getCivilizationCollectionName(civilizationId);

      // Delete the entire collection
      await this.client.deleteCollection(collectionName);

      // Reset memory count
      await this.pool.query(
        'UPDATE civilization_memory_collections SET memory_count = 0, last_updated = NOW() WHERE civilization_id = $1',
        [civilizationId]
      );

      console.log(`🗑️ Cleared all memories for civilization: ${civilizationId}`);

    } catch (error) {
      console.error(`❌ Failed to clear civilization memories for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Get civilization memory statistics
   */
  async getCivilizationMemoryStats(civilizationId: string): Promise<{
    totalMemories: number;
    memoriesByType: Record<string, number>;
    memoriesByClassification: Record<string, number>;
    oldestMemory?: Date;
    newestMemory?: Date;
    collectionName: string;
  }> {
    try {
      const collectionName = this.getCivilizationCollectionName(civilizationId);

      // Get collection info from Qdrant
      const collectionInfo = await this.client.getCollection(collectionName);
      const totalMemories = collectionInfo.points_count || 0;

      // Get memories by type and classification
      const scrollResult = await this.client.scroll(collectionName, {
        filter: {
          must: [{ key: 'civilizationId', match: { value: civilizationId } }]
        },
        limit: 1000, // Adjust based on expected memory count
        with_payload: true
      });

      const memoriesByType: Record<string, number> = {};
      const memoriesByClassification: Record<string, number> = {};
      const timestamps: Date[] = [];

      scrollResult.points.forEach(point => {
        const contentType = point.payload?.contentType as string;
        const classification = point.payload?.classification as string;
        
        memoriesByType[contentType] = (memoriesByType[contentType] || 0) + 1;
        memoriesByClassification[classification] = (memoriesByClassification[classification] || 0) + 1;

        const timestamp = new Date(point.payload?.timestamp as string);
        timestamps.push(timestamp);
      });

      timestamps.sort((a, b) => a.getTime() - b.getTime());

      return {
        totalMemories,
        memoriesByType,
        memoriesByClassification,
        oldestMemory: timestamps.length > 0 ? timestamps[0] : undefined,
        newestMemory: timestamps.length > 0 ? timestamps[timestamps.length - 1] : undefined,
        collectionName
      };

    } catch (error) {
      console.error(`❌ Failed to get civilization memory stats for ${civilizationId}:`, error);
      throw error;
    }
  }

  /**
   * Update memory count in database metadata
   */
  private async updateMemoryCount(civilizationId: string, delta: number): Promise<void> {
    const query = `
      UPDATE civilization_memory_collections 
      SET memory_count = memory_count + $1, last_updated = NOW() 
      WHERE civilization_id = $2
    `;

    try {
      await this.pool.query(query, [delta, civilizationId]);
    } catch (error) {
      console.error('❌ Failed to update civilization memory count:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Get all civilization collections
   */
  async getAllCivilizationCollections(): Promise<CivilizationMemoryCollection[]> {
    const query = `
      SELECT * FROM civilization_memory_collections 
      ORDER BY last_updated DESC
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        id: row.id,
        civilizationId: row.civilization_id,
        collectionName: row.collection_name,
        campaignId: row.campaign_id,
        memoryCount: row.memory_count,
        lastUpdated: row.last_updated,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('❌ Failed to get civilization collections:', error);
      throw error;
    }
  }

  /**
   * Health check - verify Qdrant connection and collections
   */
  async healthCheck(): Promise<{
    qdrantConnected: boolean;
    collectionsCount: number;
    embeddingServiceConfigured: boolean;
  }> {
    try {
      const collections = await this.client.getCollections();
      const civilizationCollections = collections.collections.filter(c => 
        c.name.startsWith('civilization_memory_')
      );

      return {
        qdrantConnected: true,
        collectionsCount: civilizationCollections.length,
        embeddingServiceConfigured: true
      };
    } catch (error) {
      return {
        qdrantConnected: false,
        collectionsCount: 0,
        embeddingServiceConfigured: true
      };
    }
  }
}

// Export singleton instance
export const civilizationVectorMemory = new CivilizationVectorMemory();
