import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint } from '../BaseScreen';
import './VisualSystemsScreen.css';

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

interface VideoAsset {
  id: string;
  title: string;
  type: 'CUTSCENE' | 'TRAILER' | 'GAMEPLAY' | 'TUTORIAL' | 'EVENT' | 'PROMOTIONAL';
  duration: number;
  status: 'rendering' | 'completed' | 'failed' | 'queued';
  description: string;
  scenes: Array<{
    id: string;
    description: string;
    duration: number;
    assets: string[];
  }>;
  metadata: {
    resolution: string;
    frameRate: number;
    format: string;
    fileSize: number;
  };
  createdAt: string;
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

interface VisualSystemsData {
  assets: VisualAsset[];
  characters: Character[];
  species: Species[];
  environments: Environment[];
  videos: VideoAsset[];
  consistency: ConsistencyMetrics;
  analytics: AnalyticsData;
}

const VisualSystemsScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  const [visualData, setVisualData] = useState<VisualSystemsData | null>(null);
  const [activeTab, setActiveTab] = useState<'generation' | 'characters' | 'species' | 'environments' | 'videos' | 'assets' | 'consistency' | 'analytics'>('generation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/visual/assets', description: 'Get visual assets library' },
    { method: 'GET', path: '/api/visual/characters', description: 'Get character visual data' },
    { method: 'GET', path: '/api/visual/species', description: 'Get species visual designs' },
    { method: 'GET', path: '/api/visual/environments', description: 'Get environment assets' },
    { method: 'GET', path: '/api/visual/videos', description: 'Get video assets' },
    { method: 'GET', path: '/api/visual/consistency', description: 'Get visual consistency metrics' },
    { method: 'GET', path: '/api/visual/analytics', description: 'Get visual systems analytics' },
    { method: 'POST', path: '/api/visual/generate', description: 'Generate new visual asset' },
    { method: 'POST', path: '/api/visual/character', description: 'Create character design' },
    { method: 'POST', path: '/api/visual/video', description: 'Create video asset' },
    { method: 'PUT', path: '/api/visual/asset/:id', description: 'Update visual asset' },
    { method: 'DELETE', path: '/api/visual/asset/:id', description: 'Delete visual asset' }
  ];

  const fetchVisualData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        assetsRes,
        charactersRes,
        speciesRes,
        environmentsRes,
        videosRes,
        consistencyRes,
        analyticsRes
      ] = await Promise.all([
        fetch('/api/visual/assets'),
        fetch('/api/visual/characters'),
        fetch('/api/visual/species'),
        fetch('/api/visual/environments'),
        fetch('/api/visual/videos'),
        fetch('/api/visual/consistency'),
        fetch('/api/visual/analytics')
      ]);

      const [
        assets,
        characters,
        species,
        environments,
        videos,
        consistency,
        analytics
      ] = await Promise.all([
        assetsRes.json(),
        charactersRes.json(),
        speciesRes.json(),
        environmentsRes.json(),
        videosRes.json(),
        consistencyRes.json(),
        analyticsRes.json()
      ]);

      setVisualData({
        assets: assets.assets || generateMockAssets(),
        characters: characters.characters || generateMockCharacters(),
        species: species.species || generateMockSpecies(),
        environments: environments.environments || generateMockEnvironments(),
        videos: videos.videos || generateMockVideos(),
        consistency: consistency.consistency || generateMockConsistency(),
        analytics: analytics.analytics || generateMockAnalytics()
      });
    } catch (err) {
      console.error('Failed to fetch visual systems data:', err);
      // Use mock data as fallback
      setVisualData({
        assets: generateMockAssets(),
        characters: generateMockCharacters(),
        species: generateMockSpecies(),
        environments: generateMockEnvironments(),
        videos: generateMockVideos(),
        consistency: generateMockConsistency(),
        analytics: generateMockAnalytics()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisualData();
  }, [fetchVisualData]);

  const generateMockAssets = (): VisualAsset[] => [
    {
      id: 'asset-1',
      type: 'IMAGE',
      category: 'CHARACTER',
      name: 'Admiral Zara Portrait',
      prompt: 'epic space fantasy concept art, fantastical galactic civilization, otherworldly and imaginative, digital art masterpiece, portrait of Admiral Zara, evolved human forms with stellar energy tattoos, cosmic awareness eyes, flowing star-cloth garments with energy patterns, brilliant azure and prismatic silver, crystalline energy conduits, floating holographic mandalas, heroic expression and pose, interstellar era mystical technology and clothing, ethereal cosmic lighting with mystical energy auras, stellar phenomena, and magical particle effects, cinematic space opera composition with sweeping galactic vistas and dramatic scale, ultra-high quality digital art, vibrant colors, stunning visual effects, masterful detail, space age fantasy aesthetic, mystical technology, crystalline structures, energy-based designs, cosmic magic',
      url: '/assets/characters/admiral-zara.jpg',
      thumbnailUrl: '/assets/characters/admiral-zara-thumb.jpg',
      status: 'completed',
      createdAt: '2024-02-20T10:30:00Z',
      dimensions: { width: 1024, height: 1024 },
      fileSize: 2048000,
      tags: ['character', 'military', 'leader', 'cybernetic'],
      consistency: {
        styleScore: 94,
        colorPalette: ['#1a237e', '#3f51b5', '#e8eaf6', '#37474f'],
        visualTheme: 'Futuristic Military'
      }
    },
    {
      id: 'asset-2',
      type: 'IMAGE',
      category: 'PLANET',
      name: 'Kepler-442b Surface',
      prompt: 'epic space fantasy concept art, fantastical galactic civilization, otherworldly and imaginative, digital art masterpiece, Kepler-442b Surface, fantastical alien worlds with floating landmasses, crystal forests, energy geysers, and magical atmospheric phenomena, mysterious atmosphere, interstellar era mystical architecture and energy infrastructure, alien flora and fauna, atmospheric effects and weather patterns, crystalline formations and purple atmosphere, ethereal cosmic lighting with mystical energy auras, stellar phenomena, and magical particle effects, cinematic space opera composition with sweeping galactic vistas and dramatic scale, ultra-high quality digital art, vibrant colors, stunning visual effects, masterful detail, space age fantasy aesthetic, mystical technology, crystalline structures, energy-based designs, cosmic magic',
      url: '/assets/environments/kepler-442b.jpg',
      thumbnailUrl: '/assets/environments/kepler-442b-thumb.jpg',
      status: 'completed',
      createdAt: '2024-02-19T15:45:00Z',
      dimensions: { width: 2048, height: 1024 },
      fileSize: 4096000,
      tags: ['planet', 'alien', 'crystal', 'purple', 'landscape'],
      consistency: {
        styleScore: 89,
        colorPalette: ['#4a148c', '#7b1fa2', '#e1bee7', '#263238'],
        visualTheme: 'Alien Worlds'
      }
    },
    {
      id: 'asset-3',
      type: 'VIDEO',
      category: 'CUTSCENE',
      name: 'First Contact Sequence',
      prompt: 'epic space fantasy concept art, fantastical galactic civilization, otherworldly and imaginative, digital art masterpiece, epic cinematic sequence: First Contact Sequence, mystical cosmic void with swirling galaxies, ethereal nebulae, floating crystal asteroids, and dimensional portals, interstellar era mystical technology and magical effects, dramatic pacing and cosmic tension, sweeping camera movements through space, ethereal particle effects and energy signatures, character interactions with mystical dialogue, ambient cosmic soundscape elements, diplomatic meeting between human and alien representatives, ethereal cosmic lighting with mystical energy auras, stellar phenomena, and magical particle effects, cinematic space opera composition with sweeping galactic vistas and dramatic scale, ultra-high quality digital art, vibrant colors, stunning visual effects, masterful detail, space age fantasy aesthetic, mystical technology, crystalline structures, energy-based designs, cosmic magic, 30 second duration, seamless magical transitions',
      url: '/assets/videos/first-contact.mp4',
      thumbnailUrl: '/assets/videos/first-contact-thumb.jpg',
      status: 'completed',
      createdAt: '2024-02-18T09:15:00Z',
      dimensions: { width: 1920, height: 1080 },
      fileSize: 52428800,
      tags: ['cutscene', 'diplomacy', 'aliens', 'meeting'],
      consistency: {
        styleScore: 92,
        colorPalette: ['#0d47a1', '#1976d2', '#bbdefb', '#37474f'],
        visualTheme: 'Diplomatic Encounters'
      }
    }
  ];

  const generateMockCharacters = (): Character[] => [
    {
      id: 'char-1',
      name: 'Admiral Zara Chen',
      species: 'Human',
      role: 'Fleet Commander',
      description: 'Veteran military leader with cybernetic enhancements and strategic brilliance',
      visualAssets: {
        portrait: '/assets/characters/zara-portrait.jpg',
        fullBody: '/assets/characters/zara-full.jpg',
        expressions: ['/assets/characters/zara-smile.jpg', '/assets/characters/zara-stern.jpg'],
        outfits: ['/assets/characters/zara-uniform.jpg', '/assets/characters/zara-casual.jpg']
      },
      traits: {
        personality: ['Strategic', 'Determined', 'Compassionate', 'Analytical'],
        appearance: ['Cybernetic eye', 'Military bearing', 'Confident posture', 'Battle scars'],
        background: 'Rose through ranks during the Vega Conflict, known for innovative tactics'
      },
      consistency: {
        styleGuide: 'Futuristic military aesthetic with subtle cybernetic elements',
        colorScheme: ['#1a237e', '#3f51b5', '#e8eaf6'],
        designNotes: 'Maintain authoritative presence while showing humanity'
      }
    },
    {
      id: 'char-2',
      name: 'Dr. Keth Vorthak',
      species: 'Zentaurian',
      role: 'Chief Scientist',
      description: 'Brilliant xenobiologist from the Zentauri system, expert in interspecies relations',
      visualAssets: {
        portrait: '/assets/characters/keth-portrait.jpg',
        fullBody: '/assets/characters/keth-full.jpg',
        expressions: ['/assets/characters/keth-curious.jpg', '/assets/characters/keth-focused.jpg'],
        outfits: ['/assets/characters/keth-lab-coat.jpg', '/assets/characters/keth-formal.jpg']
      },
      traits: {
        personality: ['Curious', 'Methodical', 'Diplomatic', 'Innovative'],
        appearance: ['Elongated limbs', 'Bioluminescent markings', 'Large eyes', 'Graceful movements'],
        background: 'Leading researcher in cross-species biology and cultural exchange'
      },
      consistency: {
        styleGuide: 'Elegant alien design with scientific professionalism',
        colorScheme: ['#4a148c', '#7b1fa2', '#e1bee7'],
        designNotes: 'Balance alien features with approachable demeanor'
      }
    }
  ];

  const generateMockSpecies = (): Species[] => [
    {
      id: 'species-1',
      name: 'Zentaurians',
      classification: 'Humanoid',
      homeworld: 'Zentauri Prime',
      description: 'Advanced peaceful species known for scientific achievements and diplomatic skills',
      visualAssets: {
        reference: '/assets/species/zentaurian-ref.jpg',
        variations: ['/assets/species/zentaurian-var1.jpg', '/assets/species/zentaurian-var2.jpg'],
        anatomy: ['/assets/species/zentaurian-anatomy.jpg'],
        culture: ['/assets/species/zentaurian-culture.jpg', '/assets/species/zentaurian-tech.jpg']
      },
      characteristics: {
        physiology: ['Elongated limbs', 'Bioluminescent skin patterns', 'Enhanced cognitive capacity'],
        technology: ['Quantum computing', 'Bioengineering', 'Energy manipulation'],
        society: ['Scientific meritocracy', 'Peaceful exploration', 'Knowledge sharing']
      },
      designGuidelines: {
        colorPalette: ['#4a148c', '#7b1fa2', '#e1bee7', '#f3e5f5'],
        visualMotifs: ['Flowing organic shapes', 'Bioluminescent patterns', 'Crystalline structures'],
        culturalElements: ['Scientific instruments', 'Meditation spaces', 'Knowledge repositories']
      }
    },
    {
      id: 'species-2',
      name: 'Vegan Collective',
      classification: 'Synthetic-Organic Hybrid',
      homeworld: 'Vega Station Network',
      description: 'Collective consciousness of enhanced beings combining organic and synthetic elements',
      visualAssets: {
        reference: '/assets/species/vegan-ref.jpg',
        variations: ['/assets/species/vegan-var1.jpg', '/assets/species/vegan-var2.jpg'],
        anatomy: ['/assets/species/vegan-anatomy.jpg'],
        culture: ['/assets/species/vegan-collective.jpg', '/assets/species/vegan-network.jpg']
      },
      characteristics: {
        physiology: ['Cybernetic implants', 'Neural network connections', 'Modular body parts'],
        technology: ['Collective intelligence', 'Nanotechnology', 'Quantum networking'],
        society: ['Shared consciousness', 'Efficiency optimization', 'Technological integration']
      },
      designGuidelines: {
        colorPalette: ['#0d47a1', '#1976d2', '#bbdefb', '#e3f2fd'],
        visualMotifs: ['Geometric patterns', 'Network connections', 'Technological integration'],
        culturalElements: ['Data nodes', 'Collective spaces', 'Integration chambers']
      }
    }
  ];

  const generateMockEnvironments = (): Environment[] => [
    {
      id: 'env-1',
      name: 'New Terra Capital',
      type: 'CITY',
      climate: 'Temperate',
      description: 'Sprawling metropolis serving as the capital of human space civilization',
      visualAssets: {
        overview: '/assets/environments/new-terra-overview.jpg',
        details: ['/assets/environments/new-terra-streets.jpg', '/assets/environments/new-terra-towers.jpg'],
        atmosphere: ['/assets/environments/new-terra-skyline.jpg'],
        landmarks: ['/assets/environments/new-terra-capitol.jpg', '/assets/environments/new-terra-spaceport.jpg']
      },
      features: {
        terrain: ['Urban landscape', 'Elevated walkways', 'Underground networks'],
        structures: ['Skyscrapers', 'Government buildings', 'Transportation hubs'],
        atmosphere: 'Clean air with atmospheric processors',
        lighting: 'Natural sunlight with artificial enhancement'
      },
      designTheme: {
        architecture: 'Futuristic neo-classical with sustainable elements',
        colorScheme: ['#37474f', '#546e7a', '#b0bec5', '#eceff1'],
        visualStyle: 'Clean, organized, technologically advanced'
      }
    },
    {
      id: 'env-2',
      name: 'Kepler-442b Research Station',
      type: 'STATION',
      climate: 'Controlled Environment',
      description: 'Advanced research facility studying alien ecosystems and technologies',
      visualAssets: {
        overview: '/assets/environments/kepler-station-overview.jpg',
        details: ['/assets/environments/kepler-labs.jpg', '/assets/environments/kepler-habitat.jpg'],
        atmosphere: ['/assets/environments/kepler-exterior.jpg'],
        landmarks: ['/assets/environments/kepler-observatory.jpg', '/assets/environments/kepler-landing.jpg']
      },
      features: {
        terrain: ['Alien surface', 'Research platforms', 'Protective barriers'],
        structures: ['Laboratory modules', 'Living quarters', 'Communication arrays'],
        atmosphere: 'Artificial atmosphere with environmental suits required outside',
        lighting: 'Artificial lighting with alien star illumination'
      },
      designTheme: {
        architecture: 'Modular scientific design with alien influences',
        colorScheme: ['#4a148c', '#7b1fa2', '#e1bee7', '#263238'],
        visualStyle: 'Scientific, adaptable, alien-influenced'
      }
    }
  ];

  const generateMockVideos = (): VideoAsset[] => [
    {
      id: 'video-1',
      title: 'First Contact Protocol',
      type: 'CUTSCENE',
      duration: 180,
      status: 'completed',
      description: 'Diplomatic first contact sequence between human and Zentaurian representatives',
      scenes: [
        {
          id: 'scene-1',
          description: 'Approach of Zentaurian vessel',
          duration: 45,
          assets: ['zentaurian-ship.jpg', 'space-backdrop.jpg']
        },
        {
          id: 'scene-2',
          description: 'Initial communication exchange',
          duration: 60,
          assets: ['communication-array.jpg', 'translator-device.jpg']
        },
        {
          id: 'scene-3',
          description: 'Face-to-face meeting',
          duration: 75,
          assets: ['meeting-chamber.jpg', 'diplomatic-table.jpg']
        }
      ],
      metadata: {
        resolution: '1920x1080',
        frameRate: 30,
        format: 'MP4',
        fileSize: 52428800
      },
      createdAt: '2024-02-18T09:15:00Z'
    },
    {
      id: 'video-2',
      title: 'Galaxy Overview Trailer',
      type: 'PROMOTIONAL',
      duration: 120,
      status: 'completed',
      description: 'Cinematic overview of the game universe and major civilizations',
      scenes: [
        {
          id: 'scene-1',
          description: 'Galaxy-wide view',
          duration: 30,
          assets: ['galaxy-map.jpg', 'star-systems.jpg']
        },
        {
          id: 'scene-2',
          description: 'Civilization showcases',
          duration: 60,
          assets: ['human-cities.jpg', 'alien-worlds.jpg']
        },
        {
          id: 'scene-3',
          description: 'Conflict and cooperation',
          duration: 30,
          assets: ['space-battles.jpg', 'diplomatic-meetings.jpg']
        }
      ],
      metadata: {
        resolution: '2560x1440',
        frameRate: 60,
        format: 'MP4',
        fileSize: 104857600
      },
      createdAt: '2024-02-17T14:30:00Z'
    }
  ];

  const generateMockConsistency = (): ConsistencyMetrics => ({
    overallScore: 87,
    styleConsistency: 89,
    colorHarmony: 92,
    thematicAlignment: 85,
    qualityStandard: 92,
    brandCompliance: 84,
    issues: [
      {
        type: 'style',
        severity: 'medium',
        description: 'Some character designs deviate from established art style',
        affectedAssets: ['char-3', 'char-7', 'char-12'],
        recommendation: 'Apply consistent lighting and rendering techniques'
      },
      {
        type: 'color',
        severity: 'low',
        description: 'Minor color palette inconsistencies in environment assets',
        affectedAssets: ['env-5', 'env-8'],
        recommendation: 'Standardize color grading across environment sets'
      },
      {
        type: 'quality',
        severity: 'high',
        description: 'Resolution inconsistency in UI elements',
        affectedAssets: ['ui-1', 'ui-4', 'ui-9'],
        recommendation: 'Regenerate UI assets at consistent high resolution'
      }
    ]
  });

  const generateMockAnalytics = (): AnalyticsData => ({
    generationStats: {
      totalAssets: 1247,
      successRate: 94.2,
      averageGenerationTime: 45,
      popularCategories: [
        { category: 'CHARACTER', count: 342 },
        { category: 'ENVIRONMENT', count: 298 },
        { category: 'SPACESHIP', count: 187 },
        { category: 'UI', count: 156 },
        { category: 'EFFECT', count: 134 }
      ],
      qualityDistribution: [
        { quality: 'Excellent', percentage: 34 },
        { quality: 'Good', percentage: 42 },
        { quality: 'Fair', percentage: 18 },
        { quality: 'Poor', percentage: 6 }
      ]
    },
    usageMetrics: {
      mostUsedAssets: [
        { id: 'asset-1', name: 'Admiral Zara Portrait', usage: 156 },
        { id: 'asset-2', name: 'Kepler-442b Surface', usage: 134 },
        { id: 'asset-3', name: 'Human Cruiser', usage: 98 },
        { id: 'asset-4', name: 'Zentaurian Ambassador', usage: 87 },
        { id: 'asset-5', name: 'New Terra Skyline', usage: 76 }
      ],
      downloadStats: [
        { date: '2024-02-20', downloads: 234 },
        { date: '2024-02-19', downloads: 198 },
        { date: '2024-02-18', downloads: 267 },
        { date: '2024-02-17', downloads: 189 },
        { date: '2024-02-16', downloads: 223 }
      ],
      storageUsage: { used: 15.7, total: 50.0, percentage: 31.4 }
    },
    performanceMetrics: {
      averageLoadTime: 1.2,
      cacheHitRate: 89.3,
      bandwidthUsage: 2.4,
      errorRate: 0.8
    }
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'generating':
      case 'rendering': return '#3b82f6';
      case 'queued': return '#eab308';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#eab308';
      default: return '#6b7280';
    }
  };

  return (
    <BaseScreen
      screenId={screenId}
      title={title}
      icon={icon}
      gameContext={gameContext}
      apiEndpoints={apiEndpoints}
      onRefresh={fetchVisualData}
    >
      <div className="visual-systems-screen">
        <div className="view-tabs">
          <button 
            className={`tab ${activeTab === 'generation' ? 'active' : ''}`}
            onClick={() => setActiveTab('generation')}
          >
            🎨 Generation
          </button>
          <button 
            className={`tab ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            👥 Characters
          </button>
          <button 
            className={`tab ${activeTab === 'species' ? 'active' : ''}`}
            onClick={() => setActiveTab('species')}
          >
            🛸 Species
          </button>
          <button 
            className={`tab ${activeTab === 'environments' ? 'active' : ''}`}
            onClick={() => setActiveTab('environments')}
          >
            🌍 Environments
          </button>
          <button 
            className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            🎬 Videos
          </button>
          <button 
            className={`tab ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            📁 Assets
          </button>
          <button 
            className={`tab ${activeTab === 'consistency' ? 'active' : ''}`}
            onClick={() => setActiveTab('consistency')}
          >
            🎯 Consistency
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        <div className="tab-content">
          {loading && <div className="loading">Loading visual systems data...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && visualData && (
            <>
              {activeTab === 'generation' && (
                <div className="generation-tab">
                  <div className="generation-form">
                    <h4>🎨 Generate Visual Assets</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Asset Type</label>
                        <select className="form-control">
                          <option value="IMAGE">Image</option>
                          <option value="VIDEO">Video</option>
                          <option value="ANIMATION">Animation</option>
                          <option value="SPRITE">Sprite</option>
                          <option value="TEXTURE">Texture</option>
                          <option value="ICON">Icon</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-control">
                          <option value="CHARACTER">Character</option>
                          <option value="SPECIES">Species</option>
                          <option value="PLANET">Planet</option>
                          <option value="CITY">City</option>
                          <option value="SPACESHIP">Spaceship</option>
                          <option value="ENVIRONMENT">Environment</option>
                        </select>
                      </div>
                      <div className="form-group full-width">
                        <label>Generation Prompt</label>
                        <textarea 
                          className="form-control textarea"
                          placeholder="Describe the visual asset you want to generate..."
                          defaultValue="A futuristic space station orbiting a blue planet, with sleek metallic surfaces and glowing energy conduits"
                        />
                      </div>
                      <div className="form-group">
                        <label>Style</label>
                        <select className="form-control">
                          <option value="realistic">Realistic</option>
                          <option value="stylized">Stylized</option>
                          <option value="concept-art">Concept Art</option>
                          <option value="cinematic">Cinematic</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Quality</label>
                        <select className="form-control">
                          <option value="standard">Standard</option>
                          <option value="high">High</option>
                          <option value="ultra">Ultra</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="recent-generations">
                    <h4>Recent Generations</h4>
                    <div className="generations-grid">
                      {visualData.assets.slice(0, 6).map((asset) => (
                        <div key={asset.id} className="generation-item">
                          <div className="generation-preview">
                            <div className="asset-placeholder">{asset.type}</div>
                            <div className="generation-status" style={{ color: getStatusColor(asset.status) }}>
                              {asset.status.toUpperCase()}
                            </div>
                          </div>
                          <div className="generation-info">
                            <div className="generation-name">{asset.name}</div>
                            <div className="generation-category">{asset.category}</div>
                            <div className="generation-size">{formatFileSize(asset.fileSize)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Asset</button>
                    <button className="action-btn secondary">Batch Generate</button>
                    <button className="action-btn">Style Transfer</button>
                  </div>
                </div>
              )}

              {activeTab === 'characters' && (
                <div className="characters-tab">
                  <div className="characters-grid">
                    {visualData.characters.map((character) => (
                      <div key={character.id} className="character-item">
                        <div className="character-header">
                          <div className="character-name">{character.name}</div>
                          <div className="character-species">{character.species}</div>
                        </div>
                        <div className="character-role">{character.role}</div>
                        <div className="character-description">{character.description}</div>
                        <div className="character-traits">
                          <div className="trait-section">
                            <strong>Personality:</strong>
                            <div className="trait-tags">
                              {character.traits.personality.map((trait, i) => (
                                <span key={i} className="trait-tag">{trait}</span>
                              ))}
                            </div>
                          </div>
                          <div className="trait-section">
                            <strong>Appearance:</strong>
                            <div className="trait-tags">
                              {character.traits.appearance.map((trait, i) => (
                                <span key={i} className="trait-tag">{trait}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="character-background">
                          <strong>Background:</strong> {character.traits.background}
                        </div>
                        <div className="character-consistency">
                          <div className="consistency-colors">
                            {character.consistency.colorScheme.map((color, i) => (
                              <div key={i} className="color-swatch" style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                          <div className="consistency-notes">{character.consistency.designNotes}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Create Character</button>
                    <button className="action-btn secondary">Generate Variations</button>
                    <button className="action-btn">Style Guide</button>
                  </div>
                </div>
              )}

              {activeTab === 'species' && (
                <div className="species-tab">
                  <div className="species-grid">
                    {visualData.species.map((species) => (
                      <div key={species.id} className="species-item">
                        <div className="species-header">
                          <div className="species-name">{species.name}</div>
                          <div className="species-classification">{species.classification}</div>
                        </div>
                        <div className="species-homeworld">Homeworld: {species.homeworld}</div>
                        <div className="species-description">{species.description}</div>
                        <div className="species-characteristics">
                          <div className="characteristic-section">
                            <strong>Physiology:</strong>
                            <div className="characteristic-list">
                              {species.characteristics.physiology.map((trait, i) => (
                                <div key={i} className="characteristic-item">• {trait}</div>
                              ))}
                            </div>
                          </div>
                          <div className="characteristic-section">
                            <strong>Technology:</strong>
                            <div className="characteristic-list">
                              {species.characteristics.technology.map((tech, i) => (
                                <div key={i} className="characteristic-item">• {tech}</div>
                              ))}
                            </div>
                          </div>
                          <div className="characteristic-section">
                            <strong>Society:</strong>
                            <div className="characteristic-list">
                              {species.characteristics.society.map((social, i) => (
                                <div key={i} className="characteristic-item">• {social}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="species-design">
                          <div className="design-colors">
                            {species.designGuidelines.colorPalette.map((color, i) => (
                              <div key={i} className="color-swatch" style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                          <div className="design-motifs">
                            <strong>Visual Motifs:</strong>
                            <div className="motif-tags">
                              {species.designGuidelines.visualMotifs.map((motif, i) => (
                                <span key={i} className="motif-tag">{motif}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Design Species</button>
                    <button className="action-btn secondary">Cultural Assets</button>
                    <button className="action-btn">Evolutionary Tree</button>
                  </div>
                </div>
              )}

              {activeTab === 'environments' && (
                <div className="environments-tab">
                  <div className="environments-grid">
                    {visualData.environments.map((environment) => (
                      <div key={environment.id} className="environment-item">
                        <div className="environment-header">
                          <div className="environment-name">{environment.name}</div>
                          <div className="environment-type">{environment.type}</div>
                        </div>
                        <div className="environment-climate">Climate: {environment.climate}</div>
                        <div className="environment-description">{environment.description}</div>
                        <div className="environment-features">
                          <div className="feature-section">
                            <strong>Terrain:</strong>
                            <div className="feature-tags">
                              {environment.features.terrain.map((terrain, i) => (
                                <span key={i} className="feature-tag">{terrain}</span>
                              ))}
                            </div>
                          </div>
                          <div className="feature-section">
                            <strong>Structures:</strong>
                            <div className="feature-tags">
                              {environment.features.structures.map((structure, i) => (
                                <span key={i} className="feature-tag">{structure}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="environment-design">
                          <div className="design-info">
                            <div className="design-architecture">
                              <strong>Architecture:</strong> {environment.designTheme.architecture}
                            </div>
                            <div className="design-style">
                              <strong>Visual Style:</strong> {environment.designTheme.visualStyle}
                            </div>
                          </div>
                          <div className="design-colors">
                            {environment.designTheme.colorScheme.map((color, i) => (
                              <div key={i} className="color-swatch" style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Create Environment</button>
                    <button className="action-btn secondary">Generate Variations</button>
                    <button className="action-btn">Lighting Study</button>
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="videos-tab">
                  <div className="videos-grid">
                    {visualData.videos.map((video) => (
                      <div key={video.id} className="video-item">
                        <div className="video-header">
                          <div className="video-title">{video.title}</div>
                          <div className="video-type">{video.type}</div>
                        </div>
                        <div className="video-details">
                          <div className="video-duration">Duration: {formatDuration(video.duration)}</div>
                          <div className="video-status" style={{ color: getStatusColor(video.status) }}>
                            Status: {video.status.toUpperCase()}
                          </div>
                          <div className="video-resolution">{video.metadata.resolution}</div>
                          <div className="video-size">{formatFileSize(video.metadata.fileSize)}</div>
                        </div>
                        <div className="video-description">{video.description}</div>
                        <div className="video-scenes">
                          <strong>Scenes:</strong>
                          <div className="scenes-list">
                            {video.scenes.map((scene) => (
                              <div key={scene.id} className="scene-item">
                                <div className="scene-description">{scene.description}</div>
                                <div className="scene-duration">{formatDuration(scene.duration)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Create Video</button>
                    <button className="action-btn secondary">Storyboard</button>
                    <button className="action-btn">Render Queue</button>
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="assets-tab">
                  <div className="assets-library">
                    <div className="library-header">
                      <h4>📁 Asset Library</h4>
                      <div className="library-stats">
                        <div className="stat-item">
                          <span className="stat-value">{visualData.assets.length}</span>
                          <span className="stat-label">Total Assets</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{formatFileSize(visualData.assets.reduce((sum, asset) => sum + asset.fileSize, 0))}</span>
                          <span className="stat-label">Storage Used</span>
                        </div>
                      </div>
                    </div>
                    <div className="assets-grid">
                      {visualData.assets.map((asset) => (
                        <div key={asset.id} className="asset-item">
                          <div className="asset-preview">
                            <div className="asset-placeholder">{asset.type}</div>
                            <div className="asset-status" style={{ color: getStatusColor(asset.status) }}>
                              {asset.status}
                            </div>
                          </div>
                          <div className="asset-info">
                            <div className="asset-name">{asset.name}</div>
                            <div className="asset-category">{asset.category}</div>
                            <div className="asset-dimensions">{asset.dimensions.width}×{asset.dimensions.height}</div>
                            <div className="asset-size">{formatFileSize(asset.fileSize)}</div>
                            <div className="asset-consistency">
                              Style Score: {asset.consistency.styleScore}%
                            </div>
                          </div>
                          <div className="asset-tags">
                            {asset.tags.map((tag, i) => (
                              <span key={i} className="asset-tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Upload Asset</button>
                    <button className="action-btn secondary">Bulk Operations</button>
                    <button className="action-btn">Export Library</button>
                  </div>
                </div>
              )}

              {activeTab === 'consistency' && (
                <div className="consistency-tab">
                  <div className="consistency-overview">
                    <h4>🎯 Visual Consistency Metrics</h4>
                    <div className="consistency-scores">
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.overallScore}%</div>
                        <div className="score-label">Overall Score</div>
                      </div>
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.styleConsistency}%</div>
                        <div className="score-label">Style Consistency</div>
                      </div>
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.colorHarmony}%</div>
                        <div className="score-label">Color Harmony</div>
                      </div>
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.thematicAlignment}%</div>
                        <div className="score-label">Thematic Alignment</div>
                      </div>
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.qualityStandard}%</div>
                        <div className="score-label">Quality Standard</div>
                      </div>
                      <div className="score-item">
                        <div className="score-value">{visualData.consistency.brandCompliance}%</div>
                        <div className="score-label">Brand Compliance</div>
                      </div>
                    </div>
                  </div>
                  <div className="consistency-issues">
                    <h4>⚠️ Consistency Issues</h4>
                    <div className="issues-list">
                      {visualData.consistency.issues.map((issue, i) => (
                        <div key={i} className="issue-item">
                          <div className="issue-header">
                            <div className="issue-type">{issue.type.toUpperCase()}</div>
                            <div className="issue-severity" style={{ color: getSeverityColor(issue.severity) }}>
                              {issue.severity.toUpperCase()}
                            </div>
                          </div>
                          <div className="issue-description">{issue.description}</div>
                          <div className="issue-affected">
                            <strong>Affected Assets:</strong> {issue.affectedAssets.join(', ')}
                          </div>
                          <div className="issue-recommendation">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Run Analysis</button>
                    <button className="action-btn secondary">Fix Issues</button>
                    <button className="action-btn">Style Guide</button>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <div className="analytics-grid">
                    <div className="generation-stats">
                      <h4>📈 Generation Statistics</h4>
                      <div className="stats-metrics">
                        <div className="stat-metric">
                          <span className="stat-value">{visualData.analytics.generationStats.totalAssets}</span>
                          <span className="stat-label">Total Assets</span>
                        </div>
                        <div className="stat-metric">
                          <span className="stat-value">{visualData.analytics.generationStats.successRate}%</span>
                          <span className="stat-label">Success Rate</span>
                        </div>
                        <div className="stat-metric">
                          <span className="stat-value">{visualData.analytics.generationStats.averageGenerationTime}s</span>
                          <span className="stat-label">Avg Generation Time</span>
                        </div>
                      </div>
                      <div className="popular-categories">
                        <strong>Popular Categories:</strong>
                        <div className="categories-list">
                          {visualData.analytics.generationStats.popularCategories.map((cat, i) => (
                            <div key={i} className="category-item">
                              <span className="category-name">{cat.category}</span>
                              <span className="category-count">{cat.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="usage-metrics">
                      <h4>📊 Usage Metrics</h4>
                      <div className="storage-usage">
                        <div className="storage-info">
                          <span>Storage: {visualData.analytics.usageMetrics.storageUsage.used} GB / {visualData.analytics.usageMetrics.storageUsage.total} GB</span>
                          <span>({visualData.analytics.usageMetrics.storageUsage.percentage}%)</span>
                        </div>
                        <div className="storage-bar">
                          <div className="storage-fill" style={{ width: `${visualData.analytics.usageMetrics.storageUsage.percentage}%` }}></div>
                        </div>
                      </div>
                      <div className="most-used">
                        <strong>Most Used Assets:</strong>
                        <div className="usage-list">
                          {visualData.analytics.usageMetrics.mostUsedAssets.map((asset, i) => (
                            <div key={i} className="usage-item">
                              <span className="usage-name">{asset.name}</span>
                              <span className="usage-count">{asset.usage} uses</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="performance-metrics">
                      <h4>⚡ Performance Metrics</h4>
                      <div className="performance-stats">
                        <div className="perf-metric">
                          <span className="perf-value">{visualData.analytics.performanceMetrics.averageLoadTime}s</span>
                          <span className="perf-label">Avg Load Time</span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-value">{visualData.analytics.performanceMetrics.cacheHitRate}%</span>
                          <span className="perf-label">Cache Hit Rate</span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-value">{visualData.analytics.performanceMetrics.bandwidthUsage} GB</span>
                          <span className="perf-label">Bandwidth Usage</span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-value">{visualData.analytics.performanceMetrics.errorRate}%</span>
                          <span className="perf-label">Error Rate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-actions">
                    <button className="action-btn">Generate Report</button>
                    <button className="action-btn secondary">Performance Analysis</button>
                    <button className="action-btn">Usage Trends</button>
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

export default VisualSystemsScreen;
