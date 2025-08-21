import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './FinancialMarketsScreen.css';

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
  strategy: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  components: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
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
  const [activeTab, setActiveTab] = useState<'stocks' | 'leaders' | 'bonds' | 'sentiment' | 'sectors' | 'portfolio' | 'indices'>('stocks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/markets/stocks', description: 'Get stock market data' },
    { method: 'GET', path: '/api/markets/leaders', description: 'Get corporate leaders' },
    { method: 'GET', path: '/api/markets/bonds', description: 'Get bond market data' },
    { method: 'GET', path: '/api/markets/sentiment', description: 'Get market sentiment' },
    { method: 'GET', path: '/api/markets/sectors', description: 'Get sector performance' },
    { method: 'GET', path: '/api/markets/portfolio', description: 'Get government portfolio' },
    { method: 'GET', path: '/api/markets/indices', description: 'Get market indices' },
    { method: 'POST', path: '/api/markets/trade', description: 'Execute trade' },
    { method: 'PUT', path: '/api/markets/portfolio', description: 'Update portfolio allocation' }
  ];

  const fetchMarketsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        stocksRes,
        leadersRes,
        bondsRes,
        sentimentRes,
        sectorsRes,
        portfolioRes,
        indicesRes
      ] = await Promise.all([
        fetch('/api/markets/stocks'),
        fetch('/api/markets/leaders'),
        fetch('/api/markets/bonds'),
        fetch('/api/markets/sentiment'),
        fetch('/api/markets/sectors'),
        fetch('/api/markets/portfolio'),
        fetch('/api/markets/indices')
      ]);

      const [
        stocks,
        leaders,
        bonds,
        sentiment,
        sectors,
        portfolio,
        indices
      ] = await Promise.all([
        stocksRes.json(),
        leadersRes.json(),
        bondsRes.json(),
        sentimentRes.json(),
        sectorsRes.json(),
        portfolioRes.json(),
        indicesRes.json()
      ]);

      setMarketsData({
        stocks: stocks.stocks || generateMockStocks(),
        leaders: leaders.leaders || generateMockLeaders(),
        bonds: bonds.bonds || generateMockBonds(),
        sentiment: sentiment.sentiment || generateMockSentiment(),
        sectors: sectors.sectors || generateMockSectors(),
        portfolio: portfolio.portfolio || generateMockPortfolio(),
        indices: indices.indices || generateMockIndices()
      });
    } catch (err) {
      console.error('Failed to fetch financial markets data:', err);
      // Use mock data as fallback
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
      changePercent: 2.80,
      marketCap: 850000000000,
      peRatio: 35.2,
      sector: 'Technology',
      subsector: 'Quantum Computing',
      recentNews: 'Room-temperature quantum computing breakthrough, $50B government contract',
      advantages: ['Quantum Error Correction', 'Neural Interface Patents', 'Military Contracts'],
      volume: 15420000,
      dayHigh: 268.45,
      dayLow: 262.18,
      yearHigh: 285.92,
      yearLow: 198.34
    },
    {
      id: 'stock-2',
      symbol: 'NGEN',
      name: 'NeuralGen Corporation',
      price: 257.14,
      change: 5.29,
      changePercent: 2.10,
      marketCap: 720000000000,
      peRatio: 42.8,
      sector: 'Technology',
      subsector: 'Artificial Intelligence',
      recentNews: 'First commercially viable AGI assistant launched, AI ethics board established',
      advantages: ['Advanced AGI Research', 'Neural Architectures', 'Ethical AI Framework'],
      volume: 12850000,
      dayHigh: 259.87,
      dayLow: 254.12,
      yearHigh: 278.45,
      yearLow: 189.67
    },
    {
      id: 'stock-3',
      symbol: 'LIFE',
      name: 'LifeExtend Biotech',
      price: 309.52,
      change: 7.38,
      changePercent: 2.44,
      marketCap: 650000000000,
      peRatio: 28.9,
      sector: 'Healthcare',
      subsector: 'Biotechnology',
      recentNews: 'FDA approved first anti-aging treatment, new regenerative medicine facility',
      advantages: ['Gene Editing Technology', 'Organ Printing', 'Longevity Research'],
      volume: 9870000,
      dayHigh: 312.45,
      dayLow: 306.78,
      yearHigh: 325.89,
      yearLow: 245.12
    }
  ];

  const generateMockLeaders = (): CorporateLeader[] => [
    {
      id: 'leader-1',
      name: 'Dr. Elena Vasquez',
      title: 'CEO',
      company: 'QuantumCore Technologies',
      age: 52,
      influence: 9,
      availability: 'high',
      witterHandle: '@ElenaQ_CEO',
      background: 'Former CERN quantum physicist, pioneered commercial quantum computing',
      traits: ['Visionary', 'Analytical', 'Risk-taking', 'Inspiring'],
      recentStatement: 'The future is quantum - everything else is just classical computing',
      netWorth: 12500000000,
      education: ['PhD Physics - MIT', 'MS Quantum Computing - Stanford'],
      achievements: ['Nobel Prize Physics 2389', 'Time Person of the Year 2391']
    },
    {
      id: 'leader-2',
      name: 'Marcus Chen',
      title: 'Founder & CTO',
      company: 'NeuralGen Corporation',
      age: 45,
      influence: 8,
      availability: 'medium',
      witterHandle: '@MarcusNeural',
      background: 'Former Google DeepMind researcher, AGI pioneer',
      traits: ['Innovative', 'Ethical', 'Methodical', 'Collaborative'],
      recentStatement: 'AGI must serve humanity, not replace it',
      netWorth: 8900000000,
      education: ['PhD Computer Science - Carnegie Mellon', 'MS AI - Berkeley'],
      achievements: ['Turing Award 2388', 'AGI Breakthrough Award 2392']
    }
  ];

  const generateMockBonds = (): Bond[] => [
    {
      id: 'bond-1',
      issuer: 'United Earth Government',
      type: 'government',
      maturity: '2034-12-15',
      yield: 3.25,
      rating: 'AAA',
      price: 102.45,
      duration: 8.2,
      couponRate: 3.5,
      faceValue: 1000,
      description: 'Infrastructure development bonds for interplanetary transportation',
      riskLevel: 'low'
    },
    {
      id: 'bond-2',
      issuer: 'Mars Colonial Authority',
      type: 'government',
      maturity: '2029-06-30',
      yield: 4.15,
      rating: 'AA+',
      price: 98.75,
      duration: 4.8,
      couponRate: 4.0,
      faceValue: 1000,
      description: 'Terraforming project financing bonds',
      riskLevel: 'low'
    },
    {
      id: 'bond-3',
      issuer: 'QuantumCore Technologies',
      type: 'corporate',
      maturity: '2027-03-15',
      yield: 5.85,
      rating: 'A',
      price: 96.20,
      duration: 2.9,
      couponRate: 5.5,
      faceValue: 1000,
      description: 'Research and development expansion bonds',
      riskLevel: 'medium'
    }
  ];

  const generateMockSentiment = (): MarketSentiment => ({
    overall: 'bullish',
    score: 72,
    indicators: [
      { name: 'VIX', value: 18.5, status: 'positive', description: 'Low volatility indicates market confidence' },
      { name: 'Put/Call Ratio', value: 0.85, status: 'positive', description: 'More calls than puts suggest optimism' },
      { name: 'Insider Trading', value: 65, status: 'positive', description: 'Net insider buying activity' },
      { name: 'Margin Debt', value: 45, status: 'neutral', description: 'Moderate leverage levels' }
    ],
    fearGreedIndex: 68,
    volatilityIndex: 18.5,
    newsImpact: [
      { headline: 'Quantum Computing Breakthrough Announced', impact: 'positive', severity: 8, source: 'TechNews' },
      { headline: 'Central Bank Maintains Interest Rates', impact: 'positive', severity: 6, source: 'FinancialTimes' },
      { headline: 'Trade Relations Improve with Zentaurian Empire', impact: 'positive', severity: 7, source: 'GalacticHerald' }
    ]
  });

  const generateMockSectors = (): SectorPerformance[] => [
    {
      sector: 'Technology',
      performance: 8.5,
      marketCap: 2800000000000,
      companies: 156,
      topPerformers: [
        { symbol: 'QCOM', name: 'QuantumCore Technologies', change: 2.80 },
        { symbol: 'NGEN', name: 'NeuralGen Corporation', change: 2.10 },
        { symbol: 'HOLO', name: 'HoloSystems Inc', change: 1.95 }
      ],
      trends: ['Quantum Computing Adoption', 'AGI Development', 'Neural Interfaces'],
      outlook: 'positive'
    },
    {
      sector: 'Healthcare',
      performance: 6.2,
      marketCap: 1900000000000,
      companies: 89,
      topPerformers: [
        { symbol: 'LIFE', name: 'LifeExtend Biotech', change: 2.44 },
        { symbol: 'REGEN', name: 'RegenMed Corp', change: 1.87 },
        { symbol: 'NANO', name: 'NanoHeal Systems', change: 1.65 }
      ],
      trends: ['Anti-Aging Treatments', 'Organ Printing', 'Genetic Therapies'],
      outlook: 'positive'
    },
    {
      sector: 'Energy',
      performance: 4.1,
      marketCap: 1200000000000,
      companies: 67,
      topPerformers: [
        { symbol: 'FUSION', name: 'Fusion Power Corp', change: 1.23 },
        { symbol: 'SOLAR', name: 'SolarMax Industries', change: 0.98 },
        { symbol: 'WIND', name: 'WindTech Solutions', change: 0.87 }
      ],
      trends: ['Fusion Energy', 'Space-Based Solar', 'Antimatter Research'],
      outlook: 'neutral'
    }
  ];

  const generateMockPortfolio = (): GovernmentPortfolio => ({
    totalValue: 2500000000000,
    allocation: [
      { category: 'Government Bonds', value: 1000000000000, percentage: 40, performance: 3.2 },
      { category: 'Technology Stocks', value: 750000000000, percentage: 30, performance: 8.5 },
      { category: 'Healthcare Stocks', value: 500000000000, percentage: 20, performance: 6.2 },
      { category: 'Alternative Investments', value: 250000000000, percentage: 10, performance: 12.1 }
    ],
    recentTransactions: [
      { type: 'buy', asset: 'QCOM', amount: 1000000, price: 265.63, date: '2024-02-20', reason: 'Quantum computing strategic investment' },
      { type: 'sell', asset: 'OLD-TECH', amount: 500000, price: 145.20, date: '2024-02-19', reason: 'Portfolio rebalancing' },
      { type: 'buy', asset: 'UEG-BONDS-2034', amount: 2000000000, price: 102.45, date: '2024-02-18', reason: 'Infrastructure funding' }
    ],
    strategy: 'Balanced growth with strategic technology investments',
    riskProfile: 'moderate'
  });

  const generateMockIndices = (): MarketIndex[] => [
    {
      name: 'Galactic 500',
      value: 4567.89,
      change: 45.67,
      changePercent: 1.01,
      components: 500,
      marketCap: 28500000000000,
      peRatio: 24.8,
      dividendYield: 1.85,
      description: 'Broad market index of top 500 galactic companies'
    },
    {
      name: 'Tech Frontier Index',
      value: 12345.67,
      change: 156.78,
      changePercent: 1.29,
      components: 100,
      marketCap: 8900000000000,
      peRatio: 35.2,
      dividendYield: 0.95,
      description: 'Technology sector index focusing on emerging technologies'
    },
    {
      name: 'Interplanetary Commerce',
      value: 3456.78,
      change: 23.45,
      changePercent: 0.68,
      components: 200,
      marketCap: 5600000000000,
      peRatio: 18.9,
      dividendYield: 2.45,
      description: 'Index tracking interplanetary trade and commerce companies'
    }
  ];

  const formatNumber = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const formatCurrency = (value: number): string => {
    return `$${formatNumber(value)}`;
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'bullish': return '#10b981';
      case 'bearish': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleExecuteTrade = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchMarketsData();
    } catch (err) {
      setError('Failed to execute trade');
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
      onRefresh={fetchMarketsData}
    >
      <div className="financial-markets-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'stocks' ? 'active' : ''}`}
            onClick={() => setActiveTab('stocks')}
          >
            📊 Stocks
          </button>
          <button 
            className={`tab ${activeTab === 'leaders' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaders')}
          >
            👔 Leaders
          </button>
          <button 
            className={`tab ${activeTab === 'bonds' ? 'active' : ''}`}
            onClick={() => setActiveTab('bonds')}
          >
            🏛️ Bonds
          </button>
          <button 
            className={`tab ${activeTab === 'sentiment' ? 'active' : ''}`}
            onClick={() => setActiveTab('sentiment')}
          >
            🎭 Sentiment
          </button>
          <button 
            className={`tab ${activeTab === 'sectors' ? 'active' : ''}`}
            onClick={() => setActiveTab('sectors')}
          >
            🏭 Sectors
          </button>
          <button 
            className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            💼 Portfolio
          </button>
          <button 
            className={`tab ${activeTab === 'indices' ? 'active' : ''}`}
            onClick={() => setActiveTab('indices')}
          >
            📈 Indices
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading financial markets data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && marketsData && (
            <>
              {activeTab === 'stocks' && (
                <div className="stocks-tab">
                  <div className="stocks-grid">
                    {marketsData.stocks.map((stock) => (
                      <div key={stock.id} className={`stock-card ${stock.change < 0 ? 'negative' : 'positive'}`}>
                        <div className="stock-header">
                          <div className="stock-symbol">{stock.symbol}</div>
                          <div className="stock-change" style={{ color: getChangeColor(stock.change) }}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                        <div className="stock-name">{stock.name}</div>
                        <div className="stock-price">${stock.price.toFixed(2)}</div>
                        <div className="stock-details">
                          <div className="stock-detail">
                            <span className="detail-label">Market Cap:</span>
                            <span className="detail-value">{formatCurrency(stock.marketCap)}</span>
                          </div>
                          <div className="stock-detail">
                            <span className="detail-label">P/E Ratio:</span>
                            <span className="detail-value">{stock.peRatio}</span>
                          </div>
                          <div className="stock-detail">
                            <span className="detail-label">Volume:</span>
                            <span className="detail-value">{formatNumber(stock.volume)}</span>
                          </div>
                        </div>
                        <div className="stock-sector">
                          <strong>Sector:</strong> {stock.sector} - {stock.subsector}
                        </div>
                        <div className="stock-news">
                          <strong>Recent:</strong> {stock.recentNews}
                        </div>
                        <div className="stock-advantages">
                          {stock.advantages.map((advantage, i) => (
                            <span key={i} className="advantage-tag">{advantage}</span>
                          ))}
                        </div>
                        <div className="stock-range">
                          <div className="range-item">
                            <span className="range-label">Day:</span>
                            <span className="range-value">${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)}</span>
                          </div>
                          <div className="range-item">
                            <span className="range-label">Year:</span>
                            <span className="range-value">${stock.yearLow.toFixed(2)} - ${stock.yearHigh.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn" onClick={handleExecuteTrade}>Execute Trade</button>
                    <button className="action-btn secondary">View All Stocks</button>
                    <button className="action-btn">Market Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'leaders' && (
                <div className="leaders-tab">
                  <div className="leaders-grid">
                    {marketsData.leaders.map((leader) => (
                      <div key={leader.id} className="leader-card">
                        <div className="leader-header">
                          <div className="leader-name">{leader.name}</div>
                          <div className={`availability-status ${leader.availability}`}>
                            {leader.availability.charAt(0).toUpperCase() + leader.availability.slice(1)} Availability
                          </div>
                        </div>
                        <div className="leader-title">{leader.title}, {leader.company}</div>
                        <div className="leader-details">
                          <div className="leader-detail">Age {leader.age} • Influence: {leader.influence}/10</div>
                          <div className="leader-witter">
                            <a href="#" className="witter-handle">{leader.witterHandle}</a>
                          </div>
                        </div>
                        <div className="leader-background">
                          <strong>Background:</strong> {leader.background}
                        </div>
                        <div className="leader-traits">
                          {leader.traits.map((trait, i) => (
                            <span key={i} className="trait-tag">{trait}</span>
                          ))}
                        </div>
                        <div className="leader-statement">
                          <strong>Recent Statement:</strong> "{leader.recentStatement}"
                        </div>
                        <div className="leader-metrics">
                          <div className="leader-metric">
                            <span className="metric-label">Net Worth:</span>
                            <span className="metric-value">{formatCurrency(leader.netWorth)}</span>
                          </div>
                        </div>
                        <div className="leader-education">
                          <strong>Education:</strong>
                          <div className="education-list">
                            {leader.education.map((edu, i) => (
                              <div key={i} className="education-item">{edu}</div>
                            ))}
                          </div>
                        </div>
                        <div className="leader-achievements">
                          <strong>Achievements:</strong>
                          <div className="achievements-list">
                            {leader.achievements.map((achievement, i) => (
                              <div key={i} className="achievement-item">{achievement}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Schedule Meeting</button>
                    <button className="action-btn secondary">View All Leaders</button>
                    <button className="action-btn">Influence Network</button>
                  </div>
                </div>
              )}

              {activeTab === 'bonds' && (
                <div className="bonds-tab">
                  <div className="bonds-grid">
                    {marketsData.bonds.map((bond) => (
                      <div key={bond.id} className="bond-card">
                        <div className="bond-header">
                          <div className="bond-issuer">{bond.issuer}</div>
                          <div className="bond-rating">{bond.rating}</div>
                        </div>
                        <div className="bond-type">{bond.type.charAt(0).toUpperCase() + bond.type.slice(1)} Bond</div>
                        <div className="bond-details">
                          <div className="bond-detail">
                            <span className="detail-label">Yield:</span>
                            <span className="detail-value">{bond.yield.toFixed(2)}%</span>
                          </div>
                          <div className="bond-detail">
                            <span className="detail-label">Price:</span>
                            <span className="detail-value">${bond.price.toFixed(2)}</span>
                          </div>
                          <div className="bond-detail">
                            <span className="detail-label">Maturity:</span>
                            <span className="detail-value">{new Date(bond.maturity).getFullYear()}</span>
                          </div>
                          <div className="bond-detail">
                            <span className="detail-label">Duration:</span>
                            <span className="detail-value">{bond.duration.toFixed(1)} years</span>
                          </div>
                          <div className="bond-detail">
                            <span className="detail-label">Coupon:</span>
                            <span className="detail-value">{bond.couponRate.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="bond-description">{bond.description}</div>
                        <div className="bond-risk">
                          <span className="risk-label">Risk Level:</span>
                          <span className="risk-value" style={{ color: getRiskColor(bond.riskLevel) }}>
                            {bond.riskLevel.charAt(0).toUpperCase() + bond.riskLevel.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Purchase Bonds</button>
                    <button className="action-btn secondary">Bond Calculator</button>
                    <button className="action-btn">Yield Curve</button>
                  </div>
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div className="sentiment-tab">
                  <div className="sentiment-overview">
                    <div className="sentiment-header">
                      <div className="sentiment-status" style={{ color: getSentimentColor(marketsData.sentiment.overall) }}>
                        {marketsData.sentiment.overall.charAt(0).toUpperCase() + marketsData.sentiment.overall.slice(1)} Market
                      </div>
                      <div className="sentiment-score">{marketsData.sentiment.score}/100</div>
                    </div>
                    <div className="sentiment-indices">
                      <div className="index-item">
                        <div className="index-name">Fear & Greed Index</div>
                        <div className="index-value">{marketsData.sentiment.fearGreedIndex}</div>
                      </div>
                      <div className="index-item">
                        <div className="index-name">Volatility Index</div>
                        <div className="index-value">{marketsData.sentiment.volatilityIndex}</div>
                      </div>
                    </div>
                  </div>

                  <div className="sentiment-indicators">
                    <h4>📊 Market Indicators</h4>
                    <div className="indicators-grid">
                      {marketsData.sentiment.indicators.map((indicator, i) => (
                        <div key={i} className="indicator-item">
                          <div className="indicator-header">
                            <div className="indicator-name">{indicator.name}</div>
                            <div className={`indicator-status ${indicator.status}`}>
                              {indicator.status.charAt(0).toUpperCase() + indicator.status.slice(1)}
                            </div>
                          </div>
                          <div className="indicator-value">{indicator.value}</div>
                          <div className="indicator-description">{indicator.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="news-impact">
                    <h4>📰 News Impact</h4>
                    <div className="news-list">
                      {marketsData.sentiment.newsImpact.map((news, i) => (
                        <div key={i} className="news-item">
                          <div className="news-header">
                            <div className="news-headline">{news.headline}</div>
                            <div className={`news-impact ${news.impact}`}>
                              {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)}
                            </div>
                          </div>
                          <div className="news-details">
                            <div className="news-severity">Severity: {news.severity}/10</div>
                            <div className="news-source">Source: {news.source}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Sentiment Analysis</button>
                    <button className="action-btn secondary">News Tracker</button>
                    <button className="action-btn">Market Mood</button>
                  </div>
                </div>
              )}

              {activeTab === 'sectors' && (
                <div className="sectors-tab">
                  <div className="sectors-grid">
                    {marketsData.sectors.map((sector, i) => (
                      <div key={i} className="sector-card">
                        <div className="sector-header">
                          <div className="sector-name">{sector.sector}</div>
                          <div className="sector-performance" style={{ color: getChangeColor(sector.performance) }}>
                            +{sector.performance.toFixed(1)}%
                          </div>
                        </div>
                        <div className="sector-details">
                          <div className="sector-detail">
                            <span className="detail-label">Market Cap:</span>
                            <span className="detail-value">{formatCurrency(sector.marketCap)}</span>
                          </div>
                          <div className="sector-detail">
                            <span className="detail-label">Companies:</span>
                            <span className="detail-value">{sector.companies}</span>
                          </div>
                        </div>
                        <div className="top-performers">
                          <strong>Top Performers:</strong>
                          <div className="performers-list">
                            {sector.topPerformers.map((performer, j) => (
                              <div key={j} className="performer-item">
                                <span className="performer-symbol">{performer.symbol}</span>
                                <span className="performer-change" style={{ color: getChangeColor(performer.change) }}>
                                  +{performer.change.toFixed(2)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="sector-trends">
                          <strong>Trends:</strong>
                          <div className="trends-list">
                            {sector.trends.map((trend, j) => (
                              <span key={j} className="trend-tag">{trend}</span>
                            ))}
                          </div>
                        </div>
                        <div className="sector-outlook">
                          <span className="outlook-label">Outlook:</span>
                          <span className={`outlook-value ${sector.outlook}`}>
                            {sector.outlook.charAt(0).toUpperCase() + sector.outlook.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Sector Analysis</button>
                    <button className="action-btn secondary">Rotation Strategy</button>
                    <button className="action-btn">Performance Comparison</button>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="portfolio-tab">
                  <div className="portfolio-overview">
                    <div className="portfolio-value">
                      <div className="value-label">Total Portfolio Value</div>
                      <div className="value-amount">{formatCurrency(marketsData.portfolio.totalValue)}</div>
                    </div>
                    <div className="portfolio-strategy">
                      <div className="strategy-label">Strategy:</div>
                      <div className="strategy-value">{marketsData.portfolio.strategy}</div>
                    </div>
                    <div className="risk-profile">
                      <div className="risk-label">Risk Profile:</div>
                      <div className="risk-value">{marketsData.portfolio.riskProfile.charAt(0).toUpperCase() + marketsData.portfolio.riskProfile.slice(1)}</div>
                    </div>
                  </div>

                  <div className="allocation-section">
                    <h4>💰 Asset Allocation</h4>
                    <div className="allocation-grid">
                      {marketsData.portfolio.allocation.map((allocation, i) => (
                        <div key={i} className="allocation-item">
                          <div className="allocation-header">
                            <div className="allocation-category">{allocation.category}</div>
                            <div className="allocation-percentage">{allocation.percentage}%</div>
                          </div>
                          <div className="allocation-value">{formatCurrency(allocation.value)}</div>
                          <div className="allocation-performance" style={{ color: getChangeColor(allocation.performance) }}>
                            Performance: +{allocation.performance.toFixed(1)}%
                          </div>
                          <div className="allocation-bar">
                            <div className="allocation-fill" style={{ width: `${allocation.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="transactions-section">
                    <h4>📋 Recent Transactions</h4>
                    <div className="transactions-list">
                      {marketsData.portfolio.recentTransactions.map((transaction, i) => (
                        <div key={i} className="transaction-item">
                          <div className="transaction-header">
                            <div className={`transaction-type ${transaction.type}`}>
                              {transaction.type.toUpperCase()}
                            </div>
                            <div className="transaction-asset">{transaction.asset}</div>
                            <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-amount">Amount: {formatNumber(transaction.amount)}</div>
                            <div className="transaction-price">Price: ${transaction.price.toFixed(2)}</div>
                          </div>
                          <div className="transaction-reason">{transaction.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Rebalance Portfolio</button>
                    <button className="action-btn secondary">Performance Report</button>
                    <button className="action-btn">Risk Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'indices' && (
                <div className="indices-tab">
                  <div className="indices-grid">
                    {marketsData.indices.map((index, i) => (
                      <div key={i} className="index-card">
                        <div className="index-header">
                          <div className="index-name">{index.name}</div>
                          <div className="index-change" style={{ color: getChangeColor(index.change) }}>
                            {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                          </div>
                        </div>
                        <div className="index-value">{index.value.toFixed(2)}</div>
                        <div className="index-change-value" style={{ color: getChangeColor(index.change) }}>
                          {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                        </div>
                        <div className="index-details">
                          <div className="index-detail">
                            <span className="detail-label">Components:</span>
                            <span className="detail-value">{index.components}</span>
                          </div>
                          <div className="index-detail">
                            <span className="detail-label">Market Cap:</span>
                            <span className="detail-value">{formatCurrency(index.marketCap)}</span>
                          </div>
                          <div className="index-detail">
                            <span className="detail-label">P/E Ratio:</span>
                            <span className="detail-value">{index.peRatio}</span>
                          </div>
                          <div className="index-detail">
                            <span className="detail-label">Dividend Yield:</span>
                            <span className="detail-value">{index.dividendYield.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="index-description">{index.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Index Funds</button>
                    <button className="action-btn secondary">Historical Data</button>
                    <button className="action-btn">Benchmark Analysis</button>
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

export default FinancialMarketsScreen;
