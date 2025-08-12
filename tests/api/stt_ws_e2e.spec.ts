import { describe, it, expect } from 'vitest'
import http from 'http'
import WebSocket from 'ws'
import express from 'express'
import cors from 'cors'
import { audioRouter } from '../../src/server/routes/audio'
import { createGateway } from '../../src/server/ws/gateway'
import { wsHub } from '../../src/server/ws/hub'
import { registerSTTProvider } from '../../src/server/llm/factory'
import { WhisperSTTProvider } from '../../src/server/llm/providers/whisper'

describe('E2E STT → WS caption broadcast', () => {
  it('posts audio and receives caption over websocket', async () => {
    const app = express()
    app.use(cors())
    app.use('/api/audio', audioRouter)
    // Register stub STT provider used by audio router
    registerSTTProvider(new WhisperSTTProvider())

    const server = http.createServer(app)
    const wss = createGateway(server, { heartbeatMs: 2000, ratePerSec: 10 })
    await new Promise<void>(resolve => server.listen(0, resolve))
    const port = (server.address() as any).port

    // Bridge wsHub to actual clients on this wss
    wsHub.setBroadcaster((campaignId, message) => {
      for (const client of (wss.clients as unknown as Set<WebSocket>)) {
        try {
          client.send(JSON.stringify({ type: 'server-broadcast', campaignId, payload: message }))
        } catch {}
      }
    })

    const url = `ws://127.0.0.1:${port}/ws`
    const client = new WebSocket(url)

    const received = new Promise<any>((resolve, reject) => {
      const to = setTimeout(() => reject(new Error('timeout')), 4000)
      client.on('open', async () => {
        client.send(JSON.stringify({ type: 'join', campaignId: 'e2e' }))
        // Trigger STT by posting fake bytes
        const body = Buffer.alloc(10_000, 0)
        const res = await fetch(`http://127.0.0.1:${port}/api/audio/stt?campaignId=e2e`, {
          method: 'POST',
          headers: { 'Content-Type': 'audio/wav' },
          body,
        })
        expect(res.ok).toBe(true)
      })
      client.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString())
          if (msg?.type === 'server-broadcast' && msg?.campaignId === 'e2e' && msg?.payload?.type === 'caption') {
            clearTimeout(to)
            resolve(msg.payload)
          }
        } catch {}
      })
    })

    const payload = await received
    expect(payload.text).toBeTypeOf('string')
    client.close()
    server.close()
  })
})


