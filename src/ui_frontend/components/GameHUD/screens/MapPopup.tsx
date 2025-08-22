import React from 'react';
import { PopupBase, PopupProps } from './PopupBase';
import { GalaxyMapComponent } from '../GalaxyMapComponent';

interface MapPopupProps extends PopupProps {
  playerId: string;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  playerId,
  onClose,
  isVisible
}) => {
  return (
    <PopupBase
      title="Galaxy Map"
      icon="🗺️"
      onClose={onClose}
      isVisible={isVisible}
      size="fullscreen"
    >
      <div className="map-popup-content">
        <div className="map-header">
          <h3>🌌 Galactic Overview</h3>
          <p>Explore the galaxy, manage territories, and plan strategic operations.</p>
        </div>
        
        <div className="map-container">
          <GalaxyMapComponent gameContext={{
            currentLocation: 'Sol System',
            currentActivity: 'Managing Galactic Civilization',
            recentEvents: ['Galaxy map accessed', 'Strategic planning initiated']
          }} />
        </div>
        
        <div className="map-controls">
          <div className="map-control-group">
            <h4>🔍 View Options</h4>
            <button className="panel-btn secondary">Political</button>
            <button className="panel-btn secondary">Economic</button>
            <button className="panel-btn secondary">Military</button>
            <button className="panel-btn secondary">Trade Routes</button>
          </div>
          
          <div className="map-control-group">
            <h4>⚙️ Tools</h4>
            <button className="panel-btn">📍 Set Waypoint</button>
            <button className="panel-btn">🚀 Plan Mission</button>
            <button className="panel-btn">📊 Analyze Region</button>
          </div>
          
          <div className="map-control-group">
            <h4>📡 Intelligence</h4>
            <button className="panel-btn secondary">🕵️ Scan Sector</button>
            <button className="panel-btn secondary">📈 Trade Analysis</button>
            <button className="panel-btn secondary">⚔️ Threat Assessment</button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .map-popup-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .map-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(78, 205, 196, 0.3);
        }
        
        .map-header h3 {
          color: #4ecdc4;
          font-size: 20px;
          margin: 0 0 8px 0;
        }
        
        .map-header p {
          color: #ccc;
          font-size: 14px;
          margin: 0;
        }
        
        .map-container {
          flex: 1;
          min-height: 0;
          margin-bottom: 20px;
          border: 1px solid rgba(78, 205, 196, 0.3);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .map-controls {
          display: flex;
          gap: 30px;
          padding-top: 15px;
          border-top: 1px solid rgba(78, 205, 196, 0.3);
        }
        
        .map-control-group {
          flex: 1;
        }
        
        .map-control-group h4 {
          color: #4ecdc4;
          font-size: 14px;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .map-control-group .panel-btn {
          margin-right: 8px;
          margin-bottom: 8px;
          font-size: 12px;
          padding: 8px 16px;
        }
        
        @media (max-width: 1024px) {
          .map-controls {
            flex-direction: column;
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .map-control-group .panel-btn {
            width: 100%;
            margin-right: 0;
          }
        }
      `}</style>
    </PopupBase>
  );
};

export default MapPopup;

