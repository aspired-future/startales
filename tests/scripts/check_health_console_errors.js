import { chromium } from 'playwright';

async function checkHealthConsoleErrors() {
  console.log('🔍 Checking Health screen console errors...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`❌ Request Failed: ${request.url()} ${request.failure().errorText}`);
  });
  
  try {
    // Navigate to the main page
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(3000);
    
    // Look for the population accordion header (👥)
    const populationAccordion = await page.locator('.accordion-header:has-text("👥")').first();
    if (await populationAccordion.isVisible()) {
      await populationAccordion.click();
      console.log('✅ Clicked Population accordion header');
      await page.waitForTimeout(2000);
    }
    
    // Look for Health & Welfare button in the expanded accordion
    const healthButton = await page.locator('button:has-text("Health")').first();
    if (await healthButton.isVisible()) {
      console.log('✅ Found Health & Welfare button');
      
      // Clear console and click the Health button
      console.log('🔄 Clicking Health button - watch for errors...');
      await healthButton.click();
      console.log('✅ Clicked Health & Welfare button');
      
      // Wait for any console output
      await page.waitForTimeout(3000);
      
      // Check what's actually being displayed
      const bodyText = await page.textContent('body');
      console.log('📄 Page content check:');
      console.log(`  Contains "Health": ${bodyText.includes('Health')}`);
      console.log(`  Contains "Loading": ${bodyText.includes('Loading')}`);
      console.log(`  Contains "Error": ${bodyText.includes('Error')}`);
      
      // Check for any popup or modal
      const popups = await page.locator('.popup, .modal, [role="dialog"]').all();
      console.log(`🔍 Found ${popups.length} popup/modal elements`);
      
      // Check for health screen elements
      const healthElements = await page.locator('.health-theme, [data-screen="health"]').all();
      console.log(`🏥 Found ${healthElements.length} health screen elements`);
      
      // Take a screenshot
      await page.screenshot({ path: 'tests/screenshots/health-console-errors.png', fullPage: true });
      console.log('📸 Screenshot saved to tests/screenshots/health-console-errors.png');
      
    } else {
      console.log('❌ Health & Welfare button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

checkHealthConsoleErrors().catch(console.error);

