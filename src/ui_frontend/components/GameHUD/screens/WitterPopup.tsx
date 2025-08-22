import React from 'react';
import { PopupBase, PopupProps } from './PopupBase';
import { SimpleWitterFeed } from '../../Witter/SimpleWitterFeed';

interface WitterPopupProps extends PopupProps {
  playerId: string;
}

export const WitterPopup: React.FC<WitterPopupProps> = ({
  playerId,
  onClose,
  isVisible
}) => {
  return (
    <PopupBase
      title="Witter Feed"
      icon="🐦"
      onClose={onClose}
      isVisible={isVisible}
      size="large"
    >
      <div className="witter-popup-content">
        <div className="witter-header">
          <h3>🌌 Galactic Social Network</h3>
          <p>Stay connected with the latest news, updates, and conversations across the galaxy.</p>
        </div>
        
        <div className="witter-feed-container">
          <SimpleWitterFeed />
        </div>
        
        <div className="witter-actions">
          <button className="panel-btn">📝 Compose Tweet</button>
          <button className="panel-btn secondary">🔍 Search</button>
          <button className="panel-btn secondary">📊 Analytics</button>
          <button className="panel-btn secondary">⚙️ Settings</button>
        </div>
      </div>
      
      <style jsx>{`
        .witter-popup-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .witter-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(78, 205, 196, 0.3);
        }
        
        .witter-header h3 {
          color: #4ecdc4;
          font-size: 20px;
          margin: 0 0 8px 0;
        }
        
        .witter-header p {
          color: #ccc;
          font-size: 14px;
          margin: 0;
        }
        
        .witter-feed-container {
          flex: 1;
          min-height: 0;
          margin-bottom: 20px;
        }
        
        .witter-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 15px;
          border-top: 1px solid rgba(78, 205, 196, 0.3);
        }
        
        @media (max-width: 768px) {
          .witter-actions {
            flex-direction: column;
          }
          
          .witter-actions .panel-btn {
            margin-right: 0;
          }
        }
      `}</style>
    </PopupBase>
  );
};

export default WitterPopup;

