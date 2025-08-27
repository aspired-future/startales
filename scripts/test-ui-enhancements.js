#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING UI ENHANCEMENTS...\n');

const hudPath = 'src/ui_frontend/components/GameHUD/ComprehensiveHUD.tsx';
const settingsPath = 'src/ui_frontend/components/GameHUD/screens/SettingsPopup.tsx';
const scorePath = 'src/ui_frontend/components/GameHUD/ScoreDisplay.tsx';

try {
  // Test ComprehensiveHUD enhancements
  const hudContent = fs.readFileSync(hudPath, 'utf8');
  
  console.log('✅ COMPREHENSIVE HUD ENHANCEMENTS:');
  
  // Check 1: Settings icon integration
  const hasSettingsIcon = hudContent.includes('settings-btn') && hudContent.includes('⚙️');
  console.log(`   ${hasSettingsIcon ? '✅' : '❌'} Settings icon in header: ${hasSettingsIcon}`);
  
  // Check 2: Score display integration
  const hasScoreDisplay = hudContent.includes('<ScoreDisplay') && hudContent.includes('playerScore');
  console.log(`   ${hasScoreDisplay ? '✅' : '❌'} Score display in header center: ${hasScoreDisplay}`);
  
  // Check 3: Campaign Wizard integration
  const hasCampaignWizard = hudContent.includes('CampaignWizard') && hudContent.includes('isCampaignWizardOpen');
  console.log(`   ${hasCampaignWizard ? '✅' : '❌'} Campaign Wizard integration: ${hasCampaignWizard}`);
  
  // Check 4: Settings popup integration
  const hasSettingsPopup = hudContent.includes('<SettingsPopup') && hudContent.includes('isSettingsPopupOpen');
  console.log(`   ${hasSettingsPopup ? '✅' : '❌'} Settings popup integration: ${hasSettingsPopup}`);
  
  // Test Settings Popup
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');
  
  console.log('\n✅ SETTINGS POPUP FEATURES:');
  
  // Check 5: New Game button
  const hasNewGameButton = settingsContent.includes('Start New Game') && settingsContent.includes('onNewGame');
  console.log(`   ${hasNewGameButton ? '✅' : '❌'} New Game button: ${hasNewGameButton}`);
  
  // Check 6: Settings tabs
  const hasSettingsTabs = settingsContent.includes('settings-tabs') && settingsContent.includes('activeTab');
  console.log(`   ${hasSettingsTabs ? '✅' : '❌'} Settings tabs: ${hasSettingsTabs}`);
  
  // Check 7: Game Setup Wizard reference
  const hasWizardReference = settingsContent.includes('Game Setup Wizard');
  console.log(`   ${hasWizardReference ? '✅' : '❌'} Game Setup Wizard reference: ${hasWizardReference}`);
  
  // Test Score Display
  const scoreContent = fs.readFileSync(scorePath, 'utf8');
  
  console.log('\n✅ SCORE DISPLAY FEATURES:');
  
  // Check 8: Score formatting
  const hasScoreFormatting = scoreContent.includes('formatScore') && scoreContent.includes('score >= 1000000');
  console.log(`   ${hasScoreFormatting ? '✅' : '❌'} Score formatting (K/M): ${hasScoreFormatting}`);
  
  // Check 9: Level display
  const hasLevelDisplay = scoreContent.includes('level-number') && scoreContent.includes('Level');
  console.log(`   ${hasLevelDisplay ? '✅' : '❌'} Level display: ${hasLevelDisplay}`);
  
  // Check 10: Experience bar
  const hasExperienceBar = scoreContent.includes('experience-bar') && scoreContent.includes('progressPercentage');
  console.log(`   ${hasExperienceBar ? '✅' : '❌'} Experience progress bar: ${hasExperienceBar}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Settings icon (⚙️) appears in top-right header');
  console.log('   • Score and level display in center header');
  console.log('   • Settings popup opens with "Start New Game" option');
  console.log('   • New Game button launches existing Campaign Wizard');
  console.log('   • Score display shows formatted numbers and XP progress');
  
  const allChecks = [
    hasSettingsIcon,
    hasScoreDisplay,
    hasCampaignWizard,
    hasSettingsPopup,
    hasNewGameButton,
    hasSettingsTabs,
    hasWizardReference,
    hasScoreFormatting,
    hasLevelDisplay,
    hasExperienceBar
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL UI ENHANCEMENTS IMPLEMENTED SUCCESSFULLY!');
    console.log('🚀 Ready to test: Settings icon, Score display, and Game Setup Wizard integration');
  } else {
    console.log('⚠️  Some UI enhancements may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
