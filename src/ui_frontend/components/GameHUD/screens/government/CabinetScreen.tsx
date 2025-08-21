import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './CabinetScreen.css';

interface CabinetMember {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar?: string;
  status: 'active' | 'busy' | 'unavailable';
  approval: number;
  experience: number;
  specialties: string[];
  currentTasks: Task[];
  performance: {
    efficiency: number;
    loyalty: number;
    popularity: number;
  };
}

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  deadline: string;
  progress: number;
}

interface CabinetData {
  members: CabinetMember[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageApproval: number;
  cabinetEfficiency: number;
}

const CabinetScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [cabinetData, setCabinetData] = useState<CabinetData | null>(null);
  const [selectedMember, setSelectedMember] = useState<CabinetMember | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'members' | 'tasks'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/cabinet/members', description: 'Get all cabinet members' },
    { method: 'GET', path: '/api/cabinet/tasks', description: 'Get cabinet task assignments' },
    { method: 'POST', path: '/api/cabinet/delegate', description: 'Delegate new task' },
    { method: 'PUT', path: '/api/cabinet/member/:id', description: 'Update member status' },
    { method: 'GET', path: '/api/cabinet/performance', description: 'Get performance metrics' }
  ];

  const fetchCabinetData = useCallback(async () => {
    try {
      // Try to fetch real data from API
      const response = await fetch('/api/cabinet/members');
      if (response.ok) {
        const data = await response.json();
        setCabinetData(data);
        return;
      }
    } catch (error) {
      console.warn('Cabinet API not available, using mock data');
    }

    // Fallback to mock data for development
    const mockData: CabinetData = {
      members: [
        {
          id: 'sec-defense',
          name: 'Admiral Sarah Chen',
          position: 'Secretary of Defense',
          department: 'Defense',
          status: 'active',
          approval: 87,
          experience: 15,
          specialties: ['Military Strategy', 'Space Defense', 'Fleet Operations'],
          currentTasks: [
            {
              id: 'def-001',
              title: 'Fleet Modernization Program',
              priority: 'high',
              status: 'in-progress',
              deadline: '2024-03-15',
              progress: 65
            },
            {
              id: 'def-002',
              title: 'Border Security Assessment',
              priority: 'medium',
              status: 'pending',
              deadline: '2024-02-28',
              progress: 0
            }
          ],
          performance: {
            efficiency: 92,
            loyalty: 95,
            popularity: 78
          }
        },
        {
          id: 'sec-treasury',
          name: 'Dr. Marcus Webb',
          position: 'Secretary of Treasury',
          department: 'Treasury',
          status: 'busy',
          approval: 73,
          experience: 12,
          specialties: ['Economic Policy', 'Budget Management', 'Trade Relations'],
          currentTasks: [
            {
              id: 'trs-001',
              title: 'Annual Budget Review',
              priority: 'critical',
              status: 'in-progress',
              deadline: '2024-02-20',
              progress: 85
            }
          ],
          performance: {
            efficiency: 88,
            loyalty: 82,
            popularity: 65
          }
        },
        {
          id: 'sec-science',
          name: 'Dr. Elena Rodriguez',
          position: 'Secretary of Science',
          department: 'Science',
          status: 'active',
          approval: 91,
          experience: 18,
          specialties: ['Research Management', 'Technology Development', 'Innovation Policy'],
          currentTasks: [
            {
              id: 'sci-001',
              title: 'Quantum Computing Initiative',
              priority: 'high',
              status: 'in-progress',
              deadline: '2024-04-01',
              progress: 42
            },
            {
              id: 'sci-002',
              title: 'Space Exploration Program',
              priority: 'medium',
              status: 'completed',
              deadline: '2024-01-30',
              progress: 100
            }
          ],
          performance: {
            efficiency: 94,
            loyalty: 89,
            popularity: 92
          }
        }
      ],
      totalTasks: 5,
      completedTasks: 1,
      overdueTasks: 0,
      averageApproval: 84,
      cabinetEfficiency: 91
    };

    setCabinetData(mockData);
  }, []);

  useEffect(() => {
    fetchCabinetData();
  }, [fetchCabinetData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4ecdc4';
      case 'busy': return '#fbbf24';
      case 'unavailable': return '#ef4444';
      default: return '#b8bcc8';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#b8bcc8';
    }
  };

  const renderOverview = () => (
    <div className="cabinet-overview">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.members.length || 0}</div>
            <div className="metric-label">Cabinet Members</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.averageApproval || 0}%</div>
            <div className="metric-label">Avg Approval</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.cabinetEfficiency || 0}%</div>
            <div className="metric-label">Efficiency</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.totalTasks || 0}</div>
            <div className="metric-label">Active Tasks</div>
          </div>
        </div>
      </div>

      <div className="cabinet-summary">
        <h3>🏛️ Cabinet Status Summary</h3>
        <div className="status-grid">
          {cabinetData?.members.map(member => (
            <div key={member.id} className="member-summary">
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(member.status) }}
                />
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-position">{member.position}</div>
                <div className="member-stats">
                  <span>📊 {member.approval}%</span>
                  <span>📋 {member.currentTasks.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="cabinet-members">
      <div className="members-list">
        {cabinetData?.members.map(member => (
          <div 
            key={member.id} 
            className={`member-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
            onClick={() => setSelectedMember(member)}
          >
            <div className="member-header">
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(member.status) }}
                />
              </div>
              <div className="member-details">
                <h4>{member.name}</h4>
                <p>{member.position}</p>
                <div className="member-metrics">
                  <span>📊 {member.approval}%</span>
                  <span>⚡ {member.performance.efficiency}%</span>
                  <span>🎯 {member.experience}y exp</span>
                </div>
              </div>
            </div>
            
            <div className="member-specialties">
              {member.specialties.map(specialty => (
                <span key={specialty} className="specialty-tag">
                  {specialty}
                </span>
              ))}
            </div>
            
            <div className="member-tasks">
              <div className="tasks-header">
                <span>📋 Tasks ({member.currentTasks.length})</span>
              </div>
              {member.currentTasks.slice(0, 2).map(task => (
                <div key={task.id} className="task-preview">
                  <div className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span 
                      className="task-priority"
                      style={{ color: getPriorityColor(task.priority) }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="task-progress">
                    <div 
                      className="progress-bar"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {selectedMember && (
        <div className="member-detail-panel">
          <div className="detail-header">
            <h3>{selectedMember.name}</h3>
            <button onClick={() => setSelectedMember(null)}>✕</button>
          </div>
          
          <div className="performance-charts">
            <div className="performance-metric">
              <label>Efficiency</label>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ width: `${selectedMember.performance.efficiency}%` }}
                />
              </div>
              <span>{selectedMember.performance.efficiency}%</span>
            </div>
            
            <div className="performance-metric">
              <label>Loyalty</label>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ width: `${selectedMember.performance.loyalty}%` }}
                />
              </div>
              <span>{selectedMember.performance.loyalty}%</span>
            </div>
            
            <div className="performance-metric">
              <label>Popularity</label>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{ width: `${selectedMember.performance.popularity}%` }}
                />
              </div>
              <span>{selectedMember.performance.popularity}%</span>
            </div>
          </div>
          
          <div className="member-actions">
            <button className="action-btn primary">📋 Assign Task</button>
            <button className="action-btn secondary">💬 Send Message</button>
            <button className="action-btn secondary">📊 View Reports</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderTasks = () => (
    <div className="cabinet-tasks">
      <div className="tasks-header">
        <h3>📋 All Cabinet Tasks</h3>
        <button className="action-btn primary">➕ New Task</button>
      </div>
      
      <div className="tasks-list">
        {cabinetData?.members.flatMap(member => 
          member.currentTasks.map(task => ({
            ...task,
            assignee: member.name,
            department: member.department
          }))
        ).map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-title">{task.title}</div>
              <div 
                className="task-priority"
                style={{ color: getPriorityColor(task.priority) }}
              >
                {task.priority.toUpperCase()}
              </div>
            </div>
            
            <div className="task-details">
              <div className="task-assignee">
                👤 {task.assignee} ({task.department})
              </div>
              <div className="task-deadline">
                📅 Due: {new Date(task.deadline).toLocaleDateString()}
              </div>
            </div>
            
            <div className="task-progress">
              <div className="progress-label">Progress: {task.progress}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
            
            <div className="task-actions">
              <button className="action-btn small">📝 Edit</button>
              <button className="action-btn small">👁️ View</button>
              <button className="action-btn small">⚡ Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchCabinetData}
    >
      <div className="cabinet-screen">
        {/* View Mode Tabs */}
        <div className="view-tabs">
          <button 
            className={`tab ${viewMode === 'overview' ? 'active' : ''}`}
            onClick={() => setViewMode('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${viewMode === 'members' ? 'active' : ''}`}
            onClick={() => setViewMode('members')}
          >
            👥 Members
          </button>
          <button 
            className={`tab ${viewMode === 'tasks' ? 'active' : ''}`}
            onClick={() => setViewMode('tasks')}
          >
            📋 Tasks
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'members' && renderMembers()}
          {viewMode === 'tasks' && renderTasks()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CabinetScreen;
