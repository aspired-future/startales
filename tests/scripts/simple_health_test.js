import { chromium } from 'playwright';

async function simpleHealthTest() {
  console.log('🔍 Simple HealthScreen test...');
  
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
    
    // Check if any health-related content is visible
    const healthElements = await page.locator('text=Health').all();
    console.log(`🏥 Found ${healthElements.length} health-related elements`);
    
    // Check for loading states
    const loadingElements = await page.locator('text=Loading').all();
    console.log(`⏳ Found ${loadingElements.length} loading elements`);
    
    // Check for error states
    const errorElements = await page.locator('text=Error').all();
    console.log(`❌ Found ${errorElements.length} error elements`);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/simple-health-test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    // Wait a bit more to see console output
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

simpleHealthTest().catch(console.error);

