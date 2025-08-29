import { chromium } from 'playwright';

async function debugPageLoading() {
  console.log('🔍 Debugging page loading...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log(`❌ Page error: ${error.message}`);
  });
  
  try {
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:5173/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForTimeout(10000);
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);
    
    // Check if React has loaded
    const reactLoaded = await page.evaluate(() => {
      return typeof window.React !== 'undefined' || document.querySelector('[data-reactroot]') !== null;
    });
    console.log(`⚛️ React loaded: ${reactLoaded}`);
    
    // Get page content
    const bodyText = await page.locator('body').textContent();
    console.log(`📝 Body text length: ${bodyText.length}`);
    console.log(`📝 First 200 chars: "${bodyText.substring(0, 200)}"`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/debug_page_loading.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: tests/screenshots/debug_page_loading.png');
    
    // Check for any visible elements
    const allElements = await page.locator('*').count();
    console.log(`🔍 Total elements on page: ${allElements}`);
    
    // Check for specific game elements
    const gameElements = await page.locator('div, button, nav, main, section').count();
    console.log(`🎮 Game-related elements: ${gameElements}`);
    
    // Wait to see the page
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugPageLoading().catch(console.error);
