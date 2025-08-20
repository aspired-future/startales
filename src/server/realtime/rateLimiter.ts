/**
 * Rate Limiter Implementation
 * Task 3, Subtask 3.2: Token bucket rate limiting per connection
 */

export class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly capacity: number
  private readonly refillRate: number
  private readonly refillInterval: number
  private readonly burstCapacity: number

  constructor(
    tokensPerSecond: number,
    windowMs: number = 1000,
    burstCapacity?: number
  ) {
    this.capacity = tokensPerSecond
    this.refillRate = tokensPerSecond
    this.refillInterval = windowMs
    this.burstCapacity = burstCapacity || tokensPerSecond
    this.tokens = Math.min(this.capacity, this.burstCapacity)
    this.lastRefill = Date.now()
  }

  /**
   * Attempt to consume a token
   * @returns true if token was consumed, false if rate limited
   */
  consume(): boolean {
    this.refill()
    
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    
    return false
  }

  /**
   * Get remaining tokens
   */
  remaining(): number {
    this.refill()
    return Math.floor(this.tokens)
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = Math.min(this.capacity, this.burstCapacity)
    this.lastRefill = Date.now()
  }

  /**
   * Get time until next token is available (in ms)
   */
  timeUntilReset(): number {
    this.refill()
    
    if (this.tokens >= 1) {
      return 0
    }
    
    const tokensNeeded = 1 - this.tokens
    const timePerToken = this.refillInterval / this.refillRate
    return Math.ceil(tokensNeeded * timePerToken)
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    
    if (elapsed >= this.refillInterval) {
      const tokensToAdd = (elapsed / this.refillInterval) * this.refillRate
      this.tokens = Math.min(this.burstCapacity, this.tokens + tokensToAdd)
      this.lastRefill = now
    }
  }
}
