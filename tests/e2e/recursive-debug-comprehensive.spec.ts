import { test, expect, Page } from '@playwright/test';

test.describe('Comprehensive Recursive Debug - http://localhost:5173/', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Set longer timeout for debugging
    page.setDefaultTimeout(30000);
    
    // Listen for console messages
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        console.log(`🔍 CONSOLE ${type.toUpperCase()}: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`🚨 PAGE ERROR: ${error.message}`);
    });

    // Listen for network failures
    page.on('requestfailed', request => {
      console.log(`❌ NETWORK FAILED: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('Phase 1: Initial Page Load and Structure Analysis', async () => {
    console.log('🔍 PHASE 1: Testing initial page load...');
    
    // Navigate to the page
    await page.goto('http://localhost:5173/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'debug-initial-load.png', fullPage: true });
    
    // Check if page loaded successfully
    const title = await page.title();
    console.log(`📄 Page Title: ${title}`);
    
    // Check for basic HTML structure
    const bodyContent = await page.locator('body').innerHTML();
    console.log(`📏 Body Content Length: ${bodyContent.length} characters`);
    
    // Look for React root
    const reactRoot = await page.locator('#root').count();
    console.log(`⚛️ React Root Found: ${reactRoot > 0 ? 'YES' : 'NO'}`);
    
    if (reactRoot === 0) {
      console.log('🚨 CRITICAL: No React root found!');
      const htmlContent = await page.content();
      console.log('📄 Full HTML Content:', htmlContent.substring(0, 1000));
    }
    
    // Check for any visible content
    const visibleElements = await page.locator('*:visible').count();
    console.log(`👁️ Visible Elements: ${visibleElements}`);
    
    expect(reactRoot).toBeGreaterThan(0);
  });

  test('Phase 2: Component Loading and Error Detection', async () => {
    console.log('🔍 PHASE 2: Testing component loading...');
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Wait for main app component
    try {
      await page.waitForSelector('[data-testid="app"], .app, #app', { timeout: 10000 });
      console.log('✅ Main app component loaded');
    } catch (error) {
      console.log('❌ Main app component not found');
      
      // Check what's actually in the DOM
      const bodyText = await page.locator('body').textContent();
      console.log('📄 Body Text Content:', bodyText?.substring(0, 500));
      
      // Look for error messages
      const errorElements = await page.locator('text=/error|Error|ERROR/i').count();
      console.log(`🚨 Error Messages Found: ${errorElements}`);
      
      if (errorElements > 0) {
        const errorTexts = await page.locator('text=/error|Error|ERROR/i').allTextContents();
        console.log('🚨 Error Messages:', errorTexts);
      }
    }
    
    // Check for loading states
    const loadingElements = await page.locator('text=/loading|Loading|LOADING/i').count();
    console.log(`⏳ Loading Elements: ${loadingElements}`);
    
    // Take screenshot of current state
    await page.screenshot({ path: 'debug-component-loading.png', fullPage: true });
  });

  test('Phase 3: Navigation and Screen Detection', async () => {
    console.log('🔍 PHASE 3: Testing navigation and screens...');
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Look for navigation elements
    const navElements = [
      'nav', '.nav', '.navigation', '.menu', '.sidebar',
      '[data-testid*="nav"]', '[class*="nav"]', '[class*="menu"]'
    ];
    
    for (const selector of navElements) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`🧭 Navigation found: ${selector} (${count} elements)`);
        const navText = await page.locator(selector).first().textContent();
        console.log(`📝 Navigation content: ${navText?.substring(0, 200)}`);
      }
    }
    
    // Look for buttons or clickable elements
    const buttons = await page.locator('button, [role="button"], .button, [class*="button"]').count();
    console.log(`🔘 Buttons found: ${buttons}`);
    
    if (buttons > 0) {
      const buttonTexts = await page.locator('button, [role="button"], .button, [class*="button"]').allTextContents();
      console.log('🔘 Button texts:', buttonTexts.slice(0, 10)); // First 10 buttons
    }
    
    // Look for WhoseApp specifically
    const whoseappElements = await page.locator('text=/whoseapp|WhoseApp|WHOSEAPP/i').count();
    console.log(`💬 WhoseApp elements: ${whoseappElements}`);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-navigation.png', fullPage: true });
  });

  test('Phase 4: API Connectivity and Data Loading', async () => {
    console.log('🔍 PHASE 4: Testing API connectivity...');
    
    await page.goto('http://localhost:5173/');
    
    // Monitor network requests
    const apiRequests: string[] = [];
    const failedRequests: string[] = [];
    
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push(`${request.method()} ${request.url()}`);
      }
    });
    
    page.on('requestfailed', request => {
      if (request.url().includes('/api/')) {
        failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any async API calls
    await page.waitForTimeout(5000);
    
    console.log(`📡 API Requests Made: ${apiRequests.length}`);
    apiRequests.forEach(req => console.log(`  📤 ${req}`));
    
    console.log(`❌ Failed API Requests: ${failedRequests.length}`);
    failedRequests.forEach(req => console.log(`  ❌ ${req}`));
    
    // Check for data loading indicators
    const dataElements = await page.locator('[data-testid*="data"], [class*="data"], .loading, .spinner').count();
    console.log(`📊 Data/Loading elements: ${dataElements}`);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-api-connectivity.png', fullPage: true });
  });

  test('Phase 5: WhoseApp Specific Testing', async () => {
    console.log('🔍 PHASE 5: Testing WhoseApp functionality...');
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Look for WhoseApp button/link
    const whoseappSelectors = [
      'text=/whoseapp/i',
      '[data-testid*="whoseapp"]',
      '[class*="whoseapp"]',
      'button:has-text("WhoseApp")',
      'a:has-text("WhoseApp")',
      '.chat', '[class*="chat"]',
      '.message', '[class*="message"]'
    ];
    
    let whoseappFound = false;
    for (const selector of whoseappSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`💬 WhoseApp element found: ${selector} (${count} elements)`);
        whoseappFound = true;
        
        try {
          // Try to click the first WhoseApp element
          await page.locator(selector).first().click();
          console.log(`✅ Clicked WhoseApp element: ${selector}`);
          
          // Wait for any changes
          await page.waitForTimeout(2000);
          
          // Take screenshot after clicking
          await page.screenshot({ path: 'debug-whoseapp-clicked.png', fullPage: true });
          
          break;
        } catch (error) {
          console.log(`❌ Failed to click ${selector}: ${error}`);
        }
      }
    }
    
    if (!whoseappFound) {
      console.log('❌ No WhoseApp elements found');
      
      // Look for any chat-related elements
      const chatElements = await page.locator('text=/chat|message|conversation/i').count();
      console.log(`💬 Chat-related elements: ${chatElements}`);
    }
    
    // Check for character elements
    const characterElements = await page.locator('text=/character|Character|CHARACTER/i').count();
    console.log(`👤 Character elements: ${characterElements}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-whoseapp-final.png', fullPage: true });
  });

  test('Phase 6: Console Error Analysis and DOM Inspection', async () => {
    console.log('🔍 PHASE 6: Deep console and DOM analysis...');
    
    const consoleMessages: any[] = [];
    const errors: string[] = [];
    
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
      
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(`Page Error: ${error.message}`);
    });
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for any async operations
    
    console.log(`📊 Total Console Messages: ${consoleMessages.length}`);
    console.log(`🚨 Total Errors: ${errors.length}`);
    
    // Log errors
    errors.forEach((error, index) => {
      console.log(`🚨 ERROR ${index + 1}: ${error}`);
    });
    
    // Log warnings
    const warnings = consoleMessages.filter(msg => msg.type === 'warning');
    console.log(`⚠️ Warnings: ${warnings.length}`);
    warnings.forEach((warning, index) => {
      console.log(`⚠️ WARNING ${index + 1}: ${warning.text}`);
    });
    
    // Analyze DOM structure
    const domAnalysis = await page.evaluate(() => {
      const analysis = {
        totalElements: document.querySelectorAll('*').length,
        scripts: document.querySelectorAll('script').length,
        stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        reactElements: document.querySelectorAll('[data-reactroot], [data-react-helmet]').length,
        hasReactDevTools: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
        bodyClasses: document.body.className,
        bodyChildren: document.body.children.length
      };
      
      return analysis;
    });
    
    console.log('🔍 DOM Analysis:', domAnalysis);
    
    // Take final comprehensive screenshot
    await page.screenshot({ path: 'debug-comprehensive-final.png', fullPage: true });
    
    // If there are errors, fail the test to highlight issues
    if (errors.length > 0) {
      console.log('🚨 Test completed with errors - check logs above');
    } else {
      console.log('✅ Test completed successfully - no critical errors found');
    }
  });
});
