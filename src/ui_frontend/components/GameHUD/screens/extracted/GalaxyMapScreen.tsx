import React, { useState, useEffect } from 'react';
import './GalaxyMapScreen.css';
import { GalaxyMapComponent } from '../../GalaxyMapComponent';

interface GalaxyStats {
  totalSystems: number;
  exploredSystems: number;
  colonizedSystems: number;
  civilizations: number;
  tradeRoutes: number;
  conflicts: number;
}

interface ScreenProps {
  screenId: string;
  title: string;
  icon: string;
  gameContext?: any;
}

const GalaxyMapScreen: React.FC<ScreenProps> = ({ 
  screenId, 
  title, 
  icon, 
  gameContext 
}) => {
  const [galaxyStats, setGalaxyStats] = useState<GalaxyStats>({
    totalSystems: 0,
    exploredSystems: 0,
    colonizedSystems: 0,
    civilizations: 0,
    tradeRoutes: 0,
    conflicts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalaxyStats = async () => {
      try {
        setLoading(true);
        // Fetch from working galaxy API endpoints
        const [mapResponse, territoriesResponse] = await Promise.all([
          fetch('/api/galaxy/map?campaignId=1&includeUnexplored=true'),
          fetch('/api/galaxy/territories?campaignId=1')
        ]);
        
        if (!mapResponse.ok || !territoriesResponse.ok) {
          throw new Error('API not available');
        }
        
        const [mapData, territoriesData] = await Promise.all([
          mapResponse.json(),
          territoriesResponse.json()
        ]);
        
        if (mapData.success && territoriesData.success) {
          // Calculate stats from real data
          const totalSystems = mapData.data.sectors.reduce((sum: number, sector: any) => sum + sector.starSystems.length, 0);
          const exploredSystems = mapData.data.sectors.reduce((sum: number, sector: any) => 
            sum + sector.starSystems.filter((sys: any) => sys.explored).length, 0);
          const controlledSystems = mapData.data.sectors.reduce((sum: number, sector: any) => 
            sum + sector.starSystems.filter((sys: any) => sys.controlledBy).length, 0);
          
          setGalaxyStats({
            totalSystems,
            exploredSystems,
            colonizedSystems: controlledSystems,
            civilizations: territoriesData.data.civilizations.length,
            tradeRoutes: 47, // Mock for now, needs dedicated API
            conflicts: territoriesData.data.disputes.length
          });
        }
      } catch (err) {
        console.warn('Galaxy API not available, using mock data');
        // Use mock data fallback
        setGalaxyStats({
          totalSystems: 1247,
          exploredSystems: 892,
          colonizedSystems: 234,
          civilizations: 12,
          tradeRoutes: 47,
          conflicts: 8
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalaxyStats();
  }, []);

  const handleAction = (action: string, context?: any) => {
    console.log(`Galaxy Map Action: ${action}`, context);
    alert(`Galaxy Map System: ${action}\n\nThis would ${action.toLowerCase()} in the full implementation.\n\nContext: ${JSON.stringify(context, null, 2)}`);
  };

  return (
    <div className="galaxy-map-screen">
      <div className="map-tab">
        <div className="map-header">
          <h2>🗺️ Interactive Galaxy Map</h2>
          <p>Explore star systems, civilizations, and trade routes across the galaxy</p>
        </div>
        
        <div className="map-controls">
          <div className="control-group">
            <label>Layer:</label>
            <select defaultValue="political">
              <option value="political">Political Boundaries</option>
              <option value="trade">Trade Routes</option>
              <option value="resources">Resource Distribution</option>
              <option value="security">Security Status</option>
              <option value="exploration">Exploration Progress</option>
            </select>
          </div>
          <div className="control-group">
            <label>Filter:</label>
            <select defaultValue="all">
              <option value="all">All Systems</option>
              <option value="colonized">Colonized Only</option>
              <option value="unexplored">Unexplored</option>
              <option value="hostile">Hostile Territory</option>
              <option value="friendly">Allied Systems</option>
            </select>
          </div>
          <div className="control-actions">
            <button className="btn" onClick={() => handleAction('Center View')}>
              🎯 Center
            </button>
            <button className="btn secondary" onClick={() => handleAction('Reset Zoom')}>
              🔍 Reset
            </button>
          </div>
        </div>

        <div className="embedded-galaxy-map">
          <GalaxyMapComponent gameContext={gameContext} />
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>Allied Systems</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF9800' }}></div>
            <span>Neutral Territory</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#F44336' }}></div>
            <span>Hostile Systems</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#9E9E9E' }}></div>
            <span>Unexplored</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyMapScreen;