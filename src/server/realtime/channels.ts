/**
 * Channel Management
 * Task 3, Subtask 3.5: Channel model and membership enforcement
 */

import { ChannelId, formatChannelId } from '../../shared/realtime/schemas.js'
import { Logger } from './logger.js'

export interface ChannelMember {
  connectionId: string
  userId: string
  joinedAt: number
  metadata: Record<string, any>
}

export interface Channel {
  id: ChannelId
  members: Map<string, ChannelMember>
  createdAt: number
  metadata: Record<string, any>
}

export class ChannelManager {
  private channels = new Map<string, Channel>()
  private connectionChannels = new Map<string, Set<string>>()

  constructor(private logger: Logger) {}

  /**
   * Create or get a channel
   */
  getOrCreateChannel(channelId: ChannelId, metadata: Record<string, any> = {}): Channel {
    const key = formatChannelId(channelId)
    
    if (!this.channels.has(key)) {
      const channel: Channel = {
        id: channelId,
        members: new Map(),
        createdAt: Date.now(),
        metadata
      }
      this.channels.set(key, channel)
      
      this.logger.debug('Channel created', {
        channelId: key,
        kind: channelId.kind,
        key: channelId.key
      })
    }

    return this.channels.get(key)!
  }

  /**
   * Join a channel
   */
  join(channelId: ChannelId, connectionId: string, userId: string, metadata: Record<string, any> = {}): boolean {
    const channel = this.getOrCreateChannel(channelId)
    const key = formatChannelId(channelId)

    // Check if already a member
    if (channel.members.has(connectionId)) {
      return false
    }

    // Add member
    const member: ChannelMember = {
      connectionId,
      userId,
      joinedAt: Date.now(),
      metadata
    }

    channel.members.set(connectionId, member)

    // Track connection's channels
    if (!this.connectionChannels.has(connectionId)) {
      this.connectionChannels.set(connectionId, new Set())
    }
    this.connectionChannels.get(connectionId)!.add(key)

    this.logger.debug('User joined channel', {
      channelId: key,
      connectionId,
      userId,
      memberCount: channel.members.size
    })

    return true
  }

  /**
   * Leave a channel
   */
  leave(channelId: ChannelId, connectionId: string): boolean {
    const key = formatChannelId(channelId)
    const channel = this.channels.get(key)

    if (!channel || !channel.members.has(connectionId)) {
      return false
    }

    const member = channel.members.get(connectionId)!
    channel.members.delete(connectionId)

    // Remove from connection's channels
    const connectionChannelSet = this.connectionChannels.get(connectionId)
    if (connectionChannelSet) {
      connectionChannelSet.delete(key)
      if (connectionChannelSet.size === 0) {
        this.connectionChannels.delete(connectionId)
      }
    }

    this.logger.debug('User left channel', {
      channelId: key,
      connectionId,
      userId: member.userId,
      memberCount: channel.members.size
    })

    return true
  }

  /**
   * Check if connection is member of channel
   */
  isMember(channelId: ChannelId, connectionId: string): boolean {
    const key = formatChannelId(channelId)
    const channel = this.channels.get(key)
    return channel ? channel.members.has(connectionId) : false
  }

  /**
   * Get channel members
   */
  getMembers(channelId: ChannelId): ChannelMember[] {
    const key = formatChannelId(channelId)
    const channel = this.channels.get(key)
    return channel ? Array.from(channel.members.values()) : []
  }

  /**
   * Get member connection IDs for a channel
   */
  getMemberConnectionIds(channelId: ChannelId): string[] {
    const key = formatChannelId(channelId)
    const channel = this.channels.get(key)
    return channel ? Array.from(channel.members.keys()) : []
  }

  /**
   * Get channels for a connection
   */
  getConnectionChannels(connectionId: string): ChannelId[] {
    const channelKeys = this.connectionChannels.get(connectionId)
    if (!channelKeys) return []

    return Array.from(channelKeys)
      .map(key => {
        const channel = this.channels.get(key)
        return channel ? channel.id : null
      })
      .filter((id): id is ChannelId => id !== null)
  }

  /**
   * Remove connection from all channels
   */
  removeConnection(connectionId: string): void {
    const channelKeys = this.connectionChannels.get(connectionId)
    if (!channelKeys) return

    for (const channelKey of channelKeys) {
      const channel = this.channels.get(channelKey)
      if (channel) {
        channel.members.delete(connectionId)
      }
    }

    this.connectionChannels.delete(connectionId)

    this.logger.debug('Connection removed from all channels', {
      connectionId,
      channelCount: channelKeys.size
    })
  }

  /**
   * Get all channels
   */
  getChannels(): Channel[] {
    return Array.from(this.channels.values())
  }

  /**
   * Get channel by ID
   */
  getChannel(channelId: ChannelId): Channel | undefined {
    const key = formatChannelId(channelId)
    return this.channels.get(key)
  }

  /**
   * Clean up empty channels
   */
  cleanup(): void {
    const emptyChannels: string[] = []

    for (const [key, channel] of this.channels) {
      if (channel.members.size === 0) {
        emptyChannels.push(key)
      }
    }

    for (const key of emptyChannels) {
      this.channels.delete(key)
    }

    if (emptyChannels.length > 0) {
      this.logger.debug('Cleaned up empty channels', {
        count: emptyChannels.length
      })
    }
  }

  /**
   * Get channel statistics
   */
  getStats() {
    const totalChannels = this.channels.size
    const totalMembers = Array.from(this.channels.values())
      .reduce((sum, channel) => sum + channel.members.size, 0)

    const channelsByKind = new Map<string, number>()
    for (const channel of this.channels.values()) {
      const count = channelsByKind.get(channel.id.kind) || 0
      channelsByKind.set(channel.id.kind, count + 1)
    }

    return {
      totalChannels,
      totalMembers,
      channelsByKind: Object.fromEntries(channelsByKind),
      activeConnections: this.connectionChannels.size
    }
  }
}
