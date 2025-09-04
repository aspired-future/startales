/**
 * Business Cycle Screen - Economic Cycle Management
 * 
 * This screen focuses on business cycle analysis and management including:
 * - Current economic phase tracking
 * - GDP growth and recession dynamics
 * - Economic indicators monitoring
 * - Cycle history and predictions
 * - Policy intervention tools
 * 
 * Theme: Economic (green color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from './BaseScreen';
import './BusinessCycleScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../Charts';

interface BusinessCycleData {
  campaignId: string;
  civilizationId: string;
  currentPhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  cycleLength: number;
  gdpGrowthRate: number;
  unemploymentRate: number;
  inflationRate: number;
  consumerConfidence: number;
  businessInvestment: number;
  governmentSpending: number;
  tradeBalance: number;
  lastUpdated: Date;
}

interface BusinessCycleMetrics {
  cycleHistory: BusinessCyclePhase[];
  averageCycleLength: number;
  volatilityIndex: number;
  recessionProbability: number;
  expansionStrength: number;
  economicIndicators: EconomicIndicator[];
}

interface BusinessCyclePhase {
  phase: string;
  startDate: Date;
  endDate?: Date;
  duration: number;
  peakGDP: number;
  troughGDP: number;
  severity: 'mild' | 'moderate' | 'severe';
}

interface EconomicIndicator {
  name: string;
  value: number;
  trend: 'rising' | 'falling' | 'stable';
  significance: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

interface PolicyLever {
  id: string;
  name: string;
  category: 'monetary' | 'fiscal' | 'regulatory';
  currentValue: number;
  minValue: number;
  maxValue: number;
  description: string;
  impact: string;
  lastAdjusted: Date;
}

interface CycleData {
  current: BusinessCycleData;
  metrics: BusinessCycleMetrics;
  policyLevers: PolicyLever[];
  forecasts: any[];
}

const BusinessCycleScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'history' | 'policy' | 'forecasts'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'indicators', label: 'Indicators', icon: '📈' },
    { id: 'history', label: 'Cycle History', icon: '📜' },
    { id: 'policy', label: 'Policy Levers', icon: '⚙️' },
    { id: 'forecasts', label: 'Forecasts', icon: '🔮' }
  ];

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/business-cycle', description: 'Get current business cycle data' },
    { method: 'GET', path: '/api/business-cycle/metrics', description: 'Get cycle metrics and history' },
    { method: 'GET', path: '/api/business-cycle/indicators', description: 'Get economic indicators' },
    { method: 'POST', path: '/api/business-cycle/policy', description: 'Adjust policy levers' },
    { method: 'GET', path: '/api/business-cycle/forecasts', description: 'Get economic forecasts' }
  ];

  const fetchCycleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/business-cycle');
      if (response.ok) {
        const apiData = await response.json();
        setCycleData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch business cycle data:', err);
      
      // Comprehensive mock data
      const mockCurrent: BusinessCycleData = {
        campaignId: 'camp-001',
        civilizationId: 'civ-001',
        currentPhase: 'expansion',
        cycleLength: 84,
        gdpGrowthRate: 3.2,
        unemploymentRate: 4.1,
        inflationRate: 2.8,
        consumerConfidence: 78.5,
        businessInvestment: 12.4,
        governmentSpending: 8.7,
        tradeBalance: 2.1,
        lastUpdated: new Date()
      };

      const mockPhases: BusinessCyclePhase[] = [
        {
          phase: 'expansion',
          startDate: new Date('2387-01-01'),
          duration: 84,
          peakGDP: 3.2,
          troughGDP: -0.5,
          severity: 'mild'
        },
        {
          phase: 'contraction',
          startDate: new Date('2386-08-15'),
          endDate: new Date('2386-12-31'),
          duration: 138,
          peakGDP: 2.8,
          troughGDP: -1.2,
          severity: 'moderate'
        },
        {
          phase: 'expansion',
          startDate: new Date('2385-10-01'),
          endDate: new Date('2386-08-14'),
          duration: 318,
          peakGDP: 4.1,
          troughGDP: 0.8,
          severity: 'mild'
        }
      ];

      const mockIndicators: EconomicIndicator[] = [
        {
          name: 'Leading Economic Index',
          value: 112.4,
          trend: 'rising',
          significance: 'high',
          lastUpdated: new Date()
        },
        {
          name: 'Consumer Spending',
          value: 78.9,
          trend: 'stable',
          significance: 'high',
          lastUpdated: new Date()
        },
        {
          name: 'Business Investment',
          value: 65.2,
          trend: 'rising',
          significance: 'medium',
          lastUpdated: new Date()
        },
        {
          name: 'Employment Rate',
          value: 95.9,
          trend: 'rising',
          significance: 'high',
          lastUpdated: new Date()
        },
        {
          name: 'Manufacturing Output',
          value: 108.7,
          trend: 'stable',
          significance: 'medium',
          lastUpdated: new Date()
        },
        {
          name: 'Housing Starts',
          value: 89.3,
          trend: 'falling',
          significance: 'low',
          lastUpdated: new Date()
        }
      ];

      const mockMetrics: BusinessCycleMetrics = {
        cycleHistory: mockPhases,
        averageCycleLength: 180,
        volatilityIndex: 0.34,
        recessionProbability: 0.15,
        expansionStrength: 0.78,
        economicIndicators: mockIndicators
      };

      const mockPolicyLevers: PolicyLever[] = [
        {
          id: 'interest-rate',
          name: 'Interest Rate',
          category: 'monetary',
          currentValue: 2.5,
          minValue: 0.0,
          maxValue: 10.0,
          description: 'Central bank interest rate affecting borrowing costs',
          impact: 'Lower rates stimulate growth, higher rates control inflation',
          lastAdjusted: new Date('2387-03-15')
        },
        {
          id: 'government-spending',
          name: 'Government Spending',
          category: 'fiscal',
          currentValue: 8.7,
          minValue: 5.0,
          maxValue: 15.0,
          description: 'Government expenditure as percentage of GDP',
          impact: 'Higher spending stimulates economy, lower spending reduces debt',
          lastAdjusted: new Date('2387-02-01')
        },
        {
          id: 'tax-rate',
          name: 'Corporate Tax Rate',
          category: 'fiscal',
          currentValue: 25.0,
          minValue: 15.0,
          maxValue: 40.0,
          description: 'Corporate income tax rate',
          impact: 'Lower taxes encourage investment, higher taxes increase revenue',
          lastAdjusted: new Date('2387-01-01')
        },
        {
          id: 'money-supply',
          name: 'Money Supply Growth',
          category: 'monetary',
          currentValue: 4.2,
          minValue: 0.0,
          maxValue: 12.0,
          description: 'Annual growth rate of money supply',
          impact: 'Higher growth stimulates economy but may cause inflation',
          lastAdjusted: new Date('2387-03-01')
        },
        {
          id: 'regulation-index',
          name: 'Business Regulation Index',
          category: 'regulatory',
          currentValue: 6.8,
          minValue: 3.0,
          maxValue: 10.0,
          description: 'Level of business regulation and compliance requirements',
          impact: 'Lower regulation encourages business, higher regulation protects consumers',
          lastAdjusted: new Date('2387-02-15')
        }
      ];

      const mockForecasts = [
        {
          period: 'Q2 2387',
          gdpGrowth: 3.1,
          unemployment: 4.0,
          inflation: 2.9,
          confidence: 0.82
        },
        {
          period: 'Q3 2387',
          gdpGrowth: 2.8,
          unemployment: 4.2,
          inflation: 3.1,
          confidence: 0.75
        },
        {
          period: 'Q4 2387',
          gdpGrowth: 2.5,
          unemployment: 4.5,
          inflation: 3.0,
          confidence: 0.68
        },
        {
          period: 'Q1 2388',
          gdpGrowth: 2.2,
          unemployment: 4.8,
          inflation: 2.8,
          confidence: 0.61
        }
      ];

      setCycleData({
        current: mockCurrent,
        metrics: mockMetrics,
        policyLevers: mockPolicyLevers,
        forecasts: mockForecasts
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCycleData();
  }, [fetchCycleData]);

  // Utility functions
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'expansion': return '#10b981';
      case 'peak': return '#3b82f6';
      case 'contraction': return '#ef4444';
      case 'trough': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return '#10b981';
      case 'falling': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'severe': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'monetary': return '#3b82f6';
      case 'fiscal': return '#10b981';
      case 'regulatory': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  // Chart data
  const phaseData = cycleData ? [
    { label: 'Expansion', value: cycleData.metrics.cycleHistory.filter(p => p.phase === 'expansion').length },
    { label: 'Peak', value: cycleData.metrics.cycleHistory.filter(p => p.phase === 'peak').length },
    { label: 'Contraction', value: cycleData.metrics.cycleHistory.filter(p => p.phase === 'contraction').length },
    { label: 'Trough', value: cycleData.metrics.cycleHistory.filter(p => p.phase === 'trough').length }
  ] : [];

  const indicatorData = cycleData?.metrics.economicIndicators.map(indicator => ({
    label: indicator.name.substring(0, 15) + '...',
    value: indicator.value
  })) || [];

  const forecastData = cycleData?.forecasts.map(forecast => ({
    label: forecast.period,
    value: forecast.gdpGrowth
  })) || [];

  const renderOverview = () => (
    <>
      {/* Current Cycle Status */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Current Business Cycle Status</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Current Phase</span>
            <span className="standard-metric-value" style={{ color: getPhaseColor(cycleData?.current.currentPhase || '') }}>
              {cycleData?.current.currentPhase?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
          <div className="standard-metric">
            <span>GDP Growth Rate</span>
            <span className="standard-metric-value" style={{ color: cycleData?.current.gdpGrowthRate >= 0 ? '#10b981' : '#ef4444' }}>
              {cycleData?.current.gdpGrowthRate || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Unemployment Rate</span>
            <span className="standard-metric-value" style={{ color: cycleData?.current.unemploymentRate <= 5 ? '#10b981' : '#ef4444' }}>
              {cycleData?.current.unemploymentRate || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Inflation Rate</span>
            <span className="standard-metric-value" style={{ color: cycleData?.current.inflationRate <= 3 ? '#10b981' : '#ef4444' }}>
              {cycleData?.current.inflationRate || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Consumer Confidence</span>
            <span className="standard-metric-value" style={{ color: cycleData?.current.consumerConfidence >= 70 ? '#10b981' : '#ef4444' }}>
              {cycleData?.current.consumerConfidence || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Cycle Length</span>
            <span className="standard-metric-value">
              {cycleData?.current.cycleLength || 0} days
            </span>
          </div>
        </div>
      </div>

      {/* Cycle Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📈 Business Cycle Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Phase Distribution
            </h4>
            <PieChart data={phaseData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Economic Indicators
            </h4>
            <BarChart data={indicatorData} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--economic-accent)', marginBottom: '10px', textAlign: 'center' }}>
              GDP Growth Forecast
            </h4>
            <LineChart data={forecastData} />
          </div>
        </div>
      </div>
    </>
  );

  const renderIndicators = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">📈 Economic Indicators</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Current Value</th>
              <th>Trend</th>
              <th>Significance</th>
              <th>Last Updated</th>
              <th>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {cycleData?.metrics.economicIndicators.map(indicator => (
              <tr key={indicator.name}>
                <td style={{ fontWeight: 'bold' }}>{indicator.name}</td>
                <td>{indicator.value.toFixed(1)}</td>
                <td>
                  <span style={{ color: getTrendColor(indicator.trend) }}>
                    {getTrendIcon(indicator.trend)} {indicator.trend.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: indicator.significance === 'high' ? '#ef4444' : 
                           indicator.significance === 'medium' ? '#f59e0b' : '#10b981',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {indicator.significance}
                  </span>
                </td>
                <td>{indicator.lastUpdated.toLocaleDateString()}</td>
                <td>
                  <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
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

  const renderHistory = () => (
    <>
      {/* Cycle Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Cycle Metrics</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Average Cycle Length</span>
            <span className="standard-metric-value">
              {cycleData?.metrics.averageCycleLength || 0} days
            </span>
          </div>
          <div className="standard-metric">
            <span>Volatility Index</span>
            <span className="standard-metric-value" style={{ color: cycleData?.metrics.volatilityIndex <= 0.5 ? '#10b981' : '#ef4444' }}>
              {cycleData?.metrics.volatilityIndex?.toFixed(2) || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Recession Probability</span>
            <span className="standard-metric-value" style={{ color: cycleData?.metrics.recessionProbability <= 0.3 ? '#10b981' : '#ef4444' }}>
              {((cycleData?.metrics.recessionProbability || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Expansion Strength</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {((cycleData?.metrics.expansionStrength || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Historical Phases */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">📜 Historical Business Cycles</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Peak GDP</th>
                <th>Trough GDP</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {cycleData?.metrics.cycleHistory.map((phase, index) => (
                <tr key={index}>
                  <td>
                    <span style={{ 
                      color: getPhaseColor(phase.phase),
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {phase.phase}
                    </span>
                  </td>
                  <td>{phase.startDate.toLocaleDateString()}</td>
                  <td>{phase.endDate ? phase.endDate.toLocaleDateString() : 'Ongoing'}</td>
                  <td>{phase.duration} days</td>
                  <td style={{ color: '#10b981' }}>{phase.peakGDP.toFixed(1)}%</td>
                  <td style={{ color: '#ef4444' }}>{phase.troughGDP.toFixed(1)}%</td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(phase.severity),
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {phase.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderPolicy = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">⚙️ Economic Policy Levers</h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        {cycleData?.policyLevers.map(lever => (
          <div key={lever.id} className="standard-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h4 style={{ color: 'var(--economic-accent)', margin: '0' }}>
                {lever.name}
              </h4>
              <span style={{ 
                color: getCategoryColor(lever.category),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.8em'
              }}>
                {lever.category}
              </span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Current Value: <strong>{lever.currentValue}%</strong></span>
                <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                  Range: {lever.minValue}% - {lever.maxValue}%
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${((lever.currentValue - lever.minValue) / (lever.maxValue - lever.minValue)) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--economic-accent)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <p style={{ marginBottom: '10px', fontSize: '0.9em' }}>
              {lever.description}
            </p>
            <p style={{ marginBottom: '15px', fontSize: '0.8em', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              <strong>Impact:</strong> {lever.impact}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                Last adjusted: {lever.lastAdjusted.toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                  Decrease
                </button>
                <button className="standard-btn economic-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                  Increase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForecasts = () => (
    <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
      <h3 className="standard-card-title">🔮 Economic Forecasts</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>GDP Growth</th>
              <th>Unemployment</th>
              <th>Inflation</th>
              <th>Confidence Level</th>
              <th>Outlook</th>
            </tr>
          </thead>
          <tbody>
            {cycleData?.forecasts.map((forecast, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 'bold' }}>{forecast.period}</td>
                <td style={{ color: forecast.gdpGrowth >= 0 ? '#10b981' : '#ef4444' }}>
                  {forecast.gdpGrowth >= 0 ? '+' : ''}{forecast.gdpGrowth.toFixed(1)}%
                </td>
                <td style={{ color: forecast.unemployment <= 5 ? '#10b981' : '#ef4444' }}>
                  {forecast.unemployment.toFixed(1)}%
                </td>
                <td style={{ color: forecast.inflation <= 3 ? '#10b981' : '#ef4444' }}>
                  {forecast.inflation.toFixed(1)}%
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '6px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${forecast.confidence * 100}%`,
                        height: '100%',
                        backgroundColor: 'var(--economic-accent)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.8em' }}>
                      {(forecast.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    color: forecast.gdpGrowth >= 2 ? '#10b981' : 
                           forecast.gdpGrowth >= 0 ? '#f59e0b' : '#ef4444'
                  }}>
                    {forecast.gdpGrowth >= 2 ? 'Positive' : 
                     forecast.gdpGrowth >= 0 ? 'Cautious' : 'Negative'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      onRefresh={fetchCycleData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && cycleData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'indicators' && renderIndicators()}
              {activeTab === 'history' && renderHistory()}
              {activeTab === 'policy' && renderPolicy()}
              {activeTab === 'forecasts' && renderForecasts()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading business cycle data...' : 
               error ? `Error: ${error}` : 
               'No business cycle data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default BusinessCycleScreen;
