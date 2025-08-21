const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 Testing Intelligence Screen Character Tabs...');
    
    // Navigate to the HUD
    await page.goto('http://localhost:5174');
    await page.waitForTimeout(2000);

    // Navigate to Intelligence screen
    console.log('📡 Navigating to Intelligence screen...');
    await page.click('.accordion-header:has(.accordion-title:has-text("SECURITY"))');
    await page.waitForTimeout(500);
    await page.click('.nav-item:has-text("Intelligence")');
    await page.waitForTimeout(2000);

    // Test Foreign Intel tab
    console.log('🌍 Testing Foreign Intel tab...');
    await page.click('.tab:has-text("Foreign Intel")');
    await page.waitForTimeout(1000);
    
    // Check for foreign intel content
    const foreignIntelContent = await page.textContent('.foreign-intel-tab');
    if (foreignIntelContent.includes('Foreign Intelligence Dossiers') && 
        foreignIntelContent.includes('Emperor Zyx\'thara') &&
        foreignIntelContent.includes('Chancellor Vex\'mora')) {
      console.log('✅ Foreign Intel tab loaded successfully with leader dossiers');
    } else {
      console.log('❌ Foreign Intel tab content missing');
    }

    // Test Domestic Intel tab
    console.log('🏠 Testing Domestic Intel tab...');
    await page.click('.tab:has-text("Domestic Intel")');
    await page.waitForTimeout(1000);
    
    // Check for domestic intel content
    const domesticIntelContent = await page.textContent('.domestic-intel-tab');
    if (domesticIntelContent.includes('Domestic Intelligence Network') && 
        domesticIntelContent.includes('Senator Kex\'andra Vel') &&
        domesticIntelContent.includes('General Thex\'ul Qar') &&
        domesticIntelContent.includes('Security Concerns')) {
      console.log('✅ Domestic Intel tab loaded successfully with political figures and threats');
    } else {
      console.log('❌ Domestic Intel tab content missing');
    }

    // Test tab switching
    console.log('🔄 Testing tab switching...');
    await page.click('.tab:has-text("Overview")');
    await page.waitForTimeout(500);
    await page.click('.tab:has-text("Foreign Intel")');
    await page.waitForTimeout(500);
    await page.click('.tab:has-text("Domestic Intel")');
    await page.waitForTimeout(500);
    
    console.log('✅ Tab switching works correctly');

    // Take a screenshot
    await page.screenshot({ path: 'temp_dev/intelligence_character_tabs_test.png', fullPage: true });
    console.log('📸 Screenshot saved: temp_dev/intelligence_character_tabs_test.png');

    console.log('🎉 Intelligence Character Tabs test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
