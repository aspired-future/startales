import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
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

export const CrisisResponseScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [crises, setCrises] = useState<CrisisEvent[]>([]);
  const [metrics, setMetrics] = useState<CrisisMetrics | null>(null);
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisEvent | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (isVisible) {
      loadCrisisData();
      const interval = setInterval(loadCrisisData, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadCrisisData = async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const response = await fetch('http://localhost:4000/api/crisis-response');
      if (response.ok) {
        const data = await response.json();
        setCrises(data.crises);
        setMetrics(data.metrics);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      // Comprehensive mock data
      const mockCrises: CrisisEvent[] = [
        {
          id: 'crisis-001',
          type: 'security',
          severity: 'high',
          title: 'Unauthorized Access Attempt',
          description: 'Multiple failed login attempts detected on critical government systems',
          location: 'Sector 7-G, Government District',
          timeDetected: '2387.156.14:45',
          estimatedImpact: 'Potential data breach, system compromise',
          recommendedActions: [
            'Activate security protocols',
            'Isolate affected systems',
            'Deploy cybersecurity team',
            'Monitor network traffic'
          ],
          status: 'responding',
          resourcesRequired: ['Cybersecurity Team', 'Network Analysts', 'Security Drones'],
          affectedSystems: ['Government Network', 'Citizen Database', 'Security Grid']
        },
        {
          id: 'crisis-002',
          type: 'natural',
          severity: 'critical',
          title: 'Solar Storm Warning',
          description: 'Massive solar flare detected, ETA 6 hours. Potential for widespread electromagnetic interference',
          location: 'Planet-wide',
          timeDetected: '2387.156.12:30',
          estimatedImpact: 'Communication disruption, power grid instability, satellite damage',
          recommendedActions: [
            'Activate emergency power systems',
            'Shield critical electronics',
            'Issue public warning',
            'Prepare backup communications'
          ],
          status: 'active',
          resourcesRequired: ['Engineering Teams', 'Emergency Services', 'Communication Specialists'],
          affectedSystems: ['Power Grid', 'Communications', 'Transportation', 'Satellites']
        },
        {
          id: 'crisis-003',
          type: 'economic',
          severity: 'medium',
          title: 'Market Volatility Alert',
          description: 'Unusual trading patterns detected in interstellar commodity markets',
          location: 'Financial District',
          timeDetected: '2387.156.09:15',
          estimatedImpact: 'Potential market manipulation, economic instability',
          recommendedActions: [
            'Monitor trading algorithms',
            'Investigate suspicious transactions',
            'Prepare market stabilization measures',
            'Alert regulatory bodies'
          ],
          status: 'responding',
          resourcesRequired: ['Financial Analysts', 'Market Regulators', 'AI Investigators'],
          affectedSystems: ['Trading Systems', 'Banking Network', 'Economic Monitors']
        },
        {
          id: 'crisis-004',
          type: 'diplomatic',
          severity: 'high',
          title: 'Trade Route Blockade',
          description: 'Hostile forces have established blockade of critical trade route Alpha-7',
          location: 'Alpha-7 Trade Corridor',
          timeDetected: '2387.156.08:00',
          estimatedImpact: 'Supply chain disruption, resource shortages, diplomatic tensions',
          recommendedActions: [
            'Deploy diplomatic envoys',
            'Activate alternative trade routes',
            'Prepare military escort',
            'Negotiate with hostile parties'
          ],
          status: 'active',
          resourcesRequired: ['Diplomatic Corps', 'Military Fleet', 'Trade Coordinators'],
          affectedSystems: ['Trade Network', 'Supply Chain', 'Military Command']
        },
        {
          id: 'crisis-005',
          type: 'technological',
          severity: 'low',
          title: 'AI System Anomaly',
          description: 'Minor behavioral anomaly detected in secondary AI processing unit',
          location: 'AI Core Facility B',
          timeDetected: '2387.156.13:20',
          estimatedImpact: 'Reduced processing efficiency, potential system instability',
          recommendedActions: [
            'Run diagnostic protocols',
            'Backup critical data',
            'Monitor AI behavior patterns',
            'Prepare system restart if necessary'
          ],
          status: 'resolved',
          resourcesRequired: ['AI Technicians', 'System Analysts'],
          affectedSystems: ['AI Processing Unit B', 'Data Analytics']
        }
      ];

      const mockMetrics: CrisisMetrics = {
        activeCrises: mockCrises.filter(c => c.status === 'active').length,
        responseTime: '4.2 minutes',
        resolutionRate: 87.3,
        resourcesDeployed: 15,
        systemsAffected: 8,
        threatLevel: 'orange'
      };

      setCrises(mockCrises);
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const handleCrisisAction = (crisisId: string, action: string) => {
    // Implement crisis response actions
    console.log(`Executing action "${action}" for crisis ${crisisId}`);
    // Update crisis status, deploy resources, etc.
  };

  // Chart data
  const crisisByType = [
    { label: 'Security', value: crises.filter(c => c.type === 'security').length },
    { label: 'Economic', value: crises.filter(c => c.type === 'economic').length },
    { label: 'Natural', value: crises.filter(c => c.type === 'natural').length },
    { label: 'Diplomatic', value: crises.filter(c => c.type === 'diplomatic').length },
    { label: 'Technological', value: crises.filter(c => c.type === 'technological').length }
  ];

  const crisisBySeverity = [
    { label: 'Critical', value: crises.filter(c => c.severity === 'critical').length },
    { label: 'High', value: crises.filter(c => c.severity === 'high').length },
    { label: 'Medium', value: crises.filter(c => c.severity === 'medium').length },
    { label: 'Low', value: crises.filter(c => c.severity === 'low').length }
  ];

  const responseTimeData = crises.map((crisis, index) => ({
    label: `C${index + 1}`,
    value: Math.floor(Math.random() * 30) + 1 // Mock response times
  }));

  if (loading) {
    return (
      <QuickActionBase
        title="Crisis Response Center"
        icon="🚨"
        onClose={onClose}
        isVisible={isVisible}
        className="security-theme"
      >
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'var(--security-accent)',
            fontSize: '18px'
          }}>
            Loading crisis data...
          </div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Crisis Response Center"
      icon="🚨"
      onClose={onClose}
      isVisible={isVisible}
      className="security-theme"
    >
      {/* Crisis Overview Metrics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🚨 Crisis Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Active Crises</span>
            <span className="standard-metric-value" style={{ color: '#ef4444' }}>
              {metrics?.activeCrises || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Threat Level</span>
            <span className="standard-metric-value" style={{ 
              color: getThreatLevelColor(metrics?.threatLevel || 'green'),
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              {metrics?.threatLevel || 'GREEN'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Avg Response Time</span>
            <span className="standard-metric-value">
              {metrics?.responseTime || 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Resolution Rate</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {metrics?.resolutionRate || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Resources Deployed</span>
            <span className="standard-metric-value">
              {metrics?.resourcesDeployed || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Systems Affected</span>
            <span className="standard-metric-value" style={{ color: '#f59e0b' }}>
              {metrics?.systemsAffected || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Crisis Analytics Charts */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Crisis Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Crisis Types
            </h4>
            <PieChart data={crisisByType} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Severity Levels
            </h4>
            <BarChart data={crisisBySeverity} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Response Times
            </h4>
            <LineChart data={responseTimeData} />
          </div>
        </div>
      </div>

      {/* Active Crises Table */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">⚠️ Active Crisis Events</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Location</th>
                <th>Time Detected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crises.map(crisis => (
                <tr key={crisis.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2em' }}>{getTypeIcon(crisis.type)}</span>
                      <span style={{ textTransform: 'capitalize' }}>{crisis.type}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{crisis.title}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                      {crisis.description.substring(0, 60)}...
                    </div>
                  </td>
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
                  <td style={{ fontSize: '0.9em' }}>{crisis.location}</td>
                  <td style={{ fontSize: '0.9em' }}>{crisis.timeDetected}</td>
                  <td>
                    <div className="standard-action-buttons">
                      <button
                        className="standard-btn security-theme"
                        onClick={() => setSelectedCrisis(crisis)}
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                      >
                        Details
                      </button>
                      {crisis.status === 'active' && (
                        <button
                          className="standard-btn security-theme"
                          onClick={() => handleCrisisAction(crisis.id, 'respond')}
                          style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        >
                          Respond
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crisis Detail Modal */}
      {selectedCrisis && (
        <div className="standard-card" style={{ 
          gridColumn: '1 / -1', 
          marginTop: '20px',
          border: '2px solid var(--security-accent)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }}>
          <h3 className="standard-card-title">
            {getTypeIcon(selectedCrisis.type)} {selectedCrisis.title}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px' }}>Crisis Details</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Type</span>
                  <span className="standard-metric-value">{selectedCrisis.type}</span>
                </div>
                <div className="standard-metric">
                  <span>Severity</span>
                  <span className="standard-metric-value" style={{ color: getSeverityColor(selectedCrisis.severity) }}>
                    {selectedCrisis.severity}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Status</span>
                  <span className="standard-metric-value" style={{ color: getStatusColor(selectedCrisis.status) }}>
                    {selectedCrisis.status}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Location</span>
                  <span className="standard-metric-value">{selectedCrisis.location}</span>
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>
                {selectedCrisis.description}
              </p>
              
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                <strong>Estimated Impact:</strong> {selectedCrisis.estimatedImpact}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--security-accent)', marginBottom: '10px' }}>Recommended Actions</h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                {selectedCrisis.recommendedActions.map((action, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{action}</li>
                ))}
              </ul>
              
              <h4 style={{ color: 'var(--security-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Resources Required
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedCrisis.resourcesRequired.map((resource, index) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                    color: 'var(--security-accent)'
                  }}>
                    {resource}
                  </span>
                ))}
              </div>
              
              <h4 style={{ color: 'var(--security-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Affected Systems
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedCrisis.affectedSystems.map((system, index) => (
                  <span key={index} style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                    color: 'var(--text-secondary)'
                  }}>
                    {system}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="standard-action-buttons">
            {selectedCrisis.recommendedActions.map((action, index) => (
              <button
                key={index}
                className="standard-btn security-theme"
                onClick={() => handleCrisisAction(selectedCrisis.id, action)}
              >
                {action}
              </button>
            ))}
            <button
              className="standard-btn security-theme"
              onClick={() => setSelectedCrisis(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default CrisisResponseScreen;
