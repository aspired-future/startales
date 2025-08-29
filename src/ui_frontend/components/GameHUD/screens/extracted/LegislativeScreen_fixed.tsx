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

const getProductivityClass = (productivity: number): string => {
  if (productivity >= 85) return 'productivity-excellent';
  if (productivity >= 70) return 'productivity-good';
  if (productivity >= 50) return 'productivity-fair';
  return 'productivity-poor';
};

const getUrgencyClass = (urgency: string): string => {
  switch (urgency) {
    case 'emergency': return 'proposal-emergency';
    case 'urgent': return 'proposal-urgent';
    case 'important': return 'proposal-important';
    default: return 'proposal-routine';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'passed': return '#4CAF50';
    case 'failed': return '#F44336';
    case 'approved': return '#2196F3';
    case 'vetoed': return '#FF5722';
    case 'pending': return '#FF9800';
    default: return '#9E9E9E';
  }
};

const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'emergency': return '#D32F2F';
    case 'urgent': return '#F57C00';
    case 'important': return '#FBC02D';
    default: return '#757575';
  }
};

const LegislativeScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [legislativeData, setLegislativeData] = useState<LegislativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'proposals' | 'parties' | 'committees'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<LegislativeProposal | null>(null);

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/legislature/proposals',
      description: 'Get legislative proposals and bills'
    },
    {
      method: 'GET',
      path: '/api/legislature/parties',
      description: 'Get political parties information'
    },
    {
      method: 'GET',
      path: '/api/legislature/committees',
      description: 'Get legislative committees data'
    }
  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with real API calls
      const mockData: LegislativeData = {
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
            title: 'Infrastructure Investment Act',
            sponsor: 'Sen. Maria Rodriguez',
            description: 'Comprehensive infrastructure modernization program',
            status: 'pending',
            urgency: 'important',
            publicSupport: 72,
            committee: 'Transportation & Infrastructure'
          },
          {
            id: 'prop-2',
            title: 'Digital Privacy Protection Act',
            sponsor: 'Rep. James Chen',
            description: 'Enhanced digital privacy rights and data protection',
            status: 'review',
            urgency: 'urgent',
            publicSupport: 68,
            committee: 'Technology & Innovation'
          },
          {
            id: 'prop-3',
            title: 'Healthcare Access Expansion',
            sponsor: 'Sen. Sarah Johnson',
            description: 'Expanded healthcare coverage for underserved populations',
            status: 'leader_review',
            urgency: 'important',
            publicSupport: 58,
            committee: 'Health & Human Services'
          }
        ],
        parties: [
          {
            id: 'pa',
            name: 'Progressive Alliance',
            abbreviation: 'PA',
            ideology: 'Social Democracy',
            leader: 'Elena Vasquez',
            seats: 45,
            percentage: 45,
            approval: 67,
            focus: ['Healthcare', 'Education', 'Environment'],
            color: '#2196F3'
          },
          {
            id: 'cp',
            name: 'Conservative Party',
            abbreviation: 'CP',
            ideology: 'Conservative',
            leader: 'James Mitchell',
            seats: 35,
            percentage: 35,
            approval: 58,
            focus: ['Defense', 'Economy', 'Tradition'],
            color: '#FF5722'
          },
          {
            id: 'lp',
            name: 'Liberty Party',
            abbreviation: 'LP',
            ideology: 'Libertarian',
            leader: 'Alex Thompson',
            seats: 20,
            percentage: 20,
            approval: 62,
            focus: ['Freedom', 'Trade', 'Innovation'],
            color: '#4CAF50'
          }
        ],
        committees: [
          {
            id: 'defense',
            name: 'Defense & Security',
            chair: 'Sen. Marcus Rodriguez',
            jurisdiction: ['Military', 'Intelligence', 'Homeland Security'],
            members: 12,
            meetings: 24,
            billsReviewed: 18
          },
          {
            id: 'health',
            name: 'Health & Human Services',
            chair: 'Rep. Linda Park',
            jurisdiction: ['Healthcare', 'Social Services', 'Public Health'],
            members: 15,
            meetings: 32,
            billsReviewed: 22
          },
          {
            id: 'tech',
            name: 'Technology & Innovation',
            chair: 'Sen. David Kim',
            jurisdiction: ['Technology', 'Innovation', 'Digital Policy'],
            members: 10,
            meetings: 18,
            billsReviewed: 14
          }
        ],
        sessions: {
          regular: 156,
          special: 8,
          committee: 284,
          publicHearings: 42
        },
        interactions: {
          consultations: 28,
          modifications: 15,
          compromises: 12,
          agreements: 22
        }
      };

      setLegislativeData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load legislative data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!legislativeData) {
    return (
      <BaseScreen screenId={screenId} title={title} icon={icon} gameContext={gameContext}>
        <div className="loading-overlay">Loading Legislative data...</div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={endpoints}
      onRefresh={loadData}
    >
      <div className="legislative-screen-container">
        {loading && <div className="loading-overlay">Loading Legislative data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="legislative-dashboard">
          {/* Legislative Overview */}
          <div className="panel democratic-panel">
            <div className="metric">
              <span>Pending Proposals</span>
              <span className="metric-value">{legislativeData.overview.pendingProposals}</span>
            </div>
            <div className="metric">
              <span>Leader Approval Rate</span>
              <span className="metric-value">{legislativeData.overview.leaderApprovalRate}%</span>
            </div>
            <div className="metric">
              <span>Productivity</span>
              <span className={`metric-value ${getProductivityClass(legislativeData.overview.productivity)}`}>
                {legislativeData.overview.productivity}/100
              </span>
            </div>
            <div className="metric">
              <span>Bipartisan Cooperation</span>
              <span className="metric-value">{legislativeData.overview.bipartisanCooperation}/100</span>
            </div>
            <div className="metric">
              <span>Public Confidence</span>
              <span className="metric-value">{legislativeData.overview.publicConfidence}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${legislativeData.overview.productivity}%` }}
              ></div>
            </div>
          </div>

          {/* Legislative Proposals */}
          <div className="panel">
            <div className="metric">
              <span>Awaiting Leader Decision</span>
              <span className="metric-value">{legislativeData.proposals.length}</span>
            </div>
            {legislativeData.proposals.map((proposal) => (
              <div key={proposal.id} className={`proposal-item ${getUrgencyClass(proposal.urgency)}`}>
                <div>
                  <strong>{proposal.title}</strong>
                  <p>Sponsor: {proposal.sponsor} | Committee: {proposal.committee}</p>
                  <p>{proposal.description}</p>
                  <div className="proposal-status">
                    <span>Status: {proposal.status}</span>
                    <span>Support: {proposal.publicSupport}%</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">Review All Proposals</button>
              <button className="btn btn-success">New Proposal</button>
            </div>
          </div>

          {/* Political Parties */}
          <div className="panel">
            <div className="metric">
              <span>Active Parties</span>
              <span className="metric-value">{legislativeData.parties.length}</span>
            </div>
            {legislativeData.parties.map((party) => (
              <div key={party.id} className="party-item">
                <div>
                  <strong style={{ color: party.color }}>{party.name} ({party.abbreviation})</strong>
                  <p>Leader: {party.leader} | Ideology: {party.ideology}</p>
                </div>
                <div className="party-stats">
                  <span>{party.seats} seats ({party.percentage}%)</span>
                  <span>Approval: {party.approval}%</span>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">Party Analysis</button>
              <button className="btn btn-secondary">Coalition Building</button>
            </div>
          </div>

          {/* Committees */}
          <div className="panel">
            <div className="metric">
              <span>Active Committees</span>
              <span className="metric-value">{legislativeData.committees.length}</span>
            </div>
            {legislativeData.committees.map((committee) => (
              <div key={committee.id} className="committee-item">
                <div>
                  <strong>{committee.name}</strong>
                  <p>Chair: {committee.chair}</p>
                  <div className="committee-stats">
                    <span>Members: {committee.members}</span>
                    <span>Meetings: {committee.meetings}</span>
                    <span>Bills Reviewed: {committee.billsReviewed}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="action-buttons">
              <button className="btn">Committee Reports</button>
              <button className="btn btn-secondary">Schedule Hearings</button>
            </div>
          </div>

          {/* Leader Authority Panel */}
          <div className="panel leader-authority-panel">
            <div className="authority-grid">
              <div>
                <h3>🎯 Executive Legislative Authority</h3>
                <div className="metric">
                  <span>Bills Signed</span>
                  <span className="metric-value">{legislativeData.interactions.agreements}</span>
                </div>
                <div className="metric">
                  <span>Consultations</span>
                  <span className="metric-value">{legislativeData.interactions.consultations}</span>
                </div>
                <ul>
                  <li>• Sign or veto legislation</li>
                  <li>• Request legislative priorities</li>
                  <li>• Address joint sessions</li>
                  <li>• Emergency legislative powers</li>
                </ul>
              </div>
              <div>
                <h3>🏛️ Democratic Process Respect</h3>
                <div className="metric">
                  <span>Modifications Accepted</span>
                  <span className="metric-value">{legislativeData.interactions.modifications}</span>
                </div>
                <div className="metric">
                  <span>Compromises Reached</span>
                  <span className="metric-value">{legislativeData.interactions.compromises}</span>
                </div>
                <ul>
                  <li>• Constitutional legislative process</li>
                  <li>• Congressional oversight authority</li>
                  <li>• Democratic debate and amendment</li>
                  <li>• Transparent legislative proceedings</li>
                </ul>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-success">Schedule Consultation</button>
              <button className="btn btn-secondary">Legislative Priorities</button>
            </div>
          </div>
        </div>
      </div>
    </BaseScreen>
  );
};

export default LegislativeScreen;

