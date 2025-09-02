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
import { LineChart, PieChart, BarChart } from '../../../Charts';

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

const JointChiefsScreen: React.FC<ScreenProps> = ({ 
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
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leadership' | 'operations' | 'strategic' | 'recommendations'>('overview');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '⭐' },
    { id: 'leadership', label: 'Leadership', icon: '👨‍✈️' },
    { id: 'operations', label: 'Operations', icon: '🎯' },
    { id: 'strategic', label: 'Strategic', icon: '📋' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/joint-chiefs', description: 'Get joint chiefs data' }
  ];

  // Utility functions
  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'high': return '#10b981';
      case 'moderate': return '#fbbf24';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'approved': return '#fbbf24';
      case 'planning': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const fetchJointChiefsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/joint-chiefs');
      if (response.ok) {
        const data = await response.json();
        setJointChiefsData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch joint chiefs data:', err);
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
            activeUnits: 38,
            readiness: 'high',
            chief: 'Admiral Lisa Rodriguez'
          },
          {
            id: 'space-force',
            name: 'Space Force',
            code: 'SPACE',
            personnel: 45000,
            activeUnits: 12,
            readiness: 'moderate',
            chief: 'General Maria Volkov'
          }
        ],
        strategicPlans: [
          {
            id: 'plan_001',
            name: 'Enhanced Space Defense Initiative',
            priority: 'high',
            description: 'Develop advanced orbital defense systems',
            timeline: '5 years',
            leadService: 'Space Force',
            status: 'In Progress'
          },
          {
            id: 'plan_002',
            name: 'Joint Cyber Warfare Program',
            priority: 'high',
            description: 'Establish unified cyber defense capabilities',
            timeline: '3 years',
            leadService: 'All Services',
            status: 'Planning'
          }
        ],
        operations: [
          {
            id: 'op_001',
            name: 'Operation Sentinel',
            status: 'active',
            description: 'Border security and patrol operations',
            personnel: 25000,
            command: 'Joint Task Force Alpha',
            location: 'Border Regions'
          },
          {
            id: 'op_002',
            name: 'Operation Deep Space',
            status: 'planning',
            description: 'Deep space exploration and defense',
            personnel: 15000,
            command: 'Space Command',
            location: 'Outer Solar System'
          }
        ],
        recommendations: [
          {
            id: 'rec_001',
            title: 'Increase Space Force Budget',
            urgency: 'high',
            description: 'Allocate additional funding for space defense systems',
            from: 'General Maria Volkov',
            to: 'Joint Chiefs Council'
          },
          {
            id: 'rec_002',
            title: 'Enhance Cyber Training',
            urgency: 'medium',
            description: 'Implement comprehensive cyber warfare training program',
            from: 'Admiral Sarah Chen',
            to: 'All Service Chiefs'
          }
        ],
        metrics: {
          overallReadiness: 87,
          totalPersonnel: 315000,
          activeUnits: 95,
          totalBudget: '$45.2B'
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJointChiefsData();
  }, [fetchJointChiefsData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Military Readiness Overview - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⭐ Military Readiness Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Overall Readiness</span>
            <span className="standard-metric-value">{jointChiefsData?.metrics?.overallReadiness || 0}%</span>
          </div>
          <div className="standard-metric">
            <span>Total Personnel</span>
            <span className="standard-metric-value">{formatNumber(jointChiefsData?.metrics?.totalPersonnel || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Units</span>
            <span className="standard-metric-value">{jointChiefsData?.metrics?.activeUnits || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{jointChiefsData?.metrics?.totalBudget || '$0'}</span>
          </div>
          <div className="standard-metric">
            <span>Joint Chiefs</span>
            <span className="standard-metric-value">{jointChiefsData?.chiefs?.length || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Military Services</span>
            <span className="standard-metric-value">{jointChiefsData?.services?.length || 0}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Generate Readiness Report')}>Generate Report</button>
          <button className="standard-btn security-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Command Structure - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>👨‍✈️ Command Structure</h3>
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
              {jointChiefsData?.services?.map(service => (
                <tr key={service.id}>
                  <td><strong>{service.name}</strong></td>
                  <td>{service.code}</td>
                  <td>{formatNumber(service.personnel)}</td>
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
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Joint Chiefs Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel security-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📈 Joint Chiefs Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={jointChiefsData?.services?.map(service => ({
                  label: service.name,
                  value: service.personnel / 1000, // Convert to thousands
                  color: getReadinessColor(service.readiness)
                }))}
                title="👥 Service Personnel (Thousands)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={jointChiefsData?.chiefs?.map((chief, index) => ({
                  label: chief.service,
                  value: 1,
                  color: ['#ef4444', '#f59e0b', '#fbbf24', '#10b981', '#6b7280'][index % 5]
                }))}
                title="👨‍✈️ Joint Chiefs by Service"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderLeadership = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>👨‍✈️ Joint Chiefs of Staff</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Leadership Analysis')}>Leadership Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Command Review')}>Command Review</button>
        </div>
        
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
              {jointChiefsData?.chiefs?.map(chief => (
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
                      backgroundColor: '#ef4444',
                      color: 'white'
                    }}>
                      {chief.service}
                    </span>
                  </td>
                  <td>{chief.yearsOfService} years</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {chief.specializations.slice(0, 2).map((spec, i) => (
                        <span key={i} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: '#f59e0b',
                          color: 'white'
                        }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOperations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🎯 Joint Operations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Operations Analysis')}>Operations Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Mission Planning')}>Mission Planning</button>
        </div>
        
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
              {jointChiefsData?.operations?.map(operation => (
                <tr key={operation.id}>
                  <td><strong>{operation.name}</strong></td>
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
                  <td>{formatNumber(operation.personnel)}</td>
                  <td>{operation.command}</td>
                  <td>{operation.location}</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStrategic = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📋 Strategic Planning</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Strategic Analysis')}>Strategic Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Plan Review')}>Plan Review</button>
        </div>
        
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
              {jointChiefsData?.strategicPlans?.map(plan => (
                <tr key={plan.id}>
                  <td><strong>{plan.name}</strong></td>
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
                  <td>{plan.status}</td>
                  <td>
                    <button className="standard-btn security-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>💡 Command Recommendations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Recommendations Analysis')}>Recommendations Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Review All')}>Review All</button>
        </div>
        
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
              {jointChiefsData?.recommendations?.map(recommendation => (
                <tr key={recommendation.id}>
                  <td><strong>{recommendation.title}</strong></td>
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
                    <button className="standard-btn security-theme">Review</button>
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
      apiEndpoints={apiEndpoints}
      onRefresh={fetchJointChiefsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && jointChiefsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'leadership' && renderLeadership()}
              {activeTab === 'operations' && renderOperations()}
              {activeTab === 'strategic' && renderStrategic()}
              {activeTab === 'recommendations' && renderRecommendations()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading joint chiefs data...' : 'No joint chiefs data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default JointChiefsScreen;
