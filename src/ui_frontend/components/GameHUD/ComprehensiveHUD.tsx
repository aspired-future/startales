import React, { useState, useEffect } from 'react';
import './ComprehensiveHUD.css';
import { useWhoseAppWebSocket } from '../../hooks/useWhoseAppWebSocket';
import { WhoseAppMain } from '../WhoseApp/WhoseAppMain';

// Import all the specialized components
import { SimpleWitterFeed } from '../Witter/SimpleWitterFeed';
import StoryScreen from './screens/extracted/StoryScreen';
import { GalaxyMapComponent } from './GalaxyMapComponent';
import { TradeEconomics } from './TradeEconomics';
import { createScreen } from './screens/ScreenFactory';

// Import Quick Action screens
import {
  CrisisResponseScreen,
  DailyBriefingScreen,
  AddressNationScreen,
  EmergencyPowersScreen,
  SystemStatusScreen,
  QuickActionScreenType
} from './screens/quickactions';

// Import Popup components
import { PanelPopup } from './screens/PanelPopup';

import { MapPopup } from './screens/MapPopup';
import { GovernmentBondsScreen } from './screens/GovernmentBondsScreen';

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
  debtToGDP: number;
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
  const [activePanel, setActivePanel] = useState<string>('story');
  const [activeTab, setActiveTab] = useState<'story' | 'map' | 'whoseapp' | 'witter' | 'galaxy' | 'civ'>('story');
  const [expandedAccordion, setExpandedAccordion] = useState<string>('quick-actions');
  
  // Unread count states
  const [storyUnreadCount, setStoryUnreadCount] = useState<number>(3);
  const [whoseappUnreadCount, setWhoseappUnreadCount] = useState<number>(7);
  const [witterUnreadCount, setWitterUnreadCount] = useState<number>(12);
  const [activeQuickAction, setActiveQuickAction] = useState<QuickActionScreenType | null>(null);
  
  // Popup state management
  const [activePanelPopup, setActivePanelPopup] = useState<string | null>(null);

  const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);

  // WhoseApp WebSocket integration for real-time updates
  const whoseAppData = useWhoseAppWebSocket({
    civilizationId: playerId,
    autoConnect: true
  });
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
    threatLevel: 'Medium',
    debtToGDP: 0.42 // 42% debt-to-GDP ratio
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
    { id: '1', type: 'critical', message: 'Mars Colony is reporting critical resource shortages', count: 1 },
    { id: '2', type: 'warning', message: 'Relations with the Vega Federation are getting tense', count: 3 },
    { id: '3', type: 'info', message: 'We have five research projects that should be wrapping up soon', count: 5 }
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

  // Refresh functions for tabs
  const refreshStoryData = () => {
    console.log('Refreshing story data...');
    setStoryUnreadCount(0); // Clear unread count when refreshed
    // Add actual refresh logic here
  };

  const refreshMapData = () => {
    console.log('Refreshing map data...');
    // Add actual refresh logic here
  };

  const refreshWhoseAppData = () => {
    console.log('Refreshing WhoseApp data...');
    setWhoseappUnreadCount(0); // Clear unread count when refreshed
    fetchCommunicationData();
  };

  const refreshWitterData = () => {
    console.log('Refreshing Witter data...');
    setWitterUnreadCount(0); // Clear unread count when refreshed
    // Add actual refresh logic here
  };

  const refreshGalaxyData = () => {
    console.log('Refreshing galaxy data...');
    // Add actual refresh logic here
  };

  const refreshCivData = () => {
    console.log('Refreshing civilization data...');
    // Add actual refresh logic here
  };

  const refreshMissionsData = () => {
    console.log('Refreshing missions data...');
    // Add actual refresh logic here
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
      setActiveTab('whoseapp');
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
    { id: 'constitution', name: 'Constitution', icon: '📜', category: 'government' },
    { id: 'cabinet', name: 'Cabinet', icon: '👥', category: 'government' },
    { id: 'policies', name: 'Policies', icon: '⚖️', category: 'government' },
    { id: 'legislature', name: 'Legislature', icon: '🏛️', category: 'government' },
    { id: 'supreme-court', name: 'Supreme Court', icon: '⚖️', category: 'government' },
    { id: 'institutional-override', name: 'Override System', icon: '⚖️', category: 'government' },

    { id: 'political-parties', name: 'Political Parties', icon: '🎭', category: 'government' },
    { id: 'government', name: 'Performance', icon: '📊', category: 'government' },
    
    // Economy & Trade
    { id: 'treasury', name: 'Treasury', icon: '💰', category: 'economy' },
    { id: 'business-cycle', name: 'Business Cycle', icon: '📊', category: 'economy' },
    { id: 'trade', name: 'Trade', icon: '📈', category: 'economy' },
    { id: 'businesses', name: 'Business Ecosystem', icon: '🏢', category: 'economy' },
    { id: 'central-bank', name: 'Central Bank', icon: '🏦', category: 'economy' },
    { id: 'sovereign-wealth-fund', name: 'Sovereign Fund', icon: '💰', category: 'economy' },
    { id: 'government-bonds', name: 'Gov Bonds', icon: '💎', category: 'economy' },
    { id: 'financial-markets', name: 'Markets', icon: '📊', category: 'economy' },
    { id: 'economic-ecosystem', name: 'Economy', icon: '🌐', category: 'economy' },
    { id: 'government-contracts', name: 'Gov Contracts', icon: '📜', category: 'economy' },
    
    // Military & Security
    { id: 'military', name: 'Military', icon: '🛡️', category: 'security' },
    { id: 'defense', name: 'Defense', icon: '🏰', category: 'security' },
    { id: 'security', name: 'Security', icon: '🔒', category: 'security' },
    { id: 'joint-chiefs', name: 'Joint Chiefs', icon: '⭐', category: 'security' },
    { id: 'intelligence', name: 'Intelligence', icon: '🕵️', category: 'security' },
    { id: 'export-controls', name: 'Export Controls', icon: '🛡️', category: 'security' },
    
    // Population & Society
    { id: 'demographics', name: 'Demographics', icon: '👥', category: 'population' },
    { id: 'cities', name: 'Planets & Cities', icon: '🌍', category: 'population' },
    { id: 'migration', name: 'Migration', icon: '🚶', category: 'population' },
    { id: 'professions', name: 'Professions', icon: '💼', category: 'population' },
    { id: 'education', name: 'Education', icon: '🎓', category: 'population' },
    { id: 'health', name: 'Health & Welfare', icon: '🏥', category: 'population' },
    { id: 'household-economics', name: 'Households', icon: '🏠', category: 'population' },
    { id: 'entertainment-tourism', name: 'Culture', icon: '🎭', category: 'population' },
    
    // Game Master Controls (Admin Only)
    { id: 'character-awareness', name: 'Character AI Control', icon: '🧠', category: 'gamemaster' },
    
    // Science & Technology (All Research Consolidated)
    { id: 'government-research', name: 'Government R&D', icon: '🏛️', category: 'science' },
    { id: 'corporate-research', name: 'Corporate R&D', icon: '🏢', category: 'science' },
    { id: 'university-research', name: 'University Research', icon: '🏫', category: 'science' },
    { id: 'classified-research', name: 'Classified Projects', icon: '🔒', category: 'science' },
    { id: 'technology', name: 'Science & Tech', icon: '⚙️', category: 'science' },
    
    // Communications
    { id: 'communications', name: 'Comm Hub', icon: '📡', category: 'communications' },
    { id: 'news', name: 'News', icon: '📰', category: 'communications' },
    { id: 'speeches', name: 'Speeches', icon: '🎤', category: 'communications' },
    { id: 'witter', name: 'Witter', icon: '🐦', category: 'communications' },
    { id: 'whoseapp', name: 'WhoseApp', icon: '📱', category: 'communications' },
    
    // Galaxy & Space
    { id: 'galaxy-map', name: 'Galaxy Map', icon: '🗺️', category: 'galaxy' },
    { id: 'galaxy-data', name: 'Galaxy Data', icon: '🌌', category: 'galaxy' },
    { id: 'conquest', name: 'Conquest', icon: '⚔️', category: 'galaxy' },
    { id: 'exploration', name: 'Exploration', icon: '🚀', category: 'galaxy' },
    { id: 'world-wonders', name: 'Galaxy Wonders', icon: '🏛️', category: 'galaxy' },
    { id: 'visual-systems', name: 'Visuals', icon: '🎨', category: 'galaxy' },
    
    // System Controls
    { id: 'enhanced-knobs-control', name: 'Enhanced Knobs', icon: '🎛️', category: 'system' }
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
          <span className="game-title">🌌 LIVELYGALAXY.AI</span>
          <span className="civilization-info">👑 Commander {playerId} | 🏛️ Terran Federation</span>
        </div>
        <div className="header-center">
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
                <button 
                  className="nav-item"
                  onClick={() => setActiveQuickAction('crisis-response')}
                >
                  🚨 Crisis Response
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActiveQuickAction('daily-briefing')}
                >
                  📋 Daily Briefing
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActiveQuickAction('address-nation')}
                >
                  🎤 Address Nation
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActiveQuickAction('emergency-powers')}
                >
                  ⚖️ Emergency Powers
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActiveQuickAction('system-status')}
                >
                  🔄 System Status
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActivePanel('missions')}
                >
                  🎯 Missions
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActivePanel('story')}
                >
                  📖 Story
                </button>
                <button 
                  className="nav-item"
                  onClick={() => setActivePanel('civilization-overview')}
                >
                  🏛️ Civilization
                </button>
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
                      className={`nav-item ${
                        panel.id === 'whoseapp' 
                          ? (activePanel === 'command-center' && activeTab === 'whoseapp' ? 'active' : '')
                          : (activePanelPopup === panel.id ? 'active' : '')
                      }`}
                      onClick={() => {
                        if (panel.id === 'galaxy-map') {
                          // Open the same map popup as the center tab
                          setIsMapPopupOpen(true);
                        } else if (panel.id === 'galaxy-data') {
                          // Open Galaxy Data as a proper screen, not a popup
                          setActivePanel('galaxy-data');
                        } else if (panel.id === 'whoseapp') {
                          // Open WhoseApp as a popup (same as right panel)
                          setActivePanelPopup(panel.id);
                        } else {
                          setActivePanelPopup(panel.id);
                        }
                      }}
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
              {/* Welcome Message - No more redundant tabs */}
              <div className="welcome-header">
                <h2>🌌 Command Center</h2>
                <p>Use the right panel buttons to navigate to different sections of your galactic empire.</p>
              </div>

              {/* Quick Stats Overview */}
              <div className="command-center-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <div className="stat-label">Population</div>
                      <div className="stat-value">{formatNumber(liveMetrics.population)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <div className="stat-label">Treasury</div>
                      <div className="stat-value">${formatNumber(liveMetrics.treasury)}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-label">Approval</div>
                      <div className="stat-value">{liveMetrics.approval}%</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚔️</div>
                    <div className="stat-info">
                      <div className="stat-label">Military</div>
                      <div className="stat-value">{liveMetrics.militaryStrength}%</div>
                    </div>
                  </div>
                </div>
              </div>

            </>
          )}

          {/* Render specific panels based on activePanel */}
          {activePanel === 'trade' && <TradeEconomics playerId={playerId} gameContext={gameContext} onClose={() => setActivePanel('story')} />}
          {activePanel === 'whoseapp' && (
            <div className="panel-screen">
              <WhoseAppMain 
                playerId={playerId}
                gameContext={gameContext}
              />
            </div>
          )}
          
          {/* Dynamic Screen Content */}
          {activePanel !== 'command-center' && activePanel !== 'trade' && activePanel !== 'galaxy-map' && activePanel !== 'whoseapp' && (
            <div className="panel-screen">
              {createScreen(activePanel, gameContext)}
            </div>
          )}
        </div>

        {/* Right Panel - Quick Access & Info */}
        <div className="right-panel">
          {/* Wide Square Buttons Grid */}
          <div className="quick-access-grid">
            <button 
              className={`quick-access-btn ${activePanel === 'story' ? 'active' : ''}`}
              onClick={() => setActivePanel('story')}
            >
              <div className="btn-icon">📖</div>
              <div className="btn-label">Story</div>
              {storyUnreadCount > 0 && <span className="unread-badge">{storyUnreadCount}</span>}
            </button>
            <button 
              className={`quick-access-btn ${isMapPopupOpen ? 'active' : ''}`}
              onClick={() => setIsMapPopupOpen(true)}
            >
              <div className="btn-icon">🗺️</div>
              <div className="btn-label">Map</div>
            </button>
            <button 
              className={`quick-access-btn ${activePanel === 'whoseapp' ? 'active' : ''}`}
              onClick={() => setActivePanel('whoseapp')}
            >
              <div className="btn-icon">💬</div>
              <div className="btn-label">WhoseApp</div>
              {whoseappUnreadCount > 0 && <span className="unread-badge">{whoseappUnreadCount}</span>}
            </button>
            <button 
              className={`quick-access-btn ${activePanel === 'witter' ? 'active' : ''}`}
              onClick={() => setActivePanel('witter')}
            >
              <div className="btn-icon">🐦</div>
              <div className="btn-label">Witter</div>
              {witterUnreadCount > 0 && <span className="unread-badge">{witterUnreadCount}</span>}
            </button>
            <button 
              className={`quick-access-btn ${activePanel === 'galaxy-data' ? 'active' : ''}`}
              onClick={() => setActivePanel('galaxy-data')}
            >
              <div className="btn-icon">🌌</div>
              <div className="btn-label">Galaxy</div>
            </button>
            <button 
              className={`quick-access-btn ${activePanel === 'civilization-overview' ? 'active' : ''}`}
              onClick={() => setActivePanel('civilization-overview')}
            >
              <div className="btn-icon">🏛️</div>
              <div className="btn-label">Civ</div>
            </button>
          </div>

          {/* Active Missions Section */}
          <div className="active-missions-section">
            <div className="section-header">
              <h3>🎯 ACTIVE MISSIONS</h3>
              <button className="refresh-btn" onClick={() => refreshMissionsData()}>🔄</button>
            </div>
            <div className="missions-list">
              <div className="mission-item">
                <div className="mission-header">
                  <span className="mission-icon">🔍</span>
                  <span className="mission-title">Explore Kepler System</span>
                </div>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '65%'}}></div>
                  </div>
                  <span className="progress-text">65%</span>
                </div>
                <div className="mission-status">
                  <span className="status-badge active">Active</span>
                  <span className="mission-time">12 days left</span>
                </div>
              </div>

              <div className="mission-item">
                <div className="mission-header">
                  <span className="mission-icon">🤝</span>
                  <span className="mission-title">Diplomatic Contact</span>
                </div>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '30%'}}></div>
                  </div>
                  <span className="progress-text">30%</span>
                </div>
                <div className="mission-status">
                  <span className="status-badge active">Active</span>
                  <span className="mission-time">8 days left</span>
                </div>
              </div>

              <div className="mission-item">
                <div className="mission-header">
                  <span className="mission-icon">⚔️</span>
                  <span className="mission-title">Border Defense</span>
                </div>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '85%'}}></div>
                  </div>
                  <span className="progress-text">85%</span>
                </div>
                <div className="mission-status">
                  <span className="status-badge critical">Critical</span>
                  <span className="mission-time">3 days left</span>
                </div>
              </div>
            </div>
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
              <div className="gm-category">
                <h4>🎯 Mission Opportunities</h4>
                <div className="gamemaster-event discovery">
                  <span className="event-icon">🔍</span>
                  <span className="event-text">Investigate the anomalous readings from Sector 7-G</span>
                  <span className="event-reward">+500 Research Points</span>
                </div>
                <div className="gamemaster-event achievement">
                  <span className="event-icon">💰</span>
                  <span className="event-text">Establish trade route with the Zephyrian Empire</span>
                  <span className="event-reward">+15% GDP Growth</span>
                </div>
              </div>
              <div className="gm-category">
                <h4>⚠️ Player Alerts</h4>
                <div className="gamemaster-event warning">
                  <span className="event-icon">🚨</span>
                  <span className="event-text">Your approval rating has dropped to 73% - consider policy adjustments</span>
                </div>
                <div className="gamemaster-event info">
                  <span className="event-icon">📊</span>
                  <span className="event-text">New diplomatic opportunity available with Stellar Confederation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="civilization-stats">
            <h3>🏆 LEADING CIVILIZATIONS</h3>
            <div className="civ-comparison">
              <div className="civ-entry">
                <span className="civ-rank">1.</span>
                <span className="civ-name">Terran Federation</span>
                <span className="civ-score">2847</span>
              </div>
              <div className="civ-entry">
                <span className="civ-rank">2.</span>
                <span className="civ-name">Vega Alliance</span>
                <span className="civ-score">2634</span>
              </div>
              <div className="civ-entry">
                <span className="civ-rank">3.</span>
                <span className="civ-name">Centauri Republic</span>
                <span className="civ-score">2512</span>
              </div>
              <div className="civ-entry">
                <span className="civ-rank">4.</span>
                <span className="civ-name">Andromeda Empire</span>
                <span className="civ-score">2398</span>
              </div>
              <div className="civ-entry">
                <span className="civ-rank">5.</span>
                <span className="civ-name">Orion Collective</span>
                <span className="civ-score">2156</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span>🌌 Galaxy: Milky Way Sector 7 | 🌟 Systems: 2,847 | 🔍 Explored: 73%</span>
        <span>⏰ Tick: 2847 | 💾 Auto-Save: Enabled | 🔄 Last Sync: 2s ago</span>
        <span>🌐 Online | 👥 Active Players: 1,247 | 🏛️ Active Civilizations: 156</span>
      </div>

      {/* Quick Action Screens */}
      <CrisisResponseScreen
        isVisible={activeQuickAction === 'crisis-response'}
        onClose={() => setActiveQuickAction(null)}
      />
      <DailyBriefingScreen
        isVisible={activeQuickAction === 'daily-briefing'}
        onClose={() => setActiveQuickAction(null)}
      />
      <AddressNationScreen
        isVisible={activeQuickAction === 'address-nation'}
        onClose={() => setActiveQuickAction(null)}
        onOpenScreen={(screenId) => {
          // Handle opening other screens like the speeches screen
          console.log(`Opening screen: ${screenId}`);
          setActivePanel(screenId);
          setActiveQuickAction(null);
        }}
      />
      <EmergencyPowersScreen
        isVisible={activeQuickAction === 'emergency-powers'}
        onClose={() => setActiveQuickAction(null)}
      />
      <SystemStatusScreen
        isVisible={activeQuickAction === 'system-status'}
        onClose={() => setActiveQuickAction(null)}
      />

      {/* Panel Popups */}
      {activePanelPopup && (
        <PanelPopup
          panel={panels.find(p => p.id === activePanelPopup)!}
          playerId={playerId}
          isVisible={!!activePanelPopup}
          onClose={() => setActivePanelPopup(null)}
        />
      )}



      {/* Map Popup */}
      <MapPopup
        playerId={playerId}
        isVisible={isMapPopupOpen}
        onClose={() => setIsMapPopupOpen(false)}
      />
    </div>
  );
};

export default ComprehensiveHUD;
