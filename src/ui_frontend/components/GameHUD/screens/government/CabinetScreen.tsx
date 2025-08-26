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
  canAutoDelegate?: boolean;
  delegationLevel?: number;
}

interface Delegation {
  id: string;
  delegatorId: string;
  delegateeId: string;
  roleId: string;
  scope: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  permissions: string[];
}

interface AutoDelegationRule {
  id: string;
  taskType: string;
  priority: string;
  autoAssign: boolean;
  preferredMember?: string;
  conditions: string[];
}

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  members: string[];
  isDelegated: boolean;
  autoMode: boolean;
  delegationLevel: 'full' | 'partial' | 'none';
  permissions: string[];
  performance: {
    efficiency: number;
    autonomy: number;
    compliance: number;
  };
}

interface DepartmentDelegation {
  id: string;
  departmentId: string;
  delegatedTo: string;
  scope: 'full' | 'operational' | 'administrative' | 'strategic';
  permissions: string[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
  conditions: string[];
}

interface CabinetData {
  members: CabinetMember[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageApproval: number;
  cabinetEfficiency: number;
  delegations: Delegation[];
  autoDelegationRules: AutoDelegationRule[];
  pendingDelegations: number;
  autoMode: boolean;
  departments: Department[];
  departmentDelegations: DepartmentDelegation[];
}

const CabinetScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [cabinetData, setCabinetData] = useState<CabinetData | null>(null);
  const [selectedMember, setSelectedMember] = useState<CabinetMember | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'members' | 'tasks' | 'delegation' | 'departments'>('overview');
  const [autoMode, setAutoMode] = useState(false);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/cabinet/members', description: 'Get all cabinet members' },
    { method: 'GET', path: '/api/cabinet/tasks', description: 'Get cabinet task assignments' },
    { method: 'POST', path: '/api/cabinet/delegate', description: 'Delegate new task' },
    { method: 'PUT', path: '/api/cabinet/member/:id', description: 'Update member status' },
    { method: 'GET', path: '/api/cabinet/performance', description: 'Get performance metrics' },
    { method: 'GET', path: '/api/delegation/delegations', description: 'Get active delegations' },
    { method: 'POST', path: '/api/delegation/delegations', description: 'Create new delegation' },
    { method: 'DELETE', path: '/api/delegation/delegations/:id', description: 'Revoke delegation' },
    { method: 'POST', path: '/api/cabinet/auto-delegate', description: 'Auto-delegate tasks' },
    { method: 'GET', path: '/api/cabinet/auto-rules', description: 'Get auto-delegation rules' },
    { method: 'GET', path: '/api/cabinet/departments', description: 'Get all departments' },
    { method: 'POST', path: '/api/cabinet/departments/delegate', description: 'Delegate entire department' },
    { method: 'PUT', path: '/api/cabinet/departments/:id/auto', description: 'Toggle department auto-mode' },
    { method: 'GET', path: '/api/cabinet/departments/:id/status', description: 'Get department delegation status' }
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
      cabinetEfficiency: 91,
      delegations: [
        {
          id: 'del-001',
          delegatorId: 'president',
          delegateeId: 'sec-defense',
          roleId: 'defense-operations',
          scope: 'Fleet Operations',
          isActive: true,
          startDate: '2024-01-01',
          permissions: ['approve-military-budget', 'deploy-forces', 'strategic-planning']
        },
        {
          id: 'del-002',
          delegatorId: 'president',
          delegateeId: 'sec-treasury',
          roleId: 'economic-policy',
          scope: 'Budget Management',
          isActive: true,
          startDate: '2024-01-01',
          permissions: ['approve-expenditure', 'tax-policy', 'trade-agreements']
        }
      ],
      autoDelegationRules: [
        {
          id: 'rule-001',
          taskType: 'budget-review',
          priority: 'high',
          autoAssign: true,
          preferredMember: 'sec-treasury',
          conditions: ['amount < 1000000', 'department-approved']
        },
        {
          id: 'rule-002',
          taskType: 'security-assessment',
          priority: 'critical',
          autoAssign: true,
          preferredMember: 'sec-defense',
          conditions: ['threat-level < 3']
        }
      ],
      pendingDelegations: 2,
      autoMode: false,
      departments: [
        {
          id: 'defense',
          name: 'Department of Defense',
          description: 'Military operations, space defense, and national security',
          head: 'sec-defense',
          members: ['sec-defense', 'deputy-defense', 'military-advisor'],
          isDelegated: true,
          autoMode: false,
          delegationLevel: 'partial',
          permissions: ['military-operations', 'defense-budget', 'strategic-planning'],
          performance: {
            efficiency: 92,
            autonomy: 85,
            compliance: 95
          }
        },
        {
          id: 'treasury',
          name: 'Department of Treasury',
          description: 'Economic policy, budget management, and financial oversight',
          head: 'sec-treasury',
          members: ['sec-treasury', 'deputy-treasury', 'budget-director'],
          isDelegated: true,
          autoMode: true,
          delegationLevel: 'full',
          permissions: ['budget-approval', 'tax-policy', 'economic-planning'],
          performance: {
            efficiency: 88,
            autonomy: 90,
            compliance: 92
          }
        },
        {
          id: 'science',
          name: 'Department of Science',
          description: 'Research coordination, technology development, and innovation',
          head: 'sec-science',
          members: ['sec-science', 'research-director', 'tech-advisor'],
          isDelegated: false,
          autoMode: false,
          delegationLevel: 'none',
          permissions: ['research-funding', 'tech-policy', 'innovation-programs'],
          performance: {
            efficiency: 94,
            autonomy: 75,
            compliance: 89
          }
        }
      ],
      departmentDelegations: [
        {
          id: 'dept-del-001',
          departmentId: 'defense',
          delegatedTo: 'sec-defense',
          scope: 'operational',
          permissions: ['military-operations', 'tactical-decisions'],
          isActive: true,
          startDate: '2024-01-01',
          conditions: ['emergency-protocols', 'budget-limits']
        },
        {
          id: 'dept-del-002',
          departmentId: 'treasury',
          delegatedTo: 'sec-treasury',
          scope: 'full',
          permissions: ['budget-approval', 'tax-policy', 'economic-planning', 'expenditure-control'],
          isActive: true,
          startDate: '2024-01-01',
          conditions: ['quarterly-review', 'compliance-audit']
        }
      ]
    };

    setCabinetData(mockData);
  }, []);

  useEffect(() => {
    fetchCabinetData();
  }, [fetchCabinetData]);

  // Auto-delegation functionality
  const handleAutoDelegate = useCallback(async () => {
    if (!cabinetData) return;

    try {
      const response = await fetch('/api/cabinet/auto-delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          campaignId: gameContext?.campaignId || 1,
          rules: cabinetData.autoDelegationRules 
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Auto-delegation completed:', result);
        await fetchCabinetData(); // Refresh data
      }
    } catch (error) {
      console.warn('Auto-delegation failed, using mock logic');
      // Mock auto-delegation logic
      const updatedMembers = cabinetData.members.map(member => {
        const applicableRules = cabinetData.autoDelegationRules.filter(rule => 
          rule.autoAssign && rule.preferredMember === member.id
        );
        
        if (applicableRules.length > 0) {
          // Simulate auto-assigned tasks
          const newTasks = applicableRules.map(rule => ({
            id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Auto: ${rule.taskType.replace('-', ' ').toUpperCase()}`,
            priority: rule.priority as 'low' | 'medium' | 'high' | 'critical',
            status: 'pending' as const,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0,
            canAutoDelegate: true,
            delegationLevel: 1
          }));
          
          return {
            ...member,
            currentTasks: [...member.currentTasks, ...newTasks]
          };
        }
        return member;
      });

      setCabinetData(prev => prev ? {
        ...prev,
        members: updatedMembers,
        totalTasks: prev.totalTasks + updatedMembers.reduce((acc, m) => acc + m.currentTasks.length, 0) - prev.totalTasks
      } : null);
    }
  }, [cabinetData, gameContext]);

  const toggleAutoMode = useCallback(async () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    
    if (newAutoMode) {
      // Enable auto-delegation
      await handleAutoDelegate();
    }
    
    setCabinetData(prev => prev ? { ...prev, autoMode: newAutoMode } : null);
  }, [autoMode, handleAutoDelegate]);

  const createDelegation = useCallback(async (delegateeId: string, roleId: string, scope: string, permissions: string[]) => {
    try {
      const response = await fetch('/api/delegation/delegations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delegatorId: 'president',
          delegateeId,
          roleId,
          scope,
          permissions,
          campaignId: gameContext?.campaignId || 1
        })
      });

      if (response.ok) {
        await fetchCabinetData();
        return true;
      }
    } catch (error) {
      console.warn('Delegation creation failed:', error);
    }
    return false;
  }, [gameContext, fetchCabinetData]);

  const revokeDelegation = useCallback(async (delegationId: string) => {
    try {
      const response = await fetch(`/api/delegation/delegations/${delegationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'Manual revocation',
          revokedBy: 'president'
        })
      });

      if (response.ok) {
        await fetchCabinetData();
        return true;
      }
    } catch (error) {
      console.warn('Delegation revocation failed:', error);
    }
    return false;
  }, [fetchCabinetData]);

  // Department delegation functions
  const toggleDepartmentAuto = useCallback(async (departmentId: string) => {
    try {
      const response = await fetch(`/api/cabinet/departments/${departmentId}/auto`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        await fetchCabinetData();
        return true;
      }
    } catch (error) {
      console.warn('Department auto-toggle failed, using mock logic');
      // Mock toggle logic
      setCabinetData(prev => {
        if (!prev) return null;
        
        const updatedDepartments = prev.departments.map(dept => 
          dept.id === departmentId 
            ? { ...dept, autoMode: !dept.autoMode }
            : dept
        );
        
        return { ...prev, departments: updatedDepartments };
      });
    }
    return false;
  }, [fetchCabinetData]);

  const delegateDepartment = useCallback(async (departmentId: string, scope: 'full' | 'operational' | 'administrative' | 'strategic') => {
    try {
      const response = await fetch('/api/cabinet/departments/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departmentId,
          scope,
          campaignId: gameContext?.campaignId || 1
        })
      });

      if (response.ok) {
        await fetchCabinetData();
        return true;
      }
    } catch (error) {
      console.warn('Department delegation failed, using mock logic');
      // Mock delegation logic
      setCabinetData(prev => {
        if (!prev) return null;
        
        const updatedDepartments = prev.departments.map(dept => 
          dept.id === departmentId 
            ? { 
                ...dept, 
                isDelegated: true, 
                delegationLevel: scope === 'full' ? 'full' : 'partial' 
              }
            : dept
        );
        
        return { ...prev, departments: updatedDepartments };
      });
    }
    return false;
  }, [gameContext, fetchCabinetData]);

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

        <div className="metric-card">
          <div className="metric-icon">🤝</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.delegations?.length || 0}</div>
            <div className="metric-label">Active Delegations</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.autoAssign).length || 0}</div>
            <div className="metric-label">Auto Rules</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.departments?.length || 0}</div>
            <div className="metric-label">Departments</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔄</div>
          <div className="metric-content">
            <div className="metric-value">{cabinetData?.departments?.filter(d => d.isDelegated).length || 0}</div>
            <div className="metric-label">Delegated Depts</div>
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

  const renderDelegation = () => (
    <div className="delegation-management">
      <div className="delegation-header">
        <h3>🤝 Delegation Management</h3>
        <div className="delegation-controls">
          <button 
            className={`auto-toggle ${autoMode ? 'active' : ''}`}
            onClick={toggleAutoMode}
          >
            {autoMode ? '⏸️ Auto ON' : '▶️ Auto OFF'}
          </button>
          <button className="action-btn primary">➕ New Delegation</button>
        </div>
      </div>

      <div className="delegation-tabs">
        <div className="tab-section">
          <h4>📋 Active Delegations</h4>
          <div className="delegations-list">
            {cabinetData?.delegations?.map(delegation => (
              <div key={delegation.id} className="delegation-card">
                <div className="delegation-header">
                  <div className="delegation-info">
                    <h5>{delegation.scope}</h5>
                    <p>👤 {cabinetData.members.find(m => m.id === delegation.delegateeId)?.name || delegation.delegateeId}</p>
                  </div>
                  <div className="delegation-status">
                    <span className={`status ${delegation.isActive ? 'active' : 'inactive'}`}>
                      {delegation.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="delegation-details">
                  <div className="delegation-permissions">
                    <strong>Permissions:</strong>
                    <div className="permissions-list">
                      {delegation.permissions.map(permission => (
                        <span key={permission} className="permission-tag">
                          {permission.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="delegation-dates">
                    <span>📅 Start: {new Date(delegation.startDate).toLocaleDateString()}</span>
                    {delegation.endDate && (
                      <span>📅 End: {new Date(delegation.endDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="delegation-actions">
                  <button className="action-btn small">📝 Modify</button>
                  <button 
                    className="action-btn small danger"
                    onClick={() => revokeDelegation(delegation.id)}
                  >
                    🚫 Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-section">
          <h4>⚡ Auto-Delegation Rules</h4>
          <div className="auto-rules-list">
            {cabinetData?.autoDelegationRules?.map(rule => (
              <div key={rule.id} className="auto-rule-card">
                <div className="rule-header">
                  <h5>{rule.taskType.replace('-', ' ').toUpperCase()}</h5>
                  <div className="rule-toggle">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={rule.autoAssign}
                        onChange={() => {
                          // Toggle rule logic would go here
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="rule-details">
                  <div className="rule-info">
                    <span className={`priority ${rule.priority}`}>
                      {rule.priority.toUpperCase()} Priority
                    </span>
                    <span>👤 {cabinetData.members.find(m => m.id === rule.preferredMember)?.name || 'Any Member'}</span>
                  </div>
                  
                  <div className="rule-conditions">
                    <strong>Conditions:</strong>
                    <ul>
                      {rule.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="departments-management">
      <div className="departments-header">
        <h3>🏢 Department Management</h3>
        <div className="departments-controls">
          <button className="action-btn primary">➕ New Department</button>
        </div>
      </div>

      <div className="departments-grid">
        {cabinetData?.departments?.map(department => (
          <div key={department.id} className="department-card">
            <div className="department-header">
              <div className="department-info">
                <h4>{department.name}</h4>
                <p>{department.description}</p>
              </div>
              <div className="department-status">
                <span className={`delegation-level ${department.delegationLevel}`}>
                  {department.delegationLevel.toUpperCase()}
                </span>
                <div className="auto-toggle-wrapper">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={department.autoMode}
                      onChange={() => toggleDepartmentAuto(department.id)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="auto-label">Auto</span>
                </div>
              </div>
            </div>

            <div className="department-details">
              <div className="department-head">
                <strong>Head:</strong> {cabinetData.members.find(m => m.id === department.head)?.name || 'Unassigned'}
              </div>
              
              <div className="department-members">
                <strong>Members:</strong> {department.members.length}
                <div className="members-list">
                  {department.members.slice(0, 3).map(memberId => {
                    const member = cabinetData.members.find(m => m.id === memberId);
                    return member ? (
                      <span key={memberId} className="member-tag">
                        {member.name.split(' ')[0]}
                      </span>
                    ) : null;
                  })}
                  {department.members.length > 3 && (
                    <span className="member-tag more">+{department.members.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="department-permissions">
                <strong>Permissions:</strong>
                <div className="permissions-list">
                  {department.permissions.map(permission => (
                    <span key={permission} className="permission-tag">
                      {permission.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="department-performance">
                <div className="performance-metrics">
                  <div className="metric">
                    <label>Efficiency</label>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill"
                        style={{ width: `${department.performance.efficiency}%` }}
                      />
                    </div>
                    <span>{department.performance.efficiency}%</span>
                  </div>
                  
                  <div className="metric">
                    <label>Autonomy</label>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill"
                        style={{ width: `${department.performance.autonomy}%` }}
                      />
                    </div>
                    <span>{department.performance.autonomy}%</span>
                  </div>
                  
                  <div className="metric">
                    <label>Compliance</label>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill"
                        style={{ width: `${department.performance.compliance}%` }}
                      />
                    </div>
                    <span>{department.performance.compliance}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="department-actions">
              <button 
                className="action-btn small"
                onClick={() => delegateDepartment(department.id, 'full')}
                disabled={department.isDelegated && department.delegationLevel === 'full'}
              >
                🔄 Full Delegation
              </button>
              <button 
                className="action-btn small"
                onClick={() => delegateDepartment(department.id, 'operational')}
                disabled={department.isDelegated && department.delegationLevel !== 'none'}
              >
                ⚙️ Operational
              </button>
              <button className="action-btn small">📊 Analytics</button>
              <button className="action-btn small">⚙️ Settings</button>
            </div>
          </div>
        ))}
      </div>

      <div className="department-summary">
        <h4>📈 Department Performance Summary</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Average Efficiency:</span>
            <span className="stat-value">
              {Math.round(
                (cabinetData?.departments?.reduce((sum, d) => sum + d.performance.efficiency, 0) || 0) / 
                (cabinetData?.departments?.length || 1)
              )}%
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Departments on Auto:</span>
            <span className="stat-value">
              {cabinetData?.departments?.filter(d => d.autoMode).length || 0} / {cabinetData?.departments?.length || 0}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Fully Delegated:</span>
            <span className="stat-value">
              {cabinetData?.departments?.filter(d => d.delegationLevel === 'full').length || 0}
            </span>
          </div>
        </div>
      </div>
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
      customAutoAction={toggleAutoMode}
      autoActionLabel={autoMode ? "Auto ON" : "Auto OFF"}
      autoActionActive={autoMode}
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
          <button 
            className={`tab ${viewMode === 'delegation' ? 'active' : ''}`}
            onClick={() => setViewMode('delegation')}
          >
            🤝 Delegation
          </button>
          <button 
            className={`tab ${viewMode === 'departments' ? 'active' : ''}`}
            onClick={() => setViewMode('departments')}
          >
            🏢 Departments
          </button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'members' && renderMembers()}
          {viewMode === 'tasks' && renderTasks()}
          {viewMode === 'delegation' && renderDelegation()}
          {viewMode === 'departments' && renderDepartments()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CabinetScreen;
