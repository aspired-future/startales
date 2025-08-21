import React, { useState, useEffect, useCallback } from 'react';
import './ScienceTechnologyScreen.css';

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
}

interface ResearchData {
  totalPoints: number;
  pointsPerTurn: number;
  activeProjects: number;
  completedTechs: number;
  technologies: Technology[];
  researchEfficiency: number;
}

const ScienceTechnologyScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'research' | 'projects' | 'innovations' | 'collaboration' | 'analysis' | 'breakthroughs' | 'ethics' | 'applications'>('overview');
  const [researchData, setResearchData] = useState<ResearchData>({
    totalPoints: 1250,
    pointsPerTurn: 85,
    activeProjects: 3,
    completedTechs: 12,
    researchEfficiency: 94,
    technologies: [
      { 
        id: 'quantum_computing', 
        name: 'Quantum Computing', 
        category: 'Computing', 
        progress: 100, 
        maxProgress: 100, 
        cost: 200, 
        status: 'researched',
        description: 'Revolutionary computing technology using quantum mechanics principles',
        unlocks: ['ai_consciousness']
      },
      { 
        id: 'fusion_power', 
        name: 'Fusion Power', 
        category: 'Energy', 
        progress: 75, 
        maxProgress: 150, 
        cost: 150, 
        status: 'researching',
        description: 'Clean, unlimited energy from nuclear fusion reactions',
        unlocks: ['terraforming']
      },
      { 
        id: 'neural_interfaces', 
        name: 'Neural Interfaces', 
        category: 'Biotech', 
        progress: 45, 
        maxProgress: 120, 
        cost: 120, 
        status: 'researching',
        description: 'Direct brain-computer interface technology'
      },
      { 
        id: 'antimatter_engines', 
        name: 'Antimatter Engines', 
        category: 'Propulsion', 
        progress: 0, 
        maxProgress: 300, 
        cost: 300, 
        status: 'available',
        description: 'Ultra-efficient propulsion using antimatter reactions',
        unlocks: ['wormhole_travel']
      },
      { 
        id: 'terraforming', 
        name: 'Terraforming Technology', 
        category: 'Planetary', 
        progress: 0, 
        maxProgress: 250, 
        cost: 250, 
        status: 'available',
        description: 'Transform planetary environments to support life',
        prerequisites: ['fusion_power']
      },
      { 
        id: 'ai_consciousness', 
        name: 'AI Consciousness', 
        category: 'Computing', 
        progress: 0, 
        maxProgress: 400, 
        cost: 400, 
        status: 'locked',
        description: 'Development of truly conscious artificial intelligence',
        prerequisites: ['quantum_computing']
      },
      { 
        id: 'wormhole_travel', 
        name: 'Wormhole Travel', 
        category: 'Propulsion', 
        progress: 0, 
        maxProgress: 500, 
        cost: 500, 
        status: 'locked',
        description: 'Instantaneous travel through space-time wormholes',
        prerequisites: ['antimatter_engines']
      },
      { 
        id: 'matter_replication', 
        name: 'Matter Replication', 
        category: 'Manufacturing', 
        progress: 30, 
        maxProgress: 180, 
        cost: 180, 
        status: 'researching',
        description: 'Create any material from base atomic components'
      },
      { 
        id: 'genetic_engineering', 
        name: 'Advanced Genetic Engineering', 
        category: 'Biotech', 
        progress: 0, 
        maxProgress: 220, 
        cost: 220, 
        status: 'available',
        description: 'Precise manipulation of genetic code for enhancement'
      },
      { 
        id: 'nano_technology', 
        name: 'Nanotechnology', 
        category: 'Manufacturing', 
        progress: 0, 
        maxProgress: 280, 
        cost: 280, 
        status: 'available',
        description: 'Molecular-scale manufacturing and medical applications'
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch research data
  const fetchResearchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4010/api/technology/research');
      if (response.ok) {
        const data = await response.json();
        setResearchData(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch research data:', err);
      setError('Using offline data - API unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchData();
  }, [fetchResearchData]);

  // Auto-progress research simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setResearchData(prev => {
        const newData = { ...prev };
        let hasChanges = false;

        newData.technologies = newData.technologies.map(tech => {
          if (tech.status === 'researching') {
            const newProgress = Math.min(tech.maxProgress, tech.progress + 2);
            if (newProgress !== tech.progress) {
              hasChanges = true;
              if (newProgress >= tech.maxProgress) {
                return { ...tech, progress: newProgress, status: 'researched' as const };
              }
              return { ...tech, progress: newProgress };
            }
          }
          return tech;
        });

        if (hasChanges) {
          newData.totalPoints += Math.floor(newData.pointsPerTurn * 0.1);
          newData.completedTechs = newData.technologies.filter(t => t.status === 'researched').length;
        }

        return hasChanges ? newData : prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Technology['status']) => {
    switch(status) {
      case 'researched': return '#4ecdc4';
      case 'researching': return '#fbbf24';
      case 'available': return '#ccc';
      case 'locked': return '#666';
      default: return '#ccc';
    }
  };

  const getStatusText = (status: Technology['status']) => {
    switch(status) {
      case 'researched': return '✅ Completed';
      case 'researching': return '🔬 Researching';
      case 'available': return '📋 Available';
      case 'locked': return '🔒 Locked';
      default: return 'Unknown';
    }
  };

  const selectTech = (techId: string) => {
    setResearchData(prev => {
      const newData = { ...prev };
      const techIndex = newData.technologies.findIndex(t => t.id === techId);
      
      if (techIndex !== -1) {
        const tech = { ...newData.technologies[techIndex] };
        
        if (tech.status === 'available') {
          tech.status = 'researching';
          tech.progress = 10;
        } else if (tech.status === 'researching') {
          tech.progress = Math.min(tech.maxProgress, tech.progress + 25);
          if (tech.progress >= tech.maxProgress) {
            tech.status = 'researched';
            newData.completedTechs++;
            // Unlock dependent technologies
            unlockDependentTechs(newData, techId);
          }
        }
        
        newData.technologies[techIndex] = tech;
      }
      
      return newData;
    });
  };

  const unlockDependentTechs = (data: ResearchData, completedTechId: string) => {
    const completedTech = data.technologies.find(t => t.id === completedTechId);
    if (completedTech?.unlocks) {
      completedTech.unlocks.forEach(unlockId => {
        const techToUnlock = data.technologies.find(t => t.id === unlockId);
        if (techToUnlock && techToUnlock.status === 'locked') {
          techToUnlock.status = 'available';
        }
      });
    }
  };

  const allocateResearch = () => {
    setResearchData(prev => {
      const researchingTechs = prev.technologies.filter(tech => tech.status === 'researching');
      if (researchingTechs.length > 0 && prev.totalPoints >= prev.pointsPerTurn) {
        const newData = { ...prev };
        newData.totalPoints -= newData.pointsPerTurn;
        
        const pointsPerTech = Math.floor(newData.pointsPerTurn / researchingTechs.length);
        newData.technologies = newData.technologies.map(tech => {
          if (tech.status === 'researching') {
            const newProgress = Math.min(tech.maxProgress, tech.progress + pointsPerTech);
            if (newProgress >= tech.maxProgress) {
              newData.completedTechs++;
              unlockDependentTechs(newData, tech.id);
              return { ...tech, progress: newProgress, status: 'researched' as const };
            }
            return { ...tech, progress: newProgress };
          }
          return tech;
        });
        
        return newData;
      }
      return prev;
    });
  };

  const rushResearch = () => {
    setResearchData(prev => {
      const researchingTechs = prev.technologies.filter(tech => tech.status === 'researching');
      if (researchingTechs.length > 0) {
        const tech = researchingTechs[0];
        const remainingCost = tech.maxProgress - tech.progress;
        if (prev.totalPoints >= remainingCost * 2) {
          const newData = { ...prev };
          newData.totalPoints -= remainingCost * 2;
          newData.completedTechs++;
          
          newData.technologies = newData.technologies.map(t => {
            if (t.id === tech.id) {
              unlockDependentTechs(newData, t.id);
              return { ...t, progress: t.maxProgress, status: 'researched' as const };
            }
            return t;
          });
          
          return newData;
        }
      }
      return prev;
    });
  };

  const activeResearch = researchData.technologies.filter(tech => tech.status === 'researching');
  const totalCostRemaining = activeResearch.reduce((sum, tech) => sum + (tech.cost - (tech.progress / tech.maxProgress * tech.cost)), 0);
  const estimatedCompletion = totalCostRemaining > 0 ? Math.ceil(totalCostRemaining / researchData.pointsPerTurn) : 0;

  const renderOverview = () => (
    <div className="overview-content">
      <div className="research-stats">
        <div className="stat-card">
          <div className="stat-value">{researchData.totalPoints.toLocaleString()}</div>
          <div className="stat-label">Research Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{researchData.pointsPerTurn}</div>
          <div className="stat-label">Points Per Turn</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeResearch.length}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{researchData.completedTechs}</div>
          <div className="stat-label">Completed Technologies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{researchData.researchEfficiency}%</div>
          <div className="stat-label">Research Efficiency</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{estimatedCompletion} turns</div>
          <div className="stat-label">Estimated Completion</div>
        </div>
      </div>

      <div className="research-actions">
        <button className="action-btn primary" onClick={allocateResearch}>
          🧪 Allocate Research Points
        </button>
        <button className="action-btn secondary" onClick={rushResearch}>
          ⚡ Rush Current Research
        </button>
        <button className="action-btn" onClick={fetchResearchData}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="research-content">
      <div className="tech-tree">
        {researchData.technologies.map(tech => {
          const progressPercent = (tech.progress / tech.maxProgress) * 100;
          const statusClass = tech.status === 'researched' ? 'researched' : tech.status === 'researching' ? 'researching' : '';
          
          return (
            <div key={tech.id} className={`tech-card ${statusClass}`} onClick={() => selectTech(tech.id)}>
              <div className="tech-name">{tech.name}</div>
              <div className="tech-category">{tech.category}</div>
              <div className="tech-cost">Cost: {tech.cost} RP</div>
              <div className="tech-progress">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="tech-progress-text">
                {tech.progress}/{tech.maxProgress} ({progressPercent.toFixed(0)}%)
              </div>
              <div className="tech-status" style={{ color: getStatusColor(tech.status) }}>
                {getStatusText(tech.status)}
              </div>
              {tech.description && (
                <div className="tech-description">{tech.description}</div>
              )}
              {tech.prerequisites && tech.prerequisites.length > 0 && (
                <div className="tech-prerequisites">
                  Requires: {tech.prerequisites.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="projects-content">
      <h3>Active Research Projects</h3>
      <div className="active-projects">
        {activeResearch.map(tech => (
          <div key={tech.id} className="project-card">
            <div className="project-header">
              <h4>{tech.name}</h4>
              <span className="project-category">{tech.category}</span>
            </div>
            <div className="project-progress">
              <div className="progress-bar" style={{ width: `${(tech.progress / tech.maxProgress) * 100}%` }}></div>
            </div>
            <div className="project-details">
              <span>Progress: {tech.progress}/{tech.maxProgress}</span>
              <span>Remaining: {tech.maxProgress - tech.progress} RP</span>
            </div>
            {tech.description && <p className="project-description">{tech.description}</p>}
          </div>
        ))}
      </div>
      
      {activeResearch.length === 0 && (
        <div className="no-projects">
          <p>No active research projects. Select available technologies to begin research.</p>
        </div>
      )}
    </div>
  );

  const renderInnovations = () => (
    <div className="innovations-content">
      <h3>Innovation Pipeline</h3>
      <div className="innovation-categories">
        <div className="category-card">
          <h4>🖥️ Computing</h4>
          <p>Quantum computing, AI consciousness, neural networks</p>
          <div className="category-progress">Progress: 65%</div>
        </div>
        <div className="category-card">
          <h4>⚡ Energy</h4>
          <p>Fusion power, antimatter, renewable systems</p>
          <div className="category-progress">Progress: 45%</div>
        </div>
        <div className="category-card">
          <h4>🚀 Propulsion</h4>
          <p>Antimatter engines, wormhole travel, FTL drives</p>
          <div className="category-progress">Progress: 20%</div>
        </div>
        <div className="category-card">
          <h4>🧬 Biotech</h4>
          <p>Genetic engineering, neural interfaces, life extension</p>
          <div className="category-progress">Progress: 55%</div>
        </div>
      </div>
    </div>
  );

  const renderCollaboration = () => (
    <div className="collaboration-content">
      <h3>Research Collaboration</h3>
      <div className="collaboration-partners">
        <div className="partner-card">
          <h4>🏛️ Galactic Research Consortium</h4>
          <p>Joint research on quantum technologies and AI consciousness</p>
          <div className="partner-status">Status: Active</div>
          <div className="partner-contribution">Contribution: +15% Computing research speed</div>
        </div>
        <div className="partner-card">
          <h4>🌌 Centauri Science Alliance</h4>
          <p>Energy research collaboration and fusion technology sharing</p>
          <div className="partner-status">Status: Active</div>
          <div className="partner-contribution">Contribution: +20% Energy research speed</div>
        </div>
        <div className="partner-card">
          <h4>🔬 Independent Research Labs</h4>
          <p>Biotech and medical research partnerships</p>
          <div className="partner-status">Status: Negotiating</div>
          <div className="partner-contribution">Potential: +10% Biotech research speed</div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="analysis-content">
      <h3>Research Analytics</h3>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Research Efficiency Trends</h4>
          <div className="trend-indicator positive">↗ +5% this quarter</div>
          <p>Efficiency improvements from new lab facilities and equipment upgrades</p>
        </div>
        <div className="analytics-card">
          <h4>Technology Impact Assessment</h4>
          <div className="impact-list">
            <div className="impact-item">Quantum Computing: +25% AI research speed</div>
            <div className="impact-item">Fusion Power: +30% energy production</div>
            <div className="impact-item">Neural Interfaces: +15% population happiness</div>
          </div>
        </div>
        <div className="analytics-card">
          <h4>Resource Allocation</h4>
          <div className="allocation-chart">
            <div className="allocation-item">Computing: 35%</div>
            <div className="allocation-item">Energy: 25%</div>
            <div className="allocation-item">Biotech: 20%</div>
            <div className="allocation-item">Propulsion: 15%</div>
            <div className="allocation-item">Other: 5%</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBreakthroughs = () => (
    <div className="breakthroughs-content">
      <h3>Recent Breakthroughs</h3>
      <div className="breakthroughs-timeline">
        <div className="breakthrough-item">
          <div className="breakthrough-date">Turn 147</div>
          <div className="breakthrough-content">
            <h4>🖥️ Quantum Computing Mastery</h4>
            <p>Successfully developed stable quantum processors with 1000+ qubit capacity</p>
            <div className="breakthrough-impact">Impact: Unlocked AI Consciousness research</div>
          </div>
        </div>
        <div className="breakthrough-item">
          <div className="breakthrough-date">Turn 142</div>
          <div className="breakthrough-content">
            <h4>🧬 Genetic Code Mapping</h4>
            <p>Complete genetic mapping of 15 sentient species across the galaxy</p>
            <div className="breakthrough-impact">Impact: +50% biotech research efficiency</div>
          </div>
        </div>
        <div className="breakthrough-item">
          <div className="breakthrough-date">Turn 138</div>
          <div className="breakthrough-content">
            <h4>⚡ Fusion Reactor Optimization</h4>
            <p>Achieved 99.7% energy conversion efficiency in fusion reactors</p>
            <div className="breakthrough-impact">Impact: Unlimited clean energy production</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEthics = () => (
    <div className="ethics-content">
      <h3>Research Ethics & Oversight</h3>
      <div className="ethics-panels">
        <div className="ethics-card">
          <h4>🤖 AI Ethics Committee</h4>
          <p>Oversight of AI consciousness research and neural interface development</p>
          <div className="ethics-status">Status: Active monitoring</div>
          <div className="ethics-recommendations">
            <h5>Current Recommendations:</h5>
            <ul>
              <li>Implement AI rights framework before consciousness breakthrough</li>
              <li>Establish neural interface consent protocols</li>
              <li>Create AI-human interaction guidelines</li>
            </ul>
          </div>
        </div>
        <div className="ethics-card">
          <h4>🧬 Bioethics Review Board</h4>
          <p>Genetic engineering and biotech research ethical oversight</p>
          <div className="ethics-status">Status: Under review</div>
          <div className="ethics-recommendations">
            <h5>Current Recommendations:</h5>
            <ul>
              <li>Limit genetic modifications to medical applications</li>
              <li>Establish species-wide genetic diversity preservation</li>
              <li>Create biotech safety protocols</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="applications-content">
      <h3>Technology Applications</h3>
      <div className="applications-grid">
        <div className="application-card">
          <h4>🏭 Industrial Applications</h4>
          <div className="application-list">
            <div className="application-item">
              <strong>Matter Replication:</strong> Automated manufacturing, resource abundance
            </div>
            <div className="application-item">
              <strong>Nanotechnology:</strong> Precision manufacturing, material enhancement
            </div>
            <div className="application-item">
              <strong>Fusion Power:</strong> Industrial energy independence
            </div>
          </div>
        </div>
        <div className="application-card">
          <h4>🏥 Medical Applications</h4>
          <div className="application-list">
            <div className="application-item">
              <strong>Genetic Engineering:</strong> Disease elimination, life extension
            </div>
            <div className="application-item">
              <strong>Neural Interfaces:</strong> Paralysis treatment, cognitive enhancement
            </div>
            <div className="application-item">
              <strong>Nanotechnology:</strong> Targeted drug delivery, cellular repair
            </div>
          </div>
        </div>
        <div className="application-card">
          <h4>🚀 Space Applications</h4>
          <div className="application-list">
            <div className="application-item">
              <strong>Antimatter Engines:</strong> Interstellar travel, cargo transport
            </div>
            <div className="application-item">
              <strong>Terraforming:</strong> Planetary colonization, habitat creation
            </div>
            <div className="application-item">
              <strong>Wormhole Travel:</strong> Instantaneous galactic transport
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="science-technology-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="science-technology-screen">
      <div className="screen-header">
        <h1>🔬 Science & Technology Research</h1>
        <p>Advanced research and development with technology trees and innovation systems</p>
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
          className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          🔬 Research Tree
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📋 Active Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'innovations' ? 'active' : ''}`}
          onClick={() => setActiveTab('innovations')}
        >
          💡 Innovations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'collaboration' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaboration')}
        >
          🤝 Collaboration
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          📈 Analysis
        </button>
        <button 
          className={`tab-btn ${activeTab === 'breakthroughs' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakthroughs')}
        >
          🏆 Breakthroughs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ethics' ? 'active' : ''}`}
          onClick={() => setActiveTab('ethics')}
        >
          ⚖️ Ethics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          🔧 Applications
        </button>
      </div>

      <div className="screen-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'research' && renderResearch()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'innovations' && renderInnovations()}
        {activeTab === 'collaboration' && renderCollaboration()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'breakthroughs' && renderBreakthroughs()}
        {activeTab === 'ethics' && renderEthics()}
        {activeTab === 'applications' && renderApplications()}
      </div>
    </div>
  );
};

export default ScienceTechnologyScreen;
