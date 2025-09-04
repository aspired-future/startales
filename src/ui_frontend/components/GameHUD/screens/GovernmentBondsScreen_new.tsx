/**
 * Government Bonds Screen - Sovereign Debt Management
 * 
 * This screen focuses on government bond management including:
 * - Bond issuance and auction management
 * - Debt service tracking and analysis
 * - Credit rating and market performance
 * - Yield curve analysis and forecasting
 * - Investor relations and market making
 * 
 * Theme: Economic (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from './BaseScreen';
import './GovernmentBondsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../Charts';

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
  duration: number;
  convexity: number;
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
  creditRating: string;
  ratingOutlook: 'stable' | 'positive' | 'negative';
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
  competitiveYield: number;
  nonCompetitiveAccepted: number;
}

interface YieldCurvePoint {
  maturity: string;
  yield: number;
  duration: number;
}

interface BondsData {
  bonds: GovernmentBond[];
  debtSummary: DebtServiceSummary;
  auctions: BondAuction[];
  yieldCurve: YieldCurvePoint[];
  marketData: any[];
}

const GovernmentBondsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [bondsData, setBondsData] = useState<BondsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bonds' | 'auctions' | 'yield-curve' | 'debt-service'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBond, setSelectedBond] = useState<GovernmentBond | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bonds', label: 'Bonds', icon: '📜' },
    { id: 'auctions', label: 'Auctions', icon: '🏛️' },
    { id: 'yield-curve', label: 'Yield Curve', icon: '📈' },
    { id: 'debt-service', label: 'Debt Service', icon: '💰' }
  ];

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/government-bonds', description: 'Get government bonds data' },
    { method: 'GET', path: '/api/government-bonds/debt-summary', description: 'Get debt service summary' },
    { method: 'GET', path: '/api/government-bonds/auctions', description: 'Get bond auctions' },
    { method: 'GET', path: '/api/government-bonds/yield-curve', description: 'Get yield curve data' },
    { method: 'POST', path: '/api/government-bonds/issue', description: 'Issue new bonds' },
    { method: 'POST', path: '/api/government-bonds/auction', description: 'Schedule bond auction' }
  ];

  const fetchBondsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/government-bonds');
      if (response.ok) {
        const apiData = await response.json();
        setBondsData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch government bonds data:', err);
      
      // Comprehensive mock data
      const mockBonds: GovernmentBond[] = [
        {
          id: 1,
          bondSeries: 'GCR-2387-10Y',
          bondType: 'Treasury Bond',
          issueDate: '2387-01-15',
          maturityDate: '2397-01-15',
          currencyCode: 'GCR',
          faceValue: 1000,
          couponRate: 4.25,
          totalOutstanding: 50000000000,
          creditRating: 'AAA',
          purpose: 'Infrastructure Development',
          currentPrice: 98.75,
          yield: 4.38,
          priceChange: -0.25,
          duration: 8.2,
          convexity: 0.85
        },
        {
          id: 2,
          bondSeries: 'GCR-2387-5Y',
          bondType: 'Treasury Note',
          issueDate: '2387-03-01',
          maturityDate: '2392-03-01',
          currencyCode: 'GCR',
          faceValue: 1000,
          couponRate: 3.75,
          totalOutstanding: 25000000000,
          creditRating: 'AAA',
          purpose: 'General Government Operations',
          currentPrice: 101.20,
          yield: 3.52,
          priceChange: 0.15,
          duration: 4.6,
          convexity: 0.42
        },
        {
          id: 3,
          bondSeries: 'GCR-2387-2Y',
          bondType: 'Treasury Note',
          issueDate: '2387-06-15',
          maturityDate: '2389-06-15',
          currencyCode: 'GCR',
          faceValue: 1000,
          couponRate: 2.85,
          totalOutstanding: 15000000000,
          creditRating: 'AAA',
          purpose: 'Defense Modernization',
          currentPrice: 99.85,
          yield: 2.92,
          priceChange: -0.05,
          duration: 1.9,
          convexity: 0.18
        },
        {
          id: 4,
          bondSeries: 'GCR-2387-30Y',
          bondType: 'Long Bond',
          issueDate: '2387-09-01',
          maturityDate: '2417-09-01',
          currencyCode: 'GCR',
          faceValue: 1000,
          couponRate: 5.15,
          totalOutstanding: 20000000000,
          creditRating: 'AAA',
          purpose: 'Space Exploration Program',
          currentPrice: 95.40,
          yield: 5.42,
          priceChange: -0.60,
          duration: 18.5,
          convexity: 3.2
        }
      ];

      const mockDebtSummary: DebtServiceSummary = {
        totalOutstandingDebt: 110000000000,
        monthlyDebtService: 850000000,
        annualDebtService: 10200000000,
        debtToGdpRatio: 45.8,
        averageInterestRate: 4.12,
        averageMaturity: 8.7,
        currencyBreakdown: {
          'GCR': 95000000000,
          'UCR': 10000000000,
          'ECR': 5000000000
        },
        nextPaymentDate: '2387-12-15',
        nextPaymentAmount: 2100000000,
        creditRating: 'AAA',
        ratingOutlook: 'stable'
      };

      const mockAuctions: BondAuction[] = [
        {
          id: 1,
          auctionType: 'Competitive',
          bondSeries: 'GCR-2388-10Y',
          auctionDate: '2387-12-01',
          bondsOffered: 5000000000,
          bondsSold: 4850000000,
          averagePrice: 99.25,
          bidToCoverRatio: 2.8,
          auctionStatus: 'Completed',
          totalProceeds: 4813250000,
          competitiveYield: 4.42,
          nonCompetitiveAccepted: 850000000
        },
        {
          id: 2,
          auctionType: 'Dutch',
          bondSeries: 'GCR-2388-5Y',
          auctionDate: '2387-11-15',
          bondsOffered: 3000000000,
          bondsSold: 2950000000,
          averagePrice: 100.15,
          bidToCoverRatio: 3.2,
          auctionStatus: 'Completed',
          totalProceeds: 2954425000,
          competitiveYield: 3.68,
          nonCompetitiveAccepted: 450000000
        },
        {
          id: 3,
          auctionType: 'Competitive',
          bondSeries: 'GCR-2388-2Y',
          auctionDate: '2387-12-15',
          bondsOffered: 2000000000,
          bondsSold: 0,
          averagePrice: 0,
          bidToCoverRatio: 0,
          auctionStatus: 'Scheduled',
          totalProceeds: 0,
          competitiveYield: 0,
          nonCompetitiveAccepted: 0
        }
      ];

      const mockYieldCurve: YieldCurvePoint[] = [
        { maturity: '3M', yield: 2.15, duration: 0.25 },
        { maturity: '6M', yield: 2.35, duration: 0.5 },
        { maturity: '1Y', yield: 2.65, duration: 1.0 },
        { maturity: '2Y', yield: 2.92, duration: 1.9 },
        { maturity: '3Y', yield: 3.18, duration: 2.8 },
        { maturity: '5Y', yield: 3.52, duration: 4.6 },
        { maturity: '7Y', yield: 3.85, duration: 6.2 },
        { maturity: '10Y', yield: 4.38, duration: 8.2 },
        { maturity: '20Y', yield: 4.95, duration: 14.8 },
        { maturity: '30Y', yield: 5.42, duration: 18.5 }
      ];

      const mockMarketData = [
        { date: '2387-11-01', yield10Y: 4.25, yield2Y: 2.85, spread: 1.40 },
        { date: '2387-11-08', yield10Y: 4.32, yield2Y: 2.88, spread: 1.44 },
        { date: '2387-11-15', yield10Y: 4.28, yield2Y: 2.90, spread: 1.38 },
        { date: '2387-11-22', yield10Y: 4.35, yield2Y: 2.92, spread: 1.43 },
        { date: '2387-11-29', yield10Y: 4.38, yield2Y: 2.92, spread: 1.46 }
      ];

      setBondsData({
        bonds: mockBonds,
        debtSummary: mockDebtSummary,
        auctions: mockAuctions,
        yieldCurve: mockYieldCurve,
        marketData: mockMarketData
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBondsData();
  }, [fetchBondsData]);

  // Utility functions
  const getRatingColor = (rating: string) => {
    if (rating.startsWith('AAA') || rating.startsWith('AA')) return '#10b981';
    if (rating.startsWith('A')) return '#3b82f6';
    if (rating.startsWith('BBB')) return '#f59e0b';
    return '#ef4444';
  };

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'positive': return '#10b981';
      case 'stable': return '#3b82f6';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAuctionStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Scheduled': return '#3b82f6';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#6b7280';
  };

  // Chart data
  const bondTypeData = bondsData ? [
    { label: 'Treasury Bond', value: bondsData.bonds.filter(b => b.bondType === 'Treasury Bond').length },
    { label: 'Treasury Note', value: bondsData.bonds.filter(b => b.bondType === 'Treasury Note').length },
    { label: 'Long Bond', value: bondsData.bonds.filter(b => b.bondType === 'Long Bond').length }
  ] : [];

  const yieldCurveData = bondsData?.yieldCurve.map(point => ({
    label: point.maturity,
    value: point.yield
  })) || [];

  const outstandingData = bondsData?.bonds.map(bond => ({
    label: bond.bondSeries.substring(0, 12) + '...',
    value: bond.totalOutstanding / 1000000000 // Convert to billions
  })) || [];

  const renderOverview = () => (
    <>
      {/* Debt Overview Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Government Debt Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Outstanding Debt</span>
            <span className="standard-metric-value">
              {(bondsData?.debtSummary.totalOutstandingDebt || 0).toLocaleString()} GCR
            </span>
          </div>
          <div className="standard-metric">
            <span>Debt-to-GDP Ratio</span>
            <span className="standard-metric-value" style={{ color: bondsData?.debtSummary.debtToGdpRatio <= 60 ? '#10b981' : '#ef4444' }}>
              {bondsData?.debtSummary.debtToGdpRatio || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Average Interest Rate</span>
            <span className="standard-metric-value">
              {bondsData?.debtSummary.averageInterestRate || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Credit Rating</span>
            <span className="standard-metric-value" style={{ color: getRatingColor(bondsData?.debtSummary.creditRating || '') }}>
              {bondsData?.debtSummary.creditRating || 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Rating Outlook</span>
            <span className="standard-metric-value" style={{ color: getOutlookColor(bondsData?.debtSummary.ratingOutlook || '') }}>
              {bondsData?.debtSummary.ratingOutlook?.toUpperCase() || 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Average Maturity</span>
            <span className="standard-metric-value">
              {bondsData?.debtSummary.averageMaturity || 0} years
            </span>
          </div>
        </div>
      </div>

      {/* Bond Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📈 Bond Market Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Bond Types
            </h4>
            <PieChart data={bondTypeData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Yield Curve
            </h4>
            <LineChart data={yieldCurveData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Outstanding by Series
            </h4>
            <BarChart data={outstandingData} />
          </div>
        </div>
      </div>
    </>
  );

  const renderBonds = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">📜 Government Bonds Portfolio</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Bond Series</th>
              <th>Type</th>
              <th>Coupon Rate</th>
              <th>Current Yield</th>
              <th>Price</th>
              <th>Price Change</th>
              <th>Outstanding</th>
              <th>Maturity</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bondsData?.bonds.map(bond => (
              <tr key={bond.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{bond.bondSeries}</div>
                  <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    {bond.purpose}
                  </div>
                </td>
                <td>{bond.bondType}</td>
                <td>{bond.couponRate.toFixed(2)}%</td>
                <td>{bond.yield?.toFixed(2) || 'N/A'}%</td>
                <td>{bond.currentPrice?.toFixed(2) || 'N/A'}</td>
                <td style={{ color: getPriceChangeColor(bond.priceChange || 0) }}>
                  {bond.priceChange >= 0 ? '+' : ''}{bond.priceChange?.toFixed(2) || 'N/A'}
                </td>
                <td>{bond.totalOutstanding.toLocaleString()} {bond.currencyCode}</td>
                <td>{bond.maturityDate}</td>
                <td>
                  <span style={{ 
                    color: getRatingColor(bond.creditRating),
                    fontWeight: 'bold'
                  }}>
                    {bond.creditRating}
                  </span>
                </td>
                <td>
                  <button 
                    className="standard-btn economic-theme" 
                    style={{ fontSize: '0.8em', padding: '4px 8px' }}
                    onClick={() => setSelectedBond(bond)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuctions = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">🏛️ Bond Auctions</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Bond Series</th>
              <th>Auction Type</th>
              <th>Auction Date</th>
              <th>Bonds Offered</th>
              <th>Bonds Sold</th>
              <th>Average Price</th>
              <th>Bid-to-Cover</th>
              <th>Total Proceeds</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bondsData?.auctions.map(auction => (
              <tr key={auction.id}>
                <td style={{ fontWeight: 'bold' }}>{auction.bondSeries}</td>
                <td>{auction.auctionType}</td>
                <td>{auction.auctionDate}</td>
                <td>{auction.bondsOffered.toLocaleString()}</td>
                <td>{auction.bondsSold.toLocaleString()}</td>
                <td>{auction.averagePrice > 0 ? auction.averagePrice.toFixed(2) : 'N/A'}</td>
                <td style={{ color: auction.bidToCoverRatio >= 2.0 ? '#10b981' : '#ef4444' }}>
                  {auction.bidToCoverRatio > 0 ? auction.bidToCoverRatio.toFixed(1) : 'N/A'}
                </td>
                <td>{auction.totalProceeds.toLocaleString()} GCR</td>
                <td>
                  <span style={{ 
                    color: getAuctionStatusColor(auction.auctionStatus),
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {auction.auctionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderYieldCurve = () => (
    <>
      {/* Yield Curve Chart */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📈 Current Yield Curve</h3>
        <div style={{ height: '300px', padding: '20px' }}>
          <LineChart data={yieldCurveData} />
        </div>
      </div>

      {/* Yield Curve Data Table */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📊 Yield Curve Data Points</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Maturity</th>
                <th>Yield</th>
                <th>Duration</th>
                <th>Spread vs 10Y</th>
                <th>Curve Steepness</th>
              </tr>
            </thead>
            <tbody>
              {bondsData?.yieldCurve.map((point, index) => {
                const tenYearYield = bondsData.yieldCurve.find(p => p.maturity === '10Y')?.yield || 0;
                const spread = point.yield - tenYearYield;
                const nextPoint = bondsData.yieldCurve[index + 1];
                const steepness = nextPoint ? (nextPoint.yield - point.yield) * 100 : 0;
                
                return (
                  <tr key={point.maturity}>
                    <td style={{ fontWeight: 'bold' }}>{point.maturity}</td>
                    <td>{point.yield.toFixed(2)}%</td>
                    <td>{point.duration.toFixed(1)} years</td>
                    <td style={{ color: spread >= 0 ? '#10b981' : '#ef4444' }}>
                      {spread >= 0 ? '+' : ''}{spread.toFixed(2)}bp
                    </td>
                    <td style={{ color: steepness >= 0 ? '#10b981' : '#ef4444' }}>
                      {nextPoint ? `${steepness >= 0 ? '+' : ''}${steepness.toFixed(1)}bp` : 'N/A'}
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

  const renderDebtService = () => (
    <>
      {/* Debt Service Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">💰 Debt Service Analysis</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Monthly Debt Service</span>
            <span className="standard-metric-value">
              {(bondsData?.debtSummary.monthlyDebtService || 0).toLocaleString()} GCR
            </span>
          </div>
          <div className="standard-metric">
            <span>Annual Debt Service</span>
            <span className="standard-metric-value">
              {(bondsData?.debtSummary.annualDebtService || 0).toLocaleString()} GCR
            </span>
          </div>
          <div className="standard-metric">
            <span>Next Payment Date</span>
            <span className="standard-metric-value">
              {bondsData?.debtSummary.nextPaymentDate || 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Next Payment Amount</span>
            <span className="standard-metric-value">
              {(bondsData?.debtSummary.nextPaymentAmount || 0).toLocaleString()} GCR
            </span>
          </div>
        </div>
      </div>

      {/* Currency Breakdown */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">🌍 Debt by Currency</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Outstanding Amount</th>
                <th>Percentage of Total</th>
                <th>Exchange Rate Risk</th>
                <th>Hedging Status</th>
              </tr>
            </thead>
            <tbody>
              {bondsData && Object.entries(bondsData.debtSummary.currencyBreakdown).map(([currency, amount]) => {
                const percentage = (amount / bondsData.debtSummary.totalOutstandingDebt) * 100;
                const isBaseCurrency = currency === 'GCR';
                
                return (
                  <tr key={currency}>
                    <td style={{ fontWeight: 'bold' }}>{currency}</td>
                    <td>{amount.toLocaleString()} {currency}</td>
                    <td>{percentage.toFixed(1)}%</td>
                    <td>
                      <span style={{ color: isBaseCurrency ? '#10b981' : '#f59e0b' }}>
                        {isBaseCurrency ? 'None' : 'Medium'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: isBaseCurrency ? '#6b7280' : '#3b82f6' }}>
                        {isBaseCurrency ? 'N/A' : 'Partially Hedged'}
                      </span>
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
      onRefresh={fetchBondsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && bondsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'bonds' && renderBonds()}
              {activeTab === 'auctions' && renderAuctions()}
              {activeTab === 'yield-curve' && renderYieldCurve()}
              {activeTab === 'debt-service' && renderDebtService()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading government bonds data...' : 
               error ? `Error: ${error}` : 
               'No government bonds data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GovernmentBondsScreen;
