/**
 * Corporate Research Screen - Private Sector Research & Development
 * 
 * This screen focuses on corporate research and development including:
 * - Research projects and funding management
 * - Corporation profiles and research budgets
 * - Research partnerships and collaborations
 * - Patent management and intellectual property
 * - Market analysis and ROI projections
 * 
 * Distinct from:
 * - Government Research: Public sector research and development
 * - University Research: Academic research and education
 * - Classified Research: Secret government research projects
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CorporateResearchScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface ResearchProject {
  id: string;
  name: string;
  company: string;
  category: string;
  progress: number;
  maxProgress: number;
  funding: number;
  expectedROI: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  marketPotential: 'low' | 'medium' | 'high' | 'breakthrough';
  teamSize: number;
  startDate: string;
  expectedCompletion: string;
  description: string;
  technologies: string[];
}

interface Corporation {
  id: string;
  name: string;
  industry: string;
  researchBudget: number;
  activeProjects: number;
  completedProjects: number;
  researchEfficiency: number;
  marketCap: number;
  employees: number;
  headquarters: string;
  specialties: string[];
}

interface ResearchPartnership {
  id: string;
  name: string;
  companies: string[];
  focus: string;
  startDate: string;
  duration: number;
  totalFunding: number;
  status: 'proposed' | 'active' | 'completed' | 'cancelled';
  outcomes: string[];
  patents: number;
}

interface Patent {
  id: string;
  title: string;
  company: string;
  category: string;
  filingDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  value: number;
  description: string;
  inventors: string[];
  applications: string[];
}

interface MarketAnalysis {
  totalCorporateFunding: number;
  activeResearchProjects: number;
  averageROI: number;
  patentCount: number;
  partnershipCount: number;
  marketGrowth: number;
  innovationIndex: number;
  competitiveAdvantage: number;
}

const CorporateResearchScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [researchData, setResearchData] = useState<{
    overview: MarketAnalysis;
    projects: ResearchProject[];
    corporations: Corporation[];
    partnerships: ResearchPartnership[];
    patents: Patent[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'corporations' | 'partnerships' | 'patents'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'corporations', label: 'Corporations', icon: '🏢' },
    { id: 'partnerships', label: 'Partnerships', icon: '🤝' },
    { id: 'patents', label: 'Patents', icon: '📜' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/corporate-research', description: 'Get corporate research data' }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'paused': return '#fbbf24';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getMarketPotentialColor = (potential: string) => {
    switch (potential) {
      case 'breakthrough': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPatentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#fbbf24';
      case 'rejected': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPartnershipStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'proposed': return '#fbbf24';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchResearchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/corporate-research');
      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch corporate research data:', err);
      // Use comprehensive mock data
      setResearchData({
        overview: {
          totalCorporateFunding: 1250000000,
          activeResearchProjects: 45,
          averageROI: 285.5,
          patentCount: 156,
          partnershipCount: 23,
          marketGrowth: 12.8,
          innovationIndex: 87.3,
          competitiveAdvantage: 92.1
        },
        projects: [
          {
            id: 'proj_001',
            name: 'Neural-Link Consumer Interface',
            company: 'NeuroTech Industries',
            category: 'Consumer Electronics',
            progress: 75,
            maxProgress: 100,
            funding: 2500000,
            expectedROI: 450,
            status: 'active',
            marketPotential: 'breakthrough',
            teamSize: 18,
            startDate: '2024-01-15',
            expectedCompletion: '2024-06-15',
            description: 'Next-generation brain-computer interface for consumer applications',
            technologies: ['Neural Networks', 'Biotechnology', 'Wireless Communication']
          },
          {
            id: 'proj_002',
            name: 'Quantum Encryption Protocol',
            company: 'SecureSpace Corp',
            category: 'Cybersecurity',
            progress: 45,
            maxProgress: 80,
            funding: 1800000,
            expectedROI: 320,
            status: 'active',
            marketPotential: 'high',
            teamSize: 12,
            startDate: '2024-02-01',
            expectedCompletion: '2024-08-01',
            description: 'Unbreakable encryption using quantum entanglement principles',
            technologies: ['Quantum Computing', 'Cryptography', 'Network Security']
          },
          {
            id: 'proj_003',
            name: 'Automated Mining Drones',
            company: 'Galactic Mining Consortium',
            category: 'Industrial Automation',
            progress: 100,
            maxProgress: 100,
            funding: 3200000,
            expectedROI: 280,
            status: 'completed',
            marketPotential: 'high',
            teamSize: 25,
            startDate: '2023-09-01',
            expectedCompletion: '2024-01-15',
            description: 'Autonomous mining drones for asteroid and planetary resource extraction',
            technologies: ['AI Navigation', 'Robotics', 'Resource Detection']
          }
        ],
        corporations: [
          {
            id: 'corp_001',
            name: 'NeuroTech Industries',
            industry: 'Consumer Electronics',
            researchBudget: 5000000,
            activeProjects: 8,
            completedProjects: 15,
            researchEfficiency: 94.2,
            marketCap: 2500000000,
            employees: 1250,
            headquarters: 'New Silicon Valley',
            specialties: ['Neural Interfaces', 'Biotechnology', 'Consumer Electronics']
          },
          {
            id: 'corp_002',
            name: 'SecureSpace Corp',
            industry: 'Cybersecurity',
            researchBudget: 3200000,
            activeProjects: 6,
            completedProjects: 12,
            researchEfficiency: 89.7,
            marketCap: 1800000000,
            employees: 890,
            headquarters: 'Cyber District',
            specialties: ['Quantum Security', 'Network Protection', 'Data Encryption']
          },
          {
            id: 'corp_003',
            name: 'Galactic Mining Consortium',
            industry: 'Industrial',
            researchBudget: 4500000,
            activeProjects: 10,
            completedProjects: 18,
            researchEfficiency: 91.5,
            marketCap: 3200000000,
            employees: 2100,
            headquarters: 'Industrial Hub',
            specialties: ['Automation', 'Resource Extraction', 'Space Technology']
          }
        ],
        partnerships: [
          {
            id: 'part_001',
            name: 'Quantum Computing Alliance',
            companies: ['SecureSpace Corp', 'NeuroTech Industries'],
            focus: 'Quantum Computing Applications',
            startDate: '2024-01-01',
            duration: 24,
            totalFunding: 8000000,
            status: 'active',
            outcomes: ['Improved quantum algorithms', 'Enhanced security protocols'],
            patents: 5
          },
          {
            id: 'part_002',
            name: 'Space Mining Initiative',
            companies: ['Galactic Mining Consortium', 'StarVision Entertainment'],
            focus: 'Asteroid Resource Extraction',
            startDate: '2023-11-01',
            duration: 36,
            totalFunding: 12000000,
            status: 'active',
            outcomes: ['Advanced mining techniques', 'Resource mapping systems'],
            patents: 8
          }
        ],
        patents: [
          {
            id: 'patent_001',
            title: 'Neural Interface Calibration System',
            company: 'NeuroTech Industries',
            category: 'Biotechnology',
            filingDate: '2024-01-20',
            status: 'approved',
            value: 2500000,
            description: 'Advanced calibration system for neural interface devices',
            inventors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez'],
            applications: ['Medical devices', 'Consumer electronics', 'Gaming systems']
          },
          {
            id: 'patent_002',
            title: 'Quantum-Resistant Encryption Method',
            company: 'SecureSpace Corp',
            category: 'Cybersecurity',
            filingDate: '2024-02-10',
            status: 'pending',
            value: 1800000,
            description: 'Encryption method resistant to quantum computing attacks',
            inventors: ['Dr. Elena Petrov', 'Dr. James Wilson'],
            applications: ['Government systems', 'Financial institutions', 'Military communications']
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchData();
  }, [fetchResearchData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Corporate Research Overview - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Corporate Research Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Funding</span>
            <span className="standard-metric-value">{formatCurrency(researchData?.overview?.totalCorporateFunding || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Projects</span>
            <span className="standard-metric-value">{researchData?.overview?.activeResearchProjects || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Average ROI</span>
            <span className="standard-metric-value">{(researchData?.overview?.averageROI || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Patents</span>
            <span className="standard-metric-value">{researchData?.overview?.patentCount || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Partnerships</span>
            <span className="standard-metric-value">{researchData?.overview?.partnershipCount || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Market Growth</span>
            <span className="standard-metric-value">{(researchData?.overview?.marketGrowth || 0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('ROI Review')}>ROI Review</button>
        </div>
      </div>

      {/* Active Research Projects - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📋 Active Research Projects</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Company</th>
                <th>Category</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Funding</th>
                <th>Expected ROI</th>
                <th>Market Potential</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.slice(0, 5).map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong></td>
                  <td>{project.company}</td>
                  <td>{project.category}</td>
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
                  <td>{formatCurrency(project.funding)}</td>
                  <td>{project.expectedROI}%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getMarketPotentialColor(project.marketPotential), 
                      color: 'white' 
                    }}>
                      {project.marketPotential.charAt(0).toUpperCase() + project.marketPotential.slice(1)}
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

      {/* Research Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel technology-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📈 Research Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={researchData?.projects?.map(proj => ({
                  label: proj.name,
                  value: proj.progress,
                  color: getStatusColor(proj.status)
                })) || []}
                title="📋 Project Progress (%)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={researchData?.corporations?.map((corp, index) => ({
                  label: corp.name,
                  value: corp.activeProjects,
                  color: getStatusColor('active')
                })) || []}
                title="🏢 Corporation Project Distribution"
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
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📋 Research Projects</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Project Analysis')}>Project Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Funding Review')}>Funding Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Company</th>
                <th>Category</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Funding</th>
                <th>Expected ROI</th>
                <th>Team Size</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.description}</small>
                  </td>
                  <td>{project.company}</td>
                  <td>{project.category}</td>
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
                  <td>{formatCurrency(project.funding)}</td>
                  <td>{project.expectedROI}%</td>
                  <td>{project.teamSize}</td>
                  <td>{project.startDate}</td>
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

  const renderCorporations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🏢 Corporations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Corporation Analysis')}>Corporation Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Budget Review')}>Budget Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Corporation</th>
                <th>Industry</th>
                <th>Research Budget</th>
                <th>Active Projects</th>
                <th>Completed</th>
                <th>Efficiency</th>
                <th>Market Cap</th>
                <th>Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.corporations?.map((corp) => (
                <tr key={corp.id}>
                  <td>
                    <strong>{corp.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{corp.headquarters}</small>
                  </td>
                  <td>{corp.industry}</td>
                  <td>{formatCurrency(corp.researchBudget)}</td>
                  <td>{corp.activeProjects}</td>
                  <td>{corp.completedProjects}</td>
                  <td>{corp.researchEfficiency}%</td>
                  <td>{formatCurrency(corp.marketCap)}</td>
                  <td>{formatNumber(corp.employees)}</td>
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

  const renderPartnerships = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🤝 Research Partnerships</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Partnership Analysis')}>Partnership Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Collaboration Review')}>Collaboration Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Partnership</th>
                <th>Companies</th>
                <th>Focus</th>
                <th>Status</th>
                <th>Total Funding</th>
                <th>Duration</th>
                <th>Patents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.partnerships?.map((partnership) => (
                <tr key={partnership.id}>
                  <td><strong>{partnership.name}</strong></td>
                  <td>{partnership.companies.join(', ')}</td>
                  <td>{partnership.focus}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPartnershipStatusColor(partnership.status), 
                      color: 'white' 
                    }}>
                      {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatCurrency(partnership.totalFunding)}</td>
                  <td>{partnership.duration} months</td>
                  <td>{partnership.patents}</td>
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

  const renderPatents = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📜 Patents & IP</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Patent Analysis')}>Patent Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('IP Management')}>IP Management</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Patent</th>
                <th>Company</th>
                <th>Category</th>
                <th>Status</th>
                <th>Filing Date</th>
                <th>Value</th>
                <th>Inventors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.patents?.map((patent) => (
                <tr key={patent.id}>
                  <td>
                    <strong>{patent.title}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{patent.description}</small>
                  </td>
                  <td>{patent.company}</td>
                  <td>{patent.category}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPatentStatusColor(patent.status), 
                      color: 'white' 
                    }}>
                      {patent.status.charAt(0).toUpperCase() + patent.status.slice(1)}
                    </span>
                  </td>
                  <td>{patent.filingDate}</td>
                  <td>{formatCurrency(patent.value)}</td>
                  <td>{patent.inventors.join(', ')}</td>
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

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchResearchData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container technology-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && researchData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'projects' && renderProjects()}
              {activeTab === 'corporations' && renderCorporations()}
              {activeTab === 'partnerships' && renderPartnerships()}
              {activeTab === 'patents' && renderPatents()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading corporate research data...' : 'No corporate research data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CorporateResearchScreen;

