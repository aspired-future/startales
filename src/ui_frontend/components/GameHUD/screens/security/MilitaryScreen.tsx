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
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './MilitaryScreen.css';
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
  const [viewMode, setViewMode] = useState<'overview' | 'fleets' | 'bases' | 'threats'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/military/fleets', description: 'Get all fleet status' },
    { method: 'GET', path: '/api/military/bases', description: 'Get military base information' },
    { method: 'GET', path: '/api/military/threats', description: 'Get threat assessments' },
    { method: 'POST', path: '/api/military/deploy', description: 'Deploy fleet to location' },
    { method: 'PUT', path: '/api/military/readiness', description: 'Update readiness level' },
    { method: 'GET', path: '/api/defense/status', description: 'Get defense system status' }
  ];

  const fetchMilitaryData = useCallback(async () => {
    try {
      // Try to fetch real data from API
      const response = await fetch('/api/military/status');
      if (response.ok) {
        const data = await response.json();
        setMilitaryData(data);
        return;
      }
    } catch (error) {
      console.warn('Military API not available, using mock data');
    }

    // Fallback to mock data for development
    const mockData: MilitaryData = {
      fleets: [
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
        }
      ],
      bases: [
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
        }
      ],
      threats: [
        {
          id: 'threat-001',
          level: 'high',
          type: 'piracy',
          location: 'Asteroid Belt',
          description: 'Increased pirate activity reported in mining sectors',
          timestamp: '2024-02-10T08:30:00Z',
          status: 'active'
        },
        {
          id: 'threat-002',
          level: 'medium',
          type: 'espionage',
          location: 'Mars Colony',
          description: 'Suspected intelligence gathering activities detected',
          timestamp: '2024-02-09T15:45:00Z',
          status: 'investigating'
        },
        {
          id: 'threat-003',
          level: 'low',
          type: 'unknown',
          location: 'Outer System',
          description: 'Unidentified signals detected from deep space',
          timestamp: '2024-02-08T22:10:00Z',
          status: 'resolved'
        }
      ],
      overallReadiness: 91,
      totalPersonnel: 26700,
      activeOperations: 3,
      defenseBudget: 2.4e9
    };

    setMilitaryData(mockData);
  }, []);

  useEffect(() => {
    fetchMilitaryData();
  }, [fetchMilitaryData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': case 'operational': return '#4ecdc4';
      case 'docked': case 'construction': return '#fbbf24';
      case 'in-transit': return '#3b82f6';
      case 'maintenance': case 'damaged': return '#ef4444';
      default: return '#b8bcc8';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const renderOverview = () => (
    <div className="military-overview">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{militaryData?.overallReadiness || 0}%</div>
            <div className="metric-label">Overall Readiness</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(militaryData?.totalPersonnel || 0)}</div>
            <div className="metric-label">Total Personnel</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🚀</div>
          <div className="metric-content">
            <div className="metric-value">{militaryData?.fleets.length || 0}</div>
            <div className="metric-label">Active Fleets</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">${formatNumber(militaryData?.defenseBudget || 0)}</div>
            <div className="metric-label">Defense Budget</div>
          </div>
        </div>
      </div>

      <div className="status-panels">
        <div className="panel">
          <h3>🚀 Fleet Status</h3>
          <div className="fleet-summary">
            {militaryData?.fleets.map(fleet => (
              <div key={fleet.id} className="fleet-item">
                <div className="fleet-info">
                  <div className="fleet-name">{fleet.name}</div>
                  <div className="fleet-details">
                    📍 {fleet.location} | 👤 {fleet.commander}
                  </div>
                </div>
                <div className="fleet-status">
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(fleet.status) }}
                  >
                    {fleet.status.toUpperCase()}
                  </div>
                  <div className="readiness-bar">
                    <div 
                      className="readiness-fill"
                      style={{ width: `${fleet.readiness}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>🚨 Active Threats</h3>
          <div className="threats-summary">
            {militaryData?.threats.filter(t => t.status === 'active').map(threat => (
              <div key={threat.id} className="threat-item">
                <div 
                  className="threat-level"
                  style={{ backgroundColor: getThreatColor(threat.level) }}
                >
                  {threat.level.toUpperCase()}
                </div>
                <div className="threat-info">
                  <div className="threat-type">{threat.type.toUpperCase()}</div>
                  <div className="threat-location">📍 {threat.location}</div>
                  <div className="threat-description">{threat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFleets = () => (
    <div className="fleets-view">
      <div className="fleets-grid">
        {militaryData?.fleets.map(fleet => (
          <div 
            key={fleet.id} 
            className={`fleet-card ${selectedFleet?.id === fleet.id ? 'selected' : ''}`}
            onClick={() => setSelectedFleet(fleet)}
          >
            <div className="fleet-header">
              <div className="fleet-name">{fleet.name}</div>
              <div 
                className="fleet-status"
                style={{ color: getStatusColor(fleet.status) }}
              >
                {fleet.status.toUpperCase()}
              </div>
            </div>
            
            <div className="fleet-commander">
              👤 Commander: {fleet.commander}
            </div>
            
            <div className="fleet-location">
              📍 Location: {fleet.location}
            </div>
            
            <div className="fleet-metrics">
              <div className="metric">
                <span>🚀 Ships:</span>
                <span>{fleet.ships}</span>
              </div>
              <div className="metric">
                <span>⚡ Readiness:</span>
                <span>{fleet.readiness}%</span>
              </div>
            </div>
            
            {fleet.mission && (
              <div className="fleet-mission">
                🎯 Mission: {fleet.mission}
              </div>
            )}
            
            {fleet.eta && (
              <div className="fleet-eta">
                ⏰ ETA: {new Date(fleet.eta).toLocaleString()}
              </div>
            )}
            
            <div className="fleet-actions">
              <button className="action-btn small">📋 Orders</button>
              <button className="action-btn small">📊 Status</button>
              <button className="action-btn small">🗺️ Deploy</button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedFleet && (
        <div className="fleet-detail-panel">
          <div className="detail-header">
            <h3>{selectedFleet.name}</h3>
            <button onClick={() => setSelectedFleet(null)}>✕</button>
          </div>
          
          <div className="fleet-details">
            <div className="detail-section">
              <h4>Command Information</h4>
              <div className="detail-item">
                <span>Commander:</span>
                <span>{selectedFleet.commander}</span>
              </div>
              <div className="detail-item">
                <span>Current Location:</span>
                <span>{selectedFleet.location}</span>
              </div>
              <div className="detail-item">
                <span>Status:</span>
                <span style={{ color: getStatusColor(selectedFleet.status) }}>
                  {selectedFleet.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Fleet Composition</h4>
              <div className="detail-item">
                <span>Total Ships:</span>
                <span>{selectedFleet.ships}</span>
              </div>
              <div className="detail-item">
                <span>Readiness Level:</span>
                <span>{selectedFleet.readiness}%</span>
              </div>
            </div>
            
            {selectedFleet.mission && (
              <div className="detail-section">
                <h4>Current Mission</h4>
                <div className="mission-info">
                  <div>{selectedFleet.mission}</div>
                  {selectedFleet.eta && (
                    <div className="eta">
                      ETA: {new Date(selectedFleet.eta).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="fleet-commands">
            <button className="action-btn primary">🚀 New Mission</button>
            <button className="action-btn secondary">🔄 Recall Fleet</button>
            <button className="action-btn secondary">⚡ Resupply</button>
            <button className="action-btn secondary">📊 Full Report</button>
          </div>
        </div>
      )}

      {/* Military Charts Section */}
      <div className="military-charts-section">
        <div className="charts-grid">
          <div className="chart-container">
            <BarChart
              data={militaryData?.fleets.slice(0, 6).map((fleet, index) => ({
                label: fleet.name.split(' ')[0], // Shorten names
                value: fleet.ships,
                color: ['#4ecdc4', '#45b7aa', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][index]
              })) || []}
              title="🚀 Fleet Strength (Ships)"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>

          <div className="chart-container">
            <LineChart
              data={militaryData?.fleets.slice(0, 6).map((fleet, index) => ({
                label: fleet.name.split(' ')[0], // Shorten names
                value: fleet.readiness
              })) || []}
              title="⚡ Fleet Readiness Levels"
              color="#4ecdc4"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={[
                { label: 'Active', value: militaryData?.fleets.filter(f => f.status === 'active').length || 0, color: '#4ecdc4' },
                { label: 'Deployed', value: militaryData?.fleets.filter(f => f.status === 'deployed').length || 0, color: '#45b7aa' },
                { label: 'Maintenance', value: militaryData?.fleets.filter(f => f.status === 'maintenance').length || 0, color: '#feca57' },
                { label: 'Standby', value: militaryData?.fleets.filter(f => f.status === 'standby').length || 0, color: '#96ceb4' }
              ]}
              title="🎯 Fleet Status Distribution"
              size={200}
              showLegend={true}
            />
          </div>

          <div className="chart-container">
            <BarChart
              data={militaryData?.bases.slice(0, 6).map((base, index) => ({
                label: base.location.split(' ')[0], // Shorten names
                value: base.personnel,
                color: ['#4ecdc4', '#45b7aa', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][index]
              })) || []}
              title="👥 Base Personnel Distribution"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>

          <div className="chart-container">
            <LineChart
              data={[
                { label: 'Q1 2023', value: 85 },
                { label: 'Q2 2023', value: 88 },
                { label: 'Q3 2023', value: 91 },
                { label: 'Q4 2023', value: 89 },
                { label: 'Q1 2024', value: 93 },
                { label: 'Q2 2024', value: 95 }
              ]}
              title="📈 Defense Spending Trends (%)"
              color="#feca57"
              height={250}
              width={400}
            />
          </div>

          <div className="chart-container">
            <PieChart
              data={militaryData?.bases.slice(0, 5).map((base, index) => ({
                label: base.type.replace('-', ' '),
                value: base.defenseRating,
                color: ['#4ecdc4', '#45b7aa', '#96ceb4', '#feca57', '#ff9ff3'][index]
              })) || []}
              title="🛡️ Base Defense Ratings"
              size={200}
              showLegend={true}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBases = () => (
    <div className="bases-view">
      <div className="bases-grid">
        {militaryData?.bases.map(base => (
          <div key={base.id} className="base-card">
            <div className="base-header">
              <div className="base-name">{base.name}</div>
              <div 
                className="base-status"
                style={{ color: getStatusColor(base.status) }}
              >
                {base.status.toUpperCase()}
              </div>
            </div>
            
            <div className="base-type">
              🏗️ Type: {base.type.replace('-', ' ').toUpperCase()}
            </div>
            
            <div className="base-location">
              📍 Location: {base.location}
            </div>
            
            <div className="base-metrics">
              <div className="metric">
                <span>👥 Personnel:</span>
                <span>{formatNumber(base.personnel)}</span>
              </div>
              <div className="metric">
                <span>🛡️ Defense:</span>
                <span>{base.defenseRating}%</span>
              </div>
            </div>
            
            <div className="base-facilities">
              <div className="facilities-label">🏢 Facilities:</div>
              <div className="facilities-list">
                {base.facilities.map(facility => (
                  <span key={facility} className="facility-tag">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="base-actions">
              <button className="action-btn small">📊 Status</button>
              <button className="action-btn small">🔧 Upgrade</button>
              <button className="action-btn small">👥 Personnel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThreats = () => (
    <div className="threats-view">
      <div className="threats-header">
        <h3>🚨 Threat Assessment Dashboard</h3>
        <div className="threat-summary">
          <div className="threat-count critical">
            Critical: {militaryData?.threats.filter(t => t.level === 'critical').length || 0}
          </div>
          <div className="threat-count high">
            High: {militaryData?.threats.filter(t => t.level === 'high').length || 0}
          </div>
          <div className="threat-count medium">
            Medium: {militaryData?.threats.filter(t => t.level === 'medium').length || 0}
          </div>
          <div className="threat-count low">
            Low: {militaryData?.threats.filter(t => t.level === 'low').length || 0}
          </div>
        </div>
      </div>
      
      <div className="threats-list">
        {militaryData?.threats.map(threat => (
          <div key={threat.id} className="threat-card">
            <div className="threat-header">
              <div 
                className="threat-level-badge"
                style={{ backgroundColor: getThreatColor(threat.level) }}
              >
                {threat.level.toUpperCase()}
              </div>
              <div className="threat-type">{threat.type.toUpperCase()}</div>
              <div 
                className="threat-status"
                style={{ 
                  color: threat.status === 'active' ? '#ef4444' : 
                         threat.status === 'investigating' ? '#fbbf24' : '#4ecdc4'
                }}
              >
                {threat.status.toUpperCase()}
              </div>
            </div>
            
            <div className="threat-location">
              📍 {threat.location}
            </div>
            
            <div className="threat-description">
              {threat.description}
            </div>
            
            <div className="threat-timestamp">
              ⏰ {new Date(threat.timestamp).toLocaleString()}
            </div>
            
            <div className="threat-actions">
              <button className="action-btn small">📋 Details</button>
              <button className="action-btn small">🚀 Respond</button>
              <button className="action-btn small">📊 Analyze</button>
            </div>
          </div>
        ))}
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
    >
      <div className="military-screen">
        {/* View Mode Tabs */}
        <div className="view-tabs">
          <button 
            className={`tab ${viewMode === 'overview' ? 'active' : ''}`}
            onClick={() => setViewMode('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${viewMode === 'fleets' ? 'active' : ''}`}
            onClick={() => setViewMode('fleets')}
          >
            🚀 Fleets
          </button>
          <button 
            className={`tab ${viewMode === 'bases' ? 'active' : ''}`}
            onClick={() => setViewMode('bases')}
          >
            🏗️ Bases
          </button>
          <button 
            className={`tab ${viewMode === 'threats' ? 'active' : ''}`}
            onClick={() => setViewMode('threats')}
          >
            🚨 Threats
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'fleets' && renderFleets()}
          {viewMode === 'bases' && renderBases()}
          {viewMode === 'threats' && renderThreats()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default MilitaryScreen;
