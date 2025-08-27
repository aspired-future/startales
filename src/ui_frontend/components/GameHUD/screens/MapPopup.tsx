import React from 'react';
import { PopupBase, PopupProps } from './PopupBase';
import { Enhanced3DGalaxyMap } from '../Enhanced3DGalaxyMap';

interface MapPopupProps extends PopupProps {
  playerId: string;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  playerId,
  onClose,
  isVisible
}) => {
  return (
    <PopupBase
      title="Galaxy Map"
      icon="🌌"
      onClose={onClose}
      isVisible={isVisible}
      size="fullscreen"
    >
      <div className="map-popup-content">
        <Enhanced3DGalaxyMap />
      </div>
      
      <style jsx>{`
        /* Override PopupBase padding to use full space */
        :global(.popup-content) {
          padding: 0 !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
        
        .map-popup-content {
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
          flex: 1;
          min-height: 0; /* Important for flex child to shrink */
        }
        
        /* Ensure the Enhanced3DGalaxyMap uses full available space */
        .map-popup-content :global(.enhanced-galaxy-map) {
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
        
        /* Ensure canvas gets proper sizing */
        .map-popup-content :global(.enhanced-galaxy-canvas) {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </PopupBase>
  );
};

export default MapPopup;

