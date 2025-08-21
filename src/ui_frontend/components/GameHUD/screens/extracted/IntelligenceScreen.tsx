import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './IntelligenceScreen.css';

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

interface IntelligenceData {
  overview: SystemOverview;
  informationAssets: InformationAsset[];
  espionageOperations: EspionageOperation[];
  spyAgents: SpyAgent[];
  marketParticipants: MarketParticipant[];
  intelligenceListings: IntelligenceListing[];
  counterIntelOperations: CounterIntelOperation[];
}

const IntelligenceScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'classification' | 'operations' | 'market' | 'counter' | 'foreign-intel' | 'domestic-intel'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/intelligence/overview', description: 'Get intelligence system overview' },
    { method: 'GET', path: '/api/intelligence/assets', description: 'Get information assets' },
    { method: 'GET', path: '/api/intelligence/operations', description: 'Get espionage operations' },
    { method: 'GET', path: '/api/intelligence/agents', description: 'Get spy agents' },
    { method: 'GET', path: '/api/intelligence/market', description: 'Get intelligence market data' },
    { method: 'GET', path: '/api/intelligence/counter', description: 'Get counter-intelligence operations' },
    { method: 'POST', path: '/api/intelligence/classify', description: 'Classify new information' },
    { method: 'POST', path: '/api/intelligence/recruit', description: 'Recruit new spy agent' },
    { method: 'POST', path: '/api/intelligence/operation', description: 'Create new operation' },
    { method: 'POST', path: '/api/intelligence/listing', description: 'Create market listing' },
    { method: 'PUT', path: '/api/intelligence/operation/:id', description: 'Update operation status' },
    { method: 'DELETE', path: '/api/intelligence/asset/:id', description: 'Delete information asset' }
  ];

  const fetchIntelligenceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        overviewRes,
        assetsRes,
        operationsRes,
        agentsRes,
        marketRes,
        counterRes
      ] = await Promise.all([
        fetch('/api/intelligence/overview'),
        fetch('/api/intelligence/assets'),
        fetch('/api/intelligence/operations'),
        fetch('/api/intelligence/agents'),
        fetch('/api/intelligence/market'),
        fetch('/api/intelligence/counter')
      ]);

      const [
        overview,
        assets,
        operations,
        agents,
        market,
        counter
      ] = await Promise.all([
        overviewRes.json(),
        assetsRes.json(),
        operationsRes.json(),
        agentsRes.json(),
        marketRes.json(),
        counterRes.json()
      ]);

      setIntelligenceData({
        overview: overview.overview || generateMockOverview(),
        informationAssets: assets.assets || generateMockAssets(),
        espionageOperations: operations.operations || generateMockOperations(),
        spyAgents: agents.agents || generateMockAgents(),
        marketParticipants: market.participants || generateMockParticipants(),
        intelligenceListings: market.listings || generateMockListings(),
        counterIntelOperations: counter.operations || generateMockCounterOps()
      });
    } catch (err) {
      console.error('Failed to fetch intelligence data:', err);
      // Use mock data as fallback
      setIntelligenceData({
        overview: generateMockOverview(),
        informationAssets: generateMockAssets(),
        espionageOperations: generateMockOperations(),
        spyAgents: generateMockAgents(),
        marketParticipants: generateMockParticipants(),
        intelligenceListings: generateMockListings(),
        counterIntelOperations: generateMockCounterOps()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntelligenceData();
  }, [fetchIntelligenceData]);

  const generateMockOverview = (): SystemOverview => ({
    totalAssets: 2847,
    classificationLevels: 5,
    activeOperations: 12,
    spyNetworks: 8,
    marketParticipants: 156,
    intelligenceValue: 45600000,
    securityLevel: 'HIGH',
    threatLevel: 'ELEVATED'
  });

  const generateMockAssets = (): InformationAsset[] => [
    {
      id: 'asset-1',
      title: 'Project Nightfall Intelligence',
      classification: 'TOP_SECRET',
      category: 'Military Technology',
      source: 'Agent Blackbird',
      dateCreated: '2024-02-15T10:30:00Z',
      accessLevel: 9,
      value: 2500000,
      tags: ['stealth', 'aircraft', 'classified'],
      description: 'Advanced stealth aircraft specifications and deployment strategies'
    },
    {
      id: 'asset-2',
      title: 'Economic Forecast Analysis',
      classification: 'SECRET',
      category: 'Economic Intelligence',
      source: 'Financial Analysis Division',
      dateCreated: '2024-02-20T14:15:00Z',
      accessLevel: 7,
      value: 850000,
      tags: ['economy', 'forecast', 'markets'],
      description: 'Comprehensive economic forecast for next quarter with market predictions'
    },
    {
      id: 'asset-3',
      title: 'Diplomatic Communications',
      classification: 'CONFIDENTIAL',
      category: 'Diplomatic Intelligence',
      source: 'Embassy Network',
      dateCreated: '2024-02-18T09:45:00Z',
      accessLevel: 5,
      value: 450000,
      tags: ['diplomacy', 'negotiations', 'treaties'],
      description: 'Intercepted diplomatic communications regarding trade negotiations'
    }
  ];

  const generateMockOperations = (): EspionageOperation[] => [
    {
      id: 'op-1',
      codename: 'Operation Shadowstep',
      type: 'infiltration',
      status: 'active',
      priority: 'critical',
      target: 'Rival Corporation HQ',
      operatives: 3,
      startDate: '2024-02-10',
      expectedCompletion: '2024-03-15',
      progress: 65,
      risk: 75,
      budget: 1200000,
      intelligence: ['Corporate structure', 'Security protocols', 'R&D projects']
    },
    {
      id: 'op-2',
      codename: 'Operation Moonbeam',
      type: 'surveillance',
      status: 'planning',
      priority: 'high',
      target: 'Foreign Embassy',
      operatives: 5,
      startDate: '2024-03-01',
      expectedCompletion: '2024-05-30',
      progress: 15,
      risk: 45,
      budget: 850000,
      intelligence: ['Communication patterns', 'Personnel movements', 'Security measures']
    },
    {
      id: 'op-3',
      codename: 'Operation Whisper',
      type: 'data_theft',
      status: 'completed',
      priority: 'medium',
      target: 'Tech Startup Database',
      operatives: 2,
      startDate: '2024-01-15',
      expectedCompletion: '2024-02-15',
      progress: 100,
      risk: 30,
      budget: 450000,
      intelligence: ['User data', 'Algorithm specifications', 'Business plans']
    }
  ];

  const generateMockAgents = (): SpyAgent[] => [
    {
      id: 'agent-1',
      codename: 'Blackbird',
      realName: '[CLASSIFIED]',
      cover: 'Tech Executive',
      location: 'Silicon Valley',
      status: 'active',
      clearanceLevel: 9,
      specialties: ['Corporate Espionage', 'Technology Theft', 'Social Engineering'],
      successRate: 94,
      yearsOfService: 12,
      lastContact: '2024-02-22T18:30:00Z',
      currentMission: 'Operation Shadowstep'
    },
    {
      id: 'agent-2',
      codename: 'Nightshade',
      realName: '[CLASSIFIED]',
      cover: 'Diplomatic Attaché',
      location: 'Embassy District',
      status: 'deep_cover',
      clearanceLevel: 8,
      specialties: ['Diplomatic Intelligence', 'Language Analysis', 'Cultural Infiltration'],
      successRate: 89,
      yearsOfService: 8,
      lastContact: '2024-02-20T12:15:00Z',
      currentMission: 'Operation Moonbeam'
    },
    {
      id: 'agent-3',
      codename: 'Phoenix',
      realName: '[CLASSIFIED]',
      cover: 'Financial Analyst',
      location: 'Financial District',
      status: 'active',
      clearanceLevel: 7,
      specialties: ['Financial Intelligence', 'Market Analysis', 'Economic Forecasting'],
      successRate: 91,
      yearsOfService: 6,
      lastContact: '2024-02-21T16:45:00Z'
    }
  ];

  const generateMockParticipants = (): MarketParticipant[] => [
    {
      id: 'participant-1',
      name: 'Shadow Broker LLC',
      type: 'broker',
      reputation: 95,
      trustLevel: 88,
      specialization: ['Military Intelligence', 'Corporate Secrets', 'Government Data'],
      totalTransactions: 247,
      averageRating: 4.8,
      joinDate: '2022-03-15',
      isVerified: true
    },
    {
      id: 'participant-2',
      name: 'InfoCorp Analytics',
      type: 'corporation',
      reputation: 82,
      trustLevel: 76,
      specialization: ['Market Analysis', 'Economic Intelligence', 'Competitive Intelligence'],
      totalTransactions: 156,
      averageRating: 4.3,
      joinDate: '2023-01-20',
      isVerified: true
    },
    {
      id: 'participant-3',
      name: 'Ghost Network',
      type: 'mercenary',
      reputation: 78,
      trustLevel: 65,
      specialization: ['Cyber Intelligence', 'Digital Forensics', 'Data Recovery'],
      totalTransactions: 89,
      averageRating: 4.1,
      joinDate: '2023-08-10',
      isVerified: false
    }
  ];

  const generateMockListings = (): IntelligenceListing[] => [
    {
      id: 'listing-1',
      title: 'Advanced AI Research Data',
      category: 'Technology',
      classification: 'SECRET',
      seller: 'Shadow Broker LLC',
      price: 2500000,
      currency: 'USD',
      description: 'Comprehensive AI research data including neural network architectures and training datasets',
      tags: ['AI', 'machine learning', 'research'],
      datePosted: '2024-02-20T10:00:00Z',
      expiryDate: '2024-03-20T10:00:00Z',
      views: 45,
      bids: 8,
      status: 'active'
    },
    {
      id: 'listing-2',
      title: 'Diplomatic Communication Intercepts',
      category: 'Diplomatic',
      classification: 'CONFIDENTIAL',
      seller: 'InfoCorp Analytics',
      price: 850000,
      currency: 'USD',
      description: 'Recent diplomatic communications between major world powers regarding trade agreements',
      tags: ['diplomacy', 'trade', 'communications'],
      datePosted: '2024-02-18T14:30:00Z',
      expiryDate: '2024-03-18T14:30:00Z',
      views: 32,
      bids: 5,
      status: 'active'
    }
  ];

  const generateMockCounterOps = (): CounterIntelOperation[] => [
    {
      id: 'counter-1',
      name: 'Operation Mole Hunt Alpha',
      type: 'mole_hunt',
      status: 'investigating',
      threat: 'Suspected double agent in Technology Division',
      severity: 'high',
      startDate: '2024-02-15',
      findings: ['Unusual access patterns', 'Unexplained wealth', 'Contact with foreign nationals'],
      recommendations: ['Enhanced surveillance', 'Financial audit', 'Polygraph examination']
    },
    {
      id: 'counter-2',
      name: 'Disinformation Campaign Beta',
      type: 'disinformation',
      status: 'ongoing',
      threat: 'Foreign propaganda targeting economic stability',
      severity: 'medium',
      startDate: '2024-02-10',
      findings: ['Social media manipulation', 'Fake news distribution', 'Coordinated bot networks'],
      recommendations: ['Counter-narrative deployment', 'Platform cooperation', 'Public awareness campaign']
    }
  ];

  const getClassificationColor = (classification: string): string => {
    switch (classification) {
      case 'PUBLIC': return '#4caf50';
      case 'CONFIDENTIAL': return '#2196f3';
      case 'SECRET': return '#ff9800';
      case 'TOP_SECRET': return '#f44336';
      case 'COSMIC': return '#9c27b0';
      default: return '#4ecdc4';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'investigating':
      case 'ongoing': return '#4caf50';
      case 'planning': return '#2196f3';
      case 'deep_cover':
      case 'monitoring': return '#ff9800';
      case 'completed':
      case 'neutralized': return '#8bc34a';
      case 'compromised': return '#f44336';
      case 'cancelled':
      case 'expired': return '#9e9e9e';
      default: return '#4ecdc4';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#4ecdc4';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#4ecdc4';
    }
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchIntelligenceData}
    >
      <div className="intelligence-screen">
        <div className="classified-banner">
          🔒 CLASSIFIED - TOP SECRET - INTELLIGENCE SYSTEM 🔒
        </div>

        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'classification' ? 'active' : ''}`}
            onClick={() => setActiveTab('classification')}
          >
            🔒 Classification
          </button>
          <button 
            className={`tab ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            🕵️ Operations
          </button>
          <button 
            className={`tab ${activeTab === 'market' ? 'active' : ''}`}
            onClick={() => setActiveTab('market')}
          >
            💰 Intel Market
          </button>
          <button 
            className={`tab ${activeTab === 'counter' ? 'active' : ''}`}
            onClick={() => setActiveTab('counter')}
          >
            🛡️ Counter-Intel
          </button>
          <button 
            className={`tab ${activeTab === 'foreign-intel' ? 'active' : ''}`}
            onClick={() => setActiveTab('foreign-intel')}
          >
            🌍 Foreign Intel
          </button>
          <button 
            className={`tab ${activeTab === 'domestic-intel' ? 'active' : ''}`}
            onClick={() => setActiveTab('domestic-intel')}
          >
            🏠 Domestic Intel
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading intelligence data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && intelligenceData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-value">{intelligenceData.overview.totalAssets.toLocaleString()}</div>
                      <div className="metric-label">Information Assets</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{intelligenceData.overview.activeOperations}</div>
                      <div className="metric-label">Active Operations</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{intelligenceData.overview.spyNetworks}</div>
                      <div className="metric-label">Spy Networks</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{intelligenceData.overview.marketParticipants}</div>
                      <div className="metric-label">Market Participants</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{formatCurrency(intelligenceData.overview.intelligenceValue)}</div>
                      <div className="metric-label">Intelligence Value</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value" style={{ color: intelligenceData.overview.securityLevel === 'HIGH' ? '#4caf50' : '#ff9800' }}>
                        {intelligenceData.overview.securityLevel}
                      </div>
                      <div className="metric-label">Security Level</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value" style={{ color: intelligenceData.overview.threatLevel === 'ELEVATED' ? '#ff9800' : '#4caf50' }}>
                        {intelligenceData.overview.threatLevel}
                      </div>
                      <div className="metric-label">Threat Level</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{intelligenceData.overview.classificationLevels}</div>
                      <div className="metric-label">Classification Levels</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'classification' && (
                <div className="classification-tab">
                  <div className="information-assets">
                    {intelligenceData.informationAssets.map((asset) => (
                      <div key={asset.id} className="asset-item">
                        <div className="asset-header">
                          <div className="asset-title">{asset.title}</div>
                          <div className="asset-classification" style={{ color: getClassificationColor(asset.classification) }}>
                            {asset.classification}
                          </div>
                        </div>
                        <div className="asset-details">
                          <div className="asset-category">{asset.category}</div>
                          <div className="asset-source">Source: {asset.source}</div>
                          <div className="asset-date">{new Date(asset.dateCreated).toLocaleDateString()}</div>
                          <div className="asset-value">Value: {formatCurrency(asset.value)}</div>
                          <div className="asset-access">Access Level: {asset.accessLevel}/10</div>
                        </div>
                        <div className="asset-description">{asset.description}</div>
                        <div className="asset-tags">
                          {asset.tags.map((tag, i) => (
                            <span key={i} className="asset-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Classify Information</button>
                    <button className="action-btn secondary">Access Control</button>
                    <button className="action-btn">Search Assets</button>
                  </div>
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="operations-tab">
                  <div className="operations-section">
                    <h4>🕵️ Espionage Operations</h4>
                    <div className="espionage-operations">
                      {intelligenceData.espionageOperations.map((op) => (
                        <div key={op.id} className="operation-item">
                          <div className="op-header">
                            <div className="op-codename">{op.codename}</div>
                            <div className="op-priority" style={{ color: getPriorityColor(op.priority) }}>
                              {op.priority.toUpperCase()}
                            </div>
                          </div>
                          <div className="op-details">
                            <div className="op-type">{op.type.toUpperCase()}</div>
                            <div className="op-status" style={{ color: getStatusColor(op.status) }}>
                              Status: {op.status.toUpperCase()}
                            </div>
                            <div className="op-target">Target: {op.target}</div>
                            <div className="op-operatives">Operatives: {op.operatives}</div>
                            <div className="op-budget">Budget: {formatCurrency(op.budget)}</div>
                            <div className="op-dates">
                              {new Date(op.startDate).toLocaleDateString()} - {new Date(op.expectedCompletion).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="op-progress">
                            <div className="progress-header">
                              <span>Progress: {op.progress}%</span>
                              <span>Risk: {op.risk}%</span>
                            </div>
                            <div className="progress-bars">
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${op.progress}%` }}></div>
                              </div>
                              <div className="risk-bar">
                                <div className="risk-fill" style={{ width: `${op.risk}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="op-intelligence">
                            <strong>Intelligence Gathered:</strong>
                            <div className="intelligence-list">
                              {op.intelligence.map((intel, i) => (
                                <div key={i} className="intelligence-item">🔍 {intel}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="operations-section">
                    <h4>👤 Spy Agents</h4>
                    <div className="spy-agents">
                      {intelligenceData.spyAgents.map((agent) => (
                        <div key={agent.id} className="agent-item">
                          <div className="agent-header">
                            <div className="agent-codename">{agent.codename}</div>
                            <div className="agent-status" style={{ color: getStatusColor(agent.status) }}>
                              {agent.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="agent-details">
                            <div className="agent-cover">Cover: {agent.cover}</div>
                            <div className="agent-location">📍 {agent.location}</div>
                            <div className="agent-clearance">Clearance: Level {agent.clearanceLevel}</div>
                            <div className="agent-success">Success Rate: {agent.successRate}%</div>
                            <div className="agent-service">Service: {agent.yearsOfService} years</div>
                            <div className="agent-contact">Last Contact: {new Date(agent.lastContact).toLocaleDateString()}</div>
                          </div>
                          <div className="agent-specialties">
                            <strong>Specialties:</strong>
                            <div className="specialties-list">
                              {agent.specialties.map((specialty, i) => (
                                <span key={i} className="specialty-tag">{specialty}</span>
                              ))}
                            </div>
                          </div>
                          {agent.currentMission && (
                            <div className="agent-mission">
                              Current Mission: <span className="mission-name">{agent.currentMission}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Recruit Agent</button>
                    <button className="action-btn secondary">Plan Operation</button>
                    <button className="action-btn">Mission Briefing</button>
                  </div>
                </div>
              )}

              {activeTab === 'market' && (
                <div className="market-tab">
                  <div className="market-section">
                    <h4>👥 Market Participants</h4>
                    <div className="market-participants">
                      {intelligenceData.marketParticipants.map((participant) => (
                        <div key={participant.id} className="participant-item">
                          <div className="participant-header">
                            <div className="participant-name">{participant.name}</div>
                            <div className="participant-verified">
                              {participant.isVerified ? '✅ Verified' : '❌ Unverified'}
                            </div>
                          </div>
                          <div className="participant-details">
                            <div className="participant-type">{participant.type.toUpperCase()}</div>
                            <div className="participant-reputation">Reputation: {participant.reputation}%</div>
                            <div className="participant-trust">Trust: {participant.trustLevel}%</div>
                            <div className="participant-transactions">Transactions: {participant.totalTransactions}</div>
                            <div className="participant-rating">Rating: {participant.averageRating}/5.0</div>
                            <div className="participant-joined">Joined: {new Date(participant.joinDate).toLocaleDateString()}</div>
                          </div>
                          <div className="participant-specialization">
                            <strong>Specialization:</strong>
                            <div className="specialization-list">
                              {participant.specialization.map((spec, i) => (
                                <span key={i} className="specialization-tag">{spec}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="market-section">
                    <h4>📋 Intelligence Listings</h4>
                    <div className="intelligence-listings">
                      {intelligenceData.intelligenceListings.map((listing) => (
                        <div key={listing.id} className="listing-item">
                          <div className="listing-header">
                            <div className="listing-title">{listing.title}</div>
                            <div className="listing-price">{formatCurrency(listing.price)} {listing.currency}</div>
                          </div>
                          <div className="listing-details">
                            <div className="listing-category">{listing.category}</div>
                            <div className="listing-classification" style={{ color: getClassificationColor(listing.classification) }}>
                              {listing.classification}
                            </div>
                            <div className="listing-seller">Seller: {listing.seller}</div>
                            <div className="listing-posted">{new Date(listing.datePosted).toLocaleDateString()}</div>
                            <div className="listing-expires">Expires: {new Date(listing.expiryDate).toLocaleDateString()}</div>
                          </div>
                          <div className="listing-description">{listing.description}</div>
                          <div className="listing-stats">
                            <div className="listing-views">👁️ {listing.views} views</div>
                            <div className="listing-bids">💰 {listing.bids} bids</div>
                            <div className="listing-status" style={{ color: getStatusColor(listing.status) }}>
                              {listing.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="listing-tags">
                            {listing.tags.map((tag, i) => (
                              <span key={i} className="listing-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Register Participant</button>
                    <button className="action-btn secondary">Create Listing</button>
                    <button className="action-btn">Market Search</button>
                    <button className="action-btn secondary">Analytics</button>
                  </div>
                </div>
              )}

              {activeTab === 'counter' && (
                <div className="counter-tab">
                  <div className="counter-operations">
                    {intelligenceData.counterIntelOperations.map((op) => (
                      <div key={op.id} className="counter-item">
                        <div className="counter-header">
                          <div className="counter-name">{op.name}</div>
                          <div className="counter-severity" style={{ color: getSeverityColor(op.severity) }}>
                            {op.severity.toUpperCase()}
                          </div>
                        </div>
                        <div className="counter-details">
                          <div className="counter-type">{op.type.toUpperCase()}</div>
                          <div className="counter-status" style={{ color: getStatusColor(op.status) }}>
                            Status: {op.status.toUpperCase()}
                          </div>
                          <div className="counter-start">Started: {new Date(op.startDate).toLocaleDateString()}</div>
                        </div>
                        <div className="counter-threat">
                          <strong>Threat:</strong> {op.threat}
                        </div>
                        <div className="counter-findings">
                          <strong>Findings:</strong>
                          <div className="findings-list">
                            {op.findings.map((finding, i) => (
                              <div key={i} className="finding-item">🔍 {finding}</div>
                            ))}
                          </div>
                        </div>
                        <div className="counter-recommendations">
                          <strong>Recommendations:</strong>
                          <div className="recommendations-list">
                            {op.recommendations.map((rec, i) => (
                              <div key={i} className="recommendation-item">💡 {rec}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Security Audit</button>
                    <button className="action-btn urgent">Threat Response</button>
                    <button className="action-btn secondary">Investigation Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'foreign-intel' && (
                <div className="foreign-intel-tab">
                  <div className="foreign-intel-overview">
                    <h3>🌍 Foreign Intelligence Dossiers</h3>
                    <div className="intel-metrics">
                      <div className="metric-card">
                        <div className="metric-value">12</div>
                        <div className="metric-label">Rival Civilizations</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">47</div>
                        <div className="metric-label">Key Figures Tracked</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">156</div>
                        <div className="metric-label">Intelligence Reports</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">23</div>
                        <div className="metric-label">Active Surveillance</div>
                      </div>
                    </div>
                  </div>

                  <div className="civilization-intel">
                    <h4>🏛️ Civilization Leaders</h4>
                    <div className="leader-dossiers">
                      <div className="dossier-card">
                        <div className="dossier-header">
                          <div className="leader-info">
                            <div className="leader-name">Emperor Zyx'thara</div>
                            <div className="leader-title">Supreme Ruler of Nexus Empire</div>
                            <div className="threat-level high">Threat Level: HIGH</div>
                          </div>
                          <div className="leader-portrait">👑</div>
                        </div>
                        <div className="dossier-details">
                          <div className="intel-item">
                            <strong>Personality:</strong> Aggressive expansionist, highly intelligent, unpredictable
                          </div>
                          <div className="intel-item">
                            <strong>Military Strength:</strong> 847,000 active troops, advanced tech
                          </div>
                          <div className="intel-item">
                            <strong>Recent Activity:</strong> Mobilizing forces near border sectors
                          </div>
                          <div className="intel-item">
                            <strong>Weaknesses:</strong> Overconfident, relies heavily on advisors
                          </div>
                        </div>
                        <div className="dossier-actions">
                          <button className="action-btn">Deep Profile</button>
                          <button className="action-btn secondary">Surveillance</button>
                        </div>
                      </div>

                      <div className="dossier-card">
                        <div className="dossier-header">
                          <div className="leader-info">
                            <div className="leader-name">Chancellor Vex'mora</div>
                            <div className="leader-title">Head of Stellar Federation</div>
                            <div className="threat-level medium">Threat Level: MEDIUM</div>
                          </div>
                          <div className="leader-portrait">🎭</div>
                        </div>
                        <div className="dossier-details">
                          <div className="intel-item">
                            <strong>Personality:</strong> Diplomatic, calculating, seeks alliances
                          </div>
                          <div className="intel-item">
                            <strong>Economic Power:</strong> Controls 3 major trade routes
                          </div>
                          <div className="intel-item">
                            <strong>Recent Activity:</strong> Negotiating trade agreements
                          </div>
                          <div className="intel-item">
                            <strong>Opportunities:</strong> Open to mutual cooperation deals
                          </div>
                        </div>
                        <div className="dossier-actions">
                          <button className="action-btn">Deep Profile</button>
                          <button className="action-btn secondary">Diplomatic Contact</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="key-figures-intel">
                    <h4>👥 Key Foreign Figures</h4>
                    <div className="figures-grid">
                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Admiral Kex'tar</div>
                          <div className="figure-role">Nexus Empire Fleet Commander</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Commands 40% of Nexus naval forces</div>
                          <div className="intel-snippet">Known for aggressive tactics</div>
                          <div className="intel-snippet">Potential coup risk against Emperor</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Track</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Dr. Yil'andra</div>
                          <div className="figure-role">Federation Chief Scientist</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Leading quantum research program</div>
                          <div className="intel-snippet">Potential defection candidate</div>
                          <div className="intel-snippet">Access to classified tech specs</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Recruit</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Baron Thex'ul</div>
                          <div className="figure-role">Nexus Trade Minister</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Controls mineral exports</div>
                          <div className="intel-snippet">Rumored corruption scandals</div>
                          <div className="intel-snippet">Blackmail potential identified</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Leverage</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Ambassador Qel'nira</div>
                          <div className="figure-role">Federation Diplomatic Corps</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Moderate faction leader</div>
                          <div className="intel-snippet">Seeks peaceful solutions</div>
                          <div className="intel-snippet">Potential alliance opportunity</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Contact</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="business-intel">
                    <h4>🏢 Foreign Business Leaders</h4>
                    <div className="business-grid">
                      <div className="business-card">
                        <div className="business-header">
                          <div className="business-name">Zex'corp Industries</div>
                          <div className="ceo-name">CEO: Mex'andra Zex</div>
                        </div>
                        <div className="business-intel">
                          <div className="intel-item">Market Cap: 2.4T credits</div>
                          <div className="intel-item">Sector: Advanced Manufacturing</div>
                          <div className="intel-item">Intel: Developing new weapon systems</div>
                          <div className="intel-item">Vulnerability: Supply chain dependencies</div>
                        </div>
                        <div className="business-actions">
                          <button className="action-btn small">Full Report</button>
                          <button className="action-btn small secondary">Sabotage Options</button>
                        </div>
                      </div>

                      <div className="business-card">
                        <div className="business-header">
                          <div className="business-name">Stellar Mining Consortium</div>
                          <div className="ceo-name">Chairman: Vel'thar Qex</div>
                        </div>
                        <div className="business-intel">
                          <div className="intel-item">Market Cap: 1.8T credits</div>
                          <div className="intel-item">Sector: Resource Extraction</div>
                          <div className="intel-item">Intel: Controls 60% of rare earth mining</div>
                          <div className="intel-item">Opportunity: Potential acquisition target</div>
                        </div>
                        <div className="business-actions">
                          <button className="action-btn small">Full Report</button>
                          <button className="action-btn small secondary">Acquisition Analysis</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Generate Intelligence Report</button>
                    <button className="action-btn secondary">Update Surveillance Targets</button>
                    <button className="action-btn urgent">Threat Assessment</button>
                  </div>
                </div>
              )}

              {activeTab === 'domestic-intel' && (
                <div className="domestic-intel-tab">
                  <div className="domestic-intel-overview">
                    <h3>🏠 Domestic Intelligence Network</h3>
                    <div className="intel-metrics">
                      <div className="metric-card">
                        <div className="metric-value">8</div>
                        <div className="metric-label">Political Factions</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">34</div>
                        <div className="metric-label">Key Figures Monitored</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">89</div>
                        <div className="metric-label">Active Surveillance</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">12</div>
                        <div className="metric-label">Security Threats</div>
                      </div>
                    </div>
                  </div>

                  <div className="political-intel">
                    <h4>🏛️ Political Figures</h4>
                    <div className="leader-dossiers">
                      <div className="dossier-card">
                        <div className="dossier-header">
                          <div className="leader-info">
                            <div className="leader-name">Senator Kex'andra Vel</div>
                            <div className="leader-title">Opposition Party Leader</div>
                            <div className="threat-level medium">Risk Level: MEDIUM</div>
                          </div>
                          <div className="leader-portrait">⚖️</div>
                        </div>
                        <div className="dossier-details">
                          <div className="intel-item">
                            <strong>Political Position:</strong> Moderate opposition, seeks compromise
                          </div>
                          <div className="intel-item">
                            <strong>Support Base:</strong> 23% approval rating, strong in urban areas
                          </div>
                          <div className="intel-item">
                            <strong>Recent Activity:</strong> Building coalition for economic reform
                          </div>
                          <div className="intel-item">
                            <strong>Assessment:</strong> Potential ally on infrastructure projects
                          </div>
                        </div>
                        <div className="dossier-actions">
                          <button className="action-btn">Full Profile</button>
                          <button className="action-btn secondary">Monitor</button>
                        </div>
                      </div>

                      <div className="dossier-card">
                        <div className="dossier-header">
                          <div className="leader-info">
                            <div className="leader-name">General Thex'ul Qar</div>
                            <div className="leader-title">Military Advisor</div>
                            <div className="threat-level high">Risk Level: HIGH</div>
                          </div>
                          <div className="leader-portrait">⭐</div>
                        </div>
                        <div className="dossier-details">
                          <div className="intel-item">
                            <strong>Military Position:</strong> Senior advisor, war hawk faction
                          </div>
                          <div className="intel-item">
                            <strong>Influence:</strong> Strong support among military officers
                          </div>
                          <div className="intel-item">
                            <strong>Recent Activity:</strong> Advocating for aggressive expansion
                          </div>
                          <div className="intel-item">
                            <strong>Concern:</strong> May challenge civilian authority
                          </div>
                        </div>
                        <div className="dossier-actions">
                          <button className="action-btn">Full Profile</button>
                          <button className="action-btn urgent">Security Watch</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="business-leaders-intel">
                    <h4>💼 Business & Economic Leaders</h4>
                    <div className="figures-grid">
                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Zara Vex'thul</div>
                          <div className="figure-role">CEO, Stellar Industries</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Controls 15% of domestic manufacturing</div>
                          <div className="intel-snippet">Strong government supporter</div>
                          <div className="intel-snippet">Reliable for defense contracts</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Partnership</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Marcus Qel'tar</div>
                          <div className="figure-role">Banking Consortium Chair</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Controls major financial institutions</div>
                          <div className="intel-snippet">Neutral political stance</div>
                          <div className="intel-snippet">Key to economic stability</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Monitor</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Dr. Elena Vex'mora</div>
                          <div className="figure-role">Tech Innovation Leader</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Leading AI research initiatives</div>
                          <div className="intel-snippet">Potential security implications</div>
                          <div className="intel-snippet">Requires oversight on classified projects</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small urgent">Security Review</button>
                        </div>
                      </div>

                      <div className="figure-card">
                        <div className="figure-header">
                          <div className="figure-name">Admiral Kex'ul Tar</div>
                          <div className="figure-role">Retired Fleet Commander</div>
                        </div>
                        <div className="figure-intel">
                          <div className="intel-snippet">Popular war hero, political ambitions</div>
                          <div className="intel-snippet">Building civilian support network</div>
                          <div className="intel-snippet">Potential future political rival</div>
                        </div>
                        <div className="figure-actions">
                          <button className="action-btn small">Profile</button>
                          <button className="action-btn small secondary">Track</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="security-threats">
                    <h4>⚠️ Security Concerns</h4>
                    <div className="threat-grid">
                      <div className="threat-card">
                        <div className="threat-header">
                          <div className="threat-name">Underground Movement</div>
                          <div className="threat-level high">Priority: HIGH</div>
                        </div>
                        <div className="threat-details">
                          <div className="intel-item">
                            <strong>Type:</strong> Political dissidents, anti-government
                          </div>
                          <div className="intel-item">
                            <strong>Size:</strong> Estimated 200-500 active members
                          </div>
                          <div className="intel-item">
                            <strong>Activity:</strong> Propaganda distribution, recruitment
                          </div>
                          <div className="intel-item">
                            <strong>Risk:</strong> Potential for organized protests or sabotage
                          </div>
                        </div>
                        <div className="threat-actions">
                          <button className="action-btn urgent">Investigate</button>
                          <button className="action-btn secondary">Monitor</button>
                        </div>
                      </div>

                      <div className="threat-card">
                        <div className="threat-header">
                          <div className="threat-name">Corporate Espionage Ring</div>
                          <div className="threat-level medium">Priority: MEDIUM</div>
                        </div>
                        <div className="threat-details">
                          <div className="intel-item">
                            <strong>Type:</strong> Industrial espionage, trade secrets theft
                          </div>
                          <div className="intel-item">
                            <strong>Targets:</strong> Defense contractors, tech companies
                          </div>
                          <div className="intel-item">
                            <strong>Activity:</strong> Data breaches, insider recruitment
                          </div>
                          <div className="intel-item">
                            <strong>Risk:</strong> Economic damage, security vulnerabilities
                          </div>
                        </div>
                        <div className="threat-actions">
                          <button className="action-btn">Counter-Op</button>
                          <button className="action-btn secondary">Surveillance</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="recruitment-candidates">
                    <h4>🎯 Recruitment Opportunities</h4>
                    <div className="candidates-grid">
                      <div className="candidate-card">
                        <div className="candidate-header">
                          <div className="candidate-name">Dr. Yara Thex'ul</div>
                          <div className="candidate-role">Research Scientist</div>
                        </div>
                        <div className="candidate-intel">
                          <div className="intel-snippet">Access to classified research data</div>
                          <div className="intel-snippet">Financial difficulties identified</div>
                          <div className="intel-snippet">High recruitment probability</div>
                        </div>
                        <div className="candidate-actions">
                          <button className="action-btn">Approach</button>
                          <button className="action-btn secondary">Background Check</button>
                        </div>
                      </div>

                      <div className="candidate-card">
                        <div className="candidate-header">
                          <div className="candidate-name">Captain Rex'tar Vel</div>
                          <div className="candidate-role">Military Officer</div>
                        </div>
                        <div className="candidate-intel">
                          <div className="intel-snippet">Disillusioned with current command</div>
                          <div className="intel-snippet">Strong loyalty to civilian government</div>
                          <div className="intel-snippet">Potential intelligence asset</div>
                        </div>
                        <div className="candidate-actions">
                          <button className="action-btn">Recruit</button>
                          <button className="action-btn secondary">Assess</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Generate Domestic Report</button>
                    <button className="action-btn secondary">Update Watch Lists</button>
                    <button className="action-btn urgent">Security Assessment</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default IntelligenceScreen;
