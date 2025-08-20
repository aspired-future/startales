const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

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
    ['conv_1', {
      id: 'conv_1',
      type: 'direct',
      participants: ['player_1', 'player_2'],
      name: 'Commander Alpha & Admiral Zara',
      created: new Date(Date.now() - 86400000).toISOString(),
      lastActivity: new Date(Date.now() - 1800000).toISOString()
    }],
    ['conv_2', {
      id: 'conv_2',
      type: 'group',
      participants: ['player_1', 'player_2', 'player_4'],
      name: 'Alliance Command',
      created: new Date(Date.now() - 172800000).toISOString(),
      lastActivity: new Date(Date.now() - 3600000).toISOString()
    }],
    ['conv_3', {
      id: 'conv_3',
      type: 'channel',
      participants: ['player_1', 'player_2', 'player_3', 'player_4', 'player_5'],
      name: 'Galactic Council',
      created: new Date(Date.now() - 604800000).toISOString(),
      lastActivity: new Date(Date.now() - 7200000).toISOString()
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
  const { type, participants, name, creatorId } = req.body;
  
  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: 'At least 2 participants required' });
  }
  
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const conversation = {
    id: conversationId,
    type: type || 'group',
    participants,
    name: name || `Conversation ${conversationId}`,
    created: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    createdBy: creatorId
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
      'POST /api/communication/messages',
      'GET /api/communication/voice-calls',
      'POST /api/communication/tts',
      'POST /api/communication/stt',
      'GET /api/communication/stats'
    ]
  });
});

server.listen(PORT, () => {
  console.log(`💬 Communication API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Players: http://localhost:${PORT}/api/communication/players`);
  console.log(`🔊 Voice & Text: WebSocket enabled`);
  console.log(`🎙️ STT/TTS: http://localhost:${PORT}/api/communication/tts`);
});

