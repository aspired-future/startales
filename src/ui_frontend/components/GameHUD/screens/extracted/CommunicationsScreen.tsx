import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './CommunicationsScreen.css';

interface CommunicationsOverview {
  totalMessages: number;
  activeOperations: number;
  mediaReach: number;
  approvalRating: number;
  pressConferences: number;
  socialEngagement: number;
  newsArticles: number;
  broadcastHours: number;
}

interface LeaderCommunication {
  id: string;
  type: 'speech' | 'interview' | 'statement' | 'address';
  title: string;
  date: string;
  audience: string;
  reach: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  platform: string[];
  duration: number;
  approval: number;
}

interface ActiveOperation {
  id: string;
  name: string;
  type: 'campaign' | 'crisis' | 'announcement' | 'diplomatic';
  status: 'planning' | 'active' | 'monitoring' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  platforms: string[];
  reach: number;
  budget: number;
  team: string[];
}

interface PressConference {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  topics: string[];
  status: 'scheduled' | 'live' | 'completed';
  duration: number;
  mediaOutlets: string[];
  questions: number;
}

interface PublicMessage {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'policy' | 'emergency' | 'celebration';
  platforms: string[];
  reach: number;
  engagement: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  publishDate: string;
  author: string;
}

interface MediaRelation {
  id: string;
  outlet: string;
  type: 'newspaper' | 'television' | 'radio' | 'online' | 'social';
  relationship: 'excellent' | 'good' | 'neutral' | 'poor' | 'hostile';
  reach: number;
  influence: number;
  lastContact: string;
  keyContacts: string[];
  recentCoverage: string[];
}

interface PlatformIntegration {
  platform: string;
  status: 'connected' | 'disconnected' | 'error' | 'maintenance';
  followers: number;
  engagement: number;
  lastPost: string;
  postsToday: number;
  reach: number;
  apiStatus: 'operational' | 'limited' | 'down';
}

interface CommunicationsData {
  overview: CommunicationsOverview;
  leaderCommunications: LeaderCommunication[];
  activeOperations: ActiveOperation[];
  pressConferences: PressConference[];
  publicMessages: PublicMessage[];
  mediaRelations: MediaRelation[];
  platformIntegrations: PlatformIntegration[];
}

const CommunicationsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [communicationsData, setCommunicationsData] = useState<CommunicationsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leader' | 'operations' | 'media' | 'platforms'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/communications/overview', description: 'Get communications overview metrics' },
    { method: 'GET', path: '/api/communications/leader', description: 'Get leader communications schedule' },
    { method: 'GET', path: '/api/communications/operations', description: 'Get active communications operations' },
    { method: 'GET', path: '/api/communications/press', description: 'Get press conferences' },
    { method: 'GET', path: '/api/communications/messages', description: 'Get public messages' },
    { method: 'GET', path: '/api/communications/media', description: 'Get media relations' },
    { method: 'GET', path: '/api/communications/platforms', description: 'Get platform integrations' },
    { method: 'POST', path: '/api/communications/leader', description: 'Schedule leader communication' },
    { method: 'POST', path: '/api/communications/operations', description: 'Create new operation' },
    { method: 'POST', path: '/api/communications/press', description: 'Schedule press conference' },
    { method: 'POST', path: '/api/communications/messages', description: 'Publish public message' },
    { method: 'PUT', path: '/api/communications/operations/:id', description: 'Update operation status' }
  ];

  const fetchCommunicationsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        overviewRes,
        leaderRes,
        operationsRes,
        pressRes,
        messagesRes,
        mediaRes,
        platformsRes
      ] = await Promise.all([
        fetch('/api/communications/overview'),
        fetch('/api/communications/leader'),
        fetch('/api/communications/operations'),
        fetch('/api/communications/press'),
        fetch('/api/communications/messages'),
        fetch('/api/communications/media'),
        fetch('/api/communications/platforms')
      ]);

      const [
        overview,
        leader,
        operations,
        press,
        messages,
        media,
        platforms
      ] = await Promise.all([
        overviewRes.json(),
        leaderRes.json(),
        operationsRes.json(),
        pressRes.json(),
        messagesRes.json(),
        mediaRes.json(),
        platformsRes.json()
      ]);

      setCommunicationsData({
        overview: overview.overview || generateMockOverview(),
        leaderCommunications: leader.communications || generateMockLeaderCommunications(),
        activeOperations: operations.operations || generateMockActiveOperations(),
        pressConferences: press.conferences || generateMockPressConferences(),
        publicMessages: messages.messages || generateMockPublicMessages(),
        mediaRelations: media.relations || generateMockMediaRelations(),
        platformIntegrations: platforms.platforms || generateMockPlatformIntegrations()
      });
    } catch (err) {
      console.error('Failed to fetch communications data:', err);
      // Use mock data as fallback
      setCommunicationsData({
        overview: generateMockOverview(),
        leaderCommunications: generateMockLeaderCommunications(),
        activeOperations: generateMockActiveOperations(),
        pressConferences: generateMockPressConferences(),
        publicMessages: generateMockPublicMessages(),
        mediaRelations: generateMockMediaRelations(),
        platformIntegrations: generateMockPlatformIntegrations()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunicationsData();
  }, [fetchCommunicationsData]);

  const generateMockOverview = (): CommunicationsOverview => ({
    totalMessages: 1247,
    activeOperations: 8,
    mediaReach: 25600000,
    approvalRating: 68,
    pressConferences: 12,
    socialEngagement: 89,
    newsArticles: 156,
    broadcastHours: 24
  });

  const generateMockLeaderCommunications = (): LeaderCommunication[] => [
    {
      id: 'leader-1',
      type: 'address',
      title: 'State of the Union Address',
      date: '2024-03-15T19:00:00Z',
      audience: 'National',
      reach: 45000000,
      status: 'scheduled',
      platform: ['Television', 'Radio', 'Witter', 'News Outlets'],
      duration: 60,
      approval: 72
    },
    {
      id: 'leader-2',
      type: 'interview',
      title: 'Economic Policy Interview',
      date: '2024-02-28T14:30:00Z',
      audience: 'Business Leaders',
      reach: 8500000,
      status: 'completed',
      platform: ['Television', 'Online'],
      duration: 45,
      approval: 78
    },
    {
      id: 'leader-3',
      type: 'speech',
      title: 'Technology Innovation Summit',
      date: '2024-03-01T10:00:00Z',
      audience: 'Tech Industry',
      reach: 12000000,
      status: 'live',
      platform: ['Live Stream', 'Witter', 'News'],
      duration: 30,
      approval: 85
    }
  ];

  const generateMockActiveOperations = (): ActiveOperation[] => [
    {
      id: 'op-1',
      name: 'Economic Recovery Campaign',
      type: 'campaign',
      status: 'active',
      priority: 'high',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      platforms: ['Television', 'Radio', 'Witter', 'News'],
      reach: 35000000,
      budget: 2500000,
      team: ['Sarah Johnson', 'Mike Chen', 'Elena Rodriguez']
    },
    {
      id: 'op-2',
      name: 'Infrastructure Announcement',
      type: 'announcement',
      status: 'planning',
      priority: 'medium',
      startDate: '2024-03-10',
      endDate: '2024-03-25',
      platforms: ['Press Conference', 'Witter', 'Local News'],
      reach: 18000000,
      budget: 850000,
      team: ['David Park', 'Lisa Wang']
    },
    {
      id: 'op-3',
      name: 'Crisis Response Protocol',
      type: 'crisis',
      status: 'monitoring',
      priority: 'critical',
      startDate: '2024-02-20',
      endDate: '2024-03-05',
      platforms: ['All Channels', 'Emergency Broadcast'],
      reach: 50000000,
      budget: 1200000,
      team: ['Crisis Team Alpha', 'Media Relations', 'Emergency Comms']
    }
  ];

  const generateMockPressConferences = (): PressConference[] => [
    {
      id: 'press-1',
      title: 'Weekly Press Briefing',
      date: '2024-02-23T15:00:00Z',
      location: 'Press Room Alpha',
      attendees: 45,
      topics: ['Economic Policy', 'Infrastructure', 'International Relations'],
      status: 'scheduled',
      duration: 60,
      mediaOutlets: ['National News', 'Economic Times', 'Global Report'],
      questions: 12
    },
    {
      id: 'press-2',
      title: 'Technology Initiative Announcement',
      date: '2024-02-20T11:00:00Z',
      location: 'Innovation Center',
      attendees: 32,
      topics: ['AI Development', 'Research Funding', 'Tech Partnerships'],
      status: 'completed',
      duration: 45,
      mediaOutlets: ['Tech Daily', 'Innovation News', 'Science Report'],
      questions: 8
    }
  ];

  const generateMockPublicMessages = (): PublicMessage[] => [
    {
      id: 'msg-1',
      title: 'Economic Growth Update',
      content: 'Our economy continues to show strong growth with unemployment at historic lows and new job creation exceeding projections.',
      type: 'announcement',
      platforms: ['Witter', 'Official Website', 'News Release'],
      reach: 12500000,
      engagement: 78,
      sentiment: 'positive',
      publishDate: '2024-02-22T09:00:00Z',
      author: 'Communications Secretary'
    },
    {
      id: 'msg-2',
      title: 'Infrastructure Investment Plan',
      content: 'Announcing a comprehensive $2.5 trillion infrastructure investment plan to modernize our transportation, energy, and digital networks.',
      type: 'policy',
      platforms: ['Press Release', 'Witter', 'Television'],
      reach: 28000000,
      engagement: 85,
      sentiment: 'positive',
      publishDate: '2024-02-21T14:30:00Z',
      author: 'Policy Communications'
    }
  ];

  const generateMockMediaRelations = (): MediaRelation[] => [
    {
      id: 'media-1',
      outlet: 'National Broadcasting Network',
      type: 'television',
      relationship: 'excellent',
      reach: 15000000,
      influence: 92,
      lastContact: '2024-02-20',
      keyContacts: ['Jane Smith - Political Editor', 'Bob Wilson - News Director'],
      recentCoverage: ['Economic Policy Interview', 'Infrastructure Announcement']
    },
    {
      id: 'media-2',
      outlet: 'The Daily Chronicle',
      type: 'newspaper',
      relationship: 'good',
      reach: 8500000,
      influence: 85,
      lastContact: '2024-02-18',
      keyContacts: ['Maria Garcia - Chief Editor', 'Tom Johnson - Political Reporter'],
      recentCoverage: ['Budget Analysis', 'Technology Summit Coverage']
    },
    {
      id: 'media-3',
      outlet: 'Digital News Today',
      type: 'online',
      relationship: 'neutral',
      reach: 12000000,
      influence: 78,
      lastContact: '2024-02-15',
      keyContacts: ['Alex Chen - Editor-in-Chief'],
      recentCoverage: ['Policy Fact-Check', 'Economic Data Analysis']
    }
  ];

  const generateMockPlatformIntegrations = (): PlatformIntegration[] => [
    {
      platform: 'Witter',
      status: 'connected',
      followers: 25400000,
      engagement: 8.5,
      lastPost: '2024-02-22T16:30:00Z',
      postsToday: 12,
      reach: 18500000,
      apiStatus: 'operational'
    },
    {
      platform: 'FaceSpace',
      status: 'connected',
      followers: 18200000,
      engagement: 6.2,
      lastPost: '2024-02-22T14:15:00Z',
      postsToday: 8,
      reach: 12800000,
      apiStatus: 'operational'
    },
    {
      platform: 'InstantGram',
      status: 'connected',
      followers: 15600000,
      engagement: 12.3,
      lastPost: '2024-02-22T12:00:00Z',
      postsToday: 6,
      reach: 9200000,
      apiStatus: 'limited'
    },
    {
      platform: 'NewsWire',
      status: 'connected',
      followers: 0,
      engagement: 0,
      lastPost: '2024-02-22T10:45:00Z',
      postsToday: 15,
      reach: 45000000,
      apiStatus: 'operational'
    }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'live':
      case 'active':
      case 'connected':
      case 'operational': return '#4CAF50';
      case 'scheduled':
      case 'planning': return '#FF9800';
      case 'monitoring':
      case 'limited': return '#2196F3';
      case 'completed': return '#8BC34A';
      case 'cancelled':
      case 'disconnected':
      case 'down': return '#f44336';
      case 'error': return '#e91e63';
      case 'maintenance': return '#9c27b0';
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

  const getRelationshipColor = (relationship: string): string => {
    switch (relationship) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'neutral': return '#ffc107';
      case 'poor': return '#ff9800';
      case 'hostile': return '#f44336';
      default: return '#4ecdc4';
    }
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return '#4caf50';
      case 'neutral': return '#ffc107';
      case 'negative': return '#f44336';
      default: return '#4ecdc4';
    }
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
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
      onRefresh={fetchCommunicationsData}
    >
      <div className="communications-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'leader' ? 'active' : ''}`}
            onClick={() => setActiveTab('leader')}
          >
            👑 Leader Comms
          </button>
          <button 
            className={`tab ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            ⚡ Operations
          </button>
          <button 
            className={`tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            📺 Media
          </button>
          <button 
            className={`tab ${activeTab === 'platforms' ? 'active' : ''}`}
            onClick={() => setActiveTab('platforms')}
          >
            🔗 Platforms
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading communications data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && communicationsData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.totalMessages.toLocaleString()}</div>
                      <div className="metric-label">Total Messages</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.activeOperations}</div>
                      <div className="metric-label">Active Operations</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{formatNumber(communicationsData.overview.mediaReach)}</div>
                      <div className="metric-label">Media Reach</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.approvalRating}%</div>
                      <div className="metric-label">Approval Rating</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.pressConferences}</div>
                      <div className="metric-label">Press Conferences</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.socialEngagement}%</div>
                      <div className="metric-label">Social Engagement</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.newsArticles}</div>
                      <div className="metric-label">News Articles</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{communicationsData.overview.broadcastHours}</div>
                      <div className="metric-label">Broadcast Hours</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'leader' && (
                <div className="leader-tab">
                  <div className="leader-communications">
                    {communicationsData.leaderCommunications.map((comm) => (
                      <div key={comm.id} className="leader-comm-item">
                        <div className="comm-header">
                          <div className="comm-title">{comm.title}</div>
                          <div className="comm-status" style={{ color: getStatusColor(comm.status) }}>
                            <span className="status-indicator" style={{ backgroundColor: getStatusColor(comm.status) }}></span>
                            {comm.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="comm-details">
                          <div className="comm-type">{comm.type.toUpperCase()}</div>
                          <div className="comm-audience">Audience: {comm.audience}</div>
                          <div className="comm-reach">Reach: {formatNumber(comm.reach)}</div>
                          <div className="comm-date">{new Date(comm.date).toLocaleString()}</div>
                          <div className="comm-duration">Duration: {comm.duration} minutes</div>
                          <div className="comm-approval">Approval: {comm.approval}%</div>
                        </div>
                        <div className="comm-platforms">
                          {comm.platform.map((platform, i) => (
                            <span key={i} className="platform-tag">{platform}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Coordinate Message</button>
                    <button className="action-btn secondary">Schedule Event</button>
                    <button className="action-btn">Media Strategy</button>
                  </div>
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="operations-tab">
                  <div className="active-operations">
                    {communicationsData.activeOperations.map((op) => (
                      <div key={op.id} className="operation-item">
                        <div className="op-header">
                          <div className="op-name">{op.name}</div>
                          <div className="op-priority" style={{ color: getPriorityColor(op.priority) }}>
                            {op.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="op-details">
                          <div className="op-type">{op.type.toUpperCase()}</div>
                          <div className="op-status" style={{ color: getStatusColor(op.status) }}>
                            Status: {op.status.toUpperCase()}
                          </div>
                          <div className="op-reach">Reach: {formatNumber(op.reach)}</div>
                          <div className="op-budget">Budget: {formatCurrency(op.budget)}</div>
                          <div className="op-dates">
                            {new Date(op.startDate).toLocaleDateString()} - {new Date(op.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="op-platforms">
                          {op.platforms.map((platform, i) => (
                            <span key={i} className="platform-tag">{platform}</span>
                          ))}
                        </div>
                        <div className="op-team">
                          Team: {op.team.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">New Operation</button>
                    <button className="action-btn urgent">Crisis Response</button>
                    <button className="action-btn secondary">Operation Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="media-tab">
                  {/* Press Freedom Overview */}
                  <div className="media-section">
                    <h4>📊 Press Freedom & Media Control</h4>
                    <div className="press-freedom-overview">
                      <div className="freedom-metrics">
                        <div className="metric-item">
                          <span className="metric-label">Press Freedom Level:</span>
                          <span className="metric-value freedom-good">75/100</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Media Independence:</span>
                          <span className="metric-value freedom-fair">68%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Government Control:</span>
                          <span className="metric-value control-moderate">32%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Public Trust:</span>
                          <span className="metric-value trust-good">71%</span>
                        </div>
                      </div>
                      <div className="freedom-actions">
                        <button className="action-btn primary">📈 View Detailed Report</button>
                        <button className="action-btn secondary">⚙️ Adjust Policies</button>
                      </div>
                    </div>
                  </div>

                  {/* Media Outlets Management */}
                  <div className="media-section">
                    <h4>📺 Media Outlets</h4>
                    <div className="media-outlets">
                      <div className="outlet-item">
                        <div className="outlet-header">
                          <div className="outlet-info">
                            <div className="outlet-name">Galactic News Network</div>
                            <div className="outlet-type">Public Broadcaster</div>
                          </div>
                          <div className="outlet-status">
                            <span className="status-badge active">ACTIVE</span>
                            <span className="control-level moderate">25% Gov Control</span>
                          </div>
                        </div>
                        <div className="outlet-metrics">
                          <span className="metric">👥 50M reach</span>
                          <span className="metric">⭐ 85% credibility</span>
                          <span className="metric">📊 Center bias</span>
                        </div>
                      </div>

                      <div className="outlet-item">
                        <div className="outlet-header">
                          <div className="outlet-info">
                            <div className="outlet-name">Independent News Service</div>
                            <div className="outlet-type">Private Independent</div>
                          </div>
                          <div className="outlet-status">
                            <span className="status-badge active">ACTIVE</span>
                            <span className="control-level low">0% Gov Control</span>
                          </div>
                        </div>
                        <div className="outlet-metrics">
                          <span className="metric">👥 25M reach</span>
                          <span className="metric">⭐ 78% credibility</span>
                          <span className="metric">📊 Left bias</span>
                        </div>
                      </div>

                      <div className="outlet-item">
                        <div className="outlet-header">
                          <div className="outlet-info">
                            <div className="outlet-name">National Information Service</div>
                            <div className="outlet-type">State Owned</div>
                          </div>
                          <div className="outlet-status">
                            <span className="status-badge active">ACTIVE</span>
                            <span className="control-level high">100% Gov Control</span>
                          </div>
                        </div>
                        <div className="outlet-metrics">
                          <span className="metric">👥 40M reach</span>
                          <span className="metric">⭐ 65% credibility</span>
                          <span className="metric">📊 Right bias</span>
                        </div>
                      </div>
                    </div>
                    <div className="media-actions">
                      <button className="action-btn primary">📋 Manage Licenses</button>
                      <button className="action-btn secondary">📊 Outlet Analytics</button>
                    </div>
                  </div>

                  {/* Media Policies & Regulations */}
                  <div className="media-section">
                    <h4>📋 Media Policies & Regulations</h4>
                    <div className="media-policies">
                      <div className="policy-item">
                        <div className="policy-header">
                          <div className="policy-name">Broadcasting Licensing Act</div>
                          <div className="policy-status active">ACTIVE</div>
                        </div>
                        <div className="policy-details">
                          <span className="policy-type">Licensing</span>
                          <span className="policy-intensity">60% Control Intensity</span>
                          <span className="policy-compliance">95% Compliance</span>
                        </div>
                      </div>

                      <div className="policy-item">
                        <div className="policy-header">
                          <div className="policy-name">National Security Information Guidelines</div>
                          <div className="policy-status active">ACTIVE</div>
                        </div>
                        <div className="policy-details">
                          <span className="policy-type">Content Regulation</span>
                          <span className="policy-intensity">75% Control Intensity</span>
                          <span className="policy-compliance">88% Compliance</span>
                        </div>
                      </div>
                    </div>
                    <div className="policy-actions">
                      <button className="action-btn primary">📝 New Policy</button>
                      <button className="action-btn secondary">📊 Policy Impact</button>
                    </div>
                  </div>

                  {/* Enhanced Press Conferences with Leader vs Press Secretary */}
                  <div className="media-section">
                    <h4>🎤 Press Conferences</h4>
                    
                    {/* Press Secretary Information */}
                    <div className="press-secretary-info">
                      <div className="secretary-header">
                        <div className="secretary-details">
                          <div className="secretary-name">Sarah Mitchell</div>
                          <div className="secretary-title">White House Press Secretary</div>
                        </div>
                        <div className="secretary-stats">
                          <span className="stat">📊 85% Effectiveness</span>
                          <span className="stat">🎯 75% vs Leader Impact</span>
                        </div>
                      </div>
                      <div className="secretary-skills">
                        <div className="skill-item">
                          <span className="skill-label">Communication:</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: '85%' }}></div>
                          </div>
                          <span className="skill-value">85%</span>
                        </div>
                        <div className="skill-item">
                          <span className="skill-label">Media Relations:</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: '80%' }}></div>
                          </div>
                          <span className="skill-value">80%</span>
                        </div>
                        <div className="skill-item">
                          <span className="skill-label">Crisis Management:</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: '75%' }}></div>
                          </div>
                          <span className="skill-value">75%</span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming and Recent Press Conferences */}
                    <div className="press-conferences">
                      <div className="press-item scheduled">
                        <div className="press-header">
                          <div className="press-info">
                            <div className="press-title">Economic Policy Briefing</div>
                            <div className="press-presenter">
                              <span className="presenter-type secretary">📝 Press Secretary</span>
                              <span className="presenter-name">Sarah Mitchell</span>
                            </div>
                          </div>
                          <div className="press-status scheduled">SCHEDULED</div>
                        </div>
                        <div className="press-details">
                          <span className="press-date">📅 Tomorrow, 2:00 PM</span>
                          <span className="press-duration">⏱️ 45 min</span>
                          <span className="press-risk low">🔒 Low Risk</span>
                          <span className="press-impact moderate">📊 Moderate Impact</span>
                        </div>
                        <div className="press-topics">
                          <span className="topic-tag">Economy</span>
                          <span className="topic-tag">Policy</span>
                          <span className="topic-tag">Markets</span>
                        </div>
                      </div>

                      <div className="press-item scheduled leader">
                        <div className="press-header">
                          <div className="press-info">
                            <div className="press-title">Foreign Policy Address</div>
                            <div className="press-presenter">
                              <span className="presenter-type leader">👑 Leader Personal</span>
                              <span className="presenter-name">President</span>
                            </div>
                          </div>
                          <div className="press-status scheduled">SCHEDULED</div>
                        </div>
                        <div className="press-details">
                          <span className="press-date">📅 Next Week</span>
                          <span className="press-duration">⏱️ 30 min</span>
                          <span className="press-risk high">⚠️ High Risk</span>
                          <span className="press-impact high">🚀 High Impact (+25% bonus)</span>
                        </div>
                        <div className="press-topics">
                          <span className="topic-tag">Foreign Policy</span>
                          <span className="topic-tag">Diplomacy</span>
                          <span className="topic-tag">Security</span>
                        </div>
                      </div>

                      <div className="press-item completed">
                        <div className="press-header">
                          <div className="press-info">
                            <div className="press-title">Infrastructure Update</div>
                            <div className="press-presenter">
                              <span className="presenter-type secretary">📝 Press Secretary</span>
                              <span className="presenter-name">Sarah Mitchell</span>
                            </div>
                          </div>
                          <div className="press-status completed">COMPLETED</div>
                        </div>
                        <div className="press-results">
                          <div className="result-metrics">
                            <div className="metric">
                              <span className="metric-label">Questions:</span>
                              <span className="metric-value">12/15 answered</span>
                            </div>
                            <div className="metric">
                              <span className="metric-label">Coverage:</span>
                              <span className="metric-value success">72% positive</span>
                            </div>
                            <div className="metric">
                              <span className="metric-label">Approval Impact:</span>
                              <span className="metric-value success">+2.1%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="press-actions">
                      <button className="action-btn primary">📅 Schedule Leader Conference</button>
                      <button className="action-btn secondary">📝 Schedule Secretary Briefing</button>
                      <button className="action-btn">📊 Conference Analytics</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'platforms' && (
                <div className="platforms-tab">
                  <div className="platform-integrations">
                    {communicationsData.platformIntegrations.map((platform, i) => (
                      <div key={i} className="platform-item">
                        <div className="platform-header">
                          <div className="platform-name">{platform.platform}</div>
                          <div className="platform-status" style={{ color: getStatusColor(platform.status) }}>
                            <span className="status-indicator" style={{ backgroundColor: getStatusColor(platform.status) }}></span>
                            {platform.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="platform-metrics">
                          {platform.followers > 0 && (
                            <div className="platform-metric">
                              <span>Followers:</span>
                              <span>{formatNumber(platform.followers)}</span>
                            </div>
                          )}
                          <div className="platform-metric">
                            <span>Reach:</span>
                            <span>{formatNumber(platform.reach)}</span>
                          </div>
                          {platform.engagement > 0 && (
                            <div className="platform-metric">
                              <span>Engagement:</span>
                              <span>{platform.engagement}%</span>
                            </div>
                          )}
                          <div className="platform-metric">
                            <span>Posts Today:</span>
                            <span>{platform.postsToday}</span>
                          </div>
                          <div className="platform-metric">
                            <span>Last Post:</span>
                            <span>{new Date(platform.lastPost).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="platform-api">
                          API Status: <span style={{ color: getStatusColor(platform.apiStatus) }}>
                            {platform.apiStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Sync Platforms</button>
                    <button className="action-btn secondary">Post Scheduler</button>
                    <button className="action-btn">Analytics Report</button>
                    <button className="action-btn secondary">Platform Settings</button>
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

export default CommunicationsScreen;
