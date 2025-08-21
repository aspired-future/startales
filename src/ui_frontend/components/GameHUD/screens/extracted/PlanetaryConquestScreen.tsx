import React, { useState, useEffect } from 'react';
import './PlanetaryConquestScreen.css';

interface PlanetaryConquestScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface Campaign {
  id: string;
  name: string;
  targetPlanet: string;
  targetSystem: string;
  status: string;
  progress: number;
  defendingCiv?: string;
  objectives: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
}

interface Discovery {
  id: string;
  name: string;
  system: string;
  status: string;
  habitability: number;
  discoveredBy: string;
  estimatedValue: number;
  resources: {
    minerals: string;
    water: string;
    atmosphere: string;
  };
  threats: string[];
}

interface Merger {
  id: string;
  planet: string;
  system: string;
  type: string;
  integrationStatus: string;
  completionDate: string;
  populationTransfer: {
    original: number;
    satisfaction: number;
  };
  economicImpact: {
    gdpChange: number;
    resourceAccess: string[];
  };
}

interface Integration {
  id: string;
  planetId: string;
  phase: string;
  progress: number;
  timeRemaining: number;
  successProbability: number;
  challenges: string[];
}

interface OverviewData {
  activeCampaigns: number;
  discoveredPlanets: number;
  completedMergers: number;
  activeIntegrations: number;
  integrationMetrics: {
    successRate: number;
    averageIntegrationTime: number;
    populationSatisfaction: number;
    rebellionRisk: number;
  };
  recentActivity: Array<{
    date: string;
    target: string;
    type: string;
    action: string;
  }>;
}

const PlanetaryConquestScreen: React.FC<PlanetaryConquestScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [conquestData, setConquestData] = useState<{
    overview: OverviewData | null;
    campaigns: Campaign[];
    discoveries: Discovery[];
    mergers: Merger[];
    integrations: Integration[];
  }>({
    overview: null,
    campaigns: [],
    discoveries: [],
    mergers: [],
    integrations: []
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'discoveries' | 'mergers' | 'integrations'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  useEffect(() => {
    const fetchConquestData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/conquest/overview');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setConquestData(prev => ({ ...prev, overview: data.data }));
        }
      } catch (err) {
        console.warn('Conquest API not available, using mock data');
        // Use comprehensive mock data
        setConquestData({
          overview: {
            activeCampaigns: 3,
            discoveredPlanets: 12,
            completedMergers: 8,
            activeIntegrations: 5,
            integrationMetrics: {
              successRate: 0.847,
              averageIntegrationTime: 180,
              populationSatisfaction: 0.723,
              rebellionRisk: 0.156
            },
            recentActivity: [
              {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                target: 'Kepler-442b',
                type: 'Campaign',
                action: 'completed successfully'
              },
              {
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                target: 'Wolf-359c',
                type: 'Discovery',
                action: 'surveyed and claimed'
              },
              {
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                target: 'Proxima-b',
                type: 'Integration',
                action: 'phase 3 completed'
              }
            ]
          },
          campaigns: [
            {
              id: 'camp_001',
              name: 'Operation Starfall',
              targetPlanet: 'Trappist-1e',
              targetSystem: 'Trappist-1',
              status: 'active',
              progress: 67,
              defendingCiv: 'Zephyrian Empire',
              objectives: [
                { name: 'Establish orbital superiority', status: 'completed' },
                { name: 'Neutralize planetary defenses', status: 'in-progress' },
                { name: 'Secure strategic locations', status: 'pending' },
                { name: 'Begin population integration', status: 'pending' }
              ]
            },
            {
              id: 'camp_002',
              name: 'Liberation of Gliese-667c',
              targetPlanet: 'Gliese-667c',
              targetSystem: 'Gliese-667',
              status: 'planning',
              progress: 23,
              objectives: [
                { name: 'Intelligence gathering', status: 'in-progress' },
                { name: 'Fleet mobilization', status: 'pending' },
                { name: 'Diplomatic negotiations', status: 'pending' }
              ]
            },
            {
              id: 'camp_003',
              name: 'Peaceful Annexation - HD 40307g',
              targetPlanet: 'HD 40307g',
              targetSystem: 'HD 40307',
              status: 'active',
              progress: 89,
              objectives: [
                { name: 'Cultural exchange programs', status: 'completed' },
                { name: 'Economic integration', status: 'completed' },
                { name: 'Political unification', status: 'in-progress' },
                { name: 'Administrative transition', status: 'pending' }
              ]
            }
          ],
          discoveries: [
            {
              id: 'disc_001',
              name: 'Kepler-186f',
              system: 'Kepler-186',
              status: 'surveyed',
              habitability: 0.82,
              discoveredBy: 'Terran Federation',
              estimatedValue: 2400000,
              resources: {
                minerals: 'Rich (Rare Earth Elements)',
                water: 'Abundant (Polar Ice Caps)',
                atmosphere: 'Breathable (21% O2, 78% N2)'
              },
              threats: ['Hostile Wildlife', 'Extreme Weather Patterns']
            },
            {
              id: 'disc_002',
              name: 'TOI-715b',
              system: 'TOI-715',
              status: 'discovered',
              habitability: 0.64,
              discoveredBy: 'Martian Republic',
              estimatedValue: 1800000,
              resources: {
                minerals: 'Moderate (Iron, Copper)',
                water: 'Limited (Underground Aquifers)',
                atmosphere: 'Thin (Requires Terraforming)'
              },
              threats: ['Radiation Exposure', 'Seismic Activity']
            },
            {
              id: 'disc_003',
              name: 'LHS 1140b',
              system: 'LHS 1140',
              status: 'claimed',
              habitability: 0.91,
              discoveredBy: 'Zephyrian Empire',
              estimatedValue: 3200000,
              resources: {
                minerals: 'Extremely Rich (Platinum, Uranium)',
                water: 'Vast Oceans (70% Surface)',
                atmosphere: 'Perfect (Earth-like)'
              },
              threats: []
            }
          ],
          mergers: [
            {
              id: 'merge_001',
              planet: 'Kepler-442b',
              system: 'Kepler-442',
              type: 'conquest',
              integrationStatus: 'completed',
              completionDate: '2024-01-15',
              populationTransfer: {
                original: 2400000,
                satisfaction: 0.68
              },
              economicImpact: {
                gdpChange: 12.4,
                resourceAccess: ['Titanium', 'Helium-3', 'Rare Minerals']
              }
            },
            {
              id: 'merge_002',
              planet: 'Wolf-359c',
              system: 'Wolf-359',
              type: 'diplomacy',
              integrationStatus: 'in-progress',
              completionDate: '2024-01-08',
              populationTransfer: {
                original: 890000,
                satisfaction: 0.84
              },
              economicImpact: {
                gdpChange: 8.7,
                resourceAccess: ['Agricultural Products', 'Biomass', 'Fresh Water']
              }
            }
          ],
          integrations: [
            {
              id: 'int_001',
              planetId: 'Wolf-359c',
              phase: 'Cultural Integration',
              progress: 0.73,
              timeRemaining: 45,
              successProbability: 0.89,
              challenges: ['Language Barriers', 'Religious Differences']
            },
            {
              id: 'int_002',
              planetId: 'Proxima-b',
              phase: 'Economic Restructuring',
              progress: 0.56,
              timeRemaining: 78,
              successProbability: 0.72,
              challenges: ['Infrastructure Gaps', 'Currency Conversion', 'Trade Route Establishment']
            },
            {
              id: 'int_003',
              planetId: 'Ross-128b',
              phase: 'Administrative Setup',
              progress: 0.34,
              timeRemaining: 120,
              successProbability: 0.91,
              challenges: ['Bureaucratic Resistance']
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConquestData();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Planetary Conquest Action: ${action}`, context);
    alert(`Planetary Conquest System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const handleNewCampaign = (campaignData: any) => {
    console.log('Starting new campaign:', campaignData);
    alert(`New Campaign Started!\n\nTarget: ${campaignData.targetPlanet}\nSystem: ${campaignData.targetSystem}\nType: ${campaignData.campaignType}\n\nThis would launch the campaign in the full implementation.`);
    setShowNewCampaignModal(false);
  };

  const handleDiscovery = (discoveryData: any) => {
    console.log('Discovering new planet:', discoveryData);
    alert(`Planet Discovery!\n\nSystem: ${discoveryData.systemName}\nCoordinates: (${discoveryData.coordinates.x}, ${discoveryData.coordinates.y}, ${discoveryData.coordinates.z})\nDiscovered by: ${discoveryData.discovererCiv}\n\nThis would discover the planet in the full implementation.`);
    setShowDiscoveryModal(false);
  };

  if (loading) {
    return (
      <div className="planetary-conquest-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading conquest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="planetary-conquest-screen">
        <div className="error-state">
          <h3>⚠️ Error Loading Conquest Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="overview-content">
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-value">{conquestData.overview?.activeCampaigns || 0}</span>
          <span className="metric-label">Active Campaigns</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{conquestData.overview?.discoveredPlanets || 0}</span>
          <span className="metric-label">Discovered Planets</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{conquestData.overview?.completedMergers || 0}</span>
          <span className="metric-label">Completed Mergers</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{conquestData.overview?.activeIntegrations || 0}</span>
          <span className="metric-label">Active Integrations</span>
        </div>
      </div>

      <div className="overview-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-icon">📈</span>
            <span className="card-title">Integration Metrics</span>
          </div>
          <div className="card-content">
            {conquestData.overview?.integrationMetrics && (
              <>
                <div className="stat-row">
                  <span className="stat-label">Success Rate</span>
                  <span className="stat-value">{(conquestData.overview.integrationMetrics.successRate * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg Integration Time</span>
                  <span className="stat-value">{conquestData.overview.integrationMetrics.averageIntegrationTime} days</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Population Satisfaction</span>
                  <span className="stat-value">{(conquestData.overview.integrationMetrics.populationSatisfaction * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Rebellion Risk</span>
                  <span className="stat-value">{(conquestData.overview.integrationMetrics.rebellionRisk * 100).toFixed(1)}%</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-icon">📅</span>
            <span className="card-title">Recent Activity</span>
          </div>
          <div className="card-content">
            <div className="timeline">
              {conquestData.overview?.recentActivity?.map((activity, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{activity.date}</div>
                  <div className="timeline-title">{activity.target}</div>
                  <div className="timeline-description">{activity.type} {activity.action}</div>
                </div>
              )) || <div className="timeline-item"><div className="timeline-description">No recent activity</div></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={() => setShowNewCampaignModal(true)}>🚀 Start New Campaign</button>
        <button className="btn btn-secondary" onClick={() => setShowDiscoveryModal(true)}>🔍 Discover Planet</button>
        <button className="btn btn-success" onClick={() => handleAction('Simulate Time Passage')}>⏰ Simulate Time Passage</button>
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="campaigns-content">
      <div className="actions">
        <button className="btn" onClick={() => setShowNewCampaignModal(true)}>🚀 Start New Campaign</button>
        <button className="btn btn-secondary" onClick={() => handleAction('Refresh Campaigns')}>🔄 Refresh</button>
      </div>
      <div className="campaigns-grid">
        {conquestData.campaigns.map(campaign => (
          <div key={campaign.id} className="card">
            <div className="card-header">
              <span className="card-icon">{campaign.defendingCiv ? '⚔️' : '🚀'}</span>
              <span className="card-title">{campaign.name}</span>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span className="stat-label">Target</span>
                <span className="stat-value">{campaign.targetPlanet}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">System</span>
                <span className="stat-value">{campaign.targetSystem}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Status</span>
                <span className={`status-badge status-${campaign.status}`}>{campaign.status}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{campaign.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${campaign.progress}%` }}></div>
              </div>
              
              <div className="objectives-section">
                <strong>Objectives:</strong>
                <ul className="objectives-list">
                  {campaign.objectives.map((obj, index) => (
                    <li key={index} className="objective-item">
                      <div className={`objective-status ${obj.status}`}></div>
                      <span>{obj.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="actions">
                <button className="btn btn-success" onClick={() => handleAction('Advance Campaign Progress', campaign)}>
                  📈 Advance Progress
                </button>
                {campaign.progress >= 90 && (
                  <button className="btn" onClick={() => handleAction('Complete Campaign', campaign)}>
                    ✅ Complete Campaign
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscoveriesTab = () => (
    <div className="discoveries-content">
      <div className="actions">
        <button className="btn" onClick={() => setShowDiscoveryModal(true)}>🔍 Discover New Planet</button>
        <button className="btn btn-secondary" onClick={() => handleAction('Refresh Discoveries')}>🔄 Refresh</button>
      </div>
      <div className="discoveries-grid">
        {conquestData.discoveries.map(planet => (
          <div key={planet.id} className="card">
            <div className="card-header">
              <span className="card-icon">🪐</span>
              <span className="card-title">{planet.name}</span>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span className="stat-label">System</span>
                <span className="stat-value">{planet.system}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Status</span>
                <span className={`status-badge status-${planet.status}`}>{planet.status}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Habitability</span>
                <span className="stat-value">{(planet.habitability * 100).toFixed(1)}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Discovered By</span>
                <span className="stat-value">{planet.discoveredBy}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Est. Value</span>
                <span className="stat-value">{planet.estimatedValue.toLocaleString()} credits</span>
              </div>
              
              <div className="resources-section">
                <strong>Resources:</strong>
                <div className="stat-row">
                  <span className="stat-label">Minerals</span>
                  <span className="stat-value">{planet.resources.minerals}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Water</span>
                  <span className="stat-value">{planet.resources.water}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Atmosphere</span>
                  <span className="stat-value">{planet.resources.atmosphere}</span>
                </div>
              </div>
              
              {planet.threats.length > 0 && (
                <div className="threats-section">
                  <strong>Threats:</strong>
                  <div className="threats-list">
                    {planet.threats.join(', ')}
                  </div>
                </div>
              )}
              
              <div className="actions">
                {(planet.status === 'discovered' || planet.status === 'surveyed') && (
                  <button className="btn" onClick={() => handleAction('Claim Planet', planet)}>
                    🏴 Claim Planet
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => handleAction('Survey Planet', planet)}>
                  🔬 Survey
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMergersTab = () => (
    <div className="mergers-content">
      <div className="actions">
        <button className="btn btn-secondary" onClick={() => handleAction('Refresh Mergers')}>🔄 Refresh</button>
      </div>
      <div className="mergers-grid">
        {conquestData.mergers.map(merger => (
          <div key={merger.id} className="card">
            <div className="card-header">
              <span className="card-icon">{merger.type === 'conquest' ? '⚔️' : '🤝'}</span>
              <span className="card-title">{merger.planet}</span>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span className="stat-label">Type</span>
                <span className="stat-value">{merger.type}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">System</span>
                <span className="stat-value">{merger.system}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Integration Status</span>
                <span className={`status-badge status-${merger.integrationStatus.replace('-', '')}`}>{merger.integrationStatus}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Completion Date</span>
                <span className="stat-value">{merger.completionDate}</span>
              </div>
              
              <div className="impact-section">
                <strong>Population Impact:</strong>
                <div className="stat-row">
                  <span className="stat-label">Original Population</span>
                  <span className="stat-value">{merger.populationTransfer.original.toLocaleString()}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Satisfaction</span>
                  <span className="stat-value">{(merger.populationTransfer.satisfaction * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="impact-section">
                <strong>Economic Impact:</strong>
                <div className="stat-row">
                  <span className="stat-label">GDP Change</span>
                  <span className="stat-value">+{merger.economicImpact.gdpChange.toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">New Resources</span>
                  <span className="stat-value">{merger.economicImpact.resourceAccess.length}</span>
                </div>
                <div className="resources-gained">
                  {merger.economicImpact.resourceAccess.join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="integrations-content">
      <div className="actions">
        <button className="btn btn-secondary" onClick={() => handleAction('Refresh Integrations')}>🔄 Refresh</button>
      </div>
      <div className="integrations-grid">
        {conquestData.integrations.map(integration => (
          <div key={integration.id} className="card">
            <div className="card-header">
              <span className="card-icon">🏗️</span>
              <span className="card-title">{integration.planetId}</span>
            </div>
            <div className="card-content">
              <div className="stat-row">
                <span className="stat-label">Current Phase</span>
                <span className="stat-value">{integration.phase}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{(integration.progress * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${integration.progress * 100}%` }}></div>
              </div>
              <div className="stat-row">
                <span className="stat-label">Time Remaining</span>
                <span className="stat-value">{integration.timeRemaining} days</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Success Probability</span>
                <span className="stat-value">{(integration.successProbability * 100).toFixed(1)}%</span>
              </div>
              
              {integration.challenges.length > 0 && (
                <div className="challenges-section">
                  <strong>Challenges:</strong>
                  <div className="challenges-list">
                    {integration.challenges.join(', ')}
                  </div>
                </div>
              )}
              
              <div className="actions">
                <button className="btn btn-success" onClick={() => handleAction('Advance Integration', integration)}>
                  📅 Advance 1 Week
                </button>
                <button className="btn btn-secondary" onClick={() => handleAction('Address Challenges', integration)}>
                  🔧 Address Challenges
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="planetary-conquest-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          ⚔️ Active Campaigns
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discoveries' ? 'active' : ''}`}
          onClick={() => setActiveTab('discoveries')}
        >
          🔍 Discoveries
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mergers' ? 'active' : ''}`}
          onClick={() => setActiveTab('mergers')}
        >
          🔄 Mergers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          🏗️ Integrations
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'campaigns' && renderCampaignsTab()}
        {activeTab === 'discoveries' && renderDiscoveriesTab()}
        {activeTab === 'mergers' && renderMergersTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}
      </div>

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Start New Campaign</h2>
              <button className="close-btn" onClick={() => setShowNewCampaignModal(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleNewCampaign({
                targetSystem: formData.get('targetSystem'),
                targetPlanet: formData.get('targetPlanet'),
                campaignType: formData.get('campaignType'),
                fleetSize: formData.get('fleetSize'),
                troopCount: formData.get('troopCount')
              });
            }}>
              <div className="form-group">
                <label className="form-label">Target System</label>
                <input type="text" className="form-input" name="targetSystem" placeholder="e.g., kepler-442" required />
              </div>
              <div className="form-group">
                <label className="form-label">Target Planet</label>
                <input type="text" className="form-input" name="targetPlanet" placeholder="e.g., kepler-442b" required />
              </div>
              <div className="form-group">
                <label className="form-label">Campaign Type</label>
                <select className="form-select" name="campaignType" required>
                  <option value="conquest">Military Conquest</option>
                  <option value="discovery">Peaceful Colonization</option>
                  <option value="diplomacy">Diplomatic Annexation</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fleet Size</label>
                <input type="number" className="form-input" name="fleetSize" min="1" max="50" defaultValue="5" />
              </div>
              <div className="form-group">
                <label className="form-label">Troop Count</label>
                <input type="number" className="form-input" name="troopCount" min="1000" max="1000000" defaultValue="50000" />
              </div>
              <div className="actions">
                <button type="submit" className="btn">🚀 Launch Campaign</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewCampaignModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discovery Modal */}
      {showDiscoveryModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Discover New Planet</h2>
              <button className="close-btn" onClick={() => setShowDiscoveryModal(false)}>&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleDiscovery({
                systemName: formData.get('systemName'),
                coordinates: {
                  x: parseInt(formData.get('coordX') as string),
                  y: parseInt(formData.get('coordY') as string),
                  z: parseInt(formData.get('coordZ') as string)
                },
                discovererCiv: formData.get('discovererCiv')
              });
            }}>
              <div className="form-group">
                <label className="form-label">System Name</label>
                <input type="text" className="form-input" name="systemName" placeholder="e.g., wolf-359" required />
              </div>
              <div className="form-group">
                <label className="form-label">Coordinates X</label>
                <input type="number" className="form-input" name="coordX" min="-50" max="50" defaultValue="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Coordinates Y</label>
                <input type="number" className="form-input" name="coordY" min="-50" max="50" defaultValue="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Coordinates Z</label>
                <input type="number" className="form-input" name="coordZ" min="-50" max="50" defaultValue="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Discoverer Civilization</label>
                <select className="form-select" name="discovererCiv" required>
                  <option value="terran-federation">Terran Federation</option>
                  <option value="martian-republic">Martian Republic</option>
                  <option value="zephyrian-empire">Zephyrian Empire</option>
                  <option value="jovian-collective">Jovian Collective</option>
                </select>
              </div>
              <div className="actions">
                <button type="submit" className="btn">🔍 Discover Planet</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDiscoveryModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetaryConquestScreen;
