import React from 'react';
import { EntityImage } from './EntityImage';
import './CivilizationFlag.css';

interface CivilizationFlagProps {
  civilizationId: string | number;
  civilizationName: string;
  size?: 'small' | 'medium' | 'large' | 'banner';
  showName?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const CivilizationFlag: React.FC<CivilizationFlagProps> = ({
  civilizationId,
  civilizationName,
  size = 'medium',
  showName = false,
  className = '',
  onClick,
  style
}) => {
  const flagClassName = `civilization-flag civilization-flag--${size} ${className}`;

  return (
    <div 
      className={flagClassName} 
      onClick={onClick}
      style={style}
      title={`${civilizationName} Flag`}
    >
      <EntityImage
        entityType="civilization"
        entityId={civilizationId}
        category="flag"
        alt={`${civilizationName} flag`}
        className="civilization-flag__image"
      />
      {showName && (
        <div className="civilization-flag__name">
          {civilizationName}
        </div>
      )}
    </div>
  );
};

export default CivilizationFlag;
