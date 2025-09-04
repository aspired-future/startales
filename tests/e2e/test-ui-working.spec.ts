import { test, expect } from '@playwright/test';

test.describe('UI Working Test', () => {
  test('should verify the UI is working properly', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      console.log(`PAGE ERROR: ${error.message}`);
    });

    console.log('=== Testing restored UI ===');
    await page.goto('http://localhost:5173/');
    
    // Wait for React to render
    await page.waitForTimeout(5000);

    // Check basic page elements
    const title = await page.title();
    console.log(`Page title: ${title}`);
    expect(title).toBe('LIVELYGALAXY.AI');

    // Check if React root has content
    const rootContent = await page.locator('#root').innerHTML();
    console.log(`Root content length: ${rootContent.length}`);
    
    if (rootContent.length > 100) {
      console.log('✅ React app is rendering content');
    } else {
      console.log('❌ React app is not rendering properly');
    }

    // Look for UI elements
    const buttons = await page.locator('button').count();
    console.log(`Buttons found: ${buttons}`);

    const gameElements = await page.locator('[class*="game"], [class*="hud"], [class*="panel"]').count();
    console.log(`Game UI elements found: ${gameElements}`);

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/ui-working-test.png', fullPage: true });

    // Log any errors
    if (consoleErrors.length > 0) {
      console.log('Console errors found:');
      consoleErrors.forEach((error, index) => console.log(`  ${index + 1}. ${error}`));
    } else {
      console.log('✅ No console errors found');
    }

    // Basic functionality check
    expect(rootContent.length).toBeGreaterThan(100);
  });
});
