import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './TradeScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface TradeIndex {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface TradingSystem {
  id: string;
  name: string;
  location: string;
  volume: number;
  specialties: string[];
  status: 'active' | 'restricted' | 'closed';
}

interface Commodity {
  id: string;
  name: string;
  category: string;
  price: number;
  change: number;
  volume: number;
  supply: 'low' | 'medium' | 'high';
  demand: 'low' | 'medium' | 'high';
}

interface TradeRoute {
  id: string;
  origin: string;
  destination: string;
  commodity: string;
  profit: number;
  risk: 'low' | 'medium' | 'high';
  distance: number;
  status: 'active' | 'inactive' | 'dangerous';
}

interface Corporation {
  id: string;
  name: string;
  sector: string;
  marketCap: number;
  stockPrice: number;
  change: number;
  reputation: number;
}

interface TradeContract {
  id: string;
  type: 'buy' | 'sell' | 'transport';
  commodity: string;
  quantity: number;
  price: number;
  deadline: string;
  client: string;
  risk: 'low' | 'medium' | 'high';
  reward: number;
}

interface TradeOpportunity {
  id: string;
  type: 'arbitrage' | 'shortage' | 'surplus' | 'event';
  description: string;
  potential: number;
  timeframe: string;
  requirements: string[];
  risk: 'low' | 'medium' | 'high';
}

interface TradeData {
  indices: TradeIndex[];
  systems: TradingSystem[];
  commodities: Commodity[];
  routes: TradeRoute[];
  corporations: Corporation[];
  contracts: TradeContract[];
  opportunities: TradeOpportunity[];
}

const TradeScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'commodities' | 'routes' | 'corporations' | 'opportunities'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commodities', label: 'Commodities', icon: '📦' },
    { id: 'routes', label: 'Routes', icon: '🛣️' },
    { id: 'corporations', label: 'Corporations', icon: '🏢' },
    { id: 'opportunities', label: 'Opportunities', icon: '💡' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/trade/indices', description: 'Get trade indices and market indicators' },
    { method: 'GET', path: '/api/trade/systems', description: 'Get trading systems and hubs' },
    { method: 'GET', path: '/api/trade/commodities', description: 'Get commodity prices and data' },
    { method: 'GET', path: '/api/trade/routes', description: 'Get profitable trade routes' },
    { method: 'GET', path: '/api/trade/corporations', description: 'Get corporation data and stocks' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'restricted': return '#f59e0b';
      case 'closed': return '#ef4444';
      case 'inactive': return '#6b7280';
      case 'dangerous': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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

  const fetchTradeData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/trade');
      if (response.ok) {
        const data = await response.json();
        setTradeData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch trade data:', err);
      // Use comprehensive mock data
      setTradeData({
        indices: [
          { name: 'Galactic Trade Index', value: 1247.8, change: 2.3, trend: 'up' },
          { name: 'Commodity Futures', value: 892.4, change: -1.1, trend: 'down' },
          { name: 'Interstellar Exchange', value: 1567.2, change: 0.8, trend: 'stable' },
          { name: 'Corporate Performance', value: 2341.6, change: 3.2, trend: 'up' }
        ],
        systems: [
          {
            id: 'sys-001',
            name: 'Alpha Centauri Hub',
            location: 'Alpha Centauri System',
            volume: 4500000000000,
            specialties: ['Technology', 'Luxury Goods', 'Raw Materials'],
            status: 'active'
          },
          {
            id: 'sys-002',
            name: 'Vega Trading Center',
            location: 'Vega System',
            volume: 3200000000000,
            specialties: ['Agricultural Products', 'Consumer Goods'],
            status: 'active'
          },
          {
            id: 'sys-003',
            name: 'Sirius Exchange',
            location: 'Sirius System',
            volume: 2800000000000,
            specialties: ['Financial Services', 'Information Technology'],
            status: 'active'
          },
          {
            id: 'sys-004',
            name: 'Proxima Market',
            location: 'Proxima Centauri',
            volume: 1800000000000,
            specialties: ['Mining Equipment', 'Industrial Supplies'],
            status: 'restricted'
          },
          {
            id: 'sys-005',
            name: 'Betelgeuse Port',
            location: 'Betelgeuse System',
            volume: 950000000000,
            specialties: ['Exotic Materials', 'Research Equipment'],
            status: 'active'
          }
        ],
        commodities: [
          {
            id: 'com-001',
            name: 'Quantum Processors',
            category: 'Technology',
            price: 25000,
            change: 5.2,
            volume: 1500000,
            supply: 'medium',
            demand: 'high'
          },
          {
            id: 'com-002',
            name: 'Rare Earth Metals',
            category: 'Raw Materials',
            price: 850,
            change: -2.1,
            volume: 45000000,
            supply: 'high',
            demand: 'medium'
          },
          {
            id: 'com-003',
            name: 'Synthetic Food',
            category: 'Agricultural',
            price: 125,
            change: 1.8,
            volume: 85000000,
            supply: 'medium',
            demand: 'high'
          },
          {
            id: 'com-004',
            name: 'Fusion Reactors',
            category: 'Energy',
            price: 150000,
            change: 8.5,
            volume: 250000,
            supply: 'low',
            demand: 'high'
          },
          {
            id: 'com-005',
            name: 'Luxury Textiles',
            category: 'Consumer Goods',
            price: 450,
            change: -0.5,
            volume: 12000000,
            supply: 'medium',
            demand: 'medium'
          }
        ],
        routes: [
          {
            id: 'route-001',
            origin: 'Alpha Centauri',
            destination: 'Vega',
            commodity: 'Quantum Processors',
            profit: 8500000,
            risk: 'low',
            distance: 25.3,
            status: 'active'
          },
          {
            id: 'route-002',
            origin: 'Vega',
            destination: 'Sirius',
            commodity: 'Synthetic Food',
            profit: 3200000,
            risk: 'medium',
            distance: 15.7,
            status: 'active'
          },
          {
            id: 'route-003',
            origin: 'Sirius',
            destination: 'Proxima Centauri',
            commodity: 'Fusion Reactors',
            profit: 12500000,
            risk: 'high',
            distance: 42.1,
            status: 'dangerous'
          },
          {
            id: 'route-004',
            origin: 'Proxima Centauri',
            destination: 'Betelgeuse',
            commodity: 'Rare Earth Metals',
            profit: 5800000,
            risk: 'medium',
            distance: 38.9,
            status: 'active'
          },
          {
            id: 'route-005',
            origin: 'Betelgeuse',
            destination: 'Alpha Centauri',
            commodity: 'Luxury Textiles',
            profit: 4200000,
            risk: 'low',
            distance: 31.2,
            status: 'active'
          }
        ],
        corporations: [
          {
            id: 'corp-001',
            name: 'Quantum Dynamics Inc.',
            sector: 'Technology',
            marketCap: 850000000000,
            stockPrice: 245.80,
            change: 3.2,
            reputation: 92
          },
          {
            id: 'corp-002',
            name: 'Stellar Mining Corp.',
            sector: 'Mining',
            marketCap: 420000000000,
            stockPrice: 78.45,
            change: -1.8,
            reputation: 85
          },
          {
            id: 'corp-003',
            name: 'Interstellar Foods',
            sector: 'Agriculture',
            marketCap: 320000000000,
            stockPrice: 156.20,
            change: 2.1,
            reputation: 88
          },
          {
            id: 'corp-004',
            name: 'Fusion Energy Systems',
            sector: 'Energy',
            marketCap: 680000000000,
            stockPrice: 189.75,
            change: 5.7,
            reputation: 94
          },
          {
            id: 'corp-005',
            name: 'Luxury Goods International',
            sector: 'Consumer',
            marketCap: 280000000000,
            stockPrice: 95.30,
            change: 0.8,
            reputation: 79
          }
        ],
        contracts: [
          {
            id: 'contract-001',
            type: 'transport',
            commodity: 'Quantum Processors',
            quantity: 500,
            price: 12500000,
            deadline: '2024-09-15',
            client: 'Quantum Dynamics Inc.',
            risk: 'low',
            reward: 850000
          },
          {
            id: 'contract-002',
            type: 'buy',
            commodity: 'Rare Earth Metals',
            quantity: 10000,
            price: 8500000,
            deadline: '2024-09-20',
            client: 'Stellar Mining Corp.',
            risk: 'medium',
            reward: 1200000
          },
          {
            id: 'contract-003',
            type: 'sell',
            commodity: 'Synthetic Food',
            quantity: 25000,
            price: 3125000,
            deadline: '2024-09-18',
            client: 'Interstellar Foods',
            risk: 'low',
            reward: 450000
          }
        ],
        opportunities: [
          {
            id: 'opp-001',
            type: 'arbitrage',
            description: 'Price discrepancy in Quantum Processors between Alpha Centauri and Vega',
            potential: 2500000,
            timeframe: '48 hours',
            requirements: ['Fast transport', 'Large capital'],
            risk: 'medium'
          },
          {
            id: 'opp-002',
            type: 'shortage',
            description: 'Fusion Reactors shortage in Proxima Centauri due to increased demand',
            potential: 8500000,
            timeframe: '1 week',
            requirements: ['High-capacity transport', 'Security clearance'],
            risk: 'high'
          },
          {
            id: 'opp-003',
            type: 'surplus',
            description: 'Rare Earth Metals surplus in Betelgeuse causing price drop',
            potential: 3200000,
            timeframe: '3 days',
            requirements: ['Storage facilities', 'Quick action'],
            risk: 'low'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTradeData();
  }, [fetchTradeData]);

  const renderOverview = () => (
    <>
      {/* Trade Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Trade Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Volume</span>
            <span className="standard-metric-value">{formatCurrency(tradeData?.systems?.reduce((sum, sys) => sum + sys.volume, 0) || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Systems</span>
            <span className="standard-metric-value">{tradeData?.systems?.filter(sys => sys.status === 'active').length || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Total Routes</span>
            <span className="standard-metric-value">{tradeData?.routes?.length || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Market Cap</span>
            <span className="standard-metric-value">{formatCurrency(tradeData?.corporations?.reduce((sum, corp) => sum + corp.marketCap, 0) || 0)}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Trade Report')}>Generate Report</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Market Indices - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Market Indices</h3>
        <div className="standard-metric-grid">
          {tradeData?.indices?.map((index, i) => (
            <div key={i} className="standard-metric">
              <span>{index.name}</span>
              <span className="standard-metric-value" style={{ color: getTrendColor(index.trend) }}>
                {index.value.toFixed(1)} ({index.change >= 0 ? '+' : ''}{index.change}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Trade Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={tradeData?.systems?.map((system, index) => ({
                  label: system.name.split(' ')[0],
                  value: system.volume / 1000000000,
                  color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'][index]
                })) || []}
                title="💰 Trading System Volumes (Billions)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={tradeData?.commodities?.map((commodity, index) => ({
                  label: commodity.category,
                  value: commodity.volume / 1000000,
                  color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'][index]
                })) || []}
                title="📦 Commodity Volume by Category"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCommodities = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📦 Commodity Markets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Update Prices')}>Update Prices</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Category</th>
                <th>Price</th>
                <th>Change</th>
                <th>Volume</th>
                <th>Supply</th>
                <th>Demand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.commodities?.map((commodity) => (
                <tr key={commodity.id}>
                  <td><strong>{commodity.name}</strong></td>
                  <td>{commodity.category}</td>
                  <td>{formatCurrency(commodity.price)}</td>
                  <td style={{ color: commodity.change >= 0 ? '#10b981' : '#ef4444' }}>
                    {commodity.change >= 0 ? '+' : ''}{commodity.change}%
                  </td>
                  <td>{formatNumber(commodity.volume)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: commodity.supply === 'high' ? '#10b981' : commodity.supply === 'medium' ? '#f59e0b' : '#ef4444', 
                      color: 'white' 
                    }}>
                      {commodity.supply.charAt(0).toUpperCase() + commodity.supply.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: commodity.demand === 'high' ? '#10b981' : commodity.demand === 'medium' ? '#f59e0b' : '#ef4444', 
                      color: 'white' 
                    }}>
                      {commodity.demand.charAt(0).toUpperCase() + commodity.demand.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🛣️ Trade Routes</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Optimize Routes')}>Optimize Routes</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Risk Assessment')}>Risk Assessment</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Commodity</th>
                <th>Profit</th>
                <th>Risk</th>
                <th>Distance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.routes?.map((route) => (
                <tr key={route.id}>
                  <td><strong>{route.origin} → {route.destination}</strong></td>
                  <td>{route.commodity}</td>
                  <td>{formatCurrency(route.profit)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskColor(route.risk), 
                      color: 'white' 
                    }}>
                      {route.risk.charAt(0).toUpperCase() + route.risk.slice(1)}
                    </span>
                  </td>
                  <td>{route.distance} ly</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(route.status), 
                      color: 'white' 
                    }}>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCorporations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏢 Corporations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Investment Guide')}>Investment Guide</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Corporation</th>
                <th>Sector</th>
                <th>Market Cap</th>
                <th>Stock Price</th>
                <th>Change</th>
                <th>Reputation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.corporations?.map((corporation) => (
                <tr key={corporation.id}>
                  <td><strong>{corporation.name}</strong></td>
                  <td>{corporation.sector}</td>
                  <td>{formatCurrency(corporation.marketCap)}</td>
                  <td>${corporation.stockPrice.toFixed(2)}</td>
                  <td style={{ color: corporation.change >= 0 ? '#10b981' : '#ef4444' }}>
                    {corporation.change >= 0 ? '+' : ''}{corporation.change}%
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${corporation.reputation}%`, 
                          height: '100%', 
                          backgroundColor: '#fbbf24'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{corporation.reputation}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💡 Trade Opportunities</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Scan Opportunities')}>Scan Opportunities</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Risk Analysis')}>Risk Analysis</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Potential</th>
                <th>Timeframe</th>
                <th>Risk</th>
                <th>Requirements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.opportunities?.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#fbbf24', 
                      color: 'white' 
                    }}>
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                    </span>
                  </td>
                  <td>{opportunity.description}</td>
                  <td>{formatCurrency(opportunity.potential)}</td>
                  <td>{opportunity.timeframe}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskColor(opportunity.risk), 
                      color: 'white' 
                    }}>
                      {opportunity.risk.charAt(0).toUpperCase() + opportunity.risk.slice(1)}
                    </span>
                  </td>
                  <td>{opportunity.requirements.join(', ')}</td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      onRefresh={fetchTradeData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && tradeData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'commodities' && renderCommodities()}
              {activeTab === 'routes' && renderRoutes()}
              {activeTab === 'corporations' && renderCorporations()}
              {activeTab === 'opportunities' && renderOpportunities()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading trade data...' : 'No trade data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TradeScreen;
