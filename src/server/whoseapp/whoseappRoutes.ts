/**
 * WhoseApp API Routes (Voice/Text Communication System)
 * 
 * REST API endpoints for the WhoseApp Communication Hub
 * including voice calls, text messaging, group chats, and real-time communication.
 */

import express from 'express';
import { EnhancedKnobSystem, createEnhancedKnobEndpoints } from '../shared/enhanced-knob-system.js';

const router = express.Router();

// Enhanced AI Knobs for WhoseApp Communication System
const whoseappKnobsData = {
  // Voice Communication Quality
  voice_call_quality: 0.9,                 // Voice call quality and audio clarity
  voice_compression_efficiency: 0.8,       // Voice compression efficiency and bandwidth optimization
  noise_cancellation_strength: 0.8,        // Noise cancellation strength and background filtering
  
  // Text Messaging & Chat
  message_delivery_reliability: 0.9,       // Message delivery reliability and guaranteed transmission
  text_formatting_richness: 0.7,           // Text formatting richness and multimedia support
  emoji_reaction_variety: 0.7,             // Emoji reaction variety and expression options
  
  // Group Communication & Channels
  group_chat_scalability: 0.8,             // Group chat scalability and large conversation support
  channel_organization_sophistication: 0.8, // Channel organization sophistication and structure
  moderation_tool_effectiveness: 0.8,      // Moderation tool effectiveness and community management
  
  // Real-Time Features & Presence
  real_time_synchronization: 0.9,          // Real-time synchronization and instant updates
  presence_indicator_accuracy: 0.8,        // Presence indicator accuracy and status tracking
  typing_indicator_responsiveness: 0.7,    // Typing indicator responsiveness and live feedback
  
  // Privacy & Security
  end_to_end_encryption_strength: 0.9,     // End-to-end encryption strength and message security
  user_privacy_protection: 0.9,            // User privacy protection and data confidentiality
  secure_authentication: 0.9,              // Secure authentication and identity verification
  
  // Cross-Platform Integration
  device_synchronization: 0.8,             // Device synchronization and multi-platform support
  cross_platform_compatibility: 0.8,       // Cross-platform compatibility and universal access
  cloud_backup_reliability: 0.8,           // Cloud backup reliability and data preservation
  
  // User Experience & Interface
  interface_intuitiveness: 0.8,            // Interface intuitiveness and ease of use
  accessibility_feature_support: 0.8,      // Accessibility feature support and inclusive design
  customization_flexibility: 0.7,          // Customization flexibility and personalization options
  
  // Performance & Scalability
  message_search_efficiency: 0.8,          // Message search efficiency and content discovery
  file_sharing_performance: 0.8,           // File sharing performance and transfer speed
  concurrent_user_handling: 0.8,           // Concurrent user handling and system capacity
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System for WhoseApp
const whoseappKnobSystem = new EnhancedKnobSystem(whoseappKnobsData);

// Apply whoseapp knobs to game state
function applyWhoseappKnobsToGameState() {
  const knobs = whoseappKnobSystem.knobs;
  
  // Apply voice communication settings
  const voiceCommunication = (knobs.voice_call_quality + knobs.voice_compression_efficiency + 
    knobs.noise_cancellation_strength) / 3;
  
  // Apply text messaging settings
  const textMessaging = (knobs.message_delivery_reliability + knobs.text_formatting_richness + 
    knobs.emoji_reaction_variety) / 3;
  
  // Apply group communication settings
  const groupCommunication = (knobs.group_chat_scalability + knobs.channel_organization_sophistication + 
    knobs.moderation_tool_effectiveness) / 3;
  
  // Apply real-time features settings
  const realTimeFeatures = (knobs.real_time_synchronization + knobs.presence_indicator_accuracy + 
    knobs.typing_indicator_responsiveness) / 3;
  
  // Apply privacy and security settings
  const privacySecurity = (knobs.end_to_end_encryption_strength + knobs.user_privacy_protection + 
    knobs.secure_authentication) / 3;
  
  // Apply user experience settings
  const userExperience = (knobs.interface_intuitiveness + knobs.accessibility_feature_support + 
    knobs.customization_flexibility) / 3;
  
  console.log('Applied whoseapp knobs to game state:', {
    voiceCommunication,
    textMessaging,
    groupCommunication,
    realTimeFeatures,
    privacySecurity,
    userExperience
  });
}

// ===== VOICE COMMUNICATION =====

/**
 * POST /api/whoseapp/calls/initiate - Initiate voice call
 */
router.post('/calls/initiate', async (req, res) => {
  try {
    const {
      callerId,
      recipientId,
      callType = 'voice',
      campaignId
    } = req.body;

    if (!callerId || !recipientId || !campaignId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['callerId', 'recipientId', 'campaignId']
      });
    }

    const call = {
      id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callerId,
      recipientId,
      callType,
      campaignId: Number(campaignId),
      status: 'initiated',
      startTime: new Date(),
      endTime: null,
      duration: 0,
      quality: {
        audioQuality: 'high',
        connectionStability: 'stable',
        latency: Math.floor(Math.random() * 50) + 10 // 10-60ms
      }
    };

    res.status(201).json({
      success: true,
      data: call
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({
      error: 'Failed to initiate call',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/whoseapp/calls/:callId/status - Update call status
 */
router.put('/calls/:callId/status', async (req, res) => {
  try {
    const { callId } = req.params;
    const { status, endTime } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing required field: status'
      });
    }

    const updatedCall = {
      id: callId,
      status,
      endTime: endTime ? new Date(endTime) : null,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: updatedCall
    });
  } catch (error) {
    console.error('Error updating call status:', error);
    res.status(500).json({
      error: 'Failed to update call status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== TEXT MESSAGING =====

/**
 * GET /api/whoseapp/channels - Get available channels
 */
router.get('/channels', async (req, res) => {
  try {
    const { civilizationId } = req.query;
    console.log('📋 Getting WhoseApp channels for civilization:', civilizationId);

    // Mock channels for WhoseApp
    const mockChannels = [
      {
        id: 'channel_cabinet',
        name: 'Cabinet',
        type: 'cabinet',
        description: 'High-level government discussions',
        participantCount: 8,
        lastActivity: new Date().toISOString(),
        isPrivate: true
      },
      {
        id: 'channel_defense',
        name: 'Defense & Security',
        type: 'department',
        description: 'Military and security coordination',
        participantCount: 12,
        lastActivity: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        isPrivate: true
      },
      {
        id: 'channel_economy',
        name: 'Economic Affairs',
        type: 'department',
        description: 'Economic policy and trade discussions',
        participantCount: 15,
        lastActivity: new Date(Date.now() - 600000).toISOString(), // 10 min ago
        isPrivate: false
      },
      {
        id: 'channel_science',
        name: 'Science & Research',
        type: 'department',
        description: 'Research coordination and scientific advancement',
        participantCount: 20,
        lastActivity: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        isPrivate: false
      },
      {
        id: 'channel_general',
        name: 'General Discussion',
        type: 'general',
        description: 'Open forum for all government personnel',
        participantCount: 45,
        lastActivity: new Date(Date.now() - 120000).toISOString(), // 2 min ago
        isPrivate: false
      }
    ];

    console.log('✅ Returning mock WhoseApp channels:', mockChannels.length);
    res.json({
      success: true,
      channels: mockChannels,
      total: mockChannels.length
    });

  } catch (error) {
    console.error('❌ Error getting WhoseApp channels:', error);
    res.status(500).json({
      error: 'Failed to get channels',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/whoseapp/conversations - Get user conversations
 */
router.get('/conversations', async (req, res) => {
  try {
    const { userId, campaignId, limit = 50, offset = 0 } = req.query;

    if (!userId || !campaignId) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['userId', 'campaignId']
      });
    }

    // Mock conversation data
    const conversations = Array.from({ length: Math.min(Number(limit), 20) }, (_, i) => ({
      id: `conv_${i + Number(offset)}`,
      participants: [userId, `user_${i + 1}`],
      lastMessage: {
        id: `msg_${Date.now()}_${i}`,
        senderId: Math.random() > 0.5 ? userId : `user_${i + 1}`,
        content: `Sample message ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        type: 'text'
      },
      unreadCount: Math.floor(Math.random() * 5),
      isGroup: Math.random() > 0.7,
      updatedAt: new Date()
    }));

    res.json({
      success: true,
      data: conversations,
      count: conversations.length,
      pagination: {
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      error: 'Failed to fetch conversations',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/whoseapp/messages - Get messages by conversationId (query param)
 */
router.get('/messages', async (req, res) => {
  try {
    const { conversationId, limit = 50, offset = 0, before } = req.query;
    
    if (!conversationId) {
      return res.status(400).json({
        error: 'Missing conversationId parameter'
      });
    }

    console.log('📋 Getting messages for conversation:', conversationId);

    // Mock message data
    const messages = Array.from({ length: Math.min(Number(limit), 30) }, (_, i) => ({
      id: `msg_${conversationId}_${i + Number(offset)}`,
      conversationId,
      senderId: `user_${Math.floor(Math.random() * 3) + 1}`,
      content: `Message content ${i + 1}`,
      type: Math.random() > 0.8 ? 'image' : 'text',
      timestamp: new Date(Date.now() - (i * 60000)), // 1 minute apart
      edited: Math.random() > 0.9,
      reactions: Math.random() > 0.7 ? [
        { emoji: '👍', userId: 'user_1', timestamp: new Date() }
      ] : [],
      replyTo: Math.random() > 0.8 ? `msg_${conversationId}_${i - 1}` : null
    }));

    console.log('✅ Returning mock messages:', messages.length);
    res.json({
      success: true,
      data: messages.reverse(), // Most recent first
      count: messages.length,
      conversationId
    });

  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({
      error: 'Failed to get messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/whoseapp/conversations/:conversationId/messages - Get conversation messages
 */
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0, before } = req.query;

    // Mock message data
    const messages = Array.from({ length: Math.min(Number(limit), 30) }, (_, i) => ({
      id: `msg_${conversationId}_${i + Number(offset)}`,
      conversationId,
      senderId: `user_${Math.floor(Math.random() * 3) + 1}`,
      content: `Message content ${i + 1}`,
      type: Math.random() > 0.8 ? 'image' : 'text',
      timestamp: new Date(Date.now() - (i * 60000)), // 1 minute apart
      edited: Math.random() > 0.9,
      reactions: Math.random() > 0.7 ? [
        { emoji: '👍', userId: 'user_1', timestamp: new Date() }
      ] : [],
      replyTo: Math.random() > 0.8 ? `msg_${conversationId}_${i - 1}` : null
    }));

    res.json({
      success: true,
      data: messages.reverse(), // Most recent first
      count: messages.length,
      conversationId
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/whoseapp/conversations/:conversationId/messages - Send message
 */
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const {
      senderId,
      content,
      type = 'text',
      replyTo,
      metadata
    } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['senderId', 'content']
      });
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      content,
      type,
      timestamp: new Date(),
      replyTo: replyTo || null,
      metadata: metadata || {},
      edited: false,
      reactions: []
    };

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== GROUP CHATS & CHANNELS =====

/**
 * POST /api/whoseapp/groups - Create group chat
 */
router.post('/groups', async (req, res) => {
  try {
    const {
      creatorId,
      name,
      description,
      participants,
      campaignId,
      isPublic = false
    } = req.body;

    if (!creatorId || !name || !participants || !campaignId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['creatorId', 'name', 'participants', 'campaignId']
      });
    }

    const group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      creatorId,
      participants: [creatorId, ...participants],
      campaignId: Number(campaignId),
      isPublic,
      createdAt: new Date(),
      settings: {
        allowInvites: true,
        moderationEnabled: false,
        messageHistory: 'visible'
      }
    };

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({
      error: 'Failed to create group',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ===== USER PRESENCE & STATUS =====

/**
 * GET /api/whoseapp/users/:userId/presence - Get user presence
 */
router.get('/users/:userId/presence', async (req, res) => {
  try {
    const { userId } = req.params;

    const presence = {
      userId,
      status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
      lastSeen: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      activity: Math.random() > 0.7 ? 'in_call' : Math.random() > 0.5 ? 'typing' : 'idle',
      customStatus: Math.random() > 0.8 ? 'Busy with important meeting' : null
    };

    res.json({
      success: true,
      data: presence
    });
  } catch (error) {
    console.error('Error fetching user presence:', error);
    res.status(500).json({
      error: 'Failed to fetch user presence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/whoseapp/users/:userId/presence - Update user presence
 */
router.put('/users/:userId/presence', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, customStatus, activity } = req.body;

    const updatedPresence = {
      userId,
      status: status || 'online',
      customStatus: customStatus || null,
      activity: activity || 'idle',
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      data: updatedPresence
    });
  } catch (error) {
    console.error('Error updating user presence:', error);
    res.status(500).json({
      error: 'Failed to update user presence',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(router, 'whoseapp', whoseappKnobSystem, applyWhoseappKnobsToGameState);

export default router;
