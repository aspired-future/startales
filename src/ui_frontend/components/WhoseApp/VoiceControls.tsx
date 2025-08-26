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
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceMessage,
  onTextToSpeech,
  characterId,
  disabled = false,
  showTTSControls = true
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

