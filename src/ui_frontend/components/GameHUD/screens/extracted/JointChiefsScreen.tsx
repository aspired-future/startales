/**
 * Joint Chiefs Screen - Military Command Hierarchy and Strategic Coordination
 * 
 * This screen focuses on military leadership and command structure including:
 * - Joint Chiefs of Staff and service chiefs
 * - Military command hierarchy and chain of command
 * - Inter-service coordination and joint operations
 * - Strategic military planning and doctrine
 * - Service-specific leadership and specializations
 * 
 * Distinct from:
 * - Military Screen: Operational forces, fleets, bases, tactical operations
 * - Defense Screen: Civilian defense policy, budget allocation, strategic planning
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './JointChiefsScreen.css';
import '../shared/StandardDesign.css';

interface JointChiefsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface JointChief {
  id: string;
  name: string;
  rank: string;
  position: string;
  yearsOfService: number;
  specializations: string[];
  service: string;
}

interface MilitaryService {
  id: string;
  name: string;
  code: string;
  personnel: number;
  activeUnits: number;
  readiness: 'low' | 'moderate' | 'high';
  chief: string;
}

interface StrategicPlan {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  timeline: string;
  leadService: string;
  status: string;
}

interface JointOperation {
  id: string;
  name: string;
  status: 'planning' | 'approved' | 'active' | 'completed';
  description: string;
  personnel: number;
  command: string;
  location: string;
}

interface CommandRecommendation {
  id: string;
  title: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  from: string;
  to: string;
}

interface ReadinessMetrics {
  overallReadiness: number;
  totalPersonnel: number;
  activeUnits: number;
  totalBudget: string;
}

// Define tabs for the header
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '⭐' },
  { id: 'leadership', label: 'Military Leadership', icon: '👨‍✈️' },
  { id: 'operations', label: 'Operations', icon: '🎯' },
  { id: 'strategic', label: 'Strategic', icon: '📋' },
  { id: 'recommendations', label: 'Recommendations', icon: '💡' }
];

const JointChiefsScreen: React.FC<JointChiefsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [jointChiefsData, setJointChiefsData] = useState<{
    chiefs: JointChief[];
    services: MilitaryService[];
    strategicPlans: StrategicPlan[];
    operations: JointOperation[];
    recommendations: CommandRecommendation[];
    metrics: ReadinessMetrics;
  }>({
    chiefs: [],
    services: [],
    strategicPlans: [],
    operations: [],
    recommendations: [],
    metrics: {
      overallReadiness: 0,
      totalPersonnel: 0,
      activeUnits: 0,
      totalBudget: '$0'
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'operations' | 'strategic' | 'recommendations'>('overview');

  const fetchJointChiefsData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('/api/joint-chiefs/');
      
      if (!response.ok) {
        throw new Error('API not available');
      }
      
      const data = await response.json();
      if (data.success) {
        setJointChiefsData(data.data);
      }
    } catch (err) {
      console.warn('Joint Chiefs API not available, using mock data');
      // Use comprehensive mock data
      setJointChiefsData({
        chiefs: [
          {
            id: 'chief_001',
            name: 'General Marcus Sterling',
            rank: 'General',
            position: 'Chairman of Joint Chiefs',
            yearsOfService: 32,
            specializations: ['Strategic Planning', 'Joint Operations', 'Defense Policy'],
            service: 'Command Authority'
          },
          {
            id: 'chief_002',
            name: 'Admiral Sarah Chen',
            rank: 'Admiral',
            position: 'Vice Chairman',
            yearsOfService: 28,
            specializations: ['Naval Operations', 'Space Warfare', 'Intelligence'],
            service: 'Deputy Command'
          },
          {
            id: 'chief_003',
            name: 'General Robert Hayes',
            rank: 'General',
            position: 'Army Chief of Staff',
            yearsOfService: 30,
            specializations: ['Ground Operations', 'Logistics', 'Personnel'],
            service: 'Army'
          },
          {
            id: 'chief_004',
            name: 'Admiral Lisa Rodriguez',
            rank: 'Admiral',
            position: 'Chief of Naval Operations',
            yearsOfService: 26,
            specializations: ['Naval Strategy', 'Maritime Security', 'Fleet Operations'],
            service: 'Navy'
          },
          {
            id: 'chief_005',
            name: 'General Maria Volkov',
            rank: 'General',
            position: 'Space Force Chief',
            yearsOfService: 22,
            specializations: ['Space Operations', 'Satellite Systems', 'Orbital Defense'],
            service: 'Space Force'
          }
        ],
                  services: [
            {
              id: 'army',
              name: 'Army',
              code: 'ARMY',
              personnel: 150000,
              activeUnits: 45,
              readiness: 'high',
              chief: 'General Robert Hayes'
            },
            {
              id: 'navy',
              name: 'Navy',
              code: 'NAVY',
              personnel: 120000,
              activeUnits: 35,
              readiness: 'high',
              chief: 'Admiral Lisa Rodriguez'
            },
            {
              id: 'airforce',
              name: 'Air Force',
              code: 'AIR',
              personnel: 100000,
              activeUnits: 40,
              readiness: 'moderate',
              chief: 'General David Kim'
            },
            {
              id: 'spaceforce',
              name: 'Space Force',
              code: 'SPACE',
              personnel: 50000,
              activeUnits: 25,
              readiness: 'high',
              chief: 'General Maria Volkov'
            },
            {
              id: 'marines',
              name: 'Marines',
              code: 'MARINE',
              personnel: 80000,
              activeUnits: 20,
              readiness: 'high',
              chief: 'General James Thompson'
            },
            {
              id: 'cyberforce',
              name: 'Cyber Force',
              code: 'CYBER',
              personnel: 75000,
              activeUnits: 30,
              readiness: 'high',
              chief: 'General Alex Chen'
            }
          ],
        strategicPlans: [
          {
            id: 'plan_001',
            name: 'Operation Stellar Shield',
            priority: 'high',
            description: 'Comprehensive orbital defense network',
            timeline: '18 months',
            leadService: 'Space Force',
            status: 'Under Review'
          },
          {
            id: 'plan_002',
            name: 'Joint Readiness Enhancement',
            priority: 'medium',
            description: 'Inter-service coordination improvement',
            timeline: '12 months',
            leadService: 'Army',
            status: 'Draft'
          },
          {
            id: 'plan_003',
            name: 'Cyber Defense Modernization',
            priority: 'high',
            description: 'Advanced cyber warfare capabilities',
            timeline: '24 months',
            leadService: 'Air Force',
            status: 'Approved'
          }
        ],
        operations: [
          {
            id: 'op_001',
            name: 'Exercise Thunder Strike',
            status: 'active',
            description: 'Multi-service training exercise',
            personnel: 15000,
            command: 'Army',
            location: 'Sector 7'
          },
          {
            id: 'op_002',
            name: 'Operation Deep Space',
            status: 'planning',
            description: 'Long-range reconnaissance mission',
            personnel: 2500,
            command: 'Space Force',
            location: 'Outer Rim'
          },
          {
            id: 'op_003',
            name: 'Maritime Guardian',
            status: 'approved',
            description: 'Naval patrol and security operation',
            personnel: 8000,
            command: 'Navy',
            location: 'Sector 12'
          }
        ],
        recommendations: [
          {
            id: 'rec_001',
            title: 'Enhanced Cyber Defense Initiative',
            urgency: 'high',
            description: 'Strengthen cyber warfare capabilities across all services',
            from: 'General Kim (Air Force)',
            to: 'Defense Secretary'
          },
          {
            id: 'rec_002',
            title: 'Joint Training Facility Expansion',
            urgency: 'medium',
            description: 'Expand multi-service training capabilities',
            from: 'General Sterling (Chairman)',
            to: 'Leader'
          },
          {
            id: 'rec_003',
            title: 'Personnel Exchange Program',
            urgency: 'low',
            description: 'Cross-service personnel development initiative',
            from: 'Admiral Chen (Vice Chairman)',
            to: 'Joint Chiefs'
          }
        ],
        metrics: {
          overallReadiness: 3.2,
          totalPersonnel: 520000,
          activeUnits: 165,
          totalBudget: '$110B'
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJointChiefsData();
  }, [fetchJointChiefsData]);

  const handleAction = (action: string, context?: any) => {
    console.log(`Joint Chiefs Action: ${action}`, context);
    alert(`Joint Chiefs System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'high': return '#51cf66';
      case 'moderate': return '#ffd43b';
      case 'low': return '#ff6b6b';
      default: return '#868e96';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#868e96';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '#ff6b6b';
      case 'high': return '#ff922b';
      case 'medium': return '#ffd43b';
      case 'low': return '#51cf66';
      default: return '#868e96';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#51cf66';
      case 'approved': return '#4facfe';
      case 'planning': return '#ffd43b';
      case 'completed': return '#868e96';
      default: return '#868e96';
    }
  };

  // API endpoints for the screen
  const apiEndpoints: APIEndpoint[] = [
    { name: 'Joint Chiefs Data', endpoint: '/api/joint-chiefs/', method: 'GET' },
    { name: 'Strategic Plans', endpoint: '/api/joint-chiefs/strategic-plans', method: 'GET' },
    { name: 'Operations', endpoint: '/api/joint-chiefs/operations', method: 'GET' },
    { name: 'Recommendations', endpoint: '/api/joint-chiefs/recommendations', method: 'GET' }
  ];

  // Screen data for BaseScreen
  const screenData = {
    title: 'Joint Chiefs of Staff',
    subtitle: 'Military Command Hierarchy • Strategic Planning • Joint Operations',
    lastUpdated: new Date().toISOString()
  };

  if (loading) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        screenData={screenData}
        apiEndpoints={apiEndpoints}
        onRefresh={fetchJointChiefsData}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'leadership' | 'operations' | 'strategic' | 'recommendations')}
      >
        <div className="standard-screen-container government-theme">
          <div className="loading-overlay">Loading Joint Chiefs data...</div>
        </div>
      </BaseScreen>
    );
  }

  if (error) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        screenData={screenData}
        apiEndpoints={apiEndpoints}
        onRefresh={fetchJointChiefsData}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'leadership' | 'operations' | 'strategic' | 'recommendations')}
      >
        <div className="standard-screen-container government-theme">
          <div className="error-message">Error: {error}</div>
        </div>
      </BaseScreen>
    );
  }

  const renderOverviewTab = () => (
    <>
      {/* Military Readiness Overview - First card in 2-column grid */}
      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>⭐ Military Readiness Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="standard-metric">
            <span>Overall Readiness</span>
            <span className="standard-metric-value">{jointChiefsData.metrics.overallReadiness}</span>
          </div>
          <div className="standard-metric">
            <span>Total Personnel</span>
            <span className="standard-metric-value">{(jointChiefsData.metrics.totalPersonnel / 1000).toFixed(0)}K</span>
          </div>
          <div className="standard-metric">
            <span>Active Units</span>
            <span className="standard-metric-value">{jointChiefsData.metrics.activeUnits}</span>
          </div>
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{jointChiefsData.metrics.totalBudget}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn government-theme" onClick={() => handleAction('Generate Readiness Report')}>Generate Report</button>
          <button className="standard-btn government-theme" onClick={() => handleAction('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Command Structure Overview - Second card in 2-column grid */}
      <div className="standard-panel government-theme">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👨‍✈️ Command Structure</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="standard-metric">
            <span>Joint Chiefs</span>
            <span className="standard-metric-value">{jointChiefsData.chiefs.length}</span>
          </div>
          <div className="standard-metric">
            <span>Military Services</span>
            <span className="standard-metric-value">{jointChiefsData.services.length}</span>
          </div>
          <div className="standard-metric">
            <span>Active Operations</span>
            <span className="standard-metric-value">{jointChiefsData.operations.filter(op => op.status === 'active').length}</span>
          </div>
          <div className="standard-metric">
            <span>Pending Recommendations</span>
            <span className="standard-metric-value">{jointChiefsData.recommendations.length}</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderLeadershipTab = () => (
    <>
      {/* Joint Chiefs Overview */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>👨‍✈️ Joint Chiefs of Staff</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Chief</th>
                <th>Position</th>
                <th>Service</th>
                <th>Years of Service</th>
                <th>Specializations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jointChiefsData.chiefs.map(chief => (
                <tr key={chief.id}>
                  <td>
                    <strong>{chief.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{chief.rank}</small>
                  </td>
                  <td>{chief.position}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4facfe',
                      color: 'white'
                    }}>
                      {chief.service}
                    </span>
                  </td>
                  <td>{chief.yearsOfService} years</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {chief.specializations.map((spec, i) => (
                        <span key={i} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: '#2a5298',
                          color: 'white'
                        }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Military Services Overview */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🛡️ Military Services</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Code</th>
                <th>Personnel</th>
                <th>Active Units</th>
                <th>Readiness</th>
                <th>Chief</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jointChiefsData.services.map(service => (
                <tr key={service.id}>
                  <td>
                    <strong>{service.name}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4facfe',
                      color: 'white'
                    }}>
                      {service.code}
                    </span>
                  </td>
                  <td>{service.personnel.toLocaleString()}</td>
                  <td>{service.activeUnits}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getReadinessColor(service.readiness),
                      color: 'white'
                    }}>
                      {service.readiness.charAt(0).toUpperCase() + service.readiness.slice(1)}
                    </span>
                  </td>
                  <td>{service.chief}</td>
                  <td>
                    <button className="standard-btn government-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderOperationsTab = () => (
    <>
      {/* Joint Operations Overview */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>🎯 Joint Operations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Status</th>
                <th>Description</th>
                <th>Personnel</th>
                <th>Command</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jointChiefsData.operations.map(operation => (
                <tr key={operation.id}>
                  <td>
                    <strong>{operation.name}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getStatusColor(operation.status),
                      color: 'white'
                    }}>
                      {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                    </span>
                  </td>
                  <td>{operation.description}</td>
                  <td>{operation.personnel.toLocaleString()}</td>
                  <td>{operation.command}</td>
                  <td>{operation.location}</td>
                  <td>
                    <button className="standard-btn government-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderStrategicTab = () => (
    <>
      {/* Strategic Plans Overview */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>📋 Strategic Plans</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Priority</th>
                <th>Description</th>
                <th>Timeline</th>
                <th>Lead Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jointChiefsData.strategicPlans.map(plan => (
                <tr key={plan.id}>
                  <td>
                    <strong>{plan.name}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getPriorityColor(plan.priority),
                      color: 'white'
                    }}>
                      {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                    </span>
                  </td>
                  <td>{plan.description}</td>
                  <td>{plan.timeline}</td>
                  <td>{plan.leadService}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4facfe',
                      color: 'white'
                    }}>
                      {plan.status}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn government-theme">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderRecommendationsTab = () => (
    <>
      {/* Command Recommendations Overview */}
      <div className="standard-panel government-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#4facfe' }}>💡 Command Recommendations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Recommendation</th>
                <th>Urgency</th>
                <th>Description</th>
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jointChiefsData.recommendations.map(recommendation => (
                <tr key={recommendation.id}>
                  <td>
                    <strong>{recommendation.title}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: getUrgencyColor(recommendation.urgency),
                      color: 'white'
                    }}>
                      {recommendation.urgency.charAt(0).toUpperCase() + recommendation.urgency.slice(1)}
                    </span>
                  </td>
                  <td>{recommendation.description}</td>
                  <td>{recommendation.from}</td>
                  <td>{recommendation.to}</td>
                  <td>
                    <button className="standard-btn government-theme">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      screenData={screenData}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchJointChiefsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'chiefs' | 'services' | 'operations' | 'strategic' | 'recommendations')}
    >
      <div className="standard-screen-container government-theme">
        {loading && <div className="loading-overlay">Loading Joint Chiefs data...</div>}
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && jointChiefsData && (
            <>
              {activeTab === 'overview' && renderOverviewTab()}
              
                             {/* Tab Content - Full width below cards */}
               <div style={{ gridColumn: '1 / -1' }}>
                 {activeTab === 'leadership' && renderLeadershipTab()}
                 {activeTab === 'operations' && renderOperationsTab()}
                 {activeTab === 'strategic' && renderStrategicTab()}
                 {activeTab === 'recommendations' && renderRecommendationsTab()}
               </div>
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default JointChiefsScreen;
