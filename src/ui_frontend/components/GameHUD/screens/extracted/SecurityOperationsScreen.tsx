import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './SecurityOperationsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface SecurityForce {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  officers: any[];
  budget: number;
  performance: {
    crimeReduction: number;
    communityTrust: number;
  };
  corruption: number;
  securityClearance: string;
}

interface FederalAgency {
  id: string;
  name: string;
  type: string;
  headquarters: string;
  personnel: any[];
  operations: any[];
  budget: number;
  securityClearance: string;
  performance: {
    intelligenceGathering: number;
  };
}

interface PersonalSecurity {
  id: string;
  protectedPerson: {
    name: string;
    title: string;
    position: string;
  };
  threatLevel: string;
  securityDetail: any[];
  securityProtocols: string[];
  budget: number;
  performance: {
    threatPrevention: number;
  };
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  location: string;
  description: string;
  resolved: boolean;
}

const SecurityOperationsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [securityData, setSecurityData] = useState<{
    policeForces: SecurityForce[];
    federalAgencies: FederalAgency[];
    personalSecurity: PersonalSecurity[];
    events: SecurityEvent[];
    analytics: {
      totalBudget: number;
      totalPersonnel: number;
      systemEfficiency: number;
      overallSecurity: number;
      crimeRate: number;
      publicSafety: number;
      recommendations: any[];
    };
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'police' | 'federal' | 'personal' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'police', label: 'Police', icon: '👮' },
    { id: 'federal', label: 'Federal', icon: '🏛️' },
    { id: 'personal', label: 'Personal', icon: '🛡️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/security', description: 'Get security data' }
  ];

  // Utility functions
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return '#10b981';
    if (value >= 80) return '#fbbf24';
    if (value >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSecurityClearanceColor = (clearance: string) => {
    switch (clearance.toLowerCase()) {
      case 'top secret': return '#ef4444';
      case 'secret': return '#f59e0b';
      case 'confidential': return '#fbbf24';
      case 'unclassified': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/security');
      if (response.ok) {
        const data = await response.json();
        setSecurityData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch security data:', err);
      // Use comprehensive mock data
      setSecurityData({
        policeForces: [
          {
            id: 'police_001',
            name: 'Metropolitan Police Force',
            type: 'Local',
            jurisdiction: 'City',
            officers: new Array(450).fill({}),
            budget: 25000000,
            performance: {
              crimeReduction: 78.5,
              communityTrust: 82.3
            },
            corruption: 3.2,
            securityClearance: 'Confidential'
          },
          {
            id: 'police_002',
            name: 'State Security Division',
            type: 'State',
            jurisdiction: 'State',
            officers: new Array(1200).fill({}),
            budget: 85000000,
            performance: {
              crimeReduction: 85.2,
              communityTrust: 76.8
            },
            corruption: 2.1,
            securityClearance: 'Secret'
          },
          {
            id: 'police_003',
            name: 'Federal Law Enforcement',
            type: 'Federal',
            jurisdiction: 'Federal',
            officers: new Array(2800).fill({}),
            budget: 180000000,
            performance: {
              crimeReduction: 91.4,
              communityTrust: 71.2
            },
            corruption: 1.8,
            securityClearance: 'Top Secret'
          }
        ],
        federalAgencies: [
          {
            id: 'agency_001',
            name: 'Federal Bureau of Investigation',
            type: 'Federal Bureau',
            headquarters: 'Capital District',
            personnel: new Array(850).fill({}),
            operations: ['Counter-terrorism', 'Cyber Crime', 'Organized Crime'],
            budget: 120000000,
            securityClearance: 'Top Secret',
            performance: {
              intelligenceGathering: 94.2
            }
          },
          {
            id: 'agency_002',
            name: 'Central Intelligence Agency',
            type: 'Intelligence',
            headquarters: 'Langley',
            personnel: new Array(1200).fill({}),
            operations: ['Foreign Intelligence', 'Counter-intelligence', 'Covert Operations'],
            budget: 250000000,
            securityClearance: 'Top Secret',
            performance: {
              intelligenceGathering: 96.8
            }
          }
        ],
        personalSecurity: [
          {
            id: 'ps_001',
            protectedPerson: {
              name: 'President Sarah Chen',
              title: 'President',
              position: 'Head of State'
            },
            threatLevel: 'High',
            securityDetail: new Array(25).fill({}),
            securityProtocols: ['24/7 Protection', 'Secure Transportation', 'Safe Houses'],
            budget: 15000000,
            performance: {
              threatPrevention: 99.1
            }
          },
          {
            id: 'ps_002',
            protectedPerson: {
              name: 'Vice President Rodriguez',
              title: 'Vice President',
              position: 'Second in Command'
            },
            threatLevel: 'Medium',
            securityDetail: new Array(15).fill({}),
            securityProtocols: ['Escort Service', 'Secure Communications', 'Emergency Response'],
            budget: 8500000,
            performance: {
              threatPrevention: 97.3
            }
          }
        ],
        events: [
          {
            id: 'event_001',
            timestamp: '2024-02-14T10:30:00Z',
            type: 'Security Breach',
            severity: 'Medium',
            location: 'Government Building A',
            description: 'Unauthorized access attempt detected',
            resolved: true
          },
          {
            id: 'event_002',
            timestamp: '2024-02-14T08:15:00Z',
            type: 'Threat Assessment',
            severity: 'Low',
            location: 'Public Square',
            description: 'Suspicious activity reported',
            resolved: false
          }
        ],
        analytics: {
          totalBudget: 650000000,
          totalPersonnel: 6500,
          systemEfficiency: 87.3,
          overallSecurity: 92.1,
          crimeRate: 12.4,
          publicSafety: 88.7,
          recommendations: [
            'Increase cyber security measures',
            'Expand community policing programs',
            'Enhance intelligence sharing protocols'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Security Overview - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📊 Security Operations Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{formatCurrency(securityData?.analytics.totalBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Personnel</span>
            <span className="standard-metric-value">{formatNumber(securityData?.analytics.totalPersonnel || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>System Efficiency</span>
            <span className="standard-metric-value">{securityData?.analytics.systemEfficiency}%</span>
          </div>
          <div className="standard-metric">
            <span>Overall Security</span>
            <span className="standard-metric-value">{securityData?.analytics.overallSecurity}%</span>
          </div>
          <div className="standard-metric">
            <span>Crime Rate</span>
            <span className="standard-metric-value">{securityData?.analytics.crimeRate}%</span>
          </div>
          <div className="standard-metric">
            <span>Public Safety</span>
            <span className="standard-metric-value">{securityData?.analytics.publicSafety}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Security Analysis')}>Security Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Threat Assessment')}>Threat Assessment</button>
        </div>
      </div>

      {/* Active Security Events - Full panel width */}
      <div className="standard-panel security-theme">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>⚠️ Active Security Events</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {securityData?.events?.slice(0, 5).map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.description}</strong></td>
                  <td>{event.type}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getThreatLevelColor(event.severity), 
                      color: 'white' 
                    }}>
                      {event.severity}
                    </span>
                  </td>
                  <td>{event.location}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: event.resolved ? '#10b981' : '#f59e0b', 
                      color: 'white' 
                    }}>
                      {event.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn security-theme">Respond</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel security-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📈 Security Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'System Efficiency', value: securityData?.analytics.systemEfficiency || 0, color: getPerformanceColor(securityData?.analytics.systemEfficiency || 0) },
                  { label: 'Overall Security', value: securityData?.analytics.overallSecurity || 0, color: getPerformanceColor(securityData?.analytics.overallSecurity || 0) },
                  { label: 'Public Safety', value: securityData?.analytics.publicSafety || 0, color: getPerformanceColor(securityData?.analytics.publicSafety || 0) }
                ]}
                title="📊 Security Performance Metrics (%)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={securityData?.analytics.recommendations?.map((rec, index) => ({
                  label: rec,
                  value: 1,
                  color: ['#ef4444', '#f59e0b', '#fbbf24', '#10b981'][index % 4]
                })) || []}
                title="🎯 Security Recommendations"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderPolice = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>👮 Police Forces</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Police Analysis')}>Police Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Force Management')}>Force Management</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Force</th>
                <th>Type</th>
                <th>Jurisdiction</th>
                <th>Officers</th>
                <th>Budget</th>
                <th>Crime Reduction</th>
                <th>Community Trust</th>
                <th>Corruption</th>
                <th>Clearance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {securityData?.policeForces?.map((force) => (
                <tr key={force.id}>
                  <td><strong>{force.name}</strong></td>
                  <td>{force.type}</td>
                  <td>{force.jurisdiction}</td>
                  <td>{formatNumber(force.officers.length)}</td>
                  <td>{formatCurrency(force.budget)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPerformanceColor(force.performance.crimeReduction), 
                      color: 'white' 
                    }}>
                      {force.performance.crimeReduction}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPerformanceColor(force.performance.communityTrust), 
                      color: 'white' 
                    }}>
                      {force.performance.communityTrust}%
                    </span>
                  </td>
                  <td>{force.corruption}%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getSecurityClearanceColor(force.securityClearance), 
                      color: 'white' 
                    }}>
                      {force.securityClearance}
                    </span>
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

  const renderFederal = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🏛️ Federal Agencies</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Federal Analysis')}>Federal Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Agency Management')}>Agency Management</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Type</th>
                <th>Headquarters</th>
                <th>Personnel</th>
                <th>Budget</th>
                <th>Intelligence Gathering</th>
                <th>Clearance</th>
                <th>Operations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {securityData?.federalAgencies?.map((agency) => (
                <tr key={agency.id}>
                  <td><strong>{agency.name}</strong></td>
                  <td>{agency.type}</td>
                  <td>{agency.headquarters}</td>
                  <td>{formatNumber(agency.personnel.length)}</td>
                  <td>{formatCurrency(agency.budget)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPerformanceColor(agency.performance.intelligenceGathering), 
                      color: 'white' 
                    }}>
                      {agency.performance.intelligenceGathering}%
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getSecurityClearanceColor(agency.securityClearance), 
                      color: 'white' 
                    }}>
                      {agency.securityClearance}
                    </span>
                  </td>
                  <td>{agency.operations.slice(0, 2).join(', ')}</td>
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

  const renderPersonal = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>🛡️ Personal Security</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Personal Security Analysis')}>Security Analysis</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Protection Management')}>Protection Management</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Protected Person</th>
                <th>Title</th>
                <th>Position</th>
                <th>Threat Level</th>
                <th>Security Detail</th>
                <th>Budget</th>
                <th>Threat Prevention</th>
                <th>Protocols</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {securityData?.personalSecurity?.map((security) => (
                <tr key={security.id}>
                  <td><strong>{security.protectedPerson.name}</strong></td>
                  <td>{security.protectedPerson.title}</td>
                  <td>{security.protectedPerson.position}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getThreatLevelColor(security.threatLevel), 
                      color: 'white' 
                    }}>
                      {security.threatLevel}
                    </span>
                  </td>
                  <td>{formatNumber(security.securityDetail.length)}</td>
                  <td>{formatCurrency(security.budget)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPerformanceColor(security.performance.threatPrevention), 
                      color: 'white' 
                    }}>
                      {security.performance.threatPrevention}%
                    </span>
                  </td>
                  <td>{security.securityProtocols.slice(0, 2).join(', ')}</td>
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

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel security-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>📈 Security Analytics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn security-theme" onClick={() => console.log('Analytics Report')}>Analytics Report</button>
          <button className="standard-btn security-theme" onClick={() => console.log('Performance Review')}>Performance Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
                <th>Trend</th>
                <th>Recommendations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>System Efficiency</strong></td>
                <td>{securityData?.analytics.systemEfficiency}%</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: getPerformanceColor(securityData?.analytics.systemEfficiency || 0), 
                    color: 'white' 
                  }}>
                    Good
                  </span>
                </td>
                <td>↗️ Improving</td>
                <td>Maintain current protocols</td>
                <td>
                  <button className="standard-btn security-theme">Review</button>
                </td>
              </tr>
              <tr>
                <td><strong>Overall Security</strong></td>
                <td>{securityData?.analytics.overallSecurity}%</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: getPerformanceColor(securityData?.analytics.overallSecurity || 0), 
                    color: 'white' 
                  }}>
                    Excellent
                  </span>
                </td>
                <td>↗️ Improving</td>
                <td>Continue current strategies</td>
                <td>
                  <button className="standard-btn security-theme">Review</button>
                </td>
              </tr>
              <tr>
                <td><strong>Crime Rate</strong></td>
                <td>{securityData?.analytics.crimeRate}%</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    backgroundColor: '#10b981', 
                    color: 'white' 
                  }}>
                    Low
                  </span>
                </td>
                <td>↘️ Decreasing</td>
                <td>Maintain enforcement</td>
                <td>
                  <button className="standard-btn security-theme">Review</button>
                </td>
              </tr>
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
      onRefresh={fetchSecurityData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container security-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && securityData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'police' && renderPolice()}
              {activeTab === 'federal' && renderFederal()}
              {activeTab === 'personal' && renderPersonal()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading security data...' : 'No security data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default SecurityOperationsScreen;

