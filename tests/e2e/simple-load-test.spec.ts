import { test, expect } from '@playwright/test';

test('Simple Load Test - Check if UI loads', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Wait for basic page load
  await page.waitForLoadState('domcontentloaded');
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/simple-load-test.png', fullPage: true });
  
  // Check if React is loaded
  const reactLoaded = await page.evaluate(() => {
    return typeof window.React !== 'undefined' || document.querySelector('#root') !== null;
  });
  
  console.log('React loaded:', reactLoaded);
  
  // Check for any console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Wait a bit for any console messages
  await page.waitForTimeout(2000);
  
  console.log('Console errors found:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }
  
  // Basic assertion - page should load
  expect(reactLoaded).toBe(true);
});

