import React, { useState, useEffect } from 'react';
import { GalaxyMapComponent } from '../../GalaxyMapComponent';
import './GalaxyMapScreen.css';

interface GalaxyMapScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface GalaxyStats {
  totalSystems: number;
  exploredSystems: number;
  colonizedSystems: number;
  civilizations: number;
  tradeRoutes: number;
  conflicts: number;
}

const GalaxyMapScreen: React.FC<GalaxyMapScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'systems' | 'civilizations' | 'exploration' | 'analytics'>('map');
  const [galaxyStats, setGalaxyStats] = useState<GalaxyStats>({
    totalSystems: 0,
    exploredSystems: 0,
    colonizedSystems: 0,
    civilizations: 0,
    tradeRoutes: 0,
    conflicts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalaxyStats = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/galaxy/stats');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setGalaxyStats(data.stats);
        }
      } catch (err) {
        console.warn('Galaxy API not available, using mock data');
        // Use mock data
        setGalaxyStats({
          totalSystems: 2847,
          exploredSystems: 1923,
          colonizedSystems: 847,
          civilizations: 12,
          tradeRoutes: 156,
          conflicts: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalaxyStats();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Galaxy Map Action: ${action}`, context);
    alert(`Galaxy Map System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const renderMapTab = () => (
    <div className="map-tab">
      <div className="map-header">
        <h2>🗺️ Interactive Galaxy Map</h2>
        <p>Explore star systems, civilizations, and trade routes across the galaxy</p>
      </div>
      
      <div className="map-controls">
        <div className="control-group">
          <label>Layer:</label>
          <select defaultValue="political">
            <option value="political">Political Boundaries</option>
            <option value="trade">Trade Routes</option>
            <option value="resources">Resource Distribution</option>
            <option value="security">Security Status</option>
            <option value="exploration">Exploration Progress</option>
          </select>
        </div>
        <div className="control-group">
          <label>Filter:</label>
          <select defaultValue="all">
            <option value="all">All Systems</option>
            <option value="colonized">Colonized Only</option>
            <option value="unexplored">Unexplored</option>
            <option value="hostile">Hostile Territory</option>
            <option value="friendly">Allied Systems</option>
          </select>
        </div>
        <div className="control-actions">
          <button className="btn" onClick={() => handleAction('Center View')}>
            🎯 Center
          </button>
          <button className="btn secondary" onClick={() => handleAction('Reset Zoom')}>
            🔍 Reset
          </button>
        </div>
      </div>

      <div className="embedded-galaxy-map">
        <GalaxyMapComponent gameContext={gameContext} />
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
          <span>Allied Systems</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
          <span>Neutral Territory</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
          <span>Hostile Systems</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#9E9E9E' }}></div>
          <span>Unexplored</span>
        </div>
      </div>
    </div>
  );

  const renderSystemsTab = () => (
    <div className="systems-tab">
      <div className="systems-header">
        <h2>⭐ Star Systems</h2>
        <p>Detailed information about discovered star systems</p>
      </div>

      <div className="systems-grid">
        <div className="system-card">
          <div className="system-header">
            <h3>Sol System</h3>
            <div className="system-status allied">Allied</div>
          </div>
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Planets:</span>
              <span className="info-value">8</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">12.4B</span>
            </div>
            <div className="info-row">
              <span className="info-label">Resources:</span>
              <span className="info-value">High</span>
            </div>
            <div className="info-row">
              <span className="info-label">Security:</span>
              <span className="info-value">Maximum</span>
            </div>
          </div>
          <div className="system-actions">
            <button className="btn" onClick={() => handleAction('View System Details', 'Sol')}>
              📊 Details
            </button>
            <button className="btn secondary" onClick={() => handleAction('Manage System', 'Sol')}>
              ⚙️ Manage
            </button>
          </div>
        </div>

        <div className="system-card">
          <div className="system-header">
            <h3>Alpha Centauri</h3>
            <div className="system-status allied">Allied</div>
          </div>
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Planets:</span>
              <span className="info-value">3</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">2.8B</span>
            </div>
            <div className="info-row">
              <span className="info-label">Resources:</span>
              <span className="info-value">Moderate</span>
            </div>
            <div className="info-row">
              <span className="info-label">Security:</span>
              <span className="info-value">High</span>
            </div>
          </div>
          <div className="system-actions">
            <button className="btn" onClick={() => handleAction('View System Details', 'Alpha Centauri')}>
              📊 Details
            </button>
            <button className="btn secondary" onClick={() => handleAction('Manage System', 'Alpha Centauri')}>
              ⚙️ Manage
            </button>
          </div>
        </div>

        <div className="system-card">
          <div className="system-header">
            <h3>Kepler-442</h3>
            <div className="system-status neutral">Neutral</div>
          </div>
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Planets:</span>
              <span className="info-value">5</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">Unknown</span>
            </div>
            <div className="info-row">
              <span className="info-label">Resources:</span>
              <span className="info-value">Rich</span>
            </div>
            <div className="info-row">
              <span className="info-label">Security:</span>
              <span className="info-value">Unknown</span>
            </div>
          </div>
          <div className="system-actions">
            <button className="btn" onClick={() => handleAction('Explore System', 'Kepler-442')}>
              🚀 Explore
            </button>
            <button className="btn secondary" onClick={() => handleAction('Send Probe', 'Kepler-442')}>
              🛰️ Probe
            </button>
          </div>
        </div>
      </div>

      <div className="systems-actions">
        <button className="btn" onClick={() => handleAction('Discover New Systems')}>
          🔍 Discover Systems
        </button>
        <button className="btn secondary" onClick={() => handleAction('System Comparison')}>
          📊 Compare Systems
        </button>
        <button className="btn secondary" onClick={() => handleAction('Export System Data')}>
          📤 Export Data
        </button>
      </div>
    </div>
  );

  const renderCivilizationsTab = () => (
    <div className="civilizations-tab">
      <div className="civilizations-header">
        <h2>👽 Galactic Civilizations</h2>
        <p>Known civilizations and their territories</p>
      </div>

      <div className="civilizations-grid">
        <div className="civilization-card">
          <div className="civilization-header">
            <h3>Terran Federation</h3>
            <div className="civilization-status player">Player</div>
          </div>
          <div className="civilization-info">
            <div className="info-row">
              <span className="info-label">Systems:</span>
              <span className="info-value">47</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">89.2B</span>
            </div>
            <div className="info-row">
              <span className="info-label">Military:</span>
              <span className="info-value">Strong</span>
            </div>
            <div className="info-row">
              <span className="info-label">Diplomacy:</span>
              <span className="info-value">Peaceful</span>
            </div>
          </div>
        </div>

        <div className="civilization-card">
          <div className="civilization-header">
            <h3>Zephyrian Empire</h3>
            <div className="civilization-status allied">Allied</div>
          </div>
          <div className="civilization-info">
            <div className="info-row">
              <span className="info-label">Systems:</span>
              <span className="info-value">32</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">45.7B</span>
            </div>
            <div className="info-row">
              <span className="info-label">Military:</span>
              <span className="info-value">Moderate</span>
            </div>
            <div className="info-row">
              <span className="info-label">Diplomacy:</span>
              <span className="info-value">Cooperative</span>
            </div>
          </div>
        </div>

        <div className="civilization-card">
          <div className="civilization-header">
            <h3>Vorthan Collective</h3>
            <div className="civilization-status hostile">Hostile</div>
          </div>
          <div className="civilization-info">
            <div className="info-row">
              <span className="info-label">Systems:</span>
              <span className="info-value">28</span>
            </div>
            <div className="info-row">
              <span className="info-label">Population:</span>
              <span className="info-value">Unknown</span>
            </div>
            <div className="info-row">
              <span className="info-label">Military:</span>
              <span className="info-value">Very Strong</span>
            </div>
            <div className="info-row">
              <span className="info-label">Diplomacy:</span>
              <span className="info-value">Aggressive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="civilizations-actions">
        <button className="btn" onClick={() => handleAction('Diplomatic Relations')}>
          🤝 Diplomacy
        </button>
        <button className="btn secondary" onClick={() => handleAction('Intelligence Report')}>
          🕵️ Intelligence
        </button>
        <button className="btn secondary" onClick={() => handleAction('Trade Negotiations')}>
          💼 Trade
        </button>
      </div>
    </div>
  );

  const renderExplorationTab = () => (
    <div className="exploration-tab">
      <div className="exploration-header">
        <h2>🚀 Exploration Missions</h2>
        <p>Active and planned exploration missions</p>
      </div>

      <div className="missions-grid">
        <div className="mission-card">
          <div className="mission-header">
            <h3>Deep Space Survey Alpha</h3>
            <div className="mission-status active">Active</div>
          </div>
          <div className="mission-info">
            <div className="info-row">
              <span className="info-label">Target:</span>
              <span className="info-value">Outer Rim Sector 7</span>
            </div>
            <div className="info-row">
              <span className="info-label">Progress:</span>
              <span className="info-value">67%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ships:</span>
              <span className="info-value">3 Exploration Vessels</span>
            </div>
            <div className="info-row">
              <span className="info-label">ETA:</span>
              <span className="info-value">14 days</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '67%' }}></div>
          </div>
        </div>

        <div className="mission-card">
          <div className="mission-header">
            <h3>Anomaly Investigation Beta</h3>
            <div className="mission-status planning">Planning</div>
          </div>
          <div className="mission-info">
            <div className="info-row">
              <span className="info-label">Target:</span>
              <span className="info-value">Unknown Signal Source</span>
            </div>
            <div className="info-row">
              <span className="info-label">Progress:</span>
              <span className="info-value">0%</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ships:</span>
              <span className="info-value">2 Science Vessels</span>
            </div>
            <div className="info-row">
              <span className="info-label">Launch:</span>
              <span className="info-value">5 days</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      <div className="exploration-actions">
        <button className="btn" onClick={() => handleAction('Launch New Mission')}>
          🚀 New Mission
        </button>
        <button className="btn secondary" onClick={() => handleAction('Mission Control')}>
          🎮 Control Center
        </button>
        <button className="btn secondary" onClick={() => handleAction('Exploration Report')}>
          📋 Reports
        </button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>📊 Galaxy Analytics</h2>
        <p>Statistical analysis of galactic data</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.totalSystems.toLocaleString()}</div>
            <div className="stat-label">Total Systems</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.exploredSystems.toLocaleString()}</div>
            <div className="stat-label">Explored</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.colonizedSystems.toLocaleString()}</div>
            <div className="stat-label">Colonized</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👽</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.civilizations}</div>
            <div className="stat-label">Civilizations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛣️</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.tradeRoutes}</div>
            <div className="stat-label">Trade Routes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚔️</div>
          <div className="stat-content">
            <div className="stat-value">{galaxyStats.conflicts}</div>
            <div className="stat-label">Active Conflicts</div>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="btn" onClick={() => handleAction('Generate Full Report')}>
          📋 Full Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Export Analytics')}>
          📤 Export
        </button>
        <button className="btn secondary" onClick={() => handleAction('Predictive Analysis')}>
          🔮 Predictions
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="galaxy-map-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading galaxy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-map-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          🗺️ Map
        </button>
        <button 
          className={`tab-btn ${activeTab === 'systems' ? 'active' : ''}`}
          onClick={() => setActiveTab('systems')}
        >
          ⭐ Systems
        </button>
        <button 
          className={`tab-btn ${activeTab === 'civilizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('civilizations')}
        >
          👽 Civilizations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'exploration' ? 'active' : ''}`}
          onClick={() => setActiveTab('exploration')}
        >
          🚀 Exploration
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'map' && renderMapTab()}
        {activeTab === 'systems' && renderSystemsTab()}
        {activeTab === 'civilizations' && renderCivilizationsTab()}
        {activeTab === 'exploration' && renderExplorationTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default GalaxyMapScreen;
