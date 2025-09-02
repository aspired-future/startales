/**
 * Visual Systems Screen - AI-Generated Visual Asset Management
 * 
 * This screen focuses on AI-generated visual assets including:
 * - Image, video, and animation generation
 * - Character, species, and environment designs
 * - Visual consistency and quality metrics
 * - Asset library management and analytics
 * - AI generation workflows and prompts
 * 
 * Distinct from:
 * - Corporate Research: Private sector research and development
 * - University Research: Academic research and education
 * - Classified Research: Secret government research projects
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './VisualSystemsScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface VisualAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'ANIMATION' | 'SPRITE' | 'TEXTURE' | 'ICON' | 'BACKGROUND' | 'PORTRAIT' | 'LANDSCAPE';
  category: 'CHARACTER' | 'SPECIES' | 'PLANET' | 'CITY' | 'SPACESHIP' | 'UNIT' | 'TOOL' | 'WEAPON' | 'BUILDING' | 'ENVIRONMENT' | 'EFFECT' | 'UI' | 'CUTSCENE' | 'EVENT';
  name: string;
  prompt: string;
  url: string;
  thumbnailUrl: string;
  status: 'generating' | 'completed' | 'failed' | 'queued';
  createdAt: string;
  dimensions: { width: number; height: number };
  fileSize: number;
  tags: string[];
  consistency: {
    styleScore: number;
    colorPalette: string[];
    visualTheme: string;
  };
}

interface Character {
  id: string;
  name: string;
  species: string;
  role: string;
  description: string;
  visualAssets: {
    portrait: string;
    fullBody: string;
    expressions: string[];
    outfits: string[];
  };
  traits: {
    personality: string[];
    appearance: string[];
    background: string;
  };
  consistency: {
    styleGuide: string;
    colorScheme: string[];
    designNotes: string;
  };
}

interface Species {
  id: string;
  name: string;
  classification: string;
  homeworld: string;
  description: string;
  visualAssets: {
    reference: string;
    variations: string[];
    anatomy: string[];
    culture: string[];
  };
  characteristics: {
    physiology: string[];
    technology: string[];
    society: string[];
  };
  designGuidelines: {
    colorPalette: string[];
    visualMotifs: string[];
    culturalElements: string[];
  };
}

interface Environment {
  id: string;
  name: string;
  type: 'PLANET' | 'CITY' | 'STATION' | 'SHIP' | 'FACILITY' | 'NATURAL' | 'ARTIFICIAL';
  climate: string;
  description: string;
  visualAssets: {
    overview: string;
    details: string[];
    atmosphere: string[];
    landmarks: string[];
  };
  features: {
    terrain: string[];
    structures: string[];
    atmosphere: string;
    lighting: string;
  };
  designTheme: {
    architecture: string;
    colorScheme: string[];
    visualStyle: string;
  };
}

interface ConsistencyMetrics {
  overallScore: number;
  styleConsistency: number;
  colorHarmony: number;
  thematicAlignment: number;
  qualityStandard: number;
  brandCompliance: number;
  issues: Array<{
    type: 'style' | 'color' | 'quality' | 'theme';
    severity: 'low' | 'medium' | 'high';
    description: string;
    affectedAssets: string[];
    recommendation: string;
  }>;
}

interface AnalyticsData {
  generationStats: {
    totalAssets: number;
    successRate: number;
    averageGenerationTime: number;
    popularCategories: Array<{ category: string; count: number }>;
    qualityDistribution: Array<{ quality: string; percentage: number }>;
  };
  usageMetrics: {
    mostUsedAssets: Array<{ id: string; name: string; usage: number }>;
    downloadStats: Array<{ date: string; downloads: number }>;
    storageUsage: { used: number; total: number; percentage: number };
  };
  performanceMetrics: {
    averageLoadTime: number;
    cacheHitRate: number;
    bandwidthUsage: number;
    errorRate: number;
  };
}

const VisualSystemsScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [visualData, setVisualData] = useState<{
    assets: VisualAsset[];
    characters: Character[];
    species: Species[];
    environments: Environment[];
    consistency: ConsistencyMetrics;
    analytics: AnalyticsData;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'generation' | 'characters' | 'species' | 'environments'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'generation', label: 'Generation', icon: '🎨' },
    { id: 'characters', label: 'Characters', icon: '👤' },
    { id: 'species', label: 'Species', icon: '🦠' },
    { id: 'environments', label: 'Environments', icon: '🌍' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/visual-systems', description: 'Get visual systems data' }
  ];

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)}MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)}KB`;
    return `${bytes}B`;
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
      case 'completed': return '#10b981';
      case 'generating': return '#fbbf24';
      case 'queued': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#fbbf24';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'IMAGE': return '#3b82f6';
      case 'VIDEO': return '#ef4444';
      case 'ANIMATION': return '#8b5cf6';
      case 'SPRITE': return '#f59e0b';
      case 'TEXTURE': return '#10b981';
      default: return '#6b7280';
    }
  };

  const fetchVisualData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/visual-systems');
      if (response.ok) {
        const data = await response.json();
        setVisualData(data);
      } else {
        throw new Error('API not available');
      }
    } catch (err) {
      console.warn('Failed to fetch visual systems data:', err);
      // Use comprehensive mock data
      setVisualData({
        assets: [
          {
            id: 'asset_001',
            type: 'IMAGE',
            category: 'CHARACTER',
            name: 'Space Marine Portrait',
            prompt: 'A heroic space marine in futuristic armor, detailed portrait, sci-fi art style',
            url: '/assets/space-marine-portrait.jpg',
            thumbnailUrl: '/assets/thumbnails/space-marine-portrait.jpg',
            status: 'completed',
            createdAt: '2024-01-15',
            dimensions: { width: 1024, height: 1024 },
            fileSize: 2048000,
            tags: ['character', 'military', 'sci-fi', 'portrait'],
            consistency: {
              styleScore: 95,
              colorPalette: ['#2d3748', '#4a5568', '#718096', '#a0aec0'],
              visualTheme: 'military-sci-fi'
            }
          },
          {
            id: 'asset_002',
            type: 'VIDEO',
            category: 'CUTSCENE',
            name: 'Planet Landing Sequence',
            prompt: 'Cinematic spaceship landing on alien planet, dramatic lighting, epic scale',
            url: '/assets/planet-landing.mp4',
            thumbnailUrl: '/assets/thumbnails/planet-landing.jpg',
            status: 'completed',
            createdAt: '2024-01-14',
            dimensions: { width: 1920, height: 1080 },
            fileSize: 15600000,
            tags: ['cutscene', 'spaceship', 'planet', 'cinematic'],
            consistency: {
              styleScore: 92,
              colorPalette: ['#1a202c', '#2d3748', '#4a5568', '#718096'],
              visualTheme: 'cinematic-sci-fi'
            }
          }
        ],
        characters: [
          {
            id: 'char_001',
            name: 'Commander Sarah Chen',
            species: 'Human',
            role: 'Fleet Commander',
            description: 'Experienced military leader with a strong sense of duty and tactical brilliance',
            visualAssets: {
              portrait: '/assets/characters/sarah-chen-portrait.jpg',
              fullBody: '/assets/characters/sarah-chen-full.jpg',
              expressions: ['determined', 'concerned', 'confident'],
              outfits: ['dress uniform', 'combat armor', 'casual wear']
            },
            traits: {
              personality: ['Leadership', 'Strategic thinking', 'Compassion'],
              appearance: ['Asian features', 'Short dark hair', 'Military bearing'],
              background: 'Graduated top of class from Military Academy, served in multiple conflicts'
            },
            consistency: {
              styleGuide: 'Realistic human proportions, military aesthetic',
              colorScheme: ['#2d3748', '#4a5568', '#718096'],
              designNotes: 'Maintains professional appearance while showing human vulnerability'
            }
          }
        ],
        species: [
          {
            id: 'species_001',
            name: 'Zephyrians',
            classification: 'Humanoid',
            homeworld: 'Zephyr Prime',
            description: 'Advanced humanoid species with crystalline skin and telepathic abilities',
            visualAssets: {
              reference: '/assets/species/zephyrians-reference.jpg',
              variations: ['male', 'female', 'elder', 'youth'],
              anatomy: ['crystal skin', 'elongated limbs', 'luminous eyes'],
              culture: ['ceremonial robes', 'technology integration', 'spiritual symbols']
            },
            characteristics: {
              physiology: ['Crystalline epidermis', 'Enhanced perception', 'Telepathic communication'],
              technology: ['Bio-technological fusion', 'Quantum computing', 'Energy manipulation'],
              society: ['Collective consciousness', 'Scientific advancement', 'Peaceful coexistence']
            },
            designGuidelines: {
              colorPalette: ['#e2e8f0', '#cbd5e0', '#a0aec0', '#718096'],
              visualMotifs: ['Crystalline structures', 'Geometric patterns', 'Luminous elements'],
              culturalElements: ['Spiritual symbols', 'Technology integration', 'Organic architecture']
            }
          }
        ],
        environments: [
          {
            id: 'env_001',
            name: 'New Terra Capital',
            type: 'CITY',
            climate: 'Temperate',
            description: 'Majestic capital city built around a massive space elevator, blending futuristic architecture with natural elements',
            visualAssets: {
              overview: '/assets/environments/new-terra-overview.jpg',
              details: ['space elevator', 'government district', 'commercial zones'],
              atmosphere: ['dawn', 'day', 'dusk', 'night'],
              landmarks: ['Central Tower', 'Parliament Building', 'Space Port']
            },
            features: {
              terrain: ['Urban sprawl', 'Green spaces', 'Water features'],
              structures: ['Skyscrapers', 'Monuments', 'Transportation hubs'],
              atmosphere: 'Clean, breathable air with slight industrial undertones',
              lighting: 'Dynamic lighting system that mimics natural day/night cycles'
            },
            designTheme: {
              architecture: 'Futuristic neo-classical with sustainable elements',
              colorScheme: ['#2d3748', '#4a5568', '#718096', '#a0aec0'],
              visualStyle: 'Grand scale with human accessibility, blending technology and nature'
            }
          }
        ],
        consistency: {
          overallScore: 94.2,
          styleConsistency: 96.8,
          colorHarmony: 92.4,
          thematicAlignment: 95.1,
          qualityStandard: 93.7,
          brandCompliance: 94.8,
          issues: [
            {
              type: 'style',
              severity: 'low',
              description: 'Minor variation in character proportions between assets',
              affectedAssets: ['char_001_portrait', 'char_001_full'],
              recommendation: 'Establish standard character model sheets for consistency'
            }
          ]
        },
        analytics: {
          generationStats: {
            totalAssets: 1247,
            successRate: 94.2,
            averageGenerationTime: 45.3,
            popularCategories: [
              { category: 'CHARACTER', count: 456 },
              { category: 'ENVIRONMENT', count: 389 },
              { category: 'SPACESHIP', count: 234 }
            ],
            qualityDistribution: [
              { quality: 'Excellent', percentage: 68.4 },
              { quality: 'Good', percentage: 25.8 },
              { quality: 'Acceptable', percentage: 5.8 }
            ]
          },
          usageMetrics: {
            mostUsedAssets: [
              { id: 'asset_001', name: 'Space Marine Portrait', usage: 156 },
              { id: 'asset_002', name: 'Planet Landing Sequence', usage: 89 }
            ],
            downloadStats: [
              { date: '2024-01-15', downloads: 234 },
              { date: '2024-01-14', downloads: 189 }
            ],
            storageUsage: { used: 45.7, total: 100, percentage: 45.7 }
          },
          performanceMetrics: {
            averageLoadTime: 1.2,
            cacheHitRate: 87.3,
            bandwidthUsage: 234.5,
            errorRate: 0.8
          }
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisualData();
  }, [fetchVisualData]);

  // Render functions for each tab
  const renderOverview = () => (
    <>
      {/* Visual Systems Overview - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Visual Systems Overview</h3>
        <div className="standard-metric-grid">
          <div className="standard-metric">
            <span>Total Assets</span>
            <span className="standard-metric-value">{formatNumber(visualData?.analytics?.generationStats?.totalAssets || 0)}</span>
          </div>
          <div className="standard-metric">
            <span>Success Rate</span>
            <span className="standard-metric-value">{(visualData?.analytics?.generationStats?.successRate || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Consistency Score</span>
            <span className="standard-metric-value">{(visualData?.consistency?.overallScore || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Storage Used</span>
            <span className="standard-metric-value">{(visualData?.analytics?.usageMetrics?.storageUsage?.percentage || 0).toFixed(1)}%</span>
          </div>
          <div className="standard-metric">
            <span>Avg Generation Time</span>
            <span className="standard-metric-value">{(visualData?.analytics?.generationStats?.averageGenerationTime || 0).toFixed(1)}s</span>
          </div>
          <div className="standard-metric">
            <span>Cache Hit Rate</span>
            <span className="standard-metric-value">{(visualData?.analytics?.performanceMetrics?.cacheHitRate || 0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Visual Analysis')}>Visual Analysis</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Quality Review')}>Quality Review</button>
        </div>
      </div>

      {/* Recent Assets - Full panel width */}
      <div className="standard-panel technology-theme">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🎨 Recent Visual Assets</h3>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Dimensions</th>
                <th>File Size</th>
                <th>Style Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visualData?.assets?.slice(0, 5).map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <strong>{asset.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{asset.prompt.substring(0, 50)}...</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getAssetTypeColor(asset.type), 
                      color: 'white' 
                    }}>
                      {asset.type}
                    </span>
                  </td>
                  <td>{asset.category}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(asset.status), 
                      color: 'white' 
                    }}>
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </td>
                  <td>{asset.dimensions.width}x{asset.dimensions.height}</td>
                  <td>{formatFileSize(asset.fileSize)}</td>
                  <td>{asset.consistency.styleScore}%</td>
                  <td>
                    <button className="standard-btn technology-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics - Full panel width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="standard-panel technology-theme table-panel">
          <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📈 Visual Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            <div className="chart-container">
              <BarChart
                data={visualData?.analytics?.generationStats?.popularCategories?.map(cat => ({
                  label: cat.category,
                  value: cat.count,
                  color: getAssetTypeColor('IMAGE')
                })) || []}
                title="📊 Popular Asset Categories"
                height={250}
                width={400}
                showTooltip={true}
              />
            </div>
            <div className="chart-container">
              <PieChart
                data={visualData?.analytics?.generationStats?.qualityDistribution?.map((qual, index) => ({
                  label: qual.quality,
                  value: qual.percentage,
                  color: ['#10b981', '#fbbf24', '#f59e0b'][index % 3]
                })) || []}
                title="🎯 Quality Distribution"
                size={200}
                showLegend={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderGeneration = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🎨 Asset Generation</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Generate Asset')}>Generate Asset</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Batch Generation')}>Batch Generation</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Dimensions</th>
                <th>File Size</th>
                <th>Style Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visualData?.assets?.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <strong>{asset.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{asset.prompt}</small>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getAssetTypeColor(asset.type), 
                      color: 'white' 
                    }}>
                      {asset.type}
                    </span>
                  </td>
                  <td>{asset.category}</td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      backgroundColor: getStatusColor(asset.status), 
                      color: 'white' 
                    }}>
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </td>
                  <td>{asset.createdAt}</td>
                  <td>{asset.dimensions.width}x{asset.dimensions.height}</td>
                  <td>{formatFileSize(asset.fileSize)}</td>
                  <td>{asset.consistency.styleScore}%</td>
                  <td>
                    <button className="standard-btn technology-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>👤 Character Designs</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Create Character')}>Create Character</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Character Analysis')}>Character Analysis</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Character</th>
                <th>Species</th>
                <th>Role</th>
                <th>Visual Assets</th>
                <th>Personality</th>
                <th>Style Guide</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visualData?.characters?.map((character) => (
                <tr key={character.id}>
                  <td>
                    <strong>{character.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{character.description}</small>
                  </td>
                  <td>{character.species}</td>
                  <td>{character.role}</td>
                  <td>{Object.keys(character.visualAssets).length} assets</td>
                  <td>{character.traits.personality.join(', ')}</td>
                  <td>{character.consistency.styleGuide}</td>
                  <td>
                    <button className="standard-btn technology-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSpecies = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🦠 Species Designs</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Create Species')}>Create Species</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Species Analysis')}>Species Analysis</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Species</th>
                <th>Classification</th>
                <th>Homeworld</th>
                <th>Visual Assets</th>
                <th>Physiology</th>
                <th>Design Theme</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visualData?.species?.map((species) => (
                <tr key={species.id}>
                  <td>
                    <strong>{species.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{species.description}</small>
                  </td>
                  <td>{species.classification}</td>
                  <td>{species.homeworld}</td>
                  <td>{Object.keys(species.visualAssets).length} assets</td>
                  <td>{species.characteristics.physiology.join(', ')}</td>
                  <td>{species.designGuidelines.visualStyle}</td>
                  <td>
                    <button className="standard-btn technology-theme">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEnvironments = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel technology-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🌍 Environment Designs</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn technology-theme" onClick={() => console.log('Create Environment')}>Create Environment</button>
          <button className="standard-btn technology-theme" onClick={() => console.log('Environment Analysis')}>Environment Analysis</button>
        </div>
        
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Environment</th>
                <th>Type</th>
                <th>Climate</th>
                <th>Visual Assets</th>
                <th>Features</th>
                <th>Design Theme</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visualData?.environments?.map((environment) => (
                <tr key={environment.id}>
                  <td>
                    <strong>{environment.name}</strong><br />
                    <small style={{ color: '#a0a9ba' }}>{environment.description}</small>
                  </td>
                  <td>{environment.type}</td>
                  <td>{environment.climate}</td>
                  <td>{Object.keys(environment.visualAssets).length} assets</td>
                  <td>{environment.features.terrain.join(', ')}</td>
                  <td>{environment.designTheme.architecture}</td>
                  <td>
                    <button className="standard-btn technology-theme">View</button>
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
      onRefresh={fetchVisualData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container technology-theme">
        {error && <div className="error-message">Error: {error}</div>}
        
        <div className="standard-dashboard">
          {!loading && !error && visualData ? (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'generation' && renderGeneration()}
              {activeTab === 'characters' && renderCharacters()}
              {activeTab === 'species' && renderSpecies()}
              {activeTab === 'environments' && renderEnvironments()}
            </>
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#a0a9ba',
              fontSize: '1.1rem'
            }}>
              {loading ? 'Loading visual systems data...' : 'No visual systems data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default VisualSystemsScreen;

