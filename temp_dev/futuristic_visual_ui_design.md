# Futuristic Visual UI Design - PC-First Civilization Command Center

## Design Philosophy

### **Command Center Aesthetic**
- **Sci-Fi Command Bridge**: Think Star Trek bridge, Mass Effect Normandy, or Stellaris interface
- **Holographic Elements**: Glowing borders, translucent panels, particle effects
- **Data-Rich Environment**: Multiple screens, extensive analytics, real-time visualizations
- **Cinematic Experience**: Smooth animations, dramatic lighting, immersive atmosphere

### **Visual Hierarchy**
- **Primary Focus**: Large central display with rotating content (planet view, battle maps, etc.)
- **Secondary Displays**: Surrounding analytics panels with live charts and metrics
- **Tertiary Info**: Status bars, notifications, and quick access controls
- **Ambient Elements**: Background animations, particle systems, atmospheric effects

## Screen Layout (PC-First: 1920×1080 minimum)

### **Main Command Interface**
```
┌─────────────────────── Command Header (120px) ──────────────────────────┐
│ 🌌 STARTALES COMMAND CENTER    🎯 Campaign: New Terra    ⏰ Stardate 2387.4 │
│ 👤 Leader Avatar | 📊 Approval: 67% | 💰 Treasury: 2.4T Credits | 🔔 Alerts │
└─────────────────────────────────────────────────────────────────────────┘
┌─ Left Panel ─┬────────────── Central Display (1200×800) ──────────────┬─ Right Panel ─┐
│ 🎮 Quick Cmd  │ ┌─ Primary View ─────────────────────────────────────┐ │ 📊 Live Metrics│
│ 🌍 Planets    │ │                                                   │ │ Population:    │
│ 🏛️ Government │ │         🌍 PLANET TERRA NOVA                      │ │ 340M (+0.8%)   │
│ 💰 Economy    │ │    [AI-Generated Planet Visualization]            │ │ ━━━━━━━━━━     │
│ 👥 Population │ │                                                   │ │                │
│ 🛡️ Military   │ │  Cities: 47  |  Population: 340M                 │ │ GDP Growth:    │
│ 🔬 Research   │ │  Happiness: 72% | Security: 87%                   │ │ +2.1% ↗️       │
│ 🌌 Diplomacy  │ │                                                   │ │ ━━━━━━━━━━     │
│ 📰 Intel      │ │ [Real-time city lights, weather, traffic]        │ │                │
│ 🎬 Media      │ └───────────────────────────────────────────────────┘ │ Threats:       │
│               │ ┌─ Secondary Displays ──────────────────────────────┐ │ 2 Active ⚠️    │
│ 🎯 Objectives │ │ [Economic Chart] [Population Graph] [Tech Tree]   │ │ ━━━━━━━━━━     │
│ ⚙️ Settings   │ └───────────────────────────────────────────────────┘ │                │
└───────────────┴─────────────────────────────────────────────────────────┴────────────────┘
┌─────────────────────── Action Bar & Status (80px) ──────────────────────────┐
│ 🎤 [Address Nation] 📋 [Daily Briefing] ⚔️ [Military Orders] 🔬 [Research]    │
│ ⏸️ Simulation: RUNNING | Tick: 1,247 | Speed: 2min/tick | Next: 00:47       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Visual Design System

### **Futuristic Color Palette**
```css
/* Primary - Cyan/Blue Tech */
--primary-glow: #00d9ff;
--primary-bright: #0099cc;
--primary-dark: #004d66;
--primary-shadow: rgba(0, 217, 255, 0.3);

/* Secondary - Orange/Amber Energy */
--secondary-glow: #ff9500;
--secondary-bright: #cc7700;
--secondary-dark: #663c00;
--secondary-shadow: rgba(255, 149, 0, 0.3);

/* Success - Green Matrix */
--success-glow: #00ff88;
--success-bright: #00cc66;
--success-dark: #004d26;

/* Warning - Yellow Alert */
--warning-glow: #ffdd00;
--warning-bright: #ccaa00;
--warning-dark: #665500;

/* Danger - Red Alert */
--danger-glow: #ff3366;
--danger-bright: #cc1144;
--danger-dark: #660822;

/* Interface - Dark Sci-Fi */
--bg-space: #0a0a0f;           /* Deep space background */
--bg-panel: #1a1a2e;          /* Panel backgrounds */
--bg-surface: #16213e;        /* Interactive surfaces */
--border-glow: #2a4a6b;       /* Glowing borders */
--text-primary: #e0e6ed;      /* Primary text */
--text-secondary: #a0b3c8;    /* Secondary text */
--text-accent: #00d9ff;       /* Accent text */
```

### **Typography - Futuristic Fonts**
```css
/* Primary - Orbitron (Sci-Fi Headers) */
--font-display: 'Orbitron', 'Exo 2', sans-serif;

/* Secondary - Rajdhani (UI Text) */
--font-ui: 'Rajdhani', 'Titillium Web', sans-serif;

/* Monospace - Share Tech Mono (Data/Code) */
--font-mono: 'Share Tech Mono', 'Courier Prime', monospace;

/* Sizes with Glow Effects */
--text-hero: 3.5rem;     /* 56px - Hero displays */
--text-display: 2.5rem;  /* 40px - Major headings */
--text-title: 1.875rem;  /* 30px - Section titles */
--text-heading: 1.5rem;  /* 24px - Subsections */
--text-body: 1rem;       /* 16px - Body text */
--text-caption: 0.875rem; /* 14px - Captions */
--text-micro: 0.75rem;   /* 12px - Micro text */
```

### **Visual Effects System**
```css
/* Glow Effects */
.glow-primary {
  box-shadow: 0 0 20px var(--primary-shadow);
  border: 1px solid var(--primary-glow);
}

.glow-text {
  text-shadow: 0 0 10px currentColor;
}

/* Holographic Panels */
.holo-panel {
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.9) 0%, 
    rgba(22, 33, 62, 0.7) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 8px;
}

/* Animated Borders */
.animated-border {
  position: relative;
  overflow: hidden;
}

.animated-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, var(--primary-glow), transparent);
  animation: borderScan 3s infinite;
}

@keyframes borderScan {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Particle Background */
.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: radial-gradient(circle at 20% 80%, 
    rgba(0, 217, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, 
    rgba(255, 149, 0, 0.1) 0%, transparent 50%);
}
```

## AI-Generated Visual Content Integration

### **Visual Systems API Integration**
```typescript
// Enhanced Visual Systems Service
class VisualContentService {
  // Character Generation
  async generateCharacter(params: {
    species: string;
    role: 'leader' | 'advisor' | 'citizen' | 'military';
    style: 'portrait' | 'full-body' | 'action';
    mood?: string;
  }): Promise<GeneratedImage> {
    return await apiClient.post('/api/visual-systems/generate/character', params);
  }

  // Planet/City Generation
  async generatePlanet(params: {
    type: 'terrestrial' | 'gas-giant' | 'desert' | 'ocean' | 'ice';
    development: 'primitive' | 'industrial' | 'advanced' | 'utopian';
    view: 'orbital' | 'surface' | 'cityscape';
    time: 'day' | 'night' | 'sunset';
  }): Promise<GeneratedImage> {
    return await apiClient.post('/api/visual-systems/generate/planet', params);
  }

  // Species Generation
  async generateSpecies(params: {
    category: 'humanoid' | 'reptilian' | 'insectoid' | 'energy-being';
    intelligence: 'primitive' | 'advanced' | 'transcendent';
    hostility: 'peaceful' | 'neutral' | 'aggressive';
  }): Promise<GeneratedImage> {
    return await apiClient.post('/api/visual-systems/generate/species', params);
  }

  // Technology Visualization
  async generateTechnology(params: {
    category: 'military' | 'civilian' | 'research' | 'infrastructure';
    era: 'current' | 'near-future' | 'far-future' | 'transcendent';
    scale: 'personal' | 'vehicle' | 'building' | 'megastructure';
  }): Promise<GeneratedImage> {
    return await apiClient.post('/api/visual-systems/generate/technology', params);
  }

  // Video Generation for Events
  async generateEventVideo(params: {
    event: 'discovery' | 'battle' | 'diplomacy' | 'disaster' | 'celebration';
    duration: number; // seconds
    style: 'cinematic' | 'documentary' | 'news-report';
  }): Promise<GeneratedVideo> {
    return await apiClient.post('/api/visual-systems/generate/video', params);
  }
}
```

### **Dynamic Visual Components**
```typescript
// Planet Viewer Component
interface PlanetViewerProps {
  planetId: string;
  view: 'orbital' | 'surface' | 'cities';
  realTime?: boolean;
}

function PlanetViewer({ planetId, view, realTime = true }: PlanetViewerProps) {
  const [planetImage, setPlanetImage] = useState<string | null>(null);
  const [cityLights, setCityLights] = useState<CityLight[]>([]);
  const [weather, setWeather] = useState<WeatherSystem[]>([]);

  useEffect(() => {
    // Generate planet visualization
    visualService.generatePlanet({
      type: planet.type,
      development: planet.developmentLevel,
      view,
      time: getCurrentTime()
    }).then(img => setPlanetImage(img.url));

    if (realTime) {
      // Subscribe to real-time updates
      wsClient.subscribe('planet-update', handlePlanetUpdate);
    }
  }, [planetId, view]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* AI-Generated Planet Background */}
      <img 
        src={planetImage} 
        alt={`Planet ${planet.name}`}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay: City Lights (animated) */}
      {cityLights.map(light => (
        <div
          key={light.id}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
          style={{ 
            left: `${light.x}%`, 
            top: `${light.y}%`,
            boxShadow: '0 0 10px #fbbf24'
          }}
        />
      ))}

      {/* Overlay: Weather Systems */}
      {weather.map(system => (
        <WeatherOverlay key={system.id} system={system} />
      ))}

      {/* UI Overlay: Planet Stats */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="holo-panel p-4">
          <h3 className="text-xl font-display text-primary-glow">
            {planet.name}
          </h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <Metric label="Population" value="340M" />
            <Metric label="Happiness" value="72%" />
            <Metric label="Development" value="Advanced" />
            <Metric label="Security" value="87%" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Extensive Analytics & Charts System

### **Advanced Chart Library**
```typescript
// Custom Chart Components with Futuristic Styling
interface FuturisticChartProps {
  data: ChartData;
  type: 'line' | 'area' | 'bar' | 'radar' | 'heatmap' | 'network';
  theme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  interactive?: boolean;
  realTime?: boolean;
}

function FuturisticChart({ 
  data, 
  type, 
  theme = 'primary', 
  animated = true,
  interactive = true,
  realTime = false 
}: FuturisticChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize chart with custom styling
    const chart = new Chart(chartRef.current, {
      type,
      data: {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          borderColor: `var(--${theme}-glow)`,
          backgroundColor: `var(--${theme}-shadow)`,
          pointBackgroundColor: `var(--${theme}-bright)`,
          pointBorderColor: `var(--${theme}-glow)`,
          pointHoverBackgroundColor: `var(--${theme}-glow)`,
          pointHoverBorderColor: '#ffffff',
          tension: 0.4, // Smooth curves
          fill: type === 'area'
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'var(--text-primary)',
              font: {
                family: 'var(--font-ui)',
                size: 12
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'var(--border-glow)',
              lineWidth: 1
            },
            ticks: {
              color: 'var(--text-secondary)',
              font: {
                family: 'var(--font-mono)',
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'var(--border-glow)',
              lineWidth: 1
            },
            ticks: {
              color: 'var(--text-secondary)',
              font: {
                family: 'var(--font-mono)',
                size: 10
              }
            }
          }
        },
        animation: animated ? {
          duration: 2000,
          easing: 'easeInOutQuart'
        } : false
      }
    });

    if (realTime) {
      wsClient.subscribe('chart-update', (newData) => {
        chart.data = newData;
        chart.update('none');
      });
    }

    return () => chart.destroy();
  }, [data, type, theme, animated, realTime]);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-full relative"
      style={{ filter: 'drop-shadow(0 0 10px var(--primary-shadow))' }}
    />
  );
}
```

### **Analytics Dashboard Layouts**
```typescript
// Population Analytics Panel
function PopulationAnalytics() {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Main Population Chart */}
      <div className="col-span-8 holo-panel p-4">
        <h3 className="text-lg font-display text-primary-glow mb-4">
          Population Growth Trajectory
        </h3>
        <FuturisticChart
          type="area"
          data={populationTrendData}
          theme="primary"
          realTime={true}
        />
      </div>

      {/* Demographics Breakdown */}
      <div className="col-span-4 space-y-4">
        <div className="holo-panel p-4">
          <h4 className="font-display text-secondary-glow mb-2">Age Distribution</h4>
          <FuturisticChart
            type="radar"
            data={ageDistributionData}
            theme="secondary"
          />
        </div>
        
        <div className="holo-panel p-4">
          <h4 className="font-display text-success-glow mb-2">Happiness Index</h4>
          <CircularProgress 
            value={72} 
            size="lg" 
            color="success"
            showValue={true}
          />
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="col-span-12 grid grid-cols-6 gap-4">
        <MetricCard
          title="Birth Rate"
          value="14.2‰"
          trend={birthRateTrend}
          icon="👶"
          theme="success"
        />
        <MetricCard
          title="Death Rate"
          value="8.7‰"
          trend={deathRateTrend}
          icon="⚰️"
          theme="neutral"
        />
        <MetricCard
          title="Migration"
          value="+12.4K"
          trend={migrationTrend}
          icon="🚀"
          theme="primary"
        />
        <MetricCard
          title="Education"
          value="94.2%"
          trend={educationTrend}
          icon="🎓"
          theme="secondary"
        />
        <MetricCard
          title="Employment"
          value="95.8%"
          trend={employmentTrend}
          icon="💼"
          theme="success"
        />
        <MetricCard
          title="Life Expectancy"
          value="127.3y"
          trend={lifespanTrend}
          icon="🧬"
          theme="primary"
        />
      </div>
    </div>
  );
}
```

## Specialized Visual Components

### **Character Gallery**
```typescript
function CharacterGallery({ characters }: { characters: Character[] }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {characters.map(character => (
        <div key={character.id} className="holo-panel p-3 group cursor-pointer">
          <div className="relative">
            {/* AI-Generated Character Portrait */}
            <img
              src={character.portraitUrl}
              alt={character.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            
            {/* Status Overlay */}
            <div className="absolute top-2 right-2">
              <StatusIndicator 
                status={character.status} 
                animated={true}
              />
            </div>

            {/* Hover Info */}
            <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h4 className="font-display text-primary-glow">{character.name}</h4>
                <p className="text-sm text-secondary">{character.role}</p>
                <div className="mt-2 space-y-1">
                  <SkillBar skill="Leadership" value={character.leadership} />
                  <SkillBar skill="Intelligence" value={character.intelligence} />
                  <SkillBar skill="Charisma" value={character.charisma} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### **Technology Tree Visualization**
```typescript
function TechnologyTree({ technologies }: { technologies: Technology[] }) {
  return (
    <div className="relative w-full h-full overflow-auto">
      <svg className="w-full h-full">
        {/* Technology Nodes */}
        {technologies.map(tech => (
          <g key={tech.id}>
            {/* Connection Lines */}
            {tech.prerequisites.map(prereqId => (
              <line
                key={prereqId}
                x1={getNodePosition(prereqId).x}
                y1={getNodePosition(prereqId).y}
                x2={getNodePosition(tech.id).x}
                y2={getNodePosition(tech.id).y}
                stroke="var(--border-glow)"
                strokeWidth="2"
                className="animate-pulse"
              />
            ))}
            
            {/* Technology Node */}
            <foreignObject
              x={getNodePosition(tech.id).x - 60}
              y={getNodePosition(tech.id).y - 60}
              width="120"
              height="120"
            >
              <TechNode technology={tech} />
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TechNode({ technology }: { technology: Technology }) {
  const isResearched = technology.status === 'completed';
  const isResearching = technology.status === 'in-progress';
  const isAvailable = technology.status === 'available';

  return (
    <div className={clsx(
      'w-full h-full rounded-full border-2 p-2 cursor-pointer transition-all',
      'flex flex-col items-center justify-center text-center',
      {
        'border-success-glow bg-success-shadow': isResearched,
        'border-warning-glow bg-warning-shadow animate-pulse': isResearching,
        'border-primary-glow bg-primary-shadow hover:scale-110': isAvailable,
        'border-neutral-500 bg-neutral-800 opacity-50': !isAvailable
      }
    )}>
      {/* AI-Generated Tech Icon */}
      <img
        src={technology.iconUrl}
        alt={technology.name}
        className="w-8 h-8 mb-1"
      />
      
      <span className="text-xs font-mono">{technology.name}</span>
      
      {isResearching && (
        <div className="w-full mt-1">
          <ProgressBar 
            value={technology.progress} 
            size="xs" 
            color="warning"
          />
        </div>
      )}
    </div>
  );
}
```

### **Event Video Player**
```typescript
function EventVideoPlayer({ event }: { event: GameEvent }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate event video
    visualService.generateEventVideo({
      event: event.type,
      duration: 30,
      style: 'cinematic'
    }).then(video => {
      setVideoUrl(video.url);
      setLoading(false);
    });
  }, [event]);

  if (loading) {
    return (
      <div className="w-full h-64 holo-panel flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-glow border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-primary-glow font-mono">Generating Event Visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Video Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-display text-white glow-text">
            {event.title}
          </h3>
          <p className="text-sm text-gray-200 mt-1">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
}
```

## PC-First Responsive Breakpoints

### **Screen Size Optimization**
```css
/* PC-First Breakpoints */
--breakpoint-4k: 3840px;     /* 4K displays */
--breakpoint-ultrawide: 2560px; /* Ultrawide monitors */
--breakpoint-desktop: 1920px;   /* Standard desktop */
--breakpoint-laptop: 1366px;    /* Laptop screens */
--breakpoint-tablet: 1024px;    /* Large tablets (minimum) */

/* Layout Scaling */
@media (min-width: 2560px) {
  .command-center {
    max-width: 2400px;
    margin: 0 auto;
    transform: scale(1.2);
  }
}

@media (min-width: 3840px) {
  .command-center {
    max-width: 3200px;
    transform: scale(1.5);
  }
}

/* Minimum viable layout for tablets */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
}
```

This redesign transforms the interface into a **cinematic, data-rich command center** that leverages AI-generated visuals, extensive analytics, and a futuristic aesthetic optimized for PC gaming setups. The result is an immersive civilization management experience that feels like commanding a space-faring empire from a high-tech bridge.

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
