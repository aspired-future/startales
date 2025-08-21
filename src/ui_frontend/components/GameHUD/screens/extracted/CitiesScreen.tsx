import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './CitiesScreen.css';

interface City {
  id: string;
  name: string;
  region: string;
  population: number;
  area: number;
  founded: string;
  mayor: string;
  coordinates: { lat: number; lng: number };
  climate: string;
  terrain: string[];
  specializations: CitySpecialization[];
  infrastructure: Infrastructure;
  economy: CityEconomy;
  demographics: CityDemographics;
  quality: QualityMetrics;
  growth: GrowthMetrics;
}

interface CitySpecialization {
  id: string;
  name: string;
  type: 'industrial' | 'commercial' | 'residential' | 'research' | 'cultural' | 'military' | 'agricultural' | 'mining';
  level: number;
  efficiency: number;
  capacity: number;
  workers: number;
  output: number;
  requirements: string[];
  benefits: string[];
  upgrades: Array<{
    name: string;
    cost: number;
    benefit: string;
    available: boolean;
  }>;
}

interface Infrastructure {
  transportation: {
    roads: { quality: number; coverage: number; capacity: number };
    publicTransit: { coverage: number; efficiency: number; ridership: number };
    airports: { count: number; capacity: number; traffic: number };
    ports: { count: number; capacity: number; throughput: number };
  };
  utilities: {
    power: { capacity: number; usage: number; reliability: number; renewable: number };
    water: { capacity: number; usage: number; quality: number; treatment: number };
    waste: { capacity: number; recycling: number; efficiency: number };
    communications: { coverage: number; speed: number; reliability: number };
  };
  services: {
    healthcare: { hospitals: number; coverage: number; quality: number };
    education: { schools: number; universities: number; literacy: number };
    emergency: { police: number; fire: number; response: number };
    recreation: { parks: number; facilities: number; satisfaction: number };
  };
}

interface CityEconomy {
  gdp: number;
  gdpPerCapita: number;
  unemployment: number;
  averageIncome: number;
  costOfLiving: number;
  businessCount: number;
  sectors: Array<{
    name: string;
    contribution: number;
    employment: number;
    growth: number;
  }>;
  trade: {
    imports: number;
    exports: number;
    balance: number;
    partners: string[];
  };
}

interface CityDemographics {
  ageGroups: { [key: string]: number };
  education: { [key: string]: number };
  income: { [key: string]: number };
  employment: { [key: string]: number };
  migration: {
    inflow: number;
    outflow: number;
    net: number;
    reasons: string[];
  };
  diversity: {
    species: { [key: string]: number };
    cultures: string[];
    languages: string[];
  };
}

interface QualityMetrics {
  overall: number;
  environment: number;
  safety: number;
  healthcare: number;
  education: number;
  economy: number;
  infrastructure: number;
  culture: number;
  governance: number;
}

interface GrowthMetrics {
  populationGrowth: number;
  economicGrowth: number;
  infrastructureGrowth: number;
  sustainabilityScore: number;
  innovationIndex: number;
  competitivenessRank: number;
  trends: Array<{
    metric: string;
    change: number;
    period: string;
  }>;
}

interface CityAnalytics {
  totalCities: number;
  totalPopulation: number;
  averageQuality: number;
  topPerformingCities: Array<{
    id: string;
    name: string;
    score: number;
    category: string;
  }>;
  specializationDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  growthTrends: Array<{
    period: string;
    population: number;
    gdp: number;
    quality: number;
  }>;
  challenges: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    affectedCities: number;
    description: string;
  }>;
}

interface CitiesData {
  cities: City[];
  analytics: CityAnalytics;
}

const CitiesScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [citiesData, setCitiesData] = useState<CitiesData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specializations' | 'infrastructure' | 'analytics' | 'comparison'>('overview');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/cities', description: 'Get all cities' },
    { method: 'GET', path: '/api/cities/:id', description: 'Get city details' },
    { method: 'GET', path: '/api/cities/:id/specializations', description: 'Get city specializations' },
    { method: 'GET', path: '/api/cities/:id/infrastructure', description: 'Get city infrastructure' },
    { method: 'GET', path: '/api/cities/analytics', description: 'Get cities analytics' },
    { method: 'POST', path: '/api/cities', description: 'Create new city' },
    { method: 'POST', path: '/api/cities/:id/simulate', description: 'Simulate city month' },
    { method: 'PUT', path: '/api/cities/:id', description: 'Update city' },
    { method: 'DELETE', path: '/api/cities/:id', description: 'Delete city' }
  ];

  const fetchCitiesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        citiesRes,
        analyticsRes
      ] = await Promise.all([
        fetch('/api/cities'),
        fetch('/api/cities/analytics')
      ]);

      const [
        cities,
        analytics
      ] = await Promise.all([
        citiesRes.json(),
        analyticsRes.json()
      ]);

      setCitiesData({
        cities: cities.cities || generateMockCities(),
        analytics: analytics.analytics || generateMockAnalytics()
      });

      // Set first city as selected if none selected
      if (!selectedCity && cities.cities && cities.cities.length > 0) {
        setSelectedCity(cities.cities[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch cities data:', err);
      // Use mock data as fallback
      const mockCities = generateMockCities();
      setCitiesData({
        cities: mockCities,
        analytics: generateMockAnalytics()
      });
      if (!selectedCity && mockCities.length > 0) {
        setSelectedCity(mockCities[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchCitiesData();
  }, [fetchCitiesData]);

  const generateMockCities = (): City[] => [
    {
      id: 'city-1',
      name: 'New Terra Capital',
      region: 'Core Worlds',
      population: 15000000,
      area: 2500,
      founded: '2387',
      mayor: 'Elena Rodriguez',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      climate: 'Temperate',
      terrain: ['Urban', 'Coastal', 'Plains'],
      specializations: [
        {
          id: 'spec-1',
          name: 'Government Hub',
          type: 'commercial',
          level: 5,
          efficiency: 94,
          capacity: 100000,
          workers: 85000,
          output: 1200000,
          requirements: ['High Education', 'Advanced Infrastructure'],
          benefits: ['Political Influence', 'Administrative Efficiency'],
          upgrades: [
            { name: 'Digital Governance', cost: 500000, benefit: '+15% efficiency', available: true },
            { name: 'Diplomatic Quarter', cost: 750000, benefit: '+20% influence', available: false }
          ]
        },
        {
          id: 'spec-2',
          name: 'Financial District',
          type: 'commercial',
          level: 4,
          efficiency: 87,
          capacity: 75000,
          workers: 68000,
          output: 950000,
          requirements: ['High Security', 'Communications'],
          benefits: ['Economic Growth', 'Trade Facilitation'],
          upgrades: [
            { name: 'Quantum Trading', cost: 400000, benefit: '+25% output', available: true }
          ]
        }
      ],
      infrastructure: {
        transportation: {
          roads: { quality: 92, coverage: 95, capacity: 85 },
          publicTransit: { coverage: 88, efficiency: 91, ridership: 12000000 },
          airports: { count: 3, capacity: 50000000, traffic: 45000000 },
          ports: { count: 2, capacity: 25000000, throughput: 22000000 }
        },
        utilities: {
          power: { capacity: 15000, usage: 12500, reliability: 99.2, renewable: 65 },
          water: { capacity: 2000000, usage: 1800000, quality: 98, treatment: 95 },
          waste: { capacity: 500000, recycling: 78, efficiency: 92 },
          communications: { coverage: 99, speed: 1000, reliability: 99.8 }
        },
        services: {
          healthcare: { hospitals: 45, coverage: 98, quality: 94 },
          education: { schools: 1200, universities: 25, literacy: 99.1 },
          emergency: { police: 15000, fire: 3500, response: 4.2 },
          recreation: { parks: 350, facilities: 850, satisfaction: 87 }
        }
      },
      economy: {
        gdp: 850000000000,
        gdpPerCapita: 56667,
        unemployment: 3.2,
        averageIncome: 75000,
        costOfLiving: 125,
        businessCount: 450000,
        sectors: [
          { name: 'Government', contribution: 25, employment: 18, growth: 2.1 },
          { name: 'Finance', contribution: 22, employment: 15, growth: 4.5 },
          { name: 'Technology', contribution: 18, employment: 12, growth: 8.2 },
          { name: 'Services', contribution: 20, employment: 35, growth: 3.1 },
          { name: 'Manufacturing', contribution: 15, employment: 20, growth: 1.8 }
        ],
        trade: {
          imports: 125000000000,
          exports: 145000000000,
          balance: 20000000000,
          partners: ['Mars Colony', 'Europa Station', 'Titan Base']
        }
      },
      demographics: {
        ageGroups: { '0-17': 18, '18-34': 28, '35-54': 32, '55-74': 18, '75+': 4 },
        education: { 'Primary': 15, 'Secondary': 35, 'Higher': 40, 'Advanced': 10 },
        income: { 'Low': 15, 'Middle': 55, 'High': 25, 'Ultra': 5 },
        employment: { 'Full-time': 68, 'Part-time': 15, 'Unemployed': 3.2, 'Retired': 13.8 },
        migration: {
          inflow: 250000,
          outflow: 180000,
          net: 70000,
          reasons: ['Economic Opportunity', 'Education', 'Quality of Life']
        },
        diversity: {
          species: { 'Human': 85, 'Zentaurian': 8, 'Synthetic': 4, 'Other': 3 },
          cultures: ['Terran', 'Colonial', 'Neo-European', 'Pan-Asian', 'Afro-Futurist'],
          languages: ['Standard', 'Mandarin', 'Spanish', 'Arabic', 'Zentaurian']
        }
      },
      quality: {
        overall: 89,
        environment: 82,
        safety: 91,
        healthcare: 94,
        education: 96,
        economy: 88,
        infrastructure: 92,
        culture: 85,
        governance: 87
      },
      growth: {
        populationGrowth: 1.8,
        economicGrowth: 3.2,
        infrastructureGrowth: 2.1,
        sustainabilityScore: 78,
        innovationIndex: 92,
        competitivenessRank: 3,
        trends: [
          { metric: 'Population', change: 1.8, period: 'Annual' },
          { metric: 'GDP', change: 3.2, period: 'Annual' },
          { metric: 'Quality of Life', change: 0.8, period: 'Annual' }
        ]
      }
    },
    {
      id: 'city-2',
      name: 'Mars Industrial Complex',
      region: 'Mars Colony',
      population: 8500000,
      area: 1800,
      founded: '2395',
      mayor: 'Commander Sarah Chen',
      coordinates: { lat: -14.5684, lng: 175.4728 },
      climate: 'Controlled Atmosphere',
      terrain: ['Industrial', 'Desert', 'Underground'],
      specializations: [
        {
          id: 'spec-3',
          name: 'Heavy Manufacturing',
          type: 'industrial',
          level: 5,
          efficiency: 96,
          capacity: 150000,
          workers: 135000,
          output: 2100000,
          requirements: ['Raw Materials', 'Energy Grid'],
          benefits: ['Industrial Output', 'Export Revenue'],
          upgrades: [
            { name: 'Automated Assembly', cost: 800000, benefit: '+30% efficiency', available: true }
          ]
        },
        {
          id: 'spec-4',
          name: 'Mining Operations',
          type: 'mining',
          level: 4,
          efficiency: 89,
          capacity: 80000,
          workers: 72000,
          output: 1600000,
          requirements: ['Specialized Equipment', 'Safety Systems'],
          benefits: ['Resource Extraction', 'Material Supply'],
          upgrades: [
            { name: 'Deep Core Mining', cost: 600000, benefit: '+40% output', available: true }
          ]
        }
      ],
      infrastructure: {
        transportation: {
          roads: { quality: 88, coverage: 85, capacity: 90 },
          publicTransit: { coverage: 75, efficiency: 88, ridership: 6500000 },
          airports: { count: 2, capacity: 15000000, traffic: 12000000 },
          ports: { count: 1, capacity: 8000000, throughput: 7500000 }
        },
        utilities: {
          power: { capacity: 12000, usage: 11200, reliability: 97.8, renewable: 45 },
          water: { capacity: 1200000, usage: 1100000, quality: 96, treatment: 98 },
          waste: { capacity: 350000, recycling: 85, efficiency: 94 },
          communications: { coverage: 95, speed: 800, reliability: 98.5 }
        },
        services: {
          healthcare: { hospitals: 28, coverage: 92, quality: 89 },
          education: { schools: 650, universities: 8, literacy: 97.8 },
          emergency: { police: 8500, fire: 2200, response: 5.1 },
          recreation: { parks: 120, facilities: 380, satisfaction: 79 }
        }
      },
      economy: {
        gdp: 425000000000,
        gdpPerCapita: 50000,
        unemployment: 2.8,
        averageIncome: 68000,
        costOfLiving: 110,
        businessCount: 185000,
        sectors: [
          { name: 'Manufacturing', contribution: 45, employment: 38, growth: 5.2 },
          { name: 'Mining', contribution: 25, employment: 22, growth: 3.8 },
          { name: 'Technology', contribution: 15, employment: 18, growth: 7.1 },
          { name: 'Services', contribution: 15, employment: 22, growth: 2.9 }
        ],
        trade: {
          imports: 85000000000,
          exports: 165000000000,
          balance: 80000000000,
          partners: ['New Terra', 'Europa Station', 'Asteroid Belt']
        }
      },
      demographics: {
        ageGroups: { '0-17': 22, '18-34': 35, '35-54': 28, '55-74': 13, '75+': 2 },
        education: { 'Primary': 18, 'Secondary': 42, 'Higher': 32, 'Advanced': 8 },
        income: { 'Low': 12, 'Middle': 62, 'High': 22, 'Ultra': 4 },
        employment: { 'Full-time': 72, 'Part-time': 12, 'Unemployed': 2.8, 'Retired': 13.2 },
        migration: {
          inflow: 180000,
          outflow: 95000,
          net: 85000,
          reasons: ['Industrial Jobs', 'Higher Wages', 'Career Growth']
        },
        diversity: {
          species: { 'Human': 92, 'Synthetic': 5, 'Zentaurian': 2, 'Other': 1 },
          cultures: ['Colonial', 'Industrial', 'Neo-American', 'European'],
          languages: ['Standard', 'Technical', 'Russian', 'German']
        }
      },
      quality: {
        overall: 82,
        environment: 75,
        safety: 88,
        healthcare: 89,
        education: 85,
        economy: 91,
        infrastructure: 88,
        culture: 72,
        governance: 84
      },
      growth: {
        populationGrowth: 2.5,
        economicGrowth: 4.8,
        infrastructureGrowth: 3.2,
        sustainabilityScore: 68,
        innovationIndex: 78,
        competitivenessRank: 7,
        trends: [
          { metric: 'Population', change: 2.5, period: 'Annual' },
          { metric: 'GDP', change: 4.8, period: 'Annual' },
          { metric: 'Industrial Output', change: 5.2, period: 'Annual' }
        ]
      }
    }
  ];

  const generateMockAnalytics = (): CityAnalytics => ({
    totalCities: 47,
    totalPopulation: 125000000,
    averageQuality: 84.2,
    topPerformingCities: [
      { id: 'city-1', name: 'New Terra Capital', score: 89, category: 'Overall Quality' },
      { id: 'city-2', name: 'Mars Industrial Complex', score: 91, category: 'Economic Growth' },
      { id: 'city-3', name: 'Europa Research Station', score: 95, category: 'Innovation' },
      { id: 'city-4', name: 'Titan Agricultural Hub', score: 87, category: 'Sustainability' }
    ],
    specializationDistribution: [
      { type: 'Commercial', count: 15, percentage: 31.9 },
      { type: 'Industrial', count: 12, percentage: 25.5 },
      { type: 'Research', count: 8, percentage: 17.0 },
      { type: 'Agricultural', count: 6, percentage: 12.8 },
      { type: 'Military', count: 4, percentage: 8.5 },
      { type: 'Cultural', count: 2, percentage: 4.3 }
    ],
    growthTrends: [
      { period: '2024', population: 125000000, gdp: 2.8e12, quality: 84.2 },
      { period: '2023', population: 122000000, gdp: 2.6e12, quality: 83.1 },
      { period: '2022', population: 119000000, gdp: 2.4e12, quality: 82.5 },
      { period: '2021', population: 116000000, gdp: 2.2e12, quality: 81.8 },
      { period: '2020', population: 113000000, gdp: 2.1e12, quality: 81.2 }
    ],
    challenges: [
      {
        type: 'Infrastructure Strain',
        severity: 'medium',
        affectedCities: 18,
        description: 'Rapid population growth outpacing infrastructure development'
      },
      {
        type: 'Environmental Impact',
        severity: 'high',
        affectedCities: 12,
        description: 'Industrial activities affecting local ecosystems'
      },
      {
        type: 'Housing Shortage',
        severity: 'medium',
        affectedCities: 23,
        description: 'Insufficient affordable housing for growing populations'
      }
    ]
  });

  const getCurrentCity = (): City | null => {
    if (!citiesData || !selectedCity) return null;
    return citiesData.cities.find(city => city.id === selectedCity) || null;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getSpecializationColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      industrial: '#ef4444',
      commercial: '#3b82f6',
      residential: '#10b981',
      research: '#8b5cf6',
      cultural: '#ec4899',
      military: '#f59e0b',
      agricultural: '#84cc16',
      mining: '#78716c'
    };
    return colors[type] || '#6b7280';
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleSimulateCity = async () => {
    if (!selectedCity) return;
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchCitiesData();
    } catch (err) {
      setError('Failed to simulate city');
    } finally {
      setLoading(false);
    }
  };

  const currentCity = getCurrentCity();

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchCitiesData}
    >
      <div className="cities-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🏙️ Overview
          </button>
          <button 
            className={`tab ${activeTab === 'specializations' ? 'active' : ''}`}
            onClick={() => setActiveTab('specializations')}
          >
            🏭 Specializations
          </button>
          <button 
            className={`tab ${activeTab === 'infrastructure' ? 'active' : ''}`}
            onClick={() => setActiveTab('infrastructure')}
          >
            🚇 Infrastructure
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            ⚖️ Comparison
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading cities data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && citiesData && (
            <>
              {/* City Selector - shown on all tabs except analytics */}
              {activeTab !== 'analytics' && (
                <div className="city-selector">
                  <label htmlFor="citySelect">Select City:</label>
                  <select 
                    id="citySelect" 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="city-select"
                  >
                    <option value="">Select a city...</option>
                    {citiesData.cities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {activeTab === 'overview' && (
                    <div className="city-actions">
                      <button className="action-btn" onClick={handleSimulateCity}>Simulate Month</button>
                      <button className="action-btn secondary">Create New City</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'overview' && currentCity && (
                <div className="overview-tab">
                  <div className="city-header">
                    <div className="city-title">
                      <h3>{currentCity.name}</h3>
                      <div className="city-subtitle">
                        <span className="city-region">{currentCity.region}</span>
                        <span className="city-founded">Founded {currentCity.founded}</span>
                        <span className="city-mayor">Mayor: {currentCity.mayor}</span>
                      </div>
                    </div>
                    <div className="city-quality">
                      <div className="quality-score">{currentCity.quality.overall}</div>
                      <div className="quality-label">Quality Score</div>
                    </div>
                  </div>

                  <div className="city-stats">
                    <div className="stat-card">
                      <div className="stat-icon">👥</div>
                      <div className="stat-info">
                        <div className="stat-value">{formatNumber(currentCity.population)}</div>
                        <div className="stat-label">Population</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🏢</div>
                      <div className="stat-info">
                        <div className="stat-value">{currentCity.area} km²</div>
                        <div className="stat-label">Area</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💰</div>
                      <div className="stat-info">
                        <div className="stat-value">${formatNumber(currentCity.economy.gdpPerCapita)}</div>
                        <div className="stat-label">GDP per Capita</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <div className="stat-info">
                        <div className="stat-value">{currentCity.growth.populationGrowth}%</div>
                        <div className="stat-label">Growth Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="city-details">
                    <div className="detail-section">
                      <h4>🌍 Geography & Climate</h4>
                      <div className="detail-content">
                        <div className="detail-item">
                          <strong>Climate:</strong> {currentCity.climate}
                        </div>
                        <div className="detail-item">
                          <strong>Terrain:</strong> {currentCity.terrain.join(', ')}
                        </div>
                        <div className="detail-item">
                          <strong>Coordinates:</strong> {currentCity.coordinates.lat}°, {currentCity.coordinates.lng}°
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>📊 Quality Metrics</h4>
                      <div className="quality-grid">
                        {Object.entries(currentCity.quality).filter(([key]) => key !== 'overall').map(([key, value]) => (
                          <div key={key} className="quality-item">
                            <div className="quality-name">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            <div className="quality-bar">
                              <div className="quality-fill" style={{ width: `${value}%` }}></div>
                            </div>
                            <div className="quality-value">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>🏭 Economy Overview</h4>
                      <div className="economy-overview">
                        <div className="economy-metrics">
                          <div className="economy-metric">
                            <span className="metric-label">GDP:</span>
                            <span className="metric-value">${formatNumber(currentCity.economy.gdp)}</span>
                          </div>
                          <div className="economy-metric">
                            <span className="metric-label">Unemployment:</span>
                            <span className="metric-value">{currentCity.economy.unemployment}%</span>
                          </div>
                          <div className="economy-metric">
                            <span className="metric-label">Avg Income:</span>
                            <span className="metric-value">${formatNumber(currentCity.economy.averageIncome)}</span>
                          </div>
                          <div className="economy-metric">
                            <span className="metric-label">Businesses:</span>
                            <span className="metric-value">{formatNumber(currentCity.economy.businessCount)}</span>
                          </div>
                        </div>
                        <div className="sector-breakdown">
                          <strong>Economic Sectors:</strong>
                          <div className="sectors-list">
                            {currentCity.economy.sectors.map((sector, i) => (
                              <div key={i} className="sector-item">
                                <span className="sector-name">{sector.name}</span>
                                <span className="sector-contribution">{sector.contribution}% GDP</span>
                                <span className="sector-growth">+{sector.growth}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specializations' && currentCity && (
                <div className="specializations-tab">
                  <div className="specializations-grid">
                    {currentCity.specializations.map((spec) => (
                      <div key={spec.id} className="specialization-card">
                        <div className="spec-header">
                          <div className="spec-name">{spec.name}</div>
                          <div className="spec-type" style={{ backgroundColor: getSpecializationColor(spec.type) }}>
                            {spec.type.toUpperCase()}
                          </div>
                        </div>
                        <div className="spec-level">Level {spec.level}</div>
                        <div className="spec-metrics">
                          <div className="spec-metric">
                            <span className="metric-label">Efficiency:</span>
                            <span className="metric-value">{spec.efficiency}%</span>
                          </div>
                          <div className="spec-metric">
                            <span className="metric-label">Workers:</span>
                            <span className="metric-value">{formatNumber(spec.workers)}</span>
                          </div>
                          <div className="spec-metric">
                            <span className="metric-label">Output:</span>
                            <span className="metric-value">{formatNumber(spec.output)}</span>
                          </div>
                          <div className="spec-metric">
                            <span className="metric-label">Capacity:</span>
                            <span className="metric-value">{Math.round((spec.workers / spec.capacity) * 100)}%</span>
                          </div>
                        </div>
                        <div className="spec-requirements">
                          <strong>Requirements:</strong>
                          <div className="requirements-list">
                            {spec.requirements.map((req, i) => (
                              <span key={i} className="requirement-tag">{req}</span>
                            ))}
                          </div>
                        </div>
                        <div className="spec-benefits">
                          <strong>Benefits:</strong>
                          <div className="benefits-list">
                            {spec.benefits.map((benefit, i) => (
                              <span key={i} className="benefit-tag">{benefit}</span>
                            ))}
                          </div>
                        </div>
                        <div className="spec-upgrades">
                          <strong>Available Upgrades:</strong>
                          <div className="upgrades-list">
                            {spec.upgrades.filter(upgrade => upgrade.available).map((upgrade, i) => (
                              <div key={i} className="upgrade-item">
                                <div className="upgrade-name">{upgrade.name}</div>
                                <div className="upgrade-cost">${formatNumber(upgrade.cost)}</div>
                                <div className="upgrade-benefit">{upgrade.benefit}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Add Specialization</button>
                    <button className="action-btn secondary">Upgrade Existing</button>
                    <button className="action-btn">Specialization Guide</button>
                  </div>
                </div>
              )}

              {activeTab === 'infrastructure' && currentCity && (
                <div className="infrastructure-tab">
                  <div className="infrastructure-sections">
                    <div className="infra-section">
                      <h4>🚗 Transportation</h4>
                      <div className="infra-grid">
                        <div className="infra-item">
                          <div className="infra-name">Roads</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Quality: {currentCity.infrastructure.transportation.roads.quality}%</div>
                            <div className="infra-metric">Coverage: {currentCity.infrastructure.transportation.roads.coverage}%</div>
                            <div className="infra-metric">Capacity: {currentCity.infrastructure.transportation.roads.capacity}%</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Public Transit</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Coverage: {currentCity.infrastructure.transportation.publicTransit.coverage}%</div>
                            <div className="infra-metric">Efficiency: {currentCity.infrastructure.transportation.publicTransit.efficiency}%</div>
                            <div className="infra-metric">Ridership: {formatNumber(currentCity.infrastructure.transportation.publicTransit.ridership)}</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Airports</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Count: {currentCity.infrastructure.transportation.airports.count}</div>
                            <div className="infra-metric">Capacity: {formatNumber(currentCity.infrastructure.transportation.airports.capacity)}</div>
                            <div className="infra-metric">Traffic: {formatNumber(currentCity.infrastructure.transportation.airports.traffic)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="infra-section">
                      <h4>⚡ Utilities</h4>
                      <div className="infra-grid">
                        <div className="infra-item">
                          <div className="infra-name">Power Grid</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Capacity: {formatNumber(currentCity.infrastructure.utilities.power.capacity)} MW</div>
                            <div className="infra-metric">Usage: {formatNumber(currentCity.infrastructure.utilities.power.usage)} MW</div>
                            <div className="infra-metric">Reliability: {currentCity.infrastructure.utilities.power.reliability}%</div>
                            <div className="infra-metric">Renewable: {currentCity.infrastructure.utilities.power.renewable}%</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Water System</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Capacity: {formatNumber(currentCity.infrastructure.utilities.water.capacity)} L/day</div>
                            <div className="infra-metric">Usage: {formatNumber(currentCity.infrastructure.utilities.water.usage)} L/day</div>
                            <div className="infra-metric">Quality: {currentCity.infrastructure.utilities.water.quality}%</div>
                            <div className="infra-metric">Treatment: {currentCity.infrastructure.utilities.water.treatment}%</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Communications</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Coverage: {currentCity.infrastructure.utilities.communications.coverage}%</div>
                            <div className="infra-metric">Speed: {currentCity.infrastructure.utilities.communications.speed} Mbps</div>
                            <div className="infra-metric">Reliability: {currentCity.infrastructure.utilities.communications.reliability}%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="infra-section">
                      <h4>🏥 Services</h4>
                      <div className="infra-grid">
                        <div className="infra-item">
                          <div className="infra-name">Healthcare</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Hospitals: {currentCity.infrastructure.services.healthcare.hospitals}</div>
                            <div className="infra-metric">Coverage: {currentCity.infrastructure.services.healthcare.coverage}%</div>
                            <div className="infra-metric">Quality: {currentCity.infrastructure.services.healthcare.quality}%</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Education</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Schools: {currentCity.infrastructure.services.education.schools}</div>
                            <div className="infra-metric">Universities: {currentCity.infrastructure.services.education.universities}</div>
                            <div className="infra-metric">Literacy: {currentCity.infrastructure.services.education.literacy}%</div>
                          </div>
                        </div>
                        <div className="infra-item">
                          <div className="infra-name">Emergency Services</div>
                          <div className="infra-metrics">
                            <div className="infra-metric">Police: {formatNumber(currentCity.infrastructure.services.emergency.police)}</div>
                            <div className="infra-metric">Fire: {formatNumber(currentCity.infrastructure.services.emergency.fire)}</div>
                            <div className="infra-metric">Response: {currentCity.infrastructure.services.emergency.response} min</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Upgrade Infrastructure</button>
                    <button className="action-btn secondary">Maintenance Schedule</button>
                    <button className="action-btn">Infrastructure Plan</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-overview">
                    <div className="overview-metrics">
                      <div className="overview-metric">
                        <div className="metric-value">{citiesData.analytics.totalCities}</div>
                        <div className="metric-label">Total Cities</div>
                      </div>
                      <div className="overview-metric">
                        <div className="metric-value">{formatNumber(citiesData.analytics.totalPopulation)}</div>
                        <div className="metric-label">Total Population</div>
                      </div>
                      <div className="overview-metric">
                        <div className="metric-value">{citiesData.analytics.averageQuality}</div>
                        <div className="metric-label">Avg Quality Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-sections">
                    <div className="analytics-section">
                      <h4>🏆 Top Performing Cities</h4>
                      <div className="top-cities-list">
                        {citiesData.analytics.topPerformingCities.map((city, i) => (
                          <div key={i} className="top-city-item">
                            <div className="city-rank">#{i + 1}</div>
                            <div className="city-info">
                              <div className="city-name">{city.name}</div>
                              <div className="city-category">{city.category}</div>
                            </div>
                            <div className="city-score">{city.score}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h4>🏭 Specialization Distribution</h4>
                      <div className="specialization-distribution">
                        {citiesData.analytics.specializationDistribution.map((item, i) => (
                          <div key={i} className="distribution-item">
                            <div className="distribution-info">
                              <span className="distribution-name">{item.type}</span>
                              <span className="distribution-count">{item.count} cities</span>
                            </div>
                            <div className="distribution-bar">
                              <div 
                                className="distribution-fill" 
                                style={{ 
                                  width: `${item.percentage}%`,
                                  backgroundColor: getSpecializationColor(item.type.toLowerCase())
                                }}
                              ></div>
                            </div>
                            <span className="distribution-percentage">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="analytics-section">
                      <h4>⚠️ Current Challenges</h4>
                      <div className="challenges-list">
                        {citiesData.analytics.challenges.map((challenge, i) => (
                          <div key={i} className="challenge-item">
                            <div className="challenge-header">
                              <div className="challenge-type">{challenge.type}</div>
                              <div className="challenge-severity" style={{ color: getSeverityColor(challenge.severity) }}>
                                {challenge.severity.toUpperCase()}
                              </div>
                            </div>
                            <div className="challenge-description">{challenge.description}</div>
                            <div className="challenge-affected">Affects {challenge.affectedCities} cities</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Export Data</button>
                    <button className="action-btn">Trend Analysis</button>
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="comparison-tab">
                  <div className="comparison-selector">
                    <div className="selector-group">
                      <label>Compare Cities:</label>
                      <select className="city-select">
                        <option value="">Select first city...</option>
                        {citiesData.cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                      <span className="vs-label">vs</span>
                      <select className="city-select">
                        <option value="">Select second city...</option>
                        {citiesData.cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="comparison-placeholder">
                    <p>Select two cities to compare their metrics, specializations, and performance.</p>
                    <div className="comparison-features">
                      <div className="feature-item">📊 Quality Metrics Comparison</div>
                      <div className="feature-item">🏭 Specialization Analysis</div>
                      <div className="feature-item">💰 Economic Performance</div>
                      <div className="feature-item">🚇 Infrastructure Comparison</div>
                      <div className="feature-item">📈 Growth Trends</div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Compare Cities</button>
                    <button className="action-btn secondary">Benchmark Analysis</button>
                    <button className="action-btn">Export Comparison</button>
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

export default CitiesScreen;
