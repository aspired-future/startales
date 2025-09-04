import React, { useState } from 'react';
import './QuickActionBase.css';
import '../shared/StandardDesign.css';
import '../BaseScreen.css';

export interface QuickActionProps {
  onClose: () => void;
  isVisible: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

interface QuickActionModalProps extends QuickActionProps {
  title: string;
  icon: string;
  theme: string;
  tabs: TabConfig[];
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  onClose,
  isVisible,
  title,
  icon,
  theme,
  tabs,
  children,
  className = '',
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (!isVisible) return null;

  return (
    <div className="quick-action-overlay">
      <div className={`quick-action-modal-basescreen ${theme} ${className}`}>
        {/* Header matching BaseScreen design */}
        <div className="base-screen-header">
          <div className="base-screen-title">
            <span className="base-screen-icon">{icon}</span>
            <h2>{title}</h2>
          </div>
          
          {/* Tabs matching BaseScreen design */}
          <div className="base-screen-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`base-screen-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Action buttons matching BaseScreen design */}
          <div className="base-screen-actions">
            {onRefresh && (
              <button className="base-screen-action-btn" onClick={onRefresh} title="Refresh Data">
                🔄
              </button>
            )}
            <button className="base-screen-action-btn" onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="base-screen-content">
          <div className="standard-dashboard">
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child) && child.props.tabId === activeTab) {
                return child;
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionModal;
