/**
 * WhoseApp WebSocket Hook
 * Provides real-time updates for character activities, messages, and conversations
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface WhoseAppMessage {
  type: 'character_update' | 'new_message' | 'activity_feed' | 'status_change' | 'subscribe' | 'unsubscribe';
  payload: any;
  timestamp: Date;
  clientId?: string;
  civilizationId?: string;
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

export interface WhoseAppData {
  activities: CharacterActivity[];
  conversations: WhoseAppConversation[];
  characterUpdates: any[];
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export interface UseWhoseAppWebSocketOptions {
  civilizationId?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWhoseAppWebSocket(options: UseWhoseAppWebSocketOptions = {}) {
  const {
    civilizationId,
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options;

  const [data, setData] = useState<WhoseAppData>({
    activities: [],
    conversations: [],
    characterUpdates: [],
    isConnected: false,
    connectionStatus: 'disconnected'
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setData(prev => ({ ...prev, connectionStatus: 'connecting' }));

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/whoseapp`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('💬 WhoseApp WebSocket connected');
        reconnectAttemptsRef.current = 0;
        
        setData(prev => ({
          ...prev,
          isConnected: true,
          connectionStatus: 'connected'
        }));

        // Subscribe to updates if civilizationId is provided
        if (civilizationId) {
          const subscribeMessage: WhoseAppMessage = {
            type: 'subscribe',
            payload: {
              civilizationId,
              subscriptions: ['activities', 'conversations', 'character_updates']
            },
            timestamp: new Date()
          };
          
          wsRef.current?.send(JSON.stringify(subscribeMessage));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WhoseAppMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('❌ WhoseApp WebSocket message parse error:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('💬 WhoseApp WebSocket disconnected');
        setData(prev => ({
          ...prev,
          isConnected: false,
          connectionStatus: 'disconnected'
        }));

        // Attempt to reconnect
        if (autoConnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`💬 Attempting to reconnect WhoseApp WebSocket (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WhoseApp WebSocket error:', error);
        setData(prev => ({ ...prev, connectionStatus: 'error' }));
      };

    } catch (error) {
      console.error('❌ WhoseApp WebSocket connection failed:', error);
      setData(prev => ({ ...prev, connectionStatus: 'error' }));
    }
  }, [civilizationId, autoConnect, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setData(prev => ({
      ...prev,
      isConnected: false,
      connectionStatus: 'disconnected'
    }));
  }, []);

  const sendMessage = useCallback((message: Omit<WhoseAppMessage, 'timestamp'>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WhoseAppMessage = {
        ...message,
        timestamp: new Date()
      };
      
      wsRef.current.send(JSON.stringify(fullMessage));
      return true;
    }
    return false;
  }, []);

  const handleMessage = useCallback((message: WhoseAppMessage) => {
    switch (message.type) {
      case 'activity_feed':
        if (message.payload.activities) {
          // Initial data load
          setData(prev => ({
            ...prev,
            activities: message.payload.activities || [],
            conversations: message.payload.conversations || [],
            characterUpdates: message.payload.characterUpdates || []
          }));
        } else if (message.payload.newActivity) {
          // New activity update
          setData(prev => ({
            ...prev,
            activities: [message.payload.newActivity, ...prev.activities].slice(0, 50) // Keep last 50
          }));
        }
        break;

      case 'new_message':
        // Handle new message
        setData(prev => {
          const updatedConversations = prev.conversations.map(conv => {
            if (conv.id === message.payload.conversationId) {
              return {
                ...conv,
                lastMessage: message.payload.content,
                lastMessageTime: new Date(message.payload.timestamp),
                unreadCount: conv.unreadCount + 1
              };
            }
            return conv;
          });

          return {
            ...prev,
            conversations: updatedConversations
          };
        });
        break;

      case 'character_update':
        // Handle character status changes
        setData(prev => {
          const updatedCharacters = prev.characterUpdates.map(char => {
            if (char.id === message.payload.characterId) {
              return {
                ...char,
                status: message.payload.status,
                lastUpdate: new Date()
              };
            }
            return char;
          });

          return {
            ...prev,
            characterUpdates: updatedCharacters
          };
        });
        break;

      case 'status_change':
        // Handle general status changes
        console.log('💬 WhoseApp status change:', message.payload);
        break;

      default:
        console.log('💬 Unknown WhoseApp message type:', message.type);
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, autoConnect]);

  // Reconnect when civilizationId changes
  useEffect(() => {
    if (civilizationId && wsRef.current?.readyState === WebSocket.OPEN) {
      const subscribeMessage: WhoseAppMessage = {
        type: 'subscribe',
        payload: {
          civilizationId,
          subscriptions: ['activities', 'conversations', 'character_updates']
        },
        timestamp: new Date()
      };
      
      wsRef.current.send(JSON.stringify(subscribeMessage));
    }
  }, [civilizationId]);

  return {
    ...data,
    connect,
    disconnect,
    sendMessage,
    // Helper functions
    addActivity: (activity: CharacterActivity) => {
      setData(prev => ({
        ...prev,
        activities: [activity, ...prev.activities].slice(0, 50)
      }));
    },
    markConversationRead: (conversationId: string) => {
      setData(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      }));
    },
    clearActivities: () => {
      setData(prev => ({ ...prev, activities: [] }));
    }
  };
}
