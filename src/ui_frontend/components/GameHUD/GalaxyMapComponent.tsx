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
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [simulationStatus, setSimulationStatus] = useState<any>(null);
  const [aiRecommendations, setAIRecommendations] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [showEnhancedControls, setShowEnhancedControls] = useState(false);
  
  // Camera controls
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 0 });
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [zoomMode, setZoomMode] = useState<'galaxy' | 'sector' | 'system' | 'planet'>('galaxy');

  // Fetch galaxy data from API
  const fetchGalaxyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch galaxy map data (sectors and systems)
      const mapResponse = await fetch('/api/galaxy/map?campaignId=1&includeUnexplored=true');
      if (!mapResponse.ok) {
        throw new Error(`Failed to fetch galaxy map: ${mapResponse.status}`);
      }
      const mapData = await mapResponse.json();

      // Fetch territories and civilizations
      const territoriesResponse = await fetch('/api/galaxy/territories?campaignId=1');
      if (!territoriesResponse.ok) {
        throw new Error(`Failed to fetch territories: ${territoriesResponse.status}`);
      }
      const territoriesData = await territoriesResponse.json();

      // Transform the API data to match our component interface
      const systems: StarSystem[] = [];
      if (mapData.success && mapData.data.sectors) {
        mapData.data.sectors.forEach((sector: any) => {
          sector.starSystems.forEach((system: any) => {
            systems.push({
              id: system.id,
              name: system.name,
              position: { 
                x: sector.coordinates.x + Math.random() * 50 - 25, 
                y: sector.coordinates.y + Math.random() * 50 - 25, 
                z: sector.coordinates.z + Math.random() * 10 - 5 
              },
              type: system.starType,
              civilization: system.controlledBy,
              status: system.explored ? (system.controlledBy ? 'controlled' : 'neutral') : 'unexplored',
              population: Math.floor(Math.random() * 10000000),
              resources: ['minerals', 'energy', 'biologicals'].slice(0, Math.floor(Math.random() * 3) + 1),
              security: system.controlledBy ? 'secure' : 'contested'
            });
          });
        });
      }

      setGalaxyData({
        systems: systems,
        tradeRoutes: [], // Will be populated from API
        civilizations: territoriesData.success ? territoriesData.data.civilizations : []
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

  // Fetch enhanced simulation data
  const fetchEnhancedData = useCallback(async () => {
    try {
      const campaignId = 1;
      const civilizationId = 'civilization_1';

      // Fetch simulation status
      const statusResponse = await fetch(`/api/galaxy/simulation/status?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSimulationStatus(statusData.data);
      }

      // Fetch AI recommendations
      const aiResponse = await fetch(`/api/galaxy/ai/recommendations?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        setAIRecommendations(aiData.data);
      }

      // Fetch performance metrics
      const metricsResponse = await fetch(`/api/galaxy/analytics/performance?campaignId=${campaignId}&civilizationId=${civilizationId}`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setPerformanceMetrics(metricsData.data);
      }
    } catch (error) {
      console.error('Error fetching enhanced data:', error);
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

    // Always draw civilization boundaries for now
    drawCivilizationBoundaries(ctx, rect.width, rect.height);
  }, [galaxyData, zoomLevel]);

  const drawBackgroundStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create layered background stars for depth
    for (let layer = 0; layer < 3; layer++) {
      const starCount = layer === 0 ? 300 : layer === 1 ? 150 : 75;
      const opacity = layer === 0 ? 0.1 : layer === 1 ? 0.3 : 0.6;
      const sizeMultiplier = layer === 0 ? 0.5 : layer === 1 ? 1 : 1.5;
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2 * sizeMultiplier;
        const brightness = Math.random();
        
        // Create subtle twinkling effect
        const twinkle = Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.7;
        const finalOpacity = opacity * brightness * twinkle;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add occasional colored stars
        if (Math.random() < 0.05) {
          const colors = ['rgba(100, 181, 246, ', 'rgba(255, 193, 7, ', 'rgba(244, 67, 54, '];
          const color = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillStyle = color + (finalOpacity * 0.5) + ')';
          ctx.beginPath();
          ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const drawStarSystems = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Dynamic scale based on zoom mode
    const scaleMultipliers = {
      galaxy: 0.8,
      sector: 2.0,
      system: 5.0,
      planet: 10.0
    };
    const scale = zoomLevel * scaleMultipliers[zoomMode];

    // Enhanced 3D perspective settings
    const perspective = 400;
    const maxDepth = 300;

    // Filter systems based on selected filter
    const filteredSystems = galaxyData.systems.filter(system => {
      switch (systemFilter) {
        case 'controlled':
          return system.controlledBy !== null;
        case 'contested':
          return system.controlledBy && system.controlledBy.includes('Contested');
        case 'neutral':
          return system.controlledBy === null;
        case 'explored':
          return system.explored;
        case 'unexplored':
          return !system.explored;
        case 'all':
        default:
          return true;
      }
    });

    // Sort systems by Z depth for proper 3D rendering (back to front)
    const sortedSystems = [...filteredSystems].sort((a, b) => a.position.z - b.position.z);

    sortedSystems.forEach((system) => {
      // Apply camera transformations
      let worldX = system.position.x - cameraPosition.x;
      let worldY = system.position.y - cameraPosition.y;
      let worldZ = system.position.z - cameraPosition.z;
      
      // Apply camera rotation
      const cosY = Math.cos(cameraRotation.y);
      const sinY = Math.sin(cameraRotation.y);
      const cosX = Math.cos(cameraRotation.x);
      const sinX = Math.sin(cameraRotation.x);
      
      // Rotate around Y axis (horizontal rotation)
      const rotatedX = worldX * cosY - worldZ * sinY;
      const rotatedZ = worldX * sinY + worldZ * cosY;
      
      // Rotate around X axis (vertical rotation)
      const finalY = worldY * cosX - rotatedZ * sinX;
      const finalZ = worldY * sinX + rotatedZ * cosX;
      
      const projectedX = centerX + (rotatedX * scale) / (1 + finalZ / perspective);
      const projectedY = centerY + (finalY * scale) / (1 + finalZ / perspective);
      
      // Enhanced depth-based scaling with better falloff
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, rotatedZ));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.3 + (depthFactor * 0.7); // Scale from 0.3 to 1.0
      const opacity = Math.max(0.2, depthFactor);

      // Skip if outside visible area
      if (projectedX < -100 || projectedX > width + 100 || projectedY < -100 || projectedY > height + 100) return;

      // Enhanced glow effect with depth-based color intensity
      const glowSize = 35 * depthScale;
      const gradient = ctx.createRadialGradient(projectedX, projectedY, 0, projectedX, projectedY, glowSize);
      const glowColor = system.civilization ? 
        `rgba(78, 205, 196, ${opacity * 0.6})` : 
        `rgba(251, 191, 36, ${opacity * 0.6})`;
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(0.7, `rgba(78, 205, 196, ${opacity * 0.2})`);
      gradient.addColorStop(1, 'rgba(78, 205, 196, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Enhanced system core with better 3D appearance
      const coreSize = Math.max(4, 12 * depthScale);
      const coreGradient = ctx.createRadialGradient(
        projectedX - coreSize * 0.3, projectedY - coreSize * 0.3, 0,
        projectedX, projectedY, coreSize
      );
      
      if (system.civilization) {
        coreGradient.addColorStop(0, `rgba(120, 220, 210, ${opacity})`);
        coreGradient.addColorStop(1, `rgba(78, 205, 196, ${opacity})`);
      } else {
        coreGradient.addColorStop(0, `rgba(255, 215, 100, ${opacity})`);
        coreGradient.addColorStop(1, `rgba(251, 191, 36, ${opacity})`);
      }
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Enhanced outer ring with 3D effect
      const ringSize = Math.max(6, 18 * depthScale);
      ctx.strokeStyle = system.civilization ? 
        `rgba(78, 205, 196, ${opacity * 0.8})` : 
        `rgba(251, 191, 36, ${opacity * 0.8})`;
      ctx.lineWidth = Math.max(1, 3 * depthScale);
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, ringSize, 0, Math.PI * 2);
      ctx.stroke();

      // Enhanced text rendering with better depth visibility
      if (depthScale > 0.3) {
        const fontSize = Math.max(8, 14 * depthScale);
        ctx.fillStyle = `rgba(224, 230, 237, ${opacity * 0.9})`;
        ctx.font = `${fontSize}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.8})`;
        ctx.lineWidth = 2;
        ctx.strokeText(system.name, projectedX, projectedY + 30 * depthScale);
        ctx.fillText(system.name, projectedX, projectedY + 30 * depthScale);
      }

      // Enhanced civilization indicator
      if (system.civilization && depthScale > 0.4) {
        const civFontSize = Math.max(6, 11 * depthScale);
        ctx.fillStyle = `rgba(78, 205, 196, ${opacity * 0.8})`;
        ctx.font = `${civFontSize}px 'Segoe UI', sans-serif`;
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeText(system.civilization, projectedX, projectedY + 45 * depthScale);
        ctx.fillText(system.civilization, projectedX, projectedY + 45 * depthScale);
      }
    });
  };

  const drawTradeRoutes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

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
    fetchEnhancedData();
  }, [fetchGalaxyData, fetchEnhancedData]);

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

  // Handle mouse events for camera controls
  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setLastMousePos({ x: mouseX, y: mouseY });

    if (event.button === 0) { // Left click - pan
      setIsDragging(true);
      canvas.style.cursor = 'grabbing';
    } else if (event.button === 2) { // Right click - rotate
      setIsRotating(true);
      canvas.style.cursor = 'grabbing';
      event.preventDefault(); // Prevent context menu
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!galaxyData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (isDragging || isRotating) {
      const deltaX = mouseX - lastMousePos.x;
      const deltaY = mouseY - lastMousePos.y;

      if (isDragging) {
        // Pan camera
        const panSpeed = 2.0 / zoomLevel;
        setCameraPosition(prev => ({
          x: prev.x - deltaX * panSpeed,
          y: prev.y + deltaY * panSpeed,
          z: prev.z
        }));
      } else if (isRotating) {
        // Rotate camera
        const rotSpeed = 0.01;
        setCameraRotation(prev => ({
          x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x + deltaY * rotSpeed)),
          y: prev.y + deltaX * rotSpeed
        }));
      }

      setLastMousePos({ x: mouseX, y: mouseY });
    } else {
      // Check for system hover when not dragging
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const scaleMultipliers = {
        galaxy: 0.8,
        sector: 2.0,
        system: 5.0,
        planet: 10.0
      };
      const scale = zoomLevel * scaleMultipliers[zoomMode];

      let newHoveredSystem: StarSystem | null = null;

      // Find hovered system using the same projection as drawing
      for (const system of galaxyData.systems) {
        // Apply camera transformations (same as in drawStarSystems)
        let worldX = system.position.x - cameraPosition.x;
        let worldY = system.position.y - cameraPosition.y;
        let worldZ = system.position.z - cameraPosition.z;
        
        // Apply camera rotation
        const cosY = Math.cos(cameraRotation.y);
        const sinY = Math.sin(cameraRotation.y);
        const cosX = Math.cos(cameraRotation.x);
        const sinX = Math.sin(cameraRotation.x);
        
        const rotatedX = worldX * cosY - worldZ * sinY;
        const rotatedZ = worldX * sinY + worldZ * cosY;
        const finalY = worldY * cosX - rotatedZ * sinX;
        const finalZ = worldY * sinX + rotatedZ * cosX;
        
        const perspective = 400;
        const projectedX = centerX + (rotatedX * scale) / (1 + finalZ / perspective);
        const projectedY = centerY + (finalY * scale) / (1 + finalZ / perspective);

        const distance = Math.sqrt(Math.pow(mouseX - projectedX, 2) + Math.pow(mouseY - projectedY, 2));
        if (distance < 30) { // Smaller hover radius for better precision
          newHoveredSystem = system;
          break;
        }
      }

      // Update hover state and mouse position
      setHoveredSystem(newHoveredSystem);
      setMousePosition({ x: mouseX, y: mouseY });

      // Update cursor style
      canvas.style.cursor = newHoveredSystem ? 'pointer' : 'grab';
    }
  };

  const handleCanvasMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (event.button === 0 && isDragging) {
      setIsDragging(false);
      canvas.style.cursor = 'grab';
    } else if (event.button === 2 && isRotating) {
      setIsRotating(false);
      canvas.style.cursor = 'grab';
    }
  };

  const handleCanvasMouseLeave = () => {
    // Reset dragging states when mouse leaves canvas
    setIsDragging(false);
    setIsRotating(false);
    setHoveredSystem(null);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'grab';
    }
  };

  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault(); // Prevent context menu on right click
  };

  // Center camera on star systems
  const centerCamera = useCallback(() => {
    if (!galaxyData || galaxyData.systems.length === 0) return;

    // Calculate center of all systems
    const centerX = galaxyData.systems.reduce((sum, sys) => sum + sys.position.x, 0) / galaxyData.systems.length;
    const centerY = galaxyData.systems.reduce((sum, sys) => sum + sys.position.y, 0) / galaxyData.systems.length;
    const centerZ = galaxyData.systems.reduce((sum, sys) => sum + sys.position.z, 0) / galaxyData.systems.length;

    setCameraPosition({ x: centerX, y: centerY, z: centerZ });
    setCameraRotation({ x: 0, y: 0 });
  }, [galaxyData]);

  // Auto-center when galaxy data loads
  useEffect(() => {
    if (galaxyData && galaxyData.systems.length > 0) {
      centerCamera();
    }
  }, [galaxyData, centerCamera]);

  // Redraw when zoom mode, zoom level, or camera changes
  useEffect(() => {
    if (galaxyData) {
      initializeGalaxy();
    }
  }, [zoomMode, zoomLevel, cameraPosition, cameraRotation, systemFilter, initializeGalaxy, galaxyData]);

  // Global mouse event listeners for dragging outside canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsRotating(false);
    };

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isDragging && !isRotating) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const deltaX = mouseX - lastMousePos.x;
      const deltaY = mouseY - lastMousePos.y;

      if (isDragging) {
        const panSpeed = 2.0 / zoomLevel;
        setCameraPosition(prev => ({
          x: prev.x - deltaX * panSpeed,
          y: prev.y + deltaY * panSpeed,
          z: prev.z
        }));
      } else if (isRotating) {
        const rotSpeed = 0.01;
        setCameraRotation(prev => ({
          x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x + deltaY * rotSpeed)),
          y: prev.y + deltaX * rotSpeed
        }));
      }

      setLastMousePos({ x: mouseX, y: mouseY });
    };

    if (isDragging || isRotating) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, isRotating, lastMousePos, zoomLevel]);

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
      {/* Enhanced Controls Toggle */}
      <div className="enhanced-controls-toggle">
        <button 
          className={`toggle-btn ${showEnhancedControls ? 'active' : ''}`}
          onClick={() => setShowEnhancedControls(!showEnhancedControls)}
        >
          🎛️ Enhanced Controls
        </button>
      </div>

      {/* Enhanced Controls Panel */}
      {showEnhancedControls && (
        <div className="enhanced-controls-panel">
          {/* Simulation Status */}
          {simulationStatus && (
            <div className="control-section">
              <h4>🤖 Simulation Status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Active:</span>
                  <span className={`status-value ${simulationStatus.active ? 'active' : 'inactive'}`}>
                    {simulationStatus.active ? '✅ Running' : '❌ Stopped'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Knobs Active:</span>
                  <span className="status-value">{simulationStatus.knobsActive}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Events Processed:</span>
                  <span className="status-value">{simulationStatus.eventsProcessed}</span>
                </div>
              </div>
              
              {simulationStatus.performanceMetrics && (
                <div className="performance-metrics">
                  <h5>Performance Metrics</h5>
                  <div className="metrics-grid">
                    <div className="metric">
                      <span>Exploration:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill exploration" 
                          style={{ width: `${simulationStatus.performanceMetrics.explorationEfficiency * 100}%` }}
                        ></div>
                      </div>
                      <span>{(simulationStatus.performanceMetrics.explorationEfficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span>Diplomacy:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill diplomacy" 
                          style={{ width: `${simulationStatus.performanceMetrics.diplomaticStability * 100}%` }}
                        ></div>
                      </div>
                      <span>{(simulationStatus.performanceMetrics.diplomaticStability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span>Economy:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill economy" 
                          style={{ width: `${simulationStatus.performanceMetrics.economicGrowth * 100}%` }}
                        ></div>
                      </div>
                      <span>{(simulationStatus.performanceMetrics.economicGrowth * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span>Science:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill science" 
                          style={{ width: `${simulationStatus.performanceMetrics.scientificProgress * 100}%` }}
                        ></div>
                      </div>
                      <span>{(simulationStatus.performanceMetrics.scientificProgress * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Recommendations */}
          {aiRecommendations && aiRecommendations.recommendations && (
            <div className="control-section">
              <h4>🧠 AI Recommendations</h4>
              <div className="recommendations-list">
                {aiRecommendations.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div key={index} className={`recommendation ${rec.priority}`}>
                    <div className="rec-header">
                      <span className="rec-knob">{rec.knobName.replace(/_/g, ' ')}</span>
                      <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                    </div>
                    <div className="rec-values">
                      <span className="current-value">{rec.currentValue.toFixed(2)}</span>
                      <span className="arrow">→</span>
                      <span className="recommended-value">{rec.recommendedValue.toFixed(2)}</span>
                    </div>
                    <div className="rec-reason">{rec.reason}</div>
                    <div className="rec-confidence">Confidence: {(rec.confidence * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Analytics */}
          {performanceMetrics && (
            <div className="control-section">
              <h4>📊 Performance Analytics</h4>
              <div className="analytics-grid">
                <div className="analytics-category">
                  <h5>🚀 Exploration</h5>
                  <div className="analytics-stats">
                    <div className="stat">
                      <span>Systems Explored:</span>
                      <span>{performanceMetrics.metrics.exploration.systemsExplored}</span>
                    </div>
                    <div className="stat">
                      <span>Discoveries:</span>
                      <span>{performanceMetrics.metrics.exploration.discoveriesMade}</span>
                    </div>
                    <div className="stat">
                      <span>Efficiency:</span>
                      <span>{(performanceMetrics.metrics.exploration.explorationEfficiency * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="analytics-category">
                  <h5>🤝 Diplomacy</h5>
                  <div className="analytics-stats">
                    <div className="stat">
                      <span>Treaties:</span>
                      <span>{performanceMetrics.metrics.diplomacy.treatiesSigned}</span>
                    </div>
                    <div className="stat">
                      <span>Conflicts Resolved:</span>
                      <span>{performanceMetrics.metrics.diplomacy.conflictsResolved}</span>
                    </div>
                    <div className="stat">
                      <span>Stability:</span>
                      <span>{(performanceMetrics.metrics.diplomacy.diplomaticStability * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="galaxy-controls">
        <div className="view-controls">
          <label>View:</label>
          <select 
            value={systemFilter} 
            onChange={(e) => setSystemFilter(e.target.value)}
            className="layer-select"
          >
            <option value="all">🌌 All Systems</option>
            <option value="controlled">🏛️ Controlled</option>
            <option value="contested">⚔️ Contested</option>
            <option value="neutral">🌍 Neutral</option>
            <option value="explored">✅ Explored</option>
            <option value="unexplored">❓ Unexplored</option>
          </select>
        </div>

        <div className="zoom-mode-controls">
          <label>Scale:</label>
          <select 
            value={zoomMode} 
            onChange={(e) => setZoomMode(e.target.value as any)}
            className="layer-select"
          >
            <option value="galaxy">🌌 Galaxy</option>
            <option value="sector">🗺️ Sector</option>
            <option value="system">⭐ System</option>
            <option value="planet">🪐 Planet</option>
          </select>
        </div>

        <div className="zoom-controls">
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 5))}
            title="Zoom in"
          >
            🔍+
          </button>
          <span className="zoom-level">{zoomLevel.toFixed(1)}x</span>
          <button 
            className="zoom-btn" 
            onClick={() => setZoomLevel(Math.max(zoomLevel / 1.2, 0.2))}
            title="Zoom out"
          >
            🔍-
          </button>
        </div>

        <div className="camera-controls">
          <button 
            className="zoom-btn" 
            onClick={centerCamera}
            title="Center camera on star systems"
          >
            🎯
          </button>
          <button 
            className="zoom-btn" 
            onClick={() => {
              setCameraRotation({ x: 0, y: 0 });
              setZoomLevel(1);
            }}
            title="Reset camera rotation and zoom"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="galaxy-canvas"
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        onContextMenu={handleCanvasContextMenu}
      />

      {/* Hover Tooltip */}
      {hoveredSystem && (
        <div 
          className="hover-tooltip"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y - 10,
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <div className="tooltip-header">
            <h4>⭐ {hoveredSystem.name}</h4>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-row">
              <span className="tooltip-label">Type:</span>
              <span className="tooltip-value">{hoveredSystem.starType}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Planets:</span>
              <span className="tooltip-value">{hoveredSystem.planets}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Status:</span>
              <span className="tooltip-value">
                {hoveredSystem.controlledBy ? `Controlled by ${hoveredSystem.controlledBy}` : 'Neutral'}
              </span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Explored:</span>
              <span className="tooltip-value">{hoveredSystem.explored ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">Position:</span>
              <span className="tooltip-value">
                ({hoveredSystem.position.x.toFixed(1)}, {hoveredSystem.position.y.toFixed(1)}, {hoveredSystem.position.z.toFixed(1)})
              </span>
            </div>
          </div>
        </div>
      )}

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
        <h4>🌌 LivelyGalaxy.ai</h4>
        <p>Systems: {galaxyData?.systems.length || 0}</p>
        <p>Filter: {systemFilter}</p>
        <p>Current Location: {gameContext.currentLocation || 'Sol System'}</p>
      </div>
    </div>
  );
};
