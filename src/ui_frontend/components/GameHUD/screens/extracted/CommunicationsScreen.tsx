import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CommunicationsScreen.css';
import '../shared/StandardDesign.css';

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

  // Define tabs for the header
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'leader', label: 'Leader Comms', icon: '👑' },
    { id: 'operations', label: 'Operations', icon: '⚡' },
    { id: 'media', label: 'Media', icon: '📺' },
    { id: 'platforms', label: 'Platforms', icon: '🔗' }
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
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'leader' | 'operations' | 'media' | 'platforms')}
    >
      <div className="standard-screen-container government-theme">
        {loading && <div className="loading-overlay">Loading communications data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && communicationsData && (
            <>
              {activeTab === 'overview' && (
                <>
                  {/* Communications Overview - First card in 2-column grid */}
                  <div className="standard-panel government-theme">
                    <div className="standard-metric">
                      <span>Total Messages</span>
                      <span className="standard-metric-value">{communicationsData.overview.totalMessages.toLocaleString()}</span>
                    </div>
                    <div className="standard-metric">
                      <span>Active Operations</span>
                      <span className="standard-metric-value">{communicationsData.overview.activeOperations}</span>
                    </div>
                    <div className="standard-metric">
                      <span>Media Reach</span>
                      <span className="standard-metric-value">{formatNumber(communicationsData.overview.mediaReach)}</span>
                    </div>
                    <div className="standard-metric">
                      <span>Approval Rating</span>
                      <span className="standard-metric-value">{communicationsData.overview.approvalRating}%</span>
                    </div>
                    <div className="standard-metric">
                      <span>Press Conferences</span>
                      <span className="standard-metric-value">{communicationsData.overview.pressConferences}</span>
                    </div>
                    <div className="standard-metric">
                      <span>Social Engagement</span>
                      <span className="standard-metric-value">{communicationsData.overview.socialEngagement}%</span>
                    </div>
                    <div className="standard-metric">
                      <span>News Articles</span>
                      <span className="standard-metric-value">{communicationsData.overview.newsArticles}</span>
                    </div>
                    <div className="standard-metric">
                      <span>Broadcast Hours</span>
                      <span className="standard-metric-value">{communicationsData.overview.broadcastHours}</span>
                    </div>
                    <div className="standard-action-buttons">
                      <button className="standard-btn government-theme">Communications Report</button>
                      <button className="standard-btn government-theme">Performance Review</button>
                  </div>
                </div>

                  {/* Communications Activity - Second card in 2-column grid */}
                  <div className="standard-panel government-theme">
                    <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📊 Communications Activity</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div className="standard-metric">
                        <span>Daily Messages</span>
                        <span className="standard-metric-value">47</span>
                          </div>
                      <div className="standard-metric">
                        <span>Response Time</span>
                        <span className="standard-metric-value">2.3h</span>
                        </div>
                      <div className="standard-metric">
                        <span>Engagement Rate</span>
                        <span className="standard-metric-value approval-good">89%</span>
                        </div>
                      <div className="standard-metric">
                        <span>Sentiment Score</span>
                        <span className="standard-metric-value approval-good">+2.1</span>
                        </div>
                      </div>
                  </div>
                </>
              )}

              {activeTab === 'leader' && (
                <>
                  {/* Leader Communications Overview */}
                  <div className="standard-panel government-theme table-panel">
                    <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👑 Leader Communications</h3>
                    <div className="standard-table-container">
                      <table className="standard-data-table">
                        <thead>
                          <tr>
                            <th>Communication</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Audience</th>
                            <th>Reach</th>
                            <th>Status</th>
                            <th>Approval</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {communicationsData.leaderCommunications.map((comm) => (
                            <tr key={comm.id}>
                              <td>
                                <strong>{comm.title}</strong><br />
                                <small style={{ color: '#a0a9ba' }}>Duration: {comm.duration} minutes</small>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: '#4facfe',
                                  color: 'white'
                                }}>
                                  {comm.type.toUpperCase()}
                                </span>
                              </td>
                              <td>{new Date(comm.date).toLocaleDateString()}</td>
                              <td>{comm.audience}</td>
                              <td>{formatNumber(comm.reach)}</td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getStatusColor(comm.status),
                                  color: 'white'
                                }}>
                                  {comm.status.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span className="standard-metric-value approval-good">{comm.approval}%</span>
                              </td>
                              <td>
                                <button className="standard-btn government-theme">Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  </div>
                </>
              )}

              {activeTab === 'operations' && (
                <>
                  {/* Active Operations Overview */}
                  <div className="standard-panel government-theme table-panel">
                    <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>⚡ Active Communications Operations</h3>
                    <div className="standard-table-container">
                      <table className="standard-data-table">
                        <thead>
                          <tr>
                            <th>Operation</th>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Reach</th>
                            <th>Budget</th>
                            <th>Team Size</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                    {communicationsData.activeOperations.map((op) => (
                            <tr key={op.id}>
                              <td>
                                <strong>{op.name}</strong><br />
                                <small style={{ color: '#a0a9ba' }}>
                            {new Date(op.startDate).toLocaleDateString()} - {new Date(op.endDate).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: '#4facfe',
                                  color: 'white'
                                }}>
                                  {op.type.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getPriorityColor(op.priority),
                                  color: 'white'
                                }}>
                                  {op.priority.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getStatusColor(op.status),
                                  color: 'white'
                                }}>
                                  {op.status.toUpperCase()}
                                </span>
                              </td>
                              <td>{formatNumber(op.reach)}</td>
                              <td>{formatCurrency(op.budget)}</td>
                              <td>{op.team.length}</td>
                              <td>
                                <button className="standard-btn government-theme">Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        </div>
                        </div>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  {/* Media Relations Overview */}
                  <div className="standard-panel government-theme table-panel">
                    <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📺 Media Relations</h3>
                    <div className="standard-table-container">
                      <table className="standard-data-table">
                        <thead>
                          <tr>
                            <th>Media Outlet</th>
                            <th>Type</th>
                            <th>Relationship</th>
                            <th>Reach</th>
                            <th>Influence</th>
                            <th>Last Contact</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {communicationsData.mediaRelations.map((media) => (
                            <tr key={media.id}>
                              <td>
                                <strong>{media.outlet}</strong><br />
                                <small style={{ color: '#a0a9ba' }}>Key Contacts: {media.keyContacts.join(', ')}</small>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: '#4facfe',
                                  color: 'white'
                                }}>
                                  {media.type.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getRelationshipColor(media.relationship),
                                  color: 'white'
                                }}>
                                  {media.relationship.toUpperCase()}
                                </span>
                              </td>
                              <td>{formatNumber(media.reach)}</td>
                              <td>{media.influence}/100</td>
                              <td>{new Date(media.lastContact).toLocaleDateString()}</td>
                              <td>
                                <button className="standard-btn government-theme">Contact</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        </div>
                        </div>
                </>
              )}

              {activeTab === 'platforms' && (
                <>
                  {/* Platform Integrations Overview */}
                  <div className="standard-panel government-theme table-panel">
                    <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🔗 Platform Integrations</h3>
                    <div className="standard-table-container">
                      <table className="standard-data-table">
                        <thead>
                          <tr>
                            <th>Platform</th>
                            <th>Status</th>
                            <th>Followers</th>
                            <th>Reach</th>
                            <th>Engagement</th>
                            <th>Posts Today</th>
                            <th>API Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                    {communicationsData.platformIntegrations.map((platform, i) => (
                            <tr key={i}>
                              <td>
                                <strong>{platform.platform}</strong><br />
                                <small style={{ color: '#a0a9ba' }}>Last Post: {new Date(platform.lastPost).toLocaleTimeString()}</small>
                              </td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getStatusColor(platform.status),
                                  color: 'white'
                                }}>
                            {platform.status.toUpperCase()}
                                </span>
                              </td>
                              <td>{platform.followers > 0 ? formatNumber(platform.followers) : 'N/A'}</td>
                              <td>{formatNumber(platform.reach)}</td>
                              <td>{platform.engagement > 0 ? `${platform.engagement}%` : 'N/A'}</td>
                              <td>{platform.postsToday}</td>
                              <td>
                                <span style={{ 
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  backgroundColor: getStatusColor(platform.apiStatus),
                                  color: 'white'
                                }}>
                            {platform.apiStatus.toUpperCase()}
                          </span>
                              </td>
                              <td>
                                <button className="standard-btn government-theme">Manage</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CommunicationsScreen;
