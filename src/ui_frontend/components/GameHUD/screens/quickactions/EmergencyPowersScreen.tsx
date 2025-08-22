import React, { useState, useEffect } from 'react';
import { QuickActionBase, QuickActionProps } from './QuickActionBase';

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
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus | null>(null);
  const [selectedPower, setSelectedPower] = useState<EmergencyPower | null>(null);
  const [showActivationForm, setShowActivationForm] = useState<EmergencyPower | null>(null);
  const [activationReason, setActivationReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      loadEmergencyData();
    }
  }, [isVisible]);

  const loadEmergencyData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPowers: EmergencyPower[] = [
        {
          id: 'power-001',
          name: 'Military Mobilization Authority',
          category: 'military',
          severity: 'extensive',
          description: 'Authority to mobilize military forces and declare martial law in affected regions',
          scope: ['Military Forces', 'National Guard', 'Reserve Units', 'Civil Defense'],
          duration: '30 days (renewable)',
          requirements: ['Clear and present danger', 'Legislative notification within 48 hours'],
          limitations: ['Cannot suspend habeas corpus', 'Must respect civilian oversight'],
          constitutionalBasis: 'Article VII, Section 3 - Emergency Defense Powers',
          isActive: false,
          usageHistory: 3
        },
        {
          id: 'power-002',
          name: 'Economic Emergency Controls',
          category: 'economic',
          severity: 'moderate',
          description: 'Authority to implement price controls, resource allocation, and market interventions',
          scope: ['Financial Markets', 'Essential Goods', 'Currency Exchange', 'Trade Routes'],
          duration: '60 days (renewable)',
          requirements: ['Economic crisis declaration', 'Central Bank consultation'],
          limitations: ['Cannot seize private property without compensation', 'Market interventions must be temporary'],
          constitutionalBasis: 'Article IV, Section 8 - Economic Stability Powers',
          isActive: true,
          activatedAt: '2387.150.10:30',
          expiresAt: '2387.210.10:30',
          usageHistory: 7
        },
        {
          id: 'power-003',
          name: 'Civil Emergency Management',
          category: 'civil',
          severity: 'limited',
          description: 'Authority to coordinate emergency services and implement public safety measures',
          scope: ['Emergency Services', 'Public Transportation', 'Communication Systems', 'Healthcare'],
          duration: '14 days (renewable)',
          requirements: ['Natural disaster or public emergency', 'Local authority coordination'],
          limitations: ['Cannot restrict fundamental rights', 'Must maintain democratic processes'],
          constitutionalBasis: 'Article V, Section 12 - Public Safety Powers',
          isActive: false,
          usageHistory: 12
        },
        {
          id: 'power-004',
          name: 'Judicial Emergency Procedures',
          category: 'judicial',
          severity: 'limited',
          description: 'Authority to expedite legal proceedings and establish emergency courts',
          scope: ['Court Systems', 'Legal Procedures', 'Emergency Tribunals', 'Law Enforcement'],
          duration: '21 days (renewable)',
          requirements: ['Judicial system overload', 'Supreme Court consultation'],
          limitations: ['Cannot override constitutional rights', 'Must maintain due process'],
          constitutionalBasis: 'Article VI, Section 5 - Judicial Emergency Powers',
          isActive: false,
          usageHistory: 2
        },
        {
          id: 'power-005',
          name: 'Diplomatic Emergency Authority',
          category: 'diplomatic',
          severity: 'moderate',
          description: 'Authority to make emergency diplomatic decisions and deploy special envoys',
          scope: ['Foreign Relations', 'Trade Agreements', 'Military Alliances', 'Emergency Negotiations'],
          duration: '45 days (renewable)',
          requirements: ['International crisis', 'Foreign Ministry consultation'],
          limitations: ['Cannot declare war', 'Must inform legislature within 72 hours'],
          constitutionalBasis: 'Article III, Section 7 - Emergency Diplomatic Powers',
          isActive: false,
          usageHistory: 5
        },
        {
          id: 'power-006',
          name: 'Absolute Emergency Authority',
          category: 'civil',
          severity: 'absolute',
          description: 'Comprehensive emergency powers for existential threats to the state',
          scope: ['All Government Functions', 'Military Command', 'Economic Controls', 'Civil Administration'],
          duration: '7 days (requires legislative approval for extension)',
          requirements: ['Existential threat to state', 'Cabinet unanimous approval', 'Supreme Court notification'],
          limitations: ['Cannot suspend constitution', 'Automatic legislative review', 'Maximum 30 days total'],
          constitutionalBasis: 'Article I, Section 1 - Ultimate Executive Authority',
          isActive: false,
          usageHistory: 0
        }
      ];

      const mockStatus: EmergencyStatus = {
        currentLevel: 'elevated',
        activePowers: mockPowers.filter(p => p.isActive).length,
        totalAuthorizations: mockPowers.reduce((sum, p) => sum + p.usageHistory, 0),
        constitutionalCompliance: 94,
        lastReview: '2387.145.14:00',
        nextReview: '2387.160.14:00'
      };

      setEmergencyPowers(mockPowers);
      setEmergencyStatus(mockStatus);
    } catch (error) {
      console.error('Failed to load emergency powers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'absolute': return '#8b0000';
      case 'extensive': return '#dc3545';
      case 'moderate': return '#fd7e14';
      case 'limited': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'civil': return '🏛️';
      case 'judicial': return '⚖️';
      case 'diplomatic': return '🤝';
      default: return '⚡';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'maximum': return '#8b0000';
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'elevated': return '#ffc107';
      case 'normal': return '#28a745';
      default: return '#6c757d';
    }
  };

  const handleActivatePower = async (power: EmergencyPower, reason: string) => {
    console.log(`Activating emergency power: ${power.name}`, { reason });
    
    // Simulate activation
    setEmergencyPowers(prev => prev.map(p => 
      p.id === power.id 
        ? { 
            ...p, 
            isActive: true, 
            activatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        : p
    ));
    
    setShowActivationForm(null);
    setActivationReason('');
  };

  const handleDeactivatePower = async (power: EmergencyPower) => {
    console.log(`Deactivating emergency power: ${power.name}`);
    
    // Simulate deactivation
    setEmergencyPowers(prev => prev.map(p => 
      p.id === power.id 
        ? { ...p, isActive: false, activatedAt: undefined, expiresAt: undefined }
        : p
    ));
  };

  if (loading) {
    return (
      <QuickActionBase
        title="Emergency Powers Management"
        icon="⚖️"
        onClose={onClose}
        isVisible={isVisible}
        className="emergency-powers"
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{ color: '#4ecdc4', fontSize: '18px' }}>Loading emergency powers data...</div>
        </div>
      </QuickActionBase>
    );
  }

  return (
    <QuickActionBase
      title="Emergency Powers Management"
      icon="⚖️"
      onClose={onClose}
      isVisible={isVisible}
      className="emergency-powers"
    >
      {/* Emergency Status */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🚨 Current Emergency Status</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value" style={{ color: getLevelColor(emergencyStatus?.currentLevel || 'normal') }}>
              {(emergencyStatus?.currentLevel || 'normal').toUpperCase()}
            </div>
            <div className="metric-label">Alert Level</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ color: emergencyStatus?.activePowers > 0 ? '#dc3545' : '#28a745' }}>
              {emergencyStatus?.activePowers || 0}
            </div>
            <div className="metric-label">Active Powers</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{emergencyStatus?.totalAuthorizations || 0}</div>
            <div className="metric-label">Total Authorizations</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{emergencyStatus?.constitutionalCompliance || 0}%</div>
            <div className="metric-label">Constitutional Compliance</div>
          </div>
          <div className="metric-item">
            <div className="metric-value" style={{ fontSize: '14px' }}>{emergencyStatus?.nextReview || 'N/A'}</div>
            <div className="metric-label">Next Review</div>
          </div>
        </div>
      </div>

      {/* Active Powers Alert */}
      {emergencyStatus?.activePowers > 0 && (
        <div style={{ 
          background: 'rgba(220, 53, 69, 0.1)', 
          border: '1px solid #dc3545', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '30px' 
        }}>
          <h4 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>⚠️ Active Emergency Powers</h4>
          <p style={{ color: '#ccc', margin: 0 }}>
            {emergencyStatus.activePowers} emergency power(s) currently active. 
            Regular constitutional review is required every 15 days.
          </p>
        </div>
      )}

      {/* Emergency Powers List */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>⚡ Available Emergency Powers</h3>
        <div className="action-grid">
          {emergencyPowers.map(power => (
            <div key={power.id} className="action-card" style={{ 
              border: power.isActive ? '2px solid #dc3545' : '1px solid rgba(78, 205, 196, 0.3)',
              background: power.isActive ? 'rgba(220, 53, 69, 0.1)' : 'rgba(26, 26, 46, 0.8)'
            }}>
              <h3 style={{ color: getSeverityColor(power.severity) }}>
                {getCategoryIcon(power.category)} {power.name}
              </h3>
              <div style={{ marginBottom: '10px' }}>
                <span className={`status-indicator ${power.severity === 'absolute' ? 'critical' : power.severity === 'extensive' ? 'critical' : power.severity === 'moderate' ? 'warning' : 'online'}`}>
                  {power.severity.toUpperCase()}
                </span>
                <span className={`status-indicator ${power.isActive ? 'critical' : 'offline'}`} style={{ marginLeft: '10px' }}>
                  {power.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p>{power.description}</p>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
                <div>📋 Scope: {power.scope.slice(0, 2).join(', ')}{power.scope.length > 2 ? '...' : ''}</div>
                <div>⏰ Duration: {power.duration}</div>
                <div>📊 Used: {power.usageHistory} times</div>
                {power.isActive && power.expiresAt && (
                  <div style={{ color: '#dc3545' }}>🔥 Expires: {power.expiresAt}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="action-btn"
                  onClick={() => setSelectedPower(power)}
                >
                  📖 View Details
                </button>
                {power.isActive ? (
                  <button 
                    className="action-btn urgent"
                    onClick={() => handleDeactivatePower(power)}
                  >
                    🛑 Deactivate
                  </button>
                ) : (
                  <button 
                    className="action-btn urgent"
                    onClick={() => setShowActivationForm(power)}
                    disabled={power.severity === 'absolute'}
                  >
                    ⚡ Activate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constitutional Safeguards */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#4ecdc4', marginBottom: '20px' }}>🛡️ Constitutional Safeguards</h3>
        <div className="action-grid">
          <div className="action-card">
            <h3>📋 Legislative Oversight</h3>
            <p>All emergency powers require legislative notification and periodic review</p>
            <button className="action-btn secondary">View Requirements</button>
          </div>
          <div className="action-card">
            <h3>⚖️ Judicial Review</h3>
            <p>Supreme Court maintains authority to review emergency power usage</p>
            <button className="action-btn secondary">Request Review</button>
          </div>
          <div className="action-card">
            <h3>⏰ Automatic Expiration</h3>
            <p>All powers have built-in expiration dates and renewal requirements</p>
            <button className="action-btn secondary">View Timeline</button>
          </div>
          <div className="action-card">
            <h3>📊 Compliance Monitoring</h3>
            <p>Continuous monitoring ensures constitutional compliance</p>
            <button className="action-btn secondary">View Report</button>
          </div>
        </div>
      </div>

      {/* Power Detail Modal */}
      {selectedPower && (
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
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#4ecdc4', margin: 0 }}>
                {getCategoryIcon(selectedPower.category)} {selectedPower.name}
              </h2>
              <button 
                onClick={() => setSelectedPower(null)}
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
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span className={`status-indicator ${selectedPower.severity === 'absolute' ? 'critical' : selectedPower.severity === 'extensive' ? 'critical' : selectedPower.severity === 'moderate' ? 'warning' : 'online'}`}>
                  {selectedPower.severity.toUpperCase()}
                </span>
                <span className={`status-indicator ${selectedPower.isActive ? 'critical' : 'offline'}`}>
                  {selectedPower.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              
              <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedPower.description}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📋 Scope of Authority:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {selectedPower.scope.map((item, index) => (
                  <span key={index} className="status-indicator online">{item}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>✅ Requirements:</h4>
              <ul style={{ color: '#ccc' }}>
                {selectedPower.requirements.map((req, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{req}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>⚠️ Limitations:</h4>
              <ul style={{ color: '#ccc' }}>
                {selectedPower.limitations.map((limit, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{limit}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>📜 Constitutional Basis:</h4>
              <p style={{ color: '#ccc', fontStyle: 'italic' }}>{selectedPower.constitutionalBasis}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedPower.isActive ? (
                <button 
                  className="action-btn urgent"
                  onClick={() => {
                    handleDeactivatePower(selectedPower);
                    setSelectedPower(null);
                  }}
                >
                  🛑 Deactivate Power
                </button>
              ) : (
                <button 
                  className="action-btn urgent"
                  onClick={() => {
                    setShowActivationForm(selectedPower);
                    setSelectedPower(null);
                  }}
                  disabled={selectedPower.severity === 'absolute'}
                >
                  ⚡ Activate Power
                </button>
              )}
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedPower(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activation Form Modal */}
      {showActivationForm && (
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
            border: '2px solid #dc3545',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#dc3545', margin: 0 }}>⚡ Activate Emergency Power</h2>
              <button 
                onClick={() => setShowActivationForm(null)}
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
            
            <div style={{ 
              background: 'rgba(220, 53, 69, 0.1)', 
              border: '1px solid #dc3545', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px' 
            }}>
              <h4 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>⚠️ Constitutional Warning</h4>
              <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
                Activating emergency powers is a serious constitutional action. 
                You must provide clear justification and the power will be subject to legislative oversight.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#4ecdc4' }}>Power to Activate:</h4>
              <p style={{ color: '#ccc' }}>{showActivationForm.name}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#4ecdc4', display: 'block', marginBottom: '10px' }}>
                Justification (Required):
              </label>
              <textarea
                value={activationReason}
                onChange={(e) => setActivationReason(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '10px',
                  background: 'rgba(26, 26, 46, 0.8)',
                  border: '1px solid #4ecdc4',
                  borderRadius: '4px',
                  color: '#ccc',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Provide detailed justification for activating this emergency power..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="action-btn urgent"
                onClick={() => handleActivatePower(showActivationForm, activationReason)}
                disabled={!activationReason.trim() || activationReason.length < 50}
              >
                ⚡ Activate Power
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => {
                  setShowActivationForm(null);
                  setActivationReason('');
                }}
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

export default EmergencyPowersScreen;
