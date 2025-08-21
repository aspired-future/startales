import React, { useState, useEffect } from 'react';
import './TradeEconomics.css';

interface TradeEconomicsProps {
  playerId: string;
  gameContext?: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
  onClose?: () => void;
}

interface MarketData {
  resource: string;
  price: number;
  change: number;
  volume: number;
  icon: string;
}

interface TradeRoute {
  id: string;
  from: string;
  to: string;
  resource: string;
  volume: string;
  status: 'active' | 'pending' | 'blocked';
  revenue: string;
}

interface Corporation {
  name: string;
  marketCap: string;
  sector: string;
  icon: string;
}

export const TradeEconomics: React.FC<TradeEconomicsProps> = ({
  playerId,
  gameContext,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [marketData, setMarketData] = useState<MarketData[]>([
    { resource: 'Energy Crystals', price: 1247, change: 5.2, volume: 2400000, icon: '⚡' },
    { resource: 'Rare Minerals', price: 892, change: -2.1, volume: 1800000, icon: '⛏️' },
    { resource: 'Food Supplies', price: 156, change: 1.8, volume: 3200000, icon: '🌾' },
    { resource: 'Technology', price: 2340, change: 8.7, volume: 890000, icon: '🔬' },
    { resource: 'Luxury Goods', price: 567, change: -0.5, volume: 1200000, icon: '💎' }
  ]);

  const [tradeRoutes, setTradeRoutes] = useState<TradeRoute[]>([
    {
      id: '1',
      from: 'Terra Prime',
      to: 'Alpha Centauri',
      resource: 'Energy Crystals',
      volume: '2.4M GC/day',
      status: 'active',
      revenue: '2.4M'
    },
    {
      id: '2',
      from: 'Kepler Station',
      to: 'Mars Colony',
      resource: 'Food Supplies',
      volume: '890K GC/day',
      status: 'active',
      revenue: '890K'
    },
    {
      id: '3',
      from: 'Vega Mining',
      to: 'Jupiter Base',
      resource: 'Rare Minerals',
      volume: '1.7M GC/day',
      status: 'pending',
      revenue: '1.7M'
    }
  ]);

  const [corporations] = useState<Corporation[]>([
    { name: 'Stellar Dynamics', marketCap: '47.2T GC', sector: 'Transport', icon: '🚀' },
    { name: 'Quantum Energy', marketCap: '38.9T GC', sector: 'Energy', icon: '⚡' },
    { name: 'Galactic Mining', marketCap: '29.1T GC', sector: 'Resources', icon: '⛏️' },
    { name: 'AgriSpace Corp', marketCap: '18.7T GC', sector: 'Agriculture', icon: '🌾' }
  ]);

  const [economicStats, setEconomicStats] = useState({
    gdp: { value: '847.2T', change: 12.4, trend: 'up' },
    tradeVolume: { value: '2.1M', change: 2.1, trend: 'stable' },
    exchangeRate: { value: '1.247', change: 0.8, trend: 'up' },
    inflation: { value: '2.3%', change: -0.5, trend: 'down' }
  });

  // Simulate real-time market updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: Math.round(item.price * (1 + (Math.random() - 0.5) * 0.02)), // ±1% fluctuation
        change: Number(((Math.random() - 0.5) * 10).toFixed(1)) // Random change ±5%
      })));

      // Update economic stats
      setEconomicStats(prev => ({
        gdp: { ...prev.gdp, change: Number((prev.gdp.change + (Math.random() - 0.5) * 0.5).toFixed(1)) },
        tradeVolume: { ...prev.tradeVolume, change: Number((prev.tradeVolume.change + (Math.random() - 0.5) * 0.3).toFixed(1)) },
        exchangeRate: { ...prev.exchangeRate, change: Number((prev.exchangeRate.change + (Math.random() - 0.5) * 0.2).toFixed(1)) },
        inflation: { ...prev.inflation, change: Number((prev.inflation.change + (Math.random() - 0.5) * 0.1).toFixed(1)) }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTradeAction = (action: string) => {
    console.log(`🚀 Executing trade action: ${action}`);
    
    switch(action) {
      case 'new-route':
        alert('New Trade Route Wizard\n\nThis would open a detailed interface for creating new trade routes between civilizations.');
        break;
      case 'market-analysis':
        alert('Market Analysis\n\nDetailed market trends and predictions would be displayed here.');
        break;
      case 'emergency-trade':
        alert('Emergency Trade\n\nRapid resource acquisition interface for crisis situations.');
        break;
      case 'corp-analysis':
        alert('Corporate Analysis\n\nDetailed corporate performance metrics and investment opportunities.');
        break;
      default:
        console.log(`⚠️ Unknown action: ${action}`);
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'positive' : 'negative';
    return <span className={color}>{sign}{change.toFixed(1)}%</span>;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  return (
    <div className="trade-economics-container">
      <div className="trade-economics-header">
        <h2>💰 Trade & Economics</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="trade-economics-nav">
        <button 
          className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeSection === 'markets' ? 'active' : ''}`}
          onClick={() => setActiveSection('markets')}
        >
          📈 Markets
        </button>
        <button 
          className={`nav-btn ${activeSection === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveSection('routes')}
        >
          🚢 Trade Routes
        </button>
        <button 
          className={`nav-btn ${activeSection === 'corporations' ? 'active' : ''}`}
          onClick={() => setActiveSection('corporations')}
        >
          🏢 Corporations
        </button>
      </div>

      <div className="trade-economics-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">💎</span>
                  <span className="stat-title">Galactic GDP</span>
                </div>
                <div className="stat-value">{economicStats.gdp.value} Credits</div>
                <div className="stat-change">
                  {formatChange(economicStats.gdp.change)} from last quarter
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">📊</span>
                  <span className="stat-title">Trade Volume</span>
                </div>
                <div className="stat-value">{economicStats.tradeVolume.value} Ships/Day</div>
                <div className="stat-change">
                  {formatChange(economicStats.tradeVolume.change)} from last month
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">💱</span>
                  <span className="stat-title">Exchange Rate</span>
                </div>
                <div className="stat-value">1 GC = {economicStats.exchangeRate.value} UC</div>
                <div className="stat-change">
                  {formatChange(economicStats.exchangeRate.change)} vs Universal Credits
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">📉</span>
                  <span className="stat-title">Inflation Rate</span>
                </div>
                <div className="stat-value">{economicStats.inflation.value}</div>
                <div className="stat-change">
                  {formatChange(economicStats.inflation.change)} from last month
                </div>
              </div>
            </div>

            <div className="overview-panels">
              <div className="panel">
                <h3>🚢 Active Trade Routes</h3>
                <div className="trade-routes-list">
                  {tradeRoutes.slice(0, 3).map(route => (
                    <div key={route.id} className="trade-route-item">
                      <div className="route-info">
                        <strong>{route.from} → {route.to}</strong>
                        <div className="route-details">{route.resource} • {route.volume}</div>
                      </div>
                      <div className={`route-status ${route.status}`}>
                        {route.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="panel-actions">
                  <button className="action-btn primary" onClick={() => setActiveSection('routes')}>
                    Manage Routes
                  </button>
                  <button className="action-btn success" onClick={() => handleTradeAction('new-route')}>
                    New Route
                  </button>
                </div>
              </div>

              <div className="panel">
                <h3>📈 Market Prices</h3>
                <div className="market-prices-list">
                  {marketData.slice(0, 4).map((item, index) => (
                    <div key={index} className="market-item">
                      <div className="market-info">
                        <span className="market-icon">{item.icon}</span>
                        <span className="market-name">{item.resource}</span>
                      </div>
                      <div className="market-price">
                        <div className="price">{formatCurrency(item.price)} GC</div>
                        <div className="change">{formatChange(item.change)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="panel-actions">
                  <button className="action-btn primary" onClick={() => setActiveSection('markets')}>
                    Full Markets
                  </button>
                  <button className="action-btn" onClick={() => handleTradeAction('market-analysis')}>
                    Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'markets' && (
          <div className="markets-section">
            <h3>📈 Galactic Markets</h3>
            <div className="markets-table">
              <div className="table-header">
                <div>Resource</div>
                <div>Price</div>
                <div>Change</div>
                <div>Volume</div>
                <div>Actions</div>
              </div>
              {marketData.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="resource-cell">
                    <span className="resource-icon">{item.icon}</span>
                    <span>{item.resource}</span>
                  </div>
                  <div>{formatCurrency(item.price)} GC</div>
                  <div>{formatChange(item.change)}</div>
                  <div>{formatCurrency(item.volume)}</div>
                  <div>
                    <button className="action-btn small">Trade</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'routes' && (
          <div className="routes-section">
            <h3>🚢 Trade Routes Management</h3>
            <div className="routes-grid">
              {tradeRoutes.map(route => (
                <div key={route.id} className="route-card">
                  <div className="route-header">
                    <h4>{route.from} → {route.to}</h4>
                    <div className={`status-badge ${route.status}`}>
                      {route.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="route-details">
                    <div>Resource: {route.resource}</div>
                    <div>Volume: {route.volume}</div>
                    <div>Revenue: {route.revenue}</div>
                  </div>
                  <div className="route-actions">
                    <button className="action-btn small">Modify</button>
                    <button className="action-btn small danger">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-actions">
              <button className="action-btn primary" onClick={() => handleTradeAction('new-route')}>
                🚀 Create New Route
              </button>
              <button className="action-btn" onClick={() => handleTradeAction('emergency-trade')}>
                🚨 Emergency Trade
              </button>
            </div>
          </div>
        )}

        {activeSection === 'corporations' && (
          <div className="corporations-section">
            <h3>🏢 Top Corporations</h3>
            <div className="corporations-grid">
              {corporations.map((corp, index) => (
                <div key={index} className="corp-card">
                  <div className="corp-header">
                    <span className="corp-icon">{corp.icon}</span>
                    <div>
                      <h4>{corp.name}</h4>
                      <div className="corp-sector">{corp.sector}</div>
                    </div>
                  </div>
                  <div className="corp-value">
                    Market Cap: {corp.marketCap}
                  </div>
                  <div className="corp-actions">
                    <button className="action-btn small">Invest</button>
                    <button className="action-btn small">Details</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-actions">
              <button className="action-btn primary" onClick={() => handleTradeAction('corp-analysis')}>
                📊 Corporate Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeEconomics;
