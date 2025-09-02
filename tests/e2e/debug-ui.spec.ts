import { test, expect } from '@playwright/test';

test('Debug UI Loading', async ({ page }) => {
  console.log('🔍 Starting UI debug test...');
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('📱 Console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'tests/screenshots/debug-ui.png' });
  
  // Get page content
  const content = await page.content();
  console.log('📄 Page content length:', content.length);
  
  // Check if there's any content
  if (content.length < 1000) {
    console.log('⚠️ Page appears to be empty or has minimal content');
  } else {
    console.log('✅ Page has substantial content');
  }
  
  console.log('🔍 Debug complete - check screenshot at tests/screenshots/debug-ui.png');
});
