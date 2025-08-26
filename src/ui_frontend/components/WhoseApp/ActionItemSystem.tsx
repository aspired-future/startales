/**
 * WhoseApp Action Item System
 * Comprehensive action tracking system that integrates with characters, game state, and simulation engine
 */

import React, { useState, useEffect, useCallback } from 'react';
import './ActionItemSystem.css';

// Action Item Types and Interfaces
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedCharacterId: string;
  assignedCharacterName: string;
  assignedCharacterTitle: string;
  assignedCharacterAvatar?: string;
  
  // Action Details
  actionType: 'cabinet_decision' | 'diplomatic_mission' | 'research_project' | 'military_operation' | 'economic_policy' | 'social_initiative' | 'emergency_response' | 'investigation' | 'negotiation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  status: 'assigned' | 'in_progress' | 'awaiting_clarification' | 'blocked' | 'completed' | 'failed' | 'cancelled';
  
  // Timeline
  createdAt: Date;
  assignedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // in hours
  
  // Progress Tracking
  progressPercentage: number;
  statusUpdates: ActionStatusUpdate[];
  milestones: ActionMilestone[];
  
  // Communication
  clarificationRequests: ClarificationRequest[];
  reportBacks: ActionReportBack[];
  
  // Game Integration
  gameStateImpact: GameStateImpact[];
  simulationEffects: SimulationEffect[];
  consequences: ActionConsequence[];
  
  // Source Information
  sourceType: 'leader_command' | 'cabinet_decision' | 'delegation_auto' | 'emergency_protocol' | 'ai_recommendation' | 'character_initiative';
  sourceId?: string; // Cabinet decision ID, delegation rule ID, etc.
  
  // Dependencies
  dependencies: string[]; // Other action IDs that must complete first
  blockedBy: string[]; // Action IDs that are blocking this one
  
  // Metadata
  tags: string[];
  confidentialityLevel: 'public' | 'restricted' | 'classified' | 'top_secret';
  departmentIds: string[];
  relatedMissionIds?: string[];
}

export interface ActionStatusUpdate {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  updateType: 'progress' | 'milestone_reached' | 'obstacle_encountered' | 'resource_needed' | 'timeline_change' | 'status_change';
  message: string;
  progressPercentage?: number;
  timestamp: Date;
  attachments?: ActionAttachment[];
  gameStateChanges?: GameStateChange[];
}

export interface ActionMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
  progressPercentage: number;
  requirements: string[];
}

export interface ClarificationRequest {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  question: string;
  context: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestedAt: Date;
  response?: string;
  respondedAt?: Date;
  respondedBy?: string;
}

export interface ActionReportBack {
  id: string;
  actionId: string;
  characterId: string;
  characterName: string;
  reportType: 'completion' | 'failure' | 'partial_completion' | 'status_update' | 'obstacle_report';
  summary: string;
  details: string;
  outcomes: string[];
  recommendations?: string[];
  timestamp: Date;
  attachments?: ActionAttachment[];
  gameStateChanges: GameStateChange[];
}

export interface ActionAttachment {
  id: string;
  filename: string;
  fileType: 'document' | 'image' | 'video' | 'audio' | 'data' | 'report';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export interface GameStateImpact {
  category: 'economy' | 'military' | 'diplomacy' | 'research' | 'population' | 'environment' | 'politics' | 'infrastructure';
  subcategory: string;
  expectedChange: number;
  actualChange?: number;
  description: string;
}

export interface SimulationEffect {
  systemType: 'economic' | 'military' | 'diplomatic' | 'research' | 'social' | 'environmental';
  effectType: 'immediate' | 'short_term' | 'long_term' | 'permanent';
  magnitude: number;
  description: string;
  triggerConditions?: string[];
}

export interface ActionConsequence {
  type: 'positive' | 'negative' | 'neutral' | 'mixed';
  category: 'political' | 'economic' | 'social' | 'military' | 'diplomatic' | 'environmental';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  affectedPopulations?: string[];
  longTermEffects?: string[];
}

export interface GameStateChange {
  category: string;
  subcategory: string;
  previousValue: number;
  newValue: number;
  changeAmount: number;
  changePercentage: number;
  timestamp: Date;
  description: string;
}

// Character Profile Interfaces
export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  role: string;
  
  // Profile Information
  avatar: string;
  biography: string; // Self-written bio
  specialties: string[];
  clearanceLevel: 'public' | 'restricted' | 'classified' | 'top_secret';
  
  // WhoseApp Profile
  whoseAppProfile: {
    status: 'online' | 'away' | 'busy' | 'offline';
    statusMessage?: string;
    lastSeen: Date;
    activeConversations: string[];
    preferences: {
      notificationLevel: 'all' | 'important' | 'critical' | 'none';
      workingHours: { start: string; end: string };
      timeZone: string;
    };
  };
  
  // Witter Profile (shared with WhoseApp)
  witterProfile: {
    handle: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    verificationStatus: 'verified' | 'government' | 'department' | 'none';
    recentPosts: WitterPost[];
  };
  
  // Action Item Statistics
  actionStats: {
    totalAssigned: number;
    completed: number;
    inProgress: number;
    overdue: number;
    averageCompletionTime: number; // in hours
    successRate: number; // percentage
    currentWorkload: number; // number of active actions
  };
}

export interface WitterPost {
  id: string;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  isOfficial: boolean;
}

// Component Props
export interface ActionItemSystemProps {
  civilizationId: string;
  currentUserId: string;
  onActionCreate?: (action: Partial<ActionItem>) => void;
  onActionUpdate?: (actionId: string, updates: Partial<ActionItem>) => void;
  onCharacterProfileView?: (characterId: string) => void;
}

export const ActionItemSystem: React.FC<ActionItemSystemProps> = ({
  civilizationId,
  currentUserId,
  onActionCreate,
  onActionUpdate,
  onCharacterProfileView
}) => {
  // State Management
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'my_actions' | 'all_actions' | 'characters' | 'reports'>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCharacter, setFilterCharacter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadActionItems();
    loadCharacterProfiles();
  }, [civilizationId]);

  const loadActionItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/whoseapp/actions?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setActions(data.actions || []);
      } else {
        // Fallback to mock data for development
        setActions(generateMockActions());
      }
    } catch (err) {
      console.error('Failed to load action items:', err);
      setActions(generateMockActions());
    } finally {
      setLoading(false);
    }
  };

  const loadCharacterProfiles = async () => {
    try {
      const response = await fetch(`/api/characters/profiles?civilizationId=${civilizationId}`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data.characters || []);
      } else {
        // Fallback to mock data for development
        setCharacters(generateMockCharacters());
      }
    } catch (err) {
      console.error('Failed to load character profiles:', err);
      setCharacters(generateMockCharacters());
    }
  };

  // Filter actions based on current filters
  const filteredActions = actions.filter(action => {
    if (filterStatus !== 'all' && action.status !== filterStatus) return false;
    if (filterPriority !== 'all' && action.priority !== filterPriority) return false;
    if (filterCharacter !== 'all' && action.assignedCharacterId !== filterCharacter) return false;
    return true;
  });

  // Get character action counts for badge display
  const getCharacterActionCount = (characterId: string): number => {
    return actions.filter(action => 
      action.assignedCharacterId === characterId && 
      ['assigned', 'in_progress', 'awaiting_clarification'].includes(action.status)
    ).length;
  };

  // Handle action status updates
  const handleStatusUpdate = useCallback(async (actionId: string, update: Partial<ActionStatusUpdate>) => {
    try {
      const response = await fetch(`/api/whoseapp/actions/${actionId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });

      if (response.ok) {
        const updatedAction = await response.json();
        setActions(prev => prev.map(action => 
          action.id === actionId ? updatedAction : action
        ));
      }
    } catch (err) {
      console.error('Failed to update action status:', err);
      setError('Failed to update action status');
    }
  }, []);

  // Handle clarification requests
  const handleClarificationRequest = useCallback(async (actionId: string, request: Partial<ClarificationRequest>) => {
    try {
      const response = await fetch(`/api/whoseapp/actions/${actionId}/clarification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const updatedAction = await response.json();
        setActions(prev => prev.map(action => 
          action.id === actionId ? updatedAction : action
        ));
      }
    } catch (err) {
      console.error('Failed to submit clarification request:', err);
      setError('Failed to submit clarification request');
    }
  }, []);

  // Render action priority badge
  const renderPriorityBadge = (priority: string) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
      critical: '#9C27B0',
      urgent: '#E91E63'
    };

    return (
      <span 
        className="priority-badge" 
        style={{ 
          backgroundColor: colors[priority as keyof typeof colors],
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        {priority}
      </span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const colors = {
      assigned: '#2196F3',
      in_progress: '#FF9800',
      awaiting_clarification: '#9C27B0',
      blocked: '#F44336',
      completed: '#4CAF50',
      failed: '#F44336',
      cancelled: '#757575'
    };

    return (
      <span 
        className="status-badge" 
        style={{ 
          backgroundColor: colors[status as keyof typeof colors],
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Render character avatar with action count badge
  const renderCharacterAvatar = (character: CharacterProfile, showBadge: boolean = true) => {
    const actionCount = getCharacterActionCount(character.id);
    
    return (
      <div 
        className="character-avatar-container"
        style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
        onClick={() => onCharacterProfileView?.(character.id)}
      >
        <img 
          src={character.avatar} 
          alt={character.name}
          className="character-avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid #4ecdc4',
            objectFit: 'cover'
          }}
        />
        {showBadge && actionCount > 0 && (
          <span 
            className="action-count-badge"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#F44336',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '2px solid #0f0f23'
            }}
          >
            {actionCount}
          </span>
        )}
      </div>
    );
  };

  // Render main content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'my_actions':
        return renderMyActions();
      case 'all_actions':
        return renderAllActions();
      case 'characters':
        return renderCharacters();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="action-overview">
      <div className="overview-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div className="stat-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>Total Actions</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e8e8e8' }}>{actions.length}</div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>In Progress</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            {actions.filter(a => a.status === 'in_progress').length}
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>Awaiting Clarification</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {actions.filter(a => a.status === 'awaiting_clarification').length}
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(26, 26, 46, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(78, 205, 196, 0.2)' }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>Completed Today</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {actions.filter(a => a.status === 'completed' && a.completedAt && 
              new Date(a.completedAt).toDateString() === new Date().toDateString()).length}
          </div>
        </div>
      </div>

      <div className="recent-actions">
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Recent Action Updates</h3>
        <div className="action-list">
          {filteredActions.slice(0, 10).map(action => (
            <div 
              key={action.id} 
              className="action-item"
              style={{ 
                background: 'rgba(26, 26, 46, 0.4)', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '1px solid rgba(78, 205, 196, 0.2)',
                marginBottom: '10px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedAction(action)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {renderCharacterAvatar(characters.find(c => c.id === action.assignedCharacterId) || generateMockCharacter())}
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#e8e8e8' }}>{action.title}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      Assigned to {action.assignedCharacterName} • {action.assignedCharacterTitle}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {renderPriorityBadge(action.priority)}
                  {renderStatusBadge(action.status)}
                </div>
              </div>
              <div style={{ color: '#b8bcc8', fontSize: '14px', marginBottom: '10px' }}>
                {action.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#888' }}>
                <span>Progress: {action.progressPercentage}%</span>
                <span>Due: {action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'No deadline'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyActions = () => {
    const myActions = actions.filter(action => action.assignedCharacterId === currentUserId);
    
    return (
      <div className="my-actions">
        <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>My Actions ({myActions.length})</h3>
        <div className="action-list">
          {myActions.map(action => (
            <div key={action.id} className="action-item" style={{ marginBottom: '15px' }}>
              {/* Detailed action item rendering */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAllActions = () => (
    <div className="all-actions">
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', background: '#1a1a2e', color: '#e8e8e8', border: '1px solid #4ecdc4' }}
        >
          <option value="all">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="awaiting_clarification">Awaiting Clarification</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </select>

        <select 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', background: '#1a1a2e', color: '#e8e8e8', border: '1px solid #4ecdc4' }}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
          <option value="urgent">Urgent</option>
        </select>

        <select 
          value={filterCharacter} 
          onChange={(e) => setFilterCharacter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', background: '#1a1a2e', color: '#e8e8e8', border: '1px solid #4ecdc4' }}
        >
          <option value="all">All Characters</option>
          {characters.map(character => (
            <option key={character.id} value={character.id}>
              {character.name} - {character.title}
            </option>
          ))}
        </select>
      </div>

      <div className="action-list">
        {filteredActions.map(action => (
          <div 
            key={action.id} 
            className="action-item"
            style={{ 
              background: 'rgba(26, 26, 46, 0.4)', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid rgba(78, 205, 196, 0.2)',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedAction(action)}
          >
            {/* Action item content */}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div className="characters-view">
      <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Character Profiles</h3>
      <div className="character-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {characters.map(character => (
          <div 
            key={character.id}
            className="character-card"
            style={{ 
              background: 'rgba(26, 26, 46, 0.6)', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid rgba(78, 205, 196, 0.2)',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedCharacter(character)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              {renderCharacterAvatar(character)}
              <div>
                <h4 style={{ color: '#e8e8e8', margin: '0 0 5px 0' }}>{character.name}</h4>
                <p style={{ color: '#888', margin: '0', fontSize: '14px' }}>{character.title}</p>
                <p style={{ color: '#4ecdc4', margin: '0', fontSize: '12px' }}>{character.department}</p>
              </div>
            </div>
            
            <div className="character-stats" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>Active Actions:</span>
                <span style={{ color: '#e8e8e8', fontSize: '12px', fontWeight: 'bold' }}>
                  {character.actionStats.inProgress}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>Success Rate:</span>
                <span style={{ color: '#4CAF50', fontSize: '12px', fontWeight: 'bold' }}>
                  {character.actionStats.successRate}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: '12px' }}>Status:</span>
                <span style={{ 
                  color: character.whoseAppProfile.status === 'online' ? '#4CAF50' : '#888', 
                  fontSize: '12px', 
                  fontWeight: 'bold' 
                }}>
                  {character.whoseAppProfile.status}
                </span>
              </div>
            </div>

            <div className="character-bio" style={{ color: '#b8bcc8', fontSize: '13px', lineHeight: '1.4' }}>
              {character.biography.substring(0, 120)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-view">
      <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Action Reports & Analytics</h3>
      {/* Reports content */}
    </div>
  );

  if (loading) {
    return (
      <div className="action-system-loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: '#4ecdc4'
      }}>
        <div>Loading Action Item System...</div>
      </div>
    );
  }

  return (
    <div className="action-item-system" style={{ 
      background: 'rgba(15, 15, 35, 0.95)', 
      color: '#e8e8e8', 
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid rgba(78, 205, 196, 0.3)',
      minHeight: '600px'
    }}>
      {/* Header */}
      <div className="system-header" style={{ marginBottom: '25px' }}>
        <h2 style={{ color: '#4ecdc4', margin: '0 0 10px 0' }}>📋 Action Item System</h2>
        <p style={{ color: '#888', margin: '0' }}>
          Track and manage all character actions, Cabinet decisions, and their real-time impact on the game state
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation" style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '25px',
        borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        paddingBottom: '15px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', count: actions.length },
          { id: 'my_actions', label: '👤 My Actions', count: actions.filter(a => a.assignedCharacterId === currentUserId).length },
          { id: 'all_actions', label: '📋 All Actions', count: filteredActions.length },
          { id: 'characters', label: '👥 Characters', count: characters.length },
          { id: 'reports', label: '📈 Reports', count: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'rgba(78, 205, 196, 0.2)' : 'transparent',
              color: activeTab === tab.id ? '#4ecdc4' : '#888',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label} {tab.count > 0 && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message" style={{ 
          background: 'rgba(244, 67, 54, 0.2)', 
          color: '#F44336', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid rgba(244, 67, 54, 0.3)'
        }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      {renderContent()}

      {/* Selected Action Modal */}
      {selectedAction && (
        <ActionDetailModal 
          action={selectedAction}
          onClose={() => setSelectedAction(null)}
          onUpdate={handleStatusUpdate}
          onClarificationRequest={handleClarificationRequest}
        />
      )}

      {/* Selected Character Modal */}
      {selectedCharacter && (
        <CharacterProfileModal 
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          actions={actions.filter(a => a.assignedCharacterId === selectedCharacter.id)}
        />
      )}
    </div>
  );
};

// Action Detail Modal Component
const ActionDetailModal: React.FC<{
  action: ActionItem;
  onClose: () => void;
  onUpdate: (actionId: string, update: Partial<ActionStatusUpdate>) => void;
  onClarificationRequest: (actionId: string, request: Partial<ClarificationRequest>) => void;
}> = ({ action, onClose, onUpdate, onClarificationRequest }) => {
  return (
    <div className="modal-overlay" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0, 0, 0, 0.8)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{ 
        background: 'rgba(15, 15, 35, 0.95)', 
        padding: '30px', 
        borderRadius: '12px', 
        border: '1px solid rgba(78, 205, 196, 0.3)',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: '#e8e8e8'
      }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#4ecdc4', margin: 0 }}>{action.title}</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#888', 
              fontSize: '24px', 
              cursor: 'pointer' 
            }}
          >
            ×
          </button>
        </div>
        
        {/* Action details content */}
        <div className="action-details">
          <p><strong>Description:</strong> {action.description}</p>
          <p><strong>Assigned to:</strong> {action.assignedCharacterName} ({action.assignedCharacterTitle})</p>
          <p><strong>Status:</strong> {action.status}</p>
          <p><strong>Priority:</strong> {action.priority}</p>
          <p><strong>Progress:</strong> {action.progressPercentage}%</p>
          
          {/* Status updates, milestones, etc. */}
        </div>
      </div>
    </div>
  );
};

// Character Profile Modal Component
const CharacterProfileModal: React.FC<{
  character: CharacterProfile;
  onClose: () => void;
  actions: ActionItem[];
}> = ({ character, onClose, actions }) => {
  return (
    <div className="modal-overlay" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0, 0, 0, 0.8)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{ 
        background: 'rgba(15, 15, 35, 0.95)', 
        padding: '30px', 
        borderRadius: '12px', 
        border: '1px solid rgba(78, 205, 196, 0.3)',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: '#e8e8e8'
      }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#4ecdc4', margin: 0 }}>{character.name}</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#888', 
              fontSize: '24px', 
              cursor: 'pointer' 
            }}
          >
            ×
          </button>
        </div>
        
        {/* Character profile content */}
        <div className="character-profile-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <img 
              src={character.avatar} 
              alt={character.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #4ecdc4' }}
            />
            <div>
              <h4 style={{ color: '#e8e8e8', margin: '0 0 5px 0' }}>{character.name}</h4>
              <p style={{ color: '#888', margin: '0 0 5px 0' }}>{character.title}</p>
              <p style={{ color: '#4ecdc4', margin: '0' }}>{character.department}</p>
            </div>
          </div>
          
          <div className="biography" style={{ marginBottom: '20px' }}>
            <h5 style={{ color: '#4ecdc4' }}>Biography</h5>
            <p style={{ color: '#b8bcc8', lineHeight: '1.6' }}>{character.biography}</p>
          </div>
          
          <div className="action-summary">
            <h5 style={{ color: '#4ecdc4' }}>Current Actions ({actions.length})</h5>
            {actions.map(action => (
              <div key={action.id} style={{ 
                background: 'rgba(26, 26, 46, 0.4)', 
                padding: '10px', 
                borderRadius: '8px', 
                marginBottom: '10px',
                border: '1px solid rgba(78, 205, 196, 0.2)'
              }}>
                <div style={{ fontWeight: 'bold' }}>{action.title}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Status: {action.status} | Progress: {action.progressPercentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data generators for development
function generateMockActions(): ActionItem[] {
  return [
    {
      id: 'action_001',
      title: 'Negotiate Trade Agreement with Zephyrian Empire',
      description: 'Establish comprehensive trade relations focusing on rare minerals and advanced technology exchange',
      assignedCharacterId: 'char_diplomat_001',
      assignedCharacterName: 'Ambassador Elena Vasquez',
      assignedCharacterTitle: 'Chief Diplomatic Officer',
      assignedCharacterAvatar: '/api/characters/avatars/elena_vasquez.jpg',
      actionType: 'diplomatic_mission',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 86400000 * 3),
      assignedAt: new Date(Date.now() - 86400000 * 2),
      dueDate: new Date(Date.now() + 86400000 * 7),
      estimatedDuration: 120,
      progressPercentage: 65,
      statusUpdates: [],
      milestones: [],
      clarificationRequests: [],
      reportBacks: [],
      gameStateImpact: [
        {
          category: 'economy',
          subcategory: 'trade_volume',
          expectedChange: 25,
          description: 'Expected 25% increase in trade volume'
        }
      ],
      simulationEffects: [],
      consequences: [],
      sourceType: 'leader_command',
      dependencies: [],
      blockedBy: [],
      tags: ['diplomacy', 'trade', 'zephyrian'],
      confidentialityLevel: 'restricted',
      departmentIds: ['dept_foreign_affairs']
    },
    {
      id: 'action_002',
      title: 'Implement Emergency Economic Stimulus Package',
      description: 'Deploy immediate financial relief measures to counter recent market volatility',
      assignedCharacterId: 'char_economist_001',
      assignedCharacterName: 'Dr. Marcus Chen',
      assignedCharacterTitle: 'Economic Policy Director',
      assignedCharacterAvatar: '/api/characters/avatars/marcus_chen.jpg',
      actionType: 'economic_policy',
      priority: 'critical',
      status: 'awaiting_clarification',
      createdAt: new Date(Date.now() - 86400000 * 1),
      assignedAt: new Date(Date.now() - 86400000 * 1),
      dueDate: new Date(Date.now() + 86400000 * 3),
      estimatedDuration: 48,
      progressPercentage: 30,
      statusUpdates: [],
      milestones: [],
      clarificationRequests: [
        {
          id: 'clarif_001',
          actionId: 'action_002',
          characterId: 'char_economist_001',
          characterName: 'Dr. Marcus Chen',
          question: 'What is the maximum budget allocation approved for this stimulus package?',
          context: 'Need to determine scope of relief measures and target demographics',
          urgency: 'high',
          requestedAt: new Date(Date.now() - 3600000 * 4)
        }
      ],
      reportBacks: [],
      gameStateImpact: [
        {
          category: 'economy',
          subcategory: 'gdp_growth',
          expectedChange: 8,
          description: 'Expected 8% boost to GDP growth'
        }
      ],
      simulationEffects: [],
      consequences: [],
      sourceType: 'cabinet_decision',
      sourceId: 'cabinet_decision_045',
      dependencies: [],
      blockedBy: [],
      tags: ['economy', 'stimulus', 'emergency'],
      confidentialityLevel: 'classified',
      departmentIds: ['dept_treasury', 'dept_economic_affairs']
    }
  ];
}

function generateMockCharacters(): CharacterProfile[] {
  return [
    {
      id: 'char_diplomat_001',
      name: 'Ambassador Elena Vasquez',
      title: 'Chief Diplomatic Officer',
      department: 'Foreign Affairs',
      role: 'Senior Diplomat',
      avatar: '/api/characters/avatars/elena_vasquez.jpg',
      biography: 'A seasoned diplomat with over 20 years of experience in interstellar relations. Elena has successfully negotiated peace treaties with three major galactic powers and established trade agreements that have boosted our economy by 40%. She specializes in cultural diplomacy and has a deep understanding of alien psychology and customs.',
      specialties: ['Interstellar Diplomacy', 'Trade Negotiations', 'Cultural Relations', 'Conflict Resolution'],
      clearanceLevel: 'top_secret',
      whoseAppProfile: {
        status: 'online',
        statusMessage: 'Currently in negotiations with Zephyrian delegation',
        lastSeen: new Date(),
        activeConversations: ['conv_zephyrian_trade', 'conv_diplomatic_corps'],
        preferences: {
          notificationLevel: 'important',
          workingHours: { start: '08:00', end: '18:00' },
          timeZone: 'Galactic Standard Time'
        }
      },
      witterProfile: {
        handle: '@AmbassadorElena',
        followerCount: 125000,
        followingCount: 450,
        postCount: 2340,
        verificationStatus: 'government',
        recentPosts: [
          {
            id: 'post_001',
            content: 'Productive discussions with our Zephyrian counterparts today. Mutual respect and understanding pave the way for lasting partnerships. 🌟 #Diplomacy #GalacticUnity',
            timestamp: new Date(Date.now() - 3600000 * 2),
            likes: 1250,
            retweets: 340,
            replies: 89,
            isOfficial: true
          }
        ]
      },
      actionStats: {
        totalAssigned: 47,
        completed: 42,
        inProgress: 3,
        overdue: 0,
        averageCompletionTime: 96,
        successRate: 89,
        currentWorkload: 3
      }
    },
    {
      id: 'char_economist_001',
      name: 'Dr. Marcus Chen',
      title: 'Economic Policy Director',
      department: 'Treasury & Economic Affairs',
      role: 'Senior Economic Advisor',
      avatar: '/api/characters/avatars/marcus_chen.jpg',
      biography: 'Brilliant economist and policy strategist with a PhD in Galactic Economics from the University of New Terra. Marcus has designed economic models that predicted three major market shifts and developed the current fiscal framework that has maintained our economic stability for the past decade. He is known for his data-driven approach and innovative solutions to complex economic challenges.',
      specialties: ['Macroeconomic Policy', 'Market Analysis', 'Fiscal Strategy', 'Economic Modeling'],
      clearanceLevel: 'classified',
      whoseAppProfile: {
        status: 'busy',
        statusMessage: 'Analyzing stimulus package impact models',
        lastSeen: new Date(Date.now() - 1800000),
        activeConversations: ['conv_economic_team', 'conv_treasury_dept'],
        preferences: {
          notificationLevel: 'critical',
          workingHours: { start: '07:00', end: '20:00' },
          timeZone: 'Galactic Standard Time'
        }
      },
      witterProfile: {
        handle: '@DrMarcusChen',
        followerCount: 89000,
        followingCount: 230,
        postCount: 1876,
        verificationStatus: 'government',
        recentPosts: [
          {
            id: 'post_002',
            content: 'Market volatility requires measured responses. Our economic fundamentals remain strong, and strategic interventions will ensure continued prosperity. 📈 #Economics #Policy',
            timestamp: new Date(Date.now() - 3600000 * 6),
            likes: 890,
            retweets: 156,
            replies: 67,
            isOfficial: true
          }
        ]
      },
      actionStats: {
        totalAssigned: 34,
        completed: 29,
        inProgress: 4,
        overdue: 1,
        averageCompletionTime: 72,
        successRate: 85,
        currentWorkload: 4
      }
    }
  ];
}

function generateMockCharacter(): CharacterProfile {
  return {
    id: 'char_unknown',
    name: 'Unknown Character',
    title: 'Unknown Title',
    department: 'Unknown Department',
    role: 'Unknown Role',
    avatar: '/api/characters/avatars/default.jpg',
    biography: 'Character information not available.',
    specialties: [],
    clearanceLevel: 'public',
    whoseAppProfile: {
      status: 'offline',
      lastSeen: new Date(),
      activeConversations: [],
      preferences: {
        notificationLevel: 'all',
        workingHours: { start: '09:00', end: '17:00' },
        timeZone: 'Galactic Standard Time'
      }
    },
    witterProfile: {
      handle: '@unknown',
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      verificationStatus: 'none',
      recentPosts: []
    },
    actionStats: {
      totalAssigned: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      averageCompletionTime: 0,
      successRate: 0,
      currentWorkload: 0
    }
  };
}

export default ActionItemSystem;

