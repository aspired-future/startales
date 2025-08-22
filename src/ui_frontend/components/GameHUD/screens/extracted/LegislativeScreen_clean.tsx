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
  const [legislativeData, setLegislativeData] = useState<LegislativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'proposals' | 'parties' | 'committees'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<LegislativeProposal | null>(null);

  const endpoints: APIEndpoint[] = [
    {
      url: '/api/legislature/proposals',
      key: 'proposals'
    },
    {
      url: '/api/legislature/parties',
      key: 'parties'
    },
    {
      url: '/api/legislature/committees',
      key: 'committees'
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
            title: 'Interstellar Infrastructure Investment Act',
            sponsor: 'Rep. Sarah Chen',
            description: 'Major infrastructure investment for interstellar transportation networks',
            status: 'review',
            urgency: 'important',
            publicSupport: 67,
            committee: 'Transportation & Infrastructure',
            voteResult: 'passed'
          },
          {
            id: 'prop-2',
            title: 'Galactic Defense Enhancement Bill',
            sponsor: 'Sen. Marcus Rodriguez',
            description: 'Enhanced defense capabilities and strategic partnerships',
            status: 'pending',
            urgency: 'urgent',
            publicSupport: 73,
            committee: 'Defense & Security'
          },
          {
            id: 'prop-3',
            title: 'Universal Healthcare Expansion',
            sponsor: 'Rep. Dr. Aisha Patel',
            description: 'Comprehensive healthcare coverage for all citizens',
            status: 'review',
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
            id: 'infrastructure',
            name: 'Transportation & Infrastructure',
            chair: 'Rep. Sarah Chen',
            jurisdiction: ['Transportation', 'Infrastructure', 'Public Works'],
            members: 15,
            meetings: 28,
            billsReviewed: 22
          },
          {
            id: 'health',
            name: 'Health & Human Services',
            chair: 'Rep. Dr. Aisha Patel',
            jurisdiction: ['Healthcare', 'Social Services', 'Public Health'],
            members: 14,
            meetings: 26,
            billsReviewed: 20
          }
        ],
        sessions: {
          regular: 45,
          special: 3,
          committee: 78,
          publicHearings: 12
        },
        interactions: {
          consultations: 156,
          modifications: 89,
          compromises: 34,
          agreements: 67
        }
      };

      setLegislativeData(mockData);
    } catch (err) {
      setError('Failed to load legislative data');
      console.error('Error loading legislative data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'review': return '#FF9800';
      case 'pending': return '#2196F3';
      case 'approved': return '#4CAF50';
      case 'vetoed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#F44336';
      case 'urgent': return '#FF5722';
      case 'important': return '#FF9800';
      case 'routine': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <BaseScreen screenId={screenId} title={title} icon={icon} endpoints={endpoints}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading legislative data...</p>
        </div>
      </BaseScreen>
    );
  }

  if (error || !legislativeData) {
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
      <div className="legislative-screen">
        <div className="screen-header">
          <h2>🏛️ Legislative Branch</h2>
          <p>Congressional oversight, bill management, and democratic processes</p>
        </div>

        {/* Overview Dashboard */}
        <div className="overview-section">
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Pending Proposals</h3>
              <div className="metric-value">{legislativeData.overview.pendingProposals}</div>
              <div className="metric-subtitle">Awaiting review</div>
            </div>
            <div className="metric-card">
              <h3>Productivity</h3>
              <div className="metric-value">{legislativeData.overview.productivity}%</div>
              <div className="metric-subtitle">Legislative efficiency</div>
            </div>
            <div className="metric-card">
              <h3>Bipartisan Cooperation</h3>
              <div className="metric-value">{legislativeData.overview.bipartisanCooperation}%</div>
              <div className="metric-subtitle">Cross-party collaboration</div>
            </div>
            <div className="metric-card">
              <h3>Public Confidence</h3>
              <div className="metric-value">{legislativeData.overview.publicConfidence}%</div>
              <div className="metric-subtitle">Citizen trust in Congress</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={activeTab === 'proposals' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('proposals')}
            >
              📋 Proposals
            </button>
            <button 
              className={activeTab === 'parties' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('parties')}
            >
              🎭 Political Parties
            </button>
            <button 
              className={activeTab === 'committees' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('committees')}
            >
              👥 Committees
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'proposals' && (
            <div className="proposals-tab">
              <div className="proposals-list">
                {legislativeData.proposals.map(proposal => (
                  <div key={proposal.id} className="proposal-card">
                    <div className="proposal-header">
                      <div className="proposal-title">
                        <h4>{proposal.title}</h4>
                        <div className="proposal-badges">
                          <span 
                            className="status-badge" 
                            style={{ backgroundColor: getStatusColor(proposal.status) }}
                          >
                            {proposal.status.toUpperCase()}
                          </span>
                          <span 
                            className="urgency-badge" 
                            style={{ backgroundColor: getUrgencyColor(proposal.urgency) }}
                          >
                            {proposal.urgency.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="proposal-sponsor">Sponsored by {proposal.sponsor}</div>
                    </div>
                    
                    <div className="proposal-description">
                      {proposal.description}
                    </div>
                    
                    <div className="proposal-details">
                      <div className="detail-item">
                        <span>Committee:</span>
                        <span>{proposal.committee}</span>
                      </div>
                      <div className="detail-item">
                        <span>Public Support:</span>
                        <span>{proposal.publicSupport}%</span>
                      </div>
                      {proposal.voteResult && (
                        <div className="detail-item">
                          <span>Vote Result:</span>
                          <span 
                            style={{ 
                              color: proposal.voteResult === 'passed' ? '#4CAF50' : 
                                    proposal.voteResult === 'failed' ? '#F44336' : '#FF9800'
                            }}
                          >
                            {proposal.voteResult.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'parties' && (
            <div className="parties-tab">
              <div className="parties-list">
                {legislativeData.parties.map(party => (
                  <div key={party.id} className="party-card">
                    <div className="party-header">
                      <div className="party-info">
                        <h4 style={{ color: party.color }}>{party.name} ({party.abbreviation})</h4>
                        <div className="party-leader">Leader: {party.leader}</div>
                        <div className="party-ideology">{party.ideology}</div>
                      </div>
                      <div className="party-stats">
                        <div className="stat-item">
                          <span className="stat-value">{party.seats}</span>
                          <span className="stat-label">Seats</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{party.percentage}%</span>
                          <span className="stat-label">Share</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{party.approval}%</span>
                          <span className="stat-label">Approval</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="party-focus">
                      <strong>Policy Focus:</strong>
                      <div className="focus-tags">
                        {party.focus.map((focus, index) => (
                          <span key={index} className="focus-tag" style={{ borderColor: party.color }}>
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'committees' && (
            <div className="committees-tab">
              <div className="committees-list">
                {legislativeData.committees.map(committee => (
                  <div key={committee.id} className="committee-card">
                    <div className="committee-header">
                      <h4>{committee.name}</h4>
                      <div className="committee-chair">Chair: {committee.chair}</div>
                    </div>
                    
                    <div className="committee-jurisdiction">
                      <strong>Jurisdiction:</strong>
                      <div className="jurisdiction-tags">
                        {committee.jurisdiction.map((area, index) => (
                          <span key={index} className="jurisdiction-tag">{area}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="committee-stats">
                      <div className="committee-stat">
                        <span className="stat-value">{committee.members}</span>
                        <span className="stat-label">Members</span>
                      </div>
                      <div className="committee-stat">
                        <span className="stat-value">{committee.meetings}</span>
                        <span className="stat-label">Meetings</span>
                      </div>
                      <div className="committee-stat">
                        <span className="stat-value">{committee.billsReviewed}</span>
                        <span className="stat-label">Bills Reviewed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Activity */}
        <div className="session-activity">
          <h3>📊 Legislative Activity</h3>
          <div className="activity-grid">
            <div className="activity-card">
              <div className="activity-value">{legislativeData.sessions.regular}</div>
              <div className="activity-label">Regular Sessions</div>
            </div>
            <div className="activity-card">
              <div className="activity-value">{legislativeData.sessions.special}</div>
              <div className="activity-label">Special Sessions</div>
            </div>
            <div className="activity-card">
              <div className="activity-value">{legislativeData.sessions.committee}</div>
              <div className="activity-label">Committee Meetings</div>
            </div>
            <div className="activity-card">
              <div className="activity-value">{legislativeData.sessions.publicHearings}</div>
              <div className="activity-label">Public Hearings</div>
            </div>
          </div>
        </div>

        {/* Interaction Metrics */}
        <div className="interaction-metrics">
          <h3>🤝 Executive-Legislative Interaction</h3>
          <div className="interaction-grid">
            <div className="interaction-item">
              <span>Consultations</span>
              <span className="interaction-value">{legislativeData.interactions.consultations}</span>
            </div>
            <div className="interaction-item">
              <span>Modifications</span>
              <span className="interaction-value">{legislativeData.interactions.modifications}</span>
            </div>
            <div className="interaction-item">
              <span>Compromises</span>
              <span className="interaction-value">{legislativeData.interactions.compromises}</span>
            </div>
            <div className="interaction-item">
              <span>Agreements</span>
              <span className="interaction-value">{legislativeData.interactions.agreements}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <h4>ℹ️ Executive Override Powers</h4>
          <p>
            Executive override of legislative decisions is handled through the dedicated 
            <strong> ⚖️ Override System</strong> in the Government section. This ensures 
            proper separation of powers and constitutional review of all override actions.
          </p>
        </div>
      </div>
    </BaseScreen>
  );
};

export default LegislativeScreen;
