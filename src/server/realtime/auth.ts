/**
 * Authentication and Authorization
 * Task 3, Subtask 3.2: Authentication and scoping middleware
 */

import jwt from 'jsonwebtoken'
import { URL } from 'url'

export interface AuthContext {
  userId: string
  campaignId: string
  sessionId: string
  roles: string[]
}

export interface TokenOptions {
  expiresIn?: string
  issuer?: string
}

export class AuthToken {
  private static readonly DEFAULT_SECRET = 'dev-secret-change-in-production'
  private static readonly DEFAULT_EXPIRES_IN = '24h'

  /**
   * Create a JWT token from auth context
   */
  static create(context: AuthContext, options: TokenOptions = {}): string {
    this.validateContext(context)

    const payload = {
      userId: context.userId,
      campaignId: context.campaignId,
      sessionId: context.sessionId,
      roles: context.roles
    }

    const secret = process.env.JWT_SECRET || this.DEFAULT_SECRET
    const expiresIn = options.expiresIn || this.DEFAULT_EXPIRES_IN

    return jwt.sign(payload, secret, {
      expiresIn,
      issuer: options.issuer || 'startales-realtime',
      audience: 'startales-client',
      subject: context.userId
    } as jwt.SignOptions)
  }

  /**
   * Verify and decode a JWT token
   */
  static verify(token: string): AuthContext {
    if (!token || typeof token !== 'string') {
      throw new Error('Token is required and must be a string')
    }

    try {
      const secret = process.env.JWT_SECRET || this.DEFAULT_SECRET
      const decoded = jwt.verify(token, secret, {
        issuer: 'startales-realtime',
        audience: 'startales-client'
      }) as any

      const context: AuthContext = {
        userId: decoded.userId,
        campaignId: decoded.campaignId,
        sessionId: decoded.sessionId,
        roles: decoded.roles
      }

      this.validateContext(context)
      return context

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(`Invalid token: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Create a development token (simple, no encryption)
   */
  static createDev(context: AuthContext): string {
    this.validateContext(context)
    const payload = {
      ...context,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  /**
   * Verify a development token
   */
  static verifyDev(token: string): AuthContext {
    if (!token || typeof token !== 'string') {
      throw new Error('Token is required and must be a string')
    }

    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token has expired')
      }

      const context: AuthContext = {
        userId: payload.userId,
        campaignId: payload.campaignId,
        sessionId: payload.sessionId,
        roles: payload.roles
      }

      this.validateContext(context)
      return context

    } catch (error) {
      throw new Error(`Invalid development token: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate auth context
   */
  private static validateContext(context: AuthContext): void {
    if (!context || typeof context !== 'object') {
      throw new Error('Auth context is required')
    }

    if (!context.userId || typeof context.userId !== 'string') {
      throw new Error('User ID is required and must be a string')
    }

    if (!context.campaignId || typeof context.campaignId !== 'string') {
      throw new Error('Campaign ID is required and must be a string')
    }

    if (!context.sessionId || typeof context.sessionId !== 'string') {
      throw new Error('Session ID is required and must be a string')
    }

    if (!Array.isArray(context.roles) || context.roles.length === 0) {
      throw new Error('Roles must be a non-empty array')
    }

    if (!context.roles.every(role => typeof role === 'string' && role.length > 0)) {
      throw new Error('All roles must be non-empty strings')
    }
  }
}

/**
 * Parse authentication token from WebSocket connection
 */
export function parseAuthToken(url?: string | null, headers?: Record<string, any>): AuthContext {
  let token: string | undefined

  // Try to get token from Authorization header first
  if (headers?.authorization) {
    const authHeader = headers.authorization
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
  }

  // Fallback to query parameter
  if (!token && url) {
    try {
      const parsedUrl = new URL(url, 'ws://localhost')
      token = parsedUrl.searchParams.get('token') || undefined
    } catch (error) {
      // Invalid URL, ignore
    }
  }

  if (!token) {
    throw new Error('Authentication token is required')
  }

  // Use development token verification in dev mode
  const isDev = process.env.NODE_ENV === 'development' || process.env.DEV_AUTH === 'true'
  
  try {
    return isDev ? AuthToken.verifyDev(token) : AuthToken.verify(token)
  } catch (error) {
    // If JWT verification fails in dev mode, try dev token
    if (isDev) {
      try {
        return AuthToken.verifyDev(token)
      } catch {
        // Fall through to original error
      }
    }
    throw error
  }
}

/**
 * Check if user has required role
 */
export function hasRole(context: AuthContext, role: string): boolean {
  return context.roles.includes(role)
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(context: AuthContext, roles: string[]): boolean {
  return roles.some(role => context.roles.includes(role))
}

/**
 * Check if user has all required roles
 */
export function hasAllRoles(context: AuthContext, roles: string[]): boolean {
  return roles.every(role => context.roles.includes(role))
}

/**
 * Check if user can access campaign
 */
export function canAccessCampaign(context: AuthContext, campaignId: string): boolean {
  return context.campaignId === campaignId
}

/**
 * Check if user can access session
 */
export function canAccessSession(context: AuthContext, sessionId: string): boolean {
  return context.sessionId === sessionId
}

/**
 * Create a simple auth context for testing
 */
export function createTestAuthContext(overrides: Partial<AuthContext> = {}): AuthContext {
  return {
    userId: 'test-user-1',
    campaignId: 'test-campaign-1',
    sessionId: 'test-session-1',
    roles: ['player'],
    ...overrides
  }
}
