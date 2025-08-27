/**
 * Voice Controls Component for WhoseApp
 * Provides STT/TTS controls and voice message functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import { voiceService, VoiceRecording } from '../../services/VoiceService';
import './VoiceControls.css';

interface VoiceControlsProps {
  onVoiceMessage?: (transcript: string, audioBlob?: Blob) => void;
  onTextToSpeech?: (text: string) => void;
  characterId?: string;
  disabled?: boolean;
  showTTSControls?: boolean;
  conversationalMode?: boolean; // Enable natural conversation flow
  onConversationResponse?: (response: string) => void; // Handle AI responses
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceMessage,
  onTextToSpeech,
  characterId,
  disabled = false,
  showTTSControls = true,
  conversationalMode = false,
  onConversationResponse
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSTTSupported] = useState(voiceService.isSTTSupported());
  const [isTTSSupported] = useState(voiceService.isTTSSupported());
  const [isRecordingSupported] = useState(voiceService.isRecordingSupported());

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentRecordingRef = useRef<VoiceRecording | null>(null);

  useEffect(() => {
    // Check microphone permission on mount
    checkMicrophonePermission();
    
    return () => {
      // Cleanup on unmount
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      voiceService.stopSpeech();
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const permission = await voiceService.requestMicrophonePermission();
      setHasPermission(permission);
    } catch (error) {
      setHasPermission(false);
      setError('Microphone access denied');
    }
  };

  const startRecording = async () => {
    if (!hasPermission || disabled) return;

    try {
      setError(null);
      const success = await voiceService.startRecording();
      
      if (success) {
        setIsRecording(true);
        setRecordingTime(0);
        
        // Start recording timer
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      const recording = await voiceService.stopRecording();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      if (recording && onVoiceMessage) {
        currentRecordingRef.current = recording;
        onVoiceMessage('', recording.audioBlob);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setError('Failed to stop recording');
    }
  };

  const startListening = async () => {
    if (!isSTTSupported || !hasPermission || disabled) return;

    try {
      setError(null);
      setIsListening(true);
      setTranscript('');

      if (conversationalMode) {
        // Use enhanced STT with silence detection for natural conversation
        await voiceService.speechToTextWithConfidence(
          (transcript, isFinal, confidence) => {
            // Always show interim results to user
            setTranscript(transcript);
            
            // ONLY process final results with good confidence and meaningful content
            if (isFinal && (confidence || 1.0) > 0.7 && transcript.trim().length > 2) {
              console.log('🎤 Final transcript received:', transcript, 'Confidence:', confidence);
              
              if (onVoiceMessage) {
                onVoiceMessage(transcript);
              }
              
              // Generate AI response if in conversational mode
              if (onConversationResponse) {
                generateConversationalResponse(transcript);
              }
              
              setTranscript('');
              setIsListening(false);
            } else if (!isFinal) {
              // This is just an interim result - don't process it
              console.log('🎤 Interim transcript:', transcript);
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setError('Speech recognition failed');
            setIsListening(false);
          },
          2500 // Wait 2.5 seconds of silence before finishing
        );
      } else {
        // Use standard STT for regular voice messages
        await voiceService.speechToText(
          (transcript, isFinal) => {
            setTranscript(transcript);
            
            if (isFinal && onVoiceMessage) {
              onVoiceMessage(transcript);
              setTranscript('');
              setIsListening(false);
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setError('Speech recognition failed');
            setIsListening(false);
          }
        );
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    // Speech recognition will stop automatically
  };

  // Generate conversational AI response
  const generateConversationalResponse = async (userMessage: string) => {
    try {
      console.log('🤖 Generating response for:', userMessage);
      
      // More contextual responses based on message content
      let response = "";
      const message = userMessage.toLowerCase();
      
      if (message.includes('status') && message.includes('universe')) {
        response = "The universe? Well, from a diplomatic perspective, our galactic relations are quite complex. The outer rim territories are showing signs of unrest, and we're monitoring several trade route disruptions. What specific aspect concerns you most?";
      } else if (message.includes('hello') || message.includes('hey') || message.includes('hi')) {
        response = "Hello! It's good to hear from you. As your diplomatic advisor, I'm here to discuss any interstellar matters you'd like to address. What's on your mind today?";
      } else if (message.includes('status')) {
        response = "I can brief you on our current diplomatic status. We have ongoing negotiations with three major civilizations, and I'm tracking several emerging situations that may require your attention. Which area would you like to focus on?";
      } else if (message.includes('trade')) {
        response = "Trade relations are always evolving. We're seeing promising developments with the Centauri Republic, though the Vega Alliance has raised some concerns about our recent agreements. Shall we review the latest reports?";
      } else {
        // Fallback responses
        const responses = [
          "That's an intriguing point. In my experience with interstellar diplomacy, these matters often have multiple layers. What's your perspective on this?",
          "I see. From a diplomatic standpoint, we should consider how this affects our broader galactic relationships. Tell me more about your concerns.",
          "Interesting. As your Chief Diplomatic Officer, I think we should examine the implications carefully. What outcome are you hoping to achieve?",
          "That's worth discussing. Given the current political climate in our sector, we need to be strategic about our next moves. What are your thoughts?"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      // Simulate realistic thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      if (onConversationResponse) {
        onConversationResponse(response);
      }
      
      // Speak the response with natural voice
      if (characterId) {
        await voiceService.textToSpeechWithEmotion(response, {
          characterId,
          emotion: 'calm',
          naturalPauses: true
        });
      }
    } catch (error) {
      console.error('Failed to generate conversational response:', error);
    }
  };

  const speakText = async (text: string) => {
    if (!isTTSSupported || disabled) return;

    try {
      setError(null);
      setIsSpeaking(true);
      
      await voiceService.textToSpeech(text, {
        characterId: characterId,
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8
      });
      
      setIsSpeaking(false);
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setError('Text-to-speech failed');
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    voiceService.stopSpeech();
    setIsSpeaking(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSTTSupported && !isTTSSupported && !isRecordingSupported) {
    return (
      <div className="voice-controls-unsupported">
        <span className="unsupported-message">
          🎤❌ Voice features not supported in this browser
        </span>
      </div>
    );
  }

  // In conversational mode, show minimal UI - just a simple mic button
  if (conversationalMode) {
    return (
      <div className="voice-controls-simple">
        {error && (
          <div className="voice-error">
            <span className="error-message">{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Single mic button for conversational mode */}
        <button
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || hasPermission === false}
          title={isListening ? 'Stop listening' : 'Start conversation'}
        >
          {isListening ? '🔴' : '🎤'}
        </button>

        {/* Show what you're saying */}
        {transcript && (
          <div className="transcript-preview">
            <span>"{transcript}"</span>
          </div>
        )}

        {hasPermission === false && (
          <div className="permission-request">
            <span>🎤 Microphone access required</span>
            <button onClick={checkMicrophonePermission}>Grant Permission</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="voice-controls">
      {error && (
        <div className="voice-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="voice-buttons">
        {/* Voice Recording Button */}
        {isRecordingSupported && (
          <div className="voice-control-group">
            <button
              className={`voice-button record-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || hasPermission === false}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {isRecording ? (
                <>
                  <span className="recording-icon">⏹️</span>
                  <span className="recording-time">{formatTime(recordingTime)}</span>
                </>
              ) : (
                <>
                  <span className="record-icon">🎤</span>
                  <span className="button-text">Record</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Speech-to-Text Button */}
        {isSTTSupported && (
          <div className="voice-control-group">
            <button
              className={`voice-button stt-button ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={disabled || hasPermission === false}
              title={isListening ? 'Stop listening' : 'Start speech-to-text'}
            >
              {isListening ? (
                <>
                  <span className="listening-icon">🔴</span>
                  <span className="button-text">Listening...</span>
                </>
              ) : (
                <>
                  <span className="stt-icon">🗣️</span>
                  <span className="button-text">Speak</span>
                </>
              )}
            </button>
            
            {transcript && (
              <div className="transcript-preview">
                <span className="transcript-text">"{transcript}"</span>
              </div>
            )}
          </div>
        )}

        {/* Text-to-Speech Controls */}
        {isTTSSupported && showTTSControls && (
          <div className="voice-control-group">
            <button
              className={`voice-button tts-button ${isSpeaking ? 'speaking' : ''}`}
              onClick={isSpeaking ? stopSpeaking : () => onTextToSpeech?.('Sample text')}
              disabled={disabled}
              title={isSpeaking ? 'Stop speaking' : 'Text-to-speech'}
            >
              {isSpeaking ? (
                <>
                  <span className="speaking-icon">🔇</span>
                  <span className="button-text">Stop</span>
                </>
              ) : (
                <>
                  <span className="tts-icon">🔊</span>
                  <span className="button-text">Speak</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Permission Request */}
      {hasPermission === false && (
        <div className="permission-request">
          <p className="permission-message">
            🎤 Microphone access is required for voice features
          </p>
          <button 
            className="permission-button"
            onClick={checkMicrophonePermission}
          >
            Grant Permission
          </button>
        </div>
      )}

      {/* Voice Status Indicator */}
      <div className="voice-status">
        {isRecording && (
          <div className="status-indicator recording">
            <span className="status-dot"></span>
            <span className="status-text">Recording...</span>
          </div>
        )}
        {isListening && (
          <div className="status-indicator listening">
            <span className="status-dot"></span>
            <span className="status-text">Listening...</span>
          </div>
        )}
        {isSpeaking && (
          <div className="status-indicator speaking">
            <span className="status-dot"></span>
            <span className="status-text">Speaking...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceControls;

