import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './TradeScreen.css';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'commodities' | 'routes' | 'corporations' | 'contracts' | 'opportunities'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/trade/indices', description: 'Get trade indices and market indicators' },
    { method: 'GET', path: '/api/trade/systems', description: 'Get trading systems and hubs' },
    { method: 'GET', path: '/api/trade/commodities', description: 'Get commodity prices and data' },
    { method: 'GET', path: '/api/trade/routes', description: 'Get profitable trade routes' },
    { method: 'GET', path: '/api/trade/corporations', description: 'Get corporation data and stocks' },
    { method: 'GET', path: '/api/trade/contracts', description: 'Get available trade contracts' },
    { method: 'GET', path: '/api/trade/opportunities', description: 'Get trade opportunities' }
  ];

  const fetchTradeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [indicesRes, systemsRes, commoditiesRes, routesRes, corporationsRes, contractsRes, opportunitiesRes] = await Promise.all([
        fetch('/api/trade/indices'),
        fetch('/api/trade/systems'),
        fetch('/api/trade/commodities'),
        fetch('/api/trade/routes'),
        fetch('/api/trade/corporations'),
        fetch('/api/trade/contracts'),
        fetch('/api/trade/opportunities')
      ]);

      const [indices, systems, commodities, routes, corporations, contracts, opportunities] = await Promise.all([
        indicesRes.json(),
        systemsRes.json(),
        commoditiesRes.json(),
        routesRes.json(),
        corporationsRes.json(),
        contractsRes.json(),
        opportunitiesRes.json()
      ]);

      setTradeData({
        indices: indices.data || generateMockIndices(),
        systems: systems.data || generateMockSystems(),
        commodities: commodities.data || generateMockCommodities(),
        routes: routes.data || generateMockRoutes(),
        corporations: corporations.data || generateMockCorporations(),
        contracts: contracts.data || generateMockContracts(),
        opportunities: opportunities.data || generateMockOpportunities()
      });
    } catch (err) {
      console.error('Failed to fetch trade data:', err);
      setError('Failed to load trade data');
      // Use mock data as fallback
      setTradeData({
        indices: generateMockIndices(),
        systems: generateMockSystems(),
        commodities: generateMockCommodities(),
        routes: generateMockRoutes(),
        corporations: generateMockCorporations(),
        contracts: generateMockContracts(),
        opportunities: generateMockOpportunities()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTradeData();
  }, [fetchTradeData]);

  const generateMockIndices = (): TradeIndex[] => [
    { name: 'Galactic Trade Index', value: 2847.52, change: 2.3, trend: 'up' },
    { name: 'Commodity Futures', value: 1923.18, change: -0.8, trend: 'down' },
    { name: 'Shipping Index', value: 3421.90, change: 1.2, trend: 'up' },
    { name: 'Energy Markets', value: 1567.33, change: 4.1, trend: 'up' }
  ];

  const generateMockSystems = (): TradingSystem[] => [
    { id: 'sol', name: 'Sol Trading Hub', location: 'Sol System', volume: 2.4e12, specialties: ['Technology', 'Luxury Goods'], status: 'active' },
    { id: 'alpha', name: 'Alpha Centauri Exchange', location: 'Alpha Centauri', volume: 1.8e12, specialties: ['Raw Materials', 'Energy'], status: 'active' },
    { id: 'vega', name: 'Vega Commercial Port', location: 'Vega System', volume: 1.2e12, specialties: ['Agriculture', 'Textiles'], status: 'active' },
    { id: 'sirius', name: 'Sirius Trade Station', location: 'Sirius System', volume: 9.5e11, specialties: ['Minerals', 'Chemicals'], status: 'restricted' }
  ];

  const generateMockCommodities = (): Commodity[] => [
    { id: 'titanium', name: 'Titanium Ore', category: 'Raw Materials', price: 1247.50, change: 3.2, volume: 45000, supply: 'medium', demand: 'high' },
    { id: 'quantum', name: 'Quantum Processors', category: 'Technology', price: 89750.00, change: -1.8, volume: 1200, supply: 'low', demand: 'high' },
    { id: 'grain', name: 'Hydroponic Grain', category: 'Agriculture', price: 234.75, change: 0.5, volume: 125000, supply: 'high', demand: 'medium' },
    { id: 'plasma', name: 'Plasma Cells', category: 'Energy', price: 5670.25, change: 7.3, volume: 8900, supply: 'low', demand: 'high' }
  ];

  const generateMockRoutes = (): TradeRoute[] => [
    { id: 'route1', origin: 'Sol Hub', destination: 'Alpha Centauri', commodity: 'Quantum Processors', profit: 15750, risk: 'low', distance: 4.3, status: 'active' },
    { id: 'route2', origin: 'Vega Port', destination: 'Sirius Station', commodity: 'Hydroponic Grain', profit: 8920, risk: 'medium', distance: 12.8, status: 'active' },
    { id: 'route3', origin: 'Alpha Centauri', destination: 'Sol Hub', commodity: 'Titanium Ore', profit: 12300, risk: 'low', distance: 4.3, status: 'active' },
    { id: 'route4', origin: 'Outer Rim', destination: 'Core Worlds', commodity: 'Exotic Matter', profit: 45600, risk: 'high', distance: 45.2, status: 'dangerous' }
  ];

  const generateMockCorporations = (): Corporation[] => [
    { id: 'stellar', name: 'Stellar Dynamics Corp', sector: 'Technology', marketCap: 2.4e15, stockPrice: 1247.50, change: 2.3, reputation: 85 },
    { id: 'galactic', name: 'Galactic Mining Ltd', sector: 'Mining', marketCap: 1.8e15, stockPrice: 892.75, change: -1.2, reputation: 78 },
    { id: 'cosmic', name: 'Cosmic Transport Inc', sector: 'Logistics', marketCap: 1.2e15, stockPrice: 567.25, change: 4.1, reputation: 92 },
    { id: 'nebula', name: 'Nebula Energy Systems', sector: 'Energy', marketCap: 9.5e14, stockPrice: 1890.00, change: 1.8, reputation: 71 }
  ];

  const generateMockContracts = (): TradeContract[] => [
    { id: 'contract1', type: 'transport', commodity: 'Medical Supplies', quantity: 500, price: 15000, deadline: '2024-02-15', client: 'Frontier Medical', risk: 'medium', reward: 25000 },
    { id: 'contract2', type: 'buy', commodity: 'Rare Metals', quantity: 100, price: 89000, deadline: '2024-02-20', client: 'Tech Consortium', risk: 'low', reward: 12000 },
    { id: 'contract3', type: 'sell', commodity: 'Food Supplies', quantity: 2000, price: 45000, deadline: '2024-02-12', client: 'Colony Alpha-7', risk: 'high', reward: 35000 }
  ];

  const generateMockOpportunities = (): TradeOpportunity[] => [
    { id: 'opp1', type: 'shortage', description: 'Critical shortage of medical supplies in Outer Rim colonies', potential: 85000, timeframe: '3 days', requirements: ['Fast ship', 'Medical license'], risk: 'medium' },
    { id: 'opp2', type: 'arbitrage', description: 'Price differential in quantum processors between Core and Rim', potential: 45000, timeframe: '1 week', requirements: ['Large cargo hold'], risk: 'low' },
    { id: 'opp3', type: 'event', description: 'Mining strike on Kepler-442b creating titanium shortage', potential: 120000, timeframe: '2 weeks', requirements: ['Mining contacts', 'Heavy transport'], risk: 'high' }
  ];

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#4ecdc4';
    }
  };

  const renderOverview = () => (
    <div className="trade-overview">
      <div className="indices-grid">
        <h3>📊 Market Indices</h3>
        <div className="indices-list">
          {tradeData?.indices.map((index, i) => (
            <div key={i} className="index-card">
              <div className="index-name">{index.name}</div>
              <div className="index-value">{formatCurrency(index.value)}</div>
              <div className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                {getTrendIcon(index.trend)} {index.change >= 0 ? '+' : ''}{index.change}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="systems-grid">
        <h3>🚀 Trading Systems</h3>
        <div className="systems-list">
          {tradeData?.systems.map((system) => (
            <div key={system.id} className="system-card">
              <div className="system-header">
                <div className="system-name">{system.name}</div>
                <div className={`system-status ${system.status}`}>{system.status}</div>
              </div>
              <div className="system-location">{system.location}</div>
              <div className="system-volume">Volume: {formatCurrency(system.volume)} credits</div>
              <div className="system-specialties">
                {system.specialties.map((specialty, i) => (
                  <span key={i} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommodities = () => (
    <div className="commodities-view">
      <h3>📦 Commodity Markets</h3>
      <div className="commodities-table">
        <div className="table-header">
          <div>Commodity</div>
          <div>Price</div>
          <div>Change</div>
          <div>Volume</div>
          <div>Supply</div>
          <div>Demand</div>
        </div>
        {tradeData?.commodities.map((commodity) => (
          <div key={commodity.id} className="table-row">
            <div className="commodity-info">
              <div className="commodity-name">{commodity.name}</div>
              <div className="commodity-category">{commodity.category}</div>
            </div>
            <div className="commodity-price">{formatCurrency(commodity.price)}</div>
            <div className={`commodity-change ${commodity.change >= 0 ? 'positive' : 'negative'}`}>
              {commodity.change >= 0 ? '+' : ''}{commodity.change}%
            </div>
            <div className="commodity-volume">{commodity.volume.toLocaleString()}</div>
            <div className={`supply-level ${commodity.supply}`}>{commodity.supply}</div>
            <div className={`demand-level ${commodity.demand}`}>{commodity.demand}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div className="routes-view">
      <h3>🚀 Trade Routes</h3>
      <div className="routes-list">
        {tradeData?.routes.map((route) => (
          <div key={route.id} className="route-card">
            <div className="route-header">
              <div className="route-path">{route.origin} → {route.destination}</div>
              <div className={`route-status ${route.status}`}>{route.status}</div>
            </div>
            <div className="route-commodity">Commodity: {route.commodity}</div>
            <div className="route-metrics">
              <div className="route-profit">Profit: {formatCurrency(route.profit)}</div>
              <div className="route-distance">Distance: {route.distance} ly</div>
              <div className="route-risk" style={{ color: getRiskColor(route.risk) }}>
                Risk: {route.risk}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCorporations = () => (
    <div className="corporations-view">
      <h3>🏢 Corporations</h3>
      <div className="corporations-list">
        {tradeData?.corporations.map((corp) => (
          <div key={corp.id} className="corporation-card">
            <div className="corp-header">
              <div className="corp-name">{corp.name}</div>
              <div className="corp-sector">{corp.sector}</div>
            </div>
            <div className="corp-metrics">
              <div className="corp-market-cap">Market Cap: {formatCurrency(corp.marketCap)}</div>
              <div className="corp-stock-price">Stock: {formatCurrency(corp.stockPrice)}</div>
              <div className={`corp-change ${corp.change >= 0 ? 'positive' : 'negative'}`}>
                {corp.change >= 0 ? '+' : ''}{corp.change}%
              </div>
              <div className="corp-reputation">Reputation: {corp.reputation}/100</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContracts = () => (
    <div className="contracts-view">
      <h3>📋 Available Contracts</h3>
      <div className="contracts-list">
        {tradeData?.contracts.map((contract) => (
          <div key={contract.id} className="contract-card">
            <div className="contract-header">
              <div className="contract-type">{contract.type.toUpperCase()}</div>
              <div className="contract-reward">{formatCurrency(contract.reward)} reward</div>
            </div>
            <div className="contract-details">
              <div className="contract-commodity">{contract.commodity} x{contract.quantity}</div>
              <div className="contract-price">Price: {formatCurrency(contract.price)}</div>
              <div className="contract-client">Client: {contract.client}</div>
              <div className="contract-deadline">Deadline: {contract.deadline}</div>
              <div className="contract-risk" style={{ color: getRiskColor(contract.risk) }}>
                Risk: {contract.risk}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="opportunities-view">
      <h3>💡 Trade Opportunities</h3>
      <div className="opportunities-list">
        {tradeData?.opportunities.map((opp) => (
          <div key={opp.id} className="opportunity-card">
            <div className="opp-header">
              <div className="opp-type">{opp.type.toUpperCase()}</div>
              <div className="opp-potential">{formatCurrency(opp.potential)} potential</div>
            </div>
            <div className="opp-description">{opp.description}</div>
            <div className="opp-details">
              <div className="opp-timeframe">Timeframe: {opp.timeframe}</div>
              <div className="opp-risk" style={{ color: getRiskColor(opp.risk) }}>
                Risk: {opp.risk}
              </div>
            </div>
            <div className="opp-requirements">
              <strong>Requirements:</strong>
              {opp.requirements.map((req, i) => (
                <span key={i} className="requirement-tag">{req}</span>
              ))}
            </div>
          </div>
        ))}
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
    >
      <div className="trade-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'commodities' ? 'active' : ''}`}
            onClick={() => setActiveTab('commodities')}
          >
            📦 Commodities
          </button>
          <button 
            className={`tab ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            🚀 Routes
          </button>
          <button 
            className={`tab ${activeTab === 'corporations' ? 'active' : ''}`}
            onClick={() => setActiveTab('corporations')}
          >
            🏢 Corporations
          </button>
          <button 
            className={`tab ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            📋 Contracts
          </button>
          <button 
            className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            💡 Opportunities
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading trade data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'commodities' && renderCommodities()}
              {activeTab === 'routes' && renderRoutes()}
              {activeTab === 'corporations' && renderCorporations()}
              {activeTab === 'contracts' && renderContracts()}
              {activeTab === 'opportunities' && renderOpportunities()}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TradeScreen;
