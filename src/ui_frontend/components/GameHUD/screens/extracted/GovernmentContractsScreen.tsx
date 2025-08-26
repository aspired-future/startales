import React, { useState, useEffect } from 'react';
import './GovernmentContractsScreen.css';

interface GovernmentContractsScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface GovernmentContract {
  id: string;
  title: string;
  description: string;
  category: 'defense' | 'infrastructure' | 'research' | 'social' | 'custom';
  totalValue: number;
  budgetAllocated: number;
  fundingSource: string;
  paymentSchedule: 'milestone' | 'monthly' | 'completion' | 'custom';
  startDate: string;
  endDate: string;
  duration: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'planning' | 'bidding' | 'awarded' | 'active' | 'completed' | 'cancelled' | 'disputed';
  requirements: any;
  biddingProcess: any;
  awardedTo?: any;
  performance?: any;
  createdBy: string;
  approvedBy?: string;
}

interface ContractType {
  id: string;
  name: string;
  description: string;
  category: string;
  typicalDuration: number;
  complexityLevel: number;
  riskLevel: number;
  requiredCapabilities: string[];
  evaluationCriteria: any;
}

const GovernmentContractsScreen: React.FC<GovernmentContractsScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'create' | 'bidding' | 'performance' | 'analytics'>('contracts');
  const [contracts, setContracts] = useState<GovernmentContract[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<GovernmentContract | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchContractsData();
  }, []);

  const fetchContractsData = async () => {
    try {
      setLoading(true);
      
      // Fetch contracts
      const contractsResponse = await fetch('http://localhost:4000/api/government-contracts/civilization/campaign_1/player_civ');
      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json();
        if (contractsData.success) {
          setContracts(contractsData.data.contracts);
        }
      }

      // Fetch contract types
      const typesResponse = await fetch('http://localhost:4000/api/government-contracts/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        if (typesData.success) {
          setContractTypes(typesData.data);
        }
      }

    } catch (err) {
      console.warn('Government Contracts API not available, using mock data');
      setContracts(createMockContracts());
      setContractTypes(createMockContractTypes());
    } finally {
      setLoading(false);
    }
  };

  const createMockContracts = (): GovernmentContract[] => [
    {
      id: 'contract_1',
      title: 'Advanced Defense Shield System',
      description: 'Development and deployment of next-generation planetary defense shields',
      category: 'defense',
      totalValue: 2400000000,
      budgetAllocated: 2400000000,
      fundingSource: 'Defense Budget',
      paymentSchedule: 'milestone',
      startDate: '2024-01-15',
      endDate: '2026-01-15',
      duration: 24,
      priority: 'critical',
      status: 'active',
      requirements: {
        securityClearance: 'top_secret',
        minCompanySize: 'large',
        technicalCapabilities: ['quantum_shielding', 'energy_management', 'ai_systems']
      },
      biddingProcess: {
        biddingDeadline: '2023-12-01',
        evaluationCriteria: ['technical_merit', 'cost_effectiveness', 'timeline', 'experience']
      },
      awardedTo: {
        company: 'Stellar Defense Industries',
        contractValue: 2400000000,
        awardDate: '2023-12-15'
      },
      performance: {
        overallScore: 85,
        milestones: {
          completed: 3,
          total: 8,
          nextDeadline: '2024-06-30'
        }
      },
      createdBy: 'Defense Procurement Office',
      approvedBy: 'Secretary of Defense'
    },
    {
      id: 'contract_2',
      title: 'Galactic Transportation Infrastructure',
      description: 'Construction of high-speed transportation networks between major star systems',
      category: 'infrastructure',
      totalValue: 1800000000,
      budgetAllocated: 1800000000,
      fundingSource: 'Infrastructure Fund',
      paymentSchedule: 'monthly',
      startDate: '2024-03-01',
      endDate: '2027-03-01',
      duration: 36,
      priority: 'high',
      status: 'bidding',
      requirements: {
        securityClearance: 'confidential',
        minCompanySize: 'large',
        technicalCapabilities: ['space_construction', 'logistics', 'project_management']
      },
      biddingProcess: {
        biddingDeadline: '2024-02-15',
        evaluationCriteria: ['technical_approach', 'cost', 'schedule', 'sustainability']
      },
      createdBy: 'Infrastructure Development Agency',
      approvedBy: 'Minister of Transportation'
    },
    {
      id: 'contract_3',
      title: 'AI Research Initiative',
      description: 'Advanced artificial intelligence research for civilian applications',
      category: 'research',
      totalValue: 500000000,
      budgetAllocated: 500000000,
      fundingSource: 'Science & Technology Budget',
      paymentSchedule: 'milestone',
      startDate: '2024-02-01',
      endDate: '2025-08-01',
      duration: 18,
      priority: 'medium',
      status: 'planning',
      requirements: {
        securityClearance: 'secret',
        minCompanySize: 'medium',
        technicalCapabilities: ['ai_research', 'machine_learning', 'ethics_compliance']
      },
      biddingProcess: {
        biddingDeadline: '2024-01-30',
        evaluationCriteria: ['research_quality', 'innovation', 'ethical_framework', 'cost']
      },
      createdBy: 'National Science Foundation',
      approvedBy: 'Chief Science Officer'
    }
  ];

  const createMockContractTypes = (): ContractType[] => [
    {
      id: 'defense_systems',
      name: 'Defense Systems',
      description: 'Military and defense technology contracts',
      category: 'defense',
      typicalDuration: 24,
      complexityLevel: 9,
      riskLevel: 8,
      requiredCapabilities: ['security_clearance', 'defense_experience', 'advanced_technology'],
      evaluationCriteria: {
        technical: 40,
        cost: 25,
        schedule: 20,
        experience: 15
      }
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Development',
      description: 'Large-scale construction and infrastructure projects',
      category: 'infrastructure',
      typicalDuration: 36,
      complexityLevel: 7,
      riskLevel: 6,
      requiredCapabilities: ['construction_experience', 'project_management', 'logistics'],
      evaluationCriteria: {
        technical: 30,
        cost: 35,
        schedule: 25,
        sustainability: 10
      }
    },
    {
      id: 'research_development',
      name: 'Research & Development',
      description: 'Scientific research and technology development contracts',
      category: 'research',
      typicalDuration: 18,
      complexityLevel: 8,
      riskLevel: 7,
      requiredCapabilities: ['research_expertise', 'innovation_track_record', 'peer_review'],
      evaluationCriteria: {
        technical: 50,
        innovation: 25,
        cost: 15,
        timeline: 10
      }
    }
  ];

  const handleCreateContract = async (contractData: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/government-contracts/civilization/campaign_1/player_civ', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContracts([...contracts, data.data]);
          setShowCreateModal(false);
          alert('Government contract created successfully!');
        }
      }
    } catch (error) {
      console.error('Contract creation failed:', error);
      alert('Contract creation failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  const handleAIGenerateContract = async (requirements: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/government-contracts/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requirements,
          campaignId: 'campaign_1',
          civilizationId: 'player_civ'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setContracts([...contracts, data.data]);
          alert('AI-generated contract created successfully!');
        }
      }
    } catch (error) {
      console.error('AI contract generation failed:', error);
      alert('AI contract generation failed. This is a demo - full functionality will be available in the complete system.');
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const categoryMatch = filterCategory === 'all' || contract.category === filterCategory;
    const statusMatch = filterStatus === 'all' || contract.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="government-contracts-screen loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading government contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="government-contracts-screen error">
        <div className="error-message">
          <h3>⚠️ Contract System Unavailable</h3>
          <p>Unable to load contract data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="government-contracts-screen">
      <div className="screen-header">
        <div className="header-left">
          <span className="screen-icon">{icon}</span>
          <div className="header-text">
            <h2>{title}</h2>
            <p>Government Contract Management & Procurement System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="contract-stats">
            <div className="stat">
              <span className="stat-label">Total Contracts</span>
              <span className="stat-value">{contracts.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Active Value</span>
              <span className="stat-value">
                ${contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Pending Bids</span>
              <span className="stat-value">{contracts.filter(c => c.status === 'bidding').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {[
          { id: 'contracts', label: 'All Contracts', icon: '📋' },
          { id: 'create', label: 'Create Contract', icon: '➕' },
          { id: 'bidding', label: 'Bidding Process', icon: '🏆' },
          { id: 'performance', label: 'Performance', icon: '📊' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'contracts' && (
          <div className="contracts-tab">
            <div className="contracts-header">
              <div className="filters">
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="defense">Defense</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="research">Research</option>
                  <option value="social">Social</option>
                </select>
                
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="bidding">Bidding</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button 
                className="create-btn"
                onClick={() => setActiveTab('create')}
              >
                + Create New Contract
              </button>
            </div>

            <div className="contracts-grid">
              {filteredContracts.map(contract => (
                <div key={contract.id} className={`contract-card ${contract.status}`}>
                  <div className="contract-header">
                    <h4>{contract.title}</h4>
                    <div className="contract-badges">
                      <span className={`category-badge ${contract.category}`}>{contract.category}</span>
                      <span className={`priority-badge ${contract.priority}`}>{contract.priority}</span>
                      <span className={`status-badge ${contract.status}`}>{contract.status}</span>
                    </div>
                  </div>
                  
                  <p className="contract-description">{contract.description}</p>
                  
                  <div className="contract-details">
                    <div className="detail-row">
                      <span className="label">Total Value:</span>
                      <span className="value">${contract.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <span className="value">{contract.duration} months</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Start Date:</span>
                      <span className="value">{new Date(contract.startDate).toLocaleDateString()}</span>
                    </div>
                    {contract.awardedTo && (
                      <div className="detail-row">
                        <span className="label">Awarded To:</span>
                        <span className="value">{contract.awardedTo.company}</span>
                      </div>
                    )}
                  </div>

                  {contract.performance && (
                    <div className="performance-summary">
                      <div className="performance-score">
                        Performance: {contract.performance.overallScore}%
                      </div>
                      <div className="milestone-progress">
                        Milestones: {contract.performance.milestones.completed}/{contract.performance.milestones.total}
                      </div>
                    </div>
                  )}

                  <div className="contract-actions">
                    <button className="action-btn secondary">View Details</button>
                    <button className="action-btn secondary">Edit</button>
                    {contract.status === 'bidding' && (
                      <button className="action-btn">Manage Bids</button>
                    )}
                    {contract.status === 'active' && (
                      <button className="action-btn">Track Progress</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-tab">
            <div className="create-header">
              <h3>Create New Government Contract</h3>
              <p>Use AI assistance or manual creation to develop comprehensive contracts</p>
            </div>

            <div className="creation-options">
              <div className="creation-card">
                <h4>🤖 AI-Assisted Contract Generation</h4>
                <p>Describe your requirements and let AI generate a comprehensive contract</p>
                
                <div className="ai-input-section">
                  <textarea 
                    placeholder="Describe your contract requirements (e.g., 'Need a contract for developing quantum communication systems for military use, budget around 500M, 18-month timeline, requires top secret clearance')"
                    className="ai-requirements-input"
                    rows={4}
                  />
                  <button 
                    className="ai-generate-btn"
                    onClick={() => handleAIGenerateContract("Sample AI-generated contract requirements")}
                  >
                    Generate Contract with AI
                  </button>
                </div>
              </div>

              <div className="creation-card">
                <h4>📝 Manual Contract Creation</h4>
                <p>Create a contract manually using our guided form</p>
                
                <div className="manual-form">
                  <div className="form-row">
                    <label>Contract Title:</label>
                    <input type="text" placeholder="Enter contract title" className="form-input" />
                  </div>
                  
                  <div className="form-row">
                    <label>Category:</label>
                    <select className="form-select">
                      <option value="defense">Defense</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="research">Research</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                  
                  <div className="form-row">
                    <label>Total Value:</label>
                    <input type="number" placeholder="Contract value" className="form-input" />
                  </div>
                  
                  <div className="form-row">
                    <label>Duration (months):</label>
                    <input type="number" placeholder="Duration in months" className="form-input" />
                  </div>
                  
                  <div className="form-row">
                    <label>Description:</label>
                    <textarea placeholder="Detailed contract description" className="form-textarea" rows={3} />
                  </div>
                  
                  <button 
                    className="manual-create-btn"
                    onClick={() => handleCreateContract({
                      title: "Sample Manual Contract",
                      category: "defense",
                      totalValue: 1000000,
                      duration: 12
                    })}
                  >
                    Create Contract Manually
                  </button>
                </div>
              </div>
            </div>

            <div className="contract-templates">
              <h4>📋 Contract Templates</h4>
              <div className="templates-grid">
                {contractTypes.map(type => (
                  <div key={type.id} className="template-card">
                    <h5>{type.name}</h5>
                    <p>{type.description}</p>
                    <div className="template-stats">
                      <span>Duration: {type.typicalDuration} months</span>
                      <span>Complexity: {type.complexityLevel}/10</span>
                      <span>Risk: {type.riskLevel}/10</span>
                    </div>
                    <button className="use-template-btn">Use Template</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bidding' && (
          <div className="bidding-tab">
            <div className="tab-header">
              <h3>Bidding Process Management</h3>
              <p>Manage contract bidding, evaluation, and award processes</p>
            </div>

            <div className="bidding-contracts">
              {contracts.filter(c => c.status === 'bidding').map(contract => (
                <div key={contract.id} className="bidding-contract-card">
                  <div className="bidding-header">
                    <h4>{contract.title}</h4>
                    <span className="bidding-deadline">
                      Deadline: {contract.biddingProcess?.biddingDeadline || 'TBD'}
                    </span>
                  </div>
                  
                  <div className="bidding-details">
                    <div className="detail-section">
                      <h5>Contract Value: ${contract.totalValue.toLocaleString()}</h5>
                      <p>{contract.description}</p>
                    </div>
                    
                    <div className="evaluation-criteria">
                      <h5>Evaluation Criteria:</h5>
                      <ul>
                        {contract.biddingProcess?.evaluationCriteria?.map((criteria: string, index: number) => (
                          <li key={index}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bidding-actions">
                    <button className="action-btn">View Bids (3)</button>
                    <button className="action-btn secondary">Extend Deadline</button>
                    <button className="action-btn secondary">Modify Requirements</button>
                  </div>
                </div>
              ))}
              
              {contracts.filter(c => c.status === 'bidding').length === 0 && (
                <div className="no-bidding">
                  <p>No contracts currently in bidding phase.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-tab">
            <div className="tab-header">
              <h3>Contract Performance Monitoring</h3>
              <p>Track and analyze contract performance and deliverables</p>
            </div>

            <div className="performance-overview">
              <div className="performance-stats">
                <div className="perf-stat-card">
                  <h4>Average Performance</h4>
                  <span className="perf-score">87%</span>
                </div>
                <div className="perf-stat-card">
                  <h4>On-Time Delivery</h4>
                  <span className="perf-score">92%</span>
                </div>
                <div className="perf-stat-card">
                  <h4>Budget Compliance</h4>
                  <span className="perf-score">95%</span>
                </div>
              </div>
            </div>

            <div className="active-contracts-performance">
              {contracts.filter(c => c.status === 'active' && c.performance).map(contract => (
                <div key={contract.id} className="performance-contract-card">
                  <div className="performance-header">
                    <h4>{contract.title}</h4>
                    <span className="overall-score">
                      Score: {contract.performance?.overallScore}%
                    </span>
                  </div>
                  
                  <div className="milestone-tracking">
                    <h5>Milestone Progress:</h5>
                    <div className="milestone-bar">
                      <div 
                        className="milestone-progress" 
                        style={{ 
                          width: `${(contract.performance?.milestones.completed / contract.performance?.milestones.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="milestone-text">
                      {contract.performance?.milestones.completed} of {contract.performance?.milestones.total} completed
                    </span>
                  </div>
                  
                  <div className="next-milestone">
                    <strong>Next Deadline:</strong> {contract.performance?.milestones.nextDeadline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="tab-header">
              <h3>Contract Analytics & Insights</h3>
              <p>Strategic analysis of contract performance and procurement patterns</p>
            </div>

            <div className="analytics-dashboard">
              <div className="analytics-cards">
                <div className="analytics-card">
                  <h4>Contract Distribution by Category</h4>
                  <div className="category-breakdown">
                    <div className="category-item">
                      <span className="category-label">Defense:</span>
                      <span className="category-value">45%</span>
                    </div>
                    <div className="category-item">
                      <span className="category-label">Infrastructure:</span>
                      <span className="category-value">30%</span>
                    </div>
                    <div className="category-item">
                      <span className="category-label">Research:</span>
                      <span className="category-value">20%</span>
                    </div>
                    <div className="category-item">
                      <span className="category-label">Social:</span>
                      <span className="category-value">5%</span>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-card">
                  <h4>Procurement Efficiency</h4>
                  <div className="efficiency-metrics">
                    <div className="metric">
                      <span className="metric-label">Average Bid Time:</span>
                      <span className="metric-value">45 days</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Award Success Rate:</span>
                      <span className="metric-value">78%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Cost Savings:</span>
                      <span className="metric-value">12%</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h4>Risk Assessment</h4>
                  <div className="risk-indicators">
                    <div className="risk-item low">
                      <span className="risk-label">Schedule Risk:</span>
                      <span className="risk-level">Low</span>
                    </div>
                    <div className="risk-item medium">
                      <span className="risk-label">Budget Risk:</span>
                      <span className="risk-level">Medium</span>
                    </div>
                    <div className="risk-item low">
                      <span className="risk-label">Performance Risk:</span>
                      <span className="risk-level">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentContractsScreen;
