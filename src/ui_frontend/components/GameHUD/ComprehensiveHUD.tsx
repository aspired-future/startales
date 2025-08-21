import React, { useState, useEffect } from 'react';
import './ComprehensiveHUD.css';

// Import all the specialized components
import { SimpleWitterFeed } from '../Witter/SimpleWitterFeed';
import { GalaxyMapComponent } from './GalaxyMapComponent';
import { TradeEconomics } from './TradeEconomics';
import { createScreen } from './screens/ScreenFactory';

interface ComprehensiveHUDProps {
  playerId: string;
  gameContext: {
    currentLocation: string;
    currentActivity: string;
    recentEvents: string[];
  };
}

interface LiveMetrics {
  population: number;
  gdp: number;
  militaryStrength: number;
  researchProjects: number;
  approval: number;
  treasury: number;
  securityLevel: number;
  threatLevel: string;
}

interface CharacterMessage {
  id: string;
  characterName: string;
  characterType: 'advisor' | 'citizen' | 'leader' | 'ai';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  avatar?: string;
}

interface CommunicationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'voice';
  content: string;
  timestamp: string;
  edited: boolean;
  reactions: Array<{
    playerId: string;
    emoji: string;
    timestamp: string;
  }>;
  senderDetails?: {
    id: string;
    name: string;
    title: string;
    civilization: string;
    department: string;
    role: string;
    status: string;
    avatar: string;
  };
}

interface GameMasterEvent {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'crisis' | 'achievement' | 'discovery';
  visualContent?: string; // AI-generated image/video URL
  timestamp: Date;
  requiresResponse: boolean;
}

// Utility function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const ComprehensiveHUD: React.FC<ComprehensiveHUDProps> = ({ playerId, gameContext }) => {
  // State management for all systems
  const [activePanel, setActivePanel] = useState<string>('command-center');
  const [activeTab, setActiveTab] = useState<'whoseapp' | 'events' | 'map' | 'witter' | 'analytics'>('whoseapp');
  const [expandedAccordion, setExpandedAccordion] = useState<string>('quick-actions');
  const [communicationMessages, setCommunicationMessages] = useState<CommunicationMessage[]>([]);
  const [communicationLoading, setCommunicationLoading] = useState(false);
  const [communicationError, setCommunicationError] = useState<string | null>(null);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    population: 2847392,
    gdp: 1250000000,
    militaryStrength: 85,
    researchProjects: 12,
    approval: 73,
    treasury: 45000000,
    securityLevel: 82,
    threatLevel: 'Medium'
  });

  // Communication API state
  const [communicationPlayers, setCommunicationPlayers] = useState<any[]>([]);
  const [communicationConversations, setCommunicationConversations] = useState<any[]>([]);
  const [activeWhoseAppTab, setActiveWhoseAppTab] = useState<'incoming' | 'people' | 'channels'>('incoming');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [peopleFilter, setPeopleFilter] = useState<string>('all');
  const [peopleSearch, setPeopleSearch] = useState<string>('');
  const [civFilter, setCivFilter] = useState<string>('all');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState<boolean>(false);
  const [showScheduleSummitModal, setShowScheduleSummitModal] = useState<boolean>(false);

  // API functions for communication
  const fetchCommunicationData = async () => {
    setCommunicationLoading(true);
    setCommunicationError(null);
    
    try {
      // Use the correct communication API port from the demo
      const API_BASE = 'http://localhost:4003/api/communication';
      
          // Fetch players
    const playersResponse = await fetch(`${API_BASE}/players`);
    if (playersResponse.ok) {
      const playersData = await playersResponse.json();
      
      // Enhance API data with player types and additional info
      const enhancedPlayers = (playersData.players || []).map((player: any) => {
        // Determine player type based on name patterns
        let playerType = 'ai_character';
        let isLeader = false;
        let jobCategory = 'government';
        let rank = 'Officer';
        let specialization = 'General Operations';
        let department = 'Government Affairs';
        let role = 'Standard Clearance';
        
        if (player.name.includes('Commander') || player.name.includes('Alpha')) {
          playerType = 'human';
          isLeader = true;
          jobCategory = 'military';
          rank = 'Commander';
          specialization = 'Strategic Command';
          department = 'Military Command';
          role = 'Level 8 Clearance';
        } else if (player.name.includes('Admiral')) {
          playerType = 'ai_leader';
          isLeader = true;
          jobCategory = 'military';
          rank = 'Admiral';
          specialization = 'Fleet Operations';
          department = 'Naval Command';
          role = 'Level 9 Clearance';
        } else if (player.name.includes('Director')) {
          playerType = 'ai_character';
          isLeader = false;
          jobCategory = 'intelligence';
          rank = 'Director';
          specialization = 'Intelligence Analysis';
          department = 'Intelligence Division';
          role = 'Level 7 Clearance';
        } else if (player.name.includes('Marshal')) {
          playerType = 'ai_leader';
          isLeader = true;
          jobCategory = 'military';
          rank = 'Marshal';
          specialization = 'Military Strategy';
          department = 'Supreme Command';
          role = 'Level 10 Clearance';
        } else if (player.name.includes('Chief')) {
          playerType = 'ai_character';
          isLeader = false;
          jobCategory = 'engineering';
          rank = 'Chief';
          specialization = 'Advanced Technology';
          department = 'Engineering Corps';
          role = 'Level 6 Clearance';
        }
        
        return {
          ...player,
          playerType,
          isLeader,
          jobCategory,
          rank,
          specialization,
          department,
          role,
          title: player.name.split(' ').slice(0, 2).join(' '), // Extract title from name
          avatar: playerType === 'human' ? (isLeader ? '👑' : '👤') : 
                  playerType === 'ai_leader' ? '🤖' : '🎭'
        };
      });
      
      setCommunicationPlayers(enhancedPlayers);
    }
      
      // Fetch conversations
      const conversationsResponse = await fetch(`${API_BASE}/conversations/${playerId}`);
      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        
        // Enhance conversations with descriptions and better organization
        const enhancedConversations = (conversationsData.conversations || []).map((conv: any) => {
          // Enhanced descriptions based on conversation names and types
          let description = conv.description;
          if (!description) {
            if (conv.name.includes('Alliance Command')) {
              description = 'Military alliance coordination and strategic planning';
            } else if (conv.name.includes('Galactic Council')) {
              description = 'Inter-civilization diplomatic forum and governance';
            } else if (conv.name.includes('Trade Federation')) {
              description = 'Interstellar commerce and trade agreements';
            } else if (conv.name.includes('Research')) {
              description = 'Scientific collaboration and technology sharing';
            } else if (conv.name.includes('Cabinet')) {
              description = 'High-level government decision making';
            } else if (conv.name.includes('Security')) {
              description = 'Military and security coordination';
            } else if (conv.name.includes('Emergency')) {
              description = 'Crisis management and emergency response';
            } else if (conv.type === 'direct') {
              description = `Direct communication with ${conv.name.split(' & ')[1] || 'official'}`;
            } else if (conv.type === 'group') {
              description = 'Government group discussion and coordination';
            } else if (conv.type === 'channel') {
              description = 'Inter-galactic communication channel';
            } else {
              description = 'Communication channel';
            }
          }
          
          return {
            ...conv,
            description,
            unreadCount: conv.unreadCount || Math.floor(Math.random() * 4) // Add some random unread counts for demo
          };
        });
        
        setCommunicationConversations(enhancedConversations);
        
        // Get messages from all conversations
        const allMessages: CommunicationMessage[] = [];
        
        for (const conversation of conversationsData.conversations) {
          const messagesResponse = await fetch(`${API_BASE}/conversations/${conversation.id}/messages?limit=10`);
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            allMessages.push(...messagesData.messages);
          }
        }
        
        // Sort messages by timestamp (most recent first)
        allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setCommunicationMessages(allMessages);
      } else {
        throw new Error('Communication API not available');
      }
    } catch (error) {
      console.error('Failed to fetch communication data:', error);
      setCommunicationError(error instanceof Error ? error.message : 'Failed to load communication data');
      
      // Fallback to mock data if API fails
      setCommunicationPlayers([
        // Human Leaders (Zephyrian Empire)
        {
          id: 'human_emperor',
          name: 'Emperor Zyx\'thara the Wise',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Supreme Emperor',
          department: 'Imperial Throne',
          role: 'Absolute Authority',
          jobCategory: 'government',
          rank: 'Emperor',
          specialization: 'Imperial Leadership',
          playerType: 'human',
          isLeader: true,
          avatar: '👑'
        },
        {
          id: 'human_defense_minister',
          name: 'Defense Minister Sarah Chen',
          civilization: 'Zephyrian Empire',
          status: 'offline',
          title: 'Defense Minister',
          department: 'Military Command',
          role: 'Level 9 Clearance',
          jobCategory: 'government',
          rank: 'Minister',
          specialization: 'Strategic Defense',
          playerType: 'human',
          isLeader: true,
          avatar: '🏛️'
        },
        // AI Leaders (Zephyrian Empire)
        {
          id: 'ai_chancellor',
          name: 'Chancellor Vex\'mora Prime',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Imperial Chancellor',
          department: 'Government Affairs',
          role: 'Level 10 Clearance',
          jobCategory: 'government',
          rank: 'Chancellor',
          specialization: 'Administrative Oversight',
          playerType: 'ai_leader',
          isLeader: true,
          avatar: '🤖'
        },
        // AI Characters (Zephyrian Empire)
        {
          id: 'ai_economic_advisor',
          name: 'Chief Economic Advisor Yil\'andra Nexus',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Chief Economic Advisor',
          department: 'Treasury Department',
          role: 'Trade Specialist',
          jobCategory: 'government',
          rank: 'Chief Advisor',
          specialization: 'Interstellar Commerce',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '💼'
        },
        {
          id: 'ai_science_director',
          name: 'Science Director Thex\'ul Quantum',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Science Director',
          department: 'Research Division',
          role: 'Quantum Physics Lead',
          jobCategory: 'science',
          rank: 'Director',
          specialization: 'Quantum Computing',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '🔬'
        },
        {
          id: 'ai_fleet_admiral',
          name: 'Fleet Admiral Rex\'tar Command',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Fleet Admiral',
          department: 'Naval Operations',
          role: 'Supreme Fleet Commander',
          jobCategory: 'military',
          rank: 'Admiral',
          specialization: 'Space Fleet Operations',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '⚓'
        },
        {
          id: 'ai_intelligence_chief',
          name: 'Intelligence Chief Zara\'vel Shadow',
          civilization: 'Zephyrian Empire',
          status: 'online',
          title: 'Intelligence Chief',
          department: 'Intelligence Division',
          role: 'Level 10 Clearance',
          jobCategory: 'intelligence',
          rank: 'Chief',
          specialization: 'Counter-Intelligence',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '🕵️'
        },
        
        // Human Leaders (Other Civilizations)
        {
          id: 'human_centauri_president',
          name: 'President Maria Rodriguez',
          civilization: 'Centauri Republic',
          status: 'online',
          title: 'President',
          department: 'Executive Office',
          role: 'Head of State',
          jobCategory: 'government',
          rank: 'President',
          specialization: 'Democratic Leadership',
          playerType: 'human',
          isLeader: true,
          avatar: '🏛️'
        },
        {
          id: 'human_vegan_director',
          name: 'Director James Park',
          civilization: 'Vegan Collective',
          status: 'offline',
          title: 'Collective Director',
          department: 'Collective Council',
          role: 'Consensus Leader',
          jobCategory: 'government',
          rank: 'Director',
          specialization: 'Collective Governance',
          playerType: 'human',
          isLeader: true,
          avatar: '🌱'
        },
        
        // AI Leaders (Other Civilizations)
        {
          id: 'ai_sirian_marshal',
          name: 'Marshal Vex\'tar Supreme',
          civilization: 'Sirian Empire',
          status: 'online',
          title: 'Supreme Marshal',
          department: 'Imperial Command',
          role: 'Military Dictator',
          jobCategory: 'military',
          rank: 'Marshal',
          specialization: 'Military Supremacy',
          playerType: 'ai_leader',
          isLeader: true,
          avatar: '⚔️'
        },
        {
          id: 'ai_kepler_chief',
          name: 'Chief Technologist Kael\'nex',
          civilization: 'Kepler Technocracy',
          status: 'online',
          title: 'Chief Technologist',
          department: 'Tech Council',
          role: 'Supreme Engineer',
          jobCategory: 'engineering',
          rank: 'Chief',
          specialization: 'Advanced Technology',
          playerType: 'ai_leader',
          isLeader: true,
          avatar: '🔧'
        },
        
        // AI Characters (Other Civilizations)
        {
          id: 'ai_centauri_admiral',
          name: 'Admiral Zara\'vel Starwind',
          civilization: 'Centauri Republic',
          status: 'online',
          title: 'Fleet Admiral',
          department: 'Republican Navy',
          role: 'Naval Commander',
          jobCategory: 'military',
          rank: 'Admiral',
          specialization: 'Fleet Operations',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '🚀'
        },
        {
          id: 'ai_vegan_scientist',
          name: 'Dr. Yil\'thara Collective',
          civilization: 'Vegan Collective',
          status: 'online',
          title: 'Lead Scientist',
          department: 'Research Collective',
          role: 'Xenobiology Expert',
          jobCategory: 'science',
          rank: 'Doctor',
          specialization: 'Collective Intelligence',
          playerType: 'ai_character',
          isLeader: false,
          avatar: '🧪'
        }
      ]);
      
      setCommunicationConversations([
        // Direct Messages
        {
          id: 'conv_direct_1',
          type: 'direct',
          name: 'Defense Minister Kex\'tal Vorthak',
          participants: [playerId, 'defense_minister'],
          lastActivity: new Date(Date.now() - 120000).toISOString(),
          unreadCount: 3,
          description: 'Direct communication with Defense Minister'
        },
        {
          id: 'conv_direct_2',
          type: 'direct',
          name: 'Intelligence Chief Zara\'vel Shadow',
          participants: [playerId, 'intelligence_chief'],
          lastActivity: new Date(Date.now() - 300000).toISOString(),
          unreadCount: 1,
          description: 'Classified intelligence briefings'
        },
        // Government Groups
        {
          id: 'conv_cabinet',
          type: 'group',
          name: 'Imperial Cabinet',
          participants: [playerId, 'defense_minister', 'economic_advisor', 'science_director', 'ambassador'],
          lastActivity: new Date(Date.now() - 900000).toISOString(),
          unreadCount: 2,
          description: 'High-level government decision making'
        },
        {
          id: 'conv_security_council',
          type: 'group',
          name: 'Security Council',
          participants: [playerId, 'defense_minister', 'intelligence_chief', 'fleet_admiral'],
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          unreadCount: 0,
          description: 'Military and security coordination'
        },
        {
          id: 'conv_science_committee',
          type: 'group',
          name: 'Science & Technology Committee',
          participants: [playerId, 'science_director', 'chief_scientist', 'tech_director'],
          lastActivity: new Date(Date.now() - 2700000).toISOString(),
          unreadCount: 1,
          description: 'Research and development coordination'
        },
        // Inter-Galactic Channels
        {
          id: 'conv_galactic_council',
          type: 'channel',
          name: 'Galactic Council',
          participants: [playerId, 'ambassador', 'defense_minister', 'economic_advisor', 'player_2', 'player_3', 'player_4'],
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0,
          description: 'Inter-civilization diplomatic forum'
        },
        {
          id: 'conv_alliance_command',
          type: 'channel',
          name: 'Alliance Command',
          participants: [playerId, 'fleet_admiral', 'defense_minister', 'player_2', 'player_4'],
          lastActivity: new Date(Date.now() - 5400000).toISOString(),
          unreadCount: 3,
          description: 'Military alliance coordination'
        },
        {
          id: 'conv_trade_federation',
          type: 'channel',
          name: 'Trade Federation',
          participants: [playerId, 'economic_advisor', 'trade_commissioner', 'player_2', 'player_3', 'player_5'],
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          unreadCount: 0,
          description: 'Interstellar commerce and trade agreements'
        },
        {
          id: 'conv_research_network',
          type: 'channel',
          name: 'Galactic Research Network',
          participants: [playerId, 'science_director', 'chief_scientist', 'player_3', 'player_5'],
          lastActivity: new Date(Date.now() - 10800000).toISOString(),
          unreadCount: 1,
          description: 'Scientific collaboration across civilizations'
        },
        // Operational Channels
        {
          id: 'conv_colonial_admin',
          type: 'group',
          name: 'Colonial Administration',
          participants: [playerId, 'colonial_governor', 'economic_advisor', 'tech_director'],
          lastActivity: new Date(Date.now() - 14400000).toISOString(),
          unreadCount: 0,
          description: 'Colony management and expansion'
        },
        {
          id: 'conv_emergency_response',
          type: 'channel',
          name: 'Emergency Response Network',
          participants: [playerId, 'defense_minister', 'intelligence_chief', 'fleet_admiral', 'tech_director'],
          lastActivity: new Date(Date.now() - 18000000).toISOString(),
          unreadCount: 0,
          description: 'Crisis management and emergency coordination'
        }
      ]);
      
      setCommunicationMessages([
        {
          id: 'mock_1',
          conversationId: 'conv_1',
          senderId: 'defense_minister',
          type: 'text',
          content: 'Commander, we have reports of unusual activity along the northern border. Three unidentified vessels detected by our surveillance systems at coordinates 847.2N, 234.7E. Vessels appear to be of unknown origin - not matching any known civilization signatures. Recommend immediate deployment of patrol squadrons Alpha and Beta. Awaiting your authorization for defensive posture escalation to DEFCON 3.',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          edited: false,
          reactions: [],
          senderDetails: {
            id: 'defense_minister',
            name: 'Defense Minister Kex\'tal Vorthak',
            title: 'Defense Minister',
            civilization: 'Zephyrian Empire',
            department: 'Military Command',
            role: 'Level 9 Clearance',
            status: 'online',
            avatar: '🏛️'
          }
        },
        {
          id: 'mock_2',
          conversationId: 'conv_2',
          senderId: 'economic_advisor',
          type: 'text',
          content: 'The Stellar Federation has agreed to our proposed terms for rare mineral exports (Quantum Crystals, Nebula Ore, and Stellar Diamonds). They\'re offering a 15% increase in payment rates and guaranteed 5-year contracts worth approximately 2.4 billion credits annually. I\'ve prepared the full economic impact analysis for your review. This could boost our GDP by 3.2% annually and create 15,000 new jobs in the mining sector.',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          edited: false,
          reactions: [],
          senderDetails: {
            id: 'economic_advisor',
            name: 'Chief Economic Advisor Yil\'andra Nexus',
            title: 'Chief Economic Advisor',
            civilization: 'Zephyrian Empire',
            department: 'Treasury Department',
            role: 'Trade Specialist',
            status: 'online',
            avatar: '💼'
          }
        }
      ]);
    } finally {
      setCommunicationLoading(false);
    }
  };
  
  const [characterMessages, setCharacterMessages] = useState<CharacterMessage[]>([
    {
      id: '1',
      characterName: 'Admiral Chen',
      characterType: 'advisor',
      message: 'Commander, our fleet deployment to the Kepler sector is complete. Awaiting further orders.',
      timestamp: new Date(Date.now() - 300000),
      priority: 'medium',
      avatar: '/api/visual/character/admiral-chen'
    },
    {
      id: '2', 
      characterName: 'Dr. Sarah Martinez',
      characterType: 'advisor',
      message: 'Breakthrough in quantum computing research! This could revolutionize our technological capabilities.',
      timestamp: new Date(Date.now() - 180000),
      priority: 'high',
      avatar: '/api/visual/character/dr-martinez'
    },
    {
      id: '3',
      characterName: 'Economic Minister Vale',
      characterType: 'advisor', 
      message: 'Trade negotiations with the Centauri Alliance are proceeding well. Expecting 15% GDP growth this quarter.',
      timestamp: new Date(Date.now() - 120000),
      priority: 'medium',
      avatar: '/api/visual/character/minister-vale'
    }
  ]);

  const [gameMasterEvents, setGameMasterEvents] = useState<GameMasterEvent[]>([
    {
      id: '1',
      title: 'Ancient Artifact Discovered',
      description: 'Archaeological teams on Kepler-442b have uncovered what appears to be technology from an extinct civilization.',
      type: 'discovery',
      visualContent: '/api/visual/generate/ancient-artifact-discovery',
      timestamp: new Date(Date.now() - 600000),
      requiresResponse: true
    },
    {
      id: '2',
      title: 'Economic Boom in Manufacturing Sector',
      description: 'New automation technologies have increased manufacturing efficiency by 34% across all industrial worlds.',
      type: 'achievement',
      timestamp: new Date(Date.now() - 900000),
      requiresResponse: false
    }
  ]);

  const [alerts, setAlerts] = useState([
    { id: '1', type: 'critical', message: 'Resource shortage detected on Mars Colony', count: 1 },
    { id: '2', type: 'warning', message: 'Diplomatic tension with Vega Federation', count: 3 },
    { id: '3', type: 'info', message: 'Research projects nearing completion', count: 5 }
  ]);

  // Create custom channel
  const createCustomChannel = async (channelData: {
    name: string;
    description: string;
    type: 'group' | 'channel';
    participants: string[];
  }) => {
    try {
      const response = await fetch('http://localhost:4003/api/communication/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...channelData,
          creatorId: playerId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Channel created:', result);
        // Refresh conversations
        fetchCommunicationData();
        setShowCreateChannelModal(false);
        return result;
      } else {
        throw new Error('Failed to create channel');
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      setCommunicationError('Failed to create channel');
    }
  };

  // Schedule diplomatic summit
  const scheduleSummit = async (summitData: {
    name: string;
    participants: string[];
    scheduledTime: string;
    agenda: string;
    description?: string;
    priority?: 'low' | 'normal' | 'high';
  }) => {
    try {
      const response = await fetch('http://localhost:4003/api/communication/summits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...summitData,
          creatorId: playerId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Summit scheduled:', result);
        // Refresh conversations
        fetchCommunicationData();
        setShowScheduleSummitModal(false);
        return result;
      } else {
        throw new Error('Failed to schedule summit');
      }
    } catch (error) {
      console.error('Error scheduling summit:', error);
      setCommunicationError('Failed to schedule summit');
    }
  };

  // Fetch communication data on component mount
  useEffect(() => {
    fetchCommunicationData();
    
    // Refresh data every 30 seconds
    const dataInterval = setInterval(fetchCommunicationData, 30000);
    
    return () => clearInterval(dataInterval);
  }, [playerId]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'character.message':
          setCharacterMessages(prev => [data.payload, ...prev.slice(0, 9)]);
          break;
        case 'gamemaster.event':
          setGameMasterEvents(prev => [data.payload, ...prev.slice(0, 4)]);
          break;
        case 'metrics.update':
          setLiveMetrics(prev => ({ ...prev, ...data.payload }));
          break;
        case 'alert.new':
          setAlerts(prev => [data.payload, ...prev]);
          break;
      }
    };

    return () => ws.close();
  }, []);

  // WhoseApp event listener for direct communication from screens
  useEffect(() => {
    const handleWhoseAppEvent = (event: CustomEvent) => {
      const { targetOfficial, context, priority } = event.detail;
      
      // Switch to WhoseApp tab
      setCenterActiveTab('whoseapp');
      setActiveWhoseAppTab('incoming');
      
      // Create a new message from the target official
      const newMessage: CommunicationMessage = {
        id: `msg-${Date.now()}`,
        conversationId: `direct-${targetOfficial.name.replace(/\s+/g, '-').toLowerCase()}`,
        senderId: targetOfficial.name,
        type: 'text',
        content: `Hello! I received your direct communication from the ${context.replace('Direct line from ', '').replace(' screen', '')} system. How can I assist you today?`,
        timestamp: new Date().toISOString(),
        edited: false,
        reactions: []
      };
      
      // Add the message to the communication messages
      setCommunicationMessages(prev => [newMessage, ...prev]);
      
      console.log(`📞 WhoseApp opened for ${targetOfficial.name} (${targetOfficial.title}) - ${context}`);
    };

    // Add event listener
    window.addEventListener('openWhoseApp', handleWhoseAppEvent as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('openWhoseApp', handleWhoseAppEvent as EventListener);
    };
  }, []);

  // Panel definitions for all major systems
  const panels = [
    // Government & Leadership
    { id: 'government', name: 'Government', icon: '🏛️', category: 'government' },
    { id: 'cabinet', name: 'Cabinet', icon: '👥', category: 'government' },
    { id: 'policies', name: 'Policies', icon: '⚖️', category: 'government' },
    { id: 'legislature', name: 'Legislature', icon: '🏛️', category: 'government' },
    { id: 'supreme-court', name: 'Supreme Court', icon: '⚖️', category: 'government' },
    { id: 'political-parties', name: 'Politics', icon: '🎭', category: 'government' },
    
    // Economy & Trade
    { id: 'treasury', name: 'Treasury', icon: '💰', category: 'economy' },
    { id: 'trade', name: 'Trade', icon: '📈', category: 'economy' },
    { id: 'businesses', name: 'Business', icon: '🏢', category: 'economy' },
    { id: 'central-bank', name: 'Central Bank', icon: '🏦', category: 'economy' },
    { id: 'financial-markets', name: 'Markets', icon: '📊', category: 'economy' },
    { id: 'economic-ecosystem', name: 'Economy', icon: '🌐', category: 'economy' },
    
    // Military & Security
    { id: 'military', name: 'Military', icon: '🛡️', category: 'security' },
    { id: 'defense', name: 'Defense', icon: '🏰', category: 'security' },
    { id: 'security', name: 'Security', icon: '🔒', category: 'security' },
    { id: 'joint-chiefs', name: 'Joint Chiefs', icon: '⭐', category: 'security' },
    { id: 'intelligence', name: 'Intelligence', icon: '🕵️', category: 'security' },
    
    // Population & Society
    { id: 'demographics', name: 'Demographics', icon: '👥', category: 'population' },
    { id: 'cities', name: 'Cities', icon: '🏙️', category: 'population' },
    { id: 'migration', name: 'Migration', icon: '🚶', category: 'population' },
    { id: 'professions', name: 'Professions', icon: '💼', category: 'population' },
    { id: 'education', name: 'Education', icon: '🎓', category: 'population' },
    { id: 'health', name: 'Health & Welfare', icon: '🏥', category: 'population' },
    
    // Science & Technology (All Research Consolidated)
    { id: 'government-research', name: 'Government R&D', icon: '🏛️', category: 'science' },
    { id: 'corporate-research', name: 'Corporate R&D', icon: '🏢', category: 'science' },
    { id: 'university-research', name: 'University Research', icon: '🏫', category: 'science' },
    { id: 'classified-research', name: 'Classified Projects', icon: '🔒', category: 'science' },
    { id: 'technology', name: 'Tech Systems', icon: '⚙️', category: 'science' },
    { id: 'visual-systems', name: 'Visual Systems', icon: '🎨', category: 'science' },
    
    // Communications
    { id: 'communications', name: 'Comm Hub', icon: '📡', category: 'communications' },
    { id: 'news', name: 'News', icon: '📰', category: 'communications' },
    { id: 'speeches', name: 'Speeches', icon: '🎤', category: 'communications' },
    { id: 'witter', name: 'Witter', icon: '🐦', category: 'communications' },
    
    // Galaxy & Space
    { id: 'galaxy-map', name: 'Galaxy Map', icon: '🗺️', category: 'galaxy' },
    { id: 'conquest', name: 'Conquest', icon: '⚔️', category: 'galaxy' },
    { id: 'exploration', name: 'Exploration', icon: '🚀', category: 'galaxy' }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = (timestamp: Date): string => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="comprehensive-hud">
      {/* Command Header */}
      <div className="command-header">
        <div className="header-left">
          <span className="game-title">🌌 WITTY GALAXY</span>
          <span className="civilization-info">👑 Commander {playerId} | 🏛️ Terran Federation</span>
        </div>
        <div className="header-center">
          <span className="game-time">⏰ Tick 2847 | Speed: 2x</span>
          <span className="location">📍 {gameContext.currentLocation}</span>
        </div>
        <div className="header-right">
          <span className="treasury">💰 ${formatNumber(liveMetrics.treasury)}</span>
          <span className="approval">📊 {liveMetrics.approval}%</span>
          <span className="security">🛡️ {liveMetrics.securityLevel}%</span>
          <span className="alerts">🔔 {alerts.length}</span>
        </div>
      </div>

      <div className="hud-main">
        {/* Left Panel - Navigation */}
        <div className="left-panel">
          {/* Quick Actions Accordion */}
          <div className="accordion-section">
            <div 
              className={`accordion-header ${expandedAccordion === 'quick-actions' ? 'expanded' : ''}`}
              onClick={() => setExpandedAccordion(expandedAccordion === 'quick-actions' ? '' : 'quick-actions')}
            >
              <span className="accordion-icon">🎮</span>
              <span className="accordion-title">QUICK ACTIONS</span>
              <span className="accordion-chevron">{expandedAccordion === 'quick-actions' ? '▼' : '▶'}</span>
            </div>
            {expandedAccordion === 'quick-actions' && (
              <div className="accordion-content">
                <button className="nav-item">🚨 Crisis Mode</button>
                <button className="nav-item">📋 Daily Briefing</button>
                <button className="nav-item">🎤 Address Nation</button>
                <button className="nav-item">⚖️ Emergency Powers</button>
                <button className="nav-item">🔄 System Status</button>
              </div>
            )}
          </div>

          {/* Panel Categories as Accordions */}
          {['government', 'economy', 'security', 'population', 'science', 'communications', 'galaxy'].map(category => (
            <div key={category} className="accordion-section">
              <div 
                className={`accordion-header ${expandedAccordion === category ? 'expanded' : ''}`}
                onClick={() => setExpandedAccordion(expandedAccordion === category ? '' : category)}
              >
                <span className="accordion-icon">
                  {category === 'government' && '🏛️'}
                  {category === 'economy' && '💰'}
                  {category === 'security' && '🛡️'}
                  {category === 'population' && '👥'}
                  {category === 'science' && '🔬'}
                  {category === 'communications' && '📡'}
                  {category === 'galaxy' && '🌌'}
                </span>
                <span className="accordion-title">
                  {category === 'science' ? 'SCIENCE & TECH' : category.toUpperCase()}
                </span>
                <span className="accordion-chevron">{expandedAccordion === category ? '▼' : '▶'}</span>
              </div>
              {expandedAccordion === category && (
                <div className="accordion-content">
                  {panels.filter(p => p.category === category).map(panel => (
                    <button
                      key={panel.id}
                      className={`nav-item ${activePanel === panel.id ? 'active' : ''}`}
                      onClick={() => setActivePanel(panel.id)}
                    >
                      {panel.icon} {panel.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center Panel - Tabbed Interface */}
        <div className="center-panel">
          {activePanel === 'command-center' && (
            <>
              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button 
                  className={`tab-button ${activeTab === 'whoseapp' ? 'active' : ''}`}
                  onClick={() => setActiveTab('whoseapp')}
                >
                  💬 WhoseApp
                </button>
                <button 
                  className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
                >
                  🌟 Events
                </button>
                <button 
                  className={`tab-button ${activeTab === 'map' ? 'active' : ''}`}
                  onClick={() => setActiveTab('map')}
                >
                  🗺️ Map
                </button>
                <button 
                  className={`tab-button ${activeTab === 'witter' ? 'active' : ''}`}
                  onClick={() => setActiveTab('witter')}
                >
                  🐦 Witter
                </button>
                <button 
                  className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  📊 Analytics
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'whoseapp' && (
                  <div className="whoseapp-tab">
                    <div className="whoseapp-header">
                      <h2>💬 WHOSEAPP</h2>
                      <div className="whoseapp-status">
                        <span className="status-indicator online"></span>
                        <span>Online</span>
                      </div>
                    </div>
                    
                    <div className="whoseapp-nav">
                      <button 
                        className={`whoseapp-nav-btn ${activeWhoseAppTab === 'incoming' ? 'active' : ''}`}
                        onClick={() => setActiveWhoseAppTab('incoming')}
                      >
                        📥 Incoming
                      </button>
                      <button 
                        className={`whoseapp-nav-btn ${activeWhoseAppTab === 'people' ? 'active' : ''}`}
                        onClick={() => setActiveWhoseAppTab('people')}
                      >
                        👥 People
                      </button>
                      <button 
                        className={`whoseapp-nav-btn ${activeWhoseAppTab === 'channels' ? 'active' : ''}`}
                        onClick={() => setActiveWhoseAppTab('channels')}
                      >
                        📢 Channels
                      </button>
                    </div>

                    <div className="whoseapp-content">
                      {communicationLoading ? (
                        <div className="message-loading">
                          <div className="loading-spinner"></div>
                          <p>Loading communication data...</p>
                        </div>
                      ) : communicationError ? (
                        <div className="message-error">
                          <p>⚠️ Failed to load communication data: {communicationError}</p>
                          <button onClick={fetchCommunicationData} className="retry-btn">
                            🔄 Retry
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Incoming Messages Tab */}
                          {activeWhoseAppTab === 'incoming' && (
                            <div className="message-feed">
                              {communicationMessages.length === 0 ? (
                                <div className="no-messages">
                                  <p>📭 No messages available</p>
                                  <p>Check back later for new communications</p>
                                </div>
                              ) : (
                                communicationMessages.map((message) => {
                                  const timeAgo = getTimeAgo(new Date(message.timestamp));
                                  const isUrgent = message.content.toLowerCase().includes('urgent') || 
                                                 message.content.toLowerCase().includes('critical') ||
                                                 message.content.toLowerCase().includes('emergency');
                                  
                                  return (
                                    <div key={message.id} className={`message-item ${isUrgent ? 'urgent' : ''}`}>
                                      <div className="message-header">
                                        <div className="message-avatar">
                                          {message.senderDetails?.avatar || '👤'}
                                        </div>
                                        <div className="message-sender-info">
                                          <div className="message-sender">
                                            {message.senderDetails?.name || `Player ${message.senderId}`}
                                          </div>
                                          <div className="message-details">
                                            {message.senderDetails ? 
                                              `${message.senderDetails.civilization} • ${message.senderDetails.department} • ${message.senderDetails.role}` :
                                              `Player ID: ${message.senderId}`
                                            }
                                          </div>
                                        </div>
                                        <div className="message-time">{timeAgo}</div>
                                        {isUrgent && <div className="message-priority urgent">URGENT</div>}
                                      </div>
                                      <div className="message-content">
                                        {message.type === 'voice' ? (
                                          <>
                                            <strong>🎙️ Voice Message</strong><br/>
                                            {message.content}
                                          </>
                                        ) : (
                                          message.content
                                        )}
                                      </div>
                                      <div className="message-actions">
                                        <button className={`msg-action-btn ${isUrgent ? 'urgent' : ''}`}>
                                          📞 {message.type === 'voice' ? 'Call Back' : 'Call'}
                                        </button>
                                        <button className="msg-action-btn">✉️ Reply</button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}

                          {/* People Tab */}
                          {activeWhoseAppTab === 'people' && (
                            <div className="people-tab">
                              <div className="people-filters">
                                <div className="filter-row">
                                  <select 
                                    value={peopleFilter} 
                                    onChange={(e) => setPeopleFilter(e.target.value)}
                                    className="filter-select"
                                  >
                                    <option value="all">All Personnel</option>
                                    <option value="human">👤 Human Leaders</option>
                                    <option value="ai_leader">🤖 AI Leaders</option>
                                    <option value="ai_character">🎭 AI Characters</option>
                                    <option value="government">Government</option>
                                    <option value="military">Military</option>
                                    <option value="science">Science</option>
                                    <option value="intelligence">Intelligence</option>
                                    <option value="diplomacy">Diplomacy</option>
                                    <option value="engineering">Engineering</option>
                                    <option value="civilian">Civilian</option>
                                    <option value="online">Online Only</option>
                                  </select>
                                  <select 
                                    value={civFilter} 
                                    onChange={(e) => setCivFilter(e.target.value)}
                                    className="filter-select"
                                  >
                                    <option value="all">All Civilizations</option>
                                    <option value="Zephyrian Empire">🏛️ Zephyrian Empire</option>
                                    <option value="Centauri Republic">🏛️ Centauri Republic</option>
                                    <option value="Vegan Collective">🌱 Vegan Collective</option>
                                    <option value="Sirian Empire">⚔️ Sirian Empire</option>
                                    <option value="Kepler Technocracy">🔧 Kepler Technocracy</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder="Search by name or title..."
                                    value={peopleSearch}
                                    onChange={(e) => setPeopleSearch(e.target.value)}
                                    className="search-input"
                                  />
                                </div>
                              </div>
                              
                              <div className="people-list">
                                {(() => {
                                  let filteredPlayers = communicationPlayers;
                                  
                                  // Apply player type filter
                                  if (peopleFilter !== 'all') {
                                    if (peopleFilter === 'online') {
                                      filteredPlayers = filteredPlayers.filter(p => p.status === 'online');
                                    } else if (peopleFilter === 'human') {
                                      filteredPlayers = filteredPlayers.filter(p => p.playerType === 'human');
                                    } else if (peopleFilter === 'ai_leader') {
                                      filteredPlayers = filteredPlayers.filter(p => p.playerType === 'ai_leader');
                                    } else if (peopleFilter === 'ai_character') {
                                      filteredPlayers = filteredPlayers.filter(p => p.playerType === 'ai_character');
                                    } else {
                                      filteredPlayers = filteredPlayers.filter(p => p.jobCategory === peopleFilter);
                                    }
                                  }
                                  
                                  // Apply civilization filter
                                  if (civFilter !== 'all') {
                                    filteredPlayers = filteredPlayers.filter(p => p.civilization === civFilter);
                                  }
                                  
                                  // Apply search filter
                                  if (peopleSearch) {
                                    const searchLower = peopleSearch.toLowerCase();
                                    filteredPlayers = filteredPlayers.filter(p => 
                                      p.name.toLowerCase().includes(searchLower) ||
                                      p.title.toLowerCase().includes(searchLower) ||
                                      p.department.toLowerCase().includes(searchLower) ||
                                      p.specialization?.toLowerCase().includes(searchLower) ||
                                      p.civilization.toLowerCase().includes(searchLower)
                                    );
                                  }
                                  
                                  if (filteredPlayers.length === 0) {
                                    return (
                                      <div className="no-messages">
                                        <p>👥 No personnel found</p>
                                        <p>Try adjusting your filters or search terms</p>
                                      </div>
                                    );
                                  }
                                  
                                  return filteredPlayers.map((player) => {
                                    const getPlayerTypeIcon = (playerType: string, isLeader: boolean) => {
                                      if (playerType === 'human') return isLeader ? '👑' : '👤';
                                      if (playerType === 'ai_leader') return '🤖';
                                      if (playerType === 'ai_character') return '🎭';
                                      return '👤';
                                    };
                                    
                                    const getPlayerTypeLabel = (playerType: string, isLeader: boolean) => {
                                      if (playerType === 'human') return isLeader ? 'Human Leader' : 'Human';
                                      if (playerType === 'ai_leader') return 'AI Leader';
                                      if (playerType === 'ai_character') return 'AI Character';
                                      return 'Unknown';
                                    };
                                    
                                    return (
                                      <div key={player.id} className={`player-item ${player.playerType}`} onClick={() => console.log('Start chat with', player.id)}>
                                        <div className="player-avatar">{player.avatar || getPlayerTypeIcon(player.playerType, player.isLeader)}</div>
                                        <div className={`player-status status-${player.status}`}></div>
                                        <div className="player-type-indicator">
                                          {getPlayerTypeIcon(player.playerType, player.isLeader)}
                                        </div>
                                        <div className="player-info">
                                          <div className="player-name">
                                            {player.name}
                                            <span className="player-type-label">({getPlayerTypeLabel(player.playerType, player.isLeader)})</span>
                                          </div>
                                          <div className="player-title">{player.title} • {player.rank}</div>
                                          <div className="player-details">
                                            {player.civilization} • {player.department}
                                          </div>
                                          <div className="player-specialization">{player.specialization}</div>
                                          <div className="player-role">{player.role}</div>
                                        </div>
                                        <div className="player-actions">
                                          <button className="msg-action-btn">💬 Chat</button>
                                          <button className="msg-action-btn">📞 Call</button>
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          )}

                          {/* Channels Tab */}
                          {activeWhoseAppTab === 'channels' && (
                            <div className="channels-tab">
                              <div className="channels-header">
                                <h3>Communication Channels</h3>
                                <p>Join conversations and coordinate with your team</p>
                                <div className="channels-actions">
                                  <button 
                                    className="action-btn create-channel-btn"
                                    onClick={() => setShowCreateChannelModal(true)}
                                  >
                                    ➕ Create Channel
                                  </button>
                                  <button 
                                    className="action-btn schedule-summit-btn"
                                    onClick={() => setShowScheduleSummitModal(true)}
                                  >
                                    🏛️ Schedule Summit
                                  </button>
                                </div>
                              </div>
                              
                              <div className="channels-list">
                                {communicationConversations.length === 0 ? (
                                  <div className="no-messages">
                                    <p>📢 No channels available</p>
                                    <p>Create or join channels to start group conversations</p>
                                  </div>
                                ) : (
                                  (() => {
                                    // Group conversations by type
                                    const directMessages = communicationConversations.filter(c => c.type === 'direct');
                                    const groups = communicationConversations.filter(c => c.type === 'group');
                                    const channels = communicationConversations.filter(c => c.type === 'channel');
                                    
                                    return (
                                      <>
                                        {directMessages.length > 0 && (
                                          <div className="channel-category">
                                            <div className="category-header">💬 Direct Messages</div>
                                            {directMessages.map((conversation) => {
                                              const timeAgo = getTimeAgo(new Date(conversation.lastActivity));
                                              
                                              return (
                                                <div key={conversation.id} className="channel-item" onClick={() => setSelectedConversation(conversation.id)}>
                                                  <div className="channel-avatar">💬</div>
                                                  <div className="channel-info">
                                                    <div className="channel-name">{conversation.name}</div>
                                                    <div className="channel-description">{conversation.description}</div>
                                                    <div className="channel-activity">Last activity: {timeAgo}</div>
                                                  </div>
                                                  {conversation.unreadCount > 0 && (
                                                    <div className="channel-badge">{conversation.unreadCount}</div>
                                                  )}
                                                  <div className="channel-actions">
                                                    <button className="msg-action-btn">💬 Open</button>
                                                    <button className="msg-action-btn">📞 Call</button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                        
                                        {groups.length > 0 && (
                                          <div className="channel-category">
                                            <div className="category-header">👥 Government Groups</div>
                                            {groups.map((conversation) => {
                                              const timeAgo = getTimeAgo(new Date(conversation.lastActivity));
                                              
                                              return (
                                                <div key={conversation.id} className="channel-item" onClick={() => setSelectedConversation(conversation.id)}>
                                                  <div className="channel-avatar">👥</div>
                                                  <div className="channel-info">
                                                    <div className="channel-name">{conversation.name}</div>
                                                    <div className="channel-description">{conversation.description}</div>
                                                    <div className="channel-details">
                                                      {conversation.participants.length} members • Last activity: {timeAgo}
                                                    </div>
                                                  </div>
                                                  {conversation.unreadCount > 0 && (
                                                    <div className="channel-badge">{conversation.unreadCount}</div>
                                                  )}
                                                  <div className="channel-actions">
                                                    <button className="msg-action-btn">💬 Join</button>
                                                    <button className="msg-action-btn">🔊 Voice</button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                        
                                        {channels.length > 0 && (
                                          <div className="channel-category">
                                            <div className="category-header">🌌 Inter-Galactic Channels</div>
                                            {channels.map((conversation) => {
                                              const timeAgo = getTimeAgo(new Date(conversation.lastActivity));
                                              
                                              return (
                                                <div key={conversation.id} className="channel-item" onClick={() => setSelectedConversation(conversation.id)}>
                                                  <div className="channel-avatar">🌌</div>
                                                  <div className="channel-info">
                                                    <div className="channel-name">{conversation.name}</div>
                                                    <div className="channel-description">{conversation.description}</div>
                                                    <div className="channel-details">
                                                      {conversation.participants.length} civilizations • Last activity: {timeAgo}
                                                    </div>
                                                  </div>
                                                  {conversation.unreadCount > 0 && (
                                                    <div className="channel-badge urgent">{conversation.unreadCount}</div>
                                                  )}
                                                  <div className="channel-actions">
                                                    <button className="msg-action-btn">💬 Join</button>
                                                    <button className="msg-action-btn">🔊 Voice</button>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="whoseapp-actions">
                        <button className="action-btn">📞 Voice Call</button>
                        <button className="action-btn">✉️ New Message</button>
                      </div>

                      {/* Create Channel Modal */}
                      {showCreateChannelModal && (
                        <div className="modal-overlay" onClick={() => setShowCreateChannelModal(false)}>
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                              <h3>Create Custom Channel</h3>
                              <button className="modal-close" onClick={() => setShowCreateChannelModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const selectedParticipants = Array.from(formData.getAll('participants')) as string[];
                                
                                createCustomChannel({
                                  name: formData.get('name') as string,
                                  description: formData.get('description') as string,
                                  type: formData.get('type') as 'group' | 'channel',
                                  participants: [playerId, ...selectedParticipants]
                                });
                              }}>
                                <div className="form-group">
                                  <label>Channel Name:</label>
                                  <input type="text" name="name" required placeholder="Enter channel name" />
                                </div>
                                <div className="form-group">
                                  <label>Description:</label>
                                  <textarea name="description" placeholder="Describe the channel purpose" />
                                </div>
                                <div className="form-group">
                                  <label>Type:</label>
                                  <select name="type" required>
                                    <option value="group">Government Group</option>
                                    <option value="channel">Inter-Galactic Channel</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label>Participants:</label>
                                  <div className="participants-list">
                                    {communicationPlayers.filter(p => p.id !== playerId).map(player => (
                                      <label key={player.id} className="participant-checkbox">
                                        <input type="checkbox" name="participants" value={player.id} />
                                        <span>{player.name} ({player.civilization})</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <div className="modal-actions">
                                  <button type="button" onClick={() => setShowCreateChannelModal(false)}>Cancel</button>
                                  <button type="submit" className="primary">Create Channel</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Schedule Summit Modal */}
                      {showScheduleSummitModal && (
                        <div className="modal-overlay" onClick={() => setShowScheduleSummitModal(false)}>
                          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                              <h3>Schedule Diplomatic Summit</h3>
                              <button className="modal-close" onClick={() => setShowScheduleSummitModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                const selectedParticipants = Array.from(formData.getAll('participants')) as string[];
                                
                                scheduleSummit({
                                  name: formData.get('name') as string,
                                  participants: [playerId, ...selectedParticipants],
                                  scheduledTime: formData.get('scheduledTime') as string,
                                  agenda: formData.get('agenda') as string,
                                  description: formData.get('description') as string,
                                  priority: formData.get('priority') as 'low' | 'normal' | 'high'
                                });
                              }}>
                                <div className="form-group">
                                  <label>Summit Name:</label>
                                  <input type="text" name="name" required placeholder="Enter summit name" />
                                </div>
                                <div className="form-group">
                                  <label>Scheduled Time:</label>
                                  <input type="datetime-local" name="scheduledTime" required />
                                </div>
                                <div className="form-group">
                                  <label>Agenda:</label>
                                  <textarea name="agenda" required placeholder="Summit agenda and topics" />
                                </div>
                                <div className="form-group">
                                  <label>Description:</label>
                                  <textarea name="description" placeholder="Additional summit details" />
                                </div>
                                <div className="form-group">
                                  <label>Priority:</label>
                                  <select name="priority" required>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="low">Low</option>
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label>Participants (Human Leaders Recommended):</label>
                                  <div className="participants-list">
                                    {communicationPlayers
                                      .filter(p => p.id !== playerId)
                                      .sort((a, b) => {
                                        // Sort human leaders first
                                        if (a.playerType === 'human' && b.playerType !== 'human') return -1;
                                        if (a.playerType !== 'human' && b.playerType === 'human') return 1;
                                        return a.name.localeCompare(b.name);
                                      })
                                      .map(player => (
                                        <label key={player.id} className="participant-checkbox">
                                          <input type="checkbox" name="participants" value={player.id} />
                                          <span>
                                            {player.playerType === 'human' ? '👤' : player.playerType === 'ai_leader' ? '🤖' : '🎭'} 
                                            {player.name} ({player.civilization})
                                            {player.playerType === 'human' && <span className="human-leader-badge">Human Leader</span>}
                                          </span>
                                        </label>
                                      ))}
                                  </div>
                                </div>
                                <div className="modal-actions">
                                  <button type="button" onClick={() => setShowScheduleSummitModal(false)}>Cancel</button>
                                  <button type="submit" className="primary">Schedule Summit</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="events-tab">
                    <h2>🌟 GAME MASTER EVENTS</h2>
                    <div className="gamemaster-events">
                      {gameMasterEvents.map(event => (
                        <div key={event.id} className={`gamemaster-event ${event.type}`}>
                          <div className="event-header">
                            <span className="event-title">{event.title}</span>
                            <span className="event-time">{getTimeAgo(event.timestamp)}</span>
                          </div>
                          <div className="event-content">
                            {event.visualContent && (
                              <img src={event.visualContent} alt={event.title} className="event-visual" />
                            )}
                            <p>{event.description}</p>
                            {event.requiresResponse && (
                              <button className="response-btn">Respond</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="map-tab">
                    <h2>🗺️ GALAXY MAP</h2>
                    <div className="embedded-galaxy-map">
                      <GalaxyMapComponent gameContext={gameContext} />
                    </div>
                  </div>
                )}

                {/* Keep the old map as backup - remove this section */}
                {false && (
                  <div className="map-tab-old">
                    <div className="embedded-galaxy-map">
                      <div className="galaxy-map-container">
                        <div className="galaxy-controls">
                          <button className="zoom-btn" onClick={() => console.log('Zoom in')}>🔍 Zoom In</button>
                          <button className="zoom-btn" onClick={() => console.log('Zoom out')}>🔍 Zoom Out</button>
                          <select className="layer-select">
                            <option value="political">🏛️ Political</option>
                            <option value="economic">💰 Economic</option>
                            <option value="military">⚔️ Military</option>
                            <option value="diplomatic">🤝 Diplomatic</option>
                          </select>
                        </div>
                        
                        <div className="galaxy-viewport">
                          <div className="star-field">
                            {/* Background stars */}
                            {Array.from({ length: 100 }, (_, i) => (
                              <div
                                key={`bg-star-${i}`}
                                className="background-star"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                  animationDelay: `${Math.random() * 3}s`
                                }}
                              />
                            ))}
                            
                            {/* Major star systems */}
                            <div className="star-system sol-system" style={{ left: '20%', top: '30%' }}>
                              <div className="system-glow"></div>
                              <div className="system-icon">⭐</div>
                              <div className="system-label">
                                <div className="system-name">Sol System</div>
                                <div className="system-info">Capital | Pop: 2.8M</div>
                              </div>
                            </div>
                            
                            <div className="star-system kepler-system" style={{ left: '70%', top: '20%' }}>
                              <div className="system-glow"></div>
                              <div className="system-icon">🌟</div>
                              <div className="system-label">
                                <div className="system-name">Kepler-442</div>
                                <div className="system-info">Colony | Pop: 450K</div>
                              </div>
                            </div>
                            
                            <div className="star-system centauri-system" style={{ left: '45%', top: '70%' }}>
                              <div className="system-glow"></div>
                              <div className="system-icon">✨</div>
                              <div className="system-label">
                                <div className="system-name">Alpha Centauri</div>
                                <div className="system-info">Trade Hub | Pop: 1.2M</div>
                              </div>
                            </div>
                            
                            <div className="star-system vega-system" style={{ left: '80%', top: '60%' }}>
                              <div className="system-glow"></div>
                              <div className="system-icon">💫</div>
                              <div className="system-label">
                                <div className="system-name">Vega Prime</div>
                                <div className="system-info">Research | Pop: 890K</div>
                              </div>
                            </div>
                            
                            {/* Trade routes */}
                            <svg className="trade-routes" viewBox="0 0 100 100">
                              <defs>
                                <linearGradient id="tradeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="transparent" />
                                  <stop offset="50%" stopColor="#4ecdc4" />
                                  <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                              </defs>
                              <line x1="20" y1="30" x2="70" y2="20" stroke="url(#tradeGradient)" strokeWidth="0.5" className="trade-route" />
                              <line x1="20" y1="30" x2="45" y2="70" stroke="url(#tradeGradient)" strokeWidth="0.5" className="trade-route" />
                              <line x1="70" y1="20" x2="80" y2="60" stroke="url(#tradeGradient)" strokeWidth="0.5" className="trade-route" />
                              <line x1="45" y1="70" x2="80" y2="60" stroke="url(#tradeGradient)" strokeWidth="0.5" className="trade-route" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="galaxy-info">
                          <div className="info-panel">
                            <h4>🌌 Startales Galaxy</h4>
                            <p>Spiral Galaxy | Age: 13.8B years</p>
                            <p>Systems: 247 | Civilizations: 8</p>
                            <p>Current Location: {gameContext.currentLocation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'witter' && (
                  <div className="witter-tab">
                    <h2>🐦 WITTY GALAXY SOCIAL NETWORK</h2>
                    <SimpleWitterFeed 
                      playerId={playerId}
                      gameContext={gameContext}
                      className="embedded-witter"
                    />
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="analytics-tab">
                    <h2>📊 COMPREHENSIVE ANALYTICS</h2>
                    
                    {/* Government Overview */}
                    <div className="analytics-section">
                      <h3>🏛️ Government</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">👑</span>
                            <span className="card-title">Leadership</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Approval Rating:</span>
                              <span className="metric-value">{liveMetrics.approval}%</span>
                            </div>
                            <div className="metric-row">
                              <span>Stability:</span>
                              <span className="metric-value">High</span>
                            </div>
                            <div className="metric-row">
                              <span>Policy Efficiency:</span>
                              <span className="metric-value">87%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">⚖️</span>
                            <span className="card-title">Justice System</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Crime Rate:</span>
                              <span className="metric-value">2.3%</span>
                            </div>
                            <div className="metric-row">
                              <span>Court Efficiency:</span>
                              <span className="metric-value">94%</span>
                            </div>
                            <div className="metric-row">
                              <span>Legal Compliance:</span>
                              <span className="metric-value">96%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Military Overview */}
                    <div className="analytics-section">
                      <h3>⚔️ Military</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🚀</span>
                            <span className="card-title">Fleet Status</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Active Fleets:</span>
                              <span className="metric-value">12</span>
                            </div>
                            <div className="metric-row">
                              <span>Readiness:</span>
                              <span className="metric-value">{liveMetrics.militaryStrength}%</span>
                            </div>
                            <div className="metric-row">
                              <span>Deployment:</span>
                              <span className="metric-value">Strategic</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🛡️</span>
                            <span className="card-title">Defense</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Security Level:</span>
                              <span className="metric-value">{liveMetrics.securityLevel}%</span>
                            </div>
                            <div className="metric-row">
                              <span>Threat Level:</span>
                              <span className="metric-value">{liveMetrics.threatLevel}</span>
                            </div>
                            <div className="metric-row">
                              <span>Border Security:</span>
                              <span className="metric-value">Secure</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Economy Overview */}
                    <div className="analytics-section">
                      <h3>💰 Economy</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">📈</span>
                            <span className="card-title">Economic Health</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>GDP:</span>
                              <span className="metric-value">${formatNumber(liveMetrics.gdp)}</span>
                            </div>
                            <div className="metric-row">
                              <span>Growth Rate:</span>
                              <span className="metric-value">+3.2%</span>
                            </div>
                            <div className="metric-row">
                              <span>Inflation:</span>
                              <span className="metric-value">1.8%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🏦</span>
                            <span className="card-title">Treasury</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Balance:</span>
                              <span className="metric-value">${formatNumber(liveMetrics.treasury)}</span>
                            </div>
                            <div className="metric-row">
                              <span>Revenue:</span>
                              <span className="metric-value">+12.5M/day</span>
                            </div>
                            <div className="metric-row">
                              <span>Expenses:</span>
                              <span className="metric-value">-8.3M/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Intelligence & Research */}
                    <div className="analytics-section">
                      <h3>🔬 Intelligence & Research</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🕵️</span>
                            <span className="card-title">Intelligence</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Network Coverage:</span>
                              <span className="metric-value">89%</span>
                            </div>
                            <div className="metric-row">
                              <span>Active Operations:</span>
                              <span className="metric-value">7</span>
                            </div>
                            <div className="metric-row">
                              <span>Threat Detection:</span>
                              <span className="metric-value">High</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🧪</span>
                            <span className="card-title">Research</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Active Projects:</span>
                              <span className="metric-value">{liveMetrics.researchProjects}</span>
                            </div>
                            <div className="metric-row">
                              <span>Breakthrough Rate:</span>
                              <span className="metric-value">23%</span>
                            </div>
                            <div className="metric-row">
                              <span>Tech Level:</span>
                              <span className="metric-value">Advanced</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Civilization Relationships */}
                    <div className="analytics-section">
                      <h3>🌌 Civilization Relations</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🤝</span>
                            <span className="card-title">Diplomatic Status</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Allies:</span>
                              <span className="metric-value">3</span>
                            </div>
                            <div className="metric-row">
                              <span>Neutral:</span>
                              <span className="metric-value">5</span>
                            </div>
                            <div className="metric-row">
                              <span>Hostile:</span>
                              <span className="metric-value">1</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🛸</span>
                            <span className="card-title">Trade Relations</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Trade Partners:</span>
                              <span className="metric-value">6</span>
                            </div>
                            <div className="metric-row">
                              <span>Trade Volume:</span>
                              <span className="metric-value">2.4B credits</span>
                            </div>
                            <div className="metric-row">
                              <span>Trade Balance:</span>
                              <span className="metric-value">+340M</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Population & Demographics */}
                    <div className="analytics-section">
                      <h3>👥 Population</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🏙️</span>
                            <span className="card-title">Demographics</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Total Population:</span>
                              <span className="metric-value">{formatNumber(liveMetrics.population)}</span>
                            </div>
                            <div className="metric-row">
                              <span>Growth Rate:</span>
                              <span className="metric-value">+1.2%</span>
                            </div>
                            <div className="metric-row">
                              <span>Happiness Index:</span>
                              <span className="metric-value">78%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="analytics-card">
                          <div className="card-header">
                            <span className="card-icon">🎓</span>
                            <span className="card-title">Education & Health</span>
                          </div>
                          <div className="card-content">
                            <div className="metric-row">
                              <span>Education Level:</span>
                              <span className="metric-value">Advanced</span>
                            </div>
                            <div className="metric-row">
                              <span>Health Index:</span>
                              <span className="metric-value">92%</span>
                            </div>
                            <div className="metric-row">
                              <span>Life Expectancy:</span>
                              <span className="metric-value">127 years</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Render specific panels based on activePanel */}
          {activePanel === 'trade' && <TradeEconomics playerId={playerId} gameContext={gameContext} onClose={() => setActivePanel('command-center')} />}
          
          {/* Dynamic Screen Content */}
          {activePanel !== 'command-center' && activePanel !== 'trade' && (
            <div className="panel-screen">
              {createScreen(activePanel, gameContext)}
            </div>
          )}
        </div>

        {/* Right Panel - Live Metrics */}
        <div className="right-panel">
          <div className="live-metrics">
            <h3>📊 LIVE METRICS</h3>
            
            <div className="metric">
              <span className="metric-label">Population:</span>
              <span className="metric-value">{formatNumber(liveMetrics.population)}</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: '85%'}}></div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-label">GDP:</span>
              <span className="metric-value">${formatNumber(liveMetrics.gdp)}</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: '78%'}}></div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-label">Military:</span>
              <span className="metric-value">{liveMetrics.militaryStrength}%</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: `${liveMetrics.militaryStrength}%`}}></div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-label">Research:</span>
              <span className="metric-value">{liveMetrics.researchProjects} projects</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>

          <div className="active-missions">
            <h3>🎯 ACTIVE MISSIONS</h3>
            <div className="mission">📡 Establish Kepler Outpost</div>
            <div className="mission">🔬 Quantum Research Initiative</div>
            <div className="mission">🤝 Centauri Trade Agreement</div>
          </div>

          <div className="live-alerts">
            <h3>🔔 LIVE ALERTS</h3>
            {alerts.map(alert => (
              <div key={alert.id} className={`alert ${alert.type}`}>
                <span className="alert-icon">
                  {alert.type === 'critical' && '🚨'}
                  {alert.type === 'warning' && '⚠️'}
                  {alert.type === 'info' && 'ℹ️'}
                </span>
                <span className="alert-message">{alert.message}</span>
                {alert.count > 1 && <span className="alert-count">({alert.count})</span>}
              </div>
            ))}
          </div>

          <div className="game-master-section">
            <h3>🎮 GAME MASTER</h3>
            <div className="gm-content">
              <p>🎭 "The discovery on Kepler-442b has attracted attention from neighboring civilizations..."</p>
              <p>🌟 "Your economic policies are showing remarkable results across the galaxy."</p>
            </div>
          </div>

          <div className="civilization-stats">
            <h3>📈 ALL CIVILIZATIONS</h3>
            <div className="civ-comparison">
              <div className="civ-entry">
                <span className="civ-name">Terran Federation</span>
                <span className="civ-score">2847</span>
              </div>
              <div className="civ-entry">
                <span className="civ-name">Vega Alliance</span>
                <span className="civ-score">2634</span>
              </div>
              <div className="civ-entry">
                <span className="civ-name">Centauri Republic</span>
                <span className="civ-score">2512</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>🎮 Simulation: Active | Speed: 2x | Next Tick: 45s</span>
        <span>📊 Performance: 94% | 💾 Auto-Save: Enabled | 🔄 Last Sync: 2s ago</span>
        <span>🌐 Online | 👥 Players: 1,247 | 🌌 Galaxy: Milky Way Sector 7</span>
      </div>
    </div>
  );
};
