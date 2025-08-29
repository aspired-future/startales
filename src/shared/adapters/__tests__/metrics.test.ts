/**
 * Metrics Interface and Utilities Tests
 * Tests metrics collection, sinks, and utilities
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  MetricsContext,
  AdapterMetrics,
  AdapterMetricsSink,
  NoOpMetricsSink,
  ConsoleMetricsSink,
  CompositeMetricsSink,
  MetricsTimer,
  TokenEstimator,
  MetricsCollector,
  createMetricsContext,
  createMetricsCollector
} from '../metrics';
import { AdapterError, AdapterErrorCode } from '../base';

describe('Metrics System', () => {
  describe('MetricsTimer', () => {
    it('should measure elapsed time', async () => {
      const timer = new MetricsTimer();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      const elapsed = timer.elapsed();
      
      expect(elapsed).toBeGreaterThanOrEqual(45);
      expect(elapsed).toBeLessThan(100);
    });

    it('should stop and return elapsed time', async () => {
      const timer = new MetricsTimer();
      
      await new Promise(resolve => setTimeout(resolve, 30));
      const stopped = timer.stop();
      
      expect(stopped).toBeGreaterThanOrEqual(25);
      expect(stopped).toBeLessThan(60);
      
      // Should return same value after stopping
      expect(timer.elapsed()).toBe(stopped);
    });

    it('should reset timer', async () => {
      const timer = new MetricsTimer();
      
      await new Promise(resolve => setTimeout(resolve, 30));
      timer.reset();
      
      const elapsed = timer.elapsed();
      expect(elapsed).toBeLessThan(10);
    });
  });

  describe('TokenEstimator', () => {
    describe('estimateTokens', () => {
      it('should estimate tokens from text', () => {
        const text = 'Hello world, this is a test message';
        const tokens = TokenEstimator.estimateTokens(text);
        
        // Should be roughly text.length / 4
        expect(tokens).toBeGreaterThan(5);
        expect(tokens).toBeLessThan(15);
      });

      it('should use provider-specific ratios', () => {
        const text = 'Test message';
        
        const openaiTokens = TokenEstimator.estimateTokens(text, 'openai');
        const defaultTokens = TokenEstimator.estimateTokens(text, 'default');
        
        expect(openaiTokens).toBe(defaultTokens); // Same ratio for these providers
      });

      it('should handle empty text', () => {
        const tokens = TokenEstimator.estimateTokens('');
        expect(tokens).toBe(0);
      });
    });

    describe('estimateChatTokens', () => {
      it('should estimate tokens for chat messages', () => {
        const messages = [
          { role: 'system', content: 'You are a helpful assistant' },
          { role: 'user', content: 'Hello, how are you?' },
          { role: 'assistant', content: 'I am doing well, thank you!' }
        ];
        
        const tokens = TokenEstimator.estimateChatTokens(messages);
        
        expect(tokens).toBeGreaterThan(10);
        expect(tokens).toBeLessThan(50);
      });

      it('should add overhead for formatting', () => {
        const singleMessage = [{ role: 'user', content: 'Hello' }];
        const tokens = TokenEstimator.estimateChatTokens(singleMessage);
        
        // Should include content + role + formatting overhead
        expect(tokens).toBeGreaterThan(5); // More than just content tokens
      });
    });

    describe('estimateCost', () => {
      it('should calculate cost from token counts', () => {
        const cost = TokenEstimator.estimateCost(
          1000, // input tokens
          500,  // output tokens
          { inputPer1K: 0.001, outputPer1K: 0.002 }
        );
        
        expect(cost).toBe(0.002); // (1000/1000 * 0.001) + (500/1000 * 0.002)
      });

      it('should handle missing pricing', () => {
        const cost = TokenEstimator.estimateCost(1000, 500, {});
        expect(cost).toBe(0);
      });

      it('should handle zero tokens', () => {
        const cost = TokenEstimator.estimateCost(
          0, 0,
          { inputPer1K: 0.001, outputPer1K: 0.002 }
        );
        expect(cost).toBe(0);
      });
    });
  });

  describe('NoOpMetricsSink', () => {
    it('should not throw on any method call', async () => {
      const sink = new NoOpMetricsSink();
      const context: MetricsContext = {
        requestId: 'test',
        providerId: 'test',
        adapterType: 'llm',
        operation: 'chat'
      };
      const metrics: AdapterMetrics = { latencyMs: 100 };
      const error = new AdapterError(AdapterErrorCode.UNKNOWN, 'Test error');

      expect(() => sink.onRequestStart(context)).not.toThrow();
      expect(() => sink.onRequestEnd(context, metrics)).not.toThrow();
      expect(() => sink.onRequestError(context, error)).not.toThrow();
      expect(() => sink.onStreamChunk?.(context, metrics)).not.toThrow();
      expect(() => sink.onStreamEnd?.(context, metrics)).not.toThrow();
    });
  });

  describe('ConsoleMetricsSink', () => {
    let consoleSpy: jest.SpiedFunction<typeof console.log>;
    let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should log request completion', () => {
      const sink = new ConsoleMetricsSink();
      const context: MetricsContext = {
        requestId: 'test-123',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };
      const metrics: AdapterMetrics = {
        latencyMs: 150,
        inputTokens: 10,
        outputTokens: 5,
        model: 'gpt-3.5-turbo'
      };

      sink.onRequestEnd(context, metrics);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ [openai] Completed chat'),
        expect.objectContaining({
          requestId: 'test-123',
          latencyMs: 150,
          inputTokens: 10,
          outputTokens: 5,
          model: 'gpt-3.5-turbo'
        })
      );
    });

    it('should log errors', () => {
      const sink = new ConsoleMetricsSink();
      const context: MetricsContext = {
        requestId: 'test-123',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };
      const error = new AdapterError(AdapterErrorCode.RATE_LIMIT, 'Rate limit exceeded', 'openai');

      sink.onRequestError(context, error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ [openai] Failed chat'),
        expect.objectContaining({
          requestId: 'test-123',
          error: 'RATE_LIMIT',
          message: 'Rate limit exceeded'
        })
      );
    });

    it('should log debug info when enabled', () => {
      const sink = new ConsoleMetricsSink('debug');
      const context: MetricsContext = {
        requestId: 'test-123',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      sink.onRequestStart(context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🚀 [openai] Starting chat'),
        expect.objectContaining({
          requestId: 'test-123',
          adapterType: 'llm'
        })
      );
    });
  });

  describe('CompositeMetricsSink', () => {
    it('should call all sinks', async () => {
      const sink1 = {
        onRequestStart: jest.fn(),
        onRequestEnd: jest.fn(),
        onRequestError: jest.fn()
      } as unknown as AdapterMetricsSink;

      const sink2 = {
        onRequestStart: jest.fn(),
        onRequestEnd: jest.fn(),
        onRequestError: jest.fn()
      } as unknown as AdapterMetricsSink;

      const composite = new CompositeMetricsSink([sink1, sink2]);
      const context: MetricsContext = {
        requestId: 'test',
        providerId: 'test',
        adapterType: 'llm',
        operation: 'chat'
      };
      const metrics: AdapterMetrics = { latencyMs: 100 };
      const error = new AdapterError(AdapterErrorCode.UNKNOWN, 'Test error');

      await composite.onRequestStart(context);
      await composite.onRequestEnd(context, metrics);
      await composite.onRequestError(context, error);

      expect(sink1.onRequestStart).toHaveBeenCalledWith(context);
      expect(sink1.onRequestEnd).toHaveBeenCalledWith(context, metrics);
      expect(sink1.onRequestError).toHaveBeenCalledWith(context, error);

      expect(sink2.onRequestStart).toHaveBeenCalledWith(context);
      expect(sink2.onRequestEnd).toHaveBeenCalledWith(context, metrics);
      expect(sink2.onRequestError).toHaveBeenCalledWith(context, error);
    });

    it('should handle sinks without optional methods', async () => {
      const sink1 = {
        onRequestStart: jest.fn(),
        onRequestEnd: jest.fn(),
        onRequestError: jest.fn(),
        onStreamChunk: jest.fn()
      } as unknown as AdapterMetricsSink;

      const sink2 = {
        onRequestStart: jest.fn(),
        onRequestEnd: jest.fn(),
        onRequestError: jest.fn()
        // No onStreamChunk
      } as unknown as AdapterMetricsSink;

      const composite = new CompositeMetricsSink([sink1, sink2]);
      const context: MetricsContext = {
        requestId: 'test',
        providerId: 'test',
        adapterType: 'llm',
        operation: 'chat'
      };
      const metrics: AdapterMetrics = { latencyMs: 100 };

      await composite.onStreamChunk?.(context, metrics);

      expect(sink1.onStreamChunk).toHaveBeenCalledWith(context, metrics);
      // sink2.onStreamChunk should not be called since it doesn't exist
    });
  });

  describe('MetricsCollector', () => {
    let mockSink: jest.Mocked<AdapterMetricsSink>;
    let context: MetricsContext;
    let collector: MetricsCollector;

    beforeEach(() => {
      mockSink = {
        onRequestStart: jest.fn(),
        onRequestEnd: jest.fn(),
        onRequestError: jest.fn(),
        onStreamChunk: jest.fn(),
        onStreamEnd: jest.fn()
      };

      context = {
        requestId: 'test-123',
        providerId: 'openai',
        adapterType: 'llm',
        operation: 'chat'
      };

      collector = new MetricsCollector(context, mockSink);
    });

    it('should start metrics collection', async () => {
      await collector.start();

      expect(mockSink.onRequestStart).toHaveBeenCalledWith(context);
      expect(context.startTime).toBeDefined();
    });

    it('should end metrics collection', async () => {
      await collector.start();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const metrics = {
        inputTokens: 10,
        outputTokens: 5,
        model: 'gpt-3.5-turbo'
      };

      await collector.end(metrics);

      expect(mockSink.onRequestEnd).toHaveBeenCalledWith(
        context,
        expect.objectContaining({
          ...metrics,
          latencyMs: expect.any(Number),
          totalTokens: 15
        })
      );
    });

    it('should record errors', async () => {
      const error = new AdapterError(AdapterErrorCode.RATE_LIMIT, 'Rate limit');
      
      await collector.error(error);

      expect(mockSink.onRequestError).toHaveBeenCalledWith(context, error);
    });

    it('should handle streaming', async () => {
      await collector.start();

      // Record stream chunks
      await collector.streamChunk({ outputTokens: 2 });
      await collector.streamChunk({ outputTokens: 3 });

      expect(mockSink.onStreamChunk).toHaveBeenCalledTimes(2);

      // End streaming
      await collector.streamEnd({ inputTokens: 10 });

      expect(mockSink.onStreamEnd).toHaveBeenCalledWith(
        context,
        expect.objectContaining({
          inputTokens: 10,
          outputTokens: 5, // 2 + 3 from chunks
          totalTokens: 15,
          latencyMs: expect.any(Number)
        })
      );

      expect(mockSink.onRequestEnd).toHaveBeenCalledWith(
        context,
        expect.objectContaining({
          inputTokens: 10,
          outputTokens: 5,
          totalTokens: 15
        })
      );
    });
  });

  describe('Utility Functions', () => {
    describe('createMetricsContext', () => {
      it('should create metrics context', () => {
        const context = createMetricsContext(
          'req-123',
          'openai',
          'llm',
          'chat',
          { model: 'gpt-3.5-turbo', userId: 'user-456' }
        );

        expect(context).toEqual({
          requestId: 'req-123',
          providerId: 'openai',
          adapterType: 'llm',
          operation: 'chat',
          model: 'gpt-3.5-turbo',
          userId: 'user-456',
          startTime: expect.any(Number)
        });
      });
    });

    describe('createMetricsCollector', () => {
      it('should create metrics collector', () => {
        const context = createMetricsContext('req-123', 'openai', 'llm', 'chat');
        const collector = createMetricsCollector(context);

        expect(collector).toBeInstanceOf(MetricsCollector);
      });

      it('should use custom sink', () => {
        const context = createMetricsContext('req-123', 'openai', 'llm', 'chat');
        const customSink = new ConsoleMetricsSink();
        const collector = createMetricsCollector(context, customSink);

        expect(collector).toBeInstanceOf(MetricsCollector);
      });
    });
  });
});
