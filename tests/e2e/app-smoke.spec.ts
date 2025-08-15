import { test, expect } from '@playwright/test';

test('Demo HUD page renders', async ({ page }) => {
  await page.goto('/demo/hud');
  await expect(page.getByRole('heading', { name: 'Simulation HUD' })).toBeVisible();
});

