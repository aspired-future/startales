import React, { useState, useEffect } from 'react';
import { QuickActionModal, QuickActionProps, TabConfig } from './QuickActionModal';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface EmergencyPower {
  id: string;
  name: string;
  category: 'executive' | 'military' | 'economic' | 'civil' | 'diplomatic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'available' | 'active' | 'suspended' | 'expired';
  description: string;
  legalBasis: string;
  duration: string;
  activatedDate?: string;
  expiryDate?: string;
  authorizedBy: string[];
  affectedRights: string[];
  oversight: string[];
}

interface EmergencyMetrics {
  totalPowers: number;
  activePowers: number;
  suspendedPowers: number;
  averageDuration: string;
  lastActivation: string;
  constitutionalCompliance: number;
}

interface LegalReview {
  id: string;
  powerId: string;
  reviewer: string;
  date: string;
  status: 'approved' | 'conditional' | 'rejected';
  notes: string;
  recommendations: string[];
}

interface ActivationHistory {
  id: string;
  powerId: string;
  powerName: string;
  activatedDate: string;
  deactivatedDate?: string;
  reason: string;
  authorizedBy: string;
  outcome: string;
  duration: string;
}

interface EmergencyData {
  powers: EmergencyPower[];
  metrics: EmergencyMetrics;
  legalReviews: LegalReview[];
  activationHistory: ActivationHistory[];
  protocols: any[];
}

// Tab Content Component
interface TabContentProps {
  tabId: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return <>{children}</>;
};

export const EmergencyPowersScreen: React.FC<QuickActionProps> = ({ onClose, isVisible }) => {
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPower, setSelectedPower] = useState<EmergencyPower | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Tab configuration
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'powers', label: 'Powers', icon: '⚡' },
    { id: 'legal', label: 'Legal Review', icon: '⚖️' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'protocols', label: 'Protocols', icon: '📋' }
  ];

  // Utility functions
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'executive': return '🏛️';
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'civil': return '👥';
      case 'diplomatic': return '🤝';
      default: return '⚡';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#fb7185';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'active': return '#ef4444';
      case 'suspended': return '#f59e0b';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'conditional': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/emergency-powers');
      if (response.ok) {
        const apiData = await response.json();
        setEmergencyData(apiData);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch emergency powers data:', err);
      
      // Comprehensive mock data
      const mockPowers: EmergencyPower[] = [
        {
          id: 'power-001',
          name: 'Martial Law Declaration',
          category: 'military',
          severity: 'critical',
          status: 'available',
          description: 'Authority to declare martial law in designated regions during extreme security threats',
          legalBasis: 'Emergency Powers Act Section 12.3',
          duration: '30 days (renewable)',
          authorizedBy: ['Prime Minister', 'Defense Secretary', 'Supreme Court'],
          affectedRights: ['Freedom of Movement', 'Assembly Rights', 'Curfew Exemptions'],
          oversight: ['Parliamentary Committee', 'Human Rights Commission', 'Judicial Review']
        },
        {
          id: 'power-002',
          name: 'Economic Emergency Controls',
          category: 'economic',
          severity: 'high',
          status: 'available',
          description: 'Power to implement price controls, resource allocation, and trade restrictions',
          legalBasis: 'Economic Emergency Act Section 8.1',
          duration: '60 days (renewable)',
          authorizedBy: ['Prime Minister', 'Finance Minister'],
          affectedRights: ['Property Rights', 'Trade Freedom', 'Contract Liberty'],
          oversight: ['Economic Committee', 'Trade Commission']
        },
        {
          id: 'power-003',
          name: 'Civil Defense Mobilization',
          category: 'civil',
          severity: 'medium',
          status: 'active',
          description: 'Authority to mobilize civilian resources for emergency response',
          legalBasis: 'Civil Defense Act Section 5.2',
          duration: '14 days (renewable)',
          activatedDate: '2387.155.08:30',
          expiryDate: '2387.169.08:30',
          authorizedBy: ['Prime Minister', 'Emergency Management Director'],
          affectedRights: ['Labor Rights', 'Property Use'],
          oversight: ['Civil Rights Board', 'Emergency Oversight Committee']
        },
        {
          id: 'power-004',
          name: 'Communication Control Authority',
          category: 'executive',
          severity: 'high',
          status: 'available',
          description: 'Power to control and monitor communications during national emergencies',
          legalBasis: 'Communications Security Act Section 15.7',
          duration: '21 days (renewable)',
          authorizedBy: ['Prime Minister', 'Communications Minister', 'Security Director'],
          affectedRights: ['Privacy Rights', 'Communication Freedom'],
          oversight: ['Privacy Commission', 'Communications Authority']
        },
        {
          id: 'power-005',
          name: 'Diplomatic Immunity Suspension',
          category: 'diplomatic',
          severity: 'medium',
          status: 'suspended',
          description: 'Authority to suspend diplomatic immunities during security investigations',
          legalBasis: 'Diplomatic Relations Act Section 22.4',
          duration: '7 days (non-renewable)',
          authorizedBy: ['Prime Minister', 'Foreign Minister', 'Attorney General'],
          affectedRights: ['Diplomatic Immunity'],
          oversight: ['International Law Committee', 'Foreign Relations Board']
        }
      ];

      const mockMetrics: EmergencyMetrics = {
        totalPowers: 15,
        activePowers: 1,
        suspendedPowers: 1,
        averageDuration: '28 days',
        lastActivation: '2387.155.08:30',
        constitutionalCompliance: 94.2
      };

      const mockLegalReviews: LegalReview[] = [
        {
          id: 'review-001',
          powerId: 'power-003',
          reviewer: 'Chief Justice Maria Santos',
          date: '2387.155.07:00',
          status: 'approved',
          notes: 'Activation justified under current emergency conditions. Recommend enhanced oversight.',
          recommendations: ['Daily status reports', 'Civilian rights monitoring', 'Regular review meetings']
        },
        {
          id: 'review-002',
          powerId: 'power-005',
          reviewer: 'Constitutional Court',
          date: '2387.150.14:30',
          status: 'conditional',
          notes: 'Suspension approved with strict limitations and immediate judicial oversight.',
          recommendations: ['Limited scope', 'Judicial supervision', 'Weekly compliance reports']
        },
        {
          id: 'review-003',
          powerId: 'power-001',
          reviewer: 'Legal Advisory Board',
          date: '2387.145.09:15',
          status: 'approved',
          notes: 'Legal framework adequate. Recommend updating oversight procedures.',
          recommendations: ['Enhanced parliamentary oversight', 'Human rights safeguards', 'Clear exit criteria']
        }
      ];

      const mockActivationHistory: ActivationHistory[] = [
        {
          id: 'hist-001',
          powerId: 'power-003',
          powerName: 'Civil Defense Mobilization',
          activatedDate: '2387.155.08:30',
          reason: 'Natural disaster response - Solar storm impact',
          authorizedBy: 'Prime Minister Elena Vasquez',
          outcome: 'Ongoing - Effective coordination achieved',
          duration: 'Active (14 days remaining)'
        },
        {
          id: 'hist-002',
          powerId: 'power-002',
          powerName: 'Economic Emergency Controls',
          activatedDate: '2387.120.15:45',
          deactivatedDate: '2387.140.15:45',
          reason: 'Trade route disruption crisis',
          authorizedBy: 'Prime Minister Elena Vasquez',
          outcome: 'Successfully resolved - Trade routes restored',
          duration: '20 days'
        },
        {
          id: 'hist-003',
          powerId: 'power-004',
          powerName: 'Communication Control Authority',
          activatedDate: '2387.100.22:00',
          deactivatedDate: '2387.107.22:00',
          reason: 'Security breach investigation',
          authorizedBy: 'Prime Minister Elena Vasquez',
          outcome: 'Investigation completed - Threats neutralized',
          duration: '7 days'
        }
      ];

      const mockProtocols = [
        {
          id: 'protocol-001',
          name: 'Emergency Power Activation Protocol',
          category: 'activation',
          steps: [
            'Threat assessment and documentation',
            'Legal review and authorization',
            'Parliamentary notification',
            'Public announcement',
            'Implementation and monitoring'
          ],
          timeframe: '2-6 hours',
          requiredApprovals: 3
        },
        {
          id: 'protocol-002',
          name: 'Constitutional Compliance Review',
          category: 'oversight',
          steps: [
            'Daily compliance monitoring',
            'Weekly legal review',
            'Monthly parliamentary report',
            'Quarterly constitutional assessment'
          ],
          timeframe: 'Ongoing',
          requiredApprovals: 1
        },
        {
          id: 'protocol-003',
          name: 'Emergency Power Deactivation',
          category: 'deactivation',
          steps: [
            'Situation assessment',
            'Stakeholder consultation',
            'Legal clearance',
            'Public notification',
            'Power termination'
          ],
          timeframe: '1-3 hours',
          requiredApprovals: 2
        }
      ];

      setEmergencyData({
        powers: mockPowers,
        metrics: mockMetrics,
        legalReviews: mockLegalReviews,
        activationHistory: mockActivationHistory,
        protocols: mockProtocols
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchData();
      const interval = setInterval(fetchData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const filteredPowers = emergencyData?.powers.filter(power => {
    const categoryMatch = filterCategory === 'all' || power.category === filterCategory;
    const statusMatch = filterStatus === 'all' || power.status === filterStatus;
    return categoryMatch && statusMatch;
  }) || [];

  // Chart data
  const categoryData = emergencyData ? [
    { label: 'Executive', value: emergencyData.powers.filter(p => p.category === 'executive').length },
    { label: 'Military', value: emergencyData.powers.filter(p => p.category === 'military').length },
    { label: 'Economic', value: emergencyData.powers.filter(p => p.category === 'economic').length },
    { label: 'Civil', value: emergencyData.powers.filter(p => p.category === 'civil').length },
    { label: 'Diplomatic', value: emergencyData.powers.filter(p => p.category === 'diplomatic').length }
  ] : [];

  const statusData = emergencyData ? [
    { label: 'Available', value: emergencyData.powers.filter(p => p.status === 'available').length },
    { label: 'Active', value: emergencyData.powers.filter(p => p.status === 'active').length },
    { label: 'Suspended', value: emergencyData.powers.filter(p => p.status === 'suspended').length },
    { label: 'Expired', value: emergencyData.powers.filter(p => p.status === 'expired').length }
  ] : [];

  const severityData = emergencyData ? [
    { label: 'Critical', value: emergencyData.powers.filter(p => p.severity === 'critical').length },
    { label: 'High', value: emergencyData.powers.filter(p => p.severity === 'high').length },
    { label: 'Medium', value: emergencyData.powers.filter(p => p.severity === 'medium').length },
    { label: 'Low', value: emergencyData.powers.filter(p => p.severity === 'low').length }
  ] : [];

  if (loading) {
    return (
      <QuickActionModal
        onClose={onClose}
        isVisible={isVisible}
        title="Emergency Powers"
        icon="⚡"
        theme="government-theme"
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
            Loading emergency powers data...
          </div>
        </TabContent>
      </QuickActionModal>
    );
  }

  return (
    <QuickActionModal
      onClose={onClose}
      isVisible={isVisible}
      title="Emergency Powers"
      icon="⚡"
      theme="government-theme"
      tabs={tabs}
      onRefresh={fetchData}
    >
      {/* Overview Tab */}
      <TabContent tabId="overview">
        {/* Emergency Powers Metrics */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">📊 Emergency Powers Status</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <span>Total Powers</span>
              <span className="standard-metric-value">
                {emergencyData?.metrics.totalPowers || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Active Powers</span>
              <span className="standard-metric-value" style={{ color: emergencyData?.metrics.activePowers > 0 ? '#ef4444' : '#10b981' }}>
                {emergencyData?.metrics.activePowers || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Suspended Powers</span>
              <span className="standard-metric-value" style={{ color: emergencyData?.metrics.suspendedPowers > 0 ? '#f59e0b' : '#10b981' }}>
                {emergencyData?.metrics.suspendedPowers || 0}
              </span>
            </div>
            <div className="standard-metric">
              <span>Average Duration</span>
              <span className="standard-metric-value">
                {emergencyData?.metrics.averageDuration || '0 days'}
              </span>
            </div>
            <div className="standard-metric">
              <span>Last Activation</span>
              <span className="standard-metric-value">
                {emergencyData?.metrics.lastActivation || 'Never'}
              </span>
            </div>
            <div className="standard-metric">
              <span>Constitutional Compliance</span>
              <span className="standard-metric-value" style={{ color: '#10b981' }}>
                {emergencyData?.metrics.constitutionalCompliance || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📈 Powers Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Categories
              </h4>
              <PieChart data={categoryData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Status Distribution
              </h4>
              <BarChart data={statusData} />
            </div>
            <div className="chart-container">
              <h4 style={{ color: 'var(--government-accent)', marginBottom: '10px', textAlign: 'center' }}>
                Severity Levels
              </h4>
              <PieChart data={severityData} />
            </div>
          </div>
        </div>
      </TabContent>

      {/* Powers Tab */}
      <TabContent tabId="powers">
        {/* Filters */}
        <div className="standard-card" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
          <h3 className="standard-card-title">🔍 Filter Powers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Category:</label>
              <div className="standard-action-buttons">
                {['all', 'executive', 'military', 'economic', 'civil', 'diplomatic'].map(category => (
                  <button
                    key={category}
                    className={`standard-btn government-theme ${filterCategory === category ? 'active' : ''}`}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Status:</label>
              <div className="standard-action-buttons">
                {['all', 'available', 'active', 'suspended', 'expired'].map(status => (
                  <button
                    key={status}
                    className={`standard-btn government-theme ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Powers List */}
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">⚡ Emergency Powers</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Power Name</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Legal Basis</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPowers.map(power => (
                  <tr key={power.id}>
                    <td>
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                        {getCategoryIcon(power.category)}
                      </span>
                      {power.category.charAt(0).toUpperCase() + power.category.slice(1)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{power.name}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                        {power.description.substring(0, 60)}...
                      </div>
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
                      <span style={{ 
                        color: getStatusColor(power.status),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {power.status}
                      </span>
                    </td>
                    <td>{power.duration}</td>
                    <td style={{ fontSize: '0.8em' }}>{power.legalBasis}</td>
                    <td>
                      <button 
                        className="standard-btn government-theme" 
                        style={{ fontSize: '0.8em', padding: '4px 8px' }}
                        onClick={() => setSelectedPower(power)}
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

      {/* Legal Review Tab */}
      <TabContent tabId="legal">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">⚖️ Legal Reviews</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Power ID</th>
                  <th>Reviewer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Recommendations</th>
                </tr>
              </thead>
              <tbody>
                {emergencyData?.legalReviews.map(review => (
                  <tr key={review.id}>
                    <td style={{ fontFamily: 'monospace' }}>{review.powerId}</td>
                    <td style={{ fontWeight: 'bold' }}>{review.reviewer}</td>
                    <td>{review.date}</td>
                    <td>
                      <span style={{ 
                        color: getReviewStatusColor(review.status),
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {review.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8em' }}>{review.notes}</td>
                    <td style={{ fontSize: '0.8em' }}>
                      {review.recommendations.slice(0, 2).join(', ')}
                      {review.recommendations.length > 2 && ` +${review.recommendations.length - 2} more`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabContent>

      {/* History Tab */}
      <TabContent tabId="history">
        <div className="standard-card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="standard-card-title">📜 Activation History</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Power Name</th>
                  <th>Activated</th>
                  <th>Deactivated</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Authorized By</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {emergencyData?.activationHistory.map(history => (
                  <tr key={history.id}>
                    <td style={{ fontWeight: 'bold' }}>{history.powerName}</td>
                    <td>{history.activatedDate}</td>
                    <td>{history.deactivatedDate || 'Active'}</td>
                    <td>{history.duration}</td>
                    <td style={{ fontSize: '0.8em' }}>{history.reason}</td>
                    <td>{history.authorizedBy}</td>
                    <td style={{ 
                      fontSize: '0.8em',
                      color: history.outcome.includes('Successfully') ? '#10b981' : 
                             history.outcome.includes('Ongoing') ? '#f59e0b' : '#6b7280'
                    }}>
                      {history.outcome}
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
          <h3 className="standard-card-title">📋 Emergency Protocols</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {emergencyData?.protocols.map(protocol => (
              <div key={protocol.id} className="standard-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--government-accent)', margin: '0' }}>
                    {protocol.name}
                  </h4>
                  <div style={{ textAlign: 'right', fontSize: '0.8em', color: 'var(--text-muted)' }}>
                    <div>Timeframe: {protocol.timeframe}</div>
                    <div>Required Approvals: {protocol.requiredApprovals}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Category:</strong> {protocol.category.charAt(0).toUpperCase() + protocol.category.slice(1)}
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
    </QuickActionModal>
  );
};

export default EmergencyPowersScreen;
