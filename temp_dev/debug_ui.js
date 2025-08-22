import { chromium } from 'playwright';

async function debugUI() {
  console.log('🔍 Debugging StarTales UI...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('🖥️  BROWSER:', msg.type(), msg.text());
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('📍 Navigating to http://localhost:5174');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
    
    // Wait for React to potentially load
    await page.waitForTimeout(3000);
    
    // Check what's actually in the root div
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        hasChildren: root?.hasChildNodes(),
        innerHTML: root?.innerHTML?.substring(0, 500),
        childrenCount: root?.children?.length || 0
      };
    });
    
    console.log('🔍 Root div analysis:', rootContent);
    
    // Check for any React errors
    const reactErrors = await page.evaluate(() => {
      return window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__?.errors || [];
    });
    
    console.log('⚛️  React errors:', reactErrors);
    
    // Check network requests
    const requests = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.waitForTimeout(2000);
    console.log('🌐 Network requests made:', requests.filter(url => url.includes('localhost')));
    
    console.log('⏳ Keeping browser open for 15 seconds for manual inspection...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Error debugging UI:', error);
  } finally {
    await browser.close();
  }
}

debugUI().catch(console.error);
