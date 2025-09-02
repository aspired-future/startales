/**
 * Cities Screen - Planetary Cities & Infrastructure Management
 * 
 * This screen focuses on city management including:
 * - Planetary overview and city listings
 * - City specializations and development
 * - Infrastructure management and upgrades
 * - City analytics and performance metrics
 * - Economic and demographic data
 * 
 * Distinct from:
 * - Demographics Screen: Population statistics and trends
 * - Migration Screen: Population movement and immigration
 * - Health Screen: Health statistics and medical data
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './CitiesScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

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
  livability: number;
  sustainability: number;
  innovation: number;
  safety: number;
  culture: number;
  overall: number;
}

interface GrowthMetrics {
  populationGrowth: number;
  economicGrowth: number;
  infrastructureGrowth: number;
  qualityImprovement: number;
  challenges: string[];
  opportunities: string[];
}

interface CitiesData {
  cities: City[];
  selectedCity: City | null;
  analytics: {
    totalCities: number;
    totalPopulation: number;
    averageQuality: number;
    specializationDistribution: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    challenges: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      affectedCities: number;
    }>;
  };
}

const CitiesScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [citiesData, setCitiesData] = useState<CitiesData | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'cities' | 'specializations' | 'infrastructure' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '🌍' },
    { id: 'cities', label: 'Cities', icon: '🏙️' },
    { id: 'specializations', label: 'Specializations', icon: '⚙️' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/cities', description: 'Get cities data' }
  ];

  // Utility functions
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getQualityColor = (quality: number): string => {
    if (quality >= 80) return '#10b981';
    if (quality >= 60) return '#fbbf24';
    if (quality >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getSpecializationColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      industrial: '#3b82f6',
      commercial: '#10b981',
      residential: '#8b5cf6',
      research: '#f59e0b',
      cultural: '#ec4899',
      military: '#ef4444',
      agricultural: '#84cc16',
      mining: '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getSeverityColor = (severity: string): string => {
    const colors: { [key: string]: string } = {
      low: '#10b981',
      medium: '#fbbf24',
      high: '#f59e0b',
      critical: '#ef4444'
    };
    return colors[severity] || '#6b7280';
  };

  const fetchCitiesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/cities');
      if (response.ok) {
        const data = await response.json();
        setCitiesData(data);
        if (data.cities.length > 0 && !selectedCityId) {
          setSelectedCityId(data.cities[0].id);
        }
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch cities data:', err);
      // Use comprehensive mock data
      setCitiesData({
        cities: [
          {
            id: 'new-terra',
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
                id: 'gov-hub',
                name: 'Government Hub',
                type: 'commercial',
                level: 5,
                efficiency: 95,
                capacity: 1000,
                workers: 850,
                output: 425000,
                requirements: ['Advanced Infrastructure', 'Skilled Workforce'],
                benefits: ['Political Stability', 'Economic Growth', 'Cultural Influence'],
                upgrades: [
                  { name: 'AI Governance', cost: 5000000, benefit: '+10% Efficiency', available: true },
                  { name: 'Smart City Integration', cost: 3000000, benefit: '+15% Capacity', available: true }
                ]
              },
              {
                id: 'tech-corridor',
                name: 'Technology Corridor',
                type: 'research',
                level: 4,
                efficiency: 88,
                capacity: 800,
                workers: 720,
                output: 316800,
                requirements: ['Research Institutions', 'Tech Talent'],
                benefits: ['Innovation Hub', 'High-Tech Jobs', 'Startup Ecosystem'],
                upgrades: [
                  { name: 'Quantum Computing Center', cost: 8000000, benefit: '+20% Research Output', available: false },
                  { name: 'AI Research Lab', cost: 4000000, benefit: '+12% Efficiency', available: true }
                ]
              }
            ],
            infrastructure: {
              transportation: {
                roads: { quality: 85, coverage: 95, capacity: 90 },
                publicTransit: { coverage: 88, efficiency: 82, ridership: 75 },
                airports: { count: 3, capacity: 85, traffic: 80 },
                ports: { count: 2, capacity: 90, throughput: 85 }
              },
              utilities: {
                power: { capacity: 95, usage: 78, reliability: 92, renewable: 65 },
                water: { capacity: 90, usage: 72, quality: 88, treatment: 85 },
                waste: { capacity: 85, recycling: 75, efficiency: 80 },
                communications: { coverage: 95, speed: 90, reliability: 88 }
              },
              services: {
                healthcare: { hospitals: 12, coverage: 90, quality: 85 },
                education: { schools: 45, universities: 8, literacy: 95 },
                emergency: { police: 25, fire: 18, response: 88 },
                recreation: { parks: 35, facilities: 28, satisfaction: 82 }
              }
            },
            economy: {
              gdp: 850000000000,
              gdpPerCapita: 56667,
              unemployment: 4.2,
              averageIncome: 72000,
              costOfLiving: 85,
              businessCount: 125000,
              sectors: [
                { name: 'Government', contribution: 25, employment: 20, growth: 3.2 },
                { name: 'Technology', contribution: 30, employment: 25, growth: 8.5 },
                { name: 'Finance', contribution: 20, employment: 18, growth: 4.1 },
                { name: 'Services', contribution: 15, employment: 22, growth: 2.8 },
                { name: 'Manufacturing', contribution: 10, employment: 15, growth: 1.5 }
              ],
              trade: {
                imports: 125000000000,
                exports: 150000000000,
                balance: 25000000000,
                partners: ['Mars Colony', 'Luna Station', 'Outer Colonies']
              }
            },
            demographics: {
              ageGroups: { '0-17': 18, '18-64': 65, '65+': 17 },
              education: { 'Elementary': 15, 'Secondary': 35, 'Higher': 35, 'Advanced': 15 },
              income: { 'Low': 20, 'Middle': 50, 'High': 25, 'Elite': 5 },
              employment: { 'Full-time': 70, 'Part-time': 15, 'Self-employed': 10, 'Unemployed': 5 },
              migration: {
                inflow: 85000,
                outflow: 45000,
                net: 40000,
                reasons: ['Job Opportunities', 'Quality of Life', 'Education', 'Cultural Attractions']
              },
              diversity: {
                species: { 'Human': 85, 'AI': 10, 'Hybrid': 5 },
                cultures: ['Terran', 'Martian', 'Lunar', 'Colonial'],
                languages: ['English', 'Mandarin', 'Spanish', 'AI Code']
              }
            },
            quality: {
              livability: 88,
              sustainability: 82,
              innovation: 90,
              safety: 85,
              culture: 87,
              overall: 86
            },
            growth: {
              populationGrowth: 2.8,
              economicGrowth: 4.2,
              infrastructureGrowth: 3.5,
              qualityImprovement: 2.1,
              challenges: ['Housing Affordability', 'Traffic Congestion', 'Environmental Impact'],
              opportunities: ['Smart City Development', 'Green Energy Transition', 'Cultural Expansion']
            }
          },
          {
            id: 'mars-colony',
            name: 'Mars Colony Alpha',
            region: 'Mars',
            population: 2500000,
            area: 1800,
            founded: '2395',
            mayor: 'Dr. Marcus Chen',
            coordinates: { lat: 18.2208, lng: -33.8688 },
            climate: 'Arid',
            terrain: ['Desert', 'Rocky', 'Underground'],
            specializations: [
              {
                id: 'space-port',
                name: 'Space Port Complex',
                type: 'industrial',
                level: 5,
                efficiency: 92,
                capacity: 600,
                workers: 550,
                output: 253000,
                requirements: ['Advanced Engineering', 'Space Technology'],
                benefits: ['Interplanetary Trade', 'Space Tourism', 'Research Access'],
                upgrades: [
                  { name: 'Quantum Drive Facility', cost: 12000000, benefit: '+25% Space Capacity', available: false },
                  { name: 'Advanced Life Support', cost: 6000000, benefit: '+15% Efficiency', available: true }
                ]
              },
              {
                id: 'research-station',
                name: 'Research Station Beta',
                type: 'research',
                level: 5,
                efficiency: 95,
                capacity: 400,
                workers: 380,
                output: 180500,
                requirements: ['Research Funding', 'Scientific Talent'],
                benefits: ['Breakthrough Research', 'International Collaboration', 'Technology Transfer'],
                upgrades: [
                  { name: 'Zero-G Lab', cost: 10000000, benefit: '+30% Research Output', available: false },
                  { name: 'AI Research Hub', cost: 5000000, benefit: '+18% Efficiency', available: true }
                ]
              }
            ],
            infrastructure: {
              transportation: {
                roads: { quality: 75, coverage: 80, capacity: 70 },
                publicTransit: { coverage: 70, efficiency: 75, ridership: 65 },
                airports: { count: 1, capacity: 70, traffic: 60 },
                ports: { count: 0, capacity: 0, throughput: 0 }
              },
              utilities: {
                power: { capacity: 85, usage: 65, reliability: 88, renewable: 90 },
                water: { capacity: 80, usage: 60, quality: 85, treatment: 90 },
                waste: { capacity: 75, recycling: 85, efficiency: 80 },
                communications: { coverage: 90, speed: 95, reliability: 92 }
              },
              services: {
                healthcare: { hospitals: 3, coverage: 85, quality: 88 },
                education: { schools: 8, universities: 2, literacy: 98 },
                emergency: { police: 6, fire: 4, response: 85 },
                recreation: { parks: 12, facilities: 8, satisfaction: 78 }
              }
            },
            economy: {
              gdp: 85000000000,
              gdpPerCapita: 34000,
              unemployment: 3.8,
              averageIncome: 65000,
              costOfLiving: 95,
              businessCount: 18000,
              sectors: [
                { name: 'Space Industry', contribution: 40, employment: 35, growth: 12.5 },
                { name: 'Research', contribution: 30, employment: 25, growth: 15.2 },
                { name: 'Manufacturing', contribution: 15, employment: 20, growth: 8.1 },
                { name: 'Services', contribution: 10, employment: 15, growth: 5.8 },
                { name: 'Agriculture', contribution: 5, employment: 5, growth: 3.2 }
              ],
              trade: {
                imports: 25000000000,
                exports: 35000000000,
                balance: 10000000000,
                partners: ['Earth', 'Luna Station', 'Asteroid Belt']
              }
            },
            demographics: {
              ageGroups: { '0-17': 20, '18-64': 70, '65+': 10 },
              education: { 'Elementary': 10, 'Secondary': 25, 'Higher': 45, 'Advanced': 20 },
              income: { 'Low': 15, 'Middle': 40, 'High': 35, 'Elite': 10 },
              employment: { 'Full-time': 75, 'Part-time': 12, 'Self-employed': 8, 'Unemployed': 5 },
              migration: {
                inflow: 25000,
                outflow: 15000,
                net: 10000,
                reasons: ['Research Opportunities', 'Space Careers', 'Adventure', 'High Salaries']
              },
              diversity: {
                species: { 'Human': 80, 'AI': 15, 'Hybrid': 5 },
                cultures: ['Terran', 'Martian', 'Research', 'International'],
                languages: ['English', 'Mandarin', 'Research Code', 'AI Language']
              }
            },
            quality: {
              livability: 82,
              sustainability: 88,
              innovation: 95,
              safety: 90,
              culture: 80,
              overall: 87
            },
            growth: {
              populationGrowth: 4.2,
              economicGrowth: 8.5,
              infrastructureGrowth: 6.8,
              qualityImprovement: 4.2,
              challenges: ['High Cost of Living', 'Limited Resources', 'Isolation'],
              opportunities: ['Space Tourism', 'Research Funding', 'Technology Export']
            }
          }
        ],
        selectedCity: null,
        analytics: {
          totalCities: 2,
          totalPopulation: 17500000,
          averageQuality: 86.5,
          specializationDistribution: [
            { type: 'Commercial', count: 1, percentage: 25 },
            { type: 'Research', count: 2, percentage: 50 },
            { type: 'Industrial', count: 1, percentage: 25 }
          ],
          challenges: [
            {
              type: 'Housing Affordability',
              severity: 'high',
              description: 'Rising housing costs affecting middle-income families',
              affectedCities: 1
            },
            {
              type: 'Infrastructure Capacity',
              severity: 'medium',
              description: 'Transportation systems reaching capacity limits',
              affectedCities: 1
            },
            {
              type: 'Environmental Impact',
              severity: 'medium',
              description: 'Urban development affecting local ecosystems',
              affectedCities: 1
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCityId]);

  useEffect(() => {
    fetchCitiesData();
  }, [fetchCitiesData]);

  useEffect(() => {
    if (selectedCityId && citiesData) {
      const city = citiesData.cities.find(c => c.id === selectedCityId);
      if (city) {
        setCitiesData(prev => prev ? { ...prev, selectedCity: city } : null);
      }
    }
  }, [selectedCityId, citiesData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Cities Overview - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🌍 Cities Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Cities</span>
            <span className="standard-metric-value">{citiesData?.analytics.totalCities || 0}</span>
          </div>
          <div className="standard-metric">
            <span>Total Population</span>
            <span className="standard-metric-value">{citiesData?.analytics.totalPopulation ? formatNumber(citiesData.analytics.totalPopulation) : '0'}</span>
          </div>
          <div className="standard-metric">
            <span>Average Quality</span>
            <span className="standard-metric-value">{citiesData?.analytics.averageQuality ? `${citiesData.analytics.averageQuality.toFixed(1)}%` : '0%'}</span>
          </div>
          <div className="standard-metric">
            <span>Active Specializations</span>
            <span className="standard-metric-value">{citiesData?.cities?.reduce((acc, city) => acc + city.specializations.length, 0) || 0}</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Cities Analysis')}>Cities Analysis</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Infrastructure Report')}>Infrastructure Report</button>
        </div>
      </div>

      {/* Planetary Summary - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏛️ Planetary Governments</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>🌍 Earth</h4>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Population:</span>
                <span>8.5B</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Cities:</span>
                <span>4</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Approval:</span>
                <span>72%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Budget:</span>
                <span>$2.5T</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="standard-btn social-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Manage</button>
              <button className="standard-btn social-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>View Cities</button>
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#10b981' }}>🔴 Mars</h4>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Population:</span>
                <span>2.5M</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Cities:</span>
                <span>2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Approval:</span>
                <span>68%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Budget:</span>
                <span>$85B</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="standard-btn social-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Manage</button>
              <button className="standard-btn social-theme" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>View Cities</button>
            </div>
          </div>
        </div>
      </div>


    </>
  );

  const renderCities = () => (
    <>
      {/* Cities List - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏙️ Cities Management</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem', color: '#10b981' }}>Select City:</label>
          <select 
            value={selectedCityId} 
            onChange={(e) => setSelectedCityId(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981'
            }}
          >
            {citiesData?.cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
        
        {citiesData?.selectedCity && (
          <div className="standard-data-table">
            <div className="table-header">
              <span>City Details</span>
              <span>Values</span>
            </div>
            <div className="table-row">
              <span>Name</span>
              <span>{citiesData.selectedCity.name}</span>
            </div>
            <div className="table-row">
              <span>Region</span>
              <span>{citiesData.selectedCity.region}</span>
            </div>
            <div className="table-row">
              <span>Population</span>
              <span>{formatNumber(citiesData.selectedCity.population)}</span>
            </div>
            <div className="table-row">
              <span>Area (km²)</span>
              <span>{citiesData.selectedCity.area.toLocaleString()}</span>
            </div>
            <div className="table-row">
              <span>Founded</span>
              <span>{citiesData.selectedCity.founded}</span>
            </div>
            <div className="table-row">
              <span>Mayor</span>
              <span>{citiesData.selectedCity.mayor}</span>
            </div>
            <div className="table-row">
              <span>Climate</span>
              <span>{citiesData.selectedCity.climate}</span>
            </div>
            <div className="table-row">
              <span>Overall Quality</span>
              <span style={{ color: getQualityColor(citiesData.selectedCity.quality.overall) }}>
                {citiesData.selectedCity.quality.overall}%
              </span>
            </div>
          </div>
        )}
        
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Add City')}>Add City</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Edit City')}>Edit City</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Delete City')}>Delete City</button>
        </div>
      </div>
    </>
  );

  const renderSpecializations = () => (
    <>
      {/* Specializations - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>⚙️ City Specializations</h3>
        {citiesData?.selectedCity ? (
          <div className="standard-data-table">
            <div className="table-header">
              <span>Specialization</span>
              <span>Type</span>
              <span>Level</span>
              <span>Efficiency</span>
              <span>Workers</span>
              <span>Output</span>
            </div>
            {citiesData.selectedCity.specializations.map(spec => (
              <div key={spec.id} className="table-row">
                <span>{spec.name}</span>
                <span style={{ color: getSpecializationColor(spec.type) }}>{spec.type}</span>
                <span>{spec.level}</span>
                <span>{spec.efficiency}%</span>
                <span>{spec.workers}</span>
                <span>{formatNumber(spec.output)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#a0a9ba' }}>
            Select a city to view specializations
          </div>
        )}
        
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Add Specialization')}>Add Specialization</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Upgrade Specialization')}>Upgrade Specialization</button>
        </div>
      </div>
    </>
  );

  const renderInfrastructure = () => (
    <>
      {/* Infrastructure - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>🏗️ Infrastructure Overview</h3>
        {citiesData?.selectedCity ? (
          <>
            {/* Transportation */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>🚇 Transportation</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Roads Quality</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.transportation.roads.quality}%</span>
                </div>
                <div className="standard-metric">
                  <span>Public Transit</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.transportation.publicTransit.coverage}%</span>
                </div>
                <div className="standard-metric">
                  <span>Airports</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.transportation.airports.count}</span>
                </div>
                <div className="standard-metric">
                  <span>Ports</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.transportation.ports.count}</span>
                </div>
              </div>
            </div>
            
            {/* Utilities */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>⚡ Utilities</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Power Reliability</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.utilities.power.reliability}%</span>
                </div>
                <div className="standard-metric">
                  <span>Water Quality</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.utilities.water.quality}%</span>
                </div>
                <div className="standard-metric">
                  <span>Waste Efficiency</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.utilities.waste.efficiency}%</span>
                </div>
                <div className="standard-metric">
                  <span>Communications</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.utilities.communications.reliability}%</span>
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>🏥 Services</h4>
              <div className="standard-metric-grid">
                <div className="standard-metric">
                  <span>Healthcare Coverage</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.services.healthcare.coverage}%</span>
                </div>
                <div className="standard-metric">
                  <span>Education Literacy</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.services.education.literacy}%</span>
                </div>
                <div className="standard-metric">
                  <span>Emergency Response</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.services.emergency.response}%</span>
                </div>
                <div className="standard-metric">
                  <span>Recreation Satisfaction</span>
                  <span className="standard-metric-value">{citiesData.selectedCity.infrastructure.services.recreation.satisfaction}%</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#a0a9ba' }}>
            Select a city to view infrastructure
          </div>
        )}
        
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Upgrade Infrastructure')}>Upgrade Infrastructure</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Maintenance Report')}>Maintenance Report</button>
        </div>
      </div>
    </>
  );

  const renderAnalytics = () => (
    <>
      {/* Analytics - Full panel width */}
      <div className="standard-panel social-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>📊 Cities Analytics</h3>
        
        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          <div className="chart-container">
            <PieChart
              data={citiesData?.analytics.specializationDistribution.map(item => ({
                label: item.type,
                value: item.percentage,
                color: getSpecializationColor(item.type.toLowerCase())
              })) || []}
              title="🏭 Specialization Distribution"
              size={200}
              showLegend={true}
            />
          </div>
          <div className="chart-container">
            <BarChart
              data={citiesData?.cities?.map(city => ({
                label: city.name,
                value: city.quality.overall,
                color: city.id === selectedCityId ? '#10b981' : '#3b82f6'
              })) || []}
              title="🏆 City Quality Scores"
              height={250}
              width={400}
              showTooltip={true}
            />
          </div>
        </div>
        
        {/* Challenges */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#10b981' }}>⚠️ Current Challenges</h4>
          <div className="standard-data-table">
            <div className="table-header">
              <span>Challenge Type</span>
              <span>Severity</span>
              <span>Description</span>
              <span>Affected Cities</span>
            </div>
            {citiesData?.analytics.challenges.map((challenge, i) => (
              <div key={i} className="table-row">
                <span>{challenge.type}</span>
                <span style={{ color: getSeverityColor(challenge.severity) }}>
                  {challenge.severity.toUpperCase()}
                </span>
                <span>{challenge.description}</span>
                <span>{challenge.affectedCities}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="standard-action-buttons">
          <button className="standard-btn social-theme" onClick={() => console.log('Generate Report')}>Generate Report</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Export Data')}>Export Data</button>
          <button className="standard-btn social-theme" onClick={() => console.log('Trend Analysis')}>Trend Analysis</button>
        </div>
      </div>
    </>
  );

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchCitiesData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container social-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && citiesData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'cities' && renderCities()}
              {activeTab === 'specializations' && renderSpecializations()}
              {activeTab === 'infrastructure' && renderInfrastructure()}
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
              {loading ? 'Loading cities data...' : 'No cities data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default CitiesScreen;
