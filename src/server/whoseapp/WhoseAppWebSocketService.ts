/**
 * WhoseApp WebSocket Service
 * Handles real-time character updates, messages, and activity feeds for the homepage
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { Pool } from 'pg';
import { CharacterService } from '../characters/CharacterService.js';

export interface WhoseAppMessage {
  type: 'character_update' | 'new_message' | 'activity_feed' | 'status_change' | 'subscribe' | 'unsubscribe';
  payload: any;
  timestamp: Date;
  clientId?: string;
  civilizationId?: string;
}

export interface WhoseAppClient {
  ws: WebSocket;
  clientId: string;
  civilizationId?: string;
  subscriptions: Set<string>; // character IDs, channels, etc.
  lastPing: Date;
}

export interface CharacterActivity {
  id: string;
  characterId: string;
  characterName: string;
  characterTitle: string;
  activityType: 'message' | 'status_update' | 'location_change' | 'meeting' | 'decision';
  content: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  civilizationId: string;
}

export interface WhoseAppConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  conversationType: 'direct' | 'group' | 'channel';
  title?: string;
}

export class WhoseAppWebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WhoseAppClient> = new Map();
  private characterService: CharacterService;
  private pool: Pool;
  private heartbeatInterval: NodeJS.Timeout;
  private activityUpdateInterval: NodeJS.Timeout;

  constructor(server: Server, pool: Pool) {
    this.pool = pool;
    this.characterService = new CharacterService(pool);
    
    // Create WebSocket server for WhoseApp
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/whoseapp'
    });

    this.setupWebSocketHandlers();
    this.startHeartbeat();
    this.startActivityUpdates();

    console.log('💬 WhoseApp WebSocket Service initialized on /ws/whoseapp');
  }

  /**
   * Setup WebSocket connection handlers
   */
  private setupWebSocketHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      const client: WhoseAppClient = {
        ws,
        clientId,
        subscriptions: new Set(),
        lastPing: new Date()
      };

      this.clients.set(clientId, client);
      console.log(`💬 WhoseApp client connected: ${clientId}`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'subscribe',
        payload: { 
          message: 'Connected to WhoseApp real-time service',
          clientId 
        },
        timestamp: new Date()
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message: WhoseAppMessage = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('❌ WhoseApp WebSocket message parse error:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`💬 WhoseApp client disconnected: ${clientId}`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`❌ WhoseApp WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });
  }

  /**
   * Handle messages from clients
   */
  private handleClientMessage(clientId: string, message: WhoseAppMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastPing = new Date();

    switch (message.type) {
      case 'subscribe':
        this.handleSubscription(clientId, message.payload);
        break;
      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.payload);
        break;
      case 'new_message':
        this.handleNewMessage(clientId, message.payload);
        break;
      default:
        console.log(`💬 Unknown WhoseApp message type: ${message.type}`);
    }
  }

  /**
   * Handle client subscriptions
   */
  private handleSubscription(clientId: string, payload: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (payload.civilizationId) {
      client.civilizationId = payload.civilizationId;
    }

    if (payload.subscriptions) {
      payload.subscriptions.forEach((sub: string) => {
        client.subscriptions.add(sub);
      });
    }

    console.log(`💬 Client ${clientId} subscribed to:`, Array.from(client.subscriptions));

    // Send initial data
    this.sendInitialData(clientId);
  }

  /**
   * Handle client unsubscriptions
   */
  private handleUnsubscription(clientId: string, payload: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (payload.subscriptions) {
      payload.subscriptions.forEach((sub: string) => {
        client.subscriptions.delete(sub);
      });
    }
  }

  /**
   * Handle new messages from clients
   */
  private async handleNewMessage(clientId: string, payload: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      // Store message in database
      await this.storeMessage(payload);

      // Broadcast to relevant clients
      this.broadcastMessage({
        type: 'new_message',
        payload,
        timestamp: new Date()
      }, client.civilizationId);

    } catch (error) {
      console.error('❌ Error handling new message:', error);
    }
  }

  /**
   * Send initial data to newly connected client
   */
  private async sendInitialData(clientId: string): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client || !client.civilizationId) return;

    try {
      // Get recent character activities
      const activities = await this.getRecentActivities(client.civilizationId);
      
      // Get active conversations
      const conversations = await this.getActiveConversations(client.civilizationId);

      // Get character updates
      const characterUpdates = await this.getCharacterUpdates(client.civilizationId);

      // Send all initial data
      this.sendToClient(clientId, {
        type: 'activity_feed',
        payload: {
          activities,
          conversations,
          characterUpdates
        },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('❌ Error sending initial WhoseApp data:', error);
    }
  }

  /**
   * Get recent character activities
   */
  private async getRecentActivities(civilizationId: string): Promise<CharacterActivity[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          ca.id,
          ca.character_id,
          c.name->>'first' || ' ' || c.name->>'last' as character_name,
          c.profession->>'title' as character_title,
          ca.activity_type,
          ca.content,
          ca.timestamp,
          ca.priority
        FROM character_activities ca
        JOIN characters c ON ca.character_id = c.id
        WHERE ca.civilization_id = $1
        ORDER BY ca.timestamp DESC
        LIMIT 20
      `, [civilizationId]);

      return result.rows.map(row => ({
        id: row.id,
        characterId: row.character_id,
        characterName: row.character_name,
        characterTitle: row.character_title,
        activityType: row.activity_type,
        content: row.content,
        timestamp: row.timestamp,
        priority: row.priority,
        civilizationId
      }));
    } finally {
      client.release();
    }
  }

  /**
   * Get active conversations
   */
  private async getActiveConversations(civilizationId: string): Promise<WhoseAppConversation[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          conv.id,
          conv.participants,
          conv.last_message,
          conv.last_message_time,
          conv.unread_count,
          conv.conversation_type,
          conv.title
        FROM whoseapp_conversations conv
        WHERE conv.civilization_id = $1
          AND conv.is_active = true
        ORDER BY conv.last_message_time DESC
        LIMIT 10
      `, [civilizationId]);

      return result.rows.map(row => ({
        id: row.id,
        participants: row.participants,
        lastMessage: row.last_message,
        lastMessageTime: row.last_message_time,
        unreadCount: row.unread_count,
        conversationType: row.conversation_type,
        title: row.title
      }));
    } catch (error) {
      // Table might not exist yet, return empty array
      return [];
    } finally {
      client.release();
    }
  }

  /**
   * Get character updates
   */
  private async getCharacterUpdates(civilizationId: string): Promise<any[]> {
    try {
      // Get characters with recent status changes
      const characters = await this.characterService.getCharactersByCivilization(civilizationId);
      
      // Filter for characters with recent activity
      const recentUpdates = characters.filter(char => {
        const lastUpdate = new Date(char.metadata?.lastUpdate || 0);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return lastUpdate > hourAgo;
      });

      return recentUpdates.map(char => ({
        id: char.id,
        name: `${char.name.first} ${char.name.last}`,
        title: char.profession?.title,
        status: char.status,
        lastUpdate: char.metadata?.lastUpdate
      }));
    } catch (error) {
      console.error('❌ Error getting character updates:', error);
      return [];
    }
  }

  /**
   * Store message in database
   */
  private async storeMessage(messageData: any): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO whoseapp_messages (
          id, conversation_id, sender_id, content, message_type, timestamp, civilization_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        messageData.id || `msg-${Date.now()}`,
        messageData.conversationId,
        messageData.senderId,
        messageData.content,
        messageData.messageType || 'text',
        new Date(),
        messageData.civilizationId
      ]);
    } catch (error) {
      // Table might not exist yet, just log the error
      console.log('💬 WhoseApp message storage not available yet');
    } finally {
      client.release();
    }
  }

  /**
   * Broadcast message to all relevant clients
   */
  public broadcastMessage(message: WhoseAppMessage, civilizationId?: string): void {
    this.clients.forEach((client, clientId) => {
      if (civilizationId && client.civilizationId !== civilizationId) {
        return; // Skip clients from different civilizations
      }

      this.sendToClient(clientId, message);
    });
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: WhoseAppMessage): void {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      client.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`❌ Error sending WhoseApp message to client ${clientId}:`, error);
      this.clients.delete(clientId);
    }
  }

  /**
   * Broadcast character activity update
   */
  public broadcastCharacterActivity(activity: CharacterActivity): void {
    this.broadcastMessage({
      type: 'activity_feed',
      payload: { newActivity: activity },
      timestamp: new Date()
    }, activity.civilizationId);
  }

  /**
   * Broadcast character status change
   */
  public broadcastCharacterStatusChange(characterId: string, status: any, civilizationId: string): void {
    this.broadcastMessage({
      type: 'character_update',
      payload: {
        characterId,
        status,
        updateType: 'status_change'
      },
      timestamp: new Date()
    }, civilizationId);
  }

  /**
   * Start heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const timeout = 5 * 60 * 1000; // 5 minutes

      this.clients.forEach((client, clientId) => {
        if (now.getTime() - client.lastPing.getTime() > timeout) {
          console.log(`💬 WhoseApp client ${clientId} timed out`);
          client.ws.terminate();
          this.clients.delete(clientId);
        } else if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
        }
      });
    }, 30000); // Check every 30 seconds

    console.log('💓 WhoseApp WebSocket heartbeat started (30s intervals)');
  }

  /**
   * Start periodic activity updates
   */
  private startActivityUpdates(): void {
    this.activityUpdateInterval = setInterval(async () => {
      // Generate periodic character activities for all active civilizations
      const activeCivs = new Set<string>();
      this.clients.forEach(client => {
        if (client.civilizationId) {
          activeCivs.add(client.civilizationId);
        }
      });

      for (const civId of activeCivs) {
        try {
          await this.generatePeriodicActivity(civId);
        } catch (error) {
          console.error(`❌ Error generating periodic activity for civ ${civId}:`, error);
        }
      }
    }, 2 * 60 * 1000); // Every 2 minutes

    console.log('📱 WhoseApp periodic activity updates started (2min intervals)');
  }

  /**
   * Generate periodic character activity
   */
  private async generatePeriodicActivity(civilizationId: string): Promise<void> {
    try {
      const characters = await this.characterService.getCharactersByCivilization(civilizationId);
      
      if (characters.length === 0) return;

      // Pick a random character for activity
      const randomChar = characters[Math.floor(Math.random() * characters.length)];
      
      const activities = [
        'Just finished reviewing the latest economic reports 📊',
        'Meeting with department heads about upcoming initiatives 🤝',
        'Analyzing citizen feedback from recent surveys 📋',
        'Coordinating with other officials on policy matters 🏛️',
        'Reviewing security briefings and threat assessments 🛡️',
        'Working on budget allocations for next quarter 💰',
        'Attending diplomatic meetings with allied civilizations 🌍',
        'Overseeing infrastructure development projects 🏗️'
      ];

      const activity: CharacterActivity = {
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        characterId: randomChar.id,
        characterName: `${randomChar.name.first} ${randomChar.name.last}`,
        characterTitle: randomChar.profession?.title || 'Official',
        activityType: 'status_update',
        content: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date(),
        priority: 'low',
        civilizationId
      };

      // Broadcast the activity
      this.broadcastCharacterActivity(activity);

      // Store in database if table exists
      await this.storeActivity(activity);

    } catch (error) {
      console.error('❌ Error generating periodic activity:', error);
    }
  }

  /**
   * Store activity in database
   */
  private async storeActivity(activity: CharacterActivity): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        INSERT INTO character_activities (
          id, character_id, civilization_id, activity_type, content, timestamp, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        activity.id,
        activity.characterId,
        activity.civilizationId,
        activity.activityType,
        activity.content,
        activity.timestamp,
        activity.priority
      ]);
    } catch (error) {
      // Table might not exist yet, just log
      console.log('💬 Character activities table not available yet');
    } finally {
      client.release();
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `whoseapp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.activityUpdateInterval) {
      clearInterval(this.activityUpdateInterval);
    }
    
    this.clients.forEach((client) => {
      client.ws.terminate();
    });
    this.clients.clear();
    
    this.wss.close();
    console.log('💬 WhoseApp WebSocket Service cleaned up');
  }
}
