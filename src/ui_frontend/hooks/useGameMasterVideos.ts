import { useState, useEffect, useCallback, useRef } from 'react';

interface GameMasterVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  triggerEvent: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  autoPlay: boolean;
  skipable: boolean;
  targetPlayers?: string[];
  campaignId: string;
}

interface UseGameMasterVideosProps {
  playerId: string;
  campaignId: string;
  onVideoReceived?: (video: GameMasterVideo) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

export const useGameMasterVideos = ({
  playerId,
  campaignId,
  onVideoReceived,
  onConnectionStatusChange
}: UseGameMasterVideosProps) => {
  const [currentVideo, setCurrentVideo] = useState<GameMasterVideo | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [activeVideos, setActiveVideos] = useState<GameMasterVideo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/gamemaster?playerId=${playerId}&campaignId=${campaignId}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('🎬 Game Master: WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
        onConnectionStatusChange?.(true);

        // Request any active videos
        wsRef.current?.send(JSON.stringify({
          type: 'request_active_videos'
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('🎬 Game Master: WebSocket disconnected');
        setIsConnected(false);
        onConnectionStatusChange?.(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else {
          setConnectionError('Failed to connect to Game Master service');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('🎬 Game Master: WebSocket error:', error);
        setConnectionError('WebSocket connection error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  }, [playerId, campaignId, onConnectionStatusChange]);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'gm_video':
        const video = message.data as GameMasterVideo;
        console.log('🎬 Game Master: Received video:', video.title);
        
        // Check if video is targeted to this player
        if (video.targetPlayers && video.targetPlayers.length > 0) {
          if (!video.targetPlayers.includes(playerId)) {
            return; // Video not for this player
          }
        }

        setCurrentVideo(video);
        setIsVideoVisible(true);
        onVideoReceived?.(video);
        
        // Send viewed confirmation
        wsRef.current?.send(JSON.stringify({
          type: 'video_viewed',
          data: { videoId: video.id }
        }));
        break;

      case 'active_videos':
        setActiveVideos(message.data.videos || []);
        break;

      case 'gm_welcome':
        console.log('🎬 Game Master: Welcome message received');
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        console.log('🎬 Game Master: Unknown message type:', message.type);
    }
  }, [playerId, onVideoReceived]);

  const closeVideo = useCallback(() => {
    setIsVideoVisible(false);
    
    // Clear video after animation
    setTimeout(() => {
      setCurrentVideo(null);
    }, 300);
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (currentVideo) {
      // Send completion confirmation
      wsRef.current?.send(JSON.stringify({
        type: 'video_completed',
        data: { videoId: currentVideo.id }
      }));
    }
    
    closeVideo();
  }, [currentVideo, closeVideo]);

  const handleVideoSkipped = useCallback((timestamp: number) => {
    if (currentVideo) {
      // Send skip confirmation
      wsRef.current?.send(JSON.stringify({
        type: 'video_skipped',
        data: { 
          videoId: currentVideo.id,
          timestamp 
        }
      }));
    }
    
    closeVideo();
  }, [currentVideo, closeVideo]);

  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'ping',
        timestamp: Date.now()
      }));
    }
  }, []);

  // Manual trigger for testing
  const triggerTestVideo = useCallback(async (eventType: string, context: any = {}) => {
    try {
      const response = await fetch('/api/gamemaster/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          context: {
            ...context,
            campaignId,
            playerId
          }
        })
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Failed to trigger test video:', result.error);
      }
    } catch (error) {
      console.error('Error triggering test video:', error);
    }
  }, [campaignId, playerId]);

  // Initialize connection
  useEffect(() => {
    connect();

    // Set up heartbeat
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, sendHeartbeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    currentVideo,
    isVideoVisible,
    activeVideos,
    isConnected,
    connectionError,
    closeVideo,
    handleVideoEnd,
    handleVideoSkipped,
    triggerTestVideo,
    reconnect: connect
  };
};

export default useGameMasterVideos;

