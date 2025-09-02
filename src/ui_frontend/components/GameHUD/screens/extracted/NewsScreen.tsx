/**
 * News Screen - Media Management and Information Distribution
 * 
 * This screen focuses on news and media operations including:
 * - News article management and publishing
 * - Media outlet oversight and regulation
 * - Information distribution and analytics
 * - Trending topics and public discourse
 * - Media credibility and bias monitoring
 * 
 * Theme: Social (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './NewsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  content: string;
  category: 'politics' | 'economy' | 'military' | 'science' | 'culture' | 'sports' | 'technology' | 'diplomacy';
  scope: 'local' | 'national' | 'civilization' | 'galactic';
  outlet: string;
  author: string;
  publishedAt: string;
  bias: 'left' | 'center' | 'right';
  credibility: number;
  readership: number;
  engagement: {
    views: number;
    shares: number;
    comments: number;
    reactions: { [key: string]: number };
  };
  tags: string[];
  relatedEvents: string[];
}

interface NewsOutlet {
  id: string;
  name: string;
  type: 'newspaper' | 'tv' | 'radio' | 'online' | 'magazine';
  bias: 'left' | 'center' | 'right';
  credibility: number;
  reach: number;
  audience: {
    size: number;
    demographics: {
      ageGroups: { [key: string]: number };
      regions: { [key: string]: number };
      interests: string[];
    };
  };
  specialties: string[];
  established: string;
  headquarters: string;
  motto: string;
  recentArticles: number;
  averageQuality: number;
}

interface NewsAnalytics {
  totalArticles: number;
  totalOutlets: number;
  averageCredibility: number;
  totalReadership: number;
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
  biasDistribution: Array<{ bias: string; count: number; percentage: number }>;
  scopeDistribution: Array<{ scope: string; count: number; percentage: number }>;
  topPerformingArticles: Array<{
    id: string;
    headline: string;
    views: number;
    engagement: number;
  }>;
  readershipTrends: Array<{
    date: string;
    views: number;
    engagement: number;
    articles: number;
  }>;
}

interface TrendingTopic {
  id: string;
  topic: string;
  category: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  trendScore: number;
  relatedArticles: number;
  keyPhrases: string[];
  timeframe: string;
  peakTime: string;
  geographicSpread: string[];
  influencers: Array<{
    name: string;
    outlet: string;
    influence: number;
  }>;
}

interface NewsData {
  articles: NewsArticle[];
  outlets: NewsOutlet[];
  analytics: NewsAnalytics;
  trending: TrendingTopic[];
}

const NewsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'outlets' | 'trending' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBias, setFilterBias] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'articles', label: 'Articles', icon: '📰' },
    { id: 'outlets', label: 'Outlets', icon: '📺' },
    { id: 'trending', label: 'Trending', icon: '📈' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/news/articles', description: 'Get news articles' },
    { method: 'GET', path: '/api/news/outlets', description: 'Get news outlets' },
    { method: 'GET', path: '/api/news/trending', description: 'Get trending topics' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'politics': return '#ef4444';
      case 'economy': return '#f59e0b';
      case 'military': return '#8b5cf6';
      case 'science': return '#3b82f6';
      case 'culture': return '#10b981';
      case 'sports': return '#f97316';
      case 'technology': return '#06b6d4';
      case 'diplomacy': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return '#3b82f6';
      case 'center': return '#10b981';
      case 'right': return '#ef4444';
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

  const getCredibilityColor = (credibility: number) => {
    if (credibility >= 80) return '#10b981';
    if (credibility >= 60) return '#f59e0b';
    if (credibility >= 40) return '#f97316';
    return '#ef4444';
  };

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/news/articles');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewsData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch news data:', err);
      // Use comprehensive mock data
      setNewsData({
        articles: [
          {
            id: 'article_1',
            headline: 'Terran Federation Announces New Space Exploration Initiative',
            summary: 'The government has unveiled plans for expanded interstellar exploration with increased funding and new technology partnerships.',
            content: 'In a landmark announcement today, the Terran Federation revealed its most ambitious space exploration program to date...',
            category: 'science',
            scope: 'civilization',
            outlet: 'Galaxy News Network',
            author: 'Dr. Sarah Chen',
            publishedAt: '2393-06-15T08:00:00Z',
            bias: 'center',
            credibility: 92,
            readership: 2500000,
            engagement: {
              views: 2500000,
              shares: 125000,
              comments: 45000,
              reactions: { 'like': 180000, 'love': 95000, 'insightful': 75000 }
            },
            tags: ['space exploration', 'government', 'technology', 'funding'],
            relatedEvents: ['space_initiative_2023', 'tech_partnerships']
          },
          {
            id: 'article_2',
            headline: 'Economic Growth Surges in Q2, Exceeding Expectations',
            summary: 'The latest economic data shows robust growth across all sectors, with technology and manufacturing leading the expansion.',
            content: 'Economic indicators released this morning reveal that the Terran Federation economy grew by 3.2% in the second quarter...',
            category: 'economy',
            scope: 'civilization',
            outlet: 'Economic Times',
            author: 'Marcus Rodriguez',
            publishedAt: '2393-06-15T07:30:00Z',
            bias: 'center',
            credibility: 88,
            readership: 1800000,
            engagement: {
              views: 1800000,
              shares: 95000,
              comments: 32000,
              reactions: { 'like': 125000, 'love': 65000, 'insightful': 45000 }
            },
            tags: ['economy', 'growth', 'Q2', 'manufacturing', 'technology'],
            relatedEvents: ['q2_economic_report', 'manufacturing_boom']
          },
          {
            id: 'article_3',
            headline: 'New AI Governance Framework Proposed by Senate Committee',
            summary: 'A bipartisan committee has introduced legislation to establish comprehensive AI oversight and ethical guidelines.',
            content: 'The Senate Committee on Technology and Ethics has proposed a groundbreaking framework for artificial intelligence governance...',
            category: 'politics',
            scope: 'national',
            outlet: 'Political Daily',
            author: 'Jennifer Williams',
            publishedAt: '2393-06-15T06:45:00Z',
            bias: 'left',
            credibility: 78,
            readership: 1200000,
            engagement: {
              views: 1200000,
              shares: 85000,
              comments: 28000,
              reactions: { 'like': 95000, 'love': 45000, 'insightful': 35000 }
            },
            tags: ['AI governance', 'legislation', 'ethics', 'technology policy'],
            relatedEvents: ['ai_governance_bill', 'senate_committee']
          }
        ],
        outlets: [
          {
            id: 'outlet_1',
            name: 'Galaxy News Network',
            type: 'tv',
            bias: 'center',
            credibility: 92,
            reach: 8500000,
            audience: {
              size: 8500000,
              demographics: {
                ageGroups: { '18-24': 15, '25-34': 25, '35-44': 20, '45-54': 18, '55+': 22 },
                regions: { 'North': 30, 'South': 25, 'East': 20, 'West': 25 },
                interests: ['news', 'politics', 'technology', 'science']
              }
            },
            specialties: ['breaking news', 'investigative journalism', 'international affairs'],
            established: '2180',
            headquarters: 'New York, Earth',
            motto: 'Truth Across the Stars',
            recentArticles: 45,
            averageQuality: 89
          },
          {
            id: 'outlet_2',
            name: 'Economic Times',
            type: 'newspaper',
            bias: 'center',
            credibility: 88,
            reach: 3200000,
            audience: {
              size: 3200000,
              demographics: {
                ageGroups: { '18-24': 8, '25-34': 22, '35-44': 35, '45-54': 25, '55+': 10 },
                regions: { 'North': 35, 'South': 20, 'East': 25, 'West': 20 },
                interests: ['business', 'finance', 'economics', 'markets']
              }
            },
            specialties: ['business news', 'financial analysis', 'market reports'],
            established: '2150',
            headquarters: 'London, Earth',
            motto: 'Financial Intelligence for the Future',
            recentArticles: 28,
            averageQuality: 85
          },
          {
            id: 'outlet_3',
            name: 'Political Daily',
            type: 'online',
            bias: 'left',
            credibility: 78,
            reach: 2100000,
            audience: {
              size: 2100000,
              demographics: {
                ageGroups: { '18-24': 20, '25-34': 35, '35-44': 25, '45-54': 15, '55+': 5 },
                regions: { 'North': 40, 'South': 15, 'East': 25, 'West': 20 },
                interests: ['politics', 'social issues', 'activism', 'policy']
              }
            },
            specialties: ['political analysis', 'policy coverage', 'social commentary'],
            established: '2200',
            headquarters: 'Washington DC, Earth',
            motto: 'Progressive Politics for Tomorrow',
            recentArticles: 32,
            averageQuality: 82
          }
        ],
        analytics: {
          totalArticles: 1250,
          totalOutlets: 45,
          averageCredibility: 84.5,
          totalReadership: 125000000,
          categoryDistribution: [
            { category: 'Politics', count: 280, percentage: 22.4 },
            { category: 'Economy', count: 225, percentage: 18.0 },
            { category: 'Technology', count: 200, percentage: 16.0 },
            { category: 'Science', count: 175, percentage: 14.0 },
            { category: 'Culture', count: 150, percentage: 12.0 },
            { category: 'Military', count: 125, percentage: 10.0 },
            { category: 'Sports', count: 75, percentage: 6.0 },
            { category: 'Diplomacy', count: 20, percentage: 1.6 }
          ],
          biasDistribution: [
            { bias: 'Center', count: 625, percentage: 50.0 },
            { bias: 'Left', count: 375, percentage: 30.0 },
            { bias: 'Right', count: 250, percentage: 20.0 }
          ],
          scopeDistribution: [
            { scope: 'National', count: 500, percentage: 40.0 },
            { scope: 'Civilization', count: 375, percentage: 30.0 },
            { scope: 'Local', count: 250, percentage: 20.0 },
            { scope: 'Galactic', count: 125, percentage: 10.0 }
          ],
          topPerformingArticles: [
            { id: 'article_1', headline: 'Terran Federation Announces New Space Exploration Initiative', views: 2500000, engagement: 345000 },
            { id: 'article_2', headline: 'Economic Growth Surges in Q2, Exceeding Expectations', views: 1800000, engagement: 202000 },
            { id: 'article_3', headline: 'New AI Governance Framework Proposed by Senate Committee', views: 1200000, engagement: 168000 }
          ],
          readershipTrends: [
            { date: 'Jun 10', views: 125000000, engagement: 16800000, articles: 1250 },
            { date: 'Jun 11', views: 128000000, engagement: 17200000, articles: 1275 },
            { date: 'Jun 12', views: 130000000, engagement: 17500000, articles: 1290 },
            { date: 'Jun 13', views: 132000000, engagement: 17800000, articles: 1305 },
            { date: 'Jun 14', views: 134000000, engagement: 18100000, articles: 1320 },
            { date: 'Jun 15', views: 136000000, engagement: 18400000, articles: 1335 }
          ]
        },
        trending: [
          {
            id: 'trend_1',
            topic: 'Space Exploration Initiative',
            category: 'science',
            mentions: 125000,
            sentiment: 'positive',
            trendScore: 9.2,
            relatedArticles: 45,
            keyPhrases: ['space exploration', 'government funding', 'technology partnerships'],
            timeframe: '24 hours',
            peakTime: '2393-06-15T10:00:00Z',
            geographicSpread: ['Earth', 'Mars', 'Luna'],
            influencers: [
              { name: 'Dr. Sarah Chen', outlet: 'Galaxy News Network', influence: 95 },
              { name: 'Prof. Michael Chang', outlet: 'Science Today', influence: 88 }
            ]
          },
          {
            id: 'trend_2',
            topic: 'Economic Growth Q2',
            category: 'economy',
            mentions: 98000,
            sentiment: 'positive',
            trendScore: 8.7,
            relatedArticles: 38,
            keyPhrases: ['economic growth', 'Q2 results', 'manufacturing boom'],
            timeframe: '24 hours',
            peakTime: '2393-06-15T09:30:00Z',
            geographicSpread: ['Earth', 'Mars Colonies', 'Orbital Stations'],
            influencers: [
              { name: 'Marcus Rodriguez', outlet: 'Economic Times', influence: 92 },
              { name: 'Dr. Elena Vasquez', outlet: 'Financial Review', influence: 85 }
            ]
          },
          {
            id: 'trend_3',
            topic: 'AI Governance Framework',
            category: 'politics',
            mentions: 75000,
            sentiment: 'neutral',
            trendScore: 7.8,
            relatedArticles: 32,
            keyPhrases: ['AI governance', 'legislation', 'ethics', 'regulation'],
            timeframe: '24 hours',
            peakTime: '2393-06-15T08:15:00Z',
            geographicSpread: ['Earth', 'Mars', 'Luna'],
            influencers: [
              { name: 'Jennifer Williams', outlet: 'Political Daily', influence: 78 },
              { name: 'Sen. Robert Kim', outlet: 'Government Watch', influence: 82 }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const renderOverview = () => (
    <>
      {/* News Overview - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📰 News & Media Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {formatNumber(newsData?.analytics.totalArticles || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Articles</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {formatNumber(newsData?.analytics.totalOutlets || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>News Outlets</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {formatNumber(newsData?.analytics.totalReadership || 0)}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Readership</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {newsData?.analytics.averageCredibility || 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Credibility</div>
          </div>
        </div>
      </div>

      {/* Top Stories - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🔥 Top Stories</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Headline</th>
                <th>Category</th>
                <th>Outlet</th>
                <th>Readership</th>
                <th>Credibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsData?.analytics.topPerformingArticles.map(article => {
                const fullArticle = newsData?.articles.find(a => a.id === article.id);
                return (
                  <tr key={article.id}>
                    <td>
                      <div style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{article.headline}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {fullArticle?.summary}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        color: getCategoryColor(fullArticle?.category || ''),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        backgroundColor: getCategoryColor(fullArticle?.category || '') + '20'
                      }}>
                        {fullArticle?.category}
                      </span>
                    </td>
                    <td>{fullArticle?.outlet}</td>
                    <td>{formatNumber(article.views)}</td>
                    <td>
                      <span style={{ 
                        color: getCredibilityColor(fullArticle?.credibility || 0),
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        backgroundColor: getCredibilityColor(fullArticle?.credibility || 0) + '20'
                      }}>
                        {fullArticle?.credibility}%
                      </span>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Read</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderArticles = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📰 News Articles</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Article')}>📰 New Article</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Review Articles')}>🔍 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Headline</th>
                <th>Category</th>
                <th>Outlet</th>
                <th>Bias</th>
                <th>Credibility</th>
                <th>Readership</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsData?.articles.map(article => (
                <tr key={article.id}>
                  <td>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{article.headline}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {article.summary}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(article.category),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCategoryColor(article.category) + '20'
                    }}>
                      {article.category}
                    </span>
                  </td>
                  <td>{article.outlet}</td>
                  <td>
                    <span style={{ 
                      color: getBiasColor(article.bias),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getBiasColor(article.bias) + '20'
                    }}>
                      {article.bias}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCredibilityColor(article.credibility),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCredibilityColor(article.credibility) + '20'
                    }}>
                      {article.credibility}%
                    </span>
                  </td>
                  <td>{formatNumber(article.readership)}</td>
                  <td>
                    <button className="standard-btn social-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOutlets = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📺 News Outlets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('New Outlet')}>📺 New Outlet</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Review Outlets')}>🔍 Review</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Outlet Name</th>
                <th>Type</th>
                <th>Bias</th>
                <th>Credibility</th>
                <th>Reach</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsData?.outlets.map(outlet => (
                <tr key={outlet.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{outlet.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {outlet.motto}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: '#374151',
                      color: '#f3f4f6'
                    }}>
                      {outlet.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getBiasColor(outlet.bias),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getBiasColor(outlet.bias) + '20'
                    }}>
                      {outlet.bias}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCredibilityColor(outlet.credibility),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getCredibilityColor(outlet.credibility) + '20'
                    }}>
                      {outlet.credibility}%
                    </span>
                  </td>
                  <td>{formatNumber(outlet.reach)}</td>
                  <td>
                    <button className="standard-btn social-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrending = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Trending Topics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Monitor Trends')}>📈 Monitor</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Analyze Sentiment')}>🔍 Analyze</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Category</th>
                <th>Mentions</th>
                <th>Sentiment</th>
                <th>Trend Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsData?.trending.map(topic => (
                <tr key={topic.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{topic.topic}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {topic.timeframe}
                      </div>
                    </div>
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
                  <td>{formatNumber(topic.mentions)}</td>
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
                    <span style={{ 
                      color: topic.trendScore >= 8 ? '#10b981' : topic.trendScore >= 6 ? '#f59e0b' : '#ef4444',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: (topic.trendScore >= 8 ? '#10b981' : topic.trendScore >= 6 ? '#f59e0b' : '#ef4444') + '20'
                    }}>
                      {topic.trendScore}/10
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn social-theme">Analyze</button>
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
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 News Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={newsData?.analytics.categoryDistribution.map(cat => ({
                name: cat.category,
                value: cat.count
              })) || []}
              title="Article Distribution by Category"
              size={250}
              showLegend={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={newsData?.analytics.biasDistribution.map(bias => ({
                name: bias.bias,
                value: bias.count
              })) || []}
              title="Article Distribution by Bias"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>Readership Trends</h4>
          <div className="chart-container">
            <LineChart
              data={newsData?.analytics.readershipTrends.map(trend => ({
                name: trend.date,
                'Total Views': trend.views,
                'Engagement': trend.engagement,
                'Articles Published': trend.articles
              })) || []}
              title="Daily Readership and Engagement Trends"
              height={300}
              width={800}
              showTooltip={true}
            />
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
      onRefresh={fetchNewsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        <div className="standard-dashboard">
          {!loading && !error && newsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'articles' && renderArticles()}
              {activeTab === 'outlets' && renderOutlets()}
              {activeTab === 'trending' && renderTrending()}
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
              {loading ? 'Loading news data...' : 'No news data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default NewsScreen;
