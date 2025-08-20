/**
 * Unit tests for Zod Schemas
 * Task 3, Subtask 3.1: Schema validation tests
 */

import { describe, test, expect } from '@jest/testing-library/jest-dom'
import { 
  MessageEnvelope, 
  JoinMessage, 
  LeaveMessage, 
  VoiceMetaMessage, 
  CaptionMessage, 
  ActionMessage, 
  TickerUpdateMessage, 
  CrdtSyncMessage,
  ErrorMessage,
  ChannelId,
  parseMessage,
  serializeMessage
} from '../../../shared/realtime/schemas'

describe('Realtime Schemas', () => {
  describe('ChannelId', () => {
    test('should validate valid channel IDs', () => {
      const validChannels = [
        { kind: 'direct', key: 'user1-user2' },
        { kind: 'room', key: 'lobby' },
        { kind: 'team', key: 'red-team' },
        { kind: 'party', key: 'adventure-party-1' }
      ]

      validChannels.forEach(channel => {
        expect(() => ChannelId.parse(channel)).not.toThrow()
      })
    })

    test('should reject invalid channel kinds', () => {
      const invalidChannels = [
        { kind: 'invalid', key: 'test' },
        { kind: '', key: 'test' },
        { kind: 123, key: 'test' }
      ]

      invalidChannels.forEach(channel => {
        expect(() => ChannelId.parse(channel)).toThrow()
      })
    })

    test('should reject invalid channel keys', () => {
      const invalidChannels = [
        { kind: 'room', key: '' },
        { kind: 'room', key: 123 },
        { kind: 'room' } // missing key
      ]

      invalidChannels.forEach(channel => {
        expect(() => ChannelId.parse(channel)).toThrow()
      })
    })
  })

  describe('JoinMessage', () => {
    test('should validate valid join message', () => {
      const validJoin: JoinMessage = {
        type: 'join',
        channel: { kind: 'room', key: 'lobby' },
        metadata: { username: 'Player1', avatar: 'avatar1.png' }
      }

      expect(() => JoinMessage.parse(validJoin)).not.toThrow()
    })

    test('should allow empty metadata', () => {
      const joinWithEmptyMetadata: JoinMessage = {
        type: 'join',
        channel: { kind: 'room', key: 'lobby' },
        metadata: {}
      }

      expect(() => JoinMessage.parse(joinWithEmptyMetadata)).not.toThrow()
    })

    test('should reject invalid join message', () => {
      const invalidJoins = [
        { type: 'join' }, // missing channel
        { type: 'join', channel: { kind: 'room', key: 'lobby' } }, // missing metadata
        { type: 'join', channel: 'invalid', metadata: {} }, // invalid channel
        { type: 'invalid', channel: { kind: 'room', key: 'lobby' }, metadata: {} } // wrong type
      ]

      invalidJoins.forEach(join => {
        expect(() => JoinMessage.parse(join)).toThrow()
      })
    })
  })

  describe('LeaveMessage', () => {
    test('should validate valid leave message', () => {
      const validLeave: LeaveMessage = {
        type: 'leave',
        channel: { kind: 'room', key: 'lobby' }
      }

      expect(() => LeaveMessage.parse(validLeave)).not.toThrow()
    })

    test('should reject invalid leave message', () => {
      const invalidLeaves = [
        { type: 'leave' }, // missing channel
        { type: 'leave', channel: 'invalid' }, // invalid channel
        { type: 'invalid', channel: { kind: 'room', key: 'lobby' } } // wrong type
      ]

      invalidLeaves.forEach(leave => {
        expect(() => LeaveMessage.parse(leave)).toThrow()
      })
    })
  })

  describe('VoiceMetaMessage', () => {
    test('should validate valid voice meta message', () => {
      const validVoiceMeta: VoiceMetaMessage = {
        type: 'voice-meta',
        speaking: true,
        volume: 0.8,
        muted: false
      }

      expect(() => VoiceMetaMessage.parse(validVoiceMeta)).not.toThrow()
    })

    test('should allow optional fields', () => {
      const minimalVoiceMeta: VoiceMetaMessage = {
        type: 'voice-meta',
        speaking: false
      }

      expect(() => VoiceMetaMessage.parse(minimalVoiceMeta)).not.toThrow()
    })

    test('should validate volume range', () => {
      const invalidVolumes = [
        { type: 'voice-meta', speaking: true, volume: -0.1 },
        { type: 'voice-meta', speaking: true, volume: 1.1 },
        { type: 'voice-meta', speaking: true, volume: 'loud' }
      ]

      invalidVolumes.forEach(voiceMeta => {
        expect(() => VoiceMetaMessage.parse(voiceMeta)).toThrow()
      })
    })
  })

  describe('CaptionMessage', () => {
    test('should validate valid caption message', () => {
      const validCaption: CaptionMessage = {
        type: 'caption',
        text: 'Hello, world!',
        language: 'en',
        timestamp: Date.now()
      }

      expect(() => CaptionMessage.parse(validCaption)).not.toThrow()
    })

    test('should allow optional fields', () => {
      const minimalCaption: CaptionMessage = {
        type: 'caption',
        text: 'Hello!'
      }

      expect(() => CaptionMessage.parse(minimalCaption)).not.toThrow()
    })

    test('should reject empty text', () => {
      const invalidCaptions = [
        { type: 'caption', text: '' },
        { type: 'caption' }, // missing text
        { type: 'caption', text: 123 } // non-string text
      ]

      invalidCaptions.forEach(caption => {
        expect(() => CaptionMessage.parse(caption)).toThrow()
      })
    })
  })

  describe('ActionMessage', () => {
    test('should validate valid action message', () => {
      const validAction: ActionMessage = {
        type: 'action',
        actionType: 'move',
        data: { x: 10, y: 20, z: 5 },
        timestamp: Date.now()
      }

      expect(() => ActionMessage.parse(validAction)).not.toThrow()
    })

    test('should allow various action types', () => {
      const actionTypes = ['move', 'attack', 'cast-spell', 'use-item', 'interact']
      
      actionTypes.forEach(actionType => {
        const action: ActionMessage = {
          type: 'action',
          actionType,
          data: { test: true }
        }
        expect(() => ActionMessage.parse(action)).not.toThrow()
      })
    })

    test('should reject invalid action message', () => {
      const invalidActions = [
        { type: 'action' }, // missing actionType
        { type: 'action', actionType: '' }, // empty actionType
        { type: 'action', actionType: 'move' }, // missing data
        { type: 'action', actionType: 123, data: {} } // non-string actionType
      ]

      invalidActions.forEach(action => {
        expect(() => ActionMessage.parse(action)).toThrow()
      })
    })
  })

  describe('TickerUpdateMessage', () => {
    test('should validate valid ticker update message', () => {
      const validTicker: TickerUpdateMessage = {
        type: 'ticker-update',
        event: 'market-change',
        data: { 
          symbol: 'GOLD',
          price: 1850.50,
          change: 15.25
        },
        timestamp: Date.now()
      }

      expect(() => TickerUpdateMessage.parse(validTicker)).not.toThrow()
    })

    test('should allow various event types', () => {
      const events = ['market-change', 'news-update', 'weather-change', 'battle-result']
      
      events.forEach(event => {
        const ticker: TickerUpdateMessage = {
          type: 'ticker-update',
          event,
          data: { test: true }
        }
        expect(() => TickerUpdateMessage.parse(ticker)).not.toThrow()
      })
    })
  })

  describe('CrdtSyncMessage', () => {
    test('should validate valid CRDT sync message', () => {
      const validCrdt: CrdtSyncMessage = {
        type: 'crdt-sync',
        docId: 'document-123',
        operation: 'update',
        data: {
          ops: [{ retain: 5 }, { insert: 'Hello' }],
          version: 42
        }
      }

      expect(() => CrdtSyncMessage.parse(validCrdt)).not.toThrow()
    })

    test('should allow various operations', () => {
      const operations = ['update', 'sync', 'snapshot', 'ack']
      
      operations.forEach(operation => {
        const crdt: CrdtSyncMessage = {
          type: 'crdt-sync',
          docId: 'doc1',
          operation,
          data: { test: true }
        }
        expect(() => CrdtSyncMessage.parse(crdt)).not.toThrow()
      })
    })
  })

  describe('ErrorMessage', () => {
    test('should validate valid error message', () => {
      const validError: ErrorMessage = {
        type: 'error',
        code: 4001,
        message: 'Authentication failed',
        details: { reason: 'invalid-token' }
      }

      expect(() => ErrorMessage.parse(validError)).not.toThrow()
    })

    test('should allow optional details', () => {
      const minimalError: ErrorMessage = {
        type: 'error',
        code: 4000,
        message: 'Generic error'
      }

      expect(() => ErrorMessage.parse(minimalError)).not.toThrow()
    })

    test('should validate error codes', () => {
      const validCodes = [4000, 4001, 4002, 4003, 4004, 4005]
      
      validCodes.forEach(code => {
        const error: ErrorMessage = {
          type: 'error',
          code,
          message: 'Test error'
        }
        expect(() => ErrorMessage.parse(error)).not.toThrow()
      })
    })
  })

  describe('MessageEnvelope', () => {
    test('should validate complete message envelope', () => {
      const envelope: MessageEnvelope = {
        type: 'caption',
        ts: Date.now(),
        sessionId: 'session-123',
        campaignId: 'campaign-456',
        channel: { kind: 'room', key: 'lobby' },
        v: 1,
        payload: {
          type: 'caption',
          text: 'Hello, world!',
          language: 'en'
        }
      }

      expect(() => MessageEnvelope.parse(envelope)).not.toThrow()
    })

    test('should allow optional channel', () => {
      const envelope: MessageEnvelope = {
        type: 'ticker-update',
        ts: Date.now(),
        sessionId: 'session-123',
        campaignId: 'campaign-456',
        v: 1,
        payload: {
          type: 'ticker-update',
          event: 'global-event',
          data: {}
        }
      }

      expect(() => MessageEnvelope.parse(envelope)).not.toThrow()
    })

    test('should validate version field', () => {
      const envelope = {
        type: 'caption',
        ts: Date.now(),
        sessionId: 'session-123',
        campaignId: 'campaign-456',
        v: 'invalid', // should be number
        payload: {
          type: 'caption',
          text: 'Hello!'
        }
      }

      expect(() => MessageEnvelope.parse(envelope)).toThrow()
    })

    test('should validate required fields', () => {
      const requiredFields = ['type', 'ts', 'sessionId', 'campaignId', 'v', 'payload']
      
      requiredFields.forEach(field => {
        const envelope = {
          type: 'caption',
          ts: Date.now(),
          sessionId: 'session-123',
          campaignId: 'campaign-456',
          v: 1,
          payload: { type: 'caption', text: 'Hello!' }
        }
        
        delete (envelope as any)[field]
        expect(() => MessageEnvelope.parse(envelope)).toThrow()
      })
    })
  })

  describe('parseMessage and serializeMessage', () => {
    test('should parse and serialize round-trip', () => {
      const originalEnvelope: MessageEnvelope = {
        type: 'action',
        ts: Date.now(),
        sessionId: 'session-123',
        campaignId: 'campaign-456',
        channel: { kind: 'room', key: 'battle' },
        v: 1,
        payload: {
          type: 'action',
          actionType: 'cast-spell',
          data: { spellId: 'fireball', target: 'enemy1' }
        }
      }

      const serialized = serializeMessage(originalEnvelope)
      const parsed = parseMessage(serialized)

      expect(parsed).toEqual(originalEnvelope)
    })

    test('should handle parse errors gracefully', () => {
      const invalidJson = '{ invalid json }'
      expect(() => parseMessage(invalidJson)).toThrow()

      const validJsonInvalidSchema = JSON.stringify({ invalid: 'schema' })
      expect(() => parseMessage(validJsonInvalidSchema)).toThrow()
    })

    test('should handle serialize errors gracefully', () => {
      const invalidEnvelope = { invalid: 'envelope' } as any
      expect(() => serializeMessage(invalidEnvelope)).toThrow()
    })
  })
})
