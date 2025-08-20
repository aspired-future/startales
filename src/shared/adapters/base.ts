/**
 * Base Adapter Types and Common Interfaces
 */

import { z } from 'zod';

// Base Types
export type AdapterId = string;
export type ProviderName = string;

// Error Codes
export enum AdapterErrorCode {
  RATE_LIMIT = 'RATE_LIMIT',
  AUTH = 'AUTH',
  UNAVAILABLE = 'UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// Capability Types
export interface AdapterCapability {
  models: string[];
  cost?: {
    inputPer1K?: number;
    outputPer1K?: number;
    unit?: 'tokens' | 'sec' | 'image';
  };
  maxTokens?: number;
  contextWindow?: number;
  streaming?: boolean;
  languages?: string[];
  notes?: string;
}

// Error Types
export class AdapterError extends Error {
  constructor(
    public code: AdapterErrorCode,
    message: string,
    public provider?: string,
    public raw?: unknown,
    public httpStatus?: number
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

// Base Adapter Interface
export interface BaseAdapter {
  getCapabilities(): Promise<AdapterCapability>;
}

// Adapter Dependencies (for dependency injection)
export interface AdapterDependencies {
  metricsSink?: import('./metrics.js').AdapterMetricsSink;
  logger?: {
    debug(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
  };
  requestId?: () => string;
}

// Zod Schema for Capability
export const AdapterCapabilitySchema = z.object({
  models: z.array(z.string()).min(1),
  cost: z.object({
    inputPer1K: z.number().min(0).optional(),
    outputPer1K: z.number().min(0).optional(),
    unit: z.enum(['tokens', 'sec', 'image']).optional()
  }).optional(),
  maxTokens: z.number().positive().optional(),
  contextWindow: z.number().positive().optional(),
  streaming: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  notes: z.string().optional()
});

// Utility Functions
export function createAdapterError(
  code: AdapterErrorCode,
  message: string,
  provider?: string,
  raw?: unknown,
  httpStatus?: number
): AdapterError {
  return new AdapterError(code, message, provider, raw, httpStatus);
}

export function normalizeError(error: unknown, provider?: string): AdapterError {
  if (error instanceof AdapterError) {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return createAdapterError(AdapterErrorCode.RATE_LIMIT, error.message, provider, error);
    }
    
    if (message.includes('unauthorized') || message.includes('invalid api key')) {
      return createAdapterError(AdapterErrorCode.AUTH, error.message, provider, error);
    }
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return createAdapterError(AdapterErrorCode.TIMEOUT, error.message, provider, error);
    }
    
    if (message.includes('unavailable') || message.includes('service unavailable')) {
      return createAdapterError(AdapterErrorCode.UNAVAILABLE, error.message, provider, error);
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return createAdapterError(AdapterErrorCode.VALIDATION, error.message, provider, error);
    }
    
    return createAdapterError(AdapterErrorCode.UNKNOWN, error.message, provider, error);
  }

  return createAdapterError(
    AdapterErrorCode.UNKNOWN,
    typeof error === 'string' ? error : 'Unknown error occurred',
    provider,
    error
  );
}

export function validateCapability(capability: unknown): AdapterCapability {
  return AdapterCapabilitySchema.parse(capability);
}
