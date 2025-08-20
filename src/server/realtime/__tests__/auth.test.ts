/**
 * Unit tests for Authentication
 * Task 3, Subtask 3.1: Authentication and token parsing tests
 */

import { describe, test, expect } from '@jest/testing-library/jest-dom'
import { AuthToken, AuthContext, parseAuthToken } from '../auth'

describe('Authentication', () => {
  describe('AuthToken', () => {
    test('should create valid token', () => {
      const context: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player', 'admin']
      }

      const token = AuthToken.create(context)
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    test('should verify valid token', () => {
      const context: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      }

      const token = AuthToken.create(context)
      const verified = AuthToken.verify(token)

      expect(verified).toEqual(context)
    })

    test('should reject invalid token', () => {
      expect(() => AuthToken.verify('invalid-token')).toThrow()
      expect(() => AuthToken.verify('')).toThrow()
      expect(() => AuthToken.verify('not.a.jwt')).toThrow()
    })

    test('should reject expired token', () => {
      const context: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      }

      // Create token with very short expiry
      const token = AuthToken.create(context, { expiresIn: '1ms' })
      
      // Wait for expiration
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(() => AuthToken.verify(token)).toThrow()
          resolve()
        }, 10)
      })
    })

    test('should handle missing fields', () => {
      expect(() => AuthToken.create({} as AuthContext)).toThrow()
      expect(() => AuthToken.create({ userId: 'user1' } as AuthContext)).toThrow()
      expect(() => AuthToken.create({ 
        userId: 'user1', 
        campaignId: 'campaign1' 
      } as AuthContext)).toThrow()
    })

    test('should validate roles array', () => {
      const validContext: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player', 'moderator']
      }

      const token = AuthToken.create(validContext)
      const verified = AuthToken.verify(token)

      expect(Array.isArray(verified.roles)).toBe(true)
      expect(verified.roles).toContain('player')
      expect(verified.roles).toContain('moderator')
    })
  })

  describe('parseAuthToken', () => {
    test('should parse token from query string', () => {
      const context: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      }

      const token = AuthToken.create(context)
      const url = `ws://localhost:3000/ws?token=${token}`
      
      const parsed = parseAuthToken(url)
      expect(parsed).toEqual(context)
    })

    test('should parse token from authorization header', () => {
      const context: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      }

      const token = AuthToken.create(context)
      const headers = {
        authorization: `Bearer ${token}`
      }
      
      const parsed = parseAuthToken(null, headers)
      expect(parsed).toEqual(context)
    })

    test('should handle missing token', () => {
      expect(() => parseAuthToken('ws://localhost:3000/ws')).toThrow()
      expect(() => parseAuthToken(null, {})).toThrow()
    })

    test('should handle malformed query', () => {
      expect(() => parseAuthToken('ws://localhost:3000/ws?token=')).toThrow()
      expect(() => parseAuthToken('ws://localhost:3000/ws?token=invalid')).toThrow()
    })

    test('should handle malformed header', () => {
      expect(() => parseAuthToken(null, { authorization: 'invalid' })).toThrow()
      expect(() => parseAuthToken(null, { authorization: 'Bearer ' })).toThrow()
      expect(() => parseAuthToken(null, { authorization: 'Bearer invalid-token' })).toThrow()
    })

    test('should prioritize header over query', () => {
      const context1: AuthContext = {
        userId: 'user1',
        campaignId: 'campaign1',
        sessionId: 'session1',
        roles: ['player']
      }

      const context2: AuthContext = {
        userId: 'user2',
        campaignId: 'campaign2',
        sessionId: 'session2',
        roles: ['admin']
      }

      const token1 = AuthToken.create(context1)
      const token2 = AuthToken.create(context2)

      const url = `ws://localhost:3000/ws?token=${token1}`
      const headers = { authorization: `Bearer ${token2}` }
      
      const parsed = parseAuthToken(url, headers)
      expect(parsed).toEqual(context2) // Should use header token
    })
  })

  describe('AuthContext validation', () => {
    test('should validate required fields', () => {
      const validContext: AuthContext = {
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      }

      expect(() => AuthToken.create(validContext)).not.toThrow()
    })

    test('should reject empty strings', () => {
      expect(() => AuthToken.create({
        userId: '',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player']
      })).toThrow()

      expect(() => AuthToken.create({
        userId: 'user123',
        campaignId: '',
        sessionId: 'session789',
        roles: ['player']
      })).toThrow()

      expect(() => AuthToken.create({
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: '',
        roles: ['player']
      })).toThrow()
    })

    test('should reject empty roles array', () => {
      expect(() => AuthToken.create({
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: []
      })).toThrow()
    })

    test('should validate role strings', () => {
      expect(() => AuthToken.create({
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player', ''] // empty role
      })).toThrow()

      expect(() => AuthToken.create({
        userId: 'user123',
        campaignId: 'campaign456',
        sessionId: 'session789',
        roles: ['player', 123 as any] // non-string role
      })).toThrow()
    })
  })
})
