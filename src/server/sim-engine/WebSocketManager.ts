/**
 * WebSocket Manager for Real-time Knob Adjustments
 * Handles live communication between AI simulation engine and clients
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { SimEngineOrchestrator, KnobAdjustment, SimulationEvent } from './SimEngineOrchestrator';

export interface WebSocketMessage {
  type: 'knob_adjustment' | 'knob_request' | 'simulation_event' | 'performance_update' | 'subscribe' | 'unsubscribe';
  payload: any;
  timestamp: Date;
  clientId?: string;
  civilizationId?: string;
}

export interface ClientConnection {
  ws: WebSocket;
  clientId: string;
  civilizationId?: string;
  subscriptions: Set<string>;
  lastPing: Date;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private simEngine: SimEngineOrchestrator;
  private heartbeatInterval: NodeJS.Timeout;

  constructor(server: Server, simEngine: SimEngineOrchestrator) {
    this.simEngine = simEngine;
    
    // Create WebSocket server
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/sim-engine'
    });

    this.setupWebSocketHandlers();
    this.setupSimEngineListeners();
    this.startHeartbeat();

    console.log('🔌 WebSocket Manager initialized on /ws/sim-engine');
  }

  /**
   * Setup WebSocket connection handlers
   */
  private setupWebSocketHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      const client: ClientConnection = {
        ws,
        clientId,
        subscriptions: new Set(),
        lastPing: new Date()
      };

      this.clients.set(clientId, client);
      console.log(`🔌 Client ${clientId} connected (${this.clients.size} total)`);

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'subscribe',
        payload: {
          message: 'Connected to Sim Engine WebSocket',
          clientId,
          availableSubscriptions: [
            'knob_adjustments',
            'simulation_events',
            'performance_updates',
            'recommendations'
          ]
        },
        timestamp: new Date()
      });

      // Handle incoming messages
      ws.on('message', async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          await this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error(`Error handling message from ${clientId}:`, error);
          this.sendError(clientId, 'Invalid message format');
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`🔌 Client ${clientId} disconnected (${this.clients.size} remaining)`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Handle pong responses
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = new Date();
        }
      });
    });
  }

  /**
   * Setup listeners for simulation engine events
   */
  private setupSimEngineListeners(): void {
    // Listen for knob adjustments
    this.simEngine.on('knobAdjusted', (data) => {
      this.broadcastToSubscribers('knob_adjustments', {
        type: 'knob_adjustment',
        payload: data,
        timestamp: new Date()
      });
    });

    // Listen for recommendations
    this.simEngine.on('recommendationsGenerated', (data) => {
      this.broadcastToSubscribers('recommendations', {
        type: 'simulation_event',
        payload: {
          type: 'recommendations_generated',
          ...data
        },
        timestamp: new Date()
      });
    });

    // Listen for civilization registration
    this.simEngine.on('civilizationRegistered', (context) => {
      this.broadcastToSubscribers('simulation_events', {
        type: 'simulation_event',
        payload: {
          type: 'civilization_registered',
          civilizationId: context.civilizationId,
          message: `Civilization ${context.civilizationId} registered for AI simulation`
        },
        timestamp: new Date()
      });
    });

    // Listen for media control events
    this.simEngine.on('simulationEvent', (event) => {
      if (event.type === 'media_event' || event.type === 'press_conference') {
        this.broadcastToSubscribers('media_events', {
          type: 'simulation_event',
          payload: {
            type: event.type,
            id: event.id,
            severity: event.severity,
            description: event.description,
            affectedSystems: event.affectedSystems,
            recommendedKnobAdjustments: event.recommendedKnobAdjustments,
            timestamp: event.timestamp
          },
          timestamp: new Date()
        });
      }
    });
  }

  /**
   * Handle incoming client messages
   */
  private async handleClientMessage(clientId: string, message: WebSocketMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        await this.handleSubscription(clientId, message.payload);
        break;

      case 'unsubscribe':
        await this.handleUnsubscription(clientId, message.payload);
        break;

      case 'knob_request':
        await this.handleKnobRequest(clientId, message.payload);
        break;

      case 'knob_adjustment':
        await this.handleKnobAdjustment(clientId, message.payload);
        break;

      default:
        this.sendError(clientId, `Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handle client subscription requests
   */
  private async handleSubscription(clientId: string, payload: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { subscriptions, civilizationId } = payload;

    if (civilizationId) {
      client.civilizationId = civilizationId;
    }

    if (Array.isArray(subscriptions)) {
      subscriptions.forEach(sub => client.subscriptions.add(sub));
    }

    this.sendToClient(clientId, {
      type: 'subscribe',
      payload: {
        message: 'Subscriptions updated',
        subscriptions: Array.from(client.subscriptions),
        civilizationId: client.civilizationId
      },
      timestamp: new Date()
    });

    console.log(`🔌 Client ${clientId} subscribed to: ${Array.from(client.subscriptions).join(', ')}`);
  }

  /**
   * Handle client unsubscription requests
   */
  private async handleUnsubscription(clientId: string, payload: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { subscriptions } = payload;

    if (Array.isArray(subscriptions)) {
      subscriptions.forEach(sub => client.subscriptions.delete(sub));
    }

    this.sendToClient(clientId, {
      type: 'unsubscribe',
      payload: {
        message: 'Unsubscribed successfully',
        remainingSubscriptions: Array.from(client.subscriptions)
      },
      timestamp: new Date()
    });
  }

  /**
   * Handle knob value requests
   */
  private async handleKnobRequest(clientId: string, payload: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client || !client.civilizationId) {
      this.sendError(clientId, 'Civilization ID required for knob requests');
      return;
    }

    try {
      const knobStates = this.simEngine.getKnobStates(client.civilizationId);
      const performanceMetrics = this.simEngine.getPerformanceMetrics(client.civilizationId);

      this.sendToClient(clientId, {
        type: 'knob_request',
        payload: {
          civilizationId: client.civilizationId,
          knobStates: Object.fromEntries(knobStates),
          performanceMetrics,
          timestamp: new Date()
        },
        timestamp: new Date()
      });
    } catch (error) {
      this.sendError(clientId, `Error fetching knob data: ${error}`);
    }
  }

  /**
   * Handle manual knob adjustments from clients
   */
  private async handleKnobAdjustment(clientId: string, payload: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client || !client.civilizationId) {
      this.sendError(clientId, 'Civilization ID required for knob adjustments');
      return;
    }

    try {
      const { apiName, knobName, newValue, reason } = payload;

      if (!apiName || !knobName || newValue === undefined) {
        this.sendError(clientId, 'apiName, knobName, and newValue are required');
        return;
      }

      const adjustment = await this.simEngine.adjustKnob(
        client.civilizationId,
        apiName,
        knobName,
        newValue,
        reason || `Manual adjustment by client ${clientId}`,
        0.9 // High confidence for manual adjustments
      );

      this.sendToClient(clientId, {
        type: 'knob_adjustment',
        payload: {
          success: true,
          adjustment,
          message: 'Knob adjusted successfully'
        },
        timestamp: new Date()
      });

    } catch (error) {
      this.sendError(clientId, `Error adjusting knob: ${error}`);
    }
  }

  /**
   * Send message to specific client
   */
  private sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== WebSocket.OPEN) return;

    try {
      client.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      this.clients.delete(clientId);
    }
  }

  /**
   * Send error message to client
   */
  private sendError(clientId: string, error: string): void {
    this.sendToClient(clientId, {
      type: 'simulation_event',
      payload: {
        type: 'error',
        message: error
      },
      timestamp: new Date()
    });
  }

  /**
   * Broadcast message to all subscribers of a specific topic
   */
  private broadcastToSubscribers(subscription: string, message: WebSocketMessage): void {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (client.subscriptions.has(subscription) && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error(`Error broadcasting to client ${clientId}:`, error);
          this.clients.delete(clientId);
        }
      }
    }

    if (sentCount > 0) {
      console.log(`📡 Broadcasted ${message.type} to ${sentCount} subscribers of '${subscription}'`);
    }
  }

  /**
   * Broadcast to all clients for a specific civilization
   */
  public broadcastToCivilization(civilizationId: string, message: WebSocketMessage): void {
    let sentCount = 0;
    
    for (const [clientId, client] of this.clients) {
      if (client.civilizationId === civilizationId && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error(`Error broadcasting to client ${clientId}:`, error);
          this.clients.delete(clientId);
        }
      }
    }

    if (sentCount > 0) {
      console.log(`📡 Broadcasted to ${sentCount} clients for civilization ${civilizationId}`);
    }
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date();
      const staleThreshold = 60000; // 60 seconds

      for (const [clientId, client] of this.clients) {
        if (client.ws.readyState === WebSocket.OPEN) {
          // Send ping
          client.ws.ping();
          
          // Check if client is stale
          if (now.getTime() - client.lastPing.getTime() > staleThreshold) {
            console.log(`🔌 Removing stale client ${clientId}`);
            client.ws.terminate();
            this.clients.delete(clientId);
          }
        } else {
          // Remove closed connections
          this.clients.delete(clientId);
        }
      }
    }, 30000); // Check every 30 seconds

    console.log('💓 WebSocket heartbeat started (30s intervals)');
  }

  /**
   * Get connection statistics
   */
  public getStats(): any {
    const subscriptionCounts: Record<string, number> = {};
    const civilizationCounts: Record<string, number> = {};

    for (const client of this.clients.values()) {
      // Count subscriptions
      for (const sub of client.subscriptions) {
        subscriptionCounts[sub] = (subscriptionCounts[sub] || 0) + 1;
      }

      // Count civilizations
      if (client.civilizationId) {
        civilizationCounts[client.civilizationId] = (civilizationCounts[client.civilizationId] || 0) + 1;
      }
    }

    return {
      totalClients: this.clients.size,
      subscriptionCounts,
      civilizationCounts,
      timestamp: new Date()
    };
  }

  /**
   * Shutdown WebSocket manager
   */
  public shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Close all client connections
    for (const client of this.clients.values()) {
      client.ws.close();
    }

    this.wss.close();
    console.log('🔌 WebSocket Manager shutdown complete');
  }
}

export default WebSocketManager;

