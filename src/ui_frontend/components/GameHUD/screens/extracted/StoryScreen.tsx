/**
 * Story Screen - Narrative Content and Story Management
 * 
 * This screen focuses on story and narrative operations including:
 * - Story creation and management
 * - Content publishing and distribution
 * - Story analytics and performance
 * - Content moderation and curation
 * - Audience engagement and feedback
 * 
 * Theme: Social (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './StoryScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Story {
  id: string;
  title: string;
  author: string;
  authorId: string;
  content: string;
  summary: string;
  category: 'news' | 'fiction' | 'history' | 'science' | 'politics' | 'culture';
  civilization: string;
  publishDate: string;
  lastUpdated: string;
  status: 'draft' | 'published' | 'archived' | 'featured';
  views: number;
  likes: number;
  shares: number;
  comments: number;
  readingTime: number;
  tags: string[];
  featured: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface StoryAnalytics {
  overview: {
    totalStories: number;
    publishedStories: number;
    totalViews: number;
    totalEngagement: number;
    averageReadingTime: number;
    topPerformingStory: string;
  };
  performanceTrends: Array<{
    date: string;
    storiesPublished: number;
    totalViews: number;
    totalEngagement: number;
    averageViews: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    stories: number;
    views: number;
    engagement: number;
    averageReadingTime: number;
  }>;
  audienceInsights: Array<{
    civilization: string;
    readers: number;
    favoriteCategory: string;
    engagementRate: number;
    readingHabits: string;
  }>;
}

interface StoryData {
  stories: Story[];
  analytics: StoryAnalytics;
}

const StoryScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'publishing' | 'analytics' | 'insights'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'stories', label: 'Stories', icon: '📖' },
    { id: 'publishing', label: 'Publishing', icon: '✏️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'insights', label: 'Insights', icon: '🔍' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/stories', description: 'Get stories' },
    { method: 'POST', path: '/api/stories', description: 'Create new story' },
    { method: 'PUT', path: '/api/stories/:id', description: 'Update story' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return '#ef4444';
      case 'fiction': return '#8b5cf6';
      case 'history': return '#f59e0b';
      case 'science': return '#10b981';
      case 'politics': return '#3b82f6';
      case 'culture': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'published': return '#10b981';
      case 'archived': return '#f59e0b';
      case 'featured': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchStoryData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/stories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStoryData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch story data:', err);
      // Use comprehensive mock data
      setStoryData({
        stories: [
          {
            id: 'story_1',
            title: 'The Quantum Revolution: How AI is Transforming Galactic Governance',
            author: 'Dr. Elena Petrova',
            authorId: 'author_1',
            content: 'In the vast expanse of the galaxy, artificial intelligence has emerged as the defining technology of our era. From automated governance systems to predictive policy analysis, AI is reshaping how civilizations interact and make decisions...',
            summary: 'An exploration of AI governance systems and their impact on interstellar politics and decision-making.',
            category: 'science',
            civilization: 'Terran Federation',
            publishDate: '2393-06-15T08:00:00Z',
            lastUpdated: '2393-06-15T08:00:00Z',
            status: 'published',
            views: 1250000,
            likes: 45600,
            shares: 12300,
            comments: 8900,
            readingTime: 8,
            tags: ['AI', 'Governance', 'Technology', 'Politics'],
            featured: true,
            priority: 'high'
          },
          {
            id: 'story_2',
            title: 'The Great Trade War: Economic Tensions Between Star Systems',
            author: 'Senator James Thompson',
            authorId: 'author_2',
            content: 'As the galaxy expands and new colonies emerge, economic tensions between star systems have reached unprecedented levels. Trade disputes, resource competition, and market manipulation threaten the fragile peace...',
            summary: 'Analysis of economic tensions and trade disputes affecting galactic stability and prosperity.',
            category: 'politics',
            civilization: 'Terran Federation',
            publishDate: '2393-06-14T10:30:00Z',
            lastUpdated: '2393-06-14T10:30:00Z',
            status: 'published',
            views: 890000,
            likes: 23400,
            shares: 6700,
            comments: 4500,
            readingTime: 6,
            tags: ['Trade', 'Economy', 'Politics', 'Diplomacy'],
            featured: false,
            priority: 'medium'
          },
          {
            id: 'story_3',
            title: 'Lost in the Void: The Mystery of the Disappearing Colonies',
            author: 'Captain Sarah Chen',
            authorId: 'author_3',
            content: 'Deep in the unexplored regions of the galaxy, entire colonies have vanished without a trace. No distress signals, no debris, no explanation. As exploration teams investigate these disappearances...',
            summary: 'A thrilling investigation into the mysterious disappearances of remote galactic colonies.',
            category: 'fiction',
            civilization: 'Terran Federation',
            publishDate: '2393-06-13T14:15:00Z',
            lastUpdated: '2393-06-13T14:15:00Z',
            status: 'published',
            views: 2100000,
            likes: 78900,
            shares: 23400,
            comments: 15600,
            readingTime: 12,
            tags: ['Mystery', 'Exploration', 'Colonies', 'Adventure'],
            featured: true,
            priority: 'high'
          },
          {
            id: 'story_4',
            title: 'Ancient Artifacts: Uncovering the Secrets of Pre-Space Civilizations',
            author: 'Dr. Marcus Rodriguez',
            authorId: 'author_4',
            content: 'Archaeological discoveries across multiple star systems suggest that advanced civilizations existed long before humanity reached the stars. These ancient artifacts contain technology and knowledge...',
            summary: 'Archaeological findings reveal evidence of advanced pre-space civilizations and their mysterious technology.',
            category: 'history',
            civilization: 'Terran Federation',
            publishDate: '2393-06-12T09:45:00Z',
            lastUpdated: '2393-06-12T09:45:00Z',
            status: 'published',
            views: 670000,
            likes: 18900,
            shares: 4500,
            comments: 3200,
            readingTime: 10,
            tags: ['Archaeology', 'Ancient Civilizations', 'Technology', 'Discovery'],
            featured: false,
            priority: 'medium'
          },
          {
            id: 'story_5',
            title: 'Cultural Fusion: How Different Civilizations Shape Galactic Society',
            author: 'Cultural Anthropologist Lisa Park',
            authorId: 'author_5',
            content: 'As the galaxy becomes more interconnected, cultural exchange between civilizations has created a rich tapestry of traditions, beliefs, and artistic expressions. This cultural fusion...',
            summary: 'Exploration of cultural exchange and fusion between different galactic civilizations.',
            category: 'culture',
            civilization: 'Terran Federation',
            publishDate: '2393-06-11T16:20:00Z',
            lastUpdated: '2393-06-11T16:20:00Z',
            status: 'published',
            views: 450000,
            likes: 12300,
            shares: 3200,
            comments: 2100,
            readingTime: 7,
            tags: ['Culture', 'Anthropology', 'Society', 'Diversity'],
            featured: false,
            priority: 'low'
          }
        ],
        analytics: {
          overview: {
            totalStories: 1547,
            publishedStories: 1234,
            totalViews: 45600000,
            totalEngagement: 2340000,
            averageReadingTime: 8.5,
            topPerformingStory: 'The Quantum Revolution: How AI is Transforming Galactic Governance'
          },
          performanceTrends: [
            { date: 'Jun 10', storiesPublished: 12, totalViews: 890000, totalEngagement: 45600, averageViews: 74167 },
            { date: 'Jun 11', storiesPublished: 15, totalViews: 920000, totalEngagement: 47800, averageViews: 61333 },
            { date: 'Jun 12', storiesPublished: 18, totalViews: 950000, totalEngagement: 51200, averageViews: 52778 },
            { date: 'Jun 13', storiesPublished: 14, totalViews: 980000, totalEngagement: 53400, averageViews: 70000 },
            { date: 'Jun 14', storiesPublished: 16, totalViews: 1020000, totalEngagement: 56700, averageViews: 63750 },
            { date: 'Jun 15', storiesPublished: 13, totalViews: 1050000, totalEngagement: 58900, averageViews: 80769 }
          ],
          categoryBreakdown: [
            { category: 'News', stories: 456, views: 18900000, engagement: 890000, averageReadingTime: 5.2 },
            { category: 'Science', stories: 234, views: 12300000, engagement: 567000, averageReadingTime: 8.7 },
            { category: 'Politics', stories: 189, views: 8900000, engagement: 456000, averageReadingTime: 6.8 },
            { category: 'Fiction', stories: 345, views: 15600000, engagement: 789000, averageReadingTime: 12.3 },
            { category: 'History', stories: 167, views: 6700000, engagement: 234000, averageReadingTime: 9.1 },
            { category: 'Culture', stories: 156, views: 4500000, engagement: 189000, averageReadingTime: 7.4 }
          ],
          audienceInsights: [
            { civilization: 'Terran Federation', readers: 890000, favoriteCategory: 'Science', engagementRate: 8.7, readingHabits: 'Evening readers' },
            { civilization: 'Vega Alliance', readers: 567000, favoriteCategory: 'Politics', engagementRate: 7.2, readingHabits: 'Morning readers' },
            { civilization: 'Centauri Republic', readers: 234000, favoriteCategory: 'History', engagementRate: 6.8, readingHabits: 'Weekend readers' },
            { civilization: 'Andromeda Empire', readers: 123000, favoriteCategory: 'Culture', engagementRate: 5.9, readingHabits: 'Lunch break readers' }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoryData();
  }, [fetchStoryData]);

  const renderOverview = () => (
    <>
      {/* Stories Overview - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Stories Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Stories</span>
            <span className="standard-metric-value">{storyData?.analytics.overview.totalStories}</span>
          </div>
          <div className="standard-metric">
            <span>Published Stories</span>
            <span className="standard-metric-value">{storyData?.analytics.overview.publishedStories}</span>
          </div>
          <div className="standard-metric">
            <span>Total Views</span>
            <span className="standard-metric-value">{formatNumber(storyData?.analytics.overview.totalViews || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Engagement</span>
            <span className="standard-metric-value">{formatNumber(storyData?.analytics.overview.totalEngagement || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Avg Reading Time</span>
            <span className="standard-metric-value">{storyData?.analytics.overview.averageReadingTime} min</span>
          </div>
          <div className="standard-metric">
            <span>Top Story</span>
            <span className="standard-metric-value">AI Governance</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Story')}>✏️ New Story</button>
          <button className="standard-btn social-theme" onClick={() => console.log('View All Stories')}>📖 View All</button>
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
                <th>Stories</th>
                <th>Views</th>
                <th>Engagement</th>
                <th>Avg Reading Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storyData?.analytics.categoryBreakdown.map(category => (
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
                  <td>{category.stories}</td>
                  <td>{formatNumber(category.views)}</td>
                  <td>{formatNumber(category.engagement)}</td>
                  <td>{category.averageReadingTime} min</td>
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

  const renderStories = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📖 Story Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Story')}>✏️ New Story</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Filter Stories')}>🔍 Filter</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Engagement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storyData?.stories.map(story => (
                <tr key={story.id}>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{story.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{story.summary}</div>
                    </div>
                  </td>
                  <td>{story.author}</td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(story.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(story.category) + '20'
                    }}>
                      {story.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(story.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(story.status) + '20'
                    }}>
                      {story.status}
                    </span>
                  </td>
                  <td>{formatNumber(story.views)}</td>
                  <td>
                    <span style={{ color: story.engagement >= 10000 ? '#10b981' : story.engagement >= 5000 ? '#f59e0b' : '#ef4444' }}>
                      {formatNumber(story.likes + story.shares + story.comments)}
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

  const renderPublishing = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>✏️ Publishing & Content Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Create Story')}>📝 Create Story</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Review Drafts')}>📋 Review Drafts</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Content Calendar')}>📅 Calendar</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Content Status</h4>
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
                    <td>Drafts</td>
                    <td>23</td>
                    <td>
                      <button className="standard-btn social-theme">Review</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Pending Review</td>
                    <td>12</td>
                    <td>
                      <button className="standard-btn social-theme">Approve</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Scheduled</td>
                    <td>8</td>
                    <td>
                      <button className="standard-btn social-theme">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Archived</td>
                    <td>156</td>
                    <td>
                      <button className="standard-btn social-theme">Restore</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Publishing Metrics</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Stories This Week</span>
                <span className="standard-metric-value">15</span>
              </div>
              <div className="standard-metric">
                <span>Avg Publish Time</span>
                <span className="standard-metric-value">2.3 days</span>
              </div>
              <div className="standard-metric">
                <span>Editorial Queue</span>
                <span className="standard-metric-value">8</span>
              </div>
              <div className="standard-metric">
                <span>Quality Score</span>
                <span className="standard-metric-value">8.7/10</span>
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
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Story Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={storyData?.analytics.performanceTrends.map(trend => ({
                name: trend.date,
                'Stories Published': trend.storiesPublished,
                'Total Views': trend.totalViews / 1000000,
                'Total Engagement': trend.totalEngagement / 1000,
                'Average Views': trend.averageViews / 1000
              })) || []}
              title="Publishing Performance Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={storyData?.analytics.categoryBreakdown.map(category => ({
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
                  <td>Reading Time</td>
                  <td style={{ color: '#10b981' }}>8.5 min</td>
                  <td>8.0 min</td>
                  <td style={{ color: '#10b981' }}>✅ Exceeding</td>
                </tr>
                <tr>
                  <td>Story Completion</td>
                  <td style={{ color: '#f59e0b' }}>72%</td>
                  <td>75%</td>
                  <td style={{ color: '#ef4444' }}>↘️ Declining</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🔍 Audience Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Civilization Reading Patterns</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Civilization</th>
                    <th>Readers</th>
                    <th>Favorite Category</th>
                    <th>Engagement Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {storyData?.analytics.audienceInsights.map(insight => (
                    <tr key={insight.civilization}>
                      <td>{insight.civilization}</td>
                      <td>{formatNumber(insight.readers)}</td>
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
                      <td>
                        <span style={{ color: insight.engagementRate >= 8 ? '#10b981' : insight.engagementRate >= 6 ? '#f59e0b' : '#ef4444' }}>
                          {insight.engagementRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Content Strategy Insights</h4>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '0.5rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <h5 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Key Findings:</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#10b981' }}>
                <li>Science content has highest engagement (8.7%)</li>
                <li>Fiction stories have longest reading time (12.3 min)</li>
                <li>News content drives daily traffic</li>
                <li>Cultural stories have niche but loyal audience</li>
                <li>Politics content peaks during election cycles</li>
              </ul>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h5 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Recommendations:</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#10b981' }}>
                <li>Increase science content production</li>
                <li>Develop serial fiction series</li>
                <li>Optimize news publishing schedule</li>
                <li>Expand cultural coverage</li>
                <li>Plan political content calendar</li>
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
      onRefresh={fetchStoryData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        <div className="standard-dashboard">
          {!loading && !error && storyData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'stories' && renderStories()}
              {activeTab === 'publishing' && renderPublishing()}
              {activeTab === 'analytics' && renderAnalytics()}
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
              {loading ? 'Loading story data...' : 'No story data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default StoryScreen;
