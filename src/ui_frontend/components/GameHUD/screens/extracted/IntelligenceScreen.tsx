/**
 * Intelligence Screen - Intelligence Operations and Information Management
 * 
 * This screen focuses on intelligence operations including:
 * - Information assets and classification management
 * - Espionage operations and spy networks
 * - Intelligence marketplace and participants
 * - Counter-intelligence operations
 * - Spy agents and their missions
 * 
 * Distinct from:
 * - Security Operations: Police forces, federal agencies, personal security
 * - Military: Operational forces, fleets, bases, tactical operations
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './IntelligenceScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface SystemOverview {
  totalAssets: number;
  classificationLevels: number;
  activeOperations: number;
  spyNetworks: number;
  marketParticipants: number;
  intelligenceValue: number;
  securityLevel: string;
  threatLevel: string;
}

interface InformationAsset {
  id: string;
  title: string;
  classification: 'PUBLIC' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET' | 'COSMIC';
  category: string;
  source: string;
  dateCreated: string;
  accessLevel: number;
  value: number;
  tags: string[];
  description: string;
}

interface EspionageOperation {
  id: string;
  codename: string;
  type: 'surveillance' | 'infiltration' | 'sabotage' | 'data_theft' | 'counter_intel';
  status: 'planning' | 'active' | 'completed' | 'compromised' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target: string;
  operatives: number;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  risk: number;
  budget: number;
  intelligence: string[];
}

interface SpyAgent {
  id: string;
  codename: string;
  realName: string;
  cover: string;
  location: string;
  status: 'active' | 'deep_cover' | 'compromised' | 'retired' | 'missing';
  clearanceLevel: number;
  specialties: string[];
  successRate: number;
  yearsOfService: number;
  lastContact: string;
  currentMission?: string;
}

interface MarketParticipant {
  id: string;
  name: string;
  type: 'government' | 'corporation' | 'mercenary' | 'broker' | 'analyst';
  reputation: number;
  trustLevel: number;
  specialization: string[];
  totalTransactions: number;
  averageRating: number;
  joinDate: string;
  isVerified: boolean;
}

interface IntelligenceListing {
  id: string;
  title: string;
  category: string;
  classification: string;
  seller: string;
  price: number;
  currency: 'USD' | 'BTC' | 'INTEL_CREDITS';
  description: string;
  tags: string[];
  datePosted: string;
  expiryDate: string;
  views: number;
  bids: number;
  status: 'active' | 'sold' | 'expired' | 'removed';
}

interface CounterIntelOperation {
  id: string;
  name: string;
  type: 'mole_hunt' | 'disinformation' | 'security_audit' | 'leak_investigation';
  status: 'investigating' | 'monitoring' | 'neutralized' | 'ongoing';
  threat: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  findings: string[];
  recommendations: string[];
}

const IntelligenceScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [intelligenceData, setIntelligenceData] = useState<{
    overview: SystemOverview;
    assets: InformationAsset[];
    operations: EspionageOperation[];
    agents: SpyAgent[];
    participants: MarketParticipant[];
    listings: IntelligenceListing[];
    counterIntel: CounterIntelOperation[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'operations' | 'agents' | 'market'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'assets', label: 'Assets', icon: '📁' },
    { id: 'operations', label: 'Operations', icon: '🎯' },
    { id: 'agents', label: 'Agents', icon: '🕵️' },
    { id: 'market', label: 'Market', icon: '💰' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/intelligence', description: 'Get intelligence data' }
  ];

  // Utility functions
  const formatCurrency = (value: number, currency: string = 'USD') => {
    if (value >= 1e12) return `${currency} ${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${currency} ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${currency} ${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${currency} ${(value / 1e3).toFixed(0)}K`;
    return `${currency} ${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'COSMIC': return '#ef4444';
      case 'TOP_SECRET': return '#f59e0b';
      case 'SECRET': return '#fbbf24';
      case 'CONFIDENTIAL': return '#10b981';
      case 'PUBLIC': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'planning': return '#fbbf24';
      case 'completed': return '#6b7280';
      case 'compromised': return '#ef4444';
      case 'cancelled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'deep_cover': return '#f59e0b';
      case 'compromised': return '#ef4444';
      case 'retired': return '#6b7280';
      case 'missing': return '#fbbf24';
      default: return '#6b7280';
    }
  };

  const fetchIntelligenceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/intelligence');
      if (response.ok) {
        const data = await response.json();
        setIntelligenceData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch intelligence data:', err);
      // Use comprehensive mock data
      setIntelligenceData({
        overview: {
          totalAssets: 1250,
          classificationLevels: 5,
          activeOperations: 18,
          spyNetworks: 12,
          marketParticipants: 450,
          intelligenceValue: 850000000,
          securityLevel: 'HIGH',
          threatLevel: 'MEDIUM'
        },
        assets: [
          {
            id: 'asset_001',
            title: 'Advanced AI Research Data',
            classification: 'TOP_SECRET',
            category: 'Technology',
            source: 'Corporate Espionage',
            dateCreated: '2024-02-10',
            accessLevel: 9,
            value: 25000000,
            tags: ['AI', 'Research', 'Corporate'],
            description: 'Comprehensive research data on advanced AI systems'
          },
          {
            id: 'asset_002',
            title: 'Diplomatic Communications',
            classification: 'SECRET',
            category: 'Political',
            source: 'Intercepted Communications',
            dateCreated: '2024-02-12',
            accessLevel: 7,
            value: 15000000,
            tags: ['Diplomatic', 'Political', 'Communications'],
            description: 'Sensitive diplomatic communications between nations'
          },
          {
            id: 'asset_003',
            title: 'Military Defense Plans',
            classification: 'COSMIC',
            category: 'Military',
            source: 'Deep Cover Agent',
            dateCreated: '2024-02-08',
            accessLevel: 10,
            value: 50000000,
            tags: ['Military', 'Defense', 'Strategic'],
            description: 'Comprehensive military defense strategies and plans'
          }
        ],
        operations: [
          {
            id: 'op_001',
            codename: 'Operation Shadow',
            type: 'infiltration',
            status: 'active',
            priority: 'high',
            target: 'Advanced Research Facility',
            operatives: 3,
            startDate: '2024-01-15',
            expectedCompletion: '2024-03-15',
            progress: 65,
            risk: 75,
            budget: 5000000,
            intelligence: ['Security protocols', 'Research data', 'Personnel files']
          },
          {
            id: 'op_002',
            codename: 'Operation Silent Watch',
            type: 'surveillance',
            status: 'active',
            priority: 'medium',
            target: 'Diplomatic Compound',
            operatives: 2,
            startDate: '2024-02-01',
            expectedCompletion: '2024-04-01',
            progress: 40,
            risk: 45,
            budget: 2500000,
            intelligence: ['Meeting schedules', 'Visitor logs', 'Communications']
          }
        ],
        agents: [
          {
            id: 'agent_001',
            codename: 'Shadow',
            realName: 'Classified',
            cover: 'Business Consultant',
            location: 'Capital District',
            status: 'active',
            clearanceLevel: 9,
            specialties: ['Infiltration', 'Data Extraction', 'Social Engineering'],
            successRate: 94.2,
            yearsOfService: 8,
            lastContact: '2024-02-14T10:30:00Z',
            currentMission: 'Operation Shadow'
          },
          {
            id: 'agent_002',
            codename: 'Echo',
            realName: 'Classified',
            cover: 'Diplomatic Attaché',
            location: 'Foreign Embassy',
            status: 'deep_cover',
            clearanceLevel: 8,
            specialties: ['Diplomatic Intelligence', 'Cultural Analysis', 'Linguistics'],
            successRate: 87.6,
            yearsOfService: 12,
            lastContact: '2024-02-13T15:45:00Z',
            currentMission: 'Operation Silent Watch'
          }
        ],
        participants: [
          {
            id: 'part_001',
            name: 'Shadow Broker',
            type: 'broker',
            reputation: 95,
            trustLevel: 88,
            specialization: ['Military Intelligence', 'Corporate Espionage'],
            totalTransactions: 1250,
            averageRating: 4.8,
            joinDate: '2020-03-15',
            isVerified: true
          },
          {
            id: 'part_002',
            name: 'Cyber Corp',
            type: 'corporation',
            reputation: 82,
            trustLevel: 75,
            specialization: ['Cyber Intelligence', 'Digital Forensics'],
            totalTransactions: 890,
            averageRating: 4.2,
            joinDate: '2021-07-22',
            isVerified: true
          }
        ],
        listings: [
          {
            id: 'list_001',
            title: 'Advanced AI Research Data',
            category: 'Technology',
            classification: 'TOP_SECRET',
            seller: 'Shadow Broker',
            price: 25000000,
            currency: 'USD',
            description: 'Comprehensive research data on advanced AI systems',
            tags: ['AI', 'Research', 'Corporate'],
            datePosted: '2024-02-10',
            expiryDate: '2024-03-10',
            views: 45,
            bids: 3,
            status: 'active'
          },
          {
            id: 'list_002',
            title: 'Diplomatic Communications',
            category: 'Political',
            classification: 'SECRET',
            seller: 'Cyber Corp',
            price: 15000000,
            currency: 'USD',
            description: 'Sensitive diplomatic communications between nations',
            tags: ['Diplomatic', 'Political', 'Communications'],
            datePosted: '2024-02-12',
            expiryDate: '2024-03-12',
            views: 32,
            bids: 2,
            status: 'active'
          }
        ],
        counterIntel: [
          {
            id: 'ci_001',
            name: 'Operation Clean Sweep',
            type: 'mole_hunt',
            status: 'investigating',
            threat: 'Internal Leak',
            severity: 'high',
            startDate: '2024-02-01',
            findings: ['Suspicious data access patterns', 'Unauthorized system logins'],
            recommendations: ['Implement enhanced monitoring', 'Conduct security audit']
          },
          {
            id: 'ci_002',
            name: 'Operation False Flag',
            type: 'disinformation',
            status: 'ongoing',
            threat: 'Foreign Intelligence',
            severity: 'medium',
            startDate: '2024-01-20',
            findings: ['Coordinated disinformation campaign', 'Multiple false leads'],
            recommendations: ['Maintain operational security', 'Verify all intelligence sources']
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntelligenceData();
  }, [fetchIntelligenceData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Intelligence Overview - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📊 Intelligence Operations Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Assets</span>
            <span className="standard-metric-value">{formatNumber(intelligenceData?.overview?.totalAssets || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Operations</span>
            <span className="standard-metric-value">{intelligenceData?.overview?.activeOperations || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Spy Networks</span>
            <span className="standard-metric-value">{intelligenceData?.overview?.spyNetworks || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Market Participants</span>
            <span className="standard-metric-value">{formatNumber(intelligenceData?.overview?.marketParticipants || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Intelligence Value</span>
            <span className="standard-metric-value">{formatCurrency(intelligenceData?.overview?.intelligenceValue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Security Level</span>
            <span className="standard-metric-value">{intelligenceData?.overview?.securityLevel || 'UNKNOWN'}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Intelligence Analysis')}>Intelligence Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Threat Assessment')}>Threat Assessment</button>
        </div>
      </div>

      {/* Active Operations - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🎯 Active Intelligence Operations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Target</th>
                <th>Progress</th>
                <th>Risk</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intelligenceData?.operations?.slice(0, 5).map((operation) => (
                <tr key={operation.id}>
                  <td><strong>{operation.codename}</strong></td>
                  <td>{operation.type.replace('_', ' ').toUpperCase()}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(operation.status), 
                      color: 'white' 
                    }}>
                      {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(operation.priority), 
                      color: 'white' 
                    }}>
                      {operation.priority.charAt(0).toUpperCase() + operation.priority.slice(1)}
                    </span>
                  </td>
                  <td>{operation.target}</td>
                  <td>{operation.progress}%</td>
                  <td>{operation.risk}%</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel security-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📈 Intelligence Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={intelligenceData?.operations?.map(op => ({
                  label: op.codename,
                  value: op.progress,
                  color: getStatusColor(op.status)
                })) || []}
                title="🎯 Operation Progress (%)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={intelligenceData?.assets?.map((asset, index) => ({
                  label: asset.classification,
                  value: 1,
                  color: getClassificationColor(asset.classification)
                })) || []}
                title="📁 Asset Classification Distribution"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderAssets = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📁 Information Assets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Asset Analysis')}>Asset Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Classification Review')}>Classification Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Source</th>
                <th>Access Level</th>
                <th>Value</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intelligenceData?.assets?.map((asset) => (
                <tr key={asset.id}>
                  <td><strong>{asset.title}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(asset.classification), 
                      color: 'white' 
                    }}>
                      {asset.classification.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{asset.category}</td>
                  <td>{asset.source}</td>
                  <td>{asset.accessLevel}</td>
                  <td>{formatCurrency(asset.value)}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {asset.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: '#f59e0b',
                          color: 'white'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
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

  const renderOperations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🎯 Espionage Operations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Operations Analysis')}>Operations Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Mission Planning')}>Mission Planning</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Target</th>
                <th>Operatives</th>
                <th>Progress</th>
                <th>Risk</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intelligenceData?.operations?.map((operation) => (
                <tr key={operation.id}>
                  <td><strong>{operation.codename}</strong></td>
                  <td>{operation.type.replace('_', ' ').toUpperCase()}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(operation.status), 
                      color: 'white' 
                    }}>
                      {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(operation.priority), 
                      color: 'white' 
                    }}>
                      {operation.priority.charAt(0).toUpperCase() + operation.priority.slice(1)}
                    </span>
                  </td>
                  <td>{operation.target}</td>
                  <td>{operation.operatives}</td>
                  <td>{operation.progress}%</td>
                  <td>{operation.risk}%</td>
                  <td>{formatCurrency(operation.budget)}</td>
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

  const renderAgents = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🕵️ Spy Agents</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Agent Analysis')}>Agent Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Mission Assignment')}>Mission Assignment</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Cover</th>
                <th>Location</th>
                <th>Status</th>
                <th>Clearance</th>
                <th>Success Rate</th>
                <th>Years</th>
                <th>Current Mission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intelligenceData?.agents?.map((agent) => (
                <tr key={agent.id}>
                  <td>
                    <strong>{agent.codename}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{agent.realName}</small>
                  </td>
                  <td>{agent.cover}</td>
                  <td>{agent.location}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getAgentStatusColor(agent.status), 
                      color: 'white' 
                    }}>
                      {agent.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>{agent.clearanceLevel}</td>
                  <td>{agent.successRate}%</td>
                  <td>{agent.yearsOfService}</td>
                  <td>{agent.currentMission || 'None'}</td>
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

  const renderMarket = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>💰 Intelligence Marketplace</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Participant Review')}>Participant Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Category</th>
                <th>Classification</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Views</th>
                <th>Bids</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {intelligenceData?.listings?.map((listing) => (
                <tr key={listing.id}>
                  <td><strong>{listing.title}</strong></td>
                  <td>{listing.category}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(listing.classification), 
                      color: 'white' 
                    }}>
                      {listing.classification.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{listing.seller}</td>
                  <td>{formatCurrency(listing.price, listing.currency)}</td>
                  <td>{listing.views}</td>
                  <td>{listing.bids}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(listing.status), 
                      color: 'white' 
                    }}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">View</button>
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
      onRefresh={fetchIntelligenceData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && intelligenceData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'assets' && renderAssets()}
              {activeTab === 'operations' && renderOperations()}
              {activeTab === 'agents' && renderAgents()}
              {activeTab === 'market' && renderMarket()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading intelligence data...' : 'No intelligence data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default IntelligenceScreen;

