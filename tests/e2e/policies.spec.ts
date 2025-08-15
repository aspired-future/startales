import { test, expect } from '@playwright/test';

test('Policies demo: create → activate → advisor ask', async ({ page }) => {
  await page.goto('/demo/policies');
  await page.fill('#title', 'Boost Research');
  await page.fill('#body', 'Increase research funding by 10%');
  await page.click('#create');
  await expect(page.locator('#out')).toContainText('suggestions');
  await page.click('#activate');
  await expect(page.locator('#out')).toContainText('modifiers');
  await page.click('#ask');
  await expect(page.locator('#adv')).toContainText('recommendations');
});

