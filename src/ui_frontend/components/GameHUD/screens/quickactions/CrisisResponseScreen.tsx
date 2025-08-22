import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';

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

  useEffect(() => {
    if (isVisible) {
      loadCrisisData();
    }
  }, [isVisible]);

  const loadCrisisData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCrises: CrisisEvent[] = [
        {
          id: 'crisis-001',
          type: 'security',
          severity: 'high',
          title: 'Pirate Fleet Detected in Outer Rim',
          description: 'Large pirate fleet spotted near trade routes in the Kepler sector. Estimated 15 vessels with heavy armament.',
          location: 'Kepler Sector, Grid 7-Alpha',
          timeDetected: '2387.156.14:23',
          estimatedImpact: 'Trade disruption, potential civilian casualties',
          recommendedActions: [
            'Deploy naval patrol fleet',
            'Issue travel advisory',
            'Coordinate with local security forces',
            'Activate emergency protocols'
          ],
          status: 'active',
          resourcesRequired: ['Naval Fleet', 'Intelligence Assets', 'Emergency Response Teams'],
          affectedSystems: ['Trade', 'Security', 'Transportation']
        },
        {
          id: 'crisis-002',
          type: 'economic',
          severity: 'medium',
          title: 'Currency Fluctuation in Centauri Markets',
          description: 'Significant volatility detected in Centauri credit exchange rates, potentially affecting interstellar trade.',
          location: 'Alpha Centauri Financial District',
          timeDetected: '2387.156.12:45',
          estimatedImpact: 'Trade value reduction, market instability',
          recommendedActions: [
            'Activate market stabilization protocols',
            'Coordinate with Central Bank',
            'Issue public statement',
            'Monitor trading patterns'
          ],
          status: 'responding',
          resourcesRequired: ['Financial Analysts', 'Market Intervention Fund', 'Communications Team'],
          affectedSystems: ['Economy', 'Trade', 'Banking']
        },
        {
          id: 'crisis-003',
          type: 'natural',
          severity: 'critical',
          title: 'Solar Storm Approaching Terra Nova',
          description: 'Class X solar flare detected, expected to impact Terra Nova in 6 hours. Potential for widespread power grid disruption.',
          location: 'Terra Nova System',
          timeDetected: '2387.156.08:15',
          estimatedImpact: 'Power grid failure, communication disruption, satellite damage',
          recommendedActions: [
            'Activate emergency power protocols',
            'Issue evacuation orders for affected areas',
            'Prepare backup communication systems',
            'Deploy emergency response teams'
          ],
          status: 'active',
          resourcesRequired: ['Emergency Services', 'Power Grid Engineers', 'Medical Teams', 'Communications'],
          affectedSystems: ['Power Grid', 'Communications', 'Transportation', 'Health Services']
        }
      ];

      const mockMetrics: CrisisMetrics = {
        activeCrises: mockCrises.filter(c => c.status === 'active').length,
        responseTime: '12 minutes',
        resolutionRate: 87,
        resourcesDeployed: 15,
        systemsAffected: 8,
        threatLevel: 'orange'
      };

      setCrises(mockCrises);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load crisis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrisisAction = async (crisisId: string, action: string) => {
    console.log(`Executing action "${action}" for crisis ${crisisId}`);
    // Simulate action execution
    setCrises(prev => prev.map(crisis => 
      crisis.id === crisisId 
        ? { ...crisis, status: 'responding' as const }
        : crisis
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'red': return '#dc3545';
      case 'orange': return '#fd7e14';
      case 'yellow': return '#ffc107';
      case 'green': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <QuickActionBase
        title="Crisis Response Center"
        icon="🚨"
        onClose={onClose}
        isVisible={isVisible}
        className="crisis-response"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ color: '#4ecdc4', fontSize: '18px' }}>Loading crisis data...</div>
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
      className="crisis-response"
    >
      {/* Crisis Metrics */}
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-value" style={{ color: getSeverityColor(metrics?.activeCrises > 2 ? 'high' : 'medium') }}>
            {metrics?.activeCrises || 0}
          </div>
          <div className="metric-label">Active Crises</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics?.responseTime || 'N/A'}</div>
          <div className="metric-label">Avg Response Time</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics?.resolutionRate || 0}%</div>
          <div className="metric-label">Resolution Rate</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{metrics?.resourcesDeployed || 0}</div>
          <div className="metric-label">Resources Deployed</div>
        </div>
        <div className="metric-item">
          <div className="metric-value" style={{ color: getThreatLevelColor(metrics?.threatLevel || 'green') }}>
            {(metrics?.threatLevel || 'green').toUpperCase()}
          </div>
          <div className="metric-label">Threat Level</div>
        </div>
      </div>

      {/* Active Crises */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🚨 Active Crisis Events</h3>
        <div className="action-grid">
          {crises.map(crisis => (
            <div key={crisis.id} className="action-card">
              <h3 style={{ color: getSeverityColor(crisis.severity) }}>
                {crisis.type === 'security' && '🛡️'}
                {crisis.type === 'economic' && '💰'}
                {crisis.type === 'natural' && '🌪️'}
                {crisis.type === 'diplomatic' && '🤝'}
                {crisis.type === 'technological' && '⚡'}
                {crisis.title}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`status-indicator ${crisis.severity === 'critical' ? 'critical' : crisis.severity === 'high' ? 'warning' : 'online'}`}>
                  {crisis.severity.toUpperCase()}
                </span>
                <span className={`status-indicator ${crisis.status === 'active' ? 'critical' : crisis.status === 'responding' ? 'warning' : 'online'}`} style={{ marginLeft: '10px' }}>
                  {crisis.status.toUpperCase()}
                </span>
              </div>
              <p>{crisis.description}</p>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
                <div>📍 Location: {crisis.location}</div>
                <div>⏰ Detected: {crisis.timeDetected}</div>
                <div>💥 Impact: {crisis.estimatedImpact}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="action-btn urgent"
                  onClick={() => setSelectedCrisis(crisis)}
                >
                  📋 View Details
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleCrisisAction(crisis.id, 'deploy_response')}
                  disabled={crisis.status === 'responding'}
                >
                  🚀 Deploy Response
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>⚡ Quick Response Actions</h3>
        <div className="action-grid">
          <div className="action-card">
            <h3>🚨 Emergency Alert System</h3>
            <p>Broadcast emergency alerts to all citizens and systems</p>
            <button className="action-btn urgent">Activate Alert System</button>
          </div>
          <div className="action-card">
            <h3>🛡️ Defense Condition</h3>
            <p>Adjust galaxy-wide defense readiness level</p>
            <button className="action-btn">Raise Defense Level</button>
          </div>
          <div className="action-card">
            <h3>📞 Emergency Council</h3>
            <p>Convene emergency session with key advisors</p>
            <button className="action-btn">Convene Council</button>
          </div>
          <div className="action-card">
            <h3>💰 Emergency Funds</h3>
            <p>Authorize emergency resource allocation</p>
            <button className="action-btn secondary">Authorize Funds</button>
          </div>
        </div>
      </div>

      {/* Crisis Detail Modal */}
      {selectedCrisis && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
            border: '2px solid #4ecdc4',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#4ecdc4', margin: 0 }}>{selectedCrisis.title}</h2>
              <button 
                onClick={() => setSelectedCrisis(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #ff453a',
                  color: '#ff453a',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📋 Recommended Actions:</h4>
              <ul style={{ color: '#ccc' }}>
                {selectedCrisis.recommendedActions.map((action, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{action}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>🔧 Required Resources:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedCrisis.resourcesRequired.map((resource, index) => (
                  <span key={index} className="status-indicator online">{resource}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>⚠️ Affected Systems:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {selectedCrisis.affectedSystems.map((system, index) => (
                  <span key={index} className="status-indicator warning">{system}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="action-btn urgent"
                onClick={() => {
                  handleCrisisAction(selectedCrisis.id, 'execute_response');
                  setSelectedCrisis(null);
                }}
              >
                🚀 Execute Response Plan
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedCrisis(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default CrisisResponseScreen;
