import { chromium } from 'playwright';

async function manualHealthCheck() {
  console.log('🔍 Opening browser for manual Health screen inspection...');
  
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
    
    console.log('🔍 Manual inspection instructions:');
    console.log('1. Click "🏛️ Civilization" button');
    console.log('2. Click "👥" (Population) accordion header');
    console.log('3. Click "🏥 Health & Welfare" button');
    console.log('4. Check browser console for any errors');
    console.log('5. Check if a popup opens');
    console.log('6. Look for any error messages on the page');
    
    // Keep the browser open for manual inspection
    console.log('🔍 Browser will stay open for manual inspection. Close it when done.');
    
    // Wait indefinitely (or until manually closed)
    await new Promise(() => {}); // This will keep the script running
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
}

manualHealthCheck().catch(console.error);

