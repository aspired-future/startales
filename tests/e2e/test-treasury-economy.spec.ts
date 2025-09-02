import { test, expect } from '@playwright/test';

test('Treasury Screen - Economy Navigation', async ({ page }) => {
  // Navigate to the main page
  await page.goto('http://localhost:5173/');
  
  // Wait for basic page load
  await page.waitForTimeout(2000);
  
  // Look for Economy section and click on Treasury
  const economySection = page.locator('.system-category:has-text("💰 Economy")');
  await expect(economySection).toBeVisible();
  
  // Click on Treasury in the Economy section
  const treasuryButton = page.locator('.system-item:has-text("Treasury")');
  await expect(treasuryButton).toBeVisible();
  await treasuryButton.click();
  
  // Wait for the screen to load
  await page.waitForTimeout(2000);
  
  // Take a screenshot
  await page.screenshot({ path: 'treasury-economy-navigation.png' });
  
  // Check for the Treasury screen content
  await expect(page.locator('text=Treasury Management')).toBeVisible();
  
  // Check for economic theme
  const economicTheme = page.locator('.economic-theme');
  await expect(economicTheme).toBeVisible();
  
  // Check for the 5 tabs
  const tabs = ['Overview', 'Revenue', 'Budgets', 'Requests', 'Analytics'];
  for (const tab of tabs) {
    await expect(page.locator(`button:has-text("${tab}"), a:has-text("${tab}")`)).toBeVisible();
  }
  
  // Check for mock data
  await expect(page.locator('text=$8.5T')).toBeVisible(); // Total Budget
  await expect(page.locator('text=$7.2T')).toBeVisible(); // Total Spent
  await expect(page.locator('text=84.7%')).toBeVisible(); // Utilization
  
  // Check for gold accent color in headers
  const headers = page.locator('h3[style*="color: #fbbf24"]');
  await expect(headers).toHaveCount(5); // Should have 5 headers with gold color
  
  console.log('✅ Treasury screen loaded successfully through Economy navigation');
});

