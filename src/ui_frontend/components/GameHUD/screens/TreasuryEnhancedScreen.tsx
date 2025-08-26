import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './TreasuryEnhancedScreen.css';

interface TaxLineItem {
  source: string;
  rate: number;
  baseAmount: number;
  collectedAmount: number;
  efficiency: number;
  evasionRate: number;
}

interface BudgetAllocation {
  allocation: number;
  amount: number;
}

interface TreasuryData {
  taxLineItems: {
    collections: TaxLineItem[];
    summary: {
      totalCollected: number;
      totalPotential: number;
      overallEfficiency: number;
      enforcementLevel: number;
    };
  };
  budgetAllocation: {
    defense: BudgetAllocation;
    education: BudgetAllocation;
    healthcare: BudgetAllocation;
    infrastructure: BudgetAllocation;
    socialServices: BudgetAllocation;
    researchDevelopment: BudgetAllocation;
    emergencyReserves: {
      target: number;
      currentLevel: number;
    };
    debtService: {
      priority: number;
      amount: number;
    };
  };
  knobs: { [key: string]: number };
}

interface KnobConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
}

const TreasuryEnhancedScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [knobConfigs, setKnobConfigs] = useState<{ [key: string]: KnobConfig }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tax-lines' | 'budget' | 'knobs'>('tax-lines');

  useEffect(() => {
    fetchTreasuryData();
    fetchKnobConfigs();
  }, [gameContext]);

  const fetchTreasuryData = async () => {
    try {
      setLoading(true);
      const { campaignId, civilizationId } = gameContext;

      // Fetch tax line items
      const taxResponse = await fetch(`/api/treasury/tax-line-items?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const taxData = await taxResponse.json();

      // Fetch budget allocation
      const budgetResponse = await fetch(`/api/treasury/budget-allocation-breakdown?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const budgetData = await budgetResponse.json();

      // Fetch current knob values
      const knobResponse = await fetch(`/api/treasury/knobs?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      const knobData = await knobResponse.json();

      setTreasuryData({
        taxLineItems: taxData.data,
        budgetAllocation: budgetData.data,
        knobs: knobData.values || {}
      });
    } catch (err) {
      setError('Failed to fetch treasury data');
      console.error('Treasury data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKnobConfigs = async () => {
    try {
      const response = await fetch('/api/treasury/knobs/help');
      const data = await response.json();
      setKnobConfigs(data.knobs || {});
    } catch (err) {
      console.error('Failed to fetch knob configs:', err);
    }
  };

  const handleKnobChange = async (knobId: string, value: number) => {
    try {
      const { campaignId, civilizationId } = gameContext;
      
      const response = await fetch('/api/treasury/knobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          civilizationId,
          knobs: { [knobId]: value }
        }),
      });

      if (response.ok) {
        // Update local state
        setTreasuryData(prev => prev ? {
          ...prev,
          knobs: { ...prev.knobs, [knobId]: value }
        } : null);
        
        // Refresh data to see effects
        setTimeout(() => fetchTreasuryData(), 500);
      }
    } catch (err) {
      console.error('Failed to update knob:', err);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimationFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const renderKnobSlider = (knobId: string, config: KnobConfig) => {
    const currentValue = treasuryData?.knobs[knobId] ?? config.default;
    
    return (
      <div key={knobId} className="knob-control">
        <div className="knob-header">
          <label className="knob-label">{config.name}</label>
          <span className="knob-value">
            {currentValue}{config.unit}
          </span>
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={currentValue}
          onChange={(e) => handleKnobChange(knobId, parseFloat(e.target.value))}
          className="knob-slider"
        />
        <div className="knob-description">{config.description}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="treasury-enhanced-screen loading">
        <div className="loading-spinner">Loading Treasury Data...</div>
      </div>
    );
  }

  if (error || !treasuryData) {
    return (
      <div className="treasury-enhanced-screen error">
        <div className="error-message">{error || 'No treasury data available'}</div>
        <button onClick={fetchTreasuryData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="treasury-enhanced-screen">
      <div className="screen-header">
        <h2>🏛️ Treasury & Tax Management</h2>
        <div className="treasury-summary">
          <div className="summary-stat">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(treasuryData.taxLineItems.summary.totalCollected)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Collection Efficiency</span>
            <span className="stat-value">{formatPercentage(treasuryData.taxLineItems.summary.overallEfficiency)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Enforcement Level</span>
            <span className="stat-value">{treasuryData.taxLineItems.summary.enforcementLevel}/10</span>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'tax-lines' ? 'active' : ''}`}
          onClick={() => setActiveTab('tax-lines')}
        >
          Tax Line Items
        </button>
        <button
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget Allocation
        </button>
        <button
          className={`tab-button ${activeTab === 'knobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('knobs')}
        >
          Policy Controls
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tax-lines' && (
          <div className="tax-lines-tab">
            <h3>Tax Collection Details</h3>
            <div className="tax-lines-grid">
              {treasuryData.taxLineItems.collections.map((item, index) => (
                <div key={index} className="tax-line-item">
                  <div className="tax-source">{item.source}</div>
                  <div className="tax-metrics">
                    <div className="metric">
                      <span className="metric-label">Rate:</span>
                      <span className="metric-value">{formatPercentage(item.rate)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Collected:</span>
                      <span className="metric-value">{formatCurrency(item.collectedAmount)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Efficiency:</span>
                      <span className="metric-value">{formatPercentage(item.efficiency)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Evasion:</span>
                      <span className="metric-value evasion">{formatPercentage(item.evasionRate)}</span>
                    </div>
                  </div>
                  <div className="collection-bar">
                    <div 
                      className="collection-fill"
                      style={{ width: `${(item.collectedAmount / item.baseAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="budget-tab">
            <h3>Budget Allocation Breakdown</h3>
            <div className="budget-grid">
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Defense</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.defense.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.defense.amount)}</div>
              </div>
              
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Education</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.education.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.education.amount)}</div>
              </div>
              
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Healthcare</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.healthcare.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.healthcare.amount)}</div>
              </div>
              
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Infrastructure</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.infrastructure.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.infrastructure.amount)}</div>
              </div>
              
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Social Services</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.socialServices.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.socialServices.amount)}</div>
              </div>
              
              <div className="budget-category">
                <div className="category-header">
                  <span className="category-name">Research & Development</span>
                  <span className="category-percentage">{formatPercentage(treasuryData.budgetAllocation.researchDevelopment.allocation)}</span>
                </div>
                <div className="category-amount">{formatCurrency(treasuryData.budgetAllocation.researchDevelopment.amount)}</div>
              </div>
            </div>
            
            <div className="reserves-debt-section">
              <div className="reserves-info">
                <h4>Emergency Reserves</h4>
                <div className="reserves-target">Target: {formatPercentage(treasuryData.budgetAllocation.emergencyReserves.target)} of GDP</div>
                <div className="reserves-current">Current: {formatPercentage(treasuryData.budgetAllocation.emergencyReserves.currentLevel)} of GDP</div>
              </div>
              
              <div className="debt-info">
                <h4>Debt Service</h4>
                <div className="debt-priority">Priority Level: {treasuryData.budgetAllocation.debtService.priority}/10</div>
                <div className="debt-amount">Annual Service: {formatCurrency(treasuryData.budgetAllocation.debtService.amount)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knobs' && (
          <div className="knobs-tab">
            <div className="knobs-categories">
              <div className="knobs-category">
                <h3>Tax Policy & Collection</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'tax-policy')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
              
              <div className="knobs-category">
                <h3>Budget Allocation & Spending</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'budget-allocation')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
              
              <div className="knobs-category">
                <h3>Revenue Management & Optimization</h3>
                <div className="knobs-grid">
                  {Object.entries(knobConfigs)
                    .filter(([_, config]) => config.category === 'revenue-management')
                    .map(([knobId, config]) => renderKnobSlider(knobId, config))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasuryEnhancedScreen;
