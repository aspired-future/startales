import React, { useState, useEffect, useCallback } from 'react';
import './ClassifiedResearchScreen.css';

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
}

const ClassifiedResearchScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'restricted' | 'classified' | 'secret' | 'top-secret' | 'personnel' | 'security'>('overview');
  const [userClearance] = useState<'RESTRICTED' | 'CLASSIFIED' | 'SECRET' | 'TOP SECRET'>('SECRET'); // Simulated user clearance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [classifiedProjects, setClassifiedProjects] = useState<ClassifiedProject[]>([
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
      budget: 2500000
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
      budget: 8500000
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
      budget: 12000000
    },
    {
      id: 'proj_ts001',
      codename: 'Project OMEGA',
      classification: 'TOP SECRET',
      department: 'Special Projects',
      progress: 30,
      maxProgress: 100,
      clearanceRequired: 'TOP SECRET',
      status: 'active',
      lastUpdate: '2024-01-12',
      description: '[REDACTED]',
      personnel: 8,
      budget: 25000000
    },
    {
      id: 'proj_ts002',
      codename: 'Project SINGULARITY',
      classification: 'TOP SECRET',
      department: 'Theoretical Physics',
      progress: 15,
      maxProgress: 200,
      clearanceRequired: 'TOP SECRET',
      status: 'active',
      lastUpdate: '2024-01-10',
      description: '[REDACTED]',
      personnel: 5,
      budget: 50000000
    }
  ]);

  const fetchClassifiedData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4010/api/classified-research/projects', {
        headers: {
          'Authorization': `Bearer ${userClearance}`,
          'Security-Clearance': userClearance
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.projects) {
          setClassifiedProjects(data.projects);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch classified data:', err);
      setError('Using offline data - Classified network unavailable');
    } finally {
      setLoading(false);
    }
  }, [userClearance]);

  useEffect(() => {
    fetchClassifiedData();
  }, [fetchClassifiedData]);

  const getClassificationColor = (classification: string) => {
    switch(classification) {
      case 'RESTRICTED': return '#4ecdc4';
      case 'CLASSIFIED': return '#fbbf24';
      case 'SECRET': return '#f97316';
      case 'TOP SECRET': return '#ef4444';
      default: return '#666';
    }
  };

  const getClassificationBadge = (classification: string) => {
    const color = getClassificationColor(classification);
    return (
      <span 
        className="classification-badge"
        style={{ 
          backgroundColor: color,
          color: classification === 'RESTRICTED' ? '#000' : '#fff'
        }}
      >
        {classification}
      </span>
    );
  };

  const canViewProject = (project: ClassifiedProject) => {
    const clearanceLevels = ['RESTRICTED', 'CLASSIFIED', 'SECRET', 'TOP SECRET'];
    const userLevel = clearanceLevels.indexOf(userClearance);
    const projectLevel = clearanceLevels.indexOf(project.classification);
    return userLevel >= projectLevel;
  };

  const getVisibleProjects = (classification?: string) => {
    return classifiedProjects.filter(project => {
      if (classification && project.classification !== classification) return false;
      return canViewProject(project);
    });
  };

  const renderSecurityWarning = () => (
    <div className="security-warning">
      <div className="warning-header">
        <span className="warning-icon">⚠️</span>
        <span className="warning-title">SECURITY NOTICE</span>
      </div>
      <div className="warning-content">
        <p>This system contains classified information. Unauthorized access is prohibited.</p>
        <p>Current User Clearance: <strong>{getClassificationBadge(userClearance)}</strong></p>
        <p>All activities are logged and monitored.</p>
      </div>
    </div>
  );

  const renderOverview = () => {
    const visibleProjects = getVisibleProjects();
    const activeProjects = visibleProjects.filter(p => p.status === 'active');
    const totalBudget = visibleProjects.reduce((sum, p) => sum + p.budget, 0);
    const totalPersonnel = visibleProjects.reduce((sum, p) => sum + p.personnel, 0);

    return (
      <div className="overview-content">
        {renderSecurityWarning()}
        
        <div className="classified-stats">
          <div className="stat-card">
            <div className="stat-value">{visibleProjects.length}</div>
            <div className="stat-label">Accessible Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeProjects.length}</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{(totalBudget / 1000000).toFixed(0)}M</div>
            <div className="stat-label">Total Budget</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalPersonnel}</div>
            <div className="stat-label">Personnel</div>
          </div>
        </div>

        <div className="clearance-breakdown">
          <h3>🔐 Projects by Classification Level</h3>
          <div className="clearance-grid">
            {['RESTRICTED', 'CLASSIFIED', 'SECRET', 'TOP SECRET'].map(level => {
              const levelProjects = getVisibleProjects(level);
              const canView = canViewProject({ classification: level } as ClassifiedProject);
              
              return (
                <div key={level} className={`clearance-card ${!canView ? 'restricted' : ''}`}>
                  <div className="clearance-header">
                    {getClassificationBadge(level)}
                    <span className="project-count">
                      {canView ? levelProjects.length : '●●●'} projects
                    </span>
                  </div>
                  {canView ? (
                    <div className="clearance-details">
                      <div>Active: {levelProjects.filter(p => p.status === 'active').length}</div>
                      <div>Budget: ₹{(levelProjects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(0)}M</div>
                    </div>
                  ) : (
                    <div className="access-denied">
                      <span>🚫 INSUFFICIENT CLEARANCE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderProjectsList = (classification?: string) => {
    const projects = getVisibleProjects(classification);
    
    if (projects.length === 0) {
      return (
        <div className="no-projects">
          <p>No {classification ? classification.toLowerCase() : ''} projects accessible with your current clearance level.</p>
          <p>Current Clearance: {getClassificationBadge(userClearance)}</p>
        </div>
      );
    }

    return (
      <div className="projects-content">
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="classified-project-card">
              <div className="project-header">
                <div className="project-codename">{project.codename}</div>
                {getClassificationBadge(project.classification)}
              </div>
              
              <div className="project-department">{project.department}</div>
              
              <div className="project-progress">
                <div className="progress-bar" style={{ width: `${(project.progress / project.maxProgress) * 100}%` }}></div>
              </div>
              <div className="progress-text">
                Progress: {project.progress}/{project.maxProgress} ({((project.progress / project.maxProgress) * 100).toFixed(0)}%)
              </div>
              
              <div className="project-details">
                <div className="detail-row">
                  <span>Status:</span>
                  <span className={`status-${project.status}`}>{project.status.toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span>Personnel:</span>
                  <span>{project.personnel} cleared</span>
                </div>
                <div className="detail-row">
                  <span>Budget:</span>
                  <span>₹{(project.budget / 1000000).toFixed(1)}M</span>
                </div>
                <div className="detail-row">
                  <span>Last Update:</span>
                  <span>{project.lastUpdate}</span>
                </div>
              </div>
              
              {project.description && (
                <div className="project-description">
                  {project.description}
                </div>
              )}
              
              <div className="project-actions">
                <button className="action-btn">📊 View Details</button>
                <button className="action-btn">📋 Reports</button>
                {userClearance === 'TOP SECRET' && (
                  <button className="action-btn danger">🗑️ Terminate</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonnel = () => (
    <div className="personnel-content">
      <h3>🔐 Cleared Personnel</h3>
      <div className="personnel-stats">
        <div className="clearance-breakdown">
          <div className="personnel-level">
            <span>TOP SECRET:</span>
            <span>8 personnel</span>
          </div>
          <div className="personnel-level">
            <span>SECRET:</span>
            <span>23 personnel</span>
          </div>
          <div className="personnel-level">
            <span>CLASSIFIED:</span>
            <span>45 personnel</span>
          </div>
          <div className="personnel-level">
            <span>RESTRICTED:</span>
            <span>78 personnel</span>
          </div>
        </div>
      </div>
      
      <div className="security-protocols">
        <h4>🛡️ Security Protocols</h4>
        <ul>
          <li>All personnel undergo quarterly security reviews</li>
          <li>Biometric access controls for all classified areas</li>
          <li>Compartmentalized information on need-to-know basis</li>
          <li>Regular polygraph examinations for TOP SECRET clearance</li>
          <li>Continuous monitoring of digital communications</li>
        </ul>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="security-content">
      <h3>🔒 Security Measures</h3>
      <div className="security-grid">
        <div className="security-card">
          <h4>🏢 Physical Security</h4>
          <ul>
            <li>Multi-factor authentication required</li>
            <li>Biometric scanners at all entry points</li>
            <li>24/7 armed security presence</li>
            <li>Faraday cage construction for TEMPEST protection</li>
            <li>Regular security sweeps for surveillance devices</li>
          </ul>
        </div>
        
        <div className="security-card">
          <h4>💻 Information Security</h4>
          <ul>
            <li>Air-gapped networks for TOP SECRET systems</li>
            <li>Quantum encryption for data transmission</li>
            <li>Automated data classification systems</li>
            <li>Secure deletion protocols for sensitive data</li>
            <li>Regular penetration testing</li>
          </ul>
        </div>
        
        <div className="security-card">
          <h4>👥 Personnel Security</h4>
          <ul>
            <li>Extensive background investigations</li>
            <li>Psychological evaluations</li>
            <li>Financial monitoring</li>
            <li>Travel restrictions for cleared personnel</li>
            <li>Mandatory security awareness training</li>
          </ul>
        </div>
      </div>
      
      <div className="threat-assessment">
        <h4>⚠️ Current Threat Level: ELEVATED</h4>
        <p>Recent intelligence indicates increased foreign interest in our classified research programs. All personnel are advised to maintain heightened security awareness.</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="classified-research-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Accessing classified systems...</p>
          <p className="security-notice">Verifying clearance level...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classified-research-screen">
      <div className="screen-header">
        <h1>🔒 Classified Research Projects</h1>
        <p>Restricted access research programs - {userClearance} clearance level</p>
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
          className={`tab-btn ${activeTab === 'restricted' ? 'active' : ''}`}
          onClick={() => setActiveTab('restricted')}
        >
          🟢 Restricted
        </button>
        <button 
          className={`tab-btn ${activeTab === 'classified' ? 'active' : ''}`}
          onClick={() => setActiveTab('classified')}
        >
          🟡 Classified
        </button>
        <button 
          className={`tab-btn ${activeTab === 'secret' ? 'active' : ''}`}
          onClick={() => setActiveTab('secret')}
        >
          🟠 Secret
        </button>
        <button 
          className={`tab-btn ${activeTab === 'top-secret' ? 'active' : ''} ${userClearance !== 'TOP SECRET' ? 'restricted-tab' : ''}`}
          onClick={() => userClearance === 'TOP SECRET' && setActiveTab('top-secret')}
        >
          🔴 Top Secret
        </button>
        <button 
          className={`tab-btn ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          👥 Personnel
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🛡️ Security
        </button>
      </div>

      <div className="screen-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'restricted' && renderProjectsList('RESTRICTED')}
        {activeTab === 'classified' && renderProjectsList('CLASSIFIED')}
        {activeTab === 'secret' && renderProjectsList('SECRET')}
        {activeTab === 'top-secret' && (userClearance === 'TOP SECRET' ? renderProjectsList('TOP SECRET') : 
          <div className="access-denied-screen">
            <h2>🚫 ACCESS DENIED</h2>
            <p>TOP SECRET clearance required</p>
            <p>Your clearance level: {getClassificationBadge(userClearance)}</p>
          </div>
        )}
        {activeTab === 'personnel' && renderPersonnel()}
        {activeTab === 'security' && renderSecurity()}
      </div>
    </div>
  );
};

export default ClassifiedResearchScreen;
