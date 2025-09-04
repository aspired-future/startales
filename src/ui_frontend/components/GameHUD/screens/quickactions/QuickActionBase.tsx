import React from 'react';
import './QuickActionBase.css';
import '../shared/StandardDesign.css';

export interface QuickActionProps {
  onClose: () => void;
  isVisible: boolean;
}

export interface QuickActionBaseProps extends QuickActionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

export const QuickActionBase: React.FC<QuickActionBaseProps> = ({
  title,
  icon,
  children,
  onClose,
  isVisible,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className="quick-action-overlay">
      <div className={`quick-action-modal ${className}`}>
        <div className="quick-action-header">
          <div className="quick-action-title">
            <span className="quick-action-icon">{icon}</span>
            <h2>{title}</h2>
          </div>
          <button className="quick-action-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="quick-action-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default QuickActionBase;
