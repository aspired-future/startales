/**
 * Unit tests for Exponential Backoff
 * Task 3, Subtask 3.1: Backoff utility component tests
 */

import { describe, test, expect } from '@jest/testing-library/jest-dom'
import { ExponentialBackoff } from '../backoff'

describe('ExponentialBackoff', () => {
  test('should generate exponential sequence', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 100,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0
    })

    expect(backoff.next()).toBe(100)
    expect(backoff.next()).toBe(200)
    expect(backoff.next()).toBe(400)
    expect(backoff.next()).toBe(800)
    expect(backoff.next()).toBe(1600)
    expect(backoff.next()).toBe(3200)
    expect(backoff.next()).toBe(6400)
    expect(backoff.next()).toBe(10000) // capped at maxMs
    expect(backoff.next()).toBe(10000) // stays at max
  })

  test('should respect custom multiplier', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 100,
      maxMs: 10000,
      multiplier: 3,
      jitterFactor: 0
    })

    expect(backoff.next()).toBe(100)
    expect(backoff.next()).toBe(300)
    expect(backoff.next()).toBe(900)
    expect(backoff.next()).toBe(2700)
    expect(backoff.next()).toBe(8100)
    expect(backoff.next()).toBe(10000) // capped
  })

  test('should add jitter when configured', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 1000,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0.1 // 10% jitter
    })

    const delay1 = backoff.next()
    const delay2 = backoff.next()

    // First delay should be 1000ms ± 10%
    expect(delay1).toBeGreaterThanOrEqual(900)
    expect(delay1).toBeLessThanOrEqual(1100)

    // Second delay should be 2000ms ± 10%
    expect(delay2).toBeGreaterThanOrEqual(1800)
    expect(delay2).toBeLessThanOrEqual(2200)
  })

  test('should reset to base delay', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 100,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0
    })

    backoff.next() // 100
    backoff.next() // 200
    backoff.next() // 400

    backoff.reset()

    expect(backoff.next()).toBe(100)
  })

  test('should handle edge cases', () => {
    // Zero base
    const zeroBackoff = new ExponentialBackoff({
      baseMs: 0,
      maxMs: 1000,
      multiplier: 2,
      jitterFactor: 0
    })
    expect(zeroBackoff.next()).toBe(0)

    // Base equals max
    const equalBackoff = new ExponentialBackoff({
      baseMs: 1000,
      maxMs: 1000,
      multiplier: 2,
      jitterFactor: 0
    })
    expect(equalBackoff.next()).toBe(1000)
    expect(equalBackoff.next()).toBe(1000)

    // Large jitter factor
    const largeJitterBackoff = new ExponentialBackoff({
      baseMs: 1000,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0.5 // 50% jitter
    })
    const delay = largeJitterBackoff.next()
    expect(delay).toBeGreaterThanOrEqual(500)
    expect(delay).toBeLessThanOrEqual(1500)
  })

  test('should provide current delay without advancing', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 100,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0
    })

    expect(backoff.current()).toBe(100)
    expect(backoff.current()).toBe(100) // doesn't advance

    backoff.next() // advance to 100
    expect(backoff.current()).toBe(200) // next value without advancing

    backoff.next() // advance to 200
    expect(backoff.current()).toBe(400)
  })

  test('should track attempt count', () => {
    const backoff = new ExponentialBackoff({
      baseMs: 100,
      maxMs: 10000,
      multiplier: 2,
      jitterFactor: 0
    })

    expect(backoff.attempts()).toBe(0)

    backoff.next()
    expect(backoff.attempts()).toBe(1)

    backoff.next()
    backoff.next()
    expect(backoff.attempts()).toBe(3)

    backoff.reset()
    expect(backoff.attempts()).toBe(0)
  })
})
