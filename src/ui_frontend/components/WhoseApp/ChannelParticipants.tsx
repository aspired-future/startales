/**
 * Channel Participants Component
 * Shows profile images of all channel participants with speaking indicators
 */

import React, { useState, useEffect } from 'react';
import './ChannelParticipants.css';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  title: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  isSpeaking?: boolean;
  isPlayer?: boolean;
}

interface ChannelParticipantsProps {
  participants: Participant[];
  currentSpeakerId?: string | null;
  onParticipantClick?: (participantId: string) => void;
  onVoiceToggle?: (participantId: string, enabled: boolean) => void;
  showVoiceControls?: boolean;
}

const ChannelParticipants: React.FC<ChannelParticipantsProps> = ({
  participants,
  currentSpeakerId,
  onParticipantClick,
  onVoiceToggle,
  showVoiceControls = true
}) => {
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set());
  const [voiceEnabledParticipants, setVoiceEnabledParticipants] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentSpeakerId) {
      setSpeakingParticipants(prev => new Set([...prev, currentSpeakerId]));
      
      // Remove speaking indicator after a delay
      const timeout = setTimeout(() => {
        setSpeakingParticipants(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentSpeakerId);
          return newSet;
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [currentSpeakerId]);

  const handleVoiceToggle = (participantId: string) => {
    const isEnabled = !voiceEnabledParticipants.has(participantId);
    setVoiceEnabledParticipants(prev => {
      const newSet = new Set(prev);
      if (isEnabled) {
        newSet.add(participantId);
      } else {
        newSet.delete(participantId);
      }
      return newSet;
    });
    onVoiceToggle?.(participantId, isEnabled);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'away': return '#FFC107';
      case 'offline': return '#757575';
      default: return '#757575';
    }
  };

  return (
    <div className="channel-participants">
      <div className="participants-header">
        <h4>Channel Participants ({participants.length})</h4>
        {showVoiceControls && (
          <div className="voice-controls-toggle">
            <button
              className="toggle-all-voices"
              onClick={() => {
                const allEnabled = participants.every(p => voiceEnabledParticipants.has(p.id));
                participants.forEach(p => {
                  if (allEnabled) {
                    setVoiceEnabledParticipants(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(p.id);
                      return newSet;
                    });
                    onVoiceToggle?.(p.id, false);
                  } else {
                    setVoiceEnabledParticipants(prev => new Set([...prev, p.id]));
                    onVoiceToggle?.(p.id, true);
                  }
                });
              }}
            >
              {participants.every(p => voiceEnabledParticipants.has(p.id)) ? '🔇 Mute All' : '🔊 Enable All'}
            </button>
          </div>
        )}
      </div>

      <div className="participants-grid">
        {participants.map(participant => {
          const isSpeaking = speakingParticipants.has(participant.id);
          const voiceEnabled = voiceEnabledParticipants.has(participant.id);
          
          return (
            <div
              key={participant.id}
              className={`participant-card ${isSpeaking ? 'speaking' : ''} ${participant.isPlayer ? 'player' : 'character'}`}
              onClick={() => onParticipantClick?.(participant.id)}
            >
              {/* Speaking Indicator Ring */}
              {isSpeaking && (
                <div className="speaking-ring">
                  <div className="speaking-pulse"></div>
                </div>
              )}

              {/* Avatar */}
              <div className="participant-avatar">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%234ecdc4"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="20">${participant.name.charAt(0)}</text></svg>`;
                  }}
                />
                
                {/* Status Indicator */}
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(participant.status) }}
                />

                {/* Player Badge */}
                {participant.isPlayer && (
                  <div className="player-badge">
                    👤
                  </div>
                )}

                {/* Speaking Animation Overlay */}
                {isSpeaking && (
                  <div className="speaking-overlay">
                    <div className="sound-waves">
                      <div className="wave wave-1"></div>
                      <div className="wave wave-2"></div>
                      <div className="wave wave-3"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Participant Info */}
              <div className="participant-info">
                <div className="participant-name">
                  {participant.name}
                </div>
                <div className="participant-title">
                  {participant.title}
                </div>
                <div className="participant-status">
                  {participant.status}
                </div>
              </div>

              {/* Voice Controls */}
              {showVoiceControls && (
                <div className="participant-voice-controls">
                  <button
                    className={`voice-toggle ${voiceEnabled ? 'enabled' : 'disabled'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoiceToggle(participant.id);
                    }}
                    title={voiceEnabled ? `Mute ${participant.name}` : `Enable voice for ${participant.name}`}
                  >
                    {voiceEnabled ? '🔊' : '🔇'}
                  </button>
                  
                  {participant.isPlayer && (
                    <button
                      className="player-voice-control"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle player-specific voice controls
                      }}
                      title="Player voice settings"
                    >
                      🎤
                    </button>
                  )}
                </div>
              )}

              {/* Speaking Indicator Text */}
              {isSpeaking && (
                <div className="speaking-indicator-text">
                  Speaking...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Channel Voice Status */}
      <div className="channel-voice-status">
        <div className="voice-stats">
          <span className="stat">
            🔊 {voiceEnabledParticipants.size}/{participants.length} voices enabled
          </span>
          {speakingParticipants.size > 0 && (
            <span className="stat speaking">
              🗣️ {speakingParticipants.size} speaking
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelParticipants;

