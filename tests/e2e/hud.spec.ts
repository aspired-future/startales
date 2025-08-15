import { test, expect } from '@playwright/test';

test('HUD step button updates KPIs and step counter', async ({ page }) => {
  await page.goto('/demo/hud', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#pLabel');
  const step = page.locator('#step');
  const stepCount = page.locator('#stepCount');
  const pLabel = page.locator('#pLabel');

  const before = await stepCount.textContent();
  await step.click();
  await expect(stepCount).not.toHaveText(before || '0');
  await expect(pLabel).toBeVisible();
  await expect(pLabel).toHaveText(/^[0-9]{1,3}$/);
});

