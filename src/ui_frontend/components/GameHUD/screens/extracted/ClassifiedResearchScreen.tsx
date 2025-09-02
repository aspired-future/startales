/**
 * Classified Research Screen - Secret Government Research & Development
 * 
 * This screen focuses on classified and secret research projects including:
 * - Restricted, Classified, Secret, and Top Secret projects
 * - Security clearances and access controls
 * - Classified personnel and budget management
 * - Security protocols and compliance
 * - Redacted information handling
 * 
 * Distinct from:
 * - Government Research: Public sector research and development
 * - Corporate Research: Private sector research and development
 * - University Research: Academic research and education
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ClassifiedResearchScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface ClassifiedProject {
  id: string;
  codename: string;
  classification: 'RESTRICTED' | 'CLASSIFIED' | 'SECRET' | 'TOP SECRET';
  department: string;
  progress: number;
  maxProgress: number;
  clearanceRequired: string;
  status: 'active' | 'completed' | 'suspended' | 'terminated';
  lastUpdate: string;
  description?: string;
  personnel: number;
  budget: number;
  location: string;
  startDate: string;
  expectedCompletion: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  oversight: string[];
}

interface SecurityPersonnel {
  id: string;
  codename: string;
  clearance: 'RESTRICTED' | 'CLASSIFIED' | 'SECRET' | 'TOP SECRET';
  department: string;
  role: string;
  status: 'active' | 'on-mission' | 'recovery' | 'terminated';
  lastAccess: string;
  accessLevel: number;
  specializations: string[];
}

interface SecurityProtocol {
  id: string;
  name: string;
  classification: 'RESTRICTED' | 'CLASSIFIED' | 'SECRET' | 'TOP SECRET';
  category: 'access-control' | 'data-protection' | 'personnel-security' | 'facility-security';
  status: 'active' | 'review' | 'updated' | 'deprecated';
  lastReview: string;
  compliance: number;
  requirements: string[];
}

interface ClassifiedOverview {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  totalPersonnel: number;
  averageProgress: number;
  securityIncidents: number;
  complianceRate: number;
  clearanceDistribution: {
    restricted: number;
    classified: number;
    secret: number;
    topSecret: number;
  };
}

const ClassifiedResearchScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [classifiedData, setClassifiedData] = useState<{
    overview: ClassifiedOverview;
    projects: ClassifiedProject[];
    personnel: SecurityPersonnel[];
    protocols: SecurityProtocol[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'personnel' | 'protocols'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userClearance] = useState<'RESTRICTED' | 'CLASSIFIED' | 'SECRET' | 'TOP SECRET'>('SECRET'); // Simulated user clearance

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🔒' },
    { id: 'personnel', label: 'Personnel', icon: '👥' },
    { id: 'protocols', label: 'Protocols', icon: '🛡️' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/classified-research', description: 'Get classified research data' }
  ];

  // Utility functions
  const formatCurrency = (value: number, currency: string = 'USD') => {
    if (value >= 1e12) return `${currency} ${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${currency} ${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${currency} ${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${currency} ${(value / 1e3).toFixed(0)}K`;
    return `${currency} ${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'RESTRICTED': return '#10b981';
      case 'CLASSIFIED': return '#fbbf24';
      case 'SECRET': return '#f59e0b';
      case 'TOP SECRET': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'suspended': return '#fbbf24';
      case 'terminated': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#fbbf24';
      case 'high': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getProtocolCategoryColor = (category: string) => {
    switch (category) {
      case 'access-control': return '#ef4444';
      case 'data-protection': return '#3b82f6';
      case 'personnel-security': return '#f59e0b';
      case 'facility-security': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchClassifiedData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/classified-research');
      if (response.ok) {
        const data = await response.json();
        setClassifiedData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch classified research data:', err);
      // Use comprehensive mock data
      setClassifiedData({
        overview: {
          totalProjects: 15,
          activeProjects: 12,
          totalBudget: 125000000,
          totalPersonnel: 89,
          averageProgress: 67.3,
          securityIncidents: 2,
          complianceRate: 94.7,
          clearanceDistribution: {
            restricted: 4,
            classified: 5,
            secret: 4,
            topSecret: 2
          }
        },
        projects: [
          {
            id: 'proj_r001',
            codename: 'Project AURORA',
            classification: 'RESTRICTED',
            department: 'Advanced Materials',
            progress: 85,
            maxProgress: 100,
            clearanceRequired: 'RESTRICTED',
            status: 'active',
            lastUpdate: '2024-01-15',
            description: 'Development of next-generation composite materials for civilian infrastructure',
            personnel: 12,
            budget: 2500000,
            location: 'Research Complex Alpha',
            startDate: '2023-09-01',
            expectedCompletion: '2024-06-01',
            riskLevel: 'low',
            oversight: ['Materials Review Board', 'Safety Committee']
          },
          {
            id: 'proj_c001',
            codename: 'Project NEBULA',
            classification: 'CLASSIFIED',
            department: 'Defense Research',
            progress: 60,
            maxProgress: 80,
            clearanceRequired: 'CLASSIFIED',
            status: 'active',
            lastUpdate: '2024-01-14',
            description: 'Advanced defensive shield technology for military installations',
            personnel: 25,
            budget: 8500000,
            location: 'Defense Research Facility',
            startDate: '2023-11-01',
            expectedCompletion: '2024-08-01',
            riskLevel: 'medium',
            oversight: ['Defense Oversight Committee', 'Military Command']
          },
          {
            id: 'proj_s001',
            codename: 'Project PHANTOM',
            classification: 'SECRET',
            department: 'Intelligence Division',
            progress: 40,
            maxProgress: 60,
            clearanceRequired: 'SECRET',
            status: 'active',
            lastUpdate: '2024-01-13',
            description: 'Stealth technology for reconnaissance operations',
            personnel: 18,
            budget: 12000000,
            location: 'Intelligence Research Center',
            startDate: '2023-12-01',
            expectedCompletion: '2024-09-01',
            riskLevel: 'high',
            oversight: ['Intelligence Oversight Board', 'National Security Council']
          }
        ],
        personnel: [
          {
            id: 'person_001',
            codename: 'Agent SHADOW',
            clearance: 'SECRET',
            department: 'Intelligence Division',
            role: 'Lead Researcher',
            status: 'active',
            lastAccess: '2024-01-15',
            accessLevel: 7,
            specializations: ['Stealth Technology', 'Advanced Materials', 'Signal Processing']
          },
          {
            id: 'person_002',
            codename: 'Agent PHANTOM',
            clearance: 'TOP SECRET',
            department: 'Special Projects',
            role: 'Project Director',
            status: 'active',
            lastAccess: '2024-01-14',
            accessLevel: 9,
            specializations: ['Quantum Physics', 'Theoretical Research', 'Advanced Mathematics']
          },
          {
            id: 'person_003',
            codename: 'Agent GHOST',
            clearance: 'CLASSIFIED',
            department: 'Defense Research',
            role: 'Security Specialist',
            status: 'on-mission',
            lastAccess: '2024-01-10',
            accessLevel: 5,
            specializations: ['Defense Systems', 'Security Protocols', 'Threat Assessment']
          }
        ],
        protocols: [
          {
            id: 'protocol_001',
            name: 'Access Control Protocol Alpha',
            classification: 'SECRET',
            category: 'access-control',
            status: 'active',
            lastReview: '2024-01-01',
            compliance: 98,
            requirements: ['Biometric verification', 'Multi-factor authentication', 'Access logging']
          },
          {
            id: 'protocol_002',
            name: 'Data Protection Standard Beta',
            classification: 'CLASSIFIED',
            category: 'data-protection',
            status: 'active',
            lastReview: '2024-01-05',
            compliance: 95,
            requirements: ['End-to-end encryption', 'Secure transmission', 'Data classification']
          },
          {
            id: 'protocol_003',
            name: 'Personnel Security Protocol Gamma',
            classification: 'RESTRICTED',
            category: 'personnel-security',
            status: 'active',
            lastReview: '2024-01-10',
            compliance: 97,
            requirements: ['Background checks', 'Security clearances', 'Regular reviews']
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassifiedData();
  }, [fetchClassifiedData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Classified Research Overview - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Classified Research Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Projects</span>
            <span className="standard-metric-value">{classifiedData?.overview?.totalProjects || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Active Projects</span>
            <span className="standard-metric-value">{classifiedData?.overview?.activeProjects || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{formatCurrency(classifiedData?.overview?.totalBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Personnel</span>
            <span className="standard-metric-value">{classifiedData?.overview?.totalPersonnel || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Average Progress</span>
            <span className="standard-metric-value">{(classifiedData?.overview?.averageProgress || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Compliance Rate</span>
            <span className="standard-metric-value">{(classifiedData?.overview?.complianceRate || 0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Security Analysis')}>Security Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Compliance Review')}>Compliance Review</button>
        </div>
      </div>

      {/* Active Classified Projects - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🔒 Active Classified Projects</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Classification</th>
                <th>Department</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Budget</th>
                <th>Personnel</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classifiedData?.projects?.slice(0, 5).map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.codename}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.description || '[REDACTED]'}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(project.classification), 
                      color: 'white' 
                    }}>
                      {project.classification}
                    </span>
                  </td>
                  <td>{project.department}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(project.status), 
                      color: 'white' 
                    }}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td>{project.progress}/{project.maxProgress}</td>
                  <td>{formatCurrency(project.budget)}</td>
                  <td>{project.personnel}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskLevelColor(project.riskLevel), 
                      color: 'white' 
                    }}>
                      {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn technology-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel technology-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🛡️ Security Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={classifiedData?.projects?.map(proj => ({
                  label: proj.codename,
                  value: proj.progress,
                  color: getClassificationColor(proj.classification)
                })) || []}
                title="🔒 Project Progress by Classification"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={classifiedData?.overview?.clearanceDistribution ? [
                  { label: 'RESTRICTED', value: classifiedData.overview.clearanceDistribution.restricted, color: '#10b981' },
                  { label: 'CLASSIFIED', value: classifiedData.overview.clearanceDistribution.classified, color: '#fbbf24' },
                  { label: 'SECRET', value: classifiedData.overview.clearanceDistribution.secret, color: '#f59e0b' },
                  { label: 'TOP SECRET', value: classifiedData.overview.clearanceDistribution.topSecret, color: '#ef4444' }
                ] : []}
                title="🔐 Clearance Level Distribution"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderProjects = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🔒 Classified Projects</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Project Analysis')}>Project Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Security Review')}>Security Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Classification</th>
                <th>Department</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Budget</th>
                <th>Personnel</th>
                <th>Location</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classifiedData?.projects?.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.codename}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.description || '[REDACTED]'}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(project.classification), 
                      color: 'white' 
                    }}>
                      {project.classification}
                    </span>
                  </td>
                  <td>{project.department}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(project.status), 
                      color: 'white' 
                    }}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td>{project.progress}/{project.maxProgress}</td>
                  <td>{formatCurrency(project.budget)}</td>
                  <td>{project.personnel}</td>
                  <td>{project.location}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskLevelColor(project.riskLevel), 
                      color: 'white' 
                    }}>
                      {project.riskLevel.charAt(0).toUpperCase() + project.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn technology-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPersonnel = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>👥 Security Personnel</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Personnel Analysis')}>Personnel Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Clearance Review')}>Clearance Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Clearance</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Access Level</th>
                <th>Last Access</th>
                <th>Specializations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classifiedData?.personnel?.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.codename}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(person.clearance), 
                      color: 'white' 
                    }}>
                      {person.clearance}
                    </span>
                  </td>
                  <td>{person.department}</td>
                  <td>{person.role}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(person.status), 
                      color: 'white' 
                    }}>
                      {person.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>Level {person.accessLevel}</td>
                  <td>{person.lastAccess}</td>
                  <td>{person.specializations.join(', ')}</td>
                  <td>
                    <button className="standard-btn technology-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProtocols = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🛡️ Security Protocols</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Protocol Analysis')}>Protocol Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Compliance Review')}>Compliance Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Protocol</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Status</th>
                <th>Compliance</th>
                <th>Last Review</th>
                <th>Requirements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classifiedData?.protocols?.map((protocol) => (
                <tr key={protocol.id}>
                  <td><strong>{protocol.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getClassificationColor(protocol.classification), 
                      color: 'white' 
                    }}>
                      {protocol.classification}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getProtocolCategoryColor(protocol.category), 
                      color: 'white' 
                    }}>
                      {protocol.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(protocol.status), 
                      color: 'white' 
                    }}>
                      {protocol.status.charAt(0).toUpperCase() + protocol.status.slice(1)}
                    </span>
                  </td>
                  <td>{protocol.compliance}%</td>
                  <td>{protocol.lastReview}</td>
                  <td>{protocol.requirements.join(', ')}</td>
                  <td>
                    <button className="standard-btn technology-theme">Manage</button>
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
      onRefresh={fetchClassifiedData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container technology-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && classifiedData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'projects' && renderProjects()}
              {activeTab === 'personnel' && renderPersonnel()}
              {activeTab === 'protocols' && renderProtocols()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading classified research data...' : 'No classified research data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ClassifiedResearchScreen;

