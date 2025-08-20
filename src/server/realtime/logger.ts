/**
 * Structured Logger
 * Task 3, Subtask 3.11: Structured logging and diagnostics
 */

import { RealtimeConfig } from './config.js'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: Record<string, any>
  requestId?: string
}

export interface Logger {
  debug(message: string, data?: Record<string, any>): void
  info(message: string, data?: Record<string, any>): void
  warn(message: string, data?: Record<string, any>): void
  error(message: string, data?: Record<string, any>): void
  child(context: Record<string, any>): Logger
}

class ConsoleLogger implements Logger {
  private context: Record<string, any> = {}

  constructor(
    private config: RealtimeConfig,
    context: Record<string, any> = {}
  ) {
    this.context = context
  }

  debug(message: string, data?: Record<string, any>): void {
    this.log('debug', message, data)
  }

  info(message: string, data?: Record<string, any>): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: Record<string, any>): void {
    this.log('warn', message, data)
  }

  error(message: string, data?: Record<string, any>): void {
    this.log('error', message, data)
  }

  child(context: Record<string, any>): Logger {
    return new ConsoleLogger(this.config, { ...this.context, ...context })
  }

  private log(level: LogLevel, message: string, data?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: this.sanitizeData({ ...this.context, ...data })
    }

    // In production, you might want to use a proper logging library like pino or winston
    if (this.config.logLevel === 'debug' || level !== 'debug') {
      console.log(JSON.stringify(entry))
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const configLevelIndex = levels.indexOf(this.config.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= configLevelIndex
  }

  private sanitizeData(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined

    const sanitized = { ...data }
    
    // Redact sensitive fields
    const sensitiveFields = ['token', 'password', 'secret', 'key', 'authorization']
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }
}

export function createLogger(config: RealtimeConfig, context?: Record<string, any>): Logger {
  return new ConsoleLogger(config, context)
}
