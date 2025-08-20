import React, { useState, useEffect } from 'react';
import { GalacticCivilizationGenerator } from '../../services/GalacticCivilizationGenerator';
import './GalacticMap.css';

interface GalacticMapProps {
  civilizationGenerator: GalacticCivilizationGenerator;
  playerId: string;
  currentLocation?: string;
  onLocationSelect?: (location: string) => void;
  onSystemSelect?: (systemId: string) => void;
}

export const GalacticMap: React.FC<GalacticMapProps> = ({
  civilizationGenerator,
  playerId,
  currentLocation,
  onLocationSelect,
  onSystemSelect
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewCenter, setViewCenter] = useState({ x: 0, y: 0 });

  const systems = civilizationGenerator.getAllSystems();
  const civilizations = civilizationGenerator.getAllCivilizations();

  const handleSystemClick = (systemId: string) => {
    setSelectedSystem(systemId);
    onSystemSelect?.(systemId);
  };

  const getSystemColor = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (!system) return '#666';
    
    const civCount = civilizations.filter(civ => civ.territory.includes(systemId)).length;
    if (civCount === 0) return '#4a5568'; // Uninhabited
    if (civCount === 1) return '#4ecdc4'; // Single civilization
    return '#f1c40f'; // Multiple civilizations
  };

  return (
    <div className="galactic-map">
      <div className="map-header">
        <h2>🗺️ Galactic Map</h2>
        <div className="map-controls">
          <button 
            className="zoom-btn"
            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
          >
            🔍+
          </button>
          <span className="zoom-level">Zoom: {zoomLevel.toFixed(1)}x</span>
          <button 
            className="zoom-btn"
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
          >
            🔍-
          </button>
          <button 
            className="center-btn"
            onClick={() => setViewCenter({ x: 0, y: 0 })}
          >
            🎯 Center
          </button>
        </div>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4a5568' }}></div>
          <span>Uninhabited Systems</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#4ecdc4' }}></div>
          <span>Single Civilization</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f1c40f' }}></div>
          <span>Multiple Civilizations</span>
        </div>
        <div className="legend-item">
          <div className="legend-color current-location"></div>
          <span>Current Location</span>
        </div>
      </div>

      <div className="map-viewport">
        <div 
          className="star-field"
          style={{
            transform: `scale(${zoomLevel}) translate(${viewCenter.x}px, ${viewCenter.y}px)`
          }}
        >
          {/* Background stars */}
          {Array.from({ length: 200 }, (_, i) => (
            <div
              key={`star-${i}`}
              className="background-star"
              style={{
                left: `${Math.random() * 2000}px`,
                top: `${Math.random() * 1500}px`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}

          {/* Star systems */}
          {systems.slice(0, 50).map((system, index) => {
            const x = (index % 10) * 180 + 100;
            const y = Math.floor(index / 10) * 150 + 100;
            const isSelected = selectedSystem === system.id;
            const isCurrent = currentLocation?.includes(system.name);
            const civs = civilizations.filter(civ => civ.territory.includes(system.id));

            return (
              <div
                key={system.id}
                className={`star-system ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  backgroundColor: getSystemColor(system.id)
                }}
                onClick={() => handleSystemClick(system.id)}
              >
                <div className="system-glow"></div>
                <div className="system-name">{system.name}</div>
                <div className="system-info">
                  <div className="system-type">{system.starType}</div>
                  <div className="planet-count">{system.planets.length} planets</div>
                  {civs.length > 0 && (
                    <div className="civilization-count">{civs.length} civilization{civs.length > 1 ? 's' : ''}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Trade routes */}
          {civilizations.slice(0, 10).map(civ => 
            civ.territory.slice(0, 3).map((systemId, index) => {
              if (index === 0) return null;
              const prevSystemIndex = systems.findIndex(s => s.id === civ.territory[index - 1]);
              const currentSystemIndex = systems.findIndex(s => s.id === systemId);
              
              if (prevSystemIndex === -1 || currentSystemIndex === -1) return null;

              const x1 = (prevSystemIndex % 10) * 180 + 100;
              const y1 = Math.floor(prevSystemIndex / 10) * 150 + 100;
              const x2 = (currentSystemIndex % 10) * 180 + 100;
              const y2 = Math.floor(currentSystemIndex / 10) * 150 + 100;

              const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

              return (
                <div
                  key={`route-${civ.id}-${index}`}
                  className="trade-route"
                  style={{
                    left: `${x1}px`,
                    top: `${y1}px`,
                    width: `${length}px`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '0 50%'
                  }}
                />
              );
            })
          )}
        </div>
      </div>

      {selectedSystem && (
        <div className="system-details">
          <div className="details-header">
            <h3>{systems.find(s => s.id === selectedSystem)?.name}</h3>
            <button 
              className="close-details"
              onClick={() => setSelectedSystem(null)}
            >
              ✕
            </button>
          </div>
          <div className="details-content">
            {(() => {
              const system = systems.find(s => s.id === selectedSystem);
              const systemCivs = civilizations.filter(civ => civ.territory.includes(selectedSystem!));
              
              if (!system) return null;

              return (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Star Type:</span>
                    <span className="detail-value">{system.starType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Planets:</span>
                    <span className="detail-value">{system.planets.length}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{system.age.toFixed(1)} billion years</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Civilizations:</span>
                    <span className="detail-value">{systemCivs.length}</span>
                  </div>
                  
                  {systemCivs.length > 0 && (
                    <div className="civilizations-list">
                      <h4>Civilizations:</h4>
                      {systemCivs.map(civ => (
                        <div key={civ.id} className="civilization-item">
                          <span className="civ-name">{civ.name}</span>
                          <span className="civ-type">{civ.type.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="action-buttons">
                    <button 
                      className="navigate-btn"
                      onClick={() => onLocationSelect?.(system.name)}
                    >
                      🚀 Navigate Here
                    </button>
                    <button 
                      className="explore-btn"
                      onClick={() => console.log('Explore system:', system.id)}
                    >
                      🔍 Explore System
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalacticMap;
