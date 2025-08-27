import React, { useState, useEffect } from 'react';
import { Enhanced3DGalaxyMap } from '../Enhanced3DGalaxyMap';
import './Enhanced3DGalaxyMapScreen.css';

interface Enhanced3DGalaxyMapScreenProps {
  gameContext: any;
  onClose?: () => void;
  fullScreen?: boolean;
}

export const Enhanced3DGalaxyMapScreen: React.FC<Enhanced3DGalaxyMapScreenProps> = ({
  gameContext,
  onClose,
  fullScreen = true
}) => {
  const [isFullScreen, setIsFullScreen] = useState(fullScreen);
  const [playerCivilizationId, setPlayerCivilizationId] = useState('civilization_1');

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullScreen, onClose]);

  // Get player civilization from game context
  useEffect(() => {
    if (gameContext?.player?.civilizationId) {
      setPlayerCivilizationId(gameContext.player.civilizationId);
    }
  }, [gameContext]);

  return (
    <div className={`enhanced-3d-galaxy-map-screen ${isFullScreen ? 'fullscreen' : 'windowed'}`}>
      {/* Minimal Close Button - Always in top-right */}
      {onClose && (
        <button
          className="minimal-close-btn"
          onClick={onClose}
          title="Close map (ESC)"
        >
          ✕
        </button>
      )}

      {/* Enhanced 3D Galaxy Map */}
      <div className="map-container">
        <Enhanced3DGalaxyMap
          gameContext={gameContext}
          playerCivilizationId={playerCivilizationId}
          fullScreen={isFullScreen}
        />
      </div>

      {/* Instructions Overlay (only shown initially) */}
      <InstructionsOverlay />
    </div>
  );
};

// Instructions overlay component
const InstructionsOverlay: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  useEffect(() => {
    // Check if instructions have been shown before
    const hasShown = localStorage.getItem('galaxy-map-instructions-shown');
    if (hasShown) {
      setShowInstructions(false);
      setHasShownBefore(true);
    }
  }, []);

  const hideInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('galaxy-map-instructions-shown', 'true');
    setHasShownBefore(true);
  };

  if (!showInstructions) {
    return hasShownBefore ? (
      <button
        className="show-instructions-btn"
        onClick={() => setShowInstructions(true)}
        title="Show controls help"
      >
        ❓
      </button>
    ) : null;
  }

  return (
    <div className="instructions-overlay">
      <div className="instructions-panel">
        <div className="instructions-header">
          <h3>🎮 Galaxy Map Controls</h3>
          <button onClick={hideInstructions}>×</button>
        </div>
        <div className="instructions-content">
          <div className="control-section">
            <h4>🖱️ Mouse Controls</h4>
            <ul>
              <li><strong>Left Click + Drag:</strong> Pan camera</li>
              <li><strong>Right Click + Drag:</strong> Rotate view</li>
              <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
              <li><strong>Click Objects:</strong> Select systems/ships</li>
              <li><strong>Hover:</strong> View object details</li>
            </ul>
          </div>
          
          <div className="control-section">
            <h4>📊 Features</h4>
            <ul>
              <li><strong>Sensor Ranges:</strong> See your detection limits</li>
              <li><strong>Real-time Ships:</strong> Track fleet movements</li>
              <li><strong>Data Layers:</strong> Toggle different overlays</li>
              <li><strong>Ship Following:</strong> Camera tracks selected ships</li>
              <li><strong>3D Positioning:</strong> All overlays move with stars</li>
            </ul>
          </div>
          
          <div className="control-section">
            <h4>⌨️ Keyboard</h4>
            <ul>
              <li><strong>ESC:</strong> Exit full screen</li>
              <li><strong>Space:</strong> Center camera</li>
            </ul>
          </div>
        </div>
        <div className="instructions-footer">
          <button className="primary-btn" onClick={hideInstructions}>
            Got it! Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default Enhanced3DGalaxyMapScreen;
