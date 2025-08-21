import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './CentralBankScreen.css';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'stability' | 'settings' | 'research' | 'crisis' | 'authority'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/central-bank/overview', description: 'Get central bank overview' },
    { method: 'GET', path: '/api/central-bank/recommendations', description: 'Get policy recommendations' },
    { method: 'GET', path: '/api/central-bank/stability', description: 'Get financial stability metrics' },
    { method: 'GET', path: '/api/central-bank/settings', description: 'Get current policy settings' },
    { method: 'GET', path: '/api/central-bank/research', description: 'Get economic research data' },
    { method: 'GET', path: '/api/central-bank/crisis', description: 'Get crisis management status' },
    { method: 'GET', path: '/api/central-bank/authority', description: 'Get independence metrics' },
    { method: 'POST', path: '/api/central-bank/policy', description: 'Update policy settings' },
    { method: 'POST', path: '/api/central-bank/assessment', description: 'Run stability assessment' }
  ];

  const fetchBankData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        overviewRes,
        recommendationsRes,
        stabilityRes,
        settingsRes,
        researchRes,
        crisisRes,
        authorityRes
      ] = await Promise.all([
        fetch('/api/central-bank/overview'),
        fetch('/api/central-bank/recommendations'),
        fetch('/api/central-bank/stability'),
        fetch('/api/central-bank/settings'),
        fetch('/api/central-bank/research'),
        fetch('/api/central-bank/crisis'),
        fetch('/api/central-bank/authority')
      ]);

      const [
        overview,
        recommendations,
        stability,
        settings,
        research,
        crisis,
        authority
      ] = await Promise.all([
        overviewRes.json(),
        recommendationsRes.json(),
        stabilityRes.json(),
        settingsRes.json(),
        researchRes.json(),
        crisisRes.json(),
        authorityRes.json()
      ]);

      setBankData({
        overview: overview.overview || generateMockOverview(),
        recommendations: recommendations.recommendations || generateMockRecommendations(),
        stability: stability.stability || generateMockStability(),
        settings: settings.settings || generateMockSettings(),
        research: research.research || generateMockResearch(),
        crisis: crisis.crisis || generateMockCrisis(),
        authority: authority.authority || generateMockAuthority()
      });
    } catch (err) {
      console.error('Failed to fetch central bank data:', err);
      // Use mock data as fallback
      setBankData({
        overview: generateMockOverview(),
        recommendations: generateMockRecommendations(),
        stability: generateMockStability(),
        settings: generateMockSettings(),
        research: generateMockResearch(),
        crisis: generateMockCrisis(),
        authority: generateMockAuthority()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const generateMockOverview = (): CentralBankOverview => ({
    independenceScore: 85,
    policyRate: 2.50,
    inflationTarget: 2.00,
    marketConfidence: 7.5,
    policyStance: 'neutral',
    lastMeeting: '2024-02-15',
    nextMeeting: '2024-03-20',
    governor: 'Dr. Sarah Mitchell',
    mandate: ['Price Stability', 'Financial System Stability', 'Economic Growth Support']
  });

  const generateMockRecommendations = (): PolicyRecommendation[] => [
    {
      id: 'rec-1',
      title: 'Interest Rate Adjustment',
      description: 'Recommend 0.25% increase due to inflation pressures',
      priority: 'critical',
      status: 'pending',
      impact: 'Moderate tightening to cool inflation expectations',
      timeline: '2-3 weeks',
      rationale: 'Core inflation has exceeded target for 3 consecutive months',
      riskAssessment: 'Low risk of economic disruption, high effectiveness',
      marketReaction: 'neutral'
    },
    {
      id: 'rec-2',
      title: 'Reserve Requirement Update',
      description: 'Increase to 12% to manage liquidity',
      priority: 'high',
      status: 'pending',
      impact: 'Reduce excess liquidity in banking system',
      timeline: '1 month',
      rationale: 'Banks showing excessive risk-taking behavior',
      riskAssessment: 'Medium risk, requires careful implementation',
      marketReaction: 'negative'
    },
    {
      id: 'rec-3',
      title: 'Forward Guidance Revision',
      description: 'Update market communication strategy',
      priority: 'medium',
      status: 'pending',
      impact: 'Improve market expectations management',
      timeline: '2 weeks',
      rationale: 'Current guidance causing market confusion',
      riskAssessment: 'Low risk, high communication value',
      marketReaction: 'positive'
    }
  ];

  const generateMockStability = (): FinancialStability => ({
    overallScore: 78,
    bankingSystem: {
      capitalAdequacy: 14.2,
      liquidityRatio: 125,
      nonPerformingLoans: 2.8,
      profitability: 1.15,
      systemicRisk: 25
    },
    marketStability: {
      volatilityIndex: 18.5,
      creditSpreads: 145,
      currencyStability: 92,
      bondYields: 3.25
    },
    macroeconomic: {
      gdpGrowth: 2.8,
      inflation: 2.4,
      unemployment: 4.2,
      currentAccount: -1.8,
      fiscalBalance: -2.1
    },
    warnings: [
      {
        type: 'Credit Growth',
        severity: 'medium',
        description: 'Rapid credit expansion in real estate sector',
        recommendation: 'Implement macroprudential measures'
      },
      {
        type: 'Market Concentration',
        severity: 'low',
        description: 'Increasing concentration in banking sector',
        recommendation: 'Monitor merger activity closely'
      }
    ]
  });

  const generateMockSettings = (): PolicySettings => ({
    interestRate: {
      current: 2.50,
      target: 2.75,
      corridor: { upper: 3.00, lower: 2.00 },
      lastChange: '2024-01-18',
      nextReview: '2024-03-20'
    },
    reserveRequirements: {
      commercial: 10.5,
      investment: 8.0,
      foreign: 12.0,
      lastUpdate: '2024-01-15'
    },
    quantitativeEasing: {
      active: false,
      monthlyPurchases: 0,
      totalAssets: 450000000000,
      targetDuration: 'N/A'
    },
    forwardGuidance: {
      currentMessage: 'Policy rates expected to remain stable with gradual normalization',
      effectiveness: 72,
      lastUpdate: '2024-02-15',
      marketReception: 'neutral'
    },
    macroprudential: {
      countercyclicalBuffer: 1.5,
      loanToValueRatio: 80,
      debtToIncomeRatio: 6.0,
      systemicRiskBuffer: 2.0
    }
  });

  const generateMockResearch = (): EconomicResearch => ({
    currentProjects: [
      {
        id: 'proj-1',
        title: 'Digital Currency Impact Assessment',
        status: 'ongoing',
        priority: 'high',
        completion: 65,
        expectedCompletion: '2024-06-30',
        keyFindings: ['Reduced transaction costs', 'Enhanced monetary policy transmission', 'Privacy concerns'],
        policyImplications: 'May require new regulatory framework'
      },
      {
        id: 'proj-2',
        title: 'Climate Risk in Financial System',
        status: 'ongoing',
        priority: 'medium',
        completion: 40,
        expectedCompletion: '2024-09-15',
        keyFindings: ['Significant transition risks', 'Physical risk concentration'],
        policyImplications: 'Stress testing requirements needed'
      }
    ],
    recentPublications: [
      {
        title: 'Inflation Dynamics in Post-Pandemic Economy',
        date: '2024-02-10',
        type: 'working_paper',
        summary: 'Analysis of structural changes in inflation behavior',
        impact: 8.5
      },
      {
        title: 'Financial Stability Report Q4 2023',
        date: '2024-01-25',
        type: 'policy_brief',
        summary: 'Comprehensive assessment of systemic risks',
        impact: 9.2
      }
    ],
    dataAnalysis: {
      inflationForecasts: [
        { period: '2024-Q2', forecast: 2.3, confidence: 85 },
        { period: '2024-Q3', forecast: 2.1, confidence: 78 },
        { period: '2024-Q4', forecast: 2.0, confidence: 72 }
      ],
      gdpProjections: [
        { period: '2024-Q2', forecast: 2.8, confidence: 82 },
        { period: '2024-Q3', forecast: 2.6, confidence: 75 },
        { period: '2024-Q4', forecast: 2.4, confidence: 68 }
      ],
      riskAssessments: [
        { category: 'Credit Risk', level: 35, trend: 'stable' },
        { category: 'Market Risk', level: 42, trend: 'increasing' },
        { category: 'Operational Risk', level: 28, trend: 'decreasing' }
      ]
    }
  });

  const generateMockCrisis = (): CrisisManagement => ({
    currentThreatLevel: 'low',
    activeCrises: [],
    contingencyPlans: [
      {
        scenario: 'Banking System Stress',
        triggers: ['Capital ratios below 8%', 'Liquidity shortfall', 'Deposit runs'],
        responses: ['Emergency lending', 'Capital injections', 'Deposit guarantees'],
        coordination: ['Treasury', 'Financial Regulator', 'Government'],
        lastUpdated: '2024-01-15'
      },
      {
        scenario: 'Currency Crisis',
        triggers: ['Rapid depreciation >20%', 'Capital flight', 'Reserve depletion'],
        responses: ['FX intervention', 'Interest rate hikes', 'Capital controls'],
        coordination: ['Treasury', 'International Partners'],
        lastUpdated: '2024-01-10'
      }
    ],
    emergencyTools: {
      liquidityFacilities: true,
      emergencyLending: true,
      marketMaking: false,
      currencySwaps: true,
      capitalControls: false
    }
  });

  const generateMockAuthority = (): LeaderAuthority => ({
    independenceMetrics: {
      legalFramework: 90,
      operationalAutonomy: 85,
      appointmentProcess: 80,
      budgetaryIndependence: 88,
      policyOverride: 92
    },
    politicalPressure: {
      currentLevel: 25,
      sources: ['Treasury Department', 'Legislative Committee'],
      recentIncidents: [
        {
          date: '2024-01-20',
          type: 'Public Statement',
          description: 'Finance Minister questioned rate decision',
          response: 'Reaffirmed independence in public speech'
        }
      ]
    },
    publicCommunication: {
      transparency: 82,
      marketCredibility: 88,
      publicSupport: 65,
      mediaRelations: 78
    },
    governorProfile: {
      name: 'Dr. Sarah Mitchell',
      tenure: '3 years, 2 months',
      background: 'Former IMF economist, PhD from Harvard',
      credibility: 88,
      marketRespect: 92,
      politicalRelations: 'Professional but distant'
    }
  });

  const formatNumber = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'increasing': return '#ef4444';
      case 'stable': return '#3b82f6';
      case 'decreasing': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleRunAssessment = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchBankData();
    } catch (err) {
      setError('Failed to run stability assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchBankData}
    >
      <div className="central-bank-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🎯 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            📋 Policy
          </button>
          <button 
            className={`tab ${activeTab === 'stability' ? 'active' : ''}`}
            onClick={() => setActiveTab('stability')}
          >
            📊 Stability
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button 
            className={`tab ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => setActiveTab('research')}
          >
            📈 Research
          </button>
          <button 
            className={`tab ${activeTab === 'crisis' ? 'active' : ''}`}
            onClick={() => setActiveTab('crisis')}
          >
            🚨 Crisis
          </button>
          <button 
            className={`tab ${activeTab === 'authority' ? 'active' : ''}`}
            onClick={() => setActiveTab('authority')}
          >
            👑 Authority
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading central bank data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && bankData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card independence">
                      <div className="metric-header">
                        <div className="metric-icon">🏛️</div>
                        <div className="metric-info">
                          <div className="metric-value">{bankData.overview.independenceScore}/100</div>
                          <div className="metric-label">Independence Score</div>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${bankData.overview.independenceScore}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">📈</div>
                        <div className="metric-info">
                          <div className="metric-value">{bankData.overview.policyRate.toFixed(2)}%</div>
                          <div className="metric-label">Policy Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">🎯</div>
                        <div className="metric-info">
                          <div className="metric-value">{bankData.overview.inflationTarget.toFixed(2)}%</div>
                          <div className="metric-label">Inflation Target</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-header">
                        <div className="metric-icon">📊</div>
                        <div className="metric-info">
                          <div className="metric-value">{bankData.overview.marketConfidence.toFixed(1)}/10</div>
                          <div className="metric-label">Market Confidence</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-details">
                    <div className="detail-section">
                      <h4>👤 Governor Information</h4>
                      <div className="governor-info">
                        <div className="governor-name">{bankData.overview.governor}</div>
                        <div className="policy-stance">
                          Policy Stance: <span className={`stance ${bankData.overview.policyStance}`}>
                            {bankData.overview.policyStance.charAt(0).toUpperCase() + bankData.overview.policyStance.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>📅 Meeting Schedule</h4>
                      <div className="meeting-info">
                        <div className="meeting-item">
                          <span className="meeting-label">Last Meeting:</span>
                          <span className="meeting-date">{new Date(bankData.overview.lastMeeting).toLocaleDateString()}</span>
                        </div>
                        <div className="meeting-item">
                          <span className="meeting-label">Next Meeting:</span>
                          <span className="meeting-date">{new Date(bankData.overview.nextMeeting).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>🎯 Central Bank Mandate</h4>
                      <div className="mandate-list">
                        {bankData.overview.mandate.map((item, i) => (
                          <div key={i} className="mandate-item">{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="recommendations-tab">
                  <div className="recommendations-header">
                    <div className="pending-count">
                      <span className="count-value">{bankData.recommendations.filter(r => r.status === 'pending').length}</span>
                      <span className="count-label">Pending Decisions</span>
                    </div>
                  </div>
                  
                  <div className="recommendations-list">
                    {bankData.recommendations.map((rec) => (
                      <div key={rec.id} className={`recommendation-card ${rec.priority}`}>
                        <div className="rec-header">
                          <div className="rec-title">{rec.title}</div>
                          <div className="rec-priority" style={{ backgroundColor: getPriorityColor(rec.priority) }}>
                            {rec.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="rec-description">{rec.description}</div>
                        <div className="rec-details">
                          <div className="rec-detail">
                            <span className="detail-label">Impact:</span>
                            <span className="detail-value">{rec.impact}</span>
                          </div>
                          <div className="rec-detail">
                            <span className="detail-label">Timeline:</span>
                            <span className="detail-value">{rec.timeline}</span>
                          </div>
                          <div className="rec-detail">
                            <span className="detail-label">Market Reaction:</span>
                            <span className={`detail-value ${rec.marketReaction}`}>
                              {rec.marketReaction.charAt(0).toUpperCase() + rec.marketReaction.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="rec-rationale">
                          <strong>Rationale:</strong> {rec.rationale}
                        </div>
                        <div className="rec-risk">
                          <strong>Risk Assessment:</strong> {rec.riskAssessment}
                        </div>
                        <div className="rec-status">
                          <span className={`status-indicator ${rec.status}`}></span>
                          <span className="status-text">{rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Approve Recommendation</button>
                    <button className="action-btn secondary">Request Analysis</button>
                    <button className="action-btn">Schedule Review</button>
                  </div>
                </div>
              )}

              {activeTab === 'stability' && (
                <div className="stability-tab">
                  <div className="stability-overview">
                    <div className="stability-score">
                      <div className="score-value">{bankData.stability.overallScore}</div>
                      <div className="score-label">Financial Stability Score</div>
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${bankData.stability.overallScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="stability-sections">
                    <div className="stability-section">
                      <h4>🏦 Banking System</h4>
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <div className="metric-name">Capital Adequacy</div>
                          <div className="metric-value">{bankData.stability.bankingSystem.capitalAdequacy}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Liquidity Ratio</div>
                          <div className="metric-value">{bankData.stability.bankingSystem.liquidityRatio}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">NPL Ratio</div>
                          <div className="metric-value">{bankData.stability.bankingSystem.nonPerformingLoans}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">ROA</div>
                          <div className="metric-value">{bankData.stability.bankingSystem.profitability}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="stability-section">
                      <h4>📈 Market Stability</h4>
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <div className="metric-name">Volatility Index</div>
                          <div className="metric-value">{bankData.stability.marketStability.volatilityIndex}</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Credit Spreads</div>
                          <div className="metric-value">{bankData.stability.marketStability.creditSpreads} bps</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Currency Stability</div>
                          <div className="metric-value">{bankData.stability.marketStability.currencyStability}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Bond Yields</div>
                          <div className="metric-value">{bankData.stability.marketStability.bondYields}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="stability-section">
                      <h4>🌍 Macroeconomic</h4>
                      <div className="metrics-grid">
                        <div className="metric-item">
                          <div className="metric-name">GDP Growth</div>
                          <div className="metric-value">{bankData.stability.macroeconomic.gdpGrowth}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Inflation</div>
                          <div className="metric-value">{bankData.stability.macroeconomic.inflation}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Unemployment</div>
                          <div className="metric-value">{bankData.stability.macroeconomic.unemployment}%</div>
                        </div>
                        <div className="metric-item">
                          <div className="metric-name">Fiscal Balance</div>
                          <div className="metric-value">{bankData.stability.macroeconomic.fiscalBalance}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {bankData.stability.warnings.length > 0 && (
                    <div className="warnings-section">
                      <h4>⚠️ Stability Warnings</h4>
                      <div className="warnings-list">
                        {bankData.stability.warnings.map((warning, i) => (
                          <div key={i} className="warning-item">
                            <div className="warning-header">
                              <div className="warning-type">{warning.type}</div>
                              <div className="warning-severity" style={{ color: getSeverityColor(warning.severity) }}>
                                {warning.severity.toUpperCase()}
                              </div>
                            </div>
                            <div className="warning-description">{warning.description}</div>
                            <div className="warning-recommendation">
                              <strong>Recommendation:</strong> {warning.recommendation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="tab-actions">
                    <button className="action-btn" onClick={handleRunAssessment}>Run Assessment</button>
                    <button className="action-btn secondary">Stress Test</button>
                    <button className="action-btn">Generate Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="settings-tab">
                  <div className="settings-sections">
                    <div className="settings-section">
                      <h4>📈 Interest Rate Policy</h4>
                      <div className="setting-group">
                        <div className="setting-item">
                          <div className="setting-label">Current Rate</div>
                          <div className="setting-value">{bankData.settings.interestRate.current.toFixed(2)}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Target Rate</div>
                          <div className="setting-value">{bankData.settings.interestRate.target.toFixed(2)}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Rate Corridor</div>
                          <div className="setting-value">
                            {bankData.settings.interestRate.corridor.lower.toFixed(2)}% - {bankData.settings.interestRate.corridor.upper.toFixed(2)}%
                          </div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Next Review</div>
                          <div className="setting-value">{new Date(bankData.settings.interestRate.nextReview).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h4>💰 Reserve Requirements</h4>
                      <div className="setting-group">
                        <div className="setting-item">
                          <div className="setting-label">Commercial Banks</div>
                          <div className="setting-value">{bankData.settings.reserveRequirements.commercial}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Investment Banks</div>
                          <div className="setting-value">{bankData.settings.reserveRequirements.investment}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Foreign Banks</div>
                          <div className="setting-value">{bankData.settings.reserveRequirements.foreign}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h4>💵 Quantitative Easing</h4>
                      <div className="setting-group">
                        <div className="setting-item">
                          <div className="setting-label">Program Status</div>
                          <div className={`setting-value ${bankData.settings.quantitativeEasing.active ? 'active' : 'inactive'}`}>
                            {bankData.settings.quantitativeEasing.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Total Assets</div>
                          <div className="setting-value">${formatNumber(bankData.settings.quantitativeEasing.totalAssets)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h4>📢 Forward Guidance</h4>
                      <div className="guidance-content">
                        <div className="guidance-message">"{bankData.settings.forwardGuidance.currentMessage}"</div>
                        <div className="guidance-metrics">
                          <div className="guidance-metric">
                            <span className="metric-label">Effectiveness:</span>
                            <span className="metric-value">{bankData.settings.forwardGuidance.effectiveness}%</span>
                          </div>
                          <div className="guidance-metric">
                            <span className="metric-label">Market Reception:</span>
                            <span className={`metric-value ${bankData.settings.forwardGuidance.marketReception}`}>
                              {bankData.settings.forwardGuidance.marketReception.charAt(0).toUpperCase() + bankData.settings.forwardGuidance.marketReception.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h4>🛡️ Macroprudential Tools</h4>
                      <div className="setting-group">
                        <div className="setting-item">
                          <div className="setting-label">Countercyclical Buffer</div>
                          <div className="setting-value">{bankData.settings.macroprudential.countercyclicalBuffer}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Loan-to-Value Ratio</div>
                          <div className="setting-value">{bankData.settings.macroprudential.loanToValueRatio}%</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Debt-to-Income Ratio</div>
                          <div className="setting-value">{bankData.settings.macroprudential.debtToIncomeRatio}x</div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-label">Systemic Risk Buffer</div>
                          <div className="setting-value">{bankData.settings.macroprudential.systemicRiskBuffer}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Update Settings</button>
                    <button className="action-btn secondary">Policy Simulation</button>
                    <button className="action-btn">Historical Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'research' && (
                <div className="research-tab">
                  <div className="research-sections">
                    <div className="research-section">
                      <h4>🔬 Current Projects</h4>
                      <div className="projects-list">
                        {bankData.research.currentProjects.map((project) => (
                          <div key={project.id} className="project-card">
                            <div className="project-header">
                              <div className="project-title">{project.title}</div>
                              <div className={`project-priority ${project.priority}`}>
                                {project.priority.toUpperCase()}
                              </div>
                            </div>
                            <div className="project-progress">
                              <div className="progress-label">Progress: {project.completion}%</div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${project.completion}%` }}></div>
                              </div>
                            </div>
                            <div className="project-details">
                              <div className="project-detail">
                                <span className="detail-label">Expected Completion:</span>
                                <span className="detail-value">{new Date(project.expectedCompletion).toLocaleDateString()}</span>
                              </div>
                              <div className="project-detail">
                                <span className="detail-label">Status:</span>
                                <span className={`detail-value ${project.status}`}>
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="project-findings">
                              <strong>Key Findings:</strong>
                              <ul>
                                {project.keyFindings.map((finding, i) => (
                                  <li key={i}>{finding}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="project-implications">
                              <strong>Policy Implications:</strong> {project.policyImplications}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="research-section">
                      <h4>📚 Recent Publications</h4>
                      <div className="publications-list">
                        {bankData.research.recentPublications.map((pub, i) => (
                          <div key={i} className="publication-item">
                            <div className="pub-header">
                              <div className="pub-title">{pub.title}</div>
                              <div className={`pub-type ${pub.type}`}>
                                {pub.type.replace('_', ' ').toUpperCase()}
                              </div>
                            </div>
                            <div className="pub-details">
                              <div className="pub-date">{new Date(pub.date).toLocaleDateString()}</div>
                              <div className="pub-impact">Impact Score: {pub.impact}/10</div>
                            </div>
                            <div className="pub-summary">{pub.summary}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="research-section">
                      <h4>📊 Data Analysis</h4>
                      <div className="analysis-grid">
                        <div className="analysis-item">
                          <h5>Inflation Forecasts</h5>
                          <div className="forecasts-list">
                            {bankData.research.dataAnalysis.inflationForecasts.map((forecast, i) => (
                              <div key={i} className="forecast-item">
                                <span className="forecast-period">{forecast.period}</span>
                                <span className="forecast-value">{forecast.forecast.toFixed(1)}%</span>
                                <span className="forecast-confidence">{forecast.confidence}% confidence</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="analysis-item">
                          <h5>GDP Projections</h5>
                          <div className="forecasts-list">
                            {bankData.research.dataAnalysis.gdpProjections.map((projection, i) => (
                              <div key={i} className="forecast-item">
                                <span className="forecast-period">{projection.period}</span>
                                <span className="forecast-value">{projection.forecast.toFixed(1)}%</span>
                                <span className="forecast-confidence">{projection.confidence}% confidence</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="analysis-item">
                          <h5>Risk Assessments</h5>
                          <div className="risks-list">
                            {bankData.research.dataAnalysis.riskAssessments.map((risk, i) => (
                              <div key={i} className="risk-item">
                                <div className="risk-category">{risk.category}</div>
                                <div className="risk-level">{risk.level}%</div>
                                <div className="risk-trend" style={{ color: getTrendColor(risk.trend) }}>
                                  {risk.trend.charAt(0).toUpperCase() + risk.trend.slice(1)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">New Research Project</button>
                    <button className="action-btn secondary">Data Request</button>
                    <button className="action-btn">Publish Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'crisis' && (
                <div className="crisis-tab">
                  <div className="crisis-overview">
                    <div className="threat-level">
                      <div className="threat-label">Current Threat Level</div>
                      <div className={`threat-value ${bankData.crisis.currentThreatLevel}`}>
                        {bankData.crisis.currentThreatLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {bankData.crisis.activeCrises.length > 0 ? (
                    <div className="active-crises">
                      <h4>🚨 Active Crises</h4>
                      <div className="crises-list">
                        {bankData.crisis.activeCrises.map((crisis) => (
                          <div key={crisis.id} className="crisis-item">
                            <div className="crisis-header">
                              <div className="crisis-type">{crisis.type.charAt(0).toUpperCase() + crisis.type.slice(1)} Crisis</div>
                              <div className="crisis-severity">Severity: {crisis.severity}/10</div>
                            </div>
                            <div className="crisis-description">{crisis.description}</div>
                            <div className="crisis-timeline">Timeline: {crisis.timeline}</div>
                            <div className="crisis-actions">
                              <strong>Response Actions:</strong>
                              <ul>
                                {crisis.responseActions.map((action, i) => (
                                  <li key={i}>{action}</li>
                                ))}
                              </ul>
                            </div>
                            <div className={`crisis-status ${crisis.status}`}>
                              Status: {crisis.status.charAt(0).toUpperCase() + crisis.status.slice(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-crises">
                      <div className="no-crises-message">✅ No active crises detected</div>
                      <div className="no-crises-subtitle">All systems operating normally</div>
                    </div>
                  )}

                  <div className="contingency-plans">
                    <h4>📋 Contingency Plans</h4>
                    <div className="plans-list">
                      {bankData.crisis.contingencyPlans.map((plan, i) => (
                        <div key={i} className="plan-item">
                          <div className="plan-scenario">{plan.scenario}</div>
                          <div className="plan-section">
                            <strong>Triggers:</strong>
                            <ul>
                              {plan.triggers.map((trigger, j) => (
                                <li key={j}>{trigger}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="plan-section">
                            <strong>Responses:</strong>
                            <ul>
                              {plan.responses.map((response, j) => (
                                <li key={j}>{response}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="plan-coordination">
                            <strong>Coordination:</strong> {plan.coordination.join(', ')}
                          </div>
                          <div className="plan-updated">
                            Last Updated: {new Date(plan.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="emergency-tools">
                    <h4>🛠️ Emergency Tools</h4>
                    <div className="tools-grid">
                      {Object.entries(bankData.crisis.emergencyTools).map(([tool, available]) => (
                        <div key={tool} className="tool-item">
                          <div className="tool-name">{tool.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                          <div className={`tool-status ${available ? 'available' : 'unavailable'}`}>
                            {available ? 'Available' : 'Unavailable'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Activate Emergency Protocol</button>
                    <button className="action-btn secondary">Update Contingency Plans</button>
                    <button className="action-btn">Crisis Simulation</button>
                  </div>
                </div>
              )}

              {activeTab === 'authority' && (
                <div className="authority-tab">
                  <div className="independence-metrics">
                    <h4>🏛️ Independence Metrics</h4>
                    <div className="metrics-grid">
                      {Object.entries(bankData.authority.independenceMetrics).map(([metric, value]) => (
                        <div key={metric} className="independence-metric">
                          <div className="metric-name">
                            {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="metric-value">{value}/100</div>
                          <div className="metric-bar">
                            <div className="metric-fill" style={{ width: `${value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="political-pressure">
                    <h4>⚖️ Political Pressure</h4>
                    <div className="pressure-overview">
                      <div className="pressure-level">
                        <div className="pressure-label">Current Level</div>
                        <div className="pressure-value">{bankData.authority.politicalPressure.currentLevel}/100</div>
                        <div className="pressure-bar">
                          <div className="pressure-fill" style={{ width: `${bankData.authority.politicalPressure.currentLevel}%` }}></div>
                        </div>
                      </div>
                      <div className="pressure-sources">
                        <strong>Sources:</strong> {bankData.authority.politicalPressure.sources.join(', ')}
                      </div>
                    </div>
                    {bankData.authority.politicalPressure.recentIncidents.length > 0 && (
                      <div className="recent-incidents">
                        <strong>Recent Incidents:</strong>
                        <div className="incidents-list">
                          {bankData.authority.politicalPressure.recentIncidents.map((incident, i) => (
                            <div key={i} className="incident-item">
                              <div className="incident-header">
                                <div className="incident-date">{new Date(incident.date).toLocaleDateString()}</div>
                                <div className="incident-type">{incident.type}</div>
                              </div>
                              <div className="incident-description">{incident.description}</div>
                              <div className="incident-response">
                                <strong>Response:</strong> {incident.response}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="communication-metrics">
                    <h4>📢 Public Communication</h4>
                    <div className="comm-grid">
                      {Object.entries(bankData.authority.publicCommunication).map(([metric, value]) => (
                        <div key={metric} className="comm-metric">
                          <div className="comm-name">
                            {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="comm-value">{value}/100</div>
                          <div className="comm-bar">
                            <div className="comm-fill" style={{ width: `${value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="governor-profile">
                    <h4>👤 Governor Profile</h4>
                    <div className="profile-info">
                      <div className="profile-item">
                        <span className="profile-label">Name:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.name}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Tenure:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.tenure}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Background:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.background}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Credibility:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.credibility}/100</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Market Respect:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.marketRespect}/100</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Political Relations:</span>
                        <span className="profile-value">{bankData.authority.governorProfile.politicalRelations}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Independence Assessment</button>
                    <button className="action-btn secondary">Communication Strategy</button>
                    <button className="action-btn">Stakeholder Relations</button>
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

export default CentralBankScreen;
