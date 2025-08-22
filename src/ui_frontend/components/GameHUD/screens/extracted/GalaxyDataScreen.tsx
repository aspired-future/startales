import React, { useState, useEffect } from 'react';
import './GalaxyDataScreen.css';

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

interface StarSystem {
  id: string;
  name: string;
  starType: string;
  planets: number;
  explored: boolean;
  controlledBy: string | null;
}

interface Sector {
  id: string;
  name: string;
  coordinates: Coordinates;
  starSystems: StarSystem[];
  controlStatus: 'controlled' | 'contested' | 'neutral';
  explorationLevel: number;
}

interface GalaxyMap {
  campaignId: number;
  sectors: Sector[];
  metadata: {
    totalSectors: number;
    exploredSectors: number;
    controlledSectors: number;
    zoom: number;
  };
}

interface TerritorialClaim {
  systemId: string;
  claimStrength: number;
  disputed: boolean;
  claimDate: string;
}

interface Civilization {
  id: string;
  name: string;
  controlledSystems: number;
  territorialClaims: TerritorialClaim[];
  diplomaticStatus: 'allied' | 'neutral' | 'hostile';
  species: string;
  government: string;
  technology: string;
  population: number;
  militaryStrength: number;
  economicPower: number;
}

interface Territories {
  campaignId: number;
  civilizations: Civilization[];
  neutralZones: any[];
  disputes: any[];
}

interface Discovery {
  id: string;
  name: string;
  type: string;
  location: string;
  discoveryDate: string;
  significance: string;
  scientificValue: number;
  economicValue: number;
  strategicValue: number;
}

const GalaxyDataScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'civilizations' | 'comparison' | 'systems' | 'discoveries' | 'enhanced' | 'spatial'>('overview');
  const [galaxyMap, setGalaxyMap] = useState<GalaxyMap | null>(null);
  const [territories, setTerritories] = useState<Territories | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationStatus, setSimulationStatus] = useState<any>(null);
  const [aiRecommendations, setAIRecommendations] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [showEnhancedData, setShowEnhancedData] = useState(false);
  const [spatialIntelligence, setSpatialIntelligence] = useState<any>(null);
  const [militaryIntelligence, setMilitaryIntelligence] = useState<any>(null);
  const [tradeOpportunities, setTradeOpportunities] = useState<any>(null);
  const [sensorContacts, setSensorContacts] = useState<any>(null);

  const getDiplomaticStatusColor = (status: string) => {
    switch (status) {
      case 'allied': return '#4CAF50';
      case 'hostile': return '#F44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  useEffect(() => {
    const fetchGalaxyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch galaxy map data
        const mapResponse = await fetch('/api/galaxy/map?campaignId=1&includeUnexplored=true');
        if (!mapResponse.ok) {
          throw new Error(`Failed to fetch galaxy map: ${mapResponse.status}`);
        }
        const mapData = await mapResponse.json();

        // Fetch territories data
        const territoriesResponse = await fetch('/api/galaxy/territories?campaignId=1');
        if (!territoriesResponse.ok) {
          throw new Error(`Failed to fetch territories: ${territoriesResponse.status}`);
        }
        const territoriesData = await territoriesResponse.json();

        // Fetch discoveries data
        const discoveriesResponse = await fetch('/api/galaxy/discoveries?campaignId=1&limit=20');
        if (!discoveriesResponse.ok) {
          throw new Error(`Failed to fetch discoveries: ${discoveriesResponse.status}`);
        }
        const discoveriesData = await discoveriesResponse.json();

        if (mapData.success) {
          setGalaxyMap(mapData.data);
        }

        if (territoriesData.success) {
          // Transform the territories data to match expected format
          const transformedTerritories = {
            ...territoriesData.data,
            civilizations: territoriesData.data.civilizations.map((civ: any, index: number) => ({
              ...civ,
              species: civ.species || `Species ${index + 1}`,
              government: civ.government || 'Unknown Government',
              technology: civ.technology || 'Advanced',
              population: civ.population || Math.floor(Math.random() * 10000000000) + 1000000000,
              militaryStrength: civ.militaryStrength || Math.floor(Math.random() * 100) + 1,
              economicPower: civ.economicPower || Math.floor(Math.random() * 100) + 1
            }))
          };
          setTerritories(transformedTerritories);
        }

        if (discoveriesData.success) {
          setDiscoveries(discoveriesData.data || []);
        }

      } catch (err) {
        console.error('Error fetching galaxy data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load galaxy data');
        
        // Mock data fallback
        setGalaxyMap({
          campaignId: 1,
          sectors: [],
          metadata: { totalSectors: 10, exploredSectors: 7, controlledSectors: 4, zoom: 1 }
        });
        
        setTerritories({
          campaignId: 1,
          civilizations: [
            {
              id: 'civ_1',
              name: 'Terran Federation',
              controlledSystems: 15,
              territorialClaims: [],
              diplomaticStatus: 'allied',
              species: 'Human',
              government: 'Federation',
              technology: 'Advanced',
              population: 12000000000,
              militaryStrength: 85,
              economicPower: 92
            },
            {
              id: 'civ_2', 
              name: 'Zephyrian Empire',
              controlledSystems: 12,
              territorialClaims: [],
              diplomaticStatus: 'neutral',
              species: 'Zephyrian',
              government: 'Empire',
              technology: 'Advanced',
              population: 8500000000,
              militaryStrength: 78,
              economicPower: 76
            },
            {
              id: 'civ_3',
              name: 'Crystalline Collective',
              controlledSystems: 8,
              territorialClaims: [],
              diplomaticStatus: 'hostile',
              species: 'Crystalline',
              government: 'Collective',
              technology: 'Superior',
              population: 3200000000,
              militaryStrength: 95,
              economicPower: 68
            }
          ],
          neutralZones: [],
          disputes: []
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch enhanced simulation data
    const fetchEnhancedData = useCallback(async () => {
      try {
        const campaignId = 1;
        const civilizationId = 'civilization_1';

        // Fetch simulation status
        const statusResponse = await fetch(`/api/galaxy/simulation/status?campaignId=${campaignId}&civilizationId=${civilizationId}`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setSimulationStatus(statusData.data);
        }

        // Fetch AI recommendations
        const aiResponse = await fetch(`/api/galaxy/ai/recommendations?campaignId=${campaignId}&civilizationId=${civilizationId}`);
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          setAIRecommendations(aiData.data);
        }

        // Fetch performance metrics
        const metricsResponse = await fetch(`/api/galaxy/analytics/performance?campaignId=${campaignId}&civilizationId=${civilizationId}`);
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setPerformanceMetrics(metricsData.data);
        }
      } catch (error) {
        console.error('Error fetching enhanced data:', error);
      }
    }, []);

    // Fetch spatial intelligence data
    const fetchSpatialIntelligenceData = useCallback(async () => {
      try {
        const characterId = 'civilization_1_military_commander';
        const civilizationId = 'civilization_1';

        // Fetch character spatial intelligence
        const spatialResponse = await fetch(`/api/characters/spatial/intelligence/${characterId}`);
        if (spatialResponse.ok) {
          const spatialData = await spatialResponse.json();
          setSpatialIntelligence(spatialData.data);
        }

        // Fetch military intelligence
        const militaryResponse = await fetch(`/api/characters/military/intelligence?characterId=${characterId}&civilizationId=${civilizationId}`);
        if (militaryResponse.ok) {
          const militaryData = await militaryResponse.json();
          setMilitaryIntelligence(militaryData.data);
        }

        // Fetch trade opportunities
        const tradeResponse = await fetch(`/api/characters/trade/opportunities?characterId=${civilizationId}_trade_executive`);
        if (tradeResponse.ok) {
          const tradeData = await tradeResponse.json();
          setTradeOpportunities(tradeData.data);
        }

        // Fetch sensor contacts
        const sensorResponse = await fetch(`/api/characters/sensors/contacts?characterId=${characterId}`);
        if (sensorResponse.ok) {
          const sensorData = await sensorResponse.json();
          setSensorContacts(sensorData.data);
        }
      } catch (error) {
        console.error('Error fetching spatial intelligence data:', error);
      }
    }, []);

    fetchGalaxyData();
    fetchEnhancedData();
    fetchSpatialIntelligenceData();
  }, [fetchEnhancedData]);

  if (loading) {
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
    return (
      <div className="galaxy-data-screen">
        <div className="error-container">
          <h3>⚠️ Data Connection Error</h3>
          <p>{error}</p>
          <p>Using cached data where available...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-data-screen">
      <div className="screen-header">
        <h1>🌌 Galaxy Data Intelligence</h1>
        <p>Comprehensive analysis and comparative intelligence across all known civilizations</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🌌 Galaxy Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'civilizations' ? 'active' : ''}`}
          onClick={() => setActiveTab('civilizations')}
        >
          🏛️ Civilizations
        </button>
        <button 
          className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          📊 Comparison
        </button>
        <button 
          className={`tab-button ${activeTab === 'systems' ? 'active' : ''}`}
          onClick={() => setActiveTab('systems')}
        >
          ⭐ Star Systems
        </button>
        <button 
          className={`tab-button ${activeTab === 'discoveries' ? 'active' : ''}`}
          onClick={() => setActiveTab('discoveries')}
        >
          🔬 Recent Discoveries
        </button>
        <button 
          className={`tab-button ${activeTab === 'enhanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('enhanced')}
        >
          🎛️ Enhanced
        </button>
        <button 
          className={`tab-button ${activeTab === 'spatial' ? 'active' : ''}`}
          onClick={() => setActiveTab('spatial')}
        >
          🧠 Spatial Intel
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && galaxyMap && (
          <div className="overview-tab">
            <div className="overview-stats">
              <h3>🌌 Galaxy Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{galaxyMap.metadata.totalSectors}</div>
                  <div className="stat-label">Total Sectors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{galaxyMap.metadata.exploredSectors}</div>
                  <div className="stat-label">Explored Sectors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{galaxyMap.metadata.controlledSectors}</div>
                  <div className="stat-label">Controlled Sectors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{territories?.civilizations.length || 0}</div>
                  <div className="stat-label">Known Civilizations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'civilizations' && territories && (
          <div className="civilizations-tab">
            <h3>🏛️ Known Civilizations</h3>
            <div className="civilizations-grid">
              {territories.civilizations.map((civ, index) => (
                <div key={civ.id} className={`civilization-card ${index === 0 ? 'player-civ' : ''}`}>
                  <div className="civ-header">
                    <h4>{civ.name} {index === 0 && <span className="player-badge">YOU</span>}</h4>
                    <div 
                      className={`diplomatic-status ${civ.diplomaticStatus}`}
                      style={{ backgroundColor: getDiplomaticStatusColor(civ.diplomaticStatus) }}
                    >
                      {civ.diplomaticStatus.toUpperCase()}
                    </div>
                  </div>
                  <div className="civ-details">
                    <div className="detail-row">
                      <span>Species:</span>
                      <span>{civ.species}</span>
                    </div>
                    <div className="detail-row">
                      <span>Government:</span>
                      <span>{civ.government}</span>
                    </div>
                    <div className="detail-row">
                      <span>Systems:</span>
                      <span>{civ.controlledSystems}</span>
                    </div>
                    <div className="detail-row">
                      <span>Population:</span>
                      <span>{(civ.population / 1000000000).toFixed(1)}B</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comparison' && territories && (
          <div className="comparison-tab">
            <div className="comparison-overview">
              <h3>📊 Civilization Comparison Matrix</h3>
              <p>Comprehensive analysis comparing all known civilizations across key metrics</p>
              
              {/* Comparison Table */}
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Civilization</th>
                      <th>Systems Controlled</th>
                      <th>Population</th>
                      <th>Diplomatic Status</th>
                      <th>Military Strength</th>
                      <th>Economic Power</th>
                      <th>Technology Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {territories.civilizations.map((civ, index) => (
                      <tr key={civ.id} className={index === 0 ? 'player-row' : ''}>
                        <td className="civ-name">
                          <div className="civ-info">
                            <span className="civ-title">{civ.name}</span>
                            {index === 0 && <span className="player-badge">YOU</span>}
                          </div>
                        </td>
                        <td className="metric-cell">
                          <div className="metric-value">{civ.controlledSystems}</div>
                          <div className="metric-rank">#{index + 1}</div>
                        </td>
                        <td className="metric-cell">
                          <div className="metric-value">{(civ.population / 1000000000).toFixed(1)}B</div>
                        </td>
                        <td className="diplomatic-cell">
                          <div 
                            className={`diplomatic-badge ${civ.diplomaticStatus}`}
                            style={{ backgroundColor: getDiplomaticStatusColor(civ.diplomaticStatus) }}
                          >
                            {civ.diplomaticStatus.toUpperCase()}
                          </div>
                        </td>
                        <td className="metric-cell">
                          <div className="metric-value">{civ.militaryStrength}</div>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill military" 
                              style={{ width: `${civ.militaryStrength}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="metric-cell">
                          <div className="metric-value">{civ.economicPower}</div>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill economic" 
                              style={{ width: `${civ.economicPower}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="metric-cell">
                          <div className="metric-value">{civ.technology}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Threat Assessment */}
              <div className="threat-assessment">
                <h4>⚠️ Threat Assessment</h4>
                <div className="threat-grid">
                  {territories.civilizations.map((civ, index) => {
                    if (index === 0) return null; // Skip player civilization
                    
                    const threatLevel = civ.diplomaticStatus === 'hostile' ? 'high' : 
                                     civ.diplomaticStatus === 'neutral' ? 'medium' : 'low';
                    const threatScore = civ.militaryStrength;
                    
                    return (
                      <div key={civ.id} className={`threat-card ${threatLevel}`}>
                        <div className="threat-header">
                          <h5>{civ.name}</h5>
                          <div className={`threat-level ${threatLevel}`}>
                            {threatLevel.toUpperCase()} THREAT
                          </div>
                        </div>
                        <div className="threat-details">
                          <div className="threat-metric">
                            <span>Military Capacity:</span>
                            <div className="threat-bar">
                              <div 
                                className="threat-fill" 
                                style={{ width: `${threatScore}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="threat-factors">
                            <span>• {civ.controlledSystems} controlled systems</span>
                            <span>• {civ.militaryStrength} military strength</span>
                            <span>• {civ.diplomaticStatus} diplomatic stance</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'systems' && galaxyMap && (
          <div className="systems-tab">
            <div className="systems-overview">
              <h3>⭐ Star Systems Database</h3>
              <div className="systems-list">
                {galaxyMap.sectors.flatMap(sector => 
                  sector.starSystems.map(system => (
                    <div key={system.id} className="system-card">
                      <div className="system-header">
                        <h4>{system.name}</h4>
                        <div className={`system-status ${system.controlledBy ? 'controlled' : 'neutral'}`}>
                          {system.controlledBy || 'Neutral'}
                        </div>
                      </div>
                      <div className="system-details">
                        <div className="detail-row">
                          <span>Star Type:</span>
                          <span>{system.starType}</span>
                        </div>
                        <div className="detail-row">
                          <span>Planets:</span>
                          <span>{system.planets}</span>
                        </div>
                        <div className="detail-row">
                          <span>Explored:</span>
                          <span>{system.explored ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discoveries' && (
          <div className="discoveries-tab">
            <div className="discoveries-overview">
              <h3>🔬 Recent Scientific Discoveries</h3>
              {discoveries.length > 0 ? (
                <div className="discoveries-list">
                  {discoveries.map(discovery => (
                    <div key={discovery.id} className="discovery-card">
                      <div className="discovery-header">
                        <h4>{discovery.name}</h4>
                        <div className="discovery-type">{discovery.type}</div>
                      </div>
                      <div className="discovery-details">
                        <p><strong>Location:</strong> {discovery.location}</p>
                        <p><strong>Significance:</strong> {discovery.significance}</p>
                        <p><strong>Discovery Date:</strong> {discovery.discoveryDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-discoveries">
                  <p>No recent discoveries available. Expand exploration efforts to uncover new scientific phenomena.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'enhanced' && (
          <div className="enhanced-tab">
            <div className="enhanced-header">
              <h3>🎛️ Enhanced Galaxy Simulation</h3>
              <p>AI-driven insights and performance analytics for galactic civilization management</p>
            </div>

            <div className="enhanced-content">
              {/* Simulation Status */}
              {simulationStatus && (
                <div className="enhanced-section">
                  <h4>🤖 Simulation Status</h4>
                  <div className="status-cards">
                    <div className="status-card">
                      <div className="status-icon">⚡</div>
                      <div className="status-info">
                        <div className="status-label">Status</div>
                        <div className={`status-value ${simulationStatus.active ? 'active' : 'inactive'}`}>
                          {simulationStatus.active ? 'Running' : 'Stopped'}
                        </div>
                      </div>
                    </div>
                    <div className="status-card">
                      <div className="status-icon">🎛️</div>
                      <div className="status-info">
                        <div className="status-label">Active Knobs</div>
                        <div className="status-value">{simulationStatus.knobsActive}</div>
                      </div>
                    </div>
                    <div className="status-card">
                      <div className="status-icon">📊</div>
                      <div className="status-info">
                        <div className="status-label">Events Processed</div>
                        <div className="status-value">{simulationStatus.eventsProcessed}</div>
                      </div>
                    </div>
                  </div>

                  {simulationStatus.performanceMetrics && (
                    <div className="performance-overview">
                      <h5>Performance Overview</h5>
                      <div className="performance-grid">
                        <div className="performance-metric">
                          <span className="metric-label">🚀 Exploration</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill exploration" 
                              style={{ width: `${simulationStatus.performanceMetrics.explorationEfficiency * 100}%` }}
                            ></div>
                          </div>
                          <span className="metric-value">{(simulationStatus.performanceMetrics.explorationEfficiency * 100).toFixed(1)}%</span>
                        </div>
                        <div className="performance-metric">
                          <span className="metric-label">🤝 Diplomacy</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill diplomacy" 
                              style={{ width: `${simulationStatus.performanceMetrics.diplomaticStability * 100}%` }}
                            ></div>
                          </div>
                          <span className="metric-value">{(simulationStatus.performanceMetrics.diplomaticStability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="performance-metric">
                          <span className="metric-label">💰 Economy</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill economy" 
                              style={{ width: `${simulationStatus.performanceMetrics.economicGrowth * 100}%` }}
                            ></div>
                          </div>
                          <span className="metric-value">{(simulationStatus.performanceMetrics.economicGrowth * 100).toFixed(1)}%</span>
                        </div>
                        <div className="performance-metric">
                          <span className="metric-label">🔬 Science</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill science" 
                              style={{ width: `${simulationStatus.performanceMetrics.scientificProgress * 100}%` }}
                            ></div>
                          </div>
                          <span className="metric-value">{(simulationStatus.performanceMetrics.scientificProgress * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI Recommendations */}
              {aiRecommendations && aiRecommendations.recommendations && (
                <div className="enhanced-section">
                  <h4>🧠 AI Recommendations</h4>
                  <div className="recommendations-grid">
                    {aiRecommendations.recommendations.map((rec: any, index: number) => (
                      <div key={index} className={`recommendation-card ${rec.priority}`}>
                        <div className="rec-header">
                          <span className="rec-title">{rec.knobName.replace(/_/g, ' ')}</span>
                          <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                        </div>
                        <div className="rec-adjustment">
                          <span className="current-val">{rec.currentValue.toFixed(2)}</span>
                          <span className="arrow">→</span>
                          <span className="recommended-val">{rec.recommendedValue.toFixed(2)}</span>
                        </div>
                        <div className="rec-description">{rec.reason}</div>
                        <div className="rec-impact">
                          <span className="impact-label">Expected Impact:</span>
                          <span className="impact-text">{rec.expectedImpact}</span>
                        </div>
                        <div className="rec-confidence">
                          <span>Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill" 
                              style={{ width: `${rec.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Analytics */}
              {performanceMetrics && (
                <div className="enhanced-section">
                  <h4>📈 Detailed Analytics</h4>
                  <div className="analytics-dashboard">
                    <div className="analytics-category">
                      <h5>🚀 Exploration Metrics</h5>
                      <div className="metric-details">
                        <div className="metric-item">
                          <span>Systems Explored:</span>
                          <span className="metric-number">{performanceMetrics.metrics.exploration.systemsExplored}</span>
                        </div>
                        <div className="metric-item">
                          <span>Discoveries Made:</span>
                          <span className="metric-number">{performanceMetrics.metrics.exploration.discoveriesMade}</span>
                        </div>
                        <div className="metric-item">
                          <span>Efficiency Rating:</span>
                          <span className="metric-number">{(performanceMetrics.metrics.exploration.explorationEfficiency * 100).toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span>Avg. Exploration Time:</span>
                          <span className="metric-number">{performanceMetrics.metrics.exploration.averageExplorationTime} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-category">
                      <h5>🤝 Diplomatic Metrics</h5>
                      <div className="metric-details">
                        <div className="metric-item">
                          <span>Treaties Signed:</span>
                          <span className="metric-number">{performanceMetrics.metrics.diplomacy.treatiesSigned}</span>
                        </div>
                        <div className="metric-item">
                          <span>Conflicts Resolved:</span>
                          <span className="metric-number">{performanceMetrics.metrics.diplomacy.conflictsResolved}</span>
                        </div>
                        <div className="metric-item">
                          <span>Stability Index:</span>
                          <span className="metric-number">{(performanceMetrics.metrics.diplomacy.diplomaticStability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span>Relationship Changes:</span>
                          <span className="metric-number">{performanceMetrics.metrics.diplomacy.relationshipChanges}</span>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-category">
                      <h5>💰 Economic Metrics</h5>
                      <div className="metric-details">
                        <div className="metric-item">
                          <span>Trade Routes:</span>
                          <span className="metric-number">{performanceMetrics.metrics.economy.tradeRoutesEstablished}</span>
                        </div>
                        <div className="metric-item">
                          <span>Resources Extracted:</span>
                          <span className="metric-number">{performanceMetrics.metrics.economy.resourcesExtracted.toLocaleString()}</span>
                        </div>
                        <div className="metric-item">
                          <span>Growth Rate:</span>
                          <span className="metric-number">{(performanceMetrics.metrics.economy.economicGrowth * 100).toFixed(1)}%</span>
                        </div>
                        <div className="metric-item">
                          <span>Trade Volume:</span>
                          <span className="metric-number">{performanceMetrics.metrics.economy.tradeVolume.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-category">
                      <h5>🔬 Scientific Metrics</h5>
                      <div className="metric-details">
                        <div className="metric-item">
                          <span>Research Completed:</span>
                          <span className="metric-number">{performanceMetrics.metrics.science.researchCompleted}</span>
                        </div>
                        <div className="metric-item">
                          <span>Anomalies Studied:</span>
                          <span className="metric-number">{performanceMetrics.metrics.science.anomaliesStudied}</span>
                        </div>
                        <div className="metric-item">
                          <span>Breakthroughs:</span>
                          <span className="metric-number">{performanceMetrics.metrics.science.scientificBreakthroughs}</span>
                        </div>
                        <div className="metric-item">
                          <span>Research Efficiency:</span>
                          <span className="metric-number">{(performanceMetrics.metrics.science.researchEfficiency * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trends Summary */}
                  <div className="trends-summary">
                    <h5>📊 Current Trends</h5>
                    <div className="trends-grid">
                      <div className={`trend-item ${performanceMetrics.trends.explorationTrend}`}>
                        <span className="trend-icon">🚀</span>
                        <span className="trend-label">Exploration</span>
                        <span className={`trend-status ${performanceMetrics.trends.explorationTrend}`}>
                          {performanceMetrics.trends.explorationTrend}
                        </span>
                      </div>
                      <div className={`trend-item ${performanceMetrics.trends.diplomaticTrend}`}>
                        <span className="trend-icon">🤝</span>
                        <span className="trend-label">Diplomacy</span>
                        <span className={`trend-status ${performanceMetrics.trends.diplomaticTrend}`}>
                          {performanceMetrics.trends.diplomaticTrend}
                        </span>
                      </div>
                      <div className={`trend-item ${performanceMetrics.trends.economicTrend}`}>
                        <span className="trend-icon">💰</span>
                        <span className="trend-label">Economy</span>
                        <span className={`trend-status ${performanceMetrics.trends.economicTrend}`}>
                          {performanceMetrics.trends.economicTrend}
                        </span>
                      </div>
                      <div className={`trend-item ${performanceMetrics.trends.scientificTrend}`}>
                        <span className="trend-icon">🔬</span>
                        <span className="trend-label">Science</span>
                        <span className={`trend-status ${performanceMetrics.trends.scientificTrend}`}>
                          {performanceMetrics.trends.scientificTrend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'spatial' && (
          <div className="spatial-intel-tab">
            <div className="spatial-header">
              <h3>🧠 Spatial Intelligence Network</h3>
              <p>Advanced character AI spatial awareness, military intelligence, trade logistics, and sensor systems</p>
            </div>

            <div className="spatial-content">
              {/* Character Spatial Intelligence */}
              {spatialIntelligence && (
                <div className="spatial-section">
                  <h4>👤 Character Intelligence Profile</h4>
                  <div className="character-profile">
                    <div className="profile-header">
                      <div className="character-info">
                        <span className="character-id">{spatialIntelligence.characterId}</span>
                        <span className="character-role">{spatialIntelligence.role.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="character-position">
                        <span className="position-label">Position:</span>
                        <span className="position-coords">
                          {spatialIntelligence.position.systemId} 
                          ({spatialIntelligence.position.coordinates.x}, {spatialIntelligence.position.coordinates.y}, {spatialIntelligence.position.coordinates.z})
                        </span>
                      </div>
                    </div>
                    
                    <div className="capabilities-grid">
                      <div className="capability-item">
                        <span className="cap-label">Sensor Range:</span>
                        <span className="cap-value">{spatialIntelligence.capabilities.sensorRange} units</span>
                      </div>
                      <div className="capability-item">
                        <span className="cap-label">Network Reach:</span>
                        <span className="cap-value">{spatialIntelligence.capabilities.intelligenceNetworkReach} units</span>
                      </div>
                      <div className="capability-item">
                        <span className="cap-label">Analysis Accuracy:</span>
                        <span className="cap-value">{(spatialIntelligence.capabilities.analysisAccuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="capability-item">
                        <span className="cap-label">Prediction Reliability:</span>
                        <span className="cap-value">{(spatialIntelligence.capabilities.predictionReliability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Military Intelligence */}
              {militaryIntelligence && (
                <div className="spatial-section">
                  <h4>⚔️ Military Intelligence</h4>
                  <div className="military-intel">
                    <div className="strategic-assessment">
                      <h5>Strategic Assessment</h5>
                      <div className="assessment-grid">
                        <div className="assessment-item">
                          <span className="assess-label">Overall Threat Level:</span>
                          <span className={`assess-value threat-${militaryIntelligence.strategicAssessment.overallThreatLevel >= 7 ? 'high' : militaryIntelligence.strategicAssessment.overallThreatLevel >= 4 ? 'medium' : 'low'}`}>
                            {militaryIntelligence.strategicAssessment.overallThreatLevel}/10
                          </span>
                        </div>
                        <div className="assessment-item">
                          <span className="assess-label">Immediate Threats:</span>
                          <span className="assess-value">{militaryIntelligence.strategicAssessment.immediateThreats}</span>
                        </div>
                        <div className="assessment-item">
                          <span className="assess-label">Force Balance:</span>
                          <span className={`assess-value ${militaryIntelligence.strategicAssessment.strategicBalance >= 0 ? 'positive' : 'negative'}`}>
                            {militaryIntelligence.strategicAssessment.strategicBalance >= 0 ? '+' : ''}{(militaryIntelligence.strategicAssessment.strategicBalance * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="fleet-movements">
                      <h5>Fleet Movements</h5>
                      <div className="movements-list">
                        {militaryIntelligence.fleetMovements.map((fleet: any, index: number) => (
                          <div key={index} className={`fleet-movement threat-level-${fleet.threatLevel}`}>
                            <div className="fleet-header">
                              <span className="fleet-id">{fleet.fleetId}</span>
                              <span className={`threat-badge threat-${fleet.threatLevel >= 7 ? 'high' : fleet.threatLevel >= 4 ? 'medium' : 'low'}`}>
                                Threat: {fleet.threatLevel}/10
                              </span>
                            </div>
                            <div className="fleet-details">
                              <div className="fleet-position">
                                <span>Current: {fleet.currentPosition.systemId}</span>
                                <span>ETA: {new Date(fleet.estimatedArrival).toLocaleTimeString()}</span>
                              </div>
                              <div className="fleet-confidence">
                                Confidence: {(fleet.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="intelligence-network">
                      <h5>Intelligence Network Status</h5>
                      <div className="network-stats">
                        <div className="network-item">
                          <span>Coverage:</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${militaryIntelligence.intelligenceNetworkStatus.coverage * 100}%` }}
                            ></div>
                          </div>
                          <span>{(militaryIntelligence.intelligenceNetworkStatus.coverage * 100).toFixed(0)}%</span>
                        </div>
                        <div className="network-item">
                          <span>Active Agents:</span>
                          <span className="network-value">{militaryIntelligence.intelligenceNetworkStatus.activeAgents}</span>
                        </div>
                        <div className="network-item">
                          <span>Recent Intelligence:</span>
                          <span className="network-value">{militaryIntelligence.intelligenceNetworkStatus.recentIntelligence}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trade Opportunities */}
              {tradeOpportunities && (
                <div className="spatial-section">
                  <h4>💰 Trade Intelligence</h4>
                  <div className="trade-intel">
                    <div className="opportunities-list">
                      {tradeOpportunities.opportunities.map((opp: any, index: number) => (
                        <div key={index} className="trade-opportunity">
                          <div className="opp-header">
                            <span className="opp-type">{opp.type}</span>
                            <span className="opp-goods">{opp.goods}</span>
                            <span className={`profit-margin ${opp.profitMargin >= 0.5 ? 'high' : opp.profitMargin >= 0.3 ? 'medium' : 'low'}`}>
                              {(opp.profitMargin * 100).toFixed(1)}% profit
                            </span>
                          </div>
                          <div className="opp-route">
                            <div className="route-point">
                              <span className="point-label">Buy:</span>
                              <span className="point-location">{opp.buyLocation.systemId}</span>
                              <span className="point-price">${opp.buyLocation.price}</span>
                            </div>
                            <div className="route-arrow">→</div>
                            <div className="route-point">
                              <span className="point-label">Sell:</span>
                              <span className="point-location">{opp.sellLocation.systemId}</span>
                              <span className="point-price">${opp.sellLocation.price}</span>
                            </div>
                          </div>
                          <div className="opp-details">
                            <span>Distance: {opp.distance} units</span>
                            <span>Travel: {opp.travelTime}h</span>
                            <span>Risk: {(opp.riskLevel * 100).toFixed(0)}%</span>
                            <span>Competition: {(opp.competitionLevel * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="market-analysis">
                      <h5>Market Analysis</h5>
                      <div className="market-grid">
                        <div className="market-category">
                          <h6>Hot Commodities</h6>
                          <div className="commodity-list">
                            {tradeOpportunities.marketAnalysis.hotCommodities.map((commodity: string, index: number) => (
                              <span key={index} className="commodity-tag hot">{commodity.replace(/_/g, ' ')}</span>
                            ))}
                          </div>
                        </div>
                        <div className="market-category">
                          <h6>Emerging Markets</h6>
                          <div className="market-list">
                            {tradeOpportunities.marketAnalysis.emergingMarkets.map((market: string, index: number) => (
                              <span key={index} className="market-tag emerging">{market.replace(/_/g, ' ')}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensor Contacts */}
              {sensorContacts && (
                <div className="spatial-section">
                  <h4>📡 Sensor Network</h4>
                  <div className="sensor-intel">
                    <div className="sensor-status">
                      <h5>Sensor Status</h5>
                      <div className="sensor-stats">
                        <div className="sensor-stat">
                          <span>Operational:</span>
                          <span className="stat-value good">{sensorContacts.sensorStatus.operationalSensors}</span>
                        </div>
                        <div className="sensor-stat">
                          <span>Degraded:</span>
                          <span className="stat-value warning">{sensorContacts.sensorStatus.degradedSensors}</span>
                        </div>
                        <div className="sensor-stat">
                          <span>Offline:</span>
                          <span className="stat-value error">{sensorContacts.sensorStatus.offlineSensors}</span>
                        </div>
                        <div className="sensor-stat">
                          <span>Efficiency:</span>
                          <span className="stat-value">{(sensorContacts.sensorStatus.overallEfficiency * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="contacts-list">
                      <h5>Detected Contacts</h5>
                      {sensorContacts.contacts.map((contact: any, index: number) => (
                        <div key={index} className={`sensor-contact contact-${contact.type}`}>
                          <div className="contact-header">
                            <span className="contact-id">{contact.contactId}</span>
                            <span className={`contact-type ${contact.type}`}>{contact.type}</span>
                            <span className="contact-range">{contact.range} units</span>
                          </div>
                          <div className="contact-details">
                            <div className="contact-position">
                              <span>Location: {contact.position.systemId}</span>
                              <span>Size: {contact.size}</span>
                            </div>
                            <div className="contact-confidence">
                              <span>Confidence: {(contact.confidence * 100).toFixed(0)}%</span>
                              <span>Classification: {contact.classification || 'Unknown'}</span>
                            </div>
                          </div>
                          <div className="contact-timestamp">
                            Detected: {new Date(contact.detectedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaxyDataScreen;