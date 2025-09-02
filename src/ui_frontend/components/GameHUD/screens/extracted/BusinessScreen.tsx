import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './BusinessScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface Business {
  id: string;
  name: string;
  industry: string;
  type: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'closed';
  founded: string;
  employees: number;
  revenue: number;
  profit: number;
  growth: number;
  owner: {
    name: string;
    age: number;
    background: string;
    experience: number;
  };
  location: {
    city: string;
    district: string;
    address: string;
  };
  financials: {
    assets: number;
    liabilities: number;
    cashFlow: number;
    marketValue: number;
    funding: Array<{
      source: string;
      amount: number;
      date: string;
      type: 'loan' | 'investment' | 'grant';
    }>;
  };
  metrics: {
    customerSatisfaction: number;
    marketShare: number;
    efficiency: number;
    innovation: number;
    sustainability: number;
  };
  challenges: string[];
  opportunities: string[];
}

interface BusinessOpportunity {
  id: string;
  title: string;
  industry: string;
  type: 'market_gap' | 'technology' | 'regulatory' | 'demographic';
  description: string;
  marketSize: number;
  competition: 'low' | 'medium' | 'high';
  barriers: string[];
  requirements: {
    capital: number;
    skills: string[];
    timeline: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  potential: {
    revenue: number;
    employees: number;
    marketShare: number;
    roi: number;
  };
  trends: string[];
}

interface BusinessAnalytics {
  overview: {
    totalBusinesses: number;
    activeBusinesses: number;
    totalEmployees: number;
    totalRevenue: number;
    averageGrowth: number;
    newBusinesses: number;
    closedBusinesses: number;
  };
  industryBreakdown: Array<{
    industry: string;
    count: number;
    percentage: number;
    revenue: number;
    growth: number;
    employees: number;
  }>;
  sizeDistribution: Array<{
    size: string;
    count: number;
    percentage: number;
    avgRevenue: number;
    avgEmployees: number;
  }>;
  marketAnalysis: {
    competitiveness: number;
    innovation: number;
    sustainability: number;
    digitalAdoption: number;
    exportOrientation: number;
  };
  competitionAnalysis: {
    marketConcentration: number;
    competitiveIntensity: number;
    barrierToEntry: number;
    supplierPower: number;
    buyerPower: number;
  };
  trends: Array<{
    category: string;
    trend: string;
    impact: 'positive' | 'negative' | 'neutral';
    strength: number;
    timeframe: string;
  }>;
}

interface BusinessData {
  businesses: Business[];
  opportunities: BusinessOpportunity[];
  analytics: BusinessAnalytics;
}

const BusinessScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'opportunities' | 'creation' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'businesses', label: 'Businesses', icon: '🏢' },
    { id: 'opportunities', label: 'Opportunities', icon: '💡' },
    { id: 'creation', label: 'Creation', icon: '➕' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/businesses', description: 'Get all businesses' },
    { method: 'GET', path: '/api/businesses/opportunities', description: 'Get business opportunities' },
    { method: 'GET', path: '/api/businesses/analytics', description: 'Get business analytics' },
    { method: 'POST', path: '/api/businesses', description: 'Create new business' }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchBusinessData = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/businesses');
      if (response.ok) {
        const data = await response.json();
        setBusinessData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch business data:', err);
      // Use comprehensive mock data
      setBusinessData({
        businesses: [
          {
            id: 'biz-1',
            name: 'QuantumCafe Solutions',
            industry: 'Food Service',
            type: 'small',
            status: 'active',
            founded: '2392',
            employees: 45,
            revenue: 2800000,
            profit: 420000,
            growth: 15.2,
            owner: {
              name: 'Sarah Chen',
              age: 34,
              background: 'Former tech executive',
              experience: 12
            },
            location: {
              city: 'New Alexandria',
              district: 'Tech District',
              address: '123 Innovation Ave'
            },
            financials: {
              assets: 1800000,
              liabilities: 450000,
              cashFlow: 280000,
              marketValue: 3500000,
              funding: [
                {
                  source: 'Venture Capital',
                  amount: 500000,
                  date: '2392-03-15',
                  type: 'investment'
                }
              ]
            },
            metrics: {
              customerSatisfaction: 92,
              marketShare: 8.5,
              efficiency: 87,
              innovation: 78,
              sustainability: 85
            },
            challenges: ['Supply chain disruptions', 'Labor shortage'],
            opportunities: ['Expansion to new markets', 'Digital transformation']
          },
          {
            id: 'biz-2',
            name: 'Stellar Manufacturing Corp',
            industry: 'Manufacturing',
            type: 'large',
            status: 'active',
            founded: '2385',
            employees: 1250,
            revenue: 85000000,
            profit: 12500000,
            growth: 8.7,
            owner: {
              name: 'Marcus Rodriguez',
              age: 52,
              background: 'Industrial engineer',
              experience: 25
            },
            location: {
              city: 'Industrial Hub',
              district: 'Manufacturing Zone',
              address: '456 Factory Blvd'
            },
            financials: {
              assets: 65000000,
              liabilities: 28000000,
              cashFlow: 8500000,
              marketValue: 95000000,
              funding: [
                {
                  source: 'Bank Loan',
                  amount: 15000000,
                  date: '2390-06-20',
                  type: 'loan'
                }
              ]
            },
            metrics: {
              customerSatisfaction: 88,
              marketShare: 22.3,
              efficiency: 92,
              innovation: 65,
              sustainability: 78
            },
            challenges: ['Raw material costs', 'Regulatory compliance'],
            opportunities: ['Automation upgrade', 'Export expansion']
          },
          {
            id: 'biz-3',
            name: 'NovaTech Innovations',
            industry: 'Technology',
            type: 'startup',
            status: 'active',
            founded: '2393',
            employees: 12,
            revenue: 850000,
            profit: -150000,
            growth: 45.8,
            owner: {
              name: 'Alex Kim',
              age: 28,
              background: 'Software engineer',
              experience: 6
            },
            location: {
              city: 'Innovation City',
              district: 'Startup Hub',
              address: '789 Tech Street'
            },
            financials: {
              assets: 1200000,
              liabilities: 800000,
              cashFlow: -120000,
              marketValue: 5000000,
              funding: [
                {
                  source: 'Angel Investors',
                  amount: 2000000,
                  date: '2393-01-10',
                  type: 'investment'
                }
              ]
            },
            metrics: {
              customerSatisfaction: 95,
              marketShare: 2.1,
              efficiency: 75,
              innovation: 95,
              sustainability: 70
            },
            challenges: ['Cash flow management', 'Talent acquisition'],
            opportunities: ['Product launch', 'Series A funding']
          }
        ],
        opportunities: [
          {
            id: 'opp-1',
            title: 'Sustainable Energy Solutions',
            industry: 'Energy',
            type: 'technology',
            description: 'Development of next-generation renewable energy systems for space colonies',
            marketSize: 25000000000,
            competition: 'medium',
            barriers: ['High capital requirements', 'Regulatory approval', 'Technical expertise'],
            requirements: {
              capital: 5000000,
              skills: ['Engineering', 'Regulatory compliance', 'Project management'],
              timeline: '3-5 years',
              riskLevel: 'medium'
            },
            potential: {
              revenue: 15000000,
              employees: 85,
              marketShare: 12.5,
              roi: 200
            },
            trends: ['Green energy demand', 'Space colonization', 'Government incentives']
          },
          {
            id: 'opp-2',
            title: 'AI-Powered Healthcare Diagnostics',
            industry: 'Healthcare',
            type: 'technology',
            description: 'Advanced diagnostic tools using artificial intelligence for early disease detection',
            marketSize: 18000000000,
            competition: 'high',
            barriers: ['FDA approval', 'Clinical trials', 'Data privacy regulations'],
            requirements: {
              capital: 8000000,
              skills: ['AI/ML', 'Medical expertise', 'Regulatory affairs'],
              timeline: '4-6 years',
              riskLevel: 'high'
            },
            potential: {
              revenue: 25000000,
              employees: 120,
              marketShare: 8.3,
              roi: 180
            },
            trends: ['AI advancement', 'Healthcare digitization', 'Preventive medicine']
          },
          {
            id: 'opp-3',
            title: 'Space Tourism Services',
            industry: 'Tourism',
            type: 'market_gap',
            description: 'Luxury space travel experiences for high-net-worth individuals',
            marketSize: 8500000000,
            competition: 'low',
            barriers: ['Safety regulations', 'High operational costs', 'Limited infrastructure'],
            requirements: {
              capital: 15000000,
              skills: ['Aerospace engineering', 'Safety management', 'Luxury hospitality'],
              timeline: '5-7 years',
              riskLevel: 'high'
            },
            potential: {
              revenue: 35000000,
              employees: 200,
              marketShare: 25.0,
              roi: 150
            },
            trends: ['Space commercialization', 'Luxury travel growth', 'Technology advancement']
          }
        ],
        analytics: {
          overview: {
            totalBusinesses: 1247,
            activeBusinesses: 1189,
            totalEmployees: 45678,
            totalRevenue: 2850000000,
            averageGrowth: 12.3,
            newBusinesses: 89,
            closedBusinesses: 12
          },
          industryBreakdown: [
            {
              industry: 'Technology',
              count: 234,
              percentage: 18.8,
              revenue: 850000000,
              growth: 18.5,
              employees: 8920
            },
            {
              industry: 'Manufacturing',
              count: 189,
              percentage: 15.2,
              revenue: 650000000,
              growth: 8.7,
              employees: 12500
            },
            {
              industry: 'Food Service',
              count: 156,
              percentage: 12.5,
              revenue: 320000000,
              growth: 6.2,
              employees: 4200
            },
            {
              industry: 'Healthcare',
              count: 134,
              percentage: 10.7,
              revenue: 480000000,
              growth: 14.3,
              employees: 6800
            },
            {
              industry: 'Retail',
              count: 198,
              percentage: 15.9,
              revenue: 280000000,
              growth: 4.8,
              employees: 5200
            }
          ],
          sizeDistribution: [
            {
              size: 'Startup',
              count: 456,
              percentage: 36.6,
              avgRevenue: 850000,
              avgEmployees: 8
            },
            {
              size: 'Small',
              count: 389,
              percentage: 31.2,
              avgRevenue: 2800000,
              avgEmployees: 45
            },
            {
              size: 'Medium',
              count: 234,
              percentage: 18.8,
              avgRevenue: 12500000,
              avgEmployees: 180
            },
            {
              size: 'Large',
              count: 123,
              percentage: 9.9,
              avgRevenue: 85000000,
              avgEmployees: 850
            },
            {
              size: 'Enterprise',
              count: 45,
              percentage: 3.6,
              avgRevenue: 450000000,
              avgEmployees: 2500
            }
          ],
          marketAnalysis: {
            competitiveness: 7.2,
            innovation: 8.5,
            sustainability: 6.8,
            digitalAdoption: 8.9,
            exportOrientation: 5.4
          },
          competitionAnalysis: {
            marketConcentration: 6.8,
            competitiveIntensity: 7.5,
            barrierToEntry: 5.2,
            supplierPower: 6.1,
            buyerPower: 7.8
          },
          trends: [
            {
              category: 'Technology',
              trend: 'AI/ML Integration',
              impact: 'positive',
              strength: 8.5,
              timeframe: '2-3 years'
            },
            {
              category: 'Sustainability',
              trend: 'Green Business Practices',
              impact: 'positive',
              strength: 7.8,
              timeframe: '3-5 years'
            },
            {
              category: 'Workforce',
              trend: 'Remote Work Adoption',
              impact: 'neutral',
              strength: 6.2,
              timeframe: '1-2 years'
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  const renderOverview = () => (
    <>
      {/* Business Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Business Ecosystem Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Businesses</span>
            <span className="standard-metric-value">{businessData?.analytics.overview.totalBusinesses.toLocaleString()}</span>
          </div>
          <div className="standard-metric">
            <span>Active Businesses</span>
            <span className="standard-metric-value">{businessData?.analytics.overview.activeBusinesses.toLocaleString()}</span>
          </div>
          <div className="standard-metric">
            <span>Total Employees</span>
            <span className="standard-metric-value">{businessData?.analytics.overview.totalEmployees.toLocaleString()}</span>
          </div>
          <div className="standard-metric">
            <span>Total Revenue</span>
            <span className="standard-metric-value">{formatCurrency(businessData?.analytics.overview.totalRevenue || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Average Growth</span>
            <span className="standard-metric-value">{businessData?.analytics.overview.averageGrowth}%</span>
          </div>
          <div className="standard-metric">
            <span>New This Year</span>
            <span className="standard-metric-value">{businessData?.analytics.overview.newBusinesses}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Business Report')}>Generate Report</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Analysis')}>Market Analysis</button>
        </div>
      </div>

      {/* Industry Breakdown - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏭 Industry Breakdown</h3>
        <div className="standard-metric-grid">
          {businessData?.analytics.industryBreakdown?.slice(0, 4).map((industry, i) => (
            <div key={i} className="standard-metric">
              <span>{industry.industry}</span>
              <span className="standard-metric-value">
                {industry.count} ({industry.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Business Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Business Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={businessData?.analytics.industryBreakdown?.map((industry, index) => ({
                  label: industry.industry,
                  value: industry.revenue / 1000000,
                  color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'][index]
                })) || []}
                title="💰 Industry Revenue (Millions)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={businessData?.analytics.sizeDistribution?.map((size, index) => ({
                  label: size.size,
                  value: size.count,
                  color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f'][index]
                })) || []}
                title="📊 Business Size Distribution"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderBusinesses = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏢 Active Businesses</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Filter Businesses')}>Filter</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Export Data')}>Export</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Industry</th>
                <th>Type</th>
                <th>Employees</th>
                <th>Revenue</th>
                <th>Growth</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessData?.businesses?.map((business) => (
                <tr key={business.id}>
                  <td><strong>{business.name}</strong></td>
                  <td>{business.industry}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: '#fbbf24', 
                      color: 'white' 
                    }}>
                      {business.type.charAt(0).toUpperCase() + business.type.slice(1)}
                    </span>
                  </td>
                  <td>{business.employees.toLocaleString()}</td>
                  <td>{formatCurrency(business.revenue)}</td>
                  <td style={{ color: business.growth >= 0 ? '#10b981' : '#ef4444' }}>
                    {business.growth >= 0 ? '+' : ''}{business.growth}%
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(business.status), 
                      color: 'white' 
                    }}>
                      {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                    </span>
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

  const renderOpportunities = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>💡 Business Opportunities</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Scan Opportunities')}>Scan Opportunities</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Risk Analysis')}>Risk Analysis</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Industry</th>
                <th>Market Size</th>
                <th>Competition</th>
                <th>Capital Required</th>
                <th>Risk Level</th>
                <th>Potential ROI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessData?.opportunities?.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td><strong>{opportunity.title}</strong></td>
                  <td>{opportunity.industry}</td>
                  <td>{formatCurrency(opportunity.marketSize)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getCompetitionColor(opportunity.competition), 
                      color: 'white' 
                    }}>
                      {opportunity.competition.charAt(0).toUpperCase() + opportunity.competition.slice(1)}
                    </span>
                  </td>
                  <td>{formatCurrency(opportunity.requirements.capital)}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRiskColor(opportunity.requirements.riskLevel), 
                      color: 'white' 
                    }}>
                      {opportunity.requirements.riskLevel.charAt(0).toUpperCase() + opportunity.requirements.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>{opportunity.potential.roi}%</td>
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

  const renderCreation = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>➕ Business Creation</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Create Business')}>Create Business</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Business Plan')}>Business Plan</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Quick Start Options</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="standard-btn economic-theme" style={{ textAlign: 'left' }}>
                🚀 Startup Wizard - Guided business creation
              </button>
              <button className="standard-btn economic-theme" style={{ textAlign: 'left' }}>
                🏭 Manufacturing - Industrial business setup
              </button>
              <button className="standard-btn economic-theme" style={{ textAlign: 'left' }}>
                🍽️ Food Service - Restaurant and catering
              </button>
              <button className="standard-btn economic-theme" style={{ textAlign: 'left' }}>
                💻 Technology - Software and IT services
              </button>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Market Insights</h4>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ marginBottom: '0.5rem', color: '#fbbf24' }}><strong>Top Growing Industries:</strong></p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#a0a9ba' }}>
                <li>Technology: +18.5% growth</li>
                <li>Healthcare: +14.3% growth</li>
                <li>Manufacturing: +8.7% growth</li>
                <li>Food Service: +6.2% growth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Business Analytics</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Generate Analytics')}>Generate Analytics</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Export Report')}>Export Report</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Market Analysis</h4>
            <div className="standard-metric-grid">
              <div className="standard-metric">
                <span>Competitiveness</span>
                <span className="standard-metric-value">{businessData?.analytics.marketAnalysis.competitiveness}/10</span>
              </div>
              <div className="standard-metric">
                <span>Innovation</span>
                <span className="standard-metric-value">{businessData?.analytics.marketAnalysis.innovation}/10</span>
              </div>
              <div className="standard-metric">
                <span>Sustainability</span>
                <span className="standard-metric-value">{businessData?.analytics.marketAnalysis.sustainability}/10</span>
              </div>
              <div className="standard-metric">
                <span>Digital Adoption</span>
                <span className="standard-metric-value">{businessData?.analytics.marketAnalysis.digitalAdoption}/10</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Key Trends</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {businessData?.analytics.trends?.map((trend, index) => (
                <div key={index} style={{ 
                  padding: '0.5rem', 
                  background: 'rgba(251, 191, 36, 0.1)', 
                  borderRadius: '4px',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{trend.trend}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0a9ba' }}>
                    {trend.category} • {trend.timeframe} • Impact: {trend.impact}
                  </div>
                </div>
              ))}
            </div>
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
      onRefresh={fetchBusinessData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && businessData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'businesses' && renderBusinesses()}
              {activeTab === 'opportunities' && renderOpportunities()}
              {activeTab === 'creation' && renderCreation()}
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
              {loading ? 'Loading business data...' : 'No business data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default BusinessScreen;
