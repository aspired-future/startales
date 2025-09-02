/**
 * Science Technology Screen - Research and Development Management
 * 
 * This screen focuses on scientific research and technology development including:
 * - Research projects and technology trees
 * - Innovation management and breakthroughs
 * - Research collaboration and partnerships
 * - Technology applications and commercialization
 * - Research ethics and regulations
 * 
 * Distinct from:
 * - Corporate Research: Private sector research and development
 * - University Research: Academic research and education
 * - Classified Research: Secret government research projects
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ScienceTechnologyScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Technology {
  id: string;
  name: string;
  category: string;
  progress: number;
  maxProgress: number;
  cost: number;
  status: 'researched' | 'researching' | 'available' | 'locked';
  description?: string;
  prerequisites?: string[];
  unlocks?: string[];
  researchers: number;
  efficiency: number;
  breakthroughChance: number;
}

interface ResearchProject {
  id: string;
  name: string;
  category: string;
  leadScientist: string;
  teamSize: number;
  progress: number;
  budget: number;
  startDate: string;
  expectedCompletion: string;
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  breakthroughs: string[];
  challenges: string[];
}

interface Innovation {
  id: string;
  name: string;
  category: string;
  inventor: string;
  discoveryDate: string;
  impact: 'low' | 'medium' | 'high' | 'revolutionary';
  applications: string[];
  commercialization: number;
  patents: number;
  description: string;
}

interface Collaboration {
  id: string;
  name: string;
  type: 'university' | 'corporation' | 'government' | 'international';
  partner: string;
  focus: string;
  startDate: string;
  duration: number;
  budget: number;
  status: 'proposed' | 'active' | 'completed' | 'cancelled';
  outcomes: string[];
  publications: number;
}

interface ResearchAnalysis {
  totalFunding: number;
  researchEfficiency: number;
  breakthroughRate: number;
  publicationCount: number;
  patentCount: number;
  collaborationCount: number;
  technologyReadiness: number;
  innovationIndex: number;
}

const ScienceTechnologyScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [researchData, setResearchData] = useState<{
    overview: ResearchAnalysis;
    technologies: Technology[];
    projects: ResearchProject[];
    innovations: Innovation[];
    collaborations: Collaboration[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'research' | 'projects' | 'innovations' | 'collaboration'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'innovations', label: 'Innovations', icon: '💡' },
    { id: 'collaboration', label: 'Collaboration', icon: '🤝' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/science-technology', description: 'Get science technology data' }
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
      case 'active':
      case 'researching':
      case 'researched':
        return '#10b981';
      case 'planning':
      case 'available':
        return '#fbbf24';
      case 'paused':
      case 'cancelled':
        return '#ef4444';
      case 'locked':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'revolutionary': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCollaborationTypeColor = (type: string) => {
    switch (type) {
      case 'international': return '#ef4444';
      case 'government': return '#3b82f6';
      case 'corporation': return '#f59e0b';
      case 'university': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchResearchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/science-technology');
      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch science technology data:', err);
      // Use comprehensive mock data
      setResearchData({
        overview: {
          totalFunding: 850000000,
          researchEfficiency: 94.2,
          breakthroughRate: 12.5,
          publicationCount: 1250,
          patentCount: 89,
          collaborationCount: 45,
          technologyReadiness: 78.5,
          innovationIndex: 92.1
        },
        technologies: [
          {
            id: 'quantum_computing',
            name: 'Quantum Computing',
            category: 'Computing',
            progress: 100,
            maxProgress: 100,
            cost: 200000000,
            status: 'researched',
            description: 'Revolutionary computing technology using quantum mechanics principles',
            unlocks: ['ai_consciousness'],
            researchers: 25,
            efficiency: 95,
            breakthroughChance: 15
          },
          {
            id: 'fusion_power',
            name: 'Fusion Power',
            category: 'Energy',
            progress: 75,
            maxProgress: 150,
            cost: 150000000,
            status: 'researching',
            description: 'Clean, unlimited energy from nuclear fusion reactions',
            unlocks: ['terraforming'],
            researchers: 18,
            efficiency: 88,
            breakthroughChance: 22
          },
          {
            id: 'neural_interfaces',
            name: 'Neural Interfaces',
            category: 'Biotech',
            progress: 45,
            maxProgress: 120,
            cost: 120000000,
            status: 'researching',
            description: 'Direct brain-computer interface technology',
            researchers: 12,
            efficiency: 82,
            breakthroughChance: 18
          },
          {
            id: 'antimatter_engines',
            name: 'Antimatter Engines',
            category: 'Propulsion',
            progress: 0,
            maxProgress: 300,
            cost: 300000000,
            status: 'available',
            description: 'Ultra-efficient propulsion using antimatter reactions',
            unlocks: ['wormhole_travel'],
            researchers: 0,
            efficiency: 0,
            breakthroughChance: 8
          }
        ],
        projects: [
          {
            id: 'proj_001',
            name: 'Advanced AI Development',
            category: 'Artificial Intelligence',
            leadScientist: 'Dr. Sarah Chen',
            teamSize: 15,
            progress: 65,
            budget: 50000000,
            startDate: '2024-01-15',
            expectedCompletion: '2024-06-15',
            status: 'active',
            priority: 'high',
            breakthroughs: ['Improved neural network efficiency', 'Enhanced learning algorithms'],
            challenges: ['Computational resource limitations', 'Ethical considerations']
          },
          {
            id: 'proj_002',
            name: 'Sustainable Energy Systems',
            category: 'Energy',
            leadScientist: 'Dr. Michael Rodriguez',
            teamSize: 12,
            progress: 45,
            budget: 35000000,
            startDate: '2024-02-01',
            expectedCompletion: '2024-08-01',
            status: 'active',
            priority: 'medium',
            breakthroughs: ['Improved solar cell efficiency', 'Advanced battery technology'],
            challenges: ['Material cost optimization', 'Scalability issues']
          }
        ],
        innovations: [
          {
            id: 'innov_001',
            name: 'Quantum Encryption Protocol',
            category: 'Cybersecurity',
            inventor: 'Dr. Elena Petrov',
            discoveryDate: '2024-01-20',
            impact: 'high',
            applications: ['Government communications', 'Financial transactions', 'Military operations'],
            commercialization: 85,
            patents: 3,
            description: 'Unbreakable encryption using quantum entanglement principles'
          },
          {
            id: 'innov_002',
            name: 'Bio-Engineered Materials',
            category: 'Materials Science',
            inventor: 'Dr. James Wilson',
            discoveryDate: '2024-02-10',
            impact: 'medium',
            applications: ['Medical implants', 'Aerospace components', 'Consumer electronics'],
            commercialization: 65,
            patents: 2,
            description: 'Self-healing materials with biological properties'
          }
        ],
        collaborations: [
          {
            id: 'collab_001',
            name: 'International Fusion Research',
            type: 'international',
            partner: 'European Research Council',
            focus: 'Nuclear Fusion Technology',
            startDate: '2023-09-01',
            duration: 36,
            budget: 75000000,
            status: 'active',
            outcomes: ['Improved plasma containment', 'Enhanced fusion efficiency'],
            publications: 12
          },
          {
            id: 'collab_002',
            name: 'University AI Partnership',
            type: 'university',
            partner: 'MIT Technology Institute',
            focus: 'Machine Learning Algorithms',
            startDate: '2024-01-01',
            duration: 24,
            budget: 25000000,
            status: 'active',
            outcomes: ['Advanced neural networks', 'Improved training methods'],
            publications: 8
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
      {/* Research Overview - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Research & Development Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Funding</span>
            <span className="standard-metric-value">{formatCurrency(researchData?.overview?.totalFunding || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Research Efficiency</span>
            <span className="standard-metric-value">{(researchData?.overview?.researchEfficiency || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Breakthrough Rate</span>
            <span className="standard-metric-value">{(researchData?.overview?.breakthroughRate || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Publications</span>
            <span className="standard-metric-value">{formatNumber(researchData?.overview?.publicationCount || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Patents</span>
            <span className="standard-metric-value">{researchData?.overview?.patentCount || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Collaborations</span>
            <span className="standard-metric-value">{researchData?.overview?.collaborationCount || 0}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Research Analysis')}>Research Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Innovation Review')}>Innovation Review</button>
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
                <th>Category</th>
                <th>Lead Scientist</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Team Size</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.slice(0, 5).map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong></td>
                  <td>{project.category}</td>
                  <td>{project.leadScientist}</td>
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
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(project.priority), 
                      color: 'white' 
                    }}>
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                    </span>
                  </td>
                  <td>{project.progress}%</td>
                  <td>{project.teamSize}</td>
                  <td>{formatCurrency(project.budget)}</td>
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
                data={researchData?.technologies?.map((tech, index) => ({
                  label: tech.category,
                  value: 1,
                  color: getStatusColor(tech.status)
                })) || []}
                title="🔬 Technology Categories"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderResearch = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🔬 Technology Research</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Technology Analysis')}>Technology Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Research Planning')}>Research Planning</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Technology</th>
                <th>Category</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Cost</th>
                <th>Researchers</th>
                <th>Efficiency</th>
                <th>Breakthrough</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.technologies?.map((tech) => (
                <tr key={tech.id}>
                  <td>
                    <strong>{tech.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{tech.description}</small>
                  </td>
                  <td>{tech.category}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(tech.status), 
                      color: 'white' 
                    }}>
                      {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                    </span>
                  </td>
                  <td>{tech.progress}/{tech.maxProgress}</td>
                  <td>{formatCurrency(tech.cost)}</td>
                  <td>{tech.researchers}</td>
                  <td>{tech.efficiency}%</td>
                  <td>{tech.breakthroughChance}%</td>
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

  const renderProjects = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📋 Research Projects</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Project Analysis')}>Project Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Resource Allocation')}>Resource Allocation</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Lead Scientist</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Progress</th>
                <th>Team Size</th>
                <th>Budget</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong></td>
                  <td>{project.category}</td>
                  <td>{project.leadScientist}</td>
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
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(project.priority), 
                      color: 'white' 
                    }}>
                      {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                    </span>
                  </td>
                  <td>{project.progress}%</td>
                  <td>{project.teamSize}</td>
                  <td>{formatCurrency(project.budget)}</td>
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

  const renderInnovations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>💡 Innovations & Discoveries</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Innovation Analysis')}>Innovation Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Patent Management')}>Patent Management</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Innovation</th>
                <th>Category</th>
                <th>Inventor</th>
                <th>Impact</th>
                <th>Commercialization</th>
                <th>Patents</th>
                <th>Discovery Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.innovations?.map((innovation) => (
                <tr key={innovation.id}>
                  <td>
                    <strong>{innovation.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{innovation.description}</small>
                  </td>
                  <td>{innovation.category}</td>
                  <td>{innovation.inventor}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getImpactColor(innovation.impact), 
                      color: 'white' 
                    }}>
                      {innovation.impact.charAt(0).toUpperCase() + innovation.impact.slice(1)}
                    </span>
                  </td>
                  <td>{innovation.commercialization}%</td>
                  <td>{innovation.patents}</td>
                  <td>{innovation.discoveryDate}</td>
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

  const renderCollaboration = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🤝 Research Collaborations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Collaboration Analysis')}>Collaboration Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Partnership Review')}>Partnership Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Collaboration</th>
                <th>Type</th>
                <th>Partner</th>
                <th>Focus</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Duration</th>
                <th>Publications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.collaborations?.map((collab) => (
                <tr key={collab.id}>
                  <td><strong>{collab.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getCollaborationTypeColor(collab.type), 
                      color: 'white' 
                    }}>
                      {collab.type.charAt(0).toUpperCase() + collab.type.slice(1)}
                    </span>
                  </td>
                  <td>{collab.partner}</td>
                  <td>{collab.focus}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(collab.status), 
                      color: 'white' 
                    }}>
                      {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatCurrency(collab.budget)}</td>
                  <td>{collab.duration} months</td>
                  <td>{collab.publications}</td>
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
              {activeTab === 'research' && renderResearch()}
              {activeTab === 'projects' && renderProjects()}
              {activeTab === 'innovations' && renderInnovations()}
              {activeTab === 'collaboration' && renderCollaboration()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading research data...' : 'No research data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default ScienceTechnologyScreen;

