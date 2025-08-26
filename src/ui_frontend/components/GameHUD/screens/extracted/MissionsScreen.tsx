import React, { useState, useEffect } from 'react';
import './MissionsScreen.css';

interface MissionsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'exploration' | 'diplomacy' | 'military' | 'research' | 'trade' | 'special';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired';
  difficulty: number;
  estimatedDuration: number;
  rewards: any;
  requirements: any;
  objectives: any[];
  progress: number;
  assignedTo?: string;
  startDate?: string;
  deadline?: string;
  location?: string;
  faction?: string;
}

interface MissionType {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalRewards: string[];
  commonRequirements: string[];
  averageDifficulty: number;
}

const MissionsScreen: React.FC<MissionsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed' | 'create' | 'analytics'>('available');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [missionTypes, setMissionTypes] = useState<MissionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    fetchMissionsData();
  }, []);

  const fetchMissionsData = async () => {
    try {
      setLoading(true);
      
      // Fetch missions
      const missionsResponse = await fetch('http://localhost:4000/api/missions/civilization/campaign_1/player_civ');
      if (missionsResponse.ok) {
        const missionsData = await missionsResponse.json();
        if (missionsData.success) {
          setMissions(missionsData.data.missions);
        }
      }

      // Fetch mission types
      const typesResponse = await fetch('http://localhost:4000/api/missions/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        if (typesData.success) {
          setMissionTypes(typesData.data);
        }
      }

    } catch (err) {
      console.warn('Missions API not available, using mock data');
      setMissions(createMockMissions());
      setMissionTypes(createMockMissionTypes());
    } finally {
      setLoading(false);
    }
  };

  const createMockMissions = (): Mission[] => [
    {
      id: 'mission_1',
      title: 'First Contact Protocol',
      description: 'Establish diplomatic relations with the newly discovered Zephyrian civilization',
      category: 'diplomacy',
      priority: 'critical',
      status: 'available',
      difficulty: 8,
      estimatedDuration: 45,
      rewards: {
        experience: 5000,
        credits: 2000000,
        reputation: { zephyrians: 500 },
        technology: ['diplomatic_protocols', 'universal_translator']
      },
      requirements: {
        diplomaticRank: 'ambassador',
        securityClearance: 'top_secret',
        skills: ['negotiation', 'xenolinguistics', 'cultural_analysis']
      },
      objectives: [
        { id: 1, description: 'Analyze Zephyrian communication patterns', completed: false },
        { id: 2, description: 'Establish initial contact protocols', completed: false },
        { id: 3, description: 'Negotiate preliminary trade agreement', completed: false },
        { id: 4, description: 'Set up permanent embassy', completed: false }
      ],
      progress: 0,
      location: 'Zephyr System',
      faction: 'Zephyrian Collective'
    },
    {
      id: 'mission_2',
      title: 'Ancient Artifact Recovery',
      description: 'Investigate and recover ancient Precursor artifacts from the Void Nebula',
      category: 'exploration',
      priority: 'high',
      status: 'active',
      difficulty: 9,
      estimatedDuration: 60,
      rewards: {
        experience: 7500,
        credits: 5000000,
        artifacts: ['precursor_data_core', 'quantum_resonator'],
        technology: ['precursor_engineering', 'void_navigation']
      },
      requirements: {
        explorationRank: 'veteran',
        shipClass: 'heavy_cruiser',
        equipment: ['void_shields', 'quantum_scanner', 'artifact_containment']
      },
      objectives: [
        { id: 1, description: 'Navigate through the Void Nebula', completed: true },
        { id: 2, description: 'Locate the Precursor facility', completed: true },
        { id: 3, description: 'Bypass security systems', completed: false },
        { id: 4, description: 'Extract artifacts safely', completed: false },
        { id: 5, description: 'Return to base without contamination', completed: false }
      ],
      progress: 40,
      assignedTo: 'Captain Sarah Chen',
      startDate: '2024-11-15',
      deadline: '2025-01-15',
      location: 'Void Nebula Sector 7'
    },
    {
      id: 'mission_3',
      title: 'Quantum Research Initiative',
      description: 'Develop breakthrough quantum computing technology for military applications',
      category: 'research',
      priority: 'medium',
      status: 'active',
      difficulty: 7,
      estimatedDuration: 90,
      rewards: {
        experience: 4000,
        credits: 3000000,
        technology: ['quantum_computing', 'quantum_encryption', 'quantum_sensors'],
        facilities: ['quantum_research_lab']
      },
      requirements: {
        researchRank: 'senior_scientist',
        securityClearance: 'secret',
        facilities: ['advanced_physics_lab'],
        personnel: ['quantum_physicists', 'computer_scientists']
      },
      objectives: [
        { id: 1, description: 'Complete theoretical framework', completed: true },
        { id: 2, description: 'Build prototype quantum processor', completed: true },
        { id: 3, description: 'Test quantum algorithms', completed: false },
        { id: 4, description: 'Scale to production model', completed: false },
        { id: 5, description: 'Integrate with existing systems', completed: false }
      ],
      progress: 35,
      assignedTo: 'Dr. Marcus Webb',
      startDate: '2024-10-01',
      deadline: '2025-01-01',
      location: 'Central Research Facility'
    },
    {
      id: 'mission_4',
      title: 'Trade Route Establishment',
      description: 'Establish secure trade routes with the Merchant Guilds of the Outer Rim',
      category: 'trade',
      priority: 'medium',
      status: 'completed',
      difficulty: 5,
      estimatedDuration: 30,
      rewards: {
        experience: 2500,
        credits: 1500000,
        tradeRoutes: ['outer_rim_express'],
        reputation: { merchant_guilds: 300 }
      },
      requirements: {
        tradeRank: 'merchant',
        shipClass: 'cargo_vessel',
        escorts: 2
      },
      objectives: [
        { id: 1, description: 'Negotiate with Guild representatives', completed: true },
        { id: 2, description: 'Survey potential trade routes', completed: true },
        { id: 3, description: 'Establish security protocols', completed: true },
        { id: 4, description: 'Complete first trade run', completed: true }
      ],
      progress: 100,
      assignedTo: 'Commander Lisa Park',
      startDate: '2024-10-15',
      deadline: '2024-11-15',
      location: 'Outer Rim Territories'
    }
  ];

  const createMockMissionTypes = (): MissionType[] => [
    {
      id: 'exploration',
      name: 'Exploration Missions',
      description: 'Discover new worlds, systems, and phenomena',
      category: 'exploration',
      typicalRewards: ['Credits', 'Experience', 'New Locations', 'Scientific Data'],
      commonRequirements: ['Exploration Vessel', 'Qualified Crew', 'Navigation Equipment'],
      averageDifficulty: 6
    },
    {
      id: 'diplomacy',
      name: 'Diplomatic Missions',
      description: 'Establish relations and negotiate with other civilizations',
      category: 'diplomacy',
      typicalRewards: ['Reputation', 'Trade Agreements', 'Technology Exchange', 'Alliance'],
      commonRequirements: ['Diplomatic Rank', 'Cultural Knowledge', 'Language Skills'],
      averageDifficulty: 7
    },
    {
      id: 'military',
      name: 'Military Operations',
      description: 'Combat missions and strategic military objectives',
      category: 'military',
      typicalRewards: ['Military Rank', 'Equipment', 'Territory', 'Strategic Advantage'],
      commonRequirements: ['Military Rank', 'Combat Vessels', 'Tactical Training'],
      averageDifficulty: 8
    },
    {
      id: 'research',
      name: 'Research Projects',
      description: 'Scientific research and technological development',
      category: 'research',
      typicalRewards: ['Technology', 'Scientific Knowledge', 'Research Facilities', 'Patents'],
      commonRequirements: ['Research Facilities', 'Qualified Scientists', 'Funding'],
      averageDifficulty: 6
    }
  ];

  const handleAcceptMission = async (missionId: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/missions/${missionId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          campaignId: 'campaign_1',
          civilizationId: 'player_civ'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMissions(missions.map(mission => 
            mission.id === missionId 
              ? { ...mission, status: 'active' as const }
              : mission
          ));
          alert('Mission accepted successfully!');
        }
      }
    } catch (error) {
      console.error('Mission acceptance failed:', error);
      alert('Mission acceptance failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  const handleCreateMission = async (missionData: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/missions/civilization/campaign_1/player_civ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMissions([...missions, data.data]);
          alert('Mission created successfully!');
        }
      }
    } catch (error) {
      console.error('Mission creation failed:', error);
      alert('Mission creation failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  const filteredMissions = missions.filter(mission => {
    const categoryMatch = filterCategory === 'all' || mission.category === filterCategory;
    const priorityMatch = filterPriority === 'all' || mission.priority === filterPriority;
    const statusMatch = activeTab === 'available' ? mission.status === 'available' :
                       activeTab === 'active' ? mission.status === 'active' :
                       activeTab === 'completed' ? ['completed', 'failed', 'expired'].includes(mission.status) :
                       true;
    return categoryMatch && priorityMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="missions-screen loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="missions-screen error">
        <div className="error-message">
          <h3>⚠️ Mission System Unavailable</h3>
          <p>Unable to load mission data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="missions-screen">
      <div className="screen-header">
        <div className="header-left">
          <span className="screen-icon">{icon}</span>
          <div className="header-text">
            <h2>{title}</h2>
            <p>Strategic Mission Management & Operations Center</p>
          </div>
        </div>
        <div className="header-right">
          <div className="mission-stats">
            <div className="stat">
              <span className="stat-label">Available</span>
              <span className="stat-value">{missions.filter(m => m.status === 'available').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Active</span>
              <span className="stat-value">{missions.filter(m => m.status === 'active').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{missions.filter(m => m.status === 'completed').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'available', label: 'Available Missions', icon: '📋' },
          { id: 'active', label: 'Active Missions', icon: '⚡' },
          { id: 'completed', label: 'Mission History', icon: '✅' },
          { id: 'create', label: 'Create Mission', icon: '➕' },
          { id: 'analytics', label: 'Analytics', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {(activeTab === 'available' || activeTab === 'active' || activeTab === 'completed') && (
          <div className="missions-tab">
            <div className="missions-header">
              <div className="filters">
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="exploration">Exploration</option>
                  <option value="diplomacy">Diplomacy</option>
                  <option value="military">Military</option>
                  <option value="research">Research</option>
                  <option value="trade">Trade</option>
                  <option value="special">Special</option>
                </select>
                
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="missions-grid">
              {filteredMissions.map(mission => (
                <div key={mission.id} className={`mission-card ${mission.status} ${mission.priority}`}>
                  <div className="mission-header">
                    <h4>{mission.title}</h4>
                    <div className="mission-badges">
                      <span className={`category-badge ${mission.category}`}>{mission.category}</span>
                      <span className={`priority-badge ${mission.priority}`}>{mission.priority}</span>
                      <span className={`status-badge ${mission.status}`}>{mission.status}</span>
                    </div>
                  </div>
                  
                  <p className="mission-description">{mission.description}</p>
                  
                  <div className="mission-details">
                    <div className="detail-row">
                      <span className="label">Difficulty:</span>
                      <span className="value">
                        <div className="difficulty-stars">
                          {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} className={`star ${i < mission.difficulty ? 'filled' : ''}`}>★</span>
                          ))}
                        </div>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <span className="value">{mission.estimatedDuration} days</span>
                    </div>
                    {mission.location && (
                      <div className="detail-row">
                        <span className="label">Location:</span>
                        <span className="value">{mission.location}</span>
                      </div>
                    )}
                    {mission.assignedTo && (
                      <div className="detail-row">
                        <span className="label">Assigned To:</span>
                        <span className="value">{mission.assignedTo}</span>
                      </div>
                    )}
                    {mission.deadline && (
                      <div className="detail-row">
                        <span className="label">Deadline:</span>
                        <span className="value">{new Date(mission.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {mission.status === 'active' && (
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progress: {mission.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${mission.progress}%` }}
                        ></div>
                      </div>
                      <div className="objectives-summary">
                        {mission.objectives.filter(obj => obj.completed).length} of {mission.objectives.length} objectives completed
                      </div>
                    </div>
                  )}

                  <div className="rewards-section">
                    <h5>Rewards:</h5>
                    <div className="rewards-list">
                      {mission.rewards.experience && (
                        <span className="reward-item">+{mission.rewards.experience} XP</span>
                      )}
                      {mission.rewards.credits && (
                        <span className="reward-item">${mission.rewards.credits.toLocaleString()}</span>
                      )}
                      {mission.rewards.technology && mission.rewards.technology.length > 0 && (
                        <span className="reward-item">Tech: {mission.rewards.technology.slice(0, 2).join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="mission-actions">
                    {mission.status === 'available' && (
                      <button 
                        className="action-btn primary"
                        onClick={() => handleAcceptMission(mission.id)}
                      >
                        Accept Mission
                      </button>
                    )}
                    {mission.status === 'active' && (
                      <>
                        <button className="action-btn">View Progress</button>
                        <button className="action-btn secondary">Reassign</button>
                      </>
                    )}
                    <button className="action-btn secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-tab">
            <div className="create-header">
              <h3>Create New Mission</h3>
              <p>Design custom missions for your civilization's strategic objectives</p>
            </div>

            <div className="mission-creation-form">
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Mission Title:</label>
                    <input type="text" placeholder="Enter mission title" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label>Category:</label>
                    <select className="form-select">
                      <option value="exploration">Exploration</option>
                      <option value="diplomacy">Diplomacy</option>
                      <option value="military">Military</option>
                      <option value="research">Research</option>
                      <option value="trade">Trade</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Priority:</label>
                    <select className="form-select">
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Difficulty (1-10):</label>
                    <input type="number" min="1" max="10" placeholder="5" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Duration (days):</label>
                    <input type="number" placeholder="30" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label>Location:</label>
                    <input type="text" placeholder="Mission location" className="form-input" />
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Description:</label>
                  <textarea placeholder="Detailed mission description" className="form-textarea" rows={3} />
                </div>
              </div>

              <div className="form-section">
                <h4>Mission Templates</h4>
                <div className="templates-grid">
                  {missionTypes.map(type => (
                    <div key={type.id} className="template-card">
                      <h5>{type.name}</h5>
                      <p>{type.description}</p>
                      <div className="template-stats">
                        <span>Avg Difficulty: {type.averageDifficulty}/10</span>
                      </div>
                      <div className="template-rewards">
                        <strong>Typical Rewards:</strong>
                        <div className="rewards-tags">
                          {type.typicalRewards.slice(0, 3).map((reward, index) => (
                            <span key={index} className="reward-tag">{reward}</span>
                          ))}
                        </div>
                      </div>
                      <button 
                        className="use-template-btn"
                        onClick={() => handleCreateMission({
                          title: `New ${type.name}`,
                          category: type.category,
                          priority: 'medium',
                          difficulty: type.averageDifficulty
                        })}
                      >
                        Use Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h3>Mission Analytics & Performance</h3>
              <p>Strategic analysis of mission outcomes and operational efficiency</p>
            </div>

            <div className="analytics-dashboard">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Mission Success Rate</h4>
                  <div className="success-metrics">
                    <div className="metric">
                      <span className="metric-label">Overall Success Rate:</span>
                      <span className="metric-value">87%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Critical Missions:</span>
                      <span className="metric-value">95%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Average Completion Time:</span>
                      <span className="metric-value">42 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h4>Category Performance</h4>
                  <div className="category-performance">
                    <div className="performance-item">
                      <span className="category-label">Exploration:</span>
                      <span className="performance-bar">
                        <div className="bar-fill" style={{ width: '92%' }}></div>
                      </span>
                      <span className="performance-value">92%</span>
                    </div>
                    <div className="performance-item">
                      <span className="category-label">Diplomacy:</span>
                      <span className="performance-bar">
                        <div className="bar-fill" style={{ width: '78%' }}></div>
                      </span>
                      <span className="performance-value">78%</span>
                    </div>
                    <div className="performance-item">
                      <span className="category-label">Military:</span>
                      <span className="performance-bar">
                        <div className="bar-fill" style={{ width: '85%' }}></div>
                      </span>
                      <span className="performance-value">85%</span>
                    </div>
                    <div className="performance-item">
                      <span className="category-label">Research:</span>
                      <span className="performance-bar">
                        <div className="bar-fill" style={{ width: '90%' }}></div>
                      </span>
                      <span className="performance-value">90%</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Resource Efficiency</h4>
                  <div className="efficiency-metrics">
                    <div className="metric">
                      <span className="metric-label">Credits per Mission:</span>
                      <span className="metric-value">2.8M avg</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Experience Gained:</span>
                      <span className="metric-value">4,750 avg</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Technology Unlocked:</span>
                      <span className="metric-value">23 total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionsScreen;
