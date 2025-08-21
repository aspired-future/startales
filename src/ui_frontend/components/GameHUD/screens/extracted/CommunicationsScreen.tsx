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
            🎤 Media & Press
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
                  <div className="media-section">
                    <h4>🎤 Press Conferences</h4>
                    <div className="press-conferences">
                      {communicationsData.pressConferences.map((press) => (
                        <div key={press.id} className="press-item">
                          <div className="press-header">
                            <div className="press-title">{press.title}</div>
                            <div className="press-status" style={{ color: getStatusColor(press.status) }}>
                              {press.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="press-details">
                            <div className="press-date">{new Date(press.date).toLocaleString()}</div>
                            <div className="press-location">📍 {press.location}</div>
                            <div className="press-attendees">👥 {press.attendees} attendees</div>
                            <div className="press-duration">⏱️ {press.duration} minutes</div>
                            <div className="press-questions">❓ {press.questions} questions</div>
                          </div>
                          <div className="press-topics">
                            <strong>Topics:</strong>
                            <div className="topics-list">
                              {press.topics.map((topic, i) => (
                                <span key={i} className="topic-tag">{topic}</span>
                              ))}
                            </div>
                          </div>
                          <div className="press-outlets">
                            <strong>Media Outlets:</strong>
                            <div className="outlets-list">
                              {press.mediaOutlets.map((outlet, i) => (
                                <span key={i} className="outlet-tag">{outlet}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="media-section">
                    <h4>📢 Public Messages</h4>
                    <div className="public-messages">
                      {communicationsData.publicMessages.map((msg) => (
                        <div key={msg.id} className="message-item">
                          <div className="msg-header">
                            <div className="msg-title">{msg.title}</div>
                            <div className="msg-sentiment" style={{ color: getSentimentColor(msg.sentiment) }}>
                              {msg.sentiment.toUpperCase()}
                            </div>
                          </div>
                          <div className="msg-content">{msg.content}</div>
                          <div className="msg-metrics">
                            <div className="msg-reach">Reach: {formatNumber(msg.reach)}</div>
                            <div className="msg-engagement">Engagement: {msg.engagement}%</div>
                            <div className="msg-date">{new Date(msg.publishDate).toLocaleDateString()}</div>
                            <div className="msg-author">By: {msg.author}</div>
                          </div>
                          <div className="msg-platforms">
                            {msg.platforms.map((platform, i) => (
                              <span key={i} className="platform-tag">{platform}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="media-section">
                    <h4>🤝 Media Relations</h4>
                    <div className="media-relations">
                      {communicationsData.mediaRelations.map((media) => (
                        <div key={media.id} className="media-item">
                          <div className="media-header">
                            <div className="media-outlet">{media.outlet}</div>
                            <div className="media-relationship" style={{ color: getRelationshipColor(media.relationship) }}>
                              {media.relationship.toUpperCase()}
                            </div>
                          </div>
                          <div className="media-details">
                            <div className="media-type">{media.type.toUpperCase()}</div>
                            <div className="media-reach">Reach: {formatNumber(media.reach)}</div>
                            <div className="media-influence">Influence: {media.influence}%</div>
                            <div className="media-contact">Last Contact: {media.lastContact}</div>
                          </div>
                          <div className="media-contacts">
                            <strong>Key Contacts:</strong>
                            <div className="contacts-list">
                              {media.keyContacts.map((contact, i) => (
                                <div key={i} className="contact-item">{contact}</div>
                              ))}
                            </div>
                          </div>
                          <div className="media-coverage">
                            <strong>Recent Coverage:</strong>
                            <div className="coverage-list">
                              {media.recentCoverage.map((coverage, i) => (
                                <span key={i} className="coverage-tag">{coverage}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tab-actions">
                    <button className="action-btn">Schedule Conference</button>
                    <button className="action-btn secondary">Media Advisory</button>
                    <button className="action-btn">Draft Message</button>
                    <button className="action-btn secondary">Contact Media</button>
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
