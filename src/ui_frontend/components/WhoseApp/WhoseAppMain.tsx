/**
 * WhoseApp Main Component
 * Primary interface for character communication, action tracking, and profile management
 * Uses BaseScreen template for consistent design
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useWhoseAppWebSocket } from '../../hooks/useWhoseAppWebSocket';
import { ActionItemSystem } from './ActionItemSystem';
import CharacterProfileModal from './CharacterProfileModal';
import VoiceControls from './VoiceControls';
import ChannelParticipants from './ChannelParticipants';
import { UnifiedConversationInterface } from './UnifiedConversationInterface';
import CallInterface from './CallInterface';
import { voiceService } from '../../services/VoiceService';
import { BaseScreen, TabConfig } from '../GameHUD/screens/BaseScreen';
import '../GameHUD/screens/shared/StandardDesign.css';

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

export interface WhoseAppActionItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  updates: Array<{
    id: string;
    message: string;
    timestamp: Date;
    author: string;
  }>;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  whoseAppProfile?: {
    status: 'online' | 'away' | 'busy' | 'offline';
    statusMessage?: string;
    lastSeen?: Date;
    activeConversations?: string[];
  };
  actionStats?: {
    successRate: number;
    currentWorkload: number;
    completedActions: number;
    averageResponseTime: number;
  };
}

export interface QuickActionProps {
  onClose: () => void;
  isVisible: boolean;
}

export interface WhoseAppMainProps extends QuickActionProps {
  gameContext?: any;
  onConversationSelect?: (conversation: WhoseAppConversation) => void;
  onChannelSelect?: (channel: WhoseAppChannel) => void;
  onCharacterClick?: (character: Character) => void;
  onCreateAction?: (action: any) => void;
}

export const WhoseAppMain: React.FC<WhoseAppMainProps> = ({
  gameContext,
  onConversationSelect,
  onChannelSelect,
  onCharacterClick,
  onCreateAction
}) => {
  console.log('🚀 WhoseAppMain: Component mounting/rendering');
  
  // State Management
  const [activeTab, setActiveTab] = useState<'conversations' | 'channels' | 'actions' | 'characters'>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<WhoseAppConversation | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<WhoseAppChannel | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUserId] = useState('current-user-id');
  const [currentSpeakerId, setCurrentSpeakerId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<Character | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'conversation' | 'channel' | 'call'>('list');
  const [initialInputMode, setInitialInputMode] = useState<'text' | 'voice'>('text');

  // Force WhoseApp to always start with character list view - aggressive override
  useEffect(() => {
    console.log('🔧 WhoseAppMain: Initial setup - forcing character list view');
    // Override any external context that might force conversation mode
    const forceCharacterListView = () => {
      setViewMode('list');
      setActiveTab('conversations');
      setSelectedConversation(null);
      setSelectedChannel(null);
      setSelectedCharacter(null);
      setShowCharacterModal(false);
      setActiveCall(null);
    };
    
    // Apply immediately
    forceCharacterListView();
    
    // Also apply after a short delay to override any async context
    const timer = setTimeout(forceCharacterListView, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Only force character list view on initial mount, not during normal operation
  // Remove this aggressive override that was interfering with conversation mode

  // Mock Data
  const [conversations, setConversations] = useState<WhoseAppConversation[]>([
    {
      id: 'conv_1',
      participants: ['user1', 'user2'],
      participantNames: ['You', 'Prime Minister Elena Vasquez'],
      participantAvatars: ['/api/avatars/default.jpg', '/api/avatars/pm.jpg'],
      conversationType: 'direct',
      title: 'Budget Discussion',
      lastMessage: 'The budget proposal looks good. Let\'s schedule a meeting.',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isActive: true,
      isPinned: true
    },
    {
      id: 'conv_2',
      participants: ['user1', 'user3'],
      participantNames: ['You', 'Defense Secretary Sarah Kim'],
      participantAvatars: ['/api/avatars/default.jpg', '/api/avatars/defense.jpg'],
      conversationType: 'direct',
      title: 'Security Briefing',
      lastMessage: 'The situation is under control. Full report attached.',
      lastMessageTime: new Date(Date.now() - 900000),
      unreadCount: 0,
      isActive: true,
      isPinned: false
    }
  ]);

  const [channels, setChannels] = useState<WhoseAppChannel[]>([
    {
      id: 'channel_1',
      name: 'cabinet-general',
      description: 'General cabinet discussions',
      type: 'cabinet',
      participants: ['user1', 'user2', 'user3', 'user4'],
      participantCount: 12,
      lastMessage: 'Meeting scheduled for tomorrow at 10 AM',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 5,
      isActive: true,
      isPinned: true,
      confidentialityLevel: 'classified',
      createdAt: new Date(Date.now() - 86400000),
      createdBy: 'user2',
      metadata: { cabinetDecisionId: 'decision_001' }
    },
    {
      id: 'channel_2',
      name: 'emergency-response',
      description: 'Emergency response coordination',
      type: 'emergency',
      participants: ['user1', 'user5', 'user6'],
      participantCount: 8,
      lastMessage: 'All units report status green',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 0,
      isActive: true,
      isPinned: false,
      confidentialityLevel: 'top_secret',
      createdAt: new Date(Date.now() - 172800000),
      createdBy: 'user5',
      metadata: { missionId: 'mission_alpha' }
    }
  ]);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);

  // Fetch characters from API
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        console.log('🔄 WhoseAppMain: Fetching characters from API...');
        setIsLoadingCharacters(true);
        const response = await fetch('http://localhost:4000/api/characters/profiles');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.characters) {
            // Convert API character format to WhoseApp Character format
            const convertedCharacters = data.characters.map((apiChar: any) => ({
              id: apiChar.id,
              name: apiChar.name,
              title: apiChar.title,
              department: apiChar.department,
              avatar: apiChar.avatar,
              whoseAppProfile: apiChar.whoseAppProfile || {
                status: 'online',
                statusMessage: 'Available',
                lastSeen: new Date(),
                activeConversations: []
              },
              actionStats: apiChar.actionStats || {
                successRate: 85,
                currentWorkload: 2,
                completedActions: 50,
                averageResponseTime: 3.0
              }
            }));
            console.log(`✅ WhoseAppMain: Loaded ${convertedCharacters.length} characters`);
            setCharacters(convertedCharacters);
          }
        } else {
          console.error('❌ WhoseAppMain: Failed to fetch characters:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, []);

  const [actionItems, setActionItems] = useState<WhoseAppActionItem[]>([
    {
      id: 'action_1',
      title: 'Review Budget Proposal',
      description: 'Comprehensive review of the 2024 budget proposal with focus on defense and infrastructure spending.',
      assignedTo: 'Elena Vasquez',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      dueDate: new Date(Date.now() + 172800000),
      updates: [
        {
          id: 'update_1',
          message: 'Initial review completed. Requesting additional data from Treasury.',
          timestamp: new Date(Date.now() - 3600000),
          author: 'Elena Vasquez'
        }
      ]
    },
    {
      id: 'action_2',
      title: 'Security Assessment Report',
      description: 'Quarterly security assessment for all government facilities.',
      assignedTo: 'Sarah Kim',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 86400000),
      updates: [
        {
          id: 'update_2',
          message: 'Assessment completed. All facilities meet security standards.',
          timestamp: new Date(Date.now() - 86400000),
          author: 'Sarah Kim'
        }
      ]
    }
  ]);

  // WebSocket Hook
  const {
    isConnected,
    sendMessage
  } = useWhoseAppWebSocket({});

  // Tab Configuration
  const tabs: TabConfig[] = [
    { id: 'conversations', label: 'Conversations', icon: '💬' },
    { id: 'channels', label: 'Channels', icon: '📺' },
    { id: 'characters', label: 'Characters', icon: '👥' },
    { id: 'actions', label: 'Actions', icon: '📋' }
  ];

  // Event Handlers
  const handleConversationSelect = useCallback((conversation: WhoseAppConversation) => {
    setSelectedConversation(conversation);
    setViewMode('conversation');
    onConversationSelect?.(conversation);
  }, [onConversationSelect]);

  const handleChannelSelect = useCallback((channel: WhoseAppChannel) => {
    setSelectedChannel(channel);
    setViewMode('channel');
    onChannelSelect?.(channel);
  }, [onChannelSelect]);

  const handleCharacterClick = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setShowCharacterModal(true);
    onCharacterClick?.(character);
  }, [onCharacterClick]);

  const handleParticipantClick = useCallback((participantId: string) => {
    console.log('Participant clicked:', participantId);
  }, []);

  const handleVoiceToggle = useCallback((participantId: string) => {
    setCurrentSpeakerId(prev => prev === participantId ? null : participantId);
  }, []);

  const handleVoiceModeToggle = useCallback(() => {
    setVoiceModeEnabled(prev => !prev);
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      await voiceService.startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, []);

  const handleStopRecording = useCallback(async () => {
    try {
      const audioBlob = await voiceService.stopRecording();
      setIsRecording(false);
      // Process the audio blob here
      console.log('Recording completed:', audioBlob);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  }, []);

  // Generate channel participants
  const generateChannelParticipants = (channel: WhoseAppChannel) => {
    return characters
      .filter(char => channel.participants.includes(char.id))
      .map(char => ({
        id: char.id,
        name: char.name,
        avatar: char.avatar,
        title: char.title,
        status: 'online' as const,
        isSpeaking: false,
        isPlayer: false
      }));
  };

  // Refresh function
  const handleRefresh = useCallback(async () => {
    try {
      // Refresh data - for now just log, can be implemented with API calls
      console.log('Refreshing WhoseApp data...');
    } catch (error) {
      console.error('Failed to refresh WhoseApp data:', error);
    }
  }, []);

  // Handle starting conversations and calls
  const handleStartConversation = useCallback(async (characterId: string, mode: 'text' | 'voice' = 'text') => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      const conversationId = `conv_${currentUserId}_${characterId}`;
      const newConversation: WhoseAppConversation = {
        id: conversationId,
        participants: [currentUserId, characterId],
        participantNames: ['You', character.name],
        participantAvatars: ['/api/characters/avatars/default.jpg', character.avatar],
        conversationType: 'direct',
        title: `Conversation with ${character.name}`,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isActive: true,
        isPinned: false
      };
      
      setSelectedConversation(newConversation);
      setInitialInputMode(mode);
      setViewMode('conversation');
      setActiveTab('conversations');
    }
  }, [characters, currentUserId]);

  const handleStartCall = useCallback(async (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setActiveCall(character);
      setViewMode('call');
      console.log(`Starting call with ${character.name}`);
    }
  }, [characters]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (content: string, type: 'text' | 'voice' = 'text') => {
    if (!selectedConversation) return;

    try {
      const response = await fetch(`/api/whoseapp/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senderId: currentUserId,
          content,
          type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: content, lastMessageTime: new Date() }
          : conv
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [selectedConversation, currentUserId]);

  // Handle ending calls
  const handleEndCall = useCallback(() => {
    setActiveCall(null);
    setViewMode('list');
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setSelectedConversation(null);
    setSelectedChannel(null);
    setActiveCall(null);
    setViewMode('list');
  }, []);


  // Render conversations list
  const renderConversations = () => {
    return (
      <div className="standard-dashboard">
        <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="standard-card-title">💬 Conversations</h3>
            <button className="standard-btn social-theme">
              + New Conversation
            </button>
          </div>

          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Conversation</th>
                  <th>Type</th>
                  <th>Last Message</th>
                  <th>Status</th>
                  <th>Unread</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map(conversation => (
                  <tr key={conversation.id} onClick={() => handleConversationSelect(conversation)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#e8e8e8' }}>
                        {conversation.title || conversation.participantNames.join(', ')}
                        {conversation.isPinned && ' 📌'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {conversation.participantNames.join(', ')}
                      </div>
                    </td>
                    <td>
                      <span className="standard-badge social-theme">
                        {conversation.conversationType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '2px' }}>
                        {conversation.lastMessage}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(conversation.lastMessageTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        color: conversation.isActive ? '#10b981' : '#6b7280',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '12px'
                      }}>
                        {conversation.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {conversation.unreadCount > 0 && (
                        <span className="standard-badge" style={{ background: '#F44336', color: 'white' }}>
                          {conversation.unreadCount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render channels
  const renderChannels = () => {
    if (selectedChannel) {
      return (
        <div className="standard-dashboard">
          <div className="standard-panel" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                className="standard-btn social-theme"
                onClick={() => setSelectedChannel(null)}
              >
                ← Back to Channels
              </button>
              <div>
                <h3 className="standard-card-title" style={{ margin: '0 0 8px 0' }}>
                  #{selectedChannel.name}
                </h3>
                <div style={{ fontSize: '14px', color: '#ccc' }}>
                  {selectedChannel.description || `${selectedChannel.participantCount} members`}
                </div>
              </div>
            </div>
          </div>

          <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
            <h3 className="standard-card-title">👥 Channel Participants</h3>
            <ChannelParticipants
              participants={generateChannelParticipants(selectedChannel)}
              currentSpeakerId={currentSpeakerId}
              onParticipantClick={handleParticipantClick}
              onVoiceToggle={handleVoiceToggle}
              showVoiceControls={true}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="standard-dashboard">
        <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="standard-card-title">📺 Channels</h3>
            <button className="standard-btn social-theme">
              + Create Channel
            </button>
          </div>

          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Type</th>
                  <th>Members</th>
                  <th>Last Message</th>
                  <th>Status</th>
                  <th>Unread</th>
                </tr>
              </thead>
              <tbody>
                {channels.map(channel => (
                  <tr key={channel.id} onClick={() => handleChannelSelect(channel)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 'bold', color: '#e8e8e8' }}>
                        #{channel.name}
                        {channel.isPinned && ' 📌'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {channel.description}
                      </div>
                    </td>
                    <td>
                      <span className="standard-badge social-theme">
                        {channel.type}
                      </span>
                    </td>
                    <td>{channel.participantCount}</td>
                    <td>
                      <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '2px' }}>
                        {channel.lastMessage}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(channel.lastMessageTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        color: channel.isActive ? '#10b981' : '#6b7280',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '12px'
                      }}>
                        {channel.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {channel.unreadCount > 0 && (
                        <span className="standard-badge" style={{ background: '#F44336', color: 'white' }}>
                          {channel.unreadCount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Render characters list
  const renderCharacters = () => (
    <div className="standard-dashboard">
      <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">👥 Character Directory</h3>
        {isLoadingCharacters ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#4ecdc4' 
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
            <div>Loading characters...</div>
          </div>
        ) : characters.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#888' 
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
            <div>No characters available</div>
          </div>
        ) : (
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Character</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Success Rate</th>
                  <th>Workload</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {characters.map(character => (
                <tr key={character.id} onClick={() => handleCharacterClick(character)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%2310b981"/><text x="20" y="25" text-anchor="middle" fill="white" font-size="14">${character.name.charAt(0)}</text></svg>`;
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#e8e8e8', fontSize: '14px' }}>
                          {character.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {character.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="standard-badge social-theme">
                      {character.whoseAppProfile?.status || 'offline'}
                    </span>
                  </td>
                  <td>
                    <span className="standard-badge">
                      {character.department}
                    </span>
                  </td>
                  <td style={{ color: (character.actionStats?.successRate || 0) > 80 ? '#10b981' : (character.actionStats?.successRate || 0) > 60 ? '#f59e0b' : '#ef4444' }}>
                    {character.actionStats?.successRate?.toFixed(1) || '0.0'}%
                  </td>
                  <td style={{ color: (character.actionStats?.currentWorkload || 0) > 5 ? '#ef4444' : '#10b981' }}>
                    {character.actionStats?.currentWorkload || 0}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="standard-btn social-theme"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartConversation(character.id);
                        }}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        💬 Message
                      </button>
                      <button
                        className="standard-btn social-theme"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartConversation(character.id, 'voice');
                        }}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        📞 Call
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // Render action items
  const renderActionItems = () => (
    <div className="standard-dashboard">
      <div className="standard-panel" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📋 Action Items</h3>
          <button className="standard-btn social-theme">
            + New Action
          </button>
        </div>

        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Action Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#e8e8e8', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ccc' }}>
                      {item.description}
                    </div>
                  </td>
                  <td>{item.assignedTo}</td>
                  <td>
                    <span className={`standard-badge ${
                      item.status === 'completed' ? 'success' :
                      item.status === 'in-progress' ? 'warning' :
                      'social-theme'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className={`standard-badge ${
                      item.priority === 'urgent' || item.priority === 'high' ? 'danger' :
                      item.priority === 'medium' ? 'warning' : ''
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    {item.dueDate ? (
                      <div style={{ fontSize: '12px', color: '#ccc' }}>
                        {new Date(item.dueDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#888' }}>No due date</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="standard-btn social-theme" style={{ fontSize: '12px', padding: '4px 8px' }}>
                        View
                      </button>
                      <button className="standard-btn social-theme" style={{ fontSize: '12px', padding: '4px 8px' }}>
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Main render function
  const renderContent = () => {
    // Handle special view modes
    if (viewMode === 'conversation' && selectedConversation) {
      // Find the character we're talking to (not the current user)
      const otherParticipantId = selectedConversation.participants.find(p => p !== currentUserId);
      const character = characters.find(c => c.id === otherParticipantId);
      
      if (character) {
        // Convert Character to CharacterProfile format expected by UnifiedConversationInterface
        const characterProfile = {
          id: character.id,
          name: character.name,
          role: character.title,
          department: character.department,
          avatar: character.avatar,
          personality: {
            currentMood: 'professional',
            traits: ['diplomatic', 'analytical']
          }
        };

        return (
          <UnifiedConversationInterface
            character={characterProfile}
            conversationId={selectedConversation.id}
            currentUserId={currentUserId}
            civilizationId={gameContext?.civilizationId || 'terran_federation'}
            onBack={handleBack}
            initialInputMode={initialInputMode}
            gameContext={{
              currentCampaign: gameContext?.currentCampaign,
              playerResources: gameContext?.playerResources,
              recentEvents: gameContext?.recentEvents || []
            }}
          />
        );
      }
    }

    // Handle channel view mode
    if (viewMode === 'channel' && selectedChannel) {
      // For channels, create a virtual character representing the channel
      const channelCharacter = {
        id: selectedChannel.id,
        name: selectedChannel.name,
        role: `${selectedChannel.type} Channel`,
        department: selectedChannel.metadata.departmentId || 'General',
        avatar: '/api/avatars/channel.jpg',
        personality: {
          currentMood: 'collaborative',
          traits: ['informative', 'organized']
        }
      };

      return (
        <UnifiedConversationInterface
          character={channelCharacter}
          conversationId={selectedChannel.id}
          currentUserId={currentUserId}
          civilizationId={gameContext?.civilizationId || 'terran_federation'}
          onBack={handleBack}
          gameContext={{
            currentCampaign: gameContext?.currentCampaign,
            playerResources: gameContext?.playerResources,
            recentEvents: gameContext?.recentEvents || []
          }}
        />
      );
    }

    if (viewMode === 'call' && activeCall) {
      return (
        <CallInterface
          character={activeCall}
          currentUserId={currentUserId}
          onEndCall={handleEndCall}
          onBack={handleBack}
        />
      );
    }

    // Default tab-based content
    if (activeTab === 'conversations') {
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
    <BaseScreen
      screenId="whoseapp"
      title="WhoseApp"
      icon="💬"
      gameContext={gameContext}
      onRefresh={handleRefresh}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      {renderContent()}

      {/* Character Profile Modal */}
      {showCharacterModal && selectedCharacter && (
        <CharacterProfileModal
          characterId={selectedCharacter.id}
          isVisible={showCharacterModal}
          onClose={() => setShowCharacterModal(false)}
        />
      )}

      {/* Voice Controls (when enabled) */}
      {voiceModeEnabled && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(26, 26, 46, 0.9)',
          border: '1px solid rgba(78, 205, 196, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <button
            onClick={handleStartRecording}
            disabled={isRecording}
            className="standard-btn social-theme"
            style={{ fontSize: '14px' }}
          >
            {isRecording ? '🔴 Recording...' : '🎙️ Record'}
          </button>
          
          <button
            onClick={handleStopRecording}
            disabled={!isRecording}
            className="standard-btn"
            style={{ fontSize: '14px' }}
          >
            ⏹️ Stop
          </button>
          
          <div style={{ fontSize: '12px', color: '#888' }}>
            {isRecording ? 'Recording voice message...' : 'Voice controls ready'}
          </div>
        </div>
      )}
    </BaseScreen>
  );
};

export default WhoseAppMain;