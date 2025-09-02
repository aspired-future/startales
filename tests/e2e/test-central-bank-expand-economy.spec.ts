import { test, expect } from '@playwright/test';

test.describe('Central Bank Screen - Expand Economy Section', () => {
  test('Should access Central Bank screen by expanding Economy section', async ({ page }) => {
    // Navigate to the UI
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the HUD to load
    await page.waitForTimeout(3000);
    
    // Look for the Economy section (collapsed)
    const economySection = page.locator('text=💰ECONOMY▶');
    await expect(economySection).toBeVisible();
    
    // Click to expand the Economy section
    await economySection.click();
    await page.waitForTimeout(1000);
    
    // Now look for Central Bank in the expanded Economy section
    const centralBankButton = page.locator('text=Central Bank');
    await expect(centralBankButton).toBeVisible();
    
    // Click on Central Bank
    await centralBankButton.click();
    await page.waitForTimeout(2000);
    
    // Check for the screen title
    const title = page.locator('h2').filter({ hasText: 'Central Banking' });
    await expect(title).toBeVisible();
    
    // Check for economic theme
    const economicTheme = page.locator('.standard-screen-container.economic-theme');
    await expect(economicTheme).toBeVisible();
    
    // Check for standard panels
    const panels = page.locator('.standard-panel');
    await expect(panels).toHaveCount(3); // Overview, Financial Stability, Policy Analytics
    
    // Check for tabs (using button elements with tab text)
    const tabs = page.locator('button').filter({ hasText: /Overview|Policies|Stability|Research|Analytics/ });
    await expect(tabs).toHaveCount(5); // Overview, Policies, Stability, Research, Analytics
    
    // Check for specific content
    const policyRate = page.locator('text=Policy Rate');
    await expect(policyRate).toBeVisible();
    
    const independenceScore = page.locator('text=Independence Score');
    await expect(independenceScore).toBeVisible();
    
    // Check for charts
    const charts = page.locator('.chart-container');
    await expect(charts).toHaveCount(2); // Bar chart and pie chart
  });
});
