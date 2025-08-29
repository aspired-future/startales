/**
 * LLM Analytics Views and Queries
 * Provides analytical views and queries for LLM metrics data
 */

import { Pool } from 'pg';
import { getPool } from '../storage/db';

/**
 * Create analytical views for LLM metrics
 */
export async function createLLMAnalyticsViews(): Promise<void> {
  const pool = getPool();

  try {
    // Daily LLM usage summary view
    await pool.query(`
      CREATE OR REPLACE VIEW llm_daily_usage AS
      SELECT 
        DATE(created_at) as usage_date,
        provider_id,
        model,
        COUNT(*) as total_calls,
        SUM(total_tokens) as total_tokens,
        SUM(total_cost) as total_cost,
        AVG(latency_ms) as avg_latency_ms,
        AVG(input_tokens) as avg_input_tokens,
        AVG(output_tokens) as avg_output_tokens,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT campaign_id) as unique_campaigns
      FROM llm_messages
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at), provider_id, model
      ORDER BY usage_date DESC, total_calls DESC;
    `);

    // Provider performance comparison view
    await pool.query(`
      CREATE OR REPLACE VIEW llm_provider_performance AS
      SELECT 
        provider_id,
        model,
        COUNT(*) as total_calls,
        ROUND(AVG(latency_ms)::numeric, 2) as avg_latency_ms,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms)::numeric, 2) as median_latency_ms,
        ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms)::numeric, 2) as p95_latency_ms,
        ROUND(AVG(total_tokens)::numeric, 2) as avg_tokens_per_call,
        ROUND(SUM(total_cost)::numeric, 4) as total_cost,
        ROUND(AVG(total_cost)::numeric, 6) as avg_cost_per_call,
        ROUND((SUM(total_cost) / NULLIF(SUM(total_tokens), 0))::numeric, 8) as cost_per_token,
        MIN(created_at) as first_used,
        MAX(created_at) as last_used
      FROM llm_messages
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        AND total_tokens IS NOT NULL
        AND total_cost IS NOT NULL
      GROUP BY provider_id, model
      ORDER BY total_calls DESC;
    `);

    // Campaign usage summary view
    await pool.query(`
      CREATE OR REPLACE VIEW llm_campaign_usage AS
      SELECT 
        campaign_id,
        COUNT(*) as total_calls,
        COUNT(DISTINCT provider_id) as providers_used,
        COUNT(DISTINCT model) as models_used,
        SUM(total_tokens) as total_tokens,
        SUM(total_cost) as total_cost,
        AVG(latency_ms) as avg_latency_ms,
        MIN(created_at) as first_call,
        MAX(created_at) as last_call,
        COUNT(DISTINCT user_id) as unique_users
      FROM llm_messages
      WHERE campaign_id IS NOT NULL
      GROUP BY campaign_id
      ORDER BY total_calls DESC;
    `);

    // Hourly usage patterns view
    await pool.query(`
      CREATE OR REPLACE VIEW llm_hourly_patterns AS
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour_of_day,
        EXTRACT(DOW FROM created_at) as day_of_week,
        COUNT(*) as total_calls,
        AVG(latency_ms) as avg_latency_ms,
        SUM(total_tokens) as total_tokens,
        SUM(total_cost) as total_cost
      FROM llm_messages
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY EXTRACT(HOUR FROM created_at), EXTRACT(DOW FROM created_at)
      ORDER BY day_of_week, hour_of_day;
    `);

    // Cost efficiency view
    await pool.query(`
      CREATE OR REPLACE VIEW llm_cost_efficiency AS
      SELECT 
        provider_id,
        model,
        operation,
        COUNT(*) as total_calls,
        ROUND(AVG(total_cost / NULLIF(total_tokens, 0))::numeric, 8) as avg_cost_per_token,
        ROUND(AVG(latency_ms / NULLIF(total_tokens, 0))::numeric, 4) as avg_latency_per_token,
        ROUND(AVG(total_tokens / NULLIF(latency_ms, 0) * 1000)::numeric, 2) as tokens_per_second,
        ROUND((AVG(total_tokens / NULLIF(latency_ms, 0) * 1000) / AVG(total_cost / NULLIF(total_tokens, 0)))::numeric, 2) as efficiency_score
      FROM llm_messages
      WHERE total_tokens > 0 
        AND total_cost > 0 
        AND latency_ms > 0
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY provider_id, model, operation
      ORDER BY efficiency_score DESC NULLS LAST;
    `);

    console.log('✅ LLM analytics views created successfully');
  } catch (error) {
    console.error('❌ Failed to create LLM analytics views:', error);
    throw error;
  }
}

/**
 * LLM Analytics Query Builder
 */
export class LLMAnalytics {
  private pool: Pool;

  constructor(pool?: Pool) {
    this.pool = pool || getPool();
  }

  /**
   * Get usage trends over time
   */
  async getUsageTrends(options: {
    days?: number;
    campaignId?: number;
    providerId?: string;
    groupBy?: 'day' | 'hour';
  } = {}): Promise<Array<{
    period: string;
    totalCalls: number;
    totalTokens: number;
    totalCost: number;
    avgLatency: number;
    uniqueUsers: number;
  }>> {
    const days = options.days || 7;
    const groupBy = options.groupBy || 'day';
    
    let dateFormat = 'DATE(created_at)';
    let interval = `${days} days`;
    
    if (groupBy === 'hour') {
      dateFormat = 'DATE_TRUNC(\'hour\', created_at)';
      interval = `${Math.min(days, 3)} days`; // Limit hours to 3 days max
    }

    const conditions = [`created_at >= CURRENT_DATE - INTERVAL '${interval}'`];
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

    const result = await this.pool.query(`
      SELECT 
        ${dateFormat} as period,
        COUNT(*) as total_calls,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(total_cost), 0) as total_cost,
        ROUND(AVG(latency_ms)::numeric, 2) as avg_latency,
        COUNT(DISTINCT user_id) as unique_users
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
      GROUP BY ${dateFormat}
      ORDER BY period DESC
    `, params);

    return result.rows.map(row => ({
      period: row.period.toISOString(),
      totalCalls: parseInt(row.total_calls),
      totalTokens: parseInt(row.total_tokens),
      totalCost: parseFloat(row.total_cost),
      avgLatency: parseFloat(row.avg_latency),
      uniqueUsers: parseInt(row.unique_users)
    }));
  }

  /**
   * Get top performing models
   */
  async getTopModels(options: {
    limit?: number;
    days?: number;
    campaignId?: number;
    sortBy?: 'calls' | 'tokens' | 'cost' | 'efficiency';
  } = {}): Promise<Array<{
    providerId: string;
    model: string;
    totalCalls: number;
    totalTokens: number;
    totalCost: number;
    avgLatency: number;
    efficiencyScore: number;
  }>> {
    const limit = options.limit || 10;
    const days = options.days || 7;
    const sortBy = options.sortBy || 'calls';

    const conditions = [`created_at >= CURRENT_DATE - INTERVAL '${days} days'`];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.campaignId) {
      conditions.push(`campaign_id = $${paramIndex++}`);
      params.push(options.campaignId);
    }

    let orderBy = 'total_calls DESC';
    switch (sortBy) {
      case 'tokens':
        orderBy = 'total_tokens DESC';
        break;
      case 'cost':
        orderBy = 'total_cost DESC';
        break;
      case 'efficiency':
        orderBy = 'efficiency_score DESC NULLS LAST';
        break;
    }

    const result = await this.pool.query(`
      SELECT 
        provider_id,
        COALESCE(model, 'unknown') as model,
        COUNT(*) as total_calls,
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(total_cost), 0) as total_cost,
        ROUND(AVG(latency_ms)::numeric, 2) as avg_latency,
        ROUND(
          CASE 
            WHEN AVG(total_cost / NULLIF(total_tokens, 0)) > 0 AND AVG(latency_ms) > 0
            THEN (AVG(total_tokens / NULLIF(latency_ms, 0) * 1000) / AVG(total_cost / NULLIF(total_tokens, 0)))
            ELSE 0
          END::numeric, 2
        ) as efficiency_score
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
      GROUP BY provider_id, model
      ORDER BY ${orderBy}
      LIMIT $${paramIndex}
    `, [...params, limit]);

    return result.rows.map(row => ({
      providerId: row.provider_id,
      model: row.model,
      totalCalls: parseInt(row.total_calls),
      totalTokens: parseInt(row.total_tokens),
      totalCost: parseFloat(row.total_cost),
      avgLatency: parseFloat(row.avg_latency),
      efficiencyScore: parseFloat(row.efficiency_score)
    }));
  }

  /**
   * Get cost analysis
   */
  async getCostAnalysis(options: {
    days?: number;
    campaignId?: number;
  } = {}): Promise<{
    totalCost: number;
    costByProvider: Array<{ providerId: string; cost: number; percentage: number }>;
    costByModel: Array<{ model: string; cost: number; percentage: number }>;
    dailyAverage: number;
    projectedMonthlyCost: number;
  }> {
    const days = options.days || 30;
    const conditions = [`created_at >= CURRENT_DATE - INTERVAL '${days} days'`];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.campaignId) {
      conditions.push(`campaign_id = $${paramIndex++}`);
      params.push(options.campaignId);
    }

    // Get total cost
    const totalResult = await this.pool.query(`
      SELECT COALESCE(SUM(total_cost), 0) as total_cost
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
        AND total_cost IS NOT NULL
    `, params);

    const totalCost = parseFloat(totalResult.rows[0].total_cost);

    // Get cost by provider
    const providerResult = await this.pool.query(`
      SELECT 
        provider_id,
        SUM(total_cost) as cost,
        ROUND((SUM(total_cost) / ${totalCost} * 100)::numeric, 2) as percentage
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
        AND total_cost IS NOT NULL
      GROUP BY provider_id
      ORDER BY cost DESC
    `, params);

    // Get cost by model
    const modelResult = await this.pool.query(`
      SELECT 
        COALESCE(model, 'unknown') as model,
        SUM(total_cost) as cost,
        ROUND((SUM(total_cost) / ${totalCost} * 100)::numeric, 2) as percentage
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
        AND total_cost IS NOT NULL
      GROUP BY model
      ORDER BY cost DESC
      LIMIT 10
    `, params);

    const dailyAverage = totalCost / days;
    const projectedMonthlyCost = dailyAverage * 30;

    return {
      totalCost,
      costByProvider: providerResult.rows.map(row => ({
        providerId: row.provider_id,
        cost: parseFloat(row.cost),
        percentage: parseFloat(row.percentage)
      })),
      costByModel: modelResult.rows.map(row => ({
        model: row.model,
        cost: parseFloat(row.cost),
        percentage: parseFloat(row.percentage)
      })),
      dailyAverage,
      projectedMonthlyCost
    };
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(options: {
    days?: number;
    campaignId?: number;
    providerId?: string;
  } = {}): Promise<{
    avgLatency: number;
    medianLatency: number;
    p95Latency: number;
    tokensPerSecond: number;
    errorRate: number;
    throughput: number;
  }> {
    const days = options.days || 7;
    const conditions = [`created_at >= CURRENT_DATE - INTERVAL '${days} days'`];
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

    const result = await this.pool.query(`
      SELECT 
        ROUND(AVG(latency_ms)::numeric, 2) as avg_latency,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms)::numeric, 2) as median_latency,
        ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms)::numeric, 2) as p95_latency,
        ROUND(AVG(total_tokens / NULLIF(latency_ms, 0) * 1000)::numeric, 2) as tokens_per_second,
        COUNT(*) as total_calls,
        COUNT(*) / ${days} as daily_throughput
      FROM llm_messages
      WHERE ${conditions.join(' AND ')}
        AND latency_ms > 0
        AND total_tokens > 0
    `, params);

    const row = result.rows[0];

    return {
      avgLatency: parseFloat(row.avg_latency) || 0,
      medianLatency: parseFloat(row.median_latency) || 0,
      p95Latency: parseFloat(row.p95_latency) || 0,
      tokensPerSecond: parseFloat(row.tokens_per_second) || 0,
      errorRate: 0, // Would need error tracking to calculate this
      throughput: parseFloat(row.daily_throughput) || 0
    };
  }
}

// Default analytics instance
export const llmAnalytics = new LLMAnalytics();
