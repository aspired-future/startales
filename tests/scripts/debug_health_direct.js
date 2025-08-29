import { chromium } from 'playwright';

async function debugHealthDirect() {
  console.log('🔍 Direct Health screen debugging...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for all console messages
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Click Civilization button
    const civilizationButton = await page.locator('button:has-text("🏛️ Civilization")').first();
    if (await civilizationButton.isVisible()) {
      await civilizationButton.click();
      console.log('✅ Clicked Civilization button');
      await page.waitForTimeout(2000);
    }
    
    // Click Population accordion
    const populationAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await populationAccordion.isVisible()) {
      await populationAccordion.click();
      console.log('✅ Clicked Population accordion');
      await page.waitForTimeout(2000);
    }
    
    // Click Health button
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      console.log('✅ Found Health button, clicking...');
      await healthButton.click();
      console.log('✅ Clicked Health button');
      
      // Wait and check for any errors
      await page.waitForTimeout(3000);
      
      // Check for any error messages on the page
      const errorText = await page.locator('text=Error').all();
      console.log(`❌ Found ${errorText.length} error messages on page`);
      
      // Check for loading messages
      const loadingText = await page.locator('text=Loading').all();
      console.log(`⏳ Found ${loadingText.length} loading messages on page`);
      
      // Check for health-related content
      const healthContent = await page.locator('text=Health').all();
      console.log(`🏥 Found ${healthContent.length} health-related content elements`);
      
      // Take a screenshot
      await page.screenshot({ path: 'tests/screenshots/health-debug-direct.png', fullPage: true });
      console.log('📸 Screenshot saved');
      
    } else {
      console.log('❌ Health button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugHealthDirect().catch(console.error);

