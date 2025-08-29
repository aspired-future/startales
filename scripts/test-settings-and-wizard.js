#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING SETTINGS ICON AND GAME SETUP WIZARD...\n');

const comprehensiveHudPath = 'src/ui_frontend/components/GameHUD/ComprehensiveHUD.tsx';

try {
  const hudContent = fs.readFileSync(comprehensiveHudPath, 'utf8');
  
  console.log('✅ SETTINGS INTEGRATION:');
  
  // Check 1: Settings imports
  const hasSettingsImport = hudContent.includes('import { SettingsPopup }') && 
                           hudContent.includes('import { ScoreDisplay }') &&
                           hudContent.includes('import { CampaignWizard }');
  console.log(`   ${hasSettingsImport ? '✅' : '❌'} Settings components imported: ${hasSettingsImport}`);
  
  // Check 2: Settings state variables
  const hasSettingsState = hudContent.includes('isSettingsPopupVisible') && 
                           hudContent.includes('isGameSetupWizardVisible') &&
                           hudContent.includes('playerScore') &&
                           hudContent.includes('playerLevel');
  console.log(`   ${hasSettingsState ? '✅' : '❌'} Settings state variables: ${hasSettingsState}`);
  
  // Check 3: Score display in header
  const hasScoreDisplay = hudContent.includes('<ScoreDisplay') && 
                         hudContent.includes('score={playerScore}') &&
                         hudContent.includes('level={playerLevel}');
  console.log(`   ${hasScoreDisplay ? '✅' : '❌'} Score display in header center: ${hasScoreDisplay}`);
  
  // Check 4: Settings button in header
  const hasSettingsButton = hudContent.includes('className="settings-btn"') && 
                           hudContent.includes('onClick={() => setIsSettingsPopupVisible(true)}') &&
                           hudContent.includes('⚙️');
  console.log(`   ${hasSettingsButton ? '✅' : '❌'} Settings button in header right: ${hasSettingsButton}`);
  
  // Check 5: Settings popup component
  const hasSettingsPopup = hudContent.includes('<SettingsPopup') && 
                          hudContent.includes('isVisible={isSettingsPopupVisible}') &&
                          hudContent.includes('onNewGame={() => {');
  console.log(`   ${hasSettingsPopup ? '✅' : '❌'} Settings popup component: ${hasSettingsPopup}`);
  
  // Check 6: Game setup wizard component
  const hasGameWizard = hudContent.includes('<CampaignWizard') && 
                       hudContent.includes('isVisible={isGameSetupWizardVisible}') &&
                       hudContent.includes('onComplete={(gameConfig) => {');
  console.log(`   ${hasGameWizard ? '✅' : '❌'} Game setup wizard component: ${hasGameWizard}`);
  
  // Check 7: New game flow
  const hasNewGameFlow = hudContent.includes('setIsSettingsPopupVisible(false)') && 
                        hudContent.includes('setIsGameSetupWizardVisible(true)');
  console.log(`   ${hasNewGameFlow ? '✅' : '❌'} New game flow (Settings → Wizard): ${hasNewGameFlow}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Score and Level display in top center of header');
  console.log('   • Settings icon (⚙️) in top right corner of header');
  console.log('   • Click settings icon → Opens settings popup');
  console.log('   • Settings popup has "New Game" button');
  console.log('   • Click "New Game" → Closes settings, opens Campaign Wizard');
  console.log('   • Campaign Wizard allows setting up new game configuration');
  console.log('   • Wizard completion initializes new game with selected config');
  
  const allChecks = [
    hasSettingsImport,
    hasSettingsState,
    hasScoreDisplay,
    hasSettingsButton,
    hasSettingsPopup,
    hasGameWizard,
    hasNewGameFlow
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL SETTINGS AND WIZARD FEATURES IMPLEMENTED SUCCESSFULLY!');
    console.log('🎮 Settings icon and Game Setup Wizard should now be visible and functional');
  } else {
    console.log('⚠️  Some settings or wizard features may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
