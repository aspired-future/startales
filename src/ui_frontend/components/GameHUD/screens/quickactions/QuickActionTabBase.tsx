import React, { useState } from 'react';
import './QuickActionBase.css';
import '../shared/StandardDesign.css';

export interface QuickActionProps {
  onClose: () => void;
  isVisible: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

interface QuickActionTabBaseProps extends QuickActionProps {
  title: string;
  icon: string;
  theme: string;
  tabs: TabConfig[];
  children: React.ReactNode;
  className?: string;
}

export const QuickActionTabBase: React.FC<QuickActionTabBaseProps> = ({
  onClose,
  isVisible,
  title,
  icon,
  theme,
  tabs,
  children,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (!isVisible) return null;

  return (
    <div className="quick-action-overlay">
      <div className={`quick-action-modal ${theme} ${className}`}>
        {/* Header */}
        <div className="quick-action-header">
          <div className="quick-action-title">
            <span className="quick-action-icon">{icon}</span>
            <h2>{title}</h2>
          </div>
          <button className="quick-action-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="quick-action-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`quick-action-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="quick-action-content">
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

export default QuickActionTabBase;
