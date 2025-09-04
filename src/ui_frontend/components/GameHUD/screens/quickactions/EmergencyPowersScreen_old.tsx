import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface EmergencyPower {
  id: string;
  name: string;
  category: 'military' | 'economic' | 'civil' | 'judicial' | 'diplomatic';
  severity: 'limited' | 'moderate' | 'extensive' | 'absolute';
  description: string;
  scope: string[];
  duration: string;
  requirements: string[];
  limitations: string[];
  constitutionalBasis: string;
  isActive: boolean;
  activatedAt?: string;
  expiresAt?: string;
  usageHistory: number;
}

interface EmergencyStatus {
  currentLevel: 'normal' | 'elevated' | 'high' | 'critical' | 'maximum';
  activePowers: number;
  totalAuthorizations: number;
  constitutionalCompliance: number;
  lastReview: string;
  nextReview: string;
}

export const EmergencyPowersScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [emergencyPowers, setEmergencyPowers] = useState<EmergencyPower[]>([]);
  const [status, setStatus] = useState<EmergencyStatus | null>(null);
  const [selectedPower, setSelectedPower] = useState<EmergencyPower | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Utility functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'limited': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'extensive': return '#fb7185';
      case 'absolute': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'normal': return '#10b981';
      case 'elevated': return '#f59e0b';
      case 'high': return '#fb7185';
      case 'critical': return '#ef4444';
      case 'maximum': return '#7c2d12';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'civil': return '🏛️';
      case 'judicial': return '⚖️';
      case 'diplomatic': return '🤝';
      default: return '🚨';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'military': return '#ef4444';
      case 'economic': return '#fbbf24';
      case 'civil': return '#4facfe';
      case 'judicial': return '#9333ea';
      case 'diplomatic': return '#10b981';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadEmergencyData();
      const interval = setInterval(loadEmergencyData, 120000); // Update every 2 minutes
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const loadEmergencyData = async () => {
    setLoading(true);
    try {
      // Try API first, fallback to mock data
      const response = await fetch('http://localhost:4000/api/emergency-powers');
      if (response.ok) {
        const data = await response.json();
        setEmergencyPowers(data.emergencyPowers);
        setStatus(data.status);
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      // Comprehensive mock data
      const mockEmergencyPowers: EmergencyPower[] = [
        {
          id: 'power-001',
          name: 'Martial Law Declaration',
          category: 'military',
          severity: 'absolute',
          description: 'Suspend civilian government and implement military rule',
          scope: ['All territories', 'Civil liberties', 'Judicial system'],
          duration: '30 days (renewable)',
          requirements: ['Legislative approval', 'Supreme Court review', 'Military command consent'],
          limitations: ['Cannot suspend constitution', 'Must maintain basic rights', 'Subject to judicial review'],
          constitutionalBasis: 'Article VII, Section 3 - National Emergency Powers',
          isActive: false,
          usageHistory: 2
        },
        {
          id: 'power-002',
          name: 'Economic Emergency Controls',
          category: 'economic',
          severity: 'extensive',
          description: 'Control prices, wages, and resource allocation during crisis',
          scope: ['Market operations', 'Resource distribution', 'Financial systems'],
          duration: '90 days',
          requirements: ['Economic council approval', 'Central bank coordination'],
          limitations: ['Cannot seize private property', 'Must compensate affected parties'],
          constitutionalBasis: 'Article IV, Section 8 - Economic Crisis Management',
          isActive: true,
          activatedAt: '2387.154.12:00',
          expiresAt: '2387.244.12:00',
          usageHistory: 7
        },
        {
          id: 'power-003',
          name: 'Civil Defense Mobilization',
          category: 'civil',
          severity: 'moderate',
          description: 'Mobilize civilian resources for emergency response',
          scope: ['Emergency services', 'Public transportation', 'Communication systems'],
          duration: '14 days (auto-renewable)',
          requirements: ['Emergency management approval', 'Local government coordination'],
          limitations: ['Cannot conscript civilians', 'Must maintain essential services'],
          constitutionalBasis: 'Article VI, Section 2 - Civil Emergency Response',
          isActive: true,
          activatedAt: '2387.155.08:30',
          expiresAt: '2387.169.08:30',
          usageHistory: 12
        },
        {
          id: 'power-004',
          name: 'Judicial Emergency Procedures',
          category: 'judicial',
          severity: 'limited',
          description: 'Expedite legal proceedings during crisis situations',
          scope: ['Court procedures', 'Legal timelines', 'Evidence requirements'],
          duration: '60 days',
          requirements: ['Supreme Court approval', 'Bar association consent'],
          limitations: ['Cannot suspend due process', 'Must maintain appeal rights'],
          constitutionalBasis: 'Article V, Section 4 - Emergency Judicial Powers',
          isActive: false,
          usageHistory: 5
        },
        {
          id: 'power-005',
          name: 'Diplomatic Immunity Suspension',
          category: 'diplomatic',
          severity: 'moderate',
          description: 'Suspend diplomatic immunity for security investigations',
          scope: ['Foreign diplomats', 'Embassy operations', 'International communications'],
          duration: '21 days',
          requirements: ['Foreign ministry approval', 'Security council review'],
          limitations: ['Cannot violate international law', 'Must notify affected nations'],
          constitutionalBasis: 'Article III, Section 7 - Diplomatic Emergency Authority',
          isActive: false,
          usageHistory: 1
        },
        {
          id: 'power-006',
          name: 'Information Control Measures',
          category: 'civil',
          severity: 'extensive',
          description: 'Control information flow to prevent panic and misinformation',
          scope: ['Media operations', 'Public communications', 'Information networks'],
          duration: '7 days (renewable)',
          requirements: ['Information ministry approval', 'Media council review'],
          limitations: ['Cannot suppress legitimate news', 'Must allow emergency information'],
          constitutionalBasis: 'Article VI, Section 5 - Information Emergency Controls',
          isActive: false,
          usageHistory: 3
        }
      ];

      const mockStatus: EmergencyStatus = {
        currentLevel: 'elevated',
        activePowers: mockEmergencyPowers.filter(p => p.isActive).length,
        totalAuthorizations: mockEmergencyPowers.length,
        constitutionalCompliance: 94.7,
        lastReview: '2387.155.14:00',
        nextReview: '2387.162.14:00'
      };

      setEmergencyPowers(mockEmergencyPowers);
      setStatus(mockStatus);
    } finally {
      setLoading(false);
    }
  };

  const handleActivatePower = (powerId: string) => {
    // Implement power activation
    console.log(`Activating emergency power ${powerId}`);
  };

  const handleDeactivatePower = (powerId: string) => {
    // Implement power deactivation
    console.log(`Deactivating emergency power ${powerId}`);
  };

  const filteredPowers = selectedCategory === 'all' 
    ? emergencyPowers 
    : emergencyPowers.filter(power => power.category === selectedCategory);

  // Chart data
  const powersByCategory = [
    { label: 'Military', value: emergencyPowers.filter(p => p.category === 'military').length },
    { label: 'Economic', value: emergencyPowers.filter(p => p.category === 'economic').length },
    { label: 'Civil', value: emergencyPowers.filter(p => p.category === 'civil').length },
    { label: 'Judicial', value: emergencyPowers.filter(p => p.category === 'judicial').length },
    { label: 'Diplomatic', value: emergencyPowers.filter(p => p.category === 'diplomatic').length }
  ];

  const powersBySeverity = [
    { label: 'Limited', value: emergencyPowers.filter(p => p.severity === 'limited').length },
    { label: 'Moderate', value: emergencyPowers.filter(p => p.severity === 'moderate').length },
    { label: 'Extensive', value: emergencyPowers.filter(p => p.severity === 'extensive').length },
    { label: 'Absolute', value: emergencyPowers.filter(p => p.severity === 'absolute').length }
  ];

  const usageHistoryData = emergencyPowers.map(power => ({
    label: power.name.substring(0, 10) + '...',
    value: power.usageHistory
  }));

  if (loading) {
    return (
      <QuickActionBase
        title="Emergency Powers"
        icon="🚨"
        onClose={onClose}
        isVisible={isVisible}
        className="government-theme"
      >
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'var(--gov-accent)',
            fontSize: '18px'
          }}>
            Loading emergency powers...
          </div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Emergency Powers"
      icon="🚨"
      onClose={onClose}
      isVisible={isVisible}
      className="government-theme"
    >
      {/* Emergency Status Overview */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🚨 Emergency Status</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Current Level</span>
            <span className="standard-metric-value" style={{ 
              color: getLevelColor(status?.currentLevel || 'normal'),
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}>
              {status?.currentLevel || 'NORMAL'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Active Powers</span>
            <span className="standard-metric-value" style={{ color: '#ef4444' }}>
              {status?.activePowers || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Total Authorizations</span>
            <span className="standard-metric-value">
              {status?.totalAuthorizations || 0}
            </span>
          </div>
          <div className="standard-metric">
            <span>Constitutional Compliance</span>
            <span className="standard-metric-value" style={{ color: '#10b981' }}>
              {status?.constitutionalCompliance || 0}%
            </span>
          </div>
          <div className="standard-metric">
            <span>Last Review</span>
            <span className="standard-metric-value">
              {status?.lastReview || 'N/A'}
            </span>
          </div>
          <div className="standard-metric">
            <span>Next Review</span>
            <span className="standard-metric-value" style={{ color: '#f59e0b' }}>
              {status?.nextReview || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Powers Analytics */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">📊 Powers Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Powers by Category
            </h4>
            <PieChart data={powersByCategory} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Severity Distribution
            </h4>
            <BarChart data={powersBySeverity} />
          </div>
          <div className="chart-container">
            <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px', textAlign: 'center' }}>
              Usage History
            </h4>
            <LineChart data={usageHistoryData} />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
        <h3 className="standard-card-title">🔍 Filter by Category</h3>
        <div className="standard-action-buttons">
          {['all', 'military', 'economic', 'civil', 'judicial', 'diplomatic'].map(category => (
            <button
              key={category}
              className={`standard-btn government-theme ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? '🚨 All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Powers Table */}
      <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="standard-card-title">⚡ Emergency Powers</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Power</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPowers.map(power => (
                <tr key={power.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2em' }}>{getCategoryIcon(power.category)}</span>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{power.name}</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                          {power.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getCategoryColor(power.category),
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {power.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSeverityColor(power.severity),
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {power.severity}
                    </span>
                  </td>
                  <td>
                    {power.isActive ? (
                      <div>
                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 ACTIVE</div>
                        <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                          Expires: {power.expiresAt}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280' }}>⚫ Inactive</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.9em' }}>{power.duration}</td>
                  <td>
                    <span style={{ 
                      color: power.usageHistory > 5 ? '#f59e0b' : '#10b981',
                      fontWeight: 'bold'
                    }}>
                      {power.usageHistory} times
                    </span>
                  </td>
                  <td>
                    <div className="standard-action-buttons">
                      <button
                        className="standard-btn government-theme"
                        onClick={() => setSelectedPower(power)}
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                      >
                        Details
                      </button>
                      {power.isActive ? (
                        <button
                          className="standard-btn government-theme"
                          onClick={() => handleDeactivatePower(power.id)}
                          style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="standard-btn government-theme"
                          onClick={() => handleActivatePower(power.id)}
                          style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        >
                          Activate
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

      {/* Power Detail Modal */}
      {selectedPower && (
        <div className="standard-card" style={{ 
          gridColumn: '1 / -1', 
          marginTop: '20px',
          border: '2px solid var(--gov-accent)',
          backgroundColor: 'rgba(79, 172, 254, 0.1)'
        }}>
          <h3 className="standard-card-title">
            {getCategoryIcon(selectedPower.category)} {selectedPower.name}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px' }}>Power Details</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Category</span>
                  <span className="standard-metric-value" style={{ color: getCategoryColor(selectedPower.category) }}>
                    {selectedPower.category}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Severity</span>
                  <span className="standard-metric-value" style={{ color: getSeverityColor(selectedPower.severity) }}>
                    {selectedPower.severity}
                  </span>
                </div>
                <div className="standard-metric">
                  <span>Duration</span>
                  <span className="standard-metric-value">{selectedPower.duration}</span>
                </div>
                <div className="standard-metric">
                  <span>Usage History</span>
                  <span className="standard-metric-value">{selectedPower.usageHistory} times</span>
                </div>
              </div>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>Description</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedPower.description}
              </p>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Constitutional Basis
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
                {selectedPower.constitutionalBasis}
              </p>
            </div>
            
            <div>
              <h4 style={{ color: 'var(--gov-accent)', marginBottom: '10px' }}>Scope of Authority</h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                {selectedPower.scope.map((item, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{item}</li>
                ))}
              </ul>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Requirements
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                {selectedPower.requirements.map((req, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{req}</li>
                ))}
              </ul>
              
              <h4 style={{ color: 'var(--gov-accent)', marginTop: '15px', marginBottom: '10px' }}>
                Limitations
              </h4>
              <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px' }}>
                {selectedPower.limitations.map((limit, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{limit}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="standard-action-buttons">
            {selectedPower.isActive ? (
              <button
                className="standard-btn government-theme"
                onClick={() => handleDeactivatePower(selectedPower.id)}
              >
                Deactivate Power
              </button>
            ) : (
              <button
                className="standard-btn government-theme"
                onClick={() => handleActivatePower(selectedPower.id)}
              >
                Activate Power
              </button>
            )}
            <button
              className="standard-btn government-theme"
              onClick={() => console.log('Review power')}
            >
              Review Power
            </button>
            <button
              className="standard-btn government-theme"
              onClick={() => setSelectedPower(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </QuickActionBase>
  );
};

export default EmergencyPowersScreen;
