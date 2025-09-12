/**
 * CallInterface Component
 * Handles voice calls with characters including audio controls and call management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Character } from './WhoseAppMain';
import '../GameHUD/screens/shared/StandardDesign.css';

export interface CallState {
  id: string;
  status: 'initiating' | 'ringing' | 'connected' | 'ended' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration: number;
  quality: {
    audioQuality: 'poor' | 'fair' | 'good' | 'excellent';
    connectionStability: 'unstable' | 'stable' | 'excellent';
    latency: number;
  };
}

interface CallInterfaceProps {
  character: Character;
  currentUserId: string;
  onEndCall: () => void;
  onBack: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  character,
  currentUserId,
  onEndCall,
  onBack
}) => {
  const [callState, setCallState] = useState<CallState>({
    id: `call_${Date.now()}`,
    status: 'initiating',
    duration: 0,
    quality: {
      audioQuality: 'good',
      connectionStability: 'stable',
      latency: 45
    }
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Simulate call progression
  useEffect(() => {
    const progressCall = async () => {
      try {
        // Initiate call
        const response = await fetch('/api/whoseapp/calls/initiate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            callerId: currentUserId,
            recipientId: character.id,
            callType: 'voice',
            campaignId: 1
          })
        });

        if (!response.ok) {
          throw new Error('Failed to initiate call');
        }

        const callData = await response.json();
        
        setCallState(prev => ({
          ...prev,
          id: callData.data.id,
          status: 'ringing'
        }));

        // Simulate ringing period
        setTimeout(() => {
          setCallState(prev => ({
            ...prev,
            status: 'connected',
            startTime: new Date()
          }));
        }, 2000 + Math.random() * 3000);

      } catch (err) {
        console.error('Error initiating call:', err);
        setError(err instanceof Error ? err.message : 'Failed to start call');
        setCallState(prev => ({ ...prev, status: 'failed' }));
      }
    };

    progressCall();
  }, [character.id, currentUserId]);

  // Update call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (callState.status === 'connected' && callState.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - callState.startTime!.getTime()) / 1000);
        setCallState(prev => ({ ...prev, duration }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.status, callState.startTime]);

  // Handle ending the call
  const handleEndCall = useCallback(async () => {
    try {
      setCallState(prev => ({
        ...prev,
        status: 'ended',
        endTime: new Date()
      }));

      // Update call status on server
      await fetch(`/api/whoseapp/calls/${callState.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'ended',
          endTime: new Date().toISOString()
        })
      });

      // Wait a moment then close
      setTimeout(() => {
        onEndCall();
      }, 2000);

    } catch (err) {
      console.error('Error ending call:', err);
      onEndCall();
    }
  }, [callState.id, onEndCall]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiating': return '#f39c12';
      case 'ringing': return '#3498db';
      case 'connected': return '#2ecc71';
      case 'ended': return '#95a5a6';
      case 'failed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  // Get quality color
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return '#2ecc71';
      case 'good': return '#27ae60';
      case 'fair': return '#f39c12';
      case 'poor': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="call-interface" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(15, 15, 35, 0.95)',
      color: '#e8e8e8'
    }}>
      {/* Call Header */}
      <div className="call-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        background: 'rgba(26, 26, 46, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="standard-btn social-theme"
            onClick={onBack}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            ← Back
          </button>
          
          <div>
            <h3 style={{ color: '#4ecdc4', margin: '0 0 4px 0', fontSize: '18px' }}>
              Voice Call
            </h3>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Call ID: {callState.id}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#888'
        }}>
          <span style={{ color: getStatusColor(callState.status), textTransform: 'capitalize' }}>
            {callState.status}
          </span>
          {callState.status === 'connected' && (
            <span style={{ color: '#4ecdc4', fontWeight: '600' }}>
              {formatDuration(callState.duration)}
            </span>
          )}
        </div>
      </div>

      {/* Main Call Area */}
      <div className="call-main" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        {error ? (
          <div style={{
            background: 'rgba(231, 76, 60, 0.2)',
            border: '1px solid rgba(231, 76, 60, 0.4)',
            borderRadius: '12px',
            padding: '20px',
            color: '#e74c3c',
            fontSize: '16px',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        ) : (
          <>
            {/* Character Avatar */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getStatusColor(callState.status)}, ${getStatusColor(callState.status)}88)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: `3px solid ${getStatusColor(callState.status)}`,
              animation: callState.status === 'ringing' ? 'pulse 1.5s infinite' : 'none'
            }}>
              <img
                src={character.avatar}
                alt={character.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234ecdc4"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36">${character.name.charAt(0)}</text></svg>`;
                }}
              />
            </div>

            {/* Character Info */}
            <h2 style={{ color: '#e8e8e8', margin: '0 0 8px 0', fontSize: '24px' }}>
              {character.name}
            </h2>
            <p style={{ color: '#888', margin: '0 0 20px 0', fontSize: '16px' }}>
              {character.title} • {character.department}
            </p>

            {/* Call Status */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              padding: '16px 24px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '18px', color: getStatusColor(callState.status), marginBottom: '8px' }}>
                {callState.status === 'initiating' && '📞 Connecting...'}
                {callState.status === 'ringing' && '📳 Ringing...'}
                {callState.status === 'connected' && '🔊 Connected'}
                {callState.status === 'ended' && '📵 Call Ended'}
                {callState.status === 'failed' && '❌ Call Failed'}
              </div>
              
              {callState.status === 'connected' && (
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Duration: {formatDuration(callState.duration)}
                </div>
              )}
            </div>

            {/* Call Quality Indicators */}
            {callState.status === 'connected' && (
              <div className="call-quality" style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '30px',
                fontSize: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: getQualityColor(callState.quality.audioQuality), marginBottom: '4px' }}>
                    🎵 Audio
                  </div>
                  <div style={{ color: '#888', textTransform: 'capitalize' }}>
                    {callState.quality.audioQuality}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: getQualityColor(callState.quality.connectionStability), marginBottom: '4px' }}>
                    📶 Connection
                  </div>
                  <div style={{ color: '#888', textTransform: 'capitalize' }}>
                    {callState.quality.connectionStability}
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: callState.quality.latency < 50 ? '#2ecc71' : callState.quality.latency < 100 ? '#f39c12' : '#e74c3c', marginBottom: '4px' }}>
                    ⚡ Latency
                  </div>
                  <div style={{ color: '#888' }}>
                    {callState.quality.latency}ms
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call Controls */}
      {(callState.status === 'connected' || callState.status === 'ringing') && (
        <div className="call-controls" style={{
          padding: '20px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(26, 26, 46, 0.8)'
        }}>
          {/* Primary Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Mute Button */}
            <button
              className={`call-control-btn ${isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isMuted ? 'rgba(231, 76, 60, 0.3)' : 'rgba(78, 205, 196, 0.2)',
                border: `2px solid ${isMuted ? '#e74c3c' : '#4ecdc4'}`,
                color: isMuted ? '#e74c3c' : '#4ecdc4',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            {/* End Call Button */}
            <button
              className="call-control-btn end-call"
              onClick={handleEndCall}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(231, 76, 60, 0.3)',
                border: '2px solid #e74c3c',
                color: '#e74c3c',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title="End Call"
            >
              📞
            </button>

            {/* Speaker Button */}
            <button
              className={`call-control-btn ${isSpeakerOn ? 'active' : ''}`}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: isSpeakerOn ? 'rgba(52, 152, 219, 0.3)' : 'rgba(78, 205, 196, 0.2)',
                border: `2px solid ${isSpeakerOn ? '#3498db' : '#4ecdc4'}`,
                color: isSpeakerOn ? '#3498db' : '#4ecdc4',
                fontSize: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isSpeakerOn ? 'Turn off speaker' : 'Turn on speaker'}
            >
              {isSpeakerOn ? '🔊' : '🔈'}
            </button>
          </div>

          {/* Volume Control */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '16px' }}>🔉</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{
                width: '200px',
                accentColor: '#4ecdc4'
              }}
            />
            <span style={{ fontSize: '16px' }}>🔊</span>
            <span style={{ fontSize: '12px', color: '#888', minWidth: '40px' }}>
              {volume}%
            </span>
          </div>

          {/* Additional Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <button
              className={`standard-btn ${isRecording ? 'danger' : 'social-theme'}`}
              onClick={() => setIsRecording(!isRecording)}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎙️ Record'}
            </button>
            
            <button
              className="standard-btn"
              onClick={() => setCallNotes('')}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              📝 Notes
            </button>
          </div>
        </div>
      )}

      {/* Call Notes (if expanded) */}
      {callNotes !== undefined && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(15, 15, 35, 0.8)'
        }}>
          <textarea
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            placeholder="Call notes..."
            style={{
              width: '100%',
              height: '80px',
              padding: '12px',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              color: '#e8e8e8',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .call-control-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default CallInterface;

