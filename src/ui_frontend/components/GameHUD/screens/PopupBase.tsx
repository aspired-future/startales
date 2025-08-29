import React from 'react';
import './PopupBase.css';

export interface PopupProps {
  onClose: () => void;
  isVisible: boolean;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
}

export interface PopupBaseProps extends PopupProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  tabs?: TabConfig[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const PopupBase: React.FC<PopupBaseProps> = ({
  title,
  icon,
  children,
  onClose,
  isVisible,
  className = '',
  size = 'large',
  tabs,
  activeTab,
  onTabChange
}) => {
  if (!isVisible) return null;

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-backdrop" onClick={handleBackdropClick}>
      <div className={`popup-screen ${size} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PopupBase;

