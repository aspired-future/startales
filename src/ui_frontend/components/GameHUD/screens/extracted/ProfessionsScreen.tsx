import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './ProfessionsScreen.css';
import '../shared/StandardDesign.css';

interface GameContext {
  currentLocation: string;
  playerId: string;
}

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

const ProfessionsScreen: React.FC<ScreenProps> = ({
  screenId,
  title,
  icon,
  gameContext
}) => {
  console.log('💼 ProfessionsScreen: Component rendering with gameContext:', gameContext);

  const [professionsData, setProfessionsData] = useState<ProfessionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'professions' | 'unemployment' | 'careers' | 'analytics'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/professions', description: 'Get all professions' },
    { method: 'GET', path: '/api/labor-market', description: 'Get labor market data' },
    { method: 'GET', path: '/api/unemployment', description: 'Get unemployment statistics' },
    { method: 'GET', path: '/api/career-simulation', description: 'Get career simulation data' }
  ];

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'professions', label: 'Professions', icon: '💼' },
    { id: 'unemployment', label: 'Unemployment', icon: '📉' },
    { id: 'careers', label: 'Careers', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const fetchProfessionsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('💼 ProfessionsScreen: Starting data fetch...');

      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/professions');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('💼 ProfessionsScreen: Using API data:', result.data);
          setProfessionsData(result.data);
        } else {
          throw new Error('API response format error');
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('💼 ProfessionsScreen: Failed to fetch professions data:', err);
      console.log('💼 ProfessionsScreen: Using mock data fallback...');
      // Use comprehensive mock data
      const mockData: ProfessionsData = {
        professions: [
          {
            id: '1',
            name: 'Software Engineer',
            category: 'Technology',
            level: 'senior',
            description: 'Develop and maintain software applications and systems',
            requirements: {
              education: 'Bachelor\'s in Computer Science',
              experience: 5,
              skills: ['JavaScript', 'Python', 'React', 'Node.js'],
              certifications: ['AWS Certified Developer', 'Google Cloud Professional']
            },
            compensation: {
              baseSalary: 120000,
              bonuses: 25000,
              benefits: ['Health Insurance', '401k', 'Stock Options'],
              totalPackage: 145000
            },
            marketData: {
              demand: 85,
              supply: 60,
              openPositions: 15000,
              avgTimeToFill: 45,
              growthRate: 12.5,
              competitiveness: 75
            },
            workConditions: {
              hoursPerWeek: 40,
              flexibility: 'high',
              remoteOptions: true,
              travelRequired: 5,
              stressLevel: 65,
              jobSecurity: 80
            },
            careerPath: {
              entryPoints: ['Junior Developer', 'Bootcamp Graduate'],
              advancement: ['Lead Developer', 'Engineering Manager'],
              lateralMoves: ['Product Manager', 'DevOps Engineer'],
              exitOpportunities: ['Technical Consultant', 'Startup Founder']
            },
            industries: ['Technology', 'Finance', 'Healthcare'],
            locations: [
              { city: 'San Francisco', positions: 5000, avgSalary: 140000, demandLevel: 'high' },
              { city: 'New York', positions: 3500, avgSalary: 130000, demandLevel: 'high' },
              { city: 'Austin', positions: 2000, avgSalary: 110000, demandLevel: 'medium' }
            ]
          },
          {
            id: '2',
            name: 'Data Scientist',
            category: 'Analytics',
            level: 'mid',
            description: 'Analyze complex data to drive business decisions',
            requirements: {
              education: 'Master\'s in Statistics or Data Science',
              experience: 3,
              skills: ['Python', 'R', 'SQL', 'Machine Learning'],
              certifications: ['Google Data Analytics', 'IBM Data Science']
            },
            compensation: {
              baseSalary: 95000,
              bonuses: 15000,
              benefits: ['Health Insurance', '401k', 'Professional Development'],
              totalPackage: 110000
            },
            marketData: {
              demand: 90,
              supply: 45,
              openPositions: 8000,
              avgTimeToFill: 60,
              growthRate: 15.2,
              competitiveness: 85
            },
            workConditions: {
              hoursPerWeek: 45,
              flexibility: 'medium',
              remoteOptions: true,
              travelRequired: 10,
              stressLevel: 70,
              jobSecurity: 85
            },
            careerPath: {
              entryPoints: ['Data Analyst', 'Business Analyst'],
              advancement: ['Senior Data Scientist', 'Data Science Manager'],
              lateralMoves: ['Product Manager', 'Business Intelligence'],
              exitOpportunities: ['Consultant', 'Academic Research']
            },
            industries: ['Technology', 'Finance', 'Healthcare', 'Retail'],
            locations: [
              { city: 'San Francisco', positions: 2500, avgSalary: 130000, demandLevel: 'high' },
              { city: 'New York', positions: 2000, avgSalary: 120000, demandLevel: 'high' },
              { city: 'Seattle', positions: 1500, avgSalary: 115000, demandLevel: 'medium' }
            ]
          },
          {
            id: '3',
            name: 'Marketing Manager',
            category: 'Business',
            level: 'senior',
            description: 'Develop and execute marketing strategies',
            requirements: {
              education: 'Bachelor\'s in Marketing or Business',
              experience: 7,
              skills: ['Digital Marketing', 'Analytics', 'Strategy', 'Leadership'],
              certifications: ['Google Ads', 'HubSpot Marketing']
            },
            compensation: {
              baseSalary: 85000,
              bonuses: 20000,
              benefits: ['Health Insurance', '401k', 'Performance Bonus'],
              totalPackage: 105000
            },
            marketData: {
              demand: 70,
              supply: 80,
              openPositions: 12000,
              avgTimeToFill: 35,
              growthRate: 8.5,
              competitiveness: 60
            },
            workConditions: {
              hoursPerWeek: 50,
              flexibility: 'medium',
              remoteOptions: true,
              travelRequired: 20,
              stressLevel: 75,
              jobSecurity: 70
            },
            careerPath: {
              entryPoints: ['Marketing Coordinator', 'Digital Marketing Specialist'],
              advancement: ['Marketing Director', 'VP of Marketing'],
              lateralMoves: ['Product Marketing', 'Brand Manager'],
              exitOpportunities: ['Consultant', 'Agency Owner']
            },
            industries: ['Technology', 'Consumer Goods', 'Healthcare', 'Finance'],
            locations: [
              { city: 'New York', positions: 4000, avgSalary: 95000, demandLevel: 'high' },
              { city: 'Los Angeles', positions: 3000, avgSalary: 90000, demandLevel: 'medium' },
              { city: 'Chicago', positions: 2500, avgSalary: 85000, demandLevel: 'medium' }
            ]
          }
        ],
        laborMarket: {
          overview: {
            totalEmployed: 158000000,
            totalUnemployed: 6200000,
            laborForce: 164200000,
            participationRate: 62.8,
            employmentRate: 96.2,
            openPositions: 850000,
            avgTimeToFill: 42,
            marketHealth: 78.5
          },
          trends: [
            { period: 'Q1 2024', employed: 157500000, unemployed: 6500000, openPositions: 820000, newHires: 1850000 },
            { period: 'Q2 2024', employed: 158000000, unemployed: 6200000, openPositions: 850000, newHires: 1920000 },
            { period: 'Q3 2024', employed: 158500000, unemployed: 5900000, openPositions: 880000, newHires: 1980000 }
          ],
          sectors: [
            { name: 'Technology', employed: 8500000, growth: 12.5, avgSalary: 95000, openings: 125000 },
            { name: 'Healthcare', employed: 16500000, growth: 8.2, avgSalary: 65000, openings: 180000 },
            { name: 'Finance', employed: 8200000, growth: 5.8, avgSalary: 85000, openings: 95000 },
            { name: 'Manufacturing', employed: 12500000, growth: 3.2, avgSalary: 55000, openings: 110000 }
          ],
          skills: [
            { skill: 'Python', demand: 85, supply: 60, gap: 25, growthRate: 15.2 },
            { skill: 'JavaScript', demand: 80, supply: 70, gap: 10, growthRate: 12.8 },
            { skill: 'Data Analysis', demand: 90, supply: 55, gap: 35, growthRate: 18.5 },
            { skill: 'Project Management', demand: 75, supply: 65, gap: 10, growthRate: 8.5 }
          ]
        },
        unemployment: {
          overall: {
            rate: 3.8,
            total: 6200000,
            trend: 'decreasing',
            duration: 18.5
          },
          byCategory: [
            { category: 'Technology', rate: 2.1, count: 180000, trend: 'decreasing' },
            { category: 'Healthcare', rate: 2.8, count: 460000, trend: 'decreasing' },
            { category: 'Finance', rate: 3.2, count: 260000, trend: 'stable' },
            { category: 'Manufacturing', rate: 4.5, count: 560000, trend: 'increasing' }
          ],
          byEducation: [
            { level: 'High School', rate: 5.2, count: 2200000 },
            { level: 'Bachelor\'s', rate: 2.8, count: 1740000 },
            { level: 'Master\'s', rate: 1.9, count: 1180000 },
            { level: 'PhD', rate: 1.2, count: 74000 }
          ],
          byAge: [
            { range: '18-24', rate: 6.8, count: 1100000 },
            { range: '25-34', rate: 3.9, count: 1520000 },
            { range: '35-44', rate: 3.2, count: 1240000 },
            { range: '45-54', rate: 3.1, count: 1150000 },
            { range: '55+', rate: 3.5, count: 1190000 }
          ],
          reasons: [
            { reason: 'Job Loss', percentage: 45, count: 2790000 },
            { reason: 'New Entrants', percentage: 25, count: 1550000 },
            { reason: 'Re-entrants', percentage: 20, count: 1240000 },
            { reason: 'Voluntary', percentage: 10, count: 620000 }
          ],
          support: {
            programs: 125,
            participants: 1850000,
            successRate: 68.5,
            avgDuration: 6.2
          }
        },
        careerSimulation: {
          scenarios: [
            {
              id: '1',
              name: 'Tech Career Transition',
              startingProfession: 'Marketing Coordinator',
              targetProfession: 'Product Manager',
              timeline: 24,
              steps: [
                { step: 1, action: 'Learn Product Management Fundamentals', duration: 6, cost: 5000, outcome: 'Certification' },
                { step: 2, action: 'Gain Technical Skills', duration: 8, cost: 8000, outcome: 'Technical Proficiency' },
                { step: 3, action: 'Build Portfolio Projects', duration: 6, cost: 2000, outcome: 'Portfolio' },
                { step: 4, action: 'Network and Apply', duration: 4, cost: 1000, outcome: 'Job Offer' }
              ],
              requirements: {
                education: ['Product Management Certification', 'Technical Skills'],
                skills: ['Agile', 'User Research', 'Data Analysis'],
                experience: 2,
                investment: 16000
              },
              outcomes: {
                salaryIncrease: 35000,
                jobSecurity: 85,
                satisfaction: 80,
                successProbability: 75
              }
            }
          ],
          recommendations: [
            { profession: 'Data Scientist', reason: 'High demand, excellent growth prospects', priority: 'high', timeframe: '6-12 months' },
            { profession: 'Product Manager', reason: 'Good work-life balance, high compensation', priority: 'medium', timeframe: '12-18 months' },
            { profession: 'DevOps Engineer', reason: 'Technical role with automation focus', priority: 'medium', timeframe: '12-24 months' }
          ]
        }
      };
      console.log('💼 ProfessionsScreen: Setting mock data:', mockData);
      setProfessionsData(mockData);
    } finally {
      setLoading(false);
      console.log('💼 ProfessionsScreen: Data fetch completed');
    }
  }, []);

  useEffect(() => {
    fetchProfessionsData();
  }, [fetchProfessionsData]);

  useEffect(() => {
    console.log('💼 ProfessionsScreen: professionsData changed:', professionsData);
  }, [professionsData]);

  const renderOverview = () => {
    console.log('💼 ProfessionsScreen: renderOverview called, professionsData:', professionsData);
    if (!professionsData) return null;

    const { laborMarket, unemployment } = professionsData;

    return (
      <>
        {/* Key Metrics */}
        <div className="standard-panel social-theme">
          <h3>📊 Labor Market Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.totalEmployed.toLocaleString()}</div>
              <div className="metric-label">Total Employed</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.totalUnemployed.toLocaleString()}</div>
              <div className="metric-label">Total Unemployed</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{unemployment.overall.rate.toFixed(1)}%</div>
              <div className="metric-label">Unemployment Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.openPositions.toLocaleString()}</div>
              <div className="metric-label">Open Positions</div>
            </div>
          </div>
        </div>

        {/* Employment Rate */}
        <div className="standard-panel social-theme">
          <h3>📈 Employment Metrics</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.participationRate.toFixed(1)}%</div>
              <div className="metric-label">Labor Force Participation</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.employmentRate.toFixed(1)}%</div>
              <div className="metric-label">Employment Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.avgTimeToFill} days</div>
              <div className="metric-label">Avg Time to Fill</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{laborMarket.overview.marketHealth.toFixed(1)}</div>
              <div className="metric-label">Market Health Score</div>
            </div>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="standard-panel social-theme table-panel">
          <h3>🏢 Sector Performance</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Employed</th>
                  <th>Growth Rate</th>
                  <th>Avg Salary</th>
                  <th>Openings</th>
                </tr>
              </thead>
              <tbody>
                {laborMarket.sectors.map((sector, index) => (
                  <tr key={index}>
                    <td>{sector.name}</td>
                    <td>{sector.employed.toLocaleString()}</td>
                    <td>
                      <span className={`growth-rate ${sector.growth > 5 ? 'high' : sector.growth > 0 ? 'medium' : 'low'}`}>
                        {sector.growth > 0 ? '+' : ''}{sector.growth.toFixed(1)}%
                      </span>
                    </td>
                    <td>${sector.avgSalary.toLocaleString()}</td>
                    <td>{sector.openings.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderProfessions = () => {
    if (!professionsData) return null;

    return (
      <>
        <div className="standard-panel social-theme table-panel">
          <h3>💼 Top Professions</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Profession</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Demand</th>
                  <th>Avg Salary</th>
                  <th>Open Positions</th>
                </tr>
              </thead>
              <tbody>
                {professionsData.professions.map((profession) => (
                  <tr key={profession.id}>
                    <td>{profession.name}</td>
                    <td>
                      <span className={`category-badge category-${profession.category.toLowerCase()}`}>
                        {profession.category}
                      </span>
                    </td>
                    <td>
                      <span className={`level-badge level-${profession.level}`}>
                        {profession.level}
                      </span>
                    </td>
                    <td>
                      <span className={`demand-badge ${profession.marketData.demand > 80 ? 'high' : profession.marketData.demand > 60 ? 'medium' : 'low'}`}>
                        {profession.marketData.demand}%
                      </span>
                    </td>
                    <td>${profession.compensation.totalPackage.toLocaleString()}</td>
                    <td>{profession.marketData.openPositions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderUnemployment = () => {
    if (!professionsData) return null;

    const { unemployment } = professionsData;

    return (
      <>
        {/* Unemployment Overview */}
        <div className="standard-panel social-theme">
          <h3>📉 Unemployment Overview</h3>
          <div className="standard-metric-grid">
            <div className="standard-metric">
              <div className="metric-value">{unemployment.overall.rate.toFixed(1)}%</div>
              <div className="metric-label">Unemployment Rate</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{unemployment.overall.total.toLocaleString()}</div>
              <div className="metric-label">Total Unemployed</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{unemployment.overall.duration.toFixed(1)} weeks</div>
              <div className="metric-label">Avg Duration</div>
            </div>
            <div className="standard-metric">
              <div className="metric-value">{unemployment.support.successRate.toFixed(1)}%</div>
              <div className="metric-label">Support Success Rate</div>
            </div>
          </div>
        </div>

        {/* Unemployment by Category */}
        <div className="standard-panel social-theme table-panel">
          <h3>📊 Unemployment by Category</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Rate</th>
                  <th>Count</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {unemployment.byCategory.map((category, index) => (
                  <tr key={index}>
                    <td>{category.category}</td>
                    <td>{category.rate.toFixed(1)}%</td>
                    <td>{category.count.toLocaleString()}</td>
                    <td>
                      <span className={`trend-badge trend-${category.trend}`}>
                        {category.trend === 'increasing' ? '↗️' : category.trend === 'decreasing' ? '↘️' : '→'} {category.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderCareers = () => {
    if (!professionsData) return null;

    const { careerSimulation } = professionsData;

    return (
      <>
        {/* Career Recommendations */}
        <div className="standard-panel social-theme">
          <h3>🎯 Career Recommendations</h3>
          <div className="standard-metric-grid">
            {careerSimulation.recommendations.map((rec, index) => (
              <div className="standard-metric" key={index}>
                <div className="metric-value">{rec.profession}</div>
                <div className="metric-label">{rec.reason}</div>
                <div className="metric-progress">
                  <div className="progress-bar" style={{ 
                    width: `${rec.priority === 'high' ? 90 : rec.priority === 'medium' ? 60 : 30}%`,
                    backgroundColor: rec.priority === 'high' ? '#10b981' : rec.priority === 'medium' ? '#f59e0b' : '#ef4444'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Scenarios */}
        <div className="standard-panel social-theme table-panel">
          <h3>🔄 Career Scenarios</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Timeline</th>
                  <th>Success Rate</th>
                  <th>Salary Increase</th>
                </tr>
              </thead>
              <tbody>
                {careerSimulation.scenarios.map((scenario) => (
                  <tr key={scenario.id}>
                    <td>{scenario.name}</td>
                    <td>{scenario.startingProfession}</td>
                    <td>{scenario.targetProfession}</td>
                    <td>{scenario.timeline} months</td>
                    <td>
                      <span className={`success-badge ${scenario.outcomes.successProbability > 70 ? 'high' : scenario.outcomes.successProbability > 50 ? 'medium' : 'low'}`}>
                        {scenario.outcomes.successProbability}%
                      </span>
                    </td>
                    <td>+${scenario.outcomes.salaryIncrease.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const renderAnalytics = () => {
    if (!professionsData) return null;

    const { laborMarket } = professionsData;

    return (
      <>
        {/* Skills Gap Analysis */}
        <div className="standard-panel social-theme table-panel">
          <h3>🔍 Skills Gap Analysis</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Demand</th>
                  <th>Supply</th>
                  <th>Gap</th>
                  <th>Growth Rate</th>
                </tr>
              </thead>
              <tbody>
                {laborMarket.skills.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill.skill}</td>
                    <td>{skill.demand}%</td>
                    <td>{skill.supply}%</td>
                    <td>
                      <span className={`gap-badge ${skill.gap > 20 ? 'high' : skill.gap > 10 ? 'medium' : 'low'}`}>
                        {skill.gap}%
                      </span>
                    </td>
                    <td>
                      <span className={`growth-badge ${skill.growthRate > 10 ? 'high' : skill.growthRate > 5 ? 'medium' : 'low'}`}>
                        {skill.growthRate > 0 ? '+' : ''}{skill.growthRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Trends */}
        <div className="standard-panel social-theme table-panel">
          <h3>📈 Market Trends</h3>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Employed</th>
                  <th>Unemployed</th>
                  <th>Open Positions</th>
                  <th>New Hires</th>
                </tr>
              </thead>
              <tbody>
                {laborMarket.trends.map((trend, index) => (
                  <tr key={index}>
                    <td>{trend.period}</td>
                    <td>{trend.employed.toLocaleString()}</td>
                    <td>{trend.unemployed.toLocaleString()}</td>
                    <td>{trend.openPositions.toLocaleString()}</td>
                    <td>{trend.newHires.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'professions':
        return renderProfessions();
      case 'unemployment':
        return renderUnemployment();
      case 'careers':
        return renderCareers();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        apiEndpoints={apiEndpoints}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading professions data...</p>
        </div>
      </BaseScreen>
    );
  }

  if (error) {
    return (
      <BaseScreen
        screenId={screenId}
        title={title}
        icon={icon}
        gameContext={gameContext}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        apiEndpoints={apiEndpoints}
      >
        <div className="error-container">
          <div className="error-message">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button onClick={fetchProfessionsData} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      apiEndpoints={apiEndpoints}
    >
      <div className="social-theme" style={{ minHeight: '800px' }}>
        {renderContent()}
      </div>
    </BaseScreen>
  );
};

export default ProfessionsScreen;
