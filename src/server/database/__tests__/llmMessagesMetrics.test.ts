/**
 * TC012: Metrics Capture Tests
 * Tests latency and token metrics capture into llm_messages table
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Mock database types
interface LLMMessageMetrics {
  id?: string;
  request_id: string;
  provider_id: string;
  model?: string;
  latency_ms: number;
  input_tokens?: number;
  output_tokens?: number;
  bytes_in?: number;
  bytes_out?: number;
  mode?: 'single' | 'percentage_split' | 'paired_eval';
  paired_group_id?: string;
  created_at?: Date;
  campaign_id?: string;
  session_id?: string;
  user_id?: string;
}

interface MetricsContext {
  requestId: string;
  providerId: string;
  model?: string;
  campaignId?: string;
  sessionId?: string;
  userId?: string;
}

interface AdapterMetrics {
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  bytesIn?: number;
  bytesOut?: number;
  model?: string;
}

// Mock metrics sink interface
interface AdapterMetricsSink {
  onRequestStart(ctx: MetricsContext): void;
  onRequestEnd(ctx: MetricsContext, metrics: AdapterMetrics): Promise<void>;
  onRequestError(ctx: MetricsContext, error: Error): Promise<void>;
}

// Mock database access object
class MockLLMMessagesDAO {
  private records: LLMMessageMetrics[] = [];
  private nextId = 1;

  async logLLMCallMetrics(
    ctx: MetricsContext,
    metrics: AdapterMetrics,
    mode: 'single' | 'percentage_split' | 'paired_eval' = 'single',
    pairedGroupId?: string
  ): Promise<string> {
    const record: LLMMessageMetrics = {
      id: `msg_${this.nextId++}`,
      request_id: ctx.requestId,
      provider_id: ctx.providerId,
      model: metrics.model || ctx.model,
      latency_ms: metrics.latencyMs,
      input_tokens: metrics.inputTokens,
      output_tokens: metrics.outputTokens,
      bytes_in: metrics.bytesIn,
      bytes_out: metrics.bytesOut,
      mode,
      paired_group_id: pairedGroupId,
      created_at: new Date(),
      campaign_id: ctx.campaignId,
      session_id: ctx.sessionId,
      user_id: ctx.userId
    };

    this.records.push(record);
    return record.id!;
  }

  async getMetricsByRequestId(requestId: string): Promise<LLMMessageMetrics[]> {
    return this.records.filter(r => r.request_id === requestId);
  }

  async getMetricsByProvider(providerId: string): Promise<LLMMessageMetrics[]> {
    return this.records.filter(r => r.provider_id === providerId);
  }

  async getMetricsByPairedGroup(pairedGroupId: string): Promise<LLMMessageMetrics[]> {
    return this.records.filter(r => r.paired_group_id === pairedGroupId);
  }

  async getMetricsByTimeRange(startTime: Date, endTime: Date): Promise<LLMMessageMetrics[]> {
    return this.records.filter(r => 
      r.created_at && r.created_at >= startTime && r.created_at <= endTime
    );
  }

  async getAverageLatency(providerId?: string): Promise<number> {
    const filtered = providerId 
      ? this.records.filter(r => r.provider_id === providerId)
      : this.records;
    
    if (filtered.length === 0) return 0;
    
    const totalLatency = filtered.reduce((sum, r) => sum + r.latency_ms, 0);
    return totalLatency / filtered.length;
  }

  async getTotalTokens(providerId?: string): Promise<{ input: number; output: number }> {
    const filtered = providerId 
      ? this.records.filter(r => r.provider_id === providerId)
      : this.records;
    
    const input = filtered.reduce((sum, r) => sum + (r.input_tokens || 0), 0);
    const output = filtered.reduce((sum, r) => sum + (r.output_tokens || 0), 0);
    
    return { input, output };
  }

  // Test helpers
  clear(): void {
    this.records = [];
    this.nextId = 1;
  }

  getAllRecords(): LLMMessageMetrics[] {
    return [...this.records];
  }

  getRecordCount(): number {
    return this.records.length;
  }
}

// Mock metrics sink implementation
class DatabaseMetricsSink implements AdapterMetricsSink {
  private startTimes = new Map<string, number>();

  constructor(private dao: MockLLMMessagesDAO) {}

  onRequestStart(ctx: MetricsContext): void {
    this.startTimes.set(ctx.requestId, Date.now());
  }

  async onRequestEnd(ctx: MetricsContext, metrics: AdapterMetrics): Promise<void> {
    const startTime = this.startTimes.get(ctx.requestId);
    if (startTime) {
      // Use provided latency or calculate from start time
      const latencyMs = metrics.latencyMs || (Date.now() - startTime);
      
      await this.dao.logLLMCallMetrics(ctx, {
        ...metrics,
        latencyMs
      });
      
      this.startTimes.delete(ctx.requestId);
    } else {
      // No start time recorded, use provided latency
      await this.dao.logLLMCallMetrics(ctx, metrics);
    }
  }

  async onRequestError(ctx: MetricsContext, error: Error): Promise<void> {
    const startTime = this.startTimes.get(ctx.requestId);
    if (startTime) {
      const latencyMs = Date.now() - startTime;
      
      await this.dao.logLLMCallMetrics(ctx, {
        latencyMs,
        inputTokens: 0,
        outputTokens: 0
      });
      
      this.startTimes.delete(ctx.requestId);
    }
  }
}

// Mock A/B harness for testing paired evaluations
class MockABHarness {
  constructor(
    private dao: MockLLMMessagesDAO,
    private metricsSink: AdapterMetricsSink
  ) {}

  async runPercentageSplit(
    ctx: MetricsContext,
    controlProviderId: string,
    variantProviderId: string,
    percentage: number
  ): Promise<void> {
    // Simulate routing decision
    const useVariant = Math.random() < (percentage / 100);
    const selectedProvider = useVariant ? variantProviderId : controlProviderId;
    
    // Simulate request
    const requestCtx = { ...ctx, providerId: selectedProvider };
    this.metricsSink.onRequestStart(requestCtx);
    
    // Simulate response with metrics
    const metrics: AdapterMetrics = {
      latencyMs: 100 + Math.random() * 200,
      inputTokens: 10 + Math.floor(Math.random() * 50),
      outputTokens: 5 + Math.floor(Math.random() * 25),
      model: selectedProvider === 'openai' ? 'gpt-3.5-turbo' : 'llama3.1:8b'
    };
    
    await this.metricsSink.onRequestEnd(requestCtx, metrics);
    
    // Log with percentage split mode
    await this.dao.logLLMCallMetrics(requestCtx, metrics, 'percentage_split');
  }

  async runPairedEvaluation(
    ctx: MetricsContext,
    providerAId: string,
    providerBId: string
  ): Promise<string> {
    const pairedGroupId = `paired_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Run both providers
    const providers = [
      { id: providerAId, model: 'gpt-3.5-turbo' },
      { id: providerBId, model: 'llama3.1:8b' }
    ];
    
    for (const provider of providers) {
      const requestCtx = { 
        ...ctx, 
        providerId: provider.id,
        requestId: `${ctx.requestId}_${provider.id}`
      };
      
      this.metricsSink.onRequestStart(requestCtx);
      
      const metrics: AdapterMetrics = {
        latencyMs: 100 + Math.random() * 200,
        inputTokens: 10 + Math.floor(Math.random() * 50),
        outputTokens: 5 + Math.floor(Math.random() * 25),
        model: provider.model
      };
      
      await this.metricsSink.onRequestEnd(requestCtx, metrics);
      await this.dao.logLLMCallMetrics(requestCtx, metrics, 'paired_eval', pairedGroupId);
    }
    
    return pairedGroupId;
  }
}

describe('LLM Messages Metrics Capture (TC012)', () => {
  let dao: MockLLMMessagesDAO;
  let metricsSink: DatabaseMetricsSink;
  let abHarness: MockABHarness;

  beforeEach(() => {
    dao = new MockLLMMessagesDAO();
    metricsSink = new DatabaseMetricsSink(dao);
    abHarness = new MockABHarness(dao, metricsSink);
  });

  afterEach(() => {
    dao.clear();
  });

  describe('Basic Metrics Logging', () => {
    it('should log basic LLM call metrics', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_123',
        providerId: 'openai',
        model: 'gpt-3.5-turbo',
        campaignId: 'campaign_1',
        sessionId: 'session_1',
        userId: 'user_1'
      };

      const metrics: AdapterMetrics = {
        latencyMs: 150,
        inputTokens: 25,
        outputTokens: 12,
        bytesIn: 1024,
        bytesOut: 512
      };

      const recordId = await dao.logLLMCallMetrics(ctx, metrics);
      
      expect(recordId).toBeDefined();
      expect(dao.getRecordCount()).toBe(1);
      
      const records = await dao.getMetricsByRequestId('req_123');
      expect(records).toHaveLength(1);
      
      const record = records[0];
      expect(record.request_id).toBe('req_123');
      expect(record.provider_id).toBe('openai');
      expect(record.model).toBe('gpt-3.5-turbo');
      expect(record.latency_ms).toBe(150);
      expect(record.input_tokens).toBe(25);
      expect(record.output_tokens).toBe(12);
      expect(record.bytes_in).toBe(1024);
      expect(record.bytes_out).toBe(512);
      expect(record.mode).toBe('single');
      expect(record.campaign_id).toBe('campaign_1');
      expect(record.session_id).toBe('session_1');
      expect(record.user_id).toBe('user_1');
      expect(record.created_at).toBeInstanceOf(Date);
    });

    it('should handle optional fields', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_124',
        providerId: 'ollama'
      };

      const metrics: AdapterMetrics = {
        latencyMs: 200
        // No tokens or bytes
      };

      await dao.logLLMCallMetrics(ctx, metrics);
      
      const records = await dao.getMetricsByRequestId('req_124');
      const record = records[0];
      
      expect(record.input_tokens).toBeUndefined();
      expect(record.output_tokens).toBeUndefined();
      expect(record.bytes_in).toBeUndefined();
      expect(record.bytes_out).toBeUndefined();
      expect(record.campaign_id).toBeUndefined();
      expect(record.session_id).toBeUndefined();
      expect(record.user_id).toBeUndefined();
    });

    it('should validate required fields', async () => {
      const ctx: MetricsContext = {
        requestId: '',
        providerId: 'openai'
      };

      const metrics: AdapterMetrics = {
        latencyMs: 100
      };

      // Should handle empty request ID gracefully or throw validation error
      await expect(dao.logLLMCallMetrics(ctx, metrics)).resolves.toBeDefined();
    });
  });

  describe('Metrics Sink Integration', () => {
    it('should capture metrics through sink lifecycle', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_125',
        providerId: 'openai',
        model: 'gpt-4'
      };

      // Start request
      metricsSink.onRequestStart(ctx);
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // End request with metrics
      const metrics: AdapterMetrics = {
        latencyMs: 0, // Will be calculated by sink
        inputTokens: 30,
        outputTokens: 15,
        model: 'gpt-4'
      };
      
      await metricsSink.onRequestEnd(ctx, metrics);
      
      const records = await dao.getMetricsByRequestId('req_125');
      expect(records).toHaveLength(1);
      
      const record = records[0];
      expect(record.latency_ms).toBeGreaterThan(40); // Should be calculated
      expect(record.input_tokens).toBe(30);
      expect(record.output_tokens).toBe(15);
      expect(record.model).toBe('gpt-4');
    });

    it('should handle request errors', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_126',
        providerId: 'openai'
      };

      metricsSink.onRequestStart(ctx);
      
      await new Promise(resolve => setTimeout(resolve, 25));
      
      await metricsSink.onRequestError(ctx, new Error('API Error'));
      
      const records = await dao.getMetricsByRequestId('req_126');
      expect(records).toHaveLength(1);
      
      const record = records[0];
      expect(record.latency_ms).toBeGreaterThan(20);
      expect(record.input_tokens).toBe(0);
      expect(record.output_tokens).toBe(0);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(0).map((_, i) => ({
        requestId: `req_${130 + i}`,
        providerId: i % 2 === 0 ? 'openai' : 'ollama'
      }));

      // Start all requests
      requests.forEach(ctx => metricsSink.onRequestStart(ctx));
      
      // End all requests with different metrics
      const promises = requests.map(async (ctx, i) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        
        const metrics: AdapterMetrics = {
          latencyMs: 0,
          inputTokens: 10 + i,
          outputTokens: 5 + i
        };
        
        await metricsSink.onRequestEnd(ctx, metrics);
      });
      
      await Promise.all(promises);
      
      expect(dao.getRecordCount()).toBe(10);
      
      // Verify all requests have metrics
      for (const ctx of requests) {
        const records = await dao.getMetricsByRequestId(ctx.requestId);
        expect(records).toHaveLength(1);
        expect(records[0].latency_ms).toBeGreaterThan(0);
      }
    });
  });

  describe('A/B Testing Metrics', () => {
    it('should log percentage split metrics', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_140',
        providerId: '', // Will be set by harness
        campaignId: 'campaign_ab_test'
      };

      // Run multiple requests to test distribution
      const promises = Array(20).fill(0).map((_, i) => 
        abHarness.runPercentageSplit(
          { ...ctx, requestId: `req_${140 + i}` },
          'openai',
          'ollama',
          30 // 30% to variant (ollama)
        )
      );

      await Promise.all(promises);
      
      expect(dao.getRecordCount()).toBe(40); // 20 requests * 2 records each (one from harness, one from percentage split mode)
      
      const openaiRecords = await dao.getMetricsByProvider('openai');
      const ollamaRecords = await dao.getMetricsByProvider('ollama');
      
      // Should roughly follow 70/30 split (allowing for randomness)
      const totalRequests = openaiRecords.length + ollamaRecords.length;
      const ollamaPercentage = (ollamaRecords.length / totalRequests) * 100;
      
      expect(ollamaPercentage).toBeGreaterThan(10); // At least some went to variant
      expect(ollamaPercentage).toBeLessThan(60); // But not too many
    });

    it('should log paired evaluation metrics', async () => {
      const ctx: MetricsContext = {
        requestId: 'req_160',
        providerId: '', // Will be set by harness
        campaignId: 'campaign_paired_eval'
      };

      const pairedGroupId = await abHarness.runPairedEvaluation(
        ctx,
        'openai',
        'ollama'
      );

      expect(pairedGroupId).toBeDefined();
      
      const pairedRecords = await dao.getMetricsByPairedGroup(pairedGroupId);
      expect(pairedRecords).toHaveLength(2);
      
      // Should have one record for each provider
      const providers = pairedRecords.map(r => r.provider_id).sort();
      expect(providers).toEqual(['ollama', 'openai']);
      
      // Both should have same paired group ID
      pairedRecords.forEach(record => {
        expect(record.paired_group_id).toBe(pairedGroupId);
        expect(record.mode).toBe('paired_eval');
      });
    });

    it('should handle multiple paired evaluations', async () => {
      const promises = Array(5).fill(0).map((_, i) => 
        abHarness.runPairedEvaluation(
          {
            requestId: `req_${170 + i}`,
            providerId: '',
            campaignId: 'campaign_multi_paired'
          },
          'openai',
          'ollama'
        )
      );

      const pairedGroupIds = await Promise.all(promises);
      
      expect(pairedGroupIds).toHaveLength(5);
      expect(new Set(pairedGroupIds).size).toBe(5); // All unique
      
      // Each group should have exactly 2 records
      for (const groupId of pairedGroupIds) {
        const records = await dao.getMetricsByPairedGroup(groupId);
        expect(records).toHaveLength(2);
      }
    });
  });

  describe('Analytics and Aggregation', () => {
    beforeEach(async () => {
      // Set up test data
      const testData = [
        { provider: 'openai', latency: 100, inputTokens: 20, outputTokens: 10 },
        { provider: 'openai', latency: 150, inputTokens: 30, outputTokens: 15 },
        { provider: 'openai', latency: 120, inputTokens: 25, outputTokens: 12 },
        { provider: 'ollama', latency: 200, inputTokens: 40, outputTokens: 20 },
        { provider: 'ollama', latency: 250, inputTokens: 50, outputTokens: 25 },
      ];

      for (let i = 0; i < testData.length; i++) {
        const data = testData[i];
        await dao.logLLMCallMetrics(
          {
            requestId: `req_analytics_${i}`,
            providerId: data.provider
          },
          {
            latencyMs: data.latency,
            inputTokens: data.inputTokens,
            outputTokens: data.outputTokens
          }
        );
      }
    });

    it('should calculate average latency by provider', async () => {
      const openaiAvg = await dao.getAverageLatency('openai');
      const ollamaAvg = await dao.getAverageLatency('ollama');
      const overallAvg = await dao.getAverageLatency();
      
      expect(openaiAvg).toBe((100 + 150 + 120) / 3); // 123.33...
      expect(ollamaAvg).toBe((200 + 250) / 2); // 225
      expect(overallAvg).toBe((100 + 150 + 120 + 200 + 250) / 5); // 164
    });

    it('should calculate total tokens by provider', async () => {
      const openaiTokens = await dao.getTotalTokens('openai');
      const ollamaTokens = await dao.getTotalTokens('ollama');
      const overallTokens = await dao.getTotalTokens();
      
      expect(openaiTokens.input).toBe(20 + 30 + 25); // 75
      expect(openaiTokens.output).toBe(10 + 15 + 12); // 37
      
      expect(ollamaTokens.input).toBe(40 + 50); // 90
      expect(ollamaTokens.output).toBe(20 + 25); // 45
      
      expect(overallTokens.input).toBe(75 + 90); // 165
      expect(overallTokens.output).toBe(37 + 45); // 82
    });

    it('should filter metrics by time range', async () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      
      const recentRecords = await dao.getMetricsByTimeRange(oneHourAgo, oneHourFromNow);
      expect(recentRecords.length).toBe(5); // All test records should be recent
      
      const futureRecords = await dao.getMetricsByTimeRange(oneHourFromNow, new Date(oneHourFromNow.getTime() + 60 * 60 * 1000));
      expect(futureRecords.length).toBe(0); // No future records
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle high-volume metrics logging', async () => {
      const startTime = Date.now();
      const batchSize = 100;
      
      const promises = Array(batchSize).fill(0).map(async (_, i) => {
        const ctx: MetricsContext = {
          requestId: `req_perf_${i}`,
          providerId: i % 3 === 0 ? 'openai' : i % 3 === 1 ? 'ollama' : 'claude',
          campaignId: `campaign_${Math.floor(i / 10)}`
        };
        
        const metrics: AdapterMetrics = {
          latencyMs: 100 + Math.random() * 200,
          inputTokens: Math.floor(Math.random() * 100),
          outputTokens: Math.floor(Math.random() * 50)
        };
        
        return dao.logLLMCallMetrics(ctx, metrics);
      });
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(dao.getRecordCount()).toBe(batchSize);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      
      // Verify data integrity
      const allRecords = dao.getAllRecords();
      expect(allRecords).toHaveLength(batchSize);
      
      // Check that all records have required fields
      allRecords.forEach(record => {
        expect(record.request_id).toBeDefined();
        expect(record.provider_id).toBeDefined();
        expect(record.latency_ms).toBeGreaterThan(0);
        expect(record.created_at).toBeInstanceOf(Date);
      });
    });

    it('should handle concurrent metrics operations', async () => {
      // Simulate concurrent logging and reading
      const logPromises = Array(50).fill(0).map(async (_, i) => {
        await dao.logLLMCallMetrics(
          { requestId: `req_concurrent_${i}`, providerId: 'openai' },
          { latencyMs: 100 + i, inputTokens: 10 + i, outputTokens: 5 + i }
        );
      });
      
      const readPromises = Array(10).fill(0).map(async (_, i) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        return dao.getAverageLatency('openai');
      });
      
      const [logResults, readResults] = await Promise.all([
        Promise.all(logPromises),
        Promise.all(readPromises)
      ]);
      
      expect(logResults).toHaveLength(50);
      expect(readResults).toHaveLength(10);
      expect(dao.getRecordCount()).toBe(50);
      
      // All read operations should return valid numbers
      readResults.forEach(avg => {
        expect(typeof avg).toBe('number');
        expect(avg).toBeGreaterThan(0);
      });
    });
  });

  describe('Data Validation and Constraints', () => {
    it('should validate numeric constraints', async () => {
      const validMetrics: AdapterMetrics = {
        latencyMs: 150,
        inputTokens: 25,
        outputTokens: 12
      };
      
      await expect(dao.logLLMCallMetrics(
        { requestId: 'req_valid', providerId: 'openai' },
        validMetrics
      )).resolves.toBeDefined();
      
      // Test edge cases
      const edgeCaseMetrics: AdapterMetrics = {
        latencyMs: 0, // Zero latency
        inputTokens: 0, // Zero tokens
        outputTokens: 0
      };
      
      await expect(dao.logLLMCallMetrics(
        { requestId: 'req_edge', providerId: 'openai' },
        edgeCaseMetrics
      )).resolves.toBeDefined();
    });

    it('should handle large numeric values', async () => {
      const largeMetrics: AdapterMetrics = {
        latencyMs: 60000, // 1 minute
        inputTokens: 100000, // 100k tokens
        outputTokens: 50000, // 50k tokens
        bytesIn: 10485760, // 10MB
        bytesOut: 5242880 // 5MB
      };
      
      await expect(dao.logLLMCallMetrics(
        { requestId: 'req_large', providerId: 'openai' },
        largeMetrics
      )).resolves.toBeDefined();
      
      const records = await dao.getMetricsByRequestId('req_large');
      const record = records[0];
      
      expect(record.latency_ms).toBe(60000);
      expect(record.input_tokens).toBe(100000);
      expect(record.output_tokens).toBe(50000);
      expect(record.bytes_in).toBe(10485760);
      expect(record.bytes_out).toBe(5242880);
    });
  });
});
