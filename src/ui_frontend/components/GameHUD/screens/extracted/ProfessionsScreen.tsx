import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './ProfessionsScreen.css';

interface Profession {
  id: string;
  name: string;
  category: string;
  level: 'entry' | 'mid' | 'senior' | 'executive';
  description: string;
  requirements: {
    education: string;
    experience: number;
    skills: string[];
    certifications: string[];
  };
  compensation: {
    baseSalary: number;
    bonuses: number;
    benefits: string[];
    totalPackage: number;
  };
  marketData: {
    demand: number;
    supply: number;
    openPositions: number;
    avgTimeToFill: number;
    growthRate: number;
    competitiveness: number;
  };
  workConditions: {
    hoursPerWeek: number;
    flexibility: 'low' | 'medium' | 'high';
    remoteOptions: boolean;
    travelRequired: number;
    stressLevel: number;
    jobSecurity: number;
  };
  careerPath: {
    entryPoints: string[];
    advancement: string[];
    lateralMoves: string[];
    exitOpportunities: string[];
  };
  industries: string[];
  locations: Array<{
    city: string;
    positions: number;
    avgSalary: number;
    demandLevel: 'low' | 'medium' | 'high';
  }>;
}

interface UnemploymentData {
  overall: {
    rate: number;
    total: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    duration: number;
  };
  byCategory: Array<{
    category: string;
    rate: number;
    count: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  byEducation: Array<{
    level: string;
    rate: number;
    count: number;
  }>;
  byAge: Array<{
    range: string;
    rate: number;
    count: number;
  }>;
  reasons: Array<{
    reason: string;
    percentage: number;
    count: number;
  }>;
  support: {
    programs: number;
    participants: number;
    successRate: number;
    avgDuration: number;
  };
}

interface LaborMarketData {
  overview: {
    totalEmployed: number;
    totalUnemployed: number;
    laborForce: number;
    participationRate: number;
    employmentRate: number;
    openPositions: number;
    avgTimeToFill: number;
    marketHealth: number;
  };
  trends: Array<{
    period: string;
    employed: number;
    unemployed: number;
    openPositions: number;
    newHires: number;
  }>;
  sectors: Array<{
    name: string;
    employed: number;
    growth: number;
    avgSalary: number;
    openings: number;
  }>;
  skills: Array<{
    skill: string;
    demand: number;
    supply: number;
    gap: number;
    growthRate: number;
  }>;
}

interface CareerSimulation {
  scenarios: Array<{
    id: string;
    name: string;
    startingProfession: string;
    targetProfession: string;
    timeline: number;
    steps: Array<{
      step: number;
      action: string;
      duration: number;
      cost: number;
      outcome: string;
    }>;
    requirements: {
      education: string[];
      skills: string[];
      experience: number;
      investment: number;
    };
    outcomes: {
      salaryIncrease: number;
      jobSecurity: number;
      satisfaction: number;
      successProbability: number;
    };
  }>;
  recommendations: Array<{
    profession: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
  }>;
}

interface ProfessionsData {
  professions: Profession[];
  laborMarket: LaborMarketData;
  unemployment: UnemploymentData;
  careerSimulation: CareerSimulation;
}

const ProfessionsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [professionsData, setProfessionsData] = useState<ProfessionsData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'professions' | 'unemployment' | 'careers' | 'analytics'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/professions', description: 'Get all professions' },
    { method: 'GET', path: '/api/professions/:id', description: 'Get profession details' },
    { method: 'GET', path: '/api/labor-market', description: 'Get labor market data' },
    { method: 'GET', path: '/api/unemployment', description: 'Get unemployment statistics' },
    { method: 'GET', path: '/api/career-simulation', description: 'Get career simulation data' },
    { method: 'POST', path: '/api/professions/simulate', description: 'Run career simulation' },
    { method: 'GET', path: '/api/skills/demand', description: 'Get skills demand analysis' },
    { method: 'GET', path: '/api/workforce/analytics', description: 'Get workforce analytics' }
  ];

  const fetchProfessionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        professionsRes,
        laborMarketRes,
        unemploymentRes,
        careerSimulationRes
      ] = await Promise.all([
        fetch('/api/professions'),
        fetch('/api/labor-market'),
        fetch('/api/unemployment'),
        fetch('/api/career-simulation')
      ]);

      const [
        professions,
        laborMarket,
        unemployment,
        careerSimulation
      ] = await Promise.all([
        professionsRes.json(),
        laborMarketRes.json(),
        unemploymentRes.json(),
        careerSimulationRes.json()
      ]);

      setProfessionsData({
        professions: professions.professions || generateMockProfessions(),
        laborMarket: laborMarket.laborMarket || generateMockLaborMarket(),
        unemployment: unemployment.unemployment || generateMockUnemployment(),
        careerSimulation: careerSimulation.careerSimulation || generateMockCareerSimulation()
      });
    } catch (err) {
      console.error('Failed to fetch professions data:', err);
      // Use mock data as fallback
      setProfessionsData({
        professions: generateMockProfessions(),
        laborMarket: generateMockLaborMarket(),
        unemployment: generateMockUnemployment(),
        careerSimulation: generateMockCareerSimulation()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessionsData();
  }, [fetchProfessionsData]);

  const generateMockProfessions = (): Profession[] => [
    {
      id: 'prof-1',
      name: 'Quantum Software Engineer',
      category: 'technology',
      level: 'senior',
      description: 'Develops quantum computing applications and algorithms for next-generation computing systems',
      requirements: {
        education: 'Masters in Computer Science or Physics',
        experience: 5,
        skills: ['Quantum Computing', 'Python', 'Linear Algebra', 'Algorithm Design'],
        certifications: ['Quantum Computing Certification', 'Advanced Mathematics']
      },
      compensation: {
        baseSalary: 185000,
        bonuses: 35000,
        benefits: ['Health Insurance', 'Stock Options', 'Flexible PTO', 'Research Budget'],
        totalPackage: 245000
      },
      marketData: {
        demand: 95,
        supply: 25,
        openPositions: 847,
        avgTimeToFill: 89,
        growthRate: 45.2,
        competitiveness: 92
      },
      workConditions: {
        hoursPerWeek: 45,
        flexibility: 'high',
        remoteOptions: true,
        travelRequired: 15,
        stressLevel: 7,
        jobSecurity: 9
      },
      careerPath: {
        entryPoints: ['Software Engineer', 'Research Scientist', 'Physics Graduate'],
        advancement: ['Senior Quantum Engineer', 'Quantum Research Director', 'CTO'],
        lateralMoves: ['AI Research Scientist', 'Cryptography Specialist', 'Academic Researcher'],
        exitOpportunities: ['Quantum Startup Founder', 'Technology Consultant', 'University Professor']
      },
      industries: ['Technology', 'Research', 'Defense', 'Finance'],
      locations: [
        { city: 'New Terra Capital', positions: 234, avgSalary: 195000, demandLevel: 'high' },
        { city: 'Mars Tech Hub', positions: 156, avgSalary: 178000, demandLevel: 'high' },
        { city: 'Europa Research Station', positions: 89, avgSalary: 210000, demandLevel: 'medium' }
      ]
    },
    {
      id: 'prof-2',
      name: 'Interplanetary Logistics Coordinator',
      category: 'logistics',
      level: 'mid',
      description: 'Manages supply chains and transportation networks across multiple planets and space stations',
      requirements: {
        education: 'Bachelors in Supply Chain Management or Engineering',
        experience: 3,
        skills: ['Supply Chain Management', 'Space Operations', 'Data Analysis', 'Project Management'],
        certifications: ['Space Operations License', 'Logistics Management']
      },
      compensation: {
        baseSalary: 95000,
        bonuses: 15000,
        benefits: ['Health Insurance', 'Space Travel Allowance', 'Hazard Pay', 'Retirement Plan'],
        totalPackage: 125000
      },
      marketData: {
        demand: 78,
        supply: 45,
        openPositions: 312,
        avgTimeToFill: 45,
        growthRate: 28.5,
        competitiveness: 65
      },
      workConditions: {
        hoursPerWeek: 50,
        flexibility: 'medium',
        remoteOptions: false,
        travelRequired: 60,
        stressLevel: 8,
        jobSecurity: 7
      },
      careerPath: {
        entryPoints: ['Supply Chain Analyst', 'Operations Coordinator', 'Transportation Specialist'],
        advancement: ['Senior Logistics Manager', 'Operations Director', 'Supply Chain VP'],
        lateralMoves: ['Project Manager', 'Operations Analyst', 'Procurement Specialist'],
        exitOpportunities: ['Logistics Consultant', 'Supply Chain Director', 'Operations Executive']
      },
      industries: ['Transportation', 'Manufacturing', 'Retail', 'Government'],
      locations: [
        { city: 'Mars Industrial Complex', positions: 145, avgSalary: 98000, demandLevel: 'high' },
        { city: 'Asteroid Mining Station', positions: 87, avgSalary: 115000, demandLevel: 'medium' },
        { city: 'New Terra Spaceport', positions: 80, avgSalary: 92000, demandLevel: 'medium' }
      ]
    },
    {
      id: 'prof-3',
      name: 'Xenobiology Research Scientist',
      category: 'science',
      level: 'senior',
      description: 'Studies alien life forms and ecosystems to understand extraterrestrial biology',
      requirements: {
        education: 'PhD in Biology, Biochemistry, or related field',
        experience: 8,
        skills: ['Research Methodology', 'Laboratory Techniques', 'Data Analysis', 'Scientific Writing'],
        certifications: ['Research Ethics', 'Biosafety Level 4', 'Xenobiology Specialist']
      },
      compensation: {
        baseSalary: 145000,
        bonuses: 25000,
        benefits: ['Health Insurance', 'Research Grants', 'Conference Travel', 'Publication Support'],
        totalPackage: 185000
      },
      marketData: {
        demand: 85,
        supply: 15,
        openPositions: 156,
        avgTimeToFill: 120,
        growthRate: 35.8,
        competitiveness: 88
      },
      workConditions: {
        hoursPerWeek: 55,
        flexibility: 'medium',
        remoteOptions: false,
        travelRequired: 40,
        stressLevel: 6,
        jobSecurity: 8
      },
      careerPath: {
        entryPoints: ['Research Assistant', 'Lab Technician', 'Graduate Student'],
        advancement: ['Principal Scientist', 'Research Director', 'Department Head'],
        lateralMoves: ['Biotechnology Researcher', 'Environmental Scientist', 'Medical Researcher'],
        exitOpportunities: ['Biotech Startup', 'Science Consultant', 'University Professor']
      },
      industries: ['Research', 'Government', 'Biotechnology', 'Pharmaceuticals'],
      locations: [
        { city: 'Europa Research Station', positions: 67, avgSalary: 155000, demandLevel: 'high' },
        { city: 'Titan Science Complex', positions: 45, avgSalary: 148000, demandLevel: 'medium' },
        { city: 'New Terra University', positions: 44, avgSalary: 138000, demandLevel: 'medium' }
      ]
    }
  ];

  const generateMockLaborMarket = (): LaborMarketData => ({
    overview: {
      totalEmployed: 2850000,
      totalUnemployed: 142000,
      laborForce: 2992000,
      participationRate: 78.5,
      employmentRate: 95.3,
      openPositions: 185000,
      avgTimeToFill: 42,
      marketHealth: 87
    },
    trends: [
      { period: '2394 Q1', employed: 2820000, unemployed: 158000, openPositions: 165000, newHires: 45000 },
      { period: '2394 Q2', employed: 2835000, unemployed: 148000, openPositions: 172000, newHires: 52000 },
      { period: '2394 Q3', employed: 2845000, unemployed: 145000, openPositions: 178000, newHires: 48000 },
      { period: '2394 Q4', employed: 2850000, unemployed: 142000, openPositions: 185000, newHires: 55000 }
    ],
    sectors: [
      { name: 'Technology', employed: 485000, growth: 12.5, avgSalary: 125000, openings: 45000 },
      { name: 'Healthcare', employed: 425000, growth: 8.2, avgSalary: 95000, openings: 32000 },
      { name: 'Manufacturing', employed: 380000, growth: 4.8, avgSalary: 78000, openings: 28000 },
      { name: 'Education', employed: 295000, growth: 6.1, avgSalary: 65000, openings: 18000 },
      { name: 'Finance', employed: 285000, growth: 7.3, avgSalary: 105000, openings: 22000 },
      { name: 'Retail', employed: 245000, growth: 2.1, avgSalary: 45000, openings: 15000 }
    ],
    skills: [
      { skill: 'Quantum Computing', demand: 95, supply: 25, gap: 70, growthRate: 45.2 },
      { skill: 'AI/Machine Learning', demand: 88, supply: 45, gap: 43, growthRate: 32.8 },
      { skill: 'Space Operations', demand: 82, supply: 35, gap: 47, growthRate: 28.5 },
      { skill: 'Biotechnology', demand: 78, supply: 55, gap: 23, growthRate: 22.1 },
      { skill: 'Cybersecurity', demand: 85, supply: 60, gap: 25, growthRate: 18.7 },
      { skill: 'Data Science', demand: 75, supply: 65, gap: 10, growthRate: 15.3 }
    ]
  });

  const generateMockUnemployment = (): UnemploymentData => ({
    overall: {
      rate: 4.7,
      total: 142000,
      trend: 'decreasing',
      duration: 16.5
    },
    byCategory: [
      { category: 'Technology', rate: 2.1, count: 12000, trend: 'decreasing' },
      { category: 'Healthcare', rate: 3.8, count: 18000, trend: 'stable' },
      { category: 'Manufacturing', rate: 6.2, count: 28000, trend: 'decreasing' },
      { category: 'Retail', rate: 8.5, count: 25000, trend: 'increasing' },
      { category: 'Education', rate: 4.1, count: 15000, trend: 'stable' },
      { category: 'Finance', rate: 3.2, count: 11000, trend: 'decreasing' }
    ],
    byEducation: [
      { level: 'Advanced Degree', rate: 2.8, count: 35000 },
      { level: 'Bachelors Degree', rate: 4.2, count: 58000 },
      { level: 'High School', rate: 7.1, count: 49000 }
    ],
    byAge: [
      { range: '18-24', rate: 8.2, count: 28000 },
      { range: '25-34', rate: 4.1, count: 35000 },
      { range: '35-44', rate: 3.8, count: 32000 },
      { range: '45-54', rate: 4.5, count: 28000 },
      { range: '55+', rate: 5.2, count: 19000 }
    ],
    reasons: [
      { reason: 'Job Elimination', percentage: 35, count: 49700 },
      { reason: 'Career Change', percentage: 22, count: 31240 },
      { reason: 'New Graduate', percentage: 18, count: 25560 },
      { reason: 'Relocation', percentage: 12, count: 17040 },
      { reason: 'Health Issues', percentage: 8, count: 11360 },
      { reason: 'Other', percentage: 5, count: 7100 }
    ],
    support: {
      programs: 45,
      participants: 85000,
      successRate: 72,
      avgDuration: 12.5
    }
  });

  const generateMockCareerSimulation = (): CareerSimulation => ({
    scenarios: [
      {
        id: 'scenario-1',
        name: 'Software Engineer to Quantum Engineer',
        startingProfession: 'Software Engineer',
        targetProfession: 'Quantum Software Engineer',
        timeline: 36,
        steps: [
          { step: 1, action: 'Complete Quantum Computing Certification', duration: 6, cost: 15000, outcome: 'Certification Acquired' },
          { step: 2, action: 'Masters in Quantum Physics (Part-time)', duration: 24, cost: 45000, outcome: 'Advanced Degree' },
          { step: 3, action: 'Quantum Research Internship', duration: 6, cost: 0, outcome: 'Industry Experience' }
        ],
        requirements: {
          education: ['Masters in Quantum Physics'],
          skills: ['Quantum Computing', 'Linear Algebra', 'Python'],
          experience: 3,
          investment: 60000
        },
        outcomes: {
          salaryIncrease: 85000,
          jobSecurity: 9,
          satisfaction: 8,
          successProbability: 78
        }
      },
      {
        id: 'scenario-2',
        name: 'Lab Technician to Research Scientist',
        startingProfession: 'Lab Technician',
        targetProfession: 'Xenobiology Research Scientist',
        timeline: 84,
        steps: [
          { step: 1, action: 'Complete Bachelors in Biology', duration: 36, cost: 35000, outcome: 'Undergraduate Degree' },
          { step: 2, action: 'PhD in Xenobiology', duration: 48, cost: 25000, outcome: 'Doctoral Degree' }
        ],
        requirements: {
          education: ['PhD in Xenobiology'],
          skills: ['Research Methodology', 'Laboratory Techniques', 'Scientific Writing'],
          experience: 2,
          investment: 60000
        },
        outcomes: {
          salaryIncrease: 95000,
          jobSecurity: 8,
          satisfaction: 9,
          successProbability: 65
        }
      }
    ],
    recommendations: [
      { profession: 'AI Research Scientist', reason: 'High demand, growing field', priority: 'high', timeframe: '2-3 years' },
      { profession: 'Space Operations Manager', reason: 'Expanding industry, good compensation', priority: 'medium', timeframe: '3-4 years' },
      { profession: 'Quantum Engineer', reason: 'Emerging technology, high pay', priority: 'high', timeframe: '4-5 years' }
    ]
  });

  const formatNumber = (value: number): string => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number): string => {
    return `$${formatNumber(value)}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'increasing': return '#ef4444';
      case 'decreasing': return '#10b981';
      case 'stable': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getFilteredProfessions = (): Profession[] => {
    if (!professionsData) return [];
    if (!selectedCategory) return professionsData.professions;
    return professionsData.professions.filter(profession => profession.category === selectedCategory);
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchProfessionsData}
    >
      <div className="professions-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'professions' ? 'active' : ''}`}
            onClick={() => setActiveTab('professions')}
          >
            🔍 Professions
          </button>
          <button 
            className={`tab ${activeTab === 'unemployment' ? 'active' : ''}`}
            onClick={() => setActiveTab('unemployment')}
          >
            📉 Unemployment
          </button>
          <button 
            className={`tab ${activeTab === 'careers' ? 'active' : ''}`}
            onClick={() => setActiveTab('careers')}
          >
            🚀 Careers
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading professions data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && professionsData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="labor-market-overview">
                    <h4>📊 Labor Market Overview</h4>
                    <div className="overview-metrics">
                      <div className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatNumber(professionsData.laborMarket.overview.totalEmployed)}</div>
                          <div className="metric-label">Total Employed</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">📋</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatNumber(professionsData.laborMarket.overview.openPositions)}</div>
                          <div className="metric-label">Open Positions</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">⏱️</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.laborMarket.overview.avgTimeToFill}</div>
                          <div className="metric-label">Avg. Time to Fill (days)</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">💚</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.laborMarket.overview.marketHealth}%</div>
                          <div className="metric-label">Market Health</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">📈</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.laborMarket.overview.employmentRate}%</div>
                          <div className="metric-label">Employment Rate</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">🎯</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.laborMarket.overview.participationRate}%</div>
                          <div className="metric-label">Participation Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sectors-overview">
                    <h4>🏭 Sector Performance</h4>
                    <div className="sectors-grid">
                      {professionsData.laborMarket.sectors.map((sector, i) => (
                        <div key={i} className="sector-card">
                          <div className="sector-header">
                            <div className="sector-name">{sector.name}</div>
                            <div className="sector-growth" style={{ color: sector.growth >= 5 ? '#10b981' : sector.growth >= 0 ? '#f59e0b' : '#ef4444' }}>
                              {sector.growth >= 0 ? '+' : ''}{sector.growth.toFixed(1)}%
                            </div>
                          </div>
                          <div className="sector-metrics">
                            <div className="sector-metric">
                              <span className="metric-label">Employed:</span>
                              <span className="metric-value">{formatNumber(sector.employed)}</span>
                            </div>
                            <div className="sector-metric">
                              <span className="metric-label">Avg Salary:</span>
                              <span className="metric-value">{formatCurrency(sector.avgSalary)}</span>
                            </div>
                            <div className="sector-metric">
                              <span className="metric-label">Openings:</span>
                              <span className="metric-value">{formatNumber(sector.openings)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professions' && (
                <div className="professions-tab">
                  <div className="professions-controls">
                    <div className="filter-group">
                      <label htmlFor="categoryFilter">Category Filter:</label>
                      <select 
                        id="categoryFilter" 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                      >
                        <option value="">All Categories</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="science">Science</option>
                        <option value="logistics">Logistics</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                    <div className="results-count">
                      Showing {getFilteredProfessions().length} professions
                    </div>
                  </div>

                  <div className="professions-grid">
                    {getFilteredProfessions().map((profession) => (
                      <div key={profession.id} className="profession-card">
                        <div className="profession-header">
                          <div className="profession-name">{profession.name}</div>
                          <div className={`profession-level ${profession.level}`}>
                            {profession.level.charAt(0).toUpperCase() + profession.level.slice(1)}
                          </div>
                        </div>
                        <div className="profession-category">{profession.category.toUpperCase()}</div>
                        <div className="profession-description">{profession.description}</div>
                        
                        <div className="profession-compensation">
                          <div className="compensation-item">
                            <span className="comp-label">Base Salary:</span>
                            <span className="comp-value">{formatCurrency(profession.compensation.baseSalary)}</span>
                          </div>
                          <div className="compensation-item">
                            <span className="comp-label">Total Package:</span>
                            <span className="comp-value">{formatCurrency(profession.compensation.totalPackage)}</span>
                          </div>
                        </div>

                        <div className="profession-market">
                          <div className="market-item">
                            <span className="market-label">Demand:</span>
                            <div className="market-bar">
                              <div className="market-fill" style={{ width: `${profession.marketData.demand}%` }}></div>
                            </div>
                            <span className="market-value">{profession.marketData.demand}%</span>
                          </div>
                          <div className="market-item">
                            <span className="market-label">Growth:</span>
                            <span className="market-value" style={{ color: '#10b981' }}>
                              +{profession.marketData.growthRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="profession-requirements">
                          <div className="req-item">
                            <span className="req-label">Education:</span>
                            <span className="req-value">{profession.requirements.education}</span>
                          </div>
                          <div className="req-item">
                            <span className="req-label">Experience:</span>
                            <span className="req-value">{profession.requirements.experience} years</span>
                          </div>
                        </div>

                        <div className="profession-skills">
                          <strong>Key Skills:</strong>
                          <div className="skills-list">
                            {profession.requirements.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>

                        <div className="profession-locations">
                          <strong>Top Locations:</strong>
                          <div className="locations-list">
                            {profession.locations.slice(0, 2).map((location, i) => (
                              <div key={i} className="location-item">
                                <span className="location-name">{location.city}</span>
                                <span className="location-positions">({location.positions} positions)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Profession Directory</button>
                    <button className="action-btn secondary">Skills Analysis</button>
                    <button className="action-btn">Career Paths</button>
                  </div>
                </div>
              )}

              {activeTab === 'unemployment' && (
                <div className="unemployment-tab">
                  <div className="unemployment-overview">
                    <h4>📉 Unemployment Overview</h4>
                    <div className="unemployment-metrics">
                      <div className="metric-card">
                        <div className="metric-icon">📊</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.unemployment.overall.rate}%</div>
                          <div className="metric-label">Overall Rate</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-info">
                          <div className="metric-value">{formatNumber(professionsData.unemployment.overall.total)}</div>
                          <div className="metric-label">Total Unemployed</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">⏱️</div>
                        <div className="metric-info">
                          <div className="metric-value">{professionsData.unemployment.overall.duration}</div>
                          <div className="metric-label">Avg. Duration (weeks)</div>
                        </div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-icon">📈</div>
                        <div className="metric-info">
                          <div className="metric-value" style={{ color: getTrendColor(professionsData.unemployment.overall.trend) }}>
                            {professionsData.unemployment.overall.trend.toUpperCase()}
                          </div>
                          <div className="metric-label">Trend</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="unemployment-breakdown">
                    <div className="breakdown-section">
                      <h5>📋 By Category</h5>
                      <div className="breakdown-list">
                        {professionsData.unemployment.byCategory.map((category, i) => (
                          <div key={i} className="breakdown-item">
                            <div className="breakdown-header">
                              <span className="breakdown-name">{category.category}</span>
                              <span className="breakdown-rate">{category.rate}%</span>
                            </div>
                            <div className="breakdown-details">
                              <span className="breakdown-count">{formatNumber(category.count)} people</span>
                              <span className="breakdown-trend" style={{ color: getTrendColor(category.trend) }}>
                                {category.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="breakdown-section">
                      <h5>🎓 By Education</h5>
                      <div className="breakdown-list">
                        {professionsData.unemployment.byEducation.map((education, i) => (
                          <div key={i} className="breakdown-item">
                            <div className="breakdown-header">
                              <span className="breakdown-name">{education.level}</span>
                              <span className="breakdown-rate">{education.rate}%</span>
                            </div>
                            <div className="breakdown-details">
                              <span className="breakdown-count">{formatNumber(education.count)} people</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="breakdown-section">
                      <h5>👥 By Age Group</h5>
                      <div className="breakdown-list">
                        {professionsData.unemployment.byAge.map((age, i) => (
                          <div key={i} className="breakdown-item">
                            <div className="breakdown-header">
                              <span className="breakdown-name">{age.range}</span>
                              <span className="breakdown-rate">{age.rate}%</span>
                            </div>
                            <div className="breakdown-details">
                              <span className="breakdown-count">{formatNumber(age.count)} people</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="unemployment-support">
                    <h4>🎯 Support Programs</h4>
                    <div className="support-metrics">
                      <div className="support-metric">
                        <span className="support-label">Active Programs:</span>
                        <span className="support-value">{professionsData.unemployment.support.programs}</span>
                      </div>
                      <div className="support-metric">
                        <span className="support-label">Participants:</span>
                        <span className="support-value">{formatNumber(professionsData.unemployment.support.participants)}</span>
                      </div>
                      <div className="support-metric">
                        <span className="support-label">Success Rate:</span>
                        <span className="support-value">{professionsData.unemployment.support.successRate}%</span>
                      </div>
                      <div className="support-metric">
                        <span className="support-label">Avg. Duration:</span>
                        <span className="support-value">{professionsData.unemployment.support.avgDuration} weeks</span>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Support Programs</button>
                    <button className="action-btn secondary">Job Placement</button>
                    <button className="action-btn">Training Initiatives</button>
                  </div>
                </div>
              )}

              {activeTab === 'careers' && (
                <div className="careers-tab">
                  <div className="career-scenarios">
                    <h4>🚀 Career Transition Scenarios</h4>
                    <div className="scenarios-grid">
                      {professionsData.careerSimulation.scenarios.map((scenario) => (
                        <div key={scenario.id} className="scenario-card">
                          <div className="scenario-header">
                            <div className="scenario-name">{scenario.name}</div>
                            <div className="scenario-timeline">{scenario.timeline} months</div>
                          </div>
                          <div className="scenario-path">
                            <div className="path-item">
                              <strong>From:</strong> {scenario.startingProfession}
                            </div>
                            <div className="path-arrow">→</div>
                            <div className="path-item">
                              <strong>To:</strong> {scenario.targetProfession}
                            </div>
                          </div>
                          
                          <div className="scenario-steps">
                            <h6>📋 Steps Required:</h6>
                            <div className="steps-list">
                              {scenario.steps.map((step, i) => (
                                <div key={i} className="step-item">
                                  <div className="step-number">{step.step}</div>
                                  <div className="step-details">
                                    <div className="step-action">{step.action}</div>
                                    <div className="step-meta">
                                      <span className="step-duration">{step.duration} months</span>
                                      <span className="step-cost">{formatCurrency(step.cost)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="scenario-outcomes">
                            <h6>🎯 Expected Outcomes:</h6>
                            <div className="outcomes-grid">
                              <div className="outcome-item">
                                <span className="outcome-label">Salary Increase:</span>
                                <span className="outcome-value">{formatCurrency(scenario.outcomes.salaryIncrease)}</span>
                              </div>
                              <div className="outcome-item">
                                <span className="outcome-label">Success Rate:</span>
                                <span className="outcome-value">{scenario.outcomes.successProbability}%</span>
                              </div>
                              <div className="outcome-item">
                                <span className="outcome-label">Job Security:</span>
                                <span className="outcome-value">{scenario.outcomes.jobSecurity}/10</span>
                              </div>
                              <div className="outcome-item">
                                <span className="outcome-label">Satisfaction:</span>
                                <span className="outcome-value">{scenario.outcomes.satisfaction}/10</span>
                              </div>
                            </div>
                          </div>

                          <div className="scenario-investment">
                            <div className="investment-item">
                              <span className="investment-label">Total Investment:</span>
                              <span className="investment-value">{formatCurrency(scenario.requirements.investment)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="career-recommendations">
                    <h4>💡 Career Recommendations</h4>
                    <div className="recommendations-list">
                      {professionsData.careerSimulation.recommendations.map((rec, i) => (
                        <div key={i} className="recommendation-item">
                          <div className="rec-header">
                            <div className="rec-profession">{rec.profession}</div>
                            <div className={`rec-priority ${rec.priority}`}>
                              {rec.priority.toUpperCase()}
                            </div>
                          </div>
                          <div className="rec-reason">{rec.reason}</div>
                          <div className="rec-timeframe">
                            <strong>Timeframe:</strong> {rec.timeframe}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Career Planner</button>
                    <button className="action-btn secondary">Skills Assessment</button>
                    <button className="action-btn">Training Programs</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="skills-analysis">
                    <h4>🎯 Skills Gap Analysis</h4>
                    <div className="skills-grid">
                      {professionsData.laborMarket.skills.map((skill, i) => (
                        <div key={i} className="skill-card">
                          <div className="skill-header">
                            <div className="skill-name">{skill.skill}</div>
                            <div className="skill-growth" style={{ color: '#10b981' }}>
                              +{skill.growthRate.toFixed(1)}%
                            </div>
                          </div>
                          <div className="skill-metrics">
                            <div className="skill-metric">
                              <span className="skill-label">Demand:</span>
                              <div className="skill-bar">
                                <div className="skill-fill demand" style={{ width: `${skill.demand}%` }}></div>
                              </div>
                              <span className="skill-value">{skill.demand}%</span>
                            </div>
                            <div className="skill-metric">
                              <span className="skill-label">Supply:</span>
                              <div className="skill-bar">
                                <div className="skill-fill supply" style={{ width: `${skill.supply}%` }}></div>
                              </div>
                              <span className="skill-value">{skill.supply}%</span>
                            </div>
                            <div className="skill-gap">
                              <span className="gap-label">Gap:</span>
                              <span className="gap-value" style={{ color: skill.gap > 50 ? '#ef4444' : skill.gap > 25 ? '#f59e0b' : '#10b981' }}>
                                {skill.gap} points
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="market-trends">
                    <h4>📈 Market Trends</h4>
                    <div className="trends-chart">
                      {professionsData.laborMarket.trends.map((trend, i) => (
                        <div key={i} className="trend-item">
                          <div className="trend-period">{trend.period}</div>
                          <div className="trend-metrics">
                            <div className="trend-metric">
                              <span className="trend-label">Employed:</span>
                              <span className="trend-value">{formatNumber(trend.employed)}</span>
                            </div>
                            <div className="trend-metric">
                              <span className="trend-label">New Hires:</span>
                              <span className="trend-value">{formatNumber(trend.newHires)}</span>
                            </div>
                            <div className="trend-metric">
                              <span className="trend-label">Openings:</span>
                              <span className="trend-value">{formatNumber(trend.openPositions)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Market Forecast</button>
                    <button className="action-btn">Workforce Planning</button>
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

export default ProfessionsScreen;
