import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Enhanced3DGalaxyMap.css';

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
  explored?: boolean;
  controlledBy?: string;
  starType?: string;
  planets?: number;
}

interface Ship {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  destination?: { x: number; y: number; z: number };
  type: 'scout' | 'frigate' | 'cruiser' | 'battleship' | 'transport';
  civilization: string;
  status: 'moving' | 'stationed' | 'exploring' | 'combat';
  speed: number;
}

interface SensorRange {
  civilizationId: string;
  range: number;
  detectionLevel: 'basic' | 'detailed' | 'full';
}

interface DataLayer {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  opacity: number;
  type: 'territory' | 'trade' | 'military' | 'resources' | 'exploration';
}

interface GalaxyData {
  systems: StarSystem[];
  ships: Ship[];
  tradeRoutes: any[];
  civilizations: any[];
  sensorRanges: SensorRange[];
}

interface Enhanced3DGalaxyMapProps {
  gameContext: any;
  playerCivilizationId?: string;
  fullScreen?: boolean;
}

export const Enhanced3DGalaxyMap: React.FC<Enhanced3DGalaxyMapProps> = ({ 
  gameContext, 
  playerCivilizationId = 'civilization_1',
  fullScreen = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Core state
  const [galaxyData, setGalaxyData] = useState<GalaxyData | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Camera and interaction state
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: -500 });
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [rotationPivot, setRotationPivot] = useState({ x: 0, y: 0 }); // Track where rotation started
  
  // Enhanced features state
  const [sensorRangeVisible, setSensorRangeVisible] = useState(true);
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([
    { id: 'territory', name: 'Territory Boundaries', enabled: true, color: '#4ecdc4', opacity: 0.3, type: 'territory' },
    { id: 'trade', name: 'Trade Routes', enabled: false, color: '#f39c12', opacity: 0.5, type: 'trade' },
    { id: 'military', name: 'Military Assets', enabled: true, color: '#e74c3c', opacity: 0.7, type: 'military' },
    { id: 'resources', name: 'Resource Deposits', enabled: false, color: '#9b59b6', opacity: 0.6, type: 'resources' },
    { id: 'exploration', name: 'Exploration Progress', enabled: false, color: '#2ecc71', opacity: 0.4, type: 'exploration' }
  ]);
  const [showShips, setShowShips] = useState(true);
  const [followShip, setFollowShip] = useState<string | null>(null);
  
  // UI state
  const [hoveredObject, setHoveredObject] = useState<{ type: 'system' | 'ship', object: StarSystem | Ship } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [minimapVisible, setMinimapVisible] = useState(true);

  // 3D projection utilities - FIXED for proper overlay positioning
  const project3DTo2D = useCallback((worldPos: { x: number; y: number; z: number }) => {
    // Apply camera transformations - FIXED for intuitive panning
    let worldX = worldPos.x - cameraPosition.x;
    let worldY = worldPos.y - cameraPosition.y;
    let worldZ = worldPos.z - cameraPosition.z;
    
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
    
    // Perspective projection - FIXED to use display dimensions
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, z: finalZ, visible: false };
    
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const perspective = 800;
    const scale = zoomLevel;
    
    const projectedX = centerX + (rotatedX * scale) / (1 + finalZ / perspective);
    const projectedY = centerY + (finalY * scale) / (1 + finalZ / perspective);
    
    // Check if object is in front of camera and within view - FIXED bounds
    const visible = finalZ > -perspective && 
                   projectedX >= -100 && projectedX <= rect.width + 100 &&
                   projectedY >= -100 && projectedY <= rect.height + 100;
    
    return { x: projectedX, y: projectedY, z: finalZ, visible };
  }, [cameraPosition, cameraRotation, zoomLevel]);

  // Fetch galaxy data
  const fetchGalaxyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch systems
      const mapResponse = await fetch('/api/galaxy/map?campaignId=1&includeUnexplored=true');
      const mapData = mapResponse.ok ? await mapResponse.json() : null;

      // Generate enhanced mock data with ships and sensor ranges
      const systems = generateEnhancedMockSystems();
      const ships = generateMockShips(systems);
      const sensorRanges = generateSensorRanges();

      setGalaxyData({
        systems,
        ships,
        tradeRoutes: [],
        civilizations: [],
        sensorRanges
      });

    } catch (err) {
      console.error('Error fetching galaxy data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load galaxy data');
      
      // Fallback to mock data
      const systems = generateEnhancedMockSystems();
      setGalaxyData({
        systems,
        ships: generateMockShips(systems),
        tradeRoutes: [],
        civilizations: [],
        sensorRanges: generateSensorRanges()
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const generateEnhancedMockSystems = (): StarSystem[] => {
    const systems: StarSystem[] = [];
    const systemNames = [
      'Sol System', 'Alpha Centauri', 'Vega Prime', 'Kepler-442', 'Proxima Station',
      'New Terra', 'Arcturus Hub', 'Sirius Outpost', 'Betelgeuse Colony', 'Rigel Gateway',
      'Aldebaran Base', 'Capella Port', 'Polaris Station', 'Antares Nexus', 'Deneb Outpost',
      'Altair Colony', 'Spica Base', 'Regulus Hub', 'Canopus Station', 'Procyon Gate'
    ];

    systemNames.forEach((name, index) => {
      const angle = (index / systemNames.length) * Math.PI * 2;
      const radius = 200 + Math.random() * 300;
      const height = (Math.random() - 0.5) * 200;
      
      systems.push({
        id: `system-${index}`,
        name,
        position: {
          x: Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
          y: height,
          z: Math.sin(angle) * radius + (Math.random() - 0.5) * 100
        },
        type: ['main-sequence', 'red-giant', 'white-dwarf', 'binary'][Math.floor(Math.random() * 4)],
        starType: ['G-class', 'K-class', 'M-class', 'F-class'][Math.floor(Math.random() * 4)],
        civilization: index < 12 ? `Civilization ${Math.floor(index / 3) + 1}` : undefined,
        controlledBy: index < 12 ? `Civilization ${Math.floor(index / 3) + 1}` : null,
        status: ['active', 'developing', 'established', 'expanding'][Math.floor(Math.random() * 4)],
        population: Math.floor(Math.random() * 10000000) + 1000000,
        resources: ['dilithium', 'quantum-crystals', 'rare-metals', 'energy-cores'].slice(0, Math.floor(Math.random() * 3) + 1),
        security: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        explored: Math.random() > 0.3,
        planets: Math.floor(Math.random() * 8) + 1
      });
    });

    return systems;
  };

  const generateMockShips = (systems: StarSystem[]): Ship[] => {
    const ships: Ship[] = [];
    const shipTypes: Ship['type'][] = ['scout', 'frigate', 'cruiser', 'battleship', 'transport'];
    const civilizations = ['Civilization 1', 'Civilization 2', 'Civilization 3', 'Civilization 4'];

    for (let i = 0; i < 25; i++) {
      const homeSystem = systems[Math.floor(Math.random() * systems.length)];
      const targetSystem = systems[Math.floor(Math.random() * systems.length)];
      
      ships.push({
        id: `ship-${i}`,
        name: `${shipTypes[Math.floor(Math.random() * shipTypes.length)].toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        position: {
          x: homeSystem.position.x + (Math.random() - 0.5) * 50,
          y: homeSystem.position.y + (Math.random() - 0.5) * 50,
          z: homeSystem.position.z + (Math.random() - 0.5) * 50
        },
        destination: Math.random() > 0.5 ? targetSystem.position : undefined,
        type: shipTypes[Math.floor(Math.random() * shipTypes.length)],
        civilization: civilizations[Math.floor(Math.random() * civilizations.length)],
        status: ['moving', 'stationed', 'exploring'][Math.floor(Math.random() * 3)] as Ship['status'],
        speed: Math.random() * 5 + 1
      });
    }

    return ships;
  };

  const generateSensorRanges = (): SensorRange[] => {
    return [
      { civilizationId: 'civilization_1', range: 300, detectionLevel: 'full' },
      { civilizationId: 'civilization_2', range: 250, detectionLevel: 'detailed' },
      { civilizationId: 'civilization_3', range: 200, detectionLevel: 'basic' },
      { civilizationId: 'civilization_4', range: 180, detectionLevel: 'basic' }
    ];
  };

  // Enhanced rendering with proper overlay positioning
  const renderGalaxy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !galaxyData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for full screen
    let rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // If dimensions are too small, wait a bit and try again (fixes re-open shrinking)
    if (rect.width < 100 || rect.height < 100) {
      console.warn('🚨 Canvas dimensions too small on first check:', { width: rect.width, height: rect.height });
      
      // Try to get fresh dimensions from parent container
      const parent = canvas.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        console.log('📏 Parent container dimensions:', { width: parentRect.width, height: parentRect.height });
        
        // If parent has good dimensions, use those
        if (parentRect.width > 100 && parentRect.height > 100) {
          rect = parentRect;
          console.log('✅ Using parent dimensions instead');
        }
      }
      
      // Force minimum dimensions if still too small
      const minWidth = Math.max(rect.width, 800);
      const minHeight = Math.max(rect.height, 600);
      canvas.width = minWidth * dpr;
      canvas.height = minHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = minWidth + 'px';
      canvas.style.height = minHeight + 'px';
      console.log('🔧 Applied minimum dimensions:', { width: minWidth, height: minHeight });
    } else {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      console.log('✅ Using normal canvas dimensions:', { width: rect.width, height: rect.height });
    }

    // Clear canvas with space background - use actual canvas dimensions
    const actualWidth = rect.width < 100 ? Math.max(rect.width, 800) : rect.width;
    const actualHeight = rect.height < 100 ? Math.max(rect.height, 600) : rect.height;
    
    const gradient = ctx.createRadialGradient(
      actualWidth / 2, actualHeight / 2, 0,
      actualWidth / 2, actualHeight / 2, Math.max(actualWidth, actualHeight) / 2
    );
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.7, '#000000');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, actualWidth, actualHeight);

    // Draw background stars
    drawBackgroundStars(ctx, actualWidth, actualHeight);

    // Draw data layers (in order)
    dataLayers.forEach(layer => {
      if (layer.enabled) {
        drawDataLayer(ctx, layer, actualWidth, actualHeight);
      }
    });

    // Draw sensor ranges
    if (sensorRangeVisible) {
      drawSensorRanges(ctx, actualWidth, actualHeight);
    }

    // Draw star systems with proper 3D positioning
    drawStarSystems(ctx, actualWidth, actualHeight);

    // Draw ships with real-time tracking
    if (showShips) {
      drawShips(ctx, actualWidth, actualHeight);
    }

    // Draw trade routes
    drawTradeRoutes(ctx, actualWidth, actualHeight);

    // Draw selection indicators
    drawSelectionIndicators(ctx, actualWidth, actualHeight);

  }, [galaxyData, cameraPosition, cameraRotation, zoomLevel, dataLayers, sensorRangeVisible, showShips, selectedSystem, selectedShip]);

  // STATIC background stars - generated once and reused to prevent crazy movement
  const [backgroundStars, setBackgroundStars] = useState<Array<{x: number, y: number, size: number, opacity: number, color?: string, twinkleOffset: number}>>([]);
  
  // Generate background stars only once on mount
  useEffect(() => {
    const stars: Array<{x: number, y: number, size: number, opacity: number, color?: string, twinkleOffset: number}> = [];
    
    for (let layer = 0; layer < 4; layer++) {
      const starCount = layer === 0 ? 400 : layer === 1 ? 200 : layer === 2 ? 100 : 50;
      const baseOpacity = layer === 0 ? 0.05 : layer === 1 ? 0.15 : layer === 2 ? 0.4 : 0.8;
      const sizeMultiplier = layer === 0 ? 0.3 : layer === 1 ? 0.7 : layer === 2 ? 1.2 : 2.0;
      
      for (let i = 0; i < starCount; i++) {
        const star = {
          x: Math.random() * 2000 - 1000, // Fixed range instead of screen-dependent
          y: Math.random() * 2000 - 1000,
          size: Math.random() * 2 * sizeMultiplier,
          opacity: baseOpacity * Math.random(),
          twinkleOffset: Math.random() * Math.PI * 2,
          color: undefined as string | undefined
        };
        
        // Add occasional colored stars
        if (Math.random() < 0.03) {
          const colors = ['rgba(100, 181, 246, ', 'rgba(255, 193, 7, ', 'rgba(244, 67, 54, ', 'rgba(156, 39, 176, '];
          star.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        stars.push(star);
      }
    }
    
    setBackgroundStars(stars);
  }, []); // Only run once on mount

  const drawBackgroundStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw STATIC background stars - no more random generation per frame
    backgroundStars.forEach((star, i) => {
      // Transform star position based on camera (subtle parallax effect)
      const parallaxFactor = 0.05; // Much slower movement than main objects
      const screenX = (width / 2) + (star.x - cameraPosition.x * parallaxFactor);
      const screenY = (height / 2) + (star.y - cameraPosition.y * parallaxFactor);
      
      // Only draw stars that are visible on screen
      if (screenX >= -10 && screenX <= width + 10 && screenY >= -10 && screenY <= height + 10) {
        // Gentle twinkling effect using pre-generated offset
        const twinkle = Math.sin(Date.now() * 0.0005 + star.twinkleOffset) * 0.2 + 0.8;
        const finalOpacity = star.opacity * twinkle;
        
        if (star.color) {
          // Colored star
          ctx.fillStyle = star.color + (finalOpacity * 0.6) + ')';
          ctx.beginPath();
          ctx.arc(screenX, screenY, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular white star
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  };

  const drawStarSystems = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

    // Sort systems by Z depth for proper 3D rendering
    const sortedSystems = [...galaxyData.systems].sort((a, b) => {
      const projA = project3DTo2D(a.position);
      const projB = project3DTo2D(b.position);
      return projB.z - projA.z; // Back to front
    });

    sortedSystems.forEach((system) => {
      const projected = project3DTo2D(system.position);
      if (!projected.visible) return;

      // Check if system is within sensor range
      const playerSensorRange = galaxyData.sensorRanges.find(sr => sr.civilizationId === playerCivilizationId);
      const distanceFromPlayer = Math.sqrt(
        Math.pow(system.position.x, 2) + 
        Math.pow(system.position.y, 2) + 
        Math.pow(system.position.z, 2)
      );
      
      const inSensorRange = !playerSensorRange || distanceFromPlayer <= playerSensorRange.range;
      const detectionLevel = playerSensorRange?.detectionLevel || 'basic';

      // Calculate depth-based scaling - ENHANCED for better visibility
      const maxDepth = 1000;
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, projected.z));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.5 + (depthFactor * 0.8); // Increased minimum scale
      const opacity = Math.max(0.3, depthFactor) * (inSensorRange ? 1 : 0.5); // Increased minimum opacity

      // MUCH MORE PRONOUNCED ownership colors
      let systemColor = '#666666'; // Neutral systems are gray
      let ownershipName = 'Neutral';
      
      if (system.civilization) {
        const civColors = [
          '#00ff88', // Bright green - Player
          '#ff4444', // Bright red - Enemy 1  
          '#ffaa00', // Bright orange - Enemy 2
          '#aa44ff', // Bright purple - Enemy 3
          '#44aaff', // Bright blue - Enemy 4
          '#ffff44', // Bright yellow - Enemy 5
          '#ff44aa'  // Bright pink - Enemy 6
        ];
        const civIndex = parseInt(system.civilization.slice(-1)) - 1;
        systemColor = civColors[civIndex] || '#00ff88';
        ownershipName = system.civilization;
      }

      // MASSIVE glow effect for better visibility
      const glowSize = Math.max(60, 80 * depthScale); // Much bigger glow
      const gradient = ctx.createRadialGradient(projected.x, projected.y, 0, projected.x, projected.y, glowSize);
      
      gradient.addColorStop(0, `${systemColor}${Math.floor(opacity * 0.8 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${systemColor}${Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${systemColor}00`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // MUCH BIGGER system core
      const coreSize = Math.max(8, 20 * depthScale); // Much bigger core
      const coreGradient = ctx.createRadialGradient(
        projected.x - coreSize * 0.3, projected.y - coreSize * 0.3, 0,
        projected.x, projected.y, coreSize
      );
      
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      coreGradient.addColorStop(1, `${systemColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // THICK ownership ring for controlled systems
      if (system.civilization) {
        const ringSize = Math.max(12, 30 * depthScale); // Much bigger ring
        ctx.strokeStyle = `${systemColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(3, 6 * depthScale); // Much thicker line
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, ringSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Double ring for extra visibility
        const outerRingSize = ringSize + 8;
        ctx.strokeStyle = `${systemColor}${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(1, 3 * depthScale);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, outerRingSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      // OWNERSHIP INDICATOR - Big colored square
      if (system.civilization) {
        const indicatorSize = Math.max(6, 12 * depthScale);
        const indicatorY = projected.y - (coreSize + 15);
        
        ctx.fillStyle = systemColor;
        ctx.fillRect(
          projected.x - indicatorSize/2, 
          indicatorY - indicatorSize/2, 
          indicatorSize, 
          indicatorSize
        );
        
        // White border around indicator
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          projected.x - indicatorSize/2, 
          indicatorY - indicatorSize/2, 
          indicatorSize, 
          indicatorSize
        );
      }

      // MUCH MORE VISIBLE text rendering with proper 3D positioning
      if (depthScale > 0.2 && inSensorRange) { // Show text more often
        const fontSize = Math.max(12, 18 * depthScale); // Bigger text
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.2)})`; // Brighter white text
        ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`; // Bold text
        ctx.textAlign = 'center';
        ctx.strokeStyle = `rgba(0, 0, 0, 0.9)`; // Strong black outline
        ctx.lineWidth = Math.max(2, 3 * depthScale); // Thicker outline
        
        // System name with strong outline
        const textY = projected.y + Math.max(35, 45 * depthScale); // Further from star
        ctx.strokeText(system.name, projected.x, textY);
        ctx.fillText(system.name, projected.x, textY);

        // ALWAYS show ownership info if system is controlled
        if (system.civilization && depthScale > 0.3) {
          const infoFontSize = Math.max(10, 14 * depthScale); // Bigger info text
          ctx.font = `bold ${infoFontSize}px 'Segoe UI', sans-serif`;
          ctx.fillStyle = systemColor; // Use the bright ownership color
          ctx.strokeStyle = `rgba(0, 0, 0, 0.9)`;
          ctx.lineWidth = Math.max(1, 2 * depthScale);
          
          const ownerY = textY + Math.max(18, 22 * depthScale);
          ctx.strokeText(ownershipName, projected.x, ownerY);
          ctx.fillText(ownershipName, projected.x, ownerY);
        }
        
        // Show neutral status for uncontrolled systems
        if (!system.civilization && depthScale > 0.4) {
          const infoFontSize = Math.max(8, 12 * depthScale);
          ctx.font = `${infoFontSize}px 'Segoe UI', sans-serif`;
          ctx.fillStyle = `rgba(150, 150, 150, ${opacity * 0.8})`;
          ctx.strokeStyle = `rgba(0, 0, 0, 0.8)`;
          ctx.lineWidth = 1;
          
          const neutralY = textY + Math.max(16, 20 * depthScale);
          ctx.strokeText('NEUTRAL', projected.x, neutralY);
          ctx.fillText('NEUTRAL', projected.x, neutralY);
        }
      }
    });
  };

  const drawShips = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

    galaxyData.ships.forEach((ship) => {
      const projected = project3DTo2D(ship.position);
      if (!projected.visible) return;

      // Check if ship is within sensor range
      const playerSensorRange = galaxyData.sensorRanges.find(sr => sr.civilizationId === playerCivilizationId);
      const distanceFromPlayer = Math.sqrt(
        Math.pow(ship.position.x, 2) + 
        Math.pow(ship.position.y, 2) + 
        Math.pow(ship.position.z, 2)
      );
      
      const inSensorRange = !playerSensorRange || distanceFromPlayer <= playerSensorRange.range;
      if (!inSensorRange) return;

      const maxDepth = 1000;
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, projected.z));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.6 + (depthFactor * 0.8); // BIGGER minimum scale
      const opacity = Math.max(0.7, depthFactor); // MUCH higher opacity

      // BRIGHT ship colors based on civilization
      const civColors = [
        '#00ff88', // Bright green - Player
        '#ff4444', // Bright red - Enemy 1  
        '#ffaa00', // Bright orange - Enemy 2
        '#aa44ff', // Bright purple - Enemy 3
        '#44aaff', // Bright blue - Enemy 4
        '#ffff44', // Bright yellow - Enemy 5
        '#ff44aa'  // Bright pink - Enemy 6
      ];
      const civIndex = parseInt(ship.civilization.slice(-1)) - 1;
      const shipColor = civColors[civIndex] || '#ffffff';

      // MUCH BIGGER ship sizes
      const shipSizes = { scout: 8, frigate: 12, cruiser: 16, battleship: 24, transport: 14 };
      const baseSize = shipSizes[ship.type] || 10;
      const shipSize = Math.max(6, baseSize * depthScale); // Minimum 6px

      // GLOW EFFECT for ships
      const glowSize = shipSize * 2;
      const glowGradient = ctx.createRadialGradient(projected.x, projected.y, 0, projected.x, projected.y, glowSize);
      glowGradient.addColorStop(0, `${shipColor}${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`);
      glowGradient.addColorStop(0.7, `${shipColor}${Math.floor(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
      glowGradient.addColorStop(1, `${shipColor}00`);
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw ship with BRIGHT colors and WHITE outline
      ctx.fillStyle = `${shipColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
      ctx.lineWidth = Math.max(1, 2 * depthScale);
      ctx.beginPath();
      
      // REALISTIC SHIP SHAPES - Look like actual spaceships
      switch (ship.type) {
        case 'scout':
          // Small sleek scout ship - arrow shape
          ctx.moveTo(projected.x, projected.y - shipSize); // nose
          ctx.lineTo(projected.x - shipSize * 0.3, projected.y + shipSize * 0.5); // left wing
          ctx.lineTo(projected.x - shipSize * 0.2, projected.y + shipSize * 0.3); // left body
          ctx.lineTo(projected.x - shipSize * 0.4, projected.y + shipSize); // left engine
          ctx.lineTo(projected.x + shipSize * 0.4, projected.y + shipSize); // right engine
          ctx.lineTo(projected.x + shipSize * 0.2, projected.y + shipSize * 0.3); // right body
          ctx.lineTo(projected.x + shipSize * 0.3, projected.y + shipSize * 0.5); // right wing
          ctx.closePath();
          break;
        case 'battleship':
          // Large imposing battleship - elongated with weapon pods
          ctx.moveTo(projected.x, projected.y - shipSize); // front
          ctx.lineTo(projected.x - shipSize * 0.8, projected.y - shipSize * 0.3); // left front
          ctx.lineTo(projected.x - shipSize * 1.2, projected.y); // left weapon pod
          ctx.lineTo(projected.x - shipSize * 0.8, projected.y + shipSize * 0.3); // left mid
          ctx.lineTo(projected.x - shipSize * 0.6, projected.y + shipSize); // left rear
          ctx.lineTo(projected.x + shipSize * 0.6, projected.y + shipSize); // right rear
          ctx.lineTo(projected.x + shipSize * 0.8, projected.y + shipSize * 0.3); // right mid
          ctx.lineTo(projected.x + shipSize * 1.2, projected.y); // right weapon pod
          ctx.lineTo(projected.x + shipSize * 0.8, projected.y - shipSize * 0.3); // right front
          ctx.closePath();
          break;
        case 'cruiser':
          // Medium cruiser - sleek with side pods
          ctx.moveTo(projected.x, projected.y - shipSize * 0.8); // nose
          ctx.lineTo(projected.x - shipSize * 0.4, projected.y - shipSize * 0.2); // left nose
          ctx.lineTo(projected.x - shipSize * 0.8, projected.y); // left pod
          ctx.lineTo(projected.x - shipSize * 0.4, projected.y + shipSize * 0.8); // left rear
          ctx.lineTo(projected.x, projected.y + shipSize * 0.6); // center rear
          ctx.lineTo(projected.x + shipSize * 0.4, projected.y + shipSize * 0.8); // right rear
          ctx.lineTo(projected.x + shipSize * 0.8, projected.y); // right pod
          ctx.lineTo(projected.x + shipSize * 0.4, projected.y - shipSize * 0.2); // right nose
          ctx.closePath();
          break;
        case 'frigate':
          // Frigate - angular military design
          ctx.moveTo(projected.x, projected.y - shipSize * 0.9); // front point
          ctx.lineTo(projected.x - shipSize * 0.5, projected.y - shipSize * 0.4); // left front
          ctx.lineTo(projected.x - shipSize * 0.7, projected.y + shipSize * 0.2); // left side
          ctx.lineTo(projected.x - shipSize * 0.3, projected.y + shipSize * 0.9); // left rear
          ctx.lineTo(projected.x + shipSize * 0.3, projected.y + shipSize * 0.9); // right rear
          ctx.lineTo(projected.x + shipSize * 0.7, projected.y + shipSize * 0.2); // right side
          ctx.lineTo(projected.x + shipSize * 0.5, projected.y - shipSize * 0.4); // right front
          ctx.closePath();
          break;
        case 'transport':
          // Transport - bulky cargo ship
          ctx.moveTo(projected.x, projected.y - shipSize * 0.6); // front
          ctx.lineTo(projected.x - shipSize * 0.9, projected.y - shipSize * 0.3); // left front
          ctx.lineTo(projected.x - shipSize * 0.9, projected.y + shipSize * 0.6); // left cargo
          ctx.lineTo(projected.x - shipSize * 0.5, projected.y + shipSize); // left rear
          ctx.lineTo(projected.x + shipSize * 0.5, projected.y + shipSize); // right rear
          ctx.lineTo(projected.x + shipSize * 0.9, projected.y + shipSize * 0.6); // right cargo
          ctx.lineTo(projected.x + shipSize * 0.9, projected.y - shipSize * 0.3); // right front
          ctx.closePath();
          break;
        default:
          // Default fighter - classic triangle with wings
          ctx.moveTo(projected.x, projected.y - shipSize); // nose
          ctx.lineTo(projected.x - shipSize * 0.6, projected.y + shipSize * 0.8); // left wing
          ctx.lineTo(projected.x - shipSize * 0.2, projected.y + shipSize * 0.5); // left body
          ctx.lineTo(projected.x + shipSize * 0.2, projected.y + shipSize * 0.5); // right body
          ctx.lineTo(projected.x + shipSize * 0.6, projected.y + shipSize * 0.8); // right wing
          ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      // Add engine glow effects for realism
      const engineGlowSize = shipSize * 0.3;
      const engineGlow = ctx.createRadialGradient(projected.x, projected.y + shipSize * 0.8, 0, projected.x, projected.y + shipSize * 0.8, engineGlowSize);
      engineGlow.addColorStop(0, `#00aaff${Math.floor(opacity * 0.8 * 255).toString(16).padStart(2, '0')}`);
      engineGlow.addColorStop(1, `#00aaff00`);
      
      ctx.fillStyle = engineGlow;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y + shipSize * 0.8, engineGlowSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw movement trail if ship is moving
      if (ship.destination && ship.status === 'moving') {
        const destProjected = project3DTo2D(ship.destination);
        if (destProjected.visible) {
          ctx.strokeStyle = `${shipColor}${Math.floor(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(projected.x, projected.y);
          ctx.lineTo(destProjected.x, destProjected.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // ALWAYS show ship labels if they're big enough
      if (depthScale > 0.4) {
        const fontSize = Math.max(8, 12 * depthScale);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.2)})`;
        ctx.font = `bold ${fontSize}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = `rgba(0, 0, 0, 0.8)`;
        ctx.lineWidth = 2;
        
        const labelY = projected.y - shipSize - 8;
        ctx.strokeText(ship.name, projected.x, labelY);
        ctx.fillText(ship.name, projected.x, labelY);
        
        // Show ship type in smaller text
        const typeSize = Math.max(6, 9 * depthScale);
        ctx.font = `${typeSize}px 'Segoe UI', sans-serif`;
        ctx.fillStyle = shipColor;
        ctx.strokeStyle = `rgba(0, 0, 0, 0.8)`;
        ctx.lineWidth = 1;
        
        const typeY = labelY + fontSize + 2;
        ctx.strokeText(ship.type.toUpperCase(), projected.x, typeY);
        ctx.fillText(ship.type.toUpperCase(), projected.x, typeY);
      }
    });
  };

  const drawSensorRanges = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!galaxyData) return;

    const playerSensorRange = galaxyData.sensorRanges.find(sr => sr.civilizationId === playerCivilizationId);
    if (!playerSensorRange) return;

    // Project player position (assuming at origin for now)
    const playerPos = { x: 0, y: 0, z: 0 };
    const projected = project3DTo2D(playerPos);
    
    if (!projected.visible) return;

    // Draw sensor range circle
    const rangeRadius = playerSensorRange.range * zoomLevel / (1 + Math.abs(projected.z) / 800);
    
    ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, rangeRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add sensor range label
    ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(`Sensor Range: ${playerSensorRange.range}`, projected.x, projected.y - rangeRadius - 10);
  };

  const drawDataLayer = (ctx: CanvasRenderingContext2D, layer: DataLayer, width: number, height: number) => {
    if (!galaxyData) return;

    switch (layer.type) {
      case 'territory':
        drawTerritoryBoundaries(ctx, layer);
        break;
      case 'trade':
        drawTradeRoutes(ctx, width, height, layer);
        break;
      case 'military':
        drawMilitaryAssets(ctx, layer);
        break;
      case 'resources':
        drawResourceDeposits(ctx, layer);
        break;
      case 'exploration':
        drawExplorationProgress(ctx, layer);
        break;
    }
  };

  const drawTerritoryBoundaries = (ctx: CanvasRenderingContext2D, layer: DataLayer) => {
    if (!galaxyData) return;

    // Group systems by civilization
    const civilizationSystems = galaxyData.systems.reduce((acc, system) => {
      if (system.civilization) {
        if (!acc[system.civilization]) acc[system.civilization] = [];
        acc[system.civilization].push(system);
      }
      return acc;
    }, {} as Record<string, StarSystem[]>);

    // Draw territory boundaries for each civilization
    Object.entries(civilizationSystems).forEach(([civ, systems]) => {
      if (systems.length < 2) return;

      const civColors = ['#4ecdc4', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71'];
      const civIndex = parseInt(civ.slice(-1)) - 1;
      const color = civColors[civIndex] || layer.color;

      // Calculate convex hull and draw boundary
      const projectedSystems = systems.map(s => project3DTo2D(s.position)).filter(p => p.visible);
      if (projectedSystems.length < 3) return;

      ctx.strokeStyle = `${color}${Math.floor(layer.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      
      // Simple boundary approximation
      const centerX = projectedSystems.reduce((sum, p) => sum + p.x, 0) / projectedSystems.length;
      const centerY = projectedSystems.reduce((sum, p) => sum + p.y, 0) / projectedSystems.length;
      const maxRadius = Math.max(...projectedSystems.map(p => 
        Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
      )) + 50;

      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  const drawTradeRoutes = (ctx: CanvasRenderingContext2D, width: number, height: number, layer?: DataLayer) => {
    if (!galaxyData) return;

    const opacity = layer ? layer.opacity : 0.3;
    const color = layer ? layer.color : '#f39c12';

    // Draw connections between nearby systems
    for (let i = 0; i < galaxyData.systems.length; i++) {
      for (let j = i + 1; j < galaxyData.systems.length; j++) {
        const sys1 = galaxyData.systems[i];
        const sys2 = galaxyData.systems[j];

        const distance = Math.sqrt(
          Math.pow(sys1.position.x - sys2.position.x, 2) +
          Math.pow(sys1.position.y - sys2.position.y, 2) +
          Math.pow(sys1.position.z - sys2.position.z, 2)
        );

        // Only draw routes between nearby systems with civilizations
        if (distance < 300 && sys1.civilization && sys2.civilization) {
          const proj1 = project3DTo2D(sys1.position);
          const proj2 = project3DTo2D(sys2.position);
          
          if (proj1.visible && proj2.visible) {
            ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    }
  };

  const drawMilitaryAssets = (ctx: CanvasRenderingContext2D, layer: DataLayer) => {
    if (!galaxyData) return;

    // Draw PROMINENT military indicators for systems with military presence
    galaxyData.systems.forEach(system => {
      if (!system.civilization) return; // Only controlled systems have military

      const projected = project3DTo2D(system.position);
      if (!projected.visible) return;

      const maxDepth = 1000;
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, projected.z));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.5 + (depthFactor * 0.8);
      const opacity = Math.max(0.6, depthFactor) * layer.opacity;

      // LARGE military indicator - red triangle
      const militarySize = Math.max(8, 15 * depthScale);
      const offsetX = 25 * depthScale;
      const offsetY = -25 * depthScale;
      
      ctx.fillStyle = `#ff4444${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(projected.x + offsetX, projected.y + offsetY - militarySize);
      ctx.lineTo(projected.x + offsetX - militarySize, projected.y + offsetY + militarySize);
      ctx.lineTo(projected.x + offsetX + militarySize, projected.y + offsetY + militarySize);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Military strength indicator
      const strengthBars = Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1));
      for (let i = 0; i < strengthBars; i++) {
        const barX = projected.x + offsetX - militarySize + (i * 4);
        const barY = projected.y + offsetY + militarySize + 5;
        const barHeight = 3 + (i * 2);
        
        ctx.fillStyle = `#ff4444${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(barX, barY, 3, barHeight);
      }
    });
  };

  const drawResourceDeposits = (ctx: CanvasRenderingContext2D, layer: DataLayer) => {
    if (!galaxyData) return;

    galaxyData.systems.forEach(system => {
      if (!system.resources || system.resources.length === 0) return;

      const projected = project3DTo2D(system.position);
      if (!projected.visible) return;

      const maxDepth = 1000;
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, projected.z));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.5 + (depthFactor * 0.8);
      const opacity = Math.max(0.6, depthFactor) * layer.opacity;

      // LARGE resource indicators - different shapes for different resources
      const resourceSize = Math.max(6, 12 * depthScale);
      const offsetX = -25 * depthScale;
      const offsetY = -25 * depthScale;

      system.resources.forEach((resource, index) => {
        const resourceY = projected.y + offsetY + (index * 15 * depthScale);
        
        // Different colors for different resource types
        let resourceColor = '#9b59b6'; // Default purple
        if (resource.includes('Metal') || resource.includes('Iron')) resourceColor = '#95a5a6';
        if (resource.includes('Energy') || resource.includes('Fuel')) resourceColor = '#f39c12';
        if (resource.includes('Rare') || resource.includes('Crystal')) resourceColor = '#e74c3c';
        if (resource.includes('Bio') || resource.includes('Food')) resourceColor = '#2ecc71';

        ctx.fillStyle = `${resourceColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.lineWidth = 2;

        // Different shapes for different resource types
        ctx.beginPath();
        if (resource.includes('Metal') || resource.includes('Iron')) {
          // Square for metals
          ctx.rect(projected.x + offsetX - resourceSize/2, resourceY - resourceSize/2, resourceSize, resourceSize);
        } else if (resource.includes('Energy') || resource.includes('Fuel')) {
          // Diamond for energy
          ctx.moveTo(projected.x + offsetX, resourceY - resourceSize);
          ctx.lineTo(projected.x + offsetX + resourceSize, resourceY);
          ctx.lineTo(projected.x + offsetX, resourceY + resourceSize);
          ctx.lineTo(projected.x + offsetX - resourceSize, resourceY);
          ctx.closePath();
        } else {
          // Circle for other resources
          ctx.arc(projected.x + offsetX, resourceY, resourceSize, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();

        // Resource quantity indicator
        const quantity = Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1));
        for (let i = 0; i < quantity; i++) {
          const dotX = projected.x + offsetX + resourceSize + 5 + (i * 3);
          ctx.fillStyle = resourceColor;
          ctx.beginPath();
          ctx.arc(dotX, resourceY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
  };

  const drawExplorationProgress = (ctx: CanvasRenderingContext2D, layer: DataLayer) => {
    if (!galaxyData) return;

    galaxyData.systems.forEach(system => {
      const projected = project3DTo2D(system.position);
      if (!projected.visible) return;

      const maxDepth = 1000;
      const normalizedDepth = Math.max(-maxDepth, Math.min(maxDepth, projected.z));
      const depthFactor = 1 - (normalizedDepth + maxDepth) / (2 * maxDepth);
      const depthScale = 0.5 + (depthFactor * 0.8);
      const opacity = Math.max(0.6, depthFactor) * layer.opacity;

      // LARGE exploration indicator
      const explorationSize = Math.max(10, 18 * depthScale);
      const offsetX = 25 * depthScale;
      const offsetY = 25 * depthScale;

      // Color and shape based on exploration status
      if (system.explored) {
        // GREEN checkmark for explored systems
        ctx.strokeStyle = `#2ecc71${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(2, 4 * depthScale);
        ctx.lineCap = 'round';
        
        // Draw checkmark
        ctx.beginPath();
        ctx.moveTo(projected.x + offsetX - explorationSize, projected.y + offsetY);
        ctx.lineTo(projected.x + offsetX - explorationSize/3, projected.y + offsetY + explorationSize/2);
        ctx.lineTo(projected.x + offsetX + explorationSize, projected.y + offsetY - explorationSize/2);
        ctx.stroke();
        
        // Exploration progress ring
        ctx.strokeStyle = `#2ecc71${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(1, 2 * depthScale);
        ctx.beginPath();
        ctx.arc(projected.x + offsetX, projected.y + offsetY, explorationSize + 5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // RED question mark for unexplored systems
        ctx.fillStyle = `#e74c3c${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.lineWidth = 2;
        
        // Draw question mark background circle
        ctx.beginPath();
        ctx.arc(projected.x + offsetX, projected.y + offsetY, explorationSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw question mark
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.font = `bold ${Math.max(8, 12 * depthScale)}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', projected.x + offsetX, projected.y + offsetY);
      }

      // Exploration scan lines for dramatic effect
      if (!system.explored) {
        const scanRadius = explorationSize + 10;
        const scanAngle = (Date.now() * 0.005) % (Math.PI * 2);
        
        ctx.strokeStyle = `#e74c3c${Math.floor(opacity * 0.4 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(projected.x + offsetX, projected.y + offsetY);
        ctx.lineTo(
          projected.x + offsetX + Math.cos(scanAngle) * scanRadius,
          projected.y + offsetY + Math.sin(scanAngle) * scanRadius
        );
        ctx.stroke();
      }
    });
  };

  const drawSelectionIndicators = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw selection indicator for selected system
    if (selectedSystem) {
      const projected = project3DTo2D(selectedSystem.position);
      if (projected.visible) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 30, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw selection indicator for selected ship
    if (selectedShip) {
      const projected = project3DTo2D(selectedShip.position);
      if (projected.visible) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  // Mouse interaction handlers
  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('🖱️ MOUSE DOWN - NEW CONTROL SYSTEM ACTIVE');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setLastMousePos({ x: mouseX, y: mouseY });

    if (event.button === 0) { // Left click - pan
      console.log('🚀 LEFT MOUSE DOWN - STARTING PAN MODE');
      setIsDragging(true);
      canvas.style.cursor = 'grabbing';
      canvas.style.border = '3px solid #00ff00'; // GREEN border for panning
    } else if (event.button === 2) { // Right click - rotate around mouse
      console.log('🔄 RIGHT MOUSE DOWN - STARTING ROTATION AROUND MOUSE');
      setIsRotating(true);
      setRotationPivot({ x: mouseX, y: mouseY }); // Remember where rotation started
      canvas.style.cursor = 'grabbing';
      canvas.style.border = '3px solid #ff0000'; // RED border for rotation
      event.preventDefault();
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
        // LEFT DRAG: Pan like dragging the map itself - 3D ROTATION AWARE
        const panSpeed = 2.0 / zoomLevel; // Reduced speed for better control
        
        // Transform mouse movement based on current camera rotation (3D approach)
        const cosY = Math.cos(cameraRotation.y);
        const sinY = Math.sin(cameraRotation.y);
        
        // For 3D camera rotation around Y-axis, mouse X affects world X and Z
        // Mouse Y always affects world Y (vertical movement)
        const worldDeltaX = -deltaX * cosY; // Mouse right = world right when not rotated
        const worldDeltaZ = deltaX * sinY;  // Mouse right = world forward when rotated 90°
        const worldDeltaY = -deltaY;        // Mouse down = world down (always)
        
        const newPos = {
          x: cameraPosition.x + worldDeltaX * panSpeed, // Apply world X delta
          y: cameraPosition.y + worldDeltaY * panSpeed, // Apply world Y delta  
          z: cameraPosition.z + worldDeltaZ * panSpeed  // Apply world Z delta
        };
        console.log('🚀 LEFT DRAG PANNING - 3D ROTATION AWARE:', { 
          deltaX, deltaY, 
          rotation: cameraRotation.y, 
          worldDeltas: { x: worldDeltaX, y: worldDeltaY, z: worldDeltaZ },
          panSpeed, 
          oldPos: cameraPosition, 
          newPos 
        });
        setCameraPosition(newPos);
      } else if (isRotating) {
        // RIGHT DRAG: Rotate around the mouse position where right-click started
        const rotSpeed = 0.01; // Slower for more control
        
        // Calculate rotation around the pivot point (where right-click started)
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          
          // Convert pivot point to relative position from center
          const pivotFromCenterX = rotationPivot.x - rect.width / 2;
          const pivotFromCenterY = rotationPivot.y - rect.height / 2;
          
          // Apply rotation
          const newRot = {
            x: Math.max(-Math.PI/6, Math.min(Math.PI/6, cameraRotation.x + deltaY * rotSpeed)), // Limited vertical rotation (30 degrees)
            y: cameraRotation.y + deltaX * rotSpeed // Unlimited horizontal rotation
          };
          
          // For mouse-pivot rotation, we need to adjust camera position to maintain the pivot
          // This is a simplified approach - just rotate normally but track the pivot
          console.log('🔄 RIGHT DRAG ROTATION - AROUND MOUSE PIVOT:', { 
            deltaX, deltaY, rotSpeed,
            pivotPoint: rotationPivot,
            pivotFromCenter: { x: pivotFromCenterX, y: pivotFromCenterY },
            oldRot: cameraRotation, newRot 
          });
          
          setCameraRotation(newRot);
          // For now, keep camera position unchanged - the visual effect will still be better
          // because we're tracking the pivot point for future enhancements
        }
      }

      setLastMousePos({ x: mouseX, y: mouseY });
    } else {
      // Check for object hover
      let newHoveredObject: { type: 'system' | 'ship', object: StarSystem | Ship } | null = null;

      // Check systems
      for (const system of galaxyData.systems) {
        const projected = project3DTo2D(system.position);
        if (projected.visible) {
          const distance = Math.sqrt(Math.pow(mouseX - projected.x, 2) + Math.pow(mouseY - projected.y, 2));
          if (distance < 25) {
            newHoveredObject = { type: 'system', object: system };
            break;
          }
        }
      }

      // Check ships if no system hovered
      if (!newHoveredObject && showShips) {
        for (const ship of galaxyData.ships) {
          const projected = project3DTo2D(ship.position);
          if (projected.visible) {
            const distance = Math.sqrt(Math.pow(mouseX - projected.x, 2) + Math.pow(mouseY - projected.y, 2));
            if (distance < 15) {
              newHoveredObject = { type: 'ship', object: ship };
              break;
            }
          }
        }
      }

      setHoveredObject(newHoveredObject);
      setMousePosition({ x: mouseX, y: mouseY });
      canvas.style.cursor = newHoveredObject ? 'pointer' : 'grab';
    }
  };

  const handleCanvasMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('🖱️ MOUSE UP - ENDING CONTROL MODE', { button: event.button, isDragging, isRotating });
    const canvas = canvasRef.current;
    if (!canvas) return;

    // FORCE stop all dragging regardless of button to prevent stuck states
    if (event.button === 0 || isDragging) {
      console.log('🚀 LEFT MOUSE UP - FORCE ENDING PAN MODE');
      setIsDragging(false);
      canvas.style.cursor = 'grab';
      canvas.style.border = 'none';
    }
    
    if (event.button === 2 || isRotating) {
      console.log('🔄 RIGHT MOUSE UP - FORCE ENDING ROTATION MODE');
      setIsRotating(false);
      canvas.style.cursor = 'grab';
      canvas.style.border = 'none';
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging || isRotating) return;

    if (hoveredObject) {
      if (hoveredObject.type === 'system') {
        setSelectedSystem(hoveredObject.object as StarSystem);
        setSelectedShip(null);
      } else if (hoveredObject.type === 'ship') {
        setSelectedShip(hoveredObject.object as Ship);
        setSelectedSystem(null);
      }
    } else {
      setSelectedSystem(null);
      setSelectedShip(null);
    }
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.1, Math.min(5, prev * zoomFactor)));
  };

  // Resize observer to handle container size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      // Add a small delay to ensure dimensions are stable
      setTimeout(() => {
        renderGalaxy();
      }, 10);
    });

    // Observe the canvas element for size changes
    resizeObserver.observe(canvas);

    // Also trigger initial render after a delay to ensure container is sized
    const initialRenderTimeout = setTimeout(() => {
      renderGalaxy();
    }, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(initialRenderTimeout);
    };
  }, [renderGalaxy]);

  // Animation loop - COMPLETELY FIXED to prevent random movement
  useEffect(() => {
    const animate = () => {
      // ONLY render the galaxy - NO data updates in animation loop
      renderGalaxy();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderGalaxy]);

  // Separate effect for ship movement updates - ONLY when needed
  useEffect(() => {
    if (!galaxyData || !showShips) return;
    
    const updateShips = () => {
      const hasMovingShips = galaxyData.ships.some(ship => ship.status === 'moving' && ship.destination);
      if (!hasMovingShips) return;
      
      setGalaxyData(prev => {
        if (!prev) return prev;
        
        const updatedShips = prev.ships.map(ship => {
          if (ship.status === 'moving' && ship.destination) {
            const dx = ship.destination.x - ship.position.x;
            const dy = ship.destination.y - ship.position.y;
            const dz = ship.destination.z - ship.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance > ship.speed) {
              const moveRatio = ship.speed / distance;
              return {
                ...ship,
                position: {
                  x: ship.position.x + dx * moveRatio,
                  y: ship.position.y + dy * moveRatio,
                  z: ship.position.z + dz * moveRatio
                }
              };
            } else {
              // Ship reached destination
              return {
                ...ship,
                position: ship.destination,
                destination: undefined,
                status: 'stationed' as Ship['status']
              };
            }
          }
          return ship;
        });
        
        return { ...prev, ships: updatedShips };
      });
    };
    
    const shipUpdateInterval = setInterval(updateShips, 100); // Update ships every 100ms
    
    return () => clearInterval(shipUpdateInterval);
  }, [galaxyData, showShips]);

  // Separate effect for follow ship camera
  useEffect(() => {
    if (!followShip || !galaxyData) return;
    
    const ship = galaxyData.ships.find(s => s.id === followShip);
    if (ship) {
      setCameraPosition({
        x: ship.position.x,
        y: ship.position.y,
        z: ship.position.z - 200
      });
    }
  }, [followShip, galaxyData]);

  // Initialize data
  useEffect(() => {
    fetchGalaxyData();
  }, [fetchGalaxyData]);

  // Force re-render when component becomes visible (fixes shrinking on re-open)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // AGGRESSIVE: Force canvas to be large immediately
    const forceCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const minWidth = 800;
      const minHeight = 600;
      
      canvas.width = minWidth * dpr;
      canvas.height = minHeight * dpr;
      canvas.style.width = minWidth + 'px';
      canvas.style.height = minHeight + 'px';
      
      console.log('🚀 FORCED canvas to minimum size:', { width: minWidth, height: minHeight });
    };

    // Force size immediately
    forceCanvasSize();

    // Use Intersection Observer to detect when canvas becomes visible
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // Canvas is visible, force a re-render with fresh dimensions
          setTimeout(() => {
            console.log('🔄 Canvas became visible, forcing re-render...');
            forceCanvasSize(); // Force size again
            renderGalaxy();
          }, 50);
        }
      });
    }, { threshold: 0.5 });

    intersectionObserver.observe(canvas);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [renderGalaxy]);

  // Center camera on galaxy
  const centerCamera = useCallback(() => {
    if (!galaxyData || galaxyData.systems.length === 0) return;

    const centerX = galaxyData.systems.reduce((sum, sys) => sum + sys.position.x, 0) / galaxyData.systems.length;
    const centerY = galaxyData.systems.reduce((sum, sys) => sum + sys.position.y, 0) / galaxyData.systems.length;
    const centerZ = galaxyData.systems.reduce((sum, sys) => sum + sys.position.z, 0) / galaxyData.systems.length;

    setCameraPosition({ x: centerX, y: centerY, z: centerZ - 500 });
    setCameraRotation({ x: 0, y: 0 });
  }, [galaxyData]);

  // Auto-center ONLY on initial data load - not on every update
  const [hasInitiallycentered, setHasInitiallyCentered] = useState(false);
  useEffect(() => {
    if (galaxyData && galaxyData.systems.length > 0 && !hasInitiallycentered) {
      centerCamera();
      setHasInitiallyCentered(true);
    }
  }, [galaxyData, centerCamera, hasInitiallycentered]);

  if (loading) {
    return (
      <div className="enhanced-galaxy-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading Enhanced Galaxy Map...</p>
      </div>
    );
  }

  if (error && !galaxyData) {
    return (
      <div className="enhanced-galaxy-map-error">
        <p>⚠️ Error loading galaxy data</p>
        <p>{error}</p>
        <button onClick={fetchGalaxyData}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`enhanced-galaxy-map ${fullScreen ? 'fullscreen' : ''}`}>
      {/* Enhanced Controls */}
      {showControls && (
        <div className="enhanced-controls">
          {/* Camera Controls */}
          <div className="control-group camera-controls">
            <h4>📷 Camera</h4>
            <div className="control-buttons">
              <button onClick={centerCamera} title="Center on galaxy">🎯</button>
              <button 
                onClick={() => {
                  setCameraRotation({ x: 0, y: 0 });
                  setZoomLevel(1);
                }}
                title="Reset view"
              >
                🔄
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev * 1.2, 5))}
                title="Zoom in"
              >
                🔍+
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev / 1.2, 0.1))}
                title="Zoom out"
              >
                🔍-
              </button>
            </div>
            <div className="zoom-display">Zoom: {zoomLevel.toFixed(1)}x</div>
          </div>

          {/* Data Layers */}
          <div className="control-group data-layers">
            <h4>📊 Data Layers</h4>
            {dataLayers.map(layer => (
              <label key={layer.id} className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layer.enabled}
                  onChange={(e) => {
                    setDataLayers(prev => prev.map(l => 
                      l.id === layer.id ? { ...l, enabled: e.target.checked } : l
                    ));
                  }}
                />
                <span>{layer.name}</span>
              </label>
            ))}
          </div>

          {/* Display Options */}
          <div className="control-group display-options">
            <h4>👁️ Display</h4>
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={showShips}
                onChange={(e) => setShowShips(e.target.checked)}
              />
              <span>🚀 Ships</span>
            </label>
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={sensorRangeVisible}
                onChange={(e) => setSensorRangeVisible(e.target.checked)}
              />
              <span>📡 Sensor Range</span>
            </label>
            <label className="option-toggle">
              <input
                type="checkbox"
                checked={minimapVisible}
                onChange={(e) => setMinimapVisible(e.target.checked)}
              />
              <span>🗺️ Minimap</span>
            </label>
          </div>

          {/* Ship Tracking */}
          {showShips && galaxyData && (
            <div className="control-group ship-tracking">
              <h4>🎯 Ship Tracking</h4>
              <select
                value={followShip || ''}
                onChange={(e) => setFollowShip(e.target.value || null)}
              >
                <option value="">No tracking</option>
                {galaxyData.ships.map(ship => (
                  <option key={ship.id} value={ship.id}>
                    {ship.name} ({ship.type})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Controls Toggle */}
      <button 
        className="controls-toggle"
        onClick={() => setShowControls(!showControls)}
        title="Toggle controls"
      >
        {showControls ? '◀' : '▶'}
      </button>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="enhanced-galaxy-canvas"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={() => {
          // FORCE stop all dragging when mouse leaves canvas
          console.log('🖱️ MOUSE LEAVE - FORCE STOPPING ALL DRAGGING');
          setIsDragging(false);
          setIsRotating(false);
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.style.cursor = 'grab';
            canvas.style.border = 'none';
          }
        }}
        onClick={handleCanvasClick}
        onWheel={handleCanvasWheel}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Rotation Pivot Indicator */}
      {isRotating && (
        <div 
          className="rotation-pivot-indicator"
          style={{
            position: 'absolute',
            left: rotationPivot.x - 10,
            top: rotationPivot.y - 10,
            width: 20,
            height: 20,
            border: '2px solid #ff0000',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}

      {/* Hover Tooltip */}
      {hoveredObject && (
        <div 
          className="enhanced-hover-tooltip"
          style={{
            left: mousePosition.x + 15,
            top: mousePosition.y - 10,
          }}
        >
          {hoveredObject.type === 'system' ? (
            <div>
              <h4>⭐ {(hoveredObject.object as StarSystem).name}</h4>
              <div className="tooltip-info">
                <div>Type: {(hoveredObject.object as StarSystem).starType}</div>
                <div>Planets: {(hoveredObject.object as StarSystem).planets}</div>
                <div>Status: {(hoveredObject.object as StarSystem).controlledBy ? 
                  `Controlled by ${(hoveredObject.object as StarSystem).controlledBy}` : 'Neutral'}</div>
                <div>Explored: {(hoveredObject.object as StarSystem).explored ? '✅' : '❌'}</div>
              </div>
            </div>
          ) : (
            <div>
              <h4>🚀 {(hoveredObject.object as Ship).name}</h4>
              <div className="tooltip-info">
                <div>Type: {(hoveredObject.object as Ship).type}</div>
                <div>Civilization: {(hoveredObject.object as Ship).civilization}</div>
                <div>Status: {(hoveredObject.object as Ship).status}</div>
                <div>Speed: {(hoveredObject.object as Ship).speed.toFixed(1)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selection Panels */}
      {selectedSystem && (
        <div className="selection-panel system-panel">
          <div className="panel-header">
            <h3>⭐ {selectedSystem.name}</h3>
            <button onClick={() => setSelectedSystem(null)}>×</button>
          </div>
          <div className="panel-content">
            <div className="info-grid">
              <div className="info-item">
                <span>Type:</span>
                <span>{selectedSystem.starType}</span>
              </div>
              <div className="info-item">
                <span>Planets:</span>
                <span>{selectedSystem.planets}</span>
              </div>
              <div className="info-item">
                <span>Population:</span>
                <span>{selectedSystem.population?.toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span>Civilization:</span>
                <span>{selectedSystem.civilization || 'None'}</span>
              </div>
              <div className="info-item">
                <span>Security:</span>
                <span>{selectedSystem.security}</span>
              </div>
              <div className="info-item">
                <span>Resources:</span>
                <span>{selectedSystem.resources?.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedShip && (
        <div className="selection-panel ship-panel">
          <div className="panel-header">
            <h3>🚀 {selectedShip.name}</h3>
            <button onClick={() => setSelectedShip(null)}>×</button>
          </div>
          <div className="panel-content">
            <div className="info-grid">
              <div className="info-item">
                <span>Type:</span>
                <span>{selectedShip.type}</span>
              </div>
              <div className="info-item">
                <span>Civilization:</span>
                <span>{selectedShip.civilization}</span>
              </div>
              <div className="info-item">
                <span>Status:</span>
                <span>{selectedShip.status}</span>
              </div>
              <div className="info-item">
                <span>Speed:</span>
                <span>{selectedShip.speed.toFixed(1)}</span>
              </div>
            </div>
            <div className="ship-actions">
              <button 
                onClick={() => setFollowShip(followShip === selectedShip.id ? null : selectedShip.id)}
                className={followShip === selectedShip.id ? 'active' : ''}
              >
                {followShip === selectedShip.id ? '📍 Stop Following' : '🎯 Follow Ship'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galaxy Info */}
      <div className="galaxy-info-panel">
        <h4>🌌 Enhanced Galaxy Map</h4>
        <div className="info-stats">
          <div>Systems: {galaxyData?.systems.length || 0}</div>
          <div>Ships: {galaxyData?.ships.length || 0}</div>
          <div>Player: {playerCivilizationId}</div>
        </div>
      </div>

      {/* Minimap */}
      {minimapVisible && (
        <div className="minimap">
          <div className="minimap-header">
            <h5>🗺️ Overview</h5>
            <button onClick={() => setMinimapVisible(false)}>×</button>
          </div>
          <div className="minimap-content">
            {/* Simplified 2D representation */}
            <svg width="120" height="120" viewBox="-300 -300 600 600">
              {galaxyData?.systems.map(system => (
                <circle
                  key={system.id}
                  cx={system.position.x}
                  cy={system.position.z}
                  r="3"
                  fill={system.civilization ? '#4ecdc4' : '#666'}
                  opacity="0.7"
                />
              ))}
              {/* Camera position indicator */}
              <circle
                cx={cameraPosition.x}
                cy={cameraPosition.z}
                r="5"
                fill="red"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
