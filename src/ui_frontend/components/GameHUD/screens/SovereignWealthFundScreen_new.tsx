/**
 * Sovereign Wealth Fund Screen - National Investment Management
 * 
 * This screen focuses on sovereign wealth fund management including:
 * - Fund portfolio overview and performance
 * - Asset allocation and holdings management
 * - Investment opportunities and analysis
 * - Risk management and diversification
 * - Performance tracking and reporting
 * 
 * Theme: Economic (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from './BaseScreen';
import './SovereignWealthFundScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../Charts';

interface Fund {
  id: number;
  fund_name: string;
  fund_type: string;
  total_assets: number;
  net_asset_value: number;
  status: string;
  holdings_count: number;
  current_market_value: number;
  performance_1y: number;
  performance_3y: number;
  performance_5y: number;
  expense_ratio: number;
  inception_date: string;
}

interface Holding {
  id: number;
  asset_name: string;
  holding_type: string;
  quantity: number;
  market_value: number;
  unrealized_gain_loss: number;
  currency_code: string;
  investment_type: string;
  sector?: string;
  allocation_percentage: number;
  risk_rating: 'low' | 'medium' | 'high';
}

interface Investment {
  id: number;
  asset_name: string;
  asset_type: string;
  asset_symbol: string;
  current_price: number;
  currency_code: string;
  dividend_yield?: number;
  coupon_rate?: number;
  sector?: string;
  issuing_civilization_name: string;
  risk_rating: 'low' | 'medium' | 'high';
  expected_return: number;
  liquidity_rating: 'high' | 'medium' | 'low';
}

interface FundMetrics {
  totalAUM: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
  riskAdjustedReturn: number;
}

interface SWFData {
  funds: Fund[];
  holdings: Holding[];
  investments: Investment[];
  metrics: FundMetrics;
  allocations: any[];
}

const SovereignWealthFundScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [swfData, setSWFData] = useState<SWFData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'funds' | 'holdings' | 'opportunities' | 'performance'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'funds', label: 'Funds', icon: '💰' },
    { id: 'holdings', label: 'Holdings', icon: '📈' },
    { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
    { id: 'performance', label: 'Performance', icon: '📉' }
  ];

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/sovereign-wealth-fund', description: 'Get sovereign wealth fund data' },
    { method: 'GET', path: '/api/sovereign-wealth-fund/funds', description: 'Get all funds' },
    { method: 'GET', path: '/api/sovereign-wealth-fund/holdings', description: 'Get fund holdings' },
    { method: 'GET', path: '/api/sovereign-wealth-fund/investments', description: 'Get investment opportunities' },
    { method: 'POST', path: '/api/sovereign-wealth-fund/invest', description: 'Make new investment' },
    { method: 'PUT', path: '/api/sovereign-wealth-fund/rebalance', description: 'Rebalance portfolio' }
  ];

  const fetchSWFData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/sovereign-wealth-fund');
      if (response.ok) {
        const apiData = await response.json();
        setSWFData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch sovereign wealth fund data:', err);
      
      // Comprehensive mock data
      const mockFunds: Fund[] = [
        {
          id: 1,
          fund_name: 'Strategic Reserve Fund',
          fund_type: 'Stabilization',
          total_assets: 125000000000,
          net_asset_value: 124500000000,
          status: 'active',
          holdings_count: 245,
          current_market_value: 124800000000,
          performance_1y: 8.4,
          performance_3y: 12.1,
          performance_5y: 9.8,
          expense_ratio: 0.35,
          inception_date: '2380-03-15'
        },
        {
          id: 2,
          fund_name: 'Future Generations Fund',
          fund_type: 'Savings',
          total_assets: 89000000000,
          net_asset_value: 88200000000,
          status: 'active',
          holdings_count: 189,
          current_market_value: 88900000000,
          performance_1y: 11.2,
          performance_3y: 14.8,
          performance_5y: 11.5,
          expense_ratio: 0.28,
          inception_date: '2375-08-22'
        },
        {
          id: 3,
          fund_name: 'Infrastructure Development Fund',
          fund_type: 'Development',
          total_assets: 45000000000,
          net_asset_value: 44800000000,
          status: 'active',
          holdings_count: 78,
          current_market_value: 45200000000,
          performance_1y: 6.8,
          performance_3y: 9.2,
          performance_5y: 7.4,
          expense_ratio: 0.42,
          inception_date: '2382-01-10'
        }
      ];

      const mockHoldings: Holding[] = [
        {
          id: 1,
          asset_name: 'Galactic Treasury Bonds',
          holding_type: 'Government Bond',
          quantity: 1000000,
          market_value: 25000000000,
          unrealized_gain_loss: 1200000000,
          currency_code: 'GCR',
          investment_type: 'Fixed Income',
          sector: 'Government',
          allocation_percentage: 35.2,
          risk_rating: 'low'
        },
        {
          id: 2,
          asset_name: 'Stellar Industries Corp',
          holding_type: 'Equity',
          quantity: 50000000,
          market_value: 18500000000,
          unrealized_gain_loss: 2800000000,
          currency_code: 'GCR',
          investment_type: 'Equity',
          sector: 'Technology',
          allocation_percentage: 26.1,
          risk_rating: 'medium'
        },
        {
          id: 3,
          asset_name: 'Quantum Energy ETF',
          holding_type: 'ETF',
          quantity: 25000000,
          market_value: 12000000000,
          unrealized_gain_loss: 800000000,
          currency_code: 'GCR',
          investment_type: 'ETF',
          sector: 'Energy',
          allocation_percentage: 16.9,
          risk_rating: 'medium'
        },
        {
          id: 4,
          asset_name: 'Interstellar Real Estate REIT',
          holding_type: 'REIT',
          quantity: 15000000,
          market_value: 9200000000,
          unrealized_gain_loss: 450000000,
          currency_code: 'GCR',
          investment_type: 'Real Estate',
          sector: 'Real Estate',
          allocation_percentage: 13.0,
          risk_rating: 'medium'
        },
        {
          id: 5,
          asset_name: 'Precious Metals Fund',
          holding_type: 'Commodity',
          quantity: 8000000,
          market_value: 6200000000,
          unrealized_gain_loss: -200000000,
          currency_code: 'GCR',
          investment_type: 'Commodity',
          sector: 'Materials',
          allocation_percentage: 8.8,
          risk_rating: 'high'
        }
      ];

      const mockInvestments: Investment[] = [
        {
          id: 1,
          asset_name: 'Centauri Defense Systems',
          asset_type: 'Equity',
          asset_symbol: 'CDS',
          current_price: 245.80,
          currency_code: 'GCR',
          dividend_yield: 3.2,
          sector: 'Defense',
          issuing_civilization_name: 'Centauri Federation',
          risk_rating: 'medium',
          expected_return: 12.5,
          liquidity_rating: 'high'
        },
        {
          id: 2,
          asset_name: 'Vegan Trade Union Bonds',
          asset_type: 'Government Bond',
          asset_symbol: 'VTU-10Y',
          current_price: 98.50,
          currency_code: 'VCR',
          coupon_rate: 4.8,
          sector: 'Government',
          issuing_civilization_name: 'Vegan Trade Union',
          risk_rating: 'low',
          expected_return: 5.2,
          liquidity_rating: 'high'
        },
        {
          id: 3,
          asset_name: 'Andromeda Mining Corp',
          asset_type: 'Equity',
          asset_symbol: 'AMC',
          current_price: 89.25,
          currency_code: 'GCR',
          dividend_yield: 2.8,
          sector: 'Materials',
          issuing_civilization_name: 'Andromeda Collective',
          risk_rating: 'high',
          expected_return: 18.2,
          liquidity_rating: 'medium'
        }
      ];

      const mockMetrics: FundMetrics = {
        totalAUM: 259000000000,
        totalReturn: 15.8,
        annualizedReturn: 9.7,
        volatility: 12.4,
        sharpeRatio: 1.85,
        maxDrawdown: -8.2,
        diversificationScore: 0.78,
        riskAdjustedReturn: 7.8
      };

      const mockAllocations = [
        { category: 'Government Bonds', percentage: 35.2, value: 91068000000 },
        { category: 'Equities', percentage: 26.1, value: 67599000000 },
        { category: 'ETFs', percentage: 16.9, value: 43771000000 },
        { category: 'Real Estate', percentage: 13.0, value: 33670000000 },
        { category: 'Commodities', percentage: 8.8, value: 22792000000 }
      ];

      setSWFData({
        funds: mockFunds,
        holdings: mockHoldings,
        investments: mockInvestments,
        metrics: mockMetrics,
        allocations: mockAllocations
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSWFData();
  }, [fetchSWFData]);

  // Utility functions
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 10) return '#10b981';
    if (performance >= 5) return '#3b82f6';
    if (performance >= 0) return '#f59e0b';
    return '#ef4444';
  };

  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Chart data
  const allocationData = swfData?.allocations.map(allocation => ({
    label: allocation.category,
    value: allocation.percentage
  })) || [];

  const performanceData = swfData?.funds.map(fund => ({
    label: fund.fund_name.substring(0, 15) + '...',
    value: fund.performance_1y
  })) || [];

  const holdingsData = swfData?.holdings.map(holding => ({
    label: holding.asset_name.substring(0, 15) + '...',
    value: holding.allocation_percentage
  })) || [];

  const renderOverview = () => (
    <>
      {/* Fund Overview Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">💰 Sovereign Wealth Fund Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total AUM</span>
            <span className="standard-metric-value">
              {(swfData?.metrics.totalAUM || 0).toLocaleString()} GCR
            </span>
          </div>
          <div className="standard-metric">
            <span>Total Return</span>
            <span className="standard-metric-value" style={{ color: getPerformanceColor(swfData?.metrics.totalReturn || 0) }}>
              {swfData?.metrics.totalReturn || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Annualized Return</span>
            <span className="standard-metric-value" style={{ color: getPerformanceColor(swfData?.metrics.annualizedReturn || 0) }}>
              {swfData?.metrics.annualizedReturn || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Sharpe Ratio</span>
            <span className="standard-metric-value" style={{ color: swfData?.metrics.sharpeRatio >= 1.5 ? '#10b981' : '#f59e0b' }}>
              {swfData?.metrics.sharpeRatio || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Volatility</span>
            <span className="standard-metric-value" style={{ color: swfData?.metrics.volatility <= 15 ? '#10b981' : '#ef4444' }}>
              {swfData?.metrics.volatility || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Diversification Score</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {((swfData?.metrics.diversificationScore || 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📈 Portfolio Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Asset Allocation
            </h4>
            <PieChart data={allocationData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Fund Performance
            </h4>
            <BarChart data={performanceData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Holdings Distribution
            </h4>
            <LineChart data={holdingsData} />
          </div>
        </div>
      </div>
    </>
  );

  const renderFunds = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">💰 Fund Management</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Fund Name</th>
              <th>Type</th>
              <th>Total Assets</th>
              <th>NAV</th>
              <th>1Y Performance</th>
              <th>3Y Performance</th>
              <th>Expense Ratio</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {swfData?.funds.map(fund => (
              <tr key={fund.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{fund.fund_name}</div>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    Inception: {fund.inception_date}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--economic-accent)'
                  }}>
                    {fund.fund_type}
                  </span>
                </td>
                <td>{fund.total_assets.toLocaleString()} GCR</td>
                <td>{fund.net_asset_value.toLocaleString()} GCR</td>
                <td style={{ color: getPerformanceColor(fund.performance_1y) }}>
                  {fund.performance_1y >= 0 ? '+' : ''}{fund.performance_1y}%
                </td>
                <td style={{ color: getPerformanceColor(fund.performance_3y) }}>
                  {fund.performance_3y >= 0 ? '+' : ''}{fund.performance_3y}%
                </td>
                <td>{fund.expense_ratio}%</td>
                <td>
                  <span style={{ 
                    color: fund.status === 'active' ? '#10b981' : '#6b7280',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {fund.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="standard-btn economic-theme" 
                    style={{ fontSize: '0.8em', padding: '4px 8px' }}
                    onClick={() => setSelectedFund(fund)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">📈 Portfolio Holdings</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Sector</th>
              <th>Market Value</th>
              <th>Allocation %</th>
              <th>Unrealized P&L</th>
              <th>Risk Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {swfData?.holdings.map(holding => (
              <tr key={holding.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{holding.asset_name}</div>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    Qty: {holding.quantity.toLocaleString()}
                  </div>
                </td>
                <td>{holding.investment_type}</td>
                <td>{holding.sector || 'N/A'}</td>
                <td>{holding.market_value.toLocaleString()} {holding.currency_code}</td>
                <td>{holding.allocation_percentage.toFixed(1)}%</td>
                <td style={{ color: holding.unrealized_gain_loss >= 0 ? '#10b981' : '#ef4444' }}>
                  {holding.unrealized_gain_loss >= 0 ? '+' : ''}{holding.unrealized_gain_loss.toLocaleString()} {holding.currency_code}
                </td>
                <td>
                  <span style={{ 
                    color: getRiskColor(holding.risk_rating),
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {holding.risk_rating}
                  </span>
                </td>
                <td>
                  <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">🎯 Investment Opportunities</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Symbol</th>
              <th>Current Price</th>
              <th>Expected Return</th>
              <th>Risk Rating</th>
              <th>Liquidity</th>
              <th>Issuer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {swfData?.investments.map(investment => (
              <tr key={investment.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{investment.asset_name}</div>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    {investment.sector || 'N/A'}
                  </div>
                </td>
                <td>{investment.asset_type}</td>
                <td style={{ fontFamily: 'monospace' }}>{investment.asset_symbol}</td>
                <td>{investment.current_price.toFixed(2)} {investment.currency_code}</td>
                <td style={{ color: getPerformanceColor(investment.expected_return) }}>
                  {investment.expected_return.toFixed(1)}%
                </td>
                <td>
                  <span style={{ 
                    color: getRiskColor(investment.risk_rating),
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {investment.risk_rating}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: getLiquidityColor(investment.liquidity_rating),
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {investment.liquidity_rating}
                  </span>
                </td>
                <td style={{ fontSize: '0.8em' }}>{investment.issuing_civilization_name}</td>
                <td>
                  <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                    Invest
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <>
      {/* Performance Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📉 Performance Analysis</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Risk-Adjusted Return</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {swfData?.metrics.riskAdjustedReturn || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Maximum Drawdown</span>
            <span className="standard-metric-value" style={{ color: '#ef4444' }}>
              {swfData?.metrics.maxDrawdown || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Portfolio Beta</span>
            <span className="standard-metric-value">
              0.85
            </span>
          </div>
          <div className="standard-metric">
            <span>Alpha</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              2.3%
            </span>
          </div>
        </div>
      </div>

      {/* Asset Allocation Breakdown */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📊 Asset Allocation Breakdown</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Asset Category</th>
                <th>Allocation %</th>
                <th>Market Value</th>
                <th>Target %</th>
                <th>Deviation</th>
                <th>Rebalance Action</th>
              </tr>
            </thead>
            <tbody>
              {swfData?.allocations.map((allocation, index) => {
                const target = [40, 25, 15, 12, 8][index] || 0;
                const deviation = allocation.percentage - target;
                return (
                  <tr key={allocation.category}>
                    <td style={{ fontWeight: 'bold' }}>{allocation.category}</td>
                    <td>{allocation.percentage.toFixed(1)}%</td>
                    <td>{allocation.value.toLocaleString()} GCR</td>
                    <td>{target.toFixed(1)}%</td>
                    <td style={{ color: Math.abs(deviation) > 2 ? '#ef4444' : '#10b981' }}>
                      {deviation >= 0 ? '+' : ''}{deviation.toFixed(1)}%
                    </td>
                    <td>
                      {Math.abs(deviation) > 2 ? (
                        <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                          {deviation > 0 ? 'Reduce' : 'Increase'}
                        </button>
                      ) : (
                        <span style={{ color: '#10b981' }}>Balanced</span>
                      )}
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

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchSWFData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && swfData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'funds' && renderFunds()}
              {activeTab === 'holdings' && renderHoldings()}
              {activeTab === 'opportunities' && renderOpportunities()}
              {activeTab === 'performance' && renderPerformance()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading sovereign wealth fund data...' : 
               error ? `Error: ${error}` : 
               'No sovereign wealth fund data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default SovereignWealthFundScreen;
