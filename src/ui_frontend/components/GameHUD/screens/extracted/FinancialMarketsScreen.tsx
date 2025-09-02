import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './FinancialMarketsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  sector: string;
  subsector: string;
  recentNews: string;
  advantages: string[];
  volume: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
}

interface CorporateLeader {
  id: string;
  name: string;
  title: string;
  company: string;
  age: number;
  influence: number;
  availability: 'high' | 'medium' | 'low';
  witterHandle: string;
  background: string;
  traits: string[];
  recentStatement: string;
  netWorth: number;
  education: string[];
  achievements: string[];
}

interface Bond {
  id: string;
  issuer: string;
  type: 'government' | 'corporate' | 'municipal';
  maturity: string;
  yield: number;
  rating: string;
  price: number;
  duration: number;
  couponRate: number;
  faceValue: number;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number;
  indicators: Array<{
    name: string;
    value: number;
    status: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  fearGreedIndex: number;
  volatilityIndex: number;
  newsImpact: Array<{
    headline: string;
    impact: 'positive' | 'negative' | 'neutral';
    severity: number;
    source: string;
  }>;
}

interface SectorPerformance {
  sector: string;
  performance: number;
  marketCap: number;
  companies: number;
  topPerformers: Array<{
    symbol: string;
    name: string;
    change: number;
  }>;
  trends: string[];
  outlook: 'positive' | 'negative' | 'neutral';
}

interface GovernmentPortfolio {
  totalValue: number;
  allocation: Array<{
    category: string;
    value: number;
    percentage: number;
    performance: number;
  }>;
  recentTransactions: Array<{
    type: 'buy' | 'sell';
    asset: string;
    amount: number;
    price: number;
    date: string;
    reason: string;
  }>;
}

interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  components: number;
  description: string;
}

interface FinancialMarketsData {
  stocks: Stock[];
  leaders: CorporateLeader[];
  bonds: Bond[];
  sentiment: MarketSentiment;
  sectors: SectorPerformance[];
  portfolio: GovernmentPortfolio;
  indices: MarketIndex[];
}

const FinancialMarketsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [marketsData, setMarketsData] = useState<FinancialMarketsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stocks' | 'bonds' | 'sentiment' | 'portfolio'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'stocks', label: 'Stocks', icon: '📈' },
    { id: 'bonds', label: 'Bonds', icon: '💎' },
    { id: 'sentiment', label: 'Sentiment', icon: '📉' },
    { id: 'portfolio', label: 'Portfolio', icon: '💰' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/financial-markets', description: 'Get financial markets data' }
  ];

  // Utility functions
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#10b981';
      case 'bearish': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchMarketsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/financial-markets');
      if (response.ok) {
        const data = await response.json();
        setMarketsData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch financial markets data:', err);
      // Use comprehensive mock data
      setMarketsData({
        stocks: generateMockStocks(),
        leaders: generateMockLeaders(),
        bonds: generateMockBonds(),
        sentiment: generateMockSentiment(),
        sectors: generateMockSectors(),
        portfolio: generateMockPortfolio(),
        indices: generateMockIndices()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketsData();
  }, [fetchMarketsData]);

  const generateMockStocks = (): Stock[] => [
    {
      id: 'stock-1',
      symbol: 'QCOM',
      name: 'QuantumCore Technologies',
      price: 265.63,
      change: 7.26,
      changePercent: 2.81,
      marketCap: 1250000000000,
      peRatio: 28.5,
      sector: 'Technology',
      subsector: 'Quantum Computing',
      recentNews: 'Breakthrough in quantum encryption protocols',
      advantages: ['Patents', 'R&D', 'Government Contracts'],
      volume: 4500000,
      dayHigh: 268.50,
      dayLow: 262.10,
      yearHigh: 285.20,
      yearLow: 180.30
    },
    {
      id: 'stock-2',
      symbol: 'NOVA',
      name: 'NovaSpace Industries',
      price: 142.80,
      change: -3.45,
      changePercent: -2.36,
      marketCap: 890000000000,
      peRatio: 22.1,
      sector: 'Aerospace',
      subsector: 'Space Exploration',
      recentNews: 'New space station contract awarded',
      advantages: ['Innovation', 'Global Reach', 'Strategic Partnerships'],
      volume: 3200000,
      dayHigh: 145.20,
      dayLow: 141.50,
      yearHigh: 165.80,
      yearLow: 95.40
    },
    {
      id: 'stock-3',
      symbol: 'BIOX',
      name: 'BioX Solutions',
      price: 89.45,
      change: 2.15,
      changePercent: 2.46,
      marketCap: 450000000000,
      peRatio: 35.2,
      sector: 'Healthcare',
      subsector: 'Biotechnology',
      recentNews: 'FDA approval for new gene therapy treatment',
      advantages: ['Research', 'Clinical Trials', 'Regulatory Expertise'],
      volume: 2800000,
      dayHigh: 90.10,
      dayLow: 87.80,
      yearHigh: 95.60,
      yearLow: 45.20
    }
  ];

  const generateMockLeaders = (): CorporateLeader[] => [
    {
      id: 'leader-1',
      name: 'Dr. Elena Rodriguez',
      title: 'CEO',
      company: 'QuantumCore Technologies',
      age: 42,
      influence: 95,
      availability: 'high',
      witterHandle: '@elenarodriguez',
      background: 'Former NASA scientist, PhD in Quantum Physics',
      traits: ['Visionary', 'Innovative', 'Strategic'],
      recentStatement: 'Quantum computing will revolutionize every industry within the next decade.',
      netWorth: 850000000,
      education: ['MIT', 'Stanford', 'CalTech'],
      achievements: ['Time 100', 'Nobel Prize Nominee', 'Tech Innovator of the Year']
    }
  ];

  const generateMockBonds = (): Bond[] => [
    {
      id: 'bond-1',
      issuer: 'Terran Federation',
      type: 'government',
      maturity: '2030-05-15',
      yield: 3.25,
      rating: 'AAA',
      price: 98.50,
      duration: 6.5,
      couponRate: 3.0,
      faceValue: 1000,
      description: '10-year government bond for infrastructure projects',
      riskLevel: 'low'
    },
    {
      id: 'bond-2',
      issuer: 'NovaSpace Industries',
      type: 'corporate',
      maturity: '2028-12-01',
      yield: 4.75,
      rating: 'AA',
      price: 95.20,
      duration: 4.8,
      couponRate: 4.5,
      faceValue: 1000,
      description: 'Corporate bond for space exploration initiatives',
      riskLevel: 'medium'
    }
  ];

  const generateMockSentiment = (): MarketSentiment => ({
    overall: 'bullish',
    score: 72,
    indicators: [
      {
        name: 'Market Breadth',
        value: 65,
        status: 'positive',
        description: 'Advancing stocks outnumber declining stocks'
      },
      {
        name: 'Volume Analysis',
        value: 78,
        status: 'positive',
        description: 'Above-average trading volume indicates strong participation'
      }
    ],
    fearGreedIndex: 65,
    volatilityIndex: 18.5,
    newsImpact: [
      {
        headline: 'Quantum computing breakthrough drives tech sector rally',
        impact: 'positive',
        severity: 8,
        source: 'Financial Times'
      },
      {
        headline: 'Space exploration contracts boost aerospace stocks',
        impact: 'positive',
        severity: 6,
        source: 'Wall Street Journal'
      }
    ]
  });

  const generateMockSectors = (): SectorPerformance[] => [
    {
      sector: 'Technology',
      performance: 12.5,
      marketCap: 8500000000000,
      companies: 45,
      topPerformers: [
        { symbol: 'QCOM', name: 'QuantumCore Technologies', change: 2.81 }
      ],
      trends: ['AI Integration', 'Quantum Computing', 'Cybersecurity'],
      outlook: 'positive'
    },
    {
      sector: 'Healthcare',
      performance: 8.2,
      marketCap: 3200000000000,
      companies: 28,
      topPerformers: [
        { symbol: 'BIOX', name: 'BioX Solutions', change: 2.46 }
      ],
      trends: ['Gene Therapy', 'Personalized Medicine', 'Digital Health'],
      outlook: 'positive'
    }
  ];

  const generateMockPortfolio = (): GovernmentPortfolio => ({
    totalValue: 2500000000000,
    allocation: [
      {
        category: 'Technology Stocks',
        value: 750000000000,
        percentage: 30,
        performance: 12.5
      },
      {
        category: 'Government Bonds',
        value: 500000000000,
        percentage: 20,
        performance: 3.2
      },
      {
        category: 'Infrastructure',
        value: 625000000000,
        percentage: 25,
        performance: 6.8
      },
      {
        category: 'Research & Development',
        value: 375000000000,
        percentage: 15,
        performance: 15.2
      },
      {
        category: 'Emergency Reserves',
        value: 250000000000,
        percentage: 10,
        performance: 1.5
      }
    ],
    recentTransactions: [
      {
        type: 'buy',
        asset: 'QCOM',
        amount: 1000000,
        price: 265.63,
        date: '2024-03-15',
        reason: 'Strategic investment in quantum computing'
      },
      {
        type: 'sell',
        asset: 'NOVA',
        amount: 500000,
        price: 142.80,
        date: '2024-03-14',
        reason: 'Portfolio rebalancing'
      }
    ]
  });

  const generateMockIndices = (): MarketIndex[] => [
    {
      id: 'index-1',
      name: 'Terran Federation Index',
      value: 2847.65,
      change: 45.32,
      changePercent: 1.62,
      marketCap: 15000000000000,
      peRatio: 24.5,
      dividendYield: 2.1,
      components: 500,
      description: 'Broad market index representing the top 500 companies'
    }
  ];

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Market Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Market Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Market Sentiment</span>
            <span 
              className="standard-metric-value"
              style={{ color: getSentimentColor(marketsData?.sentiment.overall || 'neutral') }}
            >
              {marketsData?.sentiment.overall?.charAt(0).toUpperCase() + marketsData?.sentiment.overall?.slice(1)}
            </span>
          </div>
          <div className="standard-metric">
            <span>Fear & Greed Index</span>
            <span className="standard-metric-value">{marketsData?.sentiment.fearGreedIndex}/100</span>
          </div>
          <div className="standard-metric">
            <span>Volatility Index</span>
            <span className="standard-metric-value">{marketsData?.sentiment.volatilityIndex}</span>
          </div>
          <div className="standard-metric">
            <span>Total Market Cap</span>
            <span className="standard-metric-value">{formatCurrency(marketsData?.sectors?.reduce((sum, sector) => sum + sector.marketCap, 0) || 0)}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Trading Dashboard')}>Trading Dashboard</button>
        </div>
      </div>

      {/* Top Performers - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Top Performers</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
                <th>Market Cap</th>
                <th>Sector</th>
              </tr>
            </thead>
            <tbody>
              {marketsData?.stocks?.slice(0, 5).map((stock) => (
                <tr key={stock.id}>
                  <td><strong>{stock.symbol}</strong></td>
                  <td>{stock.name}</td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td style={{ color: getChangeColor(stock.change) }}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td>{formatCurrency(stock.marketCap)}</td>
                  <td>{stock.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Market Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={marketsData?.sectors?.map(sector => ({
                  label: sector.sector,
                  value: sector.performance,
                  color: sector.performance >= 0 ? '#fbbf24' : '#ef4444'
                })) || []}
                title="📈 Sector Performance (%)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={marketsData?.portfolio?.allocation?.map(allocation => ({
                  label: allocation.category,
                  value: allocation.percentage,
                  color: '#fbbf24'
                })) || []}
                title="💰 Portfolio Allocation"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStocks = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Stock Market</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Buy Stock')}>Buy Stock</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Sell Stock')}>Sell Stock</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
                <th>Market Cap</th>
                <th>P/E Ratio</th>
                <th>Volume</th>
                <th>Sector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marketsData?.stocks?.map((stock) => (
                <tr key={stock.id}>
                  <td><strong>{stock.symbol}</strong></td>
                  <td>{stock.name}</td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td style={{ color: getChangeColor(stock.change) }}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </td>
                  <td>{formatCurrency(stock.marketCap)}</td>
                  <td>{stock.peRatio}</td>
                  <td>{formatNumber(stock.volume)}</td>
                  <td>{stock.sector}</td>
                  <td>
                    <button className="standard-btn economic-theme">Trade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBonds = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💎 Bond Market</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Buy Bonds')}>Buy Bonds</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Bond Analysis')}>Bond Analysis</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Issuer</th>
                <th>Type</th>
                <th>Maturity</th>
                <th>Yield</th>
                <th>Rating</th>
                <th>Price</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marketsData?.bonds?.map((bond) => (
                <tr key={bond.id}>
                  <td><strong>{bond.issuer}</strong></td>
                  <td>{bond.type.charAt(0).toUpperCase() + bond.type.slice(1)}</td>
                  <td>{bond.maturity}</td>
                  <td>{bond.yield.toFixed(2)}%</td>
                  <td>{bond.rating}</td>
                  <td>${bond.price.toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskColor(bond.riskLevel), 
                      color: 'white' 
                    }}>
                      {bond.riskLevel.charAt(0).toUpperCase() + bond.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Invest</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSentiment = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📉 Market Sentiment</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Sentiment Analysis')}>Sentiment Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('News Impact')}>News Impact</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Sentiment Indicators</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Overall Sentiment</span>
                <span 
                  className="standard-metric-value"
                  style={{ color: getSentimentColor(marketsData?.sentiment.overall || 'neutral') }}
                >
                  {marketsData?.sentiment.overall?.charAt(0).toUpperCase() + marketsData?.sentiment.overall?.slice(1)}
                </span>
              </div>
              <div className="standard-metric">
                <span>Fear & Greed Index</span>
                <span className="standard-metric-value">{marketsData?.sentiment.fearGreedIndex}/100</span>
              </div>
              <div className="standard-metric">
                <span>Volatility Index</span>
                <span className="standard-metric-value">{marketsData?.sentiment.volatilityIndex}</span>
              </div>
              <div className="standard-metric">
                <span>Sentiment Score</span>
                <span className="standard-metric-value">{marketsData?.sentiment.score}/100</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>News Impact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {marketsData?.sentiment.newsImpact?.slice(0, 3).map((news, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  background: 'rgba(251, 191, 36, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{news.headline}</div>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getSentimentColor(news.impact), 
                      color: 'white' 
                    }}>
                      {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)}
                    </span>
                  </div>
                  <div style={{ color: '#a0a9ba', fontSize: '0.9rem' }}>Source: {news.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Government Portfolio</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Rebalance Portfolio')}>Rebalance Portfolio</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Performance Report')}>Performance Report</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Portfolio Allocation</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Value</th>
                    <th>Percentage</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {marketsData?.portfolio?.allocation?.map((allocation, index) => (
                    <tr key={index}>
                      <td><strong>{allocation.category}</strong></td>
                      <td>{formatCurrency(allocation.value)}</td>
                      <td>{allocation.percentage}%</td>
                      <td style={{ color: getChangeColor(allocation.performance) }}>
                        {allocation.performance >= 0 ? '+' : ''}{allocation.performance.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Recent Transactions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {marketsData?.portfolio?.recentTransactions?.slice(0, 3).map((transaction, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  background: 'rgba(251, 191, 36, 0.1)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{transaction.asset}</div>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: transaction.type === 'buy' ? '#10b981' : '#ef4444', 
                      color: 'white' 
                    }}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}>Amount: {formatNumber(transaction.amount)} @ ${transaction.price.toFixed(2)}</div>
                  <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>{transaction.reason}</div>
                </div>
              ))}
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
      onRefresh={fetchMarketsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && marketsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'stocks' && renderStocks()}
              {activeTab === 'bonds' && renderBonds()}
              {activeTab === 'sentiment' && renderSentiment()}
              {activeTab === 'portfolio' && renderPortfolio()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading financial markets data...' : 'No financial markets data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default FinancialMarketsScreen;

