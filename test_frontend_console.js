import { chromium } from 'playwright';

async function testFrontendConsole() {
  console.log('🔍 Checking frontend console...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });
  
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`📱 Console [${msg.type()}]: ${msg.text()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.error(`❌ Page error: ${error.message}`);
  });
  
  try {
    // Navigate to the frontend
    console.log('🌐 Navigating to frontend...');
    await page.goto('http://localhost:5173');
    
    // Wait for the page to load
    await page.waitForTimeout(5000);
    
    // Check if React is loaded
    const reactLoaded = await page.evaluate(() => {
      return typeof window.React !== 'undefined' || 
             typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
    });
    
    console.log('⚛️ React loaded:', reactLoaded);
    
    // Check for any JavaScript errors
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });
    
    if (errors.length > 0) {
      console.log('❌ JavaScript errors found:', errors);
    }
    
    // Try to find the root element
    const rootElement = await page.locator('#root').first();
    if (await rootElement.isVisible()) {
      console.log('✅ Root element found and visible');
      
      // Check what's inside the root
      const rootContent = await rootElement.innerHTML();
      console.log('📦 Root content length:', rootContent.length);
      console.log('📦 Root content (first 200 chars):', rootContent.substring(0, 200));
    } else {
      console.log('❌ Root element not found or not visible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testFrontendConsole();
