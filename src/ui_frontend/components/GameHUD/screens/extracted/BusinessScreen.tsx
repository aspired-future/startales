import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './BusinessScreen.css';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'small-business' | 'corporate' | 'opportunities' | 'creation' | 'analytics'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/businesses', description: 'Get all businesses' },
    { method: 'GET', path: '/api/businesses/:id', description: 'Get business details' },
    { method: 'GET', path: '/api/businesses/opportunities', description: 'Get business opportunities' },
    { method: 'GET', path: '/api/businesses/analytics', description: 'Get business analytics' },
    { method: 'POST', path: '/api/businesses', description: 'Create new business' },
    { method: 'PUT', path: '/api/businesses/:id', description: 'Update business' },
    { method: 'DELETE', path: '/api/businesses/:id', description: 'Close business' },
    { method: 'POST', path: '/api/businesses/simulate', description: 'Simulate market dynamics' }
  ];

  const fetchBusinessData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        businessesRes,
        opportunitiesRes,
        analyticsRes
      ] = await Promise.all([
        fetch('/api/businesses'),
        fetch('/api/businesses/opportunities'),
        fetch('/api/businesses/analytics')
      ]);

      const [
        businesses,
        opportunities,
        analytics
      ] = await Promise.all([
        businessesRes.json(),
        opportunitiesRes.json(),
        analyticsRes.json()
      ]);

      setBusinessData({
        businesses: businesses.businesses || generateMockBusinesses(),
        opportunities: opportunities.opportunities || generateMockOpportunities(),
        analytics: analytics.analytics || generateMockAnalytics()
      });
    } catch (err) {
      console.error('Failed to fetch business data:', err);
      // Use mock data as fallback
      setBusinessData({
        businesses: generateMockBusinesses(),
        opportunities: generateMockOpportunities(),
        analytics: generateMockAnalytics()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  const generateMockBusinesses = (): Business[] => [
    {
      id: 'biz-1',
      name: 'QuantumCafe Solutions',
      industry: 'food_service',
      type: 'small',
      status: 'active',
      founded: '2392',
      employees: 25,
      revenue: 2500000,
      profit: 375000,
      growth: 15.2,
      owner: {
        name: 'Maria Santos',
        age: 34,
        background: 'Former chef turned entrepreneur',
        experience: 8
      },
      location: {
        city: 'New Terra Capital',
        district: 'Business Quarter',
        address: '123 Innovation Street'
      },
      financials: {
        assets: 1200000,
        liabilities: 450000,
        cashFlow: 125000,
        marketValue: 3500000,
        funding: [
          { source: 'Small Business Loan', amount: 500000, date: '2392-03-15', type: 'loan' },
          { source: 'Angel Investment', amount: 250000, date: '2393-01-10', type: 'investment' }
        ]
      },
      metrics: {
        customerSatisfaction: 92,
        marketShare: 8.5,
        efficiency: 87,
        innovation: 78,
        sustainability: 85
      },
      challenges: ['Rising ingredient costs', 'Staff retention', 'Competition from chains'],
      opportunities: ['Expansion to Mars Colony', 'Catering contracts', 'Franchise model']
    },
    {
      id: 'biz-2',
      name: 'NeuralTech Consulting',
      industry: 'technology',
      type: 'medium',
      status: 'active',
      founded: '2390',
      employees: 85,
      revenue: 12500000,
      profit: 2250000,
      growth: 28.7,
      owner: {
        name: 'Dr. Alex Chen',
        age: 42,
        background: 'Former AI researcher at major tech corp',
        experience: 15
      },
      location: {
        city: 'New Terra Capital',
        district: 'Tech Hub',
        address: '456 Neural Avenue'
      },
      financials: {
        assets: 8500000,
        liabilities: 2100000,
        cashFlow: 850000,
        marketValue: 25000000,
        funding: [
          { source: 'Series A', amount: 5000000, date: '2391-06-20', type: 'investment' },
          { source: 'Government Grant', amount: 750000, date: '2392-09-05', type: 'grant' }
        ]
      },
      metrics: {
        customerSatisfaction: 95,
        marketShare: 15.2,
        efficiency: 91,
        innovation: 96,
        sustainability: 82
      },
      challenges: ['Talent acquisition', 'Rapid scaling', 'Technology obsolescence'],
      opportunities: ['Government contracts', 'International expansion', 'IPO potential']
    },
    {
      id: 'biz-3',
      name: 'GreenSpace Retail',
      industry: 'retail',
      type: 'small',
      status: 'active',
      founded: '2391',
      employees: 18,
      revenue: 1800000,
      profit: 180000,
      growth: 8.3,
      owner: {
        name: 'Sarah Kim',
        age: 29,
        background: 'Environmental science graduate',
        experience: 5
      },
      location: {
        city: 'Mars Industrial Complex',
        district: 'Commercial Zone',
        address: '789 Eco Boulevard'
      },
      financials: {
        assets: 650000,
        liabilities: 280000,
        cashFlow: 45000,
        marketValue: 1200000,
        funding: [
          { source: 'Personal Savings', amount: 150000, date: '2391-01-01', type: 'investment' },
          { source: 'Green Business Grant', amount: 100000, date: '2391-08-15', type: 'grant' }
        ]
      },
      metrics: {
        customerSatisfaction: 88,
        marketShare: 12.1,
        efficiency: 79,
        innovation: 72,
        sustainability: 94
      },
      challenges: ['Supply chain logistics', 'Limited customer base', 'Seasonal variations'],
      opportunities: ['Online expansion', 'B2B partnerships', 'Sustainable product lines']
    }
  ];

  const generateMockOpportunities = (): BusinessOpportunity[] => [
    {
      id: 'opp-1',
      title: 'Quantum Food Processing',
      industry: 'food_service',
      type: 'technology',
      description: 'Revolutionary food processing using quantum technology to enhance nutrition and taste',
      marketSize: 50000000000,
      competition: 'low',
      barriers: ['High technology costs', 'Regulatory approval', 'Consumer acceptance'],
      requirements: {
        capital: 5000000,
        skills: ['Quantum Physics', 'Food Science', 'Business Management'],
        timeline: '18-24 months',
        riskLevel: 'high'
      },
      potential: {
        revenue: 25000000,
        employees: 150,
        marketShare: 15,
        roi: 400
      },
      trends: ['Health consciousness', 'Technology adoption', 'Sustainable food']
    },
    {
      id: 'opp-2',
      title: 'AI-Powered Personal Shopping',
      industry: 'retail',
      type: 'technology',
      description: 'Personalized shopping assistant using advanced AI to predict and fulfill customer needs',
      marketSize: 25000000000,
      competition: 'medium',
      barriers: ['AI development costs', 'Data privacy concerns', 'Market saturation'],
      requirements: {
        capital: 2500000,
        skills: ['AI/ML', 'Retail Experience', 'Data Analytics'],
        timeline: '12-18 months',
        riskLevel: 'medium'
      },
      potential: {
        revenue: 15000000,
        employees: 75,
        marketShare: 8,
        roi: 250
      },
      trends: ['Personalization demand', 'AI adoption', 'E-commerce growth']
    },
    {
      id: 'opp-3',
      title: 'Interplanetary Logistics Hub',
      industry: 'transportation',
      type: 'market_gap',
      description: 'Specialized logistics service for interplanetary trade and commerce',
      marketSize: 75000000000,
      competition: 'low',
      barriers: ['Infrastructure requirements', 'Regulatory complexity', 'High capital needs'],
      requirements: {
        capital: 15000000,
        skills: ['Logistics Management', 'Space Operations', 'International Trade'],
        timeline: '24-36 months',
        riskLevel: 'high'
      },
      potential: {
        revenue: 45000000,
        employees: 300,
        marketShare: 25,
        roi: 180
      },
      trends: ['Interplanetary trade growth', 'Space colonization', 'Supply chain optimization']
    }
  ];

  const generateMockAnalytics = (): BusinessAnalytics => ({
    overview: {
      totalBusinesses: 15847,
      activeBusinesses: 14523,
      totalEmployees: 2850000,
      totalRevenue: 485000000000,
      averageGrowth: 12.8,
      newBusinesses: 1250,
      closedBusinesses: 324
    },
    industryBreakdown: [
      { industry: 'Technology', count: 3250, percentage: 20.5, revenue: 125000000000, growth: 18.5, employees: 650000 },
      { industry: 'Professional Services', count: 2890, percentage: 18.2, revenue: 95000000000, growth: 8.2, employees: 485000 },
      { industry: 'Retail', count: 2650, percentage: 16.7, revenue: 85000000000, growth: 6.8, employees: 520000 },
      { industry: 'Healthcare', count: 1980, percentage: 12.5, revenue: 75000000000, growth: 12.1, employees: 380000 },
      { industry: 'Food Service', count: 1850, percentage: 11.7, revenue: 45000000000, growth: 9.5, employees: 425000 },
      { industry: 'Manufacturing', count: 1580, percentage: 10.0, revenue: 65000000000, growth: 4.2, employees: 285000 },
      { industry: 'Other', count: 1647, percentage: 10.4, revenue: 35000000000, growth: 7.8, employees: 105000 }
    ],
    sizeDistribution: [
      { size: 'Startup', count: 4250, percentage: 26.8, avgRevenue: 250000, avgEmployees: 5 },
      { size: 'Small', count: 6890, percentage: 43.5, avgRevenue: 1500000, avgEmployees: 15 },
      { size: 'Medium', count: 3420, percentage: 21.6, avgRevenue: 8500000, avgEmployees: 85 },
      { size: 'Large', count: 1050, percentage: 6.6, avgRevenue: 45000000, avgEmployees: 350 },
      { size: 'Enterprise', count: 237, percentage: 1.5, avgRevenue: 250000000, avgEmployees: 1200 }
    ],
    marketAnalysis: {
      competitiveness: 78,
      innovation: 85,
      sustainability: 72,
      digitalAdoption: 89,
      exportOrientation: 65
    },
    competitionAnalysis: {
      marketConcentration: 35,
      competitiveIntensity: 72,
      barrierToEntry: 45,
      supplierPower: 38,
      buyerPower: 52
    },
    trends: [
      { category: 'Technology', trend: 'AI Integration Acceleration', impact: 'positive', strength: 8.5, timeframe: '6-12 months' },
      { category: 'Sustainability', trend: 'Green Business Practices', impact: 'positive', strength: 7.2, timeframe: '12-24 months' },
      { category: 'Workforce', trend: 'Remote Work Adoption', impact: 'neutral', strength: 6.8, timeframe: 'Ongoing' },
      { category: 'Regulation', trend: 'Digital Privacy Laws', impact: 'negative', strength: 5.5, timeframe: '3-6 months' }
    ]
  });

  const formatNumber = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number): string => {
    return `$${formatNumber(value)}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getGrowthColor = (growth: number): string => {
    if (growth >= 15) return '#10b981';
    if (growth >= 5) return '#3b82f6';
    if (growth >= 0) return '#f59e0b';
    return '#ef4444';
  };

  const getCompetitionColor = (competition: string): string => {
    switch (competition) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getFilteredBusinesses = (): Business[] => {
    if (!businessData) return [];
    if (!selectedIndustry) return businessData.businesses;
    return businessData.businesses.filter(business => business.industry === selectedIndustry);
  };

  const handleCreateBusiness = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchBusinessData();
    } catch (err) {
      setError('Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchBusinessData}
    >
      <div className="business-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'small-business' ? 'active' : ''}`}
            onClick={() => setActiveTab('small-business')}
          >
            🏪 Small Business
          </button>
          <button 
            className={`tab ${activeTab === 'corporate' ? 'active' : ''}`}
            onClick={() => setActiveTab('corporate')}
          >
            🏢 Corporate
          </button>
          <button 
            className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            💡 Opportunities
          </button>
          <button 
            className={`tab ${activeTab === 'creation' ? 'active' : ''}`}
            onClick={() => setActiveTab('creation')}
          >
            🚀 Creation
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading business data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && businessData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">🏢</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.overview.totalBusinesses)}</div>
                        <div className="metric-label">Total Businesses</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">✅</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.overview.activeBusinesses)}</div>
                        <div className="metric-label">Active Businesses</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">👥</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.overview.totalEmployees)}</div>
                        <div className="metric-label">Total Employees</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">💰</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatCurrency(businessData.analytics.overview.totalRevenue)}</div>
                        <div className="metric-label">Annual Revenue</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📈</div>
                      <div className="metric-info">
                        <div className="metric-value">{businessData.analytics.overview.averageGrowth.toFixed(1)}%</div>
                        <div className="metric-label">Average Growth</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">🆕</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.overview.newBusinesses)}</div>
                        <div className="metric-label">New This Year</div>
                      </div>
                    </div>
                  </div>

                  <div className="industry-breakdown">
                    <h4>🏭 Industry Breakdown</h4>
                    <div className="industry-grid">
                      {businessData.analytics.industryBreakdown.map((industry, i) => (
                        <div key={i} className="industry-card">
                          <div className="industry-header">
                            <div className="industry-name">{industry.industry}</div>
                            <div className="industry-percentage">{industry.percentage.toFixed(1)}%</div>
                          </div>
                          <div className="industry-metrics">
                            <div className="industry-metric">
                              <span className="metric-label">Businesses:</span>
                              <span className="metric-value">{formatNumber(industry.count)}</span>
                            </div>
                            <div className="industry-metric">
                              <span className="metric-label">Revenue:</span>
                              <span className="metric-value">{formatCurrency(industry.revenue)}</span>
                            </div>
                            <div className="industry-metric">
                              <span className="metric-label">Growth:</span>
                              <span className="metric-value" style={{ color: getGrowthColor(industry.growth) }}>
                                {industry.growth.toFixed(1)}%
                              </span>
                            </div>
                            <div className="industry-metric">
                              <span className="metric-label">Employees:</span>
                              <span className="metric-value">{formatNumber(industry.employees)}</span>
                            </div>
                          </div>
                          <div className="industry-bar">
                            <div className="industry-fill" style={{ width: `${industry.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'small-business' && (
                <div className="small-business-tab">
                  <div className="small-business-controls">
                    <div className="filter-group">
                      <label htmlFor="smallBizFilter">Small Business Filter:</label>
                      <select 
                        id="smallBizFilter" 
                        value={selectedIndustry} 
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="industry-select"
                      >
                        <option value="">All Industries</option>
                        <option value="technology">Technology</option>
                        <option value="food_service">Food Service</option>
                        <option value="professional_services">Professional Services</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="retail">Retail</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>
                    <div className="results-count">
                      Showing {getFilteredBusinesses().filter(b => ['startup', 'small'].includes(b.type)).length} small businesses
                    </div>
                  </div>

                  <div className="small-business-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">🏪</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.sizeDistribution.find(s => s.size === 'Small')?.count || 0)}</div>
                        <div className="metric-label">Small Businesses</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">🚀</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber(businessData.analytics.sizeDistribution.find(s => s.size === 'Startup')?.count || 0)}</div>
                        <div className="metric-label">Startups</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">💼</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatNumber((businessData.analytics.sizeDistribution.find(s => s.size === 'Small')?.avgEmployees || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Small')?.count || 0))}</div>
                        <div className="metric-label">Total Jobs</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">💰</div>
                      <div className="metric-info">
                        <div className="metric-value">{formatCurrency((businessData.analytics.sizeDistribution.find(s => s.size === 'Small')?.avgRevenue || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Small')?.count || 0))}</div>
                        <div className="metric-label">Combined Revenue</div>
                      </div>
                    </div>
                  </div>

                  <div className="small-business-programs">
                    <h4>🎯 Small Business Programs</h4>
                    <div className="programs-grid">
                      <div className="program-card">
                        <div className="program-icon">💳</div>
                        <div className="program-title">Micro-Loans Program</div>
                        <div className="program-description">Low-interest loans up to $50K for startups and small businesses</div>
                        <div className="program-stats">
                          <div className="stat-item">
                            <span className="stat-label">Active Loans:</span>
                            <span className="stat-value">1,247</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total Disbursed:</span>
                            <span className="stat-value">$45.2M</span>
                          </div>
                        </div>
                        <button className="program-action">Apply Now</button>
                      </div>
                      <div className="program-card">
                        <div className="program-icon">🎓</div>
                        <div className="program-title">Business Mentorship</div>
                        <div className="program-description">Free mentorship and training programs for new entrepreneurs</div>
                        <div className="program-stats">
                          <div className="stat-item">
                            <span className="stat-label">Active Mentees:</span>
                            <span className="stat-value">892</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Success Rate:</span>
                            <span className="stat-value">78%</span>
                          </div>
                        </div>
                        <button className="program-action">Join Program</button>
                      </div>
                      <div className="program-card">
                        <div className="program-icon">🏆</div>
                        <div className="program-title">Innovation Grants</div>
                        <div className="program-description">Grants for innovative small businesses in emerging technologies</div>
                        <div className="program-stats">
                          <div className="stat-item">
                            <span className="stat-label">Grants Awarded:</span>
                            <span className="stat-value">156</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total Funding:</span>
                            <span className="stat-value">$12.8M</span>
                          </div>
                        </div>
                        <button className="program-action">Apply</button>
                      </div>
                    </div>
                  </div>

                  <div className="small-businesses-grid">
                    {getFilteredBusinesses().filter(b => ['startup', 'small'].includes(b.type)).map((business) => (
                      <div key={business.id} className="business-card small-business">
                        <div className="business-header">
                          <div className="business-name">{business.name}</div>
                          <div className={`business-type ${business.type}`}>
                            {business.type.charAt(0).toUpperCase() + business.type.slice(1)}
                          </div>
                        </div>
                        <div className="business-industry">{business.industry.replace('_', ' ').toUpperCase()}</div>
                        <div className="business-details">
                          <div className="business-detail">
                            <span className="detail-label">Founded:</span>
                            <span className="detail-value">{business.founded}</span>
                          </div>
                          <div className="business-detail">
                            <span className="detail-label">Employees:</span>
                            <span className="detail-value">{formatNumber(business.employees)}</span>
                          </div>
                          <div className="business-detail">
                            <span className="detail-label">Revenue:</span>
                            <span className="detail-value">{formatCurrency(business.revenue)}</span>
                          </div>
                          <div className="business-detail">
                            <span className="detail-label">Growth:</span>
                            <span className="detail-value" style={{ color: getGrowthColor(business.growth) }}>
                              {business.growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="business-owner">
                          <strong>Owner:</strong> {business.owner.name} ({business.owner.age})
                        </div>
                        <div className="business-challenges">
                          <strong>Key Challenges:</strong>
                          <div className="challenges-list">
                            {business.challenges.slice(0, 2).map((challenge, i) => (
                              <span key={i} className="challenge-tag">{challenge}</span>
                            ))}
                          </div>
                        </div>
                        <div className="business-support">
                          <button className="support-btn">💡 Provide Support</button>
                          <button className="support-btn">📊 View Analytics</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Small Business Directory</button>
                    <button className="action-btn secondary">Export Report</button>
                    <button className="action-btn">Launch Support Program</button>
                  </div>
                </div>
              )}

              {activeTab === 'corporate' && (
                <div className="corporate-tab">
                  <div className="corporate-overview">
                    <h4>🏢 Corporate Sector Overview</h4>
                    <div className="corporate-metrics">
                      <div className="metric-card">
                        <div className="metric-icon">🏭</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatNumber((businessData.analytics.sizeDistribution.find(s => s.size === 'Large')?.count || 0) + (businessData.analytics.sizeDistribution.find(s => s.size === 'Enterprise')?.count || 0))}</div>
                          <div className="metric-label">Large Corporations</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatNumber(((businessData.analytics.sizeDistribution.find(s => s.size === 'Large')?.avgEmployees || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Large')?.count || 0)) + ((businessData.analytics.sizeDistribution.find(s => s.size === 'Enterprise')?.avgEmployees || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Enterprise')?.count || 0)))}</div>
                          <div className="metric-label">Corporate Jobs</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">💼</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatCurrency(((businessData.analytics.sizeDistribution.find(s => s.size === 'Large')?.avgRevenue || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Large')?.count || 0)) + ((businessData.analytics.sizeDistribution.find(s => s.size === 'Enterprise')?.avgRevenue || 0) * (businessData.analytics.sizeDistribution.find(s => s.size === 'Enterprise')?.count || 0)))}</div>
                          <div className="metric-label">Corporate Revenue</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🌍</div>
                        <div className="metric-info">
                          <div className="metric-value">{businessData.analytics.marketAnalysis.exportOrientation}%</div>
                          <div className="metric-label">Export Orientation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="corporate-governance">
                    <h4>⚖️ Corporate Governance & Compliance</h4>
                    <div className="governance-panels">
                      <div className="governance-panel">
                        <div className="panel-header">
                          <div className="panel-icon">📋</div>
                          <div className="panel-title">Regulatory Compliance</div>
                        </div>
                        <div className="compliance-metrics">
                          <div className="compliance-item">
                            <span className="compliance-label">Tax Compliance:</span>
                            <span className="compliance-value good">94.2%</span>
                          </div>
                          <div className="compliance-item">
                            <span className="compliance-label">Environmental Standards:</span>
                            <span className="compliance-value warning">87.5%</span>
                          </div>
                          <div className="compliance-item">
                            <span className="compliance-label">Labor Standards:</span>
                            <span className="compliance-value good">96.8%</span>
                          </div>
                          <div className="compliance-item">
                            <span className="compliance-label">Financial Reporting:</span>
                            <span className="compliance-value good">98.1%</span>
                          </div>
                        </div>
                        <button className="panel-action">View Compliance Report</button>
                      </div>
                      <div className="governance-panel">
                        <div className="panel-header">
                          <div className="panel-icon">🛡️</div>
                          <div className="panel-title">Corporate Ethics</div>
                        </div>
                        <div className="ethics-metrics">
                          <div className="ethics-item">
                            <span className="ethics-label">Ethics Training:</span>
                            <span className="ethics-value">89% Completed</span>
                          </div>
                          <div className="ethics-item">
                            <span className="ethics-label">Whistleblower Reports:</span>
                            <span className="ethics-value">23 Active</span>
                          </div>
                          <div className="ethics-item">
                            <span className="ethics-label">Code Violations:</span>
                            <span className="ethics-value">12 This Quarter</span>
                          </div>
                        </div>
                        <button className="panel-action">Ethics Dashboard</button>
                      </div>
                    </div>
                  </div>

                  <div className="corporate-performance">
                    <h4>📈 Corporate Performance Monitoring</h4>
                    <div className="performance-grid">
                      {getFilteredBusinesses().filter(b => ['large', 'enterprise'].includes(b.type)).map((business) => (
                        <div key={business.id} className="corporate-card">
                          <div className="corporate-header">
                            <div className="corporate-name">{business.name}</div>
                            <div className={`corporate-type ${business.type}`}>
                              {business.type.charAt(0).toUpperCase() + business.type.slice(1)}
                            </div>
                          </div>
                          <div className="corporate-industry">{business.industry.replace('_', ' ').toUpperCase()}</div>
                          <div className="corporate-kpis">
                            <div className="kpi-item">
                              <span className="kpi-label">Market Cap:</span>
                              <span className="kpi-value">{formatCurrency(business.financials.marketValue)}</span>
                            </div>
                            <div className="kpi-item">
                              <span className="kpi-label">Employees:</span>
                              <span className="kpi-value">{formatNumber(business.employees)}</span>
                            </div>
                            <div className="kpi-item">
                              <span className="kpi-label">Revenue:</span>
                              <span className="kpi-value">{formatCurrency(business.revenue)}</span>
                            </div>
                            <div className="kpi-item">
                              <span className="kpi-label">Profit Margin:</span>
                              <span className="kpi-value">{((business.profit / business.revenue) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="corporate-performance-indicators">
                            <div className="performance-indicator">
                              <span className="indicator-label">Innovation:</span>
                              <div className="indicator-bar">
                                <div className="indicator-fill" style={{ width: `${business.metrics.innovation}%` }}></div>
                              </div>
                              <span className="indicator-value">{business.metrics.innovation}%</span>
                            </div>
                            <div className="performance-indicator">
                              <span className="indicator-label">Sustainability:</span>
                              <div className="indicator-bar">
                                <div className="indicator-fill" style={{ width: `${business.metrics.sustainability}%` }}></div>
                              </div>
                              <span className="indicator-value">{business.metrics.sustainability}%</span>
                            </div>
                            <div className="performance-indicator">
                              <span className="indicator-label">Efficiency:</span>
                              <div className="indicator-bar">
                                <div className="indicator-fill" style={{ width: `${business.metrics.efficiency}%` }}></div>
                              </div>
                              <span className="indicator-value">{business.metrics.efficiency}%</span>
                            </div>
                          </div>
                          <div className="corporate-actions">
                            <button className="corporate-btn">📊 Full Report</button>
                            <button className="corporate-btn">🔍 Audit</button>
                            <button className="corporate-btn">⚖️ Compliance</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Corporate Registry</button>
                    <button className="action-btn secondary">Compliance Report</button>
                    <button className="action-btn">Market Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'opportunities' && (
                <div className="opportunities-tab">
                  <div className="opportunities-grid">
                    {businessData.opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="opportunity-card">
                        <div className="opportunity-header">
                          <div className="opportunity-title">{opportunity.title}</div>
                          <div className="opportunity-type">{opportunity.type.replace('_', ' ').toUpperCase()}</div>
                        </div>
                        <div className="opportunity-industry">{opportunity.industry.replace('_', ' ').toUpperCase()}</div>
                        <div className="opportunity-description">{opportunity.description}</div>
                        
                        <div className="opportunity-metrics">
                          <div className="opp-metric">
                            <span className="metric-label">Market Size:</span>
                            <span className="metric-value">{formatCurrency(opportunity.marketSize)}</span>
                          </div>
                          <div className="opp-metric">
                            <span className="metric-label">Competition:</span>
                            <span className="metric-value" style={{ color: getCompetitionColor(opportunity.competition) }}>
                              {opportunity.competition.charAt(0).toUpperCase() + opportunity.competition.slice(1)}
                            </span>
                          </div>
                          <div className="opp-metric">
                            <span className="metric-label">Required Capital:</span>
                            <span className="metric-value">{formatCurrency(opportunity.requirements.capital)}</span>
                          </div>
                          <div className="opp-metric">
                            <span className="metric-label">Risk Level:</span>
                            <span className="metric-value" style={{ color: getRiskColor(opportunity.requirements.riskLevel) }}>
                              {opportunity.requirements.riskLevel.charAt(0).toUpperCase() + opportunity.requirements.riskLevel.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="opportunity-potential">
                          <h5>💰 Revenue Potential</h5>
                          <div className="potential-metrics">
                            <div className="potential-metric">
                              <span className="metric-label">Revenue:</span>
                              <span className="metric-value">{formatCurrency(opportunity.potential.revenue)}</span>
                            </div>
                            <div className="potential-metric">
                              <span className="metric-label">Employees:</span>
                              <span className="metric-value">{formatNumber(opportunity.potential.employees)}</span>
                            </div>
                            <div className="potential-metric">
                              <span className="metric-label">ROI:</span>
                              <span className="metric-value">{opportunity.potential.roi}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="opportunity-requirements">
                          <h5>📋 Requirements</h5>
                          <div className="req-timeline">Timeline: {opportunity.requirements.timeline}</div>
                          <div className="req-skills">
                            <strong>Skills:</strong>
                            <div className="skills-list">
                              {opportunity.requirements.skills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="opportunity-barriers">
                          <h5>🚧 Barriers</h5>
                          <div className="barriers-list">
                            {opportunity.barriers.map((barrier, i) => (
                              <div key={i} className="barrier-item">{barrier}</div>
                            ))}
                          </div>
                        </div>

                        <div className="opportunity-trends">
                          <h5>📈 Market Trends</h5>
                          <div className="trends-list">
                            {opportunity.trends.map((trend, i) => (
                              <span key={i} className="trend-tag">{trend}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Evaluate Opportunity</button>
                    <button className="action-btn secondary">Market Research</button>
                    <button className="action-btn">Feasibility Study</button>
                  </div>
                </div>
              )}

              {activeTab === 'creation' && (
                <div className="creation-tab">
                  <div className="creation-wizard">
                    <h4>🚀 Business Creation Wizard</h4>
                    <div className="wizard-steps">
                      <div className="step-item active">
                        <div className="step-number">1</div>
                        <div className="step-label">Business Concept</div>
                      </div>
                      <div className="step-item">
                        <div className="step-number">2</div>
                        <div className="step-label">Market Analysis</div>
                      </div>
                      <div className="step-item">
                        <div className="step-number">3</div>
                        <div className="step-label">Financial Planning</div>
                      </div>
                      <div className="step-item">
                        <div className="step-number">4</div>
                        <div className="step-label">Launch Strategy</div>
                      </div>
                    </div>
                  </div>

                  <div className="creation-form">
                    <div className="form-section">
                      <h5>💡 Business Concept</h5>
                      <div className="form-group">
                        <label>Business Name:</label>
                        <input type="text" className="form-input" placeholder="Enter business name..." />
                      </div>
                      <div className="form-group">
                        <label>Industry:</label>
                        <select className="form-select">
                          <option value="">Select industry...</option>
                          <option value="technology">Technology</option>
                          <option value="food_service">Food Service</option>
                          <option value="retail">Retail</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="manufacturing">Manufacturing</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Business Type:</label>
                        <select className="form-select">
                          <option value="">Select type...</option>
                          <option value="startup">Startup</option>
                          <option value="small">Small Business</option>
                          <option value="medium">Medium Enterprise</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Description:</label>
                        <textarea className="form-textarea" placeholder="Describe your business concept..."></textarea>
                      </div>
                    </div>

                    <div className="form-section">
                      <h5>👤 Owner Information</h5>
                      <div className="form-group">
                        <label>Owner Name:</label>
                        <input type="text" className="form-input" placeholder="Enter owner name..." />
                      </div>
                      <div className="form-group">
                        <label>Background:</label>
                        <input type="text" className="form-input" placeholder="Professional background..." />
                      </div>
                      <div className="form-group">
                        <label>Experience (years):</label>
                        <input type="number" className="form-input" placeholder="Years of experience..." />
                      </div>
                    </div>

                    <div className="form-section">
                      <h5>💰 Initial Funding</h5>
                      <div className="form-group">
                        <label>Initial Capital:</label>
                        <input type="number" className="form-input" placeholder="Starting capital amount..." />
                      </div>
                      <div className="form-group">
                        <label>Funding Source:</label>
                        <select className="form-select">
                          <option value="">Select source...</option>
                          <option value="personal">Personal Savings</option>
                          <option value="loan">Business Loan</option>
                          <option value="investment">Angel Investment</option>
                          <option value="grant">Government Grant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn" onClick={handleCreateBusiness}>Create Business</button>
                    <button className="action-btn secondary">Save Draft</button>
                    <button className="action-btn">Business Plan Template</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-sections">
                    <div className="analytics-section">
                      <h4>📊 Market Analysis</h4>
                      <div className="market-metrics">
                        {Object.entries(businessData.analytics.marketAnalysis).map(([metric, value]) => (
                          <div key={metric} className="market-metric">
                            <div className="market-name">
                              {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="market-value">{value}/100</div>
                            <div className="market-bar">
                              <div className="market-fill" style={{ width: `${value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h4>⚔️ Competition Analysis</h4>
                      <div className="competition-metrics">
                        {Object.entries(businessData.analytics.competitionAnalysis).map(([metric, value]) => (
                          <div key={metric} className="competition-metric">
                            <div className="competition-name">
                              {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </div>
                            <div className="competition-value">{value}/100</div>
                            <div className="competition-bar">
                              <div className="competition-fill" style={{ width: `${value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h4>📏 Size Distribution</h4>
                      <div className="size-distribution">
                        {businessData.analytics.sizeDistribution.map((size, i) => (
                          <div key={i} className="size-item">
                            <div className="size-header">
                              <div className="size-name">{size.size}</div>
                              <div className="size-percentage">{size.percentage.toFixed(1)}%</div>
                            </div>
                            <div className="size-metrics">
                              <div className="size-metric">
                                <span className="metric-label">Count:</span>
                                <span className="metric-value">{formatNumber(size.count)}</span>
                              </div>
                              <div className="size-metric">
                                <span className="metric-label">Avg Revenue:</span>
                                <span className="metric-value">{formatCurrency(size.avgRevenue)}</span>
                              </div>
                              <div className="size-metric">
                                <span className="metric-label">Avg Employees:</span>
                                <span className="metric-value">{formatNumber(size.avgEmployees)}</span>
                              </div>
                            </div>
                            <div className="size-bar">
                              <div className="size-fill" style={{ width: `${size.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h4>📈 Market Trends</h4>
                      <div className="trends-list">
                        {businessData.analytics.trends.map((trend, i) => (
                          <div key={i} className="trend-item">
                            <div className="trend-header">
                              <div className="trend-category">{trend.category}</div>
                              <div className="trend-impact" style={{ color: getImpactColor(trend.impact) }}>
                                {trend.impact.toUpperCase()}
                              </div>
                            </div>
                            <div className="trend-title">{trend.trend}</div>
                            <div className="trend-details">
                              <div className="trend-strength">Strength: {trend.strength}/10</div>
                              <div className="trend-timeframe">Timeframe: {trend.timeframe}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Market Forecast</button>
                    <button className="action-btn">Trend Analysis</button>
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

export default BusinessScreen;
