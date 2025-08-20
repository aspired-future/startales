/**
 * Realtime WebSocket Gateway Configuration
 * Task 3, Subtask 3.2: Environment config and process bootstrap
 */

export interface RealtimeConfig {
  /** WebSocket server port */
  port: number
  
  /** Rate limiting: messages per second per connection */
  rateLimitPerSec: number
  
  /** Heartbeat interval in milliseconds */
  heartbeatMs: number
  
  /** Backpressure limit: max queued messages per connection */
  backpressureLimit: number
  
  /** Reconnect token TTL in milliseconds */
  reconnectTtl: number
  
  /** Enable development authentication (simple tokens) */
  devAuth: boolean
  
  /** JWT secret for token signing/verification */
  jwtSecret: string
  
  /** Maximum WebSocket frame size in bytes */
  maxFrameSize: number
  
  /** Maximum number of concurrent connections */
  maxConnections: number
  
  /** Log level for structured logging */
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  
  /** Log directory path */
  logDir: string
  
  /** Enable metrics collection */
  enableMetrics: boolean
  
  /** Admin endpoints port (dev only) */
  adminPort?: number
}

/**
 * Load configuration from environment variables with defaults
 */
export function loadConfig(): RealtimeConfig {
  return {
    port: parseInt(process.env.REALTIME_PORT || '3001', 10),
    rateLimitPerSec: parseInt(process.env.RATE_LIMIT_PER_SEC || '10', 10),
    heartbeatMs: parseInt(process.env.HEARTBEAT_MS || '30000', 10),
    backpressureLimit: parseInt(process.env.BACKPRESSURE_LIMIT || '100', 10),
    reconnectTtl: parseInt(process.env.RECONNECT_TTL || '300000', 10), // 5 minutes
    devAuth: process.env.DEV_AUTH === 'true' || process.env.NODE_ENV === 'development',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    maxFrameSize: parseInt(process.env.MAX_FRAME_SIZE || '1048576', 10), // 1MB
    maxConnections: parseInt(process.env.MAX_CONNECTIONS || '1000', 10),
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
    logDir: process.env.LOG_DIR || './logs',
    enableMetrics: process.env.ENABLE_METRICS !== 'false',
    adminPort: process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : undefined
  }
}

/**
 * Validate configuration values
 */
export function validateConfig(config: RealtimeConfig): void {
  const errors: string[] = []
  
  if (config.port < 1 || config.port > 65535) {
    errors.push('Port must be between 1 and 65535')
  }
  
  if (config.rateLimitPerSec < 1) {
    errors.push('Rate limit must be at least 1 message per second')
  }
  
  if (config.heartbeatMs < 1000) {
    errors.push('Heartbeat interval must be at least 1000ms')
  }
  
  if (config.backpressureLimit < 1) {
    errors.push('Backpressure limit must be at least 1')
  }
  
  if (config.reconnectTtl < 1000) {
    errors.push('Reconnect TTL must be at least 1000ms')
  }
  
  if (!config.devAuth && config.jwtSecret === 'dev-secret-change-in-production') {
    errors.push('JWT secret must be changed in production')
  }
  
  if (config.maxFrameSize < 1024) {
    errors.push('Max frame size must be at least 1024 bytes')
  }
  
  if (config.maxConnections < 1) {
    errors.push('Max connections must be at least 1')
  }
  
  if (!['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
    errors.push('Log level must be one of: debug, info, warn, error')
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
}

/**
 * Get validated configuration
 */
export function getConfig(): RealtimeConfig {
  const config = loadConfig()
  validateConfig(config)
  return config
}
