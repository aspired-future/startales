import { test, expect } from '@playwright/test';

test.describe('Simple UI Debug Test', () => {
  test('Basic page load and error detection', async ({ page }) => {
    console.log('🔍 Testing basic page load...');
    
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`🚨 CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log(`🚨 PAGE ERROR: ${error.message}`);
    });

    // Navigate to the page
    await page.goto('http://localhost:5173/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'debug-simple-test.png', fullPage: true });
    
    // Check if page loaded
    const title = await page.title();
    console.log(`📄 Page Title: ${title}`);
    
    // Check for React root
    const reactRoot = await page.locator('#root').count();
    console.log(`⚛️ React Root Found: ${reactRoot > 0 ? 'YES' : 'NO'}`);
    
    // Check for visible content
    const visibleElements = await page.locator('*:visible').count();
    console.log(`👁️ Visible Elements: ${visibleElements}`);
    
    // Log any console errors found
    console.log(`🚨 Total Console Errors: ${consoleErrors.length}`);
    
    // Basic assertions
    expect(reactRoot).toBeGreaterThan(0);
    expect(visibleElements).toBeGreaterThan(5);
  });
});
