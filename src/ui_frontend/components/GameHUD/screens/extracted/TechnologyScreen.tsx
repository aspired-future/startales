import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './TechnologyScreen.css';

interface Technology {
  id: string;
  name: string;
  category: string;
  level: string;
  complexity: number;
  operationalStatus: 'operational' | 'research' | 'development' | 'testing' | 'obsolete';
  securityLevel: number;
  implementationProgress: number;
  researchCost: number;
  implementationCost: number;
  maintenanceCost: number;
  description: string;
}

interface ResearchProject {
  id: string;
  name: string;
  category: string;
  progress: number;
  budget: number;
  researchers: number;
  estimatedCompletion: string;
  civilizationId: string;
  targetTechnology: string;
}

interface CyberOperation {
  id: string;
  name: string;
  type: string;
  status: 'planning' | 'active' | 'completed' | 'failed' | 'compromised';
  progress: number;
  successProbability: number;
  detectionRisk: number;
  budget: number;
  operatorId: string;
  targetId: string;
}

interface TechnologyTransfer {
  id: string;
  technologyId: string;
  transferMethod: string;
  cost: number;
  implementationSuccess: boolean;
  adaptationRequired: boolean;
  performanceDegradation: number;
  sourceId: string;
  recipientId: string;
}

interface ReverseEngineeringProject {
  id: string;
  targetTechnologyId: string;
  progress: number;
  understanding: number;
  reproduction: number;
  budget: number;
  researchers: number;
  civilizationId: string;
}

interface PsychicPower {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
}

interface InnovationEvent {
  id: string;
  type: string;
  organization: string;
  team: string[];
  outcome: boolean;
  cost: number;
  timestamp: string;
}

interface Civilization {
  civilizationId: string;
  name: string;
  techLevel: string;
}

interface TechnologyData {
  technologies: Technology[];
  researchProjects: ResearchProject[];
  cyberOperations: CyberOperation[];
  transfers: TechnologyTransfer[];
  reverseEngineering: ReverseEngineeringProject[];
  psychicPowers: PsychicPower[];
  innovationEvents: InnovationEvent[];
  civilizations: Civilization[];
  analytics: {
    totalTechnologies: number;
    activeResearch: number;
    cyberOperations: number;
    technologyTransfers: number;
  };
}

const TechnologyScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [technologyData, setTechnologyData] = useState<TechnologyData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tech-tree' | 'psychic' | 'innovation' | 'technologies' | 'research' | 'cyber' | 'transfers' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/technology/technologies', description: 'Get all technologies' },
    { method: 'GET', path: '/api/technology/research', description: 'Get research projects' },
    { method: 'GET', path: '/api/technology/cyber-operations', description: 'Get cyber operations' },
    { method: 'GET', path: '/api/technology/transfers', description: 'Get technology transfers' },
    { method: 'GET', path: '/api/technology/reverse-engineering', description: 'Get reverse engineering projects' },
    { method: 'GET', path: '/api/technology/psychic-powers', description: 'Get psychic powers' },
    { method: 'GET', path: '/api/technology/innovation/events', description: 'Get innovation events' },
    { method: 'GET', path: '/api/technology/civilizations', description: 'Get civilizations' },
    { method: 'POST', path: '/api/technology/technologies', description: 'Create new technology' },
    { method: 'POST', path: '/api/technology/research', description: 'Start research project' },
    { method: 'POST', path: '/api/technology/cyber-operations', description: 'Launch cyber operation' },
    { method: 'POST', path: '/api/technology/transfers', description: 'Create technology transfer' },
    { method: 'POST', path: '/api/technology/innovation/corporate', description: 'Trigger corporate innovation' }
  ];

  const fetchTechnologyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        technologiesRes,
        researchRes,
        cyberRes,
        transfersRes,
        reverseRes,
        psychicRes,
        innovationRes,
        civilizationsRes
      ] = await Promise.all([
        fetch('/api/technology/technologies'),
        fetch('/api/technology/research'),
        fetch('/api/technology/cyber-operations'),
        fetch('/api/technology/transfers'),
        fetch('/api/technology/reverse-engineering'),
        fetch('/api/technology/psychic-powers'),
        fetch('/api/technology/innovation/events'),
        fetch('/api/technology/civilizations')
      ]);

      const [
        technologies,
        research,
        cyber,
        transfers,
        reverse,
        psychic,
        innovation,
        civilizations
      ] = await Promise.all([
        technologiesRes.json(),
        researchRes.json(),
        cyberRes.json(),
        transfersRes.json(),
        reverseRes.json(),
        psychicRes.json(),
        innovationRes.json(),
        civilizationsRes.json()
      ]);

      setTechnologyData({
        technologies: technologies.data || generateMockTechnologies(),
        researchProjects: research.data || generateMockResearchProjects(),
        cyberOperations: cyber.data || generateMockCyberOperations(),
        transfers: transfers.data || generateMockTransfers(),
        reverseEngineering: reverse.data || generateMockReverseEngineering(),
        psychicPowers: psychic.psychicPowers || generateMockPsychicPowers(),
        innovationEvents: innovation.innovationEvents || generateMockInnovationEvents(),
        civilizations: civilizations.civilizations || generateMockCivilizations(),
        analytics: {
          totalTechnologies: technologies.count || 12,
          activeResearch: research.count || 8,
          cyberOperations: cyber.count || 5,
          technologyTransfers: transfers.count || 3
        }
      });
    } catch (err) {
      console.error('Failed to fetch technology data:', err);
      // Use mock data as fallback
      setTechnologyData({
        technologies: generateMockTechnologies(),
        researchProjects: generateMockResearchProjects(),
        cyberOperations: generateMockCyberOperations(),
        transfers: generateMockTransfers(),
        reverseEngineering: generateMockReverseEngineering(),
        psychicPowers: generateMockPsychicPowers(),
        innovationEvents: generateMockInnovationEvents(),
        civilizations: generateMockCivilizations(),
        analytics: {
          totalTechnologies: 12,
          activeResearch: 8,
          cyberOperations: 5,
          technologyTransfers: 3
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologyData();
  }, [fetchTechnologyData]);

  const generateMockTechnologies = (): Technology[] => [
    {
      id: 'tech-1',
      name: 'Quantum Computing Matrix',
      category: 'Computing',
      level: 'Advanced',
      complexity: 9,
      operationalStatus: 'operational',
      securityLevel: 8,
      implementationProgress: 95,
      researchCost: 2500000,
      implementationCost: 1800000,
      maintenanceCost: 250000,
      description: 'Advanced quantum computing system for complex calculations'
    },
    {
      id: 'tech-2',
      name: 'Neural Interface Protocol',
      category: 'Biotechnology',
      level: 'Experimental',
      complexity: 10,
      operationalStatus: 'research',
      securityLevel: 9,
      implementationProgress: 45,
      researchCost: 5000000,
      implementationCost: 3500000,
      maintenanceCost: 500000,
      description: 'Direct neural interface for enhanced human-computer interaction'
    },
    {
      id: 'tech-3',
      name: 'Plasma Energy Conduits',
      category: 'Energy',
      level: 'Advanced',
      complexity: 7,
      operationalStatus: 'development',
      securityLevel: 6,
      implementationProgress: 78,
      researchCost: 1800000,
      implementationCost: 1200000,
      maintenanceCost: 180000,
      description: 'High-efficiency plasma energy transmission system'
    },
    {
      id: 'tech-4',
      name: 'Holographic Data Storage',
      category: 'Storage',
      level: 'Standard',
      complexity: 5,
      operationalStatus: 'operational',
      securityLevel: 7,
      implementationProgress: 100,
      researchCost: 800000,
      implementationCost: 600000,
      maintenanceCost: 80000,
      description: 'Three-dimensional holographic data storage technology'
    }
  ];

  const generateMockResearchProjects = (): ResearchProject[] => [
    {
      id: 'research-1',
      name: 'Advanced AI Consciousness',
      category: 'Artificial Intelligence',
      progress: 65,
      budget: 8500000,
      researchers: 45,
      estimatedCompletion: '2024-12-15',
      civilizationId: 'civ-1',
      targetTechnology: 'Sentient AI Systems'
    },
    {
      id: 'research-2',
      name: 'Faster-Than-Light Communication',
      category: 'Physics',
      progress: 23,
      budget: 12000000,
      researchers: 78,
      estimatedCompletion: '2025-08-30',
      civilizationId: 'civ-1',
      targetTechnology: 'Quantum Entanglement Comm'
    },
    {
      id: 'research-3',
      name: 'Molecular Assemblers',
      category: 'Nanotechnology',
      progress: 89,
      budget: 6200000,
      researchers: 32,
      estimatedCompletion: '2024-06-20',
      civilizationId: 'civ-1',
      targetTechnology: 'Universal Constructors'
    }
  ];

  const generateMockCyberOperations = (): CyberOperation[] => [
    {
      id: 'cyber-1',
      name: 'Operation Digital Shadow',
      type: 'Technology Theft',
      status: 'active',
      progress: 78,
      successProbability: 85,
      detectionRisk: 3,
      budget: 450000,
      operatorId: 'civ-1',
      targetId: 'civ-2'
    },
    {
      id: 'cyber-2',
      name: 'Neural Network Infiltration',
      type: 'Data Extraction',
      status: 'planning',
      progress: 15,
      successProbability: 72,
      detectionRisk: 5,
      budget: 680000,
      operatorId: 'civ-1',
      targetId: 'civ-3'
    },
    {
      id: 'cyber-3',
      name: 'Quantum Decryption Protocol',
      type: 'Security Breach',
      status: 'completed',
      progress: 100,
      successProbability: 95,
      detectionRisk: 2,
      budget: 320000,
      operatorId: 'civ-1',
      targetId: 'civ-2'
    }
  ];

  const generateMockTransfers = (): TechnologyTransfer[] => [
    {
      id: 'transfer-1',
      technologyId: 'tech-1',
      transferMethod: 'Sale',
      cost: 2800000,
      implementationSuccess: true,
      adaptationRequired: false,
      performanceDegradation: 5,
      sourceId: 'civ-1',
      recipientId: 'civ-2'
    },
    {
      id: 'transfer-2',
      technologyId: 'tech-3',
      transferMethod: 'Trade Agreement',
      cost: 0,
      implementationSuccess: true,
      adaptationRequired: true,
      performanceDegradation: 15,
      sourceId: 'civ-2',
      recipientId: 'civ-1'
    }
  ];

  const generateMockReverseEngineering = (): ReverseEngineeringProject[] => [
    {
      id: 'reverse-1',
      targetTechnologyId: 'tech-2',
      progress: 67,
      understanding: 78,
      reproduction: 45,
      budget: 1800000,
      researchers: 25,
      civilizationId: 'civ-1'
    },
    {
      id: 'reverse-2',
      targetTechnologyId: 'tech-4',
      progress: 92,
      understanding: 95,
      reproduction: 88,
      budget: 950000,
      researchers: 18,
      civilizationId: 'civ-1'
    }
  ];

  const generateMockPsychicPowers = (): PsychicPower[] => [
    {
      id: 'psychic-1',
      name: 'Technological Precognition',
      category: 'Foresight',
      level: 7,
      description: 'Ability to predict technological breakthroughs and innovations'
    },
    {
      id: 'psychic-2',
      name: 'Machine Empathy',
      category: 'Communication',
      level: 5,
      description: 'Direct mental interface with artificial intelligence systems'
    },
    {
      id: 'psychic-3',
      name: 'Quantum Consciousness',
      category: 'Manipulation',
      level: 9,
      description: 'Ability to influence quantum states through mental focus'
    }
  ];

  const generateMockInnovationEvents = (): InnovationEvent[] => [
    {
      id: 'innovation-1',
      type: 'Corporate R&D Breakthrough',
      organization: 'Stellar Dynamics Corp',
      team: ['Dr. Sarah Chen', 'Prof. Marcus Webb', 'Dr. Elena Vasquez'],
      outcome: true,
      cost: 2400000,
      timestamp: '2024-02-15T10:30:00Z'
    },
    {
      id: 'innovation-2',
      type: 'Citizen Innovation',
      organization: 'Independent Researchers',
      team: ['Alex Thompson', 'Maya Patel'],
      outcome: false,
      cost: 85000,
      timestamp: '2024-02-10T14:20:00Z'
    }
  ];

  const generateMockCivilizations = (): Civilization[] => [
    { civilizationId: 'civ-1', name: 'Terran Federation', techLevel: 'Advanced' },
    { civilizationId: 'civ-2', name: 'Zephyrian Empire', techLevel: 'Superior' },
    { civilizationId: 'civ-3', name: 'Nexus Collective', techLevel: 'Experimental' }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'operational': return '#28a745';
      case 'research': return '#ffc107';
      case 'development': return '#17a2b8';
      case 'testing': return '#fd7e14';
      case 'obsolete': return '#dc3545';
      case 'active': return '#fd7e14';
      case 'planning': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'failed': return '#dc3545';
      case 'compromised': return '#e83e8c';
      default: return '#4ecdc4';
    }
  };

  const getComplexityClass = (complexity: number): string => {
    if (complexity <= 3) return 'low';
    if (complexity <= 6) return 'medium';
    if (complexity <= 8) return 'high';
    return 'extreme';
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const renderOverview = () => (
    <div className="overview-view">
      <div className="analytics-overview">
        <div className="metric-card">
          <div className="metric-value">{technologyData?.analytics.totalTechnologies || 0}</div>
          <div className="metric-label">Total Technologies</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{technologyData?.analytics.activeResearch || 0}</div>
          <div className="metric-label">Active Research Projects</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{technologyData?.analytics.cyberOperations || 0}</div>
          <div className="metric-label">Cyber Operations</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{technologyData?.analytics.technologyTransfers || 0}</div>
          <div className="metric-label">Technology Transfers</div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <h4>🏛️ Civilizations</h4>
          <div className="civilizations-list">
            {technologyData?.civilizations.map((civ) => (
              <div key={civ.civilizationId} className="civ-item">
                <span className="civ-name">{civ.name}</span>
                <span className="civ-level">{civ.techLevel} Level</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-card">
          <h4>⚡ System Status</h4>
          <div className="status-list">
            <div className="status-item">
              <span className="status-indicator operational"></span>
              <span>Technology Engine: Operational</span>
            </div>
            <div className="status-item">
              <span className="status-indicator operational"></span>
              <span>Cyber Warfare Module: Active</span>
            </div>
            <div className="status-item">
              <span className="status-indicator operational"></span>
              <span>Analytics Engine: Running</span>
            </div>
            <div className="status-item">
              <span className="status-indicator operational"></span>
              <span>Research Tracker: Monitoring</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h4>🎯 Recent Activities</h4>
          <div className="activities-list">
            <div className="activity-item">
              <span>Technologies Created: {technologyData?.technologies.length || 0}</span>
            </div>
            <div className="activity-item">
              <span>Research Projects: {technologyData?.researchProjects.length || 0}</span>
            </div>
            <div className="activity-item">
              <span>Cyber Operations: {technologyData?.cyberOperations.length || 0}</span>
            </div>
            <div className="activity-item">
              <span>Innovation Events: {technologyData?.innovationEvents.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnologies = () => (
    <div className="technologies-view">
      <div className="technologies-header">
        <h4>🔬 Technology Portfolio</h4>
        <div className="tech-actions">
          <button className="action-btn">Refresh Technologies</button>
          <button className="action-btn secondary">Create Sample Technology</button>
        </div>
      </div>

      <div className="technologies-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Level</th>
              <th>Complexity</th>
              <th>Status</th>
              <th>Security</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {technologyData?.technologies.map((tech) => (
              <tr key={tech.id}>
                <td><strong>{tech.name}</strong></td>
                <td>{tech.category}</td>
                <td>{tech.level}</td>
                <td>
                  <span className={`complexity-badge complexity-${getComplexityClass(tech.complexity)}`}>
                    {tech.complexity}/10
                  </span>
                </td>
                <td>
                  <span className="status-indicator" style={{ backgroundColor: getStatusColor(tech.operationalStatus) }}></span>
                  {tech.operationalStatus}
                </td>
                <td>
                  <div className="security-level">
                    {tech.securityLevel}/10
                    <div className="security-dots">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`security-dot ${i < tech.securityLevel ? 'active' : ''}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${tech.implementationProgress}%` }}></div>
                  </div>
                  {tech.implementationProgress}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResearch = () => (
    <div className="research-view">
      <div className="research-header">
        <h4>🧪 Research Projects</h4>
        <div className="research-actions">
          <button className="action-btn">Refresh Projects</button>
          <button className="action-btn secondary">Start Sample Project</button>
        </div>
      </div>

      <div className="research-table">
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Progress</th>
              <th>Budget</th>
              <th>Researchers</th>
              <th>Completion</th>
            </tr>
          </thead>
          <tbody>
            {technologyData?.researchProjects.map((project) => (
              <tr key={project.id}>
                <td><strong>{project.name}</strong></td>
                <td>{project.category}</td>
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  {project.progress}%
                </td>
                <td>{formatCurrency(project.budget)}</td>
                <td>{project.researchers}</td>
                <td>{new Date(project.estimatedCompletion).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCyber = () => (
    <div className="cyber-view">
      <div className="cyber-header">
        <h4>💻 Cyber Operations</h4>
        <div className="cyber-actions">
          <button className="action-btn">Refresh Operations</button>
          <button className="action-btn secondary">Launch Sample Operation</button>
          <button className="action-btn danger">Execute Pending</button>
        </div>
      </div>

      <div className="cyber-table">
        <table>
          <thead>
            <tr>
              <th>Operation Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Success Rate</th>
              <th>Detection Risk</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            {technologyData?.cyberOperations.map((op) => (
              <tr key={op.id}>
                <td><strong>{op.name}</strong></td>
                <td>{op.type}</td>
                <td>
                  <span className={`operation-status status-${op.status}`}>
                    {op.status}
                  </span>
                </td>
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${op.progress}%` }}></div>
                  </div>
                  {op.progress}%
                </td>
                <td>{op.successProbability}%</td>
                <td>{op.detectionRisk}/10</td>
                <td>{formatCurrency(op.budget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransfers = () => (
    <div className="transfers-view">
      <div className="transfers-header">
        <h4>🔄 Technology Transfers</h4>
        <div className="transfers-actions">
          <button className="action-btn">Refresh Transfers</button>
          <button className="action-btn secondary">Create Sample Transfer</button>
        </div>
      </div>

      <div className="transfers-section">
        <h5>Technology Transfers</h5>
        <div className="transfers-table">
          <table>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Method</th>
                <th>Cost</th>
                <th>Success</th>
                <th>Adaptation</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {technologyData?.transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>{transfer.technologyId}</td>
                  <td>{transfer.transferMethod}</td>
                  <td>{formatCurrency(transfer.cost)}</td>
                  <td>{transfer.implementationSuccess ? '✅ Yes' : '❌ No'}</td>
                  <td>{transfer.adaptationRequired ? 'Required' : 'Not Required'}</td>
                  <td>{100 - transfer.performanceDegradation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="reverse-engineering-section">
        <h5>🔧 Reverse Engineering</h5>
        <div className="reverse-table">
          <table>
            <thead>
              <tr>
                <th>Target Technology</th>
                <th>Progress</th>
                <th>Understanding</th>
                <th>Reproduction</th>
                <th>Budget</th>
                <th>Researchers</th>
              </tr>
            </thead>
            <tbody>
              {technologyData?.reverseEngineering.map((project) => (
                <tr key={project.id}>
                  <td>{project.targetTechnologyId}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    {project.progress}%
                  </td>
                  <td>{project.understanding}%</td>
                  <td>{project.reproduction}%</td>
                  <td>{formatCurrency(project.budget)}</td>
                  <td>{project.researchers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPsychic = () => (
    <div className="psychic-view">
      <div className="psychic-header">
        <h4>🧠 Psychic Powers</h4>
        <div className="psychic-actions">
          <button className="action-btn">Load Psychic Powers</button>
          <button className="action-btn secondary">Trigger Psychic Revelation</button>
        </div>
      </div>

      <div className="psychic-powers-grid">
        {technologyData?.psychicPowers.map((power) => (
          <div key={power.id} className="power-card">
            <h5>🧠 {power.name}</h5>
            <div className="power-details">
              <div className="power-metric">
                <span>Category:</span>
                <span>{power.category}</span>
              </div>
              <div className="power-metric">
                <span>Level:</span>
                <span>{power.level}/10</span>
              </div>
              <div className="power-description">{power.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInnovation = () => (
    <div className="innovation-view">
      <div className="innovation-grid">
        <div className="innovation-card">
          <h5>🏢 Corporate Innovation</h5>
          <button className="action-btn">Trigger Corporate R&D</button>
          <div className="innovation-content">
            <p>Trigger corporate research and development initiatives</p>
          </div>
        </div>

        <div className="innovation-card">
          <h5>👨‍🔬 Citizen Innovation</h5>
          <button className="action-btn">Trigger Citizen Innovation</button>
          <div className="innovation-content">
            <p>Encourage grassroots innovation from citizens</p>
          </div>
        </div>

        <div className="innovation-card">
          <h5>🤖 AI Innovation</h5>
          <button className="action-btn">Trigger AI Innovation</button>
          <div className="innovation-content">
            <p>Activate artificial intelligence research systems</p>
          </div>
        </div>

        <div className="innovation-card">
          <h5>📊 Innovation Events</h5>
          <div className="innovation-events">
            {technologyData?.innovationEvents.length === 0 ? (
              <p>No innovation events yet. Trigger some innovation to see events here.</p>
            ) : (
              technologyData?.innovationEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-header">
                    <span className="event-icon">{event.outcome ? '✅' : '⏳'}</span>
                    <span className="event-type">{event.type}</span>
                  </div>
                  <div className="event-details">
                    <div>Organization: {event.organization}</div>
                    <div>Team Size: {event.team.length} members</div>
                    <div>Cost: {formatCurrency(event.cost)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechTree = () => (
    <div className="tech-tree-view">
      <div className="tech-tree-header">
        <h4>🌌 Dynamic Tech Tree</h4>
        <div className="tech-tree-actions">
          <button className="action-btn">Generate New Tech Tree</button>
          <button className="action-btn secondary">View Tech Tree Status</button>
        </div>
      </div>
      <div className="tech-tree-content">
        <div className="info-message">
          <p>Click to generate or view tech tree...</p>
          <p>The dynamic tech tree system creates procedural technology paths based on your civilization's current state and research focus.</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-view">
      <div className="analytics-grid">
        <div className="analytics-card">
          <h5>📊 Portfolio Analysis</h5>
          <button className="action-btn">Generate Analysis</button>
          <div className="analytics-content">
            <p>Analyze technology portfolio diversity and maturity</p>
          </div>
        </div>

        <div className="analytics-card">
          <h5>🔬 Research Performance</h5>
          <button className="action-btn">Analyze Performance</button>
          <div className="analytics-content">
            <p>Evaluate research project efficiency and outcomes</p>
          </div>
        </div>

        <div className="analytics-card">
          <h5>💻 Cyber Warfare Analysis</h5>
          <button className="action-btn">Analyze Operations</button>
          <div className="analytics-content">
            <p>Review cyber operation success rates and effectiveness</p>
          </div>
        </div>

        <div className="analytics-card">
          <h5>🔮 Technology Forecast</h5>
          <button className="action-btn">Generate Forecast</button>
          <div className="analytics-content">
            <p>Predict emerging technologies and investment priorities</p>
          </div>
        </div>

        <div className="analytics-card">
          <h5>🛡️ Security Analysis</h5>
          <button className="action-btn">Analyze Security</button>
          <div className="analytics-content">
            <p>Assess technology security posture and vulnerabilities</p>
          </div>
        </div>

        <div className="analytics-card">
          <h5>💡 Recommendations</h5>
          <button className="action-btn">Get Recommendations</button>
          <div className="analytics-content">
            <p>Receive strategic technology recommendations</p>
          </div>
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
      onRefresh={fetchTechnologyData}
    >
      <div className="technology-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'tech-tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech-tree')}
          >
            🌌 Tech Tree
          </button>
          <button 
            className={`tab ${activeTab === 'psychic' ? 'active' : ''}`}
            onClick={() => setActiveTab('psychic')}
          >
            🧠 Psychic Powers
          </button>
          <button 
            className={`tab ${activeTab === 'innovation' ? 'active' : ''}`}
            onClick={() => setActiveTab('innovation')}
          >
            💡 Innovation
          </button>
          <button 
            className={`tab ${activeTab === 'technologies' ? 'active' : ''}`}
            onClick={() => setActiveTab('technologies')}
          >
            🔬 Technologies
          </button>
          <button 
            className={`tab ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => setActiveTab('research')}
          >
            🧪 Research
          </button>
          <button 
            className={`tab ${activeTab === 'cyber' ? 'active' : ''}`}
            onClick={() => setActiveTab('cyber')}
          >
            💻 Cyber Ops
          </button>
          <button 
            className={`tab ${activeTab === 'transfers' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfers')}
          >
            🔄 Transfers
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading technology data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'tech-tree' && renderTechTree()}
              {activeTab === 'psychic' && renderPsychic()}
              {activeTab === 'innovation' && renderInnovation()}
              {activeTab === 'technologies' && renderTechnologies()}
              {activeTab === 'research' && renderResearch()}
              {activeTab === 'cyber' && renderCyber()}
              {activeTab === 'transfers' && renderTransfers()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TechnologyScreen;
