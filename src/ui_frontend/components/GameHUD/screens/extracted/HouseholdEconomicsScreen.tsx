import React, { useState, useEffect } from 'react';
import { BaseScreen, ScreenProps } from '../BaseScreen';
import './HouseholdEconomicsScreen.css';

interface GameContext {
  currentLocation: string;
  playerId: string;
}

interface TierDistribution {
  poor: number;
  median: number;
  rich: number;
}

interface EconomicStatus {
  campaign_id: number;
  total_population: number;
  tier_distribution: TierDistribution;
  gini_coefficient: number;
  economic_health_score: number;
}

interface DemandCalculation {
  tier: string;
  resource_type: string;
  base_demand: number;
  final_demand: number;
  elasticity_impact: number;
  price_sensitivity: number;
}

interface MobilityOpportunity {
  id: string;
  from_tier: string;
  to_tier: string;
  event_type: string;
  success_probability: number;
  resource_cost: Record<string, number>;
  description: string;
}

interface SocialMobilityEvent {
  id: string;
  campaign_id: number;
  household_id: string;
  event_type: string;
  from_tier: string;
  to_tier: string;
  outcome: 'pending' | 'success' | 'failure';
  success_probability: number;
  resource_cost: Record<string, number>;
  created_at: string;
}

const HouseholdEconomicsScreen: React.FC<ScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  console.log('🏠 HouseholdEconomicsScreen: Component rendering with gameContext:', gameContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [economicStatus, setEconomicStatus] = useState<EconomicStatus | null>(null);
  const [demandData, setDemandData] = useState<DemandCalculation[]>([]);
  const [mobilityOpportunities, setMobilityOpportunities] = useState<MobilityOpportunity[]>([]);
  const [mobilityEvents, setMobilityEvents] = useState<SocialMobilityEvent[]>([]);
  // Extended household dimensions beyond economics
  const [wellbeingScore, setWellbeingScore] = useState<number>(72.4);
  const [housingStats, setHousingStats] = useState<{ homeOwnershipRate: number; avgHouseholdSize: number; urbanizationRate: number }>({ homeOwnershipRate: 0.58, avgHouseholdSize: 3.2, urbanizationRate: 0.67 });
  const [familyMetrics, setFamilyMetrics] = useState<{ fertilityRate: number; medianAge: number; childcareAccess: number }>({ fertilityRate: 1.9, medianAge: 34.5, childcareAccess: 0.62 });
  const [communityMetrics, setCommunityMetrics] = useState<{ civicParticipation: number; crimeRate: number; volunteerism: number }>({ civicParticipation: 0.48, crimeRate: 0.12, volunteerism: 0.27 });

  const fetchHouseholdEconomicsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use dummy data since the API endpoints might not be fully connected
      const dummyEconomicStatus: EconomicStatus = {
        campaign_id: 1,
        total_population: 150000,
        tier_distribution: {
          poor: 60000,    // 40%
          median: 75000,  // 50%
          rich: 15000     // 10%
        },
        gini_coefficient: 0.42,
        economic_health_score: 68.5
      };

      const dummyDemandData: DemandCalculation[] = [
        {
          tier: 'poor',
          resource_type: 'food',
          base_demand: 45000,
          final_demand: 42000,
          elasticity_impact: -0.067,
          price_sensitivity: 0.8
        },
        {
          tier: 'median',
          resource_type: 'food',
          base_demand: 52500,
          final_demand: 51000,
          elasticity_impact: -0.029,
          price_sensitivity: 0.5
        },
        {
          tier: 'rich',
          resource_type: 'food',
          base_demand: 18000,
          final_demand: 17800,
          elasticity_impact: -0.011,
          price_sensitivity: 0.2
        },
        {
          tier: 'poor',
          resource_type: 'luxury_goods',
          base_demand: 3000,
          final_demand: 1800,
          elasticity_impact: -0.4,
          price_sensitivity: 1.5
        },
        {
          tier: 'median',
          resource_type: 'luxury_goods',
          base_demand: 15000,
          final_demand: 12000,
          elasticity_impact: -0.2,
          price_sensitivity: 0.9
        },
        {
          tier: 'rich',
          resource_type: 'luxury_goods',
          base_demand: 25000,
          final_demand: 23500,
          elasticity_impact: -0.06,
          price_sensitivity: 0.3
        }
      ];

      const dummyMobilityOpportunities: MobilityOpportunity[] = [
        {
          id: '1',
          from_tier: 'poor',
          to_tier: 'median',
          event_type: 'EDUCATION_INVESTMENT',
          success_probability: 0.65,
          resource_cost: { education: 5000, gold: 2000 },
          description: 'Invest in advanced education and skills training to improve economic prospects'
        },
        {
          id: '2',
          from_tier: 'poor',
          to_tier: 'median',
          event_type: 'BUSINESS_STARTUP',
          success_probability: 0.45,
          resource_cost: { gold: 8000, energy: 1000 },
          description: 'Start a small business with government support and microfinance'
        },
        {
          id: '3',
          from_tier: 'median',
          to_tier: 'rich',
          event_type: 'INVESTMENT_OPPORTUNITY',
          success_probability: 0.35,
          resource_cost: { gold: 25000, crystals: 500 },
          description: 'Make strategic investments in emerging technologies and markets'
        }
      ];

      const dummyMobilityEvents: SocialMobilityEvent[] = [
        {
          id: '1',
          campaign_id: 1,
          household_id: 'hh-001',
          event_type: 'EDUCATION_INVESTMENT',
          from_tier: 'poor',
          to_tier: 'median',
          outcome: 'success',
          success_probability: 0.65,
          resource_cost: { education: 5000, gold: 2000 },
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          campaign_id: 1,
          household_id: 'hh-002',
          event_type: 'BUSINESS_STARTUP',
          from_tier: 'poor',
          to_tier: 'median',
          outcome: 'pending',
          success_probability: 0.45,
          resource_cost: { gold: 8000, energy: 1000 },
          created_at: '2024-01-20T14:15:00Z'
        },
        {
          id: '3',
          campaign_id: 1,
          household_id: 'hh-003',
          event_type: 'EDUCATION_INVESTMENT',
          from_tier: 'poor',
          to_tier: 'median',
          outcome: 'failure',
          success_probability: 0.65,
          resource_cost: { education: 5000, gold: 2000 },
          created_at: '2024-01-10T09:45:00Z'
        }
      ];

      setEconomicStatus(dummyEconomicStatus);
      setDemandData(dummyDemandData);
      setMobilityOpportunities(dummyMobilityOpportunities);
      setMobilityEvents(dummyMobilityEvents);

    } catch (err) {
      console.error('Failed to fetch household economics data:', err);
      setError('Failed to load household economics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholdEconomicsData();
  }, [gameContext]);

  const renderOverviewTab = () => {
    if (!economicStatus) return <div>No economic data available</div>;

    const getInequalityLevel = (gini: number) => {
      if (gini < 0.3) return { level: 'Low', color: '#2ecc71' };
      if (gini < 0.5) return { level: 'Medium', color: '#f39c12' };
      return { level: 'High', color: '#e74c3c' };
    };

    const getHealthLevel = (score: number) => {
      if (score >= 80) return { level: 'Excellent', color: '#2ecc71' };
      if (score >= 60) return { level: 'Good', color: '#3498db' };
      if (score >= 40) return { level: 'Fair', color: '#f39c12' };
      return { level: 'Poor', color: '#e74c3c' };
    };

    const inequality = getInequalityLevel(economicStatus.gini_coefficient);
    const health = getHealthLevel(economicStatus.economic_health_score);

    return (
      <div className="overview-tab">
        <div className="tab-header">
          <h3>🏠 Household Economics Overview</h3>
          <p>Monitor household economic status, inequality, and social mobility across your civilization</p>
        </div>

        <div className="section">
          <h4>Population Distribution</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <div className="metric-title">Total Population</div>
                <div className="metric-value">{economicStatus.total_population.toLocaleString()}</div>
                <div className="metric-description">Total households in civilization</div>
              </div>
            </div>

            <div className="metric-card poor-tier">
              <div className="metric-icon">🏚️</div>
              <div className="metric-content">
                <div className="metric-title">Poor Tier</div>
                <div className="metric-value">{economicStatus.tier_distribution.poor.toLocaleString()}</div>
                <div className="metric-description">
                  {((economicStatus.tier_distribution.poor / economicStatus.total_population) * 100).toFixed(1)}% of population
                </div>
              </div>
            </div>

            <div className="metric-card median-tier">
              <div className="metric-icon">🏘️</div>
              <div className="metric-content">
                <div className="metric-title">Median Tier</div>
                <div className="metric-value">{economicStatus.tier_distribution.median.toLocaleString()}</div>
                <div className="metric-description">
                  {((economicStatus.tier_distribution.median / economicStatus.total_population) * 100).toFixed(1)}% of population
                </div>
              </div>
            </div>

            <div className="metric-card rich-tier">
              <div className="metric-icon">🏰</div>
              <div className="metric-content">
                <div className="metric-title">Rich Tier</div>
                <div className="metric-value">{economicStatus.tier_distribution.rich.toLocaleString()}</div>
                <div className="metric-description">
                  {((economicStatus.tier_distribution.rich / economicStatus.total_population) * 100).toFixed(1)}% of population
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Economic Health Indicators</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-title">Gini Coefficient</div>
                <div className="metric-value" style={{ color: inequality.color }}>
                  {economicStatus.gini_coefficient.toFixed(3)}
                </div>
                <div className="metric-description">
                  {inequality.level} inequality (0=equal, 1=max inequality)
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💪</div>
              <div className="metric-content">
                <div className="metric-title">Economic Health Score</div>
                <div className="metric-value" style={{ color: health.color }}>
                  {economicStatus.economic_health_score.toFixed(1)}/100
                </div>
                <div className="metric-description">
                  {health.level} economic health overall
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Population Distribution Visualization</h4>
          <div className="population-chart">
            <div className="chart-bar">
              <div 
                className="chart-segment poor" 
                style={{ 
                  width: `${(economicStatus.tier_distribution.poor / economicStatus.total_population) * 100}%` 
                }}
              >
                <span className="segment-label">Poor ({((economicStatus.tier_distribution.poor / economicStatus.total_population) * 100).toFixed(1)}%)</span>
              </div>
              <div 
                className="chart-segment median" 
                style={{ 
                  width: `${(economicStatus.tier_distribution.median / economicStatus.total_population) * 100}%` 
                }}
              >
                <span className="segment-label">Median ({((economicStatus.tier_distribution.median / economicStatus.total_population) * 100).toFixed(1)}%)</span>
              </div>
              <div 
                className="chart-segment rich" 
                style={{ 
                  width: `${(economicStatus.tier_distribution.rich / economicStatus.total_population) * 100}%` 
                }}
              >
                <span className="segment-label">Rich ({((economicStatus.tier_distribution.rich / economicStatus.total_population) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDemandTab = () => {
    const resourceTypes = [...new Set(demandData.map(d => d.resource_type))];
    
    return (
      <div className="demand-tab">
        <div className="tab-header">
          <h3>📈 Demand Analysis</h3>
          <p>Analyze household demand patterns and price sensitivity across economic tiers</p>
        </div>

        {resourceTypes.map(resourceType => {
          const resourceDemands = demandData.filter(d => d.resource_type === resourceType);
          const totalDemand = resourceDemands.reduce((sum, d) => sum + d.final_demand, 0);
          
          return (
            <div key={resourceType} className="section">
              <h4>{resourceType.replace('_', ' ').toUpperCase()} Demand</h4>
              <div className="demand-overview">
                <div className="total-demand">
                  <span className="demand-label">Total Demand:</span>
                  <span className="demand-value">{totalDemand.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="demand-grid">
                {resourceDemands.map(demand => (
                  <div key={`${demand.tier}-${demand.resource_type}`} className={`demand-card ${demand.tier}-tier`}>
                    <div className="demand-header">
                      <h5>{demand.tier.toUpperCase()} Tier</h5>
                      <span className="tier-icon">
                        {demand.tier === 'poor' && '🏚️'}
                        {demand.tier === 'median' && '🏘️'}
                        {demand.tier === 'rich' && '🏰'}
                      </span>
                    </div>
                    
                    <div className="demand-metrics">
                      <div className="demand-metric">
                        <span className="metric-label">Base Demand:</span>
                        <span className="metric-value">{demand.base_demand.toLocaleString()}</span>
                      </div>
                      <div className="demand-metric">
                        <span className="metric-label">Final Demand:</span>
                        <span className="metric-value">{demand.final_demand.toLocaleString()}</span>
                      </div>
                      <div className="demand-metric">
                        <span className="metric-label">Price Sensitivity:</span>
                        <span className="metric-value">{demand.price_sensitivity.toFixed(2)}</span>
                      </div>
                      <div className="demand-metric">
                        <span className="metric-label">Elasticity Impact:</span>
                        <span className={`metric-value ${demand.elasticity_impact < 0 ? 'negative' : 'positive'}`}>
                          {demand.elasticity_impact > 0 ? '+' : ''}{(demand.elasticity_impact * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMobilityTab = () => {
    const successfulEvents = mobilityEvents.filter(e => e.outcome === 'success').length;
    const failedEvents = mobilityEvents.filter(e => e.outcome === 'failure').length;
    const pendingEvents = mobilityEvents.filter(e => e.outcome === 'pending').length;
    const totalEvents = mobilityEvents.length;
    const successRate = totalEvents > 0 ? (successfulEvents / (successfulEvents + failedEvents)) * 100 : 0;

    return (
      <div className="mobility-tab">
        <div className="tab-header">
          <h3>🎓 Social Mobility</h3>
          <p>Track social mobility opportunities and outcomes across economic tiers</p>
        </div>

        <div className="section">
          <h4>Mobility Statistics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-title">Successful Transitions</div>
                <div className="metric-value">{successfulEvents}</div>
                <div className="metric-description">Households that moved up tiers</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⏳</div>
              <div className="metric-content">
                <div className="metric-title">Pending Events</div>
                <div className="metric-value">{pendingEvents}</div>
                <div className="metric-description">Ongoing mobility attempts</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-title">Success Rate</div>
                <div className="metric-value">{successRate.toFixed(1)}%</div>
                <div className="metric-description">Overall mobility success rate</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <div className="metric-title">Available Opportunities</div>
                <div className="metric-value">{mobilityOpportunities.length}</div>
                <div className="metric-description">Current mobility pathways</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Available Mobility Opportunities</h4>
          <div className="opportunities-grid">
            {mobilityOpportunities.map(opportunity => (
              <div key={opportunity.id} className="opportunity-card">
                <div className="opportunity-header">
                  <h5>{opportunity.event_type.replace('_', ' ')}</h5>
                  <div className="tier-transition">
                    <span className={`tier-badge ${opportunity.from_tier}`}>{opportunity.from_tier}</span>
                    <span className="arrow">→</span>
                    <span className={`tier-badge ${opportunity.to_tier}`}>{opportunity.to_tier}</span>
                  </div>
                </div>
                
                <div className="opportunity-description">
                  {opportunity.description}
                </div>
                
                <div className="opportunity-details">
                  <div className="success-probability">
                    <span className="detail-label">Success Rate:</span>
                    <span className="detail-value">{(opportunity.success_probability * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="resource-cost">
                    <span className="detail-label">Cost:</span>
                    <div className="cost-items">
                      {Object.entries(opportunity.resource_cost).map(([resource, amount]) => (
                        <span key={resource} className="cost-item">
                          {resource}: {amount.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button className="create-event-btn">
                  Create Mobility Event
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h4>Recent Mobility Events</h4>
          <div className="events-list">
            {mobilityEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-type">{event.event_type.replace('_', ' ')}</div>
                  <div className={`event-status ${event.outcome}`}>
                    {event.outcome.toUpperCase()}
                  </div>
                </div>
                
                <div className="event-details">
                  <div className="tier-transition">
                    <span className={`tier-badge ${event.from_tier}`}>{event.from_tier}</span>
                    <span className="arrow">→</span>
                    <span className={`tier-badge ${event.to_tier}`}>{event.to_tier}</span>
                  </div>
                  
                  <div className="event-info">
                    <span>Household: {event.household_id}</span>
                    <span>Success Rate: {(event.success_probability * 100).toFixed(1)}%</span>
                    <span>Date: {new Date(event.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="household-economics-screen loading">
        <div className="loading-spinner"></div>
        <p>Loading household economics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="household-economics-screen error">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchHouseholdEconomicsData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      onRefresh={fetchHouseholdEconomicsData}
      apiEndpoints={[
        { method: 'GET', path: '/api/households/economics', description: 'Economic status & indicators' },
        { method: 'GET', path: '/api/households/demand', description: 'Demand calculations by tier' },
        { method: 'GET', path: '/api/households/mobility', description: 'Mobility opportunities & events' },
        { method: 'GET', path: '/api/households/wellbeing', description: 'Household wellbeing metrics' }
      ]}
    >
      <div className="household-economics-screen">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'demand' ? 'active' : ''}`}
            onClick={() => setActiveTab('demand')}
          >
            📈 Demand Analysis
          </button>
          <button 
            className={`tab-button ${activeTab === 'mobility' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobility')}
          >
            🎓 Social Mobility
          </button>
          <button 
            className={`tab-button ${activeTab === 'wellbeing' ? 'active' : ''}`}
            onClick={() => setActiveTab('wellbeing')}
          >
            💖 Wellbeing
          </button>
          <button 
            className={`tab-button ${activeTab === 'housing' ? 'active' : ''}`}
            onClick={() => setActiveTab('housing')}
          >
            🏡 Housing
          </button>
          <button 
            className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            👪 Family
          </button>
          <button 
            className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            🤝 Community
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'demand' && renderDemandTab()}
          {activeTab === 'mobility' && renderMobilityTab()}
          {activeTab === 'wellbeing' && (
            <div className="wellbeing-tab">
              <div className="tab-header">
                <h3>💖 Household Wellbeing</h3>
                <p>Overall quality of life metrics beyond pure economics</p>
              </div>
              <div className="metrics-grid">
                <div className="metric-card"><div className="metric-icon">😊</div><div className="metric-content"><div className="metric-title">Wellbeing Score</div><div className="metric-value">{wellbeingScore.toFixed(1)}</div><div className="metric-description">Composite wellbeing index</div></div></div>
                <div className="metric-card"><div className="metric-icon">🩺</div><div className="metric-content"><div className="metric-title">Healthcare Access</div><div className="metric-value">78%</div><div className="metric-description">Households with adequate access</div></div></div>
                <div className="metric-card"><div className="metric-icon">🎓</div><div className="metric-content"><div className="metric-title">Education Access</div><div className="metric-value">81%</div><div className="metric-description">Households with quality education</div></div></div>
              </div>
            </div>
          )}
          {activeTab === 'housing' && (
            <div className="housing-tab">
              <div className="tab-header">
                <h3>🏡 Housing & Living</h3>
                <p>Stability, space, and urbanization of households</p>
              </div>
              <div className="metrics-grid">
                <div className="metric-card"><div className="metric-icon">🔑</div><div className="metric-content"><div className="metric-title">Home Ownership</div><div className="metric-value">{Math.round(housingStats.homeOwnershipRate * 100)}%</div><div className="metric-description">Owner-occupied households</div></div></div>
                <div className="metric-card"><div className="metric-icon">👨‍👩‍👧‍👦</div><div className="metric-content"><div className="metric-title">Avg Household Size</div><div className="metric-value">{housingStats.avgHouseholdSize.toFixed(1)}</div><div className="metric-description">Persons per household</div></div></div>
                <div className="metric-card"><div className="metric-icon">🏙️</div><div className="metric-content"><div className="metric-title">Urbanization</div><div className="metric-value">{Math.round(housingStats.urbanizationRate * 100)}%</div><div className="metric-description">Urban households share</div></div></div>
              </div>
            </div>
          )}
          {activeTab === 'family' && (
            <div className="family-tab">
              <div className="tab-header">
                <h3>👪 Family & Lifecycle</h3>
                <p>Demographic and support structure indicators</p>
              </div>
              <div className="metrics-grid">
                <div className="metric-card"><div className="metric-icon">🍼</div><div className="metric-content"><div className="metric-title">Fertility Rate</div><div className="metric-value">{familyMetrics.fertilityRate.toFixed(1)}</div><div className="metric-description">Births per woman</div></div></div>
                <div className="metric-card"><div className="metric-icon">🎂</div><div className="metric-content"><div className="metric-title">Median Age</div><div className="metric-value">{familyMetrics.medianAge.toFixed(1)}</div><div className="metric-description">Population median age</div></div></div>
                <div className="metric-card"><div className="metric-icon">🧸</div><div className="metric-content"><div className="metric-title">Childcare Access</div><div className="metric-value">{Math.round(familyMetrics.childcareAccess * 100)}%</div><div className="metric-description">Affordable childcare availability</div></div></div>
              </div>
            </div>
          )}
          {activeTab === 'community' && (
            <div className="community-tab">
              <div className="tab-header">
                <h3>🤝 Community & Safety</h3>
                <p>Social fabric, participation, and safety indicators</p>
              </div>
              <div className="metrics-grid">
                <div className="metric-card"><div className="metric-icon">🗳️</div><div className="metric-content"><div className="metric-title">Civic Participation</div><div className="metric-value">{Math.round(communityMetrics.civicParticipation * 100)}%</div><div className="metric-description">Active community involvement</div></div></div>
                <div className="metric-card"><div className="metric-icon">🚓</div><div className="metric-content"><div className="metric-title">Crime Rate</div><div className="metric-value">{Math.round(communityMetrics.crimeRate * 100)}%</div><div className="metric-description">Incidents per 100 households</div></div></div>
                <div className="metric-card"><div className="metric-icon">🙌</div><div className="metric-content"><div className="metric-title">Volunteerism</div><div className="metric-value">{Math.round(communityMetrics.volunteerism * 100)}%</div><div className="metric-description">Households volunteering</div></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default HouseholdEconomicsScreen;
