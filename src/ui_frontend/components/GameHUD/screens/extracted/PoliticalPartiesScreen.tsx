import React, { useState, useEffect } from 'react';
import './PoliticalPartiesScreen.css';

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

  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'coalitions' | 'electoral' | 'policy' | 'witter'>('overview');
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
              trend: 'up'
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
    <div className="overview-grid">
      <div className="panel">
        <h2>🏛️ Party Landscape</h2>
        <div className="metric">
          <span>Active Parties</span>
          <span className="metric-value">{politicalData.metrics.activeParties}</span>
        </div>
        <div className="metric">
          <span>Active Coalitions</span>
          <span className="metric-value">{politicalData.metrics.activeCoalitions}</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <strong>{party.name}</strong><br />
            <small>{party.leader} • {party.support}% support {getTrendIcon(party.trend)}</small>
            <span className={`metric-value ${getSupportClass(party.support)}`}>{party.handle}</span>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('View Party Profiles')}>Party Profiles</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Party Demographics')}>Demographics</button>
        </div>
      </div>

      <div className="panel">
        <h2>📊 Electoral Performance</h2>
        <div className="metric">
          <span>Last Election (2156)</span>
          <span className="metric-value">{politicalData.metrics.totalSeats} Seats</span>
        </div>
        <div className="metric">
          <span>Voter Turnout</span>
          <span className="metric-value">{politicalData.metrics.voterTurnout}%</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong><br />
              <small>{party.seats} seats won</small>
            </div>
            <span className={`metric-value ${getSupportClass(party.support)}`}>{party.voteShare}%</span>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Electoral Trends')}>Electoral Trends</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Demographic Analysis')}>Demographic Analysis</button>
        </div>
      </div>

      <div className="panel">
        <h2>🤝 Political Coalitions</h2>
        <div className="metric">
          <span>Active Coalitions</span>
          <span className="metric-value">{politicalData.coalitions.length}</span>
        </div>
        {politicalData.coalitions.map(coalition => (
          <div key={coalition.id} className={`coalition-item coalition-${coalition.type}`}>
            <div>
              <strong>{coalition.name}</strong><br />
              <small>{coalition.members.join(', ')}</small>
            </div>
            <span className={`metric-value ${getApprovalClass(coalition.approval)}`}>{coalition.approval}%</span>
          </div>
        ))}
        <div className="metric">
          <span>Coalition Effectiveness</span>
          <span className="metric-value approval-good">75%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '75%' }}></div>
        </div>
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Coalition Details')}>Coalition Details</button>
          <button className="btn btn-success" onClick={() => handleAction('Form Coalition')}>Form Coalition</button>
        </div>
      </div>
    </div>
  );

  const renderLeadershipTab = () => (
    <div className="leadership-grid">
      <div className="panel">
        <h2>👥 Party Leadership</h2>
        <div className="metric">
          <span>Average Approval</span>
          <span className={`metric-value ${getApprovalClass(politicalData.metrics.averageApproval)}`}>
            {politicalData.metrics.averageApproval}%
          </span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.leader}</strong><br />
              <small>{party.description}</small>
            </div>
            <span className={`metric-value ${getApprovalClass(party.approval)}`}>{party.approval}%</span>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Leadership Analysis')}>Leadership Analysis</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Approval Trends')}>Approval Trends</button>
        </div>
      </div>

      <div className="panel">
        <h2>📈 Leadership Performance</h2>
        <div className="metric">
          <span>Competitiveness Index</span>
          <span className="metric-value approval-excellent">{politicalData.metrics.competitivenessIndex}/10</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong><br />
              <small>Leadership Style & Effectiveness</small>
            </div>
            <div className="leadership-metrics">
              <span className={`metric-value ${getApprovalClass(party.approval)}`}>{party.approval}%</span>
              <span className="trend-indicator">{getTrendIcon(party.trend)}</span>
            </div>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Leadership Comparison')}>Compare Leaders</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Succession Planning')}>Succession Planning</button>
        </div>
      </div>
    </div>
  );

  const renderCoalitionsTab = () => (
    <div className="coalitions-grid">
      {politicalData.coalitions.map(coalition => (
        <div key={coalition.id} className="panel">
          <h2>🤝 {coalition.name}</h2>
          <div className="metric">
            <span>Type</span>
            <span className="metric-value">{coalition.type.charAt(0).toUpperCase() + coalition.type.slice(1)}</span>
          </div>
          <div className="metric">
            <span>Public Approval</span>
            <span className={`metric-value ${getApprovalClass(coalition.approval)}`}>{coalition.approval}%</span>
          </div>
          <div className="coalition-members">
            <h4>Member Parties:</h4>
            {coalition.members.map((member, index) => (
              <div key={index} className="member-item">
                <span>{member}</span>
              </div>
            ))}
          </div>
          <div className="coalition-description">
            <p>{coalition.description}</p>
          </div>
          <div className="action-buttons">
            <button className="btn" onClick={() => handleAction('Coalition Details', coalition)}>View Details</button>
            <button className="btn btn-secondary" onClick={() => handleAction('Modify Coalition', coalition)}>Modify</button>
          </div>
        </div>
      ))}
      
      <div className="panel">
        <h2>➕ Coalition Management</h2>
        <div className="metric">
          <span>Potential Coalitions</span>
          <span className="metric-value">4</span>
        </div>
        <div className="potential-coalitions">
          <div className="potential-item">
            <strong>Environmental Action Alliance</strong><br />
            <small>Progressive + Centrist • 78% compatibility</small>
          </div>
          <div className="potential-item">
            <strong>Security Coalition</strong><br />
            <small>Conservative + Nationalist • 71% compatibility</small>
          </div>
          <div className="potential-item">
            <strong>Economic Freedom Alliance</strong><br />
            <small>Conservative + Libertarian • 85% compatibility</small>
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn btn-success" onClick={() => handleAction('Form New Coalition')}>Form Coalition</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Coalition Analysis')}>Analysis</button>
        </div>
      </div>
    </div>
  );

  const renderElectoralTab = () => (
    <div className="electoral-grid">
      <div className="panel">
        <h2>🗳️ Electoral System</h2>
        <div className="metric">
          <span>Registered Voters</span>
          <span className="metric-value">847.3M</span>
        </div>
        <div className="metric">
          <span>Voter Turnout (2156)</span>
          <span className="metric-value approval-good">{politicalData.metrics.voterTurnout}%</span>
        </div>
        <div className="metric">
          <span>Electoral Integrity</span>
          <span className="metric-value approval-excellent">9.2/10</span>
        </div>
        <div className="metric">
          <span>Competitiveness</span>
          <span className="metric-value approval-excellent">{politicalData.metrics.competitivenessIndex}/10</span>
        </div>
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Electoral Oversight')}>Electoral Oversight</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Voting Analysis')}>Voting Analysis</button>
        </div>
      </div>

      <div className="panel">
        <h2>📊 Seat Distribution</h2>
        <div className="metric">
          <span>Total Seats</span>
          <span className="metric-value">{politicalData.metrics.totalSeats}</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong><br />
              <small>{party.seats} seats ({((party.seats / politicalData.metrics.totalSeats) * 100).toFixed(1)}%)</small>
            </div>
            <div className="seat-bar">
              <div 
                className={`seat-fill party-${party.type}`} 
                style={{ width: `${(party.seats / politicalData.metrics.totalSeats) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Redistricting Analysis')}>Redistricting</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Representation Quality')}>Representation</button>
        </div>
      </div>
    </div>
  );

  const renderPolicyTab = () => (
    <div className="policy-grid">
      <div className="panel">
        <h2>📋 Policy Positions</h2>
        <div className="metric">
          <span>Policy Areas Tracked</span>
          <span className="metric-value">5</span>
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
        <div className="metric">
          <span>Position Flexibility</span>
          <span className="metric-value approval-fair">65%</span>
        </div>
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Policy Comparison')}>Policy Comparison</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Position Evolution')}>Position Evolution</button>
        </div>
      </div>

      <div className="panel">
        <h2>🎯 Policy Influence</h2>
        <div className="metric">
          <span>Legislative Success Rate</span>
          <span className="metric-value approval-fair">62%</span>
        </div>
        {politicalData.parties.map(party => (
          <div key={party.id} className={`party-item party-${party.type}`}>
            <div>
              <strong>{party.name}</strong><br />
              <small>Policy influence and legislative effectiveness</small>
            </div>
            <span className={`metric-value ${getSupportClass(party.support)}`}>
              {Math.round(party.support * 2)}%
            </span>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Policy Impact Analysis')}>Impact Analysis</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Legislative Tracking')}>Legislative Tracking</button>
        </div>
      </div>
    </div>
  );

  const renderWitterTab = () => (
    <div className="witter-grid">
      <div className="panel">
        <h2>📱 Political Witter Feed</h2>
        <div className="metric">
          <span>Recent Political Posts</span>
          <span className="metric-value">{politicalData.witterPosts.length}</span>
        </div>
        <div className="metric">
          <span>Average Engagement</span>
          <span className="metric-value approval-good">8.3%</span>
        </div>
        {politicalData.witterPosts.map(post => (
          <div key={post.id} className={`witter-post witter-${post.type}`}>
            <strong>{post.handle}</strong> • {post.time}<br />
            <small>{post.content}</small>
          </div>
        ))}
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Full Witter Feed')}>Full Feed</button>
          <button className="btn btn-success" onClick={() => handleAction('Create Rapid Response')}>Rapid Response</button>
        </div>
      </div>

      <div className="panel">
        <h2>📊 Witter Analytics</h2>
        <div className="metric">
          <span>Total Political Posts</span>
          <span className="metric-value">2,847</span>
        </div>
        <div className="metric">
          <span>Hashtag Reach</span>
          <span className="metric-value">12.4M</span>
        </div>
        <div className="metric">
          <span>Response Time</span>
          <span className="metric-value approval-excellent">18 min</span>
        </div>
        <div className="metric">
          <span>Fact-Based Content</span>
          <span className="metric-value approval-good">72%</span>
        </div>
        <div className="trending-hashtags">
          <h4>Trending Hashtags:</h4>
          <div className="hashtag">#InvestInOurFuture</div>
          <div className="hashtag">#FiscalResponsibility</div>
          <div className="hashtag">#BipartisanSuccess</div>
          <div className="hashtag">#FreeMarkets</div>
          <div className="hashtag">#CivilizationFirst</div>
        </div>
        <div className="action-buttons">
          <button className="btn" onClick={() => handleAction('Witter Analytics')}>Full Analytics</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Sentiment Analysis')}>Sentiment Analysis</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="political-parties-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏛️ Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leadership' ? 'active' : ''}`}
          onClick={() => setActiveTab('leadership')}
        >
          👥 Leadership
        </button>
        <button 
          className={`tab-btn ${activeTab === 'coalitions' ? 'active' : ''}`}
          onClick={() => setActiveTab('coalitions')}
        >
          🤝 Coalitions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'electoral' ? 'active' : ''}`}
          onClick={() => setActiveTab('electoral')}
        >
          🗳️ Electoral
        </button>
        <button 
          className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
          onClick={() => setActiveTab('policy')}
        >
          📋 Policy
        </button>
        <button 
          className={`tab-btn ${activeTab === 'witter' ? 'active' : ''}`}
          onClick={() => setActiveTab('witter')}
        >
          📱 Witter
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'leadership' && renderLeadershipTab()}
        {activeTab === 'coalitions' && renderCoalitionsTab()}
        {activeTab === 'electoral' && renderElectoralTab()}
        {activeTab === 'policy' && renderPolicyTab()}
        {activeTab === 'witter' && renderWitterTab()}
      </div>
    </div>
  );
};

export default PoliticalPartiesScreen;
