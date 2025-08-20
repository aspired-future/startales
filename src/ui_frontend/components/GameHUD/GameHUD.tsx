import React, { useState, useEffect, useMemo } from 'react';
import { WitterFeed } from '../Witter/WitterFeed';
import { ExplorationDashboard } from '../Exploration/ExplorationDashboard';
import { CivilizationBrowser } from './CivilizationBrowser';
import { GalacticMap } from './GalacticMap';
import { CharacterInteraction } from './CharacterInteraction';
import { GameMasterPersonality } from '../../services/ContentGenerator';
import { GalacticCivilizationGenerator } from '../../services/GalacticCivilizationGenerator';
import { GalacticExplorationService } from '../../services/GalacticExplorationService';
import { PlayerInteractionService } from '../../services/PlayerInteractionService';
import { CivilizationLoreGenerator } from '../../services/CivilizationLoreGenerator';
import { useGameMasterPersonality } from '../../hooks/useGameMasterPersonality';
import './GameHUD.css';

interface GameHUDProps {
  playerId: string;
  gameContext: {
    currentLocation?: string;
    currentActivity?: string;
    recentEvents?: string[];
  };
}

interface HUDPanel {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  playerId,
  gameContext
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [hudPanels, setHudPanels] = useState<HUDPanel[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedCivilization, setSelectedCivilization] = useState<string | null>(null);
  const [gameInitialized, setGameInitialized] = useState(false);

  // Game Master personality for content generation
  const { personality, isLoading: personalityLoading } = useGameMasterPersonality();

  // Core game services
  const galacticCivilizationGenerator = useMemo(() => 
    personality ? new GalacticCivilizationGenerator(personality) : null, 
    [personality]
  );

  const playerInteractionService = useMemo(() => 
    personality ? new PlayerInteractionService(personality) : null, 
    [personality]
  );

  const galacticExplorationService = useMemo(() => 
    personality && galacticCivilizationGenerator && playerInteractionService 
      ? new GalacticExplorationService(personality, galacticCivilizationGenerator, playerInteractionService) 
      : null, 
    [personality, galacticCivilizationGenerator, playerInteractionService]
  );

  const civilizationLoreGenerator = useMemo(() => 
    personality ? new CivilizationLoreGenerator(personality) : null, 
    [personality]
  );

  // Initialize game systems
  useEffect(() => {
    const initializeGame = async () => {
      if (!personality || !galacticCivilizationGenerator || !galacticExplorationService || !playerInteractionService) {
        return;
      }

      console.log('🎮 Initializing Game Systems...');

      try {
        // Initialize player exploration (non-blocking)
        galacticExplorationService.initializePlayerExploration(playerId, 'sol_system').catch(err => {
          console.warn('⚠️ Player exploration init failed:', err);
        });
        
        // Initialize player interaction service (non-blocking)
        playerInteractionService.initializePlayer(playerId).catch(err => {
          console.warn('⚠️ Player interaction init failed:', err);
        });

        // Generate initial civilization lore in background (non-blocking)
        setTimeout(async () => {
          try {
            const civilizations = galacticCivilizationGenerator.getAllCivilizations();
            for (const civilization of civilizations.slice(0, 3)) { // Reduce to 3 for faster loading
              const race = galacticCivilizationGenerator.getRaceById(civilization.race);
              const territory = galacticCivilizationGenerator.getSystemsByRace(civilization.race);
              
              if (race && civilizationLoreGenerator) {
                await civilizationLoreGenerator.generateCivilizationLore(civilization, race, territory);
              }
            }
            console.log('✅ Background civilization lore generation completed');
          } catch (error) {
            console.warn('⚠️ Background lore generation failed:', error);
          }
        }, 100);

        // Set initialized immediately for demo purposes
        setGameInitialized(true);
        console.log('✅ Game Systems Initialized (Demo Mode)');
      } catch (error) {
        console.error('❌ Failed to initialize game systems:', error);
        // Still set initialized to true for demo
        setGameInitialized(true);
      }
    };

    if (!gameInitialized && !personalityLoading) {
      initializeGame();
    }
  }, [personality, personalityLoading, galacticCivilizationGenerator, galacticExplorationService, playerInteractionService, civilizationLoreGenerator, playerId, gameInitialized]);

  // Initialize HUD panels
  useEffect(() => {
    if (!gameInitialized) return;

    const defaultPanels: HUDPanel[] = [
      {
        id: 'witter',
        name: 'Witter Feed',
        icon: '📱',
        component: WitterFeed,
        isVisible: true,
        position: { x: 20, y: 20 },
        size: { width: 400, height: 600 },
        isMinimized: false
      },
      {
        id: 'exploration',
        name: 'Exploration',
        icon: '🚀',
        component: ExplorationDashboard,
        isVisible: false,
        position: { x: 440, y: 20 },
        size: { width: 800, height: 700 },
        isMinimized: false
      },
      {
        id: 'civilizations',
        name: 'Civilizations',
        icon: '🏛️',
        component: CivilizationBrowser,
        isVisible: false,
        position: { x: 100, y: 100 },
        size: { width: 900, height: 650 },
        isMinimized: false
      },
      {
        id: 'galactic_map',
        name: 'Galactic Map',
        icon: '🗺️',
        component: GalacticMap,
        isVisible: false,
        position: { x: 200, y: 50 },
        size: { width: 1000, height: 700 },
        isMinimized: false
      },
      {
        id: 'character_interaction',
        name: 'Character Interaction',
        icon: '👥',
        component: CharacterInteraction,
        isVisible: false,
        position: { x: 300, y: 150 },
        size: { width: 600, height: 500 },
        isMinimized: false
      }
    ];

    setHudPanels(defaultPanels);
  }, [gameInitialized]);

  const togglePanel = (panelId: string) => {
    setHudPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, isVisible: !panel.isVisible }
        : panel
    ));
  };

  const minimizePanel = (panelId: string) => {
    setHudPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, isMinimized: !panel.isMinimized }
        : panel
    ));
  };

  const closePanel = (panelId: string) => {
    setHudPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, isVisible: false }
        : panel
    ));
  };

  const updatePanelPosition = (panelId: string, position: { x: number; y: number }) => {
    setHudPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, position }
        : panel
    ));
  };

  const updatePanelSize = (panelId: string, size: { width: number; height: number }) => {
    setHudPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, size }
        : panel
    ));
  };

  console.log('🎮 GameHUD render state:', { personalityLoading, gameInitialized, personality: !!personality });

  if (personalityLoading || !gameInitialized) {
    console.log('🔄 GameHUD showing loading screen');
    return (
      <div className="game-hud-loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <h2>🌌 Initializing Galactic Systems</h2>
          <p>Generating civilizations, races, and star systems...</p>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎮 GameHUD rendering main interface');
  
  return (
    <div className="game-hud">
      {/* Main HUD Bar */}
      <div className="hud-bar">
        <div className="hud-bar-left">
          <div className="game-title">
            <h1>🌌 StarTales</h1>
            <span className="game-subtitle">Galactic Civilization Simulator</span>
          </div>
        </div>

        <div className="hud-bar-center">
          <div className="player-status">
            <span className="player-name">Commander {playerId}</span>
            <span className="current-location">📍 {gameContext.currentLocation || 'Sol System'}</span>
          </div>
        </div>

        <div className="hud-bar-right">
          <div className="hud-controls">
            {hudPanels.map(panel => (
              <button
                key={panel.id}
                className={`hud-control-btn ${panel.isVisible ? 'active' : ''}`}
                onClick={() => togglePanel(panel.id)}
                title={panel.name}
              >
                {panel.icon} {panel.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HUD Panels */}
      <div className="hud-panels">
        {hudPanels.map(panel => {
          if (!panel.isVisible) return null;

          const PanelComponent = panel.component;
          
          return (
            <div
              key={panel.id}
              className={`hud-panel ${panel.isMinimized ? 'minimized' : ''}`}
              style={{
                left: panel.position.x,
                top: panel.position.y,
                width: panel.isMinimized ? 'auto' : panel.size.width,
                height: panel.isMinimized ? 'auto' : panel.size.height
              }}
            >
              <div className="hud-panel-header">
                <div className="hud-panel-title">
                  {panel.icon} {panel.name}
                </div>
                <div className="hud-panel-controls">
                  <button
                    className="hud-panel-control"
                    onClick={() => minimizePanel(panel.id)}
                    title={panel.isMinimized ? 'Restore' : 'Minimize'}
                  >
                    {panel.isMinimized ? '🔼' : '🔽'}
                  </button>
                  <button
                    className="hud-panel-control"
                    onClick={() => closePanel(panel.id)}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {!panel.isMinimized && (
                <div className="hud-panel-content">
                  {panel.id === 'witter' && (
                    <PanelComponent
                      playerId={playerId}
                      gameContext={gameContext}
                      className="hud-witter-feed"
                    />
                  )}
                  
                  {panel.id === 'exploration' && galacticExplorationService && (
                    <PanelComponent
                      explorationService={galacticExplorationService}
                      playerId={playerId}
                      isVisible={true}
                      onClose={() => closePanel(panel.id)}
                    />
                  )}
                  
                  {panel.id === 'civilizations' && galacticCivilizationGenerator && civilizationLoreGenerator && (
                    <PanelComponent
                      civilizationGenerator={galacticCivilizationGenerator}
                      loreGenerator={civilizationLoreGenerator}
                      playerId={playerId}
                      onSelectCivilization={setSelectedCivilization}
                      onSelectCharacter={setSelectedCharacter}
                    />
                  )}
                  
                  {panel.id === 'galactic_map' && galacticCivilizationGenerator && (
                    <PanelComponent
                      civilizationGenerator={galacticCivilizationGenerator}
                      playerId={playerId}
                      currentLocation={gameContext.currentLocation}
                      onLocationSelect={(location: string) => console.log('Navigate to:', location)}
                      onSystemSelect={(systemId: string) => console.log('Select system:', systemId)}
                    />
                  )}
                  
                  {panel.id === 'character_interaction' && selectedCharacter && civilizationLoreGenerator && (
                    <PanelComponent
                      characterId={selectedCharacter}
                      loreGenerator={civilizationLoreGenerator}
                      playerId={playerId}
                      onClose={() => setSelectedCharacter(null)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Game Status Bar */}
      <div className="game-status-bar">
        <div className="status-left">
          <span className="status-item">
            🌟 Exploration Level: {galacticExplorationService?.getPlayerExplorationState(playerId)?.explorationLevel || 1}
          </span>
          <span className="status-item">
            🔬 Discoveries: {galacticExplorationService?.getPlayerExplorationState(playerId)?.explorationHistory.length || 0}
          </span>
          <span className="status-item">
            👥 Known Races: {galacticExplorationService?.getPlayerExplorationState(playerId)?.discoveredRaces.size || 0}
          </span>
        </div>

        <div className="status-center">
          <span className="status-item">
            ⚡ Systems Online: {gameInitialized ? 'All Systems Operational' : 'Initializing...'}
          </span>
        </div>

        <div className="status-right">
          <span className="status-item">
            🌌 Galaxy: {galacticCivilizationGenerator?.getGalaxyStats().totalSystems || 0} Systems
          </span>
          <span className="status-item">
            🏛️ Civilizations: {galacticCivilizationGenerator?.getGalaxyStats().totalCivilizations || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
