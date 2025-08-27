#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTING CAMPAIGN WIZARD FIXES...\n');

const wizardCssPath = 'src/ui_frontend/components/CampaignSetup/CampaignWizard.css';
const campaignRoutesPath = 'src/server/campaigns/campaignRoutes.ts';

try {
  // Test 1: Scrollability fixes in CSS
  const cssContent = fs.readFileSync(wizardCssPath, 'utf8');
  
  console.log('✅ SCROLLABILITY FIXES:');
  
  // Check 1: Main wizard container has proper height and overflow
  const hasHeightOverflow = cssContent.includes('height: 100vh') && cssContent.includes('overflow-y: auto');
  console.log(`   ${hasHeightOverflow ? '✅' : '❌'} Main container height/overflow: ${hasHeightOverflow}`);
  
  // Check 2: Flex layout for proper structure
  const hasFlexLayout = cssContent.includes('display: flex') && cssContent.includes('flex-direction: column');
  console.log(`   ${hasFlexLayout ? '✅' : '❌'} Flex layout structure: ${hasFlexLayout}`);
  
  // Check 3: Content area has proper scrolling
  const hasContentScroll = cssContent.includes('flex: 1') && cssContent.includes('max-height: calc(100vh - 300px)');
  console.log(`   ${hasContentScroll ? '✅' : '❌'} Content area scrolling: ${hasContentScroll}`);
  
  // Test 2: Graphics generation endpoint
  const routesContent = fs.readFileSync(campaignRoutesPath, 'utf8');
  
  console.log('\n✅ GRAPHICS GENERATION FIXES:');
  
  // Check 4: Graphics generation endpoint exists
  const hasGraphicsEndpoint = routesContent.includes('/generate-graphics') && routesContent.includes('POST');
  console.log(`   ${hasGraphicsEndpoint ? '✅' : '❌'} Graphics generation endpoint: ${hasGraphicsEndpoint}`);
  
  // Check 5: Proper graphics options structure
  const hasGraphicsOptions = routesContent.includes('graphicsOptions') && routesContent.includes('realistic-space');
  console.log(`   ${hasGraphicsOptions ? '✅' : '❌'} Graphics options structure: ${hasGraphicsOptions}`);
  
  // Check 6: Error handling in graphics endpoint
  const hasErrorHandling = routesContent.includes('catch (error)') && routesContent.includes('Missing required field: scenario');
  console.log(`   ${hasErrorHandling ? '✅' : '❌'} Error handling: ${hasErrorHandling}`);
  
  // Check 7: Multiple graphics styles available
  const hasMultipleStyles = routesContent.includes('realistic') && routesContent.includes('stylized') && 
                           routesContent.includes('minimalist') && routesContent.includes('retro');
  console.log(`   ${hasMultipleStyles ? '✅' : '❌'} Multiple graphics styles: ${hasMultipleStyles}`);
  
  console.log('\n🎯 EXPECTED BEHAVIOR:');
  console.log('   • Campaign Wizard scrolls properly when content exceeds viewport');
  console.log('   • Wizard maintains header while content area scrolls independently');
  console.log('   • Graphics generation step loads options successfully');
  console.log('   • Four different graphics styles are available to choose from');
  console.log('   • Graphics options include preview images and descriptions');
  
  const allChecks = [
    hasHeightOverflow,
    hasFlexLayout,
    hasContentScroll,
    hasGraphicsEndpoint,
    hasGraphicsOptions,
    hasErrorHandling,
    hasMultipleStyles
  ];
  
  const passedChecks = allChecks.filter(Boolean).length;
  const totalChecks = allChecks.length;
  
  console.log(`\n📊 OVERALL SCORE: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 ALL CAMPAIGN WIZARD FIXES IMPLEMENTED SUCCESSFULLY!');
    console.log('🚀 Ready to test: Scrollable wizard with working graphics generation');
  } else {
    console.log('⚠️  Some wizard fixes may need attention.');
  }
  
} catch (error) {
  console.error('❌ Error reading files:', error.message);
}
