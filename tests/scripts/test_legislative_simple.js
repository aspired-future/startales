import { chromium } from 'playwright';

async function testLegislativeSimple() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🏛️ Testing Legislative Screen - Simple Navigation...');
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForTimeout(5000);
    
    // Get page content to see what's available
    console.log('🔍 Checking page content...');
    const pageText = await page.textContent('body');
    console.log('Page text preview:', pageText.substring(0, 500));
    
    // Look for any buttons or navigation elements
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons on the page`);
    
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      try {
        const buttonText = await buttons[i].textContent();
        console.log(`Button ${i + 1}: "${buttonText}"`);
      } catch (e) {
        console.log(`Button ${i + 1}: [error reading text]`);
      }
    }
    
    // Look for any text containing "legislative" (case insensitive)
    const legislativeElements = await page.$$('*:has-text("legislative")');
    console.log(`Found ${legislativeElements.length} elements containing "legislative"`);
    
    // Look for any text containing "government" (case insensitive)
    const governmentElements = await page.$$('*:has-text("government")');
    console.log(`Found ${governmentElements.length} elements containing "government"`);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/current-page.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved to tests/screenshots/current-page.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testLegislativeSimple();
