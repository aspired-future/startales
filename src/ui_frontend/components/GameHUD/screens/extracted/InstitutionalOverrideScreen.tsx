import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './InstitutionalOverrideScreen.css';

interface InstitutionalOverride {
  id: string;
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  targetDecisionId: string;
  targetDecisionTitle: string;
  campaignId: number;
  leaderCharacterId: string;
  originalDecision: string;
  originalReasoning?: string;
  overrideDecision: 'approve' | 'reject' | 'modify' | 'suspend';
  overrideReason: string;
  overrideJustification: string;
  constitutionalBasis: string;
  legalPrecedent?: string;
  modifications?: string;
  implementationNotes?: string;
  
  // Political Consequences
  politicalCost: number;
  publicApprovalImpact: number;
  institutionalTrustImpact: number;
  partyRelationsImpact: Record<string, number>;
  
  // Constitutional & Legal
  constitutionalityScore: number;
  separationOfPowersImpact: number;
  judicialIndependenceImpact?: number;
  monetaryAuthorityImpact?: number;
  
  // Status & Timeline
  effectiveDate: string;
  expirationDate?: string;
  status: 'pending' | 'active' | 'challenged' | 'upheld' | 'reversed' | 'expired';
  challengeDetails?: {
    challenger: string;
    challengeReason: string;
    challengeDate: string;
    resolution?: string;
    resolutionDate?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

interface OverrideAnalysis {
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  politicalFeasibility: number;
  constitutionalValidity: number;
  publicSupportEstimate: number;
  institutionalTrustImpact: number;
  separationOfPowersRisk: number;
  politicalCostAssessment: number;
  recommendedAction: 'proceed' | 'modify' | 'abandon';
  riskFactors: string[];
  supportingArguments: string[];
  potentialChallenges: string[];
  institutionalSpecificRisks: string[];
  precedentAnalysis: string[];
}

interface EligibleDecision {
  id: string;
  title: string;
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  decisionType: string;
  status: string;
  dateDecided: string;
  summary: string;
  canOverride: boolean;
  overrideRisk: 'low' | 'medium' | 'high' | 'critical';
}

interface InstitutionalTrustMetrics {
  institutionType: 'legislature' | 'central_bank' | 'supreme_court';
  publicTrustRating: number;
  expertTrustRating: number;
  internationalTrustRating: number;
  independencePerception: number;
  effectivenessRating: number;
  overrideImpactCumulative: number;
  totalOverrides: number;
  successfulChallenges: number;
  lastOverrideDate?: string;
}

interface SeparationOfPowersMetrics {
  executivePowerIndex: number;
  legislativeIndependenceIndex: number;
  judicialIndependenceIndex: number;
  monetaryIndependenceIndex: number;
  constitutionalBalanceScore: number;
  democraticHealthIndex: number;
  totalInstitutionalOverrides: number;
  overrideFrequency30d: number;
  crisisSeverityLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

interface InstitutionalOverrideData {
  overview: {
    totalOverrides: number;
    activeOverrides: number;
    challengedOverrides: number;
    successRate: number;
    averagePoliticalCost: number;
    averageTrustImpact: number;
    constitutionalBalanceScore: number;
    democraticHealthIndex: number;
  };
  overrides: InstitutionalOverride[];
  eligibleDecisions: EligibleDecision[];
  trustMetrics: InstitutionalTrustMetrics[];
  separationMetrics: SeparationOfPowersMetrics;

}

const InstitutionalOverrideScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [data, setData] = useState<InstitutionalOverrideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'eligible' | 'analysis' | 'trust'>('overview');
  const [selectedInstitution, setSelectedInstitution] = useState<'all' | 'legislature' | 'central_bank' | 'supreme_court'>('all');
  const [selectedDecision, setSelectedDecision] = useState<EligibleDecision | null>(null);
  const [overrideAnalysis, setOverrideAnalysis] = useState<OverrideAnalysis | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideFormData, setOverrideFormData] = useState({
    overrideDecision: 'approve' as 'approve' | 'reject' | 'modify' | 'suspend',
    overrideReason: '',
    overrideJustification: '',
    constitutionalBasis: '',
    legalPrecedent: '',
    modifications: '',
    implementationNotes: ''
  });

  const endpoints: APIEndpoint[] = [
    {
      url: '/api/institutional-override/stats/1',
      key: 'stats'
    },
    {
      url: '/api/institutional-override/leader/leader-1?campaignId=1',
      key: 'overrides'
    },
    {
      url: '/api/institutional-override/trust-metrics/1',
      key: 'trustMetrics'
    },
    {
      url: '/api/institutional-override/separation-powers/1',
      key: 'separationMetrics'
    },

  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const responses = await Promise.allSettled(
        endpoints.map(endpoint => 
          fetch(`http://localhost:4000${endpoint.url}`)
            .then(res => res.json())
            .then(data => ({ key: endpoint.key, data }))
        )
      );

      const successfulResponses = responses
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);

      // Mock data structure for demonstration
      const mockData: InstitutionalOverrideData = {
        overview: {
          totalOverrides: 12,
          activeOverrides: 3,
          challengedOverrides: 1,
          successRate: 83.3,
          averagePoliticalCost: 24.5,
          averageTrustImpact: -8.2,
          constitutionalBalanceScore: 78.5,
          democraticHealthIndex: 82.1
        },
        overrides: [
          {
            id: '1',
            institutionType: 'legislature',
            targetDecisionId: 'leg-bill-2024-15',
            targetDecisionTitle: 'Infrastructure Investment Act',
            campaignId: 1,
            leaderCharacterId: 'leader-1',
            originalDecision: 'rejected',
            originalReasoning: 'Insufficient funding sources identified',
            overrideDecision: 'approve',
            overrideReason: 'Critical national infrastructure needs',
            overrideJustification: 'Executive authority to ensure national competitiveness and economic growth',
            constitutionalBasis: 'Article II executive powers and national defense clause',
            legalPrecedent: 'Similar infrastructure overrides in 2019 and 2021',
            modifications: 'Reduced scope to focus on critical transportation networks',
            implementationNotes: 'Phased rollout over 3 years with quarterly reviews',
            politicalCost: 18.5,
            publicApprovalImpact: -3.2,
            institutionalTrustImpact: -5.1,
            partyRelationsImpact: { 'opposition': -12, 'coalition': 8 },
            constitutionalityScore: 85.2,
            separationOfPowersImpact: 15.3,
            effectiveDate: '2025-08-20T10:00:00Z',
            status: 'active',
            createdAt: '2025-08-20T09:30:00Z',
            updatedAt: '2025-08-20T10:00:00Z'
          },
          {
            id: '2',
            institutionType: 'central_bank',
            targetDecisionId: 'cb-rate-2024-08',
            targetDecisionTitle: 'Interest Rate Increase to 5.5%',
            campaignId: 1,
            leaderCharacterId: 'leader-1',
            originalDecision: 'approved',
            originalReasoning: 'Inflation control measures',
            overrideDecision: 'modify',
            overrideReason: 'Economic growth concerns during election period',
            overrideJustification: 'Executive responsibility for economic stability and employment',
            constitutionalBasis: 'Executive oversight of monetary policy during national emergencies',
            legalPrecedent: 'Emergency monetary interventions of 2020',
            modifications: 'Reduce increase to 4.75% with gradual implementation',
            implementationNotes: 'Monitor economic indicators weekly',
            politicalCost: 35.2,
            publicApprovalImpact: 12.1,
            institutionalTrustImpact: -15.8,
            partyRelationsImpact: { 'business_coalition': 15, 'labor_coalition': -8 },
            constitutionalityScore: 65.4,
            separationOfPowersImpact: 28.7,
            monetaryAuthorityImpact: -22.3,
            effectiveDate: '2025-08-18T14:00:00Z',
            status: 'challenged',
            challengeDetails: {
              challenger: 'Central Bank Independence Coalition',
              challengeReason: 'Violation of monetary policy independence',
              challengeDate: '2025-08-19T09:00:00Z'
            },
            createdAt: '2025-08-18T13:30:00Z',
            updatedAt: '2025-08-19T09:00:00Z'
          },
          {
            id: '3',
            institutionType: 'supreme_court',
            targetDecisionId: 'sc-case-2024-42',
            targetDecisionTitle: 'Constitutional Review of Emergency Powers Act',
            campaignId: 1,
            leaderCharacterId: 'leader-1',
            originalDecision: 'unconstitutional',
            originalReasoning: 'Excessive executive power concentration',
            overrideDecision: 'suspend',
            overrideReason: 'National security emergency requires immediate action',
            overrideJustification: 'Wartime executive powers and national defense imperatives',
            constitutionalBasis: 'Article II Commander-in-Chief powers during national emergency',
            legalPrecedent: 'Wartime executive actions precedents',
            modifications: 'Temporary 90-day suspension pending legislative review',
            implementationNotes: 'Subject to congressional oversight and judicial review',
            politicalCost: 68.9,
            publicApprovalImpact: -18.5,
            institutionalTrustImpact: -35.2,
            partyRelationsImpact: { 'opposition': -45, 'coalition': -15 },
            constitutionalityScore: 35.8,
            separationOfPowersImpact: 75.4,
            judicialIndependenceImpact: -42.1,
            effectiveDate: '2025-08-15T16:00:00Z',
            expirationDate: '2025-11-15T16:00:00Z',
            status: 'active',
            createdAt: '2025-08-15T15:30:00Z',
            updatedAt: '2025-08-15T16:00:00Z'
          }
        ],
        eligibleDecisions: [
          {
            id: 'leg-bill-2024-18',
            title: 'Healthcare Reform Amendment',
            institutionType: 'legislature',
            decisionType: 'legislative_bill',
            status: 'rejected',
            dateDecided: '2025-08-21',
            summary: 'Comprehensive healthcare system reform with universal coverage provisions',
            canOverride: true,
            overrideRisk: 'medium'
          },
          {
            id: 'cb-policy-2024-12',
            title: 'Quantitative Easing Program Termination',
            institutionType: 'central_bank',
            decisionType: 'monetary_policy',
            status: 'approved',
            dateDecided: '2025-08-20',
            summary: 'Ending current QE program and beginning balance sheet normalization',
            canOverride: true,
            overrideRisk: 'high'
          },
          {
            id: 'sc-case-2024-45',
            title: 'Executive Surveillance Powers Review',
            institutionType: 'supreme_court',
            decisionType: 'constitutional_review',
            status: 'pending_decision',
            dateDecided: '2025-08-22',
            summary: 'Constitutional review of expanded executive surveillance authorities',
            canOverride: false,
            overrideRisk: 'critical'
          }
        ],
        trustMetrics: [
          {
            institutionType: 'legislature',
            publicTrustRating: 68.5,
            expertTrustRating: 72.1,
            internationalTrustRating: 78.9,
            independencePerception: 65.2,
            effectivenessRating: 71.8,
            overrideImpactCumulative: -12.5,
            totalOverrides: 8,
            successfulChallenges: 1,
            lastOverrideDate: '2025-08-20'
          },
          {
            institutionType: 'central_bank',
            publicTrustRating: 58.2,
            expertTrustRating: 62.8,
            internationalTrustRating: 55.4,
            independencePerception: 45.9,
            effectivenessRating: 68.7,
            overrideImpactCumulative: -28.9,
            totalOverrides: 3,
            successfulChallenges: 1,
            lastOverrideDate: '2025-08-18'
          },
          {
            institutionType: 'supreme_court',
            publicTrustRating: 42.1,
            expertTrustRating: 38.5,
            internationalTrustRating: 35.8,
            independencePerception: 28.4,
            effectivenessRating: 52.3,
            overrideImpactCumulative: -45.8,
            totalOverrides: 1,
            successfulChallenges: 0,
            lastOverrideDate: '2025-08-15'
          }
        ],
        separationMetrics: {
          executivePowerIndex: 78.5,
          legislativeIndependenceIndex: 65.2,
          judicialIndependenceIndex: 28.4,
          monetaryIndependenceIndex: 45.9,
          constitutionalBalanceScore: 54.5,
          democraticHealthIndex: 62.8,
          totalInstitutionalOverrides: 12,
          overrideFrequency30d: 3,
          crisisSeverityLevel: 'medium'
        },

      };



      setData(mockData);
    } catch (err) {
      setError('Failed to load institutional override data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAnalyzeOverride = async (decision: EligibleDecision, overrideType: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/institutional-override/analyze/${decision.institutionType}/${decision.id}?campaignId=1&leaderCharacterId=leader-1&overrideType=${overrideType}`
      );
      const result = await response.json();
      
      if (result.success) {
        setOverrideAnalysis(result.data.analysis);
        setSelectedDecision(decision);
        setShowOverrideModal(true);
      }
    } catch (error) {
      console.error('Error analyzing override:', error);
    }
  };

  const handleExecuteOverride = async () => {
    if (!selectedDecision || !overrideAnalysis) return;

    try {
      const response = await fetch('http://localhost:4000/api/institutional-override/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionType: selectedDecision.institutionType,
          targetDecisionId: selectedDecision.id,
          campaignId: 1,
          leaderCharacterId: 'leader-1',
          ...overrideFormData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowOverrideModal(false);
        setSelectedDecision(null);
        setOverrideAnalysis(null);
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Error executing override:', error);
    }
  };

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'legislature': return '🏛️';
      case 'central_bank': return '🏦';
      case 'supreme_court': return '⚖️';
      default: return '🏛️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'challenged': return '#FF9800';
      case 'reversed': return '#F44336';
      case 'expired': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'critical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <BaseScreen screenId={screenId} title={title} icon={icon} endpoints={endpoints}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading institutional override data...</p>
        </div>
      </BaseScreen>
    );
  }

  if (error || !data) {
    return (
      <BaseScreen screenId={screenId} title={title} icon={icon} endpoints={endpoints}>
        <div className="error-container">
          <p>Error: {error || 'No data available'}</p>
          <button onClick={loadData} className="retry-button">Retry</button>
        </div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen screenId={screenId} title={title} icon={icon} endpoints={endpoints}>
      <div className="institutional-override-screen">
        <div className="screen-header">
          <h2>⚖️ Institutional Override System</h2>
          <p>Executive authority to override decisions from Legislature, Central Bank, and Supreme Court</p>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={activeTab === 'overview' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={activeTab === 'active' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('active')}
            >
              ⚡ Active Overrides
            </button>
            <button 
              className={activeTab === 'eligible' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('eligible')}
            >
              🎯 Eligible Decisions
            </button>
            <button 
              className={activeTab === 'analysis' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('analysis')}
            >
              🔍 Analysis Tools
            </button>
            <button 
              className={activeTab === 'trust' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('trust')}
            >
              🏛️ Institutional Trust
            </button>

          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="metrics-grid">
                <div className="metric-card">
                  <h3>Total Overrides</h3>
                  <div className="metric-value">{data.overview.totalOverrides}</div>
                  <div className="metric-subtitle">All-time institutional overrides</div>
                </div>
                <div className="metric-card">
                  <h3>Active Overrides</h3>
                  <div className="metric-value">{data.overview.activeOverrides}</div>
                  <div className="metric-subtitle">Currently in effect</div>
                </div>
                <div className="metric-card">
                  <h3>Success Rate</h3>
                  <div className="metric-value">{data.overview.successRate}%</div>
                  <div className="metric-subtitle">Overrides upheld vs challenged</div>
                </div>
                <div className="metric-card">
                  <h3>Constitutional Balance</h3>
                  <div className="metric-value" style={{ color: data.separationMetrics.constitutionalBalanceScore > 60 ? '#4CAF50' : '#FF9800' }}>
                    {data.separationMetrics.constitutionalBalanceScore.toFixed(1)}
                  </div>
                  <div className="metric-subtitle">Separation of powers health</div>
                </div>
              </div>

              <div className="constitutional-health-panel">
                <h3>🏛️ Constitutional Health Dashboard</h3>
                <div className="health-metrics">
                  <div className="health-metric">
                    <span>Executive Power Index</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${data.separationMetrics.executivePowerIndex}%`,
                          backgroundColor: data.separationMetrics.executivePowerIndex > 80 ? '#FF5722' : '#4CAF50'
                        }}
                      ></div>
                    </div>
                    <span>{data.separationMetrics.executivePowerIndex.toFixed(1)}</span>
                  </div>
                  <div className="health-metric">
                    <span>Legislative Independence</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${data.separationMetrics.legislativeIndependenceIndex}%`,
                          backgroundColor: data.separationMetrics.legislativeIndependenceIndex < 50 ? '#FF5722' : '#4CAF50'
                        }}
                      ></div>
                    </div>
                    <span>{data.separationMetrics.legislativeIndependenceIndex.toFixed(1)}</span>
                  </div>
                  <div className="health-metric">
                    <span>Judicial Independence</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${data.separationMetrics.judicialIndependenceIndex}%`,
                          backgroundColor: data.separationMetrics.judicialIndependenceIndex < 50 ? '#FF5722' : '#4CAF50'
                        }}
                      ></div>
                    </div>
                    <span>{data.separationMetrics.judicialIndependenceIndex.toFixed(1)}</span>
                  </div>
                  <div className="health-metric">
                    <span>Monetary Independence</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${data.separationMetrics.monetaryIndependenceIndex}%`,
                          backgroundColor: data.separationMetrics.monetaryIndependenceIndex < 50 ? '#FF5722' : '#4CAF50'
                        }}
                      ></div>
                    </div>
                    <span>{data.separationMetrics.monetaryIndependenceIndex.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="crisis-alert">
                  <span className={`crisis-level ${data.separationMetrics.crisisSeverityLevel}`}>
                    Crisis Level: {data.separationMetrics.crisisSeverityLevel.toUpperCase()}
                  </span>
                  {data.separationMetrics.crisisSeverityLevel !== 'none' && (
                    <div className="crisis-warning">
                      ⚠️ Constitutional balance concerns detected. Consider restraint in future overrides.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="active-overrides-tab">
              <div className="overrides-list">
                {data.overrides.filter(override => override.status === 'active' || override.status === 'challenged').map(override => (
                  <div key={override.id} className="override-card">
                    <div className="override-header">
                      <div className="override-title">
                        <span className="institution-icon">{getInstitutionIcon(override.institutionType)}</span>
                        <span className="decision-title">{override.targetDecisionTitle}</span>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(override.status) }}
                        >
                          {override.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="override-date">
                        {new Date(override.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="override-details">
                      <div className="override-decision">
                        <strong>Override Decision:</strong> {override.overrideDecision.toUpperCase()}
                      </div>
                      <div className="override-reason">
                        <strong>Reason:</strong> {override.overrideReason}
                      </div>
                      <div className="constitutional-basis">
                        <strong>Constitutional Basis:</strong> {override.constitutionalBasis}
                      </div>
                    </div>

                    <div className="impact-metrics">
                      <div className="impact-metric">
                        <span>Political Cost</span>
                        <span className="impact-value">{override.politicalCost.toFixed(1)}</span>
                      </div>
                      <div className="impact-metric">
                        <span>Trust Impact</span>
                        <span className="impact-value negative">{override.institutionalTrustImpact.toFixed(1)}</span>
                      </div>
                      <div className="impact-metric">
                        <span>Constitutional Impact</span>
                        <span className="impact-value">{override.separationOfPowersImpact.toFixed(1)}</span>
                      </div>
                    </div>

                    {override.challengeDetails && (
                      <div className="challenge-details">
                        <h4>⚠️ Legal Challenge</h4>
                        <div><strong>Challenger:</strong> {override.challengeDetails.challenger}</div>
                        <div><strong>Reason:</strong> {override.challengeDetails.challengeReason}</div>
                        <div><strong>Challenge Date:</strong> {new Date(override.challengeDetails.challengeDate).toLocaleDateString()}</div>
                      </div>
                    )}

                    {override.expirationDate && (
                      <div className="expiration-notice">
                        <strong>Expires:</strong> {new Date(override.expirationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'eligible' && (
            <div className="eligible-decisions-tab">
              <div className="institution-filter">
                <label>Filter by Institution:</label>
                <select 
                  value={selectedInstitution} 
                  onChange={(e) => setSelectedInstitution(e.target.value as any)}
                >
                  <option value="all">All Institutions</option>
                  <option value="legislature">🏛️ Legislature</option>
                  <option value="central_bank">🏦 Central Bank</option>
                  <option value="supreme_court">⚖️ Supreme Court</option>
                </select>
              </div>

              <div className="decisions-list">
                {data.eligibleDecisions
                  .filter(decision => selectedInstitution === 'all' || decision.institutionType === selectedInstitution)
                  .map(decision => (
                  <div key={decision.id} className="decision-card">
                    <div className="decision-header">
                      <div className="decision-title">
                        <span className="institution-icon">{getInstitutionIcon(decision.institutionType)}</span>
                        <span>{decision.title}</span>
                        <span 
                          className="risk-badge" 
                          style={{ backgroundColor: getRiskColor(decision.overrideRisk) }}
                        >
                          {decision.overrideRisk.toUpperCase()} RISK
                        </span>
                      </div>
                      <div className="decision-date">
                        {new Date(decision.dateDecided).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="decision-summary">
                      {decision.summary}
                    </div>
                    
                    <div className="decision-meta">
                      <span><strong>Type:</strong> {decision.decisionType.replace('_', ' ')}</span>
                      <span><strong>Status:</strong> {decision.status.replace('_', ' ')}</span>
                    </div>

                    {decision.canOverride && (
                      <div className="override-actions">
                        <button 
                          className="analyze-button"
                          onClick={() => handleAnalyzeOverride(decision, 'approve')}
                        >
                          🔍 Analyze Override (Approve)
                        </button>
                        <button 
                          className="analyze-button"
                          onClick={() => handleAnalyzeOverride(decision, 'reject')}
                        >
                          🔍 Analyze Override (Reject)
                        </button>
                        {decision.institutionType !== 'supreme_court' && (
                          <button 
                            className="analyze-button"
                            onClick={() => handleAnalyzeOverride(decision, 'modify')}
                          >
                            🔍 Analyze Override (Modify)
                          </button>
                        )}
                      </div>
                    )}
                    
                    {!decision.canOverride && (
                      <div className="no-override-notice">
                        ❌ Override not permitted for this decision type
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trust' && (
            <div className="trust-metrics-tab">
              <h3>🏛️ Institutional Trust Metrics</h3>
              <div className="trust-cards">
                {data.trustMetrics.map(metrics => (
                  <div key={metrics.institutionType} className="trust-card">
                    <div className="trust-header">
                      <span className="institution-icon">{getInstitutionIcon(metrics.institutionType)}</span>
                      <h4>{metrics.institutionType.replace('_', ' ').toUpperCase()}</h4>
                    </div>
                    
                    <div className="trust-metrics">
                      <div className="trust-metric">
                        <span>Public Trust</span>
                        <div className="trust-bar">
                          <div 
                            className="trust-fill" 
                            style={{ 
                              width: `${metrics.publicTrustRating}%`,
                              backgroundColor: metrics.publicTrustRating > 60 ? '#4CAF50' : metrics.publicTrustRating > 40 ? '#FF9800' : '#F44336'
                            }}
                          ></div>
                        </div>
                        <span>{metrics.publicTrustRating.toFixed(1)}%</span>
                      </div>
                      
                      <div className="trust-metric">
                        <span>Expert Trust</span>
                        <div className="trust-bar">
                          <div 
                            className="trust-fill" 
                            style={{ 
                              width: `${metrics.expertTrustRating}%`,
                              backgroundColor: metrics.expertTrustRating > 60 ? '#4CAF50' : metrics.expertTrustRating > 40 ? '#FF9800' : '#F44336'
                            }}
                          ></div>
                        </div>
                        <span>{metrics.expertTrustRating.toFixed(1)}%</span>
                      </div>
                      
                      <div className="trust-metric">
                        <span>Independence Perception</span>
                        <div className="trust-bar">
                          <div 
                            className="trust-fill" 
                            style={{ 
                              width: `${metrics.independencePerception}%`,
                              backgroundColor: metrics.independencePerception > 60 ? '#4CAF50' : metrics.independencePerception > 40 ? '#FF9800' : '#F44336'
                            }}
                          ></div>
                        </div>
                        <span>{metrics.independencePerception.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div className="trust-stats">
                      <div className="trust-stat">
                        <span>Total Overrides</span>
                        <span>{metrics.totalOverrides}</span>
                      </div>
                      <div className="trust-stat">
                        <span>Successful Challenges</span>
                        <span>{metrics.successfulChallenges}</span>
                      </div>
                      <div className="trust-stat">
                        <span>Cumulative Impact</span>
                        <span className="negative">{metrics.overrideImpactCumulative.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>

        {/* Override Analysis Modal */}
        {showOverrideModal && overrideAnalysis && selectedDecision && (
          <div className="modal-overlay">
            <div className="override-modal">
              <div className="modal-header">
                <h3>Override Analysis: {selectedDecision.title}</h3>
                <button className="close-button" onClick={() => setShowOverrideModal(false)}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="analysis-section">
                  <h4>📊 Feasibility Assessment</h4>
                  <div className="analysis-metrics">
                    <div className="analysis-metric">
                      <span>Political Feasibility</span>
                      <span>{overrideAnalysis.politicalFeasibility}%</span>
                    </div>
                    <div className="analysis-metric">
                      <span>Constitutional Validity</span>
                      <span>{overrideAnalysis.constitutionalValidity}%</span>
                    </div>
                    <div className="analysis-metric">
                      <span>Public Support Estimate</span>
                      <span>{overrideAnalysis.publicSupportEstimate}%</span>
                    </div>
                    <div className="analysis-metric">
                      <span>Political Cost</span>
                      <span>{overrideAnalysis.politicalCostAssessment}</span>
                    </div>
                  </div>
                  
                  <div className="recommendation">
                    <strong>Recommended Action:</strong> 
                    <span className={`recommendation-${overrideAnalysis.recommendedAction}`}>
                      {overrideAnalysis.recommendedAction.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="analysis-section">
                  <h4>⚠️ Risk Factors</h4>
                  <ul className="risk-list">
                    {overrideAnalysis.riskFactors.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="analysis-section">
                  <h4>✅ Supporting Arguments</h4>
                  <ul className="support-list">
                    {overrideAnalysis.supportingArguments.map((arg, index) => (
                      <li key={index}>{arg}</li>
                    ))}
                  </ul>
                </div>

                {overrideAnalysis.recommendedAction === 'proceed' && (
                  <div className="override-form">
                    <h4>Execute Override</h4>
                    
                    <div className="form-group">
                      <label>Override Decision:</label>
                      <select 
                        value={overrideFormData.overrideDecision}
                        onChange={(e) => setOverrideFormData({
                          ...overrideFormData, 
                          overrideDecision: e.target.value as any
                        })}
                      >
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="modify">Modify</option>
                        <option value="suspend">Suspend</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Override Reason:</label>
                      <textarea 
                        value={overrideFormData.overrideReason}
                        onChange={(e) => setOverrideFormData({
                          ...overrideFormData, 
                          overrideReason: e.target.value
                        })}
                        placeholder="Brief reason for the override..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Constitutional Justification:</label>
                      <textarea 
                        value={overrideFormData.overrideJustification}
                        onChange={(e) => setOverrideFormData({
                          ...overrideFormData, 
                          overrideJustification: e.target.value
                        })}
                        placeholder="Detailed constitutional and legal justification..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Constitutional Basis:</label>
                      <textarea 
                        value={overrideFormData.constitutionalBasis}
                        onChange={(e) => setOverrideFormData({
                          ...overrideFormData, 
                          constitutionalBasis: e.target.value
                        })}
                        placeholder="Specific constitutional provisions and authorities..."
                      />
                    </div>

                    <div className="modal-actions">
                      <button className="execute-button" onClick={handleExecuteOverride}>
                        ⚡ Execute Override
                      </button>
                      <button className="cancel-button" onClick={() => setShowOverrideModal(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseScreen>
  );
};

export default InstitutionalOverrideScreen;
