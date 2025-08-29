import { chromium } from 'playwright';

async function debugWhoseAppUI() {
  console.log('🔍 Debugging WhoseApp UI...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5173/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    await page.waitForTimeout(5000);
    
    // Take screenshot of the main page
    await page.screenshot({ 
      path: 'tests/screenshots/debug_main_page.png', 
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved: tests/screenshots/debug_main_page.png');
    
    // Look for any buttons or links that might lead to WhoseApp
    const allButtons = await page.locator('button, a, [role="button"]').all();
    console.log(`🔍 Found ${allButtons.length} clickable elements`);
    
    for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
      const text = await allButtons[i].textContent();
      console.log(`  ${i + 1}. "${text}"`);
    }
    
    // Look for text containing "whose" or "app"
    const whoseAppElements = await page.locator('text=/whose|app|WhoseApp/i').all();
    console.log(`🔍 Found ${whoseAppElements.length} elements containing "whose" or "app"`);
    
    for (let i = 0; i < whoseAppElements.length; i++) {
      const text = await whoseAppElements[i].textContent();
      console.log(`  WhoseApp element ${i + 1}: "${text}"`);
    }
    
    // Check if there's a navigation menu
    const navElements = await page.locator('nav, [role="navigation"], .menu, .nav').all();
    console.log(`🔍 Found ${navElements.length} navigation elements`);
    
    // Wait a bit to see the page
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugWhoseAppUI().catch(console.error);