import React from 'react';
import './WitterHeader.css';

interface WitterHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  unreadCount: number;
  onOpenPopulationManager?: () => void;
  onOpenExplorationDashboard?: () => void;
}

export const WitterHeader: React.FC<WitterHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  connectionStatus,
  unreadCount,
  onOpenPopulationManager,
  onOpenExplorationDashboard
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🟡';
      case 'disconnected':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="witter-header">
      <div className="witter-header-left">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand Witter' : 'Collapse Witter'}
        >
          {collapsed ? '📱' : '📱'}
        </button>
        
        <div className="witter-title">
          <h2>Witter</h2>
          {!collapsed && (
            <span className="witter-subtitle">Galactic Social Network</span>
          )}
        </div>
        
        {unreadCount > 0 && !collapsed && (
          <div className="unread-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="witter-header-right">
          {onOpenExplorationDashboard && (
            <button 
              className="exploration-dashboard-btn"
              onClick={onOpenExplorationDashboard}
              title="Open Exploration Dashboard"
            >
              🚀 Explore
            </button>
          )}
          
          {onOpenPopulationManager && (
            <button 
              className="population-manager-btn"
              onClick={onOpenPopulationManager}
              title="Open Population Manager"
            >
              🌌 Population
            </button>
          )}
          
          <div className="connection-status">
            <span className="connection-icon">{getConnectionIcon()}</span>
            <span className="connection-text">{getConnectionText()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WitterHeader;
