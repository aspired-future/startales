/**
 * World Wonders & Household Economics Screen Component
 * Displays world wonder construction, household economic metrics, and AI-controllable knobs
 */

import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './WorldWondersScreen.css';

interface WorldWonder {
  id: string;
  name: string;
  type: 'cultural' | 'economic' | 'military' | 'scientific' | 'religious' | 'natural';
  constructionCost: number;
  constructionTime: number;
  maintenanceCost: number;
  culturalImpact: number;
  economicImpact: number;
  prestigeValue: number;
  status: 'available' | 'under_construction' | 'completed' | 'destroyed';
  constructionProgress?: number;
  completionDate?: Date;
  location?: string;
  description: string;
}

interface HouseholdEconomics {
  averageIncome: number;
  medianIncome: number;
  giniCoefficient: number;
  householdSavingsRate: number;
  consumerSpending: {
    totalSpending: number;
    categories: {
      housing: number;
      food: number;
      transportation: number;
      healthcare: number;
      education: number;
      entertainment: number;
      savings: number;
      other: number;
    };
    spendingConfidence: number;
  };
  housingMarket: {
    averageHomePrice: number;
    homeOwnershipRate: number;
    rentToIncomeRatio: number;
    housingAffordabilityIndex: number;
  };
  economicMobility: {
    intergenerationalMobility: number;
    socialMobilityIndex: number;
    educationAccessIndex: number;
    entrepreneurshipRate: number;
  };
}

const WorldWondersScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [activeTab, setActiveTab] = useState('wonders');
  const [wonders, setWonders] = useState<WorldWonder[]>([]);
  const [householdEconomics, setHouseholdEconomics] = useState<HouseholdEconomics | null>(null);
  const [knobs, setKnobs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockWonders: WorldWonder[] = [
    {
      id: 'great_library',
      name: 'Great Library',
      type: 'cultural',
      constructionCost: 500000000,
      constructionTime: 36,
      maintenanceCost: 5000000,
      culturalImpact: 0.15,
      economicImpact: 0.05,
      prestigeValue: 100,
      status: 'completed',
      completionDate: new Date('2024-06-15'),
      location: 'Capital City',
      description: 'A magnificent repository of knowledge and learning'
    },
    {
      id: 'colossus_harbor',
      name: 'Colossus of the Harbor',
      type: 'economic',
      constructionCost: 750000000,
      constructionTime: 48,
      maintenanceCost: 8000000,
      culturalImpact: 0.08,
      economicImpact: 0.20,
      prestigeValue: 120,
      status: 'under_construction',
      constructionProgress: 65,
      location: 'Port Metropolis',
      description: 'A massive statue guarding the main harbor, boosting trade'
    },
    {
      id: 'hanging_gardens',
      name: 'Hanging Gardens',
      type: 'cultural',
      constructionCost: 600000000,
      constructionTime: 42,
      maintenanceCost: 6000000,
      culturalImpact: 0.18,
      economicImpact: 0.08,
      prestigeValue: 110,
      status: 'available',
      description: 'Terraced gardens of extraordinary beauty and engineering'
    }
  ];

  const mockHouseholdEconomics: HouseholdEconomics = {
    averageIncome: 45000,
    medianIncome: 38000,
    giniCoefficient: 0.35,
    householdSavingsRate: 0.15,
    consumerSpending: {
      totalSpending: 38250,
      categories: {
        housing: 0.28,
        food: 0.15,
        transportation: 0.12,
        healthcare: 0.08,
        education: 0.06,
        entertainment: 0.05,
        savings: 0.15,
        other: 0.11
      },
      spendingConfidence: 0.7
    },
    housingMarket: {
      averageHomePrice: 285000,
      homeOwnershipRate: 0.65,
      rentToIncomeRatio: 0.25,
      housingAffordabilityIndex: 0.6
    },
    economicMobility: {
      intergenerationalMobility: 0.6,
      socialMobilityIndex: 0.65,
      educationAccessIndex: 0.8,
      entrepreneurshipRate: 0.08
    }
  };

  const mockKnobs = {
    construction_speed_modifier: { min: 0.2, max: 3.0, default: 1.0, unit: 'multiplier' },
    wonder_availability_rate: { min: 0.1, max: 1.0, default: 0.6, unit: 'rate' },
    income_growth_rate: { min: -0.05, max: 0.15, default: 0.03, unit: 'annual_rate' },
    social_mobility_factor: { min: 0.1, max: 1.0, default: 0.6, unit: 'mobility' },
    consumer_confidence_volatility: { min: 0.0, max: 1.0, default: 0.5, unit: 'volatility' },
    housing_market_speculation: { min: 0.0, max: 1.0, default: 0.3, unit: 'speculation' }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setWonders(mockWonders);
      setHouseholdEconomics(mockHouseholdEconomics);
      setKnobs(mockKnobs);
      setLoading(false);
    }, 1000);
  }, []);

  const getWonderTypeIcon = (type: string) => {
    switch (type) {
      case 'cultural': return '🎭';
      case 'economic': return '💰';
      case 'military': return '⚔️';
      case 'scientific': return '🔬';
      case 'religious': return '⛪';
      case 'natural': return '🌿';
      default: return '🏛️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'under_construction': return '#f39c12';
      case 'available': return '#4ecdc4';
      case 'destroyed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="world-wonders-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading world wonders and economic data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="world-wonders-screen error">
        <h3>❌ Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="world-wonders-screen">
      <div className="screen-header">
        <h2>{icon} {title}</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'wonders' ? 'active' : ''}`}
            onClick={() => setActiveTab('wonders')}
          >
            🏛️ Wonders
          </button>
          <button 
            className={`tab-btn ${activeTab === 'household' ? 'active' : ''}`}
            onClick={() => setActiveTab('household')}
          >
            🏠 Household Economics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mobility' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobility')}
          >
            📈 Economic Mobility
          </button>
          <button 
            className={`tab-btn ${activeTab === 'knobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('knobs')}
          >
            ⚙️ AI Knobs
          </button>
        </div>
      </div>

      <div className="screen-content">
        {activeTab === 'wonders' && (
          <div className="wonders-tab">
            <div className="wonders-summary">
              <div className="summary-card">
                <h4>🏛️ Total Wonders</h4>
                <div className="summary-value">{wonders.length}</div>
              </div>
              <div className="summary-card">
                <h4>✅ Completed</h4>
                <div className="summary-value">{wonders.filter(w => w.status === 'completed').length}</div>
              </div>
              <div className="summary-card">
                <h4>🚧 Under Construction</h4>
                <div className="summary-value">{wonders.filter(w => w.status === 'under_construction').length}</div>
              </div>
              <div className="summary-card">
                <h4>🎯 Available</h4>
                <div className="summary-value">{wonders.filter(w => w.status === 'available').length}</div>
              </div>
            </div>

            <div className="wonders-grid">
              {wonders.map((wonder) => (
                <div key={wonder.id} className="wonder-card">
                  <div className="wonder-header">
                    <div className="wonder-icon">
                      {getWonderTypeIcon(wonder.type)}
                    </div>
                    <div className="wonder-info">
                      <h3>{wonder.name}</h3>
                      <p className="wonder-type">{wonder.type.toUpperCase()}</p>
                    </div>
                    <div 
                      className="wonder-status"
                      style={{ color: getStatusColor(wonder.status) }}
                    >
                      {wonder.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="wonder-description">
                    <p>{wonder.description}</p>
                  </div>

                  {wonder.status === 'under_construction' && wonder.constructionProgress && (
                    <div className="construction-progress">
                      <div className="progress-label">
                        Construction Progress: {wonder.constructionProgress}%
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${wonder.constructionProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="wonder-stats">
                    <div className="stat-row">
                      <span>💰 Cost:</span>
                      <span>{formatCurrency(wonder.constructionCost)}</span>
                    </div>
                    <div className="stat-row">
                      <span>⏱️ Time:</span>
                      <span>{wonder.constructionTime} months</span>
                    </div>
                    <div className="stat-row">
                      <span>🔧 Maintenance:</span>
                      <span>{formatCurrency(wonder.maintenanceCost)}/year</span>
                    </div>
                    <div className="stat-row">
                      <span>🎭 Cultural:</span>
                      <span>+{formatPercentage(wonder.culturalImpact)}</span>
                    </div>
                    <div className="stat-row">
                      <span>💼 Economic:</span>
                      <span>+{formatPercentage(wonder.economicImpact)}</span>
                    </div>
                    <div className="stat-row">
                      <span>👑 Prestige:</span>
                      <span>+{wonder.prestigeValue}</span>
                    </div>
                  </div>

                  {wonder.location && (
                    <div className="wonder-location">
                      📍 {wonder.location}
                    </div>
                  )}

                  <div className="wonder-actions">
                    {wonder.status === 'available' && (
                      <button className="action-btn construct">
                        🚧 Begin Construction
                      </button>
                    )}
                    {wonder.status === 'under_construction' && (
                      <button className="action-btn rush">
                        ⚡ Rush Construction
                      </button>
                    )}
                    {wonder.status === 'completed' && (
                      <button className="action-btn view">
                        👁️ View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'household' && householdEconomics && (
          <div className="household-tab">
            <div className="income-section">
              <h3>💰 Income Distribution</h3>
              <div className="income-metrics">
                <div className="metric-card">
                  <h4>Average Income</h4>
                  <div className="metric-value">{formatCurrency(householdEconomics.averageIncome)}</div>
                </div>
                <div className="metric-card">
                  <h4>Median Income</h4>
                  <div className="metric-value">{formatCurrency(householdEconomics.medianIncome)}</div>
                </div>
                <div className="metric-card">
                  <h4>Income Inequality</h4>
                  <div className="metric-value gini">{householdEconomics.giniCoefficient.toFixed(2)}</div>
                  <p>Gini Coefficient</p>
                </div>
                <div className="metric-card">
                  <h4>Savings Rate</h4>
                  <div className="metric-value">{formatPercentage(householdEconomics.householdSavingsRate)}</div>
                </div>
              </div>
            </div>

            <div className="spending-section">
              <h3>🛍️ Consumer Spending</h3>
              <div className="spending-breakdown">
                <div className="spending-chart">
                  {Object.entries(householdEconomics.consumerSpending.categories).map(([category, percentage]) => (
                    <div key={category} className="spending-category">
                      <div className="category-label">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-fill"
                          style={{ width: `${percentage * 100}%` }}
                        ></div>
                      </div>
                      <div className="category-percentage">
                        {formatPercentage(percentage)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="spending-summary">
                  <div className="summary-item">
                    <span>Total Spending:</span>
                    <span>{formatCurrency(householdEconomics.consumerSpending.totalSpending)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Spending Confidence:</span>
                    <span>{Math.round(householdEconomics.consumerSpending.spendingConfidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="housing-section">
              <h3>🏠 Housing Market</h3>
              <div className="housing-metrics">
                <div className="metric-card">
                  <h4>Average Home Price</h4>
                  <div className="metric-value">{formatCurrency(householdEconomics.housingMarket.averageHomePrice)}</div>
                </div>
                <div className="metric-card">
                  <h4>Home Ownership Rate</h4>
                  <div className="metric-value">{formatPercentage(householdEconomics.housingMarket.homeOwnershipRate)}</div>
                </div>
                <div className="metric-card">
                  <h4>Rent to Income Ratio</h4>
                  <div className="metric-value">{formatPercentage(householdEconomics.housingMarket.rentToIncomeRatio)}</div>
                </div>
                <div className="metric-card">
                  <h4>Affordability Index</h4>
                  <div className="metric-value affordability">
                    {householdEconomics.housingMarket.housingAffordabilityIndex.toFixed(2)}
                  </div>
                  <p>1.0 = Perfectly Affordable</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mobility' && householdEconomics && (
          <div className="mobility-tab">
            <h3>📈 Economic Mobility Indicators</h3>
            <div className="mobility-metrics">
              <div className="mobility-card">
                <h4>🔄 Intergenerational Mobility</h4>
                <div className="mobility-gauge">
                  <div className="gauge-fill" style={{ width: `${householdEconomics.economicMobility.intergenerationalMobility * 100}%` }}></div>
                </div>
                <div className="mobility-value">{Math.round(householdEconomics.economicMobility.intergenerationalMobility * 100)}%</div>
                <p>Likelihood of moving between income classes across generations</p>
              </div>

              <div className="mobility-card">
                <h4>📊 Social Mobility Index</h4>
                <div className="mobility-gauge">
                  <div className="gauge-fill" style={{ width: `${householdEconomics.economicMobility.socialMobilityIndex * 100}%` }}></div>
                </div>
                <div className="mobility-value">{Math.round(householdEconomics.economicMobility.socialMobilityIndex * 100)}%</div>
                <p>Overall social mobility within the civilization</p>
              </div>

              <div className="mobility-card">
                <h4>🎓 Education Access Index</h4>
                <div className="mobility-gauge">
                  <div className="gauge-fill" style={{ width: `${householdEconomics.economicMobility.educationAccessIndex * 100}%` }}></div>
                </div>
                <div className="mobility-value">{Math.round(householdEconomics.economicMobility.educationAccessIndex * 100)}%</div>
                <p>Access to quality education opportunities</p>
              </div>

              <div className="mobility-card">
                <h4>🚀 Entrepreneurship Rate</h4>
                <div className="mobility-gauge">
                  <div className="gauge-fill" style={{ width: `${householdEconomics.economicMobility.entrepreneurshipRate * 100}%` }}></div>
                </div>
                <div className="mobility-value">{formatPercentage(householdEconomics.economicMobility.entrepreneurshipRate)}</div>
                <p>Rate of new business formation and entrepreneurial activity</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knobs' && (
          <div className="knobs-tab">
            <div className="knobs-header">
              <h3>⚙️ AI-Controllable Parameters</h3>
              <p>Adjust these knobs to fine-tune world wonder construction and household economics. The AI will learn from your adjustments.</p>
            </div>
            
            <div className="knobs-categories">
              <div className="knobs-category">
                <h4>🏛️ Wonder Construction</h4>
                <div className="knobs-grid">
                  {Object.entries(knobs)
                    .filter(([name]) => ['construction_speed_modifier', 'wonder_availability_rate'].includes(name))
                    .map(([knobName, knobData]: [string, any]) => (
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
              </div>

              <div className="knobs-category">
                <h4>💰 Income & Mobility</h4>
                <div className="knobs-grid">
                  {Object.entries(knobs)
                    .filter(([name]) => ['income_growth_rate', 'social_mobility_factor'].includes(name))
                    .map(([knobName, knobData]: [string, any]) => (
                    <div key={knobName} className="knob-control">
                      <label className="knob-label">
                        {knobName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <div className="knob-input-group">
                        <input
                          type="range"
                          min={knobData.min}
                          max={knobData.max}
                          step={0.01}
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
              </div>

              <div className="knobs-category">
                <h4>🏠 Consumer Behavior</h4>
                <div className="knobs-grid">
                  {Object.entries(knobs)
                    .filter(([name]) => ['consumer_confidence_volatility', 'housing_market_speculation'].includes(name))
                    .map(([knobName, knobData]: [string, any]) => (
                    <div key={knobName} className="knob-control">
                      <label className="knob-label">
                        {knobName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <div className="knob-input-group">
                        <input
                          type="range"
                          min={knobData.min}
                          max={knobData.max}
                          step={0.1}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldWondersScreen;
