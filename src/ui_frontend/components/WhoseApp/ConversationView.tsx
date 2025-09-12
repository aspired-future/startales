/**
 * ConversationView Component
 * Displays and manages character conversations with real-time messaging
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, WhoseAppConversation } from './WhoseAppMain';
import '../GameHUD/screens/shared/StandardDesign.css';

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'player' | 'character';
  content: string;
  messageType: 'text' | 'voice' | 'image';
  timestamp: Date;
  edited?: boolean;
  replyTo?: string;
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: Date;
  }>;
  metadata?: {
    characterMood?: string;
    confidentialityLevel?: 'public' | 'private' | 'confidential' | 'classified';
    urgency?: 'low' | 'normal' | 'high' | 'urgent';
  };
}

interface ConversationViewProps {
  conversation: WhoseAppConversation;
  currentUserId: string;
  onBack: () => void;
  onSendMessage: (content: string, type?: 'text' | 'voice') => Promise<void>;
  onStartCall: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  currentUserId,
  onBack,
  onSendMessage,
  onStartCall
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation messages
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
        const formattedMessages: ConversationMessage[] = data.data.map((msg: any) => ({
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          senderName: msg.senderName || 'Unknown',
          senderType: msg.senderId === currentUserId ? 'player' : 'character',
          content: msg.content,
          messageType: msg.type || 'text',
          timestamp: new Date(msg.timestamp),
          edited: msg.edited || false,
          replyTo: msg.replyTo,
          reactions: msg.reactions || [],
          metadata: msg.metadata || {}
        }));
        
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id, currentUserId]);

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Handle voice recording
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // TODO: Integrate with actual voice recording service
      console.log('Started voice recording');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      // TODO: Process voice recording and convert to text
      const transcribedText = `[Voice message - ${recordingDuration}s]`;
      setNewMessage(transcribedText);
      setInputMode('text'); // Switch back to text mode to show transcription
      
      console.log('Stopped voice recording');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && inputMode === 'text') || isLoading) return;

    let messageContent: string;
    let messageType: 'text' | 'voice';

    if (inputMode === 'voice' && isRecording) {
      // Stop recording and send as voice message
      await handleStopRecording();
      messageContent = `[Voice message - ${recordingDuration}s]`;
      messageType = 'voice';
    } else {
      messageContent = newMessage.trim();
      messageType = 'text';
    }

    setNewMessage('');
    setIsLoading(true);

    try {
      // Add optimistic message
      const optimisticMessage: ConversationMessage = {
        id: `temp_${Date.now()}`,
        conversationId: conversation.id,
        senderId: currentUserId,
        senderName: 'You',
        senderType: 'player',
        content: messageContent,
        messageType,
        timestamp: new Date(),
        reactions: []
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send message via API
      await onSendMessage(messageContent, messageType);

      // Simulate character typing
      setIsTyping(true);

      // Send to character AI for response
      const response = await fetch(`/api/whoseapp/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderId: currentUserId,
          content: messageContent,
          type: 'text'
        })
      });

      if (response.ok) {
        // Simulate character response delay
        setTimeout(async () => {
          try {
            // Generate character response using AI
            const characterResponse = await generateCharacterResponse(messageContent, conversation);
            
            const characterMessage: ConversationMessage = {
              id: `char_${Date.now()}`,
              conversationId: conversation.id,
              senderId: conversation.participants.find(p => p !== currentUserId) || 'character',
              senderName: conversation.participantNames.find(name => name !== 'You') || 'Character',
              senderType: 'character',
              content: characterResponse.content,
              messageType: 'text',
              timestamp: new Date(),
              reactions: [],
              metadata: {
                characterMood: characterResponse.mood,
                confidentialityLevel: 'private'
              }
            };

            setMessages(prev => [...prev, characterMessage]);
            setIsTyping(false);
          } catch (err) {
            console.error('Error generating character response:', err);
            setIsTyping(false);
          }
        }, 1500 + Math.random() * 2000);
      }

      // Reload messages to get the actual stored message
      setTimeout(() => {
        loadMessages();
      }, 500);

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp_')));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate character response using AI
  const generateCharacterResponse = async (playerMessage: string, conv: WhoseAppConversation) => {
    try {
      // This would integrate with the ContextualCharacterAI service
      const characterId = conv.participants.find(p => p !== currentUserId);
      
      // For now, return a mock response
      const responses = [
        { content: "I understand your concern. Let me look into this matter immediately.", mood: "professional" },
        { content: "That's an interesting perspective. I'll need to consider the implications carefully.", mood: "thoughtful" },
        { content: "I appreciate you bringing this to my attention. We should discuss this further.", mood: "engaged" },
        { content: "This aligns with our current strategic objectives. I'll coordinate with the relevant departments.", mood: "decisive" },
        { content: "I see the urgency of this situation. Let me mobilize the necessary resources.", mood: "urgent" }
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    } catch (err) {
      console.error('Error generating character response:', err);
      return { content: "I'm processing your message. Please give me a moment to respond appropriately.", mood: "neutral" };
    }
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && inputMode === 'text') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle input mode
  const toggleInputMode = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setInputMode(prev => prev === 'text' ? 'voice' : 'text');
    setNewMessage('');
  };

  // Format recording duration
  const formatRecordingDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Get message mood color
  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'professional': return '#4ecdc4';
      case 'thoughtful': return '#9b59b6';
      case 'engaged': return '#2ecc71';
      case 'decisive': return '#e74c3c';
      case 'urgent': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="conversation-view" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(15, 15, 35, 0.95)'
    }}>
      {/* Conversation Header */}
      <div className="conversation-header" style={{
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
              {conversation.title || conversation.participantNames.join(', ')}
            </h3>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {conversation.participantNames.length} participants • {conversation.conversationType}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="standard-btn social-theme"
            onClick={onStartCall}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            📞 Call
          </button>
          
          <button
            className="standard-btn"
            onClick={loadMessages}
            disabled={isLoading}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            {isLoading ? '🔄' : '↻'} Refresh
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.2)',
            border: '1px solid rgba(231, 76, 60, 0.4)',
            borderRadius: '8px',
            padding: '12px',
            color: '#e74c3c',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#888',
            fontSize: '14px'
          }}>
            Loading conversation...
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.senderType}`}
                style={{
                  display: 'flex',
                  flexDirection: message.senderType === 'player' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: message.senderType === 'player' ? 
                    'linear-gradient(135deg, #4ecdc4, #45b7aa)' : 
                    'linear-gradient(135deg, #9b59b6, #8e44ad)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {message.senderName.charAt(0).toUpperCase()}
                </div>

                {/* Message Content */}
                <div style={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {/* Sender Name & Timestamp */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#888',
                    justifyContent: message.senderType === 'player' ? 'flex-end' : 'flex-start'
                  }}>
                    <span style={{ fontWeight: '600' }}>{message.senderName}</span>
                    <span>•</span>
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.metadata?.characterMood && (
                      <>
                        <span>•</span>
                        <span style={{ 
                          color: getMoodColor(message.metadata.characterMood),
                          textTransform: 'capitalize'
                        }}>
                          {message.metadata.characterMood}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    background: message.senderType === 'player' ? 
                      'rgba(78, 205, 196, 0.2)' : 
                      'rgba(26, 26, 46, 0.8)',
                    border: `1px solid ${message.senderType === 'player' ? 
                      'rgba(78, 205, 196, 0.4)' : 
                      'rgba(78, 205, 196, 0.2)'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#e8e8e8',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {/* Voice Message Display */}
                    {message.messageType === 'voice' ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 0'
                      }}>
                        <span style={{ fontSize: '16px' }}>🎵</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                            Voice Message
                          </div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            {message.content}
                          </div>
                        </div>
                        <button
                          style={{
                            background: 'rgba(78, 205, 196, 0.2)',
                            border: '1px solid rgba(78, 205, 196, 0.4)',
                            borderRadius: '6px',
                            color: '#4ecdc4',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            // TODO: Implement voice playback
                            console.log('Play voice message:', message.id);
                          }}
                        >
                          ▶️ Play
                        </button>
                      </div>
                    ) : (
                      /* Text Message Display */
                      message.content
                    )}
                    
                    {message.edited && (
                      <div style={{
                        fontSize: '11px',
                        color: '#666',
                        fontStyle: 'italic',
                        marginTop: '4px'
                      }}>
                        (edited)
                      </div>
                    )}
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginTop: '4px'
                    }}>
                      {message.reactions.map((reaction, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(78, 205, 196, 0.1)',
                            border: '1px solid rgba(78, 205, 196, 0.3)',
                            borderRadius: '12px',
                            padding: '2px 6px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: 0.7
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px'
                }}>
                  💭
                </div>
                <div style={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  border: '1px solid rgba(78, 205, 196, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#888',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  Character is typing...
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container" style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(78, 205, 196, 0.2)',
        background: 'rgba(26, 26, 46, 0.8)'
      }}>
        {/* Input Mode Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Input Mode:</span>
          <button
            onClick={toggleInputMode}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: inputMode === 'text' ? 'rgba(78, 205, 196, 0.2)' : 'rgba(52, 152, 219, 0.2)',
              border: `1px solid ${inputMode === 'text' ? '#4ecdc4' : '#3498db'}`,
              borderRadius: '6px',
              color: inputMode === 'text' ? '#4ecdc4' : '#3498db',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {inputMode === 'text' ? '⌨️ Text' : '🎤 Voice'}
          </button>
          
          {isRecording && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#e74c3c',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <span className="recording-indicator">🔴</span>
              <span>Recording: {formatRecordingDuration(recordingDuration)}</span>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          {/* Text Input Mode */}
          {inputMode === 'text' && (
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  maxHeight: '120px',
                  padding: '12px 16px',
                  background: 'rgba(15, 15, 35, 0.8)',
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

          {/* Voice Input Mode */}
          {inputMode === 'voice' && (
            <div style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              background: 'rgba(15, 15, 35, 0.8)',
              border: `2px solid ${isRecording ? '#e74c3c' : 'rgba(52, 152, 219, 0.3)'}`,
              borderRadius: '8px',
              padding: '12px 16px'
            }}>
              {isRecording ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#e74c3c'
                }}>
                  <div className="recording-pulse" style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#e74c3c',
                    animation: 'pulse 1s infinite'
                  }} />
                  <span>Recording... {formatRecordingDuration(recordingDuration)}</span>
                  <button
                    onClick={handleStopRecording}
                    style={{
                      background: 'rgba(231, 76, 60, 0.2)',
                      border: '1px solid #e74c3c',
                      borderRadius: '4px',
                      color: '#e74c3c',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ⏹️ Stop
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#3498db'
                }}>
                  <span>🎤</span>
                  <span>Click "Record" to start voice message</span>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {inputMode === 'voice' && !isRecording && (
              <button
                className="standard-btn"
                onClick={handleStartRecording}
                disabled={isLoading}
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  background: 'rgba(52, 152, 219, 0.2)',
                  border: '1px solid #3498db',
                  color: '#3498db'
                }}
              >
                🎤 Record
              </button>
            )}
            
            <button
              className="standard-btn social-theme"
              onClick={handleSendMessage}
              disabled={
                (inputMode === 'text' && !newMessage.trim()) || 
                (inputMode === 'voice' && !isRecording) || 
                isLoading
              }
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                minWidth: '80px'
              }}
            >
              {isLoading ? '...' : 
               inputMode === 'voice' && isRecording ? 'Send Recording' : 
               'Send'}
            </button>
          </div>
        </div>

        {/* Voice Input Help Text */}
        {inputMode === 'voice' && !isRecording && (
          <div style={{
            fontSize: '11px',
            color: '#666',
            marginTop: '8px',
            fontStyle: 'italic'
          }}>
            💡 Tip: Click "Record" to start speaking, then "Send Recording" to send your voice message
          </div>
        )}
      </div>

      <style>{`
        .recording-indicator {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ConversationView;
