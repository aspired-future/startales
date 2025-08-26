import React, { useState, useEffect, useCallback } from 'react';
import './GameLobby.css';

interface GameConfiguration {
  id: string;
  name: string;
  description: string;
  theme: 'space_opera' | 'cyberpunk' | 'fantasy' | 'post_apocalyptic' | 'steampunk' | 'modern_politics';
  maxPlayers: number;
  currentPlayers: number;
  storyComplexity: 'simple' | 'moderate' | 'complex' | 'epic';
  gameMode: 'cooperative' | 'competitive' | 'mixed';
  duration: 'short' | 'medium' | 'long' | 'campaign';
  status: 'setup' | 'waiting_for_players' | 'active' | 'paused' | 'completed';
  storyInitialized: boolean;
}

interface PlayerSlot {
  slotId: number;
  playerId?: string;
  playerName?: string;
  civilizationId?: number;
  role: 'host' | 'player' | 'observer';
  joinedAt?: Date;
  isReady: boolean;
}

interface GameLobbyProps {
  playerId: string;
  playerName: string;
  onGameStart: (gameId: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ playerId, playerName, onGameStart }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'lobby'>('browse');
  const [availableGames, setAvailableGames] = useState<GameConfiguration[]>([]);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create game form state
  const [newGameConfig, setNewGameConfig] = useState({
    name: '',
    description: '',
    theme: 'space_opera' as const,
    maxPlayers: 4,
    storyComplexity: 'moderate' as const,
    gameMode: 'cooperative' as const,
    duration: 'medium' as const
  });

  useEffect(() => {
    fetchAvailableGames();
    const interval = setInterval(fetchAvailableGames, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAvailableGames = useCallback(async () => {
    try {
      const response = await fetch('/api/game/list');
      if (response.ok) {
        const data = await response.json();
        setAvailableGames(data.games || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  }, []);

  const createGame = async () => {
    if (!newGameConfig.name.trim()) {
      setError('Game name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostPlayerId: playerId,
          gameConfig: newGameConfig
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
        setActiveTab('lobby');
        await fetchAvailableGames();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create game');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error creating game:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/game/${gameId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          playerName
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
        setActiveTab('lobby');
        await fetchAvailableGames();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to join game');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error joining game:', error);
    } finally {
      setLoading(false);
    }
  };

  const setReady = async (ready: boolean) => {
    if (!currentGame) return;

    try {
      const response = await fetch(`/api/game/${currentGame.id}/ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          ready
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentGame(data.game);
      }
    } catch (error) {
      console.error('Error setting ready status:', error);
    }
  };

  const startGame = async () => {
    if (!currentGame) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/game/${currentGame.id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        onGameStart(currentGame.id);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to start game');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error starting game:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'space_opera': return '🌌';
      case 'cyberpunk': return '🤖';
      case 'fantasy': return '🧙';
      case 'post_apocalyptic': return '☢️';
      case 'steampunk': return '⚙️';
      case 'modern_politics': return '🏛️';
      default: return '🎮';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return '#4ecdc4';
      case 'moderate': return '#ffa726';
      case 'complex': return '#ff6b6b';
      case 'epic': return '#ab47bc';
      default: return '#888888';
    }
  };

  const renderBrowseGames = () => (
    <div className="browse-games">
      <div className="games-header">
        <h3>🌟 Available Games</h3>
        <button className="refresh-btn" onClick={fetchAvailableGames}>
          🔄 Refresh
        </button>
      </div>

      {availableGames.length === 0 ? (
        <div className="no-games">
          <div className="empty-state">
            <h4>🎮 No Games Available</h4>
            <p>Be the first to create an epic galactic adventure!</p>
            <button className="create-game-btn" onClick={() => setActiveTab('create')}>
              ➕ Create New Game
            </button>
          </div>
        </div>
      ) : (
        <div className="games-list">
          {availableGames.map(game => (
            <div key={game.id} className="game-card">
              <div className="game-header">
                <div className="game-title">
                  <span className="theme-icon">{getThemeIcon(game.theme)}</span>
                  <span className="game-name">{game.name}</span>
                  {game.storyInitialized && (
                    <span className="story-badge">📖 Story Ready</span>
                  )}
                </div>
                <div className="game-meta">
                  <span className="players-count">
                    {game.currentPlayers}/{game.maxPlayers} Players
                  </span>
                  <span 
                    className="complexity-badge"
                    style={{ backgroundColor: getComplexityColor(game.storyComplexity) }}
                  >
                    {game.storyComplexity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="game-description">
                {game.description}
              </div>

              <div className="game-details">
                <div className="detail-item">
                  <span className="detail-label">Theme:</span>
                  <span className="detail-value">{game.theme.replace('_', ' ')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mode:</span>
                  <span className="detail-value">{game.gameMode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{game.duration}</span>
                </div>
              </div>

              <div className="game-actions">
                <button 
                  className="join-btn"
                  onClick={() => joinGame(game.id)}
                  disabled={loading || game.currentPlayers >= game.maxPlayers}
                >
                  {game.currentPlayers >= game.maxPlayers ? '🔒 Full' : '🚀 Join Game'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateGame = () => (
    <div className="create-game">
      <h3>🎮 Create New Game</h3>
      
      <div className="create-form">
        <div className="form-group">
          <label>Game Name</label>
          <input
            type="text"
            value={newGameConfig.name}
            onChange={(e) => setNewGameConfig({...newGameConfig, name: e.target.value})}
            placeholder="Enter an epic game name..."
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newGameConfig.description}
            onChange={(e) => setNewGameConfig({...newGameConfig, description: e.target.value})}
            placeholder="Describe your galactic adventure..."
            maxLength={200}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Theme</label>
            <select
              value={newGameConfig.theme}
              onChange={(e) => setNewGameConfig({...newGameConfig, theme: e.target.value as any})}
            >
              <option value="space_opera">🌌 Space Opera</option>
              <option value="cyberpunk">🤖 Cyberpunk</option>
              <option value="fantasy">🧙 Fantasy</option>
              <option value="post_apocalyptic">☢️ Post-Apocalyptic</option>
              <option value="steampunk">⚙️ Steampunk</option>
              <option value="modern_politics">🏛️ Modern Politics</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Players</label>
            <select
              value={newGameConfig.maxPlayers}
              onChange={(e) => setNewGameConfig({...newGameConfig, maxPlayers: parseInt(e.target.value)})}
            >
              <option value={2}>2 Players</option>
              <option value={3}>3 Players</option>
              <option value={4}>4 Players</option>
              <option value={6}>6 Players</option>
              <option value={8}>8 Players</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Story Complexity</label>
            <select
              value={newGameConfig.storyComplexity}
              onChange={(e) => setNewGameConfig({...newGameConfig, storyComplexity: e.target.value as any})}
            >
              <option value="simple">Simple - Straightforward adventure</option>
              <option value="moderate">Moderate - Engaging with twists</option>
              <option value="complex">Complex - Deep narrative</option>
              <option value="epic">Epic - Maximum drama and depth</option>
            </select>
          </div>

          <div className="form-group">
            <label>Game Mode</label>
            <select
              value={newGameConfig.gameMode}
              onChange={(e) => setNewGameConfig({...newGameConfig, gameMode: e.target.value as any})}
            >
              <option value="cooperative">Cooperative - Work together</option>
              <option value="competitive">Competitive - Compete for victory</option>
              <option value="mixed">Mixed - Both cooperation and competition</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Expected Duration</label>
          <select
            value={newGameConfig.duration}
            onChange={(e) => setNewGameConfig({...newGameConfig, duration: e.target.value as any})}
          >
            <option value="short">Short (1-3 hours)</option>
            <option value="medium">Medium (3-6 hours)</option>
            <option value="long">Long (6+ hours)</option>
            <option value="campaign">Campaign (Multiple sessions)</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            className="create-btn"
            onClick={createGame}
            disabled={loading || !newGameConfig.name.trim()}
          >
            {loading ? '🔄 Creating...' : '🚀 Create & Initialize Story'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderGameLobby = () => {
    if (!currentGame) return null;

    const playerSlot = currentGame.playerSlots?.find((slot: PlayerSlot) => slot.playerId === playerId);
    const isHost = playerSlot?.role === 'host';
    const allReady = currentGame.playerSlots?.filter((slot: PlayerSlot) => slot.playerId).every((slot: PlayerSlot) => slot.isReady);

    return (
      <div className="game-lobby">
        <div className="lobby-header">
          <h3>🎮 {currentGame.name}</h3>
          <div className="lobby-status">
            {currentGame.storyInitialized ? (
              <span className="story-ready">📖 Story Initialized</span>
            ) : (
              <span className="story-loading">⏳ Initializing Story...</span>
            )}
          </div>
        </div>

        <div className="lobby-content">
          <div className="game-info">
            <p>{currentGame.description}</p>
            <div className="game-settings">
              <span>Theme: {getThemeIcon(currentGame.theme)} {currentGame.theme.replace('_', ' ')}</span>
              <span>Complexity: {currentGame.storyComplexity}</span>
              <span>Mode: {currentGame.gameMode}</span>
              <span>Duration: {currentGame.duration}</span>
            </div>
          </div>

          <div className="players-section">
            <h4>👥 Players ({currentGame.playerSlots?.filter((slot: PlayerSlot) => slot.playerId).length}/{currentGame.maxPlayers})</h4>
            <div className="players-list">
              {currentGame.playerSlots?.map((slot: PlayerSlot) => (
                <div key={slot.slotId} className={`player-slot ${slot.playerId ? 'occupied' : 'empty'}`}>
                  <div className="slot-info">
                    <span className="slot-number">#{slot.slotId}</span>
                    {slot.playerId ? (
                      <>
                        <span className="player-name">{slot.playerName}</span>
                        <span className="player-role">{slot.role}</span>
                        <span className={`ready-status ${slot.isReady ? 'ready' : 'not-ready'}`}>
                          {slot.isReady ? '✅ Ready' : '⏳ Not Ready'}
                        </span>
                      </>
                    ) : (
                      <span className="empty-slot">Waiting for player...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lobby-actions">
            {playerSlot && (
              <button 
                className={`ready-btn ${playerSlot.isReady ? 'ready' : 'not-ready'}`}
                onClick={() => setReady(!playerSlot.isReady)}
              >
                {playerSlot.isReady ? '✅ Ready' : '⏳ Mark Ready'}
              </button>
            )}

            {isHost && (
              <button 
                className="start-btn"
                onClick={startGame}
                disabled={!allReady || !currentGame.storyInitialized || loading}
              >
                {loading ? '🔄 Starting...' : 
                 !currentGame.storyInitialized ? '⏳ Story Loading...' :
                 !allReady ? '⏳ Waiting for Players...' : 
                 '🚀 Start Game'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-lobby-container">
      <div className="lobby-header-main">
        <h2>🌌 Galactic Game Lobby</h2>
        <div className="player-info">
          Welcome, <strong>{playerName}</strong>
        </div>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 Browse Games
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create Game
        </button>
        {currentGame && (
          <button 
            className={`tab-btn ${activeTab === 'lobby' ? 'active' : ''}`}
            onClick={() => setActiveTab('lobby')}
          >
            🎮 Game Lobby
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'browse' && renderBrowseGames()}
        {activeTab === 'create' && renderCreateGame()}
        {activeTab === 'lobby' && renderGameLobby()}
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default GameLobby;
