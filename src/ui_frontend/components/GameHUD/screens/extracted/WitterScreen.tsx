/**
 * Witter Screen - Social Media and Communication Platform
 * 
 * This screen focuses on social media operations including:
 * - Social media feed and content management
 * - Trending topics and viral content
 * - Social media analytics and insights
 * - Content moderation and management
 * - Social influence and engagement metrics
 * 
 * Theme: Social (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import { SimpleWitterFeed } from '../../../Witter/SimpleWitterFeed';
import './WitterScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface WitterPost {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  views: number;
  category: 'science' | 'business' | 'sports' | 'politics' | 'technology' | 'entertainment';
  civilization: string;
  verified: boolean;
  trending: boolean;
  engagement: number;
}

interface TrendingTopic {
  id: string;
  hashtag: string;
  category: string;
  postCount: number;
  engagement: number;
  growth: number;
  topPosts: WitterPost[];
  relatedTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface SocialAnalytics {
  overview: {
    totalPosts: number;
    activeUsers: number;
    totalEngagement: number;
    averageEngagement: number;
    trendingTopics: number;
    verifiedAccounts: number;
  };
  engagementTrends: Array<{
    date: string;
    posts: number;
    likes: number;
    reposts: number;
    comments: number;
    views: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    posts: number;
    engagement: number;
    growth: number;
    topHashtags: string[];
  }>;
  civilizationActivity: Array<{
    civilization: string;
    activeUsers: number;
    posts: number;
    engagement: number;
    influence: number;
  }>;
}

interface WitterData {
  posts: WitterPost[];
  trendingTopics: TrendingTopic[];
  analytics: SocialAnalytics;
}

const WitterScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [witterData, setWitterData] = useState<WitterData | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'analytics' | 'management' | 'insights'>('feed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCivilization, setFilterCivilization] = useState<string>('all');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'feed', label: 'Feed', icon: '📱' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'management', label: 'Management', icon: '⚙️' },
    { id: 'insights', label: 'Insights', icon: '🔍' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/witter/posts', description: 'Get social media posts' },
    { method: 'GET', path: '/api/witter/trending', description: 'Get trending topics' },
    { method: 'POST', path: '/api/witter/posts', description: 'Create new post' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'science': return '#10b981';
      case 'business': return '#3b82f6';
      case 'sports': return '#f59e0b';
      case 'politics': return '#ef4444';
      case 'technology': return '#8b5cf6';
      case 'entertainment': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'neutral': return '#6b7280';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchWitterData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/witter/posts');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWitterData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch witter data:', err);
      // Use comprehensive mock data
      setWitterData({
        posts: [
          {
            id: 'post_1',
            author: 'Dr. Elena Petrova',
            authorId: 'user_1',
            content: 'Just completed the first successful quantum entanglement experiment across 3 light-years! The implications for interstellar communication are revolutionary. #QuantumBreakthrough #SpaceScience',
            timestamp: '2393-06-15T10:30:00Z',
            likes: 15420,
            reposts: 3240,
            comments: 892,
            views: 1250000,
            category: 'science',
            civilization: 'Terran Federation',
            verified: true,
            trending: true,
            engagement: 8.7
          },
          {
            id: 'post_2',
            author: 'Senator James Thompson',
            authorId: 'user_2',
            content: 'The new environmental protection bill has passed with overwhelming support! This will ensure sustainable development across all colonies. #EnvironmentalProtection #GalacticUnity',
            timestamp: '2393-06-15T09:15:00Z',
            likes: 8920,
            reposts: 1560,
            comments: 445,
            views: 680000,
            category: 'politics',
            civilization: 'Terran Federation',
            verified: true,
            trending: true,
            engagement: 7.2
          },
          {
            id: 'post_3',
            author: 'Quantum Tech Corp',
            authorId: 'user_3',
            content: 'Breaking: Our new AI governance framework has achieved 99.9% accuracy in ethical decision-making. Setting new standards for responsible AI development. #AI #Ethics #Innovation',
            timestamp: '2393-06-15T08:45:00Z',
            likes: 12340,
            reposts: 2890,
            comments: 678,
            views: 890000,
            category: 'technology',
            civilization: 'Terran Federation',
            verified: true,
            trending: false,
            engagement: 8.1
          },
          {
            id: 'post_4',
            author: 'Space Mining Weekly',
            authorId: 'user_4',
            content: 'Asteroid mining operations in the Belt have increased 300% this quarter! The economic impact on the entire galaxy is unprecedented. #SpaceMining #EconomicGrowth',
            timestamp: '2393-06-15T07:30:00Z',
            likes: 5670,
            reposts: 890,
            comments: 234,
            views: 420000,
            category: 'business',
            civilization: 'Terran Federation',
            verified: false,
            trending: false,
            engagement: 6.8
          },
          {
            id: 'post_5',
            author: 'Galactic Sports Network',
            authorId: 'user_5',
            content: 'The Interstellar Championship Finals are set! Terran Federation vs. Vega Alliance in what promises to be the most exciting match in galactic history. #GalacticSports #Championship',
            timestamp: '2393-06-15T06:15:00Z',
            likes: 23450,
            reposts: 5670,
            comments: 1234,
            views: 2100000,
            category: 'sports',
            civilization: 'Terran Federation',
            verified: true,
            trending: true,
            engagement: 9.2
          }
        ],
        trendingTopics: [
          {
            id: 'trend_1',
            hashtag: '#GalacticElections',
            category: 'politics',
            postCount: 2400000,
            engagement: 8900000,
            growth: 156,
            topPosts: [],
            relatedTopics: ['#VotingRights', '#Democracy', '#GalacticUnity'],
            sentiment: 'positive'
          },
          {
            id: 'trend_2',
            hashtag: '#SpaceExploration',
            category: 'science',
            postCount: 1800000,
            engagement: 6700000,
            growth: 89,
            topPosts: [],
            relatedTopics: ['#NewFrontiers', '#Discovery', '#Interstellar'],
            sentiment: 'positive'
          },
          {
            id: 'trend_3',
            hashtag: '#TradeWars',
            category: 'business',
            postCount: 1200000,
            engagement: 4500000,
            growth: 67,
            topPosts: [],
            relatedTopics: ['#EconomicImpact', '#Diplomacy', '#Markets'],
            sentiment: 'negative'
          },
          {
            id: 'trend_4',
            hashtag: '#QuantumBreakthrough',
            category: 'science',
            postCount: 890000,
            engagement: 3200000,
            growth: 234,
            topPosts: [],
            relatedTopics: ['#Innovation', '#Technology', '#Research'],
            sentiment: 'positive'
          },
          {
            id: 'trend_5',
            hashtag: '#AIEthics',
            category: 'technology',
            postCount: 670000,
            engagement: 2800000,
            growth: 145,
            topPosts: [],
            relatedTopics: ['#ResponsibleAI', '#Governance', '#Future'],
            sentiment: 'neutral'
          }
        ],
        analytics: {
          overview: {
            totalPosts: 15470000,
            activeUsers: 890000,
            totalEngagement: 456000000,
            averageEngagement: 7.8,
            trendingTopics: 25,
            verifiedAccounts: 12500
          },
          engagementTrends: [
            { date: 'Jun 10', posts: 1250000, likes: 8900000, reposts: 2340000, comments: 890000, views: 89000000 },
            { date: 'Jun 11', posts: 1320000, likes: 9200000, reposts: 2450000, comments: 920000, views: 92000000 },
            { date: 'Jun 12', posts: 1280000, likes: 8900000, reposts: 2380000, comments: 890000, views: 89000000 },
            { date: 'Jun 13', posts: 1350000, likes: 9500000, reposts: 2520000, comments: 950000, views: 95000000 },
            { date: 'Jun 14', posts: 1420000, likes: 9800000, reposts: 2680000, comments: 980000, views: 98000000 },
            { date: 'Jun 15', posts: 1480000, likes: 10200000, reposts: 2780000, comments: 1020000, views: 102000000 }
          ],
          categoryBreakdown: [
            { category: 'Science', posts: 3200000, engagement: 89000000, growth: 45, topHashtags: ['#QuantumBreakthrough', '#SpaceExploration', '#Research'] },
            { category: 'Politics', posts: 2800000, engagement: 78000000, growth: 67, topHashtags: ['#GalacticElections', '#Democracy', '#Unity'] },
            { category: 'Technology', posts: 2500000, engagement: 72000000, growth: 89, topHashtags: ['#AI', '#Innovation', '#Future'] },
            { category: 'Business', posts: 2200000, engagement: 65000000, growth: 34, topHashtags: ['#Trade', '#Economy', '#Growth'] },
            { category: 'Sports', posts: 1800000, engagement: 52000000, growth: 56, topHashtags: ['#GalacticSports', '#Championship', '#Competition'] },
            { category: 'Entertainment', posts: 1500000, engagement: 45000000, growth: 23, topHashtags: ['#GalacticMedia', '#Culture', '#Arts'] }
          ],
          civilizationActivity: [
            { civilization: 'Terran Federation', activeUsers: 450000, posts: 8900000, engagement: 234000000, influence: 95 },
            { civilization: 'Vega Alliance', activeUsers: 280000, posts: 5200000, engagement: 145000000, influence: 87 },
            { civilization: 'Centauri Republic', activeUsers: 120000, posts: 2300000, engagement: 67000000, influence: 78 },
            { civilization: 'Andromeda Empire', activeUsers: 40000, posts: 800000, engagement: 24000000, influence: 65 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWitterData();
  }, [fetchWitterData]);

  const renderFeed = () => (
    <>
      {/* Feed Filters - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📱 Social Media Feed</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <select 
            className="standard-select social-theme"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="science">🧬 Science</option>
            <option value="business">📊 Business</option>
            <option value="sports">⚽ Sports</option>
            <option value="politics">🌟 Politics</option>
            <option value="technology">🤖 Technology</option>
            <option value="entertainment">🎭 Entertainment</option>
          </select>
          <select 
            className="standard-select social-theme"
            value={filterCivilization}
            onChange={(e) => setFilterCivilization(e.target.value)}
          >
            <option value="all">All Civilizations</option>
            <option value="terran">🌍 Terran Federation</option>
            <option value="vega">⭐ Vega Alliance</option>
            <option value="centauri">🏛️ Centauri Republic</option>
            <option value="andromeda">🌌 Andromeda Empire</option>
          </select>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Post')}>✏️ New Post</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Refresh Feed')}>🔄 Refresh</button>
        </div>
      </div>

      {/* Embedded Witter Feed - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <div className="embedded-witter-feed">
            <SimpleWitterFeed 
              gameContext={gameContext}
              playerId="player-1"
              className="full-witter-feed"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderTrending = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Trending Topics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('View All Trends')}>👁️ View All</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Analyze Trends')}>📊 Analyze</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Hashtag</th>
                <th>Category</th>
                <th>Posts</th>
                <th>Engagement</th>
                <th>Growth</th>
                <th>Sentiment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {witterData?.trendingTopics.map((topic, index) => (
                <tr key={topic.id}>
                  <td>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: index < 3 ? '#f59e0b' : '#6b7280'
                    }}>
                      #{index + 1}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: '#10b981', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      {topic.hashtag}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(topic.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(topic.category) + '20'
                    }}>
                      {topic.category}
                    </span>
                  </td>
                  <td>{formatNumber(topic.postCount)}</td>
                  <td>{formatNumber(topic.engagement)}</td>
                  <td>
                    <span style={{ color: topic.growth > 100 ? '#10b981' : topic.growth > 50 ? '#f59e0b' : '#ef4444' }}>
                      +{topic.growth}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSentimentColor(topic.sentiment),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSentimentColor(topic.sentiment) + '20'
                    }}>
                      {topic.sentiment}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn social-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Social Media Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={witterData?.analytics.engagementTrends.map(trend => ({
                name: trend.date,
                'Posts': trend.posts / 1000000,
                'Likes': trend.likes / 1000000,
                'Reposts': trend.reposts / 1000000,
                'Comments': trend.comments / 1000000
              })) || []}
              title="Engagement Trends (Millions)"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={witterData?.analytics.categoryBreakdown.map(category => ({
                name: category.category,
                value: category.engagement
              })) || []}
              title="Engagement by Category"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Category Performance</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Posts</th>
                  <th>Engagement</th>
                  <th>Growth</th>
                  <th>Top Hashtags</th>
                </tr>
              </thead>
              <tbody>
                {witterData?.analytics.categoryBreakdown.map(category => (
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
                    <td>{formatNumber(category.posts)}</td>
                    <td>{formatNumber(category.engagement)}</td>
                    <td>
                      <span style={{ color: category.growth > 50 ? '#10b981' : category.growth > 25 ? '#f59e0b' : '#ef4444' }}>
                        +{category.growth}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {category.topHashtags.map(hashtag => (
                          <span key={hashtag} style={{ 
                            color: '#10b981',
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            padding: '0.125rem 0.25rem',
                            borderRadius: '0.25rem'
                          }}>
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagement = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>⚙️ Content Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Moderate Content')}>🛡️ Moderate</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Manage Users')}>👥 Users</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Content Policy')}>📋 Policy</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Content Moderation</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pending Review</td>
                    <td>1,234</td>
                    <td>
                      <button className="standard-btn social-theme">Review</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Flagged Content</td>
                    <td>567</td>
                    <td>
                      <button className="standard-btn social-theme">Investigate</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Removed Posts</td>
                    <td>89</td>
                    <td>
                      <button className="standard-btn social-theme">Appeal</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>User Management</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Suspended Users</td>
                    <td>45</td>
                    <td>
                      <button className="standard-btn social-theme">Review</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Verification Requests</td>
                    <td>234</td>
                    <td>
                      <button className="standard-btn social-theme">Process</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Reported Users</td>
                    <td>123</td>
                    <td>
                      <button className="standard-btn social-theme">Investigate</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🔍 Social Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Civilization Activity</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Civilization</th>
                    <th>Active Users</th>
                    <th>Posts</th>
                    <th>Influence</th>
                  </tr>
                </thead>
                <tbody>
                  {witterData?.analytics.civilizationActivity.map(civ => (
                    <tr key={civ.civilization}>
                      <td>{civ.civilization}</td>
                      <td>{formatNumber(civ.activeUsers)}</td>
                      <td>{formatNumber(civ.posts)}</td>
                      <td>
                        <span style={{ color: civ.influence >= 90 ? '#10b981' : civ.influence >= 80 ? '#f59e0b' : '#ef4444' }}>
                          {civ.influence}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Key Metrics</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Total Posts</span>
                <span className="standard-metric-value">{formatNumber(witterData?.analytics.overview.totalPosts || 0)}</span>
              </div>
              <div className="standard-metric">
                <span>Active Users</span>
                <span className="standard-metric-value">{formatNumber(witterData?.analytics.overview.activeUsers || 0)}</span>
              </div>
              <div className="standard-metric">
                <span>Total Engagement</span>
                <span className="standard-metric-value">{formatNumber(witterData?.analytics.overview.totalEngagement || 0)}</span>
              </div>
              <div className="standard-metric">
                <span>Avg Engagement</span>
                <span className="standard-metric-value">{witterData?.analytics.overview.averageEngagement || 0}</span>
              </div>
              <div className="standard-metric">
                <span>Trending Topics</span>
                <span className="standard-metric-value">{witterData?.analytics.overview.trendingTopics || 0}</span>
              </div>
              <div className="standard-metric">
                <span>Verified Accounts</span>
                <span className="standard-metric-value">{formatNumber(witterData?.analytics.overview.verifiedAccounts || 0)}</span>
              </div>
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
      onRefresh={fetchWitterData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        <div className="standard-dashboard">
          {!loading && !error && witterData ? (
            <>
              {activeTab === 'feed' && renderFeed()}
              {activeTab === 'trending' && renderTrending()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'management' && renderManagement()}
              {activeTab === 'insights' && renderInsights()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading social media data...' : 'No social media data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default WitterScreen;
