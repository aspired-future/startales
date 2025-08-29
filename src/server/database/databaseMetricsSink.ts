/**
 * Database Metrics Sink Implementation
 * Persists adapter metrics to PostgreSQL database
 */

import { AdapterMetricsSink, MetricsContext, AdapterMetrics } from '../../shared/adapters/metrics';
import { AdapterError } from '../../shared/adapters/base';
import { LLMMetricsDAO, getLLMMetricsDAO } from './llmMetrics';

export interface DatabaseMetricsSinkOptions {
  llmMetricsDAO?: LLMMetricsDAO;
  enableErrorLogging?: boolean;
  enableDebugLogging?: boolean;
  batchSize?: number;
  flushIntervalMs?: number;
}

/**
 * Database Metrics Sink - persists metrics to PostgreSQL
 */
export class DatabaseMetricsSink implements AdapterMetricsSink {
  private llmDAO: LLMMetricsDAO;
  private enableErrorLogging: boolean;
  private enableDebugLogging: boolean;
  private pendingMetrics: Array<{ context: MetricsContext; metrics: AdapterMetrics }> = [];
  private batchSize: number;
  private flushIntervalMs: number;
  private flushTimer?: NodeJS.Timeout;

  constructor(options: DatabaseMetricsSinkOptions = {}) {
    this.llmDAO = options.llmMetricsDAO || getLLMMetricsDAO();
    this.enableErrorLogging = options.enableErrorLogging ?? true;
    this.enableDebugLogging = options.enableDebugLogging ?? false;
    this.batchSize = options.batchSize || 10;
    this.flushIntervalMs = options.flushIntervalMs || 5000; // 5 seconds

    // Start periodic flush
    this.startPeriodicFlush();
  }

  async onRequestStart(context: MetricsContext): Promise<void> {
    if (this.enableDebugLogging) {
      console.log(`📊 [DB] Starting metrics collection for ${context.providerId}:${context.operation}`, {
        requestId: context.requestId,
        adapterType: context.adapterType
      });
    }
  }

  async onRequestEnd(context: MetricsContext, metrics: AdapterMetrics): Promise<void> {
    try {
      // Only persist LLM metrics for now (as per task requirements)
      if (context.adapterType === 'llm') {
        await this.persistLLMMetrics(context, metrics);
      }

      if (this.enableDebugLogging) {
        console.log(`📊 [DB] Persisted metrics for ${context.providerId}:${context.operation}`, {
          requestId: context.requestId,
          latencyMs: metrics.latencyMs,
          tokens: metrics.totalTokens,
          cost: metrics.cost?.total
        });
      }
    } catch (error) {
      if (this.enableErrorLogging) {
        console.error(`❌ [DB] Failed to persist metrics for ${context.requestId}:`, error);
      }
      // Don't throw - metrics persistence shouldn't break the main flow
    }
  }

  async onRequestError(context: MetricsContext, error: AdapterError): Promise<void> {
    if (this.enableErrorLogging) {
      console.error(`📊 [DB] Request failed for ${context.providerId}:${context.operation}`, {
        requestId: context.requestId,
        error: error.code,
        message: error.message
      });
    }

    // Could potentially log error metrics to a separate table
    // For now, just log to console
  }

  async onStreamChunk(context: MetricsContext, chunkMetrics: Partial<AdapterMetrics>): Promise<void> {
    // For streaming, we'll accumulate metrics and persist at the end
    if (this.enableDebugLogging) {
      console.log(`📊 [DB] Stream chunk for ${context.requestId}`, {
        tokens: chunkMetrics.outputTokens
      });
    }
  }

  async onStreamEnd(context: MetricsContext, finalMetrics: AdapterMetrics): Promise<void> {
    // Persist final streaming metrics
    await this.onRequestEnd(context, finalMetrics);
  }

  /**
   * Persist LLM metrics to database
   */
  private async persistLLMMetrics(context: MetricsContext, metrics: AdapterMetrics): Promise<void> {
    try {
      const id = await this.llmDAO.logLLMCallMetrics(context, metrics);
      
      if (this.enableDebugLogging) {
        console.log(`📊 [DB] LLM metrics persisted with ID: ${id}`);
      }
    } catch (error) {
      console.error('❌ [DB] Failed to persist LLM metrics:', error);
      throw error;
    }
  }

  /**
   * Add metrics to batch for later persistence
   */
  private addToBatch(context: MetricsContext, metrics: AdapterMetrics): void {
    this.pendingMetrics.push({ context, metrics });

    if (this.pendingMetrics.length >= this.batchSize) {
      this.flushBatch();
    }
  }

  /**
   * Flush pending metrics batch
   */
  private async flushBatch(): Promise<void> {
    if (this.pendingMetrics.length === 0) return;

    const batch = this.pendingMetrics.splice(0);
    
    try {
      for (const { context, metrics } of batch) {
        if (context.adapterType === 'llm') {
          await this.persistLLMMetrics(context, metrics);
        }
      }

      if (this.enableDebugLogging) {
        console.log(`📊 [DB] Flushed batch of ${batch.length} metrics`);
      }
    } catch (error) {
      if (this.enableErrorLogging) {
        console.error('❌ [DB] Failed to flush metrics batch:', error);
      }
    }
  }

  /**
   * Start periodic flush timer
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushBatch();
    }, this.flushIntervalMs);
  }

  /**
   * Stop periodic flush and flush remaining metrics
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Flush any remaining metrics
    await this.flushBatch();
  }
}

/**
 * Create a database metrics sink with default configuration
 */
export function createDatabaseMetricsSink(options: DatabaseMetricsSinkOptions = {}): DatabaseMetricsSink {
  return new DatabaseMetricsSink(options);
}

/**
 * Default database metrics sink instance
 */
export const defaultDatabaseMetricsSink = createDatabaseMetricsSink({
  enableErrorLogging: true,
  enableDebugLogging: process.env.NODE_ENV === 'development'
});
