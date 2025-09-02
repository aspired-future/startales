/**
 * Military Screen - Operational Military Forces, Fleet Management, and Base Operations
 * 
 * This screen focuses on operational military activities including:
 * - Fleet deployments and ship management
 * - Military base operations and logistics
 * - Active military operations and missions
 * - Tactical threat response and readiness
 * 
 * Distinct from:
 * - Defense Screen: High-level policy, strategic planning, budget allocation
 * - Joint Chiefs Screen: Command hierarchy, service leadership, strategic coordination
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './MilitaryScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Fleet {
  id: string;
  name: string;
  commander: string;
  location: string;
  status: 'deployed' | 'docked' | 'in-transit' | 'maintenance';
  ships: number;
  readiness: number;
  mission?: string;
  eta?: string;
}

interface MilitaryBase {
  id: string;
  name: string;
  type: 'orbital' | 'planetary' | 'deep-space';
  location: string;
  personnel: number;
  defenseRating: number;
  facilities: string[];
  status: 'operational' | 'construction' | 'damaged';
}

interface ThreatAlert {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  type: 'piracy' | 'invasion' | 'espionage' | 'terrorism' | 'unknown';
  location: string;
  description: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
}

interface MilitaryData {
  fleets: Fleet[];
  bases: MilitaryBase[];
  threats: ThreatAlert[];
  overallReadiness: number;
  totalPersonnel: number;
  activeOperations: number;
  defenseBudget: number;
}

const MilitaryScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [militaryData, setMilitaryData] = useState<MilitaryData | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'fleets' | 'bases' | 'threats'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'fleets', label: 'Fleets', icon: '🚀' },
    { id: 'bases', label: 'Bases', icon: '🏰' },
    { id: 'threats', label: 'Threats', icon: '⚠️' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/military', description: 'Get military data' }
  ];

  // Utility functions
  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return '#10b981';
      case 'docked': return '#fbbf24';
      case 'in-transit': return '#f59e0b';
      case 'maintenance': return '#ef4444';
      case 'operational': return '#10b981';
      case 'construction': return '#fbbf24';
      case 'damaged': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getThreatTypeColor = (type: string) => {
    switch (type) {
      case 'invasion': return '#ef4444';
      case 'piracy': return '#f59e0b';
      case 'espionage': return '#fbbf24';
      case 'terrorism': return '#dc2626';
      case 'unknown': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const fetchMilitaryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/military');
      if (response.ok) {
        const data = await response.json();
        setMilitaryData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch military data:', err);
      // Use comprehensive mock data
      setMilitaryData({
        fleets: generateMockFleets(),
        bases: generateMockBases(),
        threats: generateMockThreats(),
        overallReadiness: 89,
        totalPersonnel: 45000,
        activeOperations: 12,
        defenseBudget: 85000000000
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilitaryData();
  }, [fetchMilitaryData]);

  const generateMockFleets = (): Fleet[] => [
    {
      id: 'fleet-alpha',
      name: 'Alpha Strike Force',
      commander: 'Admiral Chen',
      location: 'Sol System',
      status: 'deployed',
      ships: 24,
      readiness: 95,
      mission: 'Border Patrol',
      eta: '2024-02-15T14:30:00Z'
    },
    {
      id: 'fleet-beta',
      name: 'Beta Defense Squadron',
      commander: 'Captain Rodriguez',
      location: 'Mars Orbital Station',
      status: 'docked',
      ships: 18,
      readiness: 87
    },
    {
      id: 'fleet-gamma',
      name: 'Gamma Exploration Fleet',
      commander: 'Admiral Thompson',
      location: 'Alpha Centauri',
      status: 'in-transit',
      ships: 12,
      readiness: 92,
      mission: 'Deep Space Reconnaissance',
      eta: '2024-02-20T09:15:00Z'
    },
    {
      id: 'fleet-delta',
      name: 'Delta Response Force',
      commander: 'Commodore Williams',
      location: 'Jupiter Station',
      status: 'maintenance',
      ships: 8,
      readiness: 45
    }
  ];

  const generateMockBases = (): MilitaryBase[] => [
    {
      id: 'base-luna',
      name: 'Luna Command Center',
      type: 'orbital',
      location: 'Luna Orbit',
      personnel: 15000,
      defenseRating: 98,
      facilities: ['Command Center', 'Shipyard', 'Training Facility', 'Research Lab'],
      status: 'operational'
    },
    {
      id: 'base-mars',
      name: 'Mars Defense Outpost',
      type: 'planetary',
      location: 'Mars Surface',
      personnel: 8500,
      defenseRating: 85,
      facilities: ['Ground Forces', 'Air Defense', 'Supply Depot'],
      status: 'operational'
    },
    {
      id: 'base-europa',
      name: 'Europa Research Station',
      type: 'planetary',
      location: 'Europa',
      personnel: 3200,
      defenseRating: 65,
      facilities: ['Research Lab', 'Early Warning System'],
      status: 'construction'
    },
    {
      id: 'base-titan',
      name: 'Titan Deep Space Station',
      type: 'deep-space',
      location: 'Titan Orbit',
      personnel: 5200,
      defenseRating: 78,
      facilities: ['Deep Space Monitoring', 'Fuel Depot', 'Emergency Shelter'],
      status: 'operational'
    }
  ];

  const generateMockThreats = (): ThreatAlert[] => [
    {
      id: 'threat-001',
      level: 'medium',
      type: 'piracy',
      location: 'Asteroid Belt',
      description: 'Suspicious vessel activity detected in mining sector',
      timestamp: '2024-02-14T10:30:00Z',
      status: 'investigating'
    },
    {
      id: 'threat-002',
      level: 'low',
      type: 'espionage',
      location: 'Luna Station',
      description: 'Unauthorized access attempt to classified systems',
      timestamp: '2024-02-14T08:15:00Z',
      status: 'resolved'
    },
    {
      id: 'threat-003',
      level: 'high',
      type: 'unknown',
      location: 'Outer Solar System',
      description: 'Unidentified object approaching at high velocity',
      timestamp: '2024-02-14T06:45:00Z',
      status: 'active'
    }
  ];

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Military Overview - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📊 Military Command Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Overall Readiness</span>
            <span className="standard-metric-value">{militaryData?.overallReadiness}%</span>
          </div>
          <div className="standard-metric">
            <span>Total Personnel</span>
            <span className="standard-metric-value">{formatNumber(militaryData?.totalPersonnel || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Operations</span>
            <span className="standard-metric-value">{militaryData?.activeOperations}</span>
          </div>
          <div className="standard-metric">
            <span>Defense Budget</span>
            <span className="standard-metric-value">{formatCurrency(militaryData?.defenseBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Fleets</span>
            <span className="standard-metric-value">{militaryData?.fleets?.length || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Military Bases</span>
            <span className="standard-metric-value">{militaryData?.bases?.length || 0}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Military Analysis')}>Military Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Threat Assessment')}>Threat Assessment</button>
        </div>
      </div>

      {/* Active Fleets - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🚀 Active Fleets</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Fleet</th>
                <th>Commander</th>
                <th>Location</th>
                <th>Status</th>
                <th>Ships</th>
                <th>Readiness</th>
                <th>Mission</th>
              </tr>
            </thead>
            <tbody>
              {militaryData?.fleets?.slice(0, 5).map((fleet) => (
                <tr key={fleet.id}>
                  <td><strong>{fleet.name}</strong></td>
                  <td>{fleet.commander}</td>
                  <td>{fleet.location}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(fleet.status), 
                      color: 'white' 
                    }}>
                      {fleet.status.charAt(0).toUpperCase() + fleet.status.slice(1)}
                    </span>
                  </td>
                  <td>{fleet.ships}</td>
                  <td>{fleet.readiness}%</td>
                  <td>{fleet.mission || 'Standby'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Military Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel security-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📈 Military Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={militaryData?.fleets?.map(fleet => ({
                  label: fleet.name,
                  value: fleet.readiness,
                  color: getStatusColor(fleet.status)
                })) || []}
                title="🚀 Fleet Readiness Levels"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={militaryData?.bases?.map(base => ({
                  label: base.name,
                  value: base.personnel / 1000, // Convert to thousands
                  color: getStatusColor(base.status)
                })) || []}
                title="🏰 Base Personnel Distribution (Thousands)"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderFleets = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🚀 Fleet Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Fleet Analysis')}>Fleet Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Deploy Fleet')}>Deploy Fleet</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Fleet</th>
                <th>Commander</th>
                <th>Location</th>
                <th>Status</th>
                <th>Ships</th>
                <th>Readiness</th>
                <th>Mission</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {militaryData?.fleets?.map((fleet) => (
                <tr key={fleet.id}>
                  <td><strong>{fleet.name}</strong></td>
                  <td>{fleet.commander}</td>
                  <td>{fleet.location}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(fleet.status), 
                      color: 'white' 
                    }}>
                      {fleet.status.charAt(0).toUpperCase() + fleet.status.slice(1)}
                    </span>
                  </td>
                  <td>{fleet.ships}</td>
                  <td>{fleet.readiness}%</td>
                  <td>{fleet.mission || 'Standby'}</td>
                  <td>{fleet.eta ? new Date(fleet.eta).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBases = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🏰 Military Base Operations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Base Analysis')}>Base Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Facility Report')}>Facility Report</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Base</th>
                <th>Type</th>
                <th>Location</th>
                <th>Personnel</th>
                <th>Defense Rating</th>
                <th>Status</th>
                <th>Facilities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {militaryData?.bases?.map((base) => (
                <tr key={base.id}>
                  <td><strong>{base.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: base.type === 'orbital' ? '#10b981' : base.type === 'planetary' ? '#fbbf24' : '#f59e0b', 
                      color: 'white' 
                    }}>
                      {base.type.charAt(0).toUpperCase() + base.type.slice(1)}
                    </span>
                  </td>
                  <td>{base.location}</td>
                  <td>{formatNumber(base.personnel)}</td>
                  <td>{base.defenseRating}/100</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(base.status), 
                      color: 'white' 
                    }}>
                      {base.status.charAt(0).toUpperCase() + base.status.slice(1)}
                    </span>
                  </td>
                  <td>{base.facilities.slice(0, 2).join(', ')}</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderThreats = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚠️ Threat Assessment</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Threat Analysis')}>Threat Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Response Plan')}>Response Plan</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Type</th>
                <th>Location</th>
                <th>Description</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {militaryData?.threats?.map((threat) => (
                <tr key={threat.id}>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getThreatLevelColor(threat.level), 
                      color: 'white' 
                    }}>
                      {threat.level.charAt(0).toUpperCase() + threat.level.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getThreatTypeColor(threat.type), 
                      color: 'white' 
                    }}>
                      {threat.type.charAt(0).toUpperCase() + threat.type.slice(1)}
                    </span>
                  </td>
                  <td>{threat.location}</td>
                  <td>{threat.description}</td>
                  <td>{new Date(threat.timestamp).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: threat.status === 'active' ? '#ef4444' : threat.status === 'investigating' ? '#fbbf24' : '#10b981', 
                      color: 'white' 
                    }}>
                      {threat.status.charAt(0).toUpperCase() + threat.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Respond</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchMilitaryData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && militaryData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'fleets' && renderFleets()}
              {activeTab === 'bases' && renderBases()}
              {activeTab === 'threats' && renderThreats()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading military data...' : 'No military data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default MilitaryScreen;

