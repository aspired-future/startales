import React, { useState } from 'react';
import { PopupBase, PopupProps } from './PopupBase';

interface SettingsPopupProps extends PopupProps {
  playerId: string;
  onNewGame: () => void;
}

export const SettingsPopup: React.FC<SettingsPopupProps> = ({
  playerId,
  onClose,
  isVisible,
  onNewGame
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'game' | 'audio' | 'graphics'>('general');

  const handleNewGame = () => {
    onNewGame();
    onClose();
  };

  return (
    <PopupBase
      title="Settings"
      icon="⚙️"
      onClose={onClose}
      isVisible={isVisible}
      size="large"
    >
      <div className="settings-popup-content">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            🔧 General
          </button>
          <button 
            className={`settings-tab ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            🎮 Game
          </button>
          <button 
            className={`settings-tab ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            🔊 Audio
          </button>
          <button 
            className={`settings-tab ${activeTab === 'graphics' ? 'active' : ''}`}
            onClick={() => setActiveTab('graphics')}
          >
            🎨 Graphics
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>🔧 General Settings</h3>
              
              <div className="setting-item">
                <label>Language</label>
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Theme</label>
                <select defaultValue="dark">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Show tooltips
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Enable notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === 'game' && (
            <div className="settings-section">
              <h3>🎮 Game Settings</h3>
              
              <div className="setting-item">
                <button 
                  className="panel-btn"
                  onClick={handleNewGame}
                >
                  🆕 Start New Game
                </button>
                <p className="setting-description">
                  Launch the Game Setup Wizard to create a new galactic civilization
                </p>
              </div>

              <div className="setting-item">
                <label>Game Speed</label>
                <select defaultValue="normal">
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                  <option value="blitz">Blitz</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Difficulty</label>
                <select defaultValue="normal">
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Auto-save enabled
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Pause on alerts
                </label>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="settings-section">
              <h3>🔊 Audio Settings</h3>
              
              <div className="setting-item">
                <label>Master Volume</label>
                <input type="range" min="0" max="100" defaultValue="75" />
                <span>75%</span>
              </div>

              <div className="setting-item">
                <label>Music Volume</label>
                <input type="range" min="0" max="100" defaultValue="60" />
                <span>60%</span>
              </div>

              <div className="setting-item">
                <label>Sound Effects</label>
                <input type="range" min="0" max="100" defaultValue="80" />
                <span>80%</span>
              </div>

              <div className="setting-item">
                <label>Voice Volume</label>
                <input type="range" min="0" max="100" defaultValue="90" />
                <span>90%</span>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Enable ambient sounds
                </label>
              </div>
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="settings-section">
              <h3>🎨 Graphics Settings</h3>
              
              <div className="setting-item">
                <label>Graphics Quality</label>
                <select defaultValue="high">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Animation Speed</label>
                <select defaultValue="normal">
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                  <option value="instant">Instant</option>
                </select>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Enable particle effects
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Show background animations
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Reduce motion (accessibility)
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .settings-popup-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .settings-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(78, 205, 196, 0.3);
          padding-bottom: 15px;
        }
        
        .settings-tab {
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(78, 205, 196, 0.3);
          color: #b8bcc8;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .settings-tab:hover {
          background: rgba(78, 205, 196, 0.1);
          border-color: #4ecdc4;
          color: #4ecdc4;
        }
        
        .settings-tab.active {
          background: rgba(78, 205, 196, 0.2);
          border-color: #4ecdc4;
          color: #4ecdc4;
          box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
        }
        
        .settings-content {
          flex: 1;
          overflow-y: auto;
        }
        
        .settings-section h3 {
          color: #4ecdc4;
          font-size: 18px;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .setting-item {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(26, 26, 46, 0.6);
          border: 1px solid rgba(78, 205, 196, 0.2);
          border-radius: 8px;
        }
        
        .setting-item label {
          display: block;
          color: #4ecdc4;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .setting-item select,
        .setting-item input[type="range"] {
          width: 100%;
          background: rgba(15, 15, 35, 0.9);
          border: 1px solid rgba(78, 205, 196, 0.3);
          color: #4ecdc4;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .setting-item select:focus,
        .setting-item input:focus {
          outline: none;
          border-color: #4ecdc4;
          box-shadow: 0 0 8px rgba(78, 205, 196, 0.3);
        }
        
        .setting-item input[type="checkbox"] {
          width: auto;
          margin-right: 8px;
          accent-color: #4ecdc4;
        }
        
        .setting-item input[type="range"] {
          margin-right: 10px;
        }
        
        .setting-item span {
          color: #b8bcc8;
          font-size: 12px;
        }
        
        .setting-description {
          color: #b8bcc8;
          font-size: 12px;
          margin-top: 8px;
          font-style: italic;
        }
        
        .panel-btn {
          background: linear-gradient(135deg, #4ecdc4 0%, #45b7aa 100%);
          border: none;
          color: #0f0f23;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .panel-btn:hover {
          background: linear-gradient(135deg, #45b7aa 0%, #4ecdc4 100%);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
        }
      `}</style>
    </PopupBase>
  );
};

export default SettingsPopup;
