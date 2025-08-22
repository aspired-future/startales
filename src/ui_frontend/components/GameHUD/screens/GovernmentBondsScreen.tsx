/**
 * Government Bonds Screen Component
 * Comprehensive bond management interface
 */

import React, { useState, useEffect } from 'react';

interface GovernmentBond {
  id: number;
  bondSeries: string;
  bondType: string;
  issueDate: string;
  maturityDate: string;
  currencyCode: string;
  faceValue: number;
  couponRate: number;
  totalOutstanding: number;
  creditRating: string;
  purpose: string;
  currentPrice?: number;
  yield?: number;
  priceChange?: number;
}

interface DebtServiceSummary {
  totalOutstandingDebt: number;
  monthlyDebtService: number;
  annualDebtService: number;
  debtToGdpRatio: number;
  averageInterestRate: number;
  averageMaturity: number;
  currencyBreakdown: { [currency: string]: number };
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

interface BondAuction {
  id: number;
  auctionType: string;
  bondSeries: string;
  auctionDate: string;
  bondsOffered: number;
  bondsSold: number;
  averagePrice: number;
  bidToCoverRatio: number;
  auctionStatus: string;
  totalProceeds: number;
}

interface GovernmentBondsScreenProps {
  civilizationId: string;
}

export const GovernmentBondsScreen: React.FC<GovernmentBondsScreenProps> = ({ civilizationId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bonds' | 'auctions' | 'debt-service' | 'issue'>('overview');
  const [bonds, setBonds] = useState<GovernmentBond[]>([]);
  const [debtSummary, setDebtSummary] = useState<DebtServiceSummary | null>(null);
  const [auctions, setAuctions] = useState<BondAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New bond issuance form state
  const [newBondForm, setNewBondForm] = useState({
    bondType: 'treasury',
    purpose: '',
    faceValue: 1000,
    couponRate: 0.035,
    maturityYears: 10,
    currencyCode: 'USC',
    totalAmount: 1000000,
    callable: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, [civilizationId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/government-bonds/dashboard/${civilizationId}`);
      const data = await response.json();

      if (data.success) {
        setBonds(data.data.bonds);
        setDebtSummary(data.data.debtSummary);
        setAuctions(data.data.recentAuctions);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching bonds data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBonds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/government-bonds/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          civilizationId,
          ...newBondForm
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Bonds issued successfully!');
        fetchDashboardData();
        setActiveTab('overview');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Network error occurred');
      console.error('Error issuing bonds:', err);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USC') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'USC' ? 'USD' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const getBondTypeColor = (type: string) => {
    const colors = {
      treasury: '#3b82f6',
      infrastructure: '#10b981',
      war: '#ef4444',
      development: '#8b5cf6',
      green: '#22c55e'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="government-bonds-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Government Bonds data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="government-bonds-screen">
        <div className="error-message">
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="government-bonds-screen">
      <div className="screen-header">
        <h2>💰 Government Bonds Management</h2>
        <p>Issue bonds, manage debt, and monitor market conditions</p>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'bonds', label: '💎 Active Bonds' },
          { id: 'auctions', label: '🏛️ Auctions' },
          { id: 'debt-service', label: '💳 Debt Service' },
          { id: 'issue', label: '➕ Issue New' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && debtSummary && (
          <div className="overview-tab">
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Outstanding Debt</h3>
                <div className="value">{formatCurrency(debtSummary.totalOutstandingDebt)}</div>
                <div className="subtitle">Across all currencies</div>
              </div>
              <div className="summary-card">
                <h3>Debt-to-GDP Ratio</h3>
                <div className="value">{formatPercentage(debtSummary.debtToGdpRatio)}</div>
                <div className="subtitle">Current fiscal health</div>
              </div>
              <div className="summary-card">
                <h3>Average Interest Rate</h3>
                <div className="value">{formatPercentage(debtSummary.averageInterestRate)}</div>
                <div className="subtitle">Weighted average</div>
              </div>
              <div className="summary-card">
                <h3>Next Payment</h3>
                <div className="value">{formatCurrency(debtSummary.nextPaymentAmount)}</div>
                <div className="subtitle">{new Date(debtSummary.nextPaymentDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>Currency Breakdown</h3>
                <div className="currency-breakdown">
                  {Object.entries(debtSummary.currencyBreakdown).map(([currency, amount]) => (
                    <div key={currency} className="currency-item">
                      <span className="currency-code">{currency}</span>
                      <span className="currency-amount">{formatCurrency(amount, currency)}</span>
                      <div className="currency-bar">
                        <div 
                          className="currency-fill" 
                          style={{ 
                            width: `${(amount / debtSummary.totalOutstandingDebt) * 100}%`,
                            backgroundColor: getBondTypeColor(currency.toLowerCase())
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Recent Bond Performance</h3>
                <div className="bond-performance">
                  {bonds.slice(0, 5).map(bond => (
                    <div key={bond.id} className="performance-item">
                      <div className="bond-info">
                        <span className="bond-series">{bond.bondSeries}</span>
                        <span className="bond-type">{bond.bondType}</span>
                      </div>
                      <div className="bond-metrics">
                        <span className="current-yield">{formatPercentage(bond.yield || bond.couponRate)}</span>
                        <span className={`price-change ${(bond.priceChange || 0) >= 0 ? 'positive' : 'negative'}`}>
                          {(bond.priceChange || 0) >= 0 ? '+' : ''}{bond.priceChange?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bonds' && (
          <div className="bonds-tab">
            <div className="bonds-list">
              {bonds.map(bond => (
                <div key={bond.id} className="bond-card">
                  <div className="bond-header">
                    <div className="bond-title">
                      <h3>{bond.bondSeries}</h3>
                      <span 
                        className="bond-type-badge"
                        style={{ backgroundColor: getBondTypeColor(bond.bondType) }}
                      >
                        {bond.bondType}
                      </span>
                    </div>
                    <div className="bond-rating">
                      <span className="rating">{bond.creditRating}</span>
                    </div>
                  </div>

                  <div className="bond-details">
                    <div className="detail-row">
                      <span>Face Value:</span>
                      <span>{formatCurrency(bond.faceValue, bond.currencyCode)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Coupon Rate:</span>
                      <span>{formatPercentage(bond.couponRate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Maturity:</span>
                      <span>{new Date(bond.maturityDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Outstanding:</span>
                      <span>{bond.totalOutstanding.toLocaleString()} bonds</span>
                    </div>
                    <div className="detail-row">
                      <span>Current Price:</span>
                      <span>{formatCurrency(bond.currentPrice || bond.faceValue, bond.currencyCode)}</span>
                    </div>
                  </div>

                  <div className="bond-purpose">
                    <p>{bond.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'auctions' && (
          <div className="auctions-tab">
            <div className="auctions-list">
              {auctions.map(auction => (
                <div key={auction.id} className="auction-card">
                  <div className="auction-header">
                    <h3>{auction.bondSeries}</h3>
                    <span className={`status-badge ${auction.auctionStatus}`}>
                      {auction.auctionStatus}
                    </span>
                  </div>
                  <div className="auction-details">
                    <div className="detail-row">
                      <span>Auction Date:</span>
                      <span>{new Date(auction.auctionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Bonds Offered:</span>
                      <span>{auction.bondsOffered.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Bonds Sold:</span>
                      <span>{auction.bondsSold.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Bid-to-Cover:</span>
                      <span>{auction.bidToCoverRatio.toFixed(2)}x</span>
                    </div>
                    <div className="detail-row">
                      <span>Total Proceeds:</span>
                      <span>{formatCurrency(auction.totalProceeds)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'issue' && (
          <div className="issue-tab">
            <form onSubmit={handleIssueBonds} className="bond-issue-form">
              <h3>Issue New Government Bonds</h3>
              
              <div className="form-group">
                <label>Bond Type:</label>
                <select 
                  value={newBondForm.bondType} 
                  onChange={(e) => setNewBondForm({...newBondForm, bondType: e.target.value})}
                >
                  <option value="treasury">Treasury Bonds</option>
                  <option value="infrastructure">Infrastructure Bonds</option>
                  <option value="green">Green Bonds</option>
                  <option value="development">Development Bonds</option>
                  <option value="war">War Bonds</option>
                </select>
              </div>

              <div className="form-group">
                <label>Purpose:</label>
                <textarea 
                  value={newBondForm.purpose}
                  onChange={(e) => setNewBondForm({...newBondForm, purpose: e.target.value})}
                  placeholder="Describe the purpose of this bond issuance..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Face Value:</label>
                  <input 
                    type="number" 
                    value={newBondForm.faceValue}
                    onChange={(e) => setNewBondForm({...newBondForm, faceValue: parseFloat(e.target.value)})}
                    min="100"
                    step="100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Coupon Rate (%):</label>
                  <input 
                    type="number" 
                    value={newBondForm.couponRate * 100}
                    onChange={(e) => setNewBondForm({...newBondForm, couponRate: parseFloat(e.target.value) / 100})}
                    min="0.1"
                    max="15"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Maturity (Years):</label>
                  <input 
                    type="number" 
                    value={newBondForm.maturityYears}
                    onChange={(e) => setNewBondForm({...newBondForm, maturityYears: parseInt(e.target.value)})}
                    min="1"
                    max="30"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency:</label>
                  <select 
                    value={newBondForm.currencyCode}
                    onChange={(e) => setNewBondForm({...newBondForm, currencyCode: e.target.value})}
                  >
                    <option value="USC">USC (Universal Standard Credits)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                    <option value="JPY">JPY (Japanese Yen)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Total Amount to Raise:</label>
                <input 
                  type="number" 
                  value={newBondForm.totalAmount}
                  onChange={(e) => setNewBondForm({...newBondForm, totalAmount: parseFloat(e.target.value)})}
                  min="100000"
                  step="100000"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={newBondForm.callable}
                    onChange={(e) => setNewBondForm({...newBondForm, callable: e.target.checked})}
                  />
                  Callable (Government can redeem early)
                </label>
              </div>

              <button type="submit" className="issue-button">
                Issue Bonds
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
