import React, { useState, useEffect } from 'react';
import './UniversityResearchScreen.css';

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

const UniversityResearchScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    fetchUniversityResearchData();
  }, []);

  const fetchUniversityResearchData = async () => {
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
      setError('Using mock data - API not available');
    } finally {
      setLoading(false);
    }
  };

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

  const renderOverview = () => (
    <div className="research-overview">
      <div className="research-metrics">
        <div className="metric-card">
          <div className="metric-value">{researchData.activeProjects}</div>
          <div className="metric-label">Active Projects</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">${(researchData.totalFunding / 1000000).toFixed(1)}M</div>
          <div className="metric-label">Total Funding</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{researchData.publications}</div>
          <div className="metric-label">Publications</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{researchData.citations.toLocaleString()}</div>
          <div className="metric-label">Citations</div>
        </div>
      </div>

      <div className="research-fields-overview">
        <h3>Research Fields</h3>
        <div className="fields-grid">
          {researchData.fields.map((field, index) => (
            <div key={index} className="field-card">
              <h4>{field.name}</h4>
              <div className="field-stats">
                <div className="field-stat">
                  <span className="stat-label">Projects:</span>
                  <span className="stat-value">{field.projects}</span>
                </div>
                <div className="field-stat">
                  <span className="stat-label">Funding:</span>
                  <span className="stat-value">${(field.funding / 1000000).toFixed(1)}M</span>
                </div>
                <div className="field-stat">
                  <span className="stat-label">Publications:</span>
                  <span className="stat-value">{field.publications}</span>
                </div>
                <div className="field-stat">
                  <span className="stat-label">Breakthroughs:</span>
                  <span className="stat-value">{field.breakthroughs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="research-projects">
      <div className="projects-header">
        <h3>Active Research Projects</h3>
        <div className="projects-filters">
          <select className="filter-select">
            <option value="">All Fields</option>
            {researchData.fields.map((field, index) => (
              <option key={index} value={field.name}>{field.name}</option>
            ))}
          </select>
          <select className="filter-select">
            <option value="">All Universities</option>
            {researchData.universities.map((uni) => (
              <option key={uni.id} value={uni.name}>{uni.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="projects-list">
        {researchData.projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h4>{project.title}</h4>
              <div className="project-status" style={{ backgroundColor: getStatusColor(project.status) }}>
                {project.status.toUpperCase()}
              </div>
            </div>
            <div className="project-details">
              <div className="project-info">
                <div className="info-row">
                  <span className="info-label">Field:</span>
                  <span className="info-value">{project.field}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">University:</span>
                  <span className="info-value">{project.university}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lead Researcher:</span>
                  <span className="info-value">{project.leadResearcher}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{project.duration}</span>
                </div>
              </div>
              <div className="project-metrics">
                <div className="metric">
                  <span className="metric-label">Progress:</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-label">Funding:</span>
                  <span className="metric-value">${(project.funding / 1000000).toFixed(1)}M</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Publications:</span>
                  <span className="metric-value">{project.publications}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Citations:</span>
                  <span className="metric-value">{project.citations}</span>
                </div>
              </div>
            </div>
            <div className="project-description">
              <p>{project.description}</p>
            </div>
            {project.collaborations.length > 0 && (
              <div className="project-collaborations">
                <span className="collab-label">Collaborations:</span>
                {project.collaborations.map((collab, index) => (
                  <span key={index} className="collab-tag">{collab}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderUniversities = () => (
    <div className="research-universities">
      <h3>Research Universities</h3>
      <div className="universities-grid">
        {researchData.universities.map((university) => (
          <div key={university.id} className="university-card">
            <div className="university-header">
              <div className="university-icon">{getUniversityTypeIcon(university.type)}</div>
              <div className="university-info">
                <h4>{university.name}</h4>
                <div className="university-type">{university.type.replace('-', ' ').toUpperCase()}</div>
              </div>
              <div className="university-rating">
                <div className="rating-value">{university.researchRating}</div>
                <div className="rating-label">Rating</div>
              </div>
            </div>
            <div className="university-stats">
              <div className="stat-row">
                <span className="stat-label">Total Funding:</span>
                <span className="stat-value">${(university.totalFunding / 1000000).toFixed(1)}M</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Active Projects:</span>
                <span className="stat-value">{university.activeProjects}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Faculty:</span>
                <span className="stat-value">{university.faculty}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Graduate Students:</span>
                <span className="stat-value">{university.graduateStudents}</span>
              </div>
            </div>
            <div className="university-specializations">
              <div className="spec-label">Specializations:</div>
              <div className="spec-tags">
                {university.specializations.map((spec, index) => (
                  <span key={index} className="spec-tag">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCollaborations = () => (
    <div className="research-collaborations">
      <h3>Research Collaborations</h3>
      <div className="collaboration-types">
        <div className="collab-section">
          <h4>🏛️ Government Partnerships</h4>
          <div className="collab-list">
            <div className="collab-item">Imperial Defense Labs - Quantum Computing & Cryptography</div>
            <div className="collab-item">Galactic Security Council - Neural Interface Security</div>
            <div className="collab-item">Energy Consortium - Fusion Reactor Development</div>
            <div className="collab-item">Exploration Command - Xenobiology Studies</div>
          </div>
        </div>
        <div className="collab-section">
          <h4>🏢 Corporate Partnerships</h4>
          <div className="collab-list">
            <div className="collab-item">Colonial Development Corp - Atmospheric Processing</div>
            <div className="collab-item">Starship Engineering Corps - Fusion Power Systems</div>
            <div className="collab-item">AI Research Consortium - Neural Interfaces</div>
            <div className="collab-item">Terraforming Initiative - Environmental Systems</div>
          </div>
        </div>
        <div className="collab-section">
          <h4>🌌 Inter-Galactic Research</h4>
          <div className="collab-list">
            <div className="collab-item">Centauri Research Exchange - Medical Technology</div>
            <div className="collab-item">Vegan Science Collective - Environmental Studies</div>
            <div className="collab-item">Sirian Physics Institute - Energy Research</div>
            <div className="collab-item">Kepler Tech Alliance - Computer Science</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="university-research-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading university research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="university-research-screen">
      <div className="screen-header">
        <h1>🔬 University Research Systems</h1>
        <p>Academic research projects, university partnerships, and scholarly collaboration</p>
        {error && <div className="error-notice">⚠️ {error}</div>}
      </div>

      <div className="screen-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          🔬 Research Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'universities' ? 'active' : ''}`}
          onClick={() => setActiveTab('universities')}
        >
          🏛️ Universities
        </button>
        <button 
          className={`tab-btn ${activeTab === 'collaborations' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborations')}
        >
          🤝 Collaborations
        </button>
      </div>

      <div className="screen-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'universities' && renderUniversities()}
        {activeTab === 'collaborations' && renderCollaborations()}
      </div>
    </div>
  );
};

export default UniversityResearchScreen;
