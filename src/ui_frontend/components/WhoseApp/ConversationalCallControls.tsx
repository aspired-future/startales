/**
 * Conversational Call Controls for WhoseApp
 * 
 * Provides an intuitive interface for natural voice conversations with characters
 */

import React, { useState, useEffect, useCallback } from 'react';
import { conversationalCallService, ConversationState } from '../../services/ConversationalCallService';
import { CharacterProfile, WhoseAppMessage } from '../../types/WhoseAppTypes';
import './ConversationalCallControls.css';

interface ConversationalCallControlsProps {
  character: CharacterProfile;
  conversationId: string;
  onMessage: (message: WhoseAppMessage) => void;
  onCallEnd?: () => void;
  disabled?: boolean;
}

const ConversationalCallControls: React.FC<ConversationalCallControlsProps> = ({
  character,
  conversationId,
  onMessage,
  onCallEnd,
  disabled = false
}) => {
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'character' | null>(null);
  const [userSpeechLevel, setUserSpeechLevel] = useState(0);
  const [characterSpeechLevel, setCharacterSpeechLevel] = useState(0);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Setup conversational service callbacks
  useEffect(() => {
    conversationalCallService.setOnMessageCallback(onMessage);
    conversationalCallService.setOnStateChangeCallback(setConversationState);
    
    return () => {
      conversationalCallService.setOnMessageCallback(() => {});
      conversationalCallService.setOnStateChangeCallback(() => {});
    };
  }, [onMessage]);

  // Update current speaker based on conversation state
  useEffect(() => {
    if (conversationState) {
      setCurrentSpeaker(conversationState.currentSpeaker);
    }
  }, [conversationState]);

  // Start conversational call
  const startCall = useCallback(async () => {
    if (disabled || isCallActive) return;
    
    setIsConnecting(true);
    setError(null);
    setCallDuration(0);
    
    try {
      const success = await conversationalCallService.startConversationalCall(
        character,
        conversationId,
        {
          autoRespond: true,
          allowInterruptions: true,
          responseDelay: 800,
          naturalPauses: true
        }
      );
      
      if (success) {
        setIsCallActive(true);
        setIsConnecting(false);
      } else {
        throw new Error('Failed to start conversational call');
      }
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('Failed to start call. Please check your microphone permissions.');
      setIsConnecting(false);
    }
  }, [character, conversationId, disabled, isCallActive]);

  // End conversational call
  const endCall = useCallback(async () => {
    if (!isCallActive) return;
    
    try {
      await conversationalCallService.endConversationalCall();
      setIsCallActive(false);
      setCallDuration(0);
      setCurrentSpeaker(null);
      setConversationState(null);
      
      if (onCallEnd) {
        onCallEnd();
      }
    } catch (err) {
      console.error('Failed to end call:', err);
      setError('Failed to end call properly');
    }
  }, [isCallActive, onCallEnd]);

  // Toggle auto-respond
  const toggleAutoRespond = useCallback(() => {
    conversationalCallService.toggleAutoRespond();
  }, []);

  // Toggle interruptions
  const toggleInterruptions = useCallback(() => {
    conversationalCallService.toggleInterruptions();
  }, []);

  // Manually trigger character response
  const triggerResponse = useCallback(() => {
    conversationalCallService.triggerCharacterResponse();
  }, []);

  // Format call duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get speaking indicator class
  const getSpeakingIndicatorClass = (speaker: 'user' | 'character'): string => {
    const base = 'speaking-indicator';
    if (currentSpeaker === speaker) {
      return `${base} ${base}--active`;
    }
    return base;
  };

  // Get call status text
  const getCallStatusText = (): string => {
    if (isConnecting) return 'Connecting...';
    if (!isCallActive) return 'Ready to call';
    if (currentSpeaker === 'user') return 'You are speaking';
    if (currentSpeaker === 'character') return `${character.name} is speaking`;
    return 'Listening...';
  };

  // Get call status class
  const getCallStatusClass = (): string => {
    if (isConnecting) return 'call-status--connecting';
    if (!isCallActive) return 'call-status--ready';
    if (currentSpeaker) return 'call-status--active';
    return 'call-status--listening';
  };

  return (
    <div className="conversational-call-controls">
      {/* Call Header */}
      <div className="call-header">
        <div className="character-info">
          <img 
            src={character.avatar || '/api/placeholder/40/40'} 
            alt={character.name}
            className="character-avatar"
          />
          <div className="character-details">
            <h4 className="character-name">{character.name}</h4>
            <span className="character-role">{character.role}</span>
          </div>
        </div>
        
        {isCallActive && (
          <div className="call-duration">
            <span className="duration-label">Call Duration:</span>
            <span className="duration-time">{formatDuration(callDuration)}</span>
          </div>
        )}
      </div>

      {/* Call Status */}
      <div className={`call-status ${getCallStatusClass()}`}>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">{getCallStatusText()}</span>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>

      {/* Speaking Indicators */}
      {isCallActive && (
        <div className="speaking-indicators">
          <div className="speaker-indicator">
            <div className={getSpeakingIndicatorClass('user')}>
              <div className="speaker-avatar">🎤</div>
              <div className="speaker-label">You</div>
              <div className="speech-level-bar">
                <div 
                  className="speech-level-fill"
                  style={{ width: `${userSpeechLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="conversation-flow">
            <div className="flow-arrow">
              {currentSpeaker === 'user' ? '→' : currentSpeaker === 'character' ? '←' : '↔'}
            </div>
          </div>
          
          <div className="speaker-indicator">
            <div className={getSpeakingIndicatorClass('character')}>
              <div className="speaker-avatar">
                <img 
                  src={character.avatar || '/api/placeholder/32/32'} 
                  alt={character.name}
                />
              </div>
              <div className="speaker-label">{character.name}</div>
              <div className="speech-level-bar">
                <div 
                  className="speech-level-fill"
                  style={{ width: `${characterSpeechLevel}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="call-controls">
        {!isCallActive ? (
          <button
            className="call-button call-button--start"
            onClick={startCall}
            disabled={disabled || isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="button-spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="button-icon">📞</span>
                Start Conversation
              </>
            )}
          </button>
        ) : (
          <>
            <button
              className="call-button call-button--end"
              onClick={endCall}
            >
              <span className="button-icon">📞</span>
              End Call
            </button>
            
            <button
              className="control-button"
              onClick={triggerResponse}
              title="Ask character to respond"
            >
              <span className="button-icon">💬</span>
              Respond
            </button>
          </>
        )}
      </div>

      {/* Advanced Controls */}
      {isCallActive && conversationState && (
        <div className="advanced-controls">
          <div className="control-group">
            <label className="control-label">
              <input
                type="checkbox"
                checked={conversationState.settings.autoRespond}
                onChange={toggleAutoRespond}
              />
              <span className="checkbox-label">Auto-respond</span>
            </label>
            
            <label className="control-label">
              <input
                type="checkbox"
                checked={conversationState.settings.allowInterruptions}
                onChange={toggleInterruptions}
              />
              <span className="checkbox-label">Allow interruptions</span>
            </label>
          </div>
          
          <div className="conversation-stats">
            <div className="stat">
              <span className="stat-label">Turns:</span>
              <span className="stat-value">{conversationState.turnHistory.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Mode:</span>
              <span className="stat-value">{conversationState.context.mood}</span>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Tips */}
      {!isCallActive && !isConnecting && (
        <div className="conversation-tips">
          <h5>💡 Conversation Tips:</h5>
          <ul>
            <li>Speak naturally - the AI will respond contextually</li>
            <li>You can interrupt the character if needed</li>
            <li>Pauses are natural - take your time</li>
            <li>The character remembers the conversation context</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConversationalCallControls;
