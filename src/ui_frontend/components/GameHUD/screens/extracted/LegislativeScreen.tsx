import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './LegislativeScreen.css';
import '../shared/StandardDesign.css';

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

// Render functions for each tab
const renderProposalsTab = (legislativeData: LegislativeData) => (
  <>
          <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Legislative Proposals</h3>
        <div className="standard-table-container">
        <table className="standard-data-table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Sponsor</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Committee</th>
            <th>Support</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {legislativeData.proposals.map(proposal => (
            <tr key={proposal.id}>
              <td>
                <strong>{proposal.title}</strong>
                <br />
                <small style={{ color: '#a0a9ba' }}>{proposal.description}</small>
              </td>
              <td>{proposal.sponsor}</td>
              <td>
                <span 
                  style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: getStatusColor(proposal.status),
                    color: 'white'
                  }}
                >
                  {proposal.status.toUpperCase()}
                </span>
              </td>
              <td>
                <span 
                  style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: getUrgencyColor(proposal.urgency),
                    color: 'white'
                  }}
                >
                  {proposal.urgency.toUpperCase()}
                </span>
              </td>
              <td>{proposal.committee}</td>
              <td style={{ textAlign: 'center' }}>{proposal.publicSupport}%</td>
              <td style={{ textAlign: 'center' }}>
                <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  </>
);

const renderPartiesTab = (legislativeData: LegislativeData) => (
  <>
    {/* Party Legislative Activity Overview */}
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📊 Party Legislative Activity</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="standard-metric">
          <span>Bills Sponsored</span>
          <span className="standard-metric-value">47</span>
        </div>
        <div className="standard-metric">
          <span>Bills Passed</span>
          <span className="standard-metric-value">23</span>
        </div>
        <div className="standard-metric">
          <span>Voting Participation</span>
          <span className="standard-metric-value approval-good">94%</span>
        </div>
        <div className="standard-metric">
          <span>Bipartisan Votes</span>
          <span className="standard-metric-value approval-good">67%</span>
        </div>
      </div>
      <div className="standard-action-buttons">
        <button className="standard-btn government-theme" onClick={() => handleAction('Legislative Analysis')}>Legislative Analysis</button>
        <button className="standard-btn government-theme" onClick={() => handleAction('Voting Patterns')}>Voting Patterns</button>
      </div>
    </div>

    {/* Party Positions on Current Legislation */}
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Party Positions on Current Legislation</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Bill</th>
              <th>Progressive Alliance</th>
              <th>Conservative Coalition</th>
              <th>Centrist Union</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Infrastructure Investment Act</strong><br />
                <small>Comprehensive infrastructure modernization</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 42/45</small>
              </td>
              <td>
                <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>❌ Oppose</span><br />
                <small>Votes: 8/132</small>
              </td>
              <td>
                <span style={{ color: '#ffd43b', fontWeight: 'bold' }}>🤝 Neutral</span><br />
                <small>Votes: 35/68</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#ffd43b',
                  color: 'black'
                }}>
                  In Committee
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Digital Privacy Protection Act</strong><br />
                <small>Enhanced digital privacy rights</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 45/45</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 125/132</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 68/68</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#51cf66',
                  color: 'white'
                }}>
                  Passed
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Healthcare Access Expansion</strong><br />
                <small>Expanded healthcare coverage</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 44/45</small>
              </td>
              <td>
                <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>❌ Oppose</span><br />
                <small>Votes: 15/132</small>
              </td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>✅ Support</span><br />
                <small>Votes: 52/68</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#4facfe',
                  color: 'white'
                }}>
                  Leader Review
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Party Voting Records */}
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🗳️ Party Voting Records</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Party</th>
              <th>Leader</th>
              <th>Seats</th>
              <th>Bills Sponsored</th>
              <th>Bills Passed</th>
              <th>Vote Participation</th>
              <th>Bipartisan Votes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {legislativeData.parties.map(party => (
              <tr key={party.id}>
                <td>
                  <strong style={{ color: party.color }}>{party.name}</strong>
                  <br />
                  <small style={{ color: '#a0a9ba' }}>{party.abbreviation} - {party.ideology}</small>
                </td>
                <td>{party.leader}</td>
                <td style={{ textAlign: 'center' }}>{party.seats}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="standard-metric-value">{Math.floor(Math.random() * 15) + 8}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="standard-metric-value approval-good">{Math.floor(Math.random() * 8) + 3}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="standard-metric-value approval-good">{Math.floor(Math.random() * 10) + 85}%</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="standard-metric-value approval-good">{Math.floor(Math.random() * 20) + 60}%</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Voting Record
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const renderCommitteesTab = (legislativeData: LegislativeData) => (
  <>
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👥 Legislative Committees</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
        <thead>
          <tr>
            <th>Committee</th>
            <th>Chair</th>
            <th>Members</th>
            <th>Meetings</th>
            <th>Bills Reviewed</th>
            <th>Jurisdiction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {legislativeData.committees.map(committee => (
            <tr key={committee.id}>
              <td>
                <strong>{committee.name}</strong>
              </td>
              <td>{committee.chair}</td>
              <td style={{ textAlign: 'center' }}>{committee.members}</td>
              <td style={{ textAlign: 'center' }}>{committee.meetings}</td>
              <td style={{ textAlign: 'center' }}>{committee.billsReviewed}</td>
              <td>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {committee.jurisdiction.map((area, index) => (
                    <span 
                      key={index}
                      style={{ 
                        padding: '0.2rem 0.4rem',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        color: '#4facfe'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
  </>
);

const renderLawsTab = (legislativeData: LegislativeData) => (
  <>
    {/* Laws Overview */}
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>⚖️ Enacted Laws Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="standard-metric">
          <span>Total Laws Enacted</span>
          <span className="standard-metric-value">156</span>
        </div>
        <div className="standard-metric">
          <span>This Session</span>
          <span className="standard-metric-value">23</span>
        </div>
        <div className="standard-metric">
          <span>Bipartisan Laws</span>
          <span className="standard-metric-value approval-good">67%</span>
        </div>
        <div className="standard-metric">
          <span>Public Approval</span>
          <span className="standard-metric-value approval-good">78%</span>
        </div>
      </div>
      <div className="standard-action-buttons">
        <button className="standard-btn government-theme" onClick={() => handleAction('Legal Analysis')}>Legal Analysis</button>
        <button className="standard-btn government-theme" onClick={() => handleAction('Impact Assessment')}>Impact Assessment</button>
      </div>
    </div>

    {/* Enacted Laws Table */}
    <div className="standard-panel government-theme table-panel">
      <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Recently Enacted Laws</h3>
      <div className="standard-table-container">
        <table className="standard-data-table">
          <thead>
            <tr>
              <th>Law</th>
              <th>Category</th>
              <th>Enacted Date</th>
              <th>Sponsor</th>
              <th>Vote Margin</th>
              <th>Public Support</th>
              <th>Implementation Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Digital Privacy Protection Act</strong><br />
                <small>Enhanced digital privacy rights and data protection</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#4facfe',
                  color: 'white'
                }}>
                  Technology
                </span>
              </td>
              <td>2024-11-15</td>
              <td>Rep. James Chen</td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>238-45</span><br />
                <small>Bipartisan</small>
              </td>
              <td>
                <span className="standard-metric-value approval-good">92%</span>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#51cf66',
                  color: 'white'
                }}>
                  Active
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Infrastructure Modernization Act</strong><br />
                <small>Comprehensive infrastructure investment and modernization</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#ffd43b',
                  color: 'black'
                }}>
                  Infrastructure
                </span>
              </td>
              <td>2024-10-28</td>
              <td>Sen. Maria Rodriguez</td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>185-160</span><br />
                <small>Partisan</small>
              </td>
              <td>
                <span className="standard-metric-value approval-good">78%</span>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#4facfe',
                  color: 'white'
                }}>
                  Planning
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Healthcare Access Expansion</strong><br />
                <small>Expanded healthcare coverage for underserved populations</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#ff6b6b',
                  color: 'white'
                }}>
                  Healthcare
                </span>
              </td>
              <td>2024-09-12</td>
              <td>Sen. Sarah Johnson</td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>201-144</span><br />
                <small>Bipartisan</small>
              </td>
              <td>
                <span className="standard-metric-value approval-good">85%</span>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#51cf66',
                  color: 'white'
                }}>
                  Active
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Environmental Protection Enhancement</strong><br />
                <small>Strengthened environmental regulations and protections</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#51cf66',
                  color: 'white'
                }}>
                  Environment
                </span>
              </td>
              <td>2024-08-05</td>
              <td>Rep. Elena Vasquez</td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>195-150</span><br />
                <small>Bipartisan</small>
              </td>
              <td>
                <span className="standard-metric-value approval-good">88%</span>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#51cf66',
                  color: 'white'
                }}>
                  Active
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Economic Recovery Stimulus</strong><br />
                <small>Economic stimulus package for post-crisis recovery</small>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#ffd43b',
                  color: 'black'
                }}>
                  Economy
                </span>
              </td>
              <td>2024-07-18</td>
              <td>Sen. Michael Thompson</td>
              <td>
                <span style={{ color: '#51cf66', fontWeight: 'bold' }}>220-125</span><br />
                <small>Bipartisan</small>
              </td>
              <td>
                <span className="standard-metric-value approval-good">82%</span>
              </td>
              <td>
                <span style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: '#868e96',
                  color: 'white'
                }}>
                  Completed
                </span>
              </td>
              <td>
                <button className="standard-btn government-theme">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </>
);

const LegislativeScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [legislativeData, setLegislativeData] = useState<LegislativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'proposals' | 'parties' | 'committees' | 'laws'>('proposals');

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

      // Mock data for now - replace with actual API calls
      const mockData: LegislativeData = {
        overview: {
          pendingProposals: 23,
          leaderApprovalRate: 67,
          productivity: 78,
          bipartisanCooperation: 65,
          publicConfidence: 72
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
            id: 'progressive',
            name: 'Progressive Alliance',
            abbreviation: 'PA',
            ideology: 'Progressive',
            leader: 'Elena Vasquez',
            seats: 145,
            percentage: 42,
            approval: 68,
            focus: ['Social Justice', 'Climate Action', 'Economic Equality'],
            color: '#2196F3'
          },
          {
            id: 'conservative',
            name: 'Conservative Coalition',
            abbreviation: 'CC',
            ideology: 'Conservative',
            leader: 'Marcus Thompson',
            seats: 132,
            percentage: 38,
            approval: 71,
            focus: ['Fiscal Responsibility', 'Traditional Values', 'Strong Defense'],
            color: '#F44336'
          },
          {
            id: 'centrist',
            name: 'Centrist Union',
            abbreviation: 'CU',
            ideology: 'Centrist',
            leader: 'Dr. Aisha Patel',
            seats: 68,
            percentage: 20,
            approval: 74,
            focus: ['Pragmatic Solutions', 'Bipartisan Cooperation', 'Evidence-Based Policy'],
            color: '#4CAF50'
          }
        ],
        committees: [
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

  // Define tabs for the header
  const tabs: TabConfig[] = [
    { id: 'proposals', label: 'Proposals', icon: '📋' },
    { id: 'parties', label: 'Parties', icon: '🎭' },
    { id: 'committees', label: 'Committees', icon: '👥' },
    { id: 'laws', label: 'Laws', icon: '⚖️' }
  ];

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={endpoints}
      onRefresh={loadData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'proposals' | 'parties' | 'committees' | 'laws')}
    >
      <div className="standard-screen-container government-theme">
        {loading && <div className="loading-overlay">Loading Legislative data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {/* Legislative Overview - First card in 2-column grid */}
          <div className="standard-panel government-theme">
            <div className="standard-metric">
              <span>Pending Proposals</span>
              <span className="standard-metric-value">{legislativeData.overview.pendingProposals}</span>
            </div>
            <div className="standard-metric">
              <span>Leader Approval Rate</span>
              <span className="standard-metric-value">{legislativeData.overview.leaderApprovalRate}%</span>
            </div>
            <div className="standard-metric">
              <span>Productivity</span>
              <span className={`standard-metric-value ${getProductivityClass(legislativeData.overview.productivity)}`}>
                {legislativeData.overview.productivity}/100
              </span>
            </div>
            <div className="standard-metric">
              <span>Bipartisan Cooperation</span>
              <span className="standard-metric-value">{legislativeData.overview.bipartisanCooperation}/100</span>
            </div>
            <div className="standard-metric">
              <span>Public Confidence</span>
              <span className="standard-metric-value">{legislativeData.overview.publicConfidence}%</span>
            </div>
            <div className="standard-action-buttons">
              <button className="standard-btn government-theme">Legislative Report</button>
              <button className="standard-btn government-theme">Performance Review</button>
            </div>
          </div>



          {/* Tab Content - Full width below cards */}
          {(() => {
            switch (activeTab) {
              case 'proposals':
                return renderProposalsTab(legislativeData);
              case 'parties':
                return renderPartiesTab(legislativeData);
              case 'committees':
                return renderCommitteesTab(legislativeData);
              case 'laws':
                return renderLawsTab(legislativeData);
              default:
                return renderProposalsTab(legislativeData);
            }
          })()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default LegislativeScreen;