import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './EconomicEcosystemScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface City {
  id: string;
  name: string;
  tier: 'developing' | 'industrial' | 'advanced' | 'post-scarcity';
  specialization: string;
  population: number;
  gdpPerCapita: number;
  infrastructure: number;
  keyIndustries: string[];
  equilibrium: 'balanced' | 'surplus' | 'deficit';
}

interface ProductCategory {
  id: string;
  name: string;
  technologyLevel: number;
  trackIndividually: boolean;
  strategicImportance: 'critical' | 'high' | 'medium' | 'low';
  currentProducts: number;
  keyPlayers: string[];
  status: 'critical' | 'high' | 'medium' | 'low';
}

interface Corporation {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  size: 'large' | 'medium' | 'small';
  marketCap: number;
  employees: number;
  ceo: string;
  founded: number;
  advantages: string[];
}

interface SupplyChain {
  id: string;
  productName: string;
  corporation: string;
  location: string;
  output: string;
  materials: Array<{
    name: string;
    quantity: string;
  }>;
  efficiency: number;
  capacityUtilization: number;
}

interface TradePolicy {
  id: string;
  partner: string;
  relationship: 'ally' | 'competitor' | 'neutral' | 'hostile';
  generalTariff: number;
  diplomaticModifier: number;
  strategicProducts: Array<{
    product: string;
    exportPolicy: string;
    importPolicy: string;
    tariff: number;
  }>;
}

interface SkillTalent {
  id: string;
  location: string;
  skill: string;
  availability: 'abundant' | 'moderate' | 'scarce' | 'critical';
  qualityLevel: number;
  averageCost: number;
  brainDrain: number;
  developmentRate: number;
  demand: 'very high' | 'high' | 'medium' | 'low';
}

interface EconomicEcosystemData {
  cities: City[];
  products: ProductCategory[];
  corporations: Corporation[];
  supplyChains: SupplyChain[];
  tradePolicies: TradePolicy[];
  skillsTalent: SkillTalent[];
  overview: {
    totalCities: number;
    totalCorporations: number;
    totalProducts: number;
    economicGrowth: number;
    tradeVolume: number;
    employmentRate: number;
  };
}

const EconomicEcosystemScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [ecosystemData, setEcosystemData] = useState<EconomicEcosystemData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cities' | 'corporations' | 'supply-chains' | 'trade'>('overview');

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'cities', label: 'Cities', icon: '🏙️' },
    { id: 'corporations', label: 'Corporations', icon: '🏢' },
    { id: 'supply-chains', label: 'Supply Chains', icon: '🔗' },
    { id: 'trade', label: 'Trade', icon: '🌐' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/economic-ecosystem', description: 'Get economic ecosystem data' }
  ];

  // Utility functions
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

  const formatPopulation = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'post-scarcity': return '#10b981';
      case 'advanced': return '#fbbf24';
      case 'industrial': return '#f59e0b';
      case 'developing': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#fbbf24';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEquilibriumColor = (equilibrium: string) => {
    switch (equilibrium) {
      case 'surplus': return '#10b981';
      case 'balanced': return '#fbbf24';
      case 'deficit': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'ally': return '#10b981';
      case 'neutral': return '#fbbf24';
      case 'competitor': return '#f59e0b';
      case 'hostile': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchEcosystemData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/economic-ecosystem');
      if (response.ok) {
        const data = await response.json();
        setEcosystemData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch economic ecosystem data:', err);
      // Use comprehensive mock data
      setEcosystemData({
        overview: {
          totalCities: 47,
          totalCorporations: 1250,
          totalProducts: 8500,
          economicGrowth: 4.2,
          tradeVolume: 2.8e12,
          employmentRate: 94.5
        },
        cities: generateMockCities(),
        products: generateMockProducts(),
        corporations: generateMockCorporations(),
        supplyChains: generateMockSupplyChains(),
        tradePolicies: generateMockTradePolicies(),
        skillsTalent: generateMockSkillsTalent()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEcosystemData();
  }, [fetchEcosystemData]);

  const generateMockCities = (): City[] => [
    {
      id: '1',
      name: 'Quantum Heights',
      tier: 'advanced',
      specialization: 'Technology',
      population: 12500000,
      gdpPerCapita: 165000,
      infrastructure: 9,
      keyIndustries: ['Quantum Computing', 'Neural Interfaces', 'AI Research'],
      equilibrium: 'balanced'
    },
    {
      id: '2',
      name: 'Industrial Mesa',
      tier: 'industrial',
      specialization: 'Manufacturing',
      population: 8200000,
      gdpPerCapita: 78000,
      infrastructure: 7,
      keyIndustries: ['Robotics', 'Precision Engineering', 'Assembly Systems'],
      equilibrium: 'surplus'
    },
    {
      id: '3',
      name: 'Neo Silicon Valley',
      tier: 'post-scarcity',
      specialization: 'Research',
      population: 15800000,
      gdpPerCapita: 285000,
      infrastructure: 10,
      keyIndustries: ['Quantum Research', 'Biotech', 'Space Technology'],
      equilibrium: 'balanced'
    },
    {
      id: '4',
      name: 'Energy Valley',
      tier: 'advanced',
      specialization: 'Energy',
      population: 6900000,
      gdpPerCapita: 145000,
      infrastructure: 8,
      keyIndustries: ['Fusion Technology', 'Solar Arrays', 'Energy Storage'],
      equilibrium: 'surplus'
    }
  ];

  const generateMockProducts = (): ProductCategory[] => [
    {
      id: '1',
      name: 'Quantum Computers',
      technologyLevel: 10,
      trackIndividually: true,
      strategicImportance: 'critical',
      currentProducts: 2,
      keyPlayers: ['QuantumCore Technologies', 'Advanced Quantum Systems'],
      status: 'critical'
    },
    {
      id: '2',
      name: 'Weapons Systems',
      technologyLevel: 8,
      trackIndividually: true,
      strategicImportance: 'critical',
      currentProducts: 3,
      keyPlayers: ['Defense Dynamics Corp', 'Military Systems Inc'],
      status: 'critical'
    },
    {
      id: '3',
      name: 'Software',
      technologyLevel: 7,
      trackIndividually: false,
      strategicImportance: 'medium',
      currentProducts: 15,
      keyPlayers: ['Neural Software', 'Quantum Logic Systems'],
      status: 'medium'
    }
  ];

  const generateMockCorporations = (): Corporation[] => [
    {
      id: '1',
      name: 'QuantumCore Technologies',
      symbol: 'QCT',
      sector: 'Technology',
      size: 'large',
      marketCap: 850000000000,
      employees: 125000,
      ceo: 'Dr. Elena Rodriguez',
      founded: 2045,
      advantages: ['Quantum Patents', 'Government Contracts', 'R&D Investment']
    },
    {
      id: '2',
      name: 'NovaSpace Industries',
      symbol: 'NSI',
      sector: 'Aerospace',
      size: 'large',
      marketCap: 650000000000,
      employees: 89000,
      ceo: 'Marcus Chen',
      founded: 2042,
      advantages: ['Space Technology', 'Military Contracts', 'Innovation']
    },
    {
      id: '3',
      name: 'BioX Solutions',
      symbol: 'BXS',
      sector: 'Healthcare',
      size: 'medium',
      marketCap: 320000000000,
      employees: 45000,
      ceo: 'Dr. Sarah Kim',
      founded: 2048,
      advantages: ['Biotech Patents', 'Clinical Trials', 'Regulatory Expertise']
    }
  ];

  const generateMockSupplyChains = (): SupplyChain[] => [
    {
      id: '1',
      productName: 'Quantum Processors',
      corporation: 'QuantumCore Technologies',
      location: 'Quantum Heights',
      output: '500 units/month',
      materials: [
        { name: 'Quantum Crystals', quantity: '100kg' },
        { name: 'Neural Interface Chips', quantity: '2000 units' },
        { name: 'Cooling Systems', quantity: '500 units' }
      ],
      efficiency: 92,
      capacityUtilization: 85
    },
    {
      id: '2',
      productName: 'Spacecraft Components',
      corporation: 'NovaSpace Industries',
      location: 'Industrial Mesa',
      output: '25 units/month',
      materials: [
        { name: 'Titanium Alloys', quantity: '5000kg' },
        { name: 'Advanced Composites', quantity: '2000kg' },
        { name: 'Navigation Systems', quantity: '100 units' }
      ],
      efficiency: 88,
      capacityUtilization: 78
    }
  ];

  const generateMockTradePolicies = (): TradePolicy[] => [
    {
      id: '1',
      partner: 'Vega Federation',
      relationship: 'ally',
      generalTariff: 2.5,
      diplomaticModifier: 15,
      strategicProducts: [
        {
          product: 'Quantum Computers',
          exportPolicy: 'Restricted',
          importPolicy: 'Open',
          tariff: 0
        }
      ]
    },
    {
      id: '2',
      partner: 'Alpha Centauri Empire',
      relationship: 'competitor',
      generalTariff: 12.5,
      diplomaticModifier: -5,
      strategicProducts: [
        {
          product: 'Weapons Systems',
          exportPolicy: 'Banned',
          importPolicy: 'Restricted',
          tariff: 25
        }
      ]
    }
  ];

  const generateMockSkillsTalent = (): SkillTalent[] => [
    {
      id: '1',
      location: 'Quantum Heights',
      skill: 'Quantum Physics',
      availability: 'scarce',
      qualityLevel: 9,
      averageCost: 250000,
      brainDrain: 15,
      developmentRate: 8,
      demand: 'very high'
    },
    {
      id: '2',
      location: 'Industrial Mesa',
      skill: 'Robotics Engineering',
      availability: 'moderate',
      qualityLevel: 7,
      averageCost: 120000,
      brainDrain: 8,
      developmentRate: 6,
      demand: 'high'
    }
  ];

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Economic Overview - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📊 Economic Ecosystem Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Cities</span>
            <span className="standard-metric-value">{ecosystemData?.overview.totalCities}</span>
          </div>
          <div className="standard-metric">
            <span>Corporations</span>
            <span className="standard-metric-value">{formatNumber(ecosystemData?.overview.totalCorporations || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Products</span>
            <span className="standard-metric-value">{formatNumber(ecosystemData?.overview.totalProducts || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Economic Growth</span>
            <span className="standard-metric-value">{ecosystemData?.overview.economicGrowth}%</span>
          </div>
          <div className="standard-metric">
            <span>Trade Volume</span>
            <span className="standard-metric-value">{formatCurrency(ecosystemData?.overview.tradeVolume || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Employment Rate</span>
            <span className="standard-metric-value">{ecosystemData?.overview.employmentRate}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Economic Analysis')}>Economic Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Report')}>Market Report</button>
        </div>
      </div>

      {/* Top Cities - Full panel width */}
      <div className="standard-panel economic-theme">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏙️ Top Cities</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Tier</th>
                <th>Specialization</th>
                <th>Population</th>
                <th>GDP/Capita</th>
                <th>Infrastructure</th>
                <th>Equilibrium</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemData?.cities?.slice(0, 5).map((city) => (
                <tr key={city.id}>
                  <td><strong>{city.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getTierColor(city.tier), 
                      color: 'white' 
                    }}>
                      {city.tier.charAt(0).toUpperCase() + city.tier.slice(1)}
                    </span>
                  </td>
                  <td>{city.specialization}</td>
                  <td>{formatPopulation(city.population)}</td>
                  <td>{formatCurrency(city.gdpPerCapita)}</td>
                  <td>{city.infrastructure}/10</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getEquilibriumColor(city.equilibrium), 
                      color: 'white' 
                    }}>
                      {city.equilibrium.charAt(0).toUpperCase() + city.equilibrium.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Economic Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel economic-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>📈 Economic Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={ecosystemData?.cities?.map(city => ({
                  label: city.name,
                  value: city.gdpPerCapita / 1000, // Convert to thousands
                  color: getTierColor(city.tier)
                })) || []}
                title="🏙️ GDP per Capita (Thousands)"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={ecosystemData?.cities?.map(city => ({
                  label: city.name,
                  value: city.population / 1000000, // Convert to millions
                  color: getTierColor(city.tier)
                })) || []}
                title="👥 Population Distribution (Millions)"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderCities = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏙️ Dynamic City Markets</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('City Analysis')}>City Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Infrastructure Report')}>Infrastructure Report</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Tier</th>
                <th>Specialization</th>
                <th>Population</th>
                <th>GDP/Capita</th>
                <th>Infrastructure</th>
                <th>Key Industries</th>
                <th>Equilibrium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemData?.cities?.map((city) => (
                <tr key={city.id}>
                  <td><strong>{city.name}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getTierColor(city.tier), 
                      color: 'white' 
                    }}>
                      {city.tier.charAt(0).toUpperCase() + city.tier.slice(1)}
                    </span>
                  </td>
                  <td>{city.specialization}</td>
                  <td>{formatPopulation(city.population)}</td>
                  <td>{formatCurrency(city.gdpPerCapita)}</td>
                  <td>{city.infrastructure}/10</td>
                  <td>{city.keyIndustries.slice(0, 2).join(', ')}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getEquilibriumColor(city.equilibrium), 
                      color: 'white' 
                    }}>
                      {city.equilibrium.charAt(0).toUpperCase() + city.equilibrium.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn economic-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCorporations = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🏢 Procedural Corporations</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Corporate Analysis')}>Corporate Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Market Report')}>Market Report</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Corporation</th>
                <th>Symbol</th>
                <th>Sector</th>
                <th>Size</th>
                <th>Market Cap</th>
                <th>Employees</th>
                <th>CEO</th>
                <th>Founded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemData?.corporations?.map((corporation) => (
                <tr key={corporation.id}>
                  <td><strong>{corporation.name}</strong></td>
                  <td>{corporation.symbol}</td>
                  <td>{corporation.sector}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: corporation.size === 'large' ? '#fbbf24' : corporation.size === 'medium' ? '#f59e0b' : '#10b981', 
                      color: 'white' 
                    }}>
                      {corporation.size.charAt(0).toUpperCase() + corporation.size.slice(1)}
                    </span>
                  </td>
                  <td>{formatCurrency(corporation.marketCap)}</td>
                  <td>{formatNumber(corporation.employees)}</td>
                  <td>{corporation.ceo}</td>
                  <td>{corporation.founded}</td>
                  <td>
                    <button className="standard-btn economic-theme">Invest</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSupplyChains = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🔗 Supply Chain Data</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Supply Analysis')}>Supply Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Efficiency Report')}>Efficiency Report</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Corporation</th>
                <th>Location</th>
                <th>Output</th>
                <th>Efficiency</th>
                <th>Capacity</th>
                <th>Materials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemData?.supplyChains?.map((chain) => (
                <tr key={chain.id}>
                  <td><strong>{chain.productName}</strong></td>
                  <td>{chain.corporation}</td>
                  <td>{chain.location}</td>
                  <td>{chain.output}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: chain.efficiency >= 90 ? '#10b981' : chain.efficiency >= 80 ? '#fbbf24' : '#ef4444', 
                      color: 'white' 
                    }}>
                      {chain.efficiency}%
                    </span>
                  </td>
                  <td>{chain.capacityUtilization}%</td>
                  <td>{chain.materials.length} types</td>
                  <td>
                    <button className="standard-btn economic-theme">Optimize</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrade = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel economic-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#fbbf24' }}>🌐 Trade Policies</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn economic-theme" onClick={() => console.log('Trade Analysis')}>Trade Analysis</button>
          <button className="standard-btn economic-theme" onClick={() => console.log('Policy Review')}>Policy Review</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Relationship</th>
                <th>General Tariff</th>
                <th>Diplomatic Modifier</th>
                <th>Strategic Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemData?.tradePolicies?.map((policy) => (
                <tr key={policy.id}>
                  <td><strong>{policy.partner}</strong></td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getRelationshipColor(policy.relationship), 
                      color: 'white' 
                    }}>
                      {policy.relationship.charAt(0).toUpperCase() + policy.relationship.slice(1)}
                    </span>
                  </td>
                  <td>{policy.generalTariff}%</td>
                  <td>{policy.diplomaticModifier > 0 ? '+' : ''}{policy.diplomaticModifier}</td>
                  <td>{policy.strategicProducts.length} products</td>
                  <td>
                    <button className="standard-btn economic-theme">Negotiate</button>
                  </td>
                </tr>
              ))}
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
      onRefresh={fetchEcosystemData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container economic-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && ecosystemData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'cities' && renderCities()}
              {activeTab === 'corporations' && renderCorporations()}
              {activeTab === 'supply-chains' && renderSupplyChains()}
              {activeTab === 'trade' && renderTrade()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading economic ecosystem data...' : 'No economic ecosystem data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default EconomicEcosystemScreen;

