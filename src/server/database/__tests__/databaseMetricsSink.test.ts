/**
 * Database Metrics Sink Integration Tests
 * Tests integration between metrics system and database persistence
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { DatabaseMetricsSink } from '../databaseMetricsSink';
import { LLMMetricsDAO } from '../llmMetrics';
import { MetricsContext, AdapterMetrics } from '../../../shared/adapters/metrics';
import { AdapterError, AdapterErrorCode } from '../../../shared/adapters/base';

describe('Database Metrics Sink Integration', () => {
  let mockDAO: jest.Mocked<LLMMetricsDAO>;
  let sink: DatabaseMetricsSink;
  let consoleSpy: jest.SpiedFunction<typeof console.log>;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    // Mock the DAO
    mockDAO = {
      logLLMCallMetrics: jest.fn(),
      getMetricsByRequestId: jest.fn(),
      getMetricsByCampaign: jest.fn(),
      getAggregatedMetrics: jest.fn(),
      getCostBreakdown: jest.fn(),
      deleteOldMetrics: jest.fn()
    } as unknown as jest.Mocked<LLMMetricsDAO>;

    // Create sink with mocked DAO
    sink = new DatabaseMetricsSink({
      llmMetricsDAO: mockDAO,
      enableErrorLogging: true,
      enableDebugLogging: true,
      batchSize: 2, // Small batch size for testing
      flushIntervalMs: 100 // Short interval for testing
    });

    // Spy on console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(async () => {
    await sink.shutdown();
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('LLM Metrics Persistence', () => {
    it('should persist LLM metrics to database', async () => {
      const mockId = 'test-uuid-123';
      mockDAO.logLLMCallMetrics.mockResolvedValue(mockId);

      const context: MetricsContext = {
        requestId: 'req-123',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat',
        model: 'gpt-3.5-turbo'
      };

      const metrics: AdapterMetrics = {
        latencyMs: 1500,
        inputTokens: 100,
        outputTokens: 50,
        totalTokens: 150,
        cost: { total: 0.003 }
      };

      await sink.onRequestEnd(context, metrics);

      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledWith(context, metrics);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📊 [DB] Persisted metrics for openai:chat'),
        expect.objectContaining({
          requestId: 'req-123',
          latencyMs: 1500,
          tokens: 150,
          cost: 0.003
        })
      );
    });

    it('should not persist non-LLM metrics', async () => {
      const context: MetricsContext = {
        requestId: 'req-456',
        providerId: 'whisper',
        adapterType: 'stt',
        operation: 'transcribe'
      };

      const metrics: AdapterMetrics = {
        latencyMs: 800
      };

      await sink.onRequestEnd(context, metrics);

      expect(mockDAO.logLLMCallMetrics).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockDAO.logLLMCallMetrics.mockRejectedValue(dbError);

      const context: MetricsContext = {
        requestId: 'req-error',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      // Should not throw - errors should be logged but not propagated
      await expect(sink.onRequestEnd(context, metrics)).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ [DB] Failed to persist metrics for req-error:'),
        dbError
      );
    });
  });

  describe('Request Lifecycle', () => {
    it('should log request start in debug mode', async () => {
      const context: MetricsContext = {
        requestId: 'req-start',
        providerId: 'anthropic',
        adapterType: 'llm',
        operation: 'chat'
      };

      await sink.onRequestStart(context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📊 [DB] Starting metrics collection for anthropic:chat'),
        expect.objectContaining({
          requestId: 'req-start',
          adapterType: 'llm'
        })
      );
    });

    it('should log request errors', async () => {
      const context: MetricsContext = {
        requestId: 'req-error',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const error = new AdapterError(
        AdapterErrorCode.RATE_LIMIT,
        'Rate limit exceeded',
        'openai'
      );

      await sink.onRequestError(context, error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('📊 [DB] Request failed for openai:chat'),
        expect.objectContaining({
          requestId: 'req-error',
          error: 'RATE_LIMIT',
          message: 'Rate limit exceeded'
        })
      );
    });
  });

  describe('Streaming Support', () => {
    it('should handle stream chunks', async () => {
      const context: MetricsContext = {
        requestId: 'req-stream',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat-stream'
      };

      const chunkMetrics: Partial<AdapterMetrics> = {
        outputTokens: 5
      };

      await sink.onStreamChunk(context, chunkMetrics);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📊 [DB] Stream chunk for req-stream'),
        expect.objectContaining({
          tokens: 5
        })
      );
    });

    it('should persist final streaming metrics', async () => {
      const mockId = 'stream-uuid-456';
      mockDAO.logLLMCallMetrics.mockResolvedValue(mockId);

      const context: MetricsContext = {
        requestId: 'req-stream-end',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat-stream'
      };

      const finalMetrics: AdapterMetrics = {
        latencyMs: 2000,
        inputTokens: 50,
        outputTokens: 100,
        totalTokens: 150
      };

      await sink.onStreamEnd(context, finalMetrics);

      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledWith(context, finalMetrics);
    });
  });

  describe('Batching and Flushing', () => {
    it('should flush batch when size limit reached', async () => {
      const mockId1 = 'batch-uuid-1';
      const mockId2 = 'batch-uuid-2';
      mockDAO.logLLMCallMetrics
        .mockResolvedValueOnce(mockId1)
        .mockResolvedValueOnce(mockId2);

      // Create sink with batch size of 2
      const batchSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        batchSize: 2,
        flushIntervalMs: 10000 // Long interval to test batch size trigger
      });

      const context1: MetricsContext = {
        requestId: 'req-batch-1',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const context2: MetricsContext = {
        requestId: 'req-batch-2',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      // First request should not trigger flush
      await batchSink.onRequestEnd(context1, metrics);
      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledTimes(1);

      // Second request should trigger batch flush
      await batchSink.onRequestEnd(context2, metrics);
      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledTimes(2);

      await batchSink.shutdown();
    });

    it('should flush batch on timer interval', async () => {
      const mockId = 'timer-uuid-123';
      mockDAO.logLLMCallMetrics.mockResolvedValue(mockId);

      // Create sink with short flush interval
      const timerSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        batchSize: 10, // Large batch size
        flushIntervalMs: 50 // Short interval
      });

      const context: MetricsContext = {
        requestId: 'req-timer',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      await timerSink.onRequestEnd(context, metrics);

      // Wait for timer to trigger
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledWith(context, metrics);

      await timerSink.shutdown();
    });

    it('should flush remaining metrics on shutdown', async () => {
      const mockId = 'shutdown-uuid-789';
      mockDAO.logLLMCallMetrics.mockResolvedValue(mockId);

      const shutdownSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        batchSize: 10, // Large batch size
        flushIntervalMs: 10000 // Long interval
      });

      const context: MetricsContext = {
        requestId: 'req-shutdown',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      await shutdownSink.onRequestEnd(context, metrics);

      // Metrics should not be persisted yet
      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledTimes(1);

      // Shutdown should flush remaining metrics
      await shutdownSink.shutdown();

      expect(mockDAO.logLLMCallMetrics).toHaveBeenCalledWith(context, metrics);
    });
  });

  describe('Error Handling in Batching', () => {
    it('should handle batch flush errors gracefully', async () => {
      const batchError = new Error('Batch flush failed');
      mockDAO.logLLMCallMetrics.mockRejectedValue(batchError);

      const batchSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        enableErrorLogging: true,
        batchSize: 1 // Immediate flush
      });

      const context: MetricsContext = {
        requestId: 'req-batch-error',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      // Should not throw
      await expect(batchSink.onRequestEnd(context, metrics)).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ [DB] Failed to persist metrics'),
        batchError
      );

      await batchSink.shutdown();
    });
  });

  describe('Configuration Options', () => {
    it('should respect debug logging setting', async () => {
      const quietSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        enableDebugLogging: false
      });

      const context: MetricsContext = {
        requestId: 'req-quiet',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      await quietSink.onRequestStart(context);

      // Should not log debug messages
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('📊 [DB] Starting metrics collection')
      );

      await quietSink.shutdown();
    });

    it('should respect error logging setting', async () => {
      const dbError = new Error('Database error');
      mockDAO.logLLMCallMetrics.mockRejectedValue(dbError);

      const quietSink = new DatabaseMetricsSink({
        llmMetricsDAO: mockDAO,
        enableErrorLogging: false
      });

      const context: MetricsContext = {
        requestId: 'req-no-error-log',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      const metrics: AdapterMetrics = { latencyMs: 1000 };

      await quietSink.onRequestEnd(context, metrics);

      // Should not log error messages
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      await quietSink.shutdown();
    });
  });
});
