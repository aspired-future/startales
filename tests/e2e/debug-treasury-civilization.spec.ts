import { test, expect } from '@playwright/test';

test('Debug Treasury under Civilization', async ({ page }) => {
  // Navigate to the main page
  await page.goto('http://localhost:5173/');
  
  // Wait for basic page load
  await page.waitForTimeout(2000);
  
  // Click on Civilization
  const civilizationButton = page.locator('button:has-text("🏛️ Civilization"), a:has-text("🏛️ Civilization")').first();
  await expect(civilizationButton).toBeVisible();
  await civilizationButton.click();
  
  // Wait for navigation
  await page.waitForTimeout(2000);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-treasury-civilization.png' });
  
  // Look for Treasury under Civilization
  const treasuryElements = await page.locator('*:has-text("Treasury")').all();
  console.log('Found Treasury elements under Civilization:', treasuryElements.length);
  
  // Look for any buttons or links that might contain Treasury
  const allButtons = await page.locator('button, a').all();
  console.log('Total buttons/links under Civilization:', allButtons.length);
  
  for (let i = 0; i < Math.min(allButtons.length, 20); i++) {
    const text = await allButtons[i].textContent();
    console.log(`Button ${i}: "${text}"`);
  }
  
  // Look for economic or financial related buttons
  const financialButtons = await page.locator('*:has-text("Treasury"), *:has-text("Finance"), *:has-text("Economic"), *:has-text("Budget")').all();
  console.log('Found financial-related elements:', financialButtons.length);
  
  for (let i = 0; i < financialButtons.length; i++) {
    const text = await financialButtons[i].textContent();
    console.log(`Financial element ${i}: "${text}"`);
  }
});

