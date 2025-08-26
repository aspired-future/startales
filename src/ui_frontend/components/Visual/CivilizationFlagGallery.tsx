import React, { useState } from 'react';
import { CivilizationFlag } from './CivilizationFlag';
import './CivilizationFlagGallery.css';

interface Civilization {
  id: string | number;
  name: string;
  playerId?: string | number;
  playerName?: string;
  government?: string;
  species?: string;
}

interface CivilizationFlagGalleryProps {
  civilizations: Civilization[];
  size?: 'small' | 'medium' | 'large' | 'banner';
  showNames?: boolean;
  showPlayerInfo?: boolean;
  onFlagClick?: (civilization: Civilization) => void;
  selectedCivilizationId?: string | number;
  className?: string;
  title?: string;
  maxColumns?: number;
}

export const CivilizationFlagGallery: React.FC<CivilizationFlagGalleryProps> = ({
  civilizations,
  size = 'medium',
  showNames = true,
  showPlayerInfo = false,
  onFlagClick,
  selectedCivilizationId,
  className = '',
  title,
  maxColumns = 6
}) => {
  const [hoveredFlag, setHoveredFlag] = useState<string | number | null>(null);

  const handleFlagClick = (civilization: Civilization) => {
    if (onFlagClick) {
      onFlagClick(civilization);
    }
  };

  const galleryClassName = `civilization-flag-gallery civilization-flag-gallery--${size} ${className}`;
  const gridStyle = {
    gridTemplateColumns: `repeat(auto-fill, minmax(${getMinWidth(size)}, 1fr))`,
    maxWidth: `${maxColumns * getColumnWidth(size)}px`
  };

  return (
    <div className={galleryClassName}>
      {title && (
        <div className="civilization-flag-gallery__title">
          {title}
        </div>
      )}
      
      <div 
        className="civilization-flag-gallery__grid"
        style={gridStyle}
      >
        {civilizations.map((civilization) => (
          <div
            key={civilization.id}
            className={`civilization-flag-gallery__item ${
              selectedCivilizationId === civilization.id ? 'civilization-flag-gallery__item--selected' : ''
            }`}
            onMouseEnter={() => setHoveredFlag(civilization.id)}
            onMouseLeave={() => setHoveredFlag(null)}
          >
            <CivilizationFlag
              civilizationId={civilization.id}
              civilizationName={civilization.name}
              size={size}
              showName={showNames}
              onClick={() => handleFlagClick(civilization)}
              className={`
                ${onFlagClick ? 'civilization-flag--clickable' : ''}
                ${selectedCivilizationId === civilization.id ? 'civilization-flag--selected' : ''}
              `}
            />
            
            {showPlayerInfo && (civilization.playerName || civilization.government || civilization.species) && (
              <div className="civilization-flag-gallery__info">
                {civilization.playerName && (
                  <div className="civilization-flag-gallery__player">
                    Player: {civilization.playerName}
                  </div>
                )}
                {civilization.government && (
                  <div className="civilization-flag-gallery__government">
                    {civilization.government}
                  </div>
                )}
                {civilization.species && (
                  <div className="civilization-flag-gallery__species">
                    {civilization.species}
                  </div>
                )}
              </div>
            )}
            
            {hoveredFlag === civilization.id && (
              <div className="civilization-flag-gallery__tooltip">
                <div className="civilization-flag-gallery__tooltip-name">
                  {civilization.name}
                </div>
                {civilization.playerName && (
                  <div className="civilization-flag-gallery__tooltip-player">
                    Controlled by: {civilization.playerName}
                  </div>
                )}
                {civilization.government && (
                  <div className="civilization-flag-gallery__tooltip-detail">
                    Government: {civilization.government}
                  </div>
                )}
                {civilization.species && (
                  <div className="civilization-flag-gallery__tooltip-detail">
                    Species: {civilization.species}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {civilizations.length === 0 && (
        <div className="civilization-flag-gallery__empty">
          <div className="civilization-flag-gallery__empty-icon">🏴</div>
          <div className="civilization-flag-gallery__empty-text">
            No civilizations to display
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for responsive sizing
function getMinWidth(size: string): string {
  switch (size) {
    case 'small': return '60px';
    case 'medium': return '80px';
    case 'large': return '100px';
    case 'banner': return '140px';
    default: return '80px';
  }
}

function getColumnWidth(size: string): number {
  switch (size) {
    case 'small': return 80;
    case 'medium': return 100;
    case 'large': return 120;
    case 'banner': return 160;
    default: return 100;
  }
}

export default CivilizationFlagGallery;
