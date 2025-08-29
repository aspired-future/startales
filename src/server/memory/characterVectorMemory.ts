/**
 * Character Vector Memory System
 * Manages individual Qdrant collections for each character's personal memory
 */

import { QdrantClient } from '@qdrant/js-client-rest';
import { Pool } from 'pg';
import { getPool } from '../storage/db';
import { embeddingService } from './embeddingService';
import {
  CharacterMemoryEntry,
  CharacterMemoryCollection,
  MemorySearchQuery,
  MemorySearchResult
} from './types';

export class CharacterVectorMemory {
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
   * Generate collection name for a character
   */
  private getCharacterCollectionName(characterId: string): string {
    // Sanitize character ID for collection name (alphanumeric + underscore only)
    const sanitized = characterId.replace(/[^a-zA-Z0-9_]/g, '_');
    return `character_memory_${sanitized}`;
  }

  /**
   * Create or ensure character memory collection exists
   */
  async ensureCharacterCollection(characterId: string, campaignId?: number): Promise<string> {
    const collectionName = this.getCharacterCollectionName(characterId);

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

        console.log(`✅ Created character collection: ${collectionName}`);
      }

      // Ensure metadata record exists in database
      await this.ensureCollectionMetadata(characterId, collectionName, campaignId);

      return collectionName;
    } catch (error) {
      console.error(`❌ Failed to ensure character collection for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Ensure collection metadata exists in database
   */
  private async ensureCollectionMetadata(
    characterId: string, 
    collectionName: string, 
    campaignId?: number
  ): Promise<void> {
    const query = `
      INSERT INTO character_memory_collections (
        character_id, collection_name, campaign_id
      ) VALUES ($1, $2, $3)
      ON CONFLICT (character_id) 
      DO UPDATE SET 
        collection_name = EXCLUDED.collection_name,
        last_updated = NOW()
    `;

    try {
      await this.pool.query(query, [characterId, collectionName, campaignId]);
    } catch (error) {
      console.error('❌ Failed to ensure collection metadata:', error);
      throw error;
    }
  }

  /**
   * Store a memory entry for a character
   */
  async storeCharacterMemory(
    characterId: string, 
    content: string, 
    contentType: 'witter_post' | 'conversation' | 'event',
    metadata?: Record<string, any>,
    campaignId?: number,
    originalId?: string
  ): Promise<string> {
    try {
      // Ensure collection exists
      const collectionName = await this.ensureCharacterCollection(characterId, campaignId);

      // Generate embedding
      const embedding = await embeddingService.embedSingle(content);

      // Create memory entry
      const memoryId = `${characterId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const memoryEntry: CharacterMemoryEntry = {
        id: memoryId,
        vector: embedding,
        payload: {
          characterId,
          campaignId,
          timestamp: new Date().toISOString(),
          contentType,
          content,
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
      await this.updateMemoryCount(characterId, 1);

      console.log(`🧠 Stored character memory: ${memoryId} for ${characterId}`);
      return memoryId;

    } catch (error) {
      console.error(`❌ Failed to store character memory for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Store multiple memories in batch
   */
  async storeCharacterMemoriesBatch(
    characterId: string,
    memories: Array<{
      content: string;
      contentType: 'witter_post' | 'conversation' | 'event';
      metadata?: Record<string, any>;
      originalId?: string;
    }>,
    campaignId?: number
  ): Promise<string[]> {
    if (memories.length === 0) return [];

    try {
      // Ensure collection exists
      const collectionName = await this.ensureCharacterCollection(characterId, campaignId);

      // Generate embeddings in batch
      const contents = memories.map(m => m.content);
      const embeddings = await embeddingService.embedBatch(contents);

      // Create memory entries
      const memoryEntries: CharacterMemoryEntry[] = memories.map((memory, index) => {
        const memoryId = `${characterId}_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          id: memoryId,
          vector: embeddings[index],
          payload: {
            characterId,
            campaignId,
            timestamp: new Date().toISOString(),
            contentType: memory.contentType,
            content: memory.content,
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
      await this.updateMemoryCount(characterId, memories.length);

      const memoryIds = memoryEntries.map(e => e.id);
      console.log(`🧠 Stored ${memories.length} character memories for ${characterId}`);
      return memoryIds;

    } catch (error) {
      console.error(`❌ Failed to store character memories batch for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Search character memories
   */
  async searchCharacterMemories(
    characterId: string,
    query: string,
    options: {
      contentType?: string[];
      timeRange?: { start?: Date; end?: Date };
      limit?: number;
      threshold?: number;
    } = {}
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getCharacterCollectionName(characterId);

      // Generate query embedding
      const queryEmbedding = await embeddingService.embedSingle(query);

      // Build filter conditions
      const filter: any = {
        must: [
          { key: 'characterId', match: { value: characterId } }
        ]
      };

      if (options.contentType && options.contentType.length > 0) {
        filter.must.push({
          key: 'contentType',
          match: { any: options.contentType }
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
        metadata: result.payload?.metadata as Record<string, any>
      }));

    } catch (error) {
      console.error(`❌ Failed to search character memories for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent memories for a character
   */
  async getRecentMemories(
    characterId: string,
    limit: number = 20,
    contentType?: string[]
  ): Promise<MemorySearchResult[]> {
    try {
      const collectionName = this.getCharacterCollectionName(characterId);

      // Build filter
      const filter: any = {
        must: [
          { key: 'characterId', match: { value: characterId } }
        ]
      };

      if (contentType && contentType.length > 0) {
        filter.must.push({
          key: 'contentType',
          match: { any: contentType }
        });
      }

      // Get points with filter (Qdrant doesn't have direct "recent" query, so we scroll)
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
          metadata: point.payload?.metadata as Record<string, any>
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);

      return memories;

    } catch (error) {
      console.error(`❌ Failed to get recent memories for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Delete character memory
   */
  async deleteCharacterMemory(characterId: string, memoryId: string): Promise<void> {
    try {
      const collectionName = this.getCharacterCollectionName(characterId);

      await this.client.delete(collectionName, {
        points: [memoryId]
      });

      // Update memory count
      await this.updateMemoryCount(characterId, -1);

      console.log(`🗑️ Deleted character memory: ${memoryId} for ${characterId}`);

    } catch (error) {
      console.error(`❌ Failed to delete character memory ${memoryId}:`, error);
      throw error;
    }
  }

  /**
   * Clear all memories for a character
   */
  async clearCharacterMemories(characterId: string): Promise<void> {
    try {
      const collectionName = this.getCharacterCollectionName(characterId);

      // Delete the entire collection
      await this.client.deleteCollection(collectionName);

      // Reset memory count
      await this.pool.query(
        'UPDATE character_memory_collections SET memory_count = 0, last_updated = NOW() WHERE character_id = $1',
        [characterId]
      );

      console.log(`🗑️ Cleared all memories for character: ${characterId}`);

    } catch (error) {
      console.error(`❌ Failed to clear character memories for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Get character memory statistics
   */
  async getCharacterMemoryStats(characterId: string): Promise<{
    totalMemories: number;
    memoriesByType: Record<string, number>;
    oldestMemory?: Date;
    newestMemory?: Date;
    collectionName: string;
  }> {
    try {
      const collectionName = this.getCharacterCollectionName(characterId);

      // Get collection info from Qdrant
      const collectionInfo = await this.client.getCollection(collectionName);
      const totalMemories = collectionInfo.points_count || 0;

      // Get memories by type and date range
      const scrollResult = await this.client.scroll(collectionName, {
        filter: {
          must: [{ key: 'characterId', match: { value: characterId } }]
        },
        limit: 1000, // Adjust based on expected memory count
        with_payload: true
      });

      const memoriesByType: Record<string, number> = {};
      const timestamps: Date[] = [];

      scrollResult.points.forEach(point => {
        const contentType = point.payload?.contentType as string;
        memoriesByType[contentType] = (memoriesByType[contentType] || 0) + 1;

        const timestamp = new Date(point.payload?.timestamp as string);
        timestamps.push(timestamp);
      });

      timestamps.sort((a, b) => a.getTime() - b.getTime());

      return {
        totalMemories,
        memoriesByType,
        oldestMemory: timestamps.length > 0 ? timestamps[0] : undefined,
        newestMemory: timestamps.length > 0 ? timestamps[timestamps.length - 1] : undefined,
        collectionName
      };

    } catch (error) {
      console.error(`❌ Failed to get character memory stats for ${characterId}:`, error);
      throw error;
    }
  }

  /**
   * Update memory count in database metadata
   */
  private async updateMemoryCount(characterId: string, delta: number): Promise<void> {
    const query = `
      UPDATE character_memory_collections 
      SET memory_count = memory_count + $1, last_updated = NOW() 
      WHERE character_id = $2
    `;

    try {
      await this.pool.query(query, [delta, characterId]);
    } catch (error) {
      console.error('❌ Failed to update memory count:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Get all character collections
   */
  async getAllCharacterCollections(): Promise<CharacterMemoryCollection[]> {
    const query = `
      SELECT * FROM character_memory_collections 
      ORDER BY last_updated DESC
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => ({
        id: row.id,
        characterId: row.character_id,
        collectionName: row.collection_name,
        campaignId: row.campaign_id,
        memoryCount: row.memory_count,
        lastUpdated: row.last_updated,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('❌ Failed to get character collections:', error);
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
      const characterCollections = collections.collections.filter(c => 
        c.name.startsWith('character_memory_')
      );

      return {
        qdrantConnected: true,
        collectionsCount: characterCollections.length,
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
export const characterVectorMemory = new CharacterVectorMemory();
