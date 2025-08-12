import { WebSocketServer, WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage } from 'http'
import { wsHub } from './hub.js'

interface ClientInfo {
  id: string
  ws: WebSocket
  campaignId?: string
  lastSeen: number
  tokens: number // simple leaky bucket
}

export interface WSGatewayOptions {
  heartbeatMs?: number
  ratePerSec?: number
}

export function createGateway(server: import('http').Server, options: WSGatewayOptions = {}) {
  const wss = new WebSocketServer({ server, path: '/ws' })
  const clients = new Map<WebSocket, ClientInfo>()
  const heartbeatMs = options.heartbeatMs ?? 15000
  const ratePerSec = options.ratePerSec ?? 10

  function refill() {
    for (const info of clients.values()) {
      info.tokens = Math.min(ratePerSec, info.tokens + ratePerSec)
    }
  }
  setInterval(refill, 1000)

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    const id = randomUUID()
    const info: ClientInfo = { id, ws, lastSeen: Date.now(), tokens: ratePerSec }
    clients.set(ws, info)
    ws.send(JSON.stringify({ type: 'welcome', id }))

    ws.on('message', (data: Buffer) => {
      info.lastSeen = Date.now()
      if (info.tokens <= 0) return // drop message; basic rate limit
      info.tokens -= 1
      try {
        const msg = JSON.parse(data.toString()) as any
        if (msg?.type === 'join' && typeof msg.campaignId === 'string') {
          info.campaignId = msg.campaignId
          ws.send(JSON.stringify({ type: 'joined', campaignId: info.campaignId }))
          return
        }
        if (msg?.type === 'leave') {
          info.campaignId = undefined
          ws.send(JSON.stringify({ type: 'left' }))
          return
        }
        if (msg?.type === 'heartbeat') {
          ws.send(JSON.stringify({ type: 'pong' }))
          return
        }
        // Broadcast captions/actions within same campaign
        if (info.campaignId && (msg?.type === 'caption' || msg?.type === 'action')) {
          for (const other of clients.values()) {
            if (other === info) continue
            if (other.campaignId === info.campaignId) {
              other.ws.send(JSON.stringify({ ...msg, from: info.id }))
            }
          }
          // Mirror to hub for server-initiated broadcasts
          wsHub.broadcast(info.campaignId, { ...msg, from: info.id })
          return
        }
      } catch {
        // ignore
      }
    })

    ws.on('close', () => {
      clients.delete(ws)
    })
  })

  // Heartbeat cleanup
  setInterval(() => {
    const now = Date.now()
    for (const info of clients.values()) {
      if (now - info.lastSeen > heartbeatMs * 2) {
        info.ws.terminate()
        clients.delete(info.ws)
      }
    }
  }, heartbeatMs)

  return wss
}


