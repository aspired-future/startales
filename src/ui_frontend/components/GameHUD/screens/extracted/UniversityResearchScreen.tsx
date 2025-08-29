import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './UniversityResearchScreen.css';
import '../shared/StandardDesign.css';

interface UniversityResearchScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

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
}

interface ResearchField {
  name: string;
  projects: number;
  funding: number;
  publications: number;
  breakthroughs: number;
}

// Define tabs for the header
const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'projects', label: 'Research Projects', icon: '🔬' },
  { id: 'universities', label: 'Universities', icon: '🏛️' },
  { id: 'collaborations', label: 'Collaborations', icon: '🤝' }
];

const UniversityResearchScreen: React.FC<UniversityResearchScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'universities' | 'collaborations'>('overview');
  const [researchData, setResearchData] = useState({
    projects: [] as ResearchProject[],
    universities: [] as University[],
    fields: [] as ResearchField[],
    totalFunding: 0,
    activeProjects: 0,
    completedProjects: 0,
    publications: 0,
    citations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversityResearchData = useCallback(async () => {
    try {
      setLoading(true);
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
            collaborations: ['Imperial Defense Labs', 'Galactic Security Council']
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
            collaborations: ['Colonial Development Corp', 'Terraforming Initiative']
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
            collaborations: ['AI Research Consortium', 'Medical Ethics Board']
          },
          {
            id: 'proj-004',
            title: 'Sustainable Fusion Reactor Design',
            field: 'Physics',
            university: 'Imperial Energy Institute',
            leadResearcher: 'Dr. Ahmed Hassan',
            status: 'active',
            progress: 34,
            funding: 4500000,
            duration: '6 years',
            description: 'Next-generation fusion reactors for planetary and starship power systems',
            publications: 6,
            citations: 89,
            collaborations: ['Energy Consortium', 'Starship Engineering Corps']
          },
          {
            id: 'proj-005',
            title: 'Xenobiology and Alien Ecosystem Studies',
            field: 'Biology',
            university: 'Frontier Research University',
            leadResearcher: 'Prof. Lisa Rodriguez',
            status: 'planning',
            progress: 12,
            funding: 2100000,
            duration: '4 years',
            description: 'Comprehensive study of alien life forms and ecosystem integration',
            publications: 2,
            citations: 23,
            collaborations: ['Exploration Command', 'Xenobiology Institute']
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
            specializations: ['Computer Science', 'Engineering', 'Physics', 'Mathematics']
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
            specializations: ['Environmental Science', 'Agriculture', 'Geology', 'Climate Studies']
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
            specializations: ['Medicine', 'Neuroscience', 'Biotechnology', 'Genetics']
          },
          {
            id: 'iei',
            name: 'Imperial Energy Institute',
            type: 'research',
            researchRating: 9.0,
            totalFunding: 18700000,
            activeProjects: 15,
            faculty: 189,
            graduateStudents: 567,
            specializations: ['Physics', 'Energy Systems', 'Nuclear Engineering', 'Materials Science']
          }
        ],
        fields: [
          { name: 'Computer Science', projects: 12, funding: 8900000, publications: 145, breakthroughs: 3 },
          { name: 'Medicine', projects: 18, funding: 12300000, publications: 234, breakthroughs: 5 },
          { name: 'Physics', projects: 9, funding: 15600000, publications: 89, breakthroughs: 2 },
          { name: 'Environmental Science', projects: 14, funding: 6700000, publications: 167, breakthroughs: 4 },
          { name: 'Engineering', projects: 21, funding: 11200000, publications: 198, breakthroughs: 6 },
          { name: 'Biology', projects: 16, funding: 7800000, publications: 156, breakthroughs: 3 }
        ],
        totalFunding: 62500000,
        activeProjects: 87,
        completedProjects: 234,
        publications: 1189,
        citations: 12456
      });
      // Don't set error for mock data - it's expected behavior
      console.log('Using mock data for University Research');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversityResearchData();
  }, [fetchUniversityResearchData]);

  // Debug logging
  useEffect(() => {
    console.log('University Research Screen State:', {
      loading,
      error,
      activeTab,
      hasData: researchData && researchData.projects.length > 0,
      projectsCount: researchData?.projects?.length || 0,
      universitiesCount: researchData?.universities?.length || 0,
      fieldsCount: researchData?.fields?.length || 0
    });
  }, [loading, error, activeTab, researchData]);

  // Debug logging
  useEffect(() => {
    console.log('University Research Screen State:', {
      loading,
      error,
      activeTab,
      hasData: researchData && researchData.projects.length > 0,
      projectsCount: researchData?.projects?.length || 0,
      researchData: researchData
    });
  }, [loading, error, activeTab, researchData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'planning': return '#2196F3';
      case 'review': return '#FF9800';
      case 'completed': return '#9C27B0';
      case 'suspended': return '#F44336';
      default: return '#757575';
    }
  };

  const getUniversityTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return '🔬';
      case 'comprehensive': return '🏛️';
      case 'liberal-arts': return '🎨';
      case 'technical': return '⚙️';
      default: return '🎓';
    }
  };

  // API endpoints for the screen
  const apiEndpoints: APIEndpoint[] = [
    { path: '/api/university-research', method: 'GET', description: 'University Research Data' },
    { path: '/api/university-research/projects', method: 'GET', description: 'Research Projects' },
    { path: '/api/university-research/universities', method: 'GET', description: 'Universities' },
    { path: '/api/university-research/fields', method: 'GET', description: 'Research Fields' }
  ];

  if (loading) {
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
        onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'projects' | 'universities' | 'collaborations')}
      >
        <div className="standard-screen-container academic-theme">
          <div className="loading-overlay">Loading university research data...</div>
        </div>
      </BaseScreen>
    );
  }

  const renderOverviewTab = () => (
    <>
      {/* Research Overview - First card in 2-column grid */}
      <div className="standard-panel academic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>📊 Research Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div className="standard-metric">
            <span>Active Projects</span>
            <span className="standard-metric-value">{researchData.activeProjects}</span>
          </div>
          <div className="standard-metric">
            <span>Total Funding</span>
            <span className="standard-metric-value">${(researchData.totalFunding / 1000000).toFixed(1)}M</span>
          </div>
          <div className="standard-metric">
            <span>Publications</span>
            <span className="standard-metric-value">{researchData.publications}</span>
          </div>
          <div className="standard-metric">
            <span>Citations</span>
            <span className="standard-metric-value">{researchData.citations.toLocaleString()}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn academic-theme" onClick={() => console.log('Generate Research Report')}>Generate Report</button>
          <button className="standard-btn academic-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Research Fields Overview - Second card in 2-column grid */}
      <div className="standard-panel academic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🔬 Research Fields</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {researchData.fields.slice(0, 4).map((field, index) => (
            <div key={index} className="standard-metric">
              <span>{field.name}</span>
              <span className="standard-metric-value">{field.projects} projects</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderProjectsTab = () => (
    <>
      {/* Research Projects Overview */}
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🔬 Research Projects</h3>
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
                <th>Publications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData.projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <strong>{project.title}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{project.duration}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#9c27b0',
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${project.progress}%`, 
                          height: '100%', 
                          backgroundColor: getStatusColor(project.status)
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td>${(project.funding / 1000000).toFixed(1)}M</td>
                  <td>{project.publications}</td>
                  <td>
                    <button className="standard-btn academic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderUniversitiesTab = () => (
    <>
      {/* Universities Overview */}
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🏛️ Research Universities</h3>
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
                <th>Specializations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {researchData.universities.map(university => (
                <tr key={university.id}>
                  <td>
                    <strong>{university.name}</strong>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#9c27b0',
                      color: 'white'
                    }}>
                      {university.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {university.researchRating}
                    </span>
                  </td>
                  <td>${(university.totalFunding / 1000000).toFixed(1)}M</td>
                  <td>{university.activeProjects}</td>
                  <td>{university.faculty}</td>
                  <td>{university.graduateStudents}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {university.specializations.slice(0, 3).map((spec, i) => (
                        <span key={i} style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: '#673ab7',
                          color: 'white'
                        }}>
                          {spec}
                        </span>
                      ))}
                      {university.specializations.length > 3 && (
                        <span style={{ 
                          padding: '0.2rem 0.4rem',
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          backgroundColor: '#757575',
                          color: 'white'
                        }}>
                          +{university.specializations.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button className="standard-btn academic-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCollaborationsTab = () => (
    <>
      {/* Research Collaborations Overview */}
      <div className="standard-panel academic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#9c27b0' }}>🤝 Research Collaborations</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Partnership Type</th>
                <th>Organization</th>
                <th>Research Area</th>
                <th>University Partner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#2196f3',
                    color: 'white'
                  }}>
                    Government
                  </span>
                </td>
                <td>Imperial Defense Labs</td>
                <td>Quantum Computing & Cryptography</td>
                <td>Zephyrian Institute of Technology</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#4caf50',
                    color: 'white'
                  }}>
                    Active
                  </span>
                </td>
                <td>
                  <button className="standard-btn academic-theme">Details</button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#ff9800',
                    color: 'white'
                  }}>
                    Corporate
                  </span>
                </td>
                <td>Colonial Development Corp</td>
                <td>Atmospheric Processing</td>
                <td>New Terra University</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#4caf50',
                    color: 'white'
                  }}>
                    Active
                  </span>
                </td>
                <td>
                  <button className="standard-btn academic-theme">Details</button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#9c27b0',
                    color: 'white'
                  }}>
                    Inter-Galactic
                  </span>
                </td>
                <td>Centauri Research Exchange</td>
                <td>Medical Technology</td>
                <td>Centauri Medical College</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#4caf50',
                    color: 'white'
                  }}>
                    Active
                  </span>
                </td>
                <td>
                  <button className="standard-btn academic-theme">Details</button>
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#2196f3',
                    color: 'white'
                  }}>
                    Government
                  </span>
                </td>
                <td>Energy Consortium</td>
                <td>Fusion Reactor Development</td>
                <td>Imperial Energy Institute</td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: '#4caf50',
                    color: 'white'
                  }}>
                    Active
                  </span>
                </td>
                <td>
                  <button className="standard-btn academic-theme">Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
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
      onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'projects' | 'universities' | 'collaborations')}
    >
      <div className="standard-screen-container academic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && researchData && researchData.projects.length > 0 ? (
            <>
              {activeTab === 'overview' && renderOverviewTab()}
              
              {/* Tab Content - Full width below cards */}
              <div style={{ gridColumn: '1 / -1' }}>
                {activeTab === 'projects' && renderProjectsTab()}
                {activeTab === 'universities' && renderUniversitiesTab()}
                {activeTab === 'collaborations' && renderCollaborationsTab()}
              </div>
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading university research data...' : 
               error ? `Error: ${error}` : 
               'No research data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default UniversityResearchScreen;
