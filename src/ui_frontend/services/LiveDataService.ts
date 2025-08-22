/**
 * Live Data Service - Replaces all mock data with real API connections
 * Integrates with UI/API/AI Sims/Deterministic sims as needed
 */

export interface CivilizationStats {
  id: string;
  name: string;
  population: number;
  gdp: number;
  approval: number;
  treasury: number;
  security: number;
  technology: number;
  cities: number;
  happiness: number;
  points: number;
  alerts: number;
}

export interface GalaxyStats {
  totalCivilizations: number;
  totalPlanets: number;
  totalPopulation: number;
  activeConflicts: number;
  tradeVolume: number;
  researchProjects: number;
}

export interface AlertData {
  id: string;
  priority: 'urgent' | 'important' | 'info';
  message: string;
  timestamp: Date;
  source: string;
}

export interface WitterPost {
  id: string;
  author: string;
  authorType: string;
  content: string;
  timestamp: Date;
  likes: number;
  shares: number;
  civilization?: string;
  planet?: string;
}

export interface GameMasterMessage {
  id: string;
  type: 'story' | 'event' | 'notification';
  title: string;
  content: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

export class LiveDataService {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.initializeWebSocket();
  }

  // ============================================================================
  // REAL-TIME CONNECTION MANAGEMENT
  // ============================================================================

  private initializeWebSocket() {
    try {
      const wsUrl = `ws://${window.location.host}/ws`;
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log('🔗 WebSocket connected - Real-time data streaming active');
        this.reconnectAttempts = 0;
        this.emit('connection', { status: 'connected' });
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealTimeEvent(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log('🔌 WebSocket disconnected - Attempting to reconnect...');
        this.emit('connection', { status: 'disconnected' });
        this.attemptReconnect();
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('connection', { status: 'error', error });
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.emit('connection', { status: 'failed' });
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.initializeWebSocket();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    } else {
      console.error('❌ Max reconnection attempts reached. Falling back to polling.');
      this.emit('connection', { status: 'polling' });
      this.startPolling();
    }
  }

  private handleRealTimeEvent(data: any) {
    console.log('📡 Real-time event received:', data.type, data);
    this.emit(data.type, data);
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // ============================================================================
  // LIVE API DATA FETCHING
  // ============================================================================

  async getCivilizationStats(civilizationId?: string): Promise<CivilizationStats> {
    try {
      const endpoint = civilizationId 
        ? `/api/analytics/empire?scope=region&id=${civilizationId}`
        : '/api/analytics/empire?scope=campaign&id=1';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      // Transform API response to our interface
      return {
        id: civilizationId || 'player',
        name: data.name || 'Terra Nova Federation',
        population: data.metrics?.population?.population || 0,
        gdp: data.metrics?.economy?.gdpProxy || 0,
        approval: Math.round((data.metrics?.population?.morale || 0.7) * 100),
        treasury: data.metrics?.economy?.budgetBalance || 0,
        security: Math.round((data.metrics?.population?.stability || 0.8) * 100),
        technology: data.metrics?.science?.velocity || 0,
        cities: data.metrics?.infrastructure?.cities || 0,
        happiness: Math.round((data.metrics?.population?.morale || 0.7) * 100),
        points: data.metrics?.totalPoints || 0,
        alerts: data.metrics?.alerts || 0
      };
    } catch (error) {
      console.error('Error fetching civilization stats:', error);
      // Return safe defaults instead of mock data
      return {
        id: civilizationId || 'player',
        name: 'Loading...',
        population: 0,
        gdp: 0,
        approval: 0,
        treasury: 0,
        security: 0,
        technology: 0,
        cities: 0,
        happiness: 0,
        points: 0,
        alerts: 0
      };
    }
  }

  async getGalaxyStats(): Promise<GalaxyStats> {
    try {
      const [empireResponse, trendsResponse] = await Promise.all([
        fetch('/api/empire/planets'),
        fetch('/api/analytics/trends?scope=galaxy&window=1')
      ]);

      const empireData = await empireResponse.json();
      const trendsData = await trendsResponse.json();

      return {
        totalCivilizations: trendsData.civilizations?.length || 0,
        totalPlanets: empireData.planets?.length || 0,
        totalPopulation: trendsData.totalPopulation || 0,
        activeConflicts: trendsData.conflicts || 0,
        tradeVolume: trendsData.tradeVolume || 0,
        researchProjects: trendsData.research || 0
      };
    } catch (error) {
      console.error('Error fetching galaxy stats:', error);
      return {
        totalCivilizations: 0,
        totalPlanets: 0,
        totalPopulation: 0,
        activeConflicts: 0,
        tradeVolume: 0,
        researchProjects: 0
      };
    }
  }

  async getTopCivilizations(limit = 5): Promise<CivilizationStats[]> {
    try {
      const response = await fetch(`/api/analytics/leaderboard?limit=${limit}`);
      const data = await response.json();
      
      return data.civilizations?.map((civ: any) => ({
        id: civ.id,
        name: civ.name,
        population: civ.population,
        gdp: civ.gdp,
        approval: civ.approval,
        treasury: civ.treasury,
        security: civ.security,
        technology: civ.technology,
        cities: civ.cities,
        happiness: civ.happiness,
        points: civ.points,
        alerts: civ.alerts
      })) || [];
    } catch (error) {
      console.error('Error fetching top civilizations:', error);
      return [];
    }
  }

  async getAlerts(): Promise<AlertData[]> {
    try {
      const response = await fetch('/api/alerts/active');
      const data = await response.json();
      
      return data.alerts?.map((alert: any) => ({
        id: alert.id,
        priority: alert.priority,
        message: alert.message,
        timestamp: new Date(alert.timestamp),
        source: alert.source
      })) || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  async getWitterFeed(limit = 20, offset = 0): Promise<WitterPost[]> {
    try {
      const response = await fetch(`/api/witter/feed?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      return data.posts?.map((post: any) => ({
        id: post.id,
        author: post.author,
        authorType: post.authorType,
        content: post.content,
        timestamp: new Date(post.timestamp),
        likes: post.likes || 0,
        shares: post.shares || 0,
        civilization: post.civilization,
        planet: post.planet
      })) || [];
    } catch (error) {
      console.error('Error fetching Witter feed:', error);
      return [];
    }
  }

  async getGameMasterMessages(): Promise<GameMasterMessage[]> {
    try {
      const response = await fetch('/api/narrative/messages');
      const data = await response.json();
      
      return data.messages?.map((msg: any) => ({
        id: msg.id,
        type: msg.type,
        title: msg.title,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        priority: msg.priority
      })) || [];
    } catch (error) {
      console.error('Error fetching Game Master messages:', error);
      return [];
    }
  }

  // ============================================================================
  // POLLING FALLBACK
  // ============================================================================

  private startPolling() {
    // Fallback polling every 30 seconds when WebSocket fails
    setInterval(async () => {
      try {
        const [civStats, alerts, witterPosts] = await Promise.all([
          this.getCivilizationStats(),
          this.getAlerts(),
          this.getWitterFeed(5) // Just get latest 5 posts for polling
        ]);

        this.emit('simulation_tick', { 
          metrics: civStats,
          alerts,
          witterPosts
        });
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 30000);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  formatNumber(num: number): string {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  }

  formatCurrency(amount: number): string {
    return `${this.formatNumber(amount)} ₵`;
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.eventListeners.clear();
  }
}

export default LiveDataService;
