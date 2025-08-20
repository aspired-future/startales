/**
 * Message Router
 * Task 3, Subtask 3.6: Message routing and handlers per type
 */

import { MessageEnvelope, parseMessage, isMessageType } from '../../shared/realtime/schemas.js'
import { ChannelManager } from './channels.js'
import { PresenceManager } from './presence.js'
import { Logger } from './logger.js'
import type { ConnectionInfo } from './server.js'

export class MessageRouter {
  constructor(
    private channelManager: ChannelManager,
    private presenceManager: PresenceManager,
    private logger: Logger
  ) {}

  /**
   * Route incoming message to appropriate handler
   */
  async routeMessage(connection: ConnectionInfo, rawMessage: any): Promise<void> {
    try {
      // Parse and validate message
      const envelope = parseMessage(JSON.stringify(rawMessage))
      
      // Add connection context
      envelope.fromUserId = connection.auth.userId

      // Route based on message type
      switch (envelope.payload.type) {
        case 'join':
          await this.handleJoin(connection, envelope)
          break
        case 'leave':
          await this.handleLeave(connection, envelope)
          break
        case 'voice-meta':
          await this.handleVoiceMeta(connection, envelope)
          break
        case 'caption':
          await this.handleCaption(connection, envelope)
          break
        case 'action':
          await this.handleAction(connection, envelope)
          break
        case 'ticker-update':
          await this.handleTickerUpdate(connection, envelope)
          break
        case 'crdt-sync':
          await this.handleCrdtSync(connection, envelope)
          break
        case 'roster-query':
          await this.handleRosterQuery(connection, envelope)
          break
        case 'heartbeat':
          await this.handleHeartbeat(connection, envelope)
          break
        default:
          this.logger.warn('Unknown message type', {
            type: envelope.payload.type,
            connectionId: connection.id
          })
      }

    } catch (error) {
      this.logger.error('Message routing error', {
        connectionId: connection.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  private async handleJoin(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'join')) return

    const { channel, metadata } = envelope.payload
    
    // Join channel
    const joined = this.channelManager.join(channel, connection.id, connection.auth.userId, metadata)
    
    if (joined) {
      // Update presence
      this.presenceManager.join(channel, connection.id, connection.auth.userId, metadata)
      
      // Add to connection's channel set
      connection.channels.add(JSON.stringify(channel))

      // Send confirmation
      // TODO: Send join confirmation message
      
      this.logger.info('User joined channel', {
        userId: connection.auth.userId,
        channelId: `${channel.kind}:${channel.key}`,
        connectionId: connection.id
      })
    }
  }

  private async handleLeave(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'leave')) return

    const { channel } = envelope.payload
    
    // Leave channel
    const left = this.channelManager.leave(channel, connection.id)
    
    if (left) {
      // Update presence
      this.presenceManager.leave(channel, connection.id)
      
      // Remove from connection's channel set
      connection.channels.delete(JSON.stringify(channel))

      // Send confirmation
      // TODO: Send leave confirmation message
      
      this.logger.info('User left channel', {
        userId: connection.auth.userId,
        channelId: `${channel.kind}:${channel.key}`,
        connectionId: connection.id
      })
    }
  }

  private async handleVoiceMeta(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'voice-meta')) return

    // Voice metadata should be routed to channel members
    if (envelope.channel) {
      await this.routeToChannelMembers(connection, envelope)
    }
  }

  private async handleCaption(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'caption')) return

    // Captions should be routed to channel members
    if (envelope.channel) {
      await this.routeToChannelMembers(connection, envelope)
    }
  }

  private async handleAction(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'action')) return

    // Actions can be routed to channel members or specific targets
    if (envelope.channel) {
      await this.routeToChannelMembers(connection, envelope)
    }
  }

  private async handleTickerUpdate(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'ticker-update')) return

    // Ticker updates are usually broadcast to session scope
    // TODO: Implement session-wide broadcasting
    this.logger.debug('Ticker update received', {
      event: envelope.payload.event,
      connectionId: connection.id
    })
  }

  private async handleCrdtSync(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'crdt-sync')) return

    // CRDT sync messages need special handling
    // TODO: Route to CRDT sync adapter (Task 20 preparation)
    this.logger.debug('CRDT sync message received', {
      docId: envelope.payload.docId,
      operation: envelope.payload.operation,
      connectionId: connection.id
    })
  }

  private async handleRosterQuery(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!isMessageType(envelope, 'roster-query')) return

    const { channel, requestId } = envelope.payload
    const members = this.channelManager.getMembers(channel)

    // Send roster response
    // TODO: Send roster response message
    this.logger.debug('Roster query handled', {
      channelId: `${channel.kind}:${channel.key}`,
      memberCount: members.length,
      requestId
    })
  }

  private async handleHeartbeat(connection: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    // Update last seen
    connection.lastSeen = Date.now()
    
    // Send pong response
    // TODO: Send pong message
    this.logger.debug('Heartbeat received', {
      connectionId: connection.id
    })
  }

  /**
   * Route message to all channel members except sender
   */
  private async routeToChannelMembers(sender: ConnectionInfo, envelope: MessageEnvelope): Promise<void> {
    if (!envelope.channel) return

    // Check if sender is member of channel
    if (!this.channelManager.isMember(envelope.channel, sender.id)) {
      throw new Error('Not a member of channel')
    }

    const memberConnectionIds = this.channelManager.getMemberConnectionIds(envelope.channel)
    
    // TODO: Actually send messages to connections
    // This would require access to the connection registry from the server
    
    this.logger.debug('Message routed to channel members', {
      channelId: `${envelope.channel.kind}:${envelope.channel.key}`,
      memberCount: memberConnectionIds.length,
      messageType: envelope.payload.type
    })
  }
}
