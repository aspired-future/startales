import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CabinetScreen.css';
import '../shared/StandardDesign.css';

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
    <>
      {/* Cabinet Metrics Overview - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Cabinet Members</span>
          <span className="standard-metric-value">{cabinetData?.members.length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Average Approval</span>
          <span className="standard-metric-value">{cabinetData?.averageApproval || 0}%</span>
        </div>
        <div className="standard-metric">
          <span>Cabinet Efficiency</span>
          <span className="standard-metric-value">{cabinetData?.cabinetEfficiency || 0}%</span>
        </div>
        <div className="standard-metric">
          <span>Active Tasks</span>
          <span className="standard-metric-value">{cabinetData?.totalTasks || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Active Delegations</span>
          <span className="standard-metric-value">{cabinetData?.delegations?.length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Auto Rules</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.autoAssign).length || 0}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">Cabinet Report</button>
          <button className="standard-btn government-theme">Performance Review</button>
        </div>
      </div>

      {/* Cabinet Performance Summary - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>High Performers</span>
          <span className="standard-metric-value">{cabinetData?.members.filter(m => m.performance.efficiency > 80).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Needs Attention</span>
          <span className="standard-metric-value">{cabinetData?.members.filter(m => m.performance.efficiency < 60).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Task Completion Rate</span>
          <span className="standard-metric-value">{cabinetData?.completedTasks ? Math.round((cabinetData.completedTasks / (cabinetData.totalTasks + cabinetData.completedTasks)) * 100) : 0}%</span>
        </div>
        <div className="standard-metric">
          <span>Delegation Success</span>
          <span className="standard-metric-value">{cabinetData?.delegations?.filter(d => d.isActive).length || 0}/{cabinetData?.delegations?.length || 0}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">Performance Metrics</button>
          <button className="standard-btn government-theme">Team Analysis</button>
        </div>
      </div>

      {/* Cabinet Members Summary - Full width below cards */}
              <div className="standard-panel government-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🏛️ Cabinet Members Status</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Position</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Tasks</th>
              <th>Efficiency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinetData?.members.map(member => (
              <tr key={member.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#4facfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong>{member.name}</strong>
                  </div>
                </td>
                <td>{member.position}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(member.status),
                      color: 'white'
                    }}
                  >
                    {member.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{member.approval}%</td>
                <td style={{ textAlign: 'center' }}>{member.currentTasks.length}</td>
                <td style={{ textAlign: 'center' }}>{member.performance.efficiency}%</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Profile
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

  const renderMembers = () => (
    <>
      {/* Cabinet Members Table */}
              <div className="standard-panel government-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👥 Cabinet Members</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Position</th>
              <th>Department</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Experience</th>
              <th>Efficiency</th>
              <th>Specialties</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinetData?.members.map(member => (
              <tr key={member.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#4facfe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <strong>{member.name}</strong>
                  </div>
                </td>
                <td>{member.position}</td>
                <td>{member.department}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(member.status),
                      color: 'white'
                    }}
                  >
                    {member.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{member.approval}%</td>
                <td style={{ textAlign: 'center' }}>{member.experience}y</td>
                <td style={{ textAlign: 'center' }}>{member.performance.efficiency}%</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {member.specialties.slice(0, 2).map((specialty, index) => (
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
                        {specialty}
                      </span>
                    ))}
                    {member.specialties.length > 2 && (
                      <span style={{ fontSize: '0.7rem', color: '#a0a9ba' }}>
                        +{member.specialties.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    className="standard-btn government-theme" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => setSelectedMember(member)}
                  >
                    Details
                  </button>
                </td>
              </tr>
                      ))}
        </tbody>
      </table>
        </div>
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="standard-panel government-theme">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#4facfe' }}>👤 {selectedMember.name} - {selectedMember.position}</h3>
            <button 
              className="standard-btn government-theme"
              onClick={() => setSelectedMember(null)}
              style={{ padding: '0.4rem 0.8rem' }}
            >
              ✕ Close
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {/* Performance Metrics */}
            <div>
              <h4 style={{ color: '#4facfe', marginBottom: '0.5rem' }}>📊 Performance Metrics</h4>
              <div className="standard-metric">
                <span>Efficiency</span>
                <span className="standard-metric-value">{selectedMember.performance.efficiency}%</span>
              </div>
              <div className="standard-metric">
                <span>Loyalty</span>
                <span className="standard-metric-value">{selectedMember.performance.loyalty}%</span>
              </div>
              <div className="standard-metric">
                <span>Popularity</span>
                <span className="standard-metric-value">{selectedMember.performance.popularity}%</span>
              </div>
            </div>

            {/* Current Tasks */}
            <div>
              <h4 style={{ color: '#4facfe', marginBottom: '0.5rem' }}>📋 Current Tasks ({selectedMember.currentTasks.length})</h4>
              {selectedMember.currentTasks.map(task => (
                <div key={task.id} style={{ 
                  padding: '0.5rem', 
                  marginBottom: '0.5rem', 
                  backgroundColor: 'rgba(79, 172, 254, 0.05)',
                  borderRadius: '4px',
                  border: '1px solid rgba(79, 172, 254, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{task.title}</strong>
                    <span 
                      style={{ 
                        padding: '0.2rem 0.4rem',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white'
                      }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a0a9ba' }}>
                    Progress: {task.progress}% | Due: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="standard-action-buttons" style={{ marginTop: '1rem' }}>
            <button className="standard-btn government-theme">Assign Task</button>
            <button className="standard-btn government-theme">Performance Review</button>
            <button className="standard-btn government-theme">Contact</button>
          </div>
        </div>
      )}
    </>
  );

  const renderDelegation = () => (
    <>
      {/* Delegation Overview - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Active Delegations</span>
          <span className="standard-metric-value">{cabinetData?.delegations?.filter(d => d.isActive).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Total Delegations</span>
          <span className="standard-metric-value">{cabinetData?.delegations?.length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Auto Rules</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.autoAssign).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Success Rate</span>
          <span className="standard-metric-value">{cabinetData?.delegations?.length ? Math.round((cabinetData.delegations.filter(d => d.isActive).length / cabinetData.delegations.length) * 100) : 0}%</span>
        </div>
        <div className="standard-action-buttons">
          <button 
            className={`standard-btn government-theme ${autoMode ? 'active' : ''}`}
            onClick={toggleAutoMode}
          >
            {autoMode ? '⏸️ Auto ON' : '▶️ Auto OFF'}
          </button>
          <button className="standard-btn government-theme">➕ New Delegation</button>
        </div>
      </div>

      {/* Delegation Rules Summary - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>High Priority Rules</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.priority === 'high').length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Medium Priority Rules</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.priority === 'medium').length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Low Priority Rules</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.priority === 'low').length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Auto-Assign Enabled</span>
          <span className="standard-metric-value">{cabinetData?.autoDelegationRules?.filter(r => r.autoAssign).length || 0}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">Manage Rules</button>
          <button className="standard-btn government-theme">Rule Analytics</button>
        </div>
      </div>

      {/* Active Delegations Table - Full width below cards */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Active Delegations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Scope</th>
              <th>Delegatee</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinetData?.delegations?.map(delegation => (
              <tr key={delegation.id}>
                <td>
                  <strong>{delegation.scope}</strong>
                </td>
                <td>{cabinetData.members.find(m => m.id === delegation.delegateeId)?.name || delegation.delegateeId}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {delegation.permissions.slice(0, 3).map(permission => (
                      <span 
                        key={permission}
                        style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: 'rgba(79, 172, 254, 0.1)',
                          color: '#4facfe'
                        }}
                      >
                        {permission.replace('-', ' ')}
                      </span>
                    ))}
                    {delegation.permissions.length > 3 && (
                      <span style={{ fontSize: '0.7rem', color: '#a0a9ba' }}>
                        +{delegation.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: delegation.isActive ? '#27ae60' : '#e74c3c',
                      color: 'white'
                    }}
                  >
                    {delegation.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td>{new Date(delegation.startDate).toLocaleDateString()}</td>
                <td>{delegation.endDate ? new Date(delegation.endDate).toLocaleDateString() : 'Ongoing'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    📝 Modify
                  </button>
                  <button 
                    className="standard-btn government-theme" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#e74c3c' }}
                    onClick={() => revokeDelegation(delegation.id)}
                  >
                    🚫 Revoke
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


  const renderDepartments = () => (
    <>
      {/* Department Overview - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Total Departments</span>
          <span className="standard-metric-value">{cabinetData?.departments?.length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Active Departments</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.performance.efficiency > 70).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Auto Mode Enabled</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.autoMode).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Average Efficiency</span>
          <span className="standard-metric-value">
            {cabinetData?.departments?.length ? 
              Math.round(cabinetData.departments.reduce((sum, d) => sum + d.performance.efficiency, 0) / cabinetData.departments.length) : 0}%
          </span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">➕ New Department</button>
          <button className="standard-btn government-theme">Department Report</button>
        </div>
      </div>

      {/* Department Performance Summary - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>High Efficiency</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.performance.efficiency > 80).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Medium Efficiency</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.performance.efficiency >= 60 && d.performance.efficiency <= 80).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Low Efficiency</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.performance.efficiency < 60).length || 0}</span>
        </div>
        <div className="standard-metric">
          <span>High Autonomy</span>
          <span className="standard-metric-value">{cabinetData?.departments?.filter(d => d.performance.autonomy > 80).length || 0}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">Performance Review</button>
          <button className="standard-btn government-theme">Efficiency Report</button>
        </div>
      </div>

      {/* Departments Table - Full width below cards */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🏢 Department Details</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Head</th>
              <th>Members</th>
              <th>Delegation Level</th>
              <th>Efficiency</th>
              <th>Autonomy</th>
              <th>Compliance</th>
              <th>Auto Mode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinetData?.departments?.map(department => (
              <tr key={department.id}>
                <td>
                  <strong>{department.name}</strong>
                  <br />
                  <small style={{ color: '#a0a9ba' }}>{department.description}</small>
                </td>
                <td>{cabinetData.members.find(m => m.id === department.head)?.name || 'Unassigned'}</td>
                <td style={{ textAlign: 'center' }}>{department.members.length}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: department.delegationLevel === 'high' ? '#27ae60' : 
                                     department.delegationLevel === 'medium' ? '#f39c12' : '#e74c3c',
                      color: 'white'
                    }}
                  >
                    {department.delegationLevel.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{department.performance.efficiency}%</td>
                <td style={{ textAlign: 'center' }}>{department.performance.autonomy}%</td>
                <td style={{ textAlign: 'center' }}>{department.performance.compliance}%</td>
                <td style={{ textAlign: 'center' }}>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: department.autoMode ? '#27ae60' : '#e74c3c',
                      color: 'white'
                    }}
                  >
                    {department.autoMode ? 'ON' : 'OFF'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Details
                  </button>
                  <button 
                    className="standard-btn government-theme" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => toggleDepartmentAuto(department.id)}
                  >
                    {department.autoMode ? 'Disable' : 'Enable'} Auto
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


  const renderTasks = () => (
    <>
      {/* Tasks Overview */}
      <div className="standard-panel government-theme">
        <div className="standard-metric">
          <span>Total Tasks</span>
          <span className="standard-metric-value">{cabinetData?.totalTasks || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Completed Tasks</span>
          <span className="standard-metric-value">{cabinetData?.completedTasks || 0}</span>
        </div>
        <div className="standard-metric">
          <span>Overdue Tasks</span>
          <span className="standard-metric-value">{cabinetData?.overdueTasks || 0}</span>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme">➕ New Task</button>
          <button className="standard-btn government-theme">📊 Task Report</button>
        </div>
      </div>

      {/* All Cabinet Tasks */}
              <div className="standard-panel government-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 All Cabinet Tasks</h3>
          <div className="standard-table-container">
          <table className="standard-data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinetData?.members.flatMap(member => 
              member.currentTasks.map(task => ({
                ...task,
                assignee: member.name,
                department: member.department
              }))
            ).map(task => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                </td>
                <td>{task.assignee}</td>
                <td>{task.department}</td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white'
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span 
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(task.status),
                      color: 'white'
                    }}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{task.progress}%</td>
                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="standard-btn government-theme" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Edit
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

  // Define tabs for the header
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'delegation', label: 'Delegation', icon: '🤝' },
    { id: 'departments', label: 'Departments', icon: '🏢' }
  ];

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
      tabs={tabs}
      activeTab={viewMode}
      onTabChange={(tabId) => setViewMode(tabId as 'overview' | 'members' | 'tasks' | 'delegation' | 'departments')}
    >
      <div className="standard-screen-container government-theme">
        <div className="standard-dashboard">
          {(() => {
            switch (viewMode) {
              case 'overview':
                return renderOverview();
              case 'members':
                return renderMembers();
              case 'tasks':
                return renderTasks();
              case 'delegation':
                return renderDelegation();
              case 'departments':
                return renderDepartments();
              default:
                return renderOverview();
            }
          })()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CabinetScreen;
