const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('../../../src/demo/apis/enhanced-knob-system.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 4004;

app.use(cors());
app.use(express.json());

// Enhanced AI Knobs for Policy Advisor System
const policyAdvisorKnobsData = {
  // AI Analysis Parameters
  analysis_depth: 0.7,                  // Depth of policy analysis
  recommendation_confidence: 0.6,       // Confidence threshold for recommendations
  risk_assessment_sensitivity: 0.8,     // Sensitivity to policy risks
  
  // Policy Evaluation Factors
  economic_impact_weight: 0.9,          // Weight of economic considerations
  social_impact_weight: 0.7,            // Weight of social considerations
  environmental_impact_weight: 0.6,     // Weight of environmental considerations
  political_feasibility_weight: 0.8,    // Weight of political feasibility
  
  // Recommendation Generation
  innovation_bias: 0.5,                 // Bias toward innovative solutions
  conservative_safety_margin: 0.4,      // Conservative approach to safety
  stakeholder_consideration: 0.8,       // Consideration of stakeholder interests
  
  // Communication Style
  technical_detail_level: 0.6,          // Level of technical detail in advice
  urgency_sensitivity: 0.7,             // Sensitivity to urgent policy needs
  historical_precedent_weight: 0.5,     // Weight given to historical precedents
  
  // Advisory Process
  consultation_thoroughness: 0.8,       // Thoroughness of consultation process
  alternative_exploration: 0.7,         // Exploration of alternative approaches
  implementation_focus: 0.6,            // Focus on implementation practicality
  
  // Quality Control
  fact_checking_rigor: 0.9,             // Rigor of fact-checking process
  bias_detection_sensitivity: 0.8,      // Sensitivity to detecting biases
  peer_review_weight: 0.6,              // Weight of peer review in recommendations
  
  lastUpdated: Date.now()
};

// Initialize Enhanced Knob System
const policyAdvisorKnobSystem = new EnhancedKnobSystem(policyAdvisorKnobsData);

// Apply knobs to game state
function applyPolicyAdvisorKnobsToGameState() {
  const knobs = policyAdvisorKnobSystem.knobs;
  
  // Apply analysis parameters to AI generation
  const analysisConfig = {
    depth: knobs.analysis_depth,
    confidence: knobs.recommendation_confidence,
    riskSensitivity: knobs.risk_assessment_sensitivity
  };
  
  // Apply impact weights to policy evaluation
  const impactWeights = {
    economic: knobs.economic_impact_weight,
    social: knobs.social_impact_weight,
    environmental: knobs.environmental_impact_weight,
    political: knobs.political_feasibility_weight
  };
  
  // Apply recommendation parameters
  const recommendationConfig = {
    innovation: knobs.innovation_bias,
    safety: knobs.conservative_safety_margin,
    stakeholders: knobs.stakeholder_consideration
  };
  
  // Apply communication style
  const communicationStyle = {
    technical: knobs.technical_detail_level,
    urgency: knobs.urgency_sensitivity,
    historical: knobs.historical_precedent_weight
  };
  
  // Apply process parameters
  const processConfig = {
    consultation: knobs.consultation_thoroughness,
    alternatives: knobs.alternative_exploration,
    implementation: knobs.implementation_focus
  };
  
  // Apply quality control
  const qualityControl = {
    factCheck: knobs.fact_checking_rigor,
    biasDetection: knobs.bias_detection_sensitivity,
    peerReview: knobs.peer_review_weight
  };
  
  console.log('Applied policy advisor knobs to game state:', {
    analysisConfig,
    impactWeights,
    recommendationConfig,
    communicationStyle,
    processConfig,
    qualityControl
  });
}

// Mock AI generation function
const mockAIGenerate = async (prompt) => {
  console.log(`Mock AI generating for prompt: ${prompt.substring(0, 100)}...`);
  
  if (prompt.includes("economic advisor")) {
    return "Based on current galactic trade patterns, I recommend implementing a progressive taxation system on interstellar commerce. This would generate approximately 15% more revenue while encouraging local production. The outer colonies are particularly vulnerable to economic fluctuations, so we should establish emergency trade reserves.";
  } else if (prompt.includes("military advisor")) {
    return "Our current defense posture is adequate but not optimal. I suggest increasing patrol frequency in the Kepler system by 20% and establishing a rapid response fleet near the Vega border. Intelligence reports suggest unusual activity in the neutral zone that warrants investigation.";
  } else if (prompt.includes("science advisor")) {
    return "The new quantum research facility on Europa is showing promising results. I recommend increasing funding by 30% to accelerate development of faster-than-light communication technology. This could revolutionize our diplomatic and military coordination across star systems.";
  } else if (prompt.includes("diplomatic advisor")) {
    return "Relations with the Centauri Republic remain tense following last month's trade dispute. I suggest hosting a cultural exchange program to improve public opinion. Additionally, we should consider offering technological assistance to the smaller colonies to strengthen our alliance network.";
  } else if (prompt.includes("environmental advisor")) {
    return "Terraforming progress on Mars is ahead of schedule, but we're seeing concerning atmospheric instability on Titan. I recommend deploying additional climate stabilizers and reducing industrial activity by 15% until the ecosystem reaches equilibrium.";
  } else if (prompt.includes("cabinet meeting")) {
    return "Thank you for calling this cabinet meeting. Based on our recent discussions, I believe we need to address three critical issues: the energy crisis in the outer colonies, the diplomatic tensions with neighboring systems, and the upcoming budget allocation for next quarter. Each department should prepare their recommendations.";
  } else if (prompt.includes("policy suggestion")) {
    return "I propose the 'Galactic Prosperity Initiative' - a comprehensive policy package that includes: 1) Reduced tariffs on essential goods between allied systems, 2) Increased investment in education and infrastructure, 3) Establishment of a joint defense fund, and 4) Creation of an interstellar emergency response network.";
  }
  
  return "I understand your concern. Let me analyze the current situation and provide you with a comprehensive recommendation based on the latest data and galactic best practices.";
};

// Default Policy Advisors
let policyAdvisors = [
  {
    id: "advisor_economic",
    name: "Dr. Elena Vasquez",
    title: "Chief Economic Advisor",
    specialization: "Galactic Economics & Trade",
    avatar: "💼",
    status: "available",
    expertise: ["Trade Policy", "Taxation", "Economic Development", "Resource Management"],
    background: "Former Director of Interstellar Commerce, 15 years experience in galactic economic policy",
    personality: "Analytical, data-driven, pragmatic"
  },
  {
    id: "advisor_military",
    name: "General Marcus Stone",
    title: "Defense Secretary",
    specialization: "Military Strategy & Security",
    avatar: "⚔️",
    status: "available",
    expertise: ["Defense Strategy", "Military Operations", "Intelligence", "Border Security"],
    background: "Veteran of the Outer Rim Conflicts, expert in multi-system defense coordination",
    personality: "Strategic, decisive, protective"
  },
  {
    id: "advisor_science",
    name: "Dr. Aria Chen",
    title: "Chief Science Advisor",
    specialization: "Technology & Research",
    avatar: "🔬",
    status: "available",
    expertise: ["Research & Development", "Technology Policy", "Innovation", "Scientific Ethics"],
    background: "Leading researcher in quantum physics and interstellar technology",
    personality: "Innovative, curious, methodical"
  },
  {
    id: "advisor_diplomatic",
    name: "Ambassador Zara Al-Rashid",
    title: "Foreign Affairs Advisor",
    specialization: "Diplomacy & International Relations",
    avatar: "🌐",
    status: "available",
    expertise: ["Diplomatic Relations", "Treaty Negotiation", "Cultural Affairs", "Conflict Resolution"],
    background: "Former ambassador to 12 star systems, expert in interstellar diplomacy",
    personality: "Diplomatic, empathetic, persuasive"
  },
  {
    id: "advisor_environmental",
    name: "Dr. Kai Nakamura",
    title: "Environmental Policy Advisor",
    specialization: "Planetary Sciences & Terraforming",
    avatar: "🌱",
    status: "available",
    expertise: ["Environmental Policy", "Terraforming", "Climate Management", "Sustainability"],
    background: "Pioneer in sustainable terraforming techniques across multiple worlds",
    personality: "Thoughtful, long-term focused, environmentally conscious"
  },
  {
    id: "advisor_health",
    name: "Dr. Sarah Kim",
    title: "Public Health Advisor",
    specialization: "Galactic Health & Medicine",
    avatar: "🏥",
    status: "available",
    expertise: ["Public Health", "Medical Policy", "Pandemic Response", "Healthcare Systems"],
    background: "Former head of the Galactic Health Organization, expert in multi-species medicine",
    personality: "Caring, systematic, evidence-based"
  },
  {
    id: "advisor_education",
    name: "Professor David Wright",
    title: "Education Policy Advisor",
    specialization: "Education & Cultural Development",
    avatar: "📚",
    status: "available",
    expertise: ["Education Policy", "Cultural Programs", "Youth Development", "Knowledge Systems"],
    background: "Former chancellor of the Galactic University System",
    personality: "Inspiring, patient, knowledge-focused"
  }
];

// Default Cabinet Positions
let cabinetPositions = [
  {
    id: "cabinet_defense",
    title: "Secretary of Defense",
    advisorId: "advisor_military",
    isCore: true,
    responsibilities: ["Military Operations", "National Security", "Defense Budget"]
  },
  {
    id: "cabinet_treasury",
    title: "Secretary of Treasury",
    advisorId: "advisor_economic",
    isCore: true,
    responsibilities: ["Economic Policy", "Budget Management", "Trade Relations"]
  },
  {
    id: "cabinet_foreign",
    title: "Secretary of Foreign Affairs",
    advisorId: "advisor_diplomatic",
    isCore: true,
    responsibilities: ["Diplomatic Relations", "Treaty Negotiations", "International Policy"]
  },
  {
    id: "cabinet_science",
    title: "Secretary of Science & Technology",
    advisorId: "advisor_science",
    isCore: false,
    responsibilities: ["Research Policy", "Technology Development", "Innovation Programs"]
  },
  {
    id: "cabinet_environment",
    title: "Secretary of Environmental Affairs",
    advisorId: "advisor_environmental",
    isCore: false,
    responsibilities: ["Environmental Policy", "Terraforming Projects", "Sustainability"]
  },
  {
    id: "cabinet_health",
    title: "Secretary of Health",
    advisorId: "advisor_health",
    isCore: false,
    responsibilities: ["Public Health", "Medical Policy", "Healthcare Systems"]
  }
];

// Active conversations and meetings
let activeConversations = new Map();
let activeMeetings = new Map();

// Helper functions
const findAdvisor = (id) => policyAdvisors.find(advisor => advisor.id === id);
const findCabinetPosition = (id) => cabinetPositions.find(pos => pos.id === id);

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'policy-advisor-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all policy advisors
app.get('/api/policy/advisors', (req, res) => {
  res.json({ advisors: policyAdvisors });
});

// Get specific advisor
app.get('/api/policy/advisors/:id', (req, res) => {
  const advisor = findAdvisor(req.params.id);
  if (advisor) {
    res.json(advisor);
  } else {
    res.status(404).json({ error: "Advisor not found" });
  }
});

// Start conversation with advisor
app.post('/api/policy/advisors/:id/conversation', async (req, res) => {
  const { id } = req.params;
  const { playerId, initialMessage } = req.body;
  
  const advisor = findAdvisor(id);
  if (!advisor) {
    return res.status(404).json({ error: "Advisor not found" });
  }

  const conversationId = `conv_${id}_${Date.now()}`;
  const conversation = {
    id: conversationId,
    advisorId: id,
    playerId,
    startTime: new Date().toISOString(),
    messages: []
  };

  if (initialMessage) {
    // Add player's initial message
    conversation.messages.push({
      id: `msg_${Date.now()}`,
      senderId: playerId,
      senderType: 'player',
      content: initialMessage,
      timestamp: new Date().toISOString()
    });

    // Generate advisor response
    const prompt = `You are ${advisor.name}, ${advisor.title}. Your specialization is ${advisor.specialization}. Your personality is ${advisor.personality}. The player said: "${initialMessage}". Respond as this advisor would, providing expert advice in your field.`;
    const response = await mockAIGenerate(prompt);
    
    conversation.messages.push({
      id: `msg_${Date.now() + 1}`,
      senderId: id,
      senderType: 'advisor',
      content: response,
      timestamp: new Date().toISOString()
    });
  }

  activeConversations.set(conversationId, conversation);
  advisor.status = 'in_conversation';

  res.json({ conversation });
});

// Send message in advisor conversation
app.post('/api/policy/conversations/:convId/message', async (req, res) => {
  const { convId } = req.params;
  const { senderId, content, isVoice, transcription } = req.body;

  const conversation = activeConversations.get(convId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // Add player message
  const playerMessage = {
    id: `msg_${Date.now()}`,
    senderId,
    senderType: 'player',
    content,
    isVoice,
    transcription,
    timestamp: new Date().toISOString()
  };
  conversation.messages.push(playerMessage);

  // Generate advisor response
  const advisor = findAdvisor(conversation.advisorId);
  const prompt = `You are ${advisor.name}, ${advisor.title}. Continue the conversation. The player just said: "${content}". Respond as this advisor would, providing expert advice.`;
  const response = await mockAIGenerate(prompt);

  const advisorMessage = {
    id: `msg_${Date.now() + 1}`,
    senderId: conversation.advisorId,
    senderType: 'advisor',
    content: response,
    timestamp: new Date().toISOString()
  };
  conversation.messages.push(advisorMessage);

  // Emit to socket room
  io.to(convId).emit('newMessage', advisorMessage);

  res.json({ message: advisorMessage });
});

// Get cabinet configuration
app.get('/api/policy/cabinet', (req, res) => {
  const cabinet = cabinetPositions.map(pos => ({
    ...pos,
    advisor: findAdvisor(pos.advisorId)
  }));
  res.json({ cabinet });
});

// Update cabinet configuration
app.post('/api/policy/cabinet', (req, res) => {
  const { positions } = req.body;
  
  // Validate positions
  const validPositions = positions.filter(pos => 
    pos.title && pos.advisorId && findAdvisor(pos.advisorId)
  );

  cabinetPositions = validPositions.map((pos, index) => ({
    id: pos.id || `cabinet_${index}`,
    title: pos.title,
    advisorId: pos.advisorId,
    isCore: pos.isCore || false,
    responsibilities: pos.responsibilities || []
  }));

  res.json({ message: "Cabinet updated successfully", cabinet: cabinetPositions });
});

// Start cabinet meeting
app.post('/api/policy/cabinet/meeting', async (req, res) => {
  const { playerId, topic, agenda } = req.body;

  const meetingId = `meeting_${Date.now()}`;
  const meeting = {
    id: meetingId,
    type: 'cabinet',
    playerId,
    topic: topic || "Cabinet Meeting",
    agenda: agenda || [],
    startTime: new Date().toISOString(),
    participants: cabinetPositions.map(pos => pos.advisorId),
    messages: [],
    status: 'active'
  };

  // Add opening message from leader
  meeting.messages.push({
    id: `msg_${Date.now()}`,
    senderId: playerId,
    senderType: 'leader',
    content: `Good day, everyone. I've called this cabinet meeting to discuss: ${topic}. Let's begin with our agenda items.`,
    timestamp: new Date().toISOString()
  });

  // Generate initial responses from cabinet members
  for (let i = 0; i < Math.min(3, cabinetPositions.length); i++) {
    const position = cabinetPositions[i];
    const advisor = findAdvisor(position.advisorId);
    
    const prompt = `You are ${advisor.name}, ${advisor.title} in a cabinet meeting. The topic is "${topic}". Provide a brief opening statement relevant to your role.`;
    const response = await mockAIGenerate(prompt);
    
    meeting.messages.push({
      id: `msg_${Date.now() + i + 1}`,
      senderId: position.advisorId,
      senderType: 'advisor',
      content: response,
      timestamp: new Date().toISOString()
    });
  }

  activeMeetings.set(meetingId, meeting);
  res.json({ meeting });
});

// Send message in cabinet meeting
app.post('/api/policy/meetings/:meetingId/message', async (req, res) => {
  const { meetingId } = req.params;
  const { senderId, content, isVoice, transcription } = req.body;

  const meeting = activeMeetings.get(meetingId);
  if (!meeting) {
    return res.status(404).json({ error: "Meeting not found" });
  }

  // Add message
  const message = {
    id: `msg_${Date.now()}`,
    senderId,
    senderType: senderId === meeting.playerId ? 'leader' : 'advisor',
    content,
    isVoice,
    transcription,
    timestamp: new Date().toISOString()
  };
  meeting.messages.push(message);

  // Generate response from a random cabinet member
  const randomPosition = cabinetPositions[Math.floor(Math.random() * cabinetPositions.length)];
  const advisor = findAdvisor(randomPosition.advisorId);
  
  const prompt = `You are ${advisor.name}, ${advisor.title} in a cabinet meeting. Someone just said: "${content}". Respond appropriately to continue the discussion.`;
  const response = await mockAIGenerate(prompt);

  const advisorMessage = {
    id: `msg_${Date.now() + 1}`,
    senderId: randomPosition.advisorId,
    senderType: 'advisor',
    content: response,
    timestamp: new Date().toISOString()
  };
  meeting.messages.push(advisorMessage);

  // Emit to socket room
  io.to(meetingId).emit('newMessage', advisorMessage);

  res.json({ message: advisorMessage });
});

// Mock STT/TTS endpoints
app.post('/api/policy/stt', (req, res) => {
  const { audioBase64 } = req.body;
  const mockTranscription = "This is a mock transcription of your voice message to the policy advisor.";
  res.json({ transcription: mockTranscription });
});

app.post('/api/policy/tts', (req, res) => {
  const { text } = req.body;
  const mockAudioBase64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
  res.json({ audioBase64: mockAudioBase64 });
});

// Socket.IO connections
io.on('connection', (socket) => {
  console.log('Policy advisor client connected:', socket.id);

  socket.on('joinConversation', (convId) => {
    socket.join(convId);
    console.log(`Socket ${socket.id} joined conversation ${convId}`);
  });

  socket.on('joinMeeting', (meetingId) => {
    socket.join(meetingId);
    console.log(`Socket ${socket.id} joined meeting ${meetingId}`);
  });

  socket.on('leaveConversation', (convId) => {
    socket.leave(convId);
  });

  socket.on('leaveMeeting', (meetingId) => {
    socket.leave(meetingId);
  });

  socket.on('disconnect', () => {
    console.log('Policy advisor client disconnected:', socket.id);
  });
});

// Enhanced Knob System Endpoints
createEnhancedKnobEndpoints(app, 'policy-advisor', policyAdvisorKnobSystem, applyPolicyAdvisorKnobsToGameState);

server.listen(PORT, () => {
  console.log(`Policy Advisor API listening on port ${PORT}`);
  console.log(`🎛️ AI Knobs: http://localhost:${PORT}/api/policy-advisor/knobs`);
  console.log(`📚 Knob Help: http://localhost:${PORT}/api/policy-advisor/knobs/help`);
});

