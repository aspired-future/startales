import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CentralBankScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface CentralBankOverview {
  independenceScore: number;
  policyRate: number;
  inflationTarget: number;
  marketConfidence: number;
  policyStance: 'dovish' | 'neutral' | 'hawkish';
  lastMeeting: string;
  nextMeeting: string;
  governor: string;
  mandate: string[];
}

interface PolicyRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  impact: string;
  timeline: string;
  rationale: string;
  riskAssessment: string;
  marketReaction: 'positive' | 'negative' | 'neutral';
}

interface FinancialStability {
  overallScore: number;
  bankingSystem: {
    capitalAdequacy: number;
    liquidityRatio: number;
    nonPerformingLoans: number;
    profitability: number;
    systemicRisk: number;
  };
  marketStability: {
    volatilityIndex: number;
    creditSpreads: number;
    currencyStability: number;
    bondYields: number;
  };
  macroeconomic: {
    gdpGrowth: number;
    inflation: number;
    unemployment: number;
    currentAccount: number;
    fiscalBalance: number;
  };
  warnings: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
}

interface PolicySettings {
  interestRate: {
    current: number;
    target: number;
    corridor: { upper: number; lower: number };
    lastChange: string;
    nextReview: string;
  };
  reserveRequirements: {
    commercial: number;
    investment: number;
    foreign: number;
    lastUpdate: string;
  };
  quantitativeEasing: {
    active: boolean;
    monthlyPurchases: number;
    totalAssets: number;
    targetDuration: string;
  };
  forwardGuidance: {
    currentMessage: string;
    effectiveness: number;
    lastUpdate: string;
    marketReception: 'positive' | 'negative' | 'neutral';
  };
  macroprudential: {
    countercyclicalBuffer: number;
    loanToValueRatio: number;
    debtToIncomeRatio: number;
    systemicRiskBuffer: number;
  };
}

interface EconomicResearch {
  currentProjects: Array<{
    id: string;
    title: string;
    status: 'ongoing' | 'completed' | 'planned';
    priority: 'high' | 'medium' | 'low';
    completion: number;
    expectedCompletion: string;
    keyFindings: string[];
    policyImplications: string;
  }>;
  recentPublications: Array<{
    title: string;
    date: string;
    type: 'working_paper' | 'policy_brief' | 'research_note';
    summary: string;
    impact: number;
  }>;
  dataAnalysis: {
    inflationForecasts: Array<{ period: string; forecast: number; confidence: number }>;
    gdpProjections: Array<{ period: string; forecast: number; confidence: number }>;
    riskAssessments: Array<{ category: string; level: number; trend: 'increasing' | 'stable' | 'decreasing' }>;
  };
}

interface CrisisManagement {
  currentThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeCrises: Array<{
    id: string;
    type: 'banking' | 'currency' | 'sovereign' | 'market' | 'systemic';
    severity: number;
    description: string;
    timeline: string;
    responseActions: string[];
    status: 'monitoring' | 'responding' | 'contained' | 'resolved';
  }>;
  contingencyPlans: Array<{
    scenario: string;
    triggers: string[];
    responses: string[];
    coordination: string[];
    lastUpdated: string;
  }>;
  emergencyTools: {
    liquidityFacilities: boolean;
    emergencyLending: boolean;
    marketMaking: boolean;
    currencySwaps: boolean;
    capitalControls: boolean;
  };
}

interface LeaderAuthority {
  independenceMetrics: {
    legalFramework: number;
    operationalAutonomy: number;
    appointmentProcess: number;
    budgetaryIndependence: number;
    policyOverride: number;
  };
  politicalPressure: {
    currentLevel: number;
    sources: string[];
    recentIncidents: Array<{
      date: string;
      type: string;
      description: string;
      response: string;
    }>;
  };
  publicCommunication: {
    transparency: number;
    marketCredibility: number;
    publicSupport: number;
    mediaRelations: number;
  };
  governorProfile: {
    name: string;
    tenure: string;
    background: string;
    credibility: number;
    marketRespect: number;
    politicalRelations: string;
  };
}

interface CentralBankData {
  overview: CentralBankOverview;
  recommendations: PolicyRecommendation[];
  stability: FinancialStability;
  settings: PolicySettings;
  research: EconomicResearch;
  crisis: CrisisManagement;
  authority: LeaderAuthority;
}

const CentralBankScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [bankData, setBankData] = useState<CentralBankData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'stability' | 'research' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🏦' },
    { id: 'policies', label: 'Policies', icon: '⚙️' },
    { id: 'stability', label: 'Stability', icon: '🛡️' },
    { id: 'research', label: 'Research', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/central-bank', description: 'Get central bank data' },
    { method: 'GET', path: '/api/central-bank/policies', description: 'Get policy settings' },
    { method: 'GET', path: '/api/central-bank/stability', description: 'Get financial stability' },
    { method: 'GET', path: '/api/central-bank/research', description: 'Get research data' }
  ];

  const getPolicyStanceColor = (stance: string) => {
    switch (stance) {
      case 'hawkish': return '#ef4444';
      case 'dovish': return '#10b981';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return '#10b981';
      case 'approved': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchBankData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/central-bank');
      if (response.ok) {
        const data = await response.json();
        setBankData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch central bank data:', err);
      // Use comprehensive mock data
      setBankData({
        overview: {
          independenceScore: 85,
          policyRate: 4.25,
          inflationTarget: 2.0,
          marketConfidence: 78,
          policyStance: 'neutral',
          lastMeeting: '2024-03-15',
          nextMeeting: '2024-04-15',
          governor: 'Dr. Sarah Martinez',
          mandate: ['Price Stability', 'Financial Stability', 'Economic Growth']
        },
        recommendations: [
          {
            id: 'rec-1',
            title: 'Increase Policy Rate by 25bps',
            description: 'Gradual tightening to address inflationary pressures while maintaining economic growth',
            priority: 'high',
            status: 'pending',
            impact: 'Moderate impact on lending rates and economic activity',
            timeline: 'Next policy meeting',
            rationale: 'Inflation above target, strong economic indicators',
            riskAssessment: 'Low risk of economic slowdown',
            marketReaction: 'neutral'
          },
          {
            id: 'rec-2',
            title: 'Enhance Macroprudential Measures',
            description: 'Strengthen banking sector resilience through additional capital requirements',
            priority: 'medium',
            status: 'approved',
            impact: 'Improved financial stability, moderate impact on credit availability',
            timeline: '3-6 months implementation',
            rationale: 'Rising systemic risk indicators, credit growth concerns',
            riskAssessment: 'Medium risk of credit tightening',
            marketReaction: 'positive'
          },
          {
            id: 'rec-3',
            title: 'Expand Research on Digital Currency',
            description: 'Investigate central bank digital currency feasibility and implications',
            priority: 'low',
            status: 'implemented',
            impact: 'Long-term strategic positioning, minimal immediate impact',
            timeline: '12-18 months study period',
            rationale: 'Technological advancement, payment system evolution',
            riskAssessment: 'Low risk, high strategic value',
            marketReaction: 'positive'
          }
        ],
        stability: {
          overallScore: 82,
          bankingSystem: {
            capitalAdequacy: 15.2,
            liquidityRatio: 125,
            nonPerformingLoans: 2.1,
            profitability: 12.8,
            systemicRisk: 3.2
          },
          marketStability: {
            volatilityIndex: 18.5,
            creditSpreads: 125,
            currencyStability: 85,
            bondYields: 4.2
          },
          macroeconomic: {
            gdpGrowth: 2.8,
            inflation: 3.2,
            unemployment: 4.1,
            currentAccount: -1.2,
            fiscalBalance: -2.8
          },
          warnings: [
            {
              type: 'Credit Growth',
              severity: 'medium',
              description: 'Rapid credit expansion in commercial real estate sector',
              recommendation: 'Monitor closely, consider macroprudential measures'
            },
            {
              type: 'Inflation',
              severity: 'high',
              description: 'Inflation persistently above target range',
              recommendation: 'Consider policy rate adjustment'
            }
          ]
        },
        settings: {
          interestRate: {
            current: 4.25,
            target: 4.25,
            corridor: { upper: 4.5, lower: 4.0 },
            lastChange: '2024-01-15',
            nextReview: '2024-04-15'
          },
          reserveRequirements: {
            commercial: 10.0,
            investment: 8.0,
            foreign: 12.0,
            lastUpdate: '2024-02-01'
          },
          quantitativeEasing: {
            active: false,
            monthlyPurchases: 0,
            totalAssets: 8500000000000,
            targetDuration: 'N/A'
          },
          forwardGuidance: {
            currentMessage: 'Policy rate likely to remain elevated until inflation sustainably returns to target',
            effectiveness: 75,
            lastUpdate: '2024-03-15',
            marketReception: 'neutral'
          },
          macroprudential: {
            countercyclicalBuffer: 1.0,
            loanToValueRatio: 80,
            debtToIncomeRatio: 4.5,
            systemicRiskBuffer: 2.0
          }
        },
        research: {
          currentProjects: [
            {
              id: 'proj-1',
              title: 'Climate Risk Assessment Framework',
              status: 'ongoing',
              priority: 'high',
              completion: 65,
              expectedCompletion: '2024-06-30',
              keyFindings: ['Climate risks significant for financial stability', 'Need for enhanced disclosure requirements'],
              policyImplications: 'Potential new regulatory framework for climate risk management'
            },
            {
              id: 'proj-2',
              title: 'Digital Currency Feasibility Study',
              status: 'ongoing',
              priority: 'medium',
              completion: 40,
              expectedCompletion: '2024-12-31',
              keyFindings: ['Technical feasibility confirmed', 'Significant operational challenges identified'],
              policyImplications: 'Gradual approach recommended, pilot program under consideration'
            }
          ],
          recentPublications: [
            {
              title: 'Monetary Policy Transmission in Digital Era',
              date: '2024-02-15',
              type: 'working_paper',
              summary: 'Analysis of how digitalization affects monetary policy effectiveness',
              impact: 8.5
            },
            {
              title: 'Financial Stability Report Q4 2023',
              date: '2024-01-30',
              type: 'policy_brief',
              summary: 'Comprehensive assessment of financial system resilience',
              impact: 9.2
            }
          ],
          dataAnalysis: {
            inflationForecasts: [
              { period: 'Q2 2024', forecast: 3.1, confidence: 75 },
              { period: 'Q3 2024', forecast: 2.8, confidence: 70 },
              { period: 'Q4 2024', forecast: 2.5, confidence: 65 }
            ],
            gdpProjections: [
              { period: 'Q2 2024', forecast: 2.6, confidence: 80 },
              { period: 'Q3 2024', forecast: 2.8, confidence: 75 },
              { period: 'Q4 2024', forecast: 3.0, confidence: 70 }
            ],
            riskAssessments: [
              { category: 'Credit Risk', level: 6.5, trend: 'increasing' },
              { category: 'Market Risk', level: 4.2, trend: 'stable' },
              { category: 'Liquidity Risk', level: 3.8, trend: 'decreasing' }
            ]
          }
        },
        crisis: {
          currentThreatLevel: 'low',
          activeCrises: [
            {
              id: 'crisis-1',
              type: 'market',
              severity: 4.2,
              description: 'Elevated volatility in bond markets due to inflation concerns',
              timeline: 'Ongoing since March 2024',
              responseActions: ['Enhanced market monitoring', 'Liquidity provision if needed'],
              status: 'monitoring'
            }
          ],
          contingencyPlans: [
            {
              scenario: 'Banking Sector Stress',
              triggers: ['Capital adequacy below 8%', 'Liquidity ratio below 100%'],
              responses: ['Emergency liquidity facilities', 'Capital injection programs'],
              coordination: ['Treasury', 'Financial Regulators', 'International Partners'],
              lastUpdated: '2024-01-15'
            }
          ],
          emergencyTools: {
            liquidityFacilities: true,
            emergencyLending: true,
            marketMaking: true,
            currencySwaps: true,
            capitalControls: false
          }
        },
        authority: {
          independenceMetrics: {
            legalFramework: 85,
            operationalAutonomy: 90,
            appointmentProcess: 75,
            budgetaryIndependence: 80,
            policyOverride: 95
          },
          politicalPressure: {
            currentLevel: 3.2,
            sources: ['Fiscal policy coordination', 'Employment targets'],
            recentIncidents: [
              {
                date: '2024-02-20',
                type: 'Public Statement',
                description: 'Government official questioned policy rate decision',
                response: 'Reiterated independence and mandate focus'
              }
            ]
          },
          publicCommunication: {
            transparency: 88,
            marketCredibility: 85,
            publicSupport: 72,
            mediaRelations: 78
          },
          governorProfile: {
            name: 'Dr. Sarah Martinez',
            tenure: '2019-2027',
            background: 'Former IMF economist, 25 years experience',
            credibility: 92,
            marketRespect: 88,
            politicalRelations: 'Professional, maintains independence'
          }
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const renderOverview = () => (
    <>
      {/* Central Bank Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏦 Central Bank Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Policy Rate</span>
            <span className="standard-metric-value">{bankData?.overview.policyRate}%</span>
          </div>
          <div className="standard-metric">
            <span>Independence Score</span>
            <span className="standard-metric-value">{bankData?.overview.independenceScore}/100</span>
          </div>
          <div className="standard-metric">
            <span>Market Confidence</span>
            <span className="standard-metric-value">{bankData?.overview.marketConfidence}/100</span>
          </div>
          <div className="standard-metric">
            <span>Inflation Target</span>
            <span className="standard-metric-value">{bankData?.overview.inflationTarget}%</span>
          </div>
          <div className="standard-metric">
            <span>Policy Stance</span>
            <span 
              className="standard-metric-value"
              style={{ color: getPolicyStanceColor(bankData?.overview.policyStance || 'neutral') }}
            >
              {bankData?.overview.policyStance ? 
                bankData.overview.policyStance.charAt(0).toUpperCase() + bankData.overview.policyStance.slice(1) : 
                'Neutral'
              }
            </span>
          </div>
          <div className="standard-metric">
            <span>Governor</span>
            <span className="standard-metric-value">{bankData?.overview.governor}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Policy Meeting')}>Policy Meeting</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Operations')}>Market Operations</button>
        </div>
      </div>

      {/* Financial Stability Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🛡️ Financial Stability</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Overall Score</span>
            <span className="standard-metric-value">{bankData?.stability.overallScore}/100</span>
          </div>
          <div className="standard-metric">
            <span>Capital Adequacy</span>
            <span className="standard-metric-value">{bankData?.stability?.bankingSystem?.capitalAdequacy}%</span>
          </div>
          <div className="standard-metric">
            <span>Liquidity Ratio</span>
            <span className="standard-metric-value">{bankData?.stability?.bankingSystem?.liquidityRatio}%</span>
          </div>
          <div className="standard-metric">
            <span>Non-Performing Loans</span>
            <span className="standard-metric-value">{bankData?.stability?.bankingSystem?.nonPerformingLoans}%</span>
          </div>
        </div>
      </div>

      {/* Policy Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Policy Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                           <div className="chart-container">
                 <BarChart
                   data={[
                     { label: 'GDP Growth', value: bankData?.stability?.macroeconomic?.gdpGrowth || 0, color: '#fbbf24' },
                     { label: 'Inflation', value: bankData?.stability?.macroeconomic?.inflation || 0, color: '#ef4444' },
                     { label: 'Unemployment', value: bankData?.stability?.macroeconomic?.unemployment || 0, color: '#3b82f6' },
                     { label: 'Fiscal Balance', value: Math.abs(bankData?.stability?.macroeconomic?.fiscalBalance || 0), color: '#10b981' }
                   ]}
                   title="📈 Macroeconomic Indicators (%)"
                   height={250}
                   width={400}
                   showTooltip={true}
                 />
               </div>
               <div className="chart-container">
                 <PieChart
                   data={[
                     { label: 'Legal Framework', value: bankData?.authority?.independenceMetrics?.legalFramework || 0, color: '#fbbf24' },
                     { label: 'Operational Autonomy', value: bankData?.authority?.independenceMetrics?.operationalAutonomy || 0, color: '#f59e0b' },
                     { label: 'Budgetary Independence', value: bankData?.authority?.independenceMetrics?.budgetaryIndependence || 0, color: '#d97706' },
                     { label: 'Policy Override', value: bankData?.authority?.independenceMetrics?.policyOverride || 0, color: '#92400e' }
                   ]}
                   title="🏛️ Independence Metrics"
                   size={200}
                   showLegend={true}
                 />
               </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderPolicies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>⚙️ Policy Settings & Recommendations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Adjust Policy')}>Adjust Policy</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Review Settings')}>Review Settings</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Policy Area</th>
                <th>Current Setting</th>
                <th>Target</th>
                <th>Last Change</th>
                <th>Next Review</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Interest Rate</strong></td>
                <td>{bankData?.settings.interestRate.current}%</td>
                <td>{bankData?.settings.interestRate.target}%</td>
                <td>{bankData?.settings.interestRate.lastChange}</td>
                <td>{bankData?.settings.interestRate.nextReview}</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#10b981', 
                    color: 'white' 
                  }}>
                    Stable
                  </span>
                </td>
                <td>
                  <button className="standard-btn economic-theme">Adjust</button>
                </td>
              </tr>
              <tr>
                <td><strong>Reserve Requirements</strong></td>
                <td>{bankData?.settings.reserveRequirements.commercial}%</td>
                <td>10.0%</td>
                <td>{bankData?.settings.reserveRequirements.lastUpdate}</td>
                <td>Quarterly</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white' 
                  }}>
                    Under Review
                  </span>
                </td>
                <td>
                  <button className="standard-btn economic-theme">Review</button>
                </td>
              </tr>
              <tr>
                <td><strong>QE Program</strong></td>
                <td>{bankData?.settings.quantitativeEasing.active ? 'Active' : 'Inactive'}</td>
                <td>N/A</td>
                <td>2023-12-01</td>
                <td>Monthly</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#ef4444', 
                    color: 'white' 
                  }}>
                    Paused
                  </span>
                </td>
                <td>
                  <button className="standard-btn economic-theme">Resume</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 style={{ color: '#fbbf24', marginTop: '2rem', marginBottom: '1rem' }}>Policy Recommendations</h4>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Recommendation</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Impact</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankData?.recommendations?.map((rec) => (
                <tr key={rec.id}>
                  <td><strong>{rec.title}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(rec.priority), 
                      color: 'white' 
                    }}>
                      {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(rec.status), 
                      color: 'white' 
                    }}>
                      {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </span>
                  </td>
                  <td>{rec.impact}</td>
                  <td>{rec.timeline}</td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStability = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🛡️ Financial Stability Monitoring</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Stability Report')}>Stability Report</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Risk Assessment')}>Risk Assessment</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Banking System Health</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Capital Adequacy</span>
                <span className="standard-metric-value">{bankData?.stability.bankingSystem.capitalAdequacy}%</span>
              </div>
              <div className="standard-metric">
                <span>Liquidity Ratio</span>
                <span className="standard-metric-value">{bankData?.stability.bankingSystem.liquidityRatio}%</span>
              </div>
              <div className="standard-metric">
                <span>Non-Performing Loans</span>
                <span className="standard-metric-value">{bankData?.stability.bankingSystem.nonPerformingLoans}%</span>
              </div>
              <div className="standard-metric">
                <span>Systemic Risk</span>
                <span className="standard-metric-value">{bankData?.stability.bankingSystem.systemicRisk}/10</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Market Stability</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Volatility Index</span>
                <span className="standard-metric-value">{bankData?.stability.marketStability.volatilityIndex}</span>
              </div>
              <div className="standard-metric">
                <span>Credit Spreads</span>
                <span className="standard-metric-value">{bankData?.stability.marketStability.creditSpreads}bps</span>
              </div>
              <div className="standard-metric">
                <span>Currency Stability</span>
                <span className="standard-metric-value">{bankData?.stability.marketStability.currencyStability}/100</span>
              </div>
              <div className="standard-metric">
                <span>Bond Yields</span>
                <span className="standard-metric-value">{bankData?.stability.marketStability.bondYields}%</span>
              </div>
            </div>
          </div>
        </div>

        <h4 style={{ color: '#fbbf24', marginTop: '2rem', marginBottom: '1rem' }}>Active Warnings</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {bankData?.stability.warnings?.map((warning, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              background: 'rgba(251, 191, 36, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{warning.type}</div>
                <span style={{ 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  backgroundColor: getThreatLevelColor(warning.severity), 
                  color: 'white' 
                }}>
                  {warning.severity.charAt(0).toUpperCase() + warning.severity.slice(1)}
                </span>
              </div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}>{warning.description}</div>
              <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}><strong>Recommendation:</strong> {warning.recommendation}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Research & Analysis</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('New Research')}>New Research</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Publications')}>Publications</button>
        </div>
        
        <h4 style={{ color: '#fbbf24', marginTop: '1rem', marginBottom: '1rem' }}>Current Research Projects</h4>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Completion</th>
                <th>Expected Completion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankData?.research.currentProjects?.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.title}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: project.status === 'ongoing' ? '#3b82f6' : '#10b981', 
                      color: 'white' 
                    }}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(project.priority), 
                      color: 'white' 
                    }}>
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                    </span>
                  </td>
                  <td>{project.completion}%</td>
                  <td>{project.expectedCompletion}</td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h4 style={{ color: '#fbbf24', marginTop: '2rem', marginBottom: '1rem' }}>Recent Publications</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {bankData?.research.recentPublications?.map((pub, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              background: 'rgba(251, 191, 36, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{pub.title}</div>
                <span style={{ 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  backgroundColor: '#3b82f6', 
                  color: 'white' 
                }}>
                  {pub.type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}>{pub.summary}</div>
              <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>
                <strong>Impact Score:</strong> {pub.impact}/10 • <strong>Date:</strong> {pub.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Central Bank Analytics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Analytics')}>Generate Analytics</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Export Report')}>Export Report</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Independence Metrics</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Legal Framework</span>
                <span className="standard-metric-value">{bankData?.authority.independenceMetrics.legalFramework}/100</span>
              </div>
              <div className="standard-metric">
                <span>Operational Autonomy</span>
                <span className="standard-metric-value">{bankData?.authority.independenceMetrics.operationalAutonomy}/100</span>
              </div>
              <div className="standard-metric">
                <span>Budgetary Independence</span>
                <span className="standard-metric-value">{bankData?.authority.independenceMetrics.budgetaryIndependence}/100</span>
              </div>
              <div className="standard-metric">
                <span>Policy Override</span>
                <span className="standard-metric-value">{bankData?.authority.independenceMetrics.policyOverride}/100</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Communication Effectiveness</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Transparency</span>
                <span className="standard-metric-value">{bankData?.authority.publicCommunication.transparency}/100</span>
              </div>
              <div className="standard-metric">
                <span>Market Credibility</span>
                <span className="standard-metric-value">{bankData?.authority.publicCommunication.marketCredibility}/100</span>
              </div>
              <div className="standard-metric">
                <span>Public Support</span>
                <span className="standard-metric-value">{bankData?.authority.publicCommunication.publicSupport}/100</span>
              </div>
              <div className="standard-metric">
                <span>Media Relations</span>
                <span className="standard-metric-value">{bankData?.authority.publicCommunication.mediaRelations}/100</span>
              </div>
            </div>
          </div>
        </div>

        <h4 style={{ color: '#fbbf24', marginTop: '2rem', marginBottom: '1rem' }}>Governor Profile</h4>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(251, 191, 36, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>{bankData?.authority.governorProfile.name}</div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}><strong>Tenure:</strong> {bankData?.authority.governorProfile.tenure}</div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}><strong>Background:</strong> {bankData?.authority.governorProfile.background}</div>
            </div>
            <div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}><strong>Credibility:</strong> {bankData?.authority.governorProfile.credibility}/100</div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}><strong>Market Respect:</strong> {bankData?.authority.governorProfile.marketRespect}/100</div>
              <div style={{ color: '#a0a9ba', marginBottom: '0.5rem' }}><strong>Political Relations:</strong> {bankData?.authority.governorProfile.politicalRelations}</div>
            </div>
          </div>
        </div>
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
      onRefresh={fetchBankData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && bankData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'policies' && renderPolicies()}
              {activeTab === 'stability' && renderStability()}
              {activeTab === 'research' && renderResearch()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading central bank data...' : 'No central bank data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CentralBankScreen;
