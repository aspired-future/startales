import React, { useState, useEffect, useCallback } from 'react';
import './CorporateResearchScreen.css';

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
}

interface Corporation {
  id: string;
  name: string;
  industry: string;
  researchBudget: number;
  activeProjects: number;
  completedProjects: number;
  researchEfficiency: number;
}

const CorporateResearchScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'corporations' | 'partnerships' | 'patents' | 'market-analysis'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([
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
      marketPotential: 'breakthrough'
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
      marketPotential: 'high'
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
      marketPotential: 'high'
    },
    {
      id: 'proj_004',
      name: 'Bio-Enhanced Food Production',
      company: 'AgriSpace Solutions',
      category: 'Agriculture',
      progress: 60,
      maxProgress: 90,
      funding: 1200000,
      expectedROI: 190,
      status: 'active',
      marketPotential: 'medium'
    },
    {
      id: 'proj_005',
      name: 'Holographic Entertainment System',
      company: 'StarVision Entertainment',
      category: 'Entertainment',
      progress: 30,
      maxProgress: 70,
      funding: 900000,
      expectedROI: 150,
      status: 'paused',
      marketPotential: 'medium'
    }
  ]);

  const [corporations, setCorporations] = useState<Corporation[]>([
    {
      id: 'corp_001',
      name: 'NeuroTech Industries',
      industry: 'Consumer Electronics',
      researchBudget: 5000000,
      activeProjects: 2,
      completedProjects: 8,
      researchEfficiency: 92
    },
    {
      id: 'corp_002',
      name: 'SecureSpace Corp',
      industry: 'Cybersecurity',
      researchBudget: 3500000,
      activeProjects: 1,
      completedProjects: 12,
      researchEfficiency: 88
    },
    {
      id: 'corp_003',
      name: 'Galactic Mining Consortium',
      industry: 'Mining & Resources',
      researchBudget: 8000000,
      activeProjects: 3,
      completedProjects: 15,
      researchEfficiency: 85
    },
    {
      id: 'corp_004',
      name: 'AgriSpace Solutions',
      industry: 'Agriculture',
      researchBudget: 2200000,
      activeProjects: 1,
      completedProjects: 6,
      researchEfficiency: 78
    }
  ]);

  const fetchCorporateResearchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4010/api/corporate-research/projects');
      if (response.ok) {
        const data = await response.json();
        if (data.projects) setResearchProjects(data.projects);
        if (data.corporations) setCorporations(data.corporations);
      }
    } catch (err) {
      console.warn('Failed to fetch corporate research data:', err);
      setError('Using offline data - API unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCorporateResearchData();
  }, [fetchCorporateResearchData]);

  const getMarketPotentialColor = (potential: string) => {
    switch(potential) {
      case 'breakthrough': return '#ff6b6b';
      case 'high': return '#4ecdc4';
      case 'medium': return '#fbbf24';
      case 'low': return '#666';
      default: return '#ccc';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4ecdc4';
      case 'active': return '#fbbf24';
      case 'paused': return '#666';
      case 'cancelled': return '#ef4444';
      default: return '#ccc';
    }
  };

  const totalInvestment = researchProjects.reduce((sum, proj) => sum + proj.funding, 0);
  const activeProjects = researchProjects.filter(proj => proj.status === 'active');
  const completedProjects = researchProjects.filter(proj => proj.status === 'completed');
  const averageROI = researchProjects.reduce((sum, proj) => sum + proj.expectedROI, 0) / researchProjects.length;

  const renderOverview = () => (
    <div className="overview-content">
      <div className="research-stats">
        <div className="stat-card">
          <div className="stat-value">{researchProjects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeProjects.length}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedProjects.length}</div>
          <div className="stat-label">Completed Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{(totalInvestment / 1000000).toFixed(1)}M</div>
          <div className="stat-label">Total Investment</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageROI.toFixed(0)}%</div>
          <div className="stat-label">Average ROI</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{corporations.length}</div>
          <div className="stat-label">Research Partners</div>
        </div>
      </div>

      <div className="key-insights">
        <h3>🎯 Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🚀 Breakthrough Potential</h4>
            <p>Neural-Link Consumer Interface shows 450% ROI potential - revolutionary market impact expected</p>
          </div>
          <div className="insight-card">
            <h4>💰 Investment Efficiency</h4>
            <p>Mining automation projects delivering consistent 280%+ returns with proven market demand</p>
          </div>
          <div className="insight-card">
            <h4>🔒 Security Focus</h4>
            <p>Quantum encryption becoming critical as cyber threats increase across galactic networks</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="projects-content">
      <div className="projects-header">
        <h3>Active Corporate Research Projects</h3>
        <div className="project-filters">
          <select className="filter-select">
            <option value="all">All Categories</option>
            <option value="consumer">Consumer Electronics</option>
            <option value="industrial">Industrial</option>
            <option value="biotech">Biotechnology</option>
            <option value="security">Security</option>
          </select>
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>
      
      <div className="projects-grid">
        {researchProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h4>{project.name}</h4>
              <span 
                className="project-status"
                style={{ color: getStatusColor(project.status) }}
              >
                {project.status.toUpperCase()}
              </span>
            </div>
            <div className="project-company">{project.company}</div>
            <div className="project-category">{project.category}</div>
            
            <div className="project-progress">
              <div className="progress-bar" style={{ width: `${(project.progress / project.maxProgress) * 100}%` }}></div>
            </div>
            <div className="progress-text">
              Progress: {project.progress}/{project.maxProgress} ({((project.progress / project.maxProgress) * 100).toFixed(0)}%)
            </div>
            
            <div className="project-metrics">
              <div className="metric">
                <span className="metric-label">Funding:</span>
                <span className="metric-value">₹{(project.funding / 1000000).toFixed(1)}M</span>
              </div>
              <div className="metric">
                <span className="metric-label">Expected ROI:</span>
                <span className="metric-value">{project.expectedROI}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Market Potential:</span>
                <span 
                  className="metric-value"
                  style={{ color: getMarketPotentialColor(project.marketPotential) }}
                >
                  {project.marketPotential.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCorporations = () => (
    <div className="corporations-content">
      <h3>Research Partner Corporations</h3>
      <div className="corporations-grid">
        {corporations.map(corp => (
          <div key={corp.id} className="corporation-card">
            <div className="corp-header">
              <h4>{corp.name}</h4>
              <span className="corp-industry">{corp.industry}</span>
            </div>
            
            <div className="corp-metrics">
              <div className="corp-metric">
                <span className="metric-label">Research Budget:</span>
                <span className="metric-value">₹{(corp.researchBudget / 1000000).toFixed(1)}M</span>
              </div>
              <div className="corp-metric">
                <span className="metric-label">Active Projects:</span>
                <span className="metric-value">{corp.activeProjects}</span>
              </div>
              <div className="corp-metric">
                <span className="metric-label">Completed:</span>
                <span className="metric-value">{corp.completedProjects}</span>
              </div>
              <div className="corp-metric">
                <span className="metric-label">Efficiency:</span>
                <span className="metric-value">{corp.researchEfficiency}%</span>
              </div>
            </div>
            
            <div className="corp-actions">
              <button className="action-btn">📊 View Projects</button>
              <button className="action-btn">🤝 Partnership Terms</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPartnerships = () => (
    <div className="partnerships-content">
      <h3>Public-Private Research Partnerships</h3>
      <div className="partnerships-grid">
        <div className="partnership-card">
          <h4>🏛️ Government-Corporate Joint Ventures</h4>
          <p>Collaborative projects between government R&D and private industry</p>
          <div className="partnership-stats">
            <div>Active Partnerships: 8</div>
            <div>Total Investment: ₹45M</div>
            <div>Success Rate: 78%</div>
          </div>
        </div>
        <div className="partnership-card">
          <h4>🎓 University-Industry Collaboration</h4>
          <p>Academic research partnerships with commercial applications</p>
          <div className="partnership-stats">
            <div>Active Collaborations: 12</div>
            <div>Student Researchers: 156</div>
            <div>Patents Filed: 23</div>
          </div>
        </div>
        <div className="partnership-card">
          <h4>🌌 Inter-Civilization Tech Exchange</h4>
          <p>Technology sharing agreements with allied civilizations</p>
          <div className="partnership-stats">
            <div>Active Exchanges: 5</div>
            <div>Technologies Shared: 18</div>
            <div>Benefits Gained: 31</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatents = () => (
    <div className="patents-content">
      <h3>Corporate Patents & IP</h3>
      <div className="patents-grid">
        <div className="patent-card">
          <h4>🔬 Recent Patents Filed</h4>
          <div className="patent-list">
            <div className="patent-item">
              <strong>Neural Interface Calibration System</strong>
              <span>NeuroTech Industries - Filed 3 days ago</span>
            </div>
            <div className="patent-item">
              <strong>Quantum Data Compression Algorithm</strong>
              <span>SecureSpace Corp - Filed 1 week ago</span>
            </div>
            <div className="patent-item">
              <strong>Autonomous Mining Swarm Protocol</strong>
              <span>Galactic Mining Consortium - Filed 2 weeks ago</span>
            </div>
          </div>
        </div>
        <div className="patent-card">
          <h4>💰 Patent Revenue Streams</h4>
          <div className="revenue-list">
            <div className="revenue-item">
              <strong>Licensing Revenue:</strong>
              <span>₹12.5M annually</span>
            </div>
            <div className="revenue-item">
              <strong>Patent Portfolio Value:</strong>
              <span>₹89M estimated</span>
            </div>
            <div className="revenue-item">
              <strong>Cross-Licensing Deals:</strong>
              <span>15 active agreements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketAnalysis = () => (
    <div className="market-analysis-content">
      <h3>Research Market Analysis</h3>
      <div className="analysis-grid">
        <div className="analysis-card">
          <h4>📈 Investment Trends</h4>
          <div className="trend-list">
            <div className="trend-item">
              <span className="trend-category">AI & Neural Tech:</span>
              <span className="trend-growth positive">↗ +45%</span>
            </div>
            <div className="trend-item">
              <span className="trend-category">Quantum Computing:</span>
              <span className="trend-growth positive">↗ +38%</span>
            </div>
            <div className="trend-item">
              <span className="trend-category">Biotech:</span>
              <span className="trend-growth positive">↗ +22%</span>
            </div>
            <div className="trend-item">
              <span className="trend-category">Entertainment:</span>
              <span className="trend-growth negative">↘ -12%</span>
            </div>
          </div>
        </div>
        <div className="analysis-card">
          <h4>🎯 Market Opportunities</h4>
          <div className="opportunity-list">
            <div className="opportunity-item high">
              <strong>Neural Consumer Interfaces</strong>
              <span>Market Size: ₹2.8B | Growth: 67%</span>
            </div>
            <div className="opportunity-item medium">
              <strong>Automated Industrial Systems</strong>
              <span>Market Size: ₹1.9B | Growth: 34%</span>
            </div>
            <div className="opportunity-item medium">
              <strong>Quantum Security Solutions</strong>
              <span>Market Size: ₹1.2B | Growth: 28%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="corporate-research-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading corporate research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="corporate-research-screen">
      <div className="screen-header">
        <h1>🏢 Corporate Research & Development</h1>
        <p>Private sector innovation, commercial R&D projects, and industry partnerships</p>
        {error && <div className="error-message">⚠️ {error}</div>}
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
          🔬 R&D Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'corporations' ? 'active' : ''}`}
          onClick={() => setActiveTab('corporations')}
        >
          🏢 Corporations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'partnerships' ? 'active' : ''}`}
          onClick={() => setActiveTab('partnerships')}
        >
          🤝 Partnerships
        </button>
        <button 
          className={`tab-btn ${activeTab === 'patents' ? 'active' : ''}`}
          onClick={() => setActiveTab('patents')}
        >
          📜 Patents & IP
        </button>
        <button 
          className={`tab-btn ${activeTab === 'market-analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('market-analysis')}
        >
          📈 Market Analysis
        </button>
      </div>

      <div className="screen-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'corporations' && renderCorporations()}
        {activeTab === 'partnerships' && renderPartnerships()}
        {activeTab === 'patents' && renderPatents()}
        {activeTab === 'market-analysis' && renderMarketAnalysis()}
      </div>
    </div>
  );
};

export default CorporateResearchScreen;
