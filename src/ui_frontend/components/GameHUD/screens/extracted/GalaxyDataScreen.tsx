import React, { useState, useEffect } from 'react';
import './GalaxyDataScreen.css';
import './GalaxyDataScreen_Enhanced.css';

const GalaxyDataScreen: React.FC = () => {
  console.log('🌌 GalaxyDataScreen: Component initialized');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'systems' | 'civilizations' | 'discoveries'>('overview');

  useEffect(() => {
    console.log('🌌 GalaxyDataScreen: useEffect triggered');
    
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      console.log('🌌 GalaxyDataScreen: Mock data loaded, setting loading to false');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log('🌌 GalaxyDataScreen: Rendering, loading =', loading, 'error =', error);

  if (loading) {
    console.log('🌌 GalaxyDataScreen: Rendering loading state');
    return (
      <div className="galaxy-data-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading galaxy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🌌 GalaxyDataScreen: Rendering error state');
    return (
      <div className="galaxy-data-screen">
        <div className="error-container">
          <h3>Error Loading Galaxy Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  console.log('🌌 GalaxyDataScreen: Rendering main content');

  return (
    <div className="galaxy-data-screen">
      <div className="galaxy-header">
        <h2>🌌 Galaxy Data</h2>
        <div className="galaxy-stats">
          <div className="stat-card">
            <h3>Systems</h3>
            <p>2,847 Total</p>
            <p>73% Explored</p>
          </div>
          <div className="stat-card">
            <h3>Civilizations</h3>
            <p>156 Active</p>
            <p>12 Allied</p>
          </div>
          <div className="stat-card">
            <h3>Resources</h3>
            <p>95% Efficiency</p>
            <p>2.4B Credits/day</p>
          </div>
        </div>
      </div>

             <div className="galaxy-tabs">
         <button 
           className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
           onClick={() => setActiveTab('overview')}
         >
           Overview
         </button>
         <button 
           className={`tab-btn ${activeTab === 'systems' ? 'active' : ''}`}
           onClick={() => setActiveTab('systems')}
         >
           Systems
         </button>
         <button 
           className={`tab-btn ${activeTab === 'civilizations' ? 'active' : ''}`}
           onClick={() => setActiveTab('civilizations')}
         >
           Civilizations
         </button>
         <button 
           className={`tab-btn ${activeTab === 'discoveries' ? 'active' : ''}`}
           onClick={() => setActiveTab('discoveries')}
         >
           Discoveries
         </button>
       </div>

      <div className="galaxy-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="galaxy-overview">
              <h3>Galaxy Overview</h3>
              <div className="overview-grid">
                <div className="overview-item">
                  <h4>🌟 Star Systems</h4>
                  <p>Total Systems: 2,847</p>
                  <p>Explored: 2,079 (73%)</p>
                  <p>Controlled: 1,247 (44%)</p>
                </div>
                <div className="overview-item">
                  <h4>🏛️ Civilizations</h4>
                  <p>Active: 156</p>
                  <p>Allied: 12</p>
                  <p>Neutral: 89</p>
                  <p>Hostile: 55</p>
                </div>
                <div className="overview-item">
                  <h4>🚀 Exploration</h4>
                  <p>Active Missions: 47</p>
                  <p>Recent Discoveries: 23</p>
                  <p>Anomalies: 8</p>
                </div>
                <div className="overview-item">
                  <h4>💰 Economy</h4>
                  <p>Daily Income: 2.4B Credits</p>
                  <p>Trade Routes: 234</p>
                  <p>Resource Efficiency: 95%</p>
                </div>
              </div>
            </div>

            <div className="recent-discoveries">
              <h3>Recent Activity</h3>
              <div className="discovery-list">
                <div className="discovery-item">
                  <span className="discovery-icon">🔬</span>
                  <div className="discovery-info">
                    <h4>Quantum Crystal Deposits</h4>
                    <p>Kepler-442b System • 2 hours ago</p>
                  </div>
                </div>
                <div className="discovery-item">
                  <span className="discovery-icon">👽</span>
                  <div className="discovery-info">
                    <h4>Ancient Alien Artifacts</h4>
                    <p>Vega Prime • 6 hours ago</p>
                  </div>
                </div>
                <div className="discovery-item">
                  <span className="discovery-icon">🌍</span>
                  <div className="discovery-info">
                    <h4>Habitable Planet</h4>
                    <p>Ross 128 System • 1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="tab-content">
            <div className="systems-overview">
              <h3>⭐ Star Systems Database</h3>
              <div className="systems-grid">
                <div className="system-card controlled">
                  <div className="system-header">
                    <h4>Alpha Centauri A</h4>
                    <span className="system-status controlled">Controlled</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>G-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>3 (2 habitable)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>2.4B</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                <div className="system-card controlled">
                  <div className="system-header">
                    <h4>Proxima Centauri</h4>
                    <span className="system-status controlled">Controlled</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>M-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>2 (1 habitable)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>890M</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>Medium</span>
                    </div>
                  </div>
                </div>

                <div className="system-card neutral">
                  <div className="system-header">
                    <h4>Vega Prime</h4>
                    <span className="system-status neutral">Neutral</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>A-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>5 (1 habitable)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>Unknown</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>Rich</span>
                    </div>
                  </div>
                </div>

                <div className="system-card hostile">
                  <div className="system-header">
                    <h4>Kepler-442</h4>
                    <span className="system-status hostile">Hostile</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>K-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>4 (2 habitable)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>1.2B</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>Exotic</span>
                    </div>
                  </div>
                </div>

                <div className="system-card unexplored">
                  <div className="system-header">
                    <h4>Ross 128</h4>
                    <span className="system-status unexplored">Unexplored</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>M-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>? (Scanning)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>Unknown</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>Unknown</span>
                    </div>
                  </div>
                </div>

                <div className="system-card allied">
                  <div className="system-header">
                    <h4>Tau Ceti</h4>
                    <span className="system-status allied">Allied</span>
                  </div>
                  <div className="system-details">
                    <div className="detail-row">
                      <span>Star Type:</span>
                      <span>G-class</span>
                    </div>
                    <div className="detail-row">
                      <span>Planets:</span>
                      <span>6 (3 habitable)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>3.1B</span>
                    </div>
                    <div className="detail-row">
                      <span>Resources:</span>
                      <span>Abundant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'civilizations' && (
          <div className="tab-content">
            <div className="civilizations-overview">
              <h3>🏛️ Known Civilizations</h3>
              <div className="civilizations-grid">
                <div className="civilization-card player">
                  <div className="civ-header">
                    <h4>Terran Federation</h4>
                    <span className="player-badge">YOU</span>
                    <span className="diplomatic-status allied">Allied</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Human</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Federation</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>15</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>12.0B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>85/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>92/100</span>
                    </div>
                  </div>
                </div>

                <div className="civilization-card">
                  <div className="civ-header">
                    <h4>Zephyrian Empire</h4>
                    <span className="diplomatic-status neutral">Neutral</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Zephyrian</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Empire</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>18</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>8.5B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>78/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>76/100</span>
                    </div>
                  </div>
                </div>

                <div className="civilization-card">
                  <div className="civ-header">
                    <h4>Crystalline Collective</h4>
                    <span className="diplomatic-status hostile">Hostile</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Crystalline</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Collective</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>8</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>3.2B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>95/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>68/100</span>
                    </div>
                  </div>
                </div>

                <div className="civilization-card">
                  <div className="civ-header">
                    <h4>Aquatic Union</h4>
                    <span className="diplomatic-status allied">Allied</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Aquatic</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Union</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>6</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>4.7B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>62/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>84/100</span>
                    </div>
                  </div>
                </div>

                <div className="civilization-card">
                  <div className="civ-header">
                    <h4>Silicon Syndicate</h4>
                    <span className="diplomatic-status neutral">Neutral</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Silicon-based</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Syndicate</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>11</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>2.1B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>71/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>89/100</span>
                    </div>
                  </div>
                </div>

                <div className="civilization-card">
                  <div className="civ-header">
                    <h4>Nomadic Fleet</h4>
                    <span className="diplomatic-status neutral">Neutral</span>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>Various</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>Fleet Council</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>0 (Mobile)</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>1.8B</span>
                    </div>
                    <div className="detail-row">
                      <span>Military:</span>
                      <span>88/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economy:</span>
                      <span>55/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discoveries' && (
          <div className="tab-content">
            <div className="discoveries-overview">
              <h3>🔬 Scientific Discoveries</h3>
              <div className="discoveries-grid">
                <div className="discovery-card critical">
                  <div className="discovery-header">
                    <h4>Ancient Hypergate Network</h4>
                    <span className="significance critical">Critical</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Technology</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Alpha Centauri A</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-10</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>95/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>98/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    Discovered remnants of an ancient faster-than-light transportation network. Could revolutionize interstellar travel.
                  </div>
                </div>

                <div className="discovery-card high">
                  <div className="discovery-header">
                    <h4>Quantum Crystal Deposits</h4>
                    <span className="significance high">High</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Resource</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Kepler-442b</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-15</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>78/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>92/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    Massive deposits of quantum-entangled crystals that could enhance computing and communication technology.
                  </div>
                </div>

                <div className="discovery-card high">
                  <div className="discovery-header">
                    <h4>Sentient Plant Species</h4>
                    <span className="significance high">High</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Biological</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Tau Ceti f</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-12</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>89/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>45/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    First contact with a plant-based sentient species. Potential for new biological technologies and diplomatic relations.
                  </div>
                </div>

                <div className="discovery-card medium">
                  <div className="discovery-header">
                    <h4>Dark Matter Anomaly</h4>
                    <span className="significance medium">Medium</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Phenomenon</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Vega System Edge</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-08</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>67/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>23/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    Unusual dark matter concentration that defies current physics models. Requires further investigation.
                  </div>
                </div>

                <div className="discovery-card medium">
                  <div className="discovery-header">
                    <h4>Precursor Ruins</h4>
                    <span className="significance medium">Medium</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Archaeological</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Ross 128 c</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-05</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>72/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>38/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    Ancient ruins from an unknown civilization. Contains advanced materials and mysterious energy signatures.
                  </div>
                </div>

                <div className="discovery-card low">
                  <div className="discovery-header">
                    <h4>Exotic Gas Giant</h4>
                    <span className="significance low">Low</span>
                  </div>
                  <div className="discovery-details">
                    <div className="detail-row">
                      <span>Type:</span>
                      <span>Planetary</span>
                    </div>
                    <div className="detail-row">
                      <span>Location:</span>
                      <span>Proxima System</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>2024-01-03</span>
                    </div>
                    <div className="detail-row">
                      <span>Scientific Value:</span>
                      <span>34/100</span>
                    </div>
                    <div className="detail-row">
                      <span>Economic Value:</span>
                      <span>56/100</span>
                    </div>
                  </div>
                  <div className="discovery-description">
                    Gas giant with unusual atmospheric composition. May contain rare gases useful for industrial processes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaxyDataScreen;
