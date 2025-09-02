/**
 * Galaxy Data Screen - Comprehensive Galaxy Information and Analysis
 * 
 * This screen provides comprehensive galaxy data including:
 * - Star systems and their properties
 * - Civilizations and diplomatic relations
 * - Discoveries and anomalies
 * - Resource distribution and economic data
 * - Exploration progress and mapping
 * 
 * Uses the space theme with blue color scheme for galaxy aesthetics
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './GalaxyDataScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface StarSystem {
  id: string;
  name: string;
  type: 'main_sequence' | 'giant' | 'dwarf' | 'binary' | 'pulsar' | 'black_hole';
  distance: number;
  coordinates: { x: number; y: number; z: number };
  planets: number;
  habitability: number;
  strategicValue: number;
  status: 'explored' | 'partially_explored' | 'unexplored' | 'restricted';
  resources: string[];
  anomalies: string[];
  discovered: string;
  exploredBy: string;
}

interface Civilization {
  id: string;
  name: string;
  type: 'spacefaring' | 'planetary' | 'nomadic' | 'ancient' | 'emerging';
  technology: number;
  population: number;
  territory: string[];
  relationship: 'ally' | 'friendly' | 'neutral' | 'hostile' | 'unknown';
  tradeVolume: number;
  diplomaticStatus: string;
  lastContact: string;
  threatLevel: number;
  advantages: string[];
  weaknesses: string[];
}

interface Discovery {
  id: string;
  name: string;
  type: 'anomaly' | 'ruins' | 'resource' | 'phenomenon' | 'artifact';
  location: string;
  significance: 'low' | 'medium' | 'high' | 'critical';
  scientificValue: number;
  economicValue: number;
  date: string;
  discoveredBy: string;
  description: string;
  status: 'investigating' | 'analyzed' | 'exploited' | 'preserved';
  coordinates: { x: number; y: number; z: number };
}

interface ResourceNode {
  id: string;
  type: string;
  location: string;
  quantity: number;
  quality: number;
  accessibility: number;
  extractionCost: number;
  marketValue: number;
  depletionRate: number;
  sustainability: number;
}

interface GalaxyData {
  overview: {
    totalSystems: number;
    exploredSystems: number;
    totalCivilizations: number;
    activeThreats: number;
    totalResources: number;
    explorationProgress: number;
    averageHabitability: number;
    strategicValue: number;
  };
  starSystems: StarSystem[];
  civilizations: Civilization[];
  discoveries: Discovery[];
  resources: ResourceNode[];
  exploration: {
    currentExpeditions: number;
    completedMissions: number;
    totalDiscoveries: number;
    mappingProgress: number;
    explorationBudget: number;
    personnel: number;
  };
}

const GalaxyDataScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [galaxyData, setGalaxyData] = useState<GalaxyData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'systems' | 'civilizations' | 'discoveries' | 'resources'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🌌' },
    { id: 'systems', label: 'Star Systems', icon: '⭐' },
    { id: 'civilizations', label: 'Civilizations', icon: '👽' },
    { id: 'discoveries', label: 'Discoveries', icon: '🔍' },
    { id: 'resources', label: 'Resources', icon: '💎' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/galaxy/data', description: 'Get galaxy data' },
    { method: 'GET', path: '/api/galaxy/systems', description: 'Get star systems data' },
    { method: 'GET', path: '/api/galaxy/civilizations', description: 'Get civilizations data' }
  ];

  // Utility functions
  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'main_sequence': return '#3b82f6';
      case 'giant': return '#f59e0b';
      case 'dwarf': return '#6b7280';
      case 'binary': return '#8b5cf6';
      case 'pulsar': return '#ef4444';
      case 'black_hole': return '#000000';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'explored': return '#10b981';
      case 'partially_explored': return '#f59e0b';
      case 'unexplored': return '#6b7280';
      case 'restricted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'ally': return '#10b981';
      case 'friendly': return '#3b82f6';
      case 'neutral': return '#f59e0b';
      case 'hostile': return '#ef4444';
      case 'unknown': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchGalaxyData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/galaxy/data');
      if (response.ok) {
        const data = await response.json();
        setGalaxyData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch galaxy data:', err);
      // Use comprehensive mock data
      setGalaxyData({
        overview: {
          totalSystems: 2847,
          exploredSystems: 2078,
          totalCivilizations: 156,
          activeThreats: 23,
          totalResources: 1247,
          explorationProgress: 73.0,
          averageHabitability: 42.3,
          strategicValue: 78.5
        },
        starSystems: [
          {
            id: 'sys-1',
            name: 'Alpha Centauri',
            type: 'main_sequence',
            distance: 4.37,
            coordinates: { x: 0, y: 0, z: 0 },
            planets: 3,
            habitability: 85,
            strategicValue: 92,
            status: 'explored',
            resources: ['Helium-3', 'Rare Metals', 'Water Ice'],
            anomalies: ['Gravitational Anomaly'],
            discovered: '2020-03-15',
            exploredBy: 'Humanity'
          },
          {
            id: 'sys-2',
            name: 'Vega',
            type: 'main_sequence',
            distance: 25.04,
            coordinates: { x: 15.2, y: 8.7, z: 12.3 },
            planets: 5,
            habitability: 67,
            strategicValue: 78,
            status: 'partially_explored',
            resources: ['Platinum', 'Uranium', 'Organic Compounds'],
            anomalies: ['Dark Matter Concentration'],
            discovered: '2021-07-22',
            exploredBy: 'Humanity'
          },
          {
            id: 'sys-3',
            name: 'Sirius',
            type: 'binary',
            distance: 8.60,
            coordinates: { x: -5.1, y: 3.2, z: 7.8 },
            planets: 2,
            habitability: 45,
            strategicValue: 65,
            status: 'explored',
            resources: ['Diamond Cores', 'Exotic Matter'],
            anomalies: ['Binary Star Dynamics'],
            discovered: '2020-11-08',
            exploredBy: 'Humanity'
          }
        ],
        civilizations: [
          {
            id: 'civ-1',
            name: 'Terran Federation',
            type: 'spacefaring',
            technology: 95,
            population: 85000000000,
            territory: ['Sol System', 'Alpha Centauri', 'Proxima Centauri'],
            relationship: 'ally',
            tradeVolume: 1250000000000,
            diplomaticStatus: 'Full Alliance',
            lastContact: '2024-03-15',
            threatLevel: 0,
            advantages: ['Advanced Technology', 'Large Population', 'Strategic Location'],
            weaknesses: ['Resource Dependence', 'Political Fragmentation']
          },
          {
            id: 'civ-2',
            name: 'Vega Collective',
            type: 'spacefaring',
            technology: 87,
            population: 42000000000,
            territory: ['Vega System', 'Epsilon Eridani'],
            relationship: 'friendly',
            tradeVolume: 680000000000,
            diplomaticStatus: 'Trade Partnership',
            lastContact: '2024-03-10',
            threatLevel: 15,
            advantages: ['Resource Rich', 'Stable Government', 'Advanced AI'],
            weaknesses: ['Isolationist Tendencies', 'Limited Military']
          },
          {
            id: 'civ-3',
            name: 'Sirius Syndicate',
            type: 'spacefaring',
            technology: 82,
            population: 28000000000,
            territory: ['Sirius System', 'Barnard\'s Star'],
            relationship: 'neutral',
            tradeVolume: 450000000000,
            diplomaticStatus: 'Diplomatic Relations',
            lastContact: '2024-03-08',
            threatLevel: 35,
            advantages: ['Mercantile Culture', 'Flexible Diplomacy', 'Resource Networks'],
            weaknesses: ['Factional Disputes', 'Unpredictable Leadership']
          }
        ],
        discoveries: [
          {
            id: 'disc-1',
            name: 'Dark Matter Anomaly',
            type: 'anomaly',
            location: 'Vega System Edge',
            significance: 'high',
            scientificValue: 87,
            economicValue: 23,
            date: '2024-01-08',
            discoveredBy: 'Vega Collective',
            description: 'Unusual dark matter concentration that defies current physics models',
            status: 'investigating',
            coordinates: { x: 15.2, y: 8.7, z: 12.3 }
          },
          {
            id: 'disc-2',
            name: 'Precursor Ruins',
            type: 'ruins',
            location: 'Ross 128 c',
            significance: 'critical',
            scientificValue: 95,
            economicValue: 78,
            date: '2024-01-05',
            discoveredBy: 'Humanity',
            description: 'Ancient ruins from an unknown civilization with advanced materials',
            status: 'analyzed',
            coordinates: { x: 8.9, y: -2.1, z: 5.6 }
          },
          {
            id: 'disc-3',
            name: 'Exotic Gas Giant',
            type: 'phenomenon',
            location: 'Proxima System',
            significance: 'medium',
            scientificValue: 67,
            economicValue: 56,
            date: '2024-01-03',
            discoveredBy: 'Humanity',
            description: 'Gas giant with unusual atmospheric composition',
            status: 'exploited',
            coordinates: { x: 2.1, y: -1.8, z: 3.2 }
          }
        ],
        resources: [
          {
            id: 'res-1',
            type: 'Helium-3',
            location: 'Alpha Centauri',
            quantity: 8500000000,
            quality: 92,
            accessibility: 78,
            extractionCost: 1250000000,
            marketValue: 85000000000,
            depletionRate: 0.5,
            sustainability: 85
          },
          {
            id: 'res-2',
            type: 'Rare Metals',
            location: 'Vega System',
            quantity: 12500000000,
            quality: 88,
            accessibility: 65,
            extractionCost: 2800000000,
            marketValue: 125000000000,
            depletionRate: 1.2,
            sustainability: 72
          },
          {
            id: 'res-3',
            type: 'Exotic Matter',
            location: 'Sirius System',
            quantity: 3200000000,
            quality: 95,
            accessibility: 45,
            extractionCost: 4500000000,
            marketValue: 280000000000,
            depletionRate: 0.3,
            sustainability: 95
          }
        ],
        exploration: {
          currentExpeditions: 12,
          completedMissions: 847,
          totalDiscoveries: 1247,
          mappingProgress: 73.0,
          explorationBudget: 85000000000,
          personnel: 12500
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalaxyData();
  }, [fetchGalaxyData]);

  const renderOverview = () => (
    <>
      {/* Galaxy Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🌌 Galaxy Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Systems</span>
            <span className="standard-metric-value">{galaxyData?.overview.totalSystems.toLocaleString()}</span>
          </div>
          <div className="standard-metric">
            <span>Explored Systems</span>
            <span className="standard-metric-value">{galaxyData?.overview.exploredSystems.toLocaleString()}</span>
          </div>
          <div className="standard-metric">
            <span>Exploration Progress</span>
            <span className="standard-metric-value">{galaxyData?.overview.explorationProgress}%</span>
          </div>
          <div className="standard-metric">
            <span>Total Civilizations</span>
            <span className="standard-metric-value">{galaxyData?.overview.totalCivilizations}</span>
          </div>
          <div className="standard-metric">
            <span>Active Threats</span>
            <span className="standard-metric-value">{galaxyData?.overview.activeThreats}</span>
          </div>
          <div className="standard-metric">
            <span>Strategic Value</span>
            <span className="standard-metric-value">{galaxyData?.overview.strategicValue}/100</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Galaxy Analysis')}>Galaxy Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Exploration Report')}>Exploration Report</button>
        </div>
      </div>

      {/* Exploration Status - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚀 Exploration Status</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Current Expeditions</span>
            <span className="standard-metric-value">{galaxyData?.exploration.currentExpeditions}</span>
          </div>
          <div className="standard-metric">
            <span>Completed Missions</span>
            <span className="standard-metric-value">{galaxyData?.exploration.completedMissions}</span>
          </div>
          <div className="standard-metric">
            <span>Total Discoveries</span>
            <span className="standard-metric-value">{galaxyData?.exploration.totalDiscoveries}</span>
          </div>
          <div className="standard-metric">
            <span>Mapping Progress</span>
            <span className="standard-metric-value">{galaxyData?.exploration.mappingProgress}%</span>
          </div>
          <div className="standard-metric">
            <span>Exploration Budget</span>
            <span className="standard-metric-value">{formatNumber(galaxyData?.exploration.explorationBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Personnel</span>
            <span className="standard-metric-value">{galaxyData?.exploration.personnel.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Galaxy Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel space-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Galaxy Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <PieChart
                data={[
                  { label: 'Explored', value: galaxyData?.overview.exploredSystems || 0, color: '#10b981' },
                  { label: 'Partially Explored', value: Math.floor((galaxyData?.overview.totalSystems || 0) * 0.15), color: '#f59e0b' },
                  { label: 'Unexplored', value: (galaxyData?.overview.totalSystems || 0) - (galaxyData?.overview.exploredSystems || 0), color: '#6b7280' }
                ]}
                title="🌌 Exploration Status"
                size={200}
                showLegend={true}
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={galaxyData?.starSystems?.slice(0, 5).map(system => ({
                  label: system.name,
                  value: system.habitability,
                  color: system.id === 'sys-1' ? '#3b82f6' : '#8b5cf6'
                })) || []}
                title="⭐ System Habitability Scores"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSystems = () => (
    <>
      {/* Star Systems Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⭐ Star Systems Database</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('System Analysis')}>System Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Exploration Planning')}>Exploration Planning</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>System</span>
            <span>Type</span>
            <span>Distance</span>
            <span>Planets</span>
            <span>Habitability</span>
            <span>Status</span>
            <span>Strategic Value</span>
            <span>Actions</span>
          </div>
          {galaxyData?.starSystems?.map(system => (
            <div key={system.id} className="table-row">
              <span>⭐ {system.name}</span>
              <span style={{ color: getTypeColor(system.type) }}>
                {system.type.replace('_', ' ')}
              </span>
              <span>{system.distance} ly</span>
              <span>{system.planets}</span>
              <span>{system.habitability}%</span>
              <span style={{ color: getStatusColor(system.status) }}>
                {system.status.replace('_', ' ')}
              </span>
              <span>{system.strategicValue}/100</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>View</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderCivilizations = () => (
    <>
      {/* Civilizations Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👽 Known Civilizations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Diplomatic Analysis')}>Diplomatic Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Threat Assessment')}>Threat Assessment</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Civilization</span>
            <span>Type</span>
            <span>Technology</span>
            <span>Population</span>
            <span>Relationship</span>
            <span>Trade Volume</span>
            <span>Threat Level</span>
            <span>Actions</span>
          </div>
          {galaxyData?.civilizations?.map(civ => (
            <div key={civ.id} className="table-row">
              <span>👽 {civ.name}</span>
              <span>{civ.type.charAt(0).toUpperCase() + civ.type.slice(1)}</span>
              <span>{civ.technology}/100</span>
              <span>{formatNumber(civ.population)}</span>
              <span style={{ color: getRelationshipColor(civ.relationship) }}>
                {civ.relationship.charAt(0).toUpperCase() + civ.relationship.slice(1)}
              </span>
              <span>{formatNumber(civ.tradeVolume)}</span>
              <span>{civ.threatLevel}/100</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Contact</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderDiscoveries = () => (
    <>
      {/* Discoveries Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🔍 Major Discoveries</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Discovery Analysis')}>Discovery Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Scientific Review')}>Scientific Review</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Discovery</span>
            <span>Type</span>
            <span>Location</span>
            <span>Significance</span>
            <span>Scientific Value</span>
            <span>Economic Value</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {galaxyData?.discoveries?.map(discovery => (
            <div key={discovery.id} className="table-row">
              <span>🔍 {discovery.name}</span>
              <span>{discovery.type.charAt(0).toUpperCase() + discovery.type.slice(1)}</span>
              <span>⭐ {discovery.location}</span>
              <span style={{ color: getSignificanceColor(discovery.significance) }}>
                {discovery.significance.charAt(0).toUpperCase() + discovery.significance.slice(1)}
              </span>
              <span>{discovery.scientificValue}/100</span>
              <span>{discovery.economicValue}/100</span>
              <span style={{ color: getStatusColor(discovery.status) }}>
                {discovery.status.charAt(0).toUpperCase() + discovery.status.slice(1)}
              </span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Investigate</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderResources = () => (
    <>
      {/* Resources Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>💎 Resource Distribution</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Resource Analysis')}>Resource Analysis</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Extraction Planning')}>Extraction Planning</button>
        </div>
        
        <div className="standard-data-table">
          <div className="table-header">
            <span>Resource</span>
            <span>Location</span>
            <span>Quantity</span>
            <span>Quality</span>
            <span>Accessibility</span>
            <span>Market Value</span>
            <span>Sustainability</span>
            <span>Actions</span>
          </div>
          {galaxyData?.resources?.map(resource => (
            <div key={resource.id} className="table-row">
              <span>💎 {resource.type}</span>
              <span>⭐ {resource.location}</span>
              <span>{formatNumber(resource.quantity)}</span>
              <span>{resource.quality}/100</span>
              <span>{resource.accessibility}/100</span>
              <span>{formatNumber(resource.marketValue)}</span>
              <span>{resource.sustainability}/100</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Extract</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchGalaxyData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container space-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && galaxyData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'systems' && renderSystems()}
              {activeTab === 'civilizations' && renderCivilizations()}
              {activeTab === 'discoveries' && renderDiscoveries()}
              {activeTab === 'resources' && renderResources()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading galaxy data...' : 'No galaxy data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GalaxyDataScreen;
