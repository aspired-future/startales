import { test, expect } from '@playwright/test';

test('Debug Console Errors', async ({ page }) => {
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
  
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Wait a bit for any JavaScript to load
  await page.waitForTimeout(3000);
  
  console.log('=== Console Messages ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  console.log('=== Page Errors ===');
  pageErrors.forEach(error => console.log(error));
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-console.png', fullPage: true });
  
  console.log('✅ Console debug complete - check screenshot at tests/screenshots/debug-console.png');
});

