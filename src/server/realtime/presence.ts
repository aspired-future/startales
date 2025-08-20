/**
 * Presence Management
 * Task 3, Subtask 3.13: Presence service and roster queries
 */

import { ChannelId, formatChannelId } from '../../shared/realtime/schemas.js'
import { Logger } from './logger.js'

export interface PresenceInfo {
  userId: string
  connectionId: string
  channelId: ChannelId
  joinedAt: number
  lastSeen: number
  metadata: Record<string, any>
}

export class PresenceManager {
  private presence = new Map<string, Map<string, PresenceInfo>>()

  constructor(private logger: Logger) {}

  /**
   * User joins a channel
   */
  join(channelId: ChannelId, connectionId: string, userId: string, metadata: Record<string, any> = {}): void {
    const channelKey = formatChannelId(channelId)
    
    if (!this.presence.has(channelKey)) {
      this.presence.set(channelKey, new Map())
    }

    const channelPresence = this.presence.get(channelKey)!
    const info: PresenceInfo = {
      userId,
      connectionId,
      channelId,
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      metadata
    }

    channelPresence.set(connectionId, info)

    this.logger.debug('Presence join', {
      channelId: channelKey,
      userId,
      connectionId
    })
  }

  /**
   * User leaves a channel
   */
  leave(channelId: ChannelId, connectionId: string): void {
    const channelKey = formatChannelId(channelId)
    const channelPresence = this.presence.get(channelKey)

    if (channelPresence) {
      const info = channelPresence.get(connectionId)
      channelPresence.delete(connectionId)

      if (info) {
        this.logger.debug('Presence leave', {
          channelId: channelKey,
          userId: info.userId,
          connectionId
        })
      }
    }
  }

  /**
   * Update user presence
   */
  update(channelId: ChannelId, connectionId: string, metadata: Record<string, any>): void {
    const channelKey = formatChannelId(channelId)
    const channelPresence = this.presence.get(channelKey)

    if (channelPresence) {
      const info = channelPresence.get(connectionId)
      if (info) {
        info.metadata = { ...info.metadata, ...metadata }
        info.lastSeen = Date.now()
      }
    }
  }

  /**
   * Get presence for a channel
   */
  getPresence(channelId: ChannelId): PresenceInfo[] {
    const channelKey = formatChannelId(channelId)
    const channelPresence = this.presence.get(channelKey)
    return channelPresence ? Array.from(channelPresence.values()) : []
  }

  /**
   * Clean up stale presence
   */
  cleanup(): void {
    const now = Date.now()
    const staleThreshold = 5 * 60 * 1000 // 5 minutes

    for (const [channelKey, channelPresence] of this.presence) {
      const staleConnections: string[] = []

      for (const [connectionId, info] of channelPresence) {
        if (now - info.lastSeen > staleThreshold) {
          staleConnections.push(connectionId)
        }
      }

      for (const connectionId of staleConnections) {
        channelPresence.delete(connectionId)
      }

      if (channelPresence.size === 0) {
        this.presence.delete(channelKey)
      }
    }
  }
}
