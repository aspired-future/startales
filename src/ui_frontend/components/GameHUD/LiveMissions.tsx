/**
 * Live Missions Component for HUD Right Panel
 * 
 * Displays active missions with real-time updates and progress tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import './LiveMissions.css';

export interface Mission {
  id: string;
  campaignId: string;
  civilizationId: string;
  title: string;
  description: string;
  type: 'exploration' | 'diplomatic' | 'military' | 'economic' | 'research' | 'espionage' | 'humanitarian' | 'cultural';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'available' | 'active' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Story Integration
  storyArc: string;
  gameMasterGenerated: boolean;
  narrativeImpact: 'minor' | 'moderate' | 'major' | 'pivotal';
  
  // Mission Details
  objectives: MissionObjective[];
  rewards: MissionReward[];
  risks: MissionRisk[];
  requirements: MissionRequirement[];
  
  // Timing
  timeLimit?: number;
  estimatedDuration: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  
  // Progress
  progress: number;
  currentPhase: string;
  assignedCharacters: string[];
  assignedFleets: string[];
  assignedResources: any;
  
  // AI Integration
  successProbability: number;
  gameMasterNotes: string;
}

export interface MissionObjective {
  id: string;
  description: string;
  completed: boolean;
  progress: number;
  required: boolean;
}

export interface MissionReward {
  type: string;
  amount: number;
  description: string;
}

export interface MissionRisk {
  type: string;
  probability: number;
  impact: string;
  description: string;
}

export interface MissionRequirement {
  type: string;
  amount: number;
  description: string;
  met: boolean;
}

interface LiveMissionsProps {
  playerId: string;
  campaignId: string;
  refreshInterval?: number;
}

interface MissionsState {
  activeMissions: Mission[];
  availableMissions: Mission[];
  completedMissions: Mission[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const LiveMissions: React.FC<LiveMissionsProps> = ({
  playerId,
  campaignId,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [missionsState, setMissionsState] = useState<MissionsState>({
    activeMissions: [],
    availableMissions: [],
    completedMissions: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'completed'>('active');

  // Mock mission data for demonstration
  const getMockMissions = (): Mission[] => [
    {
      id: 'mission_001',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Explore Kepler-442 System',
      description: 'Conduct a comprehensive survey of the Kepler-442 system to identify habitable planets and valuable resources. This mission is crucial for our expansion efforts.',
      type: 'exploration',
      priority: 'high',
      status: 'active',
      difficulty: 3,
      storyArc: 'Galactic Expansion',
      gameMasterGenerated: true,
      narrativeImpact: 'major',
      objectives: [
        { id: 'obj_001_1', description: 'Deploy long-range sensors to scan the system', completed: true, progress: 100, required: true },
        { id: 'obj_001_2', description: 'Analyze planetary compositions and atmospheres', completed: false, progress: 65, required: true },
        { id: 'obj_001_3', description: 'Establish communication relay station', completed: false, progress: 30, required: false }
      ],
      rewards: [
        { type: 'Research Points', amount: 5000, description: 'Advanced astronomical data' },
        { type: 'Credits', amount: 250000, description: 'Mission completion bonus' }
      ],
      risks: [
        { type: 'Equipment Failure', probability: 15, impact: 'Mission delay', description: 'Long-range equipment may malfunction' }
      ],
      requirements: [
        { type: 'Fleet', amount: 1, description: 'Science vessel required', met: true }
      ],
      estimatedDuration: 45,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 65,
      currentPhase: 'Data Analysis',
      assignedCharacters: ['scientist_001', 'navigator_002'],
      assignedFleets: ['science_fleet_alpha'],
      assignedResources: { fuel: 1000, supplies: 500 },
      successProbability: 85,
      gameMasterNotes: 'This system shows promising signs of rare mineral deposits. The crew is performing exceptionally well.'
    },
    {
      id: 'mission_002',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Diplomatic Summit with Vega Federation',
      description: 'Negotiate a comprehensive trade agreement with the Vega Federation to secure access to their advanced technology markets.',
      type: 'diplomatic',
      priority: 'critical',
      status: 'active',
      difficulty: 4,
      storyArc: 'Galactic Politics',
      gameMasterGenerated: true,
      narrativeImpact: 'pivotal',
      objectives: [
        { id: 'obj_002_1', description: 'Establish initial diplomatic contact', completed: true, progress: 100, required: true },
        { id: 'obj_002_2', description: 'Present trade proposal to Federation Council', completed: false, progress: 80, required: true },
        { id: 'obj_002_3', description: 'Negotiate technology sharing terms', completed: false, progress: 25, required: true }
      ],
      rewards: [
        { type: 'Technology Access', amount: 1, description: 'Advanced propulsion technology' },
        { type: 'Trade Revenue', amount: 1000000, description: 'Annual trade income increase' }
      ],
      risks: [
        { type: 'Diplomatic Incident', probability: 25, impact: 'Relations deterioration', description: 'Cultural misunderstandings could damage relations' }
      ],
      requirements: [
        { type: 'Diplomat', amount: 1, description: 'Experienced diplomatic envoy required', met: true }
      ],
      timeLimit: 14,
      estimatedDuration: 21,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 68,
      currentPhase: 'Formal Negotiations',
      assignedCharacters: ['diplomat_001', 'trade_specialist_001'],
      assignedFleets: ['diplomatic_cruiser_beta'],
      assignedResources: { diplomatic_gifts: 50, security_detail: 10 },
      successProbability: 72,
      gameMasterNotes: 'The Federation is showing genuine interest, but they are concerned about our military expansion. Handle with care.'
    },
    {
      id: 'mission_003',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Secure Asteroid Mining Operation',
      description: 'Establish and defend a mining operation in the resource-rich asteroid belt of the Proxima system.',
      type: 'military',
      priority: 'high',
      status: 'active',
      difficulty: 4,
      storyArc: 'Resource Wars',
      gameMasterGenerated: true,
      narrativeImpact: 'major',
      objectives: [
        { id: 'obj_003_1', description: 'Deploy mining platforms to asteroid belt', completed: true, progress: 100, required: true },
        { id: 'obj_003_2', description: 'Establish defensive perimeter', completed: true, progress: 100, required: true },
        { id: 'obj_003_3', description: 'Repel pirate attacks and secure operations', completed: false, progress: 85, required: true }
      ],
      rewards: [
        { type: 'Rare Minerals', amount: 10000, description: 'High-grade titanium and platinum' },
        { type: 'Military Experience', amount: 500, description: 'Combat experience for fleet crews' }
      ],
      risks: [
        { type: 'Pirate Raids', probability: 40, impact: 'Equipment loss', description: 'Organized pirate groups target mining operations' }
      ],
      requirements: [
        { type: 'Military Fleet', amount: 2, description: 'Combat vessels for protection', met: true }
      ],
      timeLimit: 60,
      estimatedDuration: 90,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      progress: 85,
      currentPhase: 'Security Operations',
      assignedCharacters: ['fleet_commander_001', 'mining_engineer_001'],
      assignedFleets: ['battle_group_gamma', 'mining_support_delta'],
      assignedResources: { ammunition: 2000, repair_kits: 100 },
      successProbability: 78,
      gameMasterNotes: 'The operation is proceeding well, but intelligence suggests a major pirate offensive is being planned.'
    },
    {
      id: 'mission_004',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Quantum Computing Research Initiative',
      description: 'Develop breakthrough quantum computing technology to advance our civilization\'s computational capabilities.',
      type: 'research',
      priority: 'medium',
      status: 'available',
      difficulty: 5,
      storyArc: 'Technological Advancement',
      gameMasterGenerated: true,
      narrativeImpact: 'major',
      objectives: [
        { id: 'obj_004_1', description: 'Establish quantum research laboratory', completed: false, progress: 0, required: true },
        { id: 'obj_004_2', description: 'Recruit quantum physics specialists', completed: false, progress: 0, required: true },
        { id: 'obj_004_3', description: 'Develop quantum processor prototype', completed: false, progress: 0, required: true }
      ],
      rewards: [
        { type: 'Technology Breakthrough', amount: 1, description: 'Quantum computing technology' },
        { type: 'Research Points', amount: 15000, description: 'Advanced physics research data' }
      ],
      risks: [
        { type: 'Research Failure', probability: 35, impact: 'Resource loss', description: 'Quantum research is highly experimental' }
      ],
      requirements: [
        { type: 'Research Facility', amount: 1, description: 'Advanced physics laboratory', met: false }
      ],
      estimatedDuration: 180,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      progress: 0,
      currentPhase: 'Planning',
      assignedCharacters: [],
      assignedFleets: [],
      assignedResources: {},
      successProbability: 45,
      gameMasterNotes: 'This is a high-risk, high-reward research project. Success could provide significant technological advantages.'
    },
    {
      id: 'mission_005',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Humanitarian Relief for Tau Ceti Colony',
      description: 'Provide emergency medical aid and supplies to the Tau Ceti colony following a devastating natural disaster.',
      type: 'humanitarian',
      priority: 'critical',
      status: 'available',
      difficulty: 2,
      storyArc: 'Galactic Community',
      gameMasterGenerated: true,
      narrativeImpact: 'moderate',
      objectives: [
        { id: 'obj_005_1', description: 'Deploy medical teams and supplies', completed: false, progress: 0, required: true },
        { id: 'obj_005_2', description: 'Establish temporary shelter facilities', completed: false, progress: 0, required: true }
      ],
      rewards: [
        { type: 'Diplomatic Reputation', amount: 1000, description: 'Improved standing with galactic community' }
      ],
      risks: [
        { type: 'Secondary Disasters', probability: 20, impact: 'Personnel danger', description: 'Aftershocks and environmental hazards' }
      ],
      requirements: [
        { type: 'Medical Personnel', amount: 50, description: 'Doctors, nurses, and medical technicians', met: true }
      ],
      timeLimit: 7,
      estimatedDuration: 14,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      progress: 0,
      currentPhase: 'Preparation',
      assignedCharacters: [],
      assignedFleets: [],
      assignedResources: {},
      successProbability: 90,
      gameMasterNotes: 'Time is critical. The colony population is suffering, and quick action will save lives.'
    },
    {
      id: 'mission_006',
      campaignId: 'default_campaign',
      civilizationId: 'Commander_Alpha',
      title: 'Ancient Artifact Recovery',
      description: 'A recently completed archaeological mission that uncovered valuable alien technology.',
      type: 'exploration',
      priority: 'high',
      status: 'completed',
      difficulty: 4,
      storyArc: 'Ancient Mysteries',
      gameMasterGenerated: true,
      narrativeImpact: 'major',
      objectives: [
        { id: 'obj_006_1', description: 'Locate and excavate ancient ruins', completed: true, progress: 100, required: true },
        { id: 'obj_006_2', description: 'Analyze and catalog discovered artifacts', completed: true, progress: 100, required: true }
      ],
      rewards: [
        { type: 'Ancient Technology', amount: 3, description: 'Precursor energy manipulation devices' }
      ],
      risks: [],
      requirements: [
        { type: 'Archaeological Team', amount: 1, description: 'Specialized excavation crew', met: true }
      ],
      estimatedDuration: 60,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      progress: 100,
      currentPhase: 'Completed',
      assignedCharacters: ['archaeologist_001', 'xenotech_specialist_001'],
      assignedFleets: ['research_vessel_epsilon'],
      assignedResources: {},
      successProbability: 100,
      gameMasterNotes: 'Exceptional success! The artifacts recovered have provided significant technological insights.'
    }
  ];

  // Fetch missions from API (with fallback to mock data)
  const fetchMissions = useCallback(async () => {
    try {
      setMissionsState(prev => ({ ...prev, loading: true, error: null }));

      let missions: Mission[];

      try {
        // Try to fetch from API first
        const response = await fetch(`/api/missions/civilization/${campaignId}/${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            missions = data.data.map((mission: any) => ({
              ...mission,
              createdAt: new Date(mission.createdAt),
              startedAt: mission.startedAt ? new Date(mission.startedAt) : undefined,
              completedAt: mission.completedAt ? new Date(mission.completedAt) : undefined,
              expiresAt: mission.expiresAt ? new Date(mission.expiresAt) : undefined
            }));
          } else {
            throw new Error(data.error || 'API returned unsuccessful response');
          }
        } else {
          throw new Error(`API responded with status: ${response.status}`);
        }
      } catch (apiError) {
        console.warn('Missions API not available, using mock data:', apiError);
        // Fallback to mock data
        missions = getMockMissions();
      }

      // Categorize missions by status
      const activeMissions = missions.filter(m => m.status === 'active');
      const availableMissions = missions.filter(m => m.status === 'available');
      const completedMissions = missions.filter(m => 
        m.status === 'completed' || m.status === 'failed' || m.status === 'cancelled'
      ).slice(0, 5); // Show only recent 5 completed missions

      setMissionsState({
        activeMissions,
        availableMissions,
        completedMissions,
        loading: false,
        error: null,
        lastUpdate: new Date()
      });

    } catch (error) {
      console.error('Error fetching missions:', error);
      setMissionsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [campaignId, playerId]);

  // Auto-refresh missions
  useEffect(() => {
    fetchMissions();
    
    const interval = setInterval(fetchMissions, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchMissions, refreshInterval]);

  // Get mission type icon
  const getMissionTypeIcon = (type: Mission['type']): string => {
    const icons = {
      exploration: '🚀',
      diplomatic: '🤝',
      military: '⚔️',
      economic: '💰',
      research: '🔬',
      espionage: '🕵️',
      humanitarian: '🏥',
      cultural: '🎭'
    };
    return icons[type] || '📋';
  };

  // Get priority color class
  const getPriorityClass = (priority: Mission['priority']): string => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      critical: 'priority-critical'
    };
    return classes[priority];
  };

  // Get difficulty stars
  const getDifficultyStars = (difficulty: number): string => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  // Format time remaining
  const formatTimeRemaining = (mission: Mission): string => {
    if (!mission.expiresAt) return 'No time limit';
    
    const now = new Date();
    const timeLeft = mission.expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // Render mission card
  const renderMissionCard = (mission: Mission, isCompact: boolean = false) => (
    <div 
      key={mission.id}
      className={`mission-card ${getPriorityClass(mission.priority)} ${selectedMission?.id === mission.id ? 'selected' : ''}`}
      onClick={() => setSelectedMission(selectedMission?.id === mission.id ? null : mission)}
    >
      <div className="mission-header">
        <div className="mission-title-row">
          <span className="mission-icon">{getMissionTypeIcon(mission.type)}</span>
          <span className="mission-title">{mission.title}</span>
          <span className="mission-priority">{mission.priority.toUpperCase()}</span>
        </div>
        <div className="mission-meta">
          <span className="mission-difficulty" title={`Difficulty: ${mission.difficulty}/5`}>
            {getDifficultyStars(mission.difficulty)}
          </span>
          {mission.status === 'active' && (
            <span className="mission-progress">{mission.progress}%</span>
          )}
        </div>
      </div>

      {!isCompact && (
        <div className="mission-description">
          {mission.description.length > 100 
            ? `${mission.description.substring(0, 100)}...`
            : mission.description
          }
        </div>
      )}

      <div className="mission-details">
        {mission.status === 'active' && (
          <>
            <div className="mission-progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${mission.progress}%` }}
              />
            </div>
            <div className="mission-info-row">
              <span className="mission-phase">Phase: {mission.currentPhase}</span>
              {mission.expiresAt && (
                <span className="mission-time-left">{formatTimeRemaining(mission)}</span>
              )}
            </div>
          </>
        )}

        {mission.status === 'available' && (
          <div className="mission-info-row">
            <span className="mission-duration">Duration: {mission.estimatedDuration}d</span>
            <span className="mission-success-rate">Success: {mission.successProbability}%</span>
          </div>
        )}

        {(mission.status === 'completed' || mission.status === 'failed') && (
          <div className="mission-info-row">
            <span className={`mission-status status-${mission.status}`}>
              {mission.status.toUpperCase()}
            </span>
            {mission.completedAt && (
              <span className="mission-completed-date">
                {mission.completedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {mission.assignedCharacters.length > 0 && (
        <div className="mission-assignments">
          <span className="assignment-label">👥 Assigned:</span>
          <span className="assignment-count">{mission.assignedCharacters.length} characters</span>
        </div>
      )}
    </div>
  );

  // Render mission details panel
  const renderMissionDetails = (mission: Mission) => (
    <div className="mission-details-panel">
      <div className="details-header">
        <h4>{mission.title}</h4>
        <button 
          className="close-details-btn"
          onClick={() => setSelectedMission(null)}
        >
          ✕
        </button>
      </div>

      <div className="details-content">
        <div className="details-section">
          <h5>📋 Description</h5>
          <p>{mission.description}</p>
        </div>

        {mission.objectives.length > 0 && (
          <div className="details-section">
            <h5>🎯 Objectives</h5>
            <div className="objectives-list">
              {mission.objectives.map((objective, index) => (
                <div key={objective.id} className={`objective-item ${objective.completed ? 'completed' : ''}`}>
                  <span className="objective-status">
                    {objective.completed ? '✅' : objective.required ? '🔴' : '🔵'}
                  </span>
                  <span className="objective-text">{objective.description}</span>
                  {objective.progress > 0 && objective.progress < 100 && (
                    <span className="objective-progress">({objective.progress}%)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {mission.rewards.length > 0 && (
          <div className="details-section">
            <h5>🏆 Rewards</h5>
            <div className="rewards-list">
              {mission.rewards.map((reward, index) => (
                <div key={index} className="reward-item">
                  <span className="reward-type">{reward.type}:</span>
                  <span className="reward-amount">{reward.amount.toLocaleString()}</span>
                  <span className="reward-description">{reward.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mission.risks.length > 0 && (
          <div className="details-section">
            <h5>⚠️ Risks</h5>
            <div className="risks-list">
              {mission.risks.map((risk, index) => (
                <div key={index} className="risk-item">
                  <span className="risk-probability">{risk.probability}%</span>
                  <span className="risk-description">{risk.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mission.gameMasterNotes && (
          <div className="details-section">
            <h5>📝 Game Master Notes</h5>
            <p className="gm-notes">{mission.gameMasterNotes}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (missionsState.loading && missionsState.activeMissions.length === 0) {
    return (
      <div className="live-missions loading">
        <div className="loading-spinner" />
        <span>Loading missions...</span>
      </div>
    );
  }

  if (missionsState.error) {
    return (
      <div className="live-missions error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>Error loading missions: {missionsState.error}</span>
        </div>
        <button onClick={fetchMissions} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="live-missions">
      <div className="missions-header">
        <h3>🎯 Missions</h3>
        <div className="missions-summary">
          <span className="active-count">{missionsState.activeMissions.length} Active</span>
          <span className="available-count">{missionsState.availableMissions.length} Available</span>
        </div>
      </div>

      <div className="missions-tabs">
        <button 
          className={`missions-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          🟢 Active ({missionsState.activeMissions.length})
        </button>
        <button 
          className={`missions-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          🔵 Available ({missionsState.availableMissions.length})
        </button>
        <button 
          className={`missions-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ✅ Recent ({missionsState.completedMissions.length})
        </button>
      </div>

      <div className="missions-content">
        {selectedMission ? (
          renderMissionDetails(selectedMission)
        ) : (
          <div className="missions-list">
            {activeTab === 'active' && (
              <>
                {missionsState.activeMissions.length === 0 ? (
                  <div className="no-missions">
                    <span className="no-missions-icon">🎯</span>
                    <span>No active missions</span>
                  </div>
                ) : (
                  missionsState.activeMissions.map(mission => renderMissionCard(mission))
                )}
              </>
            )}

            {activeTab === 'available' && (
              <>
                {missionsState.availableMissions.length === 0 ? (
                  <div className="no-missions">
                    <span className="no-missions-icon">📋</span>
                    <span>No available missions</span>
                  </div>
                ) : (
                  missionsState.availableMissions.map(mission => renderMissionCard(mission))
                )}
              </>
            )}

            {activeTab === 'completed' && (
              <>
                {missionsState.completedMissions.length === 0 ? (
                  <div className="no-missions">
                    <span className="no-missions-icon">✅</span>
                    <span>No completed missions</span>
                  </div>
                ) : (
                  missionsState.completedMissions.map(mission => renderMissionCard(mission, true))
                )}
              </>
            )}
          </div>
        )}
      </div>

      {missionsState.lastUpdate && (
        <div className="missions-footer">
          <span className="last-update">
            Last updated: {missionsState.lastUpdate.toLocaleTimeString()}
          </span>
          <button onClick={fetchMissions} className="refresh-btn" title="Refresh missions">
            🔄
          </button>
        </div>
      )}
    </div>
  );
};
