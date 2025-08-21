// Communication Hub API endpoints
const {
  communicationGameState,
  getSystemStatus,
  getContacts,
  getContactMessages,
  sendMessage,
  getChannels,
  joinChannel,
  getSettings,
  updateSettings,
  getCommunicationLogs,
  getStatistics,
  simulateIncomingMessage
} = require('../game-state/communication-state.cjs');
const { EnhancedKnobSystem, createEnhancedKnobEndpoints } = require('./enhanced-knob-system.cjs');

// AI Integration Knobs - Enhanced system supporting multiple input formats
const communicationKnobsData = {
  // Message Processing
  message_priority_intelligence: 0.7,    // AI can intelligently prioritize messages (0.0-1.0)
  auto_translation_quality: 0.8,         // AI can improve translation accuracy (0.0-1.0)
  sentiment_analysis_depth: 0.6,         // AI can analyze message sentiment (0.0-1.0)
  context_awareness: 0.7,                // AI can understand conversation context (0.0-1.0)
  
  // Diplomatic Communications
  diplomatic_protocol_strictness: 0.6,   // AI can enforce diplomatic protocols (0.0-1.0)
  negotiation_assistance: 0.5,           // AI can assist in negotiations (0.0-1.0)
  cultural_sensitivity: 0.8,             // AI can adapt to cultural differences (0.0-1.0)
  conflict_de_escalation: 0.7,           // AI can help de-escalate tensions (0.0-1.0)
  
  // Security & Privacy
  encryption_strength: 0.9,              // AI can adjust encryption levels (0.0-1.0)
  surveillance_detection: 0.7,           // AI can detect surveillance attempts (0.0-1.0)
  information_leak_prevention: 0.8,      // AI can prevent sensitive info leaks (0.0-1.0)
  authentication_strictness: 0.6,        // AI can adjust identity verification (0.0-1.0)
  
  // Communication Efficiency
  message_routing_optimization: 0.7,     // AI can optimize message delivery (0.0-1.0)
  response_time_prioritization: 0.6,     // AI can prioritize urgent messages (0.0-1.0)
  channel_management_automation: 0.5,    // AI can auto-manage channels (0.0-1.0)
  spam_filtering_aggressiveness: 0.7,    // AI can filter unwanted messages (0.0-1.0)
  
  // Character Interaction
  character_proactivity: 0.6,            // AI can make characters more proactive (0.0-1.0)
  relationship_tracking: 0.8,            // AI can track relationship dynamics (0.0-1.0)
  conversation_continuity: 0.7,          // AI can maintain conversation flow (0.0-1.0)
  
  lastUpdated: Date.now()
};

// Create enhanced knob system
const communicationKnobSystem = new EnhancedKnobSystem(communicationKnobsData);

// Backward compatibility - expose knobs directly
const communicationKnobs = communicationKnobSystem.knobs;

// Structured Outputs - For AI consumption, HUD display, and game state
function generateCommunicationStructuredOutputs() {
  const contacts = getContacts();
  const channels = getChannels();
  const stats = getStatistics();
  
  return {
    // High-level metrics for AI decision-making
    communication_metrics: {
      total_contacts: contacts.length,
      active_channels: channels.filter(c => c.status === 'active').length,
      message_volume: stats.totalMessages || 0,
      response_rate: calculateResponseRate(),
      diplomatic_health: calculateDiplomaticHealth(),
      communication_efficiency: calculateCommunicationEfficiency(),
      security_status: calculateSecurityStatus()
    },
    
    // Communication analysis for AI strategic planning
    communication_analysis: {
      contact_relationship_status: analyzeContactRelationships(),
      channel_activity_patterns: analyzeChannelActivity(),
      message_sentiment_trends: analyzeMessageSentiment(),
      diplomatic_engagement_levels: analyzeDiplomaticEngagement(),
      cross_civilization_communications: analyzeCrossCivCommunications()
    },
    
    // Communication effectiveness for AI feedback
    effectiveness_assessment: {
      diplomatic_success_rate: assessDiplomaticSuccess(),
      negotiation_outcomes: assessNegotiationOutcomes(),
      conflict_resolution_effectiveness: assessConflictResolution(),
      information_security_incidents: assessSecurityIncidents(),
      communication_protocol_compliance: assessProtocolCompliance()
    },
    
    // Communication alerts and recommendations for AI attention
    ai_alerts: generateCommunicationAIAlerts(),
    
    // Structured data for other systems
    cross_system_data: {
      diplomatic_relations_status: calculateDiplomaticRelationsStatus(),
      intelligence_gathering_opportunities: identifyIntelligenceOpportunities(),
      alliance_coordination_effectiveness: calculateAllianceCoordination(),
      trade_negotiation_progress: calculateTradeNegotiationProgress(),
      crisis_communication_readiness: calculateCrisisCommunicationReadiness()
    },
    
    timestamp: Date.now(),
    knobs_applied: { ...communicationKnobs }
  };
}

function setupCommunicationAPIs(app) {
  // Get communication system status
  app.get('/api/communication/status', (req, res) => {
    try {
      const status = getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get communication status', details: error.message });
    }
  });

  // Get all contacts
  app.get('/api/communication/contacts', (req, res) => {
    try {
      const contacts = getContacts();
      res.json({ contacts });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get contacts', details: error.message });
    }
  });

  // Get messages for a specific contact
  app.get('/api/communication/contacts/:contactId/messages', (req, res) => {
    try {
      const { contactId } = req.params;
      const result = getContactMessages(contactId);
      
      if (result.error) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get contact messages', details: error.message });
    }
  });

  // Send a message to a contact
  app.post('/api/communication/contacts/:contactId/messages', (req, res) => {
    try {
      const { contactId } = req.params;
      const { content, isVoice = false } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
      }
      
      const result = sendMessage(contactId, content, isVoice);
      
      if (result.error) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
  });

  // Simulate incoming message from a contact
  app.post('/api/communication/contacts/:contactId/simulate', (req, res) => {
    try {
      const { contactId } = req.params;
      const result = simulateIncomingMessage(contactId);
      
      if (result.error) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to simulate message', details: error.message });
    }
  });

  // Get all communication channels
  app.get('/api/communication/channels', (req, res) => {
    try {
      const channels = getChannels();
      res.json({ channels });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get channels', details: error.message });
    }
  });

  // Join a communication channel
  app.post('/api/communication/channels/:channelId/join', (req, res) => {
    try {
      const { channelId } = req.params;
      const { userId = 'anonymous' } = req.body;
      
      const result = joinChannel(channelId, userId);
      
      if (result.error) {
        return res.status(404).json(result);
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to join channel', details: error.message });
    }
  });

  // Get communication settings
  app.get('/api/communication/settings', (req, res) => {
    try {
      const settings = getSettings();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get settings', details: error.message });
    }
  });

  // Update communication settings
  app.put('/api/communication/settings', (req, res) => {
    try {
      const newSettings = req.body;
      const result = updateSettings(newSettings);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings', details: error.message });
    }
  });

  // Get communication logs
  app.get('/api/communication/logs', (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const logs = getCommunicationLogs(parseInt(limit));
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get communication logs', details: error.message });
    }
  });

  // Get communication statistics
  app.get('/api/communication/statistics', (req, res) => {
    try {
      const statistics = getStatistics();
      res.json({ statistics });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get statistics', details: error.message });
    }
  });

  // Voice communication endpoints
  app.post('/api/communication/voice/start', (req, res) => {
    try {
      const { contactId, quality = 'high' } = req.body;
      
      if (!contactId) {
        return res.status(400).json({ error: 'Contact ID is required' });
      }
      
      // Simulate voice call start
      communicationGameState.voiceCallsActive++;
      
      res.json({
        success: true,
        callId: `call_${Date.now()}`,
        contactId,
        quality,
        encryption: 'quantum',
        status: 'connecting'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start voice call', details: error.message });
    }
  });

  app.post('/api/communication/voice/end', (req, res) => {
    try {
      const { callId } = req.body;
      
      if (!callId) {
        return res.status(400).json({ error: 'Call ID is required' });
      }
      
      // Simulate voice call end
      communicationGameState.voiceCallsActive = Math.max(0, communicationGameState.voiceCallsActive - 1);
      
      res.json({
        success: true,
        callId,
        duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
        status: 'ended'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to end voice call', details: error.message });
    }
  });

  // Translation endpoints
  app.post('/api/communication/translate', (req, res) => {
    try {
      const { text, fromLanguage, toLanguage } = req.body;
      
      if (!text || !fromLanguage || !toLanguage) {
        return res.status(400).json({ error: 'Text, fromLanguage, and toLanguage are required' });
      }
      
      // Simulate translation (in a real system, this would call a translation service)
      const translations = {
        'en-zh': '这是一个翻译的消息',
        'en-es': 'Este es un mensaje traducido',
        'en-ar': 'هذه رسالة مترجمة',
        'en-vg': 'Τηις ις α τραηsλατεδ μεssαγε',
        'zh-en': 'This is a translated message',
        'es-en': 'This is a translated message',
        'ar-en': 'This is a translated message',
        'vg-en': 'This is a translated message'
      };
      
      const translationKey = `${fromLanguage}-${toLanguage}`;
      const translatedText = translations[translationKey] || `[Translated from ${fromLanguage} to ${toLanguage}]: ${text}`;
      
      res.json({
        success: true,
        originalText: text,
        translatedText,
        fromLanguage,
        toLanguage,
        confidence: 0.95
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to translate message', details: error.message });
    }
  });

  // Emergency broadcast endpoint
  app.post('/api/communication/emergency/broadcast', (req, res) => {
    try {
      const { message, priority = 'high', channels = ['all'] } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Emergency message is required' });
      }
      
      // Simulate emergency broadcast
      const broadcastId = `emergency_${Date.now()}`;
      
      // Activate emergency channel
      const emergencyChannel = communicationGameState.channels.find(c => c.id === 'emergency');
      if (emergencyChannel) {
        emergencyChannel.isActive = true;
        emergencyChannel.participants = communicationGameState.connectedUsers;
      }
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Emergency broadcast sent: ${message.substring(0, 50)}...`,
        type: 'emergency'
      });
      
      communicationGameState.statistics.emergencyBroadcasts++;
      
      res.json({
        success: true,
        broadcastId,
        message,
        priority,
        channels,
        recipients: communicationGameState.connectedUsers,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send emergency broadcast', details: error.message });
    }
  });

  // Get contacts by category
  app.get('/api/communication/contacts/category/:category', (req, res) => {
    try {
      const { category } = req.params;
      const contacts = communicationGameState.contacts.filter(c => c.category === category);
      
      const contactList = contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        avatar: contact.avatar,
        status: contact.status,
        location: contact.location,
        category: contact.category,
        canFire: contact.canFire,
        canPostToWitter: contact.canPostToWitter,
        backstory: contact.backstory,
        personality: contact.personality,
        specialties: contact.specialties,
        lastSeen: contact.lastSeen,
        messageCount: contact.messages.length
      }));
      
      res.json({ contacts: contactList, category, count: contactList.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get contacts by category', details: error.message });
    }
  });

  // Fire/Remove a character (for positions that can be fired)
  app.post('/api/communication/contacts/:contactId/fire', (req, res) => {
    try {
      const { contactId } = req.params;
      const { reason = 'Performance issues' } = req.body;
      
      const contactIndex = communicationGameState.contacts.findIndex(c => c.id === contactId);
      if (contactIndex === -1) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      const contact = communicationGameState.contacts[contactIndex];
      
      if (!contact.canFire) {
        return res.status(400).json({ error: 'This position cannot be fired (elected/appointed by others)' });
      }
      
      // Remove the contact
      const firedContact = communicationGameState.contacts.splice(contactIndex, 1)[0];
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `${firedContact.name} (${firedContact.title}) was dismissed. Reason: ${reason}`,
        type: 'personnel'
      });
      
      res.json({
        success: true,
        firedContact: {
          name: firedContact.name,
          title: firedContact.title,
          reason: reason
        },
        message: `${firedContact.name} has been dismissed from their position.`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fire contact', details: error.message });
    }
  });

  // Hire/Add a new character for a position
  app.post('/api/communication/contacts/hire', (req, res) => {
    try {
      const { position, name, backstory, personality, specialties, category } = req.body;
      
      if (!position || !name || !category) {
        return res.status(400).json({ error: 'Position, name, and category are required' });
      }
      
      // Generate new contact
      const newContact = {
        id: `hired_${Date.now()}`,
        name: name,
        title: position,
        avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        status: 'online',
        location: 'Government Complex',
        clearanceLevel: category === 'cabinet' ? 'top-secret' : 'classified',
        category: category,
        canFire: true,
        canPostToWitter: ['cabinet', 'legislative', 'industry', 'regional', 'citizen'].includes(category),
        backstory: backstory || `Newly appointed ${position} with extensive experience in their field.`,
        personality: personality || 'Professional, dedicated, eager to serve',
        specialties: specialties || ['Leadership', 'Strategic Planning', 'Policy Implementation'],
        lastSeen: new Date().toISOString(),
        messages: [
          {
            id: 1,
            type: 'received',
            content: `Mr. President, thank you for the opportunity to serve as ${position}. I look forward to working with your administration.`,
            timestamp: new Date().toISOString(),
            isVoice: false,
            translated: false
          }
        ]
      };
      
      // Add to contacts
      communicationGameState.contacts.push(newContact);
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `${name} was appointed as ${position}`,
        type: 'personnel'
      });
      
      res.json({
        success: true,
        newContact: newContact,
        message: `${name} has been successfully appointed as ${position}.`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to hire contact', details: error.message });
    }
  });

  // Get character details including full backstory
  app.get('/api/communication/contacts/:contactId/profile', (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = communicationGameState.contacts.find(c => c.id === contactId);
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      res.json({
        contact: {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status,
          location: contact.location,
          clearanceLevel: contact.clearanceLevel,
          category: contact.category,
          canFire: contact.canFire,
          canPostToWitter: contact.canPostToWitter,
          backstory: contact.backstory,
          personality: contact.personality,
          specialties: contact.specialties,
          lastSeen: contact.lastSeen,
          messageCount: contact.messages.length,
          recentMessages: contact.messages.slice(-3)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get contact profile', details: error.message });
    }
  });

  // Generate a Witter post for a character
  app.post('/api/communication/contacts/:contactId/witter-post', (req, res) => {
    try {
      const { contactId } = req.params;
      const { topic, tone = 'professional' } = req.body;
      
      const contact = communicationGameState.contacts.find(c => c.id === contactId);
      
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      if (!contact.canPostToWitter) {
        return res.status(400).json({ error: 'This character is not authorized to post on Witter' });
      }
      
      // Generate contextual post based on character
      const posts = {
        'sec-state': [
          'Productive meetings with the Centauri Alliance today. Diplomacy is the foundation of galactic peace. 🌌 #GalacticDiplomacy',
          'Cultural exchange programs are building bridges across star systems. Unity through diversity. #InterstellarUnity',
          'Trade negotiations require patience, but the results benefit all civilizations. #DiplomaticSuccess'
        ],
        'senate-majority': [
          'The Infrastructure Bill will transform our colonies. Proud to support this bipartisan effort. #ColonialDevelopment',
          'Working across the aisle to ensure every citizen has access to quantum education. #EducationForAll',
          'Mars terraforming project ahead of schedule! Colonial ingenuity at its finest. #MarsProgress'
        ],
        'house-speaker': [
          'The Technology Advancement Act will accelerate our quantum research. Innovation drives progress! #TechPolicy',
          'Digital rights are fundamental rights. Protecting citizens in the quantum age. #DigitalRights',
          'Excited to see young entrepreneurs leading the next wave of galactic innovation. #FutureLeaders'
        ],
        'tech-ceo': [
          'Our new quantum processors will revolutionize computing. The future is quantum! #QuantumComputing',
          'AI and human collaboration is the key to solving galactic challenges. #AIInnovation',
          'Proud to partner with the government on next-generation defense systems. #TechForGood'
        ],
        'mining-ceo': [
          'New rare earth deposits in Vega system will boost manufacturing. Space mining is the future! #SpaceMining',
          'Safety first in all our operations. Our miners are the backbone of galactic industry. #MinerSafety',
          'Asteroid belt operations running at 150% capacity. Meeting galactic demand! #ResourceExtraction'
        ],
        'mars-governor': [
          'Mars atmospheric processors exceeding all expectations! Terraforming success story. #MarsLife',
          'Proud of our Martian colonists. Building a sustainable future on the Red Planet. #ColonialPride',
          'New agricultural domes producing record harvests. Mars feeding the galaxy! #MarsAgriculture'
        ],
        'europa-mayor': [
          'Underwater cities of Europa showcase human adaptability. Living with the ocean! #EuropaLife',
          'Our aquaculture program is feeding colonies across the system. #SustainableFarming',
          'Europa: Where innovation meets environmental harmony. #GreenTech'
        ],
        'citizen-1': [
          'Hope the President considers more STEM funding. Our kids deserve the best education! #EducationMatters',
          'Working on quantum processors at the lab. Exciting times in tech! #QuantumEngineering',
          'Balancing work and family in the quantum age. We need better support systems. #WorkingParents'
        ],
        'citizen-2': [
          'Pirates getting bolder in the Outer Rim. Need more patrol ships out here! #SpaceSafety',
          'Delivering supplies to frontier colonies. These folks are the real heroes. #FrontierLife',
          'Trade routes need better protection. Independent pilots deserve safe passage. #TradeRoutes'
        ]
      };
      
      const characterPosts = posts[contactId] || [
        `Honored to serve in the ${contact.title} role. Working hard for all citizens. #PublicService`,
        `Every day brings new challenges and opportunities. Committed to excellence. #Leadership`,
        `Grateful for the trust placed in me. Will continue to serve with integrity. #ServiceFirst`
      ];
      
      const selectedPost = characterPosts[Math.floor(Math.random() * characterPosts.length)];
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `${contact.name} posted to Witter: "${selectedPost.substring(0, 50)}..."`,
        type: 'social'
      });
      
      res.json({
        success: true,
        post: {
          author: contact.name,
          title: contact.title,
          content: selectedPost,
          timestamp: new Date().toISOString(),
          topic: topic || 'general',
          tone: tone
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate Witter post', details: error.message });
    }
  });

  // Get all available positions that can be filled
  app.get('/api/communication/positions/available', (req, res) => {
    try {
      const availablePositions = [
        // Cabinet positions
        { id: 'sec-agriculture', title: 'Secretary of Agriculture', category: 'cabinet', canFire: true },
        { id: 'sec-energy', title: 'Secretary of Energy', category: 'cabinet', canFire: true },
        { id: 'sec-education', title: 'Secretary of Education', category: 'cabinet', canFire: true },
        { id: 'sec-health', title: 'Secretary of Health', category: 'cabinet', canFire: true },
        { id: 'sec-transportation', title: 'Secretary of Transportation', category: 'cabinet', canFire: true },
        { id: 'sec-veterans', title: 'Secretary of Veterans Affairs', category: 'cabinet', canFire: true },
        
        // Intelligence positions
        { id: 'fbi-director', title: 'FBI Director', category: 'intelligence', canFire: true },
        { id: 'dia-director', title: 'DIA Director', category: 'intelligence', canFire: true },
        
        // Military positions
        { id: 'army-chief', title: 'Army Chief of Staff', category: 'military', canFire: true },
        { id: 'navy-chief', title: 'Chief of Naval Operations', category: 'military', canFire: true },
        { id: 'air-force-chief', title: 'Air Force Chief of Staff', category: 'military', canFire: true },
        { id: 'marine-commandant', title: 'Marine Corps Commandant', category: 'military', canFire: true },
        
        // Financial positions
        { id: 'sec-comptroller', title: 'Comptroller of Currency', category: 'financial', canFire: true },
        { id: 'treasury-deputy', title: 'Deputy Treasury Secretary', category: 'financial', canFire: true },
        
        // Advisor positions
        { id: 'science-advisor', title: 'Science Advisor', category: 'advisor', canFire: true },
        { id: 'economic-advisor', title: 'Chief Economic Advisor', category: 'advisor', canFire: true },
        { id: 'national-security-advisor', title: 'National Security Advisor', category: 'advisor', canFire: true }
      ];
      
      // Filter out positions that are already filled
      const currentPositions = communicationGameState.contacts.map(c => c.title);
      const openPositions = availablePositions.filter(pos => 
        !currentPositions.some(current => current.includes(pos.title.split(' ').slice(-2).join(' ')))
      );
      
      res.json({
        availablePositions: openPositions,
        totalAvailable: openPositions.length,
        categories: [...new Set(openPositions.map(p => p.category))]
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get available positions', details: error.message });
    }
  });

  // Get channels by category
  app.get('/api/communication/channels/category/:category', (req, res) => {
    try {
      const { category } = req.params;
      const channels = communicationGameState.channels.filter(c => c.category === category);
      
      // Enrich channels with participant details
      const enrichedChannels = channels.map(channel => {
        const participantDetails = (channel.participants || []).map(participantId => {
          const contact = communicationGameState.contacts.find(c => c.id === participantId);
          return contact ? {
            id: contact.id,
            name: contact.name,
            title: contact.title,
            avatar: contact.avatar,
            status: contact.status
          } : null;
        }).filter(Boolean);

        return {
          ...channel,
          participantDetails
        };
      });
      
      res.json({ 
        channels: enrichedChannels, 
        category, 
        count: enrichedChannels.length 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get channels by category', details: error.message });
    }
  });

  // Start a group conversation
  app.post('/api/communication/channels/:channelId/start-conversation', (req, res) => {
    try {
      const { channelId } = req.params;
      const { message, priority = 'normal' } = req.body;
      
      const channel = communicationGameState.channels.find(c => c.id === channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required to start conversation' });
      }
      
      // Activate the channel
      channel.isActive = true;
      
      // Create conversation record
      const conversationId = `conv_${Date.now()}`;
      const conversation = {
        id: conversationId,
        channelId: channelId,
        channelName: channel.name,
        participants: channel.participants,
        startedBy: 'president',
        startTime: new Date().toISOString(),
        priority: priority,
        status: 'active',
        messages: [
          {
            id: 1,
            sender: 'president',
            senderName: 'President',
            content: message,
            timestamp: new Date().toISOString(),
            type: 'text'
          }
        ]
      };
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Group conversation started in ${channel.name} with ${channel.participants.length} participants`,
        type: 'conversation'
      });
      
      // Get participant details
      const participantDetails = channel.participants.map(participantId => {
        const contact = communicationGameState.contacts.find(c => c.id === participantId);
        return contact ? {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status
        } : null;
      }).filter(Boolean);
      
      res.json({
        success: true,
        conversation: {
          ...conversation,
          participantDetails
        },
        message: `Group conversation started in ${channel.name}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start group conversation', details: error.message });
    }
  });

  // Send message to group channel
  app.post('/api/communication/channels/:channelId/send-message', (req, res) => {
    try {
      const { channelId } = req.params;
      const { message, messageType = 'text' } = req.body;
      
      const channel = communicationGameState.channels.find(c => c.id === channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      // Simulate responses from participants
      const responses = [];
      const messageId = Date.now();
      
      // Add president's message
      responses.push({
        id: messageId,
        sender: 'president',
        senderName: 'President',
        content: message,
        timestamp: new Date().toISOString(),
        type: messageType
      });
      
      // Generate AI responses from participants
      channel.participants.forEach((participantId, index) => {
        const contact = communicationGameState.contacts.find(c => c.id === participantId);
        if (contact) {
          const responseMessages = {
            'sec-defense': [
              'Understood, Mr. President. Defense Department is ready to implement.',
              'I concur with this approach. Military assets are at your disposal.',
              'This aligns with our strategic objectives. Recommend immediate action.'
            ],
            'sec-state': [
              'I\'ll coordinate with our diplomatic partners on this matter.',
              'This requires careful diplomatic consideration. I suggest we proceed cautiously.',
              'Our allies should be briefed on this development immediately.'
            ],
            'cia-director': [
              'Intelligence confirms this assessment. Additional details in classified briefing.',
              'Our assets are monitoring the situation. Will provide updates as available.',
              'Recommend elevated security protocols given current intelligence.'
            ],
            'joint-chiefs-chair': [
              'All branches are prepared to execute on your orders, Mr. President.',
              'Military readiness is at optimal levels. Awaiting your command.',
              'Joint operations are coordinated and ready for deployment.'
            ]
          };
          
          const contactResponses = responseMessages[participantId] || [
            `Acknowledged, Mr. President. ${contact.title} office will coordinate accordingly.`,
            `Thank you for the briefing. We\'ll implement these directives immediately.`,
            `Understood. My team is ready to support this initiative.`
          ];
          
          const selectedResponse = contactResponses[Math.floor(Math.random() * contactResponses.length)];
          
          responses.push({
            id: messageId + index + 1,
            sender: participantId,
            senderName: contact.name,
            senderTitle: contact.title,
            content: selectedResponse,
            timestamp: new Date(Date.now() + (index + 1) * 2000).toISOString(),
            type: 'text'
          });
        }
      });
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Message sent to ${channel.name}: "${message.substring(0, 50)}..."`,
        type: 'message'
      });
      
      res.json({
        success: true,
        channelId: channelId,
        channelName: channel.name,
        messages: responses,
        participantCount: channel.participants.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send group message', details: error.message });
    }
  });

  // Create custom group channel
  app.post('/api/communication/channels/create-group', (req, res) => {
    try {
      const { name, participants, category = 'custom', encryption = 'standard', description } = req.body;
      
      if (!name || !participants || participants.length === 0) {
        return res.status(400).json({ error: 'Channel name and participants are required' });
      }
      
      // Validate participants exist
      const validParticipants = participants.filter(participantId => 
        communicationGameState.contacts.some(c => c.id === participantId)
      );
      
      if (validParticipants.length === 0) {
        return res.status(400).json({ error: 'No valid participants found' });
      }
      
      // Create new channel
      const newChannel = {
        id: `custom_${Date.now()}`,
        name: name,
        type: 'secure',
        category: category,
        participants: validParticipants,
        participantCount: validParticipants.length,
        isActive: true,
        encryption: encryption,
        description: description || `Custom group channel: ${name}`,
        createdBy: 'president',
        createdAt: new Date().toISOString()
      };
      
      // Add to channels
      communicationGameState.channels.push(newChannel);
      
      // Get participant details
      const participantDetails = validParticipants.map(participantId => {
        const contact = communicationGameState.contacts.find(c => c.id === participantId);
        return contact ? {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status
        } : null;
      }).filter(Boolean);
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Custom group channel "${name}" created with ${validParticipants.length} participants`,
        type: 'channel'
      });
      
      res.json({
        success: true,
        channel: {
          ...newChannel,
          participantDetails
        },
        message: `Group channel "${name}" created successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create group channel', details: error.message });
    }
  });

  // Get all channel categories
  app.get('/api/communication/channels/categories', (req, res) => {
    try {
      const categories = [...new Set(communicationGameState.channels.map(c => c.category))];
      const categoryStats = categories.map(category => {
        const channels = communicationGameState.channels.filter(c => c.category === category);
        const activeChannels = channels.filter(c => c.isActive);
        const totalParticipants = channels.reduce((sum, c) => sum + (c.participantCount || c.participants.length), 0);
        
        return {
          category,
          channelCount: channels.length,
          activeChannels: activeChannels.length,
          totalParticipants,
          channels: channels.map(c => ({
            id: c.id,
            name: c.name,
            participantCount: c.participantCount || c.participants.length,
            isActive: c.isActive,
            encryption: c.encryption
          }))
        };
      });
      
      res.json({
        categories: categoryStats,
        totalCategories: categories.length,
        totalChannels: communicationGameState.channels.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get channel categories', details: error.message });
    }
  });

  // === CABINET MEETING FUNCTIONALITY (MIGRATED FROM CABINET SYSTEM) ===
  
  // Schedule a formal cabinet meeting (creates structured group conversation)
  app.post('/api/communication/cabinet/schedule-meeting', (req, res) => {
    try {
      const { type = 'regular', title, scheduledDate, attendees, agenda, priority = 'normal' } = req.body;
      
      // Meeting types
      const meetingTypes = {
        'regular': { name: 'Regular Cabinet Meeting', duration: 120 },
        'emergency': { name: 'Emergency Cabinet Meeting', duration: 180 },
        'budget': { name: 'Budget Review Meeting', duration: 240 },
        'crisis': { name: 'Crisis Response Meeting', duration: 300 },
        'policy': { name: 'Policy Planning Meeting', duration: 150 }
      };
      
      const meetingType = meetingTypes[type];
      if (!meetingType) {
        return res.status(400).json({ error: 'Invalid meeting type' });
      }
      
      // Get cabinet channel
      const cabinetChannel = communicationGameState.channels.find(c => c.id === 'cabinet-full');
      if (!cabinetChannel) {
        return res.status(404).json({ error: 'Cabinet channel not found' });
      }
      
      // Create formal meeting record
      const meetingId = `meeting_${Date.now()}`;
      const meeting = {
        id: meetingId,
        type: type,
        title: title || meetingType.name,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        duration: meetingType.duration,
        status: 'scheduled',
        priority: priority,
        attendees: attendees || cabinetChannel.participants,
        agenda: agenda || [],
        channelId: cabinetChannel.id,
        channelName: cabinetChannel.name,
        createdAt: new Date().toISOString()
      };
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Cabinet meeting "${meeting.title}" scheduled for ${meeting.scheduledDate.toISOString()}`,
        type: 'meeting'
      });
      
      // Store meeting in communication state (extend if needed)
      if (!communicationGameState.meetings) {
        communicationGameState.meetings = [];
      }
      communicationGameState.meetings.push(meeting);
      
      res.json({
        success: true,
        meeting: meeting,
        message: `Cabinet meeting "${meeting.title}" scheduled successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to schedule cabinet meeting', details: error.message });
    }
  });

  // Get all cabinet meetings
  app.get('/api/communication/cabinet/meetings', (req, res) => {
    try {
      const { limit = 20, offset = 0, status, type } = req.query;
      
      if (!communicationGameState.meetings) {
        communicationGameState.meetings = [];
      }
      
      let meetings = [...communicationGameState.meetings];
      
      // Apply filters
      if (status) {
        meetings = meetings.filter(meeting => meeting.status === status);
      }
      
      if (type) {
        meetings = meetings.filter(meeting => meeting.type === type);
      }
      
      // Sort by date (newest first)
      meetings.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
      
      // Apply pagination
      const paginatedMeetings = meetings.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
      
      res.json({
        meetings: paginatedMeetings,
        total: meetings.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < meetings.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve cabinet meetings', details: error.message });
    }
  });

  // Get specific cabinet meeting details
  app.get('/api/communication/cabinet/meetings/:meetingId', (req, res) => {
    try {
      const { meetingId } = req.params;
      
      if (!communicationGameState.meetings) {
        return res.status(404).json({ error: 'No meetings found' });
      }
      
      const meeting = communicationGameState.meetings.find(m => m.id === meetingId);
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      // Enrich with participant details
      const attendeeDetails = meeting.attendees.map(attendeeId => {
        const contact = communicationGameState.contacts.find(c => c.id === attendeeId);
        return contact ? {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status
        } : null;
      }).filter(Boolean);
      
      res.json({
        meeting: {
          ...meeting,
          attendeeDetails
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get meeting details', details: error.message });
    }
  });

  // Start a cabinet meeting (combines scheduling with immediate group conversation)
  app.post('/api/communication/cabinet/start-meeting', (req, res) => {
    try {
      const { type = 'regular', title, agenda, openingMessage } = req.body;
      
      // First schedule the meeting
      const meetingTypes = {
        'regular': { name: 'Regular Cabinet Meeting', duration: 120 },
        'emergency': { name: 'Emergency Cabinet Meeting', duration: 180 },
        'budget': { name: 'Budget Review Meeting', duration: 240 },
        'crisis': { name: 'Crisis Response Meeting', duration: 300 },
        'policy': { name: 'Policy Planning Meeting', duration: 150 }
      };
      
      const meetingType = meetingTypes[type];
      if (!meetingType) {
        return res.status(400).json({ error: 'Invalid meeting type' });
      }
      
      const cabinetChannel = communicationGameState.channels.find(c => c.id === 'cabinet-full');
      if (!cabinetChannel) {
        return res.status(404).json({ error: 'Cabinet channel not found' });
      }
      
      // Create meeting record
      const meetingId = `meeting_${Date.now()}`;
      const meeting = {
        id: meetingId,
        type: type,
        title: title || meetingType.name,
        scheduledDate: new Date(),
        duration: meetingType.duration,
        status: 'in-progress',
        priority: type === 'emergency' || type === 'crisis' ? 'urgent' : 'normal',
        attendees: cabinetChannel.participants,
        agenda: agenda || [],
        channelId: cabinetChannel.id,
        channelName: cabinetChannel.name,
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Store meeting
      if (!communicationGameState.meetings) {
        communicationGameState.meetings = [];
      }
      communicationGameState.meetings.push(meeting);
      
      // Start the group conversation
      cabinetChannel.isActive = true;
      
      const conversationId = `conv_${Date.now()}`;
      const defaultMessage = openingMessage || `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, Cabinet. I'm calling this ${meetingType.name} to order.`;
      
      const conversation = {
        id: conversationId,
        meetingId: meetingId,
        channelId: cabinetChannel.id,
        channelName: cabinetChannel.name,
        participants: cabinetChannel.participants,
        startedBy: 'president',
        startTime: new Date().toISOString(),
        priority: meeting.priority,
        status: 'active',
        messages: [
          {
            id: 1,
            sender: 'president',
            senderName: 'President',
            content: defaultMessage,
            timestamp: new Date().toISOString(),
            type: 'text'
          }
        ]
      };
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Cabinet meeting "${meeting.title}" started with ${cabinetChannel.participants.length} participants`,
        type: 'meeting'
      });
      
      // Get participant details
      const participantDetails = cabinetChannel.participants.map(participantId => {
        const contact = communicationGameState.contacts.find(c => c.id === participantId);
        return contact ? {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status
        } : null;
      }).filter(Boolean);
      
      res.json({
        success: true,
        meeting: meeting,
        conversation: {
          ...conversation,
          participantDetails
        },
        message: `Cabinet meeting "${meeting.title}" started successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start cabinet meeting', details: error.message });
    }
  });

  // End a cabinet meeting
  app.post('/api/communication/cabinet/meetings/:meetingId/end', (req, res) => {
    try {
      const { meetingId } = req.params;
      const { summary, decisions = [], nextActions = [] } = req.body;
      
      if (!communicationGameState.meetings) {
        return res.status(404).json({ error: 'No meetings found' });
      }
      
      const meeting = communicationGameState.meetings.find(m => m.id === meetingId);
      if (!meeting) {
        return res.status(404).json({ error: 'Meeting not found' });
      }
      
      // Update meeting status
      meeting.status = 'completed';
      meeting.endedAt = new Date().toISOString();
      meeting.summary = summary || 'Meeting concluded successfully.';
      meeting.decisions = decisions;
      meeting.nextActions = nextActions;
      
      // Add to logs
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Cabinet meeting "${meeting.title}" concluded`,
        type: 'meeting'
      });
      
      res.json({
        success: true,
        meeting: meeting,
        message: `Cabinet meeting "${meeting.title}" ended successfully`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to end cabinet meeting', details: error.message });
    }
  });

  // === ENHANCED COMMUNICATION FEATURES ===

  // Search and filter contacts
  app.get('/api/communication/contacts/search', (req, res) => {
    try {
      const { 
        q = '', 
        category = 'all', 
        status = 'all', 
        location = 'all',
        civilization = 'all',
        canFire = 'all',
        canPostToWitter = 'all',
        limit = 50,
        offset = 0
      } = req.query;
      
      let filteredContacts = [...communicationGameState.contacts];
      
      // Apply search term
      if (q) {
        const searchTerm = q.toLowerCase();
        filteredContacts = filteredContacts.filter(contact => 
          contact.name.toLowerCase().includes(searchTerm) ||
          contact.title.toLowerCase().includes(searchTerm) ||
          contact.backstory.toLowerCase().includes(searchTerm) ||
          contact.specialties.some(s => s.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply filters
      if (category !== 'all') {
        filteredContacts = filteredContacts.filter(c => c.category === category);
      }
      
      if (status !== 'all') {
        filteredContacts = filteredContacts.filter(c => c.status === status);
      }
      
      if (location !== 'all') {
        filteredContacts = filteredContacts.filter(c => c.location.toLowerCase().includes(location.toLowerCase()));
      }
      
      if (civilization !== 'all') {
        filteredContacts = filteredContacts.filter(c => c.civilization && c.civilization.toLowerCase().includes(civilization.toLowerCase()));
      }
      
      if (canFire !== 'all') {
        const canFireBool = canFire === 'true';
        filteredContacts = filteredContacts.filter(c => c.canFire === canFireBool);
      }
      
      if (canPostToWitter !== 'all') {
        const canPostBool = canPostToWitter === 'true';
        filteredContacts = filteredContacts.filter(c => c.canPostToWitter === canPostBool);
      }
      
      // Apply pagination
      const total = filteredContacts.length;
      const paginatedContacts = filteredContacts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
      
      // Enrich with detailed profiles
      const enrichedContacts = paginatedContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        avatar: contact.avatar,
        status: contact.status,
        location: contact.location,
        category: contact.category,
        canFire: contact.canFire,
        canPostToWitter: contact.canPostToWitter,
        backstory: contact.backstory,
        personality: contact.personality,
        specialties: contact.specialties,
        civilization: contact.civilization || 'Terran Federation',
        homeworld: contact.homeworld || 'Earth',
        yearsOfService: contact.yearsOfService || 'N/A',
        securityClearance: contact.securityClearance || contact.clearanceLevel,
        languages: contact.languages || ['English'],
        currentMission: contact.currentMission || 'Serving in current role',
        lastSeen: contact.lastSeen,
        messageCount: contact.messages.length,
        isFavorite: communicationGameState.favorites.includes(contact.id)
      }));
      
      res.json({
        contacts: enrichedContacts,
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total,
        filters: { q, category, status, location, civilization, canFire, canPostToWitter }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search contacts', details: error.message });
    }
  });

  // Get available filter options
  app.get('/api/communication/contacts/filters', (req, res) => {
    try {
      const categories = [...new Set(communicationGameState.contacts.map(c => c.category))];
      const statuses = [...new Set(communicationGameState.contacts.map(c => c.status))];
      const locations = [...new Set(communicationGameState.contacts.map(c => c.location))];
      const civilizations = [...new Set(communicationGameState.contacts.map(c => c.civilization || 'Terran Federation'))];
      
      res.json({
        categories: categories.sort(),
        statuses: statuses.sort(),
        locations: locations.sort(),
        civilizations: civilizations.sort(),
        canFire: ['true', 'false'],
        canPostToWitter: ['true', 'false']
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get filter options', details: error.message });
    }
  });

  // Manage favorites
  app.post('/api/communication/favorites/:contactId', (req, res) => {
    try {
      const { contactId } = req.params;
      
      const contact = communicationGameState.contacts.find(c => c.id === contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      if (!communicationGameState.favorites.includes(contactId)) {
        communicationGameState.favorites.push(contactId);
        
        communicationGameState.logs.unshift({
          timestamp: new Date().toISOString(),
          event: `${contact.name} added to favorites`,
          type: 'favorites'
        });
        
        res.json({
          success: true,
          message: `${contact.name} added to favorites`,
          isFavorite: true
        });
      } else {
        res.json({
          success: true,
          message: `${contact.name} is already in favorites`,
          isFavorite: true
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to add to favorites', details: error.message });
    }
  });

  app.delete('/api/communication/favorites/:contactId', (req, res) => {
    try {
      const { contactId } = req.params;
      
      const contact = communicationGameState.contacts.find(c => c.id === contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      
      const index = communicationGameState.favorites.indexOf(contactId);
      if (index > -1) {
        communicationGameState.favorites.splice(index, 1);
        
        communicationGameState.logs.unshift({
          timestamp: new Date().toISOString(),
          event: `${contact.name} removed from favorites`,
          type: 'favorites'
        });
        
        res.json({
          success: true,
          message: `${contact.name} removed from favorites`,
          isFavorite: false
        });
      } else {
        res.json({
          success: true,
          message: `${contact.name} was not in favorites`,
          isFavorite: false
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove from favorites', details: error.message });
    }
  });

  // Get favorites list
  app.get('/api/communication/favorites', (req, res) => {
    try {
      const favoriteContacts = communicationGameState.favorites.map(contactId => {
        const contact = communicationGameState.contacts.find(c => c.id === contactId);
        return contact ? {
          id: contact.id,
          name: contact.name,
          title: contact.title,
          avatar: contact.avatar,
          status: contact.status,
          category: contact.category,
          lastSeen: contact.lastSeen
        } : null;
      }).filter(Boolean);
      
      res.json({
        favorites: favoriteContacts,
        count: favoriteContacts.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get favorites', details: error.message });
    }
  });

  // Join a channel
  app.post('/api/communication/channels/:channelId/join', (req, res) => {
    try {
      const { channelId } = req.params;
      
      const channel = communicationGameState.channels.find(c => c.id === channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      if (!communicationGameState.joinedChannels.includes(channelId)) {
        communicationGameState.joinedChannels.push(channelId);
        channel.isActive = true;
        
        communicationGameState.logs.unshift({
          timestamp: new Date().toISOString(),
          event: `Joined channel: ${channel.name}`,
          type: 'channel'
        });
        
        res.json({
          success: true,
          message: `Successfully joined ${channel.name}`,
          channel: {
            id: channel.id,
            name: channel.name,
            category: channel.category,
            participantCount: channel.participantCount,
            encryption: channel.encryption
          }
        });
      } else {
        res.json({
          success: true,
          message: `Already joined ${channel.name}`,
          channel: {
            id: channel.id,
            name: channel.name,
            category: channel.category,
            participantCount: channel.participantCount,
            encryption: channel.encryption
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to join channel', details: error.message });
    }
  });

  // Leave a channel
  app.post('/api/communication/channels/:channelId/leave', (req, res) => {
    try {
      const { channelId } = req.params;
      
      const channel = communicationGameState.channels.find(c => c.id === channelId);
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      const index = communicationGameState.joinedChannels.indexOf(channelId);
      if (index > -1) {
        communicationGameState.joinedChannels.splice(index, 1);
        
        communicationGameState.logs.unshift({
          timestamp: new Date().toISOString(),
          event: `Left channel: ${channel.name}`,
          type: 'channel'
        });
        
        res.json({
          success: true,
          message: `Successfully left ${channel.name}`
        });
      } else {
        res.json({
          success: true,
          message: `Was not in ${channel.name}`
        });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to leave channel', details: error.message });
    }
  });

  // Get joined channels
  app.get('/api/communication/channels/joined', (req, res) => {
    try {
      const joinedChannels = communicationGameState.joinedChannels.map(channelId => {
        const channel = communicationGameState.channels.find(c => c.id === channelId);
        return channel ? {
          id: channel.id,
          name: channel.name,
          category: channel.category,
          participantCount: channel.participantCount,
          isActive: channel.isActive,
          encryption: channel.encryption,
          description: channel.description
        } : null;
      }).filter(Boolean);
      
      res.json({
        channels: joinedChannels,
        count: joinedChannels.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get joined channels', details: error.message });
    }
  });

  // Get conversation transcript
  app.get('/api/communication/transcripts/:conversationId', (req, res) => {
    try {
      const { conversationId } = req.params;
      
      // For now, simulate transcript retrieval
      // In a real implementation, this would fetch from persistent storage
      const transcript = {
        id: conversationId,
        participants: ['president', 'sec-defense', 'sec-state'],
        startTime: new Date(Date.now() - 3600000).toISOString(),
        endTime: new Date().toISOString(),
        messages: [
          {
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            speaker: 'President',
            content: 'Good morning, Cabinet. We need to discuss the Colonial Development Initiative.',
            type: 'text'
          },
          {
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            speaker: 'Secretary of Defense',
            content: 'Mr. President, from a security perspective, we need to ensure adequate protection for the new colonies.',
            type: 'text'
          },
          {
            timestamp: new Date(Date.now() - 3400000).toISOString(),
            speaker: 'Secretary of State',
            content: 'I agree with Defense. We should also coordinate with our allies on this initiative.',
            type: 'text'
          }
        ],
        summary: 'Discussion of Colonial Development Initiative with focus on security and diplomatic coordination.',
        decisions: [
          'Increase security presence in new colonial territories',
          'Coordinate with Terran Alliance partners on development plans'
        ]
      };
      
      res.json({ transcript });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get transcript', details: error.message });
    }
  });

  // Toggle voice/text mode
  app.post('/api/communication/settings/voice-mode', (req, res) => {
    try {
      const { enabled } = req.body;
      
      communicationGameState.settings.voiceMode = enabled;
      
      communicationGameState.logs.unshift({
        timestamp: new Date().toISOString(),
        event: `Voice mode ${enabled ? 'enabled' : 'disabled'}`,
        type: 'settings'
      });
      
      res.json({
        success: true,
        voiceMode: enabled,
        message: `Voice mode ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle voice mode', details: error.message });
    }
  });

  // Helper functions for communication structured outputs (streamlined)
  function calculateResponseRate() {
    const stats = getStatistics();
    const totalMessages = stats.totalMessages || 0;
    const responses = stats.totalResponses || 0;
    return totalMessages > 0 ? responses / totalMessages : 0.5;
  }

  function calculateDiplomaticHealth() {
    const contacts = getContacts();
    const diplomaticContacts = contacts.filter(c => c.category === 'diplomatic' || c.role?.includes('diplomat'));
    const healthyRelations = diplomaticContacts.filter(c => c.relationshipStatus === 'positive' || c.relationshipStatus === 'neutral').length;
    return diplomaticContacts.length > 0 ? healthyRelations / diplomaticContacts.length : 0.7;
  }

  function calculateCommunicationEfficiency() {
    const routing = communicationKnobs.message_routing_optimization;
    const prioritization = communicationKnobs.response_time_prioritization;
    const automation = communicationKnobs.channel_management_automation;
    return (routing + prioritization + automation) / 3;
  }

  function calculateSecurityStatus() {
    const encryption = communicationKnobs.encryption_strength;
    const surveillance = communicationKnobs.surveillance_detection;
    const leakPrevention = communicationKnobs.information_leak_prevention;
    return (encryption + surveillance + leakPrevention) / 3;
  }

  function analyzeContactRelationships() {
    const contacts = getContacts();
    const relationships = { positive: 0, neutral: 0, negative: 0, unknown: 0 };
    contacts.forEach(contact => {
      const status = contact.relationshipStatus || 'unknown';
      relationships[status] = (relationships[status] || 0) + 1;
    });
    return relationships;
  }

  function analyzeChannelActivity() {
    const channels = getChannels();
    const activeChannels = channels.filter(c => c.status === 'active').length;
    const totalChannels = channels.length;
    return { active_channels: activeChannels, total_channels: totalChannels, activity_rate: totalChannels > 0 ? activeChannels / totalChannels : 0 };
  }

  function analyzeMessageSentiment() {
    const sentimentDepth = communicationKnobs.sentiment_analysis_depth;
    // Simplified sentiment analysis based on knob setting
    return { 
      analysis_depth: sentimentDepth, 
      positive_trend: 0.6 + (sentimentDepth * 0.2), 
      negative_trend: 0.2 - (sentimentDepth * 0.1) 
    };
  }

  function analyzeDiplomaticEngagement() {
    const contacts = getContacts();
    const diplomaticContacts = contacts.filter(c => c.category === 'diplomatic');
    const engagementLevel = communicationKnobs.negotiation_assistance + communicationKnobs.cultural_sensitivity;
    return { diplomatic_contacts: diplomaticContacts.length, engagement_strength: engagementLevel / 2 };
  }

  function analyzeCrossCivCommunications() {
    const contacts = getContacts();
    const crossCivContacts = contacts.filter(c => c.civilization && c.civilization !== 'own');
    const channels = getChannels();
    const crossCivChannels = channels.filter(c => c.category === 'inter-civilization' || c.crossCivilization);
    return { cross_civ_contacts: crossCivContacts.length, cross_civ_channels: crossCivChannels.length };
  }

  function assessDiplomaticSuccess() {
    const diplomaticHealth = calculateDiplomaticHealth();
    const protocolCompliance = communicationKnobs.diplomatic_protocol_strictness;
    const culturalSensitivity = communicationKnobs.cultural_sensitivity;
    return { success_rate: diplomaticHealth, protocol_strength: protocolCompliance, cultural_adaptation: culturalSensitivity };
  }

  function assessNegotiationOutcomes() {
    const negotiationAssistance = communicationKnobs.negotiation_assistance;
    const conflictDeEscalation = communicationKnobs.conflict_de_escalation;
    const outcomeScore = (negotiationAssistance + conflictDeEscalation) / 2;
    return { assistance_level: negotiationAssistance, de_escalation_capability: conflictDeEscalation, outcome_score: outcomeScore };
  }

  function assessConflictResolution() {
    const deEscalation = communicationKnobs.conflict_de_escalation;
    const culturalSensitivity = communicationKnobs.cultural_sensitivity;
    const effectiveness = (deEscalation + culturalSensitivity) / 2;
    return { de_escalation_strength: deEscalation, cultural_awareness: culturalSensitivity, resolution_effectiveness: effectiveness };
  }

  function assessSecurityIncidents() {
    const surveillance = communicationKnobs.surveillance_detection;
    const leakPrevention = communicationKnobs.information_leak_prevention;
    const incidentRate = 1 - ((surveillance + leakPrevention) / 2); // Higher security = lower incidents
    return { incident_rate: incidentRate, detection_capability: surveillance, prevention_strength: leakPrevention };
  }

  function assessProtocolCompliance() {
    const protocolStrictness = communicationKnobs.diplomatic_protocol_strictness;
    const authentication = communicationKnobs.authentication_strictness;
    const complianceScore = (protocolStrictness + authentication) / 2;
    return { compliance_score: complianceScore, protocol_enforcement: protocolStrictness, auth_strictness: authentication };
  }

  function generateCommunicationAIAlerts() {
    const alerts = [];
    
    // Diplomatic crisis alert
    const diplomaticHealth = calculateDiplomaticHealth();
    if (diplomaticHealth < 0.4) {
      alerts.push({ type: 'diplomatic_crisis', severity: 'high', message: 'Multiple diplomatic relationships deteriorating' });
    }
    
    // Security breach alert
    const securityStatus = calculateSecurityStatus();
    if (securityStatus < 0.6) {
      alerts.push({ type: 'security_vulnerability', severity: 'high', message: 'Communication security below acceptable levels' });
    }
    
    // Communication overload alert
    const stats = getStatistics();
    if ((stats.totalMessages || 0) > 1000) {
      alerts.push({ type: 'message_overload', severity: 'medium', message: 'High message volume may impact response times' });
    }
    
    // Response rate alert
    const responseRate = calculateResponseRate();
    if (responseRate < 0.3) {
      alerts.push({ type: 'poor_response_rate', severity: 'medium', message: 'Low response rate to incoming messages' });
    }
    
    return alerts;
  }

  function calculateDiplomaticRelationsStatus() {
    const contacts = getContacts();
    const diplomaticContacts = contacts.filter(c => c.category === 'diplomatic');
    const positiveRelations = diplomaticContacts.filter(c => c.relationshipStatus === 'positive').length;
    const neutralRelations = diplomaticContacts.filter(c => c.relationshipStatus === 'neutral').length;
    const negativeRelations = diplomaticContacts.filter(c => c.relationshipStatus === 'negative').length;
    
    return {
      total_diplomatic_contacts: diplomaticContacts.length,
      positive_relations: positiveRelations,
      neutral_relations: neutralRelations,
      negative_relations: negativeRelations,
      diplomatic_stability: diplomaticContacts.length > 0 ? (positiveRelations + neutralRelations) / diplomaticContacts.length : 0.7
    };
  }

  function identifyIntelligenceOpportunities() {
    const contacts = getContacts();
    const intelligenceContacts = contacts.filter(c => c.category === 'intelligence' || c.role?.includes('intelligence'));
    const surveillanceCapability = communicationKnobs.surveillance_detection;
    return { intelligence_contacts: intelligenceContacts.length, surveillance_strength: surveillanceCapability, opportunities: intelligenceContacts.length * surveillanceCapability };
  }

  function calculateAllianceCoordination() {
    const channels = getChannels();
    const allianceChannels = channels.filter(c => c.category === 'alliance' || c.name?.includes('alliance'));
    const coordinationEffectiveness = communicationKnobs.channel_management_automation + communicationKnobs.message_routing_optimization;
    return { alliance_channels: allianceChannels.length, coordination_strength: coordinationEffectiveness / 2 };
  }

  function calculateTradeNegotiationProgress() {
    const contacts = getContacts();
    const tradeContacts = contacts.filter(c => c.category === 'trade' || c.role?.includes('trade'));
    const negotiationCapability = communicationKnobs.negotiation_assistance;
    return { trade_contacts: tradeContacts.length, negotiation_strength: negotiationCapability, progress_indicator: tradeContacts.length * negotiationCapability };
  }

  function calculateCrisisCommunicationReadiness() {
    const efficiency = calculateCommunicationEfficiency();
    const security = calculateSecurityStatus();
    const deEscalation = communicationKnobs.conflict_de_escalation;
    const readiness = (efficiency + security + deEscalation) / 3;
    return { readiness_score: readiness, crisis_protocols: deEscalation, system_reliability: efficiency };
  }

  // Apply AI knobs to actual communication game state
  function applyCommunicationKnobsToGameState() {
    const contacts = getContacts();
    const channels = getChannels();
    
    // Apply character proactivity to generate more messages
    const proactivity = communicationKnobs.character_proactivity;
    if (proactivity > 0.6) {
      // High proactivity increases message generation from characters
      contacts.forEach(contact => {
        if (contact.category === 'character' && Math.random() < proactivity * 0.3) {
          // Simulate proactive message generation
          contact.lastMessageTime = Date.now();
          contact.messageFrequency = (contact.messageFrequency || 1) * (1 + proactivity * 0.5);
        }
      });
    }
    
    // Apply relationship tracking to update contact relationships
    const relationshipTracking = communicationKnobs.relationship_tracking;
    if (relationshipTracking > 0.7) {
      contacts.forEach(contact => {
        // Enhanced relationship tracking improves relationship status accuracy
        if (contact.relationshipStatus === 'unknown') {
          contact.relationshipStatus = Math.random() > 0.5 ? 'neutral' : 'positive';
        }
        contact.relationshipAccuracy = relationshipTracking;
      });
    }
    
    // Apply encryption strength to channels
    const encryptionStrength = communicationKnobs.encryption_strength;
    channels.forEach(channel => {
      if (encryptionStrength > 0.8) {
        channel.encryption = 'quantum-grade';
        channel.securityLevel = 'maximum';
      } else if (encryptionStrength > 0.6) {
        channel.encryption = 'military-grade';
        channel.securityLevel = 'high';
      } else {
        channel.encryption = 'standard';
        channel.securityLevel = 'medium';
      }
    });
    
    // Apply spam filtering
    const spamFiltering = communicationKnobs.spam_filtering_aggressiveness;
    if (spamFiltering > 0.7) {
      // High spam filtering reduces unwanted messages
      const stats = getStatistics();
      stats.filteredMessages = Math.floor((stats.totalMessages || 0) * spamFiltering * 0.1);
    }
    
    // Apply diplomatic protocol strictness
    const protocolStrictness = communicationKnobs.diplomatic_protocol_strictness;
    contacts.forEach(contact => {
      if (contact.category === 'diplomatic') {
        contact.protocolCompliance = protocolStrictness;
        if (protocolStrictness > 0.8) {
          contact.communicationStyle = 'formal';
        } else if (protocolStrictness > 0.5) {
          contact.communicationStyle = 'professional';
        } else {
          contact.communicationStyle = 'casual';
        }
      }
    });
    
    console.log('🎛️ Communication knobs applied to game state:', {
      character_proactivity: communicationKnobs.character_proactivity,
      relationship_tracking: communicationKnobs.relationship_tracking,
      encryption_strength: communicationKnobs.encryption_strength,
      diplomatic_protocol: communicationKnobs.diplomatic_protocol_strictness
    });
  }

  // ===== AI INTEGRATION ENDPOINTS =====
  
  // Enhanced AI knob endpoints with multi-format input support
  app.get('/api/communication/knobs', (req, res) => {
    const knobData = communicationKnobSystem.getKnobsWithMetadata();
    res.json({
      ...knobData,
      system: 'communication',
      description: 'AI-adjustable parameters for communication system with enhanced input support',
      input_help: communicationKnobSystem.getKnobDescriptions()
    });
  });

  app.post('/api/communication/knobs', (req, res) => {
    const { knobs, source = 'ai' } = req.body;
    
    if (!knobs || typeof knobs !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid knobs data. Expected object with knob values.',
        help: communicationKnobSystem.getKnobDescriptions().examples
      });
    }
    
    // Update knobs using enhanced system
    const updateResult = communicationKnobSystem.updateKnobs(knobs, source);
    
    // Apply knobs to game state
    try {
      applyCommunicationKnobsToGameState();
    } catch (error) {
      console.error('Error applying communication knobs to game state:', error);
    }
    
    res.json({
      success: updateResult.success,
      system: 'communication',
      ...updateResult,
      message: 'Communication knobs updated successfully using enhanced input processing'
    });
  });

  // Get knob help/documentation
  app.get('/api/communication/knobs/help', (req, res) => {
    res.json({
      system: 'communication',
      help: communicationKnobSystem.getKnobDescriptions(),
      current_values: communicationKnobSystem.getKnobsWithMetadata()
    });
  });

  // Get structured outputs for AI consumption
  app.get('/api/communication/ai-data', (req, res) => {
    const structuredData = generateCommunicationStructuredOutputs();
    res.json({
      ...structuredData,
      description: 'Structured communication data for AI analysis and decision-making'
    });
  });

  // Get cross-system integration data
  app.get('/api/communication/cross-system', (req, res) => {
    const outputs = generateCommunicationStructuredOutputs();
    res.json({
      diplomatic_data: outputs.cross_system_data.diplomatic_relations_status,
      intelligence_data: outputs.cross_system_data.intelligence_gathering_opportunities,
      alliance_data: outputs.cross_system_data.alliance_coordination_effectiveness,
      trade_data: outputs.cross_system_data.trade_negotiation_progress,
      crisis_data: outputs.cross_system_data.crisis_communication_readiness,
      communication_summary: outputs.communication_metrics,
      timestamp: outputs.timestamp
    });
  });
}

module.exports = { setupCommunicationAPIs };
