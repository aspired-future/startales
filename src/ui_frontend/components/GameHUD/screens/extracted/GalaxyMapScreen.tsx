/**
 * Galaxy Map Screen - Interstellar Cartography and Navigation
 * 
 * This screen focuses on galactic mapping and navigation operations including:
 * - Interactive galaxy map visualization
 * - Star system exploration and discovery
 * - Navigation routes and travel planning
 * - Territory mapping and border management
 * - Spatial analytics and cartographic data
 * 
 * Theme: Space (purple color scheme)
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseScreen, { ScreenProps, APIEndpoint, TabConfig } from '../BaseScreen';
import './GalaxyMapScreen.css';
import '../shared/StandardDesign.css';
import { LineChart, PieChart, BarChart } from '../../../Charts';

interface StarSystem {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  type: 'main_sequence' | 'red_giant' | 'white_dwarf' | 'neutron_star' | 'black_hole' | 'binary';
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  luminosity: number;
  temperature: number;
  planets: number;
  habitablePlanets: number;
  civilization: string;
  status: 'explored' | 'unexplored' | 'colonized' | 'contested' | 'restricted';
  resources: string[];
  strategicValue: number;
  distanceFromCenter: number;
  discoveryDate: string;
}

interface NavigationRoute {
  id: string;
  name: string;
  startSystem: string;
  endSystem: string;
  waypoints: string[];
  distance: number;
  travelTime: number;
  fuelCost: number;
  risk: 'low' | 'medium' | 'high' | 'extreme';
  status: 'active' | 'planned' | 'completed' | 'cancelled';
  traffic: number;
  restrictions: string[];
  lastUpdated: string;
}

interface Territory {
  id: string;
  name: string;
  civilization: string;
  systems: string[];
  borders: Array<{ system: string; coordinates: { x: number; y: number; z: number } }>;
  area: number;
  population: number;
  economicValue: number;
  strategicImportance: number;
  status: 'stable' | 'expanding' | 'contested' | 'declining';
  resources: string[];
  defenses: string[];
  lastSurvey: string;
}

interface GalaxyMapAnalytics {
  overview: {
    totalSystems: number;
    exploredSystems: number;
    colonizedSystems: number;
    activeRoutes: number;
    totalTerritories: number;
    averageDistance: number;
  };
  explorationTrends: Array<{
    date: string;
    systemsExplored: number;
    newDiscoveries: number;
    colonizationEvents: number;
    routeEstablishments: number;
  }>;
  systemDistribution: Array<{
    type: string;
    count: number;
    habitablePlanets: number;
    strategicValue: number;
  }>;
  territoryAnalysis: Array<{
    civilization: string;
    systems: number;
    area: number;
    population: number;
    economicValue: number;
  }>;
}

interface GalaxyMapData {
  starSystems: StarSystem[];
  navigationRoutes: NavigationRoute[];
  territories: Territory[];
  analytics: GalaxyMapAnalytics;
}

const GalaxyMapScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [galaxyData, setGalaxyData] = useState<GalaxyMapData | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'systems' | 'routes' | 'territories' | 'analytics'>('map');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCivilization, setFilterCivilization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);

  // Define tabs for the header (max 5 tabs)
  const tabs: TabConfig[] = [
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'systems', label: 'Systems', icon: '⭐' },
    { id: 'routes', label: 'Routes', icon: '🛤️' },
    { id: 'territories', label: 'Territories', icon: '🏛️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  // API endpoints
  const apiEndpoints: APIEndpoint[] = [
    { method: 'GET', path: '/api/galaxy/systems', description: 'Get star systems' },
    { method: 'GET', path: '/api/galaxy/routes', description: 'Get navigation routes' },
    { method: 'GET', path: '/api/galaxy/territories', description: 'Get territories' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) return `${(distance / 1000).toFixed(1)}k ly`;
    return `${distance.toFixed(1)} ly`;
  };

  const getSystemTypeColor = (type: string) => {
    switch (type) {
      case 'main_sequence': return '#10b981';
      case 'red_giant': return '#ef4444';
      case 'white_dwarf': return '#3b82f6';
      case 'neutron_star': return '#8b5cf6';
      case 'black_hole': return '#000000';
      case 'binary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getSpectralClassColor = (spectralClass: string) => {
    switch (spectralClass) {
      case 'O': return '#3b82f6';
      case 'B': return '#8b5cf6';
      case 'A': return '#10b981';
      case 'F': return '#f59e0b';
      case 'G': return '#f59e0b';
      case 'K': return '#f97316';
      case 'M': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'explored': return '#10b981';
      case 'unexplored': return '#6b7280';
      case 'colonized': return '#3b82f6';
      case 'contested': return '#ef4444';
      case 'restricted': return '#f59e0b';
      case 'active': return '#10b981';
      case 'planned': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'stable': return '#10b981';
      case 'expanding': return '#3b82f6';
      case 'declining': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'extreme': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const fetchGalaxyData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch('http://localhost:4000/api/galaxy/systems');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGalaxyData(data.data);
        } else {
          throw new Error('API response error');
        }
      } else {
        throw new Error('API not available');
      }

    } catch (err) {
      console.warn('Failed to fetch galaxy data:', err);
      // Use comprehensive mock data
      setGalaxyData({
        starSystems: [
          {
            id: 'system_1',
            name: 'Sol',
            coordinates: { x: 0, y: 0, z: 0 },
            type: 'main_sequence',
            spectralClass: 'G',
            luminosity: 1.0,
            temperature: 5778,
            planets: 8,
            habitablePlanets: 1,
            civilization: 'Terran Federation',
            status: 'colonized',
            resources: ['Iron', 'Silicon', 'Water', 'Rare Earths'],
            strategicValue: 10,
            distanceFromCenter: 0,
            discoveryDate: 'Pre-Space Era'
          },
          {
            id: 'system_2',
            name: 'Alpha Centauri',
            coordinates: { x: 4.37, y: 0, z: 0 },
            type: 'binary',
            spectralClass: 'G',
            luminosity: 1.5,
            temperature: 5790,
            planets: 3,
            habitablePlanets: 1,
            civilization: 'Terran Federation',
            status: 'colonized',
            resources: ['Helium-3', 'Deuterium', 'Minerals'],
            strategicValue: 8,
            distanceFromCenter: 4.37,
            discoveryDate: '2150-01-15'
          },
          {
            id: 'system_3',
            name: 'Vega',
            coordinates: { x: 25.04, y: 0, z: 0 },
            type: 'main_sequence',
            spectralClass: 'A',
            luminosity: 40.0,
            temperature: 9602,
            planets: 5,
            habitablePlanets: 2,
            civilization: 'Vega Alliance',
            status: 'colonized',
            resources: ['Platinum', 'Gold', 'Exotic Matter'],
            strategicValue: 9,
            distanceFromCenter: 25.04,
            discoveryDate: '2200-03-22'
          },
          {
            id: 'system_4',
            name: 'Sirius',
            coordinates: { x: 8.6, y: 0, z: 0 },
            type: 'main_sequence',
            spectralClass: 'A',
            luminosity: 25.0,
            temperature: 9940,
            planets: 2,
            habitablePlanets: 0,
            civilization: 'Terran Federation',
            status: 'explored',
            resources: ['Diamond', 'Carbon', 'Helium'],
            strategicValue: 6,
            distanceFromCenter: 8.6,
            discoveryDate: '2180-07-10'
          },
          {
            id: 'system_5',
            name: 'Proxima Centauri',
            coordinates: { x: 4.24, y: 0, z: 0 },
            type: 'main_sequence',
            spectralClass: 'M',
            luminosity: 0.0017,
            temperature: 3042,
            planets: 1,
            habitablePlanets: 0,
            civilization: 'Terran Federation',
            status: 'explored',
            resources: ['Iron', 'Nickel', 'Sulfur'],
            strategicValue: 4,
            distanceFromCenter: 4.24,
            discoveryDate: '2150-01-15'
          }
        ],
        navigationRoutes: [
          {
            id: 'route_1',
            name: 'Terran-Vega Corridor',
            startSystem: 'Sol',
            endSystem: 'Vega',
            waypoints: ['Alpha Centauri', 'Sirius'],
            distance: 25.04,
            travelTime: 72,
            fuelCost: 1500,
            risk: 'low',
            status: 'active',
            traffic: 1250,
            restrictions: [],
            lastUpdated: '2393-06-15T10:00:00Z'
          },
          {
            id: 'route_2',
            name: 'Inner Core Route',
            startSystem: 'Sol',
            endSystem: 'Proxima Centauri',
            waypoints: [],
            distance: 4.24,
            travelTime: 12,
            fuelCost: 250,
            risk: 'low',
            status: 'active',
            traffic: 8900,
            restrictions: [],
            lastUpdated: '2393-06-15T10:00:00Z'
          },
          {
            id: 'route_3',
            name: 'Exploration Path Alpha',
            startSystem: 'Vega',
            endSystem: 'Unknown System X',
            waypoints: ['Vega Outpost'],
            distance: 45.2,
            travelTime: 120,
            fuelCost: 3200,
            risk: 'high',
            status: 'planned',
            traffic: 0,
            restrictions: ['Exploration License Required'],
            lastUpdated: '2393-06-14T15:30:00Z'
          }
        ],
        territories: [
          {
            id: 'territory_1',
            name: 'Terran Core Systems',
            civilization: 'Terran Federation',
            systems: ['Sol', 'Alpha Centauri', 'Sirius', 'Proxima Centauri'],
            borders: [
              { system: 'Sol', coordinates: { x: 0, y: 0, z: 0 } },
              { system: 'Alpha Centauri', coordinates: { x: 4.37, y: 0, z: 0 } },
              { system: 'Sirius', coordinates: { x: 8.6, y: 0, z: 0 } },
              { system: 'Proxima Centauri', coordinates: { x: 4.24, y: 0, z: 0 } }
            ],
            area: 125.6,
            population: 12500000000,
            economicValue: 4560000000000,
            strategicImportance: 9.5,
            status: 'stable',
            resources: ['All Major Resources', 'Strategic Minerals', 'Energy'],
            defenses: ['Fleet Command', 'Planetary Shields', 'Early Warning System'],
            lastSurvey: '2393-06-01T00:00:00Z'
          },
          {
            id: 'territory_2',
            name: 'Vega Alliance Space',
            civilization: 'Vega Alliance',
            systems: ['Vega'],
            borders: [
              { system: 'Vega', coordinates: { x: 25.04, y: 0, z: 0 } }
            ],
            area: 78.5,
            population: 8900000000,
            economicValue: 2340000000000,
            strategicImportance: 8.2,
            status: 'expanding',
            resources: ['Exotic Matter', 'Rare Minerals', 'Advanced Technology'],
            defenses: ['Alliance Fleet', 'Vega Defense Grid', 'Diplomatic Relations'],
            lastSurvey: '2393-05-28T00:00:00Z'
          }
        ],
        analytics: {
          overview: {
            totalSystems: 1250,
            exploredSystems: 890,
            colonizedSystems: 234,
            activeRoutes: 45,
            totalTerritories: 12,
            averageDistance: 15.7
          },
          explorationTrends: [
            { date: 'Jun 10', systemsExplored: 890, newDiscoveries: 5, colonizationEvents: 2, routeEstablishments: 1 },
            { date: 'Jun 11', systemsExplored: 892, newDiscoveries: 3, colonizationEvents: 1, routeEstablishments: 0 },
            { date: 'Jun 12', systemsExplored: 895, newDiscoveries: 4, colonizationEvents: 3, routeEstablishments: 2 },
            { date: 'Jun 13', systemsExplored: 897, newDiscoveries: 2, colonizationEvents: 1, routeEstablishments: 1 },
            { date: 'Jun 14', systemsExplored: 900, newDiscoveries: 6, colonizationEvents: 2, routeEstablishments: 1 },
            { date: 'Jun 15', systemsExplored: 903, newDiscoveries: 4, colonizationEvents: 2, routeEstablishments: 2 }
          ],
          systemDistribution: [
            { type: 'Main Sequence', count: 890, habitablePlanets: 156, strategicValue: 8.7 },
            { type: 'Red Giant', count: 45, habitablePlanets: 12, strategicValue: 6.2 },
            { type: 'White Dwarf', count: 78, habitablePlanets: 8, strategicValue: 7.8 },
            { type: 'Neutron Star', count: 23, habitablePlanets: 0, strategicValue: 9.1 },
            { type: 'Black Hole', count: 12, habitablePlanets: 0, strategicValue: 9.8 },
            { type: 'Binary', count: 202, habitablePlanets: 34, strategicValue: 7.4 }
          ],
          territoryAnalysis: [
            { civilization: 'Terran Federation', systems: 234, area: 125.6, population: 12500000000, economicValue: 4560000000000 },
            { civilization: 'Vega Alliance', systems: 156, area: 78.5, population: 8900000000, economicValue: 2340000000000 },
            { civilization: 'Centauri Republic', systems: 89, area: 45.2, population: 5670000000, economicValue: 1230000000000 },
            { civilization: 'Andromeda Empire', systems: 67, area: 34.8, population: 3450000000, economicValue: 890000000000 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalaxyData();
  }, [fetchGalaxyData]);

  const renderMap = () => (
    <>
      {/* Interactive Galaxy Map - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🗺️ Interactive Galaxy Map</h3>
        <div style={{ 
          height: '600px', 
          backgroundColor: 'rgba(139, 92, 246, 0.1)', 
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%',
            border: '3px solid #8b5cf6',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.8)'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#f59e0b',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              Sol
            </div>
          </div>
          
          {/* Alpha Centauri */}
          <div style={{ 
            position: 'absolute',
            top: '45%',
            left: '60%',
            width: '16px',
            height: '16px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            border: '2px solid #8b5cf6',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#10b981',
              fontSize: '0.75rem'
            }}>
              Alpha Centauri
            </div>
          </div>

          {/* Vega */}
          <div style={{ 
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '18px',
            height: '18px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '2px solid #8b5cf6',
            boxShadow: '0 0 18px rgba(59, 130, 246, 0.7)'
          }}>
            <div style={{ 
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#3b82f6',
              fontSize: '0.75rem'
            }}>
              Vega
            </div>
          </div>

          {/* Navigation Routes */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="50%" y1="50%" x2="60%" y2="45%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
            <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
          </svg>

          <div style={{ 
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#8b5cf6',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem'
          }}>
            <div>🎯 Click on systems to view details</div>
            <div>🛤️ Blue lines show navigation routes</div>
            <div>⭐ System colors indicate type</div>
          </div>
        </div>
        
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('Zoom In')}>🔍 Zoom In</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Zoom Out')}>🔍 Zoom Out</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Reset View')}>🔄 Reset</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Full Screen')}>⛶ Full Screen</button>
        </div>
      </div>

      {/* Map Controls - Full panel width */}
      <div className="standard-panel space-theme" style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🎛️ Map Controls</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <select 
            className="standard-select space-theme"
            value={filterCivilization}
            onChange={(e) => setFilterCivilization(e.target.value)}
          >
            <option value="all">All Civilizations</option>
            <option value="terran">🌍 Terran Federation</option>
            <option value="vega">⭐ Vega Alliance</option>
            <option value="centauri">🏛️ Centauri Republic</option>
            <option value="andromeda">🌌 Andromeda Empire</option>
          </select>
          <select 
            className="standard-select space-theme"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="explored">🔍 Explored</option>
            <option value="unexplored">❓ Unexplored</option>
            <option value="colonized">🏠 Colonized</option>
            <option value="contested">⚔️ Contested</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderSystems = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel space-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>⭐ Star Systems</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('New System')}>⭐ New System</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Scan Systems')}>🔍 Scan</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Spectral Class</th>
                <th>Planets</th>
                <th>Civilization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galaxyData?.starSystems.map(system => (
                <tr key={system.id}>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{system.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatDistance(system.distanceFromCenter)} from center
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSystemTypeColor(system.type),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSystemTypeColor(system.type) + '20'
                    }}>
                      {system.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: getSpectralClassColor(system.spectralClass),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getSpectralClassColor(system.spectralClass) + '20'
                    }}>
                      {system.spectralClass}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: system.habitablePlanets > 0 ? '#10b981' : '#6b7280' }}>
                      {system.planets} ({system.habitablePlanets} habitable)
                    </span>
                  </td>
                  <td>{system.civilization}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(system.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(system.status) + '20'
                    }}>
                      {system.status}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn space-theme">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel space-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🛤️ Navigation Routes</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('New Route')}>🛤️ New Route</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Optimize Routes')}>⚡ Optimize</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Route Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Distance</th>
                <th>Travel Time</th>
                <th>Risk</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galaxyData?.navigationRoutes.map(route => (
                <tr key={route.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{route.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Traffic: {formatNumber(route.traffic)}
                      </div>
                    </div>
                  </td>
                  <td>{route.startSystem}</td>
                  <td>{route.endSystem}</td>
                  <td>{formatDistance(route.distance)}</td>
                  <td>{route.travelTime} hours</td>
                  <td>
                    <span style={{ 
                      color: getRiskColor(route.risk),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getRiskColor(route.risk) + '20'
                    }}>
                      {route.risk}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn space-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTerritories = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel space-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>🏛️ Territories</h3>
        <div className="standard-action-buttons">
          <button className="standard-btn space-theme" onClick={() => console.log('New Territory')}>🏛️ New Territory</button>
          <button className="standard-btn space-theme" onClick={() => console.log('Survey Territories')}>🔍 Survey</button>
        </div>
        <div className="standard-table-container">
          <table className="standard-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Civilization</th>
                <th>Systems</th>
                <th>Area</th>
                <th>Population</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {galaxyData?.territories.map(territory => (
                <tr key={territory.id}>
                  <td>
                    <div style={{ maxWidth: '250px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{territory.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Strategic: {territory.strategicImportance}/10
                      </div>
                    </div>
                  </td>
                  <td>{territory.civilization}</td>
                  <td>{territory.systems.length}</td>
                  <td>{formatDistance(territory.area)}²</td>
                  <td>{formatNumber(territory.population)}</td>
                  <td>
                    <span style={{ 
                      color: getStatusColor(territory.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: getStatusColor(territory.status) + '20'
                    }}>
                      {territory.status}
                    </span>
                  </td>
                  <td>
                    <button className="standard-btn space-theme">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="standard-panel space-theme table-panel">
        <h3 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>📊 Galaxy Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div className="chart-container">
            <LineChart
              data={galaxyData?.analytics.explorationTrends.map(trend => ({
                name: trend.date,
                'Systems Explored': trend.systemsExplored,
                'New Discoveries': trend.newDiscoveries,
                'Colonization Events': trend.colonizationEvents,
                'Route Establishments': trend.routeEstablishments
              })) || []}
              title="Exploration Trends"
              height={300}
              width={500}
              showTooltip={true}
            />
          </div>
          <div className="chart-container">
            <PieChart
              data={galaxyData?.analytics.systemDistribution.map(type => ({
                name: type.type,
                value: type.count
              })) || []}
              title="System Distribution by Type"
              size={250}
              showLegend={true}
            />
          </div>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#8b5cf6' }}>Territory Analysis</h4>
          <div className="standard-table-container">
            <table className="standard-data-table">
              <thead>
                <tr>
                  <th>Civilization</th>
                  <th>Systems</th>
                  <th>Area (ly²)</th>
                  <th>Population</th>
                  <th>Economic Value</th>
                </tr>
              </thead>
              <tbody>
                {galaxyData?.analytics.territoryAnalysis.map(territory => (
                  <tr key={territory.civilization}>
                    <td>{territory.civilization}</td>
                    <td>{territory.systems}</td>
                    <td>{territory.area}</td>
                    <td>{formatNumber(territory.population)}</td>
                    <td>{formatNumber(territory.economicValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      onRefresh={fetchGalaxyData}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as any)}
    >
      <div className="standard-screen-container space-theme">
        <div className="standard-dashboard">
          {!loading && !error && galaxyData ? (
            <>
              {activeTab === 'map' && renderMap()}
              {activeTab === 'systems' && renderSystems()}
              {activeTab === 'routes' && renderRoutes()}
              {activeTab === 'territories' && renderTerritories()}
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
              {loading ? 'Loading galaxy data...' : 'No galaxy data available'}
            </div>
          )}
        </div>
      </div>
    </BaseScreen>
  );
};

export default GalaxyMapScreen;
