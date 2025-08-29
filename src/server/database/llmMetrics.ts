/**
 * LLM Messages Metrics Database Schema and DAO
 * Handles persistence of LLM call metrics for analytics and monitoring
 */

import { Pool } from 'pg';
import { getPool } from '../storage/db';
import { AdapterMetrics, MetricsContext } from '../../shared/adapters/metrics';

// LLM Message Metrics Interface
export interface LLMMessageMetrics {
  id?: string;
  requestId: string;
  providerId: string;
  model?: string;
  operation: string;
  
  // Timing metrics
  latencyMs: number;
  createdAt: Date;
  
  // Token metrics
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  
  // Payload metrics
  bytesIn?: number;
  bytesOut?: number;
  
  // Cost metrics
  inputCost?: number;
  outputCost?: number;
  totalCost?: number;
  
  // Context information
  userId?: string;
  sessionId?: string;
  campaignId?: number;
  
  // A/B testing and grouping
  mode?: 'single' | 'streaming' | 'batch';
  pairedGroupId?: string;
  
  // Additional metadata
  metadata?: Record<string, any>;
}

// Database migration function
export async function migrateLLMMessagesTable(): Promise<void> {
  const pool = getPool();
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS llm_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        request_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        model TEXT,
        operation TEXT NOT NULL,
        
        -- Timing metrics
        latency_ms INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        
        -- Token metrics
        input_tokens INTEGER,
        output_tokens INTEGER,
        total_tokens INTEGER,
        
        -- Payload metrics
        bytes_in INTEGER,
        bytes_out INTEGER,
        
        -- Cost metrics (stored as decimal for precision)
        input_cost DECIMAL(10,6),
        output_cost DECIMAL(10,6),
        total_cost DECIMAL(10,6),
        
        -- Context information
        user_id TEXT,
        session_id TEXT,
        campaign_id INTEGER,
        
        -- A/B testing and grouping
        mode TEXT CHECK (mode IN ('single', 'streaming', 'batch')),
        paired_group_id TEXT,
        
        -- Additional metadata
        metadata JSONB DEFAULT '{}'::jsonb,
        
        -- Constraints
        CONSTRAINT positive_latency CHECK (latency_ms >= 0),
        CONSTRAINT positive_tokens CHECK (
          (input_tokens IS NULL OR input_tokens >= 0) AND
          (output_tokens IS NULL OR output_tokens >= 0) AND
          (total_tokens IS NULL OR total_tokens >= 0)
        ),
        CONSTRAINT positive_bytes CHECK (
          (bytes_in IS NULL OR bytes_in >= 0) AND
          (bytes_out IS NULL OR bytes_out >= 0)
        ),
        CONSTRAINT positive_costs CHECK (
          (input_cost IS NULL OR input_cost >= 0) AND
          (output_cost IS NULL OR output_cost >= 0) AND
          (total_cost IS NULL OR total_cost >= 0)
        )
      );
    `);

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_provider_model 
      ON llm_messages(provider_id, model, created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_campaign_session 
      ON llm_messages(campaign_id, session_id, created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_user_created 
      ON llm_messages(user_id, created_at DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_paired_group 
      ON llm_messages(paired_group_id) WHERE paired_group_id IS NOT NULL;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_request_id 
      ON llm_messages(request_id);
    `);

    // Create partial indexes for analytics queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_cost_analytics 
      ON llm_messages(provider_id, model, created_at DESC) 
      WHERE total_cost IS NOT NULL;
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_llm_messages_token_analytics 
      ON llm_messages(provider_id, model, created_at DESC) 
      WHERE total_tokens IS NOT NULL;
    `);

    console.log('✅ LLM messages metrics table created successfully');
  } catch (error) {
    console.error('❌ Failed to create LLM messages metrics table:', error);
    throw error;
  }
}

// DAO class for LLM metrics operations
export class LLMMetricsDAO {
  private pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || getPool();
  }

  /**
   * Log LLM call metrics to database
   */
  async logLLMCallMetrics(
    context: MetricsContext,
    metrics: AdapterMetrics
  ): Promise<string> {
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        INSERT INTO llm_messages (
          request_id, provider_id, model, operation,
          latency_ms, input_tokens, output_tokens, total_tokens,
          bytes_in, bytes_out, input_cost, output_cost, total_cost,
          user_id, session_id, campaign_id, mode, paired_group_id, metadata
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) RETURNING id
      `, [
        context.requestId,
        context.providerId,
        metrics.model || context.model,
        context.operation,
        metrics.latencyMs,
        metrics.inputTokens,
        metrics.outputTokens,
        metrics.totalTokens,
        metrics.bytesIn,
        metrics.bytesOut,
        metrics.cost?.input,
        metrics.cost?.output,
        metrics.cost?.total,
        context.userId,
        context.sessionId,
        context.campaignId,
        context.metadata?.mode,
        context.metadata?.pairedGroupId,
        JSON.stringify(metrics.metadata || {})
      ]);

      return result.rows[0].id;
    } finally {
      client.release();
    }
  }

  /**
   * Get LLM metrics by request ID
   */
  async getMetricsByRequestId(requestId: string): Promise<LLMMessageMetrics | null> {
    const result = await this.pool.query(`
      SELECT 
        id, request_id, provider_id, model, operation,
        latency_ms, created_at, input_tokens, output_tokens, total_tokens,
        bytes_in, bytes_out, input_cost, output_cost, total_cost,
        user_id, session_id, campaign_id, mode, paired_group_id, metadata
      FROM llm_messages 
      WHERE request_id = $1
    `, [requestId]);

    if (result.rows.length === 0) return null;

    return this.mapRowToMetrics(result.rows[0]);
  }

  /**
   * Get LLM metrics for a campaign
   */
  async getMetricsByCampaign(
    campaignId: number,
    options: {
      limit?: number;
      offset?: number;
      providerId?: string;
      model?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<LLMMessageMetrics[]> {
    const conditions = ['campaign_id = $1'];
    const params: any[] = [campaignId];
    let paramIndex = 2;

    if (options.providerId) {
      conditions.push(`provider_id = $${paramIndex++}`);
      params.push(options.providerId);
    }

    if (options.model) {
      conditions.push(`model = $${paramIndex++}`);
      params.push(options.model);
    }

    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(options.startDate);
    }

    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(options.endDate);
    }

    const limit = options.limit || 100;
    const offset = options.offset || 0;

    const result = await this.pool.query(`
      SELECT 
        id, request_id, provider_id, model, operation,
        latency_ms, created_at, input_tokens, output_tokens, total_tokens,
        bytes_in, bytes_out, input_cost, output_cost, total_cost,
        user_id, session_id, campaign_id, mode, paired_group_id, metadata
      FROM llm_messages 
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `, [...params, limit, offset]);

    return result.rows.map(row => this.mapRowToMetrics(row));
  }

  /**
   * Get aggregated metrics for analytics
   */
  async getAggregatedMetrics(options: {
    campaignId?: number;
    providerId?: string;
    model?: string;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'provider' | 'model' | 'day' | 'hour';
  } = {}): Promise<Array<{
    group: string;
    totalCalls: number;
    avgLatencyMs: number;
    totalTokens: number;
    totalCost: number;
    avgInputTokens: number;
    avgOutputTokens: number;
  }>> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.campaignId) {
      conditions.push(`campaign_id = $${paramIndex++}`);
      params.push(options.campaignId);
    }

    if (options.providerId) {
      conditions.push(`provider_id = $${paramIndex++}`);
      params.push(options.providerId);
    }

    if (options.model) {
      conditions.push(`model = $${paramIndex++}`);
      params.push(options.model);
    }

    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(options.startDate);
    }

    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(options.endDate);
    }

    let groupByClause = 'provider_id';
    switch (options.groupBy) {
      case 'model':
        groupByClause = 'model';
        break;
      case 'day':
        groupByClause = 'DATE(created_at)';
        break;
      case 'hour':
        groupByClause = 'DATE_TRUNC(\'hour\', created_at)';
        break;
      default:
        groupByClause = 'provider_id';
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await this.pool.query(`
      SELECT 
        ${groupByClause} as group_key,
        COUNT(*) as total_calls,
        ROUND(AVG(latency_ms)::numeric, 2) as avg_latency_ms,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(total_cost), 0) as total_cost,
        ROUND(AVG(input_tokens)::numeric, 2) as avg_input_tokens,
        ROUND(AVG(output_tokens)::numeric, 2) as avg_output_tokens
      FROM llm_messages 
      ${whereClause}
      GROUP BY ${groupByClause}
      ORDER BY total_calls DESC
    `, params);

    return result.rows.map(row => ({
      group: row.group_key?.toString() || 'unknown',
      totalCalls: parseInt(row.total_calls),
      avgLatencyMs: parseFloat(row.avg_latency_ms) || 0,
      totalTokens: parseInt(row.total_tokens) || 0,
      totalCost: parseFloat(row.total_cost) || 0,
      avgInputTokens: parseFloat(row.avg_input_tokens) || 0,
      avgOutputTokens: parseFloat(row.avg_output_tokens) || 0
    }));
  }

  /**
   * Get cost breakdown by provider and model
   */
  async getCostBreakdown(options: {
    campaignId?: number;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<Array<{
    providerId: string;
    model: string;
    totalCalls: number;
    totalCost: number;
    avgCostPerCall: number;
    totalTokens: number;
    costPerToken: number;
  }>> {
    const conditions: string[] = ['total_cost IS NOT NULL'];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.campaignId) {
      conditions.push(`campaign_id = $${paramIndex++}`);
      params.push(options.campaignId);
    }

    if (options.startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      params.push(options.startDate);
    }

    if (options.endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      params.push(options.endDate);
    }

    const result = await this.pool.query(`
      SELECT 
        provider_id,
        COALESCE(model, 'unknown') as model,
        COUNT(*) as total_calls,
        SUM(total_cost) as total_cost,
        ROUND(AVG(total_cost)::numeric, 6) as avg_cost_per_call,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        CASE 
          WHEN SUM(total_tokens) > 0 THEN ROUND((SUM(total_cost) / SUM(total_tokens))::numeric, 8)
          ELSE 0
        END as cost_per_token
      FROM llm_messages 
      WHERE ${conditions.join(' AND ')}
      GROUP BY provider_id, model
      ORDER BY total_cost DESC
    `, params);

    return result.rows.map(row => ({
      providerId: row.provider_id,
      model: row.model,
      totalCalls: parseInt(row.total_calls),
      totalCost: parseFloat(row.total_cost),
      avgCostPerCall: parseFloat(row.avg_cost_per_call),
      totalTokens: parseInt(row.total_tokens),
      costPerToken: parseFloat(row.cost_per_token)
    }));
  }

  /**
   * Delete old metrics (for cleanup)
   */
  async deleteOldMetrics(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await this.pool.query(`
      DELETE FROM llm_messages 
      WHERE created_at < $1
    `, [cutoffDate]);

    return result.rowCount || 0;
  }

  /**
   * Map database row to LLMMessageMetrics interface
   */
  private mapRowToMetrics(row: any): LLMMessageMetrics {
    return {
      id: row.id,
      requestId: row.request_id,
      providerId: row.provider_id,
      model: row.model,
      operation: row.operation,
      latencyMs: row.latency_ms,
      createdAt: row.created_at,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
      totalTokens: row.total_tokens,
      bytesIn: row.bytes_in,
      bytesOut: row.bytes_out,
      inputCost: row.input_cost ? parseFloat(row.input_cost) : undefined,
      outputCost: row.output_cost ? parseFloat(row.output_cost) : undefined,
      totalCost: row.total_cost ? parseFloat(row.total_cost) : undefined,
      userId: row.user_id,
      sessionId: row.session_id,
      campaignId: row.campaign_id,
      mode: row.mode,
      pairedGroupId: row.paired_group_id,
      metadata: row.metadata || {}
    };
  }
}

// Default DAO instance (lazy initialization)
let _llmMetricsDAO: LLMMetricsDAO | null = null;
export function getLLMMetricsDAO(): LLMMetricsDAO {
  if (!_llmMetricsDAO) {
    _llmMetricsDAO = new LLMMetricsDAO();
  }
  return _llmMetricsDAO;
}
