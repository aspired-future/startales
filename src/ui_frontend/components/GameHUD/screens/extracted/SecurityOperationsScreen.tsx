import React, { useState, useEffect } from 'react';
import './SecurityOperationsScreen.css';

interface SecurityOperationsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

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

interface NationalGuard {
  id: string;
  name: string;
  personnel: any[];
  readiness: number;
  deployments: any[];
  bases: any[];
  budget: number;
  performance: {
    effectiveness: number;
  };
}

interface Prison {
  id: string;
  name: string;
  type: string;
  security: string;
  capacity: number;
  population: number;
  programs: string[];
  performance: {
    security: number;
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

const SecurityOperationsScreen: React.FC<SecurityOperationsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [securityData, setSecurityData] = useState<{
    policeForces: SecurityForce[];
    federalAgencies: FederalAgency[];
    personalSecurity: PersonalSecurity[];
    nationalGuard: NationalGuard[];
    prisons: Prison[];
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

  const [activeTab, setActiveTab] = useState<'overview' | 'police' | 'federal' | 'personal' | 'guard' | 'prisons' | 'analytics' | 'events'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('/api/security/analytics');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        setSecurityData(data);
      } catch (err) {
        console.warn('Security API not available, using mock data');
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
              personnel: new Array(3500).fill({}),
              operations: [
                { status: 'Active' }, { status: 'Active' }, { status: 'Active' },
                { status: 'Completed' }, { status: 'Completed' }
              ],
              budget: 250000000,
              securityClearance: 'Top Secret',
              performance: {
                intelligenceGathering: 88.7
              }
            },
            {
              id: 'agency_002',
              name: 'Intelligence Service',
              type: 'Intelligence Service',
              headquarters: 'Classified Location',
              personnel: new Array(1800).fill({}),
              operations: [
                { status: 'Active' }, { status: 'Active' },
                { status: 'Completed' }, { status: 'Completed' }, { status: 'Completed' }
              ],
              budget: 400000000,
              securityClearance: 'Top Secret',
              performance: {
                intelligenceGathering: 94.2
              }
            }
          ],
          personalSecurity: [
            {
              id: 'personal_001',
              protectedPerson: {
                name: 'President Alexander Kane',
                title: 'Mr. President',
                position: 'Head of State'
              },
              threatLevel: 'High',
              securityDetail: new Array(24).fill({}),
              securityProtocols: ['Executive Protection', 'Advance Security', 'Counter-Surveillance', 'Emergency Response'],
              budget: 50000000,
              performance: {
                threatPrevention: 98.5
              }
            },
            {
              id: 'personal_002',
              protectedPerson: {
                name: 'Prime Minister Sarah Chen',
                title: 'Prime Minister',
                position: 'Head of Government'
              },
              threatLevel: 'High',
              securityDetail: new Array(18).fill({}),
              securityProtocols: ['Executive Protection', 'Diplomatic Security', 'Counter-Intelligence'],
              budget: 35000000,
              performance: {
                threatPrevention: 96.8
              }
            }
          ],
          nationalGuard: [
            {
              id: 'guard_001',
              name: '1st National Guard Division',
              personnel: new Array(5000).fill({}),
              readiness: 92.3,
              deployments: [
                { status: 'Active' }, { status: 'Active' },
                { status: 'Completed' }, { status: 'Completed' }, { status: 'Completed' }
              ],
              bases: new Array(8).fill({}),
              budget: 120000000,
              performance: {
                effectiveness: 89.4
              }
            },
            {
              id: 'guard_002',
              name: 'Special Operations Guard',
              personnel: new Array(1200).fill({}),
              readiness: 98.7,
              deployments: [
                { status: 'Active' },
                { status: 'Completed' }, { status: 'Completed' }
              ],
              bases: new Array(3).fill({}),
              budget: 80000000,
              performance: {
                effectiveness: 96.2
              }
            }
          ],
          prisons: [
            {
              id: 'prison_001',
              name: 'Central Correctional Facility',
              type: 'Civilian',
              security: 'Maximum',
              capacity: 2500,
              population: 2180,
              programs: ['Rehabilitation', 'Education', 'Vocational Training', 'Mental Health'],
              performance: {
                security: 94.2
              }
            },
            {
              id: 'prison_002',
              name: 'Federal Detention Center',
              type: 'Federal',
              security: 'Supermax',
              capacity: 800,
              population: 650,
              programs: ['Psychological Evaluation', 'Security Protocols'],
              performance: {
                security: 98.7
              }
            },
            {
              id: 'prison_003',
              name: 'Minimum Security Camp',
              type: 'Civilian',
              security: 'Minimum',
              capacity: 1200,
              population: 980,
              programs: ['Work Release', 'Community Service', 'Education', 'Substance Abuse'],
              performance: {
                security: 87.5
              }
            }
          ],
          events: [
            {
              id: 'event_001',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              type: 'Intelligence Operation',
              severity: 'High',
              location: 'Sector 7',
              description: 'Counter-intelligence operation targeting foreign agents',
              resolved: false
            },
            {
              id: 'event_002',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              type: 'Crime',
              severity: 'Medium',
              location: 'Downtown District',
              description: 'Organized crime investigation concluded successfully',
              resolved: true
            },
            {
              id: 'event_003',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              type: 'Emergency',
              severity: 'Critical',
              location: 'Government Quarter',
              description: 'Security breach at federal building - containment successful',
              resolved: true
            },
            {
              id: 'event_004',
              timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
              type: 'Investigation',
              severity: 'Low',
              location: 'Industrial Zone',
              description: 'Routine security audit of critical infrastructure',
              resolved: true
            }
          ],
          analytics: {
            totalBudget: 1200000000,
            totalPersonnel: 15000,
            systemEfficiency: 87.3,
            overallSecurity: 91.2,
            crimeRate: 12.4,
            publicSafety: 88.9,
            recommendations: [
              {
                priority: 'High',
                type: 'Personnel',
                description: 'Increase cybersecurity specialists in federal agencies',
                cost: 15000000,
                timeframe: '6 months'
              },
              {
                priority: 'Medium',
                type: 'Equipment',
                description: 'Upgrade surveillance systems in high-risk areas',
                cost: 25000000,
                timeframe: '12 months'
              },
              {
                priority: 'Low',
                type: 'Training',
                description: 'Enhanced de-escalation training for local police',
                cost: 5000000,
                timeframe: '3 months'
              }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIndicator = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Excellent': 'status-excellent',
      'Good': 'status-good',
      'Fair': 'status-fair',
      'Poor': 'status-poor',
      'Critical': 'status-critical'
    };
    return `${statusMap[status] || 'status-fair'} ${status}`;
  };

  const getClassificationBadge = (classification: string) => {
    const classMap: { [key: string]: string } = {
      'Unclassified': 'classification-unclassified',
      'Confidential': 'classification-confidential',
      'Secret': 'classification-secret',
      'Top Secret': 'classification-top-secret'
    };
    return `${classMap[classification] || 'classification-unclassified'} ${classification}`;
  };

  const getThreatLevelBadge = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'Minimal': 'threat-minimal',
      'Low': 'threat-low',
      'Moderate': 'threat-moderate',
      'High': 'threat-high',
      'Critical': 'threat-critical',
      'Extreme': 'threat-extreme'
    };
    return `${levelMap[level] || 'threat-moderate'} ${level}`;
  };

  const handleAction = (action: string, context?: any) => {
    console.log(`Security Operations Action: ${action}`, context);
    alert(`Security Operations System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  if (loading) {
    return (
      <div className="security-operations-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading security operations data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="security-operations-screen">
        <div className="error-state">
          <h3>⚠️ Error Loading Security Data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!securityData) {
    return (
      <div className="security-operations-screen">
        <div className="no-data-state">
          <h3>🔒 No Security Data Available</h3>
          <p>Security operations information is currently unavailable.</p>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="overview-grid">
      <div className="card">
        <h3>🚔 Security Forces</h3>
        <div className="metric">
          <span className="metric-label">Police Forces</span>
          <span className="metric-value">{securityData.policeForces.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Federal Agencies</span>
          <span className="metric-value">{securityData.federalAgencies.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">National Guard Units</span>
          <span className="metric-value">{securityData.nationalGuard.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Personal Security Details</span>
          <span className="metric-value">{securityData.personalSecurity.length}</span>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => handleAction('Generate Demo Data')}>Generate Demo Data</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Refresh Overview')}>Refresh Overview</button>
        </div>
      </div>

      <div className="card">
        <h3>🏢 Correctional Facilities</h3>
        <div className="metric">
          <span className="metric-label">Prison Facilities</span>
          <span className="metric-value">{securityData.prisons.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Total Capacity</span>
          <span className="metric-value">{securityData.prisons.reduce((sum, p) => sum + p.capacity, 0).toLocaleString()}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Current Population</span>
          <span className="metric-value">{securityData.prisons.reduce((sum, p) => sum + p.population, 0).toLocaleString()}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Occupancy</span>
          <span className="metric-value">
            {((securityData.prisons.reduce((sum, p) => sum + p.population, 0) / 
               securityData.prisons.reduce((sum, p) => sum + p.capacity, 0)) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="card">
        <h3>💰 Budget & Personnel</h3>
        <div className="metric">
          <span className="metric-label">Total Budget</span>
          <span className="metric-value">{formatCurrency(securityData.analytics.totalBudget)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Total Personnel</span>
          <span className="metric-value">{securityData.analytics.totalPersonnel.toLocaleString()}</span>
        </div>
        <div className="metric">
          <span className="metric-label">System Efficiency</span>
          <span className="metric-value">{securityData.analytics.systemEfficiency.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Budget per Person</span>
          <span className="metric-value">{formatCurrency(securityData.analytics.totalBudget / securityData.analytics.totalPersonnel)}</span>
        </div>
      </div>

      <div className="card">
        <h3>📊 Security Metrics</h3>
        <div className="metric">
          <span className="metric-label">Overall Security</span>
          <span className="metric-value">{securityData.analytics.overallSecurity.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Crime Rate</span>
          <span className="metric-value">{securityData.analytics.crimeRate.toFixed(1)}/100k</span>
        </div>
        <div className="metric">
          <span className="metric-label">Public Safety</span>
          <span className="metric-value">{securityData.analytics.publicSafety.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Security Health</span>
          <span className="metric-value status-excellent">Excellent</span>
        </div>
      </div>

      {securityData.analytics.recommendations.length > 0 && (
        <div className="card full-width">
          <h3>⚠️ Security Recommendations</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Timeframe</th>
                </tr>
              </thead>
              <tbody>
                {securityData.analytics.recommendations.map((rec, index) => (
                  <tr key={index}>
                    <td><span className={`threat-level ${getThreatLevelBadge(rec.priority).split(' ')[0]}`}>{rec.priority}</span></td>
                    <td>{rec.type}</td>
                    <td>{rec.description}</td>
                    <td>{formatCurrency(rec.cost)}</td>
                    <td>{rec.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPoliceTab = () => (
    <div className="police-grid">
      {securityData.policeForces.map(force => (
        <div key={force.id} className="card">
          <h3>{force.name}</h3>
          <div className="metric">
            <span className="metric-label">Type</span>
            <span className="metric-value">{force.type}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Jurisdiction</span>
            <span className="metric-value">{force.jurisdiction}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Officers</span>
            <span className="metric-value">{force.officers.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Budget</span>
            <span className="metric-value">{formatCurrency(force.budget)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Crime Reduction</span>
            <span className="metric-value">{force.performance.crimeReduction.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Community Trust</span>
            <span className="metric-value">{force.performance.communityTrust.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Corruption Level</span>
            <span className="metric-value">{force.corruption.toFixed(1)}%</span>
          </div>
          {force.securityClearance !== 'None' && (
            <div className="metric">
              <span className="metric-label">Security Clearance</span>
              <span className={`classification-badge ${getClassificationBadge(force.securityClearance).split(' ')[0]}`}>
                {force.securityClearance}
              </span>
            </div>
          )}
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => handleAction('View Police Details', force)}>View Details</button>
            <button className="btn" onClick={() => handleAction('Manage Officers', force)}>Manage Officers</button>
          </div>
        </div>
      ))}
      
      <div className="card">
        <h3>➕ Create Police Force</h3>
        <p>Establish a new law enforcement organization to maintain public safety and order.</p>
        <div className="actions">
          <button className="btn btn-success" onClick={() => handleAction('Create Police Force')}>Create Police Force</button>
        </div>
      </div>
    </div>
  );

  const renderFederalTab = () => (
    <div className="federal-grid">
      {securityData.federalAgencies.map(agency => (
        <div key={agency.id} className="card">
          <h3>{agency.name}</h3>
          <div className="metric">
            <span className="metric-label">Type</span>
            <span className="metric-value">{agency.type}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Headquarters</span>
            <span className="metric-value">{agency.headquarters}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Personnel</span>
            <span className="metric-value">{agency.personnel.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Active Operations</span>
            <span className="metric-value">{agency.operations.filter(op => op.status === 'Active').length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Budget</span>
            <span className="metric-value">{formatCurrency(agency.budget)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Security Clearance</span>
            <span className={`classification-badge ${getClassificationBadge(agency.securityClearance).split(' ')[0]}`}>
              {agency.securityClearance}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Intelligence Gathering</span>
            <span className="metric-value">{agency.performance.intelligenceGathering.toFixed(1)}%</span>
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => handleAction('View Agency Details', agency)}>View Details</button>
            <button className="btn" onClick={() => handleAction('Manage Operations', agency)}>Operations</button>
          </div>
        </div>
      ))}
      
      <div className="card">
        <h3>➕ Create Federal Agency</h3>
        <p>Establish a new federal law enforcement or intelligence agency.</p>
        <div className="actions">
          <button className="btn btn-success" onClick={() => handleAction('Create Federal Agency')}>Create Agency</button>
        </div>
      </div>
    </div>
  );

  const renderPersonalTab = () => (
    <div className="personal-grid">
      {securityData.personalSecurity.map(security => (
        <div key={security.id} className="card">
          <h3>{security.protectedPerson.name}</h3>
          <div className="metric">
            <span className="metric-label">Title</span>
            <span className="metric-value">{security.protectedPerson.title}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Position</span>
            <span className="metric-value">{security.protectedPerson.position}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Threat Level</span>
            <span className={`threat-level ${getThreatLevelBadge(security.threatLevel).split(' ')[0]}`}>
              {security.threatLevel}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Security Detail</span>
            <span className="metric-value">{security.securityDetail.length} agents</span>
          </div>
          <div className="metric">
            <span className="metric-label">Security Protocols</span>
            <span className="metric-value">{security.securityProtocols.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Budget</span>
            <span className="metric-value">{formatCurrency(security.budget)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Threat Prevention</span>
            <span className="metric-value">{security.performance.threatPrevention.toFixed(1)}%</span>
          </div>
          <div className="protocols-list">
            <h4>Active Protocols:</h4>
            {security.securityProtocols.map((protocol, index) => (
              <div key={index} className="protocol-item">{protocol}</div>
            ))}
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => handleAction('View Security Details', security)}>View Details</button>
            <button className="btn" onClick={() => handleAction('Update Protocols', security)}>Update Protocols</button>
          </div>
        </div>
      ))}
      
      <div className="card">
        <h3>➕ Create Security Detail</h3>
        <p>Establish personal protection for VIPs and high-value targets.</p>
        <div className="actions">
          <button className="btn btn-success" onClick={() => handleAction('Create Security Detail')}>Create Security Detail</button>
        </div>
      </div>
    </div>
  );

  const renderGuardTab = () => (
    <div className="guard-grid">
      {securityData.nationalGuard.map(guard => (
        <div key={guard.id} className="card">
          <h3>{guard.name}</h3>
          <div className="metric">
            <span className="metric-label">Personnel</span>
            <span className="metric-value">{guard.personnel.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Readiness</span>
            <span className="metric-value">{guard.readiness.toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Active Deployments</span>
            <span className="metric-value">{guard.deployments.filter(d => d.status === 'Active').length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Military Bases</span>
            <span className="metric-value">{guard.bases.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Budget</span>
            <span className="metric-value">{formatCurrency(guard.budget)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Effectiveness</span>
            <span className="metric-value">{guard.performance.effectiveness.toFixed(1)}%</span>
          </div>
          <div className="readiness-bar">
            <div className="readiness-label">Readiness Level:</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${guard.readiness}%` }}></div>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => handleAction('View Guard Details', guard)}>View Details</button>
            <button className="btn" onClick={() => handleAction('Deploy Unit', guard)}>Deploy Unit</button>
          </div>
        </div>
      ))}
      
      <div className="card">
        <h3>➕ Create Guard Unit</h3>
        <p>Establish a new National Guard unit for domestic security operations.</p>
        <div className="actions">
          <button className="btn btn-success" onClick={() => handleAction('Create Guard Unit')}>Create Guard Unit</button>
        </div>
      </div>
    </div>
  );

  const renderPrisonsTab = () => (
    <div className="prisons-grid">
      {securityData.prisons.map(prison => (
        <div key={prison.id} className="card">
          <h3>{prison.name}</h3>
          <div className="metric">
            <span className="metric-label">Type</span>
            <span className="metric-value">{prison.type}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Security Level</span>
            <span className="metric-value">{prison.security}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Capacity</span>
            <span className="metric-value">{prison.capacity.toLocaleString()}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Population</span>
            <span className="metric-value">{prison.population.toLocaleString()}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Occupancy Rate</span>
            <span className="metric-value">{((prison.population / prison.capacity) * 100).toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Rehabilitation Programs</span>
            <span className="metric-value">{prison.programs.length}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Security Rating</span>
            <span className="metric-value">{prison.performance.security.toFixed(1)}%</span>
          </div>
          <div className="occupancy-bar">
            <div className="occupancy-label">Occupancy:</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min((prison.population / prison.capacity) * 100, 100)}%`,
                  backgroundColor: (prison.population / prison.capacity) > 0.9 ? '#e74c3c' : '#3498db'
                }}
              ></div>
            </div>
          </div>
          <div className="programs-list">
            <h4>Programs:</h4>
            {prison.programs.map((program, index) => (
              <div key={index} className="program-item">{program}</div>
            ))}
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => handleAction('View Prison Details', prison)}>View Details</button>
            <button className="btn" onClick={() => handleAction('Manage Programs', prison)}>Manage Programs</button>
          </div>
        </div>
      ))}
      
      <div className="card">
        <h3>➕ Create Prison</h3>
        <p>Establish a new correctional facility for the justice system.</p>
        <div className="actions">
          <button className="btn btn-success" onClick={() => handleAction('Create Prison')}>Create Prison</button>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-grid">
      <div className="card">
        <h3>📊 Security Metrics</h3>
        <div className="metric">
          <span className="metric-label">Police Effectiveness</span>
          <span className="metric-value">
            {(securityData.policeForces.reduce((sum, f) => sum + f.performance.crimeReduction, 0) / securityData.policeForces.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Guard Readiness</span>
          <span className="metric-value">
            {(securityData.nationalGuard.reduce((sum, g) => sum + g.readiness, 0) / securityData.nationalGuard.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Prison Security</span>
          <span className="metric-value">
            {(securityData.prisons.reduce((sum, p) => sum + p.performance.security, 0) / securityData.prisons.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Overall Safety</span>
          <span className="metric-value">{securityData.analytics.publicSafety.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Budget Utilization</span>
          <span className="metric-value">{securityData.analytics.systemEfficiency.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Public Trust</span>
          <span className="metric-value">
            {(securityData.policeForces.reduce((sum, f) => sum + f.performance.communityTrust, 0) / securityData.policeForces.length).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="card">
        <h3>🏥 System Health</h3>
        <div className="metric">
          <span className="metric-label">Overall Status</span>
          <span className="metric-value status-excellent">Excellent</span>
        </div>
        <div className="metric">
          <span className="metric-label">Overall Score</span>
          <span className="metric-value">{securityData.analytics.overallSecurity.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Law Enforcement</span>
          <span className="metric-value">
            {(securityData.policeForces.reduce((sum, f) => sum + f.performance.crimeReduction, 0) / securityData.policeForces.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">National Security</span>
          <span className="metric-value">
            {(securityData.federalAgencies.reduce((sum, a) => sum + a.performance.intelligenceGathering, 0) / securityData.federalAgencies.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Corrections</span>
          <span className="metric-value">
            {(securityData.prisons.reduce((sum, p) => sum + p.performance.security, 0) / securityData.prisons.length).toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Public Safety</span>
          <span className="metric-value">{securityData.analytics.publicSafety.toFixed(1)}%</span>
        </div>
      </div>

      <div className="card">
        <h3>🎯 Threat Assessment</h3>
        <div className="metric">
          <span className="metric-label">Crime Level</span>
          <span className="threat-level threat-low">Low</span>
        </div>
        <div className="metric">
          <span className="metric-label">Security Gaps</span>
          <span className="metric-value">3</span>
        </div>
        <div className="metric">
          <span className="metric-label">Risk Factors</span>
          <span className="metric-value">5</span>
        </div>
        <div className="threat-details">
          <h4>Current Threats:</h4>
          <ul>
            <li>Cybersecurity vulnerabilities in federal systems</li>
            <li>Organized crime activities in metropolitan areas</li>
            <li>Prison overcrowding in civilian facilities</li>
          </ul>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => handleAction('Full Threat Assessment')}>Full Assessment</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Mitigation Strategies')}>Mitigation</button>
        </div>
      </div>

      <div className="card">
        <h3>💡 Optimization</h3>
        <div className="metric">
          <span className="metric-label">Efficiency Score</span>
          <span className="metric-value">{securityData.analytics.systemEfficiency.toFixed(1)}%</span>
        </div>
        <div className="optimization-suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>Increase inter-agency coordination</li>
            <li>Implement predictive policing algorithms</li>
            <li>Expand rehabilitation programs</li>
            <li>Enhance cybersecurity training</li>
          </ul>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => handleAction('Optimization Analysis')}>Full Analysis</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Implementation Plan')}>Implementation</button>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="events-grid">
      <div className="card full-width">
        <h3>🚨 Recent Security Events</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {securityData.events.map(event => (
                <tr key={event.id}>
                  <td>{formatDate(event.timestamp)}</td>
                  <td>{event.type}</td>
                  <td><span className={`threat-level ${getThreatLevelBadge(event.severity).split(' ')[0]}`}>{event.severity}</span></td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>{event.resolved ? '✅ Resolved' : '⏳ Ongoing'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="actions">
          <button className="btn btn-danger" onClick={() => handleAction('Record Security Event')}>Record Event</button>
          <button className="btn btn-secondary" onClick={() => handleAction('Export Events')}>Export Events</button>
        </div>
      </div>

      <div className="card">
        <h3>📈 Event Statistics</h3>
        <div className="metric">
          <span className="metric-label">Total Events (30 days)</span>
          <span className="metric-value">47</span>
        </div>
        <div className="metric">
          <span className="metric-label">Critical Events</span>
          <span className="metric-value">3</span>
        </div>
        <div className="metric">
          <span className="metric-label">Resolution Rate</span>
          <span className="metric-value">94.7%</span>
        </div>
        <div className="metric">
          <span className="metric-label">Average Response Time</span>
          <span className="metric-value">12 minutes</span>
        </div>
        <div className="event-types">
          <h4>Event Types:</h4>
          <div className="event-type-item">Crime: 18 events</div>
          <div className="event-type-item">Investigation: 12 events</div>
          <div className="event-type-item">Emergency: 8 events</div>
          <div className="event-type-item">Intelligence: 6 events</div>
          <div className="event-type-item">Other: 3 events</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="security-operations-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏛️ Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'police' ? 'active' : ''}`}
          onClick={() => setActiveTab('police')}
        >
          🚔 Police Forces
        </button>
        <button 
          className={`tab-btn ${activeTab === 'federal' ? 'active' : ''}`}
          onClick={() => setActiveTab('federal')}
        >
          🏢 Federal Agencies
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          🛡️ Personal Security
        </button>
        <button 
          className={`tab-btn ${activeTab === 'guard' ? 'active' : ''}`}
          onClick={() => setActiveTab('guard')}
        >
          🪖 National Guard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'prisons' ? 'active' : ''}`}
          onClick={() => setActiveTab('prisons')}
        >
          🏢 Prison System
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🚨 Security Events
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'police' && renderPoliceTab()}
        {activeTab === 'federal' && renderFederalTab()}
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'guard' && renderGuardTab()}
        {activeTab === 'prisons' && renderPrisonsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'events' && renderEventsTab()}
      </div>
    </div>
  );
};

export default SecurityOperationsScreen;
