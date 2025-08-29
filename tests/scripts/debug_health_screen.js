import { chromium } from 'playwright';

async function debugHealthScreen() {
  console.log('🔍 Debugging Health screen...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
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
      
      // Click the Health button and wait for any console output
      await healthButton.click();
      console.log('✅ Clicked Health & Welfare button');
      
      // Wait longer to see any console output
      await page.waitForTimeout(5000);
      
      // Check if we're on the Health screen
      const healthScreen = await page.locator('.health-theme').first();
      if (await healthScreen.isVisible()) {
        console.log('✅ Health screen container found!');
      } else {
        console.log('❌ Health screen container not found');
        
        // Check for any error messages
        const errorElements = await page.locator('text=Error').all();
        console.log(`❌ Found ${errorElements.length} error elements`);
        
        // Check for loading state
        const loadingElements = await page.locator('text=Loading').all();
        console.log(`⏳ Found ${loadingElements.length} loading elements`);
        
        // Check what's actually being displayed
        const bodyText = await page.textContent('body');
        if (bodyText.includes('Health')) {
          console.log('✅ Found "Health" text in page content');
        } else {
          console.log('❌ No "Health" text found in page content');
        }
      }
      
      // Take a screenshot
      await page.screenshot({ path: 'tests/screenshots/health-screen-debug.png', fullPage: true });
      console.log('📸 Screenshot saved to tests/screenshots/health-screen-debug.png');
      
    } else {
      console.log('❌ Health & Welfare button not found');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugHealthScreen().catch(console.error);

