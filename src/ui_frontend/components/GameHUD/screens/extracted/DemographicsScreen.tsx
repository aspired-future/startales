/**
 * Demographics Screen - Population & Social Statistics
 * 
 * This screen focuses on population demographics including:
 * - Population overview and trends
 * - Age distribution and education levels
 * - Income distribution and social mobility
 * - City-specific demographic data
 * - Population projections and simulations
 * 
 * Distinct from:
 * - Cities Screen: City infrastructure and management
 * - Migration Screen: Population movement and immigration
 * - Health Screen: Health statistics and medical data
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './DemographicsScreen.css';
import '../shared/StandardDesign.css';
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

const DemographicsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [demographicsData, setDemographicsData] = useState<DemographicsData | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'mobility' | 'projections' | 'comparative'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'mobility', label: 'Mobility', icon: '🔄' },
    { id: 'projections', label: 'Projections', icon: '🔮' },
    { id: 'comparative', label: 'Comparative', icon: '🌍' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/demographics', description: 'Get demographics data' }
  ];

  // Utility functions
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
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

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#fbbf24';
      default: return '#6b7280';
    }
  };

  const fetchDemographicsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/demographics');
      if (response.ok) {
        const data = await response.json();
        setDemographicsData(data);
        if (data.cities.length > 0 && !selectedCityId) {
          setSelectedCityId(data.cities[0].id);
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch demographics data:', err);
      // Use comprehensive mock data
      setDemographicsData({
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
              barriers: ['High Cost of Living', 'Limited Local Opportunities', 'Transportation Costs'],
              opportunities: ['Space Industry Growth', 'Research Funding', 'International Collaboration']
            },
            trends: {
              populationGrowth: 3.1,
              migrationRate: 2.5,
              birthRate: 16.8,
              deathRate: 6.2
            }
          },
          {
            id: 'luna-station',
            name: 'Luna Station Beta',
            totalPopulation: 420000,
            ageDistribution: {
              children: 15,
              adults: 72,
              elderly: 13
            },
            educationLevels: {
              elementary: 8,
              secondary: 20,
              higher: 50,
              advanced: 22
            },
            incomeDistribution: {
              low: 10,
              middle: 35,
              high: 40,
              elite: 15
            },
            socialMobility: {
              upwardMobility: 22,
              downwardMobility: 3,
              barriers: ['High Entry Costs', 'Technical Requirements', 'Remote Location'],
              opportunities: ['Lunar Mining', 'Research Facilities', 'Tourism Development']
            },
            trends: {
              populationGrowth: 4.2,
              migrationRate: 3.1,
              birthRate: 18.5,
              deathRate: 5.8
            }
          }
        ],
        selectedCity: null,
        overallStats: [
          { label: 'Total Population', value: '3.77M', trend: 'up', percentage: 2.8 },
          { label: 'Growth Rate', value: '2.8%', trend: 'up', percentage: 0.3 },
          { label: 'Life Expectancy', value: '78.4 years', trend: 'up', percentage: 1.2 },
          { label: 'Fertility Rate', value: '2.1', trend: 'stable', percentage: 0.0 },
          { label: 'Urbanization', value: '87.3%', trend: 'up', percentage: 0.8 },
          { label: 'Diversity Index', value: '0.76', trend: 'up', percentage: 0.05 }
        ],
        projections: [
          { year: 2025, population: 3880000, scenario: 'Optimistic' },
          { year: 2030, population: 4250000, scenario: 'Optimistic' },
          { year: 2035, population: 4650000, scenario: 'Optimistic' },
          { year: 2025, population: 3750000, scenario: 'Realistic' },
          { year: 2030, population: 4050000, scenario: 'Realistic' },
          { year: 2035, population: 4350000, scenario: 'Realistic' },
          { year: 2025, population: 3620000, scenario: 'Conservative' },
          { year: 2030, population: 3850000, scenario: 'Conservative' },
          { year: 2035, population: 4050000, scenario: 'Conservative' }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCityId]);

  useEffect(() => {
    fetchDemographicsData();
  }, [fetchDemographicsData]);

  useEffect(() => {
    if (selectedCityId && demographicsData) {
      const city = demographicsData.cities.find(c => c.id === selectedCityId);
      if (city) {
        setDemographicsData(prev => prev ? { ...prev, selectedCity: city } : null);
      }
    }
  }, [selectedCityId, demographicsData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Demographics Overview - Full panel width */}
      <div className="standard-panel social-theme">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Demographics Overview</h3>
        <div className="standard-metric-grid">
          {demographicsData?.overallStats?.map((stat, index) => (
            <div className="standard-metric" key={index}>
              <span>{stat.label}</span>
              <span className="standard-metric-value">{stat.value}</span>
              {stat.trend && (
                <span style={{ 
                  color: getTrendColor(stat.trend),
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {getTrendIcon(stat.trend)} {stat.percentage !== undefined && `${stat.percentage > 0 ? '+' : ''}${stat.percentage}%`}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Demographics Analysis')}>Demographics Analysis</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Population Report')}>Population Report</button>
        </div>
      </div>

      {/* City Selection - Full panel width */}
      <div className="standard-panel social-theme">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏙️ City Demographics</h3>
        <div style={{ marginBottom: '1rem' }}>
          <select 
            value={selectedCityId} 
            onChange={(e) => setSelectedCityId(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#e0e6ed',
              fontSize: '1rem'
            }}
          >
            {demographicsData?.cities?.map(city => (
              <option key={city.id} value={city.id}>{city.name} ({formatNumber(city.totalPopulation)})</option>
            ))}
          </select>
        </div>
        
        {demographicsData?.selectedCity && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>👥 Age Distribution</h4>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Children (0-17):</span>
                  <span>{demographicsData.selectedCity.ageDistribution.children}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Adults (18-64):</span>
                  <span>{demographicsData.selectedCity.ageDistribution.adults}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Elderly (65+):</span>
                  <span>{demographicsData.selectedCity.ageDistribution.elderly}%</span>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>🎓 Education Levels</h4>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Elementary:</span>
                  <span>{demographicsData.selectedCity.educationLevels.elementary}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Secondary:</span>
                  <span>{demographicsData.selectedCity.educationLevels.secondary}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Higher:</span>
                  <span>{demographicsData.selectedCity.educationLevels.higher}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Advanced:</span>
                  <span>{demographicsData.selectedCity.educationLevels.advanced}%</span>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>💰 Income Distribution</h4>
              <div style={{ fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Low:</span>
                  <span>{demographicsData.selectedCity.incomeDistribution.low}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Middle:</span>
                  <span>{demographicsData.selectedCity.incomeDistribution.middle}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>High:</span>
                  <span>{demographicsData.selectedCity.incomeDistribution.high}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Elite:</span>
                  <span>{demographicsData.selectedCity.incomeDistribution.elite}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demographics Charts - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel social-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Demographics Charts</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <PieChart
                data={demographicsData?.selectedCity ? [
                  { label: 'Children', value: demographicsData.selectedCity.ageDistribution.children, color: '#10b981' },
                  { label: 'Adults', value: demographicsData.selectedCity.ageDistribution.adults, color: '#3b82f6' },
                  { label: 'Elderly', value: demographicsData.selectedCity.ageDistribution.elderly, color: '#f59e0b' }
                ] : []}
                title="👥 Age Distribution"
                size={200}
                showLegend={true}
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={demographicsData?.selectedCity ? [
                  { label: 'Elementary', value: demographicsData.selectedCity.educationLevels.elementary, color: '#10b981' },
                  { label: 'Secondary', value: demographicsData.selectedCity.educationLevels.secondary, color: '#3b82f6' },
                  { label: 'Higher', value: demographicsData.selectedCity.educationLevels.higher, color: '#8b5cf6' },
                  { label: 'Advanced', value: demographicsData.selectedCity.educationLevels.advanced, color: '#f59e0b' }
                ] : []}
                title="🎓 Education Levels"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTrends = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📈 Demographic Trends</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Analyze Trends')}>Analyze Trends</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Export Trends')}>Export Trends</button>
        </div>
        
        {demographicsData?.selectedCity && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div className="chart-container">
              <LineChart
                data={[
                  { label: '2020', value: demographicsData.selectedCity.trends.populationGrowth * 0.8 },
                  { label: '2021', value: demographicsData.selectedCity.trends.populationGrowth * 0.9 },
                  { label: '2022', value: demographicsData.selectedCity.trends.populationGrowth * 0.95 },
                  { label: '2023', value: demographicsData.selectedCity.trends.populationGrowth },
                  { label: '2024', value: demographicsData.selectedCity.trends.populationGrowth * 1.05 }
                ]}
                title="📈 Population Growth Trend"
                color="#10b981"
                height={250}
                width={400}
              />
            </div>
            <div className="chart-container">
              <BarChart
                data={[
                  { label: 'Population Growth', value: demographicsData.selectedCity.trends.populationGrowth, color: '#10b981' },
                  { label: 'Migration Rate', value: demographicsData.selectedCity.trends.migrationRate, color: '#3b82f6' },
                  { label: 'Birth Rate', value: demographicsData.selectedCity.trends.birthRate, color: '#8b5cf6' },
                  { label: 'Death Rate', value: demographicsData.selectedCity.trends.deathRate, color: '#ef4444' }
                ]}
                title="📊 Key Demographic Rates"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
          </div>
        )}
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Population</th>
                <th>Growth Rate</th>
                <th>Migration Rate</th>
                <th>Birth Rate</th>
                <th>Death Rate</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {demographicsData?.cities?.map((city) => (
                <tr key={city.id}>
                  <td>
                    <strong>{city.name}</strong>
                    {city.id === selectedCityId && <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>📍</span>}
                  </td>
                  <td>{formatNumber(city.totalPopulation)}</td>
                  <td>{city.trends.populationGrowth}%</td>
                  <td>{city.trends.migrationRate}%</td>
                  <td>{city.trends.birthRate}%</td>
                  <td>{city.trends.deathRate}%</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: city.trends.populationGrowth > 2 ? '#10b981' : city.trends.populationGrowth > 1 ? '#fbbf24' : '#ef4444', 
                      color: 'white' 
                    }}>
                      {city.trends.populationGrowth > 2 ? 'High Growth' : city.trends.populationGrowth > 1 ? 'Moderate' : 'Low Growth'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMobility = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🔄 Social Mobility</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Mobility Analysis')}>Mobility Analysis</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Policy Recommendations')}>Policy Recommendations</button>
        </div>
        
        {demographicsData?.selectedCity && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
            <div className="chart-container">
              <PieChart
                data={[
                  { label: 'Upward Mobility', value: demographicsData.selectedCity.socialMobility.upwardMobility, color: '#10b981' },
                  { label: 'Downward Mobility', value: demographicsData.selectedCity.socialMobility.downwardMobility, color: '#ef4444' },
                  { label: 'Stable', value: 100 - demographicsData.selectedCity.socialMobility.upwardMobility - demographicsData.selectedCity.socialMobility.downwardMobility, color: '#fbbf24' }
                ]}
                title="🔄 Social Mobility Distribution"
                size={200}
                showLegend={true}
              />
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Mobility Metrics</h4>
              <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Upward Mobility:</span>
                  <span style={{ color: '#10b981' }}>{demographicsData.selectedCity.socialMobility.upwardMobility}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Downward Mobility:</span>
                  <span style={{ color: '#ef4444' }}>{demographicsData.selectedCity.socialMobility.downwardMobility}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stability Rate:</span>
                  <span style={{ color: '#fbbf24' }}>{100 - demographicsData.selectedCity.socialMobility.upwardMobility - demographicsData.selectedCity.socialMobility.downwardMobility}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>🚧 Mobility Barriers</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Barrier</th>
                    <th>Impact Level</th>
                  </tr>
                </thead>
                <tbody>
                  {demographicsData?.selectedCity?.socialMobility.barriers.map((barrier, index) => (
                    <tr key={index}>
                      <td>{barrier}</td>
                      <td>
                        <span style={{ 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem', 
                          backgroundColor: '#ef4444', 
                          color: 'white' 
                        }}>
                          High
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>💡 Mobility Opportunities</h4>
            <div className="standard-table-container">
              <table className="standard-data-table">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Potential Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {demographicsData?.selectedCity?.socialMobility.opportunities.map((opportunity, index) => (
                    <tr key={index}>
                      <td>{opportunity}</td>
                      <td>
                        <span style={{ 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem', 
                          backgroundColor: '#10b981', 
                          color: 'white' 
                        }}>
                          High
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjections = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🔮 Population Projections</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Run Simulation')}>Run Simulation</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Export Projections')}>Export Projections</button>
        </div>
        
        <div className="chart-container" style={{ marginBottom: '2rem' }}>
          <LineChart
            data={demographicsData?.projections?.filter(p => p.scenario === 'Realistic').map(p => ({
              label: p.year.toString(),
              value: p.population / 1000000
            })) || []}
            title="📈 Population Projections (Realistic Scenario)"
            color="#10b981"
            height={300}
            width={600}
          />
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Optimistic</th>
                <th>Realistic</th>
                <th>Conservative</th>
                <th>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {[2025, 2030, 2035].map(year => {
                const optimistic = demographicsData?.projections?.find(p => p.year === year && p.scenario === 'Optimistic');
                const realistic = demographicsData?.projections?.find(p => p.year === year && p.scenario === 'Realistic');
                const conservative = demographicsData?.projections?.find(p => p.year === year && p.scenario === 'Conservative');
                
                return (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{optimistic ? formatNumber(optimistic.population) : '-'}</td>
                    <td>{realistic ? formatNumber(realistic.population) : '-'}</td>
                    <td>{conservative ? formatNumber(conservative.population) : '-'}</td>
                    <td>
                      {realistic && demographicsData?.overallStats?.[0]?.value ? 
                        `${(((realistic.population / 3770000) - 1) * 100).toFixed(1)}%` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderComparative = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel social-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🌍 Comparative Analysis</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Comparative Analysis')}>Comparative Analysis</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Benchmark Report')}>Benchmark Report</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div className="chart-container">
            <BarChart
              data={demographicsData?.cities?.map(city => ({
                label: city.name,
                value: city.totalPopulation / 1000000,
                color: city.id === selectedCityId ? '#10b981' : '#3b82f6'
              })) || []}
              title="🏙️ Population Comparison"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <BarChart
              data={demographicsData?.cities?.map(city => ({
                label: city.name,
                value: city.trends.populationGrowth,
                color: city.id === selectedCityId ? '#10b981' : '#3b82f6'
              })) || []}
              title="📈 Growth Rate Comparison"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Population</th>
                <th>Growth Rate</th>
                <th>Education Level</th>
                <th>Income Level</th>
                <th>Mobility Score</th>
              </tr>
            </thead>
            <tbody>
              {demographicsData?.cities?.map((city) => {
                const avgEducation = (city.educationLevels.higher + city.educationLevels.advanced) / 2;
                const avgIncome = (city.incomeDistribution.high + city.incomeDistribution.elite) / 2;
                const mobilityScore = city.socialMobility.upwardMobility - city.socialMobility.downwardMobility;
                
                return (
                  <tr key={city.id}>
                    <td>
                      <strong>{city.name}</strong>
                      {city.id === selectedCityId && <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>📍</span>}
                    </td>
                    <td>{formatNumber(city.totalPopulation)}</td>
                    <td>{city.trends.populationGrowth}%</td>
                    <td>{avgEducation.toFixed(1)}%</td>
                    <td>{avgIncome.toFixed(1)}%</td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        backgroundColor: mobilityScore > 5 ? '#10b981' : mobilityScore > 0 ? '#fbbf24' : '#ef4444', 
                        color: 'white' 
                      }}>
                        {mobilityScore > 5 ? 'High' : mobilityScore > 0 ? 'Moderate' : 'Low'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
      onRefresh={fetchDemographicsData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && demographicsData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'trends' && renderTrends()}
              {activeTab === 'mobility' && renderMobility()}
              {activeTab === 'projections' && renderProjections()}
              {activeTab === 'comparative' && renderComparative()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading demographics data...' : 'No demographics data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default DemographicsScreen;
