import { chromium } from 'playwright';

async function debugUIConsole() {
  console.log('🔍 Debugging UI Console on port 5173...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📝 Console: ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  // Listen for failed requests
  page.on('requestfailed', request => {
    console.log(`❌ Failed Request: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    // Navigate to the UI
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('✅ Page loaded');
    
    // Wait for React to load
    await page.waitForTimeout(5000);
    
    // Take a screenshot to see the current state
    await page.screenshot({ path: 'debug_ui_state.png', fullPage: true });
    console.log('📸 Screenshot saved as debug_ui_state.png');
    
    // Check if there are any error elements
    const errors = await page.locator('.error, .error-notice, [class*="error"]').count();
    if (errors > 0) {
      console.log(`⚠️ Found ${errors} error elements on page`);
    }
    
    // Check if the main content is loading
    const hasContent = await page.locator('body').textContent();
    console.log(`📄 Page content length: ${hasContent?.length || 0} characters`);
    
  } catch (error) {
    console.log(`❌ Debug failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugUIConsole();
