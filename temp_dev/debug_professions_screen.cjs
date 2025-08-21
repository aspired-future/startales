const { chromium } = require('playwright');

async function debugProfessionsScreen() {
  console.log('🔍 Debugging Professions Screen...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // Navigate to the HUD
    console.log('📍 Navigating to HUD...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(3000);
    
    // Check if HUD loaded
    const hudLoaded = await page.locator('.comprehensive-hud').count();
    console.log(`🎮 HUD loaded: ${hudLoaded > 0}`);
    
    // Check available accordion headers
    const accordionHeaders = await page.locator('.accordion-header').count();
    console.log(`📂 Accordion headers found: ${accordionHeaders}`);
    
    if (accordionHeaders > 0) {
      const accordionTitles = await page.locator('.accordion-title').allTextContents();
      console.log('📋 Available accordion titles:', accordionTitles);
    }
    
    // Try to find Population accordion by different selectors
    const populationAccordion = await page.locator('.accordion-header:has(.accordion-title:has-text("POPULATION"))').count();
    console.log(`👥 Population accordion found: ${populationAccordion > 0}`);
    
    if (populationAccordion === 0) {
      // Try alternative selectors
      const altPopulation1 = await page.locator('.accordion-header:has-text("POPULATION")').count();
      const altPopulation2 = await page.locator('.accordion-header:has-text("Population")').count();
      const altPopulation3 = await page.locator('.accordion-header:has-text("👥")').count();
      
      console.log(`🔍 Alternative selectors:`);
      console.log(`   - Has-text "POPULATION": ${altPopulation1}`);
      console.log(`   - Has-text "Population": ${altPopulation2}`);
      console.log(`   - Has-text "👥": ${altPopulation3}`);
    }
    
    // Check if we can find the professions nav item anywhere
    const professionsNav = await page.locator('.nav-item:has-text("Professions")').count();
    console.log(`💼 Professions nav item found: ${professionsNav > 0}`);
    
    // Try clicking on any available accordion to see structure
    if (accordionHeaders > 0) {
      console.log('🔍 Trying to click first accordion...');
      await page.click('.accordion-header:first-child');
      await page.waitForTimeout(1000);
      
      const navItems = await page.locator('.nav-item').count();
      console.log(`📋 Nav items found after clicking: ${navItems}`);
      
      if (navItems > 0) {
        const navTexts = await page.locator('.nav-item').allTextContents();
        console.log('📝 Available nav items:', navTexts);
      }
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'temp_dev/professions_debug.png',
      fullPage: true 
    });
    console.log('📸 Debug screenshot saved as professions_debug.png');
    
    // Wait a bit for manual inspection
    console.log('⏳ Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the debug
debugProfessionsScreen().catch(console.error);
