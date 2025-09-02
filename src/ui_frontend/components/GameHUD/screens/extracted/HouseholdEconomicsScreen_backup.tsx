import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './HouseholdEconomicsScreen.css';
import '../shared/StandardDesign.css';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'demand' | 'mobility' | 'wellbeing' | 'analytics'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/households/economics', description: 'Economic status & indicators' },
    { method: 'GET', path: '/api/households/demand', description: 'Demand calculations by tier' },
    { method: 'GET', path: '/api/households/mobility', description: 'Mobility opportunities & events' },
    { method: 'GET', path: '/api/households/wellbeing', description: 'Household wellbeing metrics' }
  ];

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'demand', label: 'Demand Analysis', icon: '📈' },
    { id: 'mobility', label: 'Social Mobility', icon: '🎓' },
    { id: 'wellbeing', label: 'Wellbeing', icon: '💖' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];
  
  const [economicStatus, setEconomicStatus] = useState<EconomicStatus | null>(null);
  const [demandData, setDemandData] = useState<DemandCalculation[]>([]);
  const [mobilityOpportunities, setMobilityOpportunities] = useState<MobilityOpportunity[]>([]);
  const [mobilityEvents, setMobilityEvents] = useState<SocialMobilityEvent[]>([]);
  // Extended household dimensions beyond economics
  const [wellbeingScore, setWellbeingScore] = useState<number>(72.4);
  const [housingStats, setHousingStats] = useState<{ homeOwnershipRate: number; avgHouseholdSize: number; urbanizationRate: number }>({ homeOwnershipRate: 0.58, avgHouseholdSize: 3.2, urbanizationRate: 0.67 });
  const [familyMetrics, setFamilyMetrics] = useState<{ fertilityRate: number; medianAge: number; childcareAccess: number }>({ fertilityRate: 1.9, medianAge: 34.5, childcareAccess: 0.62 });
  const [communityMetrics, setCommunityMetrics] = useState<{ civicParticipation: number; crimeRate: number; volunteerism: number }>({ civicParticipation: 0.48, crimeRate: 0.12, volunteerism: 0.27 });

  const fetchHouseholdEconomicsData = useCallback(async () => {
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
  }, [fetchHouseholdEconomicsData]);

  const renderOverview = () => {
    if (!economicStatus) return null;

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
      <>
        {/* Household Economics Overview - First card in 2-column grid */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏠 Household Economics Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Total Population</span>
              <span className="standard-metric-value">{(economicStatus.total_population / 1000).toFixed(0)}K</span>
            </div>
            <div className="standard-metric">
              <span>Poor Tier</span>
              <span className="standard-metric-value">{((economicStatus.tier_distribution.poor / economicStatus.total_population) * 100).toFixed(1)}%</span>
            </div>
            <div className="standard-metric">
              <span>Median Tier</span>
              <span className="standard-metric-value">{((economicStatus.tier_distribution.median / economicStatus.total_population) * 100).toFixed(1)}%</span>
            </div>
            <div className="standard-metric">
              <span>Rich Tier</span>
              <span className="standard-metric-value">{((economicStatus.tier_distribution.rich / economicStatus.total_population) * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Generate Household Report')}>Generate Report</button>
            <button className="standard-btn social-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
          </div>
        </div>

        {/* Economic Health Indicators - Second card in 2-column grid */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Economic Health Indicators</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Gini Coefficient</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Income inequality measure</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#a0a9ba' }}>Value:</span>
                  <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{economicStatus.gini_coefficient.toFixed(3)}</span>
                </div>
                <div>
                  <span style={{ color: '#a0a9ba' }}>Level:</span>
                  <span style={{ color: inequality.color, marginLeft: '0.5rem' }}>{inequality.level}</span>
                </div>
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Economic Health Score</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Overall economic wellbeing</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: '#a0a9ba' }}>Score:</span>
                  <span style={{ color: '#e0e6ed', marginLeft: '0.5rem' }}>{economicStatus.economic_health_score.toFixed(1)}/100</span>
                </div>
                <div>
                  <span style={{ color: '#a0a9ba' }}>Status:</span>
                  <span style={{ color: health.color, marginLeft: '0.5rem' }}>{health.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Population Distribution Chart - Third card spanning full width */}
        <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Population Distribution Visualization</h3>
          <div style={{ 
            height: '60px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            borderRadius: '8px', 
            display: 'flex', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${(economicStatus.tier_distribution.poor / economicStatus.total_population) * 100}%`,
              backgroundColor: '#e74c3c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Poor ({((economicStatus.tier_distribution.poor / economicStatus.total_population) * 100).toFixed(1)}%)
              </div>
            <div style={{ 
              width: `${(economicStatus.tier_distribution.median / economicStatus.total_population) * 100}%`,
              backgroundColor: '#f39c12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Median ({((economicStatus.tier_distribution.median / economicStatus.total_population) * 100).toFixed(1)}%)
              </div>
            <div style={{ 
              width: `${(economicStatus.tier_distribution.rich / economicStatus.total_population) * 100}%`,
              backgroundColor: '#2ecc71',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              Rich ({((economicStatus.tier_distribution.rich / economicStatus.total_population) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDemand = () => {
    const resourceTypes = [...new Set(demandData.map(d => d.resource_type))];
    
    return (
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Demand Analysis</h3>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Refresh Demand Data')}>Refresh Data</button>
            <button className="standard-btn social-theme" onClick={() => console.log('Export Demand Report')}>Export Report</button>
        </div>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Resource Type</th>
                  <th>Economic Tier</th>
                  <th>Base Demand</th>
                  <th>Final Demand</th>
                  <th>Price Sensitivity</th>
                  <th>Elasticity Impact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {demandData.map((demand, index) => (
                  <tr key={index}>
                    <td><strong>{demand.resource_type.replace('_', ' ').toUpperCase()}</strong></td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: demand.tier === 'poor' ? '#e74c3c' : demand.tier === 'median' ? '#f39c12' : '#2ecc71',
                        color: 'white'
                      }}>
                        {demand.tier.toUpperCase()}
                      </span>
                    </td>
                    <td>{demand.base_demand.toLocaleString()}</td>
                    <td>{demand.final_demand.toLocaleString()}</td>
                    <td>{demand.price_sensitivity.toFixed(2)}</td>
                    <td>
                      <span style={{ 
                        color: demand.elasticity_impact < 0 ? '#e74c3c' : '#2ecc71',
                        fontWeight: 'bold'
                      }}>
                          {demand.elasticity_impact > 0 ? '+' : ''}{(demand.elasticity_impact * 100).toFixed(1)}%
                        </span>
                    </td>
                    <td>
                      <button className="standard-btn social-theme">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
            </div>
      </div>
    );
  };

  const renderMobility = () => {
    const successfulEvents = mobilityEvents.filter(e => e.outcome === 'success').length;
    const failedEvents = mobilityEvents.filter(e => e.outcome === 'failure').length;
    const pendingEvents = mobilityEvents.filter(e => e.outcome === 'pending').length;
    const totalEvents = mobilityEvents.length;
    const successRate = totalEvents > 0 ? (successfulEvents / (successfulEvents + failedEvents)) * 100 : 0;

    return (
      <>
        {/* Mobility Statistics */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎓 Social Mobility Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Successful Transitions</span>
              <span className="standard-metric-value">{successfulEvents}</span>
            </div>
            <div className="standard-metric">
              <span>Pending Events</span>
              <span className="standard-metric-value">{pendingEvents}</span>
            </div>
            <div className="standard-metric">
              <span>Success Rate</span>
              <span className="standard-metric-value">{successRate.toFixed(1)}%</span>
            </div>
            <div className="standard-metric">
              <span>Available Opportunities</span>
              <span className="standard-metric-value">{mobilityOpportunities.length}</span>
            </div>
          </div>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Create Mobility Event')}>Create Event</button>
            <button className="standard-btn social-theme" onClick={() => console.log('View Opportunities')}>View Opportunities</button>
          </div>
        </div>

        {/* Mobility Opportunities */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🎯 Available Mobility Opportunities</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>From Tier</th>
                  <th>To Tier</th>
                  <th>Success Rate</th>
                  <th>Resource Cost</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mobilityOpportunities.map(opportunity => (
                  <tr key={opportunity.id}>
                    <td><strong>{opportunity.event_type.replace('_', ' ')}</strong></td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: opportunity.from_tier === 'poor' ? '#e74c3c' : opportunity.from_tier === 'median' ? '#f39c12' : '#2ecc71',
                        color: 'white'
                      }}>
                        {opportunity.from_tier.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: opportunity.to_tier === 'poor' ? '#e74c3c' : opportunity.to_tier === 'median' ? '#f39c12' : '#2ecc71',
                        color: 'white'
                      }}>
                        {opportunity.to_tier.toUpperCase()}
                      </span>
                    </td>
                    <td>{(opportunity.success_probability * 100).toFixed(1)}%</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                        {Object.entries(opportunity.resource_cost).map(([resource, amount]) => (
                          <span key={resource} style={{ 
                            padding: '0.2rem 0.4rem',
                            borderRadius: '3px',
                            fontSize: '0.7rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981'
                          }}>
                            {resource}: {amount.toLocaleString()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px' }}>{opportunity.description}</td>
                    <td>
                      <button className="standard-btn social-theme">Create Event</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderWellbeing = () => {
    return (
      <>
        {/* Wellbeing Overview */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>💖 Household Wellbeing Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Wellbeing Score</span>
              <span className="standard-metric-value">{wellbeingScore.toFixed(1)}</span>
            </div>
            <div className="standard-metric">
              <span>Healthcare Access</span>
              <span className="standard-metric-value">78%</span>
            </div>
            <div className="standard-metric">
              <span>Education Access</span>
              <span className="standard-metric-value">81%</span>
            </div>
          </div>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Generate Wellbeing Report')}>Generate Report</button>
            <button className="standard-btn social-theme" onClick={() => console.log('View Details')}>View Details</button>
              </div>
            </div>

        {/* Housing & Living */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏡 Housing & Living</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Home Ownership</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Owner-occupied households</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(housingStats.homeOwnershipRate * 100)}%
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Avg Household Size</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Persons per household</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {housingStats.avgHouseholdSize.toFixed(1)}
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Urbanization</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Urban households share</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(housingStats.urbanizationRate * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Family & Lifecycle */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>👪 Family & Lifecycle</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Fertility Rate</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Births per woman</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {familyMetrics.fertilityRate.toFixed(1)}
                  </div>
                </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Median Age</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Population median age</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {familyMetrics.medianAge.toFixed(1)}
              </div>
                </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Childcare Access</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Affordable childcare availability</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(familyMetrics.childcareAccess * 100)}%
                  </div>
                    </div>
                  </div>
                </div>
                
        {/* Community & Safety */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🤝 Community & Safety</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Civic Participation</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Active community involvement</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(communityMetrics.civicParticipation * 100)}%
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Crime Rate</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Incidents per 100 households</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(communityMetrics.crimeRate * 100)}%
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>Volunteerism</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#a0a9ba' }}>Households volunteering</p>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e0e6ed' }}>
                {Math.round(communityMetrics.volunteerism * 100)}%
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    return (
      <>
        {/* Analytics Overview */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Household Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="standard-metric">
              <span>Total Households</span>
              <span className="standard-metric-value">{(economicStatus?.total_population || 0).toLocaleString()}</span>
            </div>
            <div className="standard-metric">
              <span>Economic Health</span>
              <span className="standard-metric-value">{economicStatus?.economic_health_score.toFixed(1) || 0}/100</span>
            </div>
            <div className="standard-metric">
              <span>Wellbeing Score</span>
              <span className="standard-metric-value">{wellbeingScore.toFixed(1)}</span>
            </div>
          </div>
          <div className="standard-action-buttons">
            <button className="standard-btn social-theme" onClick={() => console.log('Generate Analytics Report')}>Generate Report</button>
            <button className="standard-btn social-theme" onClick={() => console.log('Export Data')}>Export Data</button>
                  </div>
                </div>
                
        {/* Recent Mobility Events */}
        <div className="standard-panel social-theme">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Recent Mobility Events</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>From Tier</th>
                  <th>To Tier</th>
                  <th>Status</th>
                  <th>Success Rate</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mobilityEvents.map(event => (
                  <tr key={event.id}>
                    <td><strong>{event.event_type.replace('_', ' ')}</strong></td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: event.from_tier === 'poor' ? '#e74c3c' : event.from_tier === 'median' ? '#f39c12' : '#2ecc71',
                        color: 'white'
                      }}>
                        {event.from_tier.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: event.to_tier === 'poor' ? '#e74c3c' : event.to_tier === 'median' ? '#f39c12' : '#2ecc71',
                        color: 'white'
                      }}>
                        {event.to_tier.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: event.outcome === 'success' ? '#2ecc71' : event.outcome === 'pending' ? '#f39c12' : '#e74c3c',
                        color: 'white'
                      }}>
                        {event.outcome.toUpperCase()}
                      </span>
                    </td>
                    <td>{(event.success_probability * 100).toFixed(1)}%</td>
                    <td>{new Date(event.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="standard-btn social-theme">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'demand':
        return renderDemand();
      case 'mobility':
        return renderMobility();
      case 'wellbeing':
        return renderWellbeing();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        apiEndpoints={apiEndpoints}
      >
        <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading household economics data...</p>
      </div>
      </BaseScreen>
    );
  }

  if (error) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        apiEndpoints={apiEndpoints}
      >
        <div className="error-container">
        <div className="error-message">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          <button onClick={fetchHouseholdEconomicsData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      apiEndpoints={apiEndpoints}
    >
      <div className="standard-screen-container social-theme">
        {renderContent()}
      </div>
    </BaseScreen>
  );
};

export default HouseholdEconomicsScreen;
