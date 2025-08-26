/**
 * WhoseApp Main Component
 * Primary interface for character communication, action tracking, and profile management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useWhoseAppWebSocket } from '../../hooks/useWhoseAppWebSocket';
import { ActionItemSystem } from './ActionItemSystem';
import CharacterProfileModal from './CharacterProfileModal';
import VoiceControls from './VoiceControls';
import ChannelParticipants from './ChannelParticipants';
import { voiceService } from '../../services/VoiceService';
import './WhoseAppMain.css';

// Interfaces
export interface WhoseAppChannel {
  id: string;
  name: string;
  description: string;
  type: 'department' | 'project' | 'emergency' | 'general' | 'cabinet';
  participants: string[];
  participantCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
  isPinned: boolean;
  confidentialityLevel: 'public' | 'restricted' | 'classified' | 'top_secret';
  createdAt: Date;
  createdBy: string;
  metadata: {
    departmentId?: string;
    projectId?: string;
    missionId?: string;
    cabinetDecisionId?: string;
  };
}

export interface WhoseAppConversation {
  id: string;
  participants: string[];
  participantNames: string[];
  participantAvatars: string[];
  conversationType: 'direct' | 'group' | 'channel';
  title?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
  isPinned: boolean;
}

export interface WhoseAppMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderTitle: string;
  senderAvatar: string;
  content: string;
  messageType: 'text' | 'action_update' | 'clarification_request' | 'report_back' | 'system' | 'file' | 'image' | 'voice';
  timestamp: Date;
  isRead: boolean;
  replyTo?: string;
  attachments?: any[];
  reactions?: any[];
  audioBlob?: Blob;
  audioUrl?: string;
  metadata?: {
    actionId?: string;
    cabinetDecisionId?: string;
    urgency?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  role: string;
  avatar: string;
  biography: string;
  specialties: string[];
  clearanceLevel: 'public' | 'restricted' | 'classified' | 'top_secret';
  whoseAppProfile: {
    status: 'online' | 'away' | 'busy' | 'offline';
    statusMessage?: string;
    lastSeen: Date;
    activeConversations: string[];
  };
  witterProfile: {
    handle: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    verificationStatus: 'verified' | 'government' | 'department' | 'none';
  };
  actionStats: {
    totalAssigned: number;
    completed: number;
    inProgress: number;
    overdue: number;
    successRate: number;
    currentWorkload: number;
  };
}

export interface WhoseAppMainProps {
  civilizationId: string;
  currentUserId: string;
  onOpenCharacterProfile?: (characterId: string) => void;
  onCreateAction?: (action: any) => void;
}

export const WhoseAppMain: React.FC<WhoseAppMainProps> = ({
  civilizationId,
  currentUserId,
  onOpenCharacterProfile,
  onCreateAction
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState<'conversations' | 'channels' | 'actions' | 'characters'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<WhoseAppConversation | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<WhoseAppChannel | null>(null);
  const [conversations, setConversations] = useState<WhoseAppConversation[]>([]);
  const [channels, setChannels] = useState<WhoseAppChannel[]>([]);
  const [messages, setMessages] = useState<WhoseAppMessage[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterForProfile, setSelectedCharacterForProfile] = useState<string | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string | null>(null);
  const [voiceEnabledParticipants, setVoiceEnabledParticipants] = useState<Set<string>>(new Set());

  // WebSocket Integration
  const {
    activities,
    conversations: wsConversations,
    characterUpdates,
    isConnected,
    connectionStatus,
    sendMessage,
    addActivity,
    markConversationRead
  } = useWhoseAppWebSocket({
    civilizationId,
    autoConnect: true
  });

  // Load initial data
  useEffect(() => {
    loadConversations();
    loadChannels();
    loadCharacters();
  }, [civilizationId]);

  // Simulate new messages arriving
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new messages to simulate real-time activity
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newMessage: WhoseAppMessage = {
          id: `msg_${Date.now()}`,
          conversationId: 'conv_001',
          senderId: 'char_diplomat_001',
          senderName: 'Ambassador Elena Vasquez',
          senderTitle: 'Chief Diplomatic Officer',
          senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
          content: getRandomMessage(),
          messageType: 'text',
          timestamp: new Date(),
          isRead: false,
          attachments: [],
          reactions: []
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.id === 'conv_001' 
            ? { ...conv, lastMessage: newMessage.content, lastMessageTime: newMessage.timestamp, unreadCount: conv.unreadCount + 1 }
            : conv
        ));
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getRandomMessage = () => {
    const messages = [
      "Just received an update from the negotiation team.",
      "The Zephyrians are requesting additional security guarantees.",
      "I think we should schedule a follow-up meeting tomorrow.",
      "The economic analysis looks promising so far.",
      "We may need to adjust our timeline based on their feedback.",
      "I'll have the revised proposal ready by end of day.",
      "The Senate committee wants to review this before we proceed.",
      "This could be a game-changer for our trade relations."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Sync with WebSocket data
  useEffect(() => {
    if (wsConversations.length > 0) {
      setConversations(wsConversations.map(conv => ({
        ...conv,
        participantNames: [], // Will be populated from character data
        participantAvatars: []
      })));
    }
  }, [wsConversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/whoseapp/conversations?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        // Fallback to mock data
        setConversations(generateMockConversations());
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setConversations(generateMockConversations());
    } finally {
      setLoading(false);
    }
  };

  const loadChannels = async () => {
    try {
      const response = await fetch(`/api/whoseapp/channels?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
      } else {
        // Fallback to mock data with prefilled groups
        setChannels(generateMockChannels());
      }
    } catch (err) {
      console.error('Failed to load channels:', err);
      setChannels(generateMockChannels());
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await fetch(`/api/characters/profiles?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters || []);
      } else {
        // Fallback to mock data
        setCharacters(generateMockCharacters());
      }
    } catch (err) {
      console.error('Failed to load characters:', err);
      setCharacters(generateMockCharacters());
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/whoseapp/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        // Fallback to mock data
        setMessages(generateMockMessages(conversationId));
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      setMessages(generateMockMessages(conversationId));
    }
  };

  // Handle conversation selection
  const handleConversationSelect = useCallback((conversation: WhoseAppConversation) => {
    setSelectedConversation(conversation);
    setSelectedChannel(null);
    loadMessages(conversation.id);
    markConversationRead(conversation.id);
  }, [markConversationRead]);

  // Handle channel selection
  const handleChannelSelect = useCallback((channel: WhoseAppChannel) => {
    setSelectedChannel(channel);
    setSelectedConversation(null);
    loadMessages(channel.id);
  }, []);

  // Handle character profile view
  const handleCharacterProfileView = useCallback((characterId: string) => {
    setSelectedCharacterForProfile(characterId);
    setIsProfileModalVisible(true);
    onOpenCharacterProfile?.(characterId);
  }, [onOpenCharacterProfile]);

  // Handle text character
  const handleTextCharacter = useCallback(async (character: CharacterProfile) => {
    try {
      // Check if conversation already exists
      let existingConversation = conversations.find(conv => 
        conv.conversationType === 'direct' && 
        conv.participants.includes(character.id) &&
        conv.participants.includes(currentUserId)
      );

      if (existingConversation) {
        // Switch to existing conversation
        setSelectedConversation(existingConversation);
        setSelectedChannel(null);
        setActiveTab('conversations');
        loadMessages(existingConversation.id);
      } else {
        // Create new conversation
        const newConversation: WhoseAppConversation = {
          id: `conv_${Date.now()}_${character.id}`,
          participants: [currentUserId, character.id],
          participantNames: ['You', character.name],
          participantAvatars: ['/api/characters/avatars/default.jpg', character.avatar],
          conversationType: 'direct',
          title: `Chat with ${character.name}`,
          lastMessage: '',
          lastMessageTime: new Date(),
          unreadCount: 0,
          isActive: true,
          isPinned: false
        };

        // Add to conversations list
        setConversations(prev => [newConversation, ...prev]);
        
        // Switch to new conversation
        setSelectedConversation(newConversation);
        setSelectedChannel(null);
        setActiveTab('conversations');
        
        // Initialize empty messages for this conversation
        setMessages([]);
        
        // Send initial system message
        const welcomeMessage: WhoseAppMessage = {
          id: `msg_${Date.now()}_welcome`,
          conversationId: newConversation.id,
          senderId: character.id,
          senderName: character.name,
          content: `Hello! I'm ${character.name}. How can I assist you today?`,
          timestamp: new Date(),
          messageType: 'text',
          isRead: false
        };
        
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error starting text conversation:', error);
      setError('Failed to start conversation');
    }
  }, [conversations, currentUserId, loadMessages]);

  // Handle call character
  const handleCallCharacter = useCallback(async (character: CharacterProfile) => {
    try {
      // Create a call notification/modal or integrate with call system
      // For now, we'll create a special "call" conversation
      const callConversation: WhoseAppConversation = {
        id: `call_${Date.now()}_${character.id}`,
        participants: [currentUserId, character.id],
        participantNames: ['You', character.name],
        participantAvatars: ['/api/characters/avatars/default.jpg', character.avatar],
        conversationType: 'direct',
        title: `📞 Call with ${character.name}`,
        lastMessage: 'Call initiated...',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isActive: true,
        isPinned: false
      };

      // Add to conversations list
      setConversations(prev => [callConversation, ...prev]);
      
      // Switch to call conversation
      setSelectedConversation(callConversation);
      setSelectedChannel(null);
      setActiveTab('conversations');
      
      // Create call messages
      const callMessages: WhoseAppMessage[] = [
        {
          id: `msg_${Date.now()}_call_start`,
          conversationId: callConversation.id,
          senderId: 'system',
          senderName: 'System',
          content: `📞 Call initiated with ${character.name}`,
          timestamp: new Date(),
          messageType: 'system',
          isRead: true
        },
        {
          id: `msg_${Date.now()}_call_connect`,
          conversationId: callConversation.id,
          senderId: character.id,
          senderName: character.name,
          content: `Hello! Thanks for calling. I'm ${character.whoseAppProfile.status === 'online' ? 'available to talk' : 'a bit busy but can chat briefly'}. What's on your mind?`,
          timestamp: new Date(Date.now() + 1000),
          messageType: 'text',
          isRead: false
        }
      ];
      
      setMessages(callMessages);
      
      // Simulate call connection delay
      setTimeout(() => {
        const connectedMessage: WhoseAppMessage = {
          id: `msg_${Date.now()}_connected`,
          conversationId: callConversation.id,
          senderId: 'system',
          senderName: 'System',
          content: '🟢 Call connected - You can now speak with the character',
          timestamp: new Date(),
          messageType: 'system',
          isRead: true
        };
        setMessages(prev => [...prev, connectedMessage]);
      }, 2000);
      
    } catch (error) {
      console.error('Error initiating call:', error);
      setError('Failed to initiate call');
    }
  }, [currentUserId]);

  // Handle voice message from voice controls
  const handleVoiceMessage = useCallback(async (transcript: string, audioBlob?: Blob) => {
    if (transcript.trim()) {
      // Send transcript as text message
      await handleSendMessage(transcript, 'text');
    } else if (audioBlob) {
      // Send audio blob as voice message
      await handleSendMessage('🎤 Voice Message', 'voice', audioBlob);
    }
  }, []);

  // Handle text-to-speech for messages
  const handleTextToSpeech = useCallback(async (text: string, characterId?: string) => {
    try {
      if (characterId && (selectedChannel || selectedConversation)) {
        // Use channel-specific speaking with visual indicators
        await voiceService.speakInChannel(
          text, 
          characterId,
          () => setCurrentSpeakerId(characterId), // Speaking started
          () => setCurrentSpeakerId(null)        // Speaking ended
        );
      } else {
        // Fallback to regular TTS
        await voiceService.textToSpeech(text, {
          characterId: characterId,
          rate: 1.0,
          pitch: 1.0,
          volume: 0.8
        });
      }
    } catch (error) {
      console.error('TTS failed:', error);
    }
  }, [selectedChannel, selectedConversation]);

  // Handle voice toggle for participants
  const handleVoiceToggle = useCallback((participantId: string, enabled: boolean) => {
    setVoiceEnabledParticipants(prev => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(participantId);
      } else {
        newSet.delete(participantId);
      }
      return newSet;
    });
  }, []);

  // Handle participant click (show profile)
  const handleParticipantClick = useCallback((participantId: string) => {
    handleCharacterProfileView(participantId);
  }, [handleCharacterProfileView]);

  // Auto-assign voices when channel changes
  useEffect(() => {
    if (selectedChannel) {
      const participantIds = selectedChannel.participants || [];
      voiceService.autoAssignVoices(participantIds);
      
      // Enable voice for all participants by default
      setVoiceEnabledParticipants(new Set(participantIds));
    }
  }, [selectedChannel]);

  // Generate channel participants from channel data
  const generateChannelParticipants = useCallback((channel: WhoseAppChannel) => {
    const participants = [];
    
    // Add current user as a player participant
    participants.push({
      id: currentUserId,
      name: 'You',
      avatar: '/api/characters/avatars/player_default.jpg',
      title: 'Player',
      status: 'online' as const,
      isPlayer: true
    });

    // Add characters based on channel type and mock data
    const channelCharacters = characters.filter(char => {
      // Filter characters based on channel type
      switch (channel.type) {
        case 'department':
          return char.department?.toLowerCase().includes(channel.name.toLowerCase());
        case 'cabinet':
          return char.title?.toLowerCase().includes('minister') || 
                 char.title?.toLowerCase().includes('secretary') ||
                 char.title?.toLowerCase().includes('advisor');
        case 'emergency':
          return char.title?.toLowerCase().includes('commander') ||
                 char.title?.toLowerCase().includes('chief') ||
                 char.department?.toLowerCase().includes('security');
        default:
          return true; // Include all for general channels
      }
    });

    // Convert characters to participant format
    channelCharacters.forEach(char => {
      participants.push({
        id: char.id,
        name: char.name,
        avatar: char.avatar,
        title: char.title,
        status: char.whoseAppProfile?.status || 'online' as const,
        isPlayer: false
      });
    });

    return participants.slice(0, 12); // Limit to 12 participants for UI
  }, [currentUserId, characters]);

  // Render conversation messages (reusable for both conversations and channels)
  const renderConversationMessages = useCallback(() => {
    const conversationId = selectedConversation?.id || selectedChannel?.id;
    if (!conversationId) return null;

    return (
      <div className="conversation-messages">
        {/* Messages Area */}
        <div className="messages-area" style={{
          flex: 1,
          padding: '15px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(15, 15, 35, 0.6)',
          minHeight: '300px',
          borderRadius: '8px',
          border: '1px solid rgba(78, 205, 196, 0.2)',
          marginBottom: '16px'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#888',
              padding: '40px 20px',
              fontStyle: 'italic'
            }}>
              {selectedChannel ? `No messages in #${selectedChannel.name} yet. Start the conversation!` : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
                style={{
                  display: 'flex',
                  flexDirection: message.senderId === currentUserId ? 'row-reverse' : 'row',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Avatar */}
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: message.senderId === currentUserId ? '#4ecdc4' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    border: currentSpeakerId === message.senderId ? '3px solid #4CAF50' : '2px solid transparent',
                    animation: currentSpeakerId === message.senderId ? 'speaking-glow 2s infinite' : 'none'
                  }}
                  onClick={() => handleCharacterProfileView(message.senderId)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.border = '2px solid #4ecdc4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.border = currentSpeakerId === message.senderId ? '3px solid #4CAF50' : '2px solid transparent';
                  }}
                  title={`View ${message.senderName}'s profile`}
                >
                  {message.senderName ? message.senderName.charAt(0).toUpperCase() : '?'}
                </div>

                {/* Message Content */}
                <div style={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    textAlign: message.senderId === currentUserId ? 'right' : 'left'
                  }}>
                    <span 
                      style={{
                        cursor: 'pointer',
                        color: currentSpeakerId === message.senderId ? '#4CAF50' : '#4ecdc4',
                        textDecoration: 'underline',
                        textDecorationColor: 'transparent',
                        transition: 'text-decoration-color 0.2s ease',
                        fontWeight: currentSpeakerId === message.senderId ? 'bold' : 'normal'
                      }}
                      onClick={() => handleCharacterProfileView(message.senderId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecorationColor = '#4ecdc4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecorationColor = 'transparent';
                      }}
                      title={`View ${message.senderName}'s profile`}
                    >
                      {message.senderName}
                      {currentSpeakerId === message.senderId && ' 🗣️'}
                    </span> • {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{
                    background: message.senderId === currentUserId ? 
                      'rgba(78, 205, 196, 0.2)' : 'rgba(26, 26, 46, 0.8)',
                    border: `1px solid ${message.senderId === currentUserId ? '#4ecdc4' : 'rgba(78, 205, 196, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '10px 15px',
                    color: '#e8e8e8',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {message.messageType === 'voice' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🎤</span>
                        <span>{message.content}</span>
                        {message.audioUrl && (
                          <audio 
                            controls 
                            style={{ 
                              maxWidth: '200px', 
                              height: '30px',
                              background: 'rgba(78, 205, 196, 0.1)',
                              borderRadius: '4px'
                            }}
                          >
                            <source src={message.audioUrl} type="audio/webm" />
                            Your browser does not support audio playback.
                          </audio>
                        )}
                        <button
                          onClick={() => handleTextToSpeech(message.content, message.senderId)}
                          style={{
                            background: 'rgba(255, 193, 7, 0.2)',
                            border: '1px solid rgba(255, 193, 7, 0.4)',
                            borderRadius: '4px',
                            color: '#FFC107',
                            padding: '4px 6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Play with TTS"
                        >
                          🔊
                        </button>
                      </div>
                    ) : (
                      <>
                        {message.content}
                        {message.senderId !== currentUserId && voiceEnabledParticipants.has(message.senderId) && (
                          <button
                            onClick={() => handleTextToSpeech(message.content, message.senderId)}
                            style={{
                              background: 'rgba(255, 193, 7, 0.1)',
                              border: '1px solid rgba(255, 193, 7, 0.3)',
                              borderRadius: '4px',
                              color: '#FFC107',
                              padding: '2px 4px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              marginLeft: '8px',
                              opacity: 0.7,
                              transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '0.7';
                            }}
                            title="Read aloud with TTS"
                          >
                            🔊
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {message.messageType === 'action_update' && (
                    <div style={{
                      fontSize: '11px',
                      color: '#4ecdc4',
                      fontStyle: 'italic',
                      textAlign: message.senderId === currentUserId ? 'right' : 'left'
                    }}>
                      📋 Action Item Created
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input for Channels */}
        <div className="message-input" style={{
          padding: '15px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(26, 26, 46, 0.4)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Text Input Row */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={selectedChannel ? `Message #${selectedChannel.name}...` : `Message ${selectedConversation?.participantNames.join(', ')}...`}
                style={{
                  flex: 1,
                  background: 'rgba(15, 15, 35, 0.8)',
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#e8e8e8',
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '40px',
                  maxHeight: '100px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const content = messageInput.trim();
                    if (content) {
                      handleSendMessage(content);
                      setMessageInput('');
                    }
                  }
                }}
              />
              
              {/* Voice Mode Toggle */}
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                style={{
                  background: isVoiceMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(78, 205, 196, 0.1)',
                  border: `1px solid ${isVoiceMode ? '#4CAF50' : 'rgba(78, 205, 196, 0.4)'}`,
                  borderRadius: '8px',
                  color: isVoiceMode ? '#4CAF50' : '#4ecdc4',
                  padding: '10px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  height: '40px',
                  minWidth: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
              >
                {isVoiceMode ? '🎤' : '⌨️'}
              </button>
              
              {/* Send Button */}
              <button
                onClick={() => {
                  const content = messageInput.trim();
                  if (content) {
                    handleSendMessage(content);
                    setMessageInput('');
                  }
                }}
                disabled={!messageInput.trim()}
                style={{
                  background: messageInput.trim() ? 'rgba(78, 205, 196, 0.2)' : 'rgba(78, 205, 196, 0.1)',
                  border: '1px solid #4ecdc4',
                  borderRadius: '8px',
                  color: messageInput.trim() ? '#4ecdc4' : '#666',
                  padding: '10px 15px',
                  fontSize: '14px',
                  cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                  height: '40px',
                  transition: 'all 0.2s ease'
                }}
              >
                Send
              </button>
            </div>
            
            {/* Voice Controls */}
            {isVoiceMode && (
              <VoiceControls
                onVoiceMessage={handleVoiceMessage}
                onTextToSpeech={handleTextToSpeech}
                characterId={selectedChannel ? 'channel_voice' : selectedConversation?.participants.find(p => p !== currentUserId)}
                disabled={false}
                showTTSControls={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  }, [selectedConversation, selectedChannel, messages, messageInput, isVoiceMode, currentUserId, currentSpeakerId, voiceEnabledParticipants, handleVoiceMessage, handleTextToSpeech, handleSendMessage, handleCharacterProfileView]);

  // Send message
  const handleSendMessage = useCallback(async (content: string, messageType: string = 'text', audioBlob?: Blob) => {
    if (!selectedConversation && !selectedChannel) return;

    const conversationId = selectedConversation?.id || selectedChannel?.id;
    if (!conversationId) return;

    try {
      const response = await fetch('/api/whoseapp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          content,
          messageType,
          civilizationId
        })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages(prev => [...prev, newMessage]);
        
        // Send via WebSocket for real-time updates
        sendMessage({
          type: 'new_message',
          payload: {
            conversationId,
            content,
            messageType,
            senderId: currentUserId
          }
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  }, [selectedConversation, selectedChannel, currentUserId, civilizationId, sendMessage]);

  // Render connection status
  const renderConnectionStatus = () => (
    <div className="connection-status" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: isConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
      borderRadius: '6px',
      fontSize: '12px',
      color: isConnected ? '#4CAF50' : '#F44336'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: isConnected ? '#4CAF50' : '#F44336'
      }} />
      {connectionStatus === 'connected' ? 'Connected' : 
       connectionStatus === 'connecting' ? 'Connecting...' : 
       connectionStatus === 'disconnected' ? 'Disconnected' : 'Error'}
    </div>
  );

  // Render conversations list
  const renderConversations = () => {
    if (selectedConversation) {
      return renderConversationMessages();
    }

    return (
      <div className="conversations-list">
        <div className="list-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '15px' 
        }}>
          <h3 style={{ color: '#4ecdc4', margin: 0 }}>Conversations</h3>
          <button 
            className="new-conversation-btn"
            style={{
              background: 'rgba(78, 205, 196, 0.2)',
              border: '1px solid #4ecdc4',
              borderRadius: '6px',
              color: '#4ecdc4',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            + New
          </button>
        </div>
        
        <div className="conversation-items">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(78, 205, 196, 0.2)',
                marginBottom: '8px',
                cursor: 'pointer',
                background: selectedConversation?.id === conversation.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'rgba(26, 26, 46, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleConversationSelect(conversation)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ fontWeight: 'bold', color: '#e8e8e8' }}>
                  {conversation.title || `${conversation.participantNames.join(', ')}`}
                </div>
                {conversation.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                {conversation.lastMessage}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {new Date(conversation.lastMessageTime).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render channels list with prefilled groups
  const renderChannels = () => {
    // If a channel is selected, show the channel view with participants and messages
    if (selectedChannel) {
      return (
        <div className="channel-view">
          {/* Channel Header */}
          <div className="channel-header" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            padding: '16px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(78, 205, 196, 0.2)',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setSelectedChannel(null)}
              style={{
                background: 'rgba(78, 205, 196, 0.1)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                color: '#4ecdc4',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Channels
            </button>
            <div>
              <h3 style={{ color: '#4ecdc4', margin: '0 0 4px 0' }}>
                # {selectedChannel.name}
              </h3>
              <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>
                {selectedChannel.description || `${selectedChannel.participantCount} members`}
              </p>
            </div>
          </div>

          {/* Channel Participants */}
          <ChannelParticipants
            participants={generateChannelParticipants(selectedChannel)}
            currentSpeakerId={currentSpeakerId}
            onParticipantClick={handleParticipantClick}
            onVoiceToggle={handleVoiceToggle}
            showVoiceControls={true}
          />

          {/* Channel Messages (reuse conversation rendering) */}
          {renderConversationMessages()}
        </div>
      );
    }

    // Otherwise show the channels list
    return (
    <div className="channels-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ color: '#4ecdc4', margin: 0 }}>Channels</h3>
        <button 
          className="new-channel-btn"
          style={{
            background: 'rgba(78, 205, 196, 0.2)',
            border: '1px solid #4ecdc4',
            borderRadius: '6px',
            color: '#4ecdc4',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          + Create
        </button>
      </div>

      {/* Channel Categories */}
      <div className="channel-categories">
        {/* Department Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🏛️ Departments
          </h4>
          {channels.filter(c => c.type === 'department').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🚀 Projects & Missions
          </h4>
          {channels.filter(c => c.type === 'project').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cabinet & Emergency Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🚨 Cabinet & Emergency
          </h4>
          {channels.filter(c => c.type === 'cabinet' || c.type === 'emergency').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* General Channels */}
        <div className="channel-category">
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            💬 General
          </h4>
          {channels.filter(c => c.type === 'general').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  // Render characters list
  const renderCharacters = () => (
    <div className="characters-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ color: '#4ecdc4', margin: 0 }}>Characters</h3>
      </div>
      
      <div className="character-items">
        {characters.map(character => (
          <div
            key={character.id}
            className="character-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(15, 15, 35, 0.6)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              marginBottom: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleCharacterClick(character)}
          >
            <img
              src={character.avatar}
              alt={character.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(78, 205, 196, 0.3)'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%234ecdc4"/><text x="20" y="25" text-anchor="middle" fill="white" font-size="14">${character.name.charAt(0)}</text></svg>`;
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                {character.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {character.title}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  background: 'rgba(78, 205, 196, 0.2)',
                  border: '1px solid #4ecdc4',
                  borderRadius: '6px',
                  color: '#4ecdc4',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                💬 Message
              </button>
              <button
                style={{
                  background: 'rgba(78, 205, 196, 0.2)',
                  border: '1px solid #4ecdc4',
                  borderRadius: '6px',
                  color: '#4ecdc4',
                  padding: '4px 8px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                📞 Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render action items
  const renderActionItems = () => (
    <div className="action-items-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ color: '#4ecdc4', margin: 0 }}>Action Items</h3>
        <button 
          className="new-action-btn"
          style={{
            background: 'rgba(78, 205, 196, 0.2)',
            border: '1px solid #4ecdc4',
            borderRadius: '6px',
            color: '#4ecdc4',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          + New Action
        </button>
      </div>
      
      <div className="action-items">
        {actionItems.map(item => (
          <div
            key={item.id}
            className="action-item"
            style={{
              background: 'rgba(15, 15, 35, 0.6)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h4 style={{ color: '#e8e8e8', margin: '0 0 4px 0', fontSize: '14px' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#888', margin: '0 0 8px 0', fontSize: '12px' }}>
                  Assigned to: {item.assignedTo}
                </p>
              </div>
              <span style={{
                background: item.status === 'completed' ? 'rgba(76, 175, 80, 0.2)' :
                           item.status === 'in-progress' ? 'rgba(255, 193, 7, 0.2)' :
                           'rgba(78, 205, 196, 0.2)',
                color: item.status === 'completed' ? '#4CAF50' :
                       item.status === 'in-progress' ? '#FFC107' :
                       '#4ecdc4',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {item.status}
              </span>
            </div>
            
            <p style={{ color: '#ccc', fontSize: '13px', margin: '0 0 12px 0' }}>
              {item.description}
            </p>
            
            {item.updates && item.updates.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>
                  Latest Update:
                </div>
                <div style={{
                  background: 'rgba(26, 26, 46, 0.6)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#ccc'
                }}>
                  {item.updates[item.updates.length - 1].message}
                  <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                    {new Date(item.updates[item.updates.length - 1].timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Main render function
  const renderContent = () => {
    if (activeTab === 'conversations') {
      if (selectedConversation) {
        return renderConversationMessages();
      }
      return renderConversations();
    } else if (activeTab === 'channels') {
      return renderChannels();
    } else if (activeTab === 'characters') {
      return renderCharacters();
    } else if (activeTab === 'actions') {
      return renderActionItems();
    }
    return null;
  };

  return (
    <div className="whoseapp-main" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(15, 15, 35, 0.9)',
      color: '#e8e8e8'
    }}>
      {/* Header */}
      <div className="whoseapp-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        background: 'rgba(26, 26, 46, 0.6)'
      }}>
        <h2 style={{ color: '#4ecdc4', margin: 0, fontSize: '20px' }}>
          💬 WhoseApp
        </h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleVoiceModeToggle}
            style={{
              background: voiceModeEnabled ? 'rgba(76, 175, 80, 0.3)' : 'rgba(78, 205, 196, 0.2)',
              border: `1px solid ${voiceModeEnabled ? '#4CAF50' : '#4ecdc4'}`,
              borderRadius: '6px',
              color: voiceModeEnabled ? '#4CAF50' : '#4ecdc4',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Toggle voice mode"
          >
            {voiceModeEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
          
          <button
            style={{
              background: 'rgba(78, 205, 196, 0.2)',
              border: '1px solid #4ecdc4',
              borderRadius: '6px',
              color: '#4ecdc4',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{
        display: 'flex',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        background: 'rgba(26, 26, 46, 0.4)'
      }}>
        {[
          { id: 'conversations', label: '💬 Conversations', count: conversations.length },
          { id: 'channels', label: '📺 Channels', count: channels.length },
          { id: 'characters', label: '👥 Characters', count: characters.length },
          { id: 'actions', label: '📋 Actions', count: actionItems.filter(a => a.status !== 'completed').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === tab.id ? 'rgba(78, 205, 196, 0.2)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4ecdc4' : '2px solid transparent',
              color: activeTab === tab.id ? '#4ecdc4' : '#888',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.id ? '#4ecdc4' : 'rgba(78, 205, 196, 0.3)',
                color: activeTab === tab.id ? '#0f0f23' : '#4ecdc4',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="content-area" style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        {renderContent()}
      </div>

      {/* Voice Controls (when enabled) */}
      {voiceModeEnabled && (
        <div className="voice-controls-container" style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(26, 26, 46, 0.6)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <button
            onClick={handleStartRecording}
            disabled={isRecording}
            style={{
              background: isRecording ? 'rgba(244, 67, 54, 0.3)' : 'rgba(76, 175, 80, 0.2)',
              border: `1px solid ${isRecording ? '#F44336' : '#4CAF50'}`,
              borderRadius: '8px',
              color: isRecording ? '#F44336' : '#4CAF50',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: isRecording ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isRecording ? '🔴 Recording...' : '🎙️ Record'}
          </button>
          
          <button
            onClick={handleStopRecording}
            disabled={!isRecording}
            style={{
              background: !isRecording ? 'rgba(78, 205, 196, 0.1)' : 'rgba(78, 205, 196, 0.2)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              color: !isRecording ? '#666' : '#4ecdc4',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: !isRecording ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ⏹️ Stop
          </button>
          
          <div style={{ flex: 1, fontSize: '12px', color: '#888' }}>
            {isRecording ? 'Recording voice message...' : 'Voice controls ready'}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoseAppMain;
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Avatar */}
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: message.senderId === currentUserId ? '#4ecdc4' : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    border: '2px solid transparent'
                  }}
                  onClick={() => handleCharacterProfileView(message.senderId)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.border = '2px solid #4ecdc4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.border = '2px solid transparent';
                  }}
                  title={`View ${message.senderName}'s profile`}
                >
                  {message.senderName ? message.senderName.charAt(0).toUpperCase() : '?'}
                </div>

                {/* Message Content */}
                <div style={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    textAlign: message.senderId === currentUserId ? 'right' : 'left'
                  }}>
                    <span 
                      style={{
                        cursor: 'pointer',
                        color: '#4ecdc4',
                        textDecoration: 'underline',
                        textDecorationColor: 'transparent',
                        transition: 'text-decoration-color 0.2s ease'
                      }}
                      onClick={() => handleCharacterProfileView(message.senderId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecorationColor = '#4ecdc4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecorationColor = 'transparent';
                      }}
                      title={`View ${message.senderName}'s profile`}
                    >
                      {message.senderName}
                    </span> • {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{
                    background: message.senderId === currentUserId ? 
                      'rgba(78, 205, 196, 0.2)' : 'rgba(26, 26, 46, 0.8)',
                    border: `1px solid ${message.senderId === currentUserId ? '#4ecdc4' : 'rgba(78, 205, 196, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '10px 15px',
                    color: '#e8e8e8',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {message.messageType === 'voice' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🎤</span>
                        <span>{message.content}</span>
                        {message.audioUrl && (
                          <audio 
                            controls 
                            style={{ 
                              maxWidth: '200px', 
                              height: '30px',
                              background: 'rgba(78, 205, 196, 0.1)',
                              borderRadius: '4px'
                            }}
                          >
                            <source src={message.audioUrl} type="audio/webm" />
                            Your browser does not support audio playback.
                          </audio>
                        )}
                        <button
                          onClick={() => handleTextToSpeech(message.content, message.senderId)}
                          style={{
                            background: 'rgba(255, 193, 7, 0.2)',
                            border: '1px solid rgba(255, 193, 7, 0.4)',
                            borderRadius: '4px',
                            color: '#FFC107',
                            padding: '4px 6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Play with TTS"
                        >
                          🔊
                        </button>
                      </div>
                    ) : (
                      <>
                        {message.content}
                        {message.senderId !== currentUserId && (
                          <button
                            onClick={() => handleTextToSpeech(message.content, message.senderId)}
                            style={{
                              background: 'rgba(255, 193, 7, 0.1)',
                              border: '1px solid rgba(255, 193, 7, 0.3)',
                              borderRadius: '4px',
                              color: '#FFC107',
                              padding: '2px 4px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              marginLeft: '8px',
                              opacity: 0.7,
                              transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '0.7';
                            }}
                            title="Read aloud with TTS"
                          >
                            🔊
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {message.messageType === 'action_update' && (
                    <div style={{
                      fontSize: '11px',
                      color: '#4ecdc4',
                      fontStyle: 'italic',
                      textAlign: message.senderId === currentUserId ? 'right' : 'left'
                    }}>
                      📋 Action Item Created
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="message-input" style={{
          padding: '15px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(26, 26, 46, 0.4)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Text Input Row */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${selectedConversation.participantNames.join(', ')}...`}
                style={{
                  flex: 1,
                  background: 'rgba(15, 15, 35, 0.8)',
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#e8e8e8',
                  fontSize: '14px',
                  resize: 'none',
                  minHeight: '40px',
                  maxHeight: '100px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const content = messageInput.trim();
                    if (content) {
                      handleSendMessage(content);
                      setMessageInput('');
                    }
                  }
                }}
              />
              
              {/* Voice Mode Toggle */}
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                style={{
                  background: isVoiceMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(78, 205, 196, 0.1)',
                  border: `1px solid ${isVoiceMode ? '#4CAF50' : 'rgba(78, 205, 196, 0.4)'}`,
                  borderRadius: '8px',
                  color: isVoiceMode ? '#4CAF50' : '#4ecdc4',
                  padding: '10px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  height: '40px',
                  minWidth: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
              >
                {isVoiceMode ? '🎤' : '⌨️'}
              </button>
              
              {/* Send Button */}
              <button
                onClick={() => {
                  const content = messageInput.trim();
                  if (content) {
                    handleSendMessage(content);
                    setMessageInput('');
                  }
                }}
                disabled={!messageInput.trim()}
                style={{
                  background: messageInput.trim() ? 'rgba(78, 205, 196, 0.2)' : 'rgba(78, 205, 196, 0.1)',
                  border: '1px solid #4ecdc4',
                  borderRadius: '8px',
                  color: messageInput.trim() ? '#4ecdc4' : '#666',
                  padding: '10px 15px',
                  fontSize: '14px',
                  cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                  height: '40px',
                  transition: 'all 0.2s ease'
                }}
              >
                Send
              </button>
              
              {/* TTS Button for Character Messages */}
              {selectedConversation && selectedConversation.participants.length === 2 && (
                <button
                  onClick={() => {
                    const lastCharacterMessage = messages
                      .filter(m => m.senderId !== currentUserId)
                      .slice(-1)[0];
                    if (lastCharacterMessage) {
                      handleTextToSpeech(lastCharacterMessage.content, lastCharacterMessage.senderId);
                    }
                  }}
                  style={{
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.4)',
                    borderRadius: '8px',
                    color: '#FFC107',
                    padding: '10px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    height: '40px',
                    minWidth: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title="Speak last character message"
                >
                  🔊
                </button>
              )}
            </div>
            
            {/* Voice Controls */}
            {isVoiceMode && (
              <VoiceControls
                onVoiceMessage={handleVoiceMessage}
                onTextToSpeech={handleTextToSpeech}
                characterId={selectedConversation?.participants.find(p => p !== currentUserId)}
                disabled={false}
                showTTSControls={true}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render channels list with prefilled groups
  const renderChannels = () => {
    // If a channel is selected, show the channel view with participants and messages
    if (selectedChannel) {
      return (
        <div className="channel-view">
          {/* Channel Header */}
          <div className="channel-header" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            padding: '16px',
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(78, 205, 196, 0.2)',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => setSelectedChannel(null)}
              style={{
                background: 'rgba(78, 205, 196, 0.1)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                color: '#4ecdc4',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Channels
            </button>
            <div>
              <h3 style={{ color: '#4ecdc4', margin: '0 0 4px 0' }}>
                # {selectedChannel.name}
              </h3>
              <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>
                {selectedChannel.description || `${selectedChannel.participantCount} members`}
              </p>
            </div>
          </div>

          {/* Channel Participants */}
          <ChannelParticipants
            participants={generateChannelParticipants(selectedChannel)}
            currentSpeakerId={currentSpeakerId}
            onParticipantClick={handleParticipantClick}
            onVoiceToggle={handleVoiceToggle}
            showVoiceControls={true}
          />

          {/* Channel Messages (reuse conversation rendering) */}
          {renderConversationMessages()}
        </div>
      );
    }

    // Otherwise show the channels list
    return (
    <div className="channels-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ color: '#4ecdc4', margin: 0 }}>Channels</h3>
        <button 
          className="new-channel-btn"
          style={{
            background: 'rgba(78, 205, 196, 0.2)',
            border: '1px solid #4ecdc4',
            borderRadius: '6px',
            color: '#4ecdc4',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          + Create
        </button>
      </div>

      {/* Channel Categories */}
      <div className="channel-categories">
        {/* Department Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🏛️ Departments
          </h4>
          {channels.filter(c => c.type === 'department').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🚀 Projects & Missions
          </h4>
          {channels.filter(c => c.type === 'project').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cabinet & Emergency Channels */}
        <div className="channel-category" style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            🚨 Cabinet & Emergency
          </h4>
          {channels.filter(c => c.type === 'cabinet' || c.type === 'emergency').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members • {channel.confidentialityLevel}
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* General Channels */}
        <div className="channel-category">
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
            💬 General
          </h4>
          {channels.filter(c => c.type === 'general').map(channel => (
            <div
              key={channel.id}
              className={`channel-item ${selectedChannel?.id === channel.id ? 'selected' : ''}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '5px',
                cursor: 'pointer',
                background: selectedChannel?.id === channel.id ? 
                  'rgba(78, 205, 196, 0.1)' : 'transparent',
                border: selectedChannel?.id === channel.id ? 
                  '1px solid rgba(78, 205, 196, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleChannelSelect(channel)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                    # {channel.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {channel.participantCount} members
                  </div>
                </div>
                {channel.unreadCount > 0 && (
                  <span style={{
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  // Render characters list
  const renderCharacters = () => (
    <div className="characters-list">
      <div className="list-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h3 style={{ color: '#4ecdc4', margin: 0 }}>Characters</h3>
      </div>
      
      <div className="character-items">
        {characters.map(character => (
          <div
            key={character.id}
            className="character-item"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              marginBottom: '8px',
              background: 'rgba(26, 26, 46, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Avatar - Clickable for Profile */}
              <div 
                style={{ 
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => handleCharacterProfileView(character.id)}
                title={`View ${character.name}'s profile`}
              >
                <img 
                  src={character.avatar} 
                  alt={character.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #4ecdc4',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: character.whoseAppProfile.status === 'online' ? '#4CAF50' : 
                             character.whoseAppProfile.status === 'busy' ? '#FF9800' : '#757575',
                  border: '2px solid #0f0f23'
                }} />
                {character.actionStats.inProgress > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#F44336',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    border: '2px solid #0f0f23'
                  }}>
                    {character.actionStats.inProgress}
                  </div>
                )}
              </div>
              
              {/* Character Info - Clickable for Profile */}
              <div 
                style={{ 
                  flex: 1,
                  cursor: 'pointer'
                }}
                onClick={() => handleCharacterProfileView(character.id)}
                title={`View ${character.name}'s profile`}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  color: '#e8e8e8', 
                  fontSize: '14px',
                  textDecoration: 'underline',
                  textDecorationColor: 'transparent',
                  transition: 'text-decoration-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecorationColor = '#4ecdc4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecorationColor = 'transparent';
                }}>
                  {character.name}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {character.title}
                </div>
                <div style={{ fontSize: '11px', color: '#4ecdc4' }}>
                  {character.department}
                </div>
              </div>
              
              {/* Communication Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {/* Text Button */}
                  <button
                    style={{
                      background: 'rgba(78, 205, 196, 0.2)',
                      border: '1px solid rgba(78, 205, 196, 0.4)',
                      color: '#4ecdc4',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTextCharacter(character);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(78, 205, 196, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(78, 205, 196, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title={`Send message to ${character.name}`}
                  >
                    💬 Text
                  </button>
                  
                  {/* Call Button */}
                  <button
                    style={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      border: '1px solid rgba(76, 175, 80, 0.4)',
                      color: '#4CAF50',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallCharacter(character);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title={`Call ${character.name}`}
                  >
                    📞 Call
                  </button>
                </div>
                
                {/* Status Info */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    {character.whoseAppProfile.status}
                  </div>
                  {character.actionStats.inProgress > 0 && (
                    <div style={{ fontSize: '10px', color: '#F44336', fontWeight: 'bold' }}>
                      {character.actionStats.inProgress} active
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render main content
  const renderMainContent = () => {
    switch (activeTab) {
      case 'conversations':
        return renderConversations();
      case 'channels':
        return renderChannels();
      case 'actions':
        return (
          <ActionItemSystem
            civilizationId={civilizationId}
            currentUserId={currentUserId}
            onActionCreate={onCreateAction}
            onCharacterProfileView={handleCharacterProfileView}
          />
        );
      case 'characters':
        return renderCharacters();
      default:
        return renderConversations();
    }
  };

  if (loading) {
    return (
      <div className="whoseapp-loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#4ecdc4'
      }}>
        <div>Loading WhoseApp...</div>
      </div>
    );
  }

  return (
    <div className="whoseapp-main" style={{
      background: 'rgba(15, 15, 35, 0.95)',
      color: '#e8e8e8',
      borderRadius: '12px',
      border: '1px solid rgba(78, 205, 196, 0.3)',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div className="whoseapp-header" style={{
        padding: '20px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>📱 WhoseApp</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            Character communication, action tracking, and collaboration hub
          </p>
        </div>
        {renderConnectionStatus()}
      </div>

      {/* Navigation Tabs */}
      <div className="whoseapp-tabs" style={{
        display: 'flex',
        gap: '10px',
        padding: '15px 20px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)'
      }}>
        {[
          { id: 'conversations', label: '💬 Conversations', count: conversations.length },
          { id: 'channels', label: '📢 Channels', count: channels.length },
          { id: 'actions', label: '📋 Actions', count: 0 },
          { id: 'characters', label: '👥 Characters', count: characters.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'rgba(78, 205, 196, 0.2)' : 'transparent',
              color: activeTab === tab.id ? '#4ecdc4' : '#888',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{
          background: 'rgba(244, 67, 54, 0.2)',
          color: '#F44336',
          padding: '10px 20px',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          margin: '0 20px 20px 20px',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="whoseapp-content" style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto'
      }}>
        {renderMainContent()}
      </div>

      {/* Character Profile Modal */}
      <CharacterProfileModal
        characterId={selectedCharacterForProfile}
        isVisible={isProfileModalVisible}
        onClose={() => {
          setIsProfileModalVisible(false);
          setSelectedCharacterForProfile(null);
        }}
      />
    </div>
  );
};

// Mock data generators
function generateMockConversations(): WhoseAppConversation[] {
  return [
    {
      id: 'conv_001',
      participants: ['char_diplomat_001', 'char_leader_001'],
      participantNames: ['Ambassador Elena Vasquez', 'Commander Alpha'],
      participantAvatars: ['/api/characters/avatars/elena_vasquez.jpg', '/api/characters/avatars/commander_alpha.jpg'],
      conversationType: 'direct',
      title: 'Trade Negotiations Update',
      lastMessage: 'The Zephyrian delegation has agreed to our initial terms...',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 2,
      isActive: true,
      isPinned: false
    },
    {
      id: 'conv_002',
      participants: ['char_economist_001', 'char_leader_001'],
      participantNames: ['Dr. Marcus Chen', 'Commander Alpha'],
      participantAvatars: ['/api/characters/avatars/marcus_chen.jpg', '/api/characters/avatars/commander_alpha.jpg'],
      conversationType: 'direct',
      title: 'Economic Stimulus Clarification',
      lastMessage: 'I need clarification on the budget allocation limits...',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 1,
      isActive: true,
      isPinned: true
    }
  ];
}

function generateMockChannels(): WhoseAppChannel[] {
  return [
    // Department Channels
    {
      id: 'channel_dept_foreign',
      name: 'foreign-affairs',
      description: 'Foreign Affairs Department coordination',
      type: 'department',
      participants: ['char_diplomat_001', 'char_diplomat_002', 'char_analyst_001'],
      participantCount: 12,
      lastMessage: 'New intelligence report from Sector 7...',
      lastMessageTime: new Date(Date.now() - 900000),
      unreadCount: 3,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'restricted',
      createdAt: new Date(Date.now() - 86400000 * 30),
      createdBy: 'char_diplomat_001',
      metadata: { departmentId: 'dept_foreign_affairs' }
    },
    {
      id: 'channel_dept_treasury',
      name: 'treasury-economics',
      description: 'Treasury and Economic Affairs Department',
      type: 'department',
      participants: ['char_economist_001', 'char_treasurer_001', 'char_analyst_002'],
      participantCount: 8,
      lastMessage: 'Q3 budget projections are ready for review...',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 1,
      isActive: true,
      isPinned: false,
      confidentialityLevel: 'classified',
      createdAt: new Date(Date.now() - 86400000 * 45),
      createdBy: 'char_economist_001',
      metadata: { departmentId: 'dept_treasury' }
    },
    {
      id: 'channel_dept_military',
      name: 'military-command',
      description: 'Military Command and Defense Operations',
      type: 'department',
      participants: ['char_general_001', 'char_admiral_001', 'char_strategist_001'],
      participantCount: 15,
      lastMessage: 'Fleet positioning update for Operation Starfall...',
      lastMessageTime: new Date(Date.now() - 2700000),
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'top_secret',
      createdAt: new Date(Date.now() - 86400000 * 60),
      createdBy: 'char_general_001',
      metadata: { departmentId: 'dept_military' }
    },

    // Project Channels
    {
      id: 'channel_project_zephyr',
      name: 'project-zephyr-trade',
      description: 'Zephyrian Empire Trade Agreement Project',
      type: 'project',
      participants: ['char_diplomat_001', 'char_economist_001', 'char_analyst_001'],
      participantCount: 6,
      lastMessage: 'Phase 2 negotiations scheduled for tomorrow...',
      lastMessageTime: new Date(Date.now() - 1200000),
      unreadCount: 2,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'restricted',
      createdAt: new Date(Date.now() - 86400000 * 14),
      createdBy: 'char_diplomat_001',
      metadata: { projectId: 'proj_zephyr_trade' }
    },
    {
      id: 'channel_mission_exploration',
      name: 'deep-space-exploration',
      description: 'Deep Space Exploration Mission Coordination',
      type: 'project',
      participants: ['char_explorer_001', 'char_scientist_001', 'char_engineer_001'],
      participantCount: 9,
      lastMessage: 'Anomaly detected in Sector 12, investigating...',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isActive: true,
      isPinned: false,
      confidentialityLevel: 'classified',
      createdAt: new Date(Date.now() - 86400000 * 7),
      createdBy: 'char_explorer_001',
      metadata: { missionId: 'mission_deep_space_001' }
    },

    // Cabinet & Emergency Channels
    {
      id: 'channel_cabinet',
      name: 'cabinet-decisions',
      description: 'High-level cabinet decision discussions',
      type: 'cabinet',
      participants: ['char_leader_001', 'char_diplomat_001', 'char_economist_001', 'char_general_001'],
      participantCount: 8,
      lastMessage: 'Emergency session called for 14:00...',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 5,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'top_secret',
      createdAt: new Date(Date.now() - 86400000 * 90),
      createdBy: 'char_leader_001',
      metadata: {}
    },
    {
      id: 'channel_emergency',
      name: 'emergency-response',
      description: 'Emergency response coordination',
      type: 'emergency',
      participants: ['char_leader_001', 'char_general_001', 'char_emergency_001'],
      participantCount: 12,
      lastMessage: 'All clear - crisis averted',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'classified',
      createdAt: new Date(Date.now() - 86400000 * 120),
      createdBy: 'char_emergency_001',
      metadata: {}
    },

    // General Channels
    {
      id: 'channel_general',
      name: 'general-discussion',
      description: 'General discussion and announcements',
      type: 'general',
      participants: ['char_leader_001'],
      participantCount: 45,
      lastMessage: 'Welcome to our new team members!',
      lastMessageTime: new Date(Date.now() - 5400000),
      unreadCount: 0,
      isActive: true,
      isPinned: false,
      confidentialityLevel: 'public',
      createdAt: new Date(Date.now() - 86400000 * 180),
      createdBy: 'char_leader_001',
      metadata: {}
    },
    {
      id: 'channel_announcements',
      name: 'announcements',
      description: 'Official announcements and updates',
      type: 'general',
      participants: ['char_leader_001'],
      participantCount: 67,
      lastMessage: 'New policy updates effective immediately...',
      lastMessageTime: new Date(Date.now() - 10800000),
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'public',
      createdAt: new Date(Date.now() - 86400000 * 200),
      createdBy: 'char_leader_001',
      metadata: {}
    }
  ];
}

function generateMockCharacters(): CharacterProfile[] {
  return [
    {
      id: 'char_diplomat_001',
      name: 'Ambassador Elena Vasquez',
      title: 'Chief Diplomatic Officer',
      department: 'Foreign Affairs',
      role: 'Senior Diplomat',
      avatar: '/api/characters/avatars/elena_vasquez.jpg',
      biography: 'A seasoned diplomat with over 20 years of experience in interstellar relations.',
      specialties: ['Interstellar Diplomacy', 'Trade Negotiations', 'Cultural Relations'],
      clearanceLevel: 'top_secret',
      whoseAppProfile: {
        status: 'online',
        statusMessage: 'In negotiations with Zephyrian delegation',
        lastSeen: new Date(),
        activeConversations: ['conv_001', 'channel_dept_foreign']
      },
      witterProfile: {
        handle: '@AmbassadorElena',
        followerCount: 125000,
        followingCount: 450,
        postCount: 2340,
        verificationStatus: 'government'
      },
      actionStats: {
        totalAssigned: 47,
        completed: 42,
        inProgress: 3,
        overdue: 0,
        successRate: 89,
        currentWorkload: 3
      }
    },
    {
      id: 'char_economist_001',
      name: 'Dr. Marcus Chen',
      title: 'Economic Policy Director',
      department: 'Treasury & Economic Affairs',
      role: 'Senior Economic Advisor',
      avatar: '/api/characters/avatars/marcus_chen.jpg',
      biography: 'Brilliant economist and policy strategist with a PhD in Galactic Economics.',
      specialties: ['Macroeconomic Policy', 'Market Analysis', 'Fiscal Strategy'],
      clearanceLevel: 'classified',
      whoseAppProfile: {
        status: 'busy',
        statusMessage: 'Analyzing stimulus package models',
        lastSeen: new Date(Date.now() - 1800000),
        activeConversations: ['conv_002', 'channel_dept_treasury']
      },
      witterProfile: {
        handle: '@DrMarcusChen',
        followerCount: 89000,
        followingCount: 230,
        postCount: 1876,
        verificationStatus: 'government'
      },
      actionStats: {
        totalAssigned: 34,
        completed: 29,
        inProgress: 4,
        overdue: 1,
        successRate: 85,
        currentWorkload: 4
      }
    }
  ];
}

function generateMockMessages(conversationId: string): WhoseAppMessage[] {
  const baseMessages = [
    // Older messages
    {
      id: 'msg_001',
      conversationId,
      senderId: 'char_diplomat_001',
      senderName: 'Ambassador Elena Vasquez',
      senderTitle: 'Chief Diplomatic Officer',
      senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      content: 'The Zephyrian delegation has agreed to our initial terms. They\'re particularly interested in our rare mineral exports.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      attachments: [],
      reactions: []
    },
    {
      id: 'msg_002',
      conversationId,
      senderId: 'char_leader_001',
      senderName: 'Commander Alpha',
      senderTitle: 'Galactic Leader',
      senderAvatar: '/api/characters/avatars/commander_alpha.jpg',
      content: 'Excellent progress. What are their counter-proposals for technology transfer?',
      messageType: 'text',
      timestamp: new Date(Date.now() - 6900000), // 1h 55m ago
      isRead: true,
      attachments: [],
      reactions: []
    },
    {
      id: 'msg_003',
      conversationId,
      senderId: 'char_diplomat_001',
      senderName: 'Ambassador Elena Vasquez',
      senderTitle: 'Chief Diplomatic Officer',
      senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      content: 'They\'re offering advanced shield technology in exchange for exclusive mining rights in the Kepler sector. I think we should consider it carefully.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 6600000), // 1h 50m ago
      isRead: true,
      attachments: [],
      reactions: []
    },
    {
      id: 'msg_004',
      conversationId,
      senderId: 'char_leader_001',
      senderName: 'Commander Alpha',
      senderTitle: 'Galactic Leader',
      senderAvatar: '/api/characters/avatars/commander_alpha.jpg',
      content: 'That\'s a significant concession. What\'s the strategic value of that sector? And what are the terms of exclusivity?',
      messageType: 'text',
      timestamp: new Date(Date.now() - 6300000), // 1h 45m ago
      isRead: true,
      attachments: [],
      reactions: []
    },
    // Recent messages (unread)
    {
      id: 'msg_005',
      conversationId,
      senderId: 'char_diplomat_001',
      senderName: 'Ambassador Elena Vasquez',
      senderTitle: 'Chief Diplomatic Officer',
      senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      content: 'The Kepler sector contains rare tritanium deposits worth approximately 2.3 billion credits. Exclusivity would be for 15 years with renewal options.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false,
      attachments: [],
      reactions: []
    },
    {
      id: 'msg_006',
      conversationId,
      senderId: 'char_diplomat_001',
      senderName: 'Ambassador Elena Vasquez',
      senderTitle: 'Chief Diplomatic Officer',
      senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      content: 'I\'ve attached the detailed proposal for your review. They want an answer by tomorrow.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
      isRead: false,
      attachments: [
        {
          id: 'att_001',
          name: 'Zephyrian_Trade_Proposal_v2.pdf',
          type: 'document',
          size: '2.4 MB',
          url: '/api/documents/zephyrian_proposal.pdf'
        }
      ],
      reactions: []
    },
    // Very recent message
    {
      id: 'msg_007',
      conversationId,
      senderId: 'char_economist_001',
      senderName: 'Dr. Marcus Chen',
      senderTitle: 'Chief Economic Advisor',
      senderAvatar: '/api/characters/avatars/marcus_chen.jpg',
      content: 'Commander, I\'ve run the economic projections. This deal could increase our GDP by 12% over the next decade, but we\'d lose control of our most valuable mining sector.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      attachments: [],
      reactions: []
    },
    {
      id: 'msg_008',
      conversationId,
      senderId: 'char_economist_001',
      senderName: 'Dr. Marcus Chen',
      senderTitle: 'Chief Economic Advisor',
      senderAvatar: '/api/characters/avatars/marcus_chen.jpg',
      content: 'I recommend we counter-propose with a joint venture structure instead of exclusive rights. This would give us more control while still securing the technology transfer.',
      messageType: 'action',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      isRead: false,
      attachments: [],
      reactions: []
    }
  ];

  // Add conversation-specific messages based on conversationId
  if (conversationId === 'conv_002') {
    return [
      {
        id: 'msg_eco_001',
        conversationId,
        senderId: 'char_economist_001',
        senderName: 'Dr. Marcus Chen',
        senderTitle: 'Chief Economic Advisor',
        senderAvatar: '/api/characters/avatars/marcus_chen.jpg',
        content: 'Commander, I need clarification on the budget allocation limits for the new infrastructure projects.',
        messageType: 'text',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: false,
        attachments: [],
        reactions: []
      },
      {
        id: 'msg_eco_002',
        conversationId,
        senderId: 'char_economist_001',
        senderName: 'Dr. Marcus Chen',
        senderTitle: 'Chief Economic Advisor',
        senderAvatar: '/api/characters/avatars/marcus_chen.jpg',
        content: 'The Senate is asking for detailed cost breakdowns before they approve the stimulus package. Should I prepare a comprehensive report?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isRead: false,
        attachments: [],
        reactions: []
      },
      {
        id: 'msg_eco_003',
        conversationId,
        senderId: 'char_leader_001',
        senderName: 'Commander Alpha',
        senderTitle: 'Galactic Leader',
        senderAvatar: '/api/characters/avatars/commander_alpha.jpg',
        content: 'Yes, prepare the full report. Include projections for job creation and economic impact over the next 5 years.',
        messageType: 'action',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isRead: true,
        attachments: [],
        reactions: []
      }
    ];
  }

  return baseMessages;
}

export default WhoseAppMain;
