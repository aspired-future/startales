import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './TreasuryScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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

interface TaxLineItem {
  id: string;
  name: string;
  category: 'income' | 'corporate' | 'property' | 'sales' | 'excise' | 'tariff' | 'other';
  amount: number;
  rate: number;
  baseAmount: number;
  collectionEfficiency: number;
  source: string;
  region?: string;
  demographic?: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyChange: number;
  yearOverYear: number;
  description: string;
}

interface TaxCategory {
  category: 'income' | 'corporate' | 'property' | 'sales' | 'excise' | 'tariff' | 'other';
  name: string;
  totalAmount: number;
  lineItems: TaxLineItem[];
  collectionEfficiency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyChange: number;
}

interface RevenueStreams {
  taxRevenue: number;
  collectionEfficiency: number;
  corporateTax: number;
  individualTax: number;
  tradeTariffs: number;
  otherRevenue: number;
  taxCategories: TaxCategory[];
  totalTaxLineItems: TaxLineItem[];
  geographicBreakdown: {
    region: string;
    amount: number;
    percentage: number;
    efficiency: number;
  }[];
  demographicBreakdown: {
    demographic: string;
    amount: number;
    percentage: number;
    averageRate: number;
  }[];
  monthlyTaxTrends: {
    month: string;
    totalTax: number;
    categories: { [category: string]: number };
  }[];
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
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  justification: string;
  expectedImpact: string;
  submittedDate: string;
  reviewDate?: string;
  approver?: string;
}

interface TreasuryData {
  secretary: TreasurySecretary;
  finances: GovernmentFinances;
  revenue: RevenueStreams;
  departmentBudgets: DepartmentBudget[];
  spendingRequests: SpendingRequest[];
  budgetAllocations: {
    category: string;
    amount: number;
    percentage: number;
    change: number;
    utilization: number;
    description: string;
  }[];
}

const TreasuryScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'budgets' | 'requests' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'budgets', label: 'Budgets', icon: '📋' },
    { id: 'requests', label: 'Requests', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/treasury', description: 'Get treasury data and financial overview' },
    { method: 'GET', path: '/api/treasury/revenue', description: 'Get revenue streams and tax data' },
    { method: 'GET', path: '/api/treasury/budgets', description: 'Get department budget allocations' },
    { method: 'GET', path: '/api/treasury/requests', description: 'Get spending requests and approvals' },
    { method: 'GET', path: '/api/treasury/analytics', description: 'Get financial analytics and trends' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#10b981';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      case 'in_review': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return '#ef4444';
      case 'stable': return '#eab308';
      case 'decreasing': return '#22c55e';
      default: return '#4ade80';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const fetchTreasuryData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/treasury');
      if (response.ok) {
        const data = await response.json();
        setTreasuryData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch treasury data:', err);
      // Use comprehensive mock data
      setTreasuryData({
        secretary: {
          id: 'sec-001',
          name: 'Dr. Elizabeth Rodriguez',
          title: 'Treasury Secretary',
          experience: 18,
          specialization: ['Monetary Policy', 'Fiscal Management', 'Economic Analysis'],
          approval: 72,
          tenure: '4 years, 3 months',
          achievements: [
            'Reduced national debt by 15%',
            'Implemented digital currency framework',
            'Streamlined tax collection system'
          ],
          background: 'Former Federal Reserve economist with 18 years of experience in monetary policy and fiscal management.'
        },
        finances: {
          totalBudget: 8500000000000,
          totalSpent: 7200000000000,
          totalRemaining: 1300000000000,
          budgetUtilization: 84.7
        },
        revenue: {
          taxRevenue: 4200000000000,
          collectionEfficiency: 94.2,
          corporateTax: 1200000000000,
          individualTax: 2100000000000,
          tradeTariffs: 450000000000,
          otherRevenue: 450000000000,
          taxCategories: [
            {
              category: 'income',
              name: 'Individual Income Tax',
              totalAmount: 2100000000000,
              collectionEfficiency: 96.5,
              trend: 'increasing',
              monthlyChange: 2.3,
              lineItems: [
                {
                  id: 'tax-001',
                  name: 'Progressive Income Tax',
                  category: 'income',
                  amount: 1800000000000,
                  rate: 22.5,
                  baseAmount: 8000000000000,
                  collectionEfficiency: 97.2,
                  source: 'Wage earners',
                  trend: 'increasing',
                  monthlyChange: 2.1,
                  yearOverYear: 8.5,
                  description: 'Primary source of government revenue from individual taxpayers'
                },
                {
                  id: 'tax-002',
                  name: 'Capital Gains Tax',
                  category: 'income',
                  amount: 300000000000,
                  rate: 15.0,
                  baseAmount: 2000000000000,
                  collectionEfficiency: 94.8,
                  source: 'Investment income',
                  trend: 'stable',
                  monthlyChange: 0.5,
                  yearOverYear: 3.2,
                  description: 'Tax on investment profits and capital gains'
                }
              ]
            },
            {
              category: 'corporate',
              name: 'Corporate Tax',
              totalAmount: 1200000000000,
              collectionEfficiency: 92.8,
              trend: 'increasing',
              monthlyChange: 1.8,
              lineItems: [
                {
                  id: 'tax-003',
                  name: 'Corporate Income Tax',
                  category: 'corporate',
                  amount: 1000000000000,
                  rate: 21.0,
                  baseAmount: 4760000000000,
                  collectionEfficiency: 93.5,
                  source: 'Business profits',
                  trend: 'increasing',
                  monthlyChange: 2.0,
                  yearOverYear: 6.8,
                  description: 'Tax on corporate profits and business income'
                },
                {
                  id: 'tax-004',
                  name: 'Corporate Alternative Minimum Tax',
                  category: 'corporate',
                  amount: 200000000000,
                  rate: 15.0,
                  baseAmount: 1330000000000,
                  collectionEfficiency: 89.2,
                  source: 'Large corporations',
                  trend: 'stable',
                  monthlyChange: 0.3,
                  yearOverYear: 1.5,
                  description: 'Minimum tax for corporations with high deductions'
                }
              ]
            },
            {
              category: 'sales',
              name: 'Sales & Excise Tax',
              totalAmount: 850000000000,
              collectionEfficiency: 95.1,
              trend: 'stable',
              monthlyChange: 0.8,
              lineItems: [
                {
                  id: 'tax-005',
                  name: 'National Sales Tax',
                  category: 'sales',
                  amount: 600000000000,
                  rate: 5.0,
                  baseAmount: 12000000000000,
                  collectionEfficiency: 96.8,
                  source: 'Consumer spending',
                  trend: 'stable',
                  monthlyChange: 0.7,
                  yearOverYear: 2.1,
                  description: 'Tax on retail sales and consumer purchases'
                },
                {
                  id: 'tax-006',
                  name: 'Excise Tax',
                  category: 'excise',
                  amount: 250000000000,
                  rate: 10.0,
                  baseAmount: 2500000000000,
                  collectionEfficiency: 91.5,
                  source: 'Specific goods',
                  trend: 'decreasing',
                  monthlyChange: -0.5,
                  yearOverYear: -1.2,
                  description: 'Tax on specific goods like fuel, alcohol, tobacco'
                }
              ]
            }
          ],
          totalTaxLineItems: [],
          geographicBreakdown: [
            { region: 'Northeast', amount: 1200000000000, percentage: 28.6, efficiency: 96.2 },
            { region: 'Southeast', amount: 980000000000, percentage: 23.3, efficiency: 94.8 },
            { region: 'Midwest', amount: 850000000000, percentage: 20.2, efficiency: 93.5 },
            { region: 'Southwest', amount: 720000000000, percentage: 17.1, efficiency: 92.1 },
            { region: 'West', amount: 450000000000, percentage: 10.7, efficiency: 91.8 }
          ],
          demographicBreakdown: [
            { demographic: 'High Income', amount: 1800000000000, percentage: 42.9, averageRate: 28.5 },
            { demographic: 'Middle Income', amount: 1500000000000, percentage: 35.7, averageRate: 18.2 },
            { demographic: 'Low Income', amount: 600000000000, percentage: 14.3, averageRate: 8.5 },
            { demographic: 'Businesses', amount: 300000000000, percentage: 7.1, averageRate: 21.0 }
          ],
          monthlyTaxTrends: [
            { month: 'Jan', totalTax: 350000000000, categories: { income: 175000000000, corporate: 100000000000, sales: 75000000000 } },
            { month: 'Feb', totalTax: 360000000000, categories: { income: 180000000000, corporate: 102000000000, sales: 78000000000 } },
            { month: 'Mar', totalTax: 370000000000, categories: { income: 185000000000, corporate: 105000000000, sales: 80000000000 } },
            { month: 'Apr', totalTax: 380000000000, categories: { income: 190000000000, corporate: 108000000000, sales: 82000000000 } },
            { month: 'May', totalTax: 390000000000, categories: { income: 195000000000, corporate: 110000000000, sales: 85000000000 } },
            { month: 'Jun', totalTax: 400000000000, categories: { income: 200000000000, corporate: 112000000000, sales: 88000000000 } }
          ]
        },
        departmentBudgets: [
          {
            id: 'dept-001',
            name: 'Defense Department',
            allocated: 850000000000,
            spent: 720000000000,
            remaining: 130000000000,
            utilization: 84.7,
            priority: 'critical',
            category: 'Security',
            lastUpdate: '2024-08-30',
            projects: 45
          },
          {
            id: 'dept-002',
            name: 'Health & Human Services',
            allocated: 650000000000,
            spent: 580000000000,
            remaining: 70000000000,
            utilization: 89.2,
            priority: 'high',
            category: 'Social Services',
            lastUpdate: '2024-08-30',
            projects: 38
          },
          {
            id: 'dept-003',
            name: 'Education Department',
            allocated: 450000000000,
            spent: 380000000000,
            remaining: 70000000000,
            utilization: 84.4,
            priority: 'high',
            category: 'Education',
            lastUpdate: '2024-08-30',
            projects: 32
          },
          {
            id: 'dept-004',
            name: 'Transportation Department',
            allocated: 350000000000,
            spent: 290000000000,
            remaining: 60000000000,
            utilization: 82.9,
            priority: 'medium',
            category: 'Infrastructure',
            lastUpdate: '2024-08-30',
            projects: 28
          },
          {
            id: 'dept-005',
            name: 'Energy Department',
            allocated: 280000000000,
            spent: 220000000000,
            remaining: 60000000000,
            utilization: 78.6,
            priority: 'medium',
            category: 'Energy',
            lastUpdate: '2024-08-30',
            projects: 25
          }
        ],
        spendingRequests: [
          {
            id: 'req-001',
            department: 'Defense Department',
            title: 'Advanced AI Defense Systems',
            amount: 25000000000,
            priority: 'critical',
            status: 'approved',
            justification: 'Critical for national security and cyber defense capabilities',
            expectedImpact: 'Enhanced cyber defense and AI-powered threat detection',
            submittedDate: '2024-08-15',
            reviewDate: '2024-08-25',
            approver: 'Dr. Elizabeth Rodriguez'
          },
          {
            id: 'req-002',
            department: 'Health & Human Services',
            title: 'Universal Healthcare Expansion',
            amount: 45000000000,
            priority: 'high',
            status: 'pending',
            justification: 'Expand healthcare coverage to underserved populations',
            expectedImpact: 'Improved health outcomes and reduced healthcare costs',
            submittedDate: '2024-08-20'
          },
          {
            id: 'req-003',
            department: 'Education Department',
            title: 'Digital Learning Infrastructure',
            amount: 18000000000,
            priority: 'high',
            status: 'in_review',
            justification: 'Modernize educational technology and digital learning platforms',
            expectedImpact: 'Enhanced educational access and learning outcomes',
            submittedDate: '2024-08-18',
            reviewDate: '2024-08-28'
          },
          {
            id: 'req-004',
            department: 'Transportation Department',
            title: 'High-Speed Rail Network',
            amount: 35000000000,
            priority: 'medium',
            status: 'pending',
            justification: 'Develop sustainable transportation infrastructure',
            expectedImpact: 'Reduced carbon emissions and improved connectivity',
            submittedDate: '2024-08-22'
          },
          {
            id: 'req-005',
            department: 'Energy Department',
            title: 'Renewable Energy Research',
            amount: 12000000000,
            priority: 'medium',
            status: 'approved',
            justification: 'Advance renewable energy technologies and sustainability',
            expectedImpact: 'Accelerated transition to clean energy sources',
            submittedDate: '2024-08-10',
            reviewDate: '2024-08-20',
            approver: 'Dr. Elizabeth Rodriguez'
          }
        ],
        budgetAllocations: [
          {
            category: 'Defense & Security',
            amount: 850000000000,
            percentage: 35,
            change: 2.5,
            utilization: 84.7,
            description: 'Military, intelligence, and national security programs'
          },
          {
            category: 'Social Services',
            amount: 650000000000,
            percentage: 27,
            change: 1.8,
            utilization: 89.2,
            description: 'Healthcare, education, and social welfare programs'
          },
          {
            category: 'Infrastructure',
            amount: 450000000000,
            percentage: 18,
            change: 3.2,
            utilization: 82.9,
            description: 'Transportation, energy, and public works projects'
          },
          {
            category: 'Research & Development',
            amount: 280000000000,
            percentage: 11,
            change: 4.1,
            utilization: 78.6,
            description: 'Scientific research and technological innovation'
          },
          {
            category: 'Administration',
            amount: 220000000000,
            percentage: 9,
            change: 0.5,
            utilization: 91.5,
            description: 'Government operations and administrative costs'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasuryData();
  }, [fetchTreasuryData]);

  const renderOverview = () => (
    <>
      {/* Treasury Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Treasury Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Budget</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.finances?.totalBudget || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Total Spent</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.finances?.totalSpent || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Remaining</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.finances?.totalRemaining || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Utilization</span>
            <span className="standard-metric-value">{treasuryData?.finances?.budgetUtilization || 0}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Treasury Report')}>Generate Report</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('View Analytics')}>View Analytics</button>
        </div>
      </div>

      {/* Revenue Streams - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Revenue Streams</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Tax Revenue</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.revenue?.taxRevenue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Collection Efficiency</span>
            <span className="standard-metric-value">{treasuryData?.revenue?.collectionEfficiency || 0}%</span>
          </div>
          <div className="standard-metric">
            <span>Corporate Tax</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.revenue?.corporateTax || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Individual Tax</span>
            <span className="standard-metric-value">{formatCurrency(treasuryData?.revenue?.individualTax || 0)}</span>
          </div>
        </div>
      </div>

      {/* Treasury Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Treasury Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'Defense', value: (treasuryData?.departmentBudgets?.[0]?.allocated || 0) / 1000000000, color: '#fbbf24' },
                  { label: 'Health', value: (treasuryData?.departmentBudgets?.[1]?.allocated || 0) / 1000000000, color: '#f59e0b' },
                  { label: 'Education', value: (treasuryData?.departmentBudgets?.[2]?.allocated || 0) / 1000000000, color: '#d97706' },
                  { label: 'Transport', value: (treasuryData?.departmentBudgets?.[3]?.allocated || 0) / 1000000000, color: '#92400e' },
                  { label: 'Energy', value: (treasuryData?.departmentBudgets?.[4]?.allocated || 0) / 1000000000, color: '#78350f' }
                ]}
                title="💰 Department Budgets (Billions)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={treasuryData?.budgetAllocations?.map((allocation, index) => ({
                  label: allocation.category,
                  value: allocation.percentage,
                  color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'][index]
                })) || []}
                title="📊 Budget Allocation"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderRevenue = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Revenue Management</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Update Revenue Data')}>Update Data</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Analyze Trends')}>Analyze Trends</button>
        </div>
        
        {/* Tax Categories Table */}
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Tax Category</th>
                <th>Total Amount</th>
                <th>Collection Efficiency</th>
                <th>Trend</th>
                <th>Monthly Change</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {treasuryData?.revenue?.taxCategories?.map((category) => (
                <tr key={category.category}>
                  <td><strong>{category.name}</strong></td>
                  <td>{formatCurrency(category.totalAmount)}</td>
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
                          width: `${category.collectionEfficiency}%`, 
                          height: '100%', 
                          backgroundColor: '#fbbf24'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{category.collectionEfficiency}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getTrendColor(category.trend), 
                      color: 'white' 
                    }}>
                      {category.trend.charAt(0).toUpperCase() + category.trend.slice(1)}
                    </span>
                  </td>
                  <td style={{ color: category.monthlyChange >= 0 ? '#10b981' : '#ef4444' }}>
                    {category.monthlyChange >= 0 ? '+' : ''}{category.monthlyChange}%
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBudgets = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📋 Department Budgets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Allocate Budget')}>Allocate Budget</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Update Budgets')}>Update Budgets</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Allocated</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Utilization</th>
                <th>Priority</th>
                <th>Projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {treasuryData?.departmentBudgets?.map((budget) => (
                <tr key={budget.id}>
                  <td><strong>{budget.name}</strong></td>
                  <td>{formatCurrency(budget.allocated)}</td>
                  <td>{formatCurrency(budget.spent)}</td>
                  <td>{formatCurrency(budget.remaining)}</td>
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
                          width: `${budget.utilization}%`, 
                          height: '100%', 
                          backgroundColor: '#fbbf24'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{budget.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(budget.priority), 
                      color: 'white' 
                    }}>
                      {budget.priority.charAt(0).toUpperCase() + budget.priority.slice(1)}
                    </span>
                  </td>
                  <td>{budget.projects}</td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📝 Spending Requests</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Create Request')}>Create Request</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Review Requests')}>Review Requests</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {treasuryData?.spendingRequests?.map((request) => (
                <tr key={request.id}>
                  <td><strong>{request.department}</strong></td>
                  <td>{request.title}</td>
                  <td>{formatCurrency(request.amount)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getPriorityColor(request.priority), 
                      color: 'white' 
                    }}>
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(request.status), 
                      color: 'white' 
                    }}>
                      {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                    </span>
                  </td>
                  <td>{request.submittedDate}</td>
                  <td>
                    <button className="standard-btn economic-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Financial Analytics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Analytics')}>Generate Analytics</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Export Data')}>Export Data</button>
        </div>
        
        {/* Budget Allocations */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💰 Budget Allocations</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                  <th>Change</th>
                  <th>Utilization</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {treasuryData?.budgetAllocations?.map((allocation, i) => (
                  <tr key={i}>
                    <td><strong>{allocation.category}</strong></td>
                    <td>{formatCurrency(allocation.amount)}</td>
                    <td>{allocation.percentage}%</td>
                    <td style={{ color: allocation.change >= 0 ? '#10b981' : '#ef4444' }}>
                      {allocation.change >= 0 ? '+' : ''}{allocation.change}%
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
                            width: `${allocation.utilization}%`, 
                            height: '100%', 
                            backgroundColor: '#fbbf24'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem' }}>{allocation.utilization}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="standard-btn economic-theme">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      onRefresh={fetchTreasuryData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && treasuryData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'revenue' && renderRevenue()}
              {activeTab === 'budgets' && renderBudgets()}
              {activeTab === 'requests' && renderRequests()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading treasury data...' : 'No treasury data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default TreasuryScreen;
