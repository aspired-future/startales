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

  // Mock data for development
  const actionItems = [
    {
      id: 'action_001',
      title: 'Prepare Trade Agreement Draft',
      description: 'Draft initial terms for the Zephyrian trade agreement',
      assignedTo: 'Ambassador Elena Vasquez',
      status: 'in-progress',
      updates: [
        {
          message: 'Initial draft completed, reviewing terms with economic team',
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    },
    {
      id: 'action_002', 
      title: 'Security Assessment Report',
      description: 'Analyze potential security implications of new alliance',
      assignedTo: 'Commander Alpha',
      status: 'pending',
      updates: []
    }
  ];

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

  // Mock data generators
  const generateMockConversations = (): WhoseAppConversation[] => [
    {
      id: 'conv_001',
      participants: [currentUserId, 'char_diplomat_001'],
      participantNames: ['You', 'Ambassador Elena Vasquez'],
      participantAvatars: ['/api/characters/avatars/default.jpg', '/api/characters/avatars/elena_vasquez.jpg'],
      conversationType: 'direct',
      title: 'Trade Negotiations',
      lastMessage: 'The Zephyrians are requesting additional security guarantees.',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isActive: true,
      isPinned: false
    }
  ];

  const generateMockChannels = (): WhoseAppChannel[] => [
    {
      id: 'channel_cabinet',
      name: 'Cabinet',
      description: 'High-level government discussions',
      type: 'cabinet',
      participants: [currentUserId, 'char_diplomat_001', 'char_economist_001'],
      participantCount: 5,
      lastMessage: 'Meeting scheduled for tomorrow at 0900',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 0,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'classified',
      createdAt: new Date(Date.now() - 86400000),
      createdBy: currentUserId,
      metadata: {}
    },
    {
      id: 'channel_defense',
      name: 'Defense',
      description: 'Military and security coordination',
      type: 'department',
      participants: [currentUserId, 'char_commander_001'],
      participantCount: 3,
      lastMessage: 'Security briefing complete',
      lastMessageTime: new Date(Date.now() - 1200000),
      unreadCount: 1,
      isActive: true,
      isPinned: false,
      confidentialityLevel: 'top_secret',
      createdAt: new Date(Date.now() - 172800000),
      createdBy: 'char_commander_001',
      metadata: { departmentId: 'dept_defense' }
    }
  ];

  const generateMockCharacters = (): CharacterProfile[] => [
    {
      id: 'char_diplomat_001',
      name: 'Ambassador Elena Vasquez',
      title: 'Chief Diplomatic Officer',
      department: 'Foreign Affairs',
      role: 'diplomat',
      avatar: '/api/characters/avatars/elena_vasquez.jpg',
      biography: 'Experienced diplomat with 20 years in international relations',
      specialties: ['Trade Negotiations', 'Cultural Exchange', 'Conflict Resolution'],
      clearanceLevel: 'top_secret',
      whoseAppProfile: {
        status: 'online',
        statusMessage: 'Available for urgent matters',
        lastSeen: new Date(),
        activeConversations: ['conv_001', 'channel_cabinet']
      },
      witterProfile: {
        handle: '@AmbassadorElena',
        followerCount: 15420,
        followingCount: 234,
        postCount: 1205,
        verificationStatus: 'government'
      },
      actionStats: {
        totalAssigned: 45,
        completed: 38,
        inProgress: 5,
        overdue: 2,
        successRate: 84.4,
        currentWorkload: 7
      }
    }
  ];

  const generateMockMessages = (conversationId: string): WhoseAppMessage[] => [
    {
      id: 'msg_001',
      conversationId,
      senderId: 'char_diplomat_001',
      senderName: 'Ambassador Elena Vasquez',
      senderTitle: 'Chief Diplomatic Officer',
      senderAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      content: 'I have an update on the Zephyrian negotiations. They\'re requesting additional security guarantees.',
      messageType: 'text',
      timestamp: new Date(Date.now() - 300000),
      isRead: false,
      attachments: [],
      reactions: []
    }
  ];

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/whoseapp/conversations?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
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

  // Handle character click
  const handleCharacterClick = useCallback((character: CharacterProfile) => {
    handleCharacterProfileView(character.id);
  }, [handleCharacterProfileView]);

  // Handle voice mode toggle
  const handleVoiceModeToggle = useCallback(() => {
    setIsVoiceMode(!isVoiceMode);
  }, [isVoiceMode]);

  // Handle voice message from voice controls
  const handleVoiceMessage = useCallback(async (transcript: string, audioBlob?: Blob) => {
    if (transcript.trim()) {
      await handleSendMessage(transcript, 'text');
    } else if (audioBlob) {
      await handleSendMessage('🎤 Voice Message', 'voice', audioBlob);
    }
  }, []);

  // Handle text-to-speech for messages
  const handleTextToSpeech = useCallback(async (text: string, characterId?: string) => {
    try {
      if (characterId && (selectedChannel || selectedConversation)) {
        await voiceService.speakInChannel(
          text, 
          characterId,
          () => setCurrentSpeakerId(characterId),
          () => setCurrentSpeakerId(null)
        );
      } else {
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

  // Handle recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

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

  // Generate channel participants from channel data
  const generateChannelParticipants = useCallback((channel: WhoseAppChannel) => {
    const participants = [];
    
    participants.push({
      id: currentUserId,
      name: 'You',
      avatar: '/api/characters/avatars/player_default.jpg',
      title: 'Player',
      status: 'online' as const,
      isPlayer: true
    });

    const channelCharacters = characters.filter(char => {
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
          return true;
      }
    });

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

    return participants.slice(0, 12);
  }, [currentUserId, characters]);

  // Render conversation messages (reusable for both conversations and channels)
  const renderConversationMessages = useCallback(() => {
    const conversationId = selectedConversation?.id || selectedChannel?.id;
    if (!conversationId) return null;

    return (
      <div className="conversation-messages">
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
                    border: currentSpeakerId === message.senderId ? '3px solid #4CAF50' : '2px solid transparent'
                  }}
                  onClick={() => handleCharacterProfileView(message.senderId)}
                  title={`View ${message.senderName}'s profile`}
                >
                  {message.senderName ? message.senderName.charAt(0).toUpperCase() : '?'}
                </div>

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
                          opacity: 0.7
                        }}
                        title="Read aloud with TTS"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-input" style={{
          padding: '15px',
          borderTop: '1px solid rgba(78, 205, 196, 0.2)',
          background: 'rgba(26, 26, 46, 0.4)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                  minWidth: '40px'
                }}
                title={isVoiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
              >
                {isVoiceMode ? '🎤' : '⌨️'}
              </button>
              
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
                  height: '40px'
                }}
              >
                Send
              </button>
            </div>
            
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

  // Render channels list
  const renderChannels = () => {
    if (selectedChannel) {
      return (
        <div className="channel-view">
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

          <ChannelParticipants
            participants={generateChannelParticipants(selectedChannel)}
            currentSpeakerId={currentSpeakerId}
            onParticipantClick={handleParticipantClick}
            onVoiceToggle={handleVoiceToggle}
            showVoiceControls={true}
          />

          {renderConversationMessages()}
        </div>
      );
    }

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

        <div className="channel-categories">
          {channels.map(channel => (
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

