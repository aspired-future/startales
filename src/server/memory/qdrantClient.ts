import { QdrantClient } from '@qdrant/js-client-rest';

export interface ConversationVector {
  id: string;
  vector: number[];
  payload: {
    campaignId: number;
    timestamp: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    entities?: string[];
    gameState?: any;
    actionType?: string;
  };
}

export interface SearchResult {
  id: string;
  score: number;
  payload: ConversationVector['payload'];
}

export interface SearchOptions {
  campaignId?: number;
  limit?: number;
  minScore?: number;
  entities?: string[];
  timeframe?: {
    start: string;
    end: string;
  };
}

/**
 * Qdrant vector database client for conversation memory storage
 */
export class QdrantVectorClient {
  private client: QdrantClient;
  private collectionName = 'conversations';

  constructor() {
    const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
    this.client = new QdrantClient({ 
      url: qdrantUrl,
      timeout: 30000 // 30 second timeout
    });
  }

  /**
   * Test connection to Qdrant service
   */
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.client.api('cluster').clusterStatus();
      console.log('✅ Qdrant connection successful:', health);
      return true;
    } catch (error) {
      console.error('❌ Qdrant connection failed:', error);
      return false;
    }
  }

  /**
   * Ensure the conversations collection exists with proper configuration
   */
  async initializeCollection(): Promise<void> {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections();
      const exists = collections.collections?.some(c => c.name === this.collectionName);
      
      if (!exists) {
        console.log('🔄 Creating conversations collection...');
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 768,
            distance: 'Cosine'
          }
        });
        console.log('✅ Conversations collection created');
      } else {
        console.log('✅ Conversations collection already exists');
      }
    } catch (error) {
      console.error('❌ Failed to initialize collection:', error);
      throw error;
    }
  }

  /**
   * Store a conversation vector in Qdrant
   */
  async storeConversation(conversation: ConversationVector): Promise<void> {
    try {
      await this.client.upsert(this.collectionName, {
        wait: true,
        points: [{
          id: conversation.id,
          vector: conversation.vector,
          payload: conversation.payload
        }]
      });
      
      console.log(`✅ Stored conversation vector: ${conversation.id}`);
    } catch (error) {
      console.error('❌ Failed to store conversation:', error);
      throw error;
    }
  }

  /**
   * Store multiple conversations in batch
   */
  async storeConversations(conversations: ConversationVector[]): Promise<void> {
    try {
      const points = conversations.map(conv => ({
        id: conv.id,
        vector: conv.vector,
        payload: conv.payload
      }));

      await this.client.upsert(this.collectionName, {
        wait: true,
        points
      });
      
      console.log(`✅ Stored ${conversations.length} conversation vectors`);
    } catch (error) {
      console.error('❌ Failed to store conversations batch:', error);
      throw error;
    }
  }

  /**
   * Search for similar conversations
   */
  async searchSimilar(
    queryVector: number[], 
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const {
        campaignId,
        limit = 10,
        minScore = 0.7,
        entities,
        timeframe
      } = options;

      // Build filter conditions
      const filter: any = {};
      
      if (campaignId) {
        filter.must = filter.must || [];
        filter.must.push({
          key: 'campaignId',
          match: { value: campaignId }
        });
      }

      if (entities && entities.length > 0) {
        filter.must = filter.must || [];
        filter.must.push({
          key: 'entities',
          match: { any: entities }
        });
      }

      if (timeframe) {
        filter.must = filter.must || [];
        filter.must.push({
          key: 'timestamp',
          range: {
            gte: timeframe.start,
            lte: timeframe.end
          }
        });
      }

      const searchResult = await this.client.search(this.collectionName, {
        vector: queryVector,
        limit,
        score_threshold: minScore,
        filter: Object.keys(filter).length > 0 ? filter : undefined
      });

      const results: SearchResult[] = searchResult.map(result => ({
        id: result.id as string,
        score: result.score || 0,
        payload: result.payload as ConversationVector['payload']
      }));

      console.log(`🔍 Found ${results.length} similar conversations`);
      return results;
    } catch (error) {
      console.error('❌ Failed to search conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversation(id: string): Promise<ConversationVector | null> {
    try {
      const results = await this.client.retrieve(this.collectionName, {
        ids: [id],
        with_payload: true,
        with_vector: true
      });

      if (results.length === 0) {
        return null;
      }

      const point = results[0];
      return {
        id: point.id as string,
        vector: point.vector as number[],
        payload: point.payload as ConversationVector['payload']
      };
    } catch (error) {
      console.error('❌ Failed to get conversation:', error);
      return null;
    }
  }

  /**
   * Delete conversation by ID
   */
  async deleteConversation(id: string): Promise<void> {
    try {
      await this.client.delete(this.collectionName, {
        wait: true,
        points: [id]
      });
      console.log(`🗑️ Deleted conversation: ${id}`);
    } catch (error) {
      console.error('❌ Failed to delete conversation:', error);
      throw error;
    }
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<any> {
    try {
      const info = await this.client.getCollection(this.collectionName);
      return {
        status: info.status,
        pointsCount: info.points_count,
        segmentsCount: info.segments_count,
        indexedVectors: info.indexed_vectors_count
      };
    } catch (error) {
      console.error('❌ Failed to get collection stats:', error);
      throw error;
    }
  }

  /**
   * Health check for monitoring
   */
  async healthCheck(): Promise<{
    qdrant: boolean;
    collection: boolean;
    stats?: any;
  }> {
    try {
      const qdrantHealth = await this.testConnection();
      let collectionHealth = false;
      let stats = null;

      if (qdrantHealth) {
        try {
          stats = await this.getStats();
          collectionHealth = stats.status === 'green';
        } catch {
          collectionHealth = false;
        }
      }

      return {
        qdrant: qdrantHealth,
        collection: collectionHealth,
        stats
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        qdrant: false,
        collection: false
      };
    }
  }
}

// Export singleton instance
export const qdrantClient = new QdrantVectorClient();
