// Standalone test of the Integrated Witty Galaxy HUD
const { chromium } = require('playwright');
const fs = require('fs');

async function testHUD() {
  console.log('🚀 Starting Integrated Witty Galaxy HUD Test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Read the HUD content
    const { getIntegratedWittyGalaxyHUD } = require('./integrated_witty_galaxy_hud.cjs');
    const hudContent = getIntegratedWittyGalaxyHUD();
    
    // Create a temporary HTML file
    const tempFile = 'temp_dev/test_hud_standalone.html';
    fs.writeFileSync(tempFile, hudContent);
    
    console.log('📄 Created temporary HTML file');
    
    // Set viewport for desktop testing
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate to the temporary file
    await page.goto(`file://${process.cwd()}/${tempFile}`);
    console.log('🌐 Loaded HUD page');
    
    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Test 1: Check page title
    const title = await page.title();
    console.log('📋 Page title:', title);
    const titleTest = title.includes('Witty Galaxy Command Center');
    console.log('✅ Title test:', titleTest ? 'PASSED' : 'FAILED');
    
    // Test 2: Check main elements
    const hudContainer = await page.locator('.hud-container').count();
    const header = await page.locator('.hud-header').count();
    const nav = await page.locator('.hud-nav').count();
    const main = await page.locator('.hud-main').count();
    const witterFeed = await page.locator('#witterFeed').count();
    
    console.log('🏗️ Structure elements:');
    console.log('  - HUD Container:', hudContainer > 0 ? '✅' : '❌');
    console.log('  - Header:', header > 0 ? '✅' : '❌');
    console.log('  - Navigation:', nav > 0 ? '✅' : '❌');
    console.log('  - Main Content:', main > 0 ? '✅' : '❌');
    console.log('  - Witter Feed:', witterFeed > 0 ? '✅' : '❌');
    
    // Test 3: Check CSS variables
    const cssVars = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      return {
        primaryGlow: computedStyle.getPropertyValue('--primary-glow').trim(),
        bgPanel: computedStyle.getPropertyValue('--bg-panel').trim(),
        textPrimary: computedStyle.getPropertyValue('--text-primary').trim()
      };
    });
    
    console.log('🎨 CSS Variables:');
    console.log('  - Primary Glow:', cssVars.primaryGlow ? '✅' : '❌', cssVars.primaryGlow);
    console.log('  - BG Panel:', cssVars.bgPanel ? '✅' : '❌', cssVars.bgPanel);
    console.log('  - Text Primary:', cssVars.textPrimary ? '✅' : '❌', cssVars.textPrimary);
    
    // Test 4: Check JavaScript initialization
    await page.waitForTimeout(3000);
    
    const hudObject = await page.evaluate(() => {
      return typeof window.hud !== 'undefined';
    });
    
    console.log('⚙️ JavaScript:');
    console.log('  - HUD Object:', hudObject ? '✅' : '❌');
    
    // Test 5: Take screenshots
    await page.screenshot({ path: 'temp_dev/hud_test_desktop.png', fullPage: true });
    console.log('📸 Desktop screenshot saved');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'temp_dev/hud_test_tablet.png', fullPage: true });
    console.log('📸 Tablet screenshot saved');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'temp_dev/hud_test_mobile.png', fullPage: true });
    console.log('📸 Mobile screenshot saved');
    
    // Test 6: Check for visual systems integration
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    const visualMethods = await page.evaluate(() => {
      return window.hud && typeof window.hud.generateVisualContent === 'function';
    });
    
    console.log('🎨 Visual Systems:');
    console.log('  - Visual Methods:', visualMethods ? '✅' : '❌');
    
    // Summary
    const allTests = [
      titleTest,
      hudContainer > 0,
      header > 0,
      nav > 0,
      main > 0,
      witterFeed > 0,
      cssVars.primaryGlow !== '',
      cssVars.bgPanel !== '',
      cssVars.textPrimary !== '',
      hudObject,
      visualMethods
    ];
    
    const passedTests = allTests.filter(test => test).length;
    const totalTests = allTests.length;
    
    console.log('\\n📊 Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED! The Integrated Witty Galaxy HUD is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Check the output above for details.');
    }
    
    // Clean up
    fs.unlinkSync(tempFile);
    console.log('🧹 Cleaned up temporary files');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
    console.log('🏁 Test completed');
  }
}

// Run the test
testHUD().catch(console.error);
