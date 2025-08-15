import { test, expect } from '@playwright/test';

test('Trade demo: prices, add tariff, create contract, indices', async ({ page }) => {
  await page.goto('/demo/trade');
  await page.click('#loadPrices');
  await expect(page.locator('#prices')).toContainText('alloy');
  await page.click('#addTariff');
  await expect(page.locator('#prices')).toContainText('alloy');
  await page.click('#createContract');
  await expect(page.locator('#contracts')).toContainText('contracts');
  await page.click('#loadIdx');
  await expect(page.locator('#idx')).toContainText('priceIndex');
});

