import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './TreasuryScreen.css';

interface TreasurySecretary {
  id: string;
  name: string;
  title: string;
  experience: number;
  specialization: string[];
  approval: number;
  tenure: string;
  background: string;
  achievements: string[];
}

interface GovernmentFinances {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgetUtilization: number;
}

interface RevenueStreams {
  taxRevenue: number;
  collectionEfficiency: number;
  corporateTax: number;
  individualTax: number;
  tradeTariffs: number;
  otherRevenue: number;
}

interface DepartmentBudget {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  lastUpdate: string;
  projects: number;
}

interface SpendingRequest {
  id: string;
  department: string;
  title: string;
  amount: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  requestDate: string;
  justification: string;
  category: string;
  expectedOutcome: string;
  timeline: string;
}

interface BudgetAnalytics {
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    spending: number;
    surplus: number;
  }>;
  departmentPerformance: Array<{
    department: string;
    efficiency: number;
    variance: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  riskFactors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    probability: number;
    mitigation: string;
  }>;
}

interface EconomicForecast {
  gdpGrowth: number;
  inflationRate: number;
  unemploymentRate: number;
  projectedRevenue: number;
  projectedSpending: number;
  budgetBalance: number;
  confidenceLevel: number;
  keyAssumptions: string[];
  scenarios: Array<{
    name: string;
    probability: number;
    impact: string;
    budgetEffect: number;
  }>;
}

interface TreasuryData {
  secretary: TreasurySecretary | null;
  finances: GovernmentFinances;
  revenue: RevenueStreams;
  departments: DepartmentBudget[];
  spendingRequests: SpendingRequest[];
  analytics: BudgetAnalytics;
  forecasting: EconomicForecast;
}

const TreasuryScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'departments' | 'rollup' | 'requests' | 'analytics' | 'forecasting'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/treasury/secretary', description: 'Get treasury secretary information' },
    { method: 'GET', path: '/api/treasury/finances', description: 'Get government financial overview' },
    { method: 'GET', path: '/api/treasury/revenue', description: 'Get revenue streams data' },
    { method: 'GET', path: '/api/treasury/departments', description: 'Get department budget allocations' },
    { method: 'GET', path: '/api/treasury/spending-requests', description: 'Get pending spending requests' },
    { method: 'GET', path: '/api/treasury/analytics', description: 'Get budget analytics and trends' },
    { method: 'GET', path: '/api/treasury/forecasting', description: 'Get economic forecasts' },
    { method: 'POST', path: '/api/treasury/approve-request', description: 'Approve spending request' },
    { method: 'POST', path: '/api/treasury/allocate-budget', description: 'Allocate budget to department' },
    { method: 'PUT', path: '/api/treasury/update-forecast', description: 'Update economic forecast' },
    { method: 'DELETE', path: '/api/treasury/reject-request', description: 'Reject spending request' }
  ];

  const fetchTreasuryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        secretaryRes,
        financesRes,
        revenueRes,
        departmentsRes,
        requestsRes,
        analyticsRes,
        forecastingRes
      ] = await Promise.all([
        fetch('/api/treasury/secretary'),
        fetch('/api/treasury/finances'),
        fetch('/api/treasury/revenue'),
        fetch('/api/treasury/departments'),
        fetch('/api/treasury/spending-requests'),
        fetch('/api/treasury/analytics'),
        fetch('/api/treasury/forecasting')
      ]);

      const [
        secretary,
        finances,
        revenue,
        departments,
        requests,
        analytics,
        forecasting
      ] = await Promise.all([
        secretaryRes.json(),
        financesRes.json(),
        revenueRes.json(),
        departmentsRes.json(),
        requestsRes.json(),
        analyticsRes.json(),
        forecastingRes.json()
      ]);

      setTreasuryData({
        secretary: secretary.secretary || generateMockSecretary(),
        finances: finances.finances || generateMockFinances(),
        revenue: revenue.revenue || generateMockRevenue(),
        departments: departments.departments || generateMockDepartments(),
        spendingRequests: requests.requests || generateMockRequests(),
        analytics: analytics.analytics || generateMockAnalytics(),
        forecasting: forecasting.forecasting || generateMockForecasting()
      });
    } catch (err) {
      console.error('Failed to fetch treasury data:', err);
      // Use mock data as fallback
      setTreasuryData({
        secretary: generateMockSecretary(),
        finances: generateMockFinances(),
        revenue: generateMockRevenue(),
        departments: generateMockDepartments(),
        spendingRequests: generateMockRequests(),
        analytics: generateMockAnalytics(),
        forecasting: generateMockForecasting()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasuryData();
  }, [fetchTreasuryData]);

  const generateMockSecretary = (): TreasurySecretary => ({
    id: 'sec-1',
    name: 'Dr. Sarah Chen',
    title: 'Secretary of the Treasury',
    experience: 15,
    specialization: ['Fiscal Policy', 'Economic Analysis', 'Public Finance', 'Monetary Policy'],
    approval: 78,
    tenure: '2022-Present',
    background: 'Former Chief Economist at Federal Reserve, PhD in Economics from MIT, 20 years in public service',
    achievements: ['Reduced national debt by 8%', 'Implemented tax reform', 'Modernized treasury systems', 'Improved budget transparency']
  });

  const generateMockFinances = (): GovernmentFinances => ({
    totalBudget: 4500000000000,
    totalSpent: 3200000000000,
    totalRemaining: 1300000000000,
    budgetUtilization: 71.1
  });

  const generateMockRevenue = (): RevenueStreams => ({
    taxRevenue: 3800000000000,
    collectionEfficiency: 94.2,
    corporateTax: 1200000000000,
    individualTax: 2100000000000,
    tradeTariffs: 350000000000,
    otherRevenue: 150000000000
  });

  const generateMockDepartments = (): DepartmentBudget[] => [
    {
      id: 'dept-1',
      name: 'Defense',
      allocated: 800000000000,
      spent: 580000000000,
      remaining: 220000000000,
      utilization: 72.5,
      priority: 'critical',
      category: 'Security',
      lastUpdate: '2024-02-20',
      projects: 45
    },
    {
      id: 'dept-2',
      name: 'Health & Human Services',
      allocated: 1200000000000,
      spent: 950000000000,
      remaining: 250000000000,
      utilization: 79.2,
      priority: 'critical',
      category: 'Social',
      lastUpdate: '2024-02-19',
      projects: 67
    },
    {
      id: 'dept-3',
      name: 'Education',
      allocated: 600000000000,
      spent: 420000000000,
      remaining: 180000000000,
      utilization: 70.0,
      priority: 'high',
      category: 'Social',
      lastUpdate: '2024-02-18',
      projects: 32
    },
    {
      id: 'dept-4',
      name: 'Transportation',
      allocated: 450000000000,
      spent: 320000000000,
      remaining: 130000000000,
      utilization: 71.1,
      priority: 'high',
      category: 'Infrastructure',
      lastUpdate: '2024-02-17',
      projects: 28
    },
    {
      id: 'dept-5',
      name: 'Energy',
      allocated: 350000000000,
      spent: 240000000000,
      remaining: 110000000000,
      utilization: 68.6,
      priority: 'medium',
      category: 'Infrastructure',
      lastUpdate: '2024-02-16',
      projects: 19
    },
    {
      id: 'dept-6',
      name: 'Agriculture',
      allocated: 280000000000,
      spent: 195000000000,
      remaining: 85000000000,
      utilization: 69.6,
      priority: 'medium',
      category: 'Economic',
      lastUpdate: '2024-02-15',
      projects: 15
    }
  ];

  const generateMockRequests = (): SpendingRequest[] => [
    {
      id: 'req-1',
      department: 'Defense',
      title: 'Advanced Weapons System Upgrade',
      amount: 25000000000,
      priority: 'urgent',
      status: 'pending',
      requestDate: '2024-02-20',
      justification: 'Critical security upgrade to maintain technological superiority',
      category: 'Equipment',
      expectedOutcome: 'Enhanced defense capabilities and deterrence',
      timeline: '18 months'
    },
    {
      id: 'req-2',
      department: 'Health & Human Services',
      title: 'Pandemic Preparedness Initiative',
      amount: 15000000000,
      priority: 'high',
      status: 'under_review',
      requestDate: '2024-02-19',
      justification: 'Strengthen healthcare infrastructure for future health emergencies',
      category: 'Infrastructure',
      expectedOutcome: 'Improved pandemic response capabilities',
      timeline: '24 months'
    },
    {
      id: 'req-3',
      department: 'Education',
      title: 'Digital Learning Platform Expansion',
      amount: 8000000000,
      priority: 'high',
      status: 'approved',
      requestDate: '2024-02-18',
      justification: 'Modernize education delivery and improve access to quality education',
      category: 'Technology',
      expectedOutcome: 'Enhanced educational outcomes and accessibility',
      timeline: '12 months'
    },
    {
      id: 'req-4',
      department: 'Transportation',
      title: 'High-Speed Rail Network Phase 2',
      amount: 45000000000,
      priority: 'medium',
      status: 'pending',
      requestDate: '2024-02-17',
      justification: 'Expand sustainable transportation infrastructure',
      category: 'Infrastructure',
      expectedOutcome: 'Reduced carbon emissions and improved connectivity',
      timeline: '36 months'
    }
  ];

  const generateMockAnalytics = (): BudgetAnalytics => ({
    monthlyTrends: [
      { month: 'Jan 2024', revenue: 320000000000, spending: 280000000000, surplus: 40000000000 },
      { month: 'Feb 2024', revenue: 315000000000, spending: 290000000000, surplus: 25000000000 },
      { month: 'Mar 2024', revenue: 335000000000, spending: 295000000000, surplus: 40000000000 },
      { month: 'Apr 2024', revenue: 340000000000, spending: 310000000000, surplus: 30000000000 },
      { month: 'May 2024', revenue: 350000000000, spending: 320000000000, surplus: 30000000000 },
      { month: 'Jun 2024', revenue: 345000000000, spending: 315000000000, surplus: 30000000000 }
    ],
    departmentPerformance: [
      { department: 'Defense', efficiency: 87.5, variance: -2.3, trend: 'stable' },
      { department: 'Health & Human Services', efficiency: 92.1, variance: 3.8, trend: 'improving' },
      { department: 'Education', efficiency: 89.3, variance: 1.2, trend: 'improving' },
      { department: 'Transportation', efficiency: 85.7, variance: -1.8, trend: 'declining' },
      { department: 'Energy', efficiency: 91.2, variance: 4.5, trend: 'improving' },
      { department: 'Agriculture', efficiency: 88.9, variance: 0.7, trend: 'stable' }
    ],
    riskFactors: [
      {
        factor: 'Economic Recession',
        impact: 'high',
        probability: 25,
        mitigation: 'Maintain emergency reserves and flexible spending policies'
      },
      {
        factor: 'Interest Rate Changes',
        impact: 'medium',
        probability: 60,
        mitigation: 'Diversify debt portfolio and monitor Federal Reserve policy'
      },
      {
        factor: 'Geopolitical Tensions',
        impact: 'high',
        probability: 35,
        mitigation: 'Increase defense spending flexibility and strategic reserves'
      }
    ]
  });

  const generateMockForecasting = (): EconomicForecast => ({
    gdpGrowth: 2.8,
    inflationRate: 2.1,
    unemploymentRate: 3.7,
    projectedRevenue: 4200000000000,
    projectedSpending: 4100000000000,
    budgetBalance: 100000000000,
    confidenceLevel: 78,
    keyAssumptions: [
      'Stable economic growth continues',
      'No major geopolitical disruptions',
      'Tax collection efficiency remains high',
      'Interest rates remain relatively stable'
    ],
    scenarios: [
      {
        name: 'Optimistic Growth',
        probability: 30,
        impact: 'GDP growth exceeds 3.5%, higher tax revenues',
        budgetEffect: 150000000000
      },
      {
        name: 'Economic Slowdown',
        probability: 25,
        impact: 'GDP growth below 2%, reduced tax revenues',
        budgetEffect: -200000000000
      },
      {
        name: 'Baseline Scenario',
        probability: 45,
        impact: 'Moderate growth as projected',
        budgetEffect: 0
      }
    ]
  });

  const formatCurrency = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'under_review': return '#3b82f6';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return '#22c55e';
      case 'stable': return '#eab308';
      case 'declining': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchTreasuryData}
    >
      <div className="treasury-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            🏛️ Departments
          </button>
          <button 
            className={`tab ${activeTab === 'rollup' ? 'active' : ''}`}
            onClick={() => setActiveTab('rollup')}
          >
            📋 Budget Rollup
          </button>
          <button 
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📝 Spending Requests
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'forecasting' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecasting')}
          >
            🔮 Forecasting
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading treasury data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && treasuryData && (
            <>
              {activeTab === 'dashboard' && (
                <div className="dashboard-tab">
                  <div className="dashboard-grid">
                    <div className="finance-card">
                      <h4>💰 Government Finances</h4>
                      <div className="finance-metrics">
                        <div className="finance-metric">
                          <span>Total Budget:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalBudget)}</span>
                        </div>
                        <div className="finance-metric">
                          <span>Total Spent:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalSpent)}</span>
                        </div>
                        <div className="finance-metric">
                          <span>Remaining:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.finances.totalRemaining)}</span>
                        </div>
                        <div className="budget-utilization">
                          <div className="utilization-label">Budget Utilization: {treasuryData.finances.budgetUtilization}%</div>
                          <div className="budget-bar">
                            <div className="budget-fill" style={{ width: `${treasuryData.finances.budgetUtilization}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="revenue-card">
                      <h4>📈 Revenue Streams</h4>
                      <div className="revenue-metrics">
                        <div className="revenue-metric">
                          <span>Tax Collections:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.taxRevenue)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Collection Efficiency:</span>
                          <span className="metric-value">{treasuryData.revenue.collectionEfficiency}%</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Corporate Tax:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.corporateTax)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Individual Tax:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.individualTax)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Trade Tariffs:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.tradeTariffs)}</span>
                        </div>
                        <div className="revenue-metric">
                          <span>Other Revenue:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.revenue.otherRevenue)}</span>
                        </div>
                      </div>
                    </div>

                    {treasuryData.secretary && (
                      <div className="secretary-card">
                        <h4>🎖️ Treasury Secretary</h4>
                        <div className="secretary-profile">
                          <div className="secretary-name">{treasuryData.secretary.name}</div>
                          <div className="secretary-title">{treasuryData.secretary.title}</div>
                          <div className="secretary-details">
                            <div className="secretary-experience">Experience: {treasuryData.secretary.experience} years</div>
                            <div className="secretary-tenure">Tenure: {treasuryData.secretary.tenure}</div>
                            <div className="secretary-approval">Approval: {treasuryData.secretary.approval}%</div>
                          </div>
                          <div className="secretary-background">{treasuryData.secretary.background}</div>
                          <div className="secretary-specializations">
                            <strong>Specializations:</strong>
                            <div className="specialization-tags">
                              {treasuryData.secretary.specialization.map((spec, i) => (
                                <span key={i} className="specialization-tag">{spec}</span>
                              ))}
                            </div>
                          </div>
                          <div className="secretary-achievements">
                            <strong>Key Achievements:</strong>
                            <div className="achievements-list">
                              {treasuryData.secretary.achievements.map((achievement, i) => (
                                <div key={i} className="achievement-item">✨ {achievement}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Financial Report</button>
                    <button className="action-btn secondary">Budget Summary</button>
                    <button className="action-btn">Treasury Operations</button>
                  </div>
                </div>
              )}

              {activeTab === 'departments' && (
                <div className="departments-tab">
                  <div className="departments-grid">
                    {treasuryData.departments.map((dept) => (
                      <div key={dept.id} className="department-item">
                        <div className="department-header">
                          <div className="department-name">{dept.name}</div>
                          <div className="department-priority" style={{ color: getPriorityColor(dept.priority) }}>
                            {dept.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="department-details">
                          <div className="department-category">{dept.category}</div>
                          <div className="department-projects">Projects: {dept.projects}</div>
                          <div className="department-updated">Updated: {new Date(dept.lastUpdate).toLocaleDateString()}</div>
                        </div>
                        <div className="department-budget">
                          <div className="budget-amounts">
                            <div className="budget-allocated">Allocated: {formatCurrency(dept.allocated)}</div>
                            <div className="budget-spent">Spent: {formatCurrency(dept.spent)}</div>
                            <div className="budget-remaining">Remaining: {formatCurrency(dept.remaining)}</div>
                          </div>
                          <div className="utilization-info">
                            <span>Utilization: {dept.utilization}%</span>
                          </div>
                          <div className="budget-bar">
                            <div className="budget-fill" style={{ width: `${dept.utilization}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Allocate Budget</button>
                    <button className="action-btn secondary">Department Report</button>
                    <button className="action-btn">Budget Transfer</button>
                  </div>
                </div>
              )}

              {activeTab === 'rollup' && (
                <div className="rollup-tab">
                  <div className="rollup-summary">
                    <div className="summary-card">
                      <div className="summary-title">Budget Rollup Summary</div>
                      <div className="summary-metrics">
                        <div className="summary-metric">
                          <span>Total Allocated:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.allocated, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Total Spent:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.spent, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Total Remaining:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.departments.reduce((sum, dept) => sum + dept.remaining, 0))}</span>
                        </div>
                        <div className="summary-metric">
                          <span>Average Utilization:</span>
                          <span className="metric-value">{(treasuryData.departments.reduce((sum, dept) => sum + dept.utilization, 0) / treasuryData.departments.length).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rollup-breakdown">
                    <h4>Department Breakdown</h4>
                    <div className="breakdown-table">
                      {treasuryData.departments.map((dept) => (
                        <div key={dept.id} className="breakdown-row">
                          <div className="breakdown-department">{dept.name}</div>
                          <div className="breakdown-allocated">{formatCurrency(dept.allocated)}</div>
                          <div className="breakdown-spent">{formatCurrency(dept.spent)}</div>
                          <div className="breakdown-remaining">{formatCurrency(dept.remaining)}</div>
                          <div className="breakdown-utilization">{dept.utilization}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Export Rollup</button>
                    <button className="action-btn secondary">Detailed Analysis</button>
                    <button className="action-btn">Budget Comparison</button>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="requests-tab">
                  <div className="requests-grid">
                    {treasuryData.spendingRequests.map((request) => (
                      <div key={request.id} className="request-item">
                        <div className="request-header">
                          <div className="request-title">{request.title}</div>
                          <div className="request-priority" style={{ color: getPriorityColor(request.priority) }}>
                            {request.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="request-details">
                          <div className="request-department">{request.department}</div>
                          <div className="request-amount">{formatCurrency(request.amount)}</div>
                          <div className="request-status" style={{ color: getStatusColor(request.status) }}>
                            Status: {request.status.toUpperCase()}
                          </div>
                          <div className="request-date">Requested: {new Date(request.requestDate).toLocaleDateString()}</div>
                          <div className="request-category">Category: {request.category}</div>
                          <div className="request-timeline">Timeline: {request.timeline}</div>
                        </div>
                        <div className="request-justification">
                          <strong>Justification:</strong> {request.justification}
                        </div>
                        <div className="request-outcome">
                          <strong>Expected Outcome:</strong> {request.expectedOutcome}
                        </div>
                        <div className="request-actions">
                          {request.status === 'pending' && (
                            <>
                              <button className="action-btn approve">Approve</button>
                              <button className="action-btn reject">Reject</button>
                            </>
                          )}
                          <button className="action-btn secondary">Review Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">New Request</button>
                    <button className="action-btn secondary">Batch Review</button>
                    <button className="action-btn">Request Report</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-grid">
                    <div className="trends-card">
                      <h4>📈 Monthly Trends</h4>
                      <div className="trends-list">
                        {treasuryData.analytics.monthlyTrends.map((trend, i) => (
                          <div key={i} className="trend-item">
                            <div className="trend-month">{trend.month}</div>
                            <div className="trend-metrics">
                              <div className="trend-revenue">Revenue: {formatCurrency(trend.revenue)}</div>
                              <div className="trend-spending">Spending: {formatCurrency(trend.spending)}</div>
                              <div className="trend-surplus" style={{ color: trend.surplus >= 0 ? '#22c55e' : '#ef4444' }}>
                                {trend.surplus >= 0 ? 'Surplus' : 'Deficit'}: {formatCurrency(Math.abs(trend.surplus))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="performance-card">
                      <h4>🎯 Department Performance</h4>
                      <div className="performance-list">
                        {treasuryData.analytics.departmentPerformance.map((perf, i) => (
                          <div key={i} className="performance-item">
                            <div className="performance-department">{perf.department}</div>
                            <div className="performance-metrics">
                              <div className="performance-efficiency">Efficiency: {perf.efficiency}%</div>
                              <div className="performance-variance" style={{ color: perf.variance >= 0 ? '#22c55e' : '#ef4444' }}>
                                Variance: {perf.variance >= 0 ? '+' : ''}{perf.variance}%
                              </div>
                              <div className="performance-trend" style={{ color: getTrendColor(perf.trend) }}>
                                Trend: {perf.trend.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="risks-card">
                      <h4>⚠️ Risk Factors</h4>
                      <div className="risks-list">
                        {treasuryData.analytics.riskFactors.map((risk, i) => (
                          <div key={i} className="risk-item">
                            <div className="risk-header">
                              <div className="risk-factor">{risk.factor}</div>
                              <div className="risk-impact" style={{ color: getPriorityColor(risk.impact) }}>
                                {risk.impact.toUpperCase()}
                              </div>
                            </div>
                            <div className="risk-probability">Probability: {risk.probability}%</div>
                            <div className="risk-mitigation">
                              <strong>Mitigation:</strong> {risk.mitigation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Risk Assessment</button>
                    <button className="action-btn">Performance Review</button>
                  </div>
                </div>
              )}

              {activeTab === 'forecasting' && (
                <div className="forecasting-tab">
                  <div className="forecasting-grid">
                    <div className="forecast-overview">
                      <h4>🔮 Economic Forecast</h4>
                      <div className="forecast-metrics">
                        <div className="forecast-metric">
                          <span>GDP Growth:</span>
                          <span className="metric-value">{treasuryData.forecasting.gdpGrowth}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Inflation Rate:</span>
                          <span className="metric-value">{treasuryData.forecasting.inflationRate}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Unemployment Rate:</span>
                          <span className="metric-value">{treasuryData.forecasting.unemploymentRate}%</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Projected Revenue:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.forecasting.projectedRevenue)}</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Projected Spending:</span>
                          <span className="metric-value">{formatCurrency(treasuryData.forecasting.projectedSpending)}</span>
                        </div>
                        <div className="forecast-metric">
                          <span>Budget Balance:</span>
                          <span className="metric-value" style={{ color: treasuryData.forecasting.budgetBalance >= 0 ? '#22c55e' : '#ef4444' }}>
                            {formatCurrency(treasuryData.forecasting.budgetBalance)}
                          </span>
                        </div>
                        <div className="forecast-confidence">
                          <span>Confidence Level: {treasuryData.forecasting.confidenceLevel}%</span>
                          <div className="confidence-bar">
                            <div className="confidence-fill" style={{ width: `${treasuryData.forecasting.confidenceLevel}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="assumptions-card">
                      <h4>📋 Key Assumptions</h4>
                      <div className="assumptions-list">
                        {treasuryData.forecasting.keyAssumptions.map((assumption, i) => (
                          <div key={i} className="assumption-item">📌 {assumption}</div>
                        ))}
                      </div>
                    </div>

                    <div className="scenarios-card">
                      <h4>🎲 Economic Scenarios</h4>
                      <div className="scenarios-list">
                        {treasuryData.forecasting.scenarios.map((scenario, i) => (
                          <div key={i} className="scenario-item">
                            <div className="scenario-header">
                              <div className="scenario-name">{scenario.name}</div>
                              <div className="scenario-probability">{scenario.probability}%</div>
                            </div>
                            <div className="scenario-impact">{scenario.impact}</div>
                            <div className="scenario-effect" style={{ color: scenario.budgetEffect >= 0 ? '#22c55e' : '#ef4444' }}>
                              Budget Effect: {scenario.budgetEffect >= 0 ? '+' : ''}{formatCurrency(scenario.budgetEffect)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Update Forecast</button>
                    <button className="action-btn secondary">Scenario Analysis</button>
                    <button className="action-btn">Economic Report</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TreasuryScreen;
