import React, { useState, useEffect } from 'react';
import { QuickActionModal, QuickActionProps, TabConfig } from './QuickActionModal';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface CrisisEvent {
  id: string;
  type: 'security' | 'economic' | 'natural' | 'diplomatic' | 'technological';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timeDetected: string;
  estimatedImpact: string;
  recommendedActions: string[];
  status: 'active' | 'responding' | 'resolved';
  resourcesRequired: string[];
  affectedSystems: string[];
}

interface CrisisMetrics {
  activeCrises: number;
  responseTime: string;
  resolutionRate: number;
  resourcesDeployed: number;
  systemsAffected: number;
  threatLevel: 'green' | 'yellow' | 'orange' | 'red';
}

interface ResponseTeam {
  id: string;
  name: string;
  specialization: string;
  status: 'available' | 'deployed' | 'standby';
  location: string;
  members: number;
  equipment: string[];
}

interface CrisisData {
  crises: CrisisEvent[];
  metrics: CrisisMetrics;
  responseTeams: ResponseTeam[];
  protocols: any[];
  history: any[];
}

// Tab Content Component
interface TabContentProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export const CrisisResponseScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [crisisData, setCrisisData] = useState<CrisisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'active', label: 'Active Crises', icon: '🚨' },
    { id: 'response', label: 'Response Teams', icon: '🚑' },
    { id: 'protocols', label: 'Protocols', icon: '📋' },
    { id: 'history', label: 'History', icon: '📈' }
  ];

  // Utility functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#fb7185';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ef4444';
      case 'responding': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'green': return '#10b981';
      case 'yellow': return '#f59e0b';
      case 'orange': return '#fb7185';
      case 'red': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return '🛡️';
      case 'economic': return '💰';
      case 'natural': return '🌪️';
      case 'diplomatic': return '🤝';
      case 'technological': return '⚡';
      default: return '⚠️';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/crisis-response');
      if (response.ok) {
        const apiData = await response.json();
        setCrisisData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch crisis response data:', err);
      
      // Comprehensive mock data
      const mockCrises: CrisisEvent[] = [
        {
          id: 'crisis-001',
          type: 'security',
          severity: 'high',
          title: 'Border Security Breach',
          description: 'Unauthorized vessels detected in Sector 7-Alpha',
          location: 'Outer Rim - Sector 7-Alpha',
          timeDetected: '2387.156.14:15',
          estimatedImpact: 'High - Potential infiltration risk',
          recommendedActions: ['Deploy patrol fleet', 'Increase sensor coverage', 'Alert border stations'],
          status: 'responding',
          resourcesRequired: ['3 Patrol Ships', '2 Sensor Arrays', '50 Security Personnel'],
          affectedSystems: ['Border Defense Grid', 'Sensor Network']
        },
        {
          id: 'crisis-002',
          type: 'natural',
          severity: 'critical',
          title: 'Solar Storm Incoming',
          description: 'Class X solar flare detected, ETA 6 hours',
          location: 'System-wide',
          timeDetected: '2387.156.13:45',
          estimatedImpact: 'Critical - Communications and power grid disruption',
          recommendedActions: ['Activate emergency protocols', 'Shield critical systems', 'Prepare backup power'],
          status: 'active',
          resourcesRequired: ['Emergency Power Units', 'Shielding Equipment', 'Technical Teams'],
          affectedSystems: ['Communications', 'Power Grid', 'Navigation']
        },
        {
          id: 'crisis-003',
          type: 'economic',
          severity: 'medium',
          title: 'Trade Route Disruption',
          description: 'Major shipping lane blocked by asteroid field',
          location: 'Trade Route Alpha-7',
          timeDetected: '2387.156.12:30',
          estimatedImpact: 'Medium - 15% reduction in trade volume',
          recommendedActions: ['Deploy mining ships', 'Establish alternate routes', 'Coordinate with traders'],
          status: 'responding',
          resourcesRequired: ['Mining Fleet', 'Navigation Updates', 'Traffic Control'],
          affectedSystems: ['Trade Network', 'Navigation System']
        }
      ];

      const mockMetrics: CrisisMetrics = {
        activeCrises: 2,
        responseTime: '12 minutes',
        resolutionRate: 94.2,
        resourcesDeployed: 15,
        systemsAffected: 7,
        threatLevel: 'orange'
      };

      const mockResponseTeams: ResponseTeam[] = [
        {
          id: 'team-001',
          name: 'Alpha Response Unit',
          specialization: 'Security & Defense',
          status: 'deployed',
          location: 'Sector 7-Alpha',
          members: 25,
          equipment: ['Combat Suits', 'Patrol Vehicles', 'Communication Arrays']
        },
        {
          id: 'team-002',
          name: 'Emergency Technical Team',
          specialization: 'Infrastructure & Systems',
          status: 'standby',
          location: 'Central Command',
          members: 18,
          equipment: ['Repair Drones', 'Emergency Power Units', 'Diagnostic Tools']
        },
        {
          id: 'team-003',
          name: 'Disaster Relief Corps',
          specialization: 'Natural Disasters',
          status: 'available',
          location: 'Relief Station Beta',
          members: 32,
          equipment: ['Medical Supplies', 'Rescue Equipment', 'Temporary Shelters']
        }
      ];

      const mockProtocols = [
        {
          id: 'protocol-001',
          name: 'Security Breach Response',
          type: 'security',
          steps: ['Assess threat level', 'Deploy response team', 'Secure perimeter', 'Investigate'],
          estimatedTime: '30-60 minutes',
          resources: 'Security teams, patrol ships'
        },
        {
          id: 'protocol-002',
          name: 'Natural Disaster Protocol',
          type: 'natural',
          steps: ['Issue warnings', 'Activate shelters', 'Deploy emergency teams', 'Coordinate relief'],
          estimatedTime: '2-6 hours',
          resources: 'Emergency teams, medical supplies'
        }
      ];

      const mockHistory = [
        {
          id: 'hist-001',
          date: '2387.155.08:30',
          type: 'security',
          title: 'Pirate Activity Suppressed',
          severity: 'medium',
          duration: '4 hours',
          outcome: 'Resolved - Pirates captured'
        },
        {
          id: 'hist-002',
          date: '2387.154.15:20',
          type: 'technological',
          title: 'Power Grid Failure',
          severity: 'high',
          duration: '8 hours',
          outcome: 'Resolved - Backup systems activated'
        }
      ];

      setCrisisData({
        crises: mockCrises,
        metrics: mockMetrics,
        responseTeams: mockResponseTeams,
        protocols: mockProtocols,
        history: mockHistory
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const filteredCrises = crisisData?.crises.filter(crisis => {
    const typeMatch = filterType === 'all' || crisis.type === filterType;
    const severityMatch = filterSeverity === 'all' || crisis.severity === filterSeverity;
    return typeMatch && severityMatch;
  }) || [];

  // Chart data
  const crisisTypeData = crisisData ? [
    { label: 'Security', value: crisisData.crises.filter(c => c.type === 'security').length },
    { label: 'Natural', value: crisisData.crises.filter(c => c.type === 'natural').length },
    { label: 'Economic', value: crisisData.crises.filter(c => c.type === 'economic').length },
    { label: 'Diplomatic', value: crisisData.crises.filter(c => c.type === 'diplomatic').length },
    { label: 'Tech', value: crisisData.crises.filter(c => c.type === 'technological').length }
  ] : [];

  const severityData = crisisData ? [
    { label: 'Critical', value: crisisData.crises.filter(c => c.severity === 'critical').length },
    { label: 'High', value: crisisData.crises.filter(c => c.severity === 'high').length },
    { label: 'Medium', value: crisisData.crises.filter(c => c.severity === 'medium').length },
    { label: 'Low', value: crisisData.crises.filter(c => c.severity === 'low').length }
  ] : [];

  const responseTimeData = [
    { label: 'Week 1', value: 15 },
    { label: 'Week 2', value: 12 },
    { label: 'Week 3', value: 18 },
    { label: 'Week 4', value: 10 },
    { label: 'Current', value: 12 }
  ];

  if (loading) {
    return (
      <QuickActionModal
        onClose={onClose}
        isVisible={isVisible}
        title="Crisis Response"
        icon="🚨"
        theme="security-theme"
        tabs={tabs}
        onRefresh={fetchData}
      >
        <TabContent tabId="overview">
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#a0a9ba',
            fontSize: '1.1rem'
          }}>
            Loading crisis response data...
          </div>
        </TabContent>
      </QuickActionModal>
    );
  }

  return (
    <QuickActionModal
      onClose={onClose}
      isVisible={isVisible}
      title="Crisis Response"
      icon="🚨"
      theme="security-theme"
      tabs={tabs}
      onRefresh={fetchData}
    >
      {/* Overview Tab */}
      <TabContent tabId="overview">
        {/* Crisis Metrics */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🎯 Crisis Response Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Active Crises</span>
              <span className="standard-metric-value" style={{ color: crisisData?.metrics.activeCrises > 0 ? '#ef4444' : '#10b981' }}>
                {crisisData?.metrics.activeCrises || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Avg Response Time</span>
              <span className="standard-metric-value">
                {crisisData?.metrics.responseTime || '0 min'}
              </span>
            </div>
            <div className="standard-metric">
              <span>Resolution Rate</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {crisisData?.metrics.resolutionRate || 0}%
              </span>
            </div>
            <div className="standard-metric">
              <span>Resources Deployed</span>
              <span className="standard-metric-value">
                {crisisData?.metrics.resourcesDeployed || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Systems Affected</span>
              <span className="standard-metric-value" style={{ color: crisisData?.metrics.systemsAffected > 5 ? '#f59e0b' : '#10b981' }}>
                {crisisData?.metrics.systemsAffected || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Threat Level</span>
              <span className="standard-metric-value" style={{ color: getThreatLevelColor(crisisData?.metrics.threatLevel || 'green') }}>
                {crisisData?.metrics.threatLevel?.toUpperCase() || 'GREEN'}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📊 Crisis Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Crisis Types
              </h4>
              <PieChart data={crisisTypeData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Severity Levels
              </h4>
              <BarChart data={severityData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Response Time Trend
              </h4>
              <LineChart data={responseTimeData} />
            </div>
          </div>
        </div>
      </TabContent>

      {/* Active Crises Tab */}
      <TabContent tabId="active">
        {/* Filters */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🔍 Filter Crises</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Type:</label>
              <div className="standard-action-buttons">
                {['all', 'security', 'natural', 'economic', 'diplomatic', 'technological'].map(type => (
                  <button
                    key={type}
                    className={`standard-btn security-theme ${filterType === type ? 'active' : ''}`}
                    onClick={() => setFilterType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Severity:</label>
              <div className="standard-action-buttons">
                {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                  <button
                    key={severity}
                    className={`standard-btn security-theme ${filterSeverity === severity ? 'active' : ''}`}
                    onClick={() => setFilterSeverity(severity)}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Crises List */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">🚨 Active Crisis Events</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Time Detected</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrises.map(crisis => (
                  <tr key={crisis.id}>
                    <td>
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                        {getTypeIcon(crisis.type)}
                      </span>
                      {crisis.type.charAt(0).toUpperCase() + crisis.type.slice(1)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{crisis.title}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                        {crisis.description}
                      </div>
                    </td>
                    <td>{crisis.location}</td>
                    <td>
                      <span style={{ 
                        color: getSeverityColor(crisis.severity),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {crisis.severity}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        color: getStatusColor(crisis.status),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {crisis.status}
                      </span>
                    </td>
                    <td>{crisis.timeDetected}</td>
                    <td>
                      <button 
                        className="standard-btn security-theme" 
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        onClick={() => setSelectedCrisis(crisis)}
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
      </TabContent>

      {/* Response Teams Tab */}
      <TabContent tabId="response">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">🚑 Response Teams</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Members</th>
                  <th>Equipment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {crisisData?.responseTeams.map(team => (
                  <tr key={team.id}>
                    <td style={{ fontWeight: 'bold' }}>{team.name}</td>
                    <td>{team.specialization}</td>
                    <td>
                      <span style={{ 
                        color: team.status === 'available' ? '#10b981' : 
                               team.status === 'deployed' ? '#ef4444' : '#f59e0b',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {team.status}
                      </span>
                    </td>
                    <td>{team.location}</td>
                    <td>{team.members}</td>
                    <td>
                      <div style={{ fontSize: '0.8em' }}>
                        {team.equipment.slice(0, 2).join(', ')}
                        {team.equipment.length > 2 && ` +${team.equipment.length - 2} more`}
                      </div>
                    </td>
                    <td>
                      <button className="standard-btn security-theme" style={{ fontSize: '0.8em', padding: '4px 8px' }}>
                        Deploy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* Protocols Tab */}
      <TabContent tabId="protocols">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📋 Response Protocols</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {crisisData?.protocols.map(protocol => (
              <div key={protocol.id} className="standard-card" style={{ padding: '20px' }}>
                <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px' }}>
                  {getTypeIcon(protocol.type)} {protocol.name}
                </h4>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Type:</strong> {protocol.type.charAt(0).toUpperCase() + protocol.type.slice(1)}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Estimated Time:</strong> {protocol.estimatedTime}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Required Resources:</strong> {protocol.resources}
                </div>
                <div>
                  <strong>Steps:</strong>
                  <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {protocol.steps.map((step: string, index: number) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabContent>

      {/* History Tab */}
      <TabContent tabId="history">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📈 Crisis History</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Duration</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {crisisData?.history.map(event => (
                  <tr key={event.id}>
                    <td>{event.date}</td>
                    <td>
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                        {getTypeIcon(event.type)}
                      </span>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                    <td>
                      <span style={{ 
                        color: getSeverityColor(event.severity),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {event.severity}
                      </span>
                    </td>
                    <td>{event.duration}</td>
                    <td style={{ color: '#10b981' }}>{event.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>
    </QuickActionModal>
  );
};

export default CrisisResponseScreen;
