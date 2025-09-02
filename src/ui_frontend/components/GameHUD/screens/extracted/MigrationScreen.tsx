import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './MigrationScreen.css';
import '../shared/StandardDesign.css';

interface GameContext {
  currentLocation: string;
  playerId: string;
}

interface MigrationFlow {
  id: string;
  origin: string;
  destination: string;
  volume: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  reason: string;
  demographics: {
    ageGroup: string;
    education: string;
    skillLevel: string;
  };
  distanceFactors: {
    proximityScore: number;
    transportationAccess: number;
    travelTime: number;
    borderEfficiency: number;
  };
  economicFactors: {
    jobOpportunities: number;
    wageGap: number;
    entrepreneurshipSupport: number;
    economicStability: number;
    socialMobility: number;
  };
  safetyFactors: {
    personalSafety: number;
    politicalStability: number;
    socialAcceptance: number;
    legalProtection: number;
    conflictRisk: number;
  };
}

interface ImmigrationPolicy {
  id: string;
  name: string;
  type: 'visa' | 'refugee' | 'skilled' | 'family' | 'student';
  status: 'active' | 'proposed' | 'suspended';
  requirements: string[];
  quotas: {
    annual: number;
    current: number;
    remaining: number;
  };
  effectiveness: number;
}

interface IntegrationOutcome {
  id: string;
  category: string;
  metric: string;
  value: number;
  trend: 'improving' | 'declining' | 'stable';
  factors: string[];
  programs: string[];
}

interface MigrationAnalytics {
  economicImpact: {
    gdpContribution: number;
    taxRevenue: number;
    jobsCreated: number;
    entrepreneurship: number;
  };
  socialMetrics: {
    integrationScore: number;
    languageProficiency: number;
    communityEngagement: number;
    culturalDiversity: number;
  };
  challenges: {
    housingPressure: number;
    serviceStrain: number;
    socialTension: number;
    skillMismatch: number;
  };
}

interface MigrationSimulation {
  id: string;
  scenario: string;
  parameters: {
    inflowRate: number;
    policyChanges: string[];
    economicConditions: string;
    integrationSupport: number;
  };
  projections: {
    population: number;
    economicImpact: number;
    integrationSuccess: number;
    resourceRequirements: number;
  };
}

interface MigrationData {
  overview: {
    totalMigrants: number;
    annualInflow: number;
    annualOutflow: number;
    netMigration: number;
    integrationRate: number;
    economicContribution: number;
  };
  flows: MigrationFlow[];
  policies: ImmigrationPolicy[];
  integration: IntegrationOutcome[];
  analytics: MigrationAnalytics;
  simulations: MigrationSimulation[];
}

const MigrationScreen: React.FC<ScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  console.log('🚶 MigrationScreen: Component rendering with gameContext:', gameContext);

  const [migrationData, setMigrationData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'flows' | 'policies' | 'integration' | 'analytics'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/migration/overview', description: 'Migration overview statistics' },
    { method: 'GET', path: '/api/migration/flows', description: 'Migration flow data' },
    { method: 'GET', path: '/api/migration/policies', description: 'Immigration policies' },
    { method: 'GET', path: '/api/migration/integration', description: 'Integration outcomes' },
    { method: 'GET', path: '/api/migration/analytics', description: 'Migration analytics' }
  ];

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'flows', label: 'Flows', icon: '🌊' },
    { id: 'policies', label: 'Policies', icon: '📋' },
    { id: 'integration', label: 'Integration', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const fetchMigrationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚶 MigrationScreen: Starting data fetch...');

      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/migration/overview');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('🚶 MigrationScreen: Using API data:', result.data);
          setMigrationData(result.data);
        } else {
          throw new Error('API response format error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('🚶 MigrationScreen: Failed to fetch migration data:', err);
      console.log('🚶 MigrationScreen: Using mock data fallback...');
      // Use comprehensive mock data
      const mockData: MigrationData = {
        overview: {
          totalMigrants: 2850000,
          annualInflow: 185000,
          annualOutflow: 45000,
          netMigration: 140000,
          integrationRate: 78.5,
          economicContribution: 12500000000
        },
        flows: [
          {
            id: '1',
            origin: 'Kepler-442b',
            destination: 'New Terra',
            volume: 15420,
            trend: 'increasing',
            reason: 'Economic opportunity',
            demographics: { ageGroup: '25-35', education: 'University', skillLevel: 'High' },
            distanceFactors: { proximityScore: 85, transportationAccess: 90, travelTime: 45, borderEfficiency: 78 },
            economicFactors: { jobOpportunities: 88, wageGap: 25, entrepreneurshipSupport: 75, economicStability: 82, socialMobility: 70 },
            safetyFactors: { personalSafety: 92, politicalStability: 85, socialAcceptance: 78, legalProtection: 88, conflictRisk: 15 }
          },
          {
            id: '2',
            origin: 'Proxima Centauri b',
            destination: 'New Terra',
            volume: 8930,
            trend: 'stable',
            reason: 'Family reunification',
            demographics: { ageGroup: '30-45', education: 'Secondary', skillLevel: 'Medium' },
            distanceFactors: { proximityScore: 95, transportationAccess: 85, travelTime: 30, borderEfficiency: 82 },
            economicFactors: { jobOpportunities: 75, wageGap: 15, entrepreneurshipSupport: 65, economicStability: 88, socialMobility: 65 },
            safetyFactors: { personalSafety: 88, politicalStability: 90, socialAcceptance: 85, legalProtection: 92, conflictRisk: 8 }
          },
          {
            id: '3',
            origin: 'Wolf 1061c',
            destination: 'New Terra',
            volume: 12750,
            trend: 'decreasing',
            reason: 'Political asylum',
            demographics: { ageGroup: '20-40', education: 'Mixed', skillLevel: 'Mixed' },
            distanceFactors: { proximityScore: 70, transportationAccess: 60, travelTime: 75, borderEfficiency: 65 },
            economicFactors: { jobOpportunities: 65, wageGap: 35, entrepreneurshipSupport: 55, economicStability: 70, socialMobility: 60 },
            safetyFactors: { personalSafety: 75, politicalStability: 60, socialAcceptance: 70, legalProtection: 78, conflictRisk: 45 }
          },
          {
            id: '4',
            origin: 'New Terra',
            destination: 'Gliese 667Cc',
            volume: 3200,
            trend: 'increasing',
            reason: 'Research opportunities',
            demographics: { ageGroup: '25-35', education: 'Advanced', skillLevel: 'Very High' },
            distanceFactors: { proximityScore: 60, transportationAccess: 75, travelTime: 90, borderEfficiency: 70 },
            economicFactors: { jobOpportunities: 85, wageGap: 20, entrepreneurshipSupport: 80, economicStability: 75, socialMobility: 85 },
            safetyFactors: { personalSafety: 85, politicalStability: 80, socialAcceptance: 75, legalProtection: 82, conflictRisk: 25 }
          }
        ],
        policies: [
          {
            id: '1',
            name: 'Skilled Worker Visa Program',
            type: 'skilled',
            status: 'active',
            requirements: ['University degree', 'Work experience', 'Language proficiency'],
            quotas: { annual: 50000, current: 32400, remaining: 17600 },
            effectiveness: 87
          },
          {
            id: '2',
            name: 'Family Reunification Program',
            type: 'family',
            status: 'active',
            requirements: ['Sponsor verification', 'Financial support', 'Background check'],
            quotas: { annual: 25000, current: 18200, remaining: 6800 },
            effectiveness: 92
          },
          {
            id: '3',
            name: 'Refugee Protection Initiative',
            type: 'refugee',
            status: 'active',
            requirements: ['Persecution evidence', 'Security screening', 'Health assessment'],
            quotas: { annual: 15000, current: 11300, remaining: 3700 },
            effectiveness: 78
          },
          {
            id: '4',
            name: 'Student Exchange Program',
            type: 'student',
            status: 'active',
            requirements: ['Academic acceptance', 'Financial guarantee', 'Health insurance'],
            quotas: { annual: 30000, current: 21500, remaining: 8500 },
            effectiveness: 85
          }
        ],
        integration: [
          {
            id: '1',
            category: 'Economic',
            metric: 'Employment Rate',
            value: 82.5,
            trend: 'improving',
            factors: ['Job training programs', 'Language support', 'Credential recognition'],
            programs: ['Work Integration Initiative', 'Skills Assessment Center']
          },
          {
            id: '2',
            category: 'Social',
            metric: 'Community Engagement',
            value: 76.8,
            trend: 'improving',
            factors: ['Cultural exchange programs', 'Community centers', 'Volunteer opportunities'],
            programs: ['Community Integration Network', 'Cultural Exchange Program']
          },
          {
            id: '3',
            category: 'Education',
            metric: 'Language Proficiency',
            value: 71.2,
            trend: 'stable',
            factors: ['Language classes', 'Immersion programs', 'Digital learning tools'],
            programs: ['Language Learning Initiative', 'Digital Education Platform']
          },
          {
            id: '4',
            category: 'Health',
            metric: 'Healthcare Access',
            value: 88.9,
            trend: 'improving',
            factors: ['Universal healthcare', 'Multilingual services', 'Cultural sensitivity training'],
            programs: ['Healthcare Access Program', 'Multilingual Health Services']
          }
        ],
        analytics: {
          economicImpact: {
            gdpContribution: 12500000000,
            taxRevenue: 2850000000,
            jobsCreated: 185000,
            entrepreneurship: 12500
          },
          socialMetrics: {
            integrationScore: 78.5,
            languageProficiency: 71.2,
            communityEngagement: 76.8,
            culturalDiversity: 85.3
          },
          challenges: {
            housingPressure: 65.2,
            serviceStrain: 58.7,
            socialTension: 42.1,
            skillMismatch: 38.9
          }
        },
        simulations: [
          {
            id: '1',
            scenario: 'High Growth Scenario',
            parameters: {
              inflowRate: 15,
              policyChanges: ['Expanded skilled worker program', 'Enhanced integration support'],
              economicConditions: 'Strong growth',
              integrationSupport: 85
            },
            projections: {
              population: 3200000,
              economicImpact: 15000000000,
              integrationSuccess: 82,
              resourceRequirements: 850000000
            }
          },
          {
            id: '2',
            scenario: 'Moderate Growth Scenario',
            parameters: {
              inflowRate: 8,
              policyChanges: ['Maintained current policies', 'Standard integration support'],
              economicConditions: 'Stable growth',
              integrationSupport: 70
            },
            projections: {
              population: 2950000,
              economicImpact: 12500000000,
              integrationSuccess: 75,
              resourceRequirements: 650000000
            }
          }
        ]
      };
      console.log('🚶 MigrationScreen: Setting mock data:', mockData);
      setMigrationData(mockData);
    } finally {
      setLoading(false);
      console.log('🚶 MigrationScreen: Data fetch completed');
    }
  }, []);

  useEffect(() => {
    fetchMigrationData();
  }, [fetchMigrationData]);

  useEffect(() => {
    console.log('🚶 MigrationScreen: migrationData changed:', migrationData);
  }, [migrationData]);

  const renderOverview = () => {
    console.log('🚶 MigrationScreen: renderOverview called, migrationData:', migrationData);
    if (!migrationData) return null;

    const { overview } = migrationData;

    return (
      <>
        {/* Key Metrics */}
        <div className="standard-panel social-theme">
          <h3>📊 Migration Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{overview.totalMigrants.toLocaleString()}</div>
              <div className="metric-label">Total Migrants</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{overview.annualInflow.toLocaleString()}</div>
              <div className="metric-label">Annual Inflow</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{overview.netMigration.toLocaleString()}</div>
              <div className="metric-label">Net Migration</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{overview.integrationRate.toFixed(1)}%</div>
              <div className="metric-label">Integration Rate</div>
            </div>
          </div>
        </div>

        {/* Economic Impact */}
        <div className="standard-panel social-theme">
          <h3>💰 Economic Impact</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">${(overview.economicContribution / 1000000000).toFixed(1)}B</div>
              <div className="metric-label">GDP Contribution</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{overview.annualOutflow.toLocaleString()}</div>
              <div className="metric-label">Annual Outflow</div>
            </div>
                         <div className="standard-metric">
               <div className="metric-value">${(migrationData.analytics.economicImpact.taxRevenue / 1000000000).toFixed(1)}B</div>
               <div className="metric-label">Tax Revenue</div>
             </div>
            <div className="standard-metric">
              <div className="metric-value">{migrationData.analytics.economicImpact.jobsCreated.toLocaleString()}</div>
              <div className="metric-label">Jobs Created</div>
            </div>
          </div>
        </div>

        {/* Social Metrics */}
        <div className="standard-panel social-theme table-panel">
          <h3>🤝 Social Integration</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Integration Score</td>
                  <td>{migrationData.analytics.socialMetrics.integrationScore.toFixed(1)}%</td>
                  <td>
                    <span className={`trend-badge trend-improving`}>
                      ↗️ Improving
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${migrationData.analytics.socialMetrics.integrationScore > 75 ? 'good' : 'warning'}`}>
                      {migrationData.analytics.socialMetrics.integrationScore > 75 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Language Proficiency</td>
                  <td>{migrationData.analytics.socialMetrics.languageProficiency.toFixed(1)}%</td>
                  <td>
                    <span className={`trend-badge trend-stable`}>
                      → Stable
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${migrationData.analytics.socialMetrics.languageProficiency > 70 ? 'good' : 'warning'}`}>
                      {migrationData.analytics.socialMetrics.languageProficiency > 70 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Community Engagement</td>
                  <td>{migrationData.analytics.socialMetrics.communityEngagement.toFixed(1)}%</td>
                  <td>
                    <span className={`trend-badge trend-improving`}>
                      ↗️ Improving
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${migrationData.analytics.socialMetrics.communityEngagement > 75 ? 'good' : 'warning'}`}>
                      {migrationData.analytics.socialMetrics.communityEngagement > 75 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Cultural Diversity</td>
                  <td>{migrationData.analytics.socialMetrics.culturalDiversity.toFixed(1)}%</td>
                  <td>
                    <span className={`trend-badge trend-improving`}>
                      ↗️ Improving
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge good`}>
                      Excellent
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderFlows = () => {
    if (!migrationData) return null;

    return (
      <>
        <div className="standard-panel social-theme table-panel">
          <h3>🌊 Migration Flows</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Volume</th>
                  <th>Trend</th>
                  <th>Reason</th>
                  <th>Age Group</th>
                </tr>
              </thead>
              <tbody>
                {migrationData.flows.map((flow) => (
                  <tr key={flow.id}>
                    <td>{flow.origin}</td>
                    <td>{flow.destination}</td>
                    <td>{flow.volume.toLocaleString()}</td>
                    <td>
                      <span className={`trend-badge trend-${flow.trend}`}>
                        {flow.trend === 'increasing' ? '↗️' : flow.trend === 'decreasing' ? '↘️' : '→'} {flow.trend}
                      </span>
                    </td>
                    <td>{flow.reason}</td>
                    <td>{flow.demographics.ageGroup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flow Analysis */}
        <div className="standard-panel social-theme">
          <h3>📈 Flow Analysis</h3>
          <div className="standard-metric-grid">
            {migrationData.flows.map((flow) => (
              <div className="standard-metric" key={flow.id}>
                <div className="metric-value">{flow.origin} → {flow.destination}</div>
                <div className="metric-label">{flow.volume.toLocaleString()} migrants</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ 
                    width: `${(flow.volume / 20000) * 100}%`,
                    backgroundColor: flow.trend === 'increasing' ? '#10b981' : flow.trend === 'decreasing' ? '#ef4444' : '#f59e0b'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderPolicies = () => {
    if (!migrationData) return null;

    return (
      <>
        <div className="standard-panel social-theme table-panel">
          <h3>📋 Immigration Policies</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Policy</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Annual Quota</th>
                  <th>Used</th>
                  <th>Effectiveness</th>
                </tr>
              </thead>
              <tbody>
                {migrationData.policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>{policy.name}</td>
                    <td>
                      <span className={`policy-type-badge type-${policy.type}`}>
                        {policy.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${policy.status === 'active' ? 'good' : policy.status === 'proposed' ? 'warning' : 'error'}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td>{policy.quotas.annual.toLocaleString()}</td>
                    <td>{policy.quotas.current.toLocaleString()}</td>
                    <td>
                      <span className={`effectiveness-badge ${policy.effectiveness > 80 ? 'high' : policy.effectiveness > 60 ? 'medium' : 'low'}`}>
                        {policy.effectiveness}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Policy Performance */}
        <div className="standard-panel social-theme">
          <h3>📊 Policy Performance</h3>
          <div className="standard-metric-grid">
            {migrationData.policies.map((policy) => (
              <div className="standard-metric" key={policy.id}>
                <div className="metric-value">{policy.name}</div>
                <div className="metric-label">{policy.effectiveness}% effective</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ 
                    width: `${policy.effectiveness}%`,
                    backgroundColor: policy.effectiveness > 80 ? '#10b981' : policy.effectiveness > 60 ? '#f59e0b' : '#ef4444'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderIntegration = () => {
    if (!migrationData) return null;

    return (
      <>
        <div className="standard-panel social-theme table-panel">
          <h3>🤝 Integration Outcomes</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {migrationData.integration.map((outcome) => (
                  <tr key={outcome.id}>
                    <td>{outcome.category}</td>
                    <td>{outcome.metric}</td>
                    <td>{outcome.value.toFixed(1)}%</td>
                    <td>
                      <span className={`trend-badge trend-${outcome.trend}`}>
                        {outcome.trend === 'improving' ? '↗️' : outcome.trend === 'declining' ? '↘️' : '→'} {outcome.trend}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${outcome.value > 75 ? 'good' : outcome.value > 60 ? 'warning' : 'error'}`}>
                        {outcome.value > 75 ? 'Good' : outcome.value > 60 ? 'Fair' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Programs */}
        <div className="standard-panel social-theme">
          <h3>🏛️ Integration Programs</h3>
          <div className="standard-metric-grid">
            {migrationData.integration.map((outcome) => (
              <div className="standard-metric" key={outcome.id}>
                <div className="metric-value">{outcome.category}</div>
                <div className="metric-label">{outcome.programs.length} active programs</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ 
                    width: `${outcome.value}%`,
                    backgroundColor: outcome.value > 75 ? '#10b981' : outcome.value > 60 ? '#f59e0b' : '#ef4444'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    if (!migrationData) return null;

    const { analytics } = migrationData;

    return (
      <>
        {/* Economic Impact */}
        <div className="standard-panel social-theme">
          <h3>💰 Economic Impact Analysis</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">${(analytics.economicImpact.gdpContribution / 1000000000).toFixed(1)}B</div>
              <div className="metric-label">GDP Contribution</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">${(analytics.economicImpact.taxRevenue / 1000000000).toFixed(1)}B</div>
              <div className="metric-label">Tax Revenue</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{analytics.economicImpact.jobsCreated.toLocaleString()}</div>
              <div className="metric-label">Jobs Created</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{analytics.economicImpact.entrepreneurship.toLocaleString()}</div>
              <div className="metric-label">New Businesses</div>
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="standard-panel social-theme table-panel">
          <h3>⚠️ Integration Challenges</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Pressure Level</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Housing Pressure</td>
                  <td>{analytics.challenges.housingPressure.toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge ${analytics.challenges.housingPressure > 70 ? 'error' : analytics.challenges.housingPressure > 50 ? 'warning' : 'good'}`}>
                      {analytics.challenges.housingPressure > 70 ? 'High' : analytics.challenges.housingPressure > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${analytics.challenges.housingPressure > 70 ? 'high' : analytics.challenges.housingPressure > 50 ? 'medium' : 'low'}`}>
                      {analytics.challenges.housingPressure > 70 ? 'High' : analytics.challenges.housingPressure > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Service Strain</td>
                  <td>{analytics.challenges.serviceStrain.toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge ${analytics.challenges.serviceStrain > 70 ? 'error' : analytics.challenges.serviceStrain > 50 ? 'warning' : 'good'}`}>
                      {analytics.challenges.serviceStrain > 70 ? 'High' : analytics.challenges.serviceStrain > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${analytics.challenges.serviceStrain > 70 ? 'high' : analytics.challenges.serviceStrain > 50 ? 'medium' : 'low'}`}>
                      {analytics.challenges.serviceStrain > 70 ? 'High' : analytics.challenges.serviceStrain > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Social Tension</td>
                  <td>{analytics.challenges.socialTension.toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge ${analytics.challenges.socialTension > 50 ? 'error' : analytics.challenges.socialTension > 30 ? 'warning' : 'good'}`}>
                      {analytics.challenges.socialTension > 50 ? 'High' : analytics.challenges.socialTension > 30 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${analytics.challenges.socialTension > 50 ? 'high' : analytics.challenges.socialTension > 30 ? 'medium' : 'low'}`}>
                      {analytics.challenges.socialTension > 50 ? 'High' : analytics.challenges.socialTension > 30 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Skill Mismatch</td>
                  <td>{analytics.challenges.skillMismatch.toFixed(1)}%</td>
                  <td>
                    <span className={`status-badge ${analytics.challenges.skillMismatch > 50 ? 'error' : analytics.challenges.skillMismatch > 30 ? 'warning' : 'good'}`}>
                      {analytics.challenges.skillMismatch > 50 ? 'High' : analytics.challenges.skillMismatch > 30 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${analytics.challenges.skillMismatch > 50 ? 'high' : analytics.challenges.skillMismatch > 30 ? 'medium' : 'low'}`}>
                      {analytics.challenges.skillMismatch > 50 ? 'High' : analytics.challenges.skillMismatch > 30 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
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
      case 'flows':
        return renderFlows();
      case 'policies':
        return renderPolicies();
      case 'integration':
        return renderIntegration();
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
          <p>Loading migration data...</p>
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
            <button onClick={fetchMigrationData} className="retry-button">
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

export default MigrationScreen;
