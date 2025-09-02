/**
 * University Research Screen - Academic Research & Development
 * 
 * This screen focuses on university research and academic development including:
 * - Research projects and academic publications
 * - University profiles and research ratings
 * - Research collaborations and partnerships
 * - Academic fields and specializations
 * - Research funding and citations
 * 
 * Distinct from:
 * - Government Research: Public sector research and development
 * - Corporate Research: Private sector research and development
 * - Classified Research: Secret government research projects
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './UniversityResearchScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface ResearchProject {
  id: string;
  title: string;
  field: string;
  university: string;
  leadResearcher: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'suspended';
  progress: number;
  funding: number;
  duration: string;
  description: string;
  publications: number;
  citations: number;
  collaborations: string[];
  startDate: string;
  expectedCompletion: string;
}

interface University {
  id: string;
  name: string;
  type: 'research' | 'comprehensive' | 'liberal-arts' | 'technical';
  researchRating: number;
  totalFunding: number;
  activeProjects: number;
  faculty: number;
  graduateStudents: number;
  specializations: string[];
  location: string;
  established: string;
}

interface ResearchField {
  name: string;
  projects: number;
  funding: number;
  publications: number;
  breakthroughs: number;
  researchers: number;
  institutions: number;
}

interface Collaboration {
  id: string;
  name: string;
  type: 'inter-university' | 'industry-partnership' | 'government-grant' | 'international';
  participants: string[];
  focus: string;
  startDate: string;
  duration: number;
  totalFunding: number;
  status: 'proposed' | 'active' | 'completed' | 'cancelled';
  outcomes: string[];
  publications: number;
}

interface AcademicOverview {
  totalFunding: number;
  activeProjects: number;
  completedProjects: number;
  publications: number;
  citations: number;
  researchInstitutions: number;
  facultyMembers: number;
  graduateStudents: number;
  averageResearchRating: number;
}

const UniversityResearchScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [researchData, setResearchData] = useState<{
    overview: AcademicOverview;
    projects: ResearchProject[];
    universities: University[];
    fields: ResearchField[];
    collaborations: Collaboration[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'universities' | 'collaborations'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🔬' },
    { id: 'universities', label: 'Universities', icon: '🏛️' },
    { id: 'collaborations', label: 'Collaborations', icon: '🤝' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/university-research', description: 'Get university research data' }
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
      case 'review': return '#fbbf24';
      case 'planning': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getUniversityTypeColor = (type: string) => {
    switch (type) {
      case 'research': return '#ef4444';
      case 'comprehensive': return '#3b82f6';
      case 'technical': return '#f59e0b';
      case 'liberal-arts': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCollaborationTypeColor = (type: string) => {
    switch (type) {
      case 'international': return '#ef4444';
      case 'government-grant': return '#3b82f6';
      case 'industry-partnership': return '#f59e0b';
      case 'inter-university': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchUniversityResearchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/university-research');
      if (response.ok) {
        const data = await response.json();
        setResearchData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch university research data:', err);
      // Use comprehensive mock data
      setResearchData({
        overview: {
          totalFunding: 62500000,
          activeProjects: 87,
          completedProjects: 234,
          publications: 1189,
          citations: 12456,
          researchInstitutions: 15,
          facultyMembers: 2340,
          graduateStudents: 8900,
          averageResearchRating: 8.9
        },
        projects: [
          {
            id: 'proj-001',
            title: 'Quantum Computing Applications in Cryptography',
            field: 'Computer Science',
            university: 'Zephyrian Institute of Technology',
            leadResearcher: 'Dr. Elena Vasquez',
            status: 'active',
            progress: 67,
            funding: 2500000,
            duration: '3 years',
            description: 'Developing quantum-resistant encryption algorithms for interstellar communications',
            publications: 12,
            citations: 234,
            collaborations: ['Imperial Defense Labs', 'Galactic Security Council'],
            startDate: '2024-01-15',
            expectedCompletion: '2027-01-15'
          },
          {
            id: 'proj-002',
            title: 'Bioengineered Atmospheric Processors',
            field: 'Environmental Science',
            university: 'New Terra University',
            leadResearcher: 'Prof. Marcus Chen',
            status: 'active',
            progress: 43,
            funding: 1800000,
            duration: '4 years',
            description: 'Creating self-sustaining atmospheric systems for terraforming operations',
            publications: 8,
            citations: 156,
            collaborations: ['Colonial Development Corp', 'Terraforming Initiative'],
            startDate: '2024-02-01',
            expectedCompletion: '2028-02-01'
          },
          {
            id: 'proj-003',
            title: 'Neural Interface Technology',
            field: 'Neuroscience',
            university: 'Centauri Medical College',
            leadResearcher: 'Dr. Sarah Kim',
            status: 'review',
            progress: 89,
            funding: 3200000,
            duration: '5 years',
            description: 'Direct brain-computer interfaces for enhanced human-AI collaboration',
            publications: 15,
            citations: 445,
            collaborations: ['AI Research Consortium', 'Medical Ethics Board'],
            startDate: '2023-09-01',
            expectedCompletion: '2028-09-01'
          }
        ],
        universities: [
          {
            id: 'zit',
            name: 'Zephyrian Institute of Technology',
            type: 'technical',
            researchRating: 9.2,
            totalFunding: 12500000,
            activeProjects: 23,
            faculty: 456,
            graduateStudents: 1234,
            specializations: ['Computer Science', 'Engineering', 'Physics', 'Mathematics'],
            location: 'Zephyr Prime',
            established: '2156'
          },
          {
            id: 'ntu',
            name: 'New Terra University',
            type: 'comprehensive',
            researchRating: 8.7,
            totalFunding: 8900000,
            activeProjects: 18,
            faculty: 678,
            graduateStudents: 2100,
            specializations: ['Environmental Science', 'Agriculture', 'Geology', 'Climate Studies'],
            location: 'New Terra',
            established: '2189'
          },
          {
            id: 'cmc',
            name: 'Centauri Medical College',
            type: 'research',
            researchRating: 9.5,
            totalFunding: 15200000,
            activeProjects: 31,
            faculty: 234,
            graduateStudents: 890,
            specializations: ['Medicine', 'Neuroscience', 'Biotechnology', 'Genetics'],
            location: 'Alpha Centauri',
            established: '2178'
          }
        ],
        fields: [
          { name: 'Computer Science', projects: 12, funding: 8900000, publications: 145, breakthroughs: 3, researchers: 89, institutions: 8 },
          { name: 'Medicine', projects: 18, funding: 12300000, publications: 234, breakthroughs: 5, researchers: 156, institutions: 12 },
          { name: 'Physics', projects: 9, funding: 15600000, publications: 89, breakthroughs: 2, researchers: 67, institutions: 6 },
          { name: 'Environmental Science', projects: 14, funding: 6700000, publications: 167, breakthroughs: 4, researchers: 98, institutions: 9 },
          { name: 'Engineering', projects: 21, funding: 11200000, publications: 198, breakthroughs: 6, researchers: 134, institutions: 11 },
          { name: 'Biology', projects: 16, funding: 7800000, publications: 156, breakthroughs: 3, researchers: 112, institutions: 10 }
        ],
        collaborations: [
          {
            id: 'collab_001',
            name: 'Interstellar Research Consortium',
            type: 'inter-university',
            participants: ['Zephyrian Institute', 'New Terra University', 'Centauri Medical College'],
            focus: 'Cross-disciplinary space research',
            startDate: '2024-01-01',
            duration: 36,
            totalFunding: 15000000,
            status: 'active',
            outcomes: ['Improved research coordination', 'Shared resources', 'Joint publications'],
            publications: 28
          },
          {
            id: 'collab_002',
            name: 'AI Ethics Research Partnership',
            type: 'industry-partnership',
            participants: ['Centauri Medical College', 'AI Research Consortium'],
            focus: 'Ethical AI development and medical applications',
            startDate: '2023-11-01',
            duration: 24,
            totalFunding: 8000000,
            status: 'active',
            outcomes: ['Ethical guidelines', 'Medical AI protocols', 'Safety standards'],
            publications: 15
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversityResearchData();
  }, [fetchUniversityResearchData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Academic Research Overview - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Academic Research Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Funding</span>
            <span className="standard-metric-value">{formatCurrency(researchData?.overview?.totalFunding || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Active Projects</span>
            <span className="standard-metric-value">{researchData?.overview?.activeProjects || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Publications</span>
            <span className="standard-metric-value">{formatNumber(researchData?.overview?.publications || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Citations</span>
            <span className="standard-metric-value">{formatNumber(researchData?.overview?.citations || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Research Institutions</span>
            <span className="standard-metric-value">{researchData?.overview?.researchInstitutions || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Faculty Members</span>
            <span className="standard-metric-value">{formatNumber(researchData?.overview?.facultyMembers || 0)}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Academic Analysis')}>Academic Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Research Review')}>Research Review</button>
        </div>
      </div>

      {/* Active Research Projects - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🔬 Active Research Projects</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Field</th>
                <th>University</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Funding</th>
                <th>Publications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.slice(0, 5).map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.title}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.leadResearcher}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#8b5cf6', 
                      color: 'white' 
                    }}>
                      {project.field}
                    </span>
                  </td>
                  <td>{project.university}</td>
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
                  <td>{project.progress}%</td>
                  <td>{formatCurrency(project.funding)}</td>
                  <td>{project.publications}</td>
                  <td>
                    <button className="standard-btn technology-theme">Details</button>
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
                  label: proj.title.substring(0, 20) + '...',
                  value: proj.progress,
                  color: getStatusColor(proj.status)
                })) || []}
                title="🔬 Project Progress (%)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={researchData?.fields?.map((field, index) => ({
                  label: field.name,
                  value: field.projects,
                  color: ['#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#fbbf24'][index % 6]
                })) || []}
                title="📚 Research Fields Distribution"
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
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🔬 Research Projects</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Project Analysis')}>Project Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Funding Review')}>Funding Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Field</th>
                <th>University</th>
                <th>Lead Researcher</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Funding</th>
                <th>Duration</th>
                <th>Publications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.projects?.map((project) => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.title}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.description}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#8b5cf6', 
                      color: 'white' 
                    }}>
                      {project.field}
                    </span>
                  </td>
                  <td>{project.university}</td>
                  <td>{project.leadResearcher}</td>
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
                  <td>{project.progress}%</td>
                  <td>{formatCurrency(project.funding)}</td>
                  <td>{project.duration}</td>
                  <td>{project.publications}</td>
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

  const renderUniversities = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🏛️ Research Universities</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('University Analysis')}>University Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Rating Review')}>Rating Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>University</th>
                <th>Type</th>
                <th>Research Rating</th>
                <th>Total Funding</th>
                <th>Active Projects</th>
                <th>Faculty</th>
                <th>Graduate Students</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData?.universities?.map((university) => (
                <tr key={university.id}>
                  <td>
                    <strong>{university.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>Est. {university.established}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getUniversityTypeColor(university.type), 
                      color: 'white' 
                    }}>
                      {university.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>{university.researchRating}/10</td>
                  <td>{formatCurrency(university.totalFunding)}</td>
                  <td>{university.activeProjects}</td>
                  <td>{formatNumber(university.faculty)}</td>
                  <td>{formatNumber(university.graduateStudents)}</td>
                  <td>{university.location}</td>
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

  const renderCollaborations = () => (
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
                <th>Participants</th>
                <th>Focus</th>
                <th>Status</th>
                <th>Total Funding</th>
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
                      {collab.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>{collab.participants.join(', ')}</td>
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
                  <td>{formatCurrency(collab.totalFunding)}</td>
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
      onRefresh={fetchUniversityResearchData}
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
              {activeTab === 'universities' && renderUniversities()}
              {activeTab === 'collaborations' && renderCollaborations()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading university research data...' : 'No university research data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default UniversityResearchScreen;

