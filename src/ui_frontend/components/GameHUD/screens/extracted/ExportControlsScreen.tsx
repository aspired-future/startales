import React, { useState, useEffect } from 'react';
import './ExportControlsScreen.css';

interface ExportControlsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface ExportControlPolicy {
  id: string;
  name: string;
  description: string;
  type: 'technology' | 'resource' | 'military' | 'dual_use' | 'strategic' | 'cultural';
  status: 'active' | 'suspended' | 'under_review' | 'expired';
  controlLevel: 'prohibited' | 'restricted' | 'licensed' | 'monitored' | 'unrestricted';
  targetCivilizations: string[];
  targetTechnologies: string[];
  targetResources: string[];
  effectiveDate: string;
  expirationDate?: string;
  createdBy: string;
  rationale: string;
}

interface ExportLicense {
  id: string;
  applicant: string;
  items: ExportItem[];
  destination: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  applicationDate: string;
  reviewDate?: string;
  expirationDate?: string;
  conditions: string[];
  reviewer?: string;
}

interface ExportItem {
  name: string;
  category: string;
  quantity: number;
  value: number;
  description: string;
}

const ExportControlsScreen: React.FC<ExportControlsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'licenses' | 'monitoring' | 'violations' | 'analytics'>('policies');
  const [policies, setPolicies] = useState<ExportControlPolicy[]>([]);
  const [licenses, setLicenses] = useState<ExportLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);
  const [showNewLicenseModal, setShowNewLicenseModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<ExportControlPolicy | null>(null);

  useEffect(() => {
    fetchExportControlsData();
  }, []);

  const fetchExportControlsData = async () => {
    try {
      setLoading(true);
      
      // Fetch policies
      const policiesResponse = await fetch('http://localhost:4000/api/export-controls/civilization/campaign_1/player_civ/policies');
      if (policiesResponse.ok) {
        const policiesData = await policiesResponse.json();
        if (policiesData.success) {
          setPolicies(policiesData.data);
        }
      }

      // Fetch licenses
      const licensesResponse = await fetch('http://localhost:4000/api/export-controls/civilization/campaign_1/player_civ/licenses');
      if (licensesResponse.ok) {
        const licensesData = await licensesResponse.json();
        if (licensesData.success) {
          setLicenses(licensesData.data);
        }
      }

    } catch (err) {
      console.warn('Export Controls API not available, using mock data');
      setPolicies(createMockPolicies());
      setLicenses(createMockLicenses());
    } finally {
      setLoading(false);
    }
  };

  const createMockPolicies = (): ExportControlPolicy[] => [
    {
      id: 'policy_1',
      name: 'Advanced AI Technology Export Restrictions',
      description: 'Restricts export of advanced artificial intelligence technologies to prevent misuse',
      type: 'technology',
      status: 'active',
      controlLevel: 'prohibited',
      targetCivilizations: ['hostile_empire_1', 'rogue_state_2'],
      targetTechnologies: ['quantum_ai', 'neural_networks', 'autonomous_weapons'],
      targetResources: [],
      effectiveDate: '2024-01-15',
      expirationDate: '2025-01-15',
      createdBy: 'Security Council',
      rationale: 'Prevent proliferation of dangerous AI technologies that could be weaponized'
    },
    {
      id: 'policy_2',
      name: 'Strategic Resource Export Controls',
      description: 'Controls export of rare minerals critical for advanced technology production',
      type: 'resource',
      status: 'active',
      controlLevel: 'licensed',
      targetCivilizations: [],
      targetTechnologies: [],
      targetResources: ['quantum_crystals', 'dark_matter', 'exotic_alloys'],
      effectiveDate: '2024-02-01',
      createdBy: 'Economic Security Department',
      rationale: 'Maintain strategic advantage and prevent resource depletion'
    },
    {
      id: 'policy_3',
      name: 'Dual-Use Technology Monitoring',
      description: 'Monitors export of technologies with both civilian and military applications',
      type: 'dual_use',
      status: 'active',
      controlLevel: 'monitored',
      targetCivilizations: [],
      targetTechnologies: ['fusion_reactors', 'advanced_propulsion', 'communication_arrays'],
      targetResources: [],
      effectiveDate: '2024-03-01',
      createdBy: 'Technology Assessment Board',
      rationale: 'Balance trade benefits with security concerns'
    }
  ];

  const createMockLicenses = (): ExportLicense[] => [
    {
      id: 'license_1',
      applicant: 'Galactic Mining Corp',
      items: [
        {
          name: 'Quantum Crystal Processors',
          category: 'Strategic Materials',
          quantity: 100,
          value: 5000000,
          description: 'High-grade quantum crystals for civilian energy applications'
        }
      ],
      destination: 'Allied Federation',
      status: 'pending',
      applicationDate: '2024-12-01',
      conditions: [],
      reviewer: undefined
    },
    {
      id: 'license_2',
      applicant: 'Stellar Dynamics Inc',
      items: [
        {
          name: 'Fusion Reactor Components',
          category: 'Dual-Use Technology',
          quantity: 50,
          value: 12000000,
          description: 'Advanced fusion reactor components for power generation'
        }
      ],
      destination: 'Neutral Trade Union',
      status: 'approved',
      applicationDate: '2024-11-15',
      reviewDate: '2024-11-20',
      expirationDate: '2025-11-20',
      conditions: ['End-use verification required', 'No re-export without permission'],
      reviewer: 'Export Control Board'
    }
  ];

  const handleCreatePolicy = async (policyData: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/export-controls/civilization/campaign_1/player_civ/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPolicies([...policies, data.data]);
          setShowNewPolicyModal(false);
          alert('Export control policy created successfully!');
        }
      }
    } catch (error) {
      console.error('Policy creation failed:', error);
      alert('Policy creation failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  const handleReviewLicense = async (licenseId: string, decision: 'approved' | 'denied', conditions?: string[]) => {
    try {
      const response = await fetch(`http://localhost:4000/api/export-controls/licenses/${licenseId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, conditions })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLicenses(licenses.map(license => 
            license.id === licenseId 
              ? { ...license, status: decision, conditions: conditions || [] }
              : license
          ));
          alert(`License ${decision} successfully!`);
        }
      }
    } catch (error) {
      console.error('License review failed:', error);
      alert('License review failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  if (loading) {
    return (
      <div className="export-controls-screen loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading export control systems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="export-controls-screen error">
        <div className="error-message">
          <h3>⚠️ Export Control System Unavailable</h3>
          <p>Unable to load export control data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="export-controls-screen">
      <div className="screen-header">
        <div className="header-left">
          <span className="screen-icon">{icon}</span>
          <div className="header-text">
            <h2>{title}</h2>
            <p>Strategic Export Control & Technology Transfer Management</p>
          </div>
        </div>
        <div className="header-right">
          <div className="control-stats">
            <div className="stat">
              <span className="stat-label">Active Policies</span>
              <span className="stat-value">{policies.filter(p => p.status === 'active').length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Pending Licenses</span>
              <span className="stat-value">{licenses.filter(l => l.status === 'pending').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'policies', label: 'Export Policies', icon: '📋' },
          { id: 'licenses', label: 'License Management', icon: '📄' },
          { id: 'monitoring', label: 'Trade Monitoring', icon: '📊' },
          { id: 'violations', label: 'Violations', icon: '⚠️' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'policies' && (
          <div className="policies-tab">
            <div className="tab-header">
              <h3>Export Control Policies</h3>
              <button 
                className="create-btn"
                onClick={() => setShowNewPolicyModal(true)}
              >
                + Create New Policy
              </button>
            </div>

            <div className="policies-grid">
              {policies.map(policy => (
                <div key={policy.id} className={`policy-card ${policy.status}`}>
                  <div className="policy-header">
                    <h4>{policy.name}</h4>
                    <div className="policy-badges">
                      <span className={`type-badge ${policy.type}`}>{policy.type}</span>
                      <span className={`control-badge ${policy.controlLevel}`}>{policy.controlLevel}</span>
                      <span className={`status-badge ${policy.status}`}>{policy.status}</span>
                    </div>
                  </div>
                  
                  <p className="policy-description">{policy.description}</p>
                  
                  <div className="policy-details">
                    <div className="detail-row">
                      <span className="label">Effective Date:</span>
                      <span className="value">{new Date(policy.effectiveDate).toLocaleDateString()}</span>
                    </div>
                    {policy.expirationDate && (
                      <div className="detail-row">
                        <span className="label">Expires:</span>
                        <span className="value">{new Date(policy.expirationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="label">Created By:</span>
                      <span className="value">{policy.createdBy}</span>
                    </div>
                  </div>

                  {policy.targetTechnologies.length > 0 && (
                    <div className="target-items">
                      <h5>Controlled Technologies:</h5>
                      <div className="items-list">
                        {policy.targetTechnologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="item-tag">{tech}</span>
                        ))}
                        {policy.targetTechnologies.length > 3 && (
                          <span className="more-items">+{policy.targetTechnologies.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {policy.targetResources.length > 0 && (
                    <div className="target-items">
                      <h5>Controlled Resources:</h5>
                      <div className="items-list">
                        {policy.targetResources.slice(0, 3).map((resource, index) => (
                          <span key={index} className="item-tag">{resource}</span>
                        ))}
                        {policy.targetResources.length > 3 && (
                          <span className="more-items">+{policy.targetResources.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="policy-actions">
                    <button className="action-btn secondary">Edit</button>
                    <button className="action-btn secondary">Suspend</button>
                    <button className="action-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'licenses' && (
          <div className="licenses-tab">
            <div className="tab-header">
              <h3>Export License Management</h3>
              <button 
                className="create-btn"
                onClick={() => setShowNewLicenseModal(true)}
              >
                + New License Application
              </button>
            </div>

            <div className="licenses-list">
              {licenses.map(license => (
                <div key={license.id} className={`license-card ${license.status}`}>
                  <div className="license-header">
                    <div className="license-info">
                      <h4>License #{license.id}</h4>
                      <span className="applicant">{license.applicant}</span>
                    </div>
                    <span className={`status-badge ${license.status}`}>{license.status}</span>
                  </div>

                  <div className="license-details">
                    <div className="detail-section">
                      <h5>Export Items:</h5>
                      {license.items.map((item, index) => (
                        <div key={index} className="export-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-details">
                            Qty: {item.quantity} | Value: ${item.value.toLocaleString()} | {item.category}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="detail-section">
                      <div className="detail-row">
                        <span className="label">Destination:</span>
                        <span className="value">{license.destination}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Application Date:</span>
                        <span className="value">{new Date(license.applicationDate).toLocaleDateString()}</span>
                      </div>
                      {license.reviewDate && (
                        <div className="detail-row">
                          <span className="label">Review Date:</span>
                          <span className="value">{new Date(license.reviewDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {license.expirationDate && (
                        <div className="detail-row">
                          <span className="label">Expires:</span>
                          <span className="value">{new Date(license.expirationDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {license.conditions.length > 0 && (
                      <div className="detail-section">
                        <h5>Conditions:</h5>
                        <ul className="conditions-list">
                          {license.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="license-actions">
                    {license.status === 'pending' && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => handleReviewLicense(license.id, 'approved', ['Standard export conditions apply'])}
                        >
                          Approve
                        </button>
                        <button 
                          className="action-btn deny"
                          onClick={() => handleReviewLicense(license.id, 'denied')}
                        >
                          Deny
                        </button>
                      </>
                    )}
                    <button className="action-btn secondary">View Details</button>
                    <button className="action-btn secondary">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="monitoring-tab">
            <div className="tab-header">
              <h3>Trade Flow Monitoring</h3>
              <p>Real-time monitoring of export activities and compliance</p>
            </div>

            <div className="monitoring-dashboard">
              <div className="monitoring-stats">
                <div className="stat-card">
                  <h4>Active Exports</h4>
                  <span className="stat-number">247</span>
                  <span className="stat-change positive">+12% this month</span>
                </div>
                <div className="stat-card">
                  <h4>Compliance Rate</h4>
                  <span className="stat-number">98.5%</span>
                  <span className="stat-change positive">+0.3% this month</span>
                </div>
                <div className="stat-card">
                  <h4>Flagged Transactions</h4>
                  <span className="stat-number">3</span>
                  <span className="stat-change neutral">Under review</span>
                </div>
              </div>

              <div className="monitoring-alerts">
                <h4>Recent Alerts</h4>
                <div className="alert-item">
                  <span className="alert-icon">⚠️</span>
                  <div className="alert-content">
                    <span className="alert-title">Unusual Export Pattern Detected</span>
                    <span className="alert-details">Large quantum crystal shipment to previously inactive destination</span>
                  </div>
                  <span className="alert-time">2 hours ago</span>
                </div>
                <div className="alert-item">
                  <span className="alert-icon">🔍</span>
                  <div className="alert-content">
                    <span className="alert-title">License Verification Required</span>
                    <span className="alert-details">Fusion reactor components export pending verification</span>
                  </div>
                  <span className="alert-time">4 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="violations-tab">
            <div className="tab-header">
              <h3>Export Control Violations</h3>
              <p>Investigation and enforcement of export control violations</p>
            </div>

            <div className="violations-placeholder">
              <div className="placeholder-icon">⚠️</div>
              <h4>No Active Violations</h4>
              <p>All current export activities are in compliance with established policies.</p>
              
              <div className="violation-stats">
                <div className="stat-item">
                  <span className="stat-label">Violations This Year:</span>
                  <span className="stat-value">2</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Resolution Time:</span>
                  <span className="stat-value">14 days</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Compliance Score:</span>
                  <span className="stat-value">A+</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h3>Export Control Analytics</h3>
              <p>Strategic analysis of export patterns and policy effectiveness</p>
            </div>

            <div className="analytics-dashboard">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Export Volume Trends</h4>
                  <div className="chart-placeholder">
                    📊 Interactive chart showing export volumes over time by category
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h4>Policy Effectiveness</h4>
                  <div className="effectiveness-metrics">
                    <div className="metric">
                      <span className="metric-label">Technology Controls:</span>
                      <span className="metric-value">95% effective</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Resource Controls:</span>
                      <span className="metric-value">88% effective</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Dual-Use Monitoring:</span>
                      <span className="metric-value">92% effective</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Risk Assessment</h4>
                  <div className="risk-indicators">
                    <div className="risk-item low">
                      <span className="risk-label">Technology Proliferation:</span>
                      <span className="risk-level">Low Risk</span>
                    </div>
                    <div className="risk-item medium">
                      <span className="risk-label">Resource Depletion:</span>
                      <span className="risk-level">Medium Risk</span>
                    </div>
                    <div className="risk-item low">
                      <span className="risk-label">Security Threats:</span>
                      <span className="risk-level">Low Risk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportControlsScreen;
