import React, { useEffect, useRef, useState, useCallback } from 'react';
import './GalaxyMapComponent.css';

interface StarSystem {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  type: string;
  civilization?: string;
  status: string;
  population?: number;
  resources?: string[];
  security?: string;
}

interface GalaxyData {
  systems: StarSystem[];
  tradeRoutes: any[];
  civilizations: any[];
}

interface GalaxyMapComponentProps {
  gameContext: any;
}

export const GalaxyMapComponent: React.FC<GalaxyMapComponentProps> = ({ gameContext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [galaxyData, setGalaxyData] = useState<GalaxyData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('political');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch galaxy data from API
  const fetchGalaxyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch galaxy overview
      const overviewResponse = await fetch('/api/galaxy/overview');
      if (!overviewResponse.ok) {
        throw new Error(`Failed to fetch galaxy overview: ${overviewResponse.status}`);
      }
      const overviewData = await overviewResponse.json();

      // Fetch star systems
      const systemsResponse = await fetch('/api/galaxy/systems');
      if (!systemsResponse.ok) {
        throw new Error(`Failed to fetch star systems: ${systemsResponse.status}`);
      }
      const systemsData = await systemsResponse.json();

      setGalaxyData({
        systems: systemsData.data || [],
        tradeRoutes: [], // Will be populated from API
        civilizations: [] // Will be populated from API
      });

    } catch (err) {
      console.error('Error fetching galaxy data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load galaxy data');
      
      // Fallback to mock data
      setGalaxyData({
        systems: generateMockSystems(),
        tradeRoutes: [],
        civilizations: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate mock systems as fallback
  const generateMockSystems = (): StarSystem[] => {
    const systems: StarSystem[] = [];
    const systemNames = [
      'Sol System', 'Alpha Centauri', 'Vega Prime', 'Kepler-442',
      'Proxima Station', 'New Terra', 'Arcturus Hub', 'Sirius Outpost',
      'Betelgeuse Colony', 'Rigel Gateway', 'Aldebaran Base', 'Capella Port'
    ];

    systemNames.forEach((name, index) => {
      const angle = (index / systemNames.length) * Math.PI * 2;
      const radius = 80 + Math.random() * 120; // Smaller radius to fit better
      
      systems.push({
        id: `system-${index}`,
        name,
        position: {
          x: Math.cos(angle) * radius,
          y: (Math.random() - 0.5) * 100,
          z: Math.sin(angle) * radius
        },
        type: ['main-sequence', 'red-giant', 'white-dwarf', 'binary'][Math.floor(Math.random() * 4)],
        civilization: index < 8 ? `Civilization ${Math.floor(index / 2) + 1}` : undefined,
        status: ['active', 'developing', 'established', 'expanding'][Math.floor(Math.random() * 4)],
        population: Math.floor(Math.random() * 10000000) + 1000000,
        resources: ['dilithium', 'quantum-crystals', 'rare-metals', 'energy-cores'].slice(0, Math.floor(Math.random() * 3) + 1),
        security: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)]
      });
    });

    return systems;
  };

  // Initialize canvas and render galaxy
  const initializeGalaxy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !galaxyData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw background stars
    drawBackgroundStars(ctx, rect.width, rect.height);

    // Draw star systems
    drawStarSystems(ctx, rect.width, rect.height);

    // Draw trade routes
    drawTradeRoutes(ctx, rect.width, rect.height);

    // Draw civilization boundaries if political layer is active
    if (activeLayer === 'political') {
      drawCivilizationBoundaries(ctx, rect.width, rect.height);
    }
  }, [galaxyData, activeLayer, zoomLevel]);

  const drawBackgroundStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawStarSystems = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = zoomLevel * 0.8;

    galaxyData.systems.forEach((system) => {
      const x = centerX + system.position.x * scale;
      const y = centerY + system.position.z * scale; // Using z for 2D y-axis

      // Skip if outside canvas
      if (x < -50 || x > width + 50 || y < -50 || y > height + 50) return;

      // Draw system glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
      gradient.addColorStop(0, 'rgba(78, 205, 196, 0.8)');
      gradient.addColorStop(1, 'rgba(78, 205, 196, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Draw system core (larger for better clicking)
      ctx.fillStyle = system.civilization ? '#4ecdc4' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw outer ring for better visibility
      ctx.strokeStyle = system.civilization ? '#4ecdc4' : '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Draw system name
      ctx.fillStyle = '#e0e6ed';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(system.name, x, y + 25);

      // Draw civilization indicator
      if (system.civilization) {
        ctx.fillStyle = '#4ecdc4';
        ctx.font = '10px sans-serif';
        ctx.fillText(system.civilization, x, y + 38);
      }
    });
  };

  const drawTradeRoutes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData || activeLayer !== 'economic') return;

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = zoomLevel * 0.8;

    // Draw connections between nearby systems
    for (let i = 0; i < galaxyData.systems.length; i++) {
      for (let j = i + 1; j < galaxyData.systems.length; j++) {
        const sys1 = galaxyData.systems[i];
        const sys2 = galaxyData.systems[j];

        const distance = Math.sqrt(
          Math.pow(sys1.position.x - sys2.position.x, 2) +
          Math.pow(sys1.position.z - sys2.position.z, 2)
        );

        // Only draw routes between nearby systems
        if (distance < 200) {
          const x1 = centerX + sys1.position.x * scale;
          const y1 = centerY + sys1.position.z * scale;
          const x2 = centerX + sys2.position.x * scale;
          const y2 = centerY + sys2.position.z * scale;

          ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  };

  const drawCivilizationBoundaries = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw influence spheres for civilizations
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = zoomLevel * 0.8;

    galaxyData?.systems.forEach((system) => {
      if (system.civilization) {
        const x = centerX + system.position.x * scale;
        const y = centerY + system.position.z * scale;

        ctx.strokeStyle = 'rgba(78, 205, 196, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!galaxyData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = zoomLevel * 0.8;

    console.log('Canvas clicked at:', { clickX, clickY, centerX, centerY, scale });

    // Find clicked system
    let closestSystem: StarSystem | null = null;
    let closestDistance = Infinity;

    for (const system of galaxyData.systems) {
      const x = centerX + system.position.x * scale;
      const y = centerY + system.position.z * scale;

      const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
      
      console.log(`System ${system.name} at (${x.toFixed(1)}, ${y.toFixed(1)}), distance: ${distance.toFixed(1)}`);
      
      if (distance < 50 && distance < closestDistance) { // Larger click radius for better UX
        closestSystem = system;
        closestDistance = distance;
      }
    }

    if (closestSystem) {
      console.log('Selected system:', closestSystem.name);
      setSelectedSystem(closestSystem);
    } else {
      console.log('No system found near click');
      // Click on empty space - clear selection
      setSelectedSystem(null);
    }
  };

  // Initialize galaxy data on mount
  useEffect(() => {
    fetchGalaxyData();
  }, [fetchGalaxyData]);

  // Re-render when data or settings change
  useEffect(() => {
    initializeGalaxy();
  }, [initializeGalaxy]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initializeGalaxy();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeGalaxy]);

  // Handle canvas hover effects
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!galaxyData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = zoomLevel * 0.8;

    let hoveredSystem: StarSystem | null = null;

    // Find hovered system
    for (const system of galaxyData.systems) {
      const x = centerX + system.position.x * scale;
      const y = centerY + system.position.z * scale;

      const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
      if (distance < 50) {
        hoveredSystem = system;
        break;
      }
    }

    // Update cursor style
    canvas.style.cursor = hoveredSystem ? 'pointer' : 'crosshair';
  };

  if (loading) {
    return (
      <div className="galaxy-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading Galaxy Map...</p>
      </div>
    );
  }

  if (error && !galaxyData) {
    return (
      <div className="galaxy-map-error">
        <p>⚠️ Error loading galaxy data</p>
        <p>{error}</p>
        <button onClick={fetchGalaxyData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="galaxy-map-component">
      {/* Controls */}
      <div className="galaxy-controls">
        <div className="layer-controls">
          <label>Layer:</label>
          <select 
            value={activeLayer} 
            onChange={(e) => setActiveLayer(e.target.value)}
            className="layer-select"
          >
            <option value="political">🏛️ Political</option>
            <option value="economic">💰 Economic</option>
            <option value="military">⚔️ Military</option>
            <option value="diplomatic">🤝 Diplomatic</option>
          </select>
        </div>

        <div className="zoom-controls">
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 3))}
          >
            🔍 Zoom In
          </button>
          <span className="zoom-level">Zoom: {zoomLevel.toFixed(1)}x</span>
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5))}
          >
            🔍 Zoom Out
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="galaxy-canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />

      {/* System Info Panel */}
      {selectedSystem && (
        <div className="system-info-panel">
          <div className="system-info-header">
            <h3>{selectedSystem.name}</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedSystem(null)}
            >
              ×
            </button>
          </div>
          <div className="system-info-content">
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{selectedSystem.type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value">{selectedSystem.status}</span>
            </div>
            {selectedSystem.civilization && (
              <div className="info-row">
                <span className="info-label">Civilization:</span>
                <span className="info-value">{selectedSystem.civilization}</span>
              </div>
            )}
            {selectedSystem.population && (
              <div className="info-row">
                <span className="info-label">Population:</span>
                <span className="info-value">{selectedSystem.population.toLocaleString()}</span>
              </div>
            )}
            {selectedSystem.security && (
              <div className="info-row">
                <span className="info-label">Security:</span>
                <span className="info-value">{selectedSystem.security}</span>
              </div>
            )}
            {selectedSystem.resources && selectedSystem.resources.length > 0 && (
              <div className="info-row">
                <span className="info-label">Resources:</span>
                <span className="info-value">{selectedSystem.resources.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Galaxy Info */}
      <div className="galaxy-info">
        <h4>🌌 Startales Galaxy</h4>
        <p>Systems: {galaxyData?.systems.length || 0}</p>
        <p>Active Layer: {activeLayer}</p>
        <p>Current Location: {gameContext.currentLocation || 'Sol System'}</p>
      </div>
    </div>
  );
};
