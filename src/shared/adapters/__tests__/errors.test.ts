/**
 * Error Normalization Tests
 * Tests error mapping and normalization functionality
 */

import { describe, it, expect } from '@jest/globals';
import {
  normalizeError,
  isRetryableError,
  getRetryDelay,
  extractErrorDetails,
  createStandardError,
  HTTP_STATUS_MAPPINGS,
  ERROR_PATTERNS,
  PROVIDER_ERROR_MAPPINGS
} from '../errors';
import { AdapterError, AdapterErrorCode } from '../base';

describe('Error Normalization', () => {
  describe('normalizeError', () => {
    it('should return AdapterError as-is', () => {
      const originalError = new AdapterError(AdapterErrorCode.AUTH, 'Test error', 'test-provider');
      const normalized = normalizeError(originalError);
      
      expect(normalized).toBe(originalError);
    });

    it('should map HTTP status codes correctly', () => {
      const testCases = [
        { status: 401, expectedCode: AdapterErrorCode.AUTH },
        { status: 403, expectedCode: AdapterErrorCode.AUTH },
        { status: 429, expectedCode: AdapterErrorCode.RATE_LIMIT },
        { status: 408, expectedCode: AdapterErrorCode.TIMEOUT },
        { status: 504, expectedCode: AdapterErrorCode.TIMEOUT },
        { status: 503, expectedCode: AdapterErrorCode.UNAVAILABLE },
        { status: 400, expectedCode: AdapterErrorCode.VALIDATION },
        { status: 422, expectedCode: AdapterErrorCode.VALIDATION }
      ];

      for (const { status, expectedCode } of testCases) {
        const error = { message: 'Test error', status };
        const normalized = normalizeError(error, 'test-provider');
        
        expect(normalized.code).toBe(expectedCode);
        expect(normalized.httpStatus).toBe(status);
        expect(normalized.provider).toBe('test-provider');
      }
    });

    it('should map error message patterns correctly', () => {
      const testCases = [
        { message: 'Rate limit exceeded', expectedCode: AdapterErrorCode.RATE_LIMIT },
        { message: 'Too many requests', expectedCode: AdapterErrorCode.RATE_LIMIT },
        { message: 'Unauthorized access', expectedCode: AdapterErrorCode.AUTH },
        { message: 'Invalid API key', expectedCode: AdapterErrorCode.AUTH },
        { message: 'Request timeout', expectedCode: AdapterErrorCode.TIMEOUT },
        { message: 'Connection timed out', expectedCode: AdapterErrorCode.TIMEOUT },
        { message: 'Service unavailable', expectedCode: AdapterErrorCode.UNAVAILABLE },
        { message: 'Network error', expectedCode: AdapterErrorCode.UNAVAILABLE },
        { message: 'Invalid request', expectedCode: AdapterErrorCode.VALIDATION },
        { message: 'Bad request format', expectedCode: AdapterErrorCode.VALIDATION }
      ];

      for (const { message, expectedCode } of testCases) {
        const error = new Error(message);
        const normalized = normalizeError(error, 'test-provider');
        
        expect(normalized.code).toBe(expectedCode);
        expect(normalized.message).toBe(message);
      }
    });

    it('should use provider-specific patterns', () => {
      // OpenAI specific
      const openaiError = new Error('insufficient_quota');
      const normalizedOpenai = normalizeError(openaiError, 'openai');
      expect(normalizedOpenai.code).toBe(AdapterErrorCode.AUTH);

      // Anthropic specific
      const anthropicError = new Error('credit_balance_too_low');
      const normalizedAnthropic = normalizeError(anthropicError, 'anthropic');
      expect(normalizedAnthropic.code).toBe(AdapterErrorCode.AUTH);

      // Ollama specific
      const ollamaError = new Error('model not found, try pulling it first');
      const normalizedOllama = normalizeError(ollamaError, 'ollama');
      expect(normalizedOllama.code).toBe(AdapterErrorCode.VALIDATION);
    });

    it('should handle different error object formats', () => {
      // Error with statusCode
      const errorWithStatusCode = { message: 'Test error', statusCode: 429 };
      const normalized1 = normalizeError(errorWithStatusCode, 'test');
      expect(normalized1.code).toBe(AdapterErrorCode.RATE_LIMIT);

      // Error with error field
      const errorWithErrorField = { error: 'Authentication failed' };
      const normalized2 = normalizeError(errorWithErrorField, 'test');
      expect(normalized2.code).toBe(AdapterErrorCode.AUTH);

      // Error with detail field
      const errorWithDetail = { detail: 'Invalid parameter value' };
      const normalized3 = normalizeError(errorWithDetail, 'test');
      expect(normalized3.code).toBe(AdapterErrorCode.VALIDATION);
    });

    it('should enhance message with context', () => {
      const error = new Error('Test error');
      const context = {
        operation: 'chat',
        model: 'gpt-3.5-turbo',
        requestId: 'req-123'
      };
      
      const normalized = normalizeError(error, 'openai', context);
      
      expect(normalized.message).toContain('Test error');
      expect(normalized.message).toContain('operation: chat');
      expect(normalized.message).toContain('model: gpt-3.5-turbo');
      expect(normalized.message).toContain('requestId: req-123');
    });

    it('should handle string errors', () => {
      const normalized = normalizeError('Simple error message', 'test-provider');
      
      expect(normalized.code).toBe(AdapterErrorCode.UNKNOWN);
      expect(normalized.message).toBe('Simple error message');
      expect(normalized.provider).toBe('test-provider');
    });

    it('should handle null/undefined errors', () => {
      const normalized1 = normalizeError(null, 'test-provider');
      expect(normalized1.code).toBe(AdapterErrorCode.UNKNOWN);
      expect(normalized1.message).toBe('Unknown error occurred');

      const normalized2 = normalizeError(undefined, 'test-provider');
      expect(normalized2.code).toBe(AdapterErrorCode.UNKNOWN);
      expect(normalized2.message).toBe('Unknown error occurred');
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      const retryableCodes = [
        AdapterErrorCode.RATE_LIMIT,
        AdapterErrorCode.TIMEOUT,
        AdapterErrorCode.UNAVAILABLE
      ];

      for (const code of retryableCodes) {
        const error = new AdapterError(code, 'Test error');
        expect(isRetryableError(error)).toBe(true);
      }
    });

    it('should identify non-retryable errors', () => {
      const nonRetryableCodes = [
        AdapterErrorCode.AUTH,
        AdapterErrorCode.VALIDATION,
        AdapterErrorCode.UNKNOWN
      ];

      for (const code of nonRetryableCodes) {
        const error = new AdapterError(code, 'Test error');
        expect(isRetryableError(error)).toBe(false);
      }
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate exponential backoff', () => {
      expect(getRetryDelay(1, 1000)).toBe(1000);  // 1 * 2^0 = 1
      expect(getRetryDelay(2, 1000)).toBe(2000);  // 1 * 2^1 = 2
      expect(getRetryDelay(3, 1000)).toBe(4000);  // 1 * 2^2 = 4
      expect(getRetryDelay(4, 1000)).toBe(8000);  // 1 * 2^3 = 8
    });

    it('should cap at maximum delay', () => {
      expect(getRetryDelay(10, 1000)).toBe(30000); // Capped at 30 seconds
      expect(getRetryDelay(20, 1000)).toBe(30000); // Still capped
    });

    it('should use custom base delay', () => {
      expect(getRetryDelay(1, 500)).toBe(500);
      expect(getRetryDelay(2, 500)).toBe(1000);
      expect(getRetryDelay(3, 500)).toBe(2000);
    });
  });

  describe('extractErrorDetails', () => {
    it('should extract error details correctly', () => {
      const error = new AdapterError(
        AdapterErrorCode.RATE_LIMIT,
        'Rate limit exceeded',
        'openai',
        { originalError: 'details' },
        429
      );

      const details = extractErrorDetails(error);

      expect(details.code).toBe('RATE_LIMIT');
      expect(details.message).toBe('Rate limit exceeded');
      expect(details.provider).toBe('openai');
      expect(details.httpStatus).toBe(429);
      expect(details.retryable).toBe(true);
      expect(details.context).toBeDefined();
    });

    it('should redact sensitive data from context', () => {
      const error = new AdapterError(
        AdapterErrorCode.AUTH,
        'Auth failed',
        'test',
        {
          api_key: 'secret-key',
          authorization: 'Bearer token',
          normalField: 'safe-value',
          nested: {
            password: 'secret',
            publicData: 'visible'
          }
        }
      );

      const details = extractErrorDetails(error);

      expect(details.context).toEqual({
        api_key: '[REDACTED]',
        authorization: '[REDACTED]',
        normalField: 'safe-value',
        nested: {
          password: '[REDACTED]',
          publicData: 'visible'
        }
      });
    });
  });

  describe('createStandardError', () => {
    it('should create standardized errors', () => {
      const error = createStandardError(
        AdapterErrorCode.RATE_LIMIT,
        'openai',
        'chat completion'
      );

      expect(error.code).toBe(AdapterErrorCode.RATE_LIMIT);
      expect(error.provider).toBe('openai');
      expect(error.message).toContain('Rate limit exceeded');
      expect(error.message).toContain('openai');
      expect(error.message).toContain('chat completion');
    });

    it('should include additional details', () => {
      const error = createStandardError(
        AdapterErrorCode.VALIDATION,
        'anthropic',
        'text generation',
        'Invalid model parameter'
      );

      expect(error.message).toContain('Invalid model parameter');
    });
  });

  describe('HTTP_STATUS_MAPPINGS', () => {
    it('should have correct mappings', () => {
      expect(HTTP_STATUS_MAPPINGS[401]).toBe(AdapterErrorCode.AUTH);
      expect(HTTP_STATUS_MAPPINGS[429]).toBe(AdapterErrorCode.RATE_LIMIT);
      expect(HTTP_STATUS_MAPPINGS[503]).toBe(AdapterErrorCode.UNAVAILABLE);
      expect(HTTP_STATUS_MAPPINGS[504]).toBe(AdapterErrorCode.TIMEOUT);
    });
  });

  describe('ERROR_PATTERNS', () => {
    it('should have valid regex patterns', () => {
      for (const pattern of ERROR_PATTERNS) {
        expect(pattern.pattern).toBeInstanceOf(RegExp);
        expect(typeof pattern.description).toBe('string');
        expect(Object.values(AdapterErrorCode)).toContain(pattern.code);
      }
    });
  });

  describe('PROVIDER_ERROR_MAPPINGS', () => {
    it('should have valid provider mappings', () => {
      for (const [provider, patterns] of Object.entries(PROVIDER_ERROR_MAPPINGS)) {
        expect(typeof provider).toBe('string');
        expect(Array.isArray(patterns)).toBe(true);
        
        for (const pattern of patterns) {
          expect(pattern.pattern).toBeInstanceOf(RegExp);
          expect(typeof pattern.description).toBe('string');
          expect(Object.values(AdapterErrorCode)).toContain(pattern.code);
        }
      }
    });
  });
});
