import { test, expect } from '@playwright/test';

test('Simple Load Test', async ({ page }) => {
  console.log('🧪 Testing if app loads at all...');

  // Listen for console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Listen for page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);

    console.log('📝 Console errors:', consoleErrors);
    console.log('📝 Page errors:', pageErrors);

    // Check if main container loads
    const hudExists = await page.locator('.comprehensive-hud').count();
    console.log('🎮 HUD container found:', hudExists > 0);

    if (hudExists === 0) {
      // Take screenshot to see what's on the page
      await page.screenshot({ path: 'tests/screenshots/load-failure.png', fullPage: true });
      console.log('📸 Load failure screenshot saved');
    }

  } catch (error) {
    console.log('❌ Load error:', error.message);
    await page.screenshot({ path: 'tests/screenshots/load-error.png', fullPage: true });
  }
});
