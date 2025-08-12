import { describe, it, expect } from 'vitest'
import http from 'http'
import WebSocket from 'ws'
import express from 'express'
import cors from 'cors'
import { createGateway } from '../../src/server/ws/gateway'
import { wsHub } from '../../src/server/ws/hub'

describe('WebSocket gateway integration', () => {
  it('connects, joins, and receives a server broadcast', async () => {
    const app = express()
    app.use(cors())
    const server = http.createServer(app)
    const wss = createGateway(server, { heartbeatMs: 2000, ratePerSec: 10 })
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port

    const url = `ws://127.0.0.1:${port}/ws`
    const client = new WebSocket(url)

    const received = new Promise<any>((resolve, reject) => {
      const to = setTimeout(() => reject(new Error('timeout waiting for broadcast')), 2000)
      client.on('open', () => {
        client.send(JSON.stringify({ type: 'join', campaignId: 'test' }))
        // register broadcaster and emit
        wsHub.setBroadcaster((campaignId, message) => {
          for (const c of (wss.clients as unknown as Set<WebSocket>)) {
            // minimal envelope
            c.send(JSON.stringify({ ...message, campaignId }))
          }
        })
        wsHub.broadcast('test', { type: 'caption', text: 'hello' })
      })
      client.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString())
          if (msg?.type === 'caption' && msg?.text === 'hello') {
            clearTimeout(to)
            resolve(msg)
          }
        } catch {
          // ignore
        }
      })
    })

    const msg = await received
    expect(msg.text).toBe('hello')
    client.close()
    server.close()
  })
})


