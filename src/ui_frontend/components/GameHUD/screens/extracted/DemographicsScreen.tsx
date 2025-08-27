import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './DemographicsScreen.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface DemographicStat {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  percentage?: number;
}

interface CityDemographics {
  id: string;
  name: string;
  totalPopulation: number;
  ageDistribution: {
    children: number;
    adults: number;
    elderly: number;
  };
  educationLevels: {
    elementary: number;
    secondary: number;
    higher: number;
    advanced: number;
  };
  incomeDistribution: {
    low: number;
    middle: number;
    high: number;
    elite: number;
  };
  socialMobility: {
    upwardMobility: number;
    downwardMobility: number;
    barriers: string[];
    opportunities: string[];
  };
  trends: {
    populationGrowth: number;
    migrationRate: number;
    birthRate: number;
    deathRate: number;
  };
}

interface DemographicsData {
  cities: CityDemographics[];
  selectedCity: CityDemographics | null;
  overallStats: DemographicStat[];
  projections: {
    year: number;
    population: number;
    scenario: string;
  }[];
}

const DemographicsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [demographicsData, setDemographicsData] = useState<DemographicsData | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'mobility' | 'projections' | 'comparative'>('overview');
  const [loading, setLoading] = useState(false);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/demographics/population', description: 'Get population demographics' },
    { method: 'GET', path: '/api/demographics/cities', description: 'Get city demographic data' },
    { method: 'GET', path: '/api/demographics/trends', description: 'Get demographic trends' },
    { method: 'GET', path: '/api/demographics/mobility', description: 'Get social mobility data' },
    { method: 'POST', path: '/api/demographics/simulate', description: 'Simulate demographic changes' }
  ];

  const fetchDemographicsData = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch real data from API
      const response = await fetch('/api/demographics/population');
      if (response.ok) {
        const data = await response.json();
        setDemographicsData(data);
        if (data.cities.length > 0 && !selectedCityId) {
          setSelectedCityId(data.cities[0].id);
        }
        return;
      }
    } catch (error) {
      console.warn('Demographics API not available, using mock data');
    }

    // Fallback to mock data for development
    const mockData: DemographicsData = {
      cities: [
        {
          id: 'new-terra',
          name: 'New Terra',
          totalPopulation: 2500000,
          ageDistribution: {
            children: 18,
            adults: 65,
            elderly: 17
          },
          educationLevels: {
            elementary: 15,
            secondary: 35,
            higher: 35,
            advanced: 15
          },
          incomeDistribution: {
            low: 25,
            middle: 45,
            high: 25,
            elite: 5
          },
          socialMobility: {
            upwardMobility: 12,
            downwardMobility: 8,
            barriers: ['Limited Education Access', 'Economic Inequality', 'Geographic Isolation'],
            opportunities: ['Tech Industry Growth', 'Education Programs', 'Infrastructure Development']
          },
          trends: {
            populationGrowth: 2.3,
            migrationRate: 1.8,
            birthRate: 14.2,
            deathRate: 8.1
          }
        },
        {
          id: 'mars-colony',
          name: 'Mars Colony Alpha',
          totalPopulation: 850000,
          ageDistribution: {
            children: 22,
            adults: 68,
            elderly: 10
          },
          educationLevels: {
            elementary: 10,
            secondary: 25,
            higher: 45,
            advanced: 20
          },
          incomeDistribution: {
            low: 15,
            middle: 40,
            high: 35,
            elite: 10
          },
          socialMobility: {
            upwardMobility: 18,
            downwardMobility: 5,
            barriers: ['Resource Scarcity', 'Harsh Environment'],
            opportunities: ['Research Opportunities', 'Pioneer Economy', 'High-Tech Industries']
          },
          trends: {
            populationGrowth: 4.1,
            migrationRate: 3.2,
            birthRate: 16.8,
            deathRate: 6.2
          }
        }
      ],
      selectedCity: null,
      overallStats: [
        { label: 'Total Population', value: '3.35M', trend: 'up', percentage: 2.8 },
        { label: 'Population Growth', value: '2.9%', trend: 'up', percentage: 2.9 },
        { label: 'Average Age', value: '34.2', trend: 'stable', percentage: 0.1 },
        { label: 'Education Index', value: '0.78', trend: 'up', percentage: 1.2 },
        { label: 'Social Mobility', value: '14.5%', trend: 'up', percentage: 0.8 }
      ],
      projections: [
        { year: 2024, population: 3350000, scenario: 'Current Trend' },
        { year: 2025, population: 3447000, scenario: 'Current Trend' },
        { year: 2026, population: 3547000, scenario: 'Current Trend' },
        { year: 2027, population: 3651000, scenario: 'Current Trend' },
        { year: 2028, population: 3758000, scenario: 'Current Trend' }
      ]
    };

    mockData.selectedCity = mockData.cities[0];
    setDemographicsData(mockData);
    setSelectedCityId(mockData.cities[0].id);
    setLoading(false);
  }, [selectedCityId]);

  const loadCityData = useCallback(async (cityId: string) => {
    if (!cityId || !demographicsData) return;
    
    const city = demographicsData.cities.find(c => c.id === cityId);
    if (city) {
      setDemographicsData(prev => prev ? { ...prev, selectedCity: city } : null);
    }
  }, [demographicsData]);

  const simulateDemographics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/demographics/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ years: 5, cityId: selectedCityId })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update projections with simulation results
        console.log('Simulation results:', data);
      }
    } catch (error) {
      console.warn('Simulation API not available');
    }
    setLoading(false);
  }, [selectedCityId]);

  useEffect(() => {
    fetchDemographicsData();
  }, [fetchDemographicsData]);

  useEffect(() => {
    if (selectedCityId) {
      loadCityData(selectedCityId);
    }
  }, [selectedCityId, loadCityData]);

  const formatNumber = (num: number): string => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const renderOverview = () => {
    if (!demographicsData?.selectedCity) return <div className="loading">Select a city to view demographics...</div>;

    const city = demographicsData.selectedCity;

    return (
      <div className="demographics-overview">
        <div className="stats-grid">
          {demographicsData.overallStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{getTrendIcon(stat.trend)}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                {stat.percentage && (
                  <div className={`stat-change ${stat.trend}`}>
                    {stat.trend === 'up' ? '+' : stat.trend === 'down' ? '-' : ''}
                    {Math.abs(stat.percentage)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="demographics-details">
          <div className="detail-card">
            <h3>👥 Population Overview</h3>
            <div className="population-stat">
              <span>Total Population:</span>
              <span>{formatNumber(city.totalPopulation)}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>📊 Age Distribution</h3>
            <div className="distribution-chart">
              <div className="chart-item">
                <span>Children (0-17)</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${city.ageDistribution.children}%` }} />
                </div>
                <span>{city.ageDistribution.children}%</span>
              </div>
              <div className="chart-item">
                <span>Adults (18-64)</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${city.ageDistribution.adults}%` }} />
                </div>
                <span>{city.ageDistribution.adults}%</span>
              </div>
              <div className="chart-item">
                <span>Elderly (65+)</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${city.ageDistribution.elderly}%` }} />
                </div>
                <span>{city.ageDistribution.elderly}%</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>🎓 Education Levels</h3>
            <div className="distribution-chart">
              <div className="chart-item">
                <span>Elementary</span>
                <div className="progress-bar">
                  <div className="progress-fill education" style={{ width: `${city.educationLevels.elementary}%` }} />
                </div>
                <span>{city.educationLevels.elementary}%</span>
              </div>
              <div className="chart-item">
                <span>Secondary</span>
                <div className="progress-bar">
                  <div className="progress-fill education" style={{ width: `${city.educationLevels.secondary}%` }} />
                </div>
                <span>{city.educationLevels.secondary}%</span>
              </div>
              <div className="chart-item">
                <span>Higher Education</span>
                <div className="progress-bar">
                  <div className="progress-fill education" style={{ width: `${city.educationLevels.higher}%` }} />
                </div>
                <span>{city.educationLevels.higher}%</span>
              </div>
              <div className="chart-item">
                <span>Advanced Degrees</span>
                <div className="progress-bar">
                  <div className="progress-fill education" style={{ width: `${city.educationLevels.advanced}%` }} />
                </div>
                <span>{city.educationLevels.advanced}%</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>💰 Income Distribution</h3>
            <div className="distribution-chart">
              <div className="chart-item">
                <span>Low Income</span>
                <div className="progress-bar">
                  <div className="progress-fill income" style={{ width: `${city.incomeDistribution.low}%` }} />
                </div>
                <span>{city.incomeDistribution.low}%</span>
              </div>
              <div className="chart-item">
                <span>Middle Income</span>
                <div className="progress-bar">
                  <div className="progress-fill income" style={{ width: `${city.incomeDistribution.middle}%` }} />
                </div>
                <span>{city.incomeDistribution.middle}%</span>
              </div>
              <div className="chart-item">
                <span>High Income</span>
                <div className="progress-bar">
                  <div className="progress-fill income" style={{ width: `${city.incomeDistribution.high}%` }} />
                </div>
                <span>{city.incomeDistribution.high}%</span>
              </div>
              <div className="chart-item">
                <span>Elite</span>
                <div className="progress-bar">
                  <div className="progress-fill income" style={{ width: `${city.incomeDistribution.elite}%` }} />
                </div>
                <span>{city.incomeDistribution.elite}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics Charts Section */}
        <div className="demographics-charts-section">
          <div className="charts-grid">
            <div className="chart-container">
              <PieChart
                data={[
                  { 
                    label: 'Adults (18-64)', 
                    value: city.ageDistribution.adults, 
                    color: '#4ecdc4' 
                  },
                  { 
                    label: 'Children (0-17)', 
                    value: city.ageDistribution.children, 
                    color: '#45b7aa' 
                  },
                  { 
                    label: 'Elderly (65+)', 
                    value: city.ageDistribution.elderly, 
                    color: '#96ceb4' 
                  }
                ]}
                title="👥 Age Distribution"
                size={200}
                showLegend={true}
              />
            </div>

            <div className="chart-container">
              <LineChart
                data={[
                  { label: '2019', value: city.totalPopulation * 0.85 },
                  { label: '2020', value: city.totalPopulation * 0.88 },
                  { label: '2021', value: city.totalPopulation * 0.92 },
                  { label: '2022', value: city.totalPopulation * 0.96 },
                  { label: '2023', value: city.totalPopulation * 0.98 },
                  { label: '2024', value: city.totalPopulation }
                ]}
                title="📈 Population Growth Trends"
                color="#feca57"
                height={250}
                width={400}
              />
            </div>

            <div className="chart-container">
              <BarChart
                data={[
                  { 
                    label: 'Low Income', 
                    value: city.incomeDistribution.low, 
                    color: '#ff6b6b' 
                  },
                  { 
                    label: 'Middle Income', 
                    value: city.incomeDistribution.middle, 
                    color: '#4ecdc4' 
                  },
                  { 
                    label: 'High Income', 
                    value: city.incomeDistribution.high, 
                    color: '#45b7aa' 
                  },
                  { 
                    label: 'Elite', 
                    value: city.incomeDistribution.elite, 
                    color: '#feca57' 
                  }
                ]}
                title="💰 Income Distribution"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>

            <div className="chart-container">
              <PieChart
                data={[
                  { 
                    label: 'Secondary', 
                    value: city.educationLevels.secondary, 
                    color: '#4ecdc4' 
                  },
                  { 
                    label: 'Higher Education', 
                    value: city.educationLevels.higher, 
                    color: '#45b7aa' 
                  },
                  { 
                    label: 'Elementary', 
                    value: city.educationLevels.elementary, 
                    color: '#96ceb4' 
                  },
                  { 
                    label: 'Advanced Degrees', 
                    value: city.educationLevels.advanced, 
                    color: '#feca57' 
                  }
                ]}
                title="🎓 Education Levels"
                size={200}
                showLegend={true}
              />
            </div>

            <div className="chart-container">
              <LineChart
                data={[
                  { label: 'Jan', value: demographicsData.overallStats[0]?.percentage || 85 },
                  { label: 'Feb', value: (demographicsData.overallStats[0]?.percentage || 85) + 1 },
                  { label: 'Mar', value: (demographicsData.overallStats[0]?.percentage || 85) + 2 },
                  { label: 'Apr', value: (demographicsData.overallStats[0]?.percentage || 85) + 1.5 },
                  { label: 'May', value: (demographicsData.overallStats[0]?.percentage || 85) + 3 },
                  { label: 'Jun', value: (demographicsData.overallStats[0]?.percentage || 85) + 2.5 }
                ]}
                title="📊 Quality of Life Index"
                color="#96ceb4"
                height={250}
                width={400}
              />
            </div>

            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'Birth Rate', value: 12.5, color: '#4ecdc4' },
                  { label: 'Death Rate', value: 8.2, color: '#ff6b6b' },
                  { label: 'Migration Rate', value: 15.3, color: '#feca57' },
                  { label: 'Employment Rate', value: 94.2, color: '#45b7aa' }
                ]}
                title="📈 Demographic Indicators"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrends = () => {
    if (!demographicsData?.selectedCity) return <div className="loading">Select a city to view trends...</div>;

    const city = demographicsData.selectedCity;

    return (
      <div className="demographics-trends">
        <div className="trends-grid">
          <div className="trend-card">
            <h4>📈 Population Growth</h4>
            <div className="trend-value">{city.trends.populationGrowth}%</div>
            <div className="trend-description">Annual population growth rate</div>
          </div>
          <div className="trend-card">
            <h4>🚶 Migration Rate</h4>
            <div className="trend-value">{city.trends.migrationRate}%</div>
            <div className="trend-description">Net migration rate</div>
          </div>
          <div className="trend-card">
            <h4>👶 Birth Rate</h4>
            <div className="trend-value">{city.trends.birthRate}‰</div>
            <div className="trend-description">Births per 1,000 people</div>
          </div>
          <div className="trend-card">
            <h4>⚰️ Death Rate</h4>
            <div className="trend-value">{city.trends.deathRate}‰</div>
            <div className="trend-description">Deaths per 1,000 people</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobility = () => {
    if (!demographicsData?.selectedCity) return <div className="loading">Select a city to view mobility data...</div>;

    const city = demographicsData.selectedCity;

    return (
      <div className="social-mobility">
        <div className="mobility-overview">
          <div className="mobility-metric">
            <h4>📈 Upward Mobility</h4>
            <div className="mobility-value">{city.socialMobility.upwardMobility}%</div>
          </div>
          <div className="mobility-metric">
            <h4>📉 Downward Mobility</h4>
            <div className="mobility-value">{city.socialMobility.downwardMobility}%</div>
          </div>
        </div>

        <div className="mobility-factors">
          <div className="factor-card">
            <h4>🚧 Barriers to Mobility</h4>
            <div className="factor-list">
              {city.socialMobility.barriers.map((barrier, index) => (
                <div key={index} className="factor-item barrier">
                  {barrier}
                </div>
              ))}
            </div>
          </div>
          <div className="factor-card">
            <h4>🚀 Opportunities</h4>
            <div className="factor-list">
              {city.socialMobility.opportunities.map((opportunity, index) => (
                <div key={index} className="factor-item opportunity">
                  {opportunity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjections = () => {
    if (!demographicsData?.projections) return <div className="loading">Loading projections...</div>;

    return (
      <div className="demographics-projections">
        <h4>🔮 Population Projections</h4>
        <div className="projections-chart">
          {demographicsData.projections.map((projection, index) => (
            <div key={index} className="projection-item">
              <div className="projection-year">{projection.year}</div>
              <div className="projection-population">{formatNumber(projection.population)}</div>
              <div className="projection-scenario">{projection.scenario}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparative = () => {
    if (!demographicsData?.cities) return <div className="loading">Loading comparative data...</div>;

    return (
      <div className="comparative-analysis">
        <h4>⚖️ City Comparison</h4>
        <div className="comparison-table">
          <div className="comparison-header">
            <div>City</div>
            <div>Population</div>
            <div>Growth Rate</div>
            <div>Education Index</div>
            <div>Mobility</div>
          </div>
          {demographicsData.cities.map(city => (
            <div key={city.id} className="comparison-row">
              <div className="city-name">{city.name}</div>
              <div>{formatNumber(city.totalPopulation)}</div>
              <div>{city.trends.populationGrowth}%</div>
              <div>{((city.educationLevels.higher + city.educationLevels.advanced) / 100).toFixed(2)}</div>
              <div>{city.socialMobility.upwardMobility}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchDemographicsData}
    >
      <div className="demographics-screen">
        {/* City Selector */}
        <div className="city-selector">
          <label htmlFor="citySelect">Select City: </label>
          <select 
            id="citySelect" 
            value={selectedCityId} 
            onChange={(e) => setSelectedCityId(e.target.value)}
          >
            <option value="">Select a city...</option>
            {demographicsData?.cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <button className="btn secondary" onClick={simulateDemographics} disabled={loading}>
            ⏭️ Simulate 5 Years
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            📈 Trends
          </button>
          <button 
            className={`tab ${activeTab === 'mobility' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobility')}
          >
            🚀 Social Mobility
          </button>
          <button 
            className={`tab ${activeTab === 'projections' ? 'active' : ''}`}
            onClick={() => setActiveTab('projections')}
          >
            🔮 Projections
          </button>
          <button 
            className={`tab ${activeTab === 'comparative' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparative')}
          >
            ⚖️ Comparative
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {loading && <div className="loading">Loading demographics data...</div>}
          {!loading && activeTab === 'overview' && renderOverview()}
          {!loading && activeTab === 'trends' && renderTrends()}
          {!loading && activeTab === 'mobility' && renderMobility()}
          {!loading && activeTab === 'projections' && renderProjections()}
          {!loading && activeTab === 'comparative' && renderComparative()}
        </div>
      </div>
    </BaseScreen>
  );
};

export default DemographicsScreen;
