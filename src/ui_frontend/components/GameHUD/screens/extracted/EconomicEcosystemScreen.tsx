import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './EconomicEcosystemScreen.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cities' | 'products' | 'corporations' | 'supply-chains' | 'trade' | 'talent'>('overview');

  const apiEndpoints: APIEndpoint[] = [
    { path: '/api/economic-ecosystem/overview', method: 'GET', description: 'Economic ecosystem overview' },
    { path: '/api/economic-ecosystem/cities', method: 'GET', description: 'Dynamic city markets' },
    { path: '/api/economic-ecosystem/products', method: 'GET', description: 'Product categories' },
    { path: '/api/economic-ecosystem/corporations', method: 'GET', description: 'Procedural corporations' },
    { path: '/api/economic-ecosystem/supply-chains', method: 'GET', description: 'Supply chain data' },
    { path: '/api/economic-ecosystem/trade-policies', method: 'GET', description: 'Trade policies' },
    { path: '/api/economic-ecosystem/skills-talent', method: 'GET', description: 'Skills and talent data' }
  ];

  // Mock data generators
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
    },
    {
      id: '4',
      name: 'Food Products',
      technologyLevel: 3,
      trackIndividually: false,
      strategicImportance: 'medium',
      currentProducts: 50,
      keyPlayers: ['Galactic Agriculture', 'Synthetic Foods Corp'],
      status: 'medium'
    },
    {
      id: '5',
      name: 'Energy Systems',
      technologyLevel: 9,
      trackIndividually: true,
      strategicImportance: 'high',
      currentProducts: 5,
      keyPlayers: ['Fusion Dynamics', 'Solar Tech Industries'],
      status: 'high'
    }
  ];

  const generateMockCorporations = (): Corporation[] => [
    {
      id: '1',
      name: 'QuantumTech Solutions',
      symbol: 'QUTS',
      sector: 'Technology',
      size: 'large',
      marketCap: 850000000000,
      employees: 125000,
      ceo: 'Dr. Elena Vasquez',
      founded: 2387,
      advantages: ['Quantum Error Correction', 'Neural Interface Patents', 'Military Contracts']
    },
    {
      id: '2',
      name: 'BioLife Therapeutics',
      symbol: 'BILT',
      sector: 'Healthcare',
      size: 'medium',
      marketCap: 420000000000,
      employees: 75000,
      ceo: 'Dr. Sarah Kim-Nakamura',
      founded: 2385,
      advantages: ['Gene Editing Technology', 'Clinical Trial Expertise', 'Regulatory Approval']
    },
    {
      id: '3',
      name: 'WarpDrive Logistics',
      symbol: 'WARP',
      sector: 'Transportation',
      size: 'large',
      marketCap: 680000000000,
      employees: 72000,
      ceo: 'Captain Yuki Tanaka',
      founded: 2390,
      advantages: ['Fastest Warp Technology', 'Largest Fleet', 'Navigation Systems']
    },
    {
      id: '4',
      name: 'Defense Dynamics',
      symbol: 'DEFD',
      sector: 'Defense',
      size: 'large',
      marketCap: 920000000000,
      employees: 95000,
      ceo: 'General Marcus Steel',
      founded: 2382,
      advantages: ['Military Contracts', 'Advanced Weaponry', 'Security Clearance']
    }
  ];

  const generateMockSupplyChains = (): SupplyChain[] => [
    {
      id: '1',
      productName: 'QuantumCore Q-1000',
      corporation: 'QuantumTech Solutions',
      location: 'Neo Silicon Valley',
      output: '100 units/month',
      materials: [
        { name: 'Quantum Crystals', quantity: '5kg' },
        { name: 'Rare Earth Elements', quantity: '50kg' },
        { name: 'Quantum Processors', quantity: '10 units' }
      ],
      efficiency: 95,
      capacityUtilization: 85
    },
    {
      id: '2',
      productName: 'Plasma Rifle MK-VII',
      corporation: 'Defense Dynamics',
      location: 'Industrial Complex Prime',
      output: '1,000 units/month',
      materials: [
        { name: 'Titanium Ore', quantity: '25kg' },
        { name: 'Power Cells', quantity: '2 units' },
        { name: 'Advanced Sensors', quantity: '5 units' }
      ],
      efficiency: 88,
      capacityUtilization: 92
    },
    {
      id: '3',
      productName: 'Compact Fusion Reactor',
      corporation: 'Fusion Dynamics',
      location: 'Energy Valley',
      output: '10 units/month',
      materials: [
        { name: 'Helium-3', quantity: '100kg' },
        { name: 'Fusion Containment Fields', quantity: '1 unit' },
        { name: 'Advanced Sensors', quantity: '20 units' }
      ],
      efficiency: 92,
      capacityUtilization: 78
    }
  ];

  const generateMockTradePolicies = (): TradePolicy[] => [
    {
      id: '1',
      partner: 'Alpha Centauri',
      relationship: 'ally',
      generalTariff: 2.5,
      diplomaticModifier: 0.8,
      strategicProducts: [
        { product: 'Weapons', exportPolicy: 'Banned', importPolicy: 'Restricted', tariff: 15 },
        { product: 'Quantum Computers', exportPolicy: 'License Required', importPolicy: 'Allowed', tariff: 5 },
        { product: 'Software', exportPolicy: 'Free Trade', importPolicy: 'Allowed', tariff: 0 }
      ]
    },
    {
      id: '2',
      partner: 'Vega Prime',
      relationship: 'competitor',
      generalTariff: 8.5,
      diplomaticModifier: 1.2,
      strategicProducts: [
        { product: 'Weapons', exportPolicy: 'Banned', importPolicy: 'Banned', tariff: 0 },
        { product: 'AI Systems', exportPolicy: 'License Required', importPolicy: 'Restricted', tariff: 25 },
        { product: 'Energy', exportPolicy: 'Restricted', importPolicy: 'Allowed', tariff: 12 }
      ]
    },
    {
      id: '3',
      partner: 'Sirius Federation',
      relationship: 'neutral',
      generalTariff: 5.0,
      diplomaticModifier: 1.0,
      strategicProducts: [
        { product: 'Financial Services', exportPolicy: 'Free Trade', importPolicy: 'Free Trade', tariff: 0 },
        { product: 'Transportation', exportPolicy: 'Allowed', importPolicy: 'Allowed', tariff: 3 },
        { product: 'Consumer Goods', exportPolicy: 'Allowed', importPolicy: 'Allowed', tariff: 5 }
      ]
    }
  ];

  const generateMockSkillsTalent = (): SkillTalent[] => [
    {
      id: '1',
      location: 'Neo Silicon Valley',
      skill: 'Quantum Computing',
      availability: 'scarce',
      qualityLevel: 9.5,
      averageCost: 250000,
      brainDrain: -2.5,
      developmentRate: 5.2,
      demand: 'very high'
    },
    {
      id: '2',
      location: 'Industrial Complex Prime',
      skill: 'Manufacturing',
      availability: 'abundant',
      qualityLevel: 7.8,
      averageCost: 85000,
      brainDrain: 1.2,
      developmentRate: 2.8,
      demand: 'high'
    },
    {
      id: '3',
      location: 'Energy Valley',
      skill: 'Energy Engineering',
      availability: 'moderate',
      qualityLevel: 8.9,
      averageCost: 180000,
      brainDrain: -1.8,
      developmentRate: 4.1,
      demand: 'very high'
    },
    {
      id: '4',
      location: 'Financial District',
      skill: 'Financial Analysis',
      availability: 'moderate',
      qualityLevel: 8.2,
      averageCost: 145000,
      brainDrain: 0.5,
      developmentRate: 3.2,
      demand: 'medium'
    }
  ];

  const fetchEcosystemData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, these would be actual API calls
      const ecosystemData: EconomicEcosystemData = {
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
      };

      setEcosystemData(ecosystemData);
    } catch (err) {
      console.error('Failed to fetch economic ecosystem data:', err);
      // Use mock data as fallback
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

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return new Intl.NumberFormat().format(num);
  };

  const formatPopulation = (num: number): string => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'post-scarcity': return '#4ecdc4';
      case 'advanced': return '#45b7aa';
      case 'industrial': return '#ffd93d';
      case 'developing': return '#ff6b6b';
      default: return '#b8bcc8';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'critical': return '#ff6b6b';
      case 'high': return '#ffd93d';
      case 'medium': return '#4ecdc4';
      case 'low': return '#b8bcc8';
      default: return '#b8bcc8';
    }
  };

  const getRelationshipColor = (relationship: string): string => {
    switch (relationship) {
      case 'ally': return '#4ecdc4';
      case 'neutral': return '#ffd93d';
      case 'competitor': return '#ff9f43';
      case 'hostile': return '#ff6b6b';
      default: return '#b8bcc8';
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchEcosystemData}
    >
      <div className="economic-ecosystem-screen">
        <div className="view-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab ${activeTab === 'cities' ? 'active' : ''}`}
            onClick={() => setActiveTab('cities')}
          >
            🏙️ Cities
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button
            className={`tab ${activeTab === 'corporations' ? 'active' : ''}`}
            onClick={() => setActiveTab('corporations')}
          >
            🏢 Corporations
          </button>
          <button
            className={`tab ${activeTab === 'supply-chains' ? 'active' : ''}`}
            onClick={() => setActiveTab('supply-chains')}
          >
            🔗 Supply Chains
          </button>
          <button
            className={`tab ${activeTab === 'trade' ? 'active' : ''}`}
            onClick={() => setActiveTab('trade')}
          >
            🛡️ Trade
          </button>
          <button
            className={`tab ${activeTab === 'talent' ? 'active' : ''}`}
            onClick={() => setActiveTab('talent')}
          >
            👥 Talent
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading economic ecosystem data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && ecosystemData && (
            <>
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="overview-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">🏙️</div>
                      <div className="metric-content">
                        <div className="metric-value">{ecosystemData.overview.totalCities}</div>
                        <div className="metric-label">Total Cities</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">🏢</div>
                      <div className="metric-content">
                        <div className="metric-value">{ecosystemData.overview.totalCorporations.toLocaleString()}</div>
                        <div className="metric-label">Corporations</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📦</div>
                      <div className="metric-content">
                        <div className="metric-value">{ecosystemData.overview.totalProducts.toLocaleString()}</div>
                        <div className="metric-label">Products</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📈</div>
                      <div className="metric-content">
                        <div className="metric-value">{ecosystemData.overview.economicGrowth}%</div>
                        <div className="metric-label">Economic Growth</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">💰</div>
                      <div className="metric-content">
                        <div className="metric-value">{formatNumber(ecosystemData.overview.tradeVolume)}</div>
                        <div className="metric-label">Trade Volume</div>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">👷</div>
                      <div className="metric-content">
                        <div className="metric-value">{ecosystemData.overview.employmentRate}%</div>
                        <div className="metric-label">Employment Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="overview-summary">
                    <div className="summary-panel">
                      <h3>Economic Ecosystem Status</h3>
                      <p>The dynamic economic ecosystem encompasses {ecosystemData.overview.totalCities} procedurally generated cities, {ecosystemData.overview.totalCorporations.toLocaleString()} corporations, and {ecosystemData.overview.totalProducts.toLocaleString()} products across multiple sectors and technology levels.</p>
                      <div className="status-indicators">
                        <div className="status-item">
                          <span className="status-label">Growth Rate:</span>
                          <span className="status-value positive">+{ecosystemData.overview.economicGrowth}%</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Trade Volume:</span>
                          <span className="status-value positive">{formatNumber(ecosystemData.overview.tradeVolume)}</span>
                        </div>
                        <div className="status-item">
                          <span className="status-label">Employment:</span>
                          <span className="status-value positive">{ecosystemData.overview.employmentRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cities' && (
                <div className="cities-tab">
                  <div className="cities-header">
                    <h3>Dynamic City Markets</h3>
                    <div className="city-controls">
                      <button className="action-btn">Generate All Cities</button>
                      <button className="action-btn">Generate for Civilization</button>
                      <button className="action-btn secondary">Preview Generation</button>
                    </div>
                  </div>

                  <div className="cities-grid">
                    {ecosystemData.cities.map(city => (
                      <div key={city.id} className="city-card">
                        <div className="city-header">
                          <div className="city-name">
                            <h4>{city.name}</h4>
                            <span 
                              className="city-tier"
                              style={{ backgroundColor: getTierColor(city.tier) }}
                            >
                              {city.tier}
                            </span>
                          </div>
                          <div 
                            className={`equilibrium-indicator ${city.equilibrium}`}
                            title={`Market equilibrium: ${city.equilibrium}`}
                          ></div>
                        </div>

                        <div className="city-stats">
                          <div className="stat-item">
                            <span className="stat-label">Specialization:</span>
                            <span className="stat-value">{city.specialization}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Population:</span>
                            <span className="stat-value">{formatPopulation(city.population)}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">GDP/Capita:</span>
                            <span className="stat-value">{formatNumber(city.gdpPerCapita)}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Infrastructure:</span>
                            <span className="stat-value">Level {city.infrastructure}/10</span>
                          </div>
                        </div>

                        <div className="city-industries">
                          <h5>Key Industries:</h5>
                          <div className="industry-tags">
                            {city.keyIndustries.map((industry, index) => (
                              <span key={index} className="industry-tag">{industry}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="products-tab">
                  <div className="products-header">
                    <h3>Product Categories & Supply</h3>
                    <div className="product-controls">
                      <button className="action-btn">View All Categories</button>
                      <button className="action-btn secondary">Analyze Supply & Demand</button>
                    </div>
                  </div>

                  <div className="products-grid">
                    {ecosystemData.products.map(product => (
                      <div key={product.id} className="product-card">
                        <div className="product-header">
                          <div className="product-name">
                            <h4>{product.name}</h4>
                            <span 
                              className="product-status"
                              style={{ backgroundColor: getStatusColor(product.status) }}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>

                        <div className="product-details">
                          <div className="detail-item">
                            <span className="detail-label">Technology Level:</span>
                            <span className="detail-value">{product.technologyLevel}/10</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Track Individually:</span>
                            <span className="detail-value">{product.trackIndividually ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Strategic Importance:</span>
                            <span className="detail-value">{product.strategicImportance}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Current Products:</span>
                            <span className="detail-value">{product.currentProducts}{product.currentProducts >= 15 ? '+' : ''}</span>
                          </div>
                        </div>

                        <div className="product-players">
                          <h5>Key Players:</h5>
                          <ul>
                            {product.keyPlayers.map((player, index) => (
                              <li key={index}>{player}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'corporations' && (
                <div className="corporations-tab">
                  <div className="corporations-header">
                    <h3>Procedurally Generated Corporations</h3>
                    <div className="corporation-controls">
                      <button className="action-btn">Generate New Corporation</button>
                      <button className="action-btn">Generate Full Ecosystem</button>
                      <button className="action-btn secondary">Preview Generation</button>
                    </div>
                  </div>

                  <div className="corporations-grid">
                    {ecosystemData.corporations.map(corp => (
                      <div key={corp.id} className="corporation-card">
                        <div className="corporation-header">
                          <div className="corporation-name">
                            <h4>{corp.name}</h4>
                            <span className="corporation-symbol">({corp.symbol})</span>
                          </div>
                          <span 
                            className={`corporation-size ${corp.size}`}
                          >
                            {corp.size} corp
                          </span>
                        </div>

                        <div className="corporation-details">
                          <div className="detail-item">
                            <span className="detail-label">Sector:</span>
                            <span className="detail-value">{corp.sector}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Market Cap:</span>
                            <span className="detail-value">{formatNumber(corp.marketCap)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Employees:</span>
                            <span className="detail-value">{corp.employees.toLocaleString()}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">CEO:</span>
                            <span className="detail-value">{corp.ceo}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Founded:</span>
                            <span className="detail-value">{corp.founded}</span>
                          </div>
                        </div>

                        <div className="corporation-advantages">
                          <h5>Competitive Advantages:</h5>
                          <div className="advantage-tags">
                            {corp.advantages.map((advantage, index) => (
                              <span key={index} className="advantage-tag">{advantage}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'supply-chains' && (
                <div className="supply-chains-tab">
                  <div className="supply-chains-header">
                    <h3>Production & Supply Chains</h3>
                    <div className="supply-chain-controls">
                      <button className="action-btn">View All Chains</button>
                      <button className="action-btn">Optimize Production</button>
                    </div>
                  </div>

                  <div className="supply-chains-grid">
                    {ecosystemData.supplyChains.map(chain => (
                      <div key={chain.id} className="supply-chain-card">
                        <div className="chain-header">
                          <h4>{chain.productName}</h4>
                          <div className="chain-location">{chain.location}</div>
                        </div>

                        <div className="chain-details">
                          <div className="detail-item">
                            <span className="detail-label">Corporation:</span>
                            <span className="detail-value">{chain.corporation}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Output:</span>
                            <span className="detail-value">{chain.output}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Efficiency:</span>
                            <span className="detail-value">{chain.efficiency}%</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Capacity Utilization:</span>
                            <span className="detail-value">{chain.capacityUtilization}%</span>
                          </div>
                        </div>

                        <div className="chain-materials">
                          <h5>Required Materials:</h5>
                          <div className="material-tags">
                            {chain.materials.map((material, index) => (
                              <span key={index} className="material-tag">
                                {material.name} ({material.quantity})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="chain-progress">
                          <div className="progress-item">
                            <span className="progress-label">Efficiency:</span>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${chain.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="progress-value">{chain.efficiency}%</span>
                          </div>
                          <div className="progress-item">
                            <span className="progress-label">Capacity:</span>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${chain.capacityUtilization}%` }}
                              ></div>
                            </div>
                            <span className="progress-value">{chain.capacityUtilization}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trade' && (
                <div className="trade-tab">
                  <div className="trade-header">
                    <h3>Trade Policies & Tariffs</h3>
                    <div className="trade-controls">
                      <button className="action-btn">View All Policies</button>
                      <button className="action-btn secondary">Calculate Tariff Impact</button>
                    </div>
                  </div>

                  <div className="trade-policies-grid">
                    {ecosystemData.tradePolicies.map(policy => (
                      <div key={policy.id} className="trade-policy-card">
                        <div className="policy-header">
                          <h4>Terran Republic ↔ {policy.partner}</h4>
                          <span 
                            className="relationship-badge"
                            style={{ backgroundColor: getRelationshipColor(policy.relationship) }}
                          >
                            {policy.relationship}
                          </span>
                        </div>

                        <div className="policy-overview">
                          <div className="overview-item">
                            <span className="overview-label">General Tariff:</span>
                            <span className="overview-value">{policy.generalTariff}%</span>
                          </div>
                          <div className="overview-item">
                            <span className="overview-label">Diplomatic Modifier:</span>
                            <span className="overview-value">{policy.diplomaticModifier}x</span>
                          </div>
                        </div>

                        <div className="strategic-products">
                          <h5>Strategic Products:</h5>
                          {policy.strategicProducts.map((product, index) => (
                            <div key={index} className="product-policy">
                              <div className="product-name">{product.product}:</div>
                              <div className="policy-details">
                                <span className="policy-detail">Export: {product.exportPolicy}</span>
                                <span className="policy-detail">Import: {product.importPolicy}</span>
                                {product.tariff > 0 && (
                                  <span className="policy-detail">Tariff: {product.tariff}%</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'talent' && (
                <div className="talent-tab">
                  <div className="talent-header">
                    <h3>Skills & Talent Ecosystem</h3>
                    <div className="talent-controls">
                      <button className="action-btn">Analyze Skill Gaps</button>
                      <button className="action-btn secondary">Talent Development</button>
                    </div>
                  </div>

                  <div className="talent-grid">
                    {ecosystemData.skillsTalent.map(skill => (
                      <div key={skill.id} className="skill-card">
                        <div className="skill-header">
                          <h4>{skill.location}</h4>
                          <div className="skill-name">{skill.skill}</div>
                        </div>

                        <div className="skill-metrics">
                          <div className="metric-item">
                            <span className="metric-label">Availability:</span>
                            <span className={`metric-value availability-${skill.availability}`}>
                              {skill.availability}
                            </span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Quality Level:</span>
                            <span className="metric-value">{skill.qualityLevel}/10</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Average Cost:</span>
                            <span className="metric-value">{formatNumber(skill.averageCost)}/year</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Brain Drain:</span>
                            <span className={`metric-value ${skill.brainDrain >= 0 ? 'positive' : 'negative'}`}>
                              {skill.brainDrain > 0 ? '+' : ''}{skill.brainDrain}%
                            </span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Development Rate:</span>
                            <span className="metric-value positive">+{skill.developmentRate}%/year</span>
                          </div>
                          <div className="metric-item">
                            <span className="metric-label">Demand:</span>
                            <span className={`metric-value demand-${skill.demand.replace(' ', '-')}`}>
                              {skill.demand}
                            </span>
                          </div>
                        </div>

                        <div className="skill-progress">
                          <div className="progress-item">
                            <span className="progress-label">Quality:</span>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${skill.qualityLevel * 10}%` }}
                              ></div>
                            </div>
                            <span className="progress-value">{skill.qualityLevel}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default EconomicEcosystemScreen;
