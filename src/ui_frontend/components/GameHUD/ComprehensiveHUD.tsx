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
import { SettingsPopup } from './screens/SettingsPopup';
import { MapPopup } from './screens/MapPopup';
import { GovernmentBondsScreen } from './screens/GovernmentBondsScreen';
import { ScoreDisplay } from './ScoreDisplay';
import { CampaignWizard } from '../CampaignSetup/CampaignWizard';

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
  const [isSettingsPopupVisible, setIsSettingsPopupVisible] = useState(false);
  const [isGameSetupWizardVisible, setIsGameSetupWizardVisible] = useState(false);
  
  // Score and level state
  const [playerScore, setPlayerScore] = useState(125000);
  const [playerLevel, setPlayerLevel] = useState(7);
  const [playerExperience, setPlayerExperience] = useState(2400);
  const [experienceToNext, setExperienceToNext] = useState(3000);

  // WhoseApp WebSocket integration for real-time updates
  const whoseAppData = useWhoseAppWebSocket({
    civilizationId: playerId,
    autoConnect: true
  });
  const [communicationMessages, setCommunicationMessages] = useState<CommunicationMessage[]>([]);
  const [communicationLoading, setCommunicationLoading] = useState(false);
  const [communicationError, setCommunicationError] = useState<string | null>(null);
  const [characterMessages, setCharacterMessages] = useState<CharacterMessage[]>([]);
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
      // Use mock data for now since communication API endpoints are not fully implemented
      console.log('📡 Using mock communication data - API endpoints not fully implemented');
      
      // Set simple mock data to prevent errors
      setCommunicationPlayers([]);
      setCommunicationConversations([]);
      setCommunicationMessages([]);
      setCommunicationLoading(false);
      return;
    } catch (error) {
      console.error('Failed to fetch communication data:', error);
      setCommunicationError(error instanceof Error ? error.message : 'Failed to load communication data');
      setCommunicationPlayers([]);
      setCommunicationConversations([]);
      setCommunicationMessages([]);
    } finally {
      setCommunicationLoading(false);
    }
  };
  
  // Mock game master events for now
  const [gameMasterEvents, setGameMasterEvents] = useState<GameMasterEvent[]>([
    {
      id: '1',
      title: 'First Contact Protocol Activated',
      description: 'Long-range sensors have detected an unknown vessel approaching the outer rim of our territory.',
      type: 'story',
      timestamp: new Date(Date.now() - 1800000),
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
    console.log('Creating channel:', channelData);
    // Simplified implementation for now
    return { success: true };
  };

  // Refresh functions for various sections
  const refreshStoryData = () => {
    console.log('Refreshing story data...');
    setStoryUnreadCount(0);
  };

  const refreshMapData = () => {
    console.log('Refreshing map data...');
  };

  const refreshWhoseAppData = () => {
    console.log('Refreshing WhoseApp data...');
    setWhoseappUnreadCount(0);
    fetchCommunicationData();
  };

  const refreshWitterData = () => {
    console.log('Refreshing Witter data...');
    setWitterUnreadCount(0);
  };

  const refreshGalaxyData = () => {
    console.log('Refreshing galaxy data...');
  };

  const refreshCivData = () => {
    console.log('Refreshing civilization data...');
  };

  const refreshMissionsData = () => {
    console.log('Refreshing missions data...');
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
        default:
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      ws.close();
    };
  }, []);

  // Handle WhoseApp events
  useEffect(() => {
    const handleWhoseAppEvent = (event: CustomEvent) => {
      const { targetOfficial, context, priority } = event.detail;
      console.log('WhoseApp event received:', { targetOfficial, context, priority });
      
      // Add to character messages or handle as needed
      setCharacterMessages(prev => [{
        id: `whoseapp_${Date.now()}`,
        characterName: targetOfficial,
        characterType: 'advisor',
        message: context,
        timestamp: new Date(),
        priority: priority || 'medium',
        avatar: '/api/visual/character/' + targetOfficial.toLowerCase().replace(/\s+/g, '-')
      }, ...prev.slice(0, 9)]);
    };

    window.addEventListener('whoseapp:event', handleWhoseAppEvent as EventListener);
    return () => window.removeEventListener('whoseapp:event', handleWhoseAppEvent as EventListener);
  }, []);

  // WhoseApp event listener for direct communication from screens
  useEffect(() => {
    const handleWhoseAppEvent = (event: CustomEvent) => {
      const { targetOfficial, context, priority } = event.detail;
      
      // Just switch to WhoseApp tab - let the component handle its own state
      setActivePanel('whoseapp');
      
      // Log the event but don't force any specific conversation
      console.log(`📞 WhoseApp opened - ${context} (allowing normal character selection)`);
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
    { id: 'health', name: 'Health', icon: '🏥', category: 'population' },
    { id: 'household-economics', name: 'Households', icon: '🏠', category: 'population' },
    { id: 'entertainment-tourism', name: 'Culture', icon: '🎭', category: 'population' },
    
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
    { id: 'missions', name: 'Missions', icon: '🎯', category: 'galaxy' },
    { id: 'world-wonders', name: 'Galaxy Wonders', icon: '🏛️', category: 'galaxy' },
    { id: 'visual-systems', name: 'Visuals', icon: '🎨', category: 'galaxy' },
    
    // Game Master Controls (Admin Only)
    { id: 'character-awareness', name: 'Character AI Control', icon: '🧠', category: 'gamemaster' },
    
    // System Controls
    { id: 'enhanced-knobs-control', name: 'Enhanced Knobs', icon: '🎛️', category: 'system' }
  ];

  // Utility functions
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeAgo = (timestamp: Date): string => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Main render function
  return (
    <div className="comprehensive-hud">
      {/* Command Header */}
      <div className="command-header">
        <div className="header-left">
          <span className="game-title">🌌 LIVELYGALAXY.AI</span>
          <span className="civilization-info">👑 Commander {playerId} | 🏛️ Terran Federation</span>
        </div>
        <div className="header-center">
          <ScoreDisplay 
            score={playerScore}
            level={playerLevel}
            experience={playerExperience}
            experienceToNext={experienceToNext}
          />
        </div>
        <div className="header-right">
          <span className="treasury">💰 ${formatNumber(liveMetrics.treasury)}</span>
          <span className="approval">📊 {liveMetrics.approval}%</span>
          <span className="security">🛡️ {liveMetrics.securityLevel}%</span>
          <span className="alerts">🔔 {alerts.length}</span>
          <button 
            className="settings-btn"
            onClick={() => setIsSettingsPopupVisible(true)}
            title="Settings"
          >
            ⚙️
          </button>
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
                  onClick={() => setActivePanelPopup('missions')}
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
          {['government', 'economy', 'security', 'population', 'science', 'communications', 'galaxy', 'gamemaster', 'system'].map(category => (
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
                  {category === 'gamemaster' && '🎮'}
                  {category === 'system' && '🎛️'}
                </span>
                <span className="accordion-title">{category.toUpperCase()}</span>
                <span className="accordion-chevron">{expandedAccordion === category ? '▼' : '▶'}</span>
              </div>
              {expandedAccordion === category && (
                <div className="accordion-content">
                  {panels.filter(p => p.category === category).map(panel => (
                    <button
                      key={panel.id}
                      className={`nav-item ${activePanelPopup === panel.id ? 'active' : ''}`}
                      onClick={() => {
                        if (panel.id === 'galaxy-map') {
                          // Open the same map popup as the center tab
                          setIsMapPopupOpen(true);
                        } else if (panel.id === 'galaxy-data') {
                          // Open Galaxy Data as a proper screen, not a popup
                          setActivePanel('galaxy-data');
                        } else if (panel.id === 'whoseapp') {
                          // Open WhoseApp as a main panel
                          setActivePanel('whoseapp');
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

        {/* Center Panel - Main Content */}
        <div className="center-panel">
          {activePanel === 'story' && (
            <div className="panel-screen">
              {createScreen('story', gameContext)}
            </div>
          )}
          
          {activePanel === 'whoseapp' && (
            <div className="panel-screen">
              {createScreen('whoseapp', gameContext)}
            </div>
          )}
          
          {activePanel === 'civilization-overview' && (
            <div className="panel-screen">
              {createScreen('civilization-overview', gameContext)}
            </div>
          )}
          
          {activePanel === 'galaxy-data' && (
            <div className="panel-screen">
              {createScreen('galaxy-data', gameContext)}
            </div>
          )}
          
          {activePanel === 'witter' && (
            <div className="panel-screen">
              {createScreen('witter', gameContext)}
            </div>
          )}
          
          {activePanel === 'trade' && (
            <TradeEconomics 
              playerId={playerId} 
              gameContext={gameContext} 
              onClose={() => setActivePanel('story')} 
            />
          )}
          
          {/* Default Command Center View */}
          {!['story', 'whoseapp', 'civilization-overview', 'galaxy-data', 'witter', 'trade'].includes(activePanel) && (
            <>
              <div className="welcome-header">
                <h2>🌌 Command Center</h2>
                <p>Use the navigation panels to access different sections of your galactic empire.</p>
              </div>

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
        </div>

        {/* Right Panel - Quick Access & Info */}
        <div className="right-panel">
          {/* Quick Access Grid */}
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

          {/* Live Alerts */}
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

      {/* Settings Popup */}
      <SettingsPopup
        playerId={playerId}
        isVisible={isSettingsPopupVisible}
        onClose={() => setIsSettingsPopupVisible(false)}
        onNewGame={() => {
          setIsSettingsPopupVisible(false);
          setIsGameSetupWizardVisible(true);
        }}
      />

      {/* Game Setup Wizard */}
      <CampaignWizard
        isVisible={isGameSetupWizardVisible}
        onClose={() => setIsGameSetupWizardVisible(false)}
        onComplete={(gameConfig) => {
          console.log('New game setup:', gameConfig);
          setIsGameSetupWizardVisible(false);
        }}
      />
    </div>
  );
};

export default ComprehensiveHUD;
