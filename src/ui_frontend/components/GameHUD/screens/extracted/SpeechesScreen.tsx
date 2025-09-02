/**
 * Speeches Screen - Public Speaking and Communication Management
 * 
 * This screen focuses on speech and communication operations including:
 * - Speech writing and preparation
 * - Public speaking events and scheduling
 * - Communication strategy and messaging
 * - Speech analytics and audience response
 * - Media coverage and public relations
 * 
 * Theme: Social (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './SpeechesScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Speech {
  id: string;
  title: string;
  speaker: string;
  speakerId: string;
  event: string;
  date: string;
  duration: number;
  category: 'political' | 'diplomatic' | 'scientific' | 'cultural' | 'economic' | 'military';
  audience: string;
  venue: string;
  status: 'draft' | 'scheduled' | 'delivered' | 'archived';
  views: number;
  positiveReactions: number;
  negativeReactions: number;
  neutralReactions: number;
  mediaCoverage: number;
  keyMessages: string[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
}

interface SpeechAnalytics {
  overview: {
    totalSpeeches: number;
    deliveredSpeeches: number;
    totalViews: number;
    totalReactions: number;
    averageDuration: number;
    topPerformingSpeech: string;
  };
  performanceTrends: Array<{
    date: string;
    speechesDelivered: number;
    totalViews: number;
    totalReactions: number;
    averageReactions: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    speeches: number;
    views: number;
    reactions: number;
    averageDuration: number;
  }>;
  audienceInsights: Array<{
    audience: string;
    size: number;
    engagementRate: number;
    favoriteCategory: string;
    responsePattern: string;
  }>;
}

interface SpeechesData {
  speeches: Speech[];
  analytics: SpeechAnalytics;
}

const SpeechesScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [speechesData, setSpeechesData] = useState<SpeechesData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'speeches' | 'events' | 'analytics' | 'strategy'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'speeches', label: 'Speeches', icon: '🎤' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'strategy', label: 'Strategy', icon: '🎯' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/speeches', description: 'Get speeches' },
    { method: 'POST', path: '/api/speeches', description: 'Create new speech' },
    { method: 'PUT', path: '/api/speeches/:id', description: 'Update speech' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'political': return '#ef4444';
      case 'diplomatic': return '#3b82f6';
      case 'scientific': return '#10b981';
      case 'cultural': return '#ec4899';
      case 'economic': return '#f59e0b';
      case 'military': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'scheduled': return '#f59e0b';
      case 'delivered': return '#10b981';
      case 'archived': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'under_review': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const fetchSpeechesData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/speeches');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSpeechesData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch speeches data:', err);
      // Use comprehensive mock data
      setSpeechesData({
        speeches: [
          {
            id: 'speech_1',
            title: 'The Future of Interstellar Cooperation',
            speaker: 'President Sarah Chen',
            speakerId: 'speaker_1',
            event: 'Galactic Unity Summit',
            date: '2393-06-20T14:00:00Z',
            duration: 45,
            category: 'diplomatic',
            audience: 'Interstellar Leaders',
            venue: 'United Galactic Assembly Hall',
            status: 'scheduled',
            views: 0,
            positiveReactions: 0,
            negativeReactions: 0,
            neutralReactions: 0,
            mediaCoverage: 0,
            keyMessages: ['Unity', 'Cooperation', 'Peace', 'Progress'],
            tags: ['Diplomacy', 'Unity', 'Summit'],
            priority: 'critical',
            approvalStatus: 'approved'
          },
          {
            id: 'speech_2',
            title: 'Economic Policies for the New Era',
            speaker: 'Secretary of Economics Dr. Marcus Rodriguez',
            speakerId: 'speaker_2',
            event: 'Economic Policy Forum',
            date: '2393-06-18T10:30:00Z',
            duration: 30,
            category: 'economic',
            audience: 'Economic Leaders',
            venue: 'Federal Economic Center',
            status: 'delivered',
            views: 890000,
            positiveReactions: 45600,
            negativeReactions: 8900,
            neutralReactions: 12300,
            mediaCoverage: 156,
            keyMessages: ['Growth', 'Innovation', 'Stability', 'Opportunity'],
            tags: ['Economy', 'Policy', 'Growth'],
            priority: 'high',
            approvalStatus: 'approved'
          },
          {
            id: 'speech_3',
            title: 'Advancements in Quantum Computing',
            speaker: 'Dr. Elena Petrova',
            speakerId: 'speaker_3',
            event: 'Science & Technology Conference',
            date: '2393-06-15T16:00:00Z',
            duration: 60,
            category: 'scientific',
            audience: 'Scientists & Researchers',
            venue: 'Galactic Science Institute',
            status: 'delivered',
            views: 1250000,
            positiveReactions: 78900,
            negativeReactions: 2340,
            neutralReactions: 8900,
            mediaCoverage: 234,
            keyMessages: ['Innovation', 'Discovery', 'Future', 'Technology'],
            tags: ['Science', 'Technology', 'Quantum'],
            priority: 'high',
            approvalStatus: 'approved'
          },
          {
            id: 'speech_4',
            title: 'Cultural Exchange and Understanding',
            speaker: 'Cultural Ambassador Lisa Park',
            speakerId: 'speaker_4',
            event: 'Cultural Diversity Festival',
            date: '2393-06-12T19:00:00Z',
            duration: 25,
            category: 'cultural',
            audience: 'Cultural Representatives',
            venue: 'Multicultural Center',
            status: 'delivered',
            views: 450000,
            positiveReactions: 23400,
            negativeReactions: 1200,
            neutralReactions: 5600,
            mediaCoverage: 89,
            keyMessages: ['Diversity', 'Understanding', 'Harmony', 'Culture'],
            tags: ['Culture', 'Diversity', 'Harmony'],
            priority: 'medium',
            approvalStatus: 'approved'
          },
          {
            id: 'speech_5',
            title: 'Defense Strategy for Galactic Security',
            speaker: 'General Alexander Thompson',
            speakerId: 'speaker_5',
            event: 'Defense Council Meeting',
            date: '2393-06-10T09:00:00Z',
            duration: 40,
            category: 'military',
            audience: 'Military Leaders',
            venue: 'Defense Command Center',
            status: 'delivered',
            views: 670000,
            positiveReactions: 34500,
            negativeReactions: 8900,
            neutralReactions: 12300,
            mediaCoverage: 123,
            keyMessages: ['Security', 'Defense', 'Strategy', 'Protection'],
            tags: ['Military', 'Defense', 'Security'],
            priority: 'critical',
            approvalStatus: 'approved'
          }
        ],
        analytics: {
          overview: {
            totalSpeeches: 234,
            deliveredSpeeches: 189,
            totalViews: 45600000,
            totalReactions: 2340000,
            averageDuration: 32.5,
            topPerformingSpeech: 'Advancements in Quantum Computing'
          },
          performanceTrends: [
            { date: 'Jun 10', speechesDelivered: 3, totalViews: 890000, totalReactions: 45600, averageReactions: 15200 },
            { date: 'Jun 11', speechesDelivered: 2, totalViews: 920000, totalReactions: 47800, averageReactions: 23900 },
            { date: 'Jun 12', speechesDelivered: 4, totalViews: 950000, totalReactions: 51200, averageReactions: 12800 },
            { date: 'Jun 13', speechesDelivered: 1, totalViews: 980000, totalReactions: 53400, averageReactions: 53400 },
            { date: 'Jun 14', speechesDelivered: 3, totalViews: 1020000, totalReactions: 56700, averageReactions: 18900 },
            { date: 'Jun 15', speechesDelivered: 2, totalViews: 1050000, totalReactions: 58900, averageReactions: 29450 }
          ],
          categoryBreakdown: [
            { category: 'Political', speeches: 45, views: 8900000, reactions: 456000, averageDuration: 35.2 },
            { category: 'Diplomatic', speeches: 34, views: 12300000, reactions: 567000, averageDuration: 42.8 },
            { category: 'Scientific', speeches: 56, views: 15600000, reactions: 789000, averageDuration: 58.3 },
            { category: 'Cultural', speeches: 38, views: 6700000, reactions: 234000, averageDuration: 28.7 },
            { category: 'Economic', speeches: 42, views: 8900000, reactions: 456000, averageDuration: 31.5 },
            { category: 'Military', speeches: 19, views: 4500000, reactions: 189000, averageDuration: 38.9 }
          ],
          audienceInsights: [
            { audience: 'Interstellar Leaders', size: 89000, engagementRate: 8.7, favoriteCategory: 'Diplomatic', responsePattern: 'High engagement, formal responses' },
            { audience: 'Economic Leaders', size: 56700, engagementRate: 7.2, favoriteCategory: 'Economic', responsePattern: 'Analytical responses, data-driven' },
            { audience: 'Scientists & Researchers', size: 234000, engagementRate: 9.1, favoriteCategory: 'Scientific', responsePattern: 'Technical discussions, peer review' },
            { audience: 'Cultural Representatives', size: 123000, engagementRate: 6.8, favoriteCategory: 'Cultural', responsePattern: 'Emotional responses, artistic expression' }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpeechesData();
  }, [fetchSpeechesData]);

  const renderOverview = () => (
    <>
      {/* Speeches Overview - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Speeches Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Speeches</span>
            <span className="standard-metric-value">{speechesData?.analytics.overview.totalSpeeches}</span>
          </div>
          <div className="standard-metric">
            <span>Delivered</span>
            <span className="standard-metric-value">{speechesData?.analytics.overview.deliveredSpeeches}</span>
          </div>
          <div className="standard-metric">
            <span>Total Views</span>
            <span className="standard-metric-value">{formatNumber(speechesData?.analytics.overview.totalViews || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Reactions</span>
            <span className="standard-metric-value">{formatNumber(speechesData?.analytics.overview.totalReactions || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Avg Duration</span>
            <span className="standard-metric-value">{speechesData?.analytics.overview.averageDuration} min</span>
          </div>
          <div className="standard-metric">
            <span>Top Speech</span>
            <span className="standard-metric-value">Quantum Computing</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Speech')}>✏️ New Speech</button>
          <button className="standard-btn social-theme" onClick={() => console.log('View All Speeches')}>🎤 View All</button>
        </div>
      </div>

      {/* Category Performance - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Category Performance</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Speeches</th>
                <th>Views</th>
                <th>Reactions</th>
                <th>Avg Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speechesData?.analytics.categoryBreakdown.map(category => (
                <tr key={category.category}>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(category.category.toLowerCase()),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(category.category.toLowerCase()) + '20'
                    }}>
                      {category.category}
                    </span>
                  </td>
                  <td>{category.speeches}</td>
                  <td>{formatNumber(category.views)}</td>
                  <td>{formatNumber(category.reactions)}</td>
                  <td>{category.averageDuration} min</td>
                  <td>
                    <button className="standard-btn social-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderSpeeches = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎤 Speech Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Speech')}>✏️ New Speech</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Filter Speeches')}>🔍 Filter</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Speaker</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Reactions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speechesData?.speeches.map(speech => (
                <tr key={speech.id}>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{speech.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{speech.event}</div>
                    </div>
                  </td>
                  <td>{speech.speaker}</td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(speech.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(speech.category) + '20'
                    }}>
                      {speech.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(speech.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(speech.status) + '20'
                    }}>
                      {speech.status}
                    </span>
                  </td>
                  <td>{formatNumber(speech.views)}</td>
                  <td>
                    <span style={{ color: speech.positiveReactions > speech.negativeReactions ? '#10b981' : speech.negativeReactions > speech.positiveReactions ? '#ef4444' : '#f59e0b' }}>
                      {formatNumber(speech.positiveReactions + speech.negativeReactions + speech.neutralReactions)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn social-theme">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📅 Event Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Schedule Event')}>📅 Schedule Event</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Manage Venues')}>🏛️ Venues</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Event Calendar')}>📋 Calendar</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Upcoming Events</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Galactic Unity Summit</td>
                    <td>Jun 20, 14:00</td>
                    <td>
                      <span style={{ color: '#f59e0b', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', backgroundColor: '#f59e0b20' }}>
                        Scheduled
                      </span>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Manage</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Economic Policy Forum</td>
                    <td>Jun 18, 10:30</td>
                    <td>
                      <span style={{ color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', backgroundColor: '#10b98120' }}>
                        Completed
                      </span>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Review</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Science Conference</td>
                    <td>Jun 15, 16:00</td>
                    <td>
                      <span style={{ color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', backgroundColor: '#10b98120' }}>
                        Completed
                      </span>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Review</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Event Metrics</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Events This Month</span>
                <span className="standard-metric-value">12</span>
              </div>
              <div className="standard-metric">
                <span>Avg Attendance</span>
                <span className="standard-metric-value">2.3K</span>
              </div>
              <div className="standard-metric">
                <span>Media Coverage</span>
                <span className="standard-metric-value">89</span>
              </div>
              <div className="standard-metric">
                <span>Success Rate</span>
                <span className="standard-metric-value">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Speech Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={speechesData?.analytics.performanceTrends.map(trend => ({
                name: trend.date,
                'Speeches Delivered': trend.speechesDelivered,
                'Total Views': trend.totalViews / 1000000,
                'Total Reactions': trend.totalReactions / 1000,
                'Average Reactions': trend.averageReactions / 1000
              })) || []}
              title="Speech Performance Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={speechesData?.analytics.categoryBreakdown.map(category => ({
                name: category.category,
                value: category.views
              })) || []}
              title="Views by Category"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Performance Metrics</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Daily Views</td>
                  <td style={{ color: '#10b981' }}>1.05M</td>
                  <td>1.2M</td>
                  <td style={{ color: '#f59e0b' }}>↗️ Improving</td>
                </tr>
                <tr>
                  <td>Engagement Rate</td>
                  <td style={{ color: '#10b981' }}>5.1%</td>
                  <td>6.0%</td>
                  <td style={{ color: '#10b981' }}>↗️ On Track</td>
                </tr>
                <tr>
                  <td>Speech Duration</td>
                  <td style={{ color: '#10b981' }}>32.5 min</td>
                  <td>30.0 min</td>
                  <td style={{ color: '#f59e0b' }}>⚠️ Slightly Over</td>
                </tr>
                <tr>
                  <td>Approval Rate</td>
                  <td style={{ color: '#10b981' }}>94%</td>
                  <td>95%</td>
                  <td style={{ color: '#10b981' }}>✅ Near Target</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎯 Communication Strategy</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Audience Insights</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Audience</th>
                    <th>Size</th>
                    <th>Engagement</th>
                    <th>Favorite Category</th>
                  </tr>
                </thead>
                <tbody>
                  {speechesData?.analytics.audienceInsights.map(insight => (
                    <tr key={insight.audience}>
                      <td>{insight.audience}</td>
                      <td>{formatNumber(insight.size)}</td>
                      <td>
                        <span style={{ color: insight.engagementRate >= 8 ? '#10b981' : insight.engagementRate >= 6 ? '#f59e0b' : '#ef4444' }}>
                          {insight.engagementRate}%
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          color: getCategoryColor(insight.favoriteCategory.toLowerCase()),
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          backgroundColor: getCategoryColor(insight.favoriteCategory.toLowerCase()) + '20'
                        }}>
                          {insight.favoriteCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Strategic Recommendations</h4>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '0.5rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <h5 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Key Insights:</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#10b981' }}>
                <li>Scientific speeches have highest engagement (9.1%)</li>
                <li>Diplomatic speeches are longest but well-received</li>
                <li>Economic content drives policy discussions</li>
                <li>Cultural speeches have niche but loyal audience</li>
                <li>Military speeches require careful messaging</li>
              </ul>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h5 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Strategic Actions:</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#10b981' }}>
                <li>Increase scientific content frequency</li>
                <li>Optimize diplomatic speech length</li>
                <li>Develop economic policy series</li>
                <li>Expand cultural programming</li>
                <li>Enhance military communication training</li>
              </ul>
            </div>
          </div>
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
      onRefresh={fetchSpeechesData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        <div className="standard-dashboard">
          {!loading && !error && speechesData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'speeches' && renderSpeeches()}
              {activeTab === 'events' && renderEvents()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'strategy' && renderStrategy()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading speeches data...' : 'No speeches data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default SpeechesScreen;
