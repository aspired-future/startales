/**
 * Adapter Error Normalization and HTTP Status Mapping
 * Provides consistent error handling across all adapter types
 */

import { AdapterError, AdapterErrorCode } from './base';

// HTTP Status Code Mappings
export const HTTP_STATUS_MAPPINGS: Record<number, AdapterErrorCode> = {
  // Client Errors (4xx)
  400: AdapterErrorCode.VALIDATION,
  401: AdapterErrorCode.AUTH,
  403: AdapterErrorCode.AUTH,
  404: AdapterErrorCode.UNAVAILABLE,
  408: AdapterErrorCode.TIMEOUT,
  409: AdapterErrorCode.VALIDATION,
  422: AdapterErrorCode.VALIDATION,
  429: AdapterErrorCode.RATE_LIMIT,
  
  // Server Errors (5xx)
  500: AdapterErrorCode.UNAVAILABLE,
  502: AdapterErrorCode.UNAVAILABLE,
  503: AdapterErrorCode.UNAVAILABLE,
  504: AdapterErrorCode.TIMEOUT,
  507: AdapterErrorCode.RATE_LIMIT,
  
  // Custom/Provider-specific codes
  1015: AdapterErrorCode.RATE_LIMIT, // Cloudflare rate limit
  1020: AdapterErrorCode.UNAVAILABLE, // Cloudflare access denied
};

// Common error message patterns for different providers
export const ERROR_PATTERNS: Array<{
  pattern: RegExp;
  code: AdapterErrorCode;
  description: string;
}> = [
  // Rate limiting patterns
  {
    pattern: /rate.?limit|too.?many.?requests|quota.?exceeded|throttl/i,
    code: AdapterErrorCode.RATE_LIMIT,
    description: 'Rate limit or quota exceeded'
  },
  
  // Authentication patterns
  {
    pattern: /unauthorized|invalid.?api.?key|authentication|forbidden|access.?denied/i,
    code: AdapterErrorCode.AUTH,
    description: 'Authentication or authorization failure'
  },
  
  // Timeout patterns
  {
    pattern: /timeout|timed.?out|deadline.?exceeded|request.?timeout/i,
    code: AdapterErrorCode.TIMEOUT,
    description: 'Request timeout'
  },
  
  // Service unavailable patterns
  {
    pattern: /unavailable|service.?down|maintenance|connection.?refused|network.?error|offline/i,
    code: AdapterErrorCode.UNAVAILABLE,
    description: 'Service unavailable or network error'
  },
  
  // Validation patterns
  {
    pattern: /validation|invalid.?request|bad.?request|malformed|invalid.?parameter/i,
    code: AdapterErrorCode.VALIDATION,
    description: 'Request validation error'
  },
  
  // Model/content filtering patterns
  {
    pattern: /content.?filter|safety.?filter|policy.?violation|inappropriate/i,
    code: AdapterErrorCode.VALIDATION,
    description: 'Content policy violation'
  },
  
  // Token/context length patterns
  {
    pattern: /token.?limit|context.?length|maximum.?length|too.?long/i,
    code: AdapterErrorCode.VALIDATION,
    description: 'Token or context length exceeded'
  }
];

// Provider-specific error mappings
export const PROVIDER_ERROR_MAPPINGS: Record<string, Array<{
  pattern: RegExp;
  code: AdapterErrorCode;
  description: string;
}>> = {
  openai: [
    {
      pattern: /insufficient_quota|billing/i,
      code: AdapterErrorCode.AUTH,
      description: 'OpenAI billing or quota issue'
    },
    {
      pattern: /model_not_found|engine_not_found/i,
      code: AdapterErrorCode.VALIDATION,
      description: 'OpenAI model not found'
    },
    {
      pattern: /context_length_exceeded/i,
      code: AdapterErrorCode.VALIDATION,
      description: 'OpenAI context length exceeded'
    }
  ],
  
  anthropic: [
    {
      pattern: /credit_balance_too_low/i,
      code: AdapterErrorCode.AUTH,
      description: 'Anthropic insufficient credits'
    },
    {
      pattern: /output_blocked/i,
      code: AdapterErrorCode.VALIDATION,
      description: 'Anthropic content filtering'
    }
  ],
  
  ollama: [
    {
      pattern: /model.?not.?found|pull.?model/i,
      code: AdapterErrorCode.VALIDATION,
      description: 'Ollama model not available'
    },
    {
      pattern: /connection.?refused|dial.?tcp/i,
      code: AdapterErrorCode.UNAVAILABLE,
      description: 'Ollama server not running'
    }
  ],
  
  'stable-diffusion': [
    {
      pattern: /nsfw|safety.?checker/i,
      code: AdapterErrorCode.VALIDATION,
      description: 'Stable Diffusion safety filter'
    },
    {
      pattern: /out.?of.?memory|cuda.?out.?of.?memory/i,
      code: AdapterErrorCode.UNAVAILABLE,
      description: 'Stable Diffusion GPU memory exhausted'
    }
  ]
};

/**
 * Enhanced error normalization with provider-specific mappings
 */
export function normalizeError(
  error: unknown, 
  provider?: string, 
  context?: {
    operation?: string;
    model?: string;
    requestId?: string;
  }
): AdapterError {
  // If already an AdapterError, return as-is
  if (error instanceof AdapterError) {
    return error;
  }

  let message = 'Unknown error occurred';
  let httpStatus: number | undefined;
  let code = AdapterErrorCode.UNKNOWN;
  
  // Extract error information
  if (error instanceof Error) {
    message = error.message;
    
    // Check for HTTP status in various error formats
    if ('status' in error && typeof error.status === 'number') {
      httpStatus = error.status;
    } else if ('statusCode' in error && typeof error.statusCode === 'number') {
      httpStatus = error.statusCode;
    } else if ('code' in error && typeof error.code === 'number') {
      httpStatus = error.code;
    }
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    // Handle various error object formats
    if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    } else if ('error' in error && typeof error.error === 'string') {
      message = error.error;
    } else if ('detail' in error && typeof error.detail === 'string') {
      message = error.detail;
    }
    
    // Extract status codes from object
    if ('status' in error && typeof error.status === 'number') {
      httpStatus = error.status;
    } else if ('statusCode' in error && typeof error.statusCode === 'number') {
      httpStatus = error.statusCode;
    }
  }

  // Map HTTP status codes first
  if (httpStatus && HTTP_STATUS_MAPPINGS[httpStatus]) {
    code = HTTP_STATUS_MAPPINGS[httpStatus];
  } else {
    // Try provider-specific patterns first
    if (provider && PROVIDER_ERROR_MAPPINGS[provider]) {
      const providerPatterns = PROVIDER_ERROR_MAPPINGS[provider];
      for (const mapping of providerPatterns) {
        if (mapping.pattern.test(message)) {
          code = mapping.code;
          break;
        }
      }
    }
    
    // Fall back to general patterns
    if (code === AdapterErrorCode.UNKNOWN) {
      for (const mapping of ERROR_PATTERNS) {
        if (mapping.pattern.test(message)) {
          code = mapping.code;
          break;
        }
      }
    }
  }

  // Enhance message with context if available
  let enhancedMessage = message;
  if (context) {
    const contextParts = [];
    if (context.operation) contextParts.push(`operation: ${context.operation}`);
    if (context.model) contextParts.push(`model: ${context.model}`);
    if (context.requestId) contextParts.push(`requestId: ${context.requestId}`);
    
    if (contextParts.length > 0) {
      enhancedMessage = `${message} (${contextParts.join(', ')})`;
    }
  }

  return new AdapterError(code, enhancedMessage, provider, error, httpStatus);
}

/**
 * Check if an error is retryable based on its code
 */
export function isRetryableError(error: AdapterError): boolean {
  return [
    AdapterErrorCode.RATE_LIMIT,
    AdapterErrorCode.TIMEOUT,
    AdapterErrorCode.UNAVAILABLE
  ].includes(error.code);
}

/**
 * Get retry delay for retryable errors (exponential backoff)
 */
export function getRetryDelay(attempt: number, baseDelay = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
}

/**
 * Extract error details for logging (with sensitive data redaction)
 */
export function extractErrorDetails(error: AdapterError): {
  code: string;
  message: string;
  provider?: string;
  httpStatus?: number;
  retryable: boolean;
  context?: Record<string, any>;
} {
  return {
    code: error.code,
    message: error.message,
    provider: error.provider,
    httpStatus: error.httpStatus,
    retryable: isRetryableError(error),
    context: error.raw && typeof error.raw === 'object' ? 
      redactSensitiveData(error.raw as Record<string, any>) : undefined
  };
}

/**
 * Redact sensitive data from error context
 */
function redactSensitiveData(obj: Record<string, any>): Record<string, any> {
  const sensitiveKeys = [
    'api_key', 'apikey', 'api-key', 'authorization', 'auth',
    'token', 'secret', 'password', 'key', 'credential'
  ];
  
  const redacted: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some(sensitiveKey => 
      lowerKey.includes(sensitiveKey)
    );
    
    if (isSensitive) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value as Record<string, any>);
    } else {
      redacted[key] = value;
    }
  }
  
  return redacted;
}

/**
 * Create a standardized error for common scenarios
 */
export function createStandardError(
  code: AdapterErrorCode,
  provider: string,
  operation: string,
  details?: string
): AdapterError {
  const messages: Record<AdapterErrorCode, string> = {
    [AdapterErrorCode.RATE_LIMIT]: `Rate limit exceeded for ${provider} ${operation}`,
    [AdapterErrorCode.AUTH]: `Authentication failed for ${provider} ${operation}`,
    [AdapterErrorCode.UNAVAILABLE]: `${provider} service unavailable for ${operation}`,
    [AdapterErrorCode.TIMEOUT]: `Request timeout for ${provider} ${operation}`,
    [AdapterErrorCode.VALIDATION]: `Invalid request for ${provider} ${operation}`,
    [AdapterErrorCode.UNKNOWN]: `Unknown error in ${provider} ${operation}`
  };
  
  const message = details ? `${messages[code]}: ${details}` : messages[code];
  return new AdapterError(code, message, provider);
}
