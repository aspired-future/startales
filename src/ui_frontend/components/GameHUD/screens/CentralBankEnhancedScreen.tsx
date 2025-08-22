import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './CentralBankEnhancedScreen.css';

interface Reserve {
  id: number;
  reserve_type: string;
  currency_code?: string;
  amount: number;
  market_value_local: number;
  display_name: string;
  credit_rating?: string;
  liquidity_rating: string;
  strategic_purpose: string;
}

interface CurrencyHolding {
  currency_code: string;
  currency_name: string;
  amount: number;
  exchange_rate: number;
  target_allocation_percent: number;
  actual_allocation_percent: number;
  allocation_status: string;
  credit_rating: string;
  yield_rate: number;
}

interface QEProgram {
  id: number;
  program_name: string;
  program_type: string;
  target_amount: number;
  purchased_amount: number;
  completion_percentage: number;
  status: string;
  effective_status: string;
  start_date: string;
  end_date: string;
  economic_justification: string;
}

interface MoneySupplyData {
  measurement_date: string;
  m0_currency_circulation: number;
  m1_narrow_money: number;
  m2_broad_money: number;
  money_multiplier: number;
  inflation_rate_annual: number;
  target_growth_rate: number;
  actual_growth_rate: number;
}

interface InterestRates {
  policy_rate: number;
  deposit_facility_rate: number;
  marginal_lending_rate: number;
  corridor_width: number;
  decision_rationale: string;
  forward_guidance: string;
  days_since_change: number;
}

const CentralBankEnhancedScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [knobs, setKnobs] = useState<any>({});
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyHolding[]>([]);
  const [qePrograms, setQePrograms] = useState<QEProgram[]>([]);
  const [moneySupply, setMoneySupply] = useState<MoneySupplyData | null>(null);
  const [interestRates, setInterestRates] = useState<InterestRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const civilizationId = gameContext?.playerId || '1';

  useEffect(() => {
    fetchDashboardData();
  }, [civilizationId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/central-bank-enhanced/dashboard/${civilizationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch central bank data');
      }

      const result = await response.json();
      
      if (result.success) {
        // Set knobs data from dashboard response
        if (result.data.knobs) {
          setKnobs(result.data.knobs);
        }
        
        // Fetch detailed data for each section
        await Promise.all([
          fetchReserves(),
          fetchCurrencies(),
          fetchQEPrograms(),
          fetchMoneySupply(),
          fetchInterestRates()
        ]);
      } else {
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to connect to central bank systems');
    } finally {
      setLoading(false);
    }
  };

  const fetchReserves = async () => {
    try {
      const response = await fetch(`/api/central-bank-enhanced/reserves/${civilizationId}`);
      const result = await response.json();
      if (result.success) {
        setReserves(result.data);
      }
    } catch (err) {
      console.error('Error fetching reserves:', err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`/api/central-bank-enhanced/currencies/${civilizationId}`);
      const result = await response.json();
      if (result.success) {
        setCurrencies(result.data);
      }
    } catch (err) {
      console.error('Error fetching currencies:', err);
    }
  };

  const fetchQEPrograms = async () => {
    try {
      const response = await fetch(`/api/central-bank-enhanced/quantitative-easing/${civilizationId}`);
      const result = await response.json();
      if (result.success) {
        setQePrograms(result.data);
      }
    } catch (err) {
      console.error('Error fetching QE programs:', err);
    }
  };

  const fetchMoneySupply = async () => {
    try {
      const response = await fetch(`/api/central-bank-enhanced/money-supply/${civilizationId}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setMoneySupply(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching money supply:', err);
    }
  };

  const fetchInterestRates = async () => {
    try {
      const response = await fetch(`/api/central-bank-enhanced/interest-rates/${civilizationId}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setInterestRates(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching interest rates:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'planned': return '#2196F3';
      case 'completed': return '#9C27B0';
      case 'overweight': return '#FF9800';
      case 'underweight': return '#F44336';
      case 'balanced': return '#4CAF50';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <div className="central-bank-enhanced-screen">
        <div className="screen-header">
          <h2>{icon} {title}</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Central Bank Systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="central-bank-enhanced-screen">
        <div className="screen-header">
          <h2>{icon} {title}</h2>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="central-bank-enhanced-screen">
      <div className="screen-header">
        <h2>{icon} Enhanced Central Bank</h2>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Total Reserves</span>
            <span className="stat-value">
              {formatCurrency(reserves.reduce((sum, r) => sum + r.market_value_local, 0))}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Policy Rate</span>
            <span className="stat-value">
              {interestRates ? formatPercent(interestRates.policy_rate) : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Money Supply (M2)</span>
            <span className="stat-value">
              {moneySupply ? formatCurrency(moneySupply.m2_broad_money) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'reserves' ? 'active' : ''}`}
          onClick={() => setActiveTab('reserves')}
        >
          🏆 Reserves
        </button>
        <button 
          className={`tab-button ${activeTab === 'currencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('currencies')}
        >
          💱 Currencies
        </button>
        <button 
          className={`tab-button ${activeTab === 'quantitative-easing' ? 'active' : ''}`}
          onClick={() => setActiveTab('quantitative-easing')}
        >
          📈 Quantitative Easing
        </button>
        <button 
          className={`tab-button ${activeTab === 'monetary-policy' ? 'active' : ''}`}
          onClick={() => setActiveTab('monetary-policy')}
        >
          🎯 Monetary Policy
        </button>
        <button 
          className={`tab-button ${activeTab === 'knobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('knobs')}
        >
          ⚙️ AI Controls
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>💰 Reserve Composition</h3>
                <div className="reserve-breakdown">
                  {reserves.map((reserve) => (
                    <div key={reserve.id} className="reserve-item">
                      <div className="reserve-info">
                        <span className="reserve-name">{reserve.display_name}</span>
                        <span className="reserve-purpose">{reserve.strategic_purpose}</span>
                      </div>
                      <div className="reserve-value">
                        <span className="amount">{formatCurrency(reserve.market_value_local)}</span>
                        <span className="liquidity">{reserve.liquidity_rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <h3>📊 Money Supply Metrics</h3>
                {moneySupply && (
                  <div className="money-supply-metrics">
                    <div className="metric-row">
                      <span>M0 (Currency)</span>
                      <span>{formatCurrency(moneySupply.m0_currency_circulation)}</span>
                    </div>
                    <div className="metric-row">
                      <span>M1 (Narrow Money)</span>
                      <span>{formatCurrency(moneySupply.m1_narrow_money)}</span>
                    </div>
                    <div className="metric-row">
                      <span>M2 (Broad Money)</span>
                      <span>{formatCurrency(moneySupply.m2_broad_money)}</span>
                    </div>
                    <div className="metric-row">
                      <span>Money Multiplier</span>
                      <span>{moneySupply.money_multiplier.toFixed(2)}x</span>
                    </div>
                    <div className="metric-row">
                      <span>Inflation Rate</span>
                      <span>{formatPercent(moneySupply.inflation_rate_annual || 0)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="dashboard-card">
                <h3>🎯 Interest Rate Corridor</h3>
                {interestRates && (
                  <div className="interest-rate-display">
                    <div className="rate-corridor">
                      <div className="rate-level ceiling">
                        <span className="rate-label">Marginal Lending</span>
                        <span className="rate-value">{formatPercent(interestRates.marginal_lending_rate)}</span>
                      </div>
                      <div className="rate-level policy">
                        <span className="rate-label">Policy Rate</span>
                        <span className="rate-value main">{formatPercent(interestRates.policy_rate)}</span>
                      </div>
                      <div className="rate-level floor">
                        <span className="rate-label">Deposit Facility</span>
                        <span className="rate-value">{formatPercent(interestRates.deposit_facility_rate)}</span>
                      </div>
                    </div>
                    <div className="rate-info">
                      <p><strong>Corridor Width:</strong> {formatPercent(interestRates.corridor_width)}</p>
                      <p><strong>Last Changed:</strong> {interestRates.days_since_change} days ago</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="dashboard-card">
                <h3>📈 Active QE Programs</h3>
                <div className="qe-summary">
                  {qePrograms.filter(qe => qe.status === 'active').map((qe) => (
                    <div key={qe.id} className="qe-program-summary">
                      <div className="qe-header">
                        <span className="qe-name">{qe.program_name}</span>
                        <span className="qe-completion">{qe.completion_percentage}%</span>
                      </div>
                      <div className="qe-progress">
                        <div 
                          className="progress-bar"
                          style={{ width: `${qe.completion_percentage}%` }}
                        ></div>
                      </div>
                      <div className="qe-details">
                        <span>{qe.program_type}</span>
                        <span>{formatCurrency(qe.target_amount)}</span>
                      </div>
                    </div>
                  ))}
                  {qePrograms.filter(qe => qe.status === 'active').length === 0 && (
                    <p className="no-programs">No active QE programs</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reserves' && (
          <div className="reserves-tab">
            <div className="reserves-header">
              <h3>🏆 Central Bank Reserves</h3>
              <div className="reserves-total">
                Total: {formatCurrency(reserves.reduce((sum, r) => sum + r.market_value_local, 0))}
              </div>
            </div>
            <div className="reserves-table">
              <div className="table-header">
                <div>Asset Type</div>
                <div>Amount</div>
                <div>Market Value</div>
                <div>Liquidity</div>
                <div>Purpose</div>
                <div>Rating</div>
              </div>
              {reserves.map((reserve) => (
                <div key={reserve.id} className="table-row">
                  <div className="asset-type">
                    <span className="asset-name">{reserve.display_name}</span>
                    {reserve.currency_code && (
                      <span className="currency-code">{reserve.currency_code}</span>
                    )}
                  </div>
                  <div className="amount">
                    {reserve.reserve_type === 'gold' 
                      ? `${reserve.amount.toLocaleString()} oz`
                      : formatCurrency(reserve.amount)
                    }
                  </div>
                  <div className="market-value">
                    {formatCurrency(reserve.market_value_local)}
                  </div>
                  <div className="liquidity">
                    <span className={`liquidity-badge ${reserve.liquidity_rating}`}>
                      {reserve.liquidity_rating.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="purpose">{reserve.strategic_purpose}</div>
                  <div className="rating">
                    {reserve.credit_rating && (
                      <span className="credit-rating">{reserve.credit_rating}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'currencies' && (
          <div className="currencies-tab">
            <div className="currencies-header">
              <h3>💱 Multi-Currency Holdings</h3>
            </div>
            <div className="currencies-grid">
              {currencies.map((currency) => (
                <div key={currency.currency_code} className="currency-card">
                  <div className="currency-header">
                    <div className="currency-info">
                      <span className="currency-code">{currency.currency_code}</span>
                      <span className="currency-name">{currency.currency_name}</span>
                    </div>
                    <span className="credit-rating">{currency.credit_rating}</span>
                  </div>
                  
                  <div className="currency-metrics">
                    <div className="metric">
                      <span className="label">Holdings</span>
                      <span className="value">{formatCurrency(currency.amount)}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Exchange Rate</span>
                      <span className="value">{currency.exchange_rate.toFixed(6)}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Yield</span>
                      <span className="value">{formatPercent(currency.yield_rate)}</span>
                    </div>
                  </div>

                  <div className="allocation-section">
                    <div className="allocation-header">
                      <span>Allocation</span>
                      <span 
                        className={`allocation-status ${currency.allocation_status}`}
                        style={{ color: getStatusColor(currency.allocation_status) }}
                      >
                        {currency.allocation_status}
                      </span>
                    </div>
                    <div className="allocation-bars">
                      <div className="allocation-bar">
                        <div className="bar-label">Target</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill target"
                            style={{ width: `${currency.target_allocation_percent}%` }}
                          ></div>
                        </div>
                        <div className="bar-value">{formatPercent(currency.target_allocation_percent)}</div>
                      </div>
                      <div className="allocation-bar">
                        <div className="bar-label">Actual</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill actual"
                            style={{ width: `${currency.actual_allocation_percent}%` }}
                          ></div>
                        </div>
                        <div className="bar-value">{formatPercent(currency.actual_allocation_percent)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quantitative-easing' && (
          <div className="qe-tab">
            <div className="qe-header">
              <h3>📈 Quantitative Easing Programs</h3>
              <button className="create-program-btn">+ New Program</button>
            </div>
            <div className="qe-programs">
              {qePrograms.map((qe) => (
                <div key={qe.id} className="qe-program-card">
                  <div className="qe-program-header">
                    <div className="program-info">
                      <h4>{qe.program_name}</h4>
                      <span className="program-type">{qe.program_type.replace('_', ' ')}</span>
                    </div>
                    <div className="program-status">
                      <span 
                        className={`status-badge ${qe.effective_status}`}
                        style={{ backgroundColor: getStatusColor(qe.effective_status) }}
                      >
                        {qe.effective_status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="qe-progress-section">
                    <div className="progress-info">
                      <span>Progress: {qe.completion_percentage}%</span>
                      <span>{formatCurrency(qe.purchased_amount)} / {formatCurrency(qe.target_amount)}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${qe.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="qe-details">
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <span>{new Date(qe.start_date).toLocaleDateString()} - {new Date(qe.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Justification:</span>
                      <span className="justification">{qe.economic_justification}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monetary-policy' && (
          <div className="monetary-policy-tab">
            <div className="policy-header">
              <h3>🎯 Monetary Policy Tools</h3>
            </div>
            
            {interestRates && (
              <div className="policy-section">
                <h4>Interest Rate Management</h4>
                <div className="rate-controls">
                  <div className="rate-input-group">
                    <label>Policy Rate</label>
                    <input 
                      type="number" 
                      step="0.25" 
                      value={interestRates.policy_rate}
                      className="rate-input"
                    />
                  </div>
                  <div className="rate-input-group">
                    <label>Deposit Facility</label>
                    <input 
                      type="number" 
                      step="0.25" 
                      value={interestRates.deposit_facility_rate}
                      className="rate-input"
                    />
                  </div>
                  <div className="rate-input-group">
                    <label>Marginal Lending</label>
                    <input 
                      type="number" 
                      step="0.25" 
                      value={interestRates.marginal_lending_rate}
                      className="rate-input"
                    />
                  </div>
                </div>
                
                <div className="policy-guidance">
                  <h5>Current Forward Guidance</h5>
                  <p>{interestRates.forward_guidance}</p>
                </div>
                
                <div className="policy-rationale">
                  <h5>Decision Rationale</h5>
                  <p>{interestRates.decision_rationale}</p>
                </div>
              </div>
            )}

            {moneySupply && (
              <div className="policy-section">
                <h4>Money Supply Targets</h4>
                <div className="money-supply-targets">
                  <div className="target-item">
                    <span className="target-label">Target Growth Rate</span>
                    <span className="target-value">{formatPercent(moneySupply.target_growth_rate)}</span>
                  </div>
                  <div className="target-item">
                    <span className="target-label">Actual Growth Rate</span>
                    <span className={`target-value ${moneySupply.actual_growth_rate > moneySupply.target_growth_rate ? 'above-target' : 'below-target'}`}>
                      {formatPercent(moneySupply.actual_growth_rate)}
                    </span>
                  </div>
                  <div className="target-item">
                    <span className="target-label">Inflation Target</span>
                    <span className="target-value">2.00%</span>
                  </div>
                  <div className="target-item">
                    <span className="target-label">Current Inflation</span>
                    <span className={`target-value ${(moneySupply.inflation_rate_annual || 0) > 2 ? 'above-target' : 'below-target'}`}>
                      {formatPercent(moneySupply.inflation_rate_annual || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'knobs' && (
          <div className="knobs-tab">
            <div className="knobs-header">
              <h3>⚙️ AI-Controllable Parameters</h3>
              <p>Adjust these knobs to fine-tune central bank operations. The AI will learn from your adjustments.</p>
            </div>
            
            <div className="knobs-grid">
              {Object.entries(knobs).map(([knobName, knobData]: [string, any]) => (
                <div key={knobName} className="knob-control">
                  <label className="knob-label">
                    {knobName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <div className="knob-input-group">
                    <input
                      type="range"
                      min={knobData.min}
                      max={knobData.max}
                      step={knobData.min < 1 ? 0.1 : 1}
                      defaultValue={knobData.default}
                      className="knob-slider"
                      onChange={(e) => console.log(`${knobName}: ${e.target.value}`)}
                    />
                    <div className="knob-value-display">
                      <span className="knob-current-value">{knobData.default}</span>
                      <span className="knob-unit">{knobData.unit}</span>
                    </div>
                  </div>
                  <div className="knob-range">
                    <span className="range-min">{knobData.min}</span>
                    <span className="range-max">{knobData.max}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {Object.keys(knobs).length === 0 && (
              <div className="no-knobs-message">
                <p>Loading AI control parameters...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralBankEnhancedScreen;
