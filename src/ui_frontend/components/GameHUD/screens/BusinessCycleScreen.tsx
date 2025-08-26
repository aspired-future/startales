/**
 * Business Cycle Screen Component
 * Displays economic cycle status, growth/recession dynamics, and AI-controllable knobs
 */

import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './BusinessCycleScreen.css';

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

const BusinessCycleScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [businessCycleData, setBusinessCycleData] = useState<BusinessCycleData | null>(null);
  const [metrics, setMetrics] = useState<BusinessCycleMetrics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockBusinessCycleData: BusinessCycleData = {
    campaignId: 'campaign_1',
    civilizationId: 'player_1',
    currentPhase: 'expansion',
    cycleLength: 84,
    gdpGrowthRate: 0.035,
    unemploymentRate: 0.045,
    inflationRate: 0.025,
    consumerConfidence: 0.78,
    businessInvestment: 0.18,
    governmentSpending: 0.22,
    tradeBalance: 0.015,
    lastUpdated: new Date()
  };

  const mockMetrics: BusinessCycleMetrics = {
    cycleHistory: [
      {
        phase: 'expansion',
        startDate: new Date('2024-01-01'),
        duration: 18,
        peakGDP: 2.8e12,
        troughGDP: 2.4e12,
        severity: 'moderate'
      }
    ],
    averageCycleLength: 84,
    volatilityIndex: 0.3,
    recessionProbability: 0.15,
    expansionStrength: 0.7,
    economicIndicators: [
      { name: 'GDP Growth Rate', value: 3.5, trend: 'rising', significance: 'high', lastUpdated: new Date() },
      { name: 'Unemployment Rate', value: 4.5, trend: 'falling', significance: 'high', lastUpdated: new Date() },
      { name: 'Inflation Rate', value: 2.5, trend: 'stable', significance: 'medium', lastUpdated: new Date() },
      { name: 'Consumer Confidence', value: 78, trend: 'rising', significance: 'medium', lastUpdated: new Date() },
      { name: 'Business Investment', value: 18, trend: 'rising', significance: 'high', lastUpdated: new Date() }
    ]
  };



  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setBusinessCycleData(mockBusinessCycleData);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'expansion': return '#4ecdc4';
      case 'peak': return '#45b7d1';
      case 'contraction': return '#f39c12';
      case 'trough': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'expansion': return '📈';
      case 'peak': return '🏔️';
      case 'contraction': return '📉';
      case 'trough': return '🕳️';
      default: return '📊';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '↗️';
      case 'falling': return '↘️';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="business-cycle-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading business cycle data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-cycle-screen error">
        <h3>❌ Error Loading Business Cycle Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="business-cycle-screen">
      <div className="screen-header">
        <h2>{icon} {title}</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'indicators' ? 'active' : ''}`}
            onClick={() => setActiveTab('indicators')}
          >
            📈 Indicators
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 History
          </button>
        </div>
      </div>

      <div className="screen-content">
        {activeTab === 'dashboard' && businessCycleData && (
          <div className="dashboard-tab">
            <div className="cycle-status-card">
              <div className="current-phase">
                <div className="phase-indicator" style={{ color: getPhaseColor(businessCycleData.currentPhase) }}>
                  {getPhaseIcon(businessCycleData.currentPhase)}
                  <h3>{businessCycleData.currentPhase.toUpperCase()}</h3>
                </div>
                <div className="phase-details">
                  <p>Cycle Length: {businessCycleData.cycleLength} months</p>
                  <p>Last Updated: {new Date(businessCycleData.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="key-metrics-grid">
              <div className="metric-card">
                <h4>📈 GDP Growth</h4>
                <div className="metric-value positive">
                  {formatPercentage(businessCycleData.gdpGrowthRate)}
                </div>
                <p>Annual growth rate</p>
              </div>
              
              <div className="metric-card">
                <h4>👥 Unemployment</h4>
                <div className="metric-value negative">
                  {formatPercentage(businessCycleData.unemploymentRate)}
                </div>
                <p>Current unemployment rate</p>
              </div>
              
              <div className="metric-card">
                <h4>💰 Inflation</h4>
                <div className="metric-value neutral">
                  {formatPercentage(businessCycleData.inflationRate)}
                </div>
                <p>Annual inflation rate</p>
              </div>
              
              <div className="metric-card">
                <h4>🛍️ Consumer Confidence</h4>
                <div className="metric-value positive">
                  {Math.round(businessCycleData.consumerConfidence * 100)}
                </div>
                <p>Confidence index</p>
              </div>
            </div>

            {metrics && (
              <div className="analytics-section">
                <h3>📊 Cycle Analytics</h3>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h4>Recession Probability</h4>
                    <div className="probability-bar">
                      <div 
                        className="probability-fill"
                        style={{ 
                          width: `${metrics.recessionProbability * 100}%`,
                          backgroundColor: metrics.recessionProbability > 0.3 ? '#e74c3c' : '#4ecdc4'
                        }}
                      ></div>
                    </div>
                    <p>{formatPercentage(metrics.recessionProbability)}</p>
                  </div>
                  
                  <div className="analytics-card">
                    <h4>Expansion Strength</h4>
                    <div className="strength-indicator">
                      <div className="strength-bars">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i}
                            className={`strength-bar ${i <= metrics.expansionStrength * 5 ? 'active' : ''}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p>{Math.round(metrics.expansionStrength * 100)}% strength</p>
                  </div>
                  
                  <div className="analytics-card">
                    <h4>Volatility Index</h4>
                    <div className="volatility-gauge">
                      <div className="gauge-needle" style={{ 
                        transform: `rotate(${metrics.volatilityIndex * 180 - 90}deg)` 
                      }}></div>
                    </div>
                    <p>{(metrics.volatilityIndex * 100).toFixed(1)} volatility</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'indicators' && metrics && (
          <div className="indicators-tab">
            <h3>📈 Economic Indicators</h3>
            <div className="indicators-list">
              {metrics.economicIndicators.map((indicator, index) => (
                <div key={index} className="indicator-card">
                  <div className="indicator-header">
                    <h4>{indicator.name}</h4>
                    <div className="indicator-trend">
                      {getTrendIcon(indicator.trend)}
                      <span className={`trend-text ${indicator.trend}`}>
                        {indicator.trend}
                      </span>
                    </div>
                  </div>
                  <div className="indicator-value">
                    {indicator.name.includes('Rate') || indicator.name.includes('Confidence') 
                      ? indicator.value.toFixed(1) + (indicator.name.includes('Rate') ? '%' : '')
                      : indicator.value.toFixed(1)
                    }
                  </div>
                  <div className="indicator-meta">
                    <span className={`significance ${indicator.significance}`}>
                      {indicator.significance.toUpperCase()}
                    </span>
                    <span className="last-updated">
                      {new Date(indicator.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && metrics && (
          <div className="history-tab">
            <h3>📋 Business Cycle History</h3>
            <div className="cycle-timeline">
              {metrics.cycleHistory.map((phase, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: getPhaseColor(phase.phase) }}>
                    {getPhaseIcon(phase.phase)}
                  </div>
                  <div className="timeline-content">
                    <h4>{phase.phase.toUpperCase()}</h4>
                    <p>Duration: {phase.duration} months</p>
                    <p>Peak GDP: {formatCurrency(phase.peakGDP)}</p>
                    <p>Trough GDP: {formatCurrency(phase.troughGDP)}</p>
                    <p>Severity: <span className={`severity ${phase.severity}`}>{phase.severity}</span></p>
                    <p>Started: {new Date(phase.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default BusinessCycleScreen;
