import React, { useState, useEffect } from 'react';
import './GovernmentScreen.css';

interface GovernmentScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

interface GovernmentStats {
  approvalRating: number;
  stabilityIndex: number;
  totalBudget: string;
  activePrograms: number;
  employedOfficials: number;
  pendingLegislation: number;
}

interface GovernmentOfficial {
  id: string;
  name: string;
  position: string;
  department: string;
  yearsInOffice: number;
  approvalRating: number;
  status: 'active' | 'on-leave' | 'suspended';
}

interface GovernmentProgram {
  id: string;
  name: string;
  department: string;
  budget: string;
  status: 'active' | 'pending' | 'completed' | 'suspended';
  progress: number;
  startDate: string;
  expectedCompletion: string;
}

interface PolicyInitiative {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'review' | 'approved' | 'implemented';
  supportLevel: number;
  proposedBy: string;
}

const GovernmentScreen: React.FC<GovernmentScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'officials' | 'programs' | 'policies' | 'budget' | 'analytics'>('overview');
  const [governmentData, setGovernmentData] = useState<{
    stats: GovernmentStats;
    officials: GovernmentOfficial[];
    programs: GovernmentProgram[];
    policies: PolicyInitiative[];
  }>({
    stats: {
      approvalRating: 0,
      stabilityIndex: 0,
      totalBudget: '$0',
      activePrograms: 0,
      employedOfficials: 0,
      pendingLegislation: 0
    },
    officials: [],
    programs: [],
    policies: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGovernmentData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch('http://localhost:4000/api/government/overview');
        
        if (!response.ok) {
          throw new Error('API not available');
        }
        
        const data = await response.json();
        if (data.success) {
          setGovernmentData(data.data);
        }
      } catch (err) {
        console.warn('Government API not available, using mock data');
        // Use comprehensive mock data
        setGovernmentData({
          stats: {
            approvalRating: 73.2,
            stabilityIndex: 8.4,
            totalBudget: '$2.8T',
            activePrograms: 156,
            employedOfficials: 2847,
            pendingLegislation: 23
          },
          officials: [
            {
              id: 'official_001',
              name: 'President Sarah Chen',
              position: 'President',
              department: 'Executive Office',
              yearsInOffice: 3,
              approvalRating: 78.5,
              status: 'active'
            },
            {
              id: 'official_002',
              name: 'Vice President Marcus Rodriguez',
              position: 'Vice President',
              department: 'Executive Office',
              yearsInOffice: 3,
              approvalRating: 71.2,
              status: 'active'
            },
            {
              id: 'official_003',
              name: 'Secretary Elena Volkov',
              position: 'Secretary of State',
              department: 'State Department',
              yearsInOffice: 2,
              approvalRating: 82.1,
              status: 'active'
            },
            {
              id: 'official_004',
              name: 'Secretary James Thompson',
              position: 'Secretary of Defense',
              department: 'Defense Department',
              yearsInOffice: 1,
              approvalRating: 69.8,
              status: 'active'
            },
            {
              id: 'official_005',
              name: 'Secretary Dr. Lisa Park',
              position: 'Secretary of Health',
              department: 'Health Department',
              yearsInOffice: 4,
              approvalRating: 85.3,
              status: 'active'
            }
          ],
          programs: [
            {
              id: 'program_001',
              name: 'Universal Healthcare Initiative',
              department: 'Health Department',
              budget: '$450B',
              status: 'active',
              progress: 67,
              startDate: '2023-01-15',
              expectedCompletion: '2025-12-31'
            },
            {
              id: 'program_002',
              name: 'Space Infrastructure Development',
              department: 'Transportation',
              budget: '$280B',
              status: 'active',
              progress: 34,
              startDate: '2023-06-01',
              expectedCompletion: '2027-03-15'
            },
            {
              id: 'program_003',
              name: 'Education Modernization Program',
              department: 'Education',
              budget: '$120B',
              status: 'active',
              progress: 89,
              startDate: '2022-09-01',
              expectedCompletion: '2024-08-31'
            },
            {
              id: 'program_004',
              name: 'Green Energy Transition',
              department: 'Energy',
              budget: '$650B',
              status: 'pending',
              progress: 0,
              startDate: '2024-04-01',
              expectedCompletion: '2030-12-31'
            }
          ],
          policies: [
            {
              id: 'policy_001',
              title: 'Galactic Trade Regulation Act',
              category: 'Economic Policy',
              priority: 'high',
              status: 'review',
              supportLevel: 78,
              proposedBy: 'Secretary of Commerce'
            },
            {
              id: 'policy_002',
              title: 'AI Rights and Responsibilities Framework',
              category: 'Technology Policy',
              priority: 'critical',
              status: 'draft',
              supportLevel: 65,
              proposedBy: 'Technology Advisory Board'
            },
            {
              id: 'policy_003',
              title: 'Interplanetary Immigration Reform',
              category: 'Immigration Policy',
              priority: 'medium',
              status: 'approved',
              supportLevel: 82,
              proposedBy: 'Department of Homeland Security'
            },
            {
              id: 'policy_004',
              title: 'Climate Restoration Initiative',
              category: 'Environmental Policy',
              priority: 'high',
              status: 'implemented',
              supportLevel: 91,
              proposedBy: 'Environmental Protection Agency'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGovernmentData();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Government Action: ${action}`, context);
    alert(`Government System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      <div className="overview-header">
        <h2>🏛️ Government Overview</h2>
        <p>Comprehensive dashboard of government operations and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.approvalRating}%</div>
            <div className="stat-label">Approval Rating</div>
            <div className="stat-trend positive">+2.3%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.stabilityIndex}</div>
            <div className="stat-label">Stability Index</div>
            <div className="stat-trend positive">+0.2</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.totalBudget}</div>
            <div className="stat-label">Total Budget</div>
            <div className="stat-trend neutral">±0%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.activePrograms}</div>
            <div className="stat-label">Active Programs</div>
            <div className="stat-trend positive">+8</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.employedOfficials.toLocaleString()}</div>
            <div className="stat-label">Government Officials</div>
            <div className="stat-trend positive">+45</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-content">
            <div className="stat-value">{governmentData.stats.pendingLegislation}</div>
            <div className="stat-label">Pending Legislation</div>
            <div className="stat-trend negative">-3</div>
          </div>
        </div>
      </div>

      <div className="overview-charts">
        <div className="chart-card">
          <h3>📈 Approval Rating Trend</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: '65%' }}></div>
              <div className="bar" style={{ height: '68%' }}></div>
              <div className="bar" style={{ height: '71%' }}></div>
              <div className="bar" style={{ height: '69%' }}></div>
              <div className="bar" style={{ height: '73%' }}></div>
              <div className="bar" style={{ height: '75%' }}></div>
              <div className="bar" style={{ height: '73%' }}></div>
            </div>
            <div className="chart-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🏛️ Department Performance</h3>
          <div className="performance-breakdown">
            <div className="performance-item">
              <span className="performance-label">Health</span>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '85%', backgroundColor: '#4CAF50' }}></div>
              </div>
              <span className="performance-value">85%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Defense</span>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '78%', backgroundColor: '#2196F3' }}></div>
              </div>
              <span className="performance-value">78%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Education</span>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '92%', backgroundColor: '#FF9800' }}></div>
              </div>
              <span className="performance-value">92%</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Transportation</span>
              <div className="performance-bar">
                <div className="performance-fill" style={{ width: '67%', backgroundColor: '#9C27B0' }}></div>
              </div>
              <span className="performance-value">67%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-actions">
        <button className="btn" onClick={() => handleAction('Generate Government Report')}>
          📋 Generate Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Schedule Cabinet Meeting')}>
          🤝 Cabinet Meeting
        </button>
        <button className="btn secondary" onClick={() => handleAction('Emergency Session')}>
          🚨 Emergency Session
        </button>
      </div>
    </div>
  );

  const renderOfficialsTab = () => (
    <div className="officials-tab">
      <div className="officials-header">
        <h2>👥 Government Officials</h2>
        <p>Key government officials and their performance metrics</p>
      </div>

      <div className="officials-grid">
        {governmentData.officials.map(official => (
          <div key={official.id} className="official-card">
            <div className="official-header">
              <h3>{official.name}</h3>
              <div className={`official-status ${official.status}`}>
                {official.status.charAt(0).toUpperCase() + official.status.slice(1)}
              </div>
            </div>
            <div className="official-info">
              <div className="info-row">
                <span className="info-label">Position:</span>
                <span className="info-value">{official.position}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{official.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Years in Office:</span>
                <span className="info-value">{official.yearsInOffice} years</span>
              </div>
              <div className="info-row">
                <span className="info-label">Approval Rating:</span>
                <span className="info-value">{official.approvalRating}%</span>
              </div>
            </div>
            <div className="approval-bar">
              <div className="approval-fill" style={{ width: `${official.approvalRating}%` }}></div>
            </div>
            <div className="official-actions">
              <button className="btn" onClick={() => handleAction('View Official Profile', official.name)}>
                👤 Profile
              </button>
              <button className="btn secondary" onClick={() => handleAction('Schedule Meeting', official.name)}>
                📅 Meeting
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="officials-actions">
        <button className="btn" onClick={() => handleAction('Appoint New Official')}>
          ➕ Appoint Official
        </button>
        <button className="btn secondary" onClick={() => handleAction('Performance Review')}>
          📊 Performance Review
        </button>
        <button className="btn secondary" onClick={() => handleAction('Reorganize Departments')}>
          🔄 Reorganize
        </button>
      </div>
    </div>
  );

  const renderProgramsTab = () => (
    <div className="programs-tab">
      <div className="programs-header">
        <h2>📋 Government Programs</h2>
        <p>Active and planned government programs and initiatives</p>
      </div>

      <div className="programs-grid">
        {governmentData.programs.map(program => (
          <div key={program.id} className="program-card">
            <div className="program-header">
              <h3>{program.name}</h3>
              <div className={`program-status ${program.status}`}>
                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
              </div>
            </div>
            <div className="program-info">
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{program.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Budget:</span>
                <span className="info-value">{program.budget}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Progress:</span>
                <span className="info-value">{program.progress}%</span>
              </div>
              <div className="info-row">
                <span className="info-label">Start Date:</span>
                <span className="info-value">{program.startDate}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Expected Completion:</span>
                <span className="info-value">{program.expectedCompletion}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${program.progress}%` }}></div>
            </div>
            <div className="program-actions">
              <button className="btn" onClick={() => handleAction('View Program Details', program.name)}>
                📊 Details
              </button>
              <button className="btn secondary" onClick={() => handleAction('Adjust Budget', program.name)}>
                💰 Budget
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="programs-actions">
        <button className="btn" onClick={() => handleAction('Create New Program')}>
          ➕ New Program
        </button>
        <button className="btn secondary" onClick={() => handleAction('Program Evaluation')}>
          📈 Evaluation
        </button>
        <button className="btn secondary" onClick={() => handleAction('Budget Allocation')}>
          💰 Budget Review
        </button>
      </div>
    </div>
  );

  const renderPoliciesTab = () => (
    <div className="policies-tab">
      <div className="policies-header">
        <h2>📜 Policy Initiatives</h2>
        <p>Current policy proposals and legislative initiatives</p>
      </div>

      <div className="policies-grid">
        {governmentData.policies.map(policy => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <h3>{policy.title}</h3>
              <div className={`policy-priority ${policy.priority}`}>
                {policy.priority.charAt(0).toUpperCase() + policy.priority.slice(1)} Priority
              </div>
            </div>
            <div className="policy-info">
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{policy.category}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`policy-status ${policy.status}`}>
                  {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Support Level:</span>
                <span className="info-value">{policy.supportLevel}%</span>
              </div>
              <div className="info-row">
                <span className="info-label">Proposed By:</span>
                <span className="info-value">{policy.proposedBy}</span>
              </div>
            </div>
            <div className="support-bar">
              <div className="support-fill" style={{ width: `${policy.supportLevel}%` }}></div>
            </div>
            <div className="policy-actions">
              <button className="btn" onClick={() => handleAction('Review Policy', policy.title)}>
                📋 Review
              </button>
              <button className="btn secondary" onClick={() => handleAction('Public Consultation', policy.title)}>
                🗳️ Consult
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="policies-actions">
        <button className="btn" onClick={() => handleAction('Draft New Policy')}>
          ✏️ Draft Policy
        </button>
        <button className="btn secondary" onClick={() => handleAction('Legislative Calendar')}>
          📅 Calendar
        </button>
        <button className="btn secondary" onClick={() => handleAction('Policy Impact Analysis')}>
          📊 Impact Analysis
        </button>
      </div>
    </div>
  );

  const renderBudgetTab = () => (
    <div className="budget-tab">
      <div className="budget-header">
        <h2>💰 Government Budget</h2>
        <p>Budget allocation and financial management overview</p>
      </div>

      <div className="budget-overview">
        <div className="budget-summary">
          <div className="budget-item">
            <div className="budget-label">Total Budget</div>
            <div className="budget-value">{governmentData.stats.totalBudget}</div>
          </div>
          <div className="budget-item">
            <div className="budget-label">Allocated</div>
            <div className="budget-value">$2.1T</div>
          </div>
          <div className="budget-item">
            <div className="budget-label">Available</div>
            <div className="budget-value">$0.7T</div>
          </div>
          <div className="budget-item">
            <div className="budget-label">Reserved</div>
            <div className="budget-value">$0.3T</div>
          </div>
        </div>

        <div className="budget-breakdown">
          <h3>💼 Department Allocations</h3>
          <div className="allocation-list">
            <div className="allocation-item">
              <span className="allocation-label">Defense</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '35%', backgroundColor: '#2196F3' }}></div>
              </div>
              <span className="allocation-value">$980B (35%)</span>
            </div>
            <div className="allocation-item">
              <span className="allocation-label">Health</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '25%', backgroundColor: '#4CAF50' }}></div>
              </div>
              <span className="allocation-value">$700B (25%)</span>
            </div>
            <div className="allocation-item">
              <span className="allocation-label">Education</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '15%', backgroundColor: '#FF9800' }}></div>
              </div>
              <span className="allocation-value">$420B (15%)</span>
            </div>
            <div className="allocation-item">
              <span className="allocation-label">Infrastructure</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '12%', backgroundColor: '#9C27B0' }}></div>
              </div>
              <span className="allocation-value">$336B (12%)</span>
            </div>
            <div className="allocation-item">
              <span className="allocation-label">Science & Technology</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '8%', backgroundColor: '#00BCD4' }}></div>
              </div>
              <span className="allocation-value">$224B (8%)</span>
            </div>
            <div className="allocation-item">
              <span className="allocation-label">Other</span>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: '5%', backgroundColor: '#607D8B' }}></div>
              </div>
              <span className="allocation-value">$140B (5%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="budget-actions">
        <button className="btn" onClick={() => handleAction('Budget Proposal')}>
          📋 New Proposal
        </button>
        <button className="btn secondary" onClick={() => handleAction('Reallocate Funds')}>
          🔄 Reallocate
        </button>
        <button className="btn secondary" onClick={() => handleAction('Financial Audit')}>
          🔍 Audit
        </button>
        <button className="btn secondary" onClick={() => handleAction('Emergency Funds')}>
          🚨 Emergency Funds
        </button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="analytics-header">
        <h2>📊 Government Analytics</h2>
        <p>Performance metrics and analytical insights</p>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h3>📈 Government Efficiency Trends</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{ height: '70%' }}></div>
              <div className="bar" style={{ height: '75%' }}></div>
              <div className="bar" style={{ height: '68%' }}></div>
              <div className="bar" style={{ height: '82%' }}></div>
              <div className="bar" style={{ height: '79%' }}></div>
              <div className="bar" style={{ height: '85%' }}></div>
              <div className="bar" style={{ height: '84%' }}></div>
            </div>
            <div className="chart-labels">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span><span>Q1</span><span>Q2</span><span>Q3</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>🎯 Policy Success Rate</h3>
          <div className="success-breakdown">
            <div className="success-item">
              <span className="success-label">Implemented Successfully</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '78%', backgroundColor: '#4CAF50' }}></div>
              </div>
              <span className="success-value">78%</span>
            </div>
            <div className="success-item">
              <span className="success-label">Partially Implemented</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '15%', backgroundColor: '#FF9800' }}></div>
              </div>
              <span className="success-value">15%</span>
            </div>
            <div className="success-item">
              <span className="success-label">Failed/Cancelled</span>
              <div className="success-bar">
                <div className="success-fill" style={{ width: '7%', backgroundColor: '#F44336' }}></div>
              </div>
              <span className="success-value">7%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button className="btn" onClick={() => handleAction('Generate Analytics Report')}>
          📋 Full Report
        </button>
        <button className="btn secondary" onClick={() => handleAction('Predictive Analysis')}>
          🔮 Predictions
        </button>
        <button className="btn secondary" onClick={() => handleAction('Benchmark Analysis')}>
          📊 Benchmarks
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="government-screen">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading government data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="government-screen">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏛️ Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'officials' ? 'active' : ''}`}
          onClick={() => setActiveTab('officials')}
        >
          👥 Officials
        </button>
        <button 
          className={`tab-btn ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          📋 Programs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          📜 Policies
        </button>
        <button 
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          💰 Budget
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'officials' && renderOfficialsTab()}
        {activeTab === 'programs' && renderProgramsTab()}
        {activeTab === 'policies' && renderPoliciesTab()}
        {activeTab === 'budget' && renderBudgetTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default GovernmentScreen;
