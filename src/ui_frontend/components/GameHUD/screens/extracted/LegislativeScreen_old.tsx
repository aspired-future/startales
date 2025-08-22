import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './LegislativeScreen.css';

interface LegislativeProposal {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  status: 'pending' | 'review' | 'passed' | 'failed' | 'approved' | 'vetoed' | 'leader_review';
  urgency: 'routine' | 'important' | 'urgent' | 'emergency';
  publicSupport: number;
  committee: string;
  voteResult?: 'passed' | 'failed' | 'tied';
}

interface PoliticalParty {
  id: string;
  name: string;
  abbreviation: string;
  ideology: string;
  leader: string;
  seats: number;
  percentage: number;
  approval: number;
  focus: string[];
  color: string;
}

interface Committee {
  id: string;
  name: string;
  chair: string;
  jurisdiction: string[];
  members: number;
  meetings: number;
  billsReviewed: number;
}



interface LegislativeData {
  overview: {
    pendingProposals: number;
    leaderApprovalRate: number;
    productivity: number;
    bipartisanCooperation: number;
    publicConfidence: number;

  };
  proposals: LegislativeProposal[];
  parties: PoliticalParty[];
  committees: Committee[];

  sessions: {
    regular: number;
    special: number;
    committee: number;
    publicHearings: number;
  };
  interactions: {
    consultations: number;
    modifications: number;
    compromises: number;
    agreements: number;
  };
}

const LegislativeScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'parties' | 'committees'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<LegislativeProposal | null>(null);

  const [legislativeData, setLegislativeData] = useState<LegislativeData>({
    overview: {
      pendingProposals: 3,
      leaderApprovalRate: 0,
      productivity: 75,
      bipartisanCooperation: 68,
      publicConfidence: 62.5,

    },
    proposals: [
      {
        id: 'prop-1',
        title: 'Interstellar Infrastructure Investment Act',
        sponsor: 'Progressive Alliance',
        description: '500B credit infrastructure program',
        status: 'review',
        urgency: 'important',
        publicSupport: 72,
        committee: 'Infrastructure Committee'
      },
      {
        id: 'prop-2',
        title: 'Galactic Trade Enhancement Act',
        sponsor: 'Conservative Coalition',
        description: 'Trade modernization & worker protection',
        status: 'review',
        urgency: 'important',
        publicSupport: 58,
        committee: 'Commerce Committee'
      },
      {
        id: 'prop-3',
        title: 'Climate Emergency Response Resolution',
        sponsor: 'Progressive Alliance',
        description: 'Carbon neutrality action plan',
        status: 'review',
        urgency: 'urgent',
        publicSupport: 65,
        committee: 'Science & Technology Committee'
      },
      {
        id: 'prop-4',
        title: 'Galactic Defense Modernization Act',
        sponsor: 'Security Coalition',
        description: 'Military technology upgrade program',
        status: 'passed',
        urgency: 'important',
        publicSupport: 45,
        committee: 'Defense Committee',
        voteResult: 'passed',

      },
      {
        id: 'prop-5',
        title: 'Universal Healthcare Expansion Act',
        sponsor: 'Progressive Alliance',
        description: 'Expand healthcare to outer colonies',
        status: 'failed',
        urgency: 'important',
        publicSupport: 78,
        committee: 'Health Committee',
        voteResult: 'failed',

      }
    ],
    overrides: [
      {
        id: 'override-1',
        proposalId: 'prop-6',
        proposalTitle: 'Corporate Tax Reform Act',
        originalVoteResult: 'failed',
        overrideDecision: 'approve',
        overrideReason: 'Critical for economic competitiveness',
        politicalCost: 25,
        publicApprovalImpact: -3,
        status: 'active',
        createdAt: '2025-08-20T10:30:00Z'
      },
      {
        id: 'override-2',
        proposalId: 'prop-7',
        proposalTitle: 'Immigration Reform Bill',
        originalVoteResult: 'passed',
        overrideDecision: 'veto',
        overrideReason: 'Constitutional concerns regarding enforcement',
        politicalCost: 35,
        publicApprovalImpact: -5,
        status: 'active',
        createdAt: '2025-08-18T14:15:00Z'
      }
    ],
    eligibleForOverride: [],
    parties: [
      {
        id: 'pa',
        name: 'Progressive Alliance',
        abbreviation: 'PA',
        ideology: 'Progressive',
        leader: 'Dr. Elena Vasquez',
        seats: 28,
        percentage: 28.3,
        approval: 42.5,
        focus: ['Social justice', 'Environmental protection'],
        color: '#e74c3c'
      },
      {
        id: 'cc',
        name: 'Conservative Coalition',
        abbreviation: 'CC',
        ideology: 'Conservative',
        leader: 'Admiral James Morrison',
        seats: 31,
        percentage: 31.2,
        approval: 38.7,
        focus: ['Fiscal responsibility', 'Strong defense'],
        color: '#3498db'
      },
      {
        id: 'cp',
        name: 'Centrist Party',
        abbreviation: 'CP',
        ideology: 'Centrist',
        leader: 'Dr. Michael Rodriguez',
        seats: 23,
        percentage: 22.8,
        approval: 51.2,
        focus: ['Pragmatic solutions', 'Cooperation'],
        color: '#9b59b6'
      },
      {
        id: 'lm',
        name: 'Libertarian Movement',
        abbreviation: 'LM',
        ideology: 'Libertarian',
        leader: 'Sarah Chen',
        seats: 12,
        percentage: 12.4,
        approval: 35.8,
        focus: ['Limited government', 'Individual freedom'],
        color: '#f39c12'
      },
      {
        id: 'np',
        name: 'Nationalist Party',
        abbreviation: 'NP',
        ideology: 'Nationalist',
        leader: 'Marcus Thompson',
        seats: 5,
        percentage: 5.3,
        approval: 28.4,
        focus: ['Sovereignty', 'National identity'],
        color: '#27ae60'
      }
    ],
    committees: [
      {
        id: 'budget',
        name: 'Budget Committee',
        chair: 'Conservative Coalition',
        jurisdiction: ['Government spending', 'Taxation'],
        members: 14,
        meetings: 12,
        billsReviewed: 8
      },
      {
        id: 'defense',
        name: 'Defense Committee',
        chair: 'Conservative Coalition',
        jurisdiction: ['Military policy', 'Security'],
        members: 14,
        meetings: 10,
        billsReviewed: 6
      },
      {
        id: 'foreign',
        name: 'Foreign Relations Committee',
        chair: 'Centrist Party',
        jurisdiction: ['Treaties', 'Diplomacy'],
        members: 14,
        meetings: 8,
        billsReviewed: 4
      },
      {
        id: 'judiciary',
        name: 'Judiciary Committee',
        chair: 'Progressive Alliance',
        jurisdiction: ['Legal system', 'Appointments'],
        members: 15,
        meetings: 9,
        billsReviewed: 7
      }
    ],
    sessions: {
      regular: 24,
      special: 3,
      committee: 45,
      publicHearings: 18
    },
    interactions: {
      consultations: 15,
      modifications: 0,
      compromises: 8,
      agreements: 12
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/legislature/dashboard', description: 'Get legislative overview and metrics' },
    { method: 'GET', path: '/api/legislature/proposals', description: 'Get all legislative proposals' },
    { method: 'POST', path: '/api/legislature/proposals', description: 'Create new legislative proposal' },
    { method: 'PUT', path: '/api/legislature/proposals/:id/leader-response', description: 'Leader response to proposal' },
    { method: 'GET', path: '/api/legislature/parties', description: 'Get political party information' },
    { method: 'GET', path: '/api/legislature/committees', description: 'Get committee information' },
    { method: 'POST', path: '/api/legislature/sessions', description: 'Schedule legislative session' },
    { method: 'POST', path: '/api/legislature/votes', description: 'Conduct legislative vote' },
    { method: 'POST', path: '/api/legislature/interactions', description: 'Record leader-legislature interaction' }
  ];

  const fetchLegislativeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/legislature/dashboard');
      // const data = await response.json();
      // setLegislativeData(data);
      
      // For now, use mock data with some randomization
      setLegislativeData(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          productivity: Math.max(60, Math.min(90, prev.overview.productivity + (Math.random() * 6 - 3))),
          bipartisanCooperation: Math.max(50, Math.min(85, prev.overview.bipartisanCooperation + (Math.random() * 4 - 2))),
          publicConfidence: Math.max(45, Math.min(80, prev.overview.publicConfidence + (Math.random() * 3 - 1.5)))
        }
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch legislative data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLegislativeData();
  }, [fetchLegislativeData]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'review': return '#e74c3c';
      case 'passed': return '#27ae60';
      case 'failed': return '#e74c3c';
      case 'approved': return '#2ecc71';
      case 'vetoed': return '#c0392b';
      default: return '#95a5a6';
    }
  };

  const getProductivityClass = (score: number): string => {
    if (score >= 80) return 'productivity-excellent';
    if (score >= 70) return 'productivity-good';
    if (score >= 60) return 'productivity-fair';
    return 'productivity-poor';
  };

  const handleReviewProposals = () => {
    alert('Legislative Proposals Review\n\n📋 Current Pending Proposals:\n\n1. Interstellar Infrastructure Investment Act (Important)\n   - Sponsor: Progressive Alliance\n   - 500B credit investment over 5 years\n   - Public Support: 72%\n   - Committee: Infrastructure Committee\n\n2. Galactic Trade Enhancement Act (Important)\n   - Sponsor: Conservative Coalition\n   - Trade modernization with worker protection\n   - Public Support: 58%\n   - Committee: Commerce Committee\n\n3. Climate Emergency Response Resolution (Urgent)\n   - Sponsor: Progressive Alliance\n   - Carbon neutrality action plan\n   - Public Support: 65%\n   - Committee: Science & Technology Committee\n\nLeader has final authority on all legislative decisions.');
  };

  const handleCreateProposal = () => {
    alert('Create New Legislative Proposal\n\n📝 Proposal Types:\n• Bills (comprehensive legislation)\n• Resolutions (policy declarations)\n• Amendments (constitutional changes)\n• Treaties (international agreements)\n\n📊 Policy Categories:\n• Economic Policy\n• Social Policy\n• Infrastructure Policy\n• Security Policy\n• Environmental Policy\n• International Policy\n\nEach proposal includes:\n• Constitutional analysis\n• Impact assessment\n• Fiscal impact evaluation\n• Implementation timeline\n• Public support estimation');
  };

  const handleViewPartyDetails = () => {
    alert('Political Party Details\n\n🗳️ Active Political Parties:\n\n🔴 Progressive Alliance (PA) - 28.3%\n   - Ideology: Progressive\n   - Leader: Dr. Elena Vasquez\n   - Focus: Social justice, environmental protection\n   - Approval: 42.5%\n\n🔵 Conservative Coalition (CC) - 31.2%\n   - Ideology: Conservative\n   - Leader: Admiral James Morrison\n   - Focus: Fiscal responsibility, strong defense\n   - Approval: 38.7%\n\n🟣 Centrist Party (CP) - 22.8%\n   - Ideology: Centrist\n   - Leader: Dr. Michael Rodriguez\n   - Focus: Pragmatic solutions, cooperation\n   - Approval: 51.2%\n\n🟡 Libertarian Movement (LM) - 12.4%\n🟢 Nationalist Party (NP) - 5.3%');
  };

  const handleScheduleConsultation = () => {
    alert('Schedule Leader-Legislative Consultation\n\n📅 Consultation Types:\n\n🎯 Policy Consultations:\n• Legislative agenda planning\n• Priority setting sessions\n• Implementation discussions\n• Resource allocation meetings\n\n🚨 Emergency Consultations:\n• Crisis response coordination\n• Urgent legislation review\n• Emergency powers discussion\n• Rapid decision making\n\n📊 Regular Meetings:\n• Weekly leadership briefings\n• Monthly policy reviews\n• Quarterly strategic planning\n• Annual agenda setting\n\nConsultations maintain democratic input while respecting leader authority.');
  };

  const handleShowEligibleProposals = () => {
    const eligible = legislativeData.proposals.filter(p => p.canOverride);
    alert(`Proposals Eligible for Override\n\n${eligible.length} proposals can be overridden:\n\n${eligible.map(p => 
      `• ${p.title}\n  Status: ${p.status.toUpperCase()}\n  Vote Result: ${p.voteResult?.toUpperCase()}\n  Public Support: ${p.publicSupport}%`
    ).join('\n\n')}`);
  };

  const handleAnalyzeOverride = async (proposal: LegislativeProposal) => {
    try {
      // In a real implementation, this would call the API
      const mockAnalysis: OverrideAnalysis = {
        politicalFeasibility: Math.floor(Math.random() * 40) + 40, // 40-80
        constitutionalValidity: Math.floor(Math.random() * 30) + 60, // 60-90
        publicSupportEstimate: proposal.publicSupport + Math.floor(Math.random() * 20) - 10,
        politicalCostAssessment: Math.floor(Math.random() * 60) + 20, // 20-80
        recommendedAction: Math.random() > 0.5 ? 'proceed' : 'modify',
        riskFactors: [
          'Potential constitutional challenges',
          'Opposition party mobilization',
          'Public backlash risk'
        ],
        supportingArguments: [
          'Executive leadership necessary',
          'National interest priority',
          'Legislative oversight maintained'
        ]
      };

      setOverrideAnalysis(mockAnalysis);
      setSelectedProposal(proposal);
      
      alert(`Override Analysis for: ${proposal.title}\n\n` +
        `Political Feasibility: ${mockAnalysis.politicalFeasibility}%\n` +
        `Constitutional Validity: ${mockAnalysis.constitutionalValidity}%\n` +
        `Public Support Estimate: ${mockAnalysis.publicSupportEstimate}%\n` +
        `Political Cost: ${mockAnalysis.politicalCostAssessment}\n` +
        `Recommendation: ${mockAnalysis.recommendedAction.toUpperCase()}\n\n` +
        `Risk Factors:\n${mockAnalysis.riskFactors.map(r => `• ${r}`).join('\n')}`);
    } catch (error) {
      console.error('Error analyzing override:', error);
      alert('Error analyzing override. Please try again.');
    }
  };

  const handleInitiateOverride = (proposal: LegislativeProposal) => {
    setSelectedProposal(proposal);
    setShowOverrideModal(true);
  };

  const handleExecuteOverride = async () => {
    if (!selectedProposal) return;

    try {
      // In a real implementation, this would call the API
      const overrideRequest = {
        proposalId: selectedProposal.id,
        campaignId: 1,
        leaderCharacterId: 'leader-1',
        overrideDecision: overrideFormData.decision,
        overrideReason: overrideFormData.reason,
        overrideJustification: overrideFormData.justification,
        constitutionalBasis: overrideFormData.constitutionalBasis,
        modifications: overrideFormData.modifications
      };

      // Mock successful override
      const newOverride: LegislativeOverride = {
        id: `override-${Date.now()}`,
        proposalId: selectedProposal.id,
        proposalTitle: selectedProposal.title,
        originalVoteResult: selectedProposal.voteResult!,
        overrideDecision: overrideFormData.decision,
        overrideReason: overrideFormData.reason,
        politicalCost: Math.floor(Math.random() * 50) + 10,
        publicApprovalImpact: Math.floor(Math.random() * 10) - 5,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Update state
      setLegislativeData(prev => ({
        ...prev,
        overrides: [...prev.overrides, newOverride],
        overview: {
          ...prev.overview,
          totalOverrides: prev.overview.totalOverrides + 1
        }
      }));

      setShowOverrideModal(false);
      setSelectedProposal(null);
      setOverrideFormData({
        decision: 'approve',
        reason: '',
        justification: '',
        constitutionalBasis: '',
        modifications: ''
      });

      alert(`Override Executed Successfully!\n\n` +
        `Proposal: ${selectedProposal.title}\n` +
        `Decision: ${overrideFormData.decision.toUpperCase()}\n` +
        `Political Cost: ${newOverride.politicalCost}\n` +
        `Approval Impact: ${newOverride.publicApprovalImpact > 0 ? '+' : ''}${newOverride.publicApprovalImpact}`);
    } catch (error) {
      console.error('Error executing override:', error);
      alert('Error executing override. Please try again.');
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchLegislativeData}
    >
      <div className="legislative-screen-container">
        {loading && <div className="loading-overlay">Loading legislative data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="legislative-dashboard">
          {/* Legislative Overview */}
          <div className="panel democratic-panel">
            <h2>📊 Legislative Overview</h2>
            <div className="metric">
              <span>Pending Proposals</span>
              <span className="metric-value">{legislativeData.overview.pendingProposals}</span>
            </div>
            <div className="metric">
              <span>Leader Approval Rate</span>
              <span className="metric-value">{legislativeData.overview.leaderApprovalRate}%</span>
            </div>
            <div className="metric">
              <span>Legislative Productivity</span>
              <span className={`metric-value ${getProductivityClass(legislativeData.overview.productivity)}`}>
                {legislativeData.overview.productivity}/100
              </span>
            </div>
            <div className="metric">
              <span>Bipartisan Cooperation</span>
              <span className={`metric-value ${getProductivityClass(legislativeData.overview.bipartisanCooperation)}`}>
                {legislativeData.overview.bipartisanCooperation}/100
              </span>
            </div>
            <div className="metric">
              <span>Public Confidence</span>
              <span className={`metric-value ${getProductivityClass(legislativeData.overview.publicConfidence)}`}>
                {legislativeData.overview.publicConfidence}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${legislativeData.overview.productivity}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Legislative Proposals */}
          <div className="panel">
            <h2>📋 Pending Proposals</h2>
            <div className="metric">
              <span>Awaiting Leader Decision</span>
              <span className="metric-value">{legislativeData.proposals.length}</span>
            </div>
            {legislativeData.proposals.map((proposal) => (
              <div key={proposal.id} className={`proposal-item proposal-${proposal.urgency}`}>
                <strong>{proposal.title}</strong><br />
                <small>{proposal.description} - {proposal.sponsor}</small>
                <span 
                  className={`status-indicator status-${proposal.status}`}
                  style={{ backgroundColor: getStatusColor(proposal.status) }}
                ></span>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn" onClick={handleReviewProposals}>Review All</button>
              <button className="btn btn-success" onClick={handleCreateProposal}>New Proposal</button>
            </div>
          </div>

          {/* Political Parties */}
          <div className="panel">
            <h2>🗳️ Political Parties</h2>
            <div className="metric">
              <span>Active Parties</span>
              <span className="metric-value">{legislativeData.parties.length}</span>
            </div>
            {legislativeData.parties.slice(0, 3).map((party) => (
              <div key={party.id} className="party-item" style={{ borderLeft: `4px solid ${party.color}` }}>
                <div>
                  <strong>{party.name} ({party.abbreviation})</strong><br />
                  <small>{party.focus.join(', ')}</small>
                </div>
                <div className="party-stats">
                  <div>{party.percentage}%</div>
                  <div>{party.seats} seats</div>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn" onClick={handleViewPartyDetails}>Party Details</button>
              <button className="btn btn-secondary">Party Positions</button>
            </div>
          </div>

          {/* Committees */}
          <div className="panel">
            <h2>🏢 Legislative Committees</h2>
            <div className="metric">
              <span>Standing Committees</span>
              <span className="metric-value">{legislativeData.committees.length}</span>
            </div>
            {legislativeData.committees.slice(0, 3).map((committee) => (
              <div key={committee.id} className="committee-item">
                <strong>{committee.name}</strong><br />
                <small>Chair: {committee.chair} • {committee.members} members</small>
                <div className="committee-stats">
                  <span>{committee.meetings} meetings</span>
                  <span>{committee.billsReviewed} bills reviewed</span>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">View Committees</button>
              <button className="btn btn-secondary">Schedule Hearing</button>
            </div>
          </div>

          {/* Legislative Sessions */}
          <div className="panel">
            <h2>📅 Legislative Sessions</h2>
            <div className="metric">
              <span>Regular Sessions</span>
              <span className="metric-value">{legislativeData.sessions.regular}</span>
            </div>
            <div className="metric">
              <span>Special Sessions</span>
              <span className="metric-value">{legislativeData.sessions.special}</span>
            </div>
            <div className="metric">
              <span>Committee Sessions</span>
              <span className="metric-value">{legislativeData.sessions.committee}</span>
            </div>
            <div className="metric">
              <span>Public Hearings</span>
              <span className="metric-value">{legislativeData.sessions.publicHearings}</span>
            </div>
            <div className="action-buttons">
              <button className="btn">Conduct Vote</button>
              <button className="btn btn-secondary">Schedule Session</button>
            </div>
          </div>

          {/* Leader Authority Panel */}
          <div className="panel leader-authority-panel">
            <h2>⚖️ Leader Authority & Legislative Override</h2>
            <div className="authority-grid">
              <div>
                <h3>🎯 Executive Override Powers</h3>
                <div className="metric">
                  <span>Total Overrides</span>
                  <span className="metric-value">{legislativeData.overview.totalOverrides}</span>
                </div>
                <div className="metric">
                  <span>Override Challenges</span>
                  <span className="metric-value">{legislativeData.overview.overrideChallenges}</span>
                </div>
                <div className="metric">
                  <span>Eligible Proposals</span>
                  <span className="metric-value">{legislativeData.proposals.filter(p => p.canOverride).length}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  <li>• Override legislative votes</li>
                  <li>• Approve failed legislation</li>
                  <li>• Veto passed legislation</li>
                  <li>• Modify proposals</li>
                </ul>
              </div>
              <div>
                <h3>⚖️ Recent Override Activity</h3>
                {legislativeData.overrides.slice(0, 2).map((override) => (
                  <div key={override.id} className="override-summary">
                    <strong>{override.proposalTitle}</strong><br />
                    <small>
                      {override.overrideDecision.toUpperCase()}: {override.overrideReason}
                    </small>
                    <div className="override-impacts">
                      <span className={`status-badge status-${override.status}`}>
                        {override.status}
                      </span>
                      <span className="cost-badge">
                        Cost: {override.politicalCost}
                      </span>
                    </div>
                  </div>
                ))}
                {legislativeData.overrides.length === 0 && (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>No overrides executed</p>
                )}
              </div>
            </div>
            
            <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveTab('overrides')}
              >
                📋 Override Management
              </button>
              <button 
                className="btn btn-warning" 
                onClick={handleShowEligibleProposals}
              >
                🎯 Eligible Proposals
              </button>
              <button className="btn btn-success" onClick={fetchLegislativeData}>Update Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};

export default LegislativeScreen;
