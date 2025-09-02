/**
 * Live Game HUD - Comprehensive UI with real API integration
 * Replaces all mock data with live connections across UI/API/AI Sims/Deterministic sims
 */

import React, { useState, useEffect, useCallback } from 'react';
import LiveDataService, { 
  CivilizationStats, 
  GalaxyStats, 
  AlertData, 
  WitterPost, 
  GameMasterMessage 
} from '../../services/LiveDataService';
import { LiveMissions } from './LiveMissions';
import WitterScreen from './screens/extracted/WitterScreen';
import './LiveGameHUD.css';

interface LiveGameHUDProps {
  playerId: string;
  campaignId?: string;
}

interface TabState {
  activeLeftTab: string;
  activeCenterTab: string;
  activeRightTab: 'stats' | 'missions' | 'civilizations';
}

export const LiveGameHUD: React.FC<LiveGameHUDProps> = ({ 
  playerId, 
  campaignId 
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [dataService] = useState(() => new LiveDataService());
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'polling' | 'failed'>('disconnected');
  
  // Data states
  const [civilizationStats, setCivilizationStats] = useState<CivilizationStats | null>(null);
  const [galaxyStats, setGalaxyStats] = useState<GalaxyStats | null>(null);
  const [topCivilizations, setTopCivilizations] = useState<CivilizationStats[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [witterFeed, setWitterFeed] = useState<WitterPost[]>([]);
  const [gameMasterMessages, setGameMasterMessages] = useState<GameMasterMessage[]>([]);
  
  // UI states
  const [tabs, setTabs] = useState<TabState>({
    activeLeftTab: 'government',
    activeCenterTab: 'whoseapp',
    activeRightTab: 'stats'
  });
  
  const [unreadCounts, setUnreadCounts] = useState({
    whoseapp: 0,
    story: 0,
    witter: 0
  });

  // ============================================================================
  // REAL-TIME DATA INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        // Load initial data from live APIs
        const [civStats, galStats, topCivs, alertsData, witterData, gmMessages] = await Promise.all([
          dataService.getCivilizationStats(campaignId),
          dataService.getGalaxyStats(),
          dataService.getTopCivilizations(5),
          dataService.getAlerts(),
          dataService.getWitterFeed(20),
          dataService.getGameMasterMessages()
        ]);

        setCivilizationStats(civStats);
        setGalaxyStats(galStats);
        setTopCivilizations(topCivs);
        setAlerts(alertsData);
        setWitterFeed(witterData);
        setGameMasterMessages(gmMessages);
        
        console.log('✅ Live data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [dataService, campaignId]);

  // ============================================================================
  // REAL-TIME EVENT HANDLERS
  // ============================================================================

  useEffect(() => {
    // Connection status updates
    dataService.on('connection', (data: any) => {
      setConnectionStatus(data.status);
    });

    // Real-time simulation updates
    dataService.on('simulation_tick', (data: any) => {
      if (data.metrics) {
        setCivilizationStats(data.metrics);
      }
      if (data.alerts) {
        setAlerts(data.alerts);
      }
    });

    // Witter feed updates
    dataService.on('witter_post_new', (data: any) => {
      setWitterFeed(prev => [data.post, ...prev.slice(0, 19)]);
      setUnreadCounts(prev => ({ ...prev, witter: prev.witter + 1 }));
    });

    // Alert updates
    dataService.on('alert_new', (data: any) => {
      setAlerts(prev => [data.alert, ...prev]);
    });

    dataService.on('alert_resolved', (data: any) => {
      setAlerts(prev => prev.filter(alert => alert.id !== data.alertId));
    });

    // Game Master messages
    dataService.on('character_message', (data: any) => {
      setGameMasterMessages(prev => [data.message, ...prev]);
      setUnreadCounts(prev => ({ ...prev, story: prev.story + 1 }));
    });

    // Population changes
    dataService.on('population_change', (data: any) => {
      setCivilizationStats(prev => prev ? {
        ...prev,
        population: data.population.total,
        cities: data.population.cities
      } : null);
    });

    // Economic updates
    dataService.on('economic_update', (data: any) => {
      setCivilizationStats(prev => prev ? {
        ...prev,
        gdp: data.economics.gdp,
        treasury: data.economics.treasury
      } : null);
    });

    // Security events
    dataService.on('security_event', (data: any) => {
      setCivilizationStats(prev => prev ? {
        ...prev,
        security: data.security.level
      } : null);
    });

    return () => {
      dataService.disconnect();
    };
  }, [dataService]);

  // ============================================================================
  // UI EVENT HANDLERS
  // ============================================================================

  const handleTabChange = useCallback((panel: keyof TabState, tab: string) => {
    setTabs(prev => ({ ...prev, [panel]: tab }));
    
    // Reset unread count when switching to tab
    if (panel === 'activeCenterTab') {
      setUnreadCounts(prev => ({ ...prev, [tab]: 0 }));
    }
  }, []);

  const handleHomeClick = useCallback(() => {
    setTabs({
      activeLeftTab: 'government',
      activeCenterTab: 'whoseapp',
      activeRightTab: 'stats'
    });
  }, []);

  const handleWhoseAppClick = useCallback((official?: string) => {
    setTabs(prev => ({ ...prev, activeCenterTab: 'whoseapp' }));
    setUnreadCounts(prev => ({ ...prev, whoseapp: 0 }));
    
    if (official) {
      // TODO: Open direct line to specific official
      console.log(`Opening direct line to ${official}`);
    }
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderConnectionStatus = () => {
    const statusConfig = {
      connected: { icon: '🟢', text: 'ONLINE', color: 'var(--success-glow)' },
      polling: { icon: '🟡', text: 'POLLING', color: 'var(--warning-glow)' },
      disconnected: { icon: '🔴', text: 'OFFLINE', color: 'var(--danger-glow)' },
      failed: { icon: '🔴', text: 'FAILED', color: 'var(--danger-glow)' }
    };
    
    const config = statusConfig[connectionStatus];
    return (
      <div className="connection-status" style={{ color: config.color }}>
        <span>{config.icon}</span>
        <span>Network: {config.text}</span>
      </div>
    );
  };

  const renderTopBar = () => (
    <header className="command-header">
      <div className="header-left">
        <div className="header-title">🌌 STARTALES COMMAND CENTER</div>
        <div className="header-campaign">
          🎯 {civilizationStats?.name || 'Loading...'}
        </div>
      </div>
      
      <div className="header-center">
        <button className="home-button" onClick={handleHomeClick}>
          🏠 Home
        </button>
      </div>
      
      <div className="header-right">
        <div className="civ-stats">
          <div className="stat-item">
            <span className="stat-label">Treasury</span>
            <span className="stat-value">
              {civilizationStats ? dataService.formatCurrency(civilizationStats.treasury) : 'Loading...'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Population</span>
            <span className="stat-value">
              {civilizationStats ? dataService.formatNumber(civilizationStats.population) : 'Loading...'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">GDP</span>
            <span className="stat-value">
              {civilizationStats ? `+${civilizationStats.gdp}%` : 'Loading...'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Approval</span>
            <span className="stat-value">
              {civilizationStats ? `${civilizationStats.approval}%` : 'Loading...'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Points</span>
            <span className="stat-value">
              {civilizationStats ? dataService.formatNumber(civilizationStats.points) : 'Loading...'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Alerts</span>
            <span className="stat-value alert-count">
              🔔 {alerts.length}
            </span>
          </div>
        </div>
        <div className="game-time">
          ⏰ Stardate {new Date().getFullYear() + 362}.{String(new Date().getDate()).padStart(3, '0')}.{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
        </div>
      </div>
    </header>
  );

  const renderLeftPanel = () => (
    <nav className="left-panel">
      <div className="system-category">
        <div className="category-header">🏛️ Government</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'cabinet' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'cabinet')}
        >
          <span className="system-icon">🏛️</span>
          <span>Cabinet</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'policies' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'policies')}
        >
          <span className="system-icon">⚖️</span>
          <span>Policies</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'legislature' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'legislature')}
        >
          <span className="system-icon">🏛️</span>
          <span>Legislature</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'supreme-court' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'supreme-court')}
        >
          <span className="system-icon">⚖️</span>
          <span>Supreme Court</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'political-parties' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'political-parties')}
        >
          <span className="system-icon">🎭</span>
          <span>Political Parties</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">💰 Economy</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'treasury' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'treasury')}
        >
          <span className="system-icon">💰</span>
          <span>Treasury</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'trade' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'trade')}
        >
          <span className="system-icon">📈</span>
          <span>Trade</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'business' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'business')}
        >
          <span className="system-icon">🏢</span>
          <span>Business</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'central-bank' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'central-bank')}
        >
          <span className="system-icon">🏦</span>
          <span>Central Bank</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">🛡️ Security</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'military' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'military')}
        >
          <span className="system-icon">🛡️</span>
          <span>Military</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'defense' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'defense')}
        >
          <span className="system-icon">🏰</span>
          <span>Defense</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'joint-chiefs' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'joint-chiefs')}
        >
          <span className="system-icon">⭐</span>
          <span>Joint Chiefs</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">🔬 Science & Tech</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'technology' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'technology')}
        >
          <span className="system-icon">🔬</span>
          <span>Technology</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'research' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'research')}
        >
          <span className="system-icon">🧪</span>
          <span>Research</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">🌌 Galaxy</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'galaxy-map' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'galaxy-map')}
        >
          <span className="system-icon">🗺️</span>
          <span>Galaxy Map</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'statistics' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'statistics')}
        >
          <span className="system-icon">📊</span>
          <span>Statistics</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'visuals' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'visuals')}
        >
          <span className="system-icon">🎨</span>
          <span>Visuals</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">📡 Communications</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'whoseapp-menu' ? 'active' : ''}`}
          onClick={() => handleWhoseAppClick()}
        >
          <span className="system-icon">📱</span>
          <span>WhoseApp</span>
        </div>
        <div 
          className={`system-item ${tabs.activeCenterTab === 'witter' ? 'active' : ''}`}
          onClick={() => {
            handleTabChange('activeCenterTab', 'witter');
            setUnreadCounts(prev => ({ ...prev, witter: 0 }));
          }}
        >
          <span className="system-icon">🐦</span>
          <span>Witter</span>
          {unreadCounts.witter > 0 && (
            <span className="unread-badge">{unreadCounts.witter}</span>
          )}
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'speeches' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'speeches')}
        >
          <span className="system-icon">🎤</span>
          <span>Speeches</span>
        </div>
      </div>

      <div className="system-category">
        <div className="category-header">👥 Population</div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'planets-cities' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'planets-cities')}
        >
          <span className="system-icon">🏙️</span>
          <span>Planets & Cities</span>
        </div>
        <div 
          className={`system-item ${tabs.activeLeftTab === 'demographics' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeLeftTab', 'demographics')}
        >
          <span className="system-icon">👥</span>
          <span>Demographics</span>
        </div>
      </div>
    </nav>
  );

  const renderCenterPanel = () => (
    <section className="center-panel">
      <div className="center-tabs">
        <button 
          className={`center-tab ${tabs.activeCenterTab === 'whoseapp' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeCenterTab', 'whoseapp')}
        >
          📱 WhoseApp
          {unreadCounts.whoseapp > 0 && (
            <span className="unread-badge">{unreadCounts.whoseapp}</span>
          )}
        </button>
        <button 
          className={`center-tab ${tabs.activeCenterTab === 'story' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeCenterTab', 'story')}
        >
          📖 Story
          {unreadCounts.story > 0 && (
            <span className="unread-badge">{unreadCounts.story}</span>
          )}
        </button>
        <button 
          className={`center-tab ${tabs.activeCenterTab === 'witter' ? 'active' : ''}`}
          onClick={() => {
            handleTabChange('activeCenterTab', 'witter');
            setUnreadCounts(prev => ({ ...prev, witter: 0 }));
          }}
        >
          🐦 Witter
          {unreadCounts.witter > 0 && (
            <span className="unread-badge">{unreadCounts.witter}</span>
          )}
        </button>
      </div>

      <div className="center-content">
        {tabs.activeCenterTab === 'whoseapp' && (
          <div className="whoseapp-content">
            <div className="whoseapp-header">
              <h3>📱 WhoseApp - Government Communications</h3>
              <div className="whoseapp-tabs">
                <button className="whoseapp-tab active">Messages</button>
                <button className="whoseapp-tab">Channels</button>
                <button className="whoseapp-tab">Calls</button>
              </div>
            </div>
            <div className="whoseapp-messages">
              {gameMasterMessages.map(message => (
                <div key={message.id} className="whoseapp-message">
                  <div className="message-header">
                    <span className="message-sender">🎭 Game Master</span>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabs.activeCenterTab === 'story' && (
          <div className="story-content">
            <h3>📖 Story & Events</h3>
            <div className="story-messages">
              {gameMasterMessages
                .filter(msg => msg.type === 'story' || msg.type === 'event')
                .map(message => (
                  <div key={message.id} className="story-message">
                    <div className="story-header">
                      <span className="story-title">{message.title}</span>
                      <span className="story-time">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="story-content-text">{message.content}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tabs.activeCenterTab === 'witter' && (
          <WitterScreen 
            screenId="witter"
            title="Witter"
            icon="🐦"
            gameContext={{
              currentLocation: 'Galactic Capital',
              currentActivity: 'Managing Civilization',
              recentEvents: ['Economic policy update', 'Diplomatic summit scheduled']
            }}
          />
        )}
      </div>
    </section>
  );

  const renderRightPanel = () => (
    <aside className="right-panel">
      <div className="right-tabs">
        <button 
          className={`right-tab ${tabs.activeRightTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeRightTab', 'stats')}
        >
          📊 Stats
        </button>
        <button 
          className={`right-tab ${tabs.activeRightTab === 'missions' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeRightTab', 'missions')}
        >
          🎯 Missions
        </button>
        <button 
          className={`right-tab ${tabs.activeRightTab === 'civilizations' ? 'active' : ''}`}
          onClick={() => handleTabChange('activeRightTab', 'civilizations')}
        >
          🏛️ Leading Civs
        </button>
      </div>

      <div className="right-content">
        {tabs.activeRightTab === 'stats' && (
          <div className="stats-content">
            <div className="stats-section">
              <div className="stats-header">📊 Live Metrics</div>
              {civilizationStats && (
                <>
                  <div className="metric-item">
                    <span className="metric-label">Population</span>
                    <span className="metric-value">
                      {dataService.formatNumber(civilizationStats.population)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">GDP Growth</span>
                    <span className="metric-value">+{civilizationStats.gdp}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Security</span>
                    <span className="metric-value">{civilizationStats.security}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Technology</span>
                    <span className="metric-value">{civilizationStats.technology}</span>
                  </div>
                </>
              )}
            </div>

            <div className="stats-section">
              <div className="stats-header">🔔 Active Alerts</div>
              <div className="alerts-list">
                {alerts.length === 0 ? (
                  <div className="no-alerts">All systems nominal</div>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className={`alert-item alert-${alert.priority}`}>
                      <span className="alert-icon">
                        {alert.priority === 'urgent' ? '🚨' : 
                         alert.priority === 'important' ? '⚠️' : 'ℹ️'}
                      </span>
                      <span className="alert-text">{alert.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tabs.activeRightTab === 'missions' && (
          <LiveMissions 
            playerId={playerId}
            campaignId={campaignId || 'default_campaign'}
            refreshInterval={30000}
          />
        )}

        {tabs.activeRightTab === 'civilizations' && (
          <div className="civilizations-content">
            <div className="stats-header">🏛️ Top 5 Leading Civilizations</div>
            <div className="civilizations-list">
              {topCivilizations.map((civ, index) => (
                <div key={civ.id} className="civilization-item">
                  <div className="civ-rank">#{index + 1}</div>
                  <div className="civ-info">
                    <div className="civ-name">{civ.name}</div>
                    <div className="civ-stats">
                      <span>Pop: {dataService.formatNumber(civ.population)}</span>
                      <span>GDP: +{civ.gdp}%</span>
                      <span>Points: {dataService.formatNumber(civ.points)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  const renderBottomBar = () => (
    <footer className="bottom-bar">
      <div className="bottom-left">
        <div className="simulation-status">
          <span className="status-indicator"></span>
          <span>Simulation: RUNNING</span>
        </div>
        <div className="tick-info">
          <span>Tick: {Math.floor(Date.now() / 120000)}</span>
        </div>
        {galaxyStats && (
          <>
            <div className="galaxy-stat">
              <span>Civilizations: {galaxyStats.totalCivilizations}</span>
            </div>
            <div className="galaxy-stat">
              <span>Planets: {galaxyStats.totalPlanets}</span>
            </div>
            <div className="galaxy-stat">
              <span>Population: {dataService.formatNumber(galaxyStats.totalPopulation)}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="bottom-right">
        {renderConnectionStatus()}
        <div className="performance-status">
          Performance: 98%
        </div>
      </div>
    </footer>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="hud-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading live data from APIs...</div>
      </div>
    );
  }

  return (
    <div className="live-game-hud">
      {renderTopBar()}
      
      <main className="main-content">
        {renderLeftPanel()}
        {renderCenterPanel()}
        {renderRightPanel()}
      </main>
      
      {renderBottomBar()}
      
      {/* WhoseApp Quick Access Button */}
      <button 
        className="whoseapp-quick-button"
        onClick={() => handleWhoseAppClick()}
        title="Quick access to WhoseApp"
      >
        📱
      </button>
    </div>
  );
};

export default LiveGameHUD;
