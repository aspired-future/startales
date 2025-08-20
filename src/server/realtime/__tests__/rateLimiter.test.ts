/**
 * Unit tests for Rate Limiter
 * Task 3, Subtask 3.1: Rate limiting component tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/testing-library/jest-dom'
import { RateLimiter } from '../rateLimiter'

describe('RateLimiter', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('should allow messages within rate limit', () => {
    const limiter = new RateLimiter(5, 1000) // 5 messages per second
    
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume()).toBe(true)
    }
  })

  test('should block messages exceeding rate limit', () => {
    const limiter = new RateLimiter(3, 1000)
    
    // Consume all tokens
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(true)
    
    // Next message should be blocked
    expect(limiter.consume()).toBe(false)
  })

  test('should refill tokens over time', () => {
    const limiter = new RateLimiter(2, 1000)
    
    // Consume all tokens
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(false)
    
    // Advance time by 1 second
    jest.advanceTimersByTime(1000)
    
    // Should be able to consume again
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(true)
    expect(limiter.consume()).toBe(false)
  })

  test('should handle burst allowance correctly', () => {
    const limiter = new RateLimiter(10, 1000, 5) // 10/sec with burst of 5
    
    // Should allow burst
    for (let i = 0; i < 15; i++) {
      expect(limiter.consume()).toBe(true)
    }
    
    // Should block after burst + rate
    expect(limiter.consume()).toBe(false)
  })

  test('should reset tokens correctly', () => {
    const limiter = new RateLimiter(5, 1000)
    
    // Consume some tokens
    limiter.consume()
    limiter.consume()
    limiter.consume()
    
    // Reset
    limiter.reset()
    
    // Should have full capacity again
    for (let i = 0; i < 5; i++) {
      expect(limiter.consume()).toBe(true)
    }
  })

  test('should provide remaining tokens count', () => {
    const limiter = new RateLimiter(5, 1000)
    
    expect(limiter.remaining()).toBe(5)
    
    limiter.consume()
    expect(limiter.remaining()).toBe(4)
    
    limiter.consume()
    limiter.consume()
    expect(limiter.remaining()).toBe(2)
  })
})
