import React, { useState, useEffect } from 'react';
import { QuickActionModal, QuickActionProps, TabConfig } from './QuickActionModal';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Address {
  id: string;
  title: string;
  type: 'state_of_union' | 'emergency' | 'policy' | 'celebration' | 'memorial' | 'diplomatic';
  audience: 'nation' | 'parliament' | 'military' | 'international' | 'colonies';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'delivered';
  scheduledDate: string;
  duration: number; // in minutes
  topics: string[];
  keyMessages: string[];
  speechWriter: string;
  approvedBy: string[];
  venue: string;
  expectedAudience: number;
}

interface AddressMetrics {
  totalAddresses: number;
  scheduledAddresses: number;
  draftAddresses: number;
  averageRating: number;
  totalViewership: number;
  engagementRate: number;
}

interface PublicSentiment {
  overall: number;
  byTopic: Array<{
    topic: string;
    sentiment: number;
    mentions: number;
  }>;
  trending: string[];
}

interface MediaCoverage {
  id: string;
  outlet: string;
  headline: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
  timestamp: string;
}

interface AddressData {
  addresses: Address[];
  metrics: AddressMetrics;
  sentiment: PublicSentiment;
  mediaCoverage: MediaCoverage[];
  templates: any[];
}

// Tab Content Component
interface TabContentProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export const AddressNationScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'addresses', label: 'Addresses', icon: '🎤' },
    { id: 'sentiment', label: 'Public Sentiment', icon: '📈' },
    { id: 'media', label: 'Media Coverage', icon: '📺' },
    { id: 'templates', label: 'Templates', icon: '📝' }
  ];

  // Utility functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'state_of_union': return '🏛️';
      case 'emergency': return '🚨';
      case 'policy': return '📋';
      case 'celebration': return '🎉';
      case 'memorial': return '🕊️';
      case 'diplomatic': return '🤝';
      default: return '🎤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'review': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'scheduled': return '#3b82f6';
      case 'delivered': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#fb7185';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return '#10b981';
    if (sentiment >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getMediaSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'neutral': return '#f59e0b';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/address-nation');
      if (response.ok) {
        const apiData = await response.json();
        setAddressData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch address nation data:', err);
      
      // Comprehensive mock data
      const mockAddresses: Address[] = [
        {
          id: 'addr-001',
          title: 'State of the Union 2387',
          type: 'state_of_union',
          audience: 'nation',
          priority: 'critical',
          status: 'scheduled',
          scheduledDate: '2387.160.18:00',
          duration: 45,
          topics: ['Economy', 'Defense', 'Infrastructure', 'Education', 'Space Exploration'],
          keyMessages: [
            'Economic growth at all-time high',
            'New defense initiatives for outer rim',
            'Infrastructure modernization program',
            'Education reform implementation'
          ],
          speechWriter: 'Chief Communications Officer Sarah Chen',
          approvedBy: ['Prime Minister', 'Cabinet'],
          venue: 'Parliamentary Grand Hall',
          expectedAudience: 2500000
        },
        {
          id: 'addr-002',
          title: 'Emergency Security Briefing',
          type: 'emergency',
          audience: 'nation',
          priority: 'high',
          status: 'approved',
          scheduledDate: '2387.157.20:00',
          duration: 15,
          topics: ['Border Security', 'Emergency Protocols'],
          keyMessages: [
            'Enhanced security measures implemented',
            'Public safety remains top priority',
            'Cooperation with defense forces'
          ],
          speechWriter: 'Security Communications Team',
          approvedBy: ['Prime Minister', 'Defense Secretary'],
          venue: 'Emergency Broadcast Center',
          expectedAudience: 1800000
        },
        {
          id: 'addr-003',
          title: 'New Trade Policy Announcement',
          type: 'policy',
          audience: 'nation',
          priority: 'medium',
          status: 'review',
          scheduledDate: '2387.165.14:00',
          duration: 30,
          topics: ['Trade Policy', 'Economic Development', 'International Relations'],
          keyMessages: [
            'Expanded trade opportunities',
            'Job creation initiatives',
            'Strengthened international partnerships'
          ],
          speechWriter: 'Policy Communications Director',
          approvedBy: ['Commerce Minister'],
          venue: 'Trade Center Auditorium',
          expectedAudience: 800000
        }
      ];

      const mockMetrics: AddressMetrics = {
        totalAddresses: 12,
        scheduledAddresses: 3,
        draftAddresses: 2,
        averageRating: 8.4,
        totalViewership: 15200000,
        engagementRate: 73.2
      };

      const mockSentiment: PublicSentiment = {
        overall: 68,
        byTopic: [
          { topic: 'Economy', sentiment: 75, mentions: 12500 },
          { topic: 'Defense', sentiment: 82, mentions: 8900 },
          { topic: 'Infrastructure', sentiment: 71, mentions: 6700 },
          { topic: 'Education', sentiment: 65, mentions: 9200 },
          { topic: 'Space Exploration', sentiment: 88, mentions: 15600 }
        ],
        trending: ['#StateOfUnion2387', '#SpaceExploration', '#DefenseFirst', '#EconomicGrowth']
      };

      const mockMediaCoverage: MediaCoverage[] = [
        {
          id: 'media-001',
          outlet: 'Galactic News Network',
          headline: 'Prime Minister Announces Bold Space Exploration Initiative',
          sentiment: 'positive',
          reach: 2500000,
          timestamp: '2387.156.22:30'
        },
        {
          id: 'media-002',
          outlet: 'Colonial Broadcasting',
          headline: 'Security Measures Draw Mixed Reactions from Citizens',
          sentiment: 'neutral',
          reach: 1800000,
          timestamp: '2387.156.21:15'
        },
        {
          id: 'media-003',
          outlet: 'Economic Times',
          headline: 'Trade Policy Changes Expected to Boost Employment',
          sentiment: 'positive',
          reach: 950000,
          timestamp: '2387.156.20:45'
        },
        {
          id: 'media-004',
          outlet: 'Independent Observer',
          headline: 'Critics Question Timeline for Infrastructure Projects',
          sentiment: 'negative',
          reach: 650000,
          timestamp: '2387.156.19:20'
        }
      ];

      const mockTemplates = [
        {
          id: 'template-001',
          name: 'State of the Union Template',
          type: 'state_of_union',
          sections: ['Opening', 'Economic Review', 'Policy Updates', 'Future Vision', 'Closing'],
          estimatedDuration: 45,
          lastUsed: '2386.160.18:00'
        },
        {
          id: 'template-002',
          name: 'Emergency Address Template',
          type: 'emergency',
          sections: ['Situation Overview', 'Immediate Actions', 'Public Safety', 'Next Steps'],
          estimatedDuration: 15,
          lastUsed: '2387.145.09:30'
        },
        {
          id: 'template-003',
          name: 'Policy Announcement Template',
          type: 'policy',
          sections: ['Background', 'Policy Details', 'Benefits', 'Implementation', 'Q&A'],
          estimatedDuration: 30,
          lastUsed: '2387.140.16:00'
        }
      ];

      setAddressData({
        addresses: mockAddresses,
        metrics: mockMetrics,
        sentiment: mockSentiment,
        mediaCoverage: mockMediaCoverage,
        templates: mockTemplates
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const filteredAddresses = addressData?.addresses.filter(address => {
    const typeMatch = filterType === 'all' || address.type === filterType;
    const statusMatch = filterStatus === 'all' || address.status === filterStatus;
    return typeMatch && statusMatch;
  }) || [];

  // Chart data
  const typeData = addressData ? [
    { label: 'State of Union', value: addressData.addresses.filter(a => a.type === 'state_of_union').length },
    { label: 'Emergency', value: addressData.addresses.filter(a => a.type === 'emergency').length },
    { label: 'Policy', value: addressData.addresses.filter(a => a.type === 'policy').length },
    { label: 'Celebration', value: addressData.addresses.filter(a => a.type === 'celebration').length },
    { label: 'Memorial', value: addressData.addresses.filter(a => a.type === 'memorial').length },
    { label: 'Diplomatic', value: addressData.addresses.filter(a => a.type === 'diplomatic').length }
  ] : [];

  const statusData = addressData ? [
    { label: 'Draft', value: addressData.addresses.filter(a => a.status === 'draft').length },
    { label: 'Review', value: addressData.addresses.filter(a => a.status === 'review').length },
    { label: 'Approved', value: addressData.addresses.filter(a => a.status === 'approved').length },
    { label: 'Scheduled', value: addressData.addresses.filter(a => a.status === 'scheduled').length },
    { label: 'Delivered', value: addressData.addresses.filter(a => a.status === 'delivered').length }
  ] : [];

  const sentimentData = addressData?.sentiment.byTopic.map(topic => ({
    label: topic.topic,
    value: topic.sentiment
  })) || [];

  if (loading) {
    return (
      <QuickActionModal
        onClose={onClose}
        isVisible={isVisible}
        title="Address the Nation"
        icon="🎤"
        theme="social-theme"
        tabs={tabs}
        onRefresh={fetchData}
      >
        <TabContent tabId="overview">
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#a0a9ba',
            fontSize: '1.1rem'
          }}>
            Loading address data...
          </div>
        </TabContent>
      </QuickActionModal>
    );
  }

  return (
    <QuickActionModal
      onClose={onClose}
      isVisible={isVisible}
      title="Address the Nation"
      icon="🎤"
      theme="social-theme"
      tabs={tabs}
      onRefresh={fetchData}
    >
      {/* Overview Tab */}
      <TabContent tabId="overview">
        {/* Address Metrics */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📊 Address Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Total Addresses</span>
              <span className="standard-metric-value">
                {addressData?.metrics.totalAddresses || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Scheduled</span>
              <span className="standard-metric-value" style={{ color: '#3b82f6' }}>
                {addressData?.metrics.scheduledAddresses || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>In Draft</span>
              <span className="standard-metric-value" style={{ color: '#f59e0b' }}>
                {addressData?.metrics.draftAddresses || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Average Rating</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {addressData?.metrics.averageRating || 0}/10
              </span>
            </div>
            <div className="standard-metric">
              <span>Total Viewership</span>
              <span className="standard-metric-value">
                {(addressData?.metrics.totalViewership || 0).toLocaleString()}
              </span>
            </div>
            <div className="standard-metric">
              <span>Engagement Rate</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {addressData?.metrics.engagementRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📈 Address Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Address Types
              </h4>
              <PieChart data={typeData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Status Distribution
              </h4>
              <BarChart data={statusData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--social-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Topic Sentiment
              </h4>
              <LineChart data={sentimentData} />
            </div>
          </div>
        </div>
      </TabContent>

      {/* Addresses Tab */}
      <TabContent tabId="addresses">
        {/* Filters */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🔍 Filter Addresses</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Type:</label>
              <div className="standard-action-buttons">
                {['all', 'state_of_union', 'emergency', 'policy', 'celebration', 'memorial', 'diplomatic'].map(type => (
                  <button
                    key={type}
                    className={`standard-btn social-theme ${filterType === type ? 'active' : ''}`}
                    onClick={() => setFilterType(type)}
                  >
                    {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Status:</label>
              <div className="standard-action-buttons">
                {['all', 'draft', 'review', 'approved', 'scheduled', 'delivered'].map(status => (
                  <button
                    key={status}
                    className={`standard-btn social-theme ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Addresses List */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">🎤 Scheduled Addresses</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Audience</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Scheduled Date</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAddresses.map(address => (
                  <tr key={address.id}>
                    <td>
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                        {getTypeIcon(address.type)}
                      </span>
                      {address.type.replace('_', ' ').charAt(0).toUpperCase() + address.type.replace('_', ' ').slice(1)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{address.title}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                        {address.venue}
                      </div>
                    </td>
                    <td>{address.audience.charAt(0).toUpperCase() + address.audience.slice(1)}</td>
                    <td>
                      <span style={{ 
                        color: getPriorityColor(address.priority),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {address.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        color: getStatusColor(address.status),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {address.status}
                      </span>
                    </td>
                    <td>{address.scheduledDate}</td>
                    <td>{address.duration} min</td>
                    <td>
                      <button 
                        className="standard-btn social-theme" 
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        onClick={() => setSelectedAddress(address)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* Public Sentiment Tab */}
      <TabContent tabId="sentiment">
        {/* Overall Sentiment */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📈 Public Sentiment</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Overall Sentiment</span>
              <span className="standard-metric-value" style={{ color: getSentimentColor(addressData?.sentiment.overall || 0) }}>
                {addressData?.sentiment.overall || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Trending Topics</span>
              <span className="standard-metric-value">
                {addressData?.sentiment.trending.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Topic Sentiment */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📊 Sentiment by Topic</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Sentiment Score</th>
                  <th>Mentions</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {addressData?.sentiment.byTopic.map(topic => (
                  <tr key={topic.topic}>
                    <td style={{ fontWeight: 'bold' }}>{topic.topic}</td>
                    <td>
                      <span style={{ 
                        color: getSentimentColor(topic.sentiment),
                        fontWeight: 'bold'
                      }}>
                        {topic.sentiment}%
                      </span>
                    </td>
                    <td>{topic.mentions.toLocaleString()}</td>
                    <td>
                      <span style={{ color: topic.sentiment >= 70 ? '#10b981' : topic.sentiment >= 40 ? '#f59e0b' : '#ef4444' }}>
                        {topic.sentiment >= 70 ? '📈' : topic.sentiment >= 40 ? '➡️' : '📉'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">🔥 Trending Hashtags</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 0' }}>
            {addressData?.sentiment.trending.map(tag => (
              <span 
                key={tag}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: 'var(--social-accent)',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '0.9em',
                  fontWeight: '600'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TabContent>

      {/* Media Coverage Tab */}
      <TabContent tabId="media">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📺 Media Coverage</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Outlet</th>
                  <th>Headline</th>
                  <th>Sentiment</th>
                  <th>Reach</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {addressData?.mediaCoverage.map(coverage => (
                  <tr key={coverage.id}>
                    <td style={{ fontWeight: 'bold' }}>{coverage.outlet}</td>
                    <td>{coverage.headline}</td>
                    <td>
                      <span style={{ 
                        color: getMediaSentimentColor(coverage.sentiment),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {coverage.sentiment}
                      </span>
                    </td>
                    <td>{coverage.reach.toLocaleString()}</td>
                    <td>{coverage.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* Templates Tab */}
      <TabContent tabId="templates">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📝 Speech Templates</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {addressData?.templates.map(template => (
              <div key={template.id} className="standard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--social-accent)', margin: '0' }}>
                    {getTypeIcon(template.type)} {template.name}
                  </h4>
                  <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    <div>Duration: {template.estimatedDuration} min</div>
                    <div>Last used: {template.lastUsed}</div>
                  </div>
                </div>
                <div>
                  <strong>Sections:</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {template.sections.map((section: string, index: number) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{section}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <button className="standard-btn social-theme" style={{ fontSize: '0.8em', padding: '6px 12px' }}>
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabContent>
    </QuickActionModal>
  );
};

export default AddressNationScreen;
