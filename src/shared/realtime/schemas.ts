/**
 * Realtime WebSocket Message Schemas
 * Task 3, Subtask 3.3: Zod schemas and shared message types
 * 
 * Defines strict validation schemas for all WebSocket message types
 * with forward compatibility versioning and discriminated unions.
 */

import { z } from 'zod'

// Base types and utilities
export const ChannelKind = z.enum(['direct', 'room', 'team', 'party', 'alliance'])

export const ChannelId = z.object({
  kind: ChannelKind,
  key: z.string().min(1, 'Channel key cannot be empty')
})

export type ChannelId = z.infer<typeof ChannelId>

// Message payload schemas
export const JoinMessage = z.object({
  type: z.literal('join'),
  channel: ChannelId,
  metadata: z.record(z.any()).default({})
})

export const LeaveMessage = z.object({
  type: z.literal('leave'),
  channel: ChannelId
})

export const VoiceMetaMessage = z.object({
  type: z.literal('voice-meta'),
  speaking: z.boolean(),
  volume: z.number().min(0).max(1).optional(),
  muted: z.boolean().optional(),
  audioDevice: z.string().optional()
})

export const CaptionMessage = z.object({
  type: z.literal('caption'),
  text: z.string().min(1, 'Caption text cannot be empty'),
  language: z.string().optional(),
  timestamp: z.number().optional(),
  confidence: z.number().min(0).max(1).optional()
})

export const ActionMessage = z.object({
  type: z.literal('action'),
  actionType: z.string().min(1, 'Action type cannot be empty'),
  data: z.record(z.any()),
  timestamp: z.number().optional(),
  targetId: z.string().optional()
})

export const TickerUpdateMessage = z.object({
  type: z.literal('ticker-update'),
  event: z.string().min(1, 'Event type cannot be empty'),
  data: z.record(z.any()),
  timestamp: z.number().optional(),
  priority: z.enum(['low', 'normal', 'high']).default('normal')
})

export const CrdtSyncMessage = z.object({
  type: z.literal('crdt-sync'),
  docId: z.string().min(1, 'Document ID cannot be empty'),
  operation: z.enum(['update', 'sync', 'snapshot', 'ack']),
  data: z.record(z.any()),
  version: z.number().optional(),
  clientId: z.string().optional()
})

export const PresenceMessage = z.object({
  type: z.literal('presence'),
  event: z.enum(['join', 'leave', 'update']),
  userId: z.string(),
  channel: ChannelId,
  metadata: z.record(z.any()).default({})
})

export const RosterQueryMessage = z.object({
  type: z.literal('roster-query'),
  channel: ChannelId,
  requestId: z.string().optional()
})

export const RosterResponseMessage = z.object({
  type: z.literal('roster-response'),
  channel: ChannelId,
  members: z.array(z.object({
    userId: z.string(),
    metadata: z.record(z.any()).default({})
  })),
  requestId: z.string().optional()
})

export const ErrorMessage = z.object({
  type: z.literal('error'),
  code: z.number().int().min(4000).max(4999),
  message: z.string().min(1, 'Error message cannot be empty'),
  details: z.record(z.any()).optional(),
  requestId: z.string().optional()
})

export const WelcomeMessage = z.object({
  type: z.literal('welcome'),
  connectionId: z.string(),
  serverTime: z.number(),
  capabilities: z.array(z.string()).default([]),
  reconnectToken: z.string().optional()
})

export const HeartbeatMessage = z.object({
  type: z.literal('heartbeat'),
  timestamp: z.number().optional()
})

export const PongMessage = z.object({
  type: z.literal('pong'),
  timestamp: z.number().optional()
})

export const BackpressureWarningMessage = z.object({
  type: z.literal('backpressure-warning'),
  queueSize: z.number(),
  droppedMessages: z.number().optional(),
  recommendation: z.string().optional()
})

// Discriminated union of all message payloads
export const MessagePayload = z.discriminatedUnion('type', [
  JoinMessage,
  LeaveMessage,
  VoiceMetaMessage,
  CaptionMessage,
  ActionMessage,
  TickerUpdateMessage,
  CrdtSyncMessage,
  PresenceMessage,
  RosterQueryMessage,
  RosterResponseMessage,
  ErrorMessage,
  WelcomeMessage,
  HeartbeatMessage,
  PongMessage,
  BackpressureWarningMessage
])

// Message envelope that wraps all messages
export const MessageEnvelope = z.object({
  type: z.string(),
  ts: z.number(),
  sessionId: z.string().min(1, 'Session ID cannot be empty'),
  campaignId: z.string().min(1, 'Campaign ID cannot be empty'),
  channel: ChannelId.optional(),
  v: z.number().int().min(1).default(1), // Version for forward compatibility
  payload: MessagePayload,
  requestId: z.string().optional(), // For request/response correlation
  fromUserId: z.string().optional() // Set by server
})

// Type exports
export type JoinMessage = z.infer<typeof JoinMessage>
export type LeaveMessage = z.infer<typeof LeaveMessage>
export type VoiceMetaMessage = z.infer<typeof VoiceMetaMessage>
export type CaptionMessage = z.infer<typeof CaptionMessage>
export type ActionMessage = z.infer<typeof ActionMessage>
export type TickerUpdateMessage = z.infer<typeof TickerUpdateMessage>
export type CrdtSyncMessage = z.infer<typeof CrdtSyncMessage>
export type PresenceMessage = z.infer<typeof PresenceMessage>
export type RosterQueryMessage = z.infer<typeof RosterQueryMessage>
export type RosterResponseMessage = z.infer<typeof RosterResponseMessage>
export type ErrorMessage = z.infer<typeof ErrorMessage>
export type WelcomeMessage = z.infer<typeof WelcomeMessage>
export type HeartbeatMessage = z.infer<typeof HeartbeatMessage>
export type PongMessage = z.infer<typeof PongMessage>
export type BackpressureWarningMessage = z.infer<typeof BackpressureWarningMessage>
export type MessagePayload = z.infer<typeof MessagePayload>
export type MessageEnvelope = z.infer<typeof MessageEnvelope>

// Utility functions for parsing and serialization
export function parseMessage(data: string): MessageEnvelope {
  try {
    const json = JSON.parse(data)
    return MessageEnvelope.parse(json)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Message validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function serializeMessage(message: MessageEnvelope): string {
  try {
    // Validate before serializing
    const validated = MessageEnvelope.parse(message)
    return JSON.stringify(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Message validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`)
    }
    throw new Error(`Serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper functions for creating common messages
export function createJoinMessage(channel: ChannelId, metadata: Record<string, any> = {}): JoinMessage {
  return {
    type: 'join',
    channel,
    metadata
  }
}

export function createLeaveMessage(channel: ChannelId): LeaveMessage {
  return {
    type: 'leave',
    channel
  }
}

export function createCaptionMessage(text: string, language?: string): CaptionMessage {
  return {
    type: 'caption',
    text,
    language,
    timestamp: Date.now()
  }
}

export function createActionMessage(actionType: string, data: Record<string, any>, targetId?: string): ActionMessage {
  return {
    type: 'action',
    actionType,
    data,
    timestamp: Date.now(),
    targetId
  }
}

export function createVoiceMetaMessage(speaking: boolean, volume?: number, muted?: boolean): VoiceMetaMessage {
  return {
    type: 'voice-meta',
    speaking,
    volume,
    muted
  }
}

export function createTickerUpdateMessage(event: string, data: Record<string, any>, priority: 'low' | 'normal' | 'high' = 'normal'): TickerUpdateMessage {
  return {
    type: 'ticker-update',
    event,
    data,
    timestamp: Date.now(),
    priority
  }
}

export function createCrdtSyncMessage(docId: string, operation: 'update' | 'sync' | 'snapshot' | 'ack', data: Record<string, any>): CrdtSyncMessage {
  return {
    type: 'crdt-sync',
    docId,
    operation,
    data
  }
}

export function createErrorMessage(code: number, message: string, details?: Record<string, any>): ErrorMessage {
  return {
    type: 'error',
    code,
    message,
    details
  }
}

export function createWelcomeMessage(connectionId: string, capabilities: string[] = []): WelcomeMessage {
  return {
    type: 'welcome',
    connectionId,
    serverTime: Date.now(),
    capabilities
  }
}

export function createPresenceMessage(event: 'join' | 'leave' | 'update', userId: string, channel: ChannelId, metadata: Record<string, any> = {}): PresenceMessage {
  return {
    type: 'presence',
    event,
    userId,
    channel,
    metadata
  }
}

export function createRosterQueryMessage(channel: ChannelId, requestId?: string): RosterQueryMessage {
  return {
    type: 'roster-query',
    channel,
    requestId
  }
}

export function createBackpressureWarningMessage(queueSize: number, droppedMessages?: number): BackpressureWarningMessage {
  return {
    type: 'backpressure-warning',
    queueSize,
    droppedMessages,
    recommendation: queueSize > 50 ? 'Reduce message frequency' : 'Connection may be slow'
  }
}

// Message envelope helpers
export function createMessageEnvelope(
  payload: MessagePayload,
  sessionId: string,
  campaignId: string,
  channel?: ChannelId,
  requestId?: string
): MessageEnvelope {
  return {
    type: payload.type,
    ts: Date.now(),
    sessionId,
    campaignId,
    channel,
    v: 1,
    payload,
    requestId
  }
}

// Validation helpers
export function isValidChannelId(obj: any): obj is ChannelId {
  return ChannelId.safeParse(obj).success
}

export function isValidMessageEnvelope(obj: any): obj is MessageEnvelope {
  return MessageEnvelope.safeParse(obj).success
}

export function getMessageType(envelope: MessageEnvelope): string {
  return envelope.payload.type
}

export function isMessageType<T extends MessagePayload['type']>(
  envelope: MessageEnvelope,
  type: T
): envelope is MessageEnvelope & { payload: Extract<MessagePayload, { type: T }> } {
  return envelope.payload.type === type
}

// Error code constants
export const ErrorCodes = {
  GENERIC: 4000,
  AUTH_FAILED: 4001,
  IDLE_TIMEOUT: 4002,
  RATE_LIMITED: 4003,
  MEMBERSHIP_REQUIRED: 4004,
  INVALID_SCHEMA: 4005,
  CHANNEL_NOT_FOUND: 4006,
  PERMISSION_DENIED: 4007,
  SERVER_ERROR: 4008,
  BACKPRESSURE: 4009
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// Channel utilities
export function createChannelId(kind: z.infer<typeof ChannelKind>, key: string): ChannelId {
  return { kind, key }
}

export function formatChannelId(channel: ChannelId): string {
  return `${channel.kind}:${channel.key}`
}

export function parseChannelId(formatted: string): ChannelId {
  const [kind, ...keyParts] = formatted.split(':')
  const key = keyParts.join(':')
  return ChannelId.parse({ kind, key })
}
