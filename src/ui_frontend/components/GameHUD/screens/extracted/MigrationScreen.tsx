import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './MigrationScreen.css';

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

const MigrationScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'flows' | 'policies' | 'integration' | 'analytics' | 'simulation'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { path: '/api/migration/overview', method: 'GET', description: 'Migration overview statistics' },
    { path: '/api/migration/flows', method: 'GET', description: 'Migration flow data' },
    { path: '/api/migration/policies', method: 'GET', description: 'Immigration policies' },
    { path: '/api/migration/integration', method: 'GET', description: 'Integration outcomes' },
    { path: '/api/migration/analytics', method: 'GET', description: 'Migration analytics' },
    { path: '/api/migration/simulations', method: 'GET', description: 'Migration simulations' }
  ];

  // Mock data generators
  const generateMockFlows = (): MigrationFlow[] => [
    {
      id: '1',
      origin: 'Kepler-442b',
      destination: 'New Terra',
      volume: 15420,
      trend: 'increasing',
      reason: 'Economic opportunity',
      demographics: { ageGroup: '25-35', education: 'University', skillLevel: 'High' }
    },
    {
      id: '2',
      origin: 'Proxima Centauri b',
      destination: 'New Terra',
      volume: 8930,
      trend: 'stable',
      reason: 'Family reunification',
      demographics: { ageGroup: '30-45', education: 'Secondary', skillLevel: 'Medium' }
    },
    {
      id: '3',
      origin: 'Wolf 1061c',
      destination: 'New Terra',
      volume: 12750,
      trend: 'decreasing',
      reason: 'Political asylum',
      demographics: { ageGroup: '20-40', education: 'Mixed', skillLevel: 'Mixed' }
    },
    {
      id: '4',
      origin: 'New Terra',
      destination: 'Gliese 667Cc',
      volume: 3200,
      trend: 'increasing',
      reason: 'Research opportunities',
      demographics: { ageGroup: '25-35', education: 'Advanced', skillLevel: 'Very High' }
    }
  ];

  const generateMockPolicies = (): ImmigrationPolicy[] => [
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
      status: 'proposed',
      requirements: ['Academic acceptance', 'Financial proof', 'Return guarantee'],
      quotas: { annual: 30000, current: 0, remaining: 30000 },
      effectiveness: 0
    }
  ];

  const generateMockIntegration = (): IntegrationOutcome[] => [
    {
      id: '1',
      category: 'Employment',
      metric: 'Employment Rate',
      value: 78,
      trend: 'improving',
      factors: ['Skills recognition', 'Language training', 'Job placement'],
      programs: ['Career Bridge', 'Skills Assessment', 'Mentorship Network']
    },
    {
      id: '2',
      category: 'Education',
      metric: 'Educational Attainment',
      value: 65,
      trend: 'stable',
      factors: ['Credential recognition', 'Language barriers', 'Financial support'],
      programs: ['Education Pathway', 'Language Classes', 'Scholarship Fund']
    },
    {
      id: '3',
      category: 'Housing',
      metric: 'Housing Stability',
      value: 72,
      trend: 'declining',
      factors: ['Affordability', 'Discrimination', 'Location preferences'],
      programs: ['Housing First', 'Anti-discrimination', 'Community Support']
    },
    {
      id: '4',
      category: 'Health',
      metric: 'Healthcare Access',
      value: 84,
      trend: 'improving',
      factors: ['Insurance coverage', 'Cultural competency', 'Service availability'],
      programs: ['Universal Coverage', 'Cultural Training', 'Community Clinics']
    }
  ];

  const generateMockAnalytics = (): MigrationAnalytics => ({
    economicImpact: {
      gdpContribution: 12.5,
      taxRevenue: 8.9,
      jobsCreated: 45000,
      entrepreneurship: 23
    },
    socialMetrics: {
      integrationScore: 76,
      languageProficiency: 68,
      communityEngagement: 82,
      culturalDiversity: 91
    },
    challenges: {
      housingPressure: 34,
      serviceStrain: 28,
      socialTension: 15,
      skillMismatch: 22
    }
  });

  const generateMockSimulations = (): MigrationSimulation[] => [
    {
      id: '1',
      scenario: 'Increased Skilled Migration',
      parameters: {
        inflowRate: 125,
        policyChanges: ['Expand skilled visa quotas', 'Fast-track processing'],
        economicConditions: 'Strong growth',
        integrationSupport: 85
      },
      projections: {
        population: 2.85,
        economicImpact: 15.2,
        integrationSuccess: 82,
        resourceRequirements: 110
      }
    },
    {
      id: '2',
      scenario: 'Enhanced Integration Support',
      parameters: {
        inflowRate: 100,
        policyChanges: ['Increase integration funding', 'Expand language programs'],
        economicConditions: 'Moderate growth',
        integrationSupport: 95
      },
      projections: {
        population: 2.65,
        economicImpact: 13.8,
        integrationSuccess: 89,
        resourceRequirements: 125
      }
    },
    {
      id: '3',
      scenario: 'Refugee Crisis Response',
      parameters: {
        inflowRate: 150,
        policyChanges: ['Emergency refugee program', 'Temporary protection status'],
        economicConditions: 'Uncertain',
        integrationSupport: 70
      },
      projections: {
        population: 3.1,
        economicImpact: 8.5,
        integrationSuccess: 65,
        resourceRequirements: 145
      }
    }
  ];

  const fetchMigrationData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, these would be actual API calls
      const [overviewRes, flowsRes, policiesRes, integrationRes, analyticsRes, simulationsRes] = await Promise.all([
        fetch('/api/migration/overview'),
        fetch('/api/migration/flows'),
        fetch('/api/migration/policies'),
        fetch('/api/migration/integration'),
        fetch('/api/migration/analytics'),
        fetch('/api/migration/simulations')
      ]);

      // If APIs are not available, use mock data
      const migrationData: MigrationData = {
        overview: {
          totalMigrants: 2847392,
          annualInflow: 125000,
          annualOutflow: 35000,
          netMigration: 90000,
          integrationRate: 76,
          economicContribution: 12.5
        },
        flows: generateMockFlows(),
        policies: generateMockPolicies(),
        integration: generateMockIntegration(),
        analytics: generateMockAnalytics(),
        simulations: generateMockSimulations()
      };

      setMigrationData(migrationData);
    } catch (err) {
      console.error('Failed to fetch migration data:', err);
      // Use mock data as fallback
      setMigrationData({
        overview: {
          totalMigrants: 2847392,
          annualInflow: 125000,
          annualOutflow: 35000,
          netMigration: 90000,
          integrationRate: 76,
          economicContribution: 12.5
        },
        flows: generateMockFlows(),
        policies: generateMockPolicies(),
        integration: generateMockIntegration(),
        analytics: generateMockAnalytics(),
        simulations: generateMockSimulations()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMigrationData();
  }, [fetchMigrationData]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'increasing': case 'improving': return '📈';
      case 'decreasing': case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#4ecdc4';
      case 'proposed': return '#ffd93d';
      case 'suspended': return '#ff6b6b';
      default: return '#b8bcc8';
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchMigrationData}
    >
      <div className="migration-screen">
        <div className="view-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab ${activeTab === 'flows' ? 'active' : ''}`}
            onClick={() => setActiveTab('flows')}
          >
            🌊 Flows
          </button>
          <button
            className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            📋 Policies
          </button>
          <button
            className={`tab ${activeTab === 'integration' ? 'active' : ''}`}
            onClick={() => setActiveTab('integration')}
          >
            🤝 Integration
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`tab ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            🎯 Simulation
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading migration data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && migrationData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">👥</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatNumber(migrationData.overview.totalMigrants)}</div>
                        <div className="metric-label">Total Migrants</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📈</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatNumber(migrationData.overview.annualInflow)}</div>
                        <div className="metric-label">Annual Inflow</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📉</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatNumber(migrationData.overview.annualOutflow)}</div>
                        <div className="metric-label">Annual Outflow</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">⚖️</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatNumber(migrationData.overview.netMigration)}</div>
                        <div className="metric-label">Net Migration</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">🤝</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatPercentage(migrationData.overview.integrationRate)}</div>
                        <div className="metric-label">Integration Rate</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">💰</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatPercentage(migrationData.overview.economicContribution)}</div>
                        <div className="metric-label">Economic Contribution</div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-summary">
                    <div className="summary-panel">
                      <h3>Migration Status</h3>
                      <p>Current migration patterns show a positive net inflow of {formatNumber(migrationData.overview.netMigration)} individuals annually, contributing significantly to population growth and economic development.</p>
                      <div className="status-indicators">
                        <div className="status-item">
                          <span className="status-label">Population Growth:</span>
                          <span className="status-value positive">+3.2%</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Economic Impact:</span>
                          <span className="status-value positive">+{formatPercentage(migrationData.overview.economicContribution)}</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Integration Success:</span>
                          <span className="status-value positive">{formatPercentage(migrationData.overview.integrationRate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'flows' && (
                <div className="flows-tab">
                  <div className="flows-header">
                    <h3>Migration Flows Analysis</h3>
                    <div className="flow-controls">
                      <select className="flow-filter">
                        <option value="all">All Origins</option>
                        <option value="kepler">Kepler System</option>
                        <option value="proxima">Proxima System</option>
                        <option value="wolf">Wolf System</option>
                      </select>
                      <select className="flow-period">
                        <option value="annual">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flows-grid">
                    {migrationData.flows.map(flow => (
                      <div key={flow.id} className="flow-card">
                        <div className="flow-header">
                          <div className="flow-route">
                            <span className="origin">{flow.origin}</span>
                            <span className="arrow">→</span>
                            <span className="destination">{flow.destination}</span>
                          </div>
                          <div className="flow-trend">
                            {getTrendIcon(flow.trend)}
                          </div>
                        </div>
                        <div className="flow-volume">
                          <span className="volume-number">{formatNumber(flow.volume)}</span>
                          <span className="volume-label">migrants</span>
                        </div>
                        <div className="flow-details">
                          <div className="flow-reason">
                            <strong>Primary Reason:</strong> {flow.reason}
                          </div>
                          <div className="flow-demographics">
                            <div className="demo-item">
                              <span className="demo-label">Age:</span>
                              <span className="demo-value">{flow.demographics.ageGroup}</span>
                            </div>
                            <div className="demo-item">
                              <span className="demo-label">Education:</span>
                              <span className="demo-value">{flow.demographics.education}</span>
                            </div>
                            <div className="demo-item">
                              <span className="demo-label">Skills:</span>
                              <span className="demo-value">{flow.demographics.skillLevel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="policies-tab">
                  <div className="policies-header">
                    <h3>Immigration Policies</h3>
                    <button className="action-btn">Create New Policy</button>
                  </div>

                  <div className="policies-grid">
                    {migrationData.policies.map(policy => (
                      <div key={policy.id} className="policy-card">
                        <div className="policy-header">
                          <div className="policy-title">
                            <h4>{policy.name}</h4>
                            <span 
                              className="policy-status"
                              style={{ backgroundColor: getStatusColor(policy.status) }}
                            >
                              {policy.status}
                            </span>
                          </div>
                          <div className="policy-type">{policy.type}</div>
                        </div>

                        <div className="policy-quotas">
                          <div className="quota-item">
                            <span className="quota-label">Annual Quota:</span>
                            <span className="quota-value">{formatNumber(policy.quotas.annual)}</span>
                          </div>
                          <div className="quota-item">
                            <span className="quota-label">Current:</span>
                            <span className="quota-value">{formatNumber(policy.quotas.current)}</span>
                          </div>
                          <div className="quota-item">
                            <span className="quota-label">Remaining:</span>
                            <span className="quota-value">{formatNumber(policy.quotas.remaining)}</span>
                          </div>
                        </div>

                        <div className="policy-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${(policy.quotas.current / policy.quotas.annual) * 100}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {Math.round((policy.quotas.current / policy.quotas.annual) * 100)}% utilized
                          </span>
                        </div>

                        <div className="policy-requirements">
                          <h5>Requirements:</h5>
                          <ul>
                            {policy.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="policy-effectiveness">
                          <span className="effectiveness-label">Effectiveness:</span>
                          <span className="effectiveness-value">{policy.effectiveness}%</span>
                        </div>

                        <div className="policy-actions">
                          <button className="action-btn secondary">Edit Policy</button>
                          <button className="action-btn secondary">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'integration' && (
                <div className="integration-tab">
                  <div className="integration-header">
                    <h3>Integration Outcomes</h3>
                    <div className="integration-controls">
                      <select className="integration-filter">
                        <option value="all">All Categories</option>
                        <option value="employment">Employment</option>
                        <option value="education">Education</option>
                        <option value="housing">Housing</option>
                        <option value="health">Health</option>
                      </select>
                    </div>
                  </div>

                  <div className="integration-grid">
                    {migrationData.integration.map(outcome => (
                      <div key={outcome.id} className="integration-card">
                        <div className="integration-header">
                          <div className="integration-category">{outcome.category}</div>
                          <div className="integration-trend">
                            {getTrendIcon(outcome.trend)}
                          </div>
                        </div>

                        <div className="integration-metric">
                          <div className="metric-name">{outcome.metric}</div>
                          <div className="metric-value">{outcome.value}%</div>
                        </div>

                        <div className="integration-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${outcome.value}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="integration-factors">
                          <h5>Key Factors:</h5>
                          <ul>
                            {outcome.factors.map((factor, index) => (
                              <li key={index}>{factor}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="integration-programs">
                          <h5>Active Programs:</h5>
                          <div className="program-tags">
                            {outcome.programs.map((program, index) => (
                              <span key={index} className="program-tag">{program}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-sections">
                    <div className="analytics-section">
                      <h3>Economic Impact</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="analytics-icon">📈</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{formatPercentage(migrationData.analytics.economicImpact.gdpContribution)}</div>
                            <div className="analytics-label">GDP Contribution</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">💰</div>
                          <div className="analytics-content">
                            <div className="analytics-value">${migrationData.analytics.economicImpact.taxRevenue}B</div>
                            <div className="analytics-label">Tax Revenue</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">👷</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{formatNumber(migrationData.analytics.economicImpact.jobsCreated)}</div>
                            <div className="analytics-label">Jobs Created</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">🚀</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.economicImpact.entrepreneurship}%</div>
                            <div className="analytics-label">Entrepreneurship Rate</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h3>Social Metrics</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card">
                          <div className="analytics-icon">🤝</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.socialMetrics.integrationScore}%</div>
                            <div className="analytics-label">Integration Score</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">🗣️</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.socialMetrics.languageProficiency}%</div>
                            <div className="analytics-label">Language Proficiency</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">🏘️</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.socialMetrics.communityEngagement}%</div>
                            <div className="analytics-label">Community Engagement</div>
                          </div>
                        </div>
                        <div className="analytics-card">
                          <div className="analytics-icon">🌍</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.socialMetrics.culturalDiversity}%</div>
                            <div className="analytics-label">Cultural Diversity</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h3>Challenges</h3>
                      <div className="analytics-grid">
                        <div className="analytics-card challenge">
                          <div className="analytics-icon">🏠</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.challenges.housingPressure}%</div>
                            <div className="analytics-label">Housing Pressure</div>
                          </div>
                        </div>
                        <div className="analytics-card challenge">
                          <div className="analytics-icon">🏥</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.challenges.serviceStrain}%</div>
                            <div className="analytics-label">Service Strain</div>
                          </div>
                        </div>
                        <div className="analytics-card challenge">
                          <div className="analytics-icon">⚡</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.challenges.socialTension}%</div>
                            <div className="analytics-label">Social Tension</div>
                          </div>
                        </div>
                        <div className="analytics-card challenge">
                          <div className="analytics-icon">🎯</div>
                          <div className="analytics-content">
                            <div className="analytics-value">{migrationData.analytics.challenges.skillMismatch}%</div>
                            <div className="analytics-label">Skill Mismatch</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'simulation' && (
                <div className="simulation-tab">
                  <div className="simulation-header">
                    <h3>Migration Simulations</h3>
                    <button className="action-btn">Create New Simulation</button>
                  </div>

                  <div className="simulations-grid">
                    {migrationData.simulations.map(simulation => (
                      <div key={simulation.id} className="simulation-card">
                        <div className="simulation-header">
                          <h4>{simulation.scenario}</h4>
                          <button className="action-btn secondary">Run Simulation</button>
                        </div>

                        <div className="simulation-parameters">
                          <h5>Parameters:</h5>
                          <div className="parameter-item">
                            <span className="param-label">Inflow Rate:</span>
                            <span className="param-value">{simulation.parameters.inflowRate}%</span>
                          </div>
                          <div className="parameter-item">
                            <span className="param-label">Economic Conditions:</span>
                            <span className="param-value">{simulation.parameters.economicConditions}</span>
                          </div>
                          <div className="parameter-item">
                            <span className="param-label">Integration Support:</span>
                            <span className="param-value">{simulation.parameters.integrationSupport}%</span>
                          </div>
                          <div className="parameter-changes">
                            <h6>Policy Changes:</h6>
                            <ul>
                              {simulation.parameters.policyChanges.map((change, index) => (
                                <li key={index}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="simulation-projections">
                          <h5>Projections:</h5>
                          <div className="projection-grid">
                            <div className="projection-item">
                              <div className="projection-icon">👥</div>
                              <div className="projection-content">
                                <div className="projection-value">{simulation.projections.population}M</div>
                                <div className="projection-label">Population</div>
                              </div>
                            </div>
                            <div className="projection-item">
                              <div className="projection-icon">💰</div>
                              <div className="projection-content">
                                <div className="projection-value">{formatPercentage(simulation.projections.economicImpact)}</div>
                                <div className="projection-label">Economic Impact</div>
                              </div>
                            </div>
                            <div className="projection-item">
                              <div className="projection-icon">🤝</div>
                              <div className="projection-content">
                                <div className="projection-value">{simulation.projections.integrationSuccess}%</div>
                                <div className="projection-label">Integration Success</div>
                              </div>
                            </div>
                            <div className="projection-item">
                              <div className="projection-icon">📊</div>
                              <div className="projection-content">
                                <div className="projection-value">{simulation.projections.resourceRequirements}%</div>
                                <div className="projection-label">Resource Requirements</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default MigrationScreen;
