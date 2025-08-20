/**
 * Comprehensive test suite for WebSocket Gateway
 * Task 3, Subtask 3.1: Define acceptance tests for WebSocket gateway (unit + integration)
 * 
 * Test Cases:
 * - TC010: Zod schema validation for message types
 * - TC011: Rate limiter blocks excess messages per connection
 * - TC012: Exponential backoff function yields expected sequence with jitter
 * - TC013: Auth required—unauthorized handshake rejected; authorized connects succeed
 * - TC002: Channel membership enforced—publish blocked if not a member; allowed after join
 * - TC014: Presence events broadcast join/leave to relevant channels
 * - TC015: Heartbeat—server pings, client must pong; idle disconnect; reconnect token restores subscriptions
 * - TC016: Backpressure—server buffers capped; slow consumer triggers pause/drop policy
 * - TC017: Sustain 100 concurrent local clients for 30s without error
 */

import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/testing-library/jest-dom'
import WebSocket from 'ws'
import { createServer } from 'http'
import { AddressInfo } from 'net'
import { RealtimeGateway } from '../server'
import { MessageEnvelope, JoinMessage, LeaveMessage, VoiceMetaMessage, CaptionMessage, ActionMessage, TickerUpdateMessage, CrdtSyncMessage } from '../../../shared/realtime/schemas'
import { RateLimiter } from '../rateLimiter'
import { ExponentialBackoff } from '../backoff'
import { AuthToken } from '../auth'

describe('WebSocket Gateway', () => {
  let server: any
  let gateway: RealtimeGateway
  let port: number
  let wsUrl: string

  beforeAll(async () => {
    server = createServer()
    gateway = new RealtimeGateway(server, {
      heartbeatMs: 1000,
      rateLimitPerSec: 10,
      backpressureLimit: 100,
      reconnectTtl: 30000,
      devAuth: true
    })
    
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port
        wsUrl = `ws://localhost:${port}/ws`
        resolve()
      })
    })
  })

  afterAll(async () => {
    await gateway.close()
    server.close()
  })

  describe('TC010: Zod Schema Validation', () => {
    test('should validate join message successfully', () => {
      const validJoin: JoinMessage = {
        type: 'join',
        channel: { kind: 'room', key: 'lobby' },
        metadata: {}
      }
      
      const envelope: MessageEnvelope = {
        type: 'join',
        ts: Date.now(),
        sessionId: 'test-session',
        campaignId: 'test-campaign',
        v: 1,
        payload: validJoin
      }

      expect(() => MessageEnvelope.parse(envelope)).not.toThrow()
    })

    test('should reject invalid message types', () => {
      const invalidMessage = {
        type: 'invalid-type',
        ts: Date.now(),
        sessionId: 'test-session',
        campaignId: 'test-campaign',
        v: 1,
        payload: {}
      }

      expect(() => MessageEnvelope.parse(invalidMessage)).toThrow()
    })

    test('should validate all message types', () => {
      const messageTypes = [
        { type: 'join', payload: { type: 'join', channel: { kind: 'room', key: 'test' }, metadata: {} } },
        { type: 'leave', payload: { type: 'leave', channel: { kind: 'room', key: 'test' } } },
        { type: 'voice-meta', payload: { type: 'voice-meta', speaking: true, volume: 0.8 } },
        { type: 'caption', payload: { type: 'caption', text: 'Hello world', language: 'en' } },
        { type: 'action', payload: { type: 'action', actionType: 'move', data: { x: 10, y: 20 } } },
        { type: 'ticker-update', payload: { type: 'ticker-update', event: 'market-change', data: {} } },
        { type: 'crdt-sync', payload: { type: 'crdt-sync', docId: 'doc1', operation: 'update', data: {} } }
      ]

      messageTypes.forEach(({ type, payload }) => {
        const envelope = {
          type,
          ts: Date.now(),
          sessionId: 'test-session',
          campaignId: 'test-campaign',
          v: 1,
          payload
        }
        expect(() => MessageEnvelope.parse(envelope)).not.toThrow()
      })
    })
  })

  describe('TC011: Rate Limiting', () => {
    test('should allow messages within rate limit', () => {
      const rateLimiter = new RateLimiter(5, 1000) // 5 messages per second
      
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.consume()).toBe(true)
      }
    })

    test('should block messages exceeding rate limit', () => {
      const rateLimiter = new RateLimiter(5, 1000)
      
      // Consume all tokens
      for (let i = 0; i < 5; i++) {
        rateLimiter.consume()
      }
      
      // Next message should be blocked
      expect(rateLimiter.consume()).toBe(false)
    })

    test('should refill tokens after window', async () => {
      const rateLimiter = new RateLimiter(2, 100) // 2 messages per 100ms
      
      // Consume all tokens
      expect(rateLimiter.consume()).toBe(true)
      expect(rateLimiter.consume()).toBe(true)
      expect(rateLimiter.consume()).toBe(false)
      
      // Wait for refill
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Should be able to consume again
      expect(rateLimiter.consume()).toBe(true)
    })
  })

  describe('TC012: Exponential Backoff', () => {
    test('should generate expected backoff sequence', () => {
      const backoff = new ExponentialBackoff({
        baseMs: 100,
        maxMs: 5000,
        jitterFactor: 0
      })

      expect(backoff.next()).toBe(100)
      expect(backoff.next()).toBe(200)
      expect(backoff.next()).toBe(400)
      expect(backoff.next()).toBe(800)
      expect(backoff.next()).toBe(1600)
      expect(backoff.next()).toBe(3200)
      expect(backoff.next()).toBe(5000) // capped at maxMs
    })

    test('should add jitter when configured', () => {
      const backoff = new ExponentialBackoff({
        baseMs: 100,
        maxMs: 5000,
        jitterFactor: 0.1
      })

      const delay1 = backoff.next()
      const delay2 = backoff.next()
      
      // Should be close to expected values but with jitter
      expect(delay1).toBeGreaterThanOrEqual(90)
      expect(delay1).toBeLessThanOrEqual(110)
      expect(delay2).toBeGreaterThanOrEqual(180)
      expect(delay2).toBeLessThanOrEqual(220)
    })

    test('should reset backoff', () => {
      const backoff = new ExponentialBackoff({ baseMs: 100, maxMs: 5000 })
      
      backoff.next() // 100
      backoff.next() // 200
      backoff.reset()
      
      expect(backoff.next()).toBe(100)
    })
  })

  describe('TC013: Authentication', () => {
    test('should reject unauthorized connections', async () => {
      const ws = new WebSocket(wsUrl)
      
      await new Promise<void>((resolve) => {
        ws.on('close', (code) => {
          expect(code).toBe(4001) // Auth error
          resolve()
        })
      })
    })

    test('should accept authorized connections', async () => {
      const token = AuthToken.create({
        userId: 'user1',
        campaignId: 'campaign1',
        sessionId: 'session1',
        roles: ['player']
      })
      
      const ws = new WebSocket(`${wsUrl}?token=${token}`)
      
      await new Promise<void>((resolve) => {
        ws.on('open', () => {
          resolve()
        })
        ws.on('close', (code) => {
          if (code === 4001) {
            throw new Error('Should not reject valid token')
          }
        })
      })
      
      ws.close()
    })

    test('should reject malformed tokens', async () => {
      const ws = new WebSocket(`${wsUrl}?token=invalid-token`)
      
      await new Promise<void>((resolve) => {
        ws.on('close', (code) => {
          expect(code).toBe(4001)
          resolve()
        })
      })
    })
  })

  describe('TC002: Channel Membership Enforcement', () => {
    let ws1: WebSocket, ws2: WebSocket, ws3: WebSocket
    let token1: string, token2: string, token3: string

    beforeEach(async () => {
      token1 = AuthToken.create({ userId: 'user1', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      token2 = AuthToken.create({ userId: 'user2', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      token3 = AuthToken.create({ userId: 'user3', campaignId: 'campaign2', sessionId: 'session2', roles: ['player'] })

      ws1 = new WebSocket(`${wsUrl}?token=${token1}`)
      ws2 = new WebSocket(`${wsUrl}?token=${token2}`)
      ws3 = new WebSocket(`${wsUrl}?token=${token3}`)

      await Promise.all([
        new Promise(resolve => ws1.on('open', resolve)),
        new Promise(resolve => ws2.on('open', resolve)),
        new Promise(resolve => ws3.on('open', resolve))
      ])
    })

    afterEach(() => {
      ws1?.close()
      ws2?.close()
      ws3?.close()
    })

    test('should block publish without membership', async () => {
      const message = {
        type: 'caption',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        channel: { kind: 'room', key: 'private-room' },
        v: 1,
        payload: { type: 'caption', text: 'Hello', language: 'en' }
      }

      ws1.send(JSON.stringify(message))

      await new Promise<void>((resolve) => {
        ws1.on('message', (data) => {
          const response = JSON.parse(data.toString())
          if (response.type === 'error' && response.code === 4004) { // membership error
            resolve()
          }
        })
      })
    })

    test('should allow publish after joining channel', async () => {
      // Join channel
      const joinMessage = {
        type: 'join',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        v: 1,
        payload: { type: 'join', channel: { kind: 'room', key: 'test-room' }, metadata: {} }
      }

      ws1.send(JSON.stringify(joinMessage))
      ws2.send(JSON.stringify({ ...joinMessage, sessionId: 'session1' }))

      // Wait for join confirmations
      await Promise.all([
        new Promise(resolve => {
          ws1.on('message', (data) => {
            const msg = JSON.parse(data.toString())
            if (msg.type === 'joined') resolve(null)
          })
        }),
        new Promise(resolve => {
          ws2.on('message', (data) => {
            const msg = JSON.parse(data.toString())
            if (msg.type === 'joined') resolve(null)
          })
        })
      ])

      // Send message
      const captionMessage = {
        type: 'caption',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        channel: { kind: 'room', key: 'test-room' },
        v: 1,
        payload: { type: 'caption', text: 'Hello room!', language: 'en' }
      }

      ws1.send(JSON.stringify(captionMessage))

      // ws2 should receive the message
      await new Promise<void>((resolve) => {
        ws2.on('message', (data) => {
          const msg = JSON.parse(data.toString())
          if (msg.type === 'caption' && msg.payload.text === 'Hello room!') {
            resolve()
          }
        })
      })
    })

    test('should not distribute to non-members', async () => {
      // ws1 and ws2 join room, ws3 does not
      const joinMessage = {
        type: 'join',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        v: 1,
        payload: { type: 'join', channel: { kind: 'room', key: 'exclusive-room' }, metadata: {} }
      }

      ws1.send(JSON.stringify(joinMessage))
      ws2.send(JSON.stringify({ ...joinMessage, sessionId: 'session1' }))

      // Send message from ws1
      const message = {
        type: 'caption',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        channel: { kind: 'room', key: 'exclusive-room' },
        v: 1,
        payload: { type: 'caption', text: 'Secret message', language: 'en' }
      }

      let ws3ReceivedMessage = false
      ws3.on('message', (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.type === 'caption' && msg.payload.text === 'Secret message') {
          ws3ReceivedMessage = true
        }
      })

      ws1.send(JSON.stringify(message))

      // Wait and verify ws3 didn't receive it
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(ws3ReceivedMessage).toBe(false)
    })
  })

  describe('TC014: Presence Events', () => {
    test('should broadcast join/leave events to channel members', async () => {
      const token1 = AuthToken.create({ userId: 'user1', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      const token2 = AuthToken.create({ userId: 'user2', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })

      const ws1 = new WebSocket(`${wsUrl}?token=${token1}`)
      const ws2 = new WebSocket(`${wsUrl}?token=${token2}`)

      await Promise.all([
        new Promise(resolve => ws1.on('open', resolve)),
        new Promise(resolve => ws2.on('open', resolve))
      ])

      // ws1 joins channel
      const joinMessage = {
        type: 'join',
        ts: Date.now(),
        sessionId: 'session1',
        campaignId: 'campaign1',
        v: 1,
        payload: { type: 'join', channel: { kind: 'room', key: 'presence-test' }, metadata: { username: 'User1' } }
      }

      ws1.send(JSON.stringify(joinMessage))
      ws2.send(JSON.stringify({ ...joinMessage, payload: { ...joinMessage.payload, metadata: { username: 'User2' } } }))

      // Both should receive presence events
      const presenceEvents: any[] = []
      
      ws1.on('message', (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.type === 'presence') presenceEvents.push(msg)
      })

      ws2.on('message', (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.type === 'presence') presenceEvents.push(msg)
      })

      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(presenceEvents.length).toBeGreaterThan(0)
      
      ws1.close()
      ws2.close()
    })
  })

  describe('TC015: Heartbeat and Reconnect', () => {
    test('should disconnect idle clients', async () => {
      const token = AuthToken.create({ userId: 'user1', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      const ws = new WebSocket(`${wsUrl}?token=${token}`)

      await new Promise(resolve => ws.on('open', resolve))

      // Don't respond to pings - should be disconnected
      let disconnected = false
      ws.on('close', (code) => {
        expect(code).toBe(4002) // idle timeout
        disconnected = true
      })

      // Wait for heartbeat timeout (configured as 1000ms in test setup)
      await new Promise(resolve => setTimeout(resolve, 2500))
      expect(disconnected).toBe(true)
    })

    test('should maintain connection with proper pong responses', async () => {
      const token = AuthToken.create({ userId: 'user1', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      const ws = new WebSocket(`${wsUrl}?token=${token}`)

      await new Promise(resolve => ws.on('open', resolve))

      // Respond to pings
      ws.on('ping', () => {
        ws.pong()
      })

      let disconnected = false
      ws.on('close', () => {
        disconnected = true
      })

      // Wait longer than heartbeat timeout
      await new Promise(resolve => setTimeout(resolve, 2500))
      expect(disconnected).toBe(false)
      
      ws.close()
    })
  })

  describe('TC016: Backpressure Control', () => {
    test('should handle slow consumers gracefully', async () => {
      const token = AuthToken.create({ userId: 'user1', campaignId: 'campaign1', sessionId: 'session1', roles: ['player'] })
      const ws = new WebSocket(`${wsUrl}?token=${token}`)

      await new Promise(resolve => ws.on('open', resolve))

      // Simulate slow consumer by not reading messages
      let messageCount = 0
      ws.on('message', () => {
        messageCount++
        // Don't process messages to create backpressure
      })

      // Send many messages rapidly
      for (let i = 0; i < 200; i++) {
        const message = {
          type: 'ticker-update',
          ts: Date.now(),
          sessionId: 'session1',
          campaignId: 'campaign1',
          v: 1,
          payload: { type: 'ticker-update', event: `update-${i}`, data: {} }
        }
        ws.send(JSON.stringify(message))
      }

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should receive backpressure notification
      let receivedBackpressureNotification = false
      ws.on('message', (data) => {
        const msg = JSON.parse(data.toString())
        if (msg.type === 'backpressure-warning') {
          receivedBackpressureNotification = true
        }
      })

      expect(receivedBackpressureNotification).toBe(true)
      ws.close()
    })
  })

  describe('TC017: Performance and Load Test', () => {
    test('should sustain 100 concurrent clients', async () => {
      const clients: WebSocket[] = []
      const tokens = Array.from({ length: 100 }, (_, i) => 
        AuthToken.create({ 
          userId: `user${i}`, 
          campaignId: 'load-test', 
          sessionId: 'session1', 
          roles: ['player'] 
        })
      )

      // Connect all clients
      for (let i = 0; i < 100; i++) {
        const ws = new WebSocket(`${wsUrl}?token=${tokens[i]}`)
        clients.push(ws)
        
        await new Promise(resolve => {
          ws.on('open', resolve)
          ws.on('error', (err) => {
            throw new Error(`Client ${i} failed to connect: ${err.message}`)
          })
        })
      }

      // Send messages from random clients
      let messagesReceived = 0
      const expectedMessages = 500

      clients.forEach(ws => {
        ws.on('message', () => {
          messagesReceived++
        })
      })

      // Send messages
      for (let i = 0; i < expectedMessages; i++) {
        const randomClient = clients[Math.floor(Math.random() * clients.length)]
        const message = {
          type: 'caption',
          ts: Date.now(),
          sessionId: 'session1',
          campaignId: 'load-test',
          v: 1,
          payload: { type: 'caption', text: `Message ${i}`, language: 'en' }
        }
        randomClient.send(JSON.stringify(message))
        
        // Small delay to avoid overwhelming
        if (i % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }

      // Wait for message propagation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Should have >95% delivery rate
      const deliveryRate = messagesReceived / (expectedMessages * 99) // 99 because sender doesn't receive own message
      expect(deliveryRate).toBeGreaterThan(0.95)

      // Cleanup
      clients.forEach(ws => ws.close())
    }, 60000) // 60 second timeout for load test
  })
})
