/**
 * Realtime WebSocket Gateway Server
 * Task 3, Subtask 3.2: Gateway class and server implementation
 */

import { WebSocketServer, WebSocket } from 'ws'
import { createServer, Server as HttpServer } from 'http'
import { EventEmitter } from 'events'
import type { IncomingMessage } from 'http'
import { RealtimeConfig } from './config.js'
import { RateLimiter } from './rateLimiter.js'
import { ExponentialBackoff } from './backoff.js'
import { AuthContext, parseAuthToken } from './auth.js'
import { ChannelManager } from './channels.js'
import { PresenceManager } from './presence.js'
import { MessageRouter } from './messageRouter.js'
import { Logger, createLogger } from './logger.js'
import { MetricsCollector } from './metrics.js'
import { AdminServer } from './admin.js'

export interface ConnectionInfo {
  id: string
  ws: WebSocket
  auth: AuthContext
  rateLimiter: RateLimiter
  sendQueue: any[]
  lastSeen: number
  reconnectToken?: string
  channels: Set<string>
}

export interface RealtimeGatewayOptions extends Partial<RealtimeConfig> {
  httpServer?: HttpServer
}

export class RealtimeGateway extends EventEmitter {
  private wss: WebSocketServer
  private httpServer: HttpServer
  private config: RealtimeConfig
  private connections = new Map<WebSocket, ConnectionInfo>()
  private connectionsByToken = new Map<string, ConnectionInfo>()
  private channelManager: ChannelManager
  private presenceManager: PresenceManager
  private messageRouter: MessageRouter
  private logger: Logger
  private metrics: MetricsCollector
  private adminServer?: AdminServer
  private heartbeatInterval?: NodeJS.Timeout
  private cleanupInterval?: NodeJS.Timeout
  private isClosing = false

  constructor(httpServer?: HttpServer, options: RealtimeGatewayOptions = {}) {
    super()
    
    // Merge config with options
    this.config = {
      port: 3001,
      rateLimitPerSec: 10,
      heartbeatMs: 30000,
      backpressureLimit: 100,
      reconnectTtl: 300000,
      devAuth: true,
      jwtSecret: 'dev-secret',
      maxFrameSize: 1048576,
      maxConnections: 1000,
      logLevel: 'info',
      logDir: './logs',
      enableMetrics: true,
      ...options
    }

    // Create or use provided HTTP server
    this.httpServer = httpServer || createServer()
    
    // Initialize components
    this.logger = createLogger(this.config)
    this.metrics = new MetricsCollector(this.config)
    this.channelManager = new ChannelManager(this.logger)
    this.presenceManager = new PresenceManager(this.logger)
    this.messageRouter = new MessageRouter(this.channelManager, this.presenceManager, this.logger)
    
    // Create WebSocket server
    this.wss = new WebSocketServer({
      server: this.httpServer,
      path: '/ws',
      maxPayload: this.config.maxFrameSize,
      perMessageDeflate: true
    })

    // Setup event handlers
    this.setupWebSocketHandlers()
    this.setupHeartbeat()
    this.setupCleanup()
    
    // Setup admin server if enabled
    if (this.config.adminPort && this.config.devAuth) {
      this.adminServer = new AdminServer(this.config.adminPort, this)
    }

    this.logger.info('Realtime Gateway initialized', {
      port: this.config.port,
      maxConnections: this.config.maxConnections,
      heartbeatMs: this.config.heartbeatMs,
      rateLimitPerSec: this.config.rateLimitPerSec
    })
  }

  /**
   * Start the gateway server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpServer.listening) {
        this.httpServer.listen(this.config.port, (err?: Error) => {
          if (err) {
            reject(err)
          } else {
            this.logger.info('Realtime Gateway started', { port: this.config.port })
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * Stop the gateway server
   */
  async close(): Promise<void> {
    this.isClosing = true
    
    // Clear intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }

    // Close admin server
    if (this.adminServer) {
      await this.adminServer.close()
    }

    // Close all WebSocket connections
    for (const [ws, info] of this.connections) {
      ws.close(1001, 'Server shutting down')
    }

    // Close WebSocket server
    await new Promise<void>((resolve) => {
      this.wss.close(() => {
        resolve()
      })
    })

    // Close HTTP server if we created it
    if (!this.httpServer.listening) {
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => {
          resolve()
        })
      })
    }

    this.logger.info('Realtime Gateway stopped')
  }

  /**
   * Get current connection count
   */
  getConnectionCount(): number {
    return this.connections.size
  }

  /**
   * Get connection info for debugging
   */
  getConnections(): ConnectionInfo[] {
    return Array.from(this.connections.values())
  }

  /**
   * Get channel information
   */
  getChannels() {
    return this.channelManager.getChannels()
  }

  /**
   * Get presence information
   */
  getPresence() {
    // Return all presence info across all channels
    const allChannels = this.channelManager.getChannels()
    const allPresence: any[] = []
    
    for (const channel of allChannels) {
      const channelPresence = this.presenceManager.getPresence(channel.id)
      allPresence.push(...channelPresence)
    }
    
    return allPresence
  }

  /**
   * Get metrics
   */
  getMetrics() {
    return this.metrics.getMetrics()
  }

  /**
   * Setup WebSocket connection handlers
   */
  private setupWebSocketHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req)
    })

    this.wss.on('error', (error) => {
      this.logger.error('WebSocket server error', { error: error.message })
      this.emit('error', error)
    })
  }

  /**
   * Handle new WebSocket connection
   */
  private async handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    try {
      // Check connection limit
      if (this.connections.size >= this.config.maxConnections) {
        ws.close(4000, 'Connection limit exceeded')
        this.metrics.increment('connections_rejected_limit')
        return
      }

      // Parse authentication
      const auth = parseAuthToken(req.url, req.headers)
      
      // Create connection info
      const connectionInfo: ConnectionInfo = {
        id: this.generateConnectionId(),
        ws,
        auth,
        rateLimiter: new RateLimiter(this.config.rateLimitPerSec, 1000),
        sendQueue: [],
        lastSeen: Date.now(),
        channels: new Set()
      }

      // Store connection
      this.connections.set(ws, connectionInfo)
      this.connectionsByToken.set(connectionInfo.id, connectionInfo)

      // Setup connection handlers
      this.setupConnectionHandlers(ws, connectionInfo)

      // Send welcome message
      this.sendToConnection(connectionInfo, {
        type: 'welcome',
        ts: Date.now(),
        sessionId: auth.sessionId,
        campaignId: auth.campaignId,
        v: 1,
        payload: {
          type: 'welcome',
          connectionId: connectionInfo.id,
          serverTime: Date.now()
        }
      })

      this.logger.info('Connection established', {
        connectionId: connectionInfo.id,
        userId: auth.userId,
        campaignId: auth.campaignId,
        sessionId: auth.sessionId
      })

      this.metrics.increment('connections_established')
      this.emit('connection', connectionInfo)

    } catch (error) {
      this.logger.warn('Connection rejected', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        url: req.url 
      })
      ws.close(4001, 'Authentication failed')
      this.metrics.increment('connections_rejected_auth')
    }
  }

  /**
   * Setup handlers for a specific connection
   */
  private setupConnectionHandlers(ws: WebSocket, info: ConnectionInfo): void {
    ws.on('message', (data: Buffer) => {
      this.handleMessage(info, data)
    })

    ws.on('pong', () => {
      info.lastSeen = Date.now()
      this.metrics.increment('heartbeat_pongs')
    })

    ws.on('close', (code: number, reason: Buffer) => {
      this.handleDisconnection(info, code, reason.toString())
    })

    ws.on('error', (error: Error) => {
      this.logger.warn('Connection error', {
        connectionId: info.id,
        error: error.message
      })
      this.metrics.increment('connection_errors')
    })
  }

  /**
   * Handle incoming message from connection
   */
  private async handleMessage(info: ConnectionInfo, data: Buffer): Promise<void> {
    info.lastSeen = Date.now()

    // Rate limiting
    if (!info.rateLimiter.consume()) {
      this.sendError(info, 4003, 'Rate limit exceeded')
      this.metrics.increment('messages_rate_limited')
      return
    }

    try {
      // Parse and route message
      const message = JSON.parse(data.toString())
      await this.messageRouter.routeMessage(info, message)
      this.metrics.increment('messages_processed')
      
    } catch (error) {
      this.logger.warn('Message processing error', {
        connectionId: info.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      this.sendError(info, 4005, 'Invalid message format')
      this.metrics.increment('messages_invalid')
    }
  }

  /**
   * Handle connection disconnection
   */
  private handleDisconnection(info: ConnectionInfo, code: number, reason: string): void {
    // Remove from maps
    this.connections.delete(info.ws)
    this.connectionsByToken.delete(info.id)

    // Leave all channels
    for (const channelStr of info.channels) {
      try {
        const channelId = JSON.parse(channelStr)
        this.channelManager.leave(channelId, info.id)
        this.presenceManager.leave(channelId, info.id)
      } catch (error) {
        // Invalid channel format, skip
        this.logger.warn('Invalid channel format during disconnect', {
          connectionId: info.id,
          channelStr
        })
      }
    }

    // Generate reconnect token if not a clean disconnect
    if (code !== 1000 && code !== 1001) {
      info.reconnectToken = this.generateReconnectToken(info)
      // Store for reconnect TTL (simplified - in production use Redis)
      setTimeout(() => {
        delete info.reconnectToken
      }, this.config.reconnectTtl)
    }

    this.logger.info('Connection closed', {
      connectionId: info.id,
      code,
      reason,
      reconnectToken: !!info.reconnectToken
    })

    this.metrics.increment('connections_closed')
    this.emit('disconnection', info, code, reason)
  }

  /**
   * Send message to specific connection
   */
  private sendToConnection(info: ConnectionInfo, message: any): void {
    if (info.ws.readyState === WebSocket.OPEN) {
      try {
        const serialized = JSON.stringify(message)
        info.ws.send(serialized)
        this.metrics.increment('messages_sent')
      } catch (error) {
        this.logger.warn('Failed to send message', {
          connectionId: info.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  }

  /**
   * Send error message to connection
   */
  private sendError(info: ConnectionInfo, code: number, message: string, details?: any): void {
    this.sendToConnection(info, {
      type: 'error',
      ts: Date.now(),
      sessionId: info.auth.sessionId,
      campaignId: info.auth.campaignId,
      v: 1,
      payload: {
        type: 'error',
        code,
        message,
        details
      }
    })
  }

  /**
   * Setup heartbeat mechanism
   */
  private setupHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isClosing) return

      const now = Date.now()
      const timeout = this.config.heartbeatMs * 2

      for (const [ws, info] of this.connections) {
        if (now - info.lastSeen > timeout) {
          // Connection is idle, close it
          ws.close(4002, 'Idle timeout')
          this.metrics.increment('connections_idle_timeout')
        } else if (ws.readyState === WebSocket.OPEN) {
          // Send ping
          ws.ping()
          this.metrics.increment('heartbeat_pings')
        }
      }
    }, this.config.heartbeatMs)
  }

  /**
   * Setup periodic cleanup
   */
  private setupCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      if (this.isClosing) return

      // Clean up closed connections
      for (const [ws, info] of this.connections) {
        if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
          this.connections.delete(ws)
          this.connectionsByToken.delete(info.id)
        }
      }

      // Clean up empty channels
      this.channelManager.cleanup()
      this.presenceManager.cleanup()

    }, 60000) // Every minute
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate reconnect token
   */
  private generateReconnectToken(info: ConnectionInfo): string {
    return `reconnect_${info.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
