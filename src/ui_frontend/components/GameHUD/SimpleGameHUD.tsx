import React from 'react';
import './GameHUD.css';

interface SimpleGameHUDProps {
  playerId: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
}

export const SimpleGameHUD: React.FC<SimpleGameHUDProps> = ({ playerId, gameContext }) => {
  console.log('🎮 SimpleGameHUD rendering for player:', playerId);

  return (
    <div className="game-hud">
      {/* Main HUD Bar */}
      <div className="hud-bar">
        <div className="hud-bar-left">
          <div className="game-title">
            <h1>🌌 StarTales</h1>
            <span className="subtitle">Galactic Civilization Demo</span>
          </div>
        </div>
        
        <div className="hud-bar-center">
          <div className="location-info">
            <span className="location-label">📍 Location:</span>
            <span className="location-value">{gameContext.currentLocation || 'Unknown'}</span>
          </div>
        </div>
        
        <div className="hud-bar-right">
          <div className="player-info">
            <span className="player-name">👤 {playerId}</span>
            <span className="activity">🎯 {gameContext.currentActivity || 'Idle'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="hud-content">
        <div className="demo-panels">
          <div className="demo-panel">
            <h3>🌌 Witter Feed</h3>
            <p>Social network for galactic civilizations</p>
            <div className="demo-content">
              <div className="demo-post">
                <strong>Dr. Zara Chen:</strong> Fascinating xenobiology discoveries! 🧬
              </div>
              <div className="demo-post">
                <strong>Captain Kex:</strong> Trade negotiations successful! 🚀
              </div>
              <div className="demo-post">
                <strong>Ambassador Aria:</strong> Diplomatic meeting productive! 🌟
              </div>
            </div>
          </div>

          <div className="demo-panel">
            <h3>🏛️ Civilizations</h3>
            <p>Explore galactic civilizations</p>
            <div className="demo-content">
              <div className="civilization-item">🌍 Terran Federation - 12.5B population</div>
              <div className="civilization-item">🧠 Zephyrian Collective - 8.9B population</div>
              <div className="civilization-item">🎨 Vegan Republic - 6.2B population</div>
              <div className="civilization-item">⚔️ Sirian Empire - 15.6B population</div>
            </div>
          </div>

          <div className="demo-panel">
            <h3>🚀 Exploration</h3>
            <p>Discover new worlds and races</p>
            <div className="demo-content">
              <div className="exploration-stat">🌟 Discovery Points: 1,250</div>
              <div className="exploration-stat">🌌 Known Systems: 12</div>
              <div className="exploration-stat">👽 Known Races: 5</div>
              <div className="exploration-stat">🚀 Active Expeditions: 2</div>
            </div>
          </div>

          <div className="demo-panel">
            <h3>🗺️ Galactic Map</h3>
            <p>Navigate the galaxy</p>
            <div className="demo-content">
              <div className="map-placeholder">
                <div className="star-system">☀️ Sol System</div>
                <div className="star-system">⭐ Alpha Centauri</div>
                <div className="star-system">✨ Vega System</div>
                <div className="star-system">🌟 Sirius System</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item">
            🎮 Player: {playerId}
          </span>
          <span className="status-item">
            📅 Stardate: 2387.156
          </span>
        </div>
        
        <div className="status-center">
          <span className="status-item">
            ⚡ Systems Online: All Systems Operational
          </span>
        </div>
        
        <div className="status-right">
          <span className="status-item">
            🌌 Galaxy: 5 Systems
          </span>
          <span className="status-item">
            🏛️ Civilizations: 4
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleGameHUD;
