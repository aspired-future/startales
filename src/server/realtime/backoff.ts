/**
 * Exponential Backoff Implementation
 * Task 3, Subtask 3.2: Client retry strategy and exponential backoff utilities
 */

export interface BackoffOptions {
  baseMs: number
  maxMs: number
  multiplier?: number
  jitterFactor?: number
}

export class ExponentialBackoff {
  private readonly baseMs: number
  private readonly maxMs: number
  private readonly multiplier: number
  private readonly jitterFactor: number
  private currentAttempt: number = 0

  constructor(options: BackoffOptions) {
    this.baseMs = options.baseMs
    this.maxMs = options.maxMs
    this.multiplier = options.multiplier || 2
    this.jitterFactor = options.jitterFactor || 0

    if (this.baseMs <= 0) {
      throw new Error('Base delay must be positive')
    }
    if (this.maxMs < this.baseMs) {
      throw new Error('Max delay must be >= base delay')
    }
    if (this.multiplier <= 1) {
      throw new Error('Multiplier must be > 1')
    }
    if (this.jitterFactor < 0 || this.jitterFactor > 1) {
      throw new Error('Jitter factor must be between 0 and 1')
    }
  }

  /**
   * Get the next delay and increment attempt counter
   */
  next(): number {
    const delay = this.calculateDelay(this.currentAttempt)
    this.currentAttempt++
    return delay
  }

  /**
   * Get the current delay without incrementing
   */
  current(): number {
    return this.calculateDelay(this.currentAttempt)
  }

  /**
   * Reset the backoff to initial state
   */
  reset(): void {
    this.currentAttempt = 0
  }

  /**
   * Get current attempt count
   */
  attempts(): number {
    return this.currentAttempt
  }

  /**
   * Calculate delay for a specific attempt
   */
  private calculateDelay(attempt: number): number {
    if (attempt === 0) {
      return this.addJitter(this.baseMs)
    }

    // Calculate exponential delay
    const exponentialDelay = this.baseMs * Math.pow(this.multiplier, attempt)
    
    // Cap at maximum
    const cappedDelay = Math.min(exponentialDelay, this.maxMs)
    
    // Add jitter
    return this.addJitter(cappedDelay)
  }

  /**
   * Add jitter to delay
   */
  private addJitter(delay: number): number {
    if (this.jitterFactor === 0) {
      return delay
    }

    const jitterRange = delay * this.jitterFactor
    const jitter = (Math.random() - 0.5) * 2 * jitterRange
    return Math.max(0, delay + jitter)
  }
}

/**
 * Create a backoff instance with common defaults
 */
export function createBackoff(baseMs: number = 1000, maxMs: number = 30000): ExponentialBackoff {
  return new ExponentialBackoff({
    baseMs,
    maxMs,
    multiplier: 2,
    jitterFactor: 0.1
  })
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: BackoffOptions & { maxAttempts?: number } = { baseMs: 1000, maxMs: 30000 }
): Promise<T> {
  const backoff = new ExponentialBackoff(options)
  const maxAttempts = options.maxAttempts || 5
  let lastError: Error

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxAttempts - 1) {
        break
      }

      const delay = backoff.next()
      await sleep(delay)
    }
  }

  throw lastError!
}
