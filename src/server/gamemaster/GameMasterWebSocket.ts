import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { gameMasterVideoService } from './GameMasterVideoAPI';

interface PlayerConnection {
  ws: WebSocket;
  playerId: string;
  campaignId: string;
  lastPing: number;
  isAlive: boolean;
}

class GameMasterWebSocketService {
  private wss: WebSocketServer | null = null;
  private connections: Map<string, PlayerConnection> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/gamemaster'
    });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    // Start heartbeat to check for dead connections
    this.startHeartbeat();

    console.log('🎬 Game Master WebSocket service initialized on /ws/gamemaster');
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage) {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const playerId = url.searchParams.get('playerId') || `player_${Date.now()}`;
    const campaignId = url.searchParams.get('campaignId') || 'default';

    const connection: PlayerConnection = {
      ws,
      playerId,
      campaignId,
      lastPing: Date.now(),
      isAlive: true
    };

    this.connections.set(playerId, connection);
    
    // Register with video service for broadcasting
    gameMasterVideoService.addWebSocketClient(ws);

    console.log(`🎬 Game Master: Player ${playerId} connected to campaign ${campaignId}`);

    // Send welcome message
    this.sendToPlayer(playerId, {
      type: 'gm_welcome',
      data: {
        message: 'Connected to Game Master video service',
        playerId,
        campaignId
      }
    });

    // Handle messages from client
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(playerId, message);
      } catch (error) {
        console.error('Invalid message from player:', playerId, error);
      }
    });

    // Handle pong responses for heartbeat
    ws.on('pong', () => {
      connection.isAlive = true;
      connection.lastPing = Date.now();
    });

    // Handle disconnection
    ws.on('close', () => {
      this.connections.delete(playerId);
      console.log(`🎬 Game Master: Player ${playerId} disconnected`);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`🎬 Game Master: WebSocket error for player ${playerId}:`, error);
      this.connections.delete(playerId);
    });
  }

  private handleMessage(playerId: string, message: any) {
    const connection = this.connections.get(playerId);
    if (!connection) return;

    switch (message.type) {
      case 'ping':
        this.sendToPlayer(playerId, { type: 'pong', timestamp: Date.now() });
        break;

      case 'video_viewed':
        this.handleVideoViewed(playerId, message.data);
        break;

      case 'video_skipped':
        this.handleVideoSkipped(playerId, message.data);
        break;

      case 'video_completed':
        this.handleVideoCompleted(playerId, message.data);
        break;

      case 'request_active_videos':
        this.sendActiveVideos(playerId);
        break;

      default:
        console.log(`🎬 Game Master: Unknown message type from ${playerId}:`, message.type);
    }
  }

  private handleVideoViewed(playerId: string, data: any) {
    console.log(`🎬 Game Master: Player ${playerId} viewed video ${data.videoId}`);
    // Log analytics or update player state
  }

  private handleVideoSkipped(playerId: string, data: any) {
    console.log(`🎬 Game Master: Player ${playerId} skipped video ${data.videoId} at ${data.timestamp}s`);
    // Log analytics
  }

  private handleVideoCompleted(playerId: string, data: any) {
    console.log(`🎬 Game Master: Player ${playerId} completed video ${data.videoId}`);
    // Log analytics or trigger follow-up events
  }

  private sendActiveVideos(playerId: string) {
    const activeVideos = gameMasterVideoService.getActiveVideos();
    this.sendToPlayer(playerId, {
      type: 'active_videos',
      data: { videos: activeVideos }
    });
  }

  private sendToPlayer(playerId: string, message: any) {
    const connection = this.connections.get(playerId);
    if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      connection.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error(`Failed to send message to player ${playerId}:`, error);
      this.connections.delete(playerId);
      return false;
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.connections.forEach((connection, playerId) => {
        if (!connection.isAlive) {
          console.log(`🎬 Game Master: Terminating dead connection for player ${playerId}`);
          connection.ws.terminate();
          this.connections.delete(playerId);
          return;
        }

        connection.isAlive = false;
        connection.ws.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  // Public methods for broadcasting
  broadcastToAll(message: any, excludePlayer?: string) {
    let successCount = 0;
    this.connections.forEach((connection, playerId) => {
      if (excludePlayer && playerId === excludePlayer) return;
      
      if (this.sendToPlayer(playerId, message)) {
        successCount++;
      }
    });
    return successCount;
  }

  broadcastToCampaign(campaignId: string, message: any, excludePlayer?: string) {
    let successCount = 0;
    this.connections.forEach((connection, playerId) => {
      if (connection.campaignId !== campaignId) return;
      if (excludePlayer && playerId === excludePlayer) return;
      
      if (this.sendToPlayer(playerId, message)) {
        successCount++;
      }
    });
    return successCount;
  }

  broadcastToPlayers(playerIds: string[], message: any) {
    let successCount = 0;
    playerIds.forEach(playerId => {
      if (this.sendToPlayer(playerId, message)) {
        successCount++;
      }
    });
    return successCount;
  }

  // Get connection stats
  getConnectionStats() {
    const stats = {
      totalConnections: this.connections.size,
      campaignCounts: new Map<string, number>(),
      activePlayers: Array.from(this.connections.keys())
    };

    this.connections.forEach(connection => {
      const count = stats.campaignCounts.get(connection.campaignId) || 0;
      stats.campaignCounts.set(connection.campaignId, count + 1);
    });

    return {
      ...stats,
      campaignCounts: Object.fromEntries(stats.campaignCounts)
    };
  }

  // Check if player is connected
  isPlayerConnected(playerId: string): boolean {
    const connection = this.connections.get(playerId);
    return connection ? connection.ws.readyState === WebSocket.OPEN : false;
  }

  // Send message to specific player
  sendMessageToPlayer(playerId: string, message: any): boolean {
    return this.sendToPlayer(playerId, message);
  }

  // Disconnect player
  disconnectPlayer(playerId: string): boolean {
    const connection = this.connections.get(playerId);
    if (connection) {
      connection.ws.close();
      this.connections.delete(playerId);
      return true;
    }
    return false;
  }

  // Cleanup
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.connections.forEach((connection, playerId) => {
      connection.ws.close();
    });

    this.connections.clear();

    if (this.wss) {
      this.wss.close();
    }

    console.log('🎬 Game Master WebSocket service shut down');
  }
}

// Create singleton instance
export const gameMasterWebSocketService = new GameMasterWebSocketService();

export default gameMasterWebSocketService;

