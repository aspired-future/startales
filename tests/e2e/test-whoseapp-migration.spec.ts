import { test, expect } from '@playwright/test';

test.describe('WhoseApp Migration Test', () => {
  test('should verify WhoseApp uses new design system', async ({ page }) => {
    console.log('=== Testing WhoseApp Migration ===');

    // Navigate to the application
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Wait for React app to load
    await page.waitForSelector('div', { timeout: 10000 });

    // First, find all buttons to see what's available
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} buttons on the page`);

    // Log all button texts
    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const buttonText = await allButtons.nth(i).textContent();
      console.log(`Button ${i}: "${buttonText}"`);
    }

    // Look for command center or navigation first
    const commandCenterButton = page.locator('button').filter({ hasText: 'Command Center' });
    if (await commandCenterButton.count() > 0) {
      console.log('Found Command Center button, clicking...');
      await commandCenterButton.click();

      // Wait a moment for the panel to open
      await page.waitForTimeout(1000);

      // Now look for WhoseApp tab
      const whoseAppTab = page.locator('button').filter({ hasText: 'WhoseApp' });
      await expect(whoseAppTab).toBeVisible();
      await whoseAppTab.click();
    } else {
      // Try to find any WhoseApp button
      const whoseAppButtons = page.locator('button').filter({ hasText: /WhoseApp/ });
      if (await whoseAppButtons.count() > 0) {
        console.log('Found WhoseApp button, clicking...');
        await whoseAppButtons.first().click();
      } else {
        throw new Error('No WhoseApp button found');
      }
    }

    // Wait for WhoseApp modal to appear
    await page.waitForSelector('.quick-action-overlay', { timeout: 5000 });

    // Verify the new design system elements
    const modal = page.locator('.quick-action-modal-basescreen');
    await expect(modal).toBeVisible();

    // Check for social theme
    await expect(modal).toHaveClass(/social-theme/);

    // Check for standard panels
    const panels = modal.locator('.standard-panel');
    await expect(panels.first()).toBeVisible();

    // Check for tabs
    const tabs = modal.locator('.base-screen-tabs .base-screen-tab');
    await expect(tabs.first()).toBeVisible();

    // Check for standard buttons
    const buttons = modal.locator('.standard-btn');
    await expect(buttons.first()).toBeVisible();

    // Check for standard data tables
    const tables = modal.locator('.standard-data-table');
    if (await tables.count() > 0) {
      await expect(tables.first()).toBeVisible();
    }

    console.log('✅ WhoseApp successfully migrated to new design system');
    console.log('✅ Social theme applied');
    console.log('✅ Standard panels present');
    console.log('✅ Tabs working');
    console.log('✅ Standard buttons present');
    console.log('✅ Design system migration successful');
  });
});
