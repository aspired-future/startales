/**
 * Enhanced Knobs Control Center
 * Comprehensive interface for managing all enhanced API knobs across all systems
 */

import React, { useState, useEffect } from 'react';
import { ScreenProps } from './BaseScreen';
import './EnhancedKnobsControlCenter.css';

interface KnobSystem {
  name: string;
  displayName: string;
  icon: string;
  description: string;
  knobs: Record<string, KnobDefinition>;
  currentValues: Record<string, number>;
  categories: KnobCategory[];
}

interface KnobDefinition {
  min: number;
  max: number;
  default: number;
  unit: string;
  description: string;
}

interface KnobCategory {
  name: string;
  displayName: string;
  knobs: string[];
  color: string;
}

interface SimulationState {
  businessCycle: {
    currentPhase: string;
    volatility: number;
    growthRate: number;
  };
  worldWonders: {
    constructionSpeed: number;
    availabilityRate: number;
    culturalImpact: number;
  };
  politicalSystems: {
    stability: number;
    democraticHealth: number;
    polarization: number;
  };
  culture: {
    diversity: number;
    cohesion: number;
    evolution: number;
  };
  treasury: {
    efficiency: number;
    transparency: number;
    taxCompliance: number;
  };
}

const EnhancedKnobsControlCenter: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [activeSystem, setActiveSystem] = useState('business_cycle');
  const [activeTab, setActiveTab] = useState('knobs');
  const [knobSystems, setKnobSystems] = useState<Record<string, KnobSystem>>({});
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - in production this would come from APIs
  const mockKnobSystems: Record<string, KnobSystem> = {
    business_cycle: {
      name: 'business_cycle',
      displayName: 'Business Cycle',
      icon: '📊',
      description: 'Economic cycle dynamics, growth periods, and recession management',
      knobs: {
        cycle_volatility: { min: 0.0, max: 1.0, default: 0.5, unit: 'intensity', description: 'Business cycle volatility and unpredictability' },
        expansion_duration: { min: 0.3, max: 3.0, default: 1.0, unit: 'multiplier', description: 'Duration of economic expansion phases' },
        recession_severity: { min: 0.1, max: 2.0, default: 1.0, unit: 'multiplier', description: 'Severity of economic recessions' },
        recovery_speed: { min: 0.2, max: 2.5, default: 1.0, unit: 'multiplier', description: 'Speed of economic recovery' }
      },
      currentValues: {
        cycle_volatility: 0.5,
        expansion_duration: 1.0,
        recession_severity: 1.0,
        recovery_speed: 1.0
      },
      categories: [
        { name: 'dynamics', displayName: 'Cycle Dynamics', knobs: ['cycle_volatility', 'expansion_duration'], color: '#4ecdc4' },
        { name: 'recovery', displayName: 'Recovery & Recession', knobs: ['recession_severity', 'recovery_speed'], color: '#45b7d1' }
      ]
    },
    world_wonders: {
      name: 'world_wonders',
      displayName: 'World Wonders',
      icon: '🏛️',
      description: 'Wonder construction, household economics, and cultural development',
      knobs: {
        construction_speed: { min: 0.2, max: 3.0, default: 1.0, unit: 'multiplier', description: 'Wonder construction speed modifier' },
        availability_rate: { min: 0.1, max: 1.0, default: 0.6, unit: 'rate', description: 'Rate of new wonder availability' },
        cultural_impact: { min: 0.5, max: 2.0, default: 1.0, unit: 'multiplier', description: 'Cultural impact of wonders' },
        income_growth: { min: -0.05, max: 0.15, default: 0.03, unit: 'annual_rate', description: 'Household income growth rate' }
      },
      currentValues: {
        construction_speed: 1.0,
        availability_rate: 0.6,
        cultural_impact: 1.0,
        income_growth: 0.03
      },
      categories: [
        { name: 'construction', displayName: 'Wonder Construction', knobs: ['construction_speed', 'availability_rate'], color: '#f39c12' },
        { name: 'economics', displayName: 'Household Economics', knobs: ['cultural_impact', 'income_growth'], color: '#e74c3c' }
      ]
    },
    political_systems: {
      name: 'political_systems',
      displayName: 'Political Systems',
      icon: '🗳️',
      description: 'Democratic processes, political stability, and governance systems',
      knobs: {
        multiparty_stability: { min: 0.0, max: 1.0, default: 0.7, unit: 'stability', description: 'Multiparty system stability' },
        polarization_tendency: { min: 0.0, max: 1.0, default: 0.4, unit: 'tendency', description: 'Political polarization tendency' },
        voter_turnout: { min: 0.3, max: 0.95, default: 0.65, unit: 'rate', description: 'Base voter turnout rate' },
        democratic_health: { min: 0.0, max: 1.0, default: 0.7, unit: 'health', description: 'Democratic institutions health' }
      },
      currentValues: {
        multiparty_stability: 0.7,
        polarization_tendency: 0.4,
        voter_turnout: 0.65,
        democratic_health: 0.7
      },
      categories: [
        { name: 'stability', displayName: 'Political Stability', knobs: ['multiparty_stability', 'democratic_health'], color: '#9b59b6' },
        { name: 'participation', displayName: 'Democratic Participation', knobs: ['polarization_tendency', 'voter_turnout'], color: '#3498db' }
      ]
    },
    culture: {
      name: 'culture',
      displayName: 'Culture System',
      icon: '🎭',
      description: 'Cultural diversity, social cohesion, and cultural evolution',
      knobs: {
        cultural_diversity: { min: 0.0, max: 1.0, default: 0.6, unit: 'diversity', description: 'Level of cultural diversity' },
        social_cohesion: { min: 0.0, max: 1.0, default: 0.7, unit: 'cohesion', description: 'Social cohesion strength' },
        tradition_preservation: { min: 0.0, max: 1.0, default: 0.5, unit: 'preservation', description: 'Rate of tradition preservation' },
        innovation_acceptance: { min: 0.0, max: 1.0, default: 0.6, unit: 'acceptance', description: 'Cultural innovation acceptance' }
      },
      currentValues: {
        cultural_diversity: 0.6,
        social_cohesion: 0.7,
        tradition_preservation: 0.5,
        innovation_acceptance: 0.6
      },
      categories: [
        { name: 'diversity', displayName: 'Cultural Diversity', knobs: ['cultural_diversity', 'innovation_acceptance'], color: '#e67e22' },
        { name: 'cohesion', displayName: 'Social Cohesion', knobs: ['social_cohesion', 'tradition_preservation'], color: '#27ae60' }
      ]
    },
    treasury: {
      name: 'treasury',
      displayName: 'Treasury System',
      icon: '💰',
      description: 'Tax collection, government spending, and fiscal management',
      knobs: {
        tax_efficiency: { min: 0.3, max: 1.0, default: 0.7, unit: 'efficiency', description: 'Tax collection efficiency' },
        spending_transparency: { min: 0.0, max: 1.0, default: 0.6, unit: 'transparency', description: 'Government spending transparency' },
        budget_discipline: { min: 0.0, max: 1.0, default: 0.5, unit: 'discipline', description: 'Budget discipline level' },
        revenue_diversification: { min: 0.0, max: 1.0, default: 0.4, unit: 'diversification', description: 'Revenue source diversification' }
      },
      currentValues: {
        tax_efficiency: 0.7,
        spending_transparency: 0.6,
        budget_discipline: 0.5,
        revenue_diversification: 0.4
      },
      categories: [
        { name: 'collection', displayName: 'Tax Collection', knobs: ['tax_efficiency', 'revenue_diversification'], color: '#16a085' },
        { name: 'spending', displayName: 'Government Spending', knobs: ['spending_transparency', 'budget_discipline'], color: '#8e44ad' }
      ]
    }
  };

  const mockSimulationState: SimulationState = {
    businessCycle: {
      currentPhase: 'expansion',
      volatility: 0.5,
      growthRate: 0.025
    },
    worldWonders: {
      constructionSpeed: 1.0,
      availabilityRate: 0.6,
      culturalImpact: 1.0
    },
    politicalSystems: {
      stability: 0.7,
      democraticHealth: 0.7,
      polarization: 0.4
    },
    culture: {
      diversity: 0.6,
      cohesion: 0.7,
      evolution: 0.6
    },
    treasury: {
      efficiency: 0.7,
      transparency: 0.6,
      taxCompliance: 0.65
    }
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setKnobSystems(mockKnobSystems);
      setSimulationState(mockSimulationState);
      setLoading(false);
    }, 1000);
  }, []);

  const handleKnobChange = (systemName: string, knobName: string, value: number) => {
    setKnobSystems(prev => ({
      ...prev,
      [systemName]: {
        ...prev[systemName],
        currentValues: {
          ...prev[systemName].currentValues,
          [knobName]: value
        }
      }
    }));

    // In production, this would call the API to update the knob
    console.log(`🎛️ Updated ${systemName}.${knobName} to ${value}`);
  };

  const resetSystemToDefaults = (systemName: string) => {
    const system = knobSystems[systemName];
    if (!system) return;

    const defaultValues: Record<string, number> = {};
    Object.entries(system.knobs).forEach(([knobName, knobDef]) => {
      defaultValues[knobName] = knobDef.default;
    });

    setKnobSystems(prev => ({
      ...prev,
      [systemName]: {
        ...prev[systemName],
        currentValues: defaultValues
      }
    }));
  };

  const formatValue = (value: number, unit: string): string => {
    switch (unit) {
      case 'rate':
      case 'efficiency':
      case 'stability':
      case 'health':
        return `${(value * 100).toFixed(1)}%`;
      case 'annual_rate':
        return `${(value * 100).toFixed(2)}%`;
      case 'multiplier':
        return `${value.toFixed(2)}x`;
      default:
        return value.toFixed(3);
    }
  };

  if (loading) {
    return (
      <div className="enhanced-knobs-control-center loading">
        <div className="loading-spinner"></div>
        <p>Loading enhanced knobs control center...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-knobs-control-center error">
        <h3>❌ Error Loading Control Center</h3>
        <p>{error}</p>
      </div>
    );
  }

  const currentSystem = knobSystems[activeSystem];

  return (
    <div className="enhanced-knobs-control-center">
      <div className="screen-header">
        <h2>{icon} {title}</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'knobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('knobs')}
          >
            ⚙️ Knob Controls
          </button>
          <button 
            className={`tab-btn ${activeTab === 'state' ? 'active' : ''}`}
            onClick={() => setActiveTab('state')}
          >
            📊 Simulation State
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>
      </div>

      <div className="screen-content">
        {activeTab === 'knobs' && (
          <div className="knobs-control-tab">
            <div className="system-selector">
              <h3>🎛️ System Selection</h3>
              <div className="system-grid">
                {Object.values(knobSystems).map((system) => (
                  <button
                    key={system.name}
                    className={`system-card ${activeSystem === system.name ? 'active' : ''}`}
                    onClick={() => setActiveSystem(system.name)}
                  >
                    <div className="system-icon">{system.icon}</div>
                    <div className="system-info">
                      <h4>{system.displayName}</h4>
                      <p>{system.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {currentSystem && (
              <div className="knob-controls-section">
                <div className="section-header">
                  <h3>{currentSystem.icon} {currentSystem.displayName} Controls</h3>
                  <button 
                    className="reset-btn"
                    onClick={() => resetSystemToDefaults(activeSystem)}
                  >
                    🔄 Reset to Defaults
                  </button>
                </div>

                <div className="knob-categories">
                  {currentSystem.categories.map((category) => (
                    <div key={category.name} className="knob-category">
                      <h4 style={{ color: category.color }}>
                        {category.displayName}
                      </h4>
                      <div className="knobs-grid">
                        {category.knobs.map((knobName) => {
                          const knobDef = currentSystem.knobs[knobName];
                          const currentValue = currentSystem.currentValues[knobName];
                          
                          return (
                            <div key={knobName} className="knob-control">
                              <label className="knob-label">
                                {knobName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                              <div className="knob-description">
                                {knobDef.description}
                              </div>
                              <div className="knob-input-group">
                                <input
                                  type="range"
                                  min={knobDef.min}
                                  max={knobDef.max}
                                  step={knobDef.max > 1 ? 0.1 : 0.01}
                                  value={currentValue}
                                  className="knob-slider"
                                  onChange={(e) => handleKnobChange(activeSystem, knobName, parseFloat(e.target.value))}
                                />
                                <div className="knob-value-display">
                                  <span className="knob-current-value">
                                    {formatValue(currentValue, knobDef.unit)}
                                  </span>
                                </div>
                              </div>
                              <div className="knob-range">
                                <span className="range-min">{formatValue(knobDef.min, knobDef.unit)}</span>
                                <span className="range-default">Default: {formatValue(knobDef.default, knobDef.unit)}</span>
                                <span className="range-max">{formatValue(knobDef.max, knobDef.unit)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'state' && simulationState && (
          <div className="simulation-state-tab">
            <h3>📊 Current Simulation State</h3>
            <div className="state-grid">
              <div className="state-card">
                <h4>📊 Business Cycle</h4>
                <div className="state-metrics">
                  <div className="metric">
                    <span>Current Phase:</span>
                    <span className="phase-indicator">{simulationState.businessCycle.currentPhase}</span>
                  </div>
                  <div className="metric">
                    <span>Volatility:</span>
                    <span>{(simulationState.businessCycle.volatility * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Growth Rate:</span>
                    <span>{(simulationState.businessCycle.growthRate * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="state-card">
                <h4>🏛️ World Wonders</h4>
                <div className="state-metrics">
                  <div className="metric">
                    <span>Construction Speed:</span>
                    <span>{simulationState.worldWonders.constructionSpeed.toFixed(2)}x</span>
                  </div>
                  <div className="metric">
                    <span>Availability Rate:</span>
                    <span>{(simulationState.worldWonders.availabilityRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Cultural Impact:</span>
                    <span>{simulationState.worldWonders.culturalImpact.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              <div className="state-card">
                <h4>🗳️ Political Systems</h4>
                <div className="state-metrics">
                  <div className="metric">
                    <span>Stability:</span>
                    <span>{(simulationState.politicalSystems.stability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Democratic Health:</span>
                    <span>{(simulationState.politicalSystems.democraticHealth * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Polarization:</span>
                    <span>{(simulationState.politicalSystems.polarization * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="state-card">
                <h4>🎭 Culture</h4>
                <div className="state-metrics">
                  <div className="metric">
                    <span>Diversity:</span>
                    <span>{(simulationState.culture.diversity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Cohesion:</span>
                    <span>{(simulationState.culture.cohesion * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Evolution:</span>
                    <span>{(simulationState.culture.evolution * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="state-card">
                <h4>💰 Treasury</h4>
                <div className="state-metrics">
                  <div className="metric">
                    <span>Efficiency:</span>
                    <span>{(simulationState.treasury.efficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Transparency:</span>
                    <span>{(simulationState.treasury.transparency * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric">
                    <span>Tax Compliance:</span>
                    <span>{(simulationState.treasury.taxCompliance * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h3>📈 System Performance Analytics</h3>
            <div className="analytics-content">
              <div className="analytics-card">
                <h4>🎯 System Efficiency Scores</h4>
                <div className="efficiency-bars">
                  {Object.values(knobSystems).map((system) => (
                    <div key={system.name} className="efficiency-bar">
                      <span className="system-name">{system.displayName}</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ 
                            width: `${Math.random() * 40 + 60}%`,
                            backgroundColor: system.categories[0]?.color || '#4ecdc4'
                          }}
                        ></div>
                      </div>
                      <span className="efficiency-score">{(Math.random() * 40 + 60).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <h4>⚡ Real-time Performance</h4>
                <div className="performance-metrics">
                  <div className="performance-metric">
                    <span>Overall System Health:</span>
                    <span className="health-good">85.2%</span>
                  </div>
                  <div className="performance-metric">
                    <span>AI Response Time:</span>
                    <span className="response-good">0.15s</span>
                  </div>
                  <div className="performance-metric">
                    <span>Knob Adjustments/Hour:</span>
                    <span>247</span>
                  </div>
                  <div className="performance-metric">
                    <span>Cross-System Effects:</span>
                    <span>Active (12)</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h4>🔄 Recent Knob Changes</h4>
                <div className="recent-changes">
                  <div className="change-item">
                    <span className="change-time">2 min ago</span>
                    <span className="change-system">Business Cycle</span>
                    <span className="change-knob">recovery_speed</span>
                    <span className="change-value">1.0 → 1.2</span>
                    <span className="change-source ai">AI</span>
                  </div>
                  <div className="change-item">
                    <span className="change-time">5 min ago</span>
                    <span className="change-system">Political Systems</span>
                    <span className="change-knob">polarization_tendency</span>
                    <span className="change-value">0.4 → 0.3</span>
                    <span className="change-source player">Player</span>
                  </div>
                  <div className="change-item">
                    <span className="change-time">8 min ago</span>
                    <span className="change-system">Treasury</span>
                    <span className="change-knob">tax_efficiency</span>
                    <span className="change-value">0.7 → 0.75</span>
                    <span className="change-source system">System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedKnobsControlCenter;
