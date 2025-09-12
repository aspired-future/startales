import React, { useState, useEffect, useCallback, useRef } from 'react';

interface UnifiedConversationViewProps {
  conversation: any;
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (content: string, type: 'text' | 'voice') => void;
}

interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  recordingDuration: number;
  error: string | null;
}

export const UnifiedConversationView: React.FC<UnifiedConversationViewProps> = ({
  conversation,
  currentUserId,
  onBack,
  onSendMessage
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    isPlaying: false,
    recordingDuration: 0,
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/whoseapp/conversations/${conversation.id}/messages?limit=50`);
      
      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Initialize microphone access
  const initializeMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
      return true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      setVoiceState(prev => ({ ...prev, error: 'Microphone access required for voice messages' }));
      return false;
    }
  }, []);

  // Start voice recording
  const handleStartRecording = useCallback(async () => {
    const hasAccess = await initializeMicrophone();
    if (!hasAccess) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      setVoiceState(prev => ({
        ...prev,
        isRecording: true,
        recordingDuration: 0,
        error: null
      }));

      // Start duration timer
      recordingIntervalRef.current = setInterval(() => {
        setVoiceState(prev => ({
          ...prev,
          recordingDuration: prev.recordingDuration + 1
        }));
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Failed to start recording. Please check microphone permissions.' 
      }));
    }
  }, []);

  // Stop voice recording
  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && voiceState.isRecording) {
      mediaRecorderRef.current.stop();
      
      setVoiceState(prev => ({
        ...prev,
        isRecording: false,
        isProcessing: true
      }));

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [voiceState.isRecording]);

  // Process voice message with STT
  const processVoiceMessage = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/stt/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const result = await response.json();
      const transcript = result.text || result.transcript || '';

      if (transcript.trim()) {
        // Auto-switch to text mode and populate with transcript
        setInputMode('text');
        setNewMessage(transcript);
        
        // Auto-send if user wants immediate voice-to-text
        // Or just populate the text field for review
        console.log('Transcribed:', transcript);
      } else {
        throw new Error('No speech detected');
      }

    } catch (err) {
      console.error('Failed to process voice message:', err);
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Failed to process voice message. Please try again.' 
      }));
    } finally {
      setVoiceState(prev => ({
        ...prev,
        isProcessing: false,
        recordingDuration: 0
      }));
    }
  }, []);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await onSendMessage(newMessage, 'text');
      setNewMessage('');
      
      // Reload messages to show the new one
      setTimeout(() => {
        loadMessages();
      }, 500);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, isLoading, onSendMessage, loadMessages]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Auto-switch to voice mode when voice button is pressed
  const handleVoiceModeToggle = useCallback(() => {
    if (inputMode === 'voice') {
      // Switch back to text
      setInputMode('text');
      if (voiceState.isRecording) {
        handleStopRecording();
      }
    } else {
      // Switch to voice and start recording immediately
      setInputMode('voice');
      handleStartRecording();
    }
  }, [inputMode, voiceState.isRecording, handleStartRecording, handleStopRecording]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#4ecdc4',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <div>
          <h3 style={{ margin: 0, color: '#4ecdc4' }}>
            {conversation.title || 'Conversation'}
          </h3>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            {inputMode === 'voice' ? '🎙️ Voice Mode' : '💬 Text Mode'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.2)',
            border: '1px solid rgba(255, 107, 107, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#ff6b6b'
          }}>
            {error}
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888' }}>
            Loading messages...
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '12px',
                display: 'flex',
                justifyContent: message.senderId === currentUserId ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: message.senderId === currentUserId 
                  ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: message.senderId === currentUserId ? '#000' : '#fff'
              }}>
                <div style={{ fontSize: '14px' }}>
                  {message.content}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.7, 
                  marginTop: '4px',
                  textAlign: 'right'
                }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice State Indicator */}
      {voiceState.error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid rgba(255, 107, 107, 0.5)',
          color: '#ff6b6b',
          fontSize: '14px'
        }}>
          {voiceState.error}
        </div>
      )}

      {voiceState.isRecording && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid rgba(255, 107, 107, 0.5)',
          color: '#ff6b6b',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          🔴 Recording... {voiceState.recordingDuration}s
        </div>
      )}

      {voiceState.isProcessing && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(78, 205, 196, 0.2)',
          border: '1px solid rgba(78, 205, 196, 0.5)',
          color: '#4ecdc4',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          🔄 Processing voice message...
        </div>
      )}

      {/* Input Area */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(78, 205, 196, 0.3)',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          {/* Text Input */}
          <div style={{ flex: 1 }}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={inputMode === 'voice' ? 'Voice transcription will appear here...' : 'Type your message...'}
              disabled={voiceState.isRecording || voiceState.isProcessing}
              style={{
                width: '100%',
                minHeight: '40px',
                maxHeight: '120px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Voice Toggle Button */}
          <button
            onClick={handleVoiceModeToggle}
            disabled={voiceState.isProcessing}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(78, 205, 196, 0.5)',
              background: inputMode === 'voice' 
                ? (voiceState.isRecording ? 'rgba(255, 107, 107, 0.3)' : 'rgba(78, 205, 196, 0.3)')
                : 'rgba(255, 255, 255, 0.1)',
              color: inputMode === 'voice' ? '#ff6b6b' : '#4ecdc4',
              cursor: 'pointer',
              fontSize: '16px',
              minWidth: '48px',
              height: '48px'
            }}
          >
            {voiceState.isProcessing ? '🔄' : 
             voiceState.isRecording ? '🔴' : 
             inputMode === 'voice' ? '🎙️' : '🎤'}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading || voiceState.isRecording}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(78, 205, 196, 0.5)',
              background: newMessage.trim() && !isLoading && !voiceState.isRecording
                ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
                : 'rgba(255, 255, 255, 0.1)',
              color: newMessage.trim() && !isLoading && !voiceState.isRecording ? '#000' : '#888',
              cursor: newMessage.trim() && !isLoading && !voiceState.isRecording ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '60px',
              height: '48px'
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>

        {/* Mode Instructions */}
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#888',
          textAlign: 'center'
        }}>
          {inputMode === 'voice' 
            ? 'Click 🎙️ to record voice message. It will be transcribed to text.'
            : 'Click 🎤 to switch to voice mode, or type your message.'
          }
        </div>
      </div>
    </div>
  );
};
