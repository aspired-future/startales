/**
 * Admin Server
 * Task 3, Subtask 3.16: Admin and observability endpoints (dev)
 */

import { createServer, Server } from 'http'
import type { RealtimeGateway } from './server.js'

export class AdminServer {
  private server: Server

  constructor(
    private port: number,
    private gateway: RealtimeGateway
  ) {
    this.server = createServer((req, res) => {
      this.handleRequest(req, res)
    })
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err?: Error) => {
        if (err) {
          reject(err)
        } else {
          console.log(`Admin server listening on port ${this.port}`)
          resolve()
        }
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        resolve()
      })
    })
  }

  private handleRequest(req: any, res: any): void {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')

    const url = new URL(req.url!, `http://localhost:${this.port}`)

    try {
      switch (url.pathname) {
        case '/health':
          this.handleHealth(res)
          break
        case '/metrics':
          this.handleMetrics(res)
          break
        case '/connections':
          this.handleConnections(res)
          break
        case '/channels':
          this.handleChannels(res)
          break
        case '/presence':
          this.handlePresence(res)
          break
        default:
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Not found' }))
      }
    } catch (error) {
      res.statusCode = 500
      res.end(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }))
    }
  }

  private handleHealth(res: any): void {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      connections: this.gateway.getConnectionCount()
    }
    res.end(JSON.stringify(health))
  }

  private handleMetrics(res: any): void {
    const metrics = this.gateway.getMetrics()
    res.end(JSON.stringify(metrics))
  }

  private handleConnections(res: any): void {
    const connections = this.gateway.getConnections().map(conn => ({
      id: conn.id,
      userId: conn.auth.userId,
      campaignId: conn.auth.campaignId,
      sessionId: conn.auth.sessionId,
      lastSeen: conn.lastSeen,
      channels: Array.from(conn.channels),
      rateLimitRemaining: conn.rateLimiter.remaining()
    }))
    res.end(JSON.stringify(connections))
  }

  private handleChannels(res: any): void {
    const channels = this.gateway.getChannels()
    res.end(JSON.stringify(channels))
  }

  private handlePresence(res: any): void {
    const presence = this.gateway.getPresence()
    res.end(JSON.stringify(presence))
  }
}
