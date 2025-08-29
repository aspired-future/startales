#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING WIZARD ACCESS THROUGH SETTINGS MENU...\n');

const campaignWizardPath = 'src/ui_frontend/components/CampaignSetup/CampaignWizard.tsx';
const comprehensiveHudPath = 'src/ui_frontend/components/GameHUD/ComprehensiveHUD.tsx';
const settingsPopupPath = 'src/ui_frontend/components/GameHUD/screens/SettingsPopup.tsx';

try {
  const wizardContent = fs.readFileSync(campaignWizardPath, 'utf8');
  const hudContent = fs.readFileSync(comprehensiveHudPath, 'utf8');
  const settingsContent = fs.readFileSync(settingsPopupPath, 'utf8');
  
  console.log('✅ CAMPAIGN WIZARD VISIBILITY CONTROL:');
  
  // Check 1: Wizard has isVisible prop
  const hasVisibleProp = wizardContent.includes('isVisible: boolean') && 
                        wizardContent.includes('isVisible,');
  console.log(`   ${hasVisibleProp ? '✅' : '❌'} Wizard has isVisible prop: ${hasVisibleProp}`);
  
  // Check 2: Wizard returns null when not visible
  const hasVisibilityCheck = wizardContent.includes('if (!isVisible) return null');
  console.log(`   ${hasVisibilityCheck ? '✅' : '❌'} Wizard returns null when not visible: ${hasVisibilityCheck}`);
  
  // Check 3: Wizard uses onClose instead of onCancel
  const usesOnClose = wizardContent.includes('onClose: () => void') && 
                     wizardContent.includes('onClick={onClose}') &&
                     !wizardContent.includes('onCancel');
  console.log(`   ${usesOnClose ? '✅' : '❌'} Wizard uses onClose prop: ${usesOnClose}`);
  
  console.log('\n✅ HUD WIZARD INTEGRATION:');
  
  // Check 4: HUD wizard starts as false
  const wizardStartsFalse = hudContent.includes('useState(false)') && 
                           hudContent.includes('isGameSetupWizardVisible');
  console.log(`   ${wizardStartsFalse ? '✅' : '❌'} Wizard starts hidden (false): ${wizardStartsFalse}`);
  
  // Check 5: HUD passes correct props to wizard
  const hasCorrectProps = hudContent.includes('isVisible={isGameSetupWizardVisible}') && 
                         hudContent.includes('onClose={() => setIsGameSetupWizardVisible(false)}');
  console.log(`   ${hasCorrectProps ? '✅' : '❌'} HUD passes correct props to wizard: ${hasCorrectProps}`);
  
  console.log('\n✅ SETTINGS MENU ACCESS:');
  
  // Check 6: Settings has "Start New Game" button
  const hasNewGameButton = settingsContent.includes('🆕 Start New Game') && 
                          settingsContent.includes('onClick={handleNewGame}');
  console.log(`   ${hasNewGameButton ? '✅' : '❌'} Settings has "Start New Game" button: ${hasNewGameButton}`);
  
  // Check 7: Settings button is in Game tab
  const inGameTab = settingsContent.includes("activeTab === 'game'") && 
                   settingsContent.includes('🆕 Start New Game');
  console.log(`   ${inGameTab ? '✅' : '❌'} New Game button is in Game Settings tab: ${inGameTab}`);
  
  // Check 8: Settings triggers wizard through onNewGame
  const triggersWizard = hudContent.includes('onNewGame={() => {') && 
                        hudContent.includes('setIsSettingsPopupVisible(false)') &&
                        hudContent.includes('setIsGameSetupWizardVisible(true)');
  console.log(`   ${triggersWizard ? '✅' : '❌'} Settings triggers wizard correctly: ${triggersWizard}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Game loads with NO wizard visible on home page');
  console.log('   • Click Settings (⚙️) → Opens Settings popup');
  console.log('   • Go to "Game" tab in Settings');
  console.log('   • Click "🆕 Start New Game" button');
  console.log('   • Settings popup closes, Campaign Wizard opens');
  console.log('   • Wizard is modal/overlay, not taking over entire page');
  console.log('   • Cancel/Complete wizard returns to normal game view');
  
  const allChecks = [
    hasVisibleProp,
    hasVisibilityCheck,
    usesOnClose,
    wizardStartsFalse,
    hasCorrectProps,
    hasNewGameButton,
    inGameTab,
    triggersWizard
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL WIZARD ACCESS FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('🎮 Game Setup Wizard is now properly controlled through Settings menu');
    console.log('🏠 Home page should be clean with no wizard taking over');
  } else {
    console.log('⚠️  Some wizard access fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
