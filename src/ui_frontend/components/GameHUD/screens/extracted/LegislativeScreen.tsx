import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './LegislativeScreen.css';

interface LegislativeProposal {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  status: 'pending' | 'review' | 'passed' | 'failed' | 'approved' | 'vetoed';
  urgency: 'routine' | 'important' | 'urgent' | 'emergency';
  publicSupport: number;
  committee: string;
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
  const [legislativeData, setLegislativeData] = useState<LegislativeData>({
    overview: {
      pendingProposals: 3,
      leaderApprovalRate: 0,
      productivity: 75,
      bipartisanCooperation: 68,
      publicConfidence: 62.5
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
      }
    ],
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
            <h2>⚖️ Leader Authority & Democratic Balance</h2>
            <div className="authority-grid">
              <div>
                <h3>🎯 Executive Authority</h3>
                <div className="metric">
                  <span>Proposals Approved</span>
                  <span className="metric-value">0</span>
                </div>
                <div className="metric">
                  <span>Policy Modifications</span>
                  <span className="metric-value">{legislativeData.interactions.modifications}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  <li>• Final approval/veto authority</li>
                  <li>• Policy modification requests</li>
                  <li>• Implementation oversight</li>
                  <li>• Democratic accountability</li>
                </ul>
              </div>
              <div>
                <h3>⚖️ Balance & Cooperation</h3>
                <div className="metric">
                  <span>Consultation Sessions</span>
                  <span className="metric-value">{legislativeData.interactions.consultations}</span>
                </div>
                <div className="metric">
                  <span>Compromise Solutions</span>
                  <span className="metric-value">{legislativeData.interactions.compromises}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  <li>• Regular legislative consultations</li>
                  <li>• Transparent decision processes</li>
                  <li>• Democratic input integration</li>
                  <li>• Bipartisan policy development</li>
                </ul>
              </div>
            </div>
            
            <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="btn" onClick={handleScheduleConsultation}>Schedule Consultation</button>
              <button className="btn btn-secondary">Interaction History</button>
              <button className="btn btn-success" onClick={fetchLegislativeData}>Update Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};

export default LegislativeScreen;
