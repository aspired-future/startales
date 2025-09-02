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

interface WellbeingMetrics {
  score: number;
  housing: {
    homeOwnershipRate: number;
    avgHouseholdSize: number;
    urbanizationRate: number;
  };
  family: {
    fertilityRate: number;
    medianAge: number;
    childcareAccess: number;
  };
  community: {
    civicParticipation: number;
    crimeRate: number;
    volunteerism: number;
  };
}

interface HouseholdEconomicsData {
  economicStatus: EconomicStatus;
  demandData: DemandCalculation[];
  mobilityOpportunities: MobilityOpportunity[];
  mobilityEvents: SocialMobilityEvent[];
  wellbeingMetrics: WellbeingMetrics;
}

const HouseholdEconomicsScreen: React.FC<ScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  console.log('🏠 HouseholdEconomicsScreen: Component rendering with gameContext:', gameContext);

  const [householdData, setHouseholdData] = useState<HouseholdEconomicsData | null>(null);
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
    { id: 'demand', label: 'Demand', icon: '📈' },
    { id: 'mobility', label: 'Mobility', icon: '🎓' },
    { id: 'wellbeing', label: 'Wellbeing', icon: '💖' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const fetchHouseholdEconomicsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏠 HouseholdEconomicsScreen: Starting data fetch...');

      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/households/economics');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('🏠 HouseholdEconomicsScreen: Using API data:', result.data);
          setHouseholdData(result.data);
        } else {
          throw new Error('API response format error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('🏠 HouseholdEconomicsScreen: Failed to fetch household economics data:', err);
      console.log('🏠 HouseholdEconomicsScreen: Using mock data fallback...');
      // Use comprehensive mock data
      const mockData: HouseholdEconomicsData = {
        economicStatus: {
          campaign_id: 1,
          total_population: 150000,
          tier_distribution: {
            poor: 60000,    // 40%
            median: 75000,  // 50%
            rich: 15000     // 10%
          },
          gini_coefficient: 0.42,
          economic_health_score: 68.5
        },
        demandData: [
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
          },
          {
            tier: 'poor',
            resource_type: 'housing',
            base_demand: 12000,
            final_demand: 11000,
            elasticity_impact: -0.083,
            price_sensitivity: 0.7
          },
          {
            tier: 'median',
            resource_type: 'housing',
            base_demand: 30000,
            final_demand: 28500,
            elasticity_impact: -0.05,
            price_sensitivity: 0.4
          },
          {
            tier: 'rich',
            resource_type: 'housing',
            base_demand: 8000,
            final_demand: 7800,
            elasticity_impact: -0.025,
            price_sensitivity: 0.1
          }
        ],
        mobilityOpportunities: [
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
            resource_cost: { capital: 10000, gold: 5000 },
            description: 'Start a small business with initial capital investment'
          },
          {
            id: '3',
            from_tier: 'median',
            to_tier: 'rich',
            event_type: 'PROPERTY_INVESTMENT',
            success_probability: 0.35,
            resource_cost: { property: 25000, gold: 10000 },
            description: 'Invest in real estate and property development'
          },
          {
            id: '4',
            from_tier: 'median',
            to_tier: 'rich',
            event_type: 'TECHNOLOGY_INNOVATION',
            success_probability: 0.25,
            resource_cost: { research: 15000, gold: 8000 },
            description: 'Develop innovative technology solutions for market disruption'
          },
          {
            id: '5',
            from_tier: 'rich',
            to_tier: 'median',
            event_type: 'MARKET_CRASH',
            success_probability: 0.15,
            resource_cost: { market_loss: 20000 },
            description: 'Economic downturn affecting investment portfolios'
          }
        ],
        mobilityEvents: [
          {
            id: '1',
            campaign_id: 1,
            household_id: 'HH001',
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
            household_id: 'HH002',
            event_type: 'BUSINESS_STARTUP',
            from_tier: 'poor',
            to_tier: 'median',
            outcome: 'failure',
            success_probability: 0.45,
            resource_cost: { capital: 10000, gold: 5000 },
            created_at: '2024-01-14T14:20:00Z'
          },
          {
            id: '3',
            campaign_id: 1,
            household_id: 'HH003',
            event_type: 'PROPERTY_INVESTMENT',
            from_tier: 'median',
            to_tier: 'rich',
            outcome: 'success',
            success_probability: 0.35,
            resource_cost: { property: 25000, gold: 10000 },
            created_at: '2024-01-13T09:15:00Z'
          },
          {
            id: '4',
            campaign_id: 1,
            household_id: 'HH004',
            event_type: 'MARKET_CRASH',
            from_tier: 'rich',
            to_tier: 'median',
            outcome: 'success',
            success_probability: 0.15,
            resource_cost: { market_loss: 20000 },
            created_at: '2024-01-12T16:45:00Z'
          }
        ],
        wellbeingMetrics: {
          score: 72.4,
          housing: {
            homeOwnershipRate: 0.58,
            avgHouseholdSize: 3.2,
            urbanizationRate: 0.67
          },
          family: {
            fertilityRate: 1.9,
            medianAge: 34.5,
            childcareAccess: 0.62
          },
          community: {
            civicParticipation: 0.48,
            crimeRate: 0.12,
            volunteerism: 0.27
          }
        }
      };
      console.log('🏠 HouseholdEconomicsScreen: Setting mock data:', mockData);
      setHouseholdData(mockData);
    } finally {
      setLoading(false);
      console.log('🏠 HouseholdEconomicsScreen: Data fetch completed');
    }
  }, []);

  useEffect(() => {
    fetchHouseholdEconomicsData();
  }, [fetchHouseholdEconomicsData]);

  useEffect(() => {
    console.log('🏠 HouseholdEconomicsScreen: householdData changed:', householdData);
  }, [householdData]);

  const renderOverview = () => {
    console.log('🏠 HouseholdEconomicsScreen: renderOverview called, householdData:', householdData);
    if (!householdData) return null;

    const { economicStatus } = householdData;
    const { tier_distribution } = economicStatus;

    return (
      <>
        {/* Key Metrics */}
        <div className="standard-panel social-theme">
          <h3>📊 Economic Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{economicStatus.total_population.toLocaleString()}</div>
              <div className="metric-label">Total Population</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(economicStatus.gini_coefficient * 100).toFixed(1)}%</div>
              <div className="metric-label">Gini Coefficient</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{economicStatus.economic_health_score.toFixed(1)}</div>
              <div className="metric-label">Economic Health Score</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.wellbeingMetrics.score.toFixed(1)}</div>
              <div className="metric-label">Wellbeing Score</div>
            </div>
          </div>
        </div>

        {/* Population Distribution */}
        <div className="standard-panel social-theme">
          <h3>👥 Population Distribution</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{tier_distribution.poor.toLocaleString()}</div>
              <div className="metric-label">Poor Tier (40%)</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '40%', backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{tier_distribution.median.toLocaleString()}</div>
              <div className="metric-label">Median Tier (50%)</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '50%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{tier_distribution.rich.toLocaleString()}</div>
              <div className="metric-label">Rich Tier (10%)</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '10%', backgroundColor: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Economic Indicators */}
        <div className="standard-panel social-theme">
          <h3>📈 Economic Indicators</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{(householdData.wellbeingMetrics.housing.homeOwnershipRate * 100).toFixed(1)}%</div>
              <div className="metric-label">Home Ownership Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.wellbeingMetrics.housing.avgHouseholdSize}</div>
              <div className="metric-label">Avg Household Size</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(householdData.wellbeingMetrics.housing.urbanizationRate * 100).toFixed(1)}%</div>
              <div className="metric-label">Urbanization Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.wellbeingMetrics.family.fertilityRate}</div>
              <div className="metric-label">Fertility Rate</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDemand = () => {
    if (!householdData) return null;

    return (
      <>
        <div className="standard-panel social-theme table-panel">
          <h3>📈 Demand Analysis</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Resource Type</th>
                  <th>Base Demand</th>
                  <th>Final Demand</th>
                  <th>Elasticity Impact</th>
                  <th>Price Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                {householdData.demandData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`tier-badge tier-${item.tier}`}>
                        {item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
                      </span>
                    </td>
                    <td>{item.resource_type.replace('_', ' ').toUpperCase()}</td>
                    <td>{item.base_demand.toLocaleString()}</td>
                    <td>{item.final_demand.toLocaleString()}</td>
                    <td>
                      <span className={`elasticity-impact ${item.elasticity_impact > -0.1 ? 'low' : item.elasticity_impact > -0.3 ? 'medium' : 'high'}`}>
                        {(item.elasticity_impact * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>{item.price_sensitivity.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderMobility = () => {
    if (!householdData) return null;

    return (
      <>
        {/* Mobility Statistics */}
        <div className="standard-panel social-theme">
          <h3>🎓 Social Mobility Statistics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{householdData.mobilityOpportunities.length}</div>
              <div className="metric-label">Available Opportunities</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.mobilityEvents.length}</div>
              <div className="metric-label">Recent Events</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">
                {householdData.mobilityEvents.filter(e => e.outcome === 'success').length}
              </div>
              <div className="metric-label">Successful Transitions</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">
                {(householdData.mobilityEvents.filter(e => e.outcome === 'success').length / householdData.mobilityEvents.length * 100).toFixed(1)}%
              </div>
              <div className="metric-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Mobility Opportunities */}
        <div className="standard-panel social-theme table-panel">
          <h3>🚀 Mobility Opportunities</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>From Tier</th>
                  <th>To Tier</th>
                  <th>Event Type</th>
                  <th>Success Probability</th>
                  <th>Resource Cost</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {householdData.mobilityOpportunities.map((opportunity) => (
                  <tr key={opportunity.id}>
                    <td>
                      <span className={`tier-badge tier-${opportunity.from_tier}`}>
                        {opportunity.from_tier.charAt(0).toUpperCase() + opportunity.from_tier.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`tier-badge tier-${opportunity.to_tier}`}>
                        {opportunity.to_tier.charAt(0).toUpperCase() + opportunity.to_tier.slice(1)}
                      </span>
                    </td>
                    <td>{opportunity.event_type.replace('_', ' ')}</td>
                    <td>
                      <span className={`probability-badge ${opportunity.success_probability > 0.5 ? 'high' : opportunity.success_probability > 0.3 ? 'medium' : 'low'}`}>
                        {(opportunity.success_probability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      {Object.entries(opportunity.resource_cost).map(([resource, cost]) => (
                        <div key={resource} className="resource-cost">
                          {resource}: {cost.toLocaleString()}
                        </div>
                      ))}
                    </td>
                    <td>{opportunity.description}</td>
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
    if (!householdData) return null;

    const { wellbeingMetrics } = householdData;

    return (
      <>
        {/* Wellbeing Overview */}
        <div className="standard-panel social-theme">
          <h3>💖 Wellbeing Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{wellbeingMetrics.score.toFixed(1)}</div>
              <div className="metric-label">Overall Wellbeing Score</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: `${wellbeingMetrics.score}%`, backgroundColor: '#10b981' }}></div>
              </div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.housing.homeOwnershipRate * 100).toFixed(1)}%</div>
              <div className="metric-label">Home Ownership Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{wellbeingMetrics.family.fertilityRate}</div>
              <div className="metric-label">Fertility Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.community.civicParticipation * 100).toFixed(1)}%</div>
              <div className="metric-label">Civic Participation</div>
            </div>
          </div>
        </div>

        {/* Housing Metrics */}
        <div className="standard-panel social-theme">
          <h3>🏠 Housing Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.housing.homeOwnershipRate * 100).toFixed(1)}%</div>
              <div className="metric-label">Home Ownership Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{wellbeingMetrics.housing.avgHouseholdSize}</div>
              <div className="metric-label">Average Household Size</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.housing.urbanizationRate * 100).toFixed(1)}%</div>
              <div className="metric-label">Urbanization Rate</div>
            </div>
          </div>
        </div>

        {/* Family & Community Metrics */}
        <div className="standard-panel social-theme">
          <h3>👨‍👩‍👧‍👦 Family & Community</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{wellbeingMetrics.family.fertilityRate}</div>
              <div className="metric-label">Fertility Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{wellbeingMetrics.family.medianAge}</div>
              <div className="metric-label">Median Age</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.family.childcareAccess * 100).toFixed(1)}%</div>
              <div className="metric-label">Childcare Access</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(wellbeingMetrics.community.volunteerism * 100).toFixed(1)}%</div>
              <div className="metric-label">Volunteerism Rate</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    if (!householdData) return null;

    return (
      <>
        {/* Overall Analytics */}
        <div className="standard-panel social-theme">
          <h3>📊 Household Analytics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{householdData.economicStatus.total_population.toLocaleString()}</div>
              <div className="metric-label">Total Population</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{(householdData.economicStatus.gini_coefficient * 100).toFixed(1)}%</div>
              <div className="metric-label">Income Inequality</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.economicStatus.economic_health_score.toFixed(1)}</div>
              <div className="metric-label">Economic Health</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{householdData.wellbeingMetrics.score.toFixed(1)}</div>
              <div className="metric-label">Wellbeing Score</div>
            </div>
          </div>
        </div>

        {/* Recent Mobility Events */}
        <div className="standard-panel social-theme table-panel">
          <h3>🔄 Recent Mobility Events</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>From Tier</th>
                  <th>To Tier</th>
                  <th>Outcome</th>
                  <th>Success Probability</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {householdData.mobilityEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.event_type.replace('_', ' ')}</td>
                    <td>
                      <span className={`tier-badge tier-${event.from_tier}`}>
                        {event.from_tier.charAt(0).toUpperCase() + event.from_tier.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`tier-badge tier-${event.to_tier}`}>
                        {event.to_tier.charAt(0).toUpperCase() + event.to_tier.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`outcome-badge ${event.outcome}`}>
                        {event.outcome.charAt(0).toUpperCase() + event.outcome.slice(1)}
                      </span>
                    </td>
                    <td>{(event.success_probability * 100).toFixed(0)}%</td>
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
      <div className="social-theme" style={{ minHeight: '800px' }}>
        {renderContent()}
      </div>
    </BaseScreen>
  );
};

export default HouseholdEconomicsScreen;
