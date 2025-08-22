import { chromium } from 'playwright';

async function debugBlankScreen() {
  console.log('🔍 Debugging Blank Screen Issue...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Listen for all console messages
  page.on('console', msg => {
    console.log(`🖥️  BROWSER ${msg.type().toUpperCase()}:`, msg.text());
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  // Listen for network requests
  page.on('request', request => {
    console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
  });
  
  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      console.log(`❌ FAILED REQUEST: ${status} ${url}`);
    } else if (url.includes('/api/')) {
      console.log(`✅ API REQUEST: ${status} ${url}`);
    }
  });
  
  try {
    console.log('📍 Loading StarTales UI...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit for any async loading
    await page.waitForTimeout(3000);
    
    // Check what's actually on the page
    const bodyContent = await page.evaluate(() => {
      return {
        hasBody: !!document.body,
        bodyHTML: document.body?.innerHTML?.substring(0, 500) || 'No body',
        title: document.title,
        rootElement: !!document.getElementById('root'),
        rootContent: document.getElementById('root')?.innerHTML?.substring(0, 200) || 'No root content',
        scripts: Array.from(document.scripts).map(s => s.src).filter(s => s),
        errors: window.console?.errors || []
      };
    });
    
    console.log('\\n📄 Page Analysis:');
    console.log('- Title:', bodyContent.title);
    console.log('- Has body:', bodyContent.hasBody);
    console.log('- Has root element:', bodyContent.rootElement);
    console.log('- Root content preview:', bodyContent.rootContent);
    console.log('- Scripts loaded:', bodyContent.scripts.length);
    
    if (bodyContent.scripts.length > 0) {
      console.log('- Script URLs:', bodyContent.scripts.slice(0, 3));
    }
    
    // Check for React app
    const reactApp = await page.locator('.comprehensive-hud').isVisible().catch(() => false);
    console.log('- React app loaded:', reactApp);
    
    if (!reactApp) {
      // Check for any visible content
      const visibleText = await page.evaluate(() => {
        return document.body?.innerText?.substring(0, 200) || 'No visible text';
      });
      console.log('- Visible text:', visibleText);
      
      // Check for loading indicators
      const loadingElements = await page.locator('.loading, .spinner, [class*="load"]').count();
      console.log('- Loading elements:', loadingElements);
    }
    
    // Test API connectivity from browser
    console.log('\\n🔗 Testing API from Browser...');
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/health');
        return {
          ok: response.ok,
          status: response.status,
          data: await response.text()
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    });
    
    console.log('- API test result:', apiTest);
    
    // Take screenshot
    await page.screenshot({ path: 'temp_dev/blank_screen_debug.png', fullPage: true });
    console.log('\\n📸 Screenshot saved to temp_dev/blank_screen_debug.png');
    
    // Wait a bit more to see if anything loads
    console.log('\\n⏳ Waiting 10 seconds for any delayed loading...');
    await page.waitForTimeout(10000);
    
    const finalCheck = await page.locator('.comprehensive-hud').isVisible().catch(() => false);
    console.log('- Final React app check:', finalCheck);
    
    if (finalCheck) {
      console.log('✅ App loaded successfully after delay!');
    } else {
      console.log('❌ App still not loaded - there may be a JavaScript error');
      
      // Get any JavaScript errors
      const jsErrors = await page.evaluate(() => {
        return window.console?.errors || [];
      });
      
      if (jsErrors.length > 0) {
        console.log('- JavaScript errors found:', jsErrors);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    await page.screenshot({ path: 'temp_dev/debug_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

debugBlankScreen().catch(console.error);
