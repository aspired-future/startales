import { chromium } from 'playwright';

async function testWhoseAppErrors() {
  console.log('🔍 Checking for WhoseApp JavaScript Errors...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Listen for all console messages and errors
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
      
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('🚨 Page error:', error.message);
      errors.push(error.message);
    });
    
    // Listen for request failures
    page.on('requestfailed', request => {
      console.log('🚨 Request failed:', request.url(), request.failure()?.errorText);
    });
    
    // Navigate to the main frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Look for WhoseApp button and click it
    const whoseAppButton = await page.$('button:has-text("WhoseApp")');
    if (whoseAppButton) {
      console.log('✅ Found WhoseApp button, clicking...');
      await whoseAppButton.click();
      await page.waitForTimeout(3000);
    } else {
      console.log('❌ WhoseApp button not found');
      return;
    }
    
    // Wait for any async operations
    await page.waitForTimeout(5000);
    
    // Check if WhoseApp component is actually rendered
    const whoseAppElements = await page.$$('[class*="whoseapp"], [class*="WhoseApp"]');
    console.log(`🔍 WhoseApp elements found: ${whoseAppElements.length}`);
    
    // Check for any React error boundaries
    const errorBoundaries = await page.$$('[class*="error"], [class*="Error"]');
    console.log(`🚨 Error boundary elements: ${errorBoundaries.length}`);
    
    // Check for any loading states
    const loadingElements = await page.$$('[class*="loading"], [class*="spinner"]');
    console.log(`⏳ Loading elements: ${loadingElements.length}`);
    
    // Check for any error messages in the DOM
    const errorElements = await page.$$('[class*="error"], [class*="alert"], [class*="warning"]');
    console.log(`❌ Error elements in DOM: ${errorElements.length}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'whoseapp-errors.png' });
    console.log('📸 Screenshot saved as whoseapp-errors.png');
    
    // Summary
    console.log('\n📊 ERROR CHECK SUMMARY:');
    console.log(`✅ Total console messages: ${consoleMessages.length}`);
    console.log(`❌ JavaScript errors: ${errors.length}`);
    console.log(`🔍 WhoseApp elements: ${whoseAppElements.length}`);
    console.log(`🚨 Error boundaries: ${errorBoundaries.length}`);
    console.log(`⏳ Loading elements: ${loadingElements.length}`);
    console.log(`❌ Error elements in DOM: ${errorElements.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 JavaScript Errors:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWhoseAppErrors();
