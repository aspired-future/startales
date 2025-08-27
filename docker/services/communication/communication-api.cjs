const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('../../../src/server/routes/enhanced-knob-system.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4003;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced AI Knobs for Communication System
const communicationKnobsData = {
  // Message Processing
  message_filtering_strictness: 0.5,    // Strictness of message content filtering
  auto_translation_quality: 0.8,        // Quality of automatic translation
  message_priority_weighting: 0.6,      // Weighting of message priority algorithms
  
  // Channel Management
  channel_creation_freedom: 0.7,        // Freedom for users to create channels
  moderation_automation_level: 0.6,     // Level of automated moderation
  channel_discovery_visibility: 0.8,    // Visibility of channels in discovery
  
  // Diplomatic Communications
  diplomatic_protocol_strictness: 0.8,  // Strictness of diplomatic protocols
  treaty_negotiation_assistance: 0.7,   // AI assistance in treaty negotiations
  conflict_mediation_involvement: 0.6,  // AI involvement in conflict mediation
  
  // AI Character Interactions
  character_response_frequency: 0.5,    // Frequency of AI character responses
  character_personality_consistency: 0.9, // Consistency of character personalities
  character_knowledge_accuracy: 0.8,    // Accuracy of character knowledge
  
  // Security & Privacy
  encryption_strength: 0.9,             // Strength of message encryption
  surveillance_detection: 0.7,          // Detection of surveillance attempts
  privacy_protection_level: 0.8,        // Level of privacy protection
  
  // Communication Analytics
  sentiment_analysis_depth: 0.6,        // Depth of sentiment analysis
  relationship_tracking_detail: 0.7,    // Detail of relationship tracking
  influence_network_mapping: 0.5,       // Mapping of influence networks
  
  // Real-time Features
  voice_processing_quality: 0.8,        // Quality of voice processing
  real_time_translation_speed: 0.7,     // Speed of real-time translation
  connection_stability_priority: 0.9,   // Priority of connection stability
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System
const communicationKnobSystem = new EnhancedKnobSystem(communicationKnobsData);

// Apply knobs to game state
function applyCommunicationKnobsToGameState() {
  const knobs = communicationKnobSystem.knobs;
  
  // Apply message processing settings
  const messageProcessing = {
    filtering: knobs.message_filtering_strictness,
    translation: knobs.auto_translation_quality,
    priority: knobs.message_priority_weighting
  };
  
  // Apply channel management settings
  const channelManagement = {
    creation: knobs.channel_creation_freedom,
    moderation: knobs.moderation_automation_level,
    discovery: knobs.channel_discovery_visibility
  };
  
  // Apply diplomatic settings
  const diplomaticSettings = {
    protocol: knobs.diplomatic_protocol_strictness,
    negotiation: knobs.treaty_negotiation_assistance,
    mediation: knobs.conflict_mediation_involvement
  };
  
  // Apply AI character settings
  const characterSettings = {
    frequency: knobs.character_response_frequency,
    consistency: knobs.character_personality_consistency,
    accuracy: knobs.character_knowledge_accuracy
  };
  
  // Apply security settings
  const securitySettings = {
    encryption: knobs.encryption_strength,
    surveillance: knobs.surveillance_detection,
    privacy: knobs.privacy_protection_level
  };
  
  // Apply analytics settings
  const analyticsSettings = {
    sentiment: knobs.sentiment_analysis_depth,
    relationships: knobs.relationship_tracking_detail,
    influence: knobs.influence_network_mapping
  };
  
  // Apply real-time settings
  const realtimeSettings = {
    voice: knobs.voice_processing_quality,
    translation: knobs.real_time_translation_speed,
    stability: knobs.connection_stability_priority
  };
  
  console.log('Applied communication knobs to game state:', {
    messageProcessing,
    channelManagement,
    diplomaticSettings,
    characterSettings,
    securitySettings,
    analyticsSettings,
    realtimeSettings
  });
}

// In-memory data store for demo
const gameData = {
  players: new Map([
    ['player_1', { id: 'player_1', name: 'Commander Alpha', civilization: 'Terran Federation', status: 'online', lastSeen: new Date().toISOString() }],
    ['player_2', { id: 'player_2', name: 'Admiral Zara', civilization: 'Centauri Republic', status: 'online', lastSeen: new Date().toISOString() }],
    ['player_3', { id: 'player_3', name: 'Director Nova', civilization: 'Vegan Collective', status: 'away', lastSeen: new Date(Date.now() - 300000).toISOString() }],
    ['player_4', { id: 'player_4', name: 'Marshal Vex', civilization: 'Sirian Empire', status: 'online', lastSeen: new Date().toISOString() }],
    ['player_5', { id: 'player_5', name: 'Chief Kael', civilization: 'Kepler Technocracy', status: 'offline', lastSeen: new Date(Date.now() - 3600000).toISOString() }]
  ]),
  
  conversations: new Map([
    // Direct Messages
    ['conv_direct_1', {
      id: 'conv_direct_1',
      type: 'direct',
      participants: ['player_1', 'player_2'],
      name: 'Commander Alpha & Admiral Zara',
      description: 'Direct communication with Admiral Zara',
      created: new Date(Date.now() - 86400000).toISOString(),
      lastActivity: new Date(Date.now() - 1800000).toISOString(),
      unreadCount: 2
    }],
    ['conv_direct_2', {
      id: 'conv_direct_2',
      type: 'direct',
      participants: ['player_1', 'player_4'],
      name: 'Commander Alpha & Marshal Vex',
      description: 'Direct communication with Marshal Vex',
      created: new Date(Date.now() - 172800000).toISOString(),
      lastActivity: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 0
    }],
    
    // Government Groups
    ['conv_cabinet', {
      id: 'conv_cabinet',
      type: 'group',
      participants: ['player_1', 'player_2', 'player_3', 'player_4'],
      name: 'Imperial Cabinet',
      description: 'High-level government decision making',
      created: new Date(Date.now() - 604800000).toISOString(),
      lastActivity: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 1
    }],
    ['conv_security_council', {
      id: 'conv_security_council',
      type: 'group',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Security Council',
      description: 'Military and security coordination',
      created: new Date(Date.now() - 432000000).toISOString(),
      lastActivity: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0
    }],
    ['conv_science_committee', {
      id: 'conv_science_committee',
      type: 'group',
      participants: ['player_1', 'player_3', 'player_5'],
      name: 'Science & Technology Committee',
      description: 'Research and development coordination',
      created: new Date(Date.now() - 345600000).toISOString(),
      lastActivity: new Date(Date.now() - 10800000).toISOString(),
      unreadCount: 1
    }],
    
    // Inter-Galactic Channels
    ['conv_galactic_council', {
      id: 'conv_galactic_council',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_3', 'player_4', 'player_5'],
      name: 'Galactic Council',
      description: 'Inter-civilization diplomatic forum',
      created: new Date(Date.now() - 1209600000).toISOString(),
      lastActivity: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0
    }],
    ['conv_alliance_command', {
      id: 'conv_alliance_command',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Alliance Command',
      description: 'Military alliance coordination',
      created: new Date(Date.now() - 864000000).toISOString(),
      lastActivity: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 3
    }],
    ['conv_trade_federation', {
      id: 'conv_trade_federation',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_3', 'player_5'],
      name: 'Trade Federation',
      description: 'Interstellar commerce and trade agreements',
      created: new Date(Date.now() - 691200000).toISOString(),
      lastActivity: new Date(Date.now() - 21600000).toISOString(),
      unreadCount: 0
    }],
    ['conv_research_network', {
      id: 'conv_research_network',
      type: 'channel',
      participants: ['player_1', 'player_3', 'player_5'],
      name: 'Galactic Research Network',
      description: 'Scientific collaboration across civilizations',
      created: new Date(Date.now() - 518400000).toISOString(),
      lastActivity: new Date(Date.now() - 28800000).toISOString(),
      unreadCount: 1
    }],
    ['conv_emergency_response', {
      id: 'conv_emergency_response',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Emergency Response Network',
      description: 'Crisis management and emergency coordination',
      created: new Date(Date.now() - 259200000).toISOString(),
      lastActivity: new Date(Date.now() - 43200000).toISOString(),
      unreadCount: 0
    }]
  ]),
  
  messages: new Map([
    ['msg_1', {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'player_2',
      type: 'text',
      content: 'Commander, we need to discuss the trade route security situation.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      edited: false,
      reactions: [{ playerId: 'player_1', emoji: '👍', timestamp: new Date(Date.now() - 1700000).toISOString() }]
    }],
    ['msg_2', {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'player_1',
      type: 'text',
      content: 'Agreed. The pirate activity in the Vega system is concerning. What are your recommendations?',
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      edited: false,
      reactions: []
    }],
    ['msg_3', {
      id: 'msg_3',
      conversationId: 'conv_2',
      senderId: 'player_4',
      type: 'voice',
      content: 'Voice message: Strategic analysis of current military positioning',
      audioUrl: '/api/communication/audio/msg_3.wav',
      transcription: 'Our current fleet positioning gives us tactical advantage in three key sectors. I recommend we maintain this formation while negotiating.',
      duration: 15.7,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      edited: false,
      reactions: [
        { playerId: 'player_1', emoji: '🎯', timestamp: new Date(Date.now() - 3500000).toISOString() },
        { playerId: 'player_2', emoji: '💯', timestamp: new Date(Date.now() - 3400000).toISOString() }
      ]
    }],
    ['msg_4', {
      id: 'msg_4',
      conversationId: 'conv_3',
      senderId: 'player_3',
      type: 'text',
      content: 'The environmental protection protocols need immediate ratification. We cannot delay this any longer.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      edited: false,
      reactions: [
        { playerId: 'player_1', emoji: '🌱', timestamp: new Date(Date.now() - 7100000).toISOString() },
        { playerId: 'player_5', emoji: '✅', timestamp: new Date(Date.now() - 7000000).toISOString() }
      ]
    }]
  ]),
  
  voiceCalls: new Map(),
  
  notifications: new Map()
};

// Socket.IO connection handling
const connectedPlayers = new Map();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  socket.on('player_join', (playerId) => {
    connectedPlayers.set(socket.id, playerId);
    
    // Update player status
    if (gameData.players.has(playerId)) {
      const player = gameData.players.get(playerId);
      player.status = 'online';
      player.lastSeen = new Date().toISOString();
      gameData.players.set(playerId, player);
    }
    
    // Join player to their conversation rooms
    gameData.conversations.forEach((conv) => {
      if (conv.participants.includes(playerId)) {
        socket.join(conv.id);
      }
    });
    
    // Broadcast player status update
    socket.broadcast.emit('player_status_update', {
      playerId,
      status: 'online',
      lastSeen: new Date().toISOString()
    });
    
    console.log(`Player ${playerId} joined and subscribed to conversations`);
  });
  
  socket.on('send_message', (data) => {
    const { conversationId, senderId, type, content, audioData } = data;
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message = {
      id: messageId,
      conversationId,
      senderId,
      type,
      content,
      timestamp: new Date().toISOString(),
      edited: false,
      reactions: []
    };
    
    // Handle voice messages
    if (type === 'voice' && audioData) {
      message.audioUrl = `/api/communication/audio/${messageId}.wav`;
      message.duration = audioData.duration || 0;
      message.transcription = audioData.transcription || '';
    }
    
    gameData.messages.set(messageId, message);
    
    // Update conversation last activity
    if (gameData.conversations.has(conversationId)) {
      const conv = gameData.conversations.get(conversationId);
      conv.lastActivity = new Date().toISOString();
      gameData.conversations.set(conversationId, conv);
    }
    
    // Broadcast message to conversation participants
    io.to(conversationId).emit('new_message', message);
    
    console.log(`Message sent in conversation ${conversationId}: ${content}`);
  });
  
  socket.on('start_voice_call', (data) => {
    const { conversationId, callerId } = data;
    const callId = `call_${Date.now()}`;
    
    const voiceCall = {
      id: callId,
      conversationId,
      callerId,
      participants: [callerId],
      status: 'ringing',
      startTime: new Date().toISOString(),
      endTime: null
    };
    
    gameData.voiceCalls.set(callId, voiceCall);
    
    // Notify conversation participants
    socket.to(conversationId).emit('incoming_voice_call', {
      callId,
      callerId,
      conversationId
    });
    
    console.log(`Voice call started by ${callerId} in conversation ${conversationId}`);
  });
  
  socket.on('join_voice_call', (data) => {
    const { callId, playerId } = data;
    
    if (gameData.voiceCalls.has(callId)) {
      const call = gameData.voiceCalls.get(callId);
      if (!call.participants.includes(playerId)) {
        call.participants.push(playerId);
        call.status = 'active';
        gameData.voiceCalls.set(callId, call);
        
        // Notify all call participants
        io.to(call.conversationId).emit('voice_call_update', call);
      }
    }
  });
  
  socket.on('end_voice_call', (data) => {
    const { callId } = data;
    
    if (gameData.voiceCalls.has(callId)) {
      const call = gameData.voiceCalls.get(callId);
      call.status = 'ended';
      call.endTime = new Date().toISOString();
      gameData.voiceCalls.set(callId, call);
      
      // Notify all participants
      io.to(call.conversationId).emit('voice_call_ended', call);
    }
  });
  
  socket.on('add_reaction', (data) => {
    const { messageId, playerId, emoji } = data;
    
    if (gameData.messages.has(messageId)) {
      const message = gameData.messages.get(messageId);
      
      // Remove existing reaction from this player
      message.reactions = message.reactions.filter(r => r.playerId !== playerId);
      
      // Add new reaction
      message.reactions.push({
        playerId,
        emoji,
        timestamp: new Date().toISOString()
      });
      
      gameData.messages.set(messageId, message);
      
      // Broadcast reaction update
      io.to(message.conversationId).emit('reaction_update', {
        messageId,
        reactions: message.reactions
      });
    }
  });
  
  socket.on('disconnect', () => {
    const playerId = connectedPlayers.get(socket.id);
    if (playerId) {
      // Update player status
      if (gameData.players.has(playerId)) {
        const player = gameData.players.get(playerId);
        player.status = 'offline';
        player.lastSeen = new Date().toISOString();
        gameData.players.set(playerId, player);
      }
      
      // Broadcast player status update
      socket.broadcast.emit('player_status_update', {
        playerId,
        status: 'offline',
        lastSeen: new Date().toISOString()
      });
      
      connectedPlayers.delete(socket.id);
      console.log(`Player ${playerId} disconnected`);
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'communication-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    connectedPlayers: connectedPlayers.size
  });
});

// Get all players
app.get('/api/communication/players', (req, res) => {
  const players = Array.from(gameData.players.values());
  res.json({
    players,
    total: players.length,
    online: players.filter(p => p.status === 'online').length
  });
});

// Get player conversations
app.get('/api/communication/conversations/:playerId', (req, res) => {
  const { playerId } = req.params;
  
  const playerConversations = Array.from(gameData.conversations.values())
    .filter(conv => conv.participants.includes(playerId))
    .map(conv => ({
      ...conv,
      participantDetails: conv.participants.map(pid => gameData.players.get(pid)).filter(Boolean),
      unreadCount: 0 // TODO: Implement unread message counting
    }))
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  
  res.json({
    conversations: playerConversations,
    total: playerConversations.length
  });
});

// Get conversation messages
app.get('/api/communication/conversations/:conversationId/messages', (req, res) => {
  const { conversationId } = req.params;
  const { limit = '50', offset = '0' } = req.query;
  
  const conversationMessages = Array.from(gameData.messages.values())
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
    .map(msg => ({
      ...msg,
      senderDetails: gameData.players.get(msg.senderId)
    }));
  
  res.json({
    messages: conversationMessages,
    total: conversationMessages.length,
    hasMore: conversationMessages.length === parseInt(limit)
  });
});

// Create new conversation
app.post('/api/communication/conversations', (req, res) => {
  const { type, participants, name, creatorId, description, isScheduled, scheduledTime, agenda } = req.body;
  
  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: 'At least 2 participants required' });
  }
  
  // Validate participants exist
  const invalidParticipants = participants.filter(pid => !gameData.players.has(pid));
  if (invalidParticipants.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid participants', 
      invalidParticipants 
    });
  }
  
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const conversation = {
    id: conversationId,
    type: type || 'group',
    participants,
    name: name || `Conversation ${conversationId}`,
    description: description || `${type === 'summit' ? 'Diplomatic summit' : 'Group conversation'} created by ${gameData.players.get(creatorId)?.name || creatorId}`,
    created: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    createdBy: creatorId,
    unreadCount: 0,
    // Summit-specific fields
    isScheduled: isScheduled || false,
    scheduledTime: scheduledTime || null,
    agenda: agenda || null,
    summitType: type === 'summit' ? (participants.length > 2 ? 'multilateral' : 'bilateral') : null
  };
  
  gameData.conversations.set(conversationId, conversation);
  
  // Add participants to the socket room
  participants.forEach(playerId => {
    const playerSockets = Array.from(connectedPlayers.entries())
      .filter(([socketId, pid]) => pid === playerId)
      .map(([socketId]) => socketId);
    
    playerSockets.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(conversationId);
      }
    });
  });
  
  // Notify participants
  io.to(conversationId).emit('new_conversation', {
    ...conversation,
    participantDetails: participants.map(pid => gameData.players.get(pid)).filter(Boolean)
  });
  
  res.json({
    success: true,
    conversation: {
      ...conversation,
      participantDetails: participants.map(pid => gameData.players.get(pid)).filter(Boolean)
    }
  });
});

// Schedule diplomatic summit
app.post('/api/communication/summits', (req, res) => {
  const { 
    name, 
    participants, 
    scheduledTime, 
    agenda, 
    creatorId, 
    type = 'summit',
    description,
    priority = 'normal'
  } = req.body;
  
  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: 'At least 2 participants required for a summit' });
  }
  
  if (!scheduledTime) {
    return res.status(400).json({ error: 'Scheduled time is required for summits' });
  }
  
  // Validate participants exist and get their details
  const participantDetails = [];
  const invalidParticipants = [];
  
  participants.forEach(pid => {
    const player = gameData.players.get(pid);
    if (player) {
      participantDetails.push(player);
    } else {
      invalidParticipants.push(pid);
    }
  });
  
  if (invalidParticipants.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid participants', 
      invalidParticipants 
    });
  }
  
  // Check if any participants are human leaders (they need to be available)
  const humanLeaders = participantDetails.filter(p => 
    p.name.includes('Commander') || 
    p.name.includes('President') || 
    p.name.includes('Director') ||
    p.name.includes('Emperor')
  );
  
  const summitId = `summit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const summit = {
    id: summitId,
    type: 'summit',
    participants,
    name: name || `${participants.length > 2 ? 'Multilateral' : 'Bilateral'} Summit`,
    description: description || `Diplomatic summit scheduled for ${new Date(scheduledTime).toLocaleString()}`,
    created: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    createdBy: creatorId,
    unreadCount: 0,
    // Summit-specific fields
    isScheduled: true,
    scheduledTime,
    agenda: agenda || 'Diplomatic discussions and negotiations',
    summitType: participants.length > 2 ? 'multilateral' : 'bilateral',
    priority,
    status: 'scheduled',
    humanLeadersInvolved: humanLeaders.length,
    participantCivilizations: participantDetails.map(p => p.civilization)
  };
  
  gameData.conversations.set(summitId, summit);
  
  // Add participants to the socket room
  participants.forEach(playerId => {
    const playerSockets = Array.from(connectedPlayers.entries())
      .filter(([socketId, pid]) => pid === playerId)
      .map(([socketId]) => socketId);
    
    playerSockets.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(summitId);
      }
    });
  });
  
  // Send summit invitations
  io.to(summitId).emit('summit_scheduled', {
    ...summit,
    participantDetails,
    message: `You have been invited to a ${summit.summitType} summit: ${summit.name}`
  });
  
  // Create initial summit message
  const welcomeMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const welcomeMessage = {
    id: welcomeMessageId,
    conversationId: summitId,
    senderId: 'system',
    type: 'system',
    content: `🏛️ Summit "${summit.name}" has been scheduled for ${new Date(scheduledTime).toLocaleString()}.\n\n📋 Agenda: ${summit.agenda}\n\n👥 Participants: ${participantDetails.map(p => `${p.name} (${p.civilization})`).join(', ')}`,
    timestamp: new Date().toISOString(),
    edited: false,
    reactions: []
  };
  
  gameData.messages.set(welcomeMessageId, welcomeMessage);
  
  res.json({
    success: true,
    summit: {
      ...summit,
      participantDetails
    },
    message: 'Summit scheduled successfully'
  });
});

// Get scheduled summits
app.get('/api/communication/summits', (req, res) => {
  const { playerId, status = 'all' } = req.query;
  
  let summits = Array.from(gameData.conversations.values())
    .filter(conv => conv.type === 'summit');
  
  if (playerId) {
    summits = summits.filter(summit => summit.participants.includes(playerId));
  }
  
  if (status !== 'all') {
    summits = summits.filter(summit => summit.status === status);
  }
  
  const summitsWithDetails = summits.map(summit => ({
    ...summit,
    participantDetails: summit.participants.map(pid => gameData.players.get(pid)).filter(Boolean)
  })).sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  
  res.json({
    summits: summitsWithDetails,
    total: summitsWithDetails.length
  });
});

// Auto-create diplomatic channels when relationships form
app.post('/api/communication/diplomatic-relationships', (req, res) => {
  const { 
    relationshipType, // 'trade_federation', 'alliance', 'research_pact', 'non_aggression', 'mutual_defense'
    participants, 
    relationshipName,
    creatorId,
    isInternal = false // true for internal civ groups, false for inter-civ
  } = req.body;
  
  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: 'At least 2 participants required' });
  }
  
  // Auto-generate channel based on relationship type
  const channelTemplates = {
    trade_federation: {
      type: 'channel',
      namePrefix: 'Trade Federation',
      description: 'Commercial cooperation and trade agreements',
      icon: '💼'
    },
    alliance: {
      type: 'channel', 
      namePrefix: 'Military Alliance',
      description: 'Strategic military cooperation and defense coordination',
      icon: '⚔️'
    },
    research_pact: {
      type: 'group',
      namePrefix: 'Research Collaboration',
      description: 'Scientific research and technology sharing',
      icon: '🔬'
    },
    non_aggression: {
      type: 'group',
      namePrefix: 'Non-Aggression Pact',
      description: 'Peaceful coexistence and conflict prevention',
      icon: '🕊️'
    },
    mutual_defense: {
      type: 'channel',
      namePrefix: 'Defense Coalition',
      description: 'Mutual defense and security cooperation',
      icon: '🛡️'
    }
  };
  
  const template = channelTemplates[relationshipType];
  if (!template) {
    return res.status(400).json({ error: 'Invalid relationship type' });
  }
  
  // Generate channel name
  const participantCivs = participants.map(pid => {
    const player = gameData.players.get(pid);
    return player ? player.civilization : 'Unknown';
  }).filter(civ => civ !== 'Unknown');
  
  const channelName = relationshipName || 
    `${template.namePrefix}: ${participantCivs.join(' & ')}`;
  
  // Create the diplomatic channel
  const channelId = `diplomatic_${relationshipType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const diplomaticChannel = {
    id: channelId,
    type: template.type,
    participants,
    name: channelName,
    description: `${template.description} between ${participantCivs.join(', ')}`,
    created: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    createdBy: creatorId,
    unreadCount: 0,
    // Diplomatic relationship metadata
    relationshipType,
    isInternal,
    participantCivilizations: participantCivs,
    diplomaticStatus: 'active',
    icon: template.icon
  };
  
  gameData.conversations.set(channelId, diplomaticChannel);
  
  // Add participants to socket room
  participants.forEach(playerId => {
    const playerSockets = Array.from(connectedPlayers.entries())
      .filter(([socketId, pid]) => pid === playerId)
      .map(([socketId]) => socketId);
    
    playerSockets.forEach(socketId => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(channelId);
      }
    });
  });
  
  // Send notification about new diplomatic relationship
  io.to(channelId).emit('diplomatic_channel_created', {
    ...diplomaticChannel,
    participantDetails: participants.map(pid => gameData.players.get(pid)).filter(Boolean),
    message: `${template.icon} New ${template.namePrefix.toLowerCase()} established: ${channelName}`
  });
  
  // Create initial diplomatic message
  const welcomeMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const welcomeMessage = {
    id: welcomeMessageId,
    conversationId: channelId,
    senderId: 'system',
    type: 'system',
    content: `${template.icon} **${channelName}** has been established!\n\n📋 Purpose: ${diplomaticChannel.description}\n\n👥 Participants: ${participantCivs.join(', ')}\n\n🤝 This ${isInternal ? 'internal' : 'inter-civilization'} ${relationshipType.replace('_', ' ')} is now active.`,
    timestamp: new Date().toISOString(),
    edited: false,
    reactions: []
  };
  
  gameData.messages.set(welcomeMessageId, welcomeMessage);
  
  res.json({
    success: true,
    diplomaticChannel: {
      ...diplomaticChannel,
      participantDetails: participants.map(pid => gameData.players.get(pid)).filter(Boolean)
    },
    message: `${template.namePrefix} channel created successfully`
  });
});

// Initialize enhanced conversations (for testing/setup)
app.post('/api/communication/initialize-enhanced', (req, res) => {
  console.log('🔄 Initializing enhanced conversation data...');
  
  // Clear existing conversations except user-created ones
  const userCreated = Array.from(gameData.conversations.entries())
    .filter(([id, conv]) => id.startsWith('conv_') && conv.createdBy);
  
  gameData.conversations.clear();
  
  // Re-add user created conversations
  userCreated.forEach(([id, conv]) => {
    gameData.conversations.set(id, conv);
  });
  
  // Add enhanced pre-filled conversations
  const enhancedConversations = [
    // Direct Messages
    {
      id: 'conv_direct_1',
      type: 'direct',
      participants: ['player_1', 'player_2'],
      name: 'Commander Alpha & Admiral Zara',
      description: 'Direct communication with Admiral Zara',
      created: new Date(Date.now() - 86400000).toISOString(),
      lastActivity: new Date(Date.now() - 1800000).toISOString(),
      unreadCount: 2
    },
    {
      id: 'conv_direct_2',
      type: 'direct',
      participants: ['player_1', 'player_4'],
      name: 'Commander Alpha & Marshal Vex',
      description: 'Direct communication with Marshal Vex',
      created: new Date(Date.now() - 172800000).toISOString(),
      lastActivity: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 0
    },
    
    // Government Groups
    {
      id: 'conv_cabinet',
      type: 'group',
      participants: ['player_1', 'player_2', 'player_3', 'player_4'],
      name: 'Imperial Cabinet',
      description: 'High-level government decision making',
      created: new Date(Date.now() - 604800000).toISOString(),
      lastActivity: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 1
    },
    {
      id: 'conv_security_council',
      type: 'group',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Security Council',
      description: 'Military and security coordination',
      created: new Date(Date.now() - 432000000).toISOString(),
      lastActivity: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0
    },
    {
      id: 'conv_science_committee',
      type: 'group',
      participants: ['player_1', 'player_3', 'player_5'],
      name: 'Science & Technology Committee',
      description: 'Research and development coordination',
      created: new Date(Date.now() - 345600000).toISOString(),
      lastActivity: new Date(Date.now() - 10800000).toISOString(),
      unreadCount: 1
    },
    
    // Inter-Galactic Channels
    {
      id: 'conv_galactic_council',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_3', 'player_4', 'player_5'],
      name: 'Galactic Council',
      description: 'Inter-civilization diplomatic forum',
      created: new Date(Date.now() - 1209600000).toISOString(),
      lastActivity: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 0
    },
    {
      id: 'conv_alliance_command',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Alliance Command',
      description: 'Military alliance coordination',
      created: new Date(Date.now() - 864000000).toISOString(),
      lastActivity: new Date(Date.now() - 14400000).toISOString(),
      unreadCount: 3
    },
    {
      id: 'conv_trade_federation',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_3', 'player_5'],
      name: 'Trade Federation',
      description: 'Interstellar commerce and trade agreements',
      created: new Date(Date.now() - 691200000).toISOString(),
      lastActivity: new Date(Date.now() - 21600000).toISOString(),
      unreadCount: 0
    },
    {
      id: 'conv_research_network',
      type: 'channel',
      participants: ['player_1', 'player_3', 'player_5'],
      name: 'Galactic Research Network',
      description: 'Scientific collaboration across civilizations',
      created: new Date(Date.now() - 518400000).toISOString(),
      lastActivity: new Date(Date.now() - 28800000).toISOString(),
      unreadCount: 1
    },
    {
      id: 'conv_emergency_response',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Emergency Response Network',
      description: 'Crisis management and emergency coordination',
      created: new Date(Date.now() - 259200000).toISOString(),
      lastActivity: new Date(Date.now() - 43200000).toISOString(),
      unreadCount: 0
    }
  ];
  
  enhancedConversations.forEach(conv => {
    gameData.conversations.set(conv.id, conv);
  });
  
  console.log(`✅ Enhanced conversations initialized: ${enhancedConversations.length} channels added`);
  
  res.json({
    success: true,
    message: 'Enhanced conversations initialized',
    conversationsAdded: enhancedConversations.length,
    totalConversations: gameData.conversations.size
  });
});

// Send message via REST API
app.post('/api/communication/messages', (req, res) => {
  const { conversationId, senderId, type, content, audioData } = req.body;
  
  if (!conversationId || !senderId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const message = {
    id: messageId,
    conversationId,
    senderId,
    type: type || 'text',
    content,
    timestamp: new Date().toISOString(),
    edited: false,
    reactions: []
  };
  
  // Handle voice messages
  if (type === 'voice' && audioData) {
    message.audioUrl = `/api/communication/audio/${messageId}.wav`;
    message.duration = audioData.duration || 0;
    message.transcription = audioData.transcription || '';
  }
  
  gameData.messages.set(messageId, message);
  
  // Update conversation last activity
  if (gameData.conversations.has(conversationId)) {
    const conv = gameData.conversations.get(conversationId);
    conv.lastActivity = new Date().toISOString();
    gameData.conversations.set(conversationId, conv);
  }
  
  // Broadcast message to conversation participants
  io.to(conversationId).emit('new_message', {
    ...message,
    senderDetails: gameData.players.get(senderId)
  });
  
  res.json({
    success: true,
    message: {
      ...message,
      senderDetails: gameData.players.get(senderId)
    }
  });
});

// Get active voice calls
app.get('/api/communication/voice-calls', (req, res) => {
  const activeCalls = Array.from(gameData.voiceCalls.values())
    .filter(call => call.status === 'active' || call.status === 'ringing')
    .map(call => ({
      ...call,
      participantDetails: call.participants.map(pid => gameData.players.get(pid)).filter(Boolean)
    }));
  
  res.json({
    calls: activeCalls,
    total: activeCalls.length
  });
});

// Text-to-Speech endpoint
app.post('/api/communication/tts', (req, res) => {
  const { text, voice = 'default' } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  // Simulate TTS processing
  setTimeout(() => {
    res.json({
      success: true,
      audioUrl: `/api/communication/audio/tts_${Date.now()}.wav`,
      duration: Math.max(2, text.length * 0.1),
      text,
      voice
    });
  }, 500);
});

// Speech-to-Text endpoint
app.post('/api/communication/stt', (req, res) => {
  const { audioData, language = 'en-US' } = req.body;
  
  if (!audioData) {
    return res.status(400).json({ error: 'Audio data is required' });
  }
  
  // Simulate STT processing
  const mockTranscriptions = [
    "I think we should proceed with the trade negotiations.",
    "The fleet is ready for deployment to the outer rim.",
    "We need to discuss the environmental protection protocols.",
    "Our intelligence suggests increased pirate activity in sector seven.",
    "The diplomatic summit is scheduled for next week."
  ];
  
  setTimeout(() => {
    res.json({
      success: true,
      transcription: mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)],
      confidence: 0.85 + Math.random() * 0.15,
      language,
      duration: 3.5
    });
  }, 1000);
});

// Get communication statistics
app.get('/api/communication/stats', (req, res) => {
  const stats = {
    totalPlayers: gameData.players.size,
    onlinePlayers: Array.from(gameData.players.values()).filter(p => p.status === 'online').length,
    totalConversations: gameData.conversations.size,
    totalMessages: gameData.messages.size,
    activeVoiceCalls: Array.from(gameData.voiceCalls.values()).filter(c => c.status === 'active').length,
    messagesByType: {
      text: Array.from(gameData.messages.values()).filter(m => m.type === 'text').length,
      voice: Array.from(gameData.messages.values()).filter(m => m.type === 'voice').length
    },
    conversationsByType: {
      direct: Array.from(gameData.conversations.values()).filter(c => c.type === 'direct').length,
      group: Array.from(gameData.conversations.values()).filter(c => c.type === 'group').length,
      channel: Array.from(gameData.conversations.values()).filter(c => c.type === 'channel').length
    }
  };
  
  res.json(stats);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/communication/players',
      'GET /api/communication/conversations/:playerId',
      'GET /api/communication/conversations/:conversationId/messages',
      'POST /api/communication/conversations',
      'POST /api/communication/summits',
      'GET /api/communication/summits',
      'POST /api/communication/diplomatic-relationships',
      'POST /api/communication/initialize-enhanced',
      'POST /api/communication/messages',
      'GET /api/communication/voice-calls',
      'POST /api/communication/tts',
      'POST /api/communication/stt',
      'GET /api/communication/stats'
    ]
  });
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(app, 'communication', communicationKnobSystem, applyCommunicationKnobsToGameState);

server.listen(PORT, () => {
  console.log(`💬 Communication API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Players: http://localhost:${PORT}/api/communication/players`);
  console.log(`🎛️ AI Knobs: http://localhost:${PORT}/api/communication/knobs`);
  console.log(`📚 Knob Help: http://localhost:${PORT}/api/communication/knobs/help`);
  console.log(`🔊 Voice & Text: WebSocket enabled`);
  console.log(`🎙️ STT/TTS: http://localhost:${PORT}/api/communication/tts`);
});

