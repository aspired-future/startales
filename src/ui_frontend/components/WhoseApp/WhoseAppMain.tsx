/**
 * WhoseApp Main Component
 * Primary interface for character communication, action tracking, and profile management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useWhoseAppWebSocket } from '../../hooks/useWhoseAppWebSocket';
import { ActionItemSystem } from './ActionItemSystem';
import CharacterProfileModal from './CharacterProfileModal';
import VoiceControls from './VoiceControls';
// Removed ConversationalCallControls - using enhanced VoiceControls instead
import ChannelParticipants from './ChannelParticipants';
import { voiceService } from '../../services/VoiceService';
import { dynamicVoiceGenerator } from '../../services/DynamicVoiceGenerator';
import './WhoseAppMain.css';

// Expose services globally for debugging and testing
declare global {
  interface Window {
    voiceService: typeof voiceService;
    dynamicVoiceGenerator: typeof dynamicVoiceGenerator;
  }
}

// Make services available globally
window.voiceService = voiceService;
window.dynamicVoiceGenerator = dynamicVoiceGenerator;

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
  const [isConversationalCall, setIsConversationalCall] = useState(false);
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

  // Load initial data and initialize voice services
  useEffect(() => {
    loadConversations();
    loadChannels();
    loadCharacters();
    
    // Initialize voice services and trigger voice loading
    console.log('🔊 Initializing voice services...');
    
    // Trigger voice loading
    if (window.speechSynthesis) {
      // Force voice loading by calling getVoices multiple times
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(`🔊 Loaded ${voices.length} system voices`);
        if (voices.length === 0) {
          // Try again after a short delay
          setTimeout(loadVoices, 100);
        }
      };
      
      loadVoices();
      
      // Also listen for voice changes
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(`🔊 Voice change event: ${voices.length} voices available`);
      };
    }
    
    console.log('✅ Voice services initialized');
    
    // Cleanup function
    return () => {
      // Stop continuous listening when component unmounts
      if (voiceService.isContinuouslyListening()) {
        voiceService.stopContinuousListening();
      }
    };
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
      console.log('🔄 Loading characters from API...');
      const response = await fetch(`/api/characters/profiles?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Characters loaded from API:', data.characters?.length || 0);
        setCharacters(data.characters || []);
      } else {
        console.log('⚠️ API failed, using mock characters');
        const mockChars = generateMockCharacters();
        console.log('📋 Mock characters generated:', mockChars.length);
        setCharacters(mockChars);
      }
    } catch (err) {
      console.error('❌ Failed to load characters:', err);
      console.log('🔄 Falling back to mock characters');
      const mockChars = generateMockCharacters();
      console.log('📋 Mock characters generated:', mockChars.length);
      setCharacters(mockChars);
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
    console.log('🎯 Character profile view requested for:', characterId);
    setSelectedCharacterForProfile(characterId);
    setIsProfileModalVisible(true);
    onOpenCharacterProfile?.(characterId);
    console.log('✅ Character profile modal should be opening');
  }, [onOpenCharacterProfile]);

  // Handle character click
  const handleCharacterClick = useCallback((character: CharacterProfile) => {
    handleCharacterProfileView(character.id);
  }, [handleCharacterProfileView]);

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
          senderTitle: character.title,
          senderAvatar: character.avatar,
          content: `Hello! I'm ${character.name}. How can I assist you today?`,
          timestamp: new Date(),
          messageType: 'text',
          isRead: false,
          attachments: [],
          reactions: []
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
      
      // Switch to call conversation and enable conversational mode
      setSelectedConversation(callConversation);
      setSelectedChannel(null);
      setActiveTab('conversations');
      setIsConversationalCall(true);
      
      // Initialize with system message
      const systemMessage: WhoseAppMessage = {
          id: `msg_${Date.now()}_call_start`,
          conversationId: callConversation.id,
          senderId: 'system',
          senderName: 'System',
          senderTitle: 'System',
          senderAvatar: '',
        content: `📞 Conversational call initiated with ${character.name}. Use the controls below to start talking naturally.`,
          timestamp: new Date(),
          messageType: 'system',
          isRead: true,
          attachments: [],
          reactions: []
        };
      
      setMessages([systemMessage]);
      
    } catch (error) {
      console.error('Error initiating call:', error);
      setError('Failed to initiate call');
    }
  }, [currentUserId]);

  // Track if AI is currently speaking to prevent feedback loops
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Generate conversational AI response using Character AI system
  const generateConversationalResponse = useCallback(async (userMessage: string) => {
    // Prevent processing if AI is currently speaking (feedback prevention)
    if (isAISpeaking) {
      console.log('🚫 Ignoring voice input while AI is speaking to prevent feedback');
      return;
    }

    try {
      console.log('🤖 Generating Character AI response for:', userMessage);
      
      // Get the current character
      const currentCharacter = generateMockCharacters().find(char => 
        selectedConversation?.participants.includes(char.id)
      );
      
      if (!currentCharacter) {
        console.log('No character found, using fallback response');
        return;
      }
      
      // Use the Character AI system for contextually aware responses
      const characterAIResponse = await fetch(`/api/characters/${currentCharacter.id}/interact-aware`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Player: "${userMessage}". Respond as ${currentCharacter.name} in natural conversation. Focus on the single most critical issue right now - explain what's happening, why it matters, and what we need to do about it. Go deep on this one priority rather than listing multiple issues. Use complete sentences and sound like we're having a focused strategic discussion about this specific problem.`,
          interactionType: 'voice_conversation',
          conversationId: selectedConversation?.id || `voice_${Date.now()}`,
          participantId: currentUserId,
          topic: 'Galactic Civilization Discussion',
          context: `Strategic conversation between civilization leader and advisor. Focus on ONE priority issue at a time. Go deep on the most critical problem rather than listing multiple concerns. Explain the situation thoroughly and provide specific next steps for this single issue.`,
          gameState: {
            civilizationId: civilizationId,
            currentTurn: Date.now(),
            gamePhase: 'expansion',
            playerRole: 'Civilization Leader',
            conversationType: 'voice_call'
          },
          urgency: 'normal',
          confidentiality: 'internal',
          previousMessages: messages.slice(-3).map(msg => ({
            speaker: msg.senderId === currentUserId ? 'Civilization Leader' : currentCharacter.name,
            message: msg.content,
            timestamp: msg.timestamp.toISOString(),
            emotional_tone: 'professional'
          }))
        })
      });
      
      let response = '';
      
      if (characterAIResponse.ok) {
        const aiData = await characterAIResponse.json();
        response = aiData.interaction?.response?.content || aiData.interaction?.response || 'I understand your message.';
        console.log('✅ Character AI response received:', {
          processingTime: aiData.meta?.processing_time,
          confidence: aiData.meta?.confidence_score,
          characterName: aiData.meta?.character_name
        });
    } else {
        console.log('❌ Character AI failed, using enhanced fallback');
        // Create focused, single-issue fallback responses
        const contextualResponses = {
          'Foreign Affairs': `The Zephyrian Empire is mobilizing a significant military force near Sector 7, and this is our most pressing diplomatic concern right now. Our intelligence suggests they're positioning for either an invasion of the neutral zone or preparing to blockade our trade routes through that sector. What makes this particularly dangerous is that Sector 7 controls access to three of our most profitable mining operations. If they move forward with this, we're looking at losing approximately thirty percent of our resource income within weeks. I recommend we immediately open direct diplomatic channels with their High Command and offer a face-to-face summit. We need to understand their intentions before this escalates into something we can't control.`,
          'Science': `We've detected what appears to be a new bioweapon being developed in enemy territories, and this is the most critical threat we're facing right now. Our analysis shows it's designed to target the specific genetic markers found in our population - this isn't a general weapon, it's specifically engineered to harm us. The concerning part is that our current medical countermeasures would be completely ineffective against this particular strain. I've already redirected our top research teams to work on defensive measures, but we need to accelerate this project immediately. We should also consider reaching out to our allies who might have encountered similar threats. This could be a game-changer if we don't get ahead of it.`,
          'Military': `Our intelligence reports are showing coordinated enemy buildups in three sectors, and the timing suggests we're looking at a coordinated attack within the next two weeks. What's particularly concerning is that these aren't random troop movements - they're positioning forces in a pattern that would allow them to cut off our supply lines while simultaneously hitting our defensive installations. Our fleet is currently at seventy-eight percent strength, which puts us at a significant disadvantage if this attack materializes. I believe we need to make a decision right now: either we mobilize everything we have for a defensive stance, or we consider a preemptive strike while we still have the element of surprise. Waiting isn't really an option at this point.`,
          'Economics': `We're facing a critical resource shortage that could cripple our entire economy if we don't act within the next month. The pirate attacks on our trade routes have escalated beyond simple raids - they're now systematically targeting our most valuable cargo shipments, and we're losing about eight percent of our total revenue. What makes this worse is that our primary suppliers are starting to demand payment upfront because they're concerned about the security of their shipments. This is creating a cash flow crisis that could force us to shut down essential services. I think our immediate priority has to be deploying military escorts for all trade convoys, even if it means pulling ships from other duties. We can't let our economy collapse while we're dealing with other threats.`,
          'default': `There's a critical situation developing in sector ${Math.floor(Math.random() * 10 + 1)} that needs your immediate attention. Our monitoring systems are showing efficiency dropping to ${Math.floor(Math.random() * 20 + 60)} percent, which suggests either equipment failure or possible sabotage. If this continues to deteriorate, it could cascade into other sectors and create a system-wide crisis. I recommend we dispatch an emergency response team immediately to assess the situation and determine whether this is a technical failure or something more serious. We need to get ahead of this before it spreads.`
        };
        
        response = contextualResponses[currentCharacter.department] || contextualResponses['default'];
      }
      
      // Simulate realistic thinking time (shorter to prevent interruption)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add AI response to messages
      const aiMessage: WhoseAppMessage = {
        id: `ai_${Date.now()}`,
        senderId: selectedConversation?.participants.find(p => p !== currentUserId) || 'ai',
        content: response,
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Always speak the response with natural voice (stop listening first to prevent feedback)
      console.log('🔊 Speaking AI response:', response.substring(0, 50) + '...');
      
      // CRITICAL: Set AI speaking flag and COMPLETELY disable voice mode during AI speech
      setIsAISpeaking(true);
      setIsVoiceMode(false);
      setVoiceModeEnabled(false);
      console.log('🔇 AI now speaking - COMPLETELY disabling voice mode to prevent feedback');
      voiceService.stopContinuousListening();
      
      // Calculate estimated speech time based on response length (roughly 150 words per minute)
      const wordCount = response.split(' ').length;
      const estimatedSpeechTime = (wordCount / 150) * 60 * 1000; // Convert to milliseconds
      const minSpeechTime = Math.max(estimatedSpeechTime, 3000); // At least 3 seconds
      
      console.log(`📊 Estimated speech time: ${Math.round(estimatedSpeechTime/1000)}s for ${wordCount} words`);
      
      try {
        // CRITICAL: Ensure COMPLETE silence before starting character voice
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          console.log('🔇 Cancelled any existing speech synthesis');
          
          // Wait for cancellation to fully complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Double-check that synthesis is truly stopped
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            console.log('⚠️ Speech synthesis still active, forcing stop...');
            window.speechSynthesis.cancel();
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // Start ONLY the character voice TTS - NO FALLBACK to prevent robotic voice
        console.log('🎭 Starting EXCLUSIVE character voice synthesis...');
        console.log('🚫 All other TTS disabled to prevent conflicts');
        
        // Start character voice synthesis and wait for completion
        const speechPromise = voiceService.textToSpeechWithEmotion(response, {
          characterId: currentCharacter.id,
          emotion: 'professional',
          naturalPauses: true,
          rate: 0.85, // Slightly slower to ensure clarity
          pitch: currentCharacter.department === 'Foreign Affairs' ? 1.1 : 1.0
        });
        
        // Wait for speech to complete AND ensure minimum time for full response
        await Promise.all([
          speechPromise,
          new Promise(resolve => setTimeout(resolve, Math.max(minSpeechTime, 5000)))
        ]);
        
        console.log('✅ Character voice synthesis completed successfully');
        
        // Minimal buffer to ensure speech synthesis is fully released
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (voiceError) {
        console.error('❌ Character voice synthesis failed:', voiceError);
        console.log('🔇 NO FALLBACK - preventing robotic voice interruption');
        console.log('🎭 Character voice only - no default TTS allowed');
        // DO NOT use fallback TTS to prevent robotic voice conflicts
        // Just wait the estimated time and continue
        await new Promise(resolve => setTimeout(resolve, minSpeechTime));
      }
      
      // Clear AI speaking flag and resume listening for natural conversation flow
      setIsAISpeaking(false);
      console.log('✅ AI speech complete - clearing speaking flag');
      
      // Resume voice mode immediately after AI speech completes (natural conversation flow)
      if (isVoiceMode) {
        console.log('🎤 AI speech completed - immediately resuming voice listening...');
        console.log('🛡️ Enhanced feedback protection still active');
        
        // Wait for actual audio playback to finish, not just synthesis completion
        const waitForAudioPlayback = async () => {
          // Check if speech synthesis is still speaking or pending
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds max wait
          
          while (attempts < maxAttempts) {
            if (window.speechSynthesis && 
                (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
              console.log(`🔊 Audio still playing, waiting... (${attempts + 1}/${maxAttempts})`);
              await new Promise(resolve => setTimeout(resolve, 100));
              attempts++;
            } else {
              break;
            }
          }
          
          // Additional buffer to ensure audio has completely finished playing
          console.log('🔊 Audio playback finished, adding safety buffer...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second buffer for audio completion
        };
        
        setTimeout(async () => {
          if (isVoiceMode && !isAISpeaking) {
            await waitForAudioPlayback();
            
            console.log('🎤 Audio completely finished - now safe to resume voice input');
            setVoiceModeEnabled(true);
            
            // Restart voice listening after confirming audio is done
            try {
              voiceService.speechToTextWithConfidence(
                (transcript, isFinal, confidence) => {
                  console.log('🎤 Transcript:', transcript, 'Final:', isFinal, 'Confidence:', confidence);
                  
                  // Only process final results with good confidence
                  if (isFinal && (confidence || 1.0) > 0.7 && transcript.trim().length > 2) {
                    console.log('✅ Processing final transcript:', transcript);
                    
                    // Send user message
                    handleVoiceTranscript(transcript);
                    
                    // Generate AI response if in conversational call
                    if (isConversationalCall) {
                      generateConversationalResponse(transcript);
                    }
                  }
                },
                (error) => {
                  console.error('❌ Voice recognition error after resume:', error);
                }
              );
              console.log('🎤 Voice listening safely resumed after audio completion');
            } catch (error) {
              console.error('❌ Failed to resume voice listening:', error);
            }
          }
        }, 100); // Start the audio check after minimal delay
      }
    } catch (error) {
      console.error('Failed to generate conversational response:', error);
    }
  }, [selectedConversation, currentUserId, isVoiceMode, messages, civilizationId, isAISpeaking]);

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
      } else {
        // Fallback: create message locally if API fails
        const newMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          conversationId,
          senderId: currentUserId,
          senderName: 'You',
          senderTitle: 'Player',
          senderAvatar: '/api/placeholder/32/32',
          content,
          messageType,
          timestamp: new Date(),
          isRead: true,
          attachments: [],
          reactions: [],
          audioBlob,
          audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback: create message locally
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: currentUserId,
        senderName: 'You',
        senderTitle: 'Player',
        senderAvatar: '/api/placeholder/32/32',
        content,
        messageType,
        timestamp: new Date(),
        isRead: true,
        attachments: [],
        reactions: [],
        audioBlob,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
      };
      setMessages(prev => [...prev, newMessage]);
    }
  }, [selectedConversation, selectedChannel, currentUserId, civilizationId, sendMessage]);

  // Handle voice transcript
  const handleVoiceTranscript = useCallback((transcript: string) => {
    // Ignore voice input if AI is currently speaking (feedback prevention)
    if (isAISpeaking) {
      console.log('🚫 Ignoring voice transcript while AI is speaking:', transcript);
      return;
    }
    
    // Enhanced check: ignore transcripts that sound like AI responses (aggressive feedback prevention)
    const aiResponseKeywords = [
      'zephyrian empire', 'sector 7', 'diplomatic concern', 'military force', 'trade routes',
      'intelligence suggests', 'our most pressing', 'particularly dangerous', 'recommend we',
      'thirty percent', 'resource income', 'direct diplomatic channels', 'face-to-face summit',
      'understand their intentions', 'before this escalates'
    ];
    const transcriptLower = transcript.toLowerCase();
    const soundsLikeAIResponse = aiResponseKeywords.some(keyword => transcriptLower.includes(keyword));
    
    // Also check for repeated phrases that are likely AI echo
    const recentMessages = messages.slice(-3); // Check last 3 messages
    const isRepeatedPhrase = recentMessages.some(msg => 
      msg.content && msg.content.toLowerCase().includes(transcriptLower)
    );
    
    if (soundsLikeAIResponse || isRepeatedPhrase) {
      console.log('🚫 Ignoring transcript that sounds like AI feedback or repetition:', transcript);
      return;
    }
    
    console.log('🎤 Processing voice transcript:', transcript);
    if (transcript.trim()) {
      handleSendMessage(transcript, 'voice');
    }
  }, [handleSendMessage, isAISpeaking]);

  // Handle voice mode toggle with continuous listening
  const handleVoiceModeToggle = useCallback(async () => {
    // Prevent voice mode activation while AI is speaking
    if (isAISpeaking) {
      console.log('🚫 Cannot toggle voice mode while AI is speaking');
      return;
    }
    
    console.log('🎤 Voice mode toggle clicked');
    const newVoiceMode = !isVoiceMode;
    setIsVoiceMode(newVoiceMode);
    setVoiceModeEnabled(newVoiceMode);
    
    if (newVoiceMode) {
      console.log('🎤 Starting conversational listening...');
      
      try {
        await voiceService.speechToTextWithConfidence(
          (transcript, isFinal, confidence) => {
            console.log('🎤 Transcript:', transcript, 'Final:', isFinal, 'Confidence:', confidence);
            
            // Only process final results with good confidence
            if (isFinal && (confidence || 1.0) > 0.7 && transcript.trim().length > 2) {
              console.log('✅ Processing final transcript:', transcript);
              
              // Send user message
              handleVoiceTranscript(transcript);
              
              // Generate AI response if in conversational call
              if (isConversationalCall) {
                generateConversationalResponse(transcript);
              }
              
              // Don't automatically restart listening - let the AI response complete first
              // The generateConversationalResponse function will handle resuming listening
              console.log('🎤 Voice input processed, waiting for AI response to complete before resuming');
            }
          },
          (error) => {
            console.error('Speech recognition error:', error);
            setError('Speech recognition failed');
            setIsVoiceMode(false);
          },
          2500 // Wait 2.5 seconds of silence
        );
    } catch (error) {
        console.error('❌ Failed to start conversational listening:', error);
        setError('Failed to start voice mode. Please check microphone permissions.');
        setIsVoiceMode(false);
      }
    } else {
      console.log('🔇 Stopping conversational listening...');
      // The speechToTextWithConfidence will stop automatically
    }
  }, [isVoiceMode, isConversationalCall, handleVoiceTranscript, generateConversationalResponse, isAISpeaking]);

  // Generate character voice response
  const generateCharacterVoiceResponse = useCallback(async (userMessage: string) => {
    if (!selectedConversation && !selectedChannel) return;
    
    try {
      // Determine which character should respond
      let respondingCharacterId: string | null = null;
      
      if (selectedConversation) {
        // In direct conversation, the other participant responds
        respondingCharacterId = selectedConversation.participants.find(p => p !== currentUserId) || null;
      } else if (selectedChannel) {
        // In channel, pick a relevant character (for now, use first available)
        const channelParticipants = generateChannelParticipants(selectedChannel);
        const characterParticipants = channelParticipants.filter(p => !p.isPlayer);
        respondingCharacterId = characterParticipants[0]?.id || null;
      }
      
      if (!respondingCharacterId) return;
      
      // Find the character details
      const character = characters.find(c => c.id === respondingCharacterId);
      if (!character) return;
      
      // Generate contextual response based on character and user message
      const responseText = generateCharacterResponse(character, userMessage);
      
      // Create character message
      const conversationId = selectedConversation?.id || selectedChannel?.id;
      if (!conversationId) return;
      
      const characterMessage = {
        id: `msg_${Date.now()}_${character.id}`,
        conversationId,
        senderId: character.id,
        senderName: character.name,
        senderTitle: character.title,
        senderAvatar: character.avatar,
        content: responseText,
        timestamp: new Date(),
        messageType: 'text',
        isRead: false,
        attachments: [],
        reactions: []
      };
      
      // Add message to UI
      setMessages(prev => [...prev, characterMessage]);
      
      // Speak the character's response with their voice
      setTimeout(async () => {
        try {
          await voiceService.textToSpeech(responseText, {
            characterId: character.id,
            rate: 1.0,
            pitch: 1.0,
            volume: 0.8
          });
        } catch (error) {
          console.error('Error speaking character response:', error);
        }
      }, 500); // Small delay to feel natural
      
    } catch (error) {
      console.error('Error generating character response:', error);
    }
  }, [selectedConversation, selectedChannel, currentUserId, characters]);

  // Generate contextual character response
  const generateCharacterResponse = useCallback((character: CharacterProfile, userMessage: string): string => {
    const responses = [
      `I understand your concern about "${userMessage}". As ${character.title}, I believe we should consider the ${character.specialties?.[0]?.toLowerCase()} implications.`,
      `That's an interesting point about "${userMessage}". In my experience with ${character.specialties?.[0]?.toLowerCase()}, I've found that we need to approach this carefully.`,
      `Thank you for bringing up "${userMessage}". From my perspective as ${character.title}, I think we should examine this from multiple angles.`,
      `I hear what you're saying about "${userMessage}". Given my background in ${character.department?.toLowerCase()}, I'd recommend we consider the broader context.`,
      `Your point about "${userMessage}" is well taken. As someone who specializes in ${character.specialties?.[0]?.toLowerCase()}, I think we should proceed thoughtfully.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);

  // Handle voice message from voice controls (legacy)
  const handleVoiceMessage = useCallback(async (transcript: string, audioBlob?: Blob) => {
    if (transcript.trim()) {
      await handleVoiceTranscript(transcript);
    } else if (audioBlob) {
      await handleSendMessage('🎤 Voice Message', 'voice', audioBlob);
    }
  }, [handleVoiceTranscript, handleSendMessage]);

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
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);

  // Generate channel participants from channel data
  const generateChannelParticipants = useCallback((channel: WhoseAppChannel) => {
    const participants: Array<{
      id: string;
      name: string;
      avatar: string;
      title: string;
      status: 'online' | 'away' | 'busy' | 'offline';
      isPlayer: boolean;
    }> = [];
    
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
              
              {/* Interrupt button when AI is speaking */}
              {isAISpeaking && (
                <button
                  onClick={() => {
                    console.log('🛑 User interrupted AI speech');
                    setIsAISpeaking(false);
                    setIsVoiceMode(false);
                    setVoiceModeEnabled(false);
                    voiceService.stopContinuousListening();
                    // CRITICAL: Stop ALL speech synthesis immediately
                    if (window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                      console.log('🔇 All speech synthesis cancelled by user');
                    }
                  }}
                  style={{
                    background: 'rgba(244, 67, 54, 0.3)',
                    border: '1px solid #f44336',
                    borderRadius: '8px',
                    color: '#f44336',
                    padding: '10px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    minWidth: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Stop AI Response"
                >
                  🛑
                </button>
              )}
              
              <button
                onClick={handleVoiceModeToggle}
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
                title={isVoiceMode ? 'Switch to text mode (Listening...)' : 'Switch to voice mode'}
              >
                {isVoiceMode ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🎤 
                    <span style={{ 
                      width: '6px', 
                      height: '6px', 
                      backgroundColor: '#4CAF50', 
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite'
                    }} />
                  </span>
                ) : '⌨️'}
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
            
                        {/* Voice controls removed - using mic button next to send instead */}
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
          {conversations.map((conversation: WhoseAppConversation) => (
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
          {/* Department Channels */}
          <div className="channel-category" style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
              🏛️ Departments
            </h4>
            {(channels.filter(c => c.type === 'department') as WhoseAppChannel[]).map(channel => (
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
            {(channels.filter(c => c.type === 'project') as WhoseAppChannel[]).map(channel => (
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
            {(channels.filter(c => c.type === 'cabinet' || c.type === 'emergency') as WhoseAppChannel[]).map(channel => (
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
            {(channels.filter(c => c.type === 'general') as WhoseAppChannel[]).map(channel => (
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%234ecdc4"/><text x="20" y="25" text-anchor="middle" fill="white" font-size="14">${character.name.charAt(0)}</text></svg>`;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ color: '#4ecdc4', margin: 0, fontSize: '20px' }}>
          💬 WhoseApp
        </h2>
          {isAISpeaking && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4CAF50',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#4CAF50'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4CAF50',
                animation: 'pulse 1.5s infinite'
              }} />
              AI Speaking...
            </div>
          )}
        </div>
        
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
          { 
            id: 'conversations', 
            label: '💬 Conversations', 
            count: conversations.reduce((total, conv) => total + conv.unreadCount, 0)
          },
          { 
            id: 'channels', 
            label: '📺 Channels', 
            count: channels.reduce((total, channel) => total + channel.unreadCount, 0)
          },
          { 
            id: 'characters', 
            label: '👥 Characters', 
            count: characters.filter(char => char.whoseAppProfile.status === 'online').length
          },
          { 
            id: 'actions', 
            label: '📋 Actions', 
            count: actionItems.filter(a => a.status === 'pending' || a.status === 'in_progress').length
          }
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



      {/* Character Profile Modal */}
      {isProfileModalVisible && selectedCharacterForProfile && (
        <CharacterProfileModal
          characterId={selectedCharacterForProfile}
          isVisible={isProfileModalVisible}
          onClose={() => {
            setIsProfileModalVisible(false);
            setSelectedCharacterForProfile(null);
          }}
        />
      )}
    </div>
  );
};

export default WhoseAppMain;
