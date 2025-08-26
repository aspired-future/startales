/**
 * WhoseApp Screen Wrapper
 * Integrates WhoseAppMain component into the HUD screen system
 */

import React from 'react';
import { ScreenProps } from './BaseScreen';
import { WhoseAppMain } from '../../WhoseApp/WhoseAppMain';

const WhoseAppScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  return (
    <WhoseAppMain
      civilizationId="civ_001"
      currentUserId="player_001"
      onOpenCharacterProfile={(characterId) => {
        console.log('Opening character profile:', characterId);
        // TODO: Implement character profile modal integration
      }}
      onCreateAction={(action) => {
        console.log('Creating action:', action);
        // TODO: Integrate with action creation system
      }}
    />
  );
};

export default WhoseAppScreen;

