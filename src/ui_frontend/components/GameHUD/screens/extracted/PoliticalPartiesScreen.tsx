import React, { useState, useEffect } from 'react';
import './PoliticalPartiesScreen.css';
import { BaseScreen } from '../BaseScreen';
import { TabConfig } from '../BaseScreen';

interface PoliticalPartiesScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface Party {
  id: string;
  name: string;
  leader: string;
  support: number;
  approval: number;
  type: 'progressive' | 'conservative' | 'centrist' | 'libertarian' | 'nationalist';
  handle: string;
  description: string;
  seats: number;
  voteShare: number;
  trend: 'up' | 'down' | 'stable';
  
  // Electoral data
  electoralHistory?: ElectionResult[];
  campaignPromises?: CampaignPromise[];
  currentCampaign?: CampaignData;
}

interface ElectionResult {
  electionId: string;
  electionType: string;
  date: string;
  votes: number;
  percentage: number;
  seats?: number;
  result: 'won' | 'lost' | 'coalition';
}

interface CampaignPromise {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implemented?: boolean;
  popularityBoost: number;
}

interface CampaignData {
  electionId: string;
  electionType: string;
  daysUntilElection: number;
  campaignStatus: 'scheduled' | 'active' | 'completed';
  recentActivities: CampaignActivity[];
  currentPolling: number;
  pollingTrend: 'rising' | 'falling' | 'stable';
}

interface CampaignActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  mediaAttention: number;
}

interface Coalition {
  id: string;
  name: string;
  members: string[];
  approval: number;
  type: 'governing' | 'opposition' | 'issue';
  description: string;
}

interface WitterPost {
  id: string;
  party: string;
  handle: string;
  content: string;
  time: string;
  type: 'progressive' | 'conservative' | 'centrist' | 'libertarian' | 'nationalist';
}

const PoliticalPartiesScreen: React.FC<PoliticalPartiesScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [politicalData, setPoliticalData] = useState<{
    parties: Party[];
    coalitions: Coalition[];
    witterPosts: WitterPost[];
    metrics: {
      activeParties: number;
      activeCoalitions: number;
      averageApproval: number;
      totalSeats: number;
      voterTurnout: number;
      competitivenessIndex: number;
    };
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'coalitions' | 'electoral' | 'campaigns' | 'policy' | 'witter'>('overview');

  // Define tabs for Political Parties
  const politicalPartiesTabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'leadership', label: 'Leadership', icon: '👥' },
    { id: 'coalitions', label: 'Coalitions', icon: '🤝' },
    { id: 'electoral', label: 'Electoral', icon: '🗳️' },
    { id: 'campaigns', label: 'Campaigns', icon: '📢' },
    { id: 'policy', label: 'Policy', icon: '📋' },
    { id: 'witter', label: 'Witter', icon: '📱' }
  ];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoliticalData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/political-parties/enhanced');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        setPoliticalData(data);
      } catch (err) {
        console.warn('Political Parties API not available, using mock data');
        // Use comprehensive mock data
        setPoliticalData({
          parties: [
            {
              id: 'conservative',
              name: 'Conservative Coalition',
              leader: 'Admiral James Morrison',
              support: 31.2,
              approval: 72.8,
              type: 'conservative',
              handle: '@ConservativeCoalition',
              description: 'Technocratic Leader • Fiscal responsibility, traditional values, strong defense',
              seats: 58,
              voteShare: 31.2,
              trend: 'up',
              electoralHistory: [
                { electionId: 'election_2023', electionType: 'legislative', date: '2023-11-15', votes: 1560000, percentage: 31.2, seats: 58, result: 'won' },
                { electionId: 'election_2021', electionType: 'legislative', date: '2021-11-15', votes: 1420000, percentage: 28.4, seats: 52, result: 'lost' }
              ],
              campaignPromises: [
                { id: 'cp1', category: 'economy', title: 'Reduce Corporate Tax Rate', description: 'Lower corporate taxes to 15% to stimulate business growth', priority: 'high', implemented: true, popularityBoost: 2.1 },
                { id: 'cp2', category: 'security', title: 'Strengthen Border Defense', description: 'Increase military presence at territorial borders', priority: 'high', implemented: false, popularityBoost: 1.8 }
              ],
              currentCampaign: {
                electionId: 'election_2025',
                electionType: 'legislative',
                daysUntilElection: 180,
                campaignStatus: 'active',
                recentActivities: [
                  { id: 'act1', type: 'rally', title: 'Economic Growth Rally', description: 'Major rally focusing on job creation and fiscal responsibility', date: '2024-12-01', location: 'Capital Plaza', mediaAttention: 85 }
                ],
                currentPolling: 33.1,
                pollingTrend: 'rising'
              }
            },
            {
              id: 'progressive',
              name: 'Progressive Alliance',
              leader: 'Dr. Elena Vasquez',
              support: 28.3,
              approval: 85.2,
              type: 'progressive',
              handle: '@ProgressiveAlliance',
              description: 'Charismatic Leader • Social justice, environmental sustainability, economic equality',
              seats: 52,
              voteShare: 28.3,
              trend: 'stable'
            },
            {
              id: 'centrist',
              name: 'Centrist Party',
              leader: 'Dr. Michael Rodriguez',
              support: 22.8,
              approval: 78.9,
              type: 'centrist',
              handle: '@CentristParty',
              description: 'Moderate Leader • Evidence-based policy, bipartisan cooperation',
              seats: 42,
              voteShare: 22.8,
              trend: 'up'
            },
            {
              id: 'libertarian',
              name: 'Libertarian Movement',
              leader: 'Dr. Rachel Freeman',
              support: 12.4,
              approval: 68.5,
              type: 'libertarian',
              handle: '@LibertarianMovement',
              description: 'Populist Leader • Constitutional rights, economic freedom, civil liberties',
              seats: 23,
              voteShare: 12.4,
              trend: 'up'
            },
            {
              id: 'nationalist',
              name: 'Nationalist Party',
              leader: 'General Patricia Stone',
              support: 5.3,
              approval: 61.3,
              type: 'nationalist',
              handle: '@NationalistParty',
              description: 'Charismatic Leader • National security, cultural policy, economic sovereignty',
              seats: 10,
              voteShare: 5.3,
              trend: 'down'
            }
          ],
          coalitions: [
            {
              id: 'infrastructure',
              name: 'Infrastructure Development Coalition',
              members: ['Progressive Alliance', 'Centrist Party', 'Nationalist Party'],
              approval: 68.5,
              type: 'issue',
              description: 'Support Interstellar Infrastructure Investment Act with job creation and environmental standards'
            },
            {
              id: 'fiscal',
              name: 'Fiscal Responsibility Alliance',
              members: ['Conservative Coalition', 'Libertarian Movement'],
              approval: 42.8,
              type: 'opposition',
              description: 'Oppose large government spending programs, promote fiscal discipline'
            }
          ],
          witterPosts: [
            {
              id: '1',
              party: 'Progressive Alliance',
              handle: '@ProgressiveAlliance',
              content: 'The Infrastructure Investment Act represents exactly the kind of bold, forward-thinking policy our civilization needs. 500 billion credits invested in our future means jobs, sustainability, and prosperity for all. #InvestInOurFuture #ProgressiveValues',
              time: '2h',
              type: 'progressive'
            },
            {
              id: '2',
              party: 'Conservative Coalition',
              handle: '@ConservativeCoalition',
              content: 'While we support infrastructure development, we must ensure fiscal responsibility. The proposed 500 billion credit program needs careful oversight and phased implementation to protect taxpayers. #FiscalResponsibility #SmartSpending',
              time: '3h',
              type: 'conservative'
            },
            {
              id: '3',
              party: 'Centrist Party',
              handle: '@CentristParty',
              content: 'The Infrastructure Investment Act shows what we can achieve through bipartisan cooperation. We worked with all parties to create a balanced approach that invests in our future while maintaining fiscal discipline. #BipartisanSuccess #EvidenceBasedPolicy',
              time: '4h',
              type: 'centrist'
            },
            {
              id: '4',
              party: 'Libertarian Movement',
              handle: '@LibertarianMovement',
              content: 'Government infrastructure spending crowds out private investment and increases debt burden on citizens. Market-based solutions would deliver better results at lower cost with greater efficiency. #FreeMarkets #LimitedGovernment',
              time: '5h',
              type: 'libertarian'
            }
          ],
          metrics: {
            activeParties: 5,
            activeCoalitions: 2,
            averageApproval: 73.3,
            totalSeats: 185,
            voterTurnout: 78.3,
            competitivenessIndex: 8.7
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticalData();
  }, []);

  const getApprovalClass = (approval: number) => {
    if (approval >= 80) return 'approval-excellent';
    if (approval >= 70) return 'approval-good';
    if (approval >= 60) return 'approval-fair';
    return 'approval-poor';
  };

  const getSupportClass = (support: number) => {
    if (support >= 25) return 'support-high';
    if (support >= 15) return 'support-medium';
    return 'support-low';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getPartyTypeColor = (type: string) => {
    switch (type) {
      case 'progressive': return '#4facfe';
      case 'conservative': return '#ff6b6b';
      case 'centrist': return '#51cf66';
      case 'libertarian': return '#ffd43b';
      case 'nationalist': return '#ae3ec9';
      default: return '#868e96';
    }
  };

  const handleAction = (action: string, context?: any) => {
    console.log(`Political Parties Action: ${action}`, context);
    alert(`Political Parties System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  if (loading) {
    return (
      <div className="political-parties-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading political party data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="political-parties-screen">
        <div className="error-state">
          <h3>⚠️ Error Loading Political Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!politicalData) {
    return (
      <div className="political-parties-screen">
        <div className="no-data-state">
          <h3>📊 No Political Data Available</h3>
          <p>Political party information is currently unavailable.</p>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="standard-dashboard">
      {/* Political Parties Overview - Full width card */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🏛️ Political Parties Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="standard-metric">
            <span>Active Parties</span>
            <span className="standard-metric-value">{politicalData.metrics.activeParties}</span>
          </div>
          <div className="standard-metric">
            <span>Total Seats</span>
            <span className="standard-metric-value">{politicalData.metrics.totalSeats}</span>
          </div>
          <div className="standard-metric">
            <span>Average Approval</span>
            <span className={`standard-metric-value ${getApprovalClass(politicalData.metrics.averageApproval)}`}>
              {politicalData.metrics.averageApproval}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Voter Turnout</span>
            <span className="standard-metric-value">{politicalData.metrics.voterTurnout}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Party Analysis')}>Party Analysis</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Electoral Trends')}>Electoral Trends</button>
        </div>
      </div>

      {/* Political Parties Table - Full width */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Political Parties Details</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Party</th>
                <th>Leader</th>
                <th>Type</th>
                <th>Support</th>
                <th>Approval</th>
                <th>Seats</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {politicalData.parties.map(party => (
                <tr key={party.id}>
                  <td>
                    <strong>{party.name}</strong><br />
                    <small>{party.handle}</small>
                  </td>
                  <td>{party.leader}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: getPartyTypeColor(party.type),
                        color: 'white'
                      }}
                    >
                      {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                    </span>
                  </td>
                  <td>{party.support}%</td>
                  <td>
                    <span className={`standard-metric-value ${getApprovalClass(party.approval)}`}>
                      {party.approval}%
                    </span>
                  </td>
                  <td>{party.seats}</td>
                  <td>
                    <span className="trend-indicator">{getTrendIcon(party.trend)}</span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme" onClick={() => handleAction('View Details', party)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLeadershipTab = () => (
    <div className="standard-dashboard">
      {/* Leadership Overview - Full width card */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👥 Party Leadership</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="standard-metric">
            <span>Average Approval</span>
            <span className={`standard-metric-value ${getApprovalClass(politicalData.metrics.averageApproval)}`}>
              {politicalData.metrics.averageApproval}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Competitiveness Index</span>
            <span className="standard-metric-value approval-excellent">{politicalData.metrics.competitivenessIndex}/10</span>
          </div>
          <div className="standard-metric">
            <span>Active Leaders</span>
            <span className="standard-metric-value">{politicalData.parties.length}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Leadership Analysis')}>Leadership Analysis</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Approval Trends')}>Approval Trends</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Leadership Comparison')}>Compare Leaders</button>
        </div>
      </div>

      {/* Leadership Details Table - Full width */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Leadership Details</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Leader</th>
                <th>Party</th>
                <th>Type</th>
                <th>Approval</th>
                <th>Leadership Style</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {politicalData.parties.map(party => (
                <tr key={party.id}>
                  <td>
                    <strong>{party.leader}</strong>
                  </td>
                  <td>{party.name}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: getPartyTypeColor(party.type),
                        color: 'white'
                      }}
                    >
                      {party.type.charAt(0).toUpperCase() + party.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`standard-metric-value ${getApprovalClass(party.approval)}`}>
                      {party.approval}%
                    </span>
                  </td>
                  <td>{party.description}</td>
                  <td>
                    <span className="trend-indicator">{getTrendIcon(party.trend)}</span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme" onClick={() => handleAction('View Leader Details', party)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCoalitionsTab = () => (
    <div className="standard-dashboard">
      {/* Coalitions Overview - Full width card */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🤝 Coalitions Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="standard-metric">
            <span>Active Coalitions</span>
            <span className="standard-metric-value">{politicalData.metrics.activeCoalitions}</span>
          </div>
          <div className="standard-metric">
            <span>Coalition Effectiveness</span>
            <span className="standard-metric-value approval-good">75%</span>
          </div>
          <div className="standard-metric">
            <span>Average Approval</span>
            <span className="standard-metric-value approval-good">
              {Math.round(politicalData.coalitions.reduce((sum, c) => sum + c.approval, 0) / politicalData.coalitions.length)}%
            </span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Coalition Details')}>Coalition Details</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Form Coalition')}>Form Coalition</button>
        </div>
      </div>

      {/* Coalitions Table - Full width */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Coalitions Details</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Coalition</th>
                <th>Type</th>
                <th>Members</th>
                <th>Approval</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {politicalData.coalitions.map(coalition => (
                <tr key={coalition.id}>
                  <td>
                    <strong>{coalition.name}</strong>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: coalition.type === 'governing' ? '#51cf66' : 
                                         coalition.type === 'opposition' ? '#ff6b6b' : '#ffd43b',
                        color: 'white'
                      }}
                    >
                      {coalition.type.charAt(0).toUpperCase() + coalition.type.slice(1)}
                    </span>
                  </td>
                  <td>{coalition.members.join(', ')}</td>
                  <td>
                    <span className={`standard-metric-value ${getApprovalClass(coalition.approval)}`}>
                      {coalition.approval}%
                    </span>
                  </td>
                  <td>{coalition.description}</td>
                  <td>
                    <button className="standard-btn government-theme" onClick={() => handleAction('View Coalition Details', coalition)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderElectoralTab = () => (
    <div className="standard-dashboard">
      {/* Electoral Overview - Full width card */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🗳️ Electoral System</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="standard-metric">
            <span>Registered Voters</span>
            <span className="standard-metric-value">847.3M</span>
          </div>
          <div className="standard-metric">
            <span>Voter Turnout</span>
            <span className="standard-metric-value approval-good">{politicalData.metrics.voterTurnout}%</span>
          </div>
          <div className="standard-metric">
            <span>Next Election</span>
            <span className="standard-metric-value">180 days</span>
          </div>
          <div className="standard-metric">
            <span>Electoral Integrity</span>
            <span className="standard-metric-value approval-excellent">9.2/10</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Electoral Oversight')}>Electoral Oversight</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Voting Analysis')}>Voting Analysis</button>
        </div>
      </div>

      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📊 Current Polling</h3>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong>
              <span className={`trend-indicator ${party.currentCampaign?.pollingTrend || party.trend}`}>
                {party.currentCampaign?.pollingTrend === 'rising' && '📈'}
                {party.currentCampaign?.pollingTrend === 'falling' && '📉'}
                {party.currentCampaign?.pollingTrend === 'stable' && '➡️'}
                {!party.currentCampaign?.pollingTrend && (party.trend === 'up' ? '📈' : party.trend === 'down' ? '📉' : '➡️')}
              </span>
            </div>
            <div className="polling-data">
              <span className="polling-percentage">{party.currentCampaign?.currentPolling?.toFixed(1) || party.support.toFixed(1)}%</span>
              <div className="polling-bar">
                <div 
                  className={`polling-fill party-${party.type}`} 
                  style={{ width: `${party.currentCampaign?.currentPolling || party.support}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        <div className="polling-info">
          <small>📊 Latest poll • Margin of error ±3.2% • Sample: 1,247 voters</small>
        </div>
      </div>

      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🏆 Electoral History</h3>
        {politicalData.parties.filter(party => party.electoralHistory && party.electoralHistory.length > 0).map(party => (
          <div key={party.id} className="electoral-history">
            <h4>{party.name}</h4>
            {party.electoralHistory?.slice(0, 3).map(election => (
              <div key={election.electionId} className="election-result">
                <div className="election-info">
                  <span className="election-date">{new Date(election.date).getFullYear()}</span>
                  <span className="election-type">{election.electionType}</span>
                  <span className={`election-result-badge ${election.result}`}>
                    {election.result === 'won' && '🏆'}
                    {election.result === 'lost' && '🥈'}
                    {election.result === 'coalition' && '🤝'}
                    {election.result}
                  </span>
                </div>
                <div className="election-stats">
                  <span>{election.percentage.toFixed(1)}%</span>
                  {election.seats && <span>{election.seats} seats</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="standard-dashboard">
      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📢 Active Campaigns</h3>
        <div className="campaign-status">
          <div className="status-indicator active">
            <span className="status-dot"></span>
            <span>Campaign Season Active</span>
          </div>
          <div className="days-remaining">
            <span className="countdown">180</span>
            <span>days until election</span>
          </div>
        </div>
        
        {politicalData.parties.filter(party => party.currentCampaign).map(party => (
          <div key={party.id} className={`campaign-card party-${party.type}`}>
            <div className="campaign-header">
              <h4>{party.name}</h4>
              <span className={`campaign-status-badge ${party.currentCampaign?.campaignStatus}`}>
                {party.currentCampaign?.campaignStatus}
              </span>
            </div>
            
            <div className="campaign-metrics">
              <div className="metric-item">
                <span className="metric-label">Current Polling</span>
                <span className="metric-value">{party.currentCampaign?.currentPolling?.toFixed(1)}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Trend</span>
                <span className={`metric-value trend-${party.currentCampaign?.pollingTrend}`}>
                  {party.currentCampaign?.pollingTrend}
                  {party.currentCampaign?.pollingTrend === 'rising' && ' 📈'}
                  {party.currentCampaign?.pollingTrend === 'falling' && ' 📉'}
                  {party.currentCampaign?.pollingTrend === 'stable' && ' ➡️'}
                </span>
              </div>
            </div>

            {party.currentCampaign?.recentActivities && party.currentCampaign.recentActivities.length > 0 && (
              <div className="recent-activities">
                <h5>Recent Activities</h5>
                {party.currentCampaign.recentActivities.slice(0, 2).map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-header">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="activity-title">{activity.title}</div>
                    {activity.location && <div className="activity-location">📍 {activity.location}</div>}
                    <div className="activity-attention">
                      <span>Media Attention: {activity.mediaAttention}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🎯 Campaign Promises</h3>
        {politicalData.parties.filter(party => party.campaignPromises && party.campaignPromises.length > 0).map(party => (
          <div key={party.id} className="promises-section">
            <h4>{party.name}</h4>
            <div className="promises-list">
              {party.campaignPromises?.slice(0, 3).map(promise => (
                <div key={promise.id} className={`promise-item priority-${promise.priority}`}>
                  <div className="promise-header">
                    <span className="promise-category">{promise.category}</span>
                    <span className={`promise-priority ${promise.priority}`}>
                      {promise.priority === 'high' && '🔥'}
                      {promise.priority === 'medium' && '⭐'}
                      {promise.priority === 'low' && '💡'}
                      {promise.priority}
                    </span>
                    {promise.implemented !== undefined && (
                      <span className={`implementation-status ${promise.implemented ? 'implemented' : 'pending'}`}>
                        {promise.implemented ? '✅ Implemented' : '⏳ Pending'}
                      </span>
                    )}
                  </div>
                  <div className="promise-title">{promise.title}</div>
                  <div className="promise-description">{promise.description}</div>
                  <div className="promise-impact">
                    Popularity Impact: {promise.popularityBoost > 0 ? '+' : ''}{promise.popularityBoost.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📈 Campaign Analytics</h3>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h5>📊 Polling Trends</h5>
            <div className="trend-summary">
              {politicalData.parties.filter(p => p.currentCampaign).map(party => (
                <div key={party.id} className="trend-item">
                  <span className={`party-indicator party-${party.type}`}></span>
                  <span>{party.name}</span>
                  <span className={`trend-value ${party.currentCampaign?.pollingTrend}`}>
                    {party.currentCampaign?.pollingTrend === 'rising' && '+2.1%'}
                    {party.currentCampaign?.pollingTrend === 'falling' && '-1.3%'}
                    {party.currentCampaign?.pollingTrend === 'stable' && '±0.2%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="analytics-card">
            <h5>🎪 Campaign Activity</h5>
            <div className="activity-summary">
              <div className="activity-stat">
                <span className="stat-value">24</span>
                <span className="stat-label">Events This Week</span>
              </div>
              <div className="activity-stat">
                <span className="stat-value">89%</span>
                <span className="stat-label">Media Coverage</span>
              </div>
              <div className="activity-stat">
                <span className="stat-value">1.2M</span>
                <span className="stat-label">Social Engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicyTab = () => (
    <div className="standard-dashboard">
      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Policy Positions</h3>
        <div className="standard-metric">
          <span>Policy Areas Tracked</span>
          <span className="standard-metric-value">5</span>
        </div>
        <div className="policy-area">
          <strong>Economic Policy</strong><br />
          <small>Progressive: Progressive taxation (Core) • Conservative: Lower taxes (Core) • Centrist: Balanced approach (Flexible) • Libertarian: Minimal taxation (Core) • Nationalist: Protectionist (Strong)</small>
        </div>
        <div className="policy-area">
          <strong>Social Policy</strong><br />
          <small>Progressive: Universal healthcare (Core) • Conservative: Traditional values (Core) • Centrist: Incremental reform (Flexible) • Libertarian: Individual choice (Core) • Nationalist: Cultural preservation (Core)</small>
        </div>
        <div className="policy-area">
          <strong>Security Policy</strong><br />
          <small>Progressive: Community policing (Strong) • Conservative: Strong military (Core) • Centrist: Balanced defense (Moderate) • Libertarian: Non-interventionism (Core) • Nationalist: Strong borders (Core)</small>
        </div>
        <div className="standard-metric">
          <span>Position Flexibility</span>
          <span className="standard-metric-value approval-fair">65%</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Policy Comparison')}>Policy Comparison</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Position Evolution')}>Position Evolution</button>
        </div>
      </div>

      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🎯 Policy Influence</h3>
        <div className="standard-metric">
          <span>Legislative Success Rate</span>
          <span className="standard-metric-value approval-fair">62%</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong><br />
              <small>Policy influence and legislative effectiveness</small>
            </div>
            <span className={`standard-metric-value ${getSupportClass(party.support)}`}>
              {Math.round(party.support * 2)}%
            </span>
          </div>
        ))}
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Policy Impact Analysis')}>Impact Analysis</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Legislative Tracking')}>Legislative Tracking</button>
        </div>
      </div>
    </div>
  );

  const renderWitterTab = () => (
    <div className="standard-dashboard">
      {/* Witter Overview - Full width card */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📱 Political Witter Feed</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="standard-metric">
            <span>Recent Posts</span>
            <span className="standard-metric-value">{politicalData.witterPosts.length}</span>
          </div>
          <div className="standard-metric">
            <span>Total Posts</span>
            <span className="standard-metric-value">2,847</span>
          </div>
          <div className="standard-metric">
            <span>Hashtag Reach</span>
            <span className="standard-metric-value">12.4M</span>
          </div>
          <div className="standard-metric">
            <span>Response Time</span>
            <span className="standard-metric-value approval-excellent">18 min</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Full Witter Feed')}>Full Feed</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('Create Rapid Response')}>Rapid Response</button>
        </div>
      </div>

      {/* Witter Posts Table - Full width */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Recent Political Posts</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Handle</th>
                <th>Content</th>
                <th>Time</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {politicalData.witterPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.handle}</strong>
                  </td>
                  <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                    {post.content}
                  </td>
                  <td>{post.time}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: getPartyTypeColor(post.type),
                        color: 'white'
                      }}
                    >
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme" onClick={() => handleAction('View Post Details', post)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      tabs={politicalPartiesTabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'leadership' && renderLeadershipTab()}
      {activeTab === 'coalitions' && renderCoalitionsTab()}
      {activeTab === 'electoral' && renderElectoralTab()}
      {activeTab === 'campaigns' && renderCampaignsTab()}
      {activeTab === 'policy' && renderPolicyTab()}
      {activeTab === 'witter' && renderWitterTab()}
    </BaseScreen>
  );
};

export default PoliticalPartiesScreen;
