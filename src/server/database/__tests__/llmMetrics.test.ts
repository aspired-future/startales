/**
 * LLM Metrics Database Tests (TC012)
 * Tests database schema, DAO functions, and metrics persistence
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Pool } from 'pg';
import { LLMMetricsDAO, migrateLLMMessagesTable, LLMMessageMetrics } from '../llmMetrics';
import { MetricsContext, AdapterMetrics } from '../../../shared/adapters/metrics';

// Mock Pool for testing
const mockPool = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn()
} as unknown as Pool;

const mockClient = {
  query: jest.fn(),
  release: jest.fn()
};

describe('LLM Metrics Database (TC012)', () => {
  let dao: LLMMetricsDAO;

  beforeEach(() => {
    dao = new LLMMetricsDAO(mockPool);
    jest.clearAllMocks();
    
    // Setup default mock behavior
    (mockPool.connect as jest.Mock).mockResolvedValue(mockClient);
    (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });
    (mockClient.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Database Migration', () => {
    it('should create llm_messages table with correct schema', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
      const testPool = { query: mockQuery } as unknown as Pool;
      
      // Mock the getPool function
      jest.doMock('../../storage/db.js', () => ({
        getPool: () => testPool
      }));

      await migrateLLMMessagesTable();

      // Verify table creation query was called
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS llm_messages')
      );

      // Verify indexes were created
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_llm_messages_provider_model')
      );
    });

    it('should create all required indexes', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
      const testPool = { query: mockQuery } as unknown as Pool;
      
      jest.doMock('../../storage/db.js', () => ({
        getPool: () => testPool
      }));

      await migrateLLMMessagesTable();

      const expectedIndexes = [
        'idx_llm_messages_provider_model',
        'idx_llm_messages_campaign_session',
        'idx_llm_messages_user_created',
        'idx_llm_messages_paired_group',
        'idx_llm_messages_request_id',
        'idx_llm_messages_cost_analytics',
        'idx_llm_messages_token_analytics'
      ];

      for (const index of expectedIndexes) {
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining(index)
        );
      }
    });
  });

  describe('LLMMetricsDAO', () => {
    describe('logLLMCallMetrics', () => {
      it('should insert metrics with all fields', async () => {
        const mockId = 'test-uuid-123';
        (mockClient.query as jest.Mock).mockResolvedValue({
          rows: [{ id: mockId }]
        });

        const context: MetricsContext = {
          requestId: 'req-123',
          providerId: 'openai',
          adapterType: 'llm',
          operation: 'chat',
          model: 'gpt-3.5-turbo',
          userId: 'user-456',
          sessionId: 'session-789',
          campaignId: 1,
          metadata: {
            mode: 'single',
            pairedGroupId: 'group-abc'
          }
        };

        const metrics: AdapterMetrics = {
          latencyMs: 1500,
          inputTokens: 100,
          outputTokens: 50,
          totalTokens: 150,
          bytesIn: 500,
          bytesOut: 200,
          cost: {
            input: 0.001,
            output: 0.002,
            total: 0.003
          },
          metadata: {
            temperature: 0.7
          }
        };

        const result = await dao.logLLMCallMetrics(context, metrics);

        expect(result).toBe(mockId);
        expect(mockClient.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO llm_messages'),
          [
            'req-123',
            'openai',
            'gpt-3.5-turbo',
            'chat',
            1500,
            100,
            50,
            150,
            500,
            200,
            0.001,
            0.002,
            0.003,
            'user-456',
            'session-789',
            1,
            'single',
            'group-abc',
            JSON.stringify({ temperature: 0.7 })
          ]
        );
        expect(mockClient.release).toHaveBeenCalled();
      });

      it('should handle missing optional fields', async () => {
        const mockId = 'test-uuid-456';
        (mockClient.query as jest.Mock).mockResolvedValue({
          rows: [{ id: mockId }]
        });

        const context: MetricsContext = {
          requestId: 'req-456',
          providerId: 'anthropic',
          adapterType: 'llm',
          operation: 'chat'
        };

        const metrics: AdapterMetrics = {
          latencyMs: 800
        };

        const result = await dao.logLLMCallMetrics(context, metrics);

        expect(result).toBe(mockId);
        expect(mockClient.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO llm_messages'),
          expect.arrayContaining([
            'req-456',
            'anthropic',
            undefined, // model
            'chat',
            800,
            undefined, // inputTokens
            undefined, // outputTokens
            undefined, // totalTokens
            undefined, // bytesIn
            undefined, // bytesOut
            undefined, // inputCost
            undefined, // outputCost
            undefined, // totalCost
            undefined, // userId
            undefined, // sessionId
            undefined, // campaignId
            undefined, // mode
            undefined, // pairedGroupId
            JSON.stringify({})
          ])
        );
      });

      it('should release client on error', async () => {
        const error = new Error('Database error');
        (mockClient.query as jest.Mock).mockRejectedValue(error);

        const context: MetricsContext = {
          requestId: 'req-error',
          providerId: 'test',
          adapterType: 'llm',
          operation: 'chat'
        };

        const metrics: AdapterMetrics = { latencyMs: 100 };

        await expect(dao.logLLMCallMetrics(context, metrics)).rejects.toThrow('Database error');
        expect(mockClient.release).toHaveBeenCalled();
      });
    });

    describe('getMetricsByRequestId', () => {
      it('should return metrics for valid request ID', async () => {
        const mockRow = {
          id: 'uuid-123',
          request_id: 'req-123',
          provider_id: 'openai',
          model: 'gpt-3.5-turbo',
          operation: 'chat',
          latency_ms: 1500,
          created_at: new Date('2024-01-01T12:00:00Z'),
          input_tokens: 100,
          output_tokens: 50,
          total_tokens: 150,
          bytes_in: 500,
          bytes_out: 200,
          input_cost: '0.001000',
          output_cost: '0.002000',
          total_cost: '0.003000',
          user_id: 'user-456',
          session_id: 'session-789',
          campaign_id: 1,
          mode: 'single',
          paired_group_id: 'group-abc',
          metadata: { temperature: 0.7 }
        };

        (mockPool.query as jest.Mock).mockResolvedValue({
          rows: [mockRow]
        });

        const result = await dao.getMetricsByRequestId('req-123');

        expect(result).toEqual({
          id: 'uuid-123',
          requestId: 'req-123',
          providerId: 'openai',
          model: 'gpt-3.5-turbo',
          operation: 'chat',
          latencyMs: 1500,
          createdAt: new Date('2024-01-01T12:00:00Z'),
          inputTokens: 100,
          outputTokens: 50,
          totalTokens: 150,
          bytesIn: 500,
          bytesOut: 200,
          inputCost: 0.001,
          outputCost: 0.002,
          totalCost: 0.003,
          userId: 'user-456',
          sessionId: 'session-789',
          campaignId: 1,
          mode: 'single',
          pairedGroupId: 'group-abc',
          metadata: { temperature: 0.7 }
        });
      });

      it('should return null for non-existent request ID', async () => {
        (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

        const result = await dao.getMetricsByRequestId('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('getMetricsByCampaign', () => {
      it('should return metrics for campaign with filters', async () => {
        const mockRows = [
          {
            id: 'uuid-1',
            request_id: 'req-1',
            provider_id: 'openai',
            model: 'gpt-3.5-turbo',
            operation: 'chat',
            latency_ms: 1000,
            created_at: new Date(),
            input_tokens: 50,
            output_tokens: 25,
            total_tokens: 75,
            bytes_in: null,
            bytes_out: null,
            input_cost: null,
            output_cost: null,
            total_cost: null,
            user_id: 'user-1',
            session_id: 'session-1',
            campaign_id: 1,
            mode: null,
            paired_group_id: null,
            metadata: {}
          }
        ];

        (mockPool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

        const result = await dao.getMetricsByCampaign(1, {
          providerId: 'openai',
          model: 'gpt-3.5-turbo',
          limit: 50,
          offset: 0
        });

        expect(result).toHaveLength(1);
        expect(result[0].requestId).toBe('req-1');
        expect(result[0].providerId).toBe('openai');
        expect(result[0].campaignId).toBe(1);

        // Verify query parameters
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('WHERE campaign_id = $1 AND provider_id = $2 AND model = $3'),
          [1, 'openai', 'gpt-3.5-turbo', 50, 0]
        );
      });

      it('should handle date range filters', async () => {
        (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-01-31');

        await dao.getMetricsByCampaign(1, {
          startDate,
          endDate
        });

        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('created_at >= $2 AND created_at <= $3'),
          [1, startDate, endDate, 100, 0]
        );
      });
    });

    describe('getAggregatedMetrics', () => {
      it('should return aggregated metrics by provider', async () => {
        const mockRows = [
          {
            group_key: 'openai',
            total_calls: '10',
            avg_latency_ms: '1500.50',
            total_tokens: '1000',
            total_cost: '0.050000',
            avg_input_tokens: '60.00',
            avg_output_tokens: '40.00'
          }
        ];

        (mockPool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

        const result = await dao.getAggregatedMetrics({
          campaignId: 1,
          groupBy: 'provider'
        });

        expect(result).toEqual([{
          group: 'openai',
          totalCalls: 10,
          avgLatencyMs: 1500.5,
          totalTokens: 1000,
          totalCost: 0.05,
          avgInputTokens: 60,
          avgOutputTokens: 40
        }]);
      });

      it('should group by different dimensions', async () => {
        (mockPool.query as jest.Mock).mockResolvedValue({ rows: [] });

        await dao.getAggregatedMetrics({ groupBy: 'day' });

        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('GROUP BY DATE(created_at)'),
          []
        );

        await dao.getAggregatedMetrics({ groupBy: 'hour' });

        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('GROUP BY DATE_TRUNC(\'hour\', created_at)'),
          []
        );
      });
    });

    describe('getCostBreakdown', () => {
      it('should return cost breakdown by provider and model', async () => {
        const mockRows = [
          {
            provider_id: 'openai',
            model: 'gpt-3.5-turbo',
            total_calls: '5',
            total_cost: '0.025000',
            avg_cost_per_call: '0.005000',
            total_tokens: '500',
            cost_per_token: '0.00005000'
          }
        ];

        (mockPool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

        const result = await dao.getCostBreakdown({ campaignId: 1 });

        expect(result).toEqual([{
          providerId: 'openai',
          model: 'gpt-3.5-turbo',
          totalCalls: 5,
          totalCost: 0.025,
          avgCostPerCall: 0.005,
          totalTokens: 500,
          costPerToken: 0.00005
        }]);
      });
    });

    describe('deleteOldMetrics', () => {
      it('should delete metrics older than specified days', async () => {
        (mockPool.query as jest.Mock).mockResolvedValue({ rowCount: 15 });

        const result = await dao.deleteOldMetrics(30);

        expect(result).toBe(15);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('DELETE FROM llm_messages WHERE created_at < $1'),
          [expect.any(Date)]
        );
      });

      it('should handle zero deletions', async () => {
        (mockPool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

        const result = await dao.deleteOldMetrics(7);

        expect(result).toBe(0);
      });
    });
  });

  describe('Data Validation', () => {
    it('should validate positive constraints', async () => {
      // This would be tested at the database level
      // Here we test that our DAO handles constraint violations properly
      const constraintError = new Error('violates check constraint "positive_latency"');
      (mockClient.query as jest.Mock).mockRejectedValue(constraintError);

      const context: MetricsContext = {
        requestId: 'req-invalid',
        providerId: 'test',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = {
        latencyMs: -100 // Invalid negative latency
      };

      await expect(dao.logLLMCallMetrics(context, metrics)).rejects.toThrow(
        'violates check constraint "positive_latency"'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const connectionError = new Error('Connection failed');
      (mockPool.connect as jest.Mock).mockRejectedValue(connectionError);

      const context: MetricsContext = {
        requestId: 'req-error',
        providerId: 'test',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 100 };

      await expect(dao.logLLMCallMetrics(context, metrics)).rejects.toThrow('Connection failed');
    });

    it('should handle query errors gracefully', async () => {
      const queryError = new Error('Invalid SQL');
      (mockPool.query as jest.Mock).mockRejectedValue(queryError);

      await expect(dao.getMetricsByRequestId('test')).rejects.toThrow('Invalid SQL');
    });
  });
});
