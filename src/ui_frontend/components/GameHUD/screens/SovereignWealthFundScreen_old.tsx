import React, { useState, useEffect } from 'react';
import BaseScreen from './BaseScreen';
import './SovereignWealthFundScreen.css';

interface SovereignWealthFundScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext: {
    currentLocation: string;
    playerId: string;
  };
}

interface Fund {
  id: number;
  fund_name: string;
  fund_type: string;
  total_assets: number;
  net_asset_value: number;
  status: string;
  holdings_count: number;
  current_market_value: number;
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
}

const SovereignWealthFundScreen: React.FC<SovereignWealthFundScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalAssets, setTotalAssets] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [knobs, setKnobs] = useState<any>({});

  useEffect(() => {
    fetchDashboardData();
  }, [gameContext.playerId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sovereign-wealth-fund/dashboard/${gameContext.playerId}`);
      const data = await response.json();
      
      if (data.success) {
        setFunds(data.data.funds);
        setTotalAssets(data.data.totalAssets);
        setKnobs(data.data.knobs);
        
        if (data.data.funds.length > 0 && !selectedFund) {
          setSelectedFund(data.data.funds[0]);
          fetchFundDetails(data.data.funds[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching SWF dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFundDetails = async (fundId: number) => {
    try {
      const response = await fetch(`/api/sovereign-wealth-fund/fund/${fundId}`);
      const data = await response.json();
      
      if (data.success) {
        setHoldings(data.data.holdings);
      }
    } catch (error) {
      console.error('Error fetching fund details:', error);
    }
  };

  const fetchInvestmentUniverse = async () => {
    try {
      const response = await fetch(`/api/sovereign-wealth-fund/investment-universe/${gameContext.playerId}`);
      const data = await response.json();
      
      if (data.success) {
        setInvestments(data.data.investments);
      }
    } catch (error) {
      console.error('Error fetching investment universe:', error);
    }
  };

  const handleFundSelect = (fund: Fund) => {
    setSelectedFund(fund);
    fetchFundDetails(fund.id);
  };

  const formatCurrency = (amount: number, currency = 'TER') => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const renderDashboard = () => (
    <div className="swf-dashboard">
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Assets Under Management</h3>
          <div className="metric-value">{formatCurrency(totalAssets.total_assets || 0)}</div>
          <div className="metric-subtitle">{totalAssets.fund_count || 0} Active Funds</div>
        </div>
        <div className="summary-card">
          <h3>Net Asset Value</h3>
          <div className="metric-value">{formatCurrency(totalAssets.total_nav || 0)}</div>
          <div className="metric-subtitle">Current Valuation</div>
        </div>
      </div>

      <div className="funds-grid">
        <h3>Sovereign Wealth Funds</h3>
        {funds.map(fund => (
          <div 
            key={fund.id} 
            className={`fund-card ${selectedFund?.id === fund.id ? 'selected' : ''}`}
            onClick={() => handleFundSelect(fund)}
          >
            <div className="fund-header">
              <h4>{fund.fund_name}</h4>
              <span className={`fund-status ${fund.status}`}>{fund.status}</span>
            </div>
            <div className="fund-metrics">
              <div className="metric">
                <span className="label">Assets:</span>
                <span className="value">{formatCurrency(fund.total_assets)}</span>
              </div>
              <div className="metric">
                <span className="label">Holdings:</span>
                <span className="value">{fund.holdings_count}</span>
              </div>
              <div className="metric">
                <span className="label">Market Value:</span>
                <span className="value">{formatCurrency(fund.current_market_value || 0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="swf-holdings">
      <div className="holdings-header">
        <h3>Portfolio Holdings - {selectedFund?.fund_name}</h3>
        <div className="holdings-summary">
          <span>Total Holdings: {holdings.length}</span>
          <span>Market Value: {formatCurrency(holdings.reduce((sum, h) => sum + h.market_value, 0))}</span>
        </div>
      </div>

      <div className="holdings-table">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Market Value</th>
              <th>P&L</th>
              <th>Currency</th>
              <th>Sector</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(holding => (
              <tr key={holding.id}>
                <td className="asset-name">{holding.asset_name}</td>
                <td>
                  <span className={`holding-type ${holding.holding_type}`}>
                    {holding.holding_type.replace('_', ' ')}
                  </span>
                </td>
                <td>{holding.quantity.toLocaleString()}</td>
                <td>{formatCurrency(holding.market_value, holding.currency_code)}</td>
                <td className={holding.unrealized_gain_loss >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(holding.unrealized_gain_loss, holding.currency_code)}
                </td>
                <td>{holding.currency_code}</td>
                <td>{holding.sector || 'N/A'}</td>
                <td>
                  <span className={`investment-location ${holding.investment_type.toLowerCase()}`}>
                    {holding.investment_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvestments = () => {
    if (investments.length === 0) {
      fetchInvestmentUniverse();
    }

    return (
      <div className="swf-investments">
        <div className="investments-header">
          <h3>Investment Universe</h3>
          <div className="investment-filters">
            <select onChange={(e) => console.log('Filter by type:', e.target.value)}>
              <option value="">All Types</option>
              <option value="equity">Equities</option>
              <option value="government_bond">Government Bonds</option>
              <option value="corporate_bond">Corporate Bonds</option>
              <option value="index_fund">Index Funds</option>
            </select>
            <select onChange={(e) => console.log('Filter by currency:', e.target.value)}>
              <option value="">All Currencies</option>
              <option value="TER">Terran Credit</option>
              <option value="ALC">Alpha Centauri Dollar</option>
              <option value="VEG">Vega Prime Yuan</option>
            </select>
          </div>
        </div>

        <div className="investments-table">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Price</th>
                <th>Yield/Coupon</th>
                <th>Currency</th>
                <th>Sector</th>
                <th>Issuer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(investment => (
                <tr key={investment.id}>
                  <td className="asset-name">
                    <div>
                      <strong>{investment.asset_name}</strong>
                      <div className="asset-symbol">{investment.asset_symbol}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`asset-type ${investment.asset_type}`}>
                      {investment.asset_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatCurrency(investment.current_price, investment.currency_code)}</td>
                  <td>
                    {investment.dividend_yield ? formatPercentage(investment.dividend_yield) : 
                     investment.coupon_rate ? formatPercentage(investment.coupon_rate) : 'N/A'}
                  </td>
                  <td>{investment.currency_code}</td>
                  <td>{investment.sector || 'N/A'}</td>
                  <td>{investment.issuing_civilization_name}</td>
                  <td>
                    <button 
                      className="invest-button"
                      onClick={() => console.log('Invest in:', investment.asset_name)}
                    >
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
  };

  const renderKnobs = () => (
    <div className="swf-knobs">
      <h3>Investment Strategy Controls</h3>
      <div className="knobs-grid">
        {Object.entries(knobs).map(([knobName, knobData]: [string, any]) => (
          <div key={knobName} className="knob-control">
            <label>{knobName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
            <div className="knob-input">
              <input
                type="range"
                min={knobData.min}
                max={knobData.max}
                defaultValue={knobData.default}
                onChange={(e) => console.log(`${knobName}: ${e.target.value}`)}
              />
              <span className="knob-value">{knobData.default} {knobData.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <BaseScreen screenId={screenId} title={title} icon={icon} gameContext={gameContext}>
        <div className="loading-state">Loading Sovereign Wealth Fund data...</div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen screenId={screenId} title={title} icon={icon} gameContext={gameContext}>
      <div className="sovereign-wealth-fund-screen">
        <div className="swf-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'holdings' ? 'active' : ''}
            onClick={() => setActiveTab('holdings')}
          >
            Holdings
          </button>
          <button 
            className={activeTab === 'investments' ? 'active' : ''}
            onClick={() => setActiveTab('investments')}
          >
            Investment Universe
          </button>
          <button 
            className={activeTab === 'knobs' ? 'active' : ''}
            onClick={() => setActiveTab('knobs')}
          >
            Strategy Controls
          </button>
        </div>

        <div className="swf-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'holdings' && renderHoldings()}
          {activeTab === 'investments' && renderInvestments()}
          {activeTab === 'knobs' && renderKnobs()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default SovereignWealthFundScreen;

