/**
 * Exploration Screen - Space Exploration & Discovery Management
 * 
 * This screen focuses on space exploration including:
 * - Active expeditions and mission tracking
 * - Discovered star systems and anomalies
 * - First contact protocols and alien species
 * - Exploration analytics and success metrics
 * - Resource allocation and budget management
 * 
 * Distinct from:
 * - Visual Systems Screen: AI-generated visual content and assets
 * - Galaxy Data Screen: Raw astronomical data and observations
 * - Missions Screen: Specific mission planning and execution
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ExplorationScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface ExplorationStats {
  activeExpeditions: number;
  discoveredSystems: number;
  firstContacts: number;
  anomaliesFound: number;
  explorationBudget: string;
  successRate: number;
  totalDistance: number;
  crewMembers: number;
}

interface Expedition {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed' | 'returning';
  destination: string;
  distance: number;
  crew: number;
  duration: number;
  progress: number;
  discoveries: string[];
  risks: string[];
  budget: string;
  estimatedReturn: string;
}

interface StarSystem {
  id: string;
  name: string;
  type: 'star' | 'binary' | 'nebula' | 'black-hole' | 'pulsar';
  distance: number;
  discovered: string;
  status: 'explored' | 'partially-explored' | 'unexplored';
  planets: number;
  resources: string[];
  anomalies: string[];
  habitability: number;
  strategicValue: number;
}

interface FirstContact {
  id: string;
  species: string;
  system: string;
  date: string;
  status: 'established' | 'negotiating' | 'hostile' | 'neutral';
  technology: string;
  resources: string[];
  diplomatic: number;
  trade: number;
  military: number;
}

interface Anomaly {
  id: string;
  type: 'spatial' | 'temporal' | 'energy' | 'biological' | 'technological';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  discovered: string;
  investigation: number;
  risk: number;
  potential: number;
}

interface ExplorationData {
  stats: ExplorationStats;
  expeditions: Expedition[];
  starSystems: StarSystem[];
  firstContacts: FirstContact[];
  anomalies: Anomaly[];
  selectedExpedition: Expedition | null;
  selectedSystem: StarSystem | null;
}

const ExplorationScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [explorationData, setExplorationData] = useState<ExplorationData | null>(null);
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>('');
  const [selectedSystemId, setSelectedSystemId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'expeditions' | 'discoveries' | 'contacts' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🚀' },
    { id: 'expeditions', label: 'Expeditions', icon: '🛸' },
    { id: 'discoveries', label: 'Discoveries', icon: '⭐' },
    { id: 'contacts', label: 'Contacts', icon: '👽' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/exploration/stats', description: 'Get exploration statistics' }
  ];

  // Utility functions
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      active: '#10b981',
      completed: '#3b82f6',
      failed: '#ef4444',
      returning: '#f59e0b',
      established: '#10b981',
      negotiating: '#f59e0b',
      hostile: '#ef4444',
      neutral: '#6b7280',
      explored: '#10b981',
      'partially-explored': '#f59e0b',
      unexplored: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getSeverityColor = (severity: string): string => {
    const colors: { [key: string]: string } = {
      low: '#10b981',
      medium: '#fbbf24',
      high: '#f59e0b',
      critical: '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      star: '#fbbf24',
      binary: '#8b5cf6',
      nebula: '#ec4899',
      'black-hole': '#1f2937',
      pulsar: '#3b82f6',
      spatial: '#8b5cf6',
      temporal: '#ec4899',
      energy: '#fbbf24',
      biological: '#10b981',
      technological: '#3b82f6'
    };
    return colors[type] || '#6b7280';
  };

  const fetchExplorationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/exploration/stats');
      if (response.ok) {
        const data = await response.json();
        setExplorationData(data);
        if (data.expeditions.length > 0 && !selectedExpeditionId) {
          setSelectedExpeditionId(data.expeditions[0].id);
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch exploration data:', err);
      // Use comprehensive mock data
      setExplorationData({
        stats: {
          activeExpeditions: 8,
          discoveredSystems: 156,
          firstContacts: 12,
          anomaliesFound: 34,
          explorationBudget: '$2.4B',
          successRate: 87.3,
          totalDistance: 125000,
          crewMembers: 45
        },
        expeditions: [
          {
            id: 'exp-1',
            name: 'Pioneer Alpha',
            status: 'active',
            destination: 'Alpha Centauri',
            distance: 4.37,
            crew: 6,
            duration: 12,
            progress: 65,
            discoveries: ['Earth-like planet', 'Ancient artifacts'],
            risks: ['Radiation storms', 'Unknown space phenomena'],
            budget: '$450M',
            estimatedReturn: '6 months'
          },
          {
            id: 'exp-2',
            name: 'Voyager Beta',
            status: 'returning',
            destination: 'Vega System',
            distance: 25.04,
            crew: 8,
            duration: 18,
            progress: 95,
            discoveries: ['Binary star system', 'Rare minerals'],
            risks: ['Navigation anomalies', 'Crew fatigue'],
            budget: '$680M',
            estimatedReturn: '2 weeks'
          },
          {
            id: 'exp-3',
            name: 'Discovery Gamma',
            status: 'active',
            destination: 'Sirius Cluster',
            distance: 8.6,
            crew: 5,
            duration: 8,
            progress: 35,
            discoveries: ['Nebula formation', 'Energy signatures'],
            risks: ['Temporal distortions', 'Unknown life forms'],
            budget: '$320M',
            estimatedReturn: '5 months'
          }
        ],
        starSystems: [
          {
            id: 'sys-1',
            name: 'Alpha Centauri',
            type: 'binary',
            distance: 4.37,
            discovered: '2024-03-15',
            status: 'partially-explored',
            planets: 3,
            resources: ['Iron', 'Helium-3', 'Rare earths'],
            anomalies: ['Temporal fluctuations', 'Gravity wells'],
            habitability: 75,
            strategicValue: 90
          },
          {
            id: 'sys-2',
            name: 'Vega',
            type: 'star',
            distance: 25.04,
            discovered: '2024-02-28',
            status: 'explored',
            planets: 1,
            resources: ['Platinum', 'Uranium', 'Water ice'],
            anomalies: ['Magnetic storms', 'Radiation belts'],
            habitability: 45,
            strategicValue: 70
          },
          {
            id: 'sys-3',
            name: 'Sirius',
            type: 'binary',
            distance: 8.6,
            discovered: '2024-04-02',
            status: 'partially-explored',
            planets: 2,
            resources: ['Diamond', 'Carbon', 'Methane'],
            anomalies: ['Quantum fluctuations', 'Dark matter'],
            habitability: 30,
            strategicValue: 85
          }
        ],
        firstContacts: [
          {
            id: 'fc-1',
            species: 'Zephyrians',
            system: 'Alpha Centauri',
            date: '2024-03-20',
            status: 'established',
            technology: 'Advanced FTL, Quantum computing',
            resources: ['Anti-matter', 'Quantum crystals'],
            diplomatic: 85,
            trade: 70,
            military: 60
          },
          {
            id: 'fc-2',
            species: 'Vegans',
            system: 'Vega',
            date: '2024-03-10',
            status: 'negotiating',
            technology: 'Plasma weapons, Shield tech',
            resources: ['Plasma energy', 'Shield materials'],
            diplomatic: 65,
            trade: 80,
            military: 90
          }
        ],
        anomalies: [
          {
            id: 'anom-1',
            type: 'temporal',
            location: 'Alpha Centauri',
            severity: 'high',
            description: 'Time dilation effects near binary stars',
            discovered: '2024-03-18',
            investigation: 75,
            risk: 60,
            potential: 85
          },
          {
            id: 'anom-2',
            type: 'spatial',
            location: 'Sirius Cluster',
            severity: 'medium',
            description: 'Spatial distortions in nebula region',
            discovered: '2024-04-05',
            investigation: 45,
            risk: 40,
            potential: 70
          }
        ],
        selectedExpedition: null,
        selectedSystem: null
      });
    } finally {
      setLoading(false);
    }
  }, [selectedExpeditionId]);

  useEffect(() => {
    fetchExplorationData();
  }, [fetchExplorationData]);

  useEffect(() => {
    if (selectedExpeditionId && explorationData) {
      const expedition = explorationData.expeditions.find(e => e.id === selectedExpeditionId);
      if (expedition) {
        setExplorationData(prev => prev ? { ...prev, selectedExpedition: expedition } : null);
      }
    }
  }, [selectedExpeditionId, explorationData]);

  useEffect(() => {
    if (selectedSystemId && explorationData) {
      const system = explorationData.starSystems.find(s => s.id === selectedSystemId);
      if (system) {
        setExplorationData(prev => prev ? { ...prev, selectedSystem: system } : null);
      }
    }
  }, [selectedSystemId, explorationData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Exploration Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🚀 Exploration Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Active Expeditions</span>
            <span className="standard-metric-value">{explorationData?.stats.activeExpeditions || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Discovered Systems</span>
            <span className="standard-metric-value">{explorationData?.stats.discoveredSystems || 0}</span>
          </div>
          <div className="standard-metric">
            <span>First Contacts</span>
            <span className="standard-metric-value">{explorationData?.stats.firstContacts || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Success Rate</span>
            <span className="standard-metric-value">{explorationData?.stats.successRate ? `${explorationData.stats.successRate.toFixed(1)}%` : '0%'}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Launch Expedition')}>Launch Expedition</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Exploration Report')}>Exploration Report</button>
        </div>
      </div>

      {/* Current Expeditions - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🛸 Current Expeditions</h3>
        <div className="standard-data-table">
          <div className="table-header">
            <span>Expedition</span>
            <span>Status</span>
            <span>Destination</span>
            <span>Progress</span>
            <span>Budget</span>
          </div>
          {explorationData?.expeditions.slice(0, 3).map(expedition => (
            <div key={expedition.id} className="table-row">
              <span>{expedition.name}</span>
              <span style={{ color: getStatusColor(expedition.status) }}>
                {expedition.status.charAt(0).toUpperCase() + expedition.status.slice(1)}
              </span>
              <span>{expedition.destination}</span>
              <span>{expedition.progress}%</span>
              <span>{expedition.budget}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discoveries - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⭐ Recent Discoveries</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {explorationData?.starSystems.slice(0, 3).map(system => (
            <div key={system.id} style={{
              padding: '1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>⭐ {system.name}</h4>
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Type:</span>
                  <span style={{ color: getTypeColor(system.type) }}>{system.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Distance:</span>
                  <span>{system.distance} ly</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Planets:</span>
                  <span>{system.planets}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Habitability:</span>
                  <span>{system.habitability}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Explore</button>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderExpeditions = () => (
    <>
      {/* Expeditions Management - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🛸 Expeditions Management</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem', color: '#3b82f6' }}>Select Expedition:</label>
          <select 
            value={selectedExpeditionId} 
            onChange={(e) => setSelectedExpeditionId(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6'
            }}
          >
            {explorationData?.expeditions.map(expedition => (
              <option key={expedition.id} value={expedition.id}>{expedition.name}</option>
            ))}
          </select>
        </div>
        
        {explorationData?.selectedExpedition && (
          <div className="standard-data-table">
            <div className="table-header">
              <span>Expedition Details</span>
              <span>Values</span>
            </div>
            <div className="table-row">
              <span>Name</span>
              <span>{explorationData.selectedExpedition.name}</span>
            </div>
            <div className="table-row">
              <span>Status</span>
              <span style={{ color: getStatusColor(explorationData.selectedExpedition.status) }}>
                {explorationData.selectedExpedition.status.charAt(0).toUpperCase() + explorationData.selectedExpedition.status.slice(1)}
              </span>
            </div>
            <div className="table-row">
              <span>Destination</span>
              <span>{explorationData.selectedExpedition.destination}</span>
            </div>
            <div className="table-row">
              <span>Distance</span>
              <span>{explorationData.selectedExpedition.distance} ly</span>
            </div>
            <div className="table-row">
              <span>Crew</span>
              <span>{explorationData.selectedExpedition.crew}</span>
            </div>
            <div className="table-row">
              <span>Duration</span>
              <span>{explorationData.selectedExpedition.duration} months</span>
            </div>
            <div className="table-row">
              <span>Progress</span>
              <span>{explorationData.selectedExpedition.progress}%</span>
            </div>
            <div className="table-row">
              <span>Budget</span>
              <span>{explorationData.selectedExpedition.budget}</span>
            </div>
            <div className="table-row">
              <span>Estimated Return</span>
              <span>{explorationData.selectedExpedition.estimatedReturn}</span>
            </div>
          </div>
        )}
        
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Launch New Expedition')}>Launch New Expedition</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Modify Expedition')}>Modify Expedition</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Recall Expedition')}>Recall Expedition</button>
        </div>
      </div>

      {/* All Expeditions Table - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📋 All Expeditions</h3>
        <div className="standard-data-table">
          <div className="table-header">
            <span>Expedition</span>
            <span>Status</span>
            <span>Destination</span>
            <span>Distance</span>
            <span>Progress</span>
            <span>Budget</span>
            <span>Actions</span>
          </div>
          {explorationData?.expeditions.map(expedition => (
            <div key={expedition.id} className="table-row">
              <span>{expedition.name}</span>
              <span style={{ color: getStatusColor(expedition.status) }}>
                {expedition.status.charAt(0).toUpperCase() + expedition.status.slice(1)}
              </span>
              <span>{expedition.destination}</span>
              <span>{expedition.distance} ly</span>
              <span>{expedition.progress}%</span>
              <span>{expedition.budget}</span>
              <span>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>View</button>
                <button className="standard-btn space-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Control</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderDiscoveries = () => (
    <>
      {/* Star Systems Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⭐ Star Systems Discovery</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem', color: '#3b82f6' }}>Select System:</label>
          <select 
            value={selectedSystemId} 
            onChange={(e) => setSelectedSystemId(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6'
            }}
          >
            {explorationData?.starSystems.map(system => (
              <option key={system.id} value={system.id}>{system.name}</option>
            ))}
          </select>
        </div>
        
        {explorationData?.selectedSystem && (
          <div className="standard-data-table">
            <div className="table-header">
              <span>System Details</span>
              <span>Values</span>
            </div>
            <div className="table-row">
              <span>Name</span>
              <span>{explorationData.selectedSystem.name}</span>
            </div>
            <div className="table-row">
              <span>Type</span>
              <span style={{ color: getTypeColor(explorationData.selectedSystem.type) }}>
                {explorationData.selectedSystem.type}
              </span>
            </div>
            <div className="table-row">
              <span>Distance</span>
              <span>{explorationData.selectedSystem.distance} ly</span>
            </div>
            <div className="table-row">
              <span>Discovered</span>
              <span>{explorationData.selectedSystem.discovered}</span>
            </div>
            <div className="table-row">
              <span>Status</span>
              <span style={{ color: getStatusColor(explorationData.selectedSystem.status) }}>
                {explorationData.selectedSystem.status.replace('-', ' ')}
              </span>
            </div>
            <div className="table-row">
              <span>Planets</span>
              <span>{explorationData.selectedSystem.planets}</span>
            </div>
            <div className="table-row">
              <span>Habitability</span>
              <span>{explorationData.selectedSystem.habitability}%</span>
            </div>
            <div className="table-row">
              <span>Strategic Value</span>
              <span>{explorationData.selectedSystem.strategicValue}%</span>
            </div>
          </div>
        )}
        
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Send Expedition')}>Send Expedition</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Analyze System')}>Analyze System</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Claim System')}>Claim System</button>
        </div>
      </div>

      {/* All Star Systems - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🌌 All Discovered Systems</h3>
        <div className="standard-data-table">
          <div className="table-header">
            <span>System</span>
            <span>Type</span>
            <span>Distance</span>
            <span>Status</span>
            <span>Planets</span>
            <span>Habitability</span>
            <span>Value</span>
          </div>
          {explorationData?.starSystems.map(system => (
            <div key={system.id} className="table-row">
              <span>⭐ {system.name}</span>
              <span style={{ color: getTypeColor(system.type) }}>{system.type}</span>
              <span>{system.distance} ly</span>
              <span style={{ color: getStatusColor(system.status) }}>
                {system.status.replace('-', ' ')}
              </span>
              <span>{system.planets}</span>
              <span>{system.habitability}%</span>
              <span>{system.strategicValue}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderContacts = () => (
    <>
      {/* First Contacts Overview - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👽 First Contact Protocols</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Contacts</span>
            <span className="standard-metric-value">{explorationData?.stats.firstContacts || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Established</span>
            <span className="standard-metric-value">
              {explorationData?.firstContacts.filter(fc => fc.status === 'established').length || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Negotiating</span>
            <span className="standard-metric-value">
              {explorationData?.firstContacts.filter(fc => fc.status === 'negotiating').length || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Hostile</span>
            <span className="standard-metric-value">
              {explorationData?.firstContacts.filter(fc => fc.status === 'hostile').length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* First Contacts Table - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>🤝 Contact Database</h3>
        <div className="standard-data-table">
          <div className="table-header">
            <span>Species</span>
            <span>System</span>
            <span>Status</span>
            <span>Technology</span>
            <span>Diplomatic</span>
            <span>Trade</span>
            <span>Military</span>
          </div>
          {explorationData?.firstContacts.map(contact => (
            <div key={contact.id} className="table-row">
              <span>👽 {contact.species}</span>
              <span>⭐ {contact.system}</span>
              <span style={{ color: getStatusColor(contact.status) }}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
              <span>{contact.technology}</span>
              <span>{contact.diplomatic}%</span>
              <span>{contact.trade}%</span>
              <span>{contact.military}%</span>
            </div>
          ))}
        </div>
        
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Initiate Contact')}>Initiate Contact</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Diplomatic Mission')}>Diplomatic Mission</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Trade Agreement')}>Trade Agreement</button>
        </div>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      {/* Exploration Analytics - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#3b82f6' }}>📊 Exploration Analytics</h3>
        
        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={explorationData?.expeditions.map(exp => ({
                label: exp.status,
                value: 1,
                color: getStatusColor(exp.status)
              })) || []}
              title="🛸 Expedition Status Distribution"
              size={200}
              showLegend={true}
            />
          </div>
          <div className="chart-container">
            <BarChart
              data={explorationData?.starSystems.map(system => ({
                label: system.name,
                value: system.habitability,
                color: system.id === selectedSystemId ? '#3b82f6' : '#8b5cf6'
              })) || []}
              title="⭐ System Habitability Scores"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>
        </div>
        
        {/* Anomalies Analysis */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>⚠️ Anomalies Analysis</h4>
          <div className="standard-data-table">
            <div className="table-header">
              <span>Anomaly Type</span>
              <span>Location</span>
              <span>Severity</span>
              <span>Investigation</span>
              <span>Risk</span>
              <span>Potential</span>
            </div>
            {explorationData?.anomalies.map(anomaly => (
              <div key={anomaly.id} className="table-row">
                <span style={{ color: getTypeColor(anomaly.type) }}>{anomaly.type}</span>
                <span>⭐ {anomaly.location}</span>
                <span style={{ color: getSeverityColor(anomaly.severity) }}>
                  {anomaly.severity.toUpperCase()}
                </span>
                <span>{anomaly.investigation}%</span>
                <span>{anomaly.risk}%</span>
                <span>{anomaly.potential}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Generate Report')}>Generate Report</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Export Data')}>Export Data</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Trend Analysis')}>Trend Analysis</button>
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
      onRefresh={fetchExplorationData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container space-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && explorationData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'expeditions' && renderExpeditions()}
              {activeTab === 'discoveries' && renderDiscoveries()}
              {activeTab === 'contacts' && renderContacts()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading exploration data...' : 'No exploration data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ExplorationScreen;
