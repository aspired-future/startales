import React, { useState, useEffect, useRef } from 'react';
import './GameMasterVideoPopup.css';

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
}

interface GameMasterVideoPopupProps {
  video: GameMasterVideo | null;
  isVisible: boolean;
  onClose: () => void;
  onVideoEnd: () => void;
  playerId: string;
}

export const GameMasterVideoPopup: React.FC<GameMasterVideoPopupProps> = ({
  video,
  isVisible,
  onClose,
  onVideoEnd,
  playerId
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (video && isVisible && videoRef.current) {
      setIsLoading(true);
      setCurrentTime(0);
      
      if (video.autoPlay) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(console.error);
      } else {
        setIsLoading(false);
      }
    }
  }, [video, isVisible]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isVisible || !video) return;
      
      switch (e.key) {
        case 'Escape':
          if (video.skipable) {
            handleClose();
          }
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, video]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onClose();
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onVideoEnd();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📢';
      case 'low': return 'ℹ️';
      default: return '🎬';
    }
  };

  if (!video || !isVisible) return null;

  return (
    <div className="gm-video-overlay" onMouseMove={handleMouseMove}>
      <div className="gm-video-container">
        {/* Header */}
        <div className={`gm-video-header ${showControls ? 'visible' : 'hidden'}`}>
          <div className="video-info">
            <span className="priority-icon">{getPriorityIcon(video.priority)}</span>
            <div className="video-details">
              <h2 className="video-title">{video.title}</h2>
              <p className="video-description">{video.description}</p>
            </div>
          </div>
          {video.skipable && (
            <button className="close-button" onClick={handleClose} title="Close (ESC)">
              ✕
            </button>
          )}
        </div>

        {/* Video Player */}
        <div className="video-player-wrapper">
          {isLoading && (
            <div className="video-loading">
              <div className="loading-spinner"></div>
              <p>Loading Game Master Message...</p>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="gm-video-player"
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            volume={volume}
          />

          {/* Video Controls */}
          <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
            <div className="controls-row">
              <button 
                className="play-pause-btn" 
                onClick={togglePlayPause}
                title="Play/Pause (SPACE)"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </div>

              <input
                type="range"
                className="seek-bar"
                min="0"
                max={video.duration}
                value={currentTime}
                onChange={handleSeek}
              />

              <div className="volume-control">
                <span className="volume-icon">🔊</span>
                <input
                  type="range"
                  className="volume-bar"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>

              <button 
                className="fullscreen-btn" 
                onClick={toggleFullscreen}
                title="Fullscreen (F)"
              >
                ⛶
              </button>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentTime / video.duration) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`gm-video-footer ${showControls ? 'visible' : 'hidden'}`}>
          <div className="video-metadata">
            <span className="trigger-event">Triggered by: {video.triggerEvent}</span>
            <span className="timestamp">{new Date(video.timestamp).toLocaleString()}</span>
          </div>
          
          {!video.skipable && (
            <div className="mandatory-notice">
              <span className="notice-icon">🔒</span>
              <span>This message cannot be skipped</span>
            </div>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      <div className="gm-video-background"></div>
    </div>
  );
};

export default GameMasterVideoPopup;

