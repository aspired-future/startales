import { test, expect } from '@playwright/test';

test('Console Debug - Check for JavaScript errors', async ({ page }) => {
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });
  
  // Listen for page errors
  const pageErrors: string[] = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  // Navigate to the application
  await page.goto('http://localhost:5173');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for any delayed console messages
  await page.waitForTimeout(3000);
  
  // Log all console messages
  console.log('\n=== Console Messages ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  // Log any page errors
  console.log('\n=== Page Errors ===');
  pageErrors.forEach(error => console.log(error));
  
  // Check if React is loaded
  const reactLoaded = await page.evaluate(() => {
    return typeof window.React !== 'undefined' || 
           typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
  });
  console.log('\nReact loaded:', reactLoaded);
  
  // Check if there's a root element
  const rootElement = await page.locator('#root, #app, [data-reactroot]').count();
  console.log('Root elements found:', rootElement);
  
  // Check the HTML structure
  const html = await page.content();
  console.log('\n=== HTML Structure ===');
  console.log(html.substring(0, 1000));
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/console-debug.png', fullPage: true });
});

