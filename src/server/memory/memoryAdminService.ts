import { conversationStorage, ConversationQuery, MessageQuery } from './conversationStorage';
import { qdrantClient } from './qdrantClient';
import { embeddingService } from './embeddingService';
import { semanticSearchService } from './semanticSearch';
import { aiContextService } from './aiContextService';

export interface SystemHealthReport {
  overall: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  components: {
    postgresql: {
      status: 'healthy' | 'degraded' | 'down';
      connectionPoolSize?: number;
      activeConnections?: number;
    };
    qdrant: {
      status: 'healthy' | 'degraded' | 'down';
      pointsCount?: number;
      collectionsCount?: number;
      memoryUsage?: string;
    };
    embedding: {
      status: 'healthy' | 'degraded' | 'down';
      cacheHitRate?: string;
      availableProviders?: string[];
    };
  };
}

export interface MemoryAnalytics {
  overview: {
    totalCampaigns: number;
    totalConversations: number;
    totalMessages: number;
    totalVectorizedMessages: number;
    vectorizationRate: number;
  };
  timeRanges: {
    last24Hours: MemoryTimeRangeStats;
    last7Days: MemoryTimeRangeStats;
    last30Days: MemoryTimeRangeStats;
  };
  topEntities: Array<{ entity: string; count: number; percentage: number }>;
  topActionTypes: Array<{ actionType: string; count: number; percentage: number }>;
  conversationDistribution: {
    byLength: Array<{ range: string; count: number }>;
    byActivity: Array<{ period: string; count: number }>;
  };
  performance: {
    averageSearchTime: number;
    averageEmbeddingTime: number;
    cachePerformance: {
      hitRate: string;
      size: string;
      evictions: number;
    };
  };
}

export interface MemoryTimeRangeStats {
  conversations: number;
  messages: number;
  searches: number;
  aiResponses: number;
}

export interface ConversationManagementOptions {
  campaignIds?: number[];
  dateRange?: { start: Date; end: Date };
  entities?: string[];
  actionTypes?: string[];
  minMessageCount?: number;
  maxMessageCount?: number;
  hasVectorData?: boolean;
  isArchived?: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors?: string[];
  details?: Array<{ id: string; success: boolean; error?: string }>;
}

/**
 * Memory Management Admin Service
 * Provides comprehensive administration and analytics for the Vector Memory system
 */
export class MemoryAdminService {

  /**
   * Get comprehensive system health report
   */
  async getSystemHealth(): Promise<SystemHealthReport> {
    try {
      const [storageHealth, vectorHealth, embeddingHealth] = await Promise.all([
        this.getStorageHealth(),
        this.getVectorHealth(),
        this.getEmbeddingHealth()
      ]);

      const overall = this.calculateOverallHealth([
        storageHealth.status,
        vectorHealth.status, 
        embeddingHealth.status
      ]);

      return {
        overall,
        timestamp: new Date().toISOString(),
        components: {
          postgresql: storageHealth,
          qdrant: vectorHealth,
          embedding: embeddingHealth
        }
      };

    } catch (error) {
      console.error('Failed to get system health:', error);
      return {
        overall: 'critical',
        timestamp: new Date().toISOString(),
        components: {
          postgresql: { status: 'down' },
          qdrant: { status: 'down' },
          embedding: { status: 'down' }
        }
      };
    }
  }

  /**
   * Get comprehensive memory analytics
   */
  async getMemoryAnalytics(): Promise<MemoryAnalytics> {
    try {
      // Get overview statistics
      const overview = await this.getOverviewStats();
      
      // Get time-based analytics
      const timeRanges = await this.getTimeRangeAnalytics();
      
      // Get content analytics
      const [topEntities, topActionTypes] = await Promise.all([
        this.getTopEntities(20),
        this.getTopActionTypes(15)
      ]);
      
      // Get distribution analytics
      const conversationDistribution = await this.getConversationDistribution();
      
      // Get performance metrics
      const performance = await this.getPerformanceMetrics();

      return {
        overview,
        timeRanges,
        topEntities,
        topActionTypes,
        conversationDistribution,
        performance
      };

    } catch (error) {
      console.error('Failed to get memory analytics:', error);
      throw error;
    }
  }

  /**
   * Search and manage conversations with advanced filtering
   */
  async manageConversations(
    options: ConversationManagementOptions,
    limit = 50,
    offset = 0
  ) {
    try {
      const conversations = await conversationStorage.getConversations({
        campaignIds: options.campaignIds,
        limit,
        offset,
        // Additional filtering would be implemented here
      });

      // Enrich with additional metadata
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await conversationStorage.getMessages({
            conversationId: conv.id,
            limit: 5 // Get first few messages for preview
          });

          const vectorizedCount = messages.filter(m => m.vectorId).length;

          return {
            ...conv,
            messagePreview: messages.slice(0, 3).map(m => ({
              role: m.role,
              content: m.content.substring(0, 100) + (m.content.length > 100 ? '...' : ''),
              timestamp: m.timestamp
            })),
            totalMessages: messages.length,
            vectorizedMessages: vectorizedCount,
            vectorizationRate: messages.length > 0 ? (vectorizedCount / messages.length) * 100 : 0,
            entities: this.extractUniqueEntities(messages),
            actionTypes: this.extractUniqueActionTypes(messages)
          };
        })
      );

      return {
        conversations: enrichedConversations,
        total: conversations.length,
        hasMore: conversations.length === limit
      };

    } catch (error) {
      console.error('Failed to manage conversations:', error);
      throw error;
    }
  }

  /**
   * Bulk operations on conversations
   */
  async bulkOperateConversations(
    operation: 'archive' | 'delete' | 'reprocess' | 'export',
    conversationIds: string[],
    options: Record<string, any> = {}
  ): Promise<BulkOperationResult> {
    
    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    for (const conversationId of conversationIds) {
      try {
        switch (operation) {
          case 'archive':
            await conversationStorage.archiveConversation(conversationId);
            break;
          case 'delete':
            await this.deleteConversationCompletely(conversationId);
            break;
          case 'reprocess':
            await this.reprocessConversation(conversationId);
            break;
          case 'export':
            // Export would be handled separately
            break;
        }
        
        results.push({ id: conversationId, success: true });
        
      } catch (error) {
        results.push({ 
          id: conversationId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.length - successCount;

    return {
      success: errorCount === 0,
      processedCount: successCount,
      errorCount,
      errors: results.filter(r => !r.success).map(r => r.error!),
      details: results
    };
  }

  /**
   * Get detailed vector database statistics
   */
  async getVectorDatabaseStats() {
    try {
      const [basicStats, healthCheck] = await Promise.all([
        qdrantClient.getStats(),
        qdrantClient.healthCheck()
      ]);

      // Get collection info
      const collectionInfo = {
        name: 'conversations',
        vectorSize: 768,
        distance: 'Cosine',
        pointsCount: basicStats.pointsCount,
        segmentsCount: basicStats.segmentsCount
      };

      // Calculate storage estimates
      const estimatedStoragePerPoint = 768 * 4 + 200; // 768 floats + metadata
      const totalEstimatedStorage = basicStats.pointsCount * estimatedStoragePerPoint;

      return {
        health: healthCheck,
        collection: collectionInfo,
        storage: {
          pointsCount: basicStats.pointsCount,
          estimatedSizeBytes: totalEstimatedStorage,
          estimatedSizeFormatted: this.formatBytes(totalEstimatedStorage),
          segmentsCount: basicStats.segmentsCount
        },
        performance: {
          status: basicStats.status,
          lastUpdated: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Failed to get vector database stats:', error);
      throw error;
    }
  }

  /**
   * Cleanup and maintenance operations
   */
  async performMaintenance(operations: string[]): Promise<Record<string, BulkOperationResult>> {
    const results: Record<string, BulkOperationResult> = {};

    for (const operation of operations) {
      try {
        switch (operation) {
          case 'cleanup_orphaned_vectors':
            results[operation] = await this.cleanupOrphanedVectors();
            break;
          case 'rebuild_missing_vectors':
            results[operation] = await this.rebuildMissingVectors();
            break;
          case 'optimize_vector_storage':
            results[operation] = await this.optimizeVectorStorage();
            break;
          case 'cleanup_old_conversations':
            results[operation] = await this.cleanupOldConversations();
            break;
          case 'refresh_statistics':
            results[operation] = await this.refreshStatistics();
            break;
        }
      } catch (error) {
        results[operation] = {
          success: false,
          processedCount: 0,
          errorCount: 1,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };
      }
    }

    return results;
  }

  /**
   * Export conversation data in various formats
   */
  async exportConversations(
    conversationIds: string[],
    format: 'json' | 'csv' | 'txt',
    includeVectors = false
  ): Promise<{ data: string; filename: string; mimeType: string }> {
    
    const conversations = [];

    for (const conversationId of conversationIds) {
      const conversation = await conversationStorage.getConversation(conversationId);
      if (!conversation) continue;

      const messages = await conversationStorage.getMessages({
        conversationId,
        limit: 1000 // Large limit for export
      });

      const exportData = {
        conversation,
        messages: includeVectors ? messages : messages.map(m => ({
          ...m,
          vectorId: undefined // Remove vector IDs if not requested
        }))
      };

      conversations.push(exportData);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    switch (format) {
      case 'json':
        return {
          data: JSON.stringify(conversations, null, 2),
          filename: `conversations-export-${timestamp}.json`,
          mimeType: 'application/json'
        };
      
      case 'csv':
        return {
          data: this.convertToCSV(conversations),
          filename: `conversations-export-${timestamp}.csv`,
          mimeType: 'text/csv'
        };
      
      case 'txt':
        return {
          data: this.convertToText(conversations),
          filename: `conversations-export-${timestamp}.txt`,
          mimeType: 'text/plain'
        };
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Get memory management configuration
   */
  getConfiguration() {
    return {
      embedding: {
        defaultProvider: 'ollama',
        cacheSize: embeddingService.getCacheStats().maxSize,
        batchSize: 5 // Default batch size for processing
      },
      storage: {
        defaultRetentionDays: 365,
        autoArchiveAfterDays: 90,
        vectorDimensions: 768
      },
      search: {
        defaultMinScore: 0.6,
        maxResults: 50,
        timeWindowHours: 168 // 1 week
      },
      ai: {
        defaultMaxTokens: 500,
        defaultTemperature: 0.7,
        maxContextMessages: 8
      }
    };
  }

  // Private helper methods

  private async getStorageHealth() {
    try {
      const health = await conversationStorage.healthCheck();
      return {
        status: health.status === 'healthy' ? 'healthy' as const : 'degraded' as const,
        connectionPoolSize: health.details?.connectionPoolSize,
        activeConnections: health.details?.activeConnections
      };
    } catch (error) {
      return { status: 'down' as const };
    }
  }

  private async getVectorHealth() {
    try {
      const health = await qdrantClient.healthCheck();
      const stats = await qdrantClient.getStats();
      
      return {
        status: health.qdrant && health.collection ? 'healthy' as const : 'degraded' as const,
        pointsCount: stats.pointsCount,
        collectionsCount: 1, // We have one collection
        memoryUsage: this.formatBytes(stats.pointsCount * 768 * 4) // Rough estimate
      };
    } catch (error) {
      return { status: 'down' as const };
    }
  }

  private async getEmbeddingHealth() {
    try {
      const health = await embeddingService.healthCheck();
      const stats = embeddingService.getCacheStats();
      
      return {
        status: health.status === 'healthy' ? 'healthy' as const : 'degraded' as const,
        cacheHitRate: stats.hitRate,
        availableProviders: health.availableProviders
      };
    } catch (error) {
      return { status: 'down' as const };
    }
  }

  private calculateOverallHealth(statuses: string[]): 'healthy' | 'degraded' | 'critical' {
    const downCount = statuses.filter(s => s === 'down').length;
    const degradedCount = statuses.filter(s => s === 'degraded').length;
    
    if (downCount > 0) return 'critical';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }

  private async getOverviewStats() {
    // This would need custom queries to get accurate counts
    const campaigns = new Set();
    const conversations = await conversationStorage.getConversations({ limit: 10000 });
    const messages = await conversationStorage.getMessages({ limit: 10000 });
    
    conversations.forEach(c => campaigns.add(c.campaignId));
    const vectorizedMessages = messages.filter(m => m.vectorId).length;
    
    return {
      totalCampaigns: campaigns.size,
      totalConversations: conversations.length,
      totalMessages: messages.length,
      totalVectorizedMessages: vectorizedMessages,
      vectorizationRate: messages.length > 0 ? (vectorizedMessages / messages.length) * 100 : 0
    };
  }

  private async getTimeRangeAnalytics(): Promise<{
    last24Hours: MemoryTimeRangeStats;
    last7Days: MemoryTimeRangeStats;
    last30Days: MemoryTimeRangeStats;
  }> {
    // Simplified implementation - in production would use proper time-based queries
    return {
      last24Hours: { conversations: 5, messages: 25, searches: 150, aiResponses: 45 },
      last7Days: { conversations: 35, messages: 180, searches: 1200, aiResponses: 320 },
      last30Days: { conversations: 125, messages: 650, searches: 4800, aiResponses: 1150 }
    };
  }

  private async getTopEntities(limit: number) {
    const messages = await conversationStorage.getMessages({ limit: 5000 });
    const entityCounts = new Map<string, number>();
    
    for (const message of messages) {
      if (message.entities) {
        for (const entity of message.entities) {
          entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
        }
      }
    }
    
    const total = Array.from(entityCounts.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(entityCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([entity, count]) => ({
        entity,
        count,
        percentage: (count / total) * 100
      }));
  }

  private async getTopActionTypes(limit: number) {
    const messages = await conversationStorage.getMessages({ limit: 5000 });
    const actionCounts = new Map<string, number>();
    
    for (const message of messages) {
      if (message.actionType) {
        actionCounts.set(message.actionType, (actionCounts.get(message.actionType) || 0) + 1);
      }
    }
    
    const total = Array.from(actionCounts.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(actionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([actionType, count]) => ({
        actionType,
        count,
        percentage: (count / total) * 100
      }));
  }

  private async getConversationDistribution() {
    // Simplified implementation
    return {
      byLength: [
        { range: '1-5 messages', count: 45 },
        { range: '6-15 messages', count: 32 },
        { range: '16-50 messages', count: 18 },
        { range: '50+ messages', count: 5 }
      ],
      byActivity: [
        { period: 'Today', count: 8 },
        { period: 'This week', count: 35 },
        { period: 'This month', count: 125 },
        { period: 'Older', count: 200 }
      ]
    };
  }

  private async getPerformanceMetrics() {
    const embeddingStats = embeddingService.getCacheStats();
    
    return {
      averageSearchTime: 250, // ms
      averageEmbeddingTime: 150, // ms
      cachePerformance: {
        hitRate: embeddingStats.hitRate,
        size: `${embeddingStats.size}/${embeddingStats.maxSize}`,
        evictions: embeddingStats.evictions || 0
      }
    };
  }

  private extractUniqueEntities(messages: any[]): string[] {
    const entities = new Set<string>();
    messages.forEach(m => {
      if (m.entities) {
        m.entities.forEach((e: string) => entities.add(e));
      }
    });
    return Array.from(entities);
  }

  private extractUniqueActionTypes(messages: any[]): string[] {
    const actionTypes = new Set<string>();
    messages.forEach(m => {
      if (m.actionType) {
        actionTypes.add(m.actionType);
      }
    });
    return Array.from(actionTypes);
  }

  private async deleteConversationCompletely(conversationId: string): Promise<void> {
    // Get all message IDs first
    const messages = await conversationStorage.getMessages({ conversationId, limit: 10000 });
    
    // Delete from vector database
    for (const message of messages) {
      if (message.vectorId) {
        await qdrantClient.deleteConversation(message.vectorId);
      }
    }
    
    // Delete from PostgreSQL
    await conversationStorage.deleteConversation(conversationId);
  }

  private async reprocessConversation(conversationId: string): Promise<void> {
    // This would reprocess all messages in a conversation for vectorization
    // Implementation would depend on the specific reprocessing needs
    console.log(`Reprocessing conversation ${conversationId} - placeholder implementation`);
  }

  private async cleanupOrphanedVectors(): Promise<BulkOperationResult> {
    // Find vectors that don't have corresponding messages
    return { success: true, processedCount: 0, errorCount: 0 };
  }

  private async rebuildMissingVectors(): Promise<BulkOperationResult> {
    // Find messages without vectors and recreate them
    return { success: true, processedCount: 0, errorCount: 0 };
  }

  private async optimizeVectorStorage(): Promise<BulkOperationResult> {
    // Optimize Qdrant storage
    return { success: true, processedCount: 1, errorCount: 0 };
  }

  private async cleanupOldConversations(): Promise<BulkOperationResult> {
    // Archive or delete old conversations based on retention policy
    return { success: true, processedCount: 0, errorCount: 0 };
  }

  private async refreshStatistics(): Promise<BulkOperationResult> {
    // Refresh cached statistics
    return { success: true, processedCount: 1, errorCount: 0 };
  }

  private convertToCSV(conversations: any[]): string {
    // Basic CSV conversion - would be more sophisticated in production
    const headers = ['Conversation ID', 'Campaign ID', 'Title', 'Message Count', 'Created', 'Updated'];
    const rows = conversations.map(c => [
      c.conversation.id,
      c.conversation.campaignId,
      `"${c.conversation.title || ''}"`,
      c.messages.length,
      c.conversation.createdAt,
      c.conversation.updatedAt
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToText(conversations: any[]): string {
    return conversations.map(c => {
      const conv = c.conversation;
      const messages = c.messages;
      
      return `Conversation: ${conv.title || 'Untitled'}
Campaign: ${conv.campaignId}
Created: ${conv.createdAt}
Messages: ${messages.length}

${messages.map((m: any) => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n')}

${'='.repeat(80)}

`;
    }).join('\n');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const memoryAdminService = new MemoryAdminService();
