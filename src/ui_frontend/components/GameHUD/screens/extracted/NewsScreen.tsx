import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './NewsScreen.css';

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

const NewsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [activeTab, setActiveTab] = useState<'generation' | 'outlets' | 'analytics' | 'trending'>('generation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation form state
  const [generationForm, setGenerationForm] = useState({
    campaignId: 1,
    tickId: 1,
    maxArticles: 5,
    scopes: ['national', 'civilization', 'galactic'],
    categories: ['politics', 'economy', 'military', 'science']
  });

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/news/articles', description: 'Get news articles' },
    { method: 'GET', path: '/api/news/outlets', description: 'Get news outlets' },
    { method: 'GET', path: '/api/news/analytics', description: 'Get news analytics' },
    { method: 'GET', path: '/api/news/trending', description: 'Get trending topics' },
    { method: 'POST', path: '/api/news/generate', description: 'Generate news articles' },
    { method: 'POST', path: '/api/news/outlet', description: 'Create news outlet' },
    { method: 'PUT', path: '/api/news/article/:id', description: 'Update news article' },
    { method: 'DELETE', path: '/api/news/article/:id', description: 'Delete news article' }
  ];

  const fetchNewsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        articlesRes,
        outletsRes,
        analyticsRes,
        trendingRes
      ] = await Promise.all([
        fetch('/api/news/articles'),
        fetch('/api/news/outlets'),
        fetch('/api/news/analytics'),
        fetch('/api/news/trending')
      ]);

      const [
        articles,
        outlets,
        analytics,
        trending
      ] = await Promise.all([
        articlesRes.json(),
        outletsRes.json(),
        analyticsRes.json(),
        trendingRes.json()
      ]);

      setNewsData({
        articles: articles.articles || generateMockArticles(),
        outlets: outlets.outlets || generateMockOutlets(),
        analytics: analytics.analytics || generateMockAnalytics(),
        trending: trending.trending || generateMockTrending()
      });
    } catch (err) {
      console.error('Failed to fetch news data:', err);
      // Use mock data as fallback
      setNewsData({
        articles: generateMockArticles(),
        outlets: generateMockOutlets(),
        analytics: generateMockAnalytics(),
        trending: generateMockTrending()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const generateMockArticles = (): NewsArticle[] => [
    {
      id: 'article-1',
      headline: 'Diplomatic Breakthrough: Zentaurian Trade Agreement Signed',
      summary: 'Historic trade agreement opens new economic opportunities between human and Zentaurian civilizations',
      content: 'In a landmark ceremony today, representatives from Earth and Zentauri Prime signed a comprehensive trade agreement...',
      category: 'diplomacy',
      scope: 'galactic',
      outlet: 'Galactic Herald',
      author: 'Sarah Chen',
      publishedAt: '2024-02-20T14:30:00Z',
      bias: 'center',
      credibility: 92,
      readership: 2500000,
      engagement: {
        views: 2500000,
        shares: 45000,
        comments: 12000,
        reactions: { like: 89000, love: 23000, wow: 15000, angry: 3000 }
      },
      tags: ['diplomacy', 'trade', 'zentaurians', 'economy'],
      relatedEvents: ['trade-summit-2024', 'zentaurian-delegation-visit']
    },
    {
      id: 'article-2',
      headline: 'New Terra Defense Grid Upgrade Complete',
      summary: 'Advanced defense systems now protect the capital from potential threats',
      content: 'The New Terra planetary defense grid has received a major upgrade, featuring quantum-enhanced shield generators...',
      category: 'military',
      scope: 'national',
      outlet: 'Defense Weekly',
      author: 'Admiral Marcus Webb',
      publishedAt: '2024-02-20T10:15:00Z',
      bias: 'right',
      credibility: 88,
      readership: 1800000,
      engagement: {
        views: 1800000,
        shares: 32000,
        comments: 8500,
        reactions: { like: 67000, love: 12000, wow: 28000, angry: 1500 }
      },
      tags: ['defense', 'military', 'new-terra', 'technology'],
      relatedEvents: ['defense-budget-approval', 'quantum-tech-breakthrough']
    },
    {
      id: 'article-3',
      headline: 'Breakthrough in Quantum Computing Research',
      summary: 'Scientists achieve 99.9% quantum coherence in new processor design',
      content: 'Researchers at the Kepler Research Institute have announced a major breakthrough in quantum computing...',
      category: 'science',
      scope: 'civilization',
      outlet: 'Science Today',
      author: 'Dr. Elena Rodriguez',
      publishedAt: '2024-02-19T16:45:00Z',
      bias: 'center',
      credibility: 95,
      readership: 1200000,
      engagement: {
        views: 1200000,
        shares: 28000,
        comments: 5500,
        reactions: { like: 45000, love: 18000, wow: 35000, angry: 500 }
      },
      tags: ['science', 'quantum-computing', 'research', 'technology'],
      relatedEvents: ['kepler-research-funding', 'quantum-symposium-2024']
    }
  ];

  const generateMockOutlets = (): NewsOutlet[] => [
    {
      id: 'outlet-1',
      name: 'Galactic Herald',
      type: 'newspaper',
      bias: 'center',
      credibility: 92,
      reach: 85,
      audience: {
        size: 15000000,
        demographics: {
          ageGroups: { '18-24': 15, '25-34': 28, '35-44': 25, '45-54': 20, '55+': 12 },
          regions: { 'Core Worlds': 45, 'Outer Rim': 30, 'Frontier': 25 },
          interests: ['politics', 'diplomacy', 'economy', 'science']
        }
      },
      specialties: ['Galactic Politics', 'Interspecies Relations', 'Trade Policy'],
      established: '2387',
      headquarters: 'New Terra',
      motto: 'Truth Across the Galaxy',
      recentArticles: 156,
      averageQuality: 8.7
    },
    {
      id: 'outlet-2',
      name: 'Defense Weekly',
      type: 'magazine',
      bias: 'right',
      credibility: 88,
      reach: 65,
      audience: {
        size: 8500000,
        demographics: {
          ageGroups: { '18-24': 8, '25-34': 22, '35-44': 35, '45-54': 25, '55+': 10 },
          regions: { 'Core Worlds': 60, 'Outer Rim': 25, 'Frontier': 15 },
          interests: ['military', 'defense', 'technology', 'security']
        }
      },
      specialties: ['Military Analysis', 'Defense Technology', 'Strategic Planning'],
      established: '2395',
      headquarters: 'Mars Command',
      motto: 'Strength Through Knowledge',
      recentArticles: 89,
      averageQuality: 8.2
    },
    {
      id: 'outlet-3',
      name: 'Science Today',
      type: 'online',
      bias: 'center',
      credibility: 95,
      reach: 70,
      audience: {
        size: 12000000,
        demographics: {
          ageGroups: { '18-24': 25, '25-34': 35, '35-44': 22, '45-54': 15, '55+': 3 },
          regions: { 'Core Worlds': 40, 'Outer Rim': 35, 'Frontier': 25 },
          interests: ['science', 'technology', 'research', 'innovation']
        }
      },
      specialties: ['Scientific Research', 'Technology Innovation', 'Space Exploration'],
      established: '2401',
      headquarters: 'Kepler Station',
      motto: 'Advancing Human Knowledge',
      recentArticles: 234,
      averageQuality: 9.1
    }
  ];

  const generateMockAnalytics = (): NewsAnalytics => ({
    totalArticles: 1247,
    totalOutlets: 89,
    averageCredibility: 87.3,
    totalReadership: 45000000,
    categoryDistribution: [
      { category: 'Politics', count: 342, percentage: 27.4 },
      { category: 'Economy', count: 298, percentage: 23.9 },
      { category: 'Science', count: 187, percentage: 15.0 },
      { category: 'Military', count: 156, percentage: 12.5 },
      { category: 'Diplomacy', count: 134, percentage: 10.7 },
      { category: 'Culture', count: 89, percentage: 7.1 },
      { category: 'Sports', count: 41, percentage: 3.3 }
    ],
    biasDistribution: [
      { bias: 'Center', count: 623, percentage: 50.0 },
      { bias: 'Right', count: 374, percentage: 30.0 },
      { bias: 'Left', count: 250, percentage: 20.0 }
    ],
    scopeDistribution: [
      { scope: 'National', count: 498, percentage: 39.9 },
      { scope: 'Civilization', count: 374, percentage: 30.0 },
      { scope: 'Galactic', count: 249, percentage: 20.0 },
      { scope: 'Local', count: 126, percentage: 10.1 }
    ],
    topPerformingArticles: [
      { id: 'article-1', headline: 'Diplomatic Breakthrough: Zentaurian Trade Agreement', views: 2500000, engagement: 89.2 },
      { id: 'article-2', headline: 'New Terra Defense Grid Upgrade Complete', views: 1800000, engagement: 76.8 },
      { id: 'article-3', headline: 'Breakthrough in Quantum Computing Research', views: 1200000, engagement: 82.1 }
    ],
    readershipTrends: [
      { date: '2024-02-20', views: 4200000, engagement: 78.5, articles: 45 },
      { date: '2024-02-19', views: 3800000, engagement: 81.2, articles: 42 },
      { date: '2024-02-18', views: 4100000, engagement: 75.9, articles: 48 },
      { date: '2024-02-17', views: 3600000, engagement: 79.3, articles: 39 },
      { date: '2024-02-16', views: 3900000, engagement: 77.8, articles: 44 }
    ]
  });

  const generateMockTrending = (): TrendingTopic[] => [
    {
      id: 'trend-1',
      topic: 'Zentaurian Trade Agreement',
      category: 'Diplomacy',
      mentions: 15420,
      sentiment: 'positive',
      trendScore: 94.2,
      relatedArticles: 67,
      keyPhrases: ['trade agreement', 'economic cooperation', 'diplomatic breakthrough', 'interspecies commerce'],
      timeframe: 'Last 24 hours',
      peakTime: '2024-02-20T15:30:00Z',
      geographicSpread: ['Core Worlds', 'Outer Rim', 'Zentauri System'],
      influencers: [
        { name: 'Ambassador Chen', outlet: 'Galactic Herald', influence: 92 },
        { name: 'Trade Analyst Kim', outlet: 'Economic Review', influence: 87 },
        { name: 'Dr. Vorthak', outlet: 'Zentaurian Times', influence: 89 }
      ]
    },
    {
      id: 'trend-2',
      topic: 'Quantum Computing Breakthrough',
      category: 'Science',
      mentions: 8930,
      sentiment: 'positive',
      trendScore: 87.6,
      relatedArticles: 34,
      keyPhrases: ['quantum coherence', 'computing breakthrough', 'research milestone', 'technology advancement'],
      timeframe: 'Last 48 hours',
      peakTime: '2024-02-19T18:15:00Z',
      geographicSpread: ['Kepler Station', 'Research Colonies', 'Academic Centers'],
      influencers: [
        { name: 'Dr. Elena Rodriguez', outlet: 'Science Today', influence: 95 },
        { name: 'Prof. Zhang', outlet: 'Tech Weekly', influence: 83 },
        { name: 'Research Director Adams', outlet: 'Innovation Daily', influence: 78 }
      ]
    },
    {
      id: 'trend-3',
      topic: 'Defense Grid Modernization',
      category: 'Military',
      mentions: 6750,
      sentiment: 'neutral',
      trendScore: 72.3,
      relatedArticles: 28,
      keyPhrases: ['defense upgrade', 'security enhancement', 'military technology', 'planetary protection'],
      timeframe: 'Last 72 hours',
      peakTime: '2024-02-20T11:00:00Z',
      geographicSpread: ['New Terra', 'Military Bases', 'Defense Contractors'],
      influencers: [
        { name: 'Admiral Webb', outlet: 'Defense Weekly', influence: 88 },
        { name: 'Security Analyst Torres', outlet: 'Military Review', influence: 81 },
        { name: 'Defense Correspondent Lee', outlet: 'Strategic Times', influence: 75 }
      ]
    }
  ];

  const formatNumber = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getBiasColor = (bias: string): string => {
    switch (bias) {
      case 'left': return '#3b82f6';
      case 'center': return '#10b981';
      case 'right': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'neutral': return '#f59e0b';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      politics: '#8b5cf6',
      economy: '#f59e0b',
      military: '#ef4444',
      science: '#06b6d4',
      diplomacy: '#10b981',
      culture: '#ec4899',
      sports: '#84cc16',
      technology: '#6366f1'
    };
    return colors[category.toLowerCase()] || '#6b7280';
  };

  const handleGenerateNews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchNewsData();
    } catch (err) {
      setError('Failed to generate news articles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchNewsData}
    >
      <div className="news-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'generation' ? 'active' : ''}`}
            onClick={() => setActiveTab('generation')}
          >
            📰 Generation
          </button>
          <button 
            className={`tab ${activeTab === 'outlets' ? 'active' : ''}`}
            onClick={() => setActiveTab('outlets')}
          >
            📺 Outlets
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            📈 Trending
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading news data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && newsData && (
            <>
              {activeTab === 'generation' && (
                <div className="generation-tab">
                  <div className="generation-form">
                    <h4>📰 Generate News Articles</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Campaign ID</label>
                        <input 
                          type="number" 
                          value={generationForm.campaignId}
                          onChange={(e) => setGenerationForm({...generationForm, campaignId: parseInt(e.target.value)})}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Tick ID</label>
                        <input 
                          type="number" 
                          value={generationForm.tickId}
                          onChange={(e) => setGenerationForm({...generationForm, tickId: parseInt(e.target.value)})}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Max Articles</label>
                        <input 
                          type="number" 
                          value={generationForm.maxArticles}
                          onChange={(e) => setGenerationForm({...generationForm, maxArticles: parseInt(e.target.value)})}
                          className="form-control"
                          min="1"
                          max="20"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>News Scopes</label>
                      <div className="checkbox-group">
                        {['local', 'national', 'civilization', 'galactic'].map(scope => (
                          <label key={scope} className="checkbox-item">
                            <input 
                              type="checkbox" 
                              checked={generationForm.scopes.includes(scope)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setGenerationForm({...generationForm, scopes: [...generationForm.scopes, scope]});
                                } else {
                                  setGenerationForm({...generationForm, scopes: generationForm.scopes.filter(s => s !== scope)});
                                }
                              }}
                            />
                            <span className="checkbox-label">{scope.charAt(0).toUpperCase() + scope.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>News Categories</label>
                      <div className="checkbox-group">
                        {['politics', 'economy', 'military', 'science', 'culture', 'sports', 'technology', 'diplomacy'].map(category => (
                          <label key={category} className="checkbox-item">
                            <input 
                              type="checkbox" 
                              checked={generationForm.categories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setGenerationForm({...generationForm, categories: [...generationForm.categories, category]});
                                } else {
                                  setGenerationForm({...generationForm, categories: generationForm.categories.filter(c => c !== category)});
                                }
                              }}
                            />
                            <span className="checkbox-label">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="recent-articles">
                    <h4>Recent Articles</h4>
                    <div className="articles-grid">
                      {newsData.articles.map((article) => (
                        <div key={article.id} className="article-item">
                          <div className="article-header">
                            <div className="article-headline">{article.headline}</div>
                            <div className="article-meta">
                              <span className="article-outlet">{article.outlet}</span>
                              <span className="article-date">{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="article-summary">{article.summary}</div>
                          <div className="article-tags">
                            <span className="article-category" style={{ backgroundColor: getCategoryColor(article.category) }}>
                              {article.category}
                            </span>
                            <span className="article-scope">{article.scope}</span>
                            <span className="article-bias" style={{ color: getBiasColor(article.bias) }}>
                              {article.bias}
                            </span>
                          </div>
                          <div className="article-engagement">
                            <div className="engagement-item">
                              <span className="engagement-icon">👁️</span>
                              <span className="engagement-value">{formatNumber(article.engagement.views)}</span>
                            </div>
                            <div className="engagement-item">
                              <span className="engagement-icon">📤</span>
                              <span className="engagement-value">{formatNumber(article.engagement.shares)}</span>
                            </div>
                            <div className="engagement-item">
                              <span className="engagement-icon">💬</span>
                              <span className="engagement-value">{formatNumber(article.engagement.comments)}</span>
                            </div>
                            <div className="engagement-item">
                              <span className="engagement-icon">⭐</span>
                              <span className="engagement-value">{article.credibility}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn" onClick={handleGenerateNews}>Generate Articles</button>
                    <button className="action-btn secondary">Preview Articles</button>
                    <button className="action-btn">Publish Queue</button>
                  </div>
                </div>
              )}

              {activeTab === 'outlets' && (
                <div className="outlets-tab">
                  <div className="outlets-grid">
                    {newsData.outlets.map((outlet) => (
                      <div key={outlet.id} className="outlet-item">
                        <div className="outlet-header">
                          <div className="outlet-name">{outlet.name}</div>
                          <div className="outlet-type">{outlet.type.toUpperCase()}</div>
                        </div>
                        <div className="outlet-details">
                          <div className="outlet-established">Est. {outlet.established}</div>
                          <div className="outlet-headquarters">📍 {outlet.headquarters}</div>
                          <div className="outlet-motto">"{outlet.motto}"</div>
                        </div>
                        <div className="outlet-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Credibility</span>
                            <span className="metric-value">{outlet.credibility}%</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Reach</span>
                            <span className="metric-value">{outlet.reach}%</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Audience</span>
                            <span className="metric-value">{formatNumber(outlet.audience.size)}</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Quality</span>
                            <span className="metric-value">{outlet.averageQuality}/10</span>
                          </div>
                        </div>
                        <div className="outlet-bias" style={{ color: getBiasColor(outlet.bias) }}>
                          Bias: {outlet.bias.toUpperCase()}
                        </div>
                        <div className="outlet-specialties">
                          <strong>Specialties:</strong>
                          <div className="specialties-list">
                            {outlet.specialties.map((specialty, i) => (
                              <span key={i} className="specialty-tag">{specialty}</span>
                            ))}
                          </div>
                        </div>
                        <div className="outlet-demographics">
                          <strong>Top Regions:</strong>
                          <div className="demographics-list">
                            {Object.entries(outlet.audience.demographics.regions).map(([region, percentage]) => (
                              <div key={region} className="demographic-item">
                                <span className="demographic-region">{region}</span>
                                <span className="demographic-percentage">{percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Create Outlet</button>
                    <button className="action-btn secondary">Outlet Analysis</button>
                    <button className="action-btn">Media Landscape</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-overview">
                    <div className="overview-metrics">
                      <div className="overview-metric">
                        <div className="metric-value">{formatNumber(newsData.analytics.totalArticles)}</div>
                        <div className="metric-label">Total Articles</div>
                      </div>
                      <div className="overview-metric">
                        <div className="metric-value">{newsData.analytics.totalOutlets}</div>
                        <div className="metric-label">News Outlets</div>
                      </div>
                      <div className="overview-metric">
                        <div className="metric-value">{formatNumber(newsData.analytics.totalReadership)}</div>
                        <div className="metric-label">Total Readership</div>
                      </div>
                      <div className="overview-metric">
                        <div className="metric-value">{newsData.analytics.averageCredibility}%</div>
                        <div className="metric-label">Avg Credibility</div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-distributions">
                    <div className="distribution-card">
                      <h4>📊 Category Distribution</h4>
                      <div className="distribution-list">
                        {newsData.analytics.categoryDistribution.map((item, i) => (
                          <div key={i} className="distribution-item">
                            <div className="distribution-info">
                              <span className="distribution-name">{item.category}</span>
                              <span className="distribution-count">{item.count} articles</span>
                            </div>
                            <div className="distribution-bar">
                              <div 
                                className="distribution-fill" 
                                style={{ 
                                  width: `${item.percentage}%`,
                                  backgroundColor: getCategoryColor(item.category)
                                }}
                              ></div>
                            </div>
                            <span className="distribution-percentage">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="distribution-card">
                      <h4>🎯 Bias Distribution</h4>
                      <div className="distribution-list">
                        {newsData.analytics.biasDistribution.map((item, i) => (
                          <div key={i} className="distribution-item">
                            <div className="distribution-info">
                              <span className="distribution-name">{item.bias}</span>
                              <span className="distribution-count">{item.count} articles</span>
                            </div>
                            <div className="distribution-bar">
                              <div 
                                className="distribution-fill" 
                                style={{ 
                                  width: `${item.percentage}%`,
                                  backgroundColor: getBiasColor(item.bias.toLowerCase())
                                }}
                              ></div>
                            </div>
                            <span className="distribution-percentage">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="distribution-card">
                      <h4>🌍 Scope Distribution</h4>
                      <div className="distribution-list">
                        {newsData.analytics.scopeDistribution.map((item, i) => (
                          <div key={i} className="distribution-item">
                            <div className="distribution-info">
                              <span className="distribution-name">{item.scope}</span>
                              <span className="distribution-count">{item.count} articles</span>
                            </div>
                            <div className="distribution-bar">
                              <div className="distribution-fill" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                            <span className="distribution-percentage">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="top-performing">
                    <h4>🏆 Top Performing Articles</h4>
                    <div className="performance-list">
                      {newsData.analytics.topPerformingArticles.map((article, i) => (
                        <div key={i} className="performance-item">
                          <div className="performance-rank">#{i + 1}</div>
                          <div className="performance-info">
                            <div className="performance-headline">{article.headline}</div>
                            <div className="performance-metrics">
                              <span className="performance-views">{formatNumber(article.views)} views</span>
                              <span className="performance-engagement">{article.engagement}% engagement</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Export Data</button>
                    <button className="action-btn">Trend Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'trending' && (
                <div className="trending-tab">
                  <div className="trending-grid">
                    {newsData.trending.map((topic) => (
                      <div key={topic.id} className="trending-item">
                        <div className="trending-header">
                          <div className="trending-topic">{topic.topic}</div>
                          <div className="trending-score">{topic.trendScore}%</div>
                        </div>
                        <div className="trending-details">
                          <div className="trending-category" style={{ color: getCategoryColor(topic.category) }}>
                            {topic.category}
                          </div>
                          <div className="trending-sentiment" style={{ color: getSentimentColor(topic.sentiment) }}>
                            {topic.sentiment.toUpperCase()}
                          </div>
                          <div className="trending-mentions">{formatNumber(topic.mentions)} mentions</div>
                          <div className="trending-articles">{topic.relatedArticles} articles</div>
                        </div>
                        <div className="trending-timeframe">
                          <strong>Timeframe:</strong> {topic.timeframe}
                        </div>
                        <div className="trending-phrases">
                          <strong>Key Phrases:</strong>
                          <div className="phrases-list">
                            {topic.keyPhrases.map((phrase, i) => (
                              <span key={i} className="phrase-tag">{phrase}</span>
                            ))}
                          </div>
                        </div>
                        <div className="trending-regions">
                          <strong>Geographic Spread:</strong>
                          <div className="regions-list">
                            {topic.geographicSpread.map((region, i) => (
                              <span key={i} className="region-tag">{region}</span>
                            ))}
                          </div>
                        </div>
                        <div className="trending-influencers">
                          <strong>Top Influencers:</strong>
                          <div className="influencers-list">
                            {topic.influencers.map((influencer, i) => (
                              <div key={i} className="influencer-item">
                                <span className="influencer-name">{influencer.name}</span>
                                <span className="influencer-outlet">({influencer.outlet})</span>
                                <span className="influencer-influence">{influencer.influence}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Track Topic</button>
                    <button className="action-btn secondary">Sentiment Analysis</button>
                    <button className="action-btn">Influence Map</button>
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

export default NewsScreen;
