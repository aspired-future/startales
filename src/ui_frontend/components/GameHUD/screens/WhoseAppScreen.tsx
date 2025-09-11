/**
 * WhoseApp Screen Wrapper
 * Integrates WhoseAppMain component into the HUD screen system
 */

import React from 'react';
import { ScreenProps } from './BaseScreen';
import { WhoseAppMain } from '../../WhoseApp/WhoseAppMain';

const WhoseAppScreen: React.FC<ScreenProps> = ({ screenId, title, icon, gameContext }) => {
  console.log('🎯 WhoseAppScreen: Rendering WhoseAppScreen component');
  return (
    <WhoseAppMain 
      gameContext={gameContext}
    />
  );
};

export default WhoseAppScreen;

